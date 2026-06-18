/**
 * GoldenSea Design System — Remotion Clips
 * 6 backgrounds, 7 animation presets, clean color tokens
 */
import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';

// ─── CLAMP HELPER ────────────────────────────────────────────────────────────
export const clamp = {
  extrapolateLeft: 'clamp' as const,
  extrapolateRight: 'clamp' as const,
};

// ─── FONT ────────────────────────────────────────────────────────────────────
export const fontFaceCss = `
@font-face {
  font-family: "Young";
  src: url("/assets/fonts/young/Young-Typeface.otf") format("opentype");
  font-weight: 400;
}
@font-face {
  font-family: "Young";
  src: url("/assets/fonts/young/Young-Typeface-Bold-Display.otf") format("opentype");
  font-weight: 700;
}
@font-face {
  font-family: "Young";
  src: url("/assets/fonts/young/Young-Typeface-Bold-Display.otf") format("opentype");
  font-weight: 900;
}
* { box-sizing: border-box; margin: 0; padding: 0; }
`;
export const FONT = '"Young", serif';

// ─── COLOR TOKENS ─────────────────────────────────────────────────────────────
export const C = {
  white:      '#FFFFFF',
  cream:      '#FFF7ED',
  black:      '#0A0A0A',
  gold:       '#C9A84C',
  goldBright: '#F5A623',
  navy:       '#061A56',
  midnight:   '#0D0D1A',
  indigo:     '#1A0B3B',
  cyan:       '#38D9FF',
  mint:       '#00E5B0',
  coral:      '#FF6B6B',
  pink:       '#FF2D78',
  purple:     '#9B5DE5',
  lime:       '#B8FF57',
  muted:      'rgba(255,255,255,0.55)',
  mutedDark:  'rgba(0,0,0,0.45)',
};

// ─── BACKGROUND PRESETS ──────────────────────────────────────────────────────
export type BgPreset =
  | 'midnight-ink'     // Dark premium — deep black + indigo glow. Best for: big claims, premium hooks
  | 'electric-aurora'  // Hot magenta → purple → navy. Best for: viral openers, energy
  | 'solar-flare'      // Dark navy + gold/orange burst. Best for: financial, data, GoldenSea brand
  | 'fresh-mint'       // Near-white + mint/teal gradient. Best for: clean tips, educational
  | 'neon-night'       // Pure black + cyan/lime neons. Best for: TikTok energy, tech topics
  | 'warm-paper';      // Warm cream + orange glow. Best for: calm CTA, outro, storytelling

// Gradient definitions per preset
const BG_GRADIENT: Record<BgPreset, string> = {
  'midnight-ink':    'linear-gradient(160deg, #0D0D1A 0%, #1A0B3B 55%, #0A0A18 100%)',
  'electric-aurora': 'linear-gradient(180deg, #0D0020 0%, #3B0051 30%, #7B00A0 60%, #1A0060 100%)',
  'solar-flare':     'linear-gradient(180deg, #061A56 0%, #0A2A70 45%, #1A1205 100%)',
  'fresh-mint':      'linear-gradient(160deg, #F0FFFA 0%, #C8FFF0 40%, #E8FFF8 100%)',
  'neon-night':      'linear-gradient(180deg, #000000 0%, #050510 60%, #000000 100%)',
  'warm-paper':      'linear-gradient(180deg, #FFF9F0 0%, #FFE8C0 50%, #FFCF80 100%)',
};

// Accent glow per preset (radial overlays)
const BG_GLOW: Record<BgPreset, string> = {
  'midnight-ink':    'radial-gradient(ellipse at 30% 30%, rgba(155,93,229,0.35) 0%, transparent 60%), radial-gradient(ellipse at 75% 80%, rgba(56,217,255,0.18) 0%, transparent 50%)',
  'electric-aurora': 'radial-gradient(ellipse at 50% 20%, rgba(255,45,120,0.55) 0%, transparent 50%), radial-gradient(ellipse at 20% 75%, rgba(155,93,229,0.4) 0%, transparent 45%)',
  'solar-flare':     'radial-gradient(ellipse at 50% 65%, rgba(201,168,76,0.45) 0%, transparent 55%), radial-gradient(ellipse at 80% 20%, rgba(245,166,35,0.2) 0%, transparent 40%)',
  'fresh-mint':      'radial-gradient(ellipse at 40% 50%, rgba(0,229,176,0.2) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(56,217,255,0.15) 0%, transparent 40%)',
  'neon-night':      'radial-gradient(ellipse at 25% 40%, rgba(56,217,255,0.3) 0%, transparent 45%), radial-gradient(ellipse at 75% 70%, rgba(184,255,87,0.2) 0%, transparent 40%)',
  'warm-paper':      'radial-gradient(ellipse at 50% 60%, rgba(255,107,50,0.3) 0%, transparent 55%), radial-gradient(ellipse at 20% 30%, rgba(255,200,80,0.25) 0%, transparent 40%)',
};

