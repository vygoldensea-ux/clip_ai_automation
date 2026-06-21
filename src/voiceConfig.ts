/**
 * voiceConfig.ts — Cấu hình voice chuẩn cho toàn bộ project
 *
 * Voice ref: public/voices/goldensea-voice.mp3
 * Để generate voice mới: npm run voice "nội dung" ten-file.wav [duration]
 * Ví dụ: npm run voice "Vàng giảm 57 đô." gold-news-voice.wav 40
 */
import { staticFile } from 'remotion';

/** Đường dẫn file voice ref chuẩn GoldenSea (dùng cho OmniVoice clone) */
export const VOICE_REF_PATH = 'voices/goldensea-voice.mp3';

/** Helper tạo props Audio cho một clip — volume mặc định 1.0, fade out 3s cuối */
export const voiceAudioSrc = (filename: string) => staticFile(filename);

/** Volume mặc định cho nhạc nền */
export const BG_MUSIC_VOLUME = 0.15;

/** Fade nhạc nền về 0 trong 3s cuối clip */
export const bgMusicVolume = (frame: number, totalFrames: number, fps = 30) => {
  const fadeStart = totalFrames - 3 * fps;
  if (frame >= fadeStart) {
    return BG_MUSIC_VOLUME * (1 - (frame - fadeStart) / (3 * fps));
  }
  return BG_MUSIC_VOLUME;
};
