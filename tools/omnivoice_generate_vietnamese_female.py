#!/usr/bin/env python
"""Generate Vietnamese TTS with the workspace's fixed OmniVoice preset."""

from __future__ import annotations

import argparse
import difflib
import hashlib
import json
import math
import random
import re
import sys
from pathlib import Path

import numpy as np
import soundfile as sf
import torch


WORKSPACE = Path(__file__).resolve().parents[1]
DEFAULT_PRESET = WORKSPACE / "voice-presets" / "uyen_voice_clone.json"
DEFAULT_PRONUNCIATION_MAP = WORKSPACE / "voice-presets" / "vietnamese_pronunciation_map.json"
OMNIVOICE_REPO = WORKSPACE / "OmniVoice"


def load_preset(path: Path) -> dict:
    with path.open("r", encoding="utf-8") as f:
        return json.load(f)


def set_seed(seed: int) -> None:
    random.seed(seed)
    np.random.seed(seed)
    torch.manual_seed(seed)
    if torch.cuda.is_available():
        torch.cuda.manual_seed_all(seed)


def best_device() -> str:
    if torch.cuda.is_available():
        return "cuda:0"
    if getattr(torch.backends, "mps", None) and torch.backends.mps.is_available():
        return "mps"
    return "cpu"


def normalize_vietnamese_tts_script(text: str, pronunciation_map: dict[str, str]) -> str:
    """Normalize script for Vietnamese TTS while preserving sentence order."""
    normalized = text.replace("\r\n", "\n").replace("\r", "\n")
    normalized = normalized.replace("…", "...")
    for source, replacement in sorted(pronunciation_map.items(), key=lambda item: len(item[0]), reverse=True):
        normalized = re.sub(re.escape(source), replacement, normalized)
    normalized = re.sub(r"\b(\d+),(\d+)\s*triệu\s*đồng\s*một\s*lượng\b", r"\1 phẩy \2 triệu đồng một lượng", normalized, flags=re.IGNORECASE)
    normalized = re.sub(r"\b(\d+),(\d+)\b", r"\1 phẩy \2", normalized)
    normalized = re.sub(r"[ \t]+", " ", normalized)
    normalized = "\n".join(line.strip() for line in normalized.split("\n"))
    normalized = re.sub(r"\n{3,}", "\n\n", normalized).strip()
    return normalized


def comparable_text(text: str) -> str:
    text = text.lower()
    text = re.sub(r"[^\w\sàáảãạăắằẳẵặâấầẩẫậèéẻẽẹêếềểễệìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵđ]", " ", text)
    return re.sub(r"\s+", " ", text).strip()


def token_recall(expected: str, actual: str) -> tuple[float, list[str]]:
    expected_tokens = [
        token for token in comparable_text(expected).split()
        if len(token) > 2 and not token.isdigit()
    ]
    actual_tokens = set(comparable_text(actual).split())
    if not expected_tokens:
        return 1.0, []
    missing = [token for token in expected_tokens if token not in actual_tokens]
    return 1.0 - (len(missing) / len(expected_tokens)), missing[:30]


def audio_db_threshold(audio: np.ndarray, floor_db: float = -52.0) -> float:
    peak = float(np.max(np.abs(audio))) if audio.size else 0.0
    if peak <= 0:
        return floor_db
    peak_db = 20.0 * math.log10(max(peak, 1e-9))
    return max(floor_db, peak_db - 42.0)


def nonsilent_intervals(audio: np.ndarray, sample_rate: int, frame_ms: float = 20.0) -> list[tuple[int, int]]:
    if audio.size == 0:
        return []
    frame = max(1, int(sample_rate * frame_ms / 1000.0))
    threshold_db = audio_db_threshold(audio)
    intervals = []
    active_start = None
    for start in range(0, len(audio), frame):
        chunk = audio[start : start + frame]
        rms = float(np.sqrt(np.mean(chunk**2))) if chunk.size else 0.0
        db = 20.0 * math.log10(max(rms, 1e-9))
        is_active = db >= threshold_db
        if is_active and active_start is None:
            active_start = start
        if not is_active and active_start is not None:
            intervals.append((active_start, start))
            active_start = None
    if active_start is not None:
        intervals.append((active_start, len(audio)))
    merged = []
    bridge = int(0.18 * sample_rate)
    for start, end in intervals:
        if not merged or start - merged[-1][1] > bridge:
            merged.append((start, end))
        else:
            merged[-1] = (merged[-1][0], end)
    return merged