// Text color recommendations per preset
export const BG_TEXT: Record<BgPreset, { primary: string; accent: string; muted: string }> = {
  'midnight-ink':    { primary: C.white,   accent: C.cyan,      muted: 'rgba(255,255,255,0.5)' },
  'electric-aurora': { primary: C.white,   accent: C.pink,      muted: 'rgba(255,255,255,0.5)' },
  'solar-flare':     { primary: C.cream,   accent: C.goldBright, muted: 'rgba(255,247,237,0.55)' },
  'fresh-mint':      { primary: '#0A1A14', accent: '#00A87A',   muted: 'rgba(10,26,20,0.5)' },
  'neon-night':      { primary: C.white,   accent: C.lime,      muted: 'rgba(255,255,255,0.45)' },
  'warm-paper':      { primary: '#2A1800', accent: '#D4520A',   muted: 'rgba(42,24,0,0.5)' },
};

interface BgProps {
  preset?: BgPreset;
  grain?: boolean;   // subtle noise overlay
  grid?: boolean;    // subtle grid lines
  drift?: boolean;   // slow Ken Burns drift
}

export const Background: React.FC<BgProps> = ({
  preset = 'solar-flare',
  grain = true,
  grid = false,
  drift = true,
}) => {
  const frame = useCurrentFrame();
  const driftY = drift ? interpolate(frame, [0, 1200], [0, -24], clamp) : 0;
  const scale  = drift ? interpolate(frame, [0, 1200], [1, 1.02], clamp) : 1;

  return (
    <AbsoluteFill style={{ overflow: 'hidden', fontFamily: FONT }}>
      <style>{fontFaceCss}</style>

      {/* Base gradient */}
      <AbsoluteFill
        style={{
          background: BG_GRADIENT[preset],
          transform: `translateY(${driftY}px) scale(${scale})`,
        }}
      />

      {/* Glow overlay */}
      <AbsoluteFill style={{ background: BG_GLOW[preset], mixBlendMode: 'screen' }} />

      {/* Optional grid */}
      {grid && (
        <AbsoluteFill
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px)',
            backgroundSize: '80px 80px',
            opacity: 0.6,
          }}
        />
      )}

      {/* Optional grain */}
      {grain && (
        <AbsoluteFill
          style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'0.04\'/%3E%3C/svg%3E")',
            backgroundRepeat: 'repeat',
            backgroundSize: '256px 256px',
            opacity: preset === 'fresh-mint' || preset === 'warm-paper' ? 0.3 : 0.6,
            mixBlendMode: 'overlay',
          }}
        />
      )}
    </AbsoluteFill>
  );
};

// ─── ANIMATION PRESETS ────────────────────────────────────────────────────────
/**
 * 7 animation presets. Each returns style props to apply to a wrapper div.
 * Usage: <div style={anim.fadeUp(frame, startFrame)}>content</div>
 */
export const anim = {

  /** 1. fadeUp — soft fade + rise. Default calm reveal */
  fadeUp: (frame: number, start: number, duration = 20) => ({
    opacity: interpolate(frame, [start, start + duration], [0, 1], clamp),
    transform: `translateY(${interpolate(frame, [start, start + duration], [32, 0], clamp)}px)`,
  }),

  /** 2. slideRight — slides in from left. For data rows, lists */
  slideRight: (frame: number, start: number, duration = 18, distance = 60) => ({
    opacity: interpolate(frame, [start, start + duration * 0.6], [0, 1], clamp),
    transform: `translateX(${interpolate(frame, [start, start + duration], [-distance, 0], clamp)}px)`,
  }),

  /** 3. scaleIn — scale from 0.8. Big statement moments */
  scaleIn: (frame: number, start: number, duration = 22) => ({
    opacity: interpolate(frame, [start, start + duration * 0.5], [0, 1], clamp),
    transform: `scale(${interpolate(frame, [start, start + duration], [0.78, 1], clamp)})`,
  }),

  /** 4. popIn — scale overshoot (1.15 → 1). Hook words, numbers */
  popIn: (frame: number, start: number) => {
    const t = Math.max(0, frame - start);
    const raw = t < 14
      ? interpolate(t, [0, 10, 14], [0, 1.15, 1], clamp)
      : 1;
    return {
      opacity: interpolate(frame, [start, start + 6], [0, 1], clamp),
      transform: `scale(${raw})`,
      display: 'inline-block',
    };
  },

  /** 5. wipeReveal — text revealed left-to-right via clip-path. Dramatic */
  wipeReveal: (frame: number, start: number, duration = 24) => ({
    clipPath: `inset(0 ${interpolate(frame, [start, start + duration], [100, 0], clamp)}% 0 0)`,
    opacity: 1,
  }),

  /** 6. glowPulse — pulsing glow opacity. For accent lines, live indicators */
  glowPulse: (frame: number, color = C.cyan) => {
    const pulse = 0.6 + 0.4 * Math.sin(frame * 0.08);
    return {
      boxShadow: `0 0 ${24 * pulse}px ${color}, 0 0 ${8 * pulse}px ${color}`,
      opacity: 0.7 + 0.3 * pulse,
    };
  },

  /** 7. stagger — returns per-item delay for list animations (use with fadeUp/slideRight) */
  stagger: (index: number, baseStart: number, gap = 8) => baseStart + index * gap,

  /** exit — fade out + slide up. Use for scene transitions */
  exit: (frame: number, start: number, duration = 14) => ({
    opacity: interpolate(frame, [start, start + duration], [1, 0], clamp),
    transform: `translateY(${interpolate(frame, [start, start + duration], [0, -20], clamp)}px)`,
  }),
};

