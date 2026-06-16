# Clip AI Automation

Remotion setup for Vietnamese vertical news clips, including the current BTC Strategy clip, fixed voice preset, and reusable design presets.

## Current Clip

- Composition: `BTCStrategyUpdate`
- Entry: `src/index.ts`
- Main component: `src/BTCStrategyUpdate.tsx`
- Render command:

```powershell
npm.cmd install
npm.cmd run render:btc-strategy
```

Output path:

```text
outputs/btc-strategy-20260616/btc-strategy-update-40s.mp4
```

## Chốt Font

Use only this font family unless explicitly changed:

```text
Final Font/Young Typeface
public/assets/fonts/young
```

Preset note:

```text
Viral/font-style-preset.json
```

## Voice Setup

Current approved voice reference is stored in:

```text
voice-presets/voice_preview_test1.mp3
voice-presets/voice-preview-test1-segments/
voice-presets/uyen_voice_clone.json
```

Generated production voice used by the clip:

```text
public/btc-strategy-voice.wav
```

Background music:

```text
public/btc-strategy-bg.mp3
```

Current rule: background music is 10% volume and fades down near the end without fully cutting off.

## Reusable Design Presets

Background presets based on user-approved examples:

```text
Viral/background-style-presets.json
```

Opening/layout framework references:

```text
Viral/viral-opening-frameworks.json
```

## Notes

- Do not commit `node_modules`.
- Keep one font family per clip.
- For Vietnamese voice generation, send only the finalized script to OmniVoice; do not summarize or rewrite after approval.