def measure_silence(audio: np.ndarray, sample_rate: int) -> dict[str, float]:
    intervals = nonsilent_intervals(audio, sample_rate)
    if not intervals:
        return {"silenceAtStart": len(audio) / sample_rate if sample_rate else 0.0, "silenceAtEnd": 0.0, "maxInternalSilence": 0.0}
    leading = intervals[0][0] / sample_rate
    trailing = (len(audio) - intervals[-1][1]) / sample_rate
    max_gap = 0.0
    for (_, end), (next_start, _) in zip(intervals, intervals[1:]):
        max_gap = max(max_gap, (next_start - end) / sample_rate)
    return {"silenceAtStart": leading, "silenceAtEnd": trailing, "maxInternalSilence": max_gap}


def trim_edges(audio: np.ndarray, sample_rate: int, keep_start: float, keep_end: float) -> np.ndarray:
    intervals = nonsilent_intervals(audio, sample_rate)
    if not intervals:
        return audio
    start = max(0, intervals[0][0] - int(keep_start * sample_rate))
    end = min(len(audio), intervals[-1][1] + int(keep_end * sample_rate))
    return audio[start:end]


def compress_internal_silence(audio: np.ndarray, sample_rate: int, max_silence: float, target_silence: float) -> np.ndarray:
    intervals = nonsilent_intervals(audio, sample_rate)
    if len(intervals) < 2:
        return audio
    pieces = [audio[intervals[0][0] : intervals[0][1]]]
    max_gap_samples = int(max_silence * sample_rate)
    target_gap_samples = int(target_silence * sample_rate)
    for prev, current in zip(intervals, intervals[1:]):
        gap_audio = audio[prev[1] : current[0]]
        if len(gap_audio) > max_gap_samples:
            center = len(gap_audio) // 2
            half = target_gap_samples // 2
            gap_audio = gap_audio[max(0, center - half) : min(len(gap_audio), center + half)]
        pieces.append(gap_audio)
        pieces.append(audio[current[0] : current[1]])
    return np.concatenate(pieces).astype(np.float32)


def soften_voice(audio: np.ndarray, sample_rate: int) -> np.ndarray:
    try:
        from scipy.signal import butter, sosfiltfilt
    except Exception:
        return audio

    if audio.size < sample_rate // 4:
        return audio
    nyquist = sample_rate / 2.0
    lowpass = butter(2, 8200 / nyquist, btype="lowpass", output="sos")
    softened = sosfiltfilt(lowpass, audio).astype(np.float32)
    low_mid = butter(2, [180 / nyquist, 350 / nyquist], btype="bandpass", output="sos")
    body = sosfiltfilt(low_mid, audio).astype(np.float32)
    softened = softened + 0.08 * body
    peak = float(np.max(np.abs(softened))) if softened.size else 0.0
    if peak > 0.98:
        softened = softened / peak * 0.98
    return softened.astype(np.float32)


def pitch_shift_percent(audio: np.ndarray, sample_rate: int, percent: float) -> np.ndarray:
    if abs(percent) < 0.001:
        return audio
    try:
        import librosa
    except Exception:
        return audio
    semitones = 12.0 * math.log2(max(0.01, 1.0 + percent / 100.0))
    shifted = librosa.effects.pitch_shift(y=audio.astype(np.float32), sr=sample_rate, n_steps=semitones)
    return shifted.astype(np.float32)


def normalize_peak(audio: np.ndarray, peak_target: float = 0.92) -> np.ndarray:
    peak = float(np.max(np.abs(audio))) if audio.size else 0.0
    if peak <= 0:
        return audio
    return (audio / peak * peak_target).astype(np.float32)


def pad_edges(audio: np.ndarray, sample_rate: int, start_silence: float, end_silence: float) -> np.ndarray:
    start = np.zeros(max(0, int(start_silence * sample_rate)), dtype=np.float32)
    end = np.zeros(max(0, int(end_silence * sample_rate)), dtype=np.float32)
    return np.concatenate([start, audio, end]).astype(np.float32)