// ─── REUSABLE COMPONENTS ──────────────────────────────────────────────────────

/** Thin accent line — horizontal rule */
export const AccentLine: React.FC<{ color?: string; width?: number | string; style?: React.CSSProperties }> = ({
  color = C.goldBright, width = 48, style = {}
}) => (
  <div style={{ width, height: 3, borderRadius: 2, background: color, ...style }} />
);

/** Pill / chip label */
export const Pill: React.FC<{ children: React.ReactNode; color?: string; bg?: string }> = ({
  children, color = C.black, bg = C.goldBright
}) => (
  <div style={{
    display: 'inline-flex', alignItems: 'center',
    background: bg, color, borderRadius: 100,
    fontSize: 26, fontWeight: 800, letterSpacing: 1.2,
    padding: '8px 22px', textTransform: 'uppercase', fontFamily: FONT,
  }}>
    {children}
  </div>
);

/** Big stat number */
export const StatNumber: React.FC<{ value: string; label?: string; color?: string }> = ({
  value, label, color = C.goldBright
}) => (
  <div style={{ fontFamily: FONT }}>
    <div style={{ fontSize: 140, fontWeight: 900, color, lineHeight: 1, letterSpacing: -2 }}>{value}</div>
    {label && <div style={{ fontSize: 32, fontWeight: 600, color: 'rgba(255,255,255,0.6)', marginTop: 8, letterSpacing: 0.5 }}>{label}</div>}
  </div>
);

/** Scene divider — glowing horizontal line */
export const Divider: React.FC<{ color?: string }> = ({ color = 'rgba(255,255,255,0.15)' }) => (
  <div style={{ width: '100%', height: 1, background: color, margin: '24px 0' }} />
);

/** Floating brand tag — top-left corner */
export const BrandTag: React.FC<{ label?: string }> = ({ label = 'GOLDENSEA' }) => (
  <div style={{
    position: 'absolute', top: 72, left: 52,
    display: 'flex', alignItems: 'center', gap: 12,
    fontFamily: FONT,
  }}>
    <div style={{
      width: 32, height: 32, borderRadius: 8,
      background: C.gold,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{ width: 14, height: 14, borderRadius: 3, background: C.goldBright }} />
    </div>
    <div style={{ fontSize: 24, fontWeight: 800, color: C.gold, letterSpacing: 2.5, textTransform: 'uppercase' }}>
      {label}
    </div>
  </div>
);

/** Live dot indicator */
export const LiveDot: React.FC<{ color?: string }> = ({ color = '#FF2D78' }) => {
  const frame = useCurrentFrame();
  const pulse = 0.5 + 0.5 * Math.sin(frame * 0.12);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontFamily: FONT }}>
      <div style={{
        width: 14, height: 14, borderRadius: '50%',
        background: color,
        boxShadow: `0 0 ${10 + 8 * pulse}px ${color}`,
        opacity: 0.8 + 0.2 * pulse,
      }} />
      <span style={{ fontSize: 24, fontWeight: 700, color, letterSpacing: 2, textTransform: 'uppercase' }}>LIVE</span>
    </div>
  );
};

// ─── SCENE TIMING HELPERS ────────────────────────────────────────────────────
export const FPS = 30;
export const sec = (s: number) => Math.round(s * FPS);

/** Returns true if current frame is within a scene window */
export const inScene = (frame: number, startSec: number, endSec: number) =>
  frame >= sec(startSec) && frame < sec(endSec);