def estimate_median_f0(audio_path: str | Path) -> float | None:
    try:
        import librosa
        audio, sample_rate = librosa.load(str(audio_path), sr=24000, mono=True)
        f0, _, _ = librosa.pyin(audio, fmin=librosa.note_to_hz("C2"), fmax=librosa.note_to_hz("C7"), sr=sample_rate)
        values = f0[np.isfinite(f0)]
        if len(values) == 0:
            return None
        return float(np.median(values))
    except Exception:
        return None


def transcribe_audio_safely(model, audio: np.ndarray, sample_rate: int) -> str:
    """Transcribe audio, splitting long files to avoid Whisper long-form timestamp errors."""
    max_seconds = 25.0
    if len(audio) / sample_rate <= max_seconds:
        return model.transcribe((audio, sample_rate))
    chunk_samples = int(max_seconds * sample_rate)
    parts = []
    for start in range(0, len(audio), chunk_samples):
        chunk = audio[start : start + chunk_samples]
        if len(chunk) < int(0.5 * sample_rate):
            continue
        parts.append(model.transcribe((chunk, sample_rate)))
    return " ".join(part.strip() for part in parts if part.strip())


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Generate audio using the fixed Vietnamese female OmniVoice preset."
    )
    text_group = parser.add_mutually_exclusive_group(required=True)
    text_group.add_argument("--text", help="Vietnamese text to synthesize.")
    text_group.add_argument(
        "--script-file",
        help="UTF-8 finalVoiceScript file. The file contents are sent verbatim to OmniVoice.",
    )
    parser.add_argument("--output", required=True, help="Output WAV path.")
    parser.add_argument("--preset", default=str(DEFAULT_PRESET), help="Preset JSON path.")
    parser.add_argument("--device", default=None, help="Override device, e.g. cuda:0 or cpu.")
    parser.add_argument("--duration", type=float, default=None, help="Optional fixed duration.")
    parser.add_argument("--speed", type=float, default=None, help="Optional speed override.")
    parser.add_argument("--ref-audio", default=None, help="Optional reference WAV for voice cloning.")
    parser.add_argument("--ref-text", default=None, help="Optional transcript for the reference WAV.")
    parser.add_argument("--ref-text-file", default=None, help="UTF-8 transcript file for the reference WAV.")
    parser.add_argument("--normalize-vietnamese", action="store_true", help="Normalize finalVoiceScript for Vietnamese TTS before sending.")
    parser.add_argument("--pronunciation-map", default=str(DEFAULT_PRONUNCIATION_MAP), help="JSON pronunciation map used by --normalize-vietnamese.")
    parser.add_argument("--split-lines", action="store_true", help="Generate each non-empty script line separately, then concatenate.")
    parser.add_argument("--line-gap-seconds", type=float, default=0.22, help="Silence gap between split-line generations.")
    parser.add_argument(
        "--omit-ref-text-in-generation",
        action="store_true",
        help="Use ref_text to build the clone prompt, then remove it from target text conditioning to avoid reference-text leakage.",
    )
    parser.add_argument("--no-postprocess-output", action="store_true", help="Disable output silence trimming/postprocess.")
    parser.add_argument("--no-denoise", action="store_true", help="Disable OmniVoice denoise token.")
    parser.add_argument("--preprocess-prompt", choices=["true", "false"], default=None, help="Override prompt preprocessing.")
    parser.add_argument("--guidance-scale", type=float, default=None, help="Override guidance_scale.")
    parser.add_argument("--num-step", type=int, default=None, help="Override num_step.")
    parser.add_argument("--no-instruct", action="store_true", help="Do not pass voice-design instruct when cloning.")
    parser.add_argument("--instruct", default=None, help="Override voice-design instruct.")
    parser.add_argument("--original-input", default="", help="Original user/news input for audit logs.")
    parser.add_argument("--log-json", default=None, help="Write an exact-script voice audit log.")
    parser.add_argument("--asr-check", action="store_true", help="Transcribe generated audio after synthesis and store transcriptAfterGeneration in the log.")
    parser.add_argument("--min-transcript-similarity", type=float, default=0.82, help="Warning threshold for ASR transcript similarity.")
    parser.add_argument("--clean-output", action="store_true", help="Trim/soften generated voice output and compress abnormal pauses.")
    parser.add_argument("--keep-start-silence", type=float, default=0.45, help="Leading silence to keep when --clean-output is enabled.")
    parser.add_argument("--keep-end-silence", type=float, default=0.3, help="Trailing silence to keep when --clean-output is enabled.")
    parser.add_argument("--force-start-silence", type=float, default=0.38, help="Digital leading silence inserted after cleanup.")
    parser.add_argument("--force-end-silence", type=float, default=0.25, help="Digital trailing silence inserted after cleanup.")
    parser.add_argument("--max-internal-silence", type=float, default=1.2, help="Maximum internal silence before compression.")
    parser.add_argument("--target-internal-silence", type=float, default=0.55, help="Target silence length when compressing long internal pauses.")
    parser.add_argument("--pitch-shift-percent", type=float, default=0.0, help="Optional pitch shift percentage after synthesis. Negative values lower pitch.")
    parser.add_argument("--bad-clone-path", default="", help="Known bad clone path for audit comparison only.")
    parser.add_argument(
        "--requested-language",
        default="vi-VN",
        help="Requested locale to record in logs. OmniVoice currently uses preset language if vi-VN is unsupported.",
    )
    parser.add_argument(
        "--exact-mode",
        action="store_true",
        help="Fail if finalVoiceScript and sentToOmniScript differ. No rewrite/summarize step is performed.",
    )
    args = parser.parse_args()

    if args.script_file:
        final_voice_script = Path(args.script_file).read_text(encoding="utf-8")
    else:
        final_voice_script = args.text or ""

    original_script_before_normalization = final_voice_script
    pronunciation_map = {}
    if args.normalize_vietnamese:
        pronunciation_map_path = Path(args.pronunciation_map)
        if pronunciation_map_path.exists():
            pronunciation_map = load_preset(pronunciation_map_path)
        final_voice_script = normalize_vietnamese_tts_script(final_voice_script, pronunciation_map)

    sent_to_omni_script = final_voice_script
    if args.exact_mode and final_voice_script != sent_to_omni_script:
        raise RuntimeError("finalVoiceScript differs from sentToOmniScript; refusing to generate voice.")

    if OMNIVOICE_REPO.exists():
        sys.path.insert(0, str(OMNIVOICE_REPO))

    from omnivoice import OmniVoice
    from omnivoice.utils.duration import RuleDurationEstimator

    preset = load_preset(Path(args.preset))
    seed = int(preset["seed"])
    set_seed(seed)

    generation = dict(preset["generation"])
    if args.duration is not None:
        generation["duration"] = args.duration
    if args.speed is not None:
        generation["speed"] = args.speed
    if args.no_postprocess_output:
        generation["postprocess_output"] = False
    if args.no_denoise:
        generation["denoise"] = False
    if args.preprocess_prompt is not None:
        generation["preprocess_prompt"] = args.preprocess_prompt == "true"
    if args.guidance_scale is not None:
        generation["guidance_scale"] = args.guidance_scale
    if args.num_step is not None:
        generation["num_step"] = args.num_step

    effective_ref_audio = args.ref_audio or preset.get("preferred_ref_audio")
    effective_ref_text_file = args.ref_text_file or preset.get("ref_text_file")
    ref_text = args.ref_text
    if effective_ref_text_file:
        ref_text = Path(effective_ref_text_file).read_text(encoding="utf-8")

    device = args.device or best_device()
    dtype = torch.float16 if device != "cpu" else torch.float32

    model = OmniVoice.from_pretrained(
        preset["model"],
        device_map=device,
        dtype=dtype,
    )

    instruct = None if args.no_instruct else (args.instruct if args.instruct is not None else preset.get("instruct"))
    generation_segments = []

    if args.split_lines:
        lines = [line.strip() for line in sent_to_omni_script.splitlines() if line.strip()]
        if not lines:
            lines = [sent_to_omni_script.strip()]
        voice_clone_prompt = None
        duration_estimator = RuleDurationEstimator()
        ref_duration_seconds = None
        if effective_ref_audio:
            voice_clone_prompt = model.create_voice_clone_prompt(
                ref_audio=effective_ref_audio,
                ref_text=ref_text,
                preprocess_prompt=generation.get("preprocess_prompt", True),
            )
            ref_audio_data, ref_audio_sr = sf.read(effective_ref_audio)
            ref_duration_seconds = float(len(ref_audio_data) / ref_audio_sr)
            if args.omit_ref_text_in_generation:
                voice_clone_prompt.ref_text = ""
        pieces = []
        gap = np.zeros(int(args.line_gap_seconds * int(preset["sampling_rate"])), dtype=np.float32)
        for index, line in enumerate(lines):
            segment_generation = dict(generation)
            if (
                args.omit_ref_text_in_generation
                and args.duration is None
                and ref_text
                and ref_duration_seconds
            ):
                line_seconds = duration_estimator.estimate_duration(
                    line,
                    ref_text,
                    ref_duration_seconds,
                    low_threshold=None,
                )
                speed = float(segment_generation.get("speed") or 1.0)
                if speed > 0:
                    line_seconds = line_seconds / speed
                segment_generation["duration"] = max(1.6, min(9.0, float(line_seconds)))
            segment_audio = model.generate(
                text=line,
                language=preset["language"],
                instruct=instruct,
                voice_clone_prompt=voice_clone_prompt,
                **segment_generation,
            )[0]
            pieces.append(segment_audio)
            generation_segments.append(
                {
                    "index": index,
                    "text": line,
                    "duration": float(len(segment_audio) / int(preset["sampling_rate"])),
                    "requestedDuration": segment_generation.get("duration"),
                }
            )
            if index != len(lines) - 1 and len(gap) > 0:
                pieces.append(gap)
        audio = [np.concatenate(pieces) if pieces else np.array([], dtype=np.float32)]
    else:
        audio = model.generate(
            text=sent_to_omni_script,
            language=preset["language"],
            instruct=instruct,
            ref_audio=effective_ref_audio,
            ref_text=ref_text,
            **generation,
        )

    sample_rate = int(preset["sampling_rate"])
    raw_audio = np.asarray(audio[0], dtype=np.float32)
    pre_cleanup_metrics = measure_silence(raw_audio, sample_rate)
    processed_audio = raw_audio
    postprocess_steps = []
    if args.clean_output:
        processed_audio = trim_edges(processed_audio, sample_rate, args.keep_start_silence, args.keep_end_silence)
        postprocess_steps.append("trim_edges")
        processed_audio = compress_internal_silence(
            processed_audio,
            sample_rate,
            max_silence=args.max_internal_silence,
            target_silence=args.target_internal_silence,
        )
        postprocess_steps.append("compress_internal_silence")
        processed_audio = soften_voice(processed_audio, sample_rate)
        postprocess_steps.append("soften_voice")
        processed_audio = pitch_shift_percent(processed_audio, sample_rate, args.pitch_shift_percent)
        if abs(args.pitch_shift_percent) >= 0.001:
            postprocess_steps.append(f"pitch_shift_percent:{args.pitch_shift_percent}")
        processed_audio = normalize_peak(processed_audio)
        postprocess_steps.append("normalize_peak")
        processed_audio = pad_edges(processed_audio, sample_rate, args.force_start_silence, args.force_end_silence)
        postprocess_steps.append("pad_edges")
    post_cleanup_metrics = measure_silence(processed_audio, sample_rate)

    output = Path(args.output)
    output.parent.mkdir(parents=True, exist_ok=True)
    sf.write(output, processed_audio, sample_rate)
    duration_seconds = float(len(processed_audio) / sample_rate)

    transcript_after_generation = None
    transcript_similarity = None
    transcript_token_recall = None
    missing_transcript_tokens = []
    asr_warning = None
    if args.asr_check:
        model.load_asr_model()
        transcript_after_generation = transcribe_audio_safely(model, processed_audio, sample_rate)
        transcript_similarity = difflib.SequenceMatcher(
            None,
            comparable_text(sent_to_omni_script),
            comparable_text(transcript_after_generation),
        ).ratio()
        transcript_token_recall, missing_transcript_tokens = token_recall(
            sent_to_omni_script,
            transcript_after_generation,
        )
        if transcript_similarity < args.min_transcript_similarity or transcript_token_recall < 0.86:
            asr_warning = (
                "Generated audio transcript differs from sentToOmniScript. "
                "Retry with clearer Vietnamese normalization, shorter lines, or another voice provider."
            )

    if args.log_json:
        log_path = Path(args.log_json)
        log_path.parent.mkdir(parents=True, exist_ok=True)
        log = {
            "originalInput": args.original_input,
            "originalScriptBeforeNormalization": original_script_before_normalization,
            "finalVoiceScript": final_voice_script,
            "sentToOmniScript": sent_to_omni_script,
            "scriptIntegrity": {
                "matches": final_voice_script == sent_to_omni_script,
                "sha256": hashlib.sha256(sent_to_omni_script.encode("utf-8")).hexdigest(),
                "characterCount": len(sent_to_omni_script),
                "lineCount": sent_to_omni_script.count("\n") + 1 if sent_to_omni_script else 0,
            },
            "generatedAudioPath": str(output.resolve()),
            "referenceAudioPath": preset.get("source_audio") or effective_ref_audio,
            "cloneReferenceAudioPath": effective_ref_audio,
            "voiceCloneId": preset["voice_id"],
            "duration": duration_seconds,
            "preCleanupAudioMetrics": pre_cleanup_metrics,
            "postCleanupAudioMetrics": post_cleanup_metrics,
            "postprocessSteps": postprocess_steps,
            "badClonePath": args.bad_clone_path,
            "referenceAnalysisAudioPath": preset.get("source_analysis_audio") or preset.get("source_audio"),
            "referenceMedianF0": estimate_median_f0(preset.get("source_analysis_audio") or preset.get("source_audio")) if (preset.get("source_analysis_audio") or preset.get("source_audio")) else None,
            "generatedMedianF0": estimate_median_f0(output),
            "providerTranscript": transcript_after_generation,
            "providerTranscriptNote": "providerTranscript is transcriptAfterGeneration from local ASR when --asr-check is enabled; no post-generation rewrite was applied.",
            "transcriptAfterGeneration": transcript_after_generation,
            "transcriptSimilarity": transcript_similarity,
            "transcriptTokenRecall": transcript_token_recall,
            "missingTranscriptTokens": missing_transcript_tokens,
            "selectedVoiceId": preset["voice_id"],
            "selectedLanguage": preset["language"],
            "requestedLanguage": args.requested_language,
            "languageNote": "OmniVoice language map supports Vietnamese as 'vi'; vi-VN is recorded as requested locale.",
            "readingMode": "split-lines exact/verbatim" if args.split_lines else "exact/verbatim requested; script passed directly as text argument",
            "voiceSettings": generation,
            "refAudio": effective_ref_audio,
            "refText": ref_text,
            "normalizeVietnamese": args.normalize_vietnamese,
            "pronunciationMapPath": str(Path(args.pronunciation_map).resolve()) if args.normalize_vietnamese else None,
            "pronunciationMap": pronunciation_map if args.normalize_vietnamese else None,
            "splitLines": args.split_lines,
            "lineGapSeconds": args.line_gap_seconds if args.split_lines else None,
            "omitRefTextInGeneration": args.omit_ref_text_in_generation if args.split_lines else None,
            "generationSegments": generation_segments,
            "warnings": [
                warning for warning in [
                    None if final_voice_script == sent_to_omni_script else "Voice provider may have modified the script. Please check Omni settings and disable auto rewrite / enhancement.",
                    asr_warning,
                    "silenceAtStart exceeded 0.8 seconds before cleanup." if pre_cleanup_metrics["silenceAtStart"] > 0.8 else None,
                    "silenceAtStart still exceeds 0.8 seconds after cleanup." if post_cleanup_metrics["silenceAtStart"] > 0.8 else None,
                    "maxInternalSilence still exceeds configured maximum after cleanup." if post_cleanup_metrics["maxInternalSilence"] > args.max_internal_silence else None,
                ] if warning
            ],
        }
        log_path.write_text(json.dumps(log, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Saved {preset['voice_id']} to {output}")


if __name__ == "__main__":
    main()
