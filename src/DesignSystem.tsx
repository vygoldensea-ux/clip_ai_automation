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
  // Base
  white:       '#FFFFFF',
  offWhite:    '#F8F7F4',
  cream:       '#FFF7ED',
  black:       '#0A0A0A',
  charcoal:    '#1C1C2E',
  // GoldenSea brand
  gold:        '#C9A84C',
  goldBright:  '#F5A623',
  navy:        '#061A56',
  midnight:    '#0D0D1A',
  indigo:      '#1A0B3B',
  // Dark neons
  cyan:        '#38D9FF',
  mint:        '#00E5B0',
  coral:       '#FF6B6B',
  pink:        '#FF2D78',
  purple:      '#9B5DE5',
  lime:        '#B8FF57',
  // Pastel palette (from Pinterest ref)
  periwinkle:  '#88A2FF',   // Насыщенный голубой
  neonLime:    '#E3FC87',   // Неоновый зеленый
  deepNavy:    '#253A82',   // Глубокий синий
  bubblegum:   '#FFB2F7',   // Яркий розовый
  skyBlue:     '#C0E0FF',   // Светлый голубой
  lavender:    '#AB9DFF',   // Насыщенный фиолетовый
  softPurple:  '#D4CAFF',   // light lavender bg
  peach:       '#FFD6B8',   // soft peach card bg
  // Alphas
  muted:       'rgba(255,255,255,0.55)',
  mutedDark:   'rgba(0,0,0,0.45)',
  mutedLight:  'rgba(0,0,0,0.18)',
};

// ─── BACKGROUND PRESETS ──────────────────────────────────────────────────────
export type BgPreset =
  // ── DARK (original 6) ──
  | 'midnight-ink'     // Dark premium — deep black + indigo glow
  | 'electric-aurora'  // Hot magenta → purple → navy. Viral openers
  | 'solar-flare'      // Dark navy + gold/orange. GoldenSea brand
  | 'fresh-mint'       // Near-white + mint/teal
  | 'neon-night'       // Pure black + cyan/lime neons
  | 'warm-paper'       // Warm cream + orange glow. CTA/outro
  // ── LIGHT (new 3 — airy, pastel, editorial) ──
  | 'soft-white'       // Off-white #F8F7F4 + periwinkle accent. Clean editorial
  | 'pastel-lavender'  // Light blue-gray like periwinkle card grid. Friendly
  | 'light-cream';     // Warm cream like "Thank You" slide. Minimal CTA

// Gradient definitions per preset
const BG_GRADIENT: Record<BgPreset, string> = {
  // Dark
  'midnight-ink':    'linear-gradient(160deg, #0D0D1A 0%, #1A0B3B 55%, #0A0A18 100%)',
  'electric-aurora': 'linear-gradient(180deg, #0D0020 0%, #3B0051 30%, #7B00A0 60%, #1A0060 100%)',
  'solar-flare':     'linear-gradient(180deg, #061A56 0%, #0A2A70 45%, #1A1205 100%)',
  'fresh-mint':      'linear-gradient(160deg, #F0FFFA 0%, #C8FFF0 40%, #E8FFF8 100%)',
  'neon-night':      'linear-gradient(180deg, #000000 0%, #050510 60%, #000000 100%)',
  'warm-paper':      'linear-gradient(180deg, #FFF9F0 0%, #FFE8C0 50%, #FFCF80 100%)',
  // Light
  'soft-white':      'linear-gradient(160deg, #F8F7F4 0%, #F2F0FF 60%, #EEF2FF 100%)',
  'pastel-lavender': 'linear-gradient(180deg, #DDE4F5 0%, #E8EDFA 45%, #D6DCF0 100%)',
  'light-cream':     'linear-gradient(180deg, #FDFAF5 0%, #FAF6EE 60%, #F5EFDF 100%)',
};

// Accent glow per preset (radial overlays)
const BG_GLOW: Record<BgPreset, string> = {
  'midnight-ink':    'radial-gradient(ellipse at 30% 30%, rgba(155,93,229,0.35) 0%, transparent 60%), radial-gradient(ellipse at 75% 80%, rgba(56,217,255,0.18) 0%, transparent 50%)',
  'electric-aurora': 'radial-gradient(ellipse at 50% 20%, rgba(255,45,120,0.55) 0%, transparent 50%), radial-gradient(ellipse at 20% 75%, rgba(155,93,229,0.4) 0%, transparent 45%)',
  'solar-flare':     'radial-gradient(ellipse at 50% 65%, rgba(201,168,76,0.45) 0%, transparent 55%), radial-gradient(ellipse at 80% 20%, rgba(245,166,35,0.2) 0%, transparent 40%)',
  'fresh-mint':      'radial-gradient(ellipse at 40% 50%, rgba(0,229,176,0.2) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(56,217,255,0.15) 0%, transparent 40%)',
  'neon-night':      'radial-gradient(ellipse at 25% 40%, rgba(56,217,255,0.3) 0%, transparent 45%), radial-gradient(ellipse at 75% 70%, rgba(184,255,87,0.2) 0%, transparent 40%)',
  // Light presets — subtle tints only, no heavy glow
  'soft-white':      'radial-gradient(ellipse at 80% 15%, rgba(136,162,255,0.18) 0%, transparent 55%), radial-gradient(ellipse at 10% 85%, rgba(171,157,255,0.12) 0%, transparent 50%)',
  'pastel-lavender': 'radial-gradient(ellipse at 70% 20%, rgba(136,162,255,0.25) 0%, transparent 50%), radial-gradient(ellipse at 20% 80%, rgba(171,157,255,0.2) 0%, transparent 50%)',
  'light-cream':     'radial-gradient(ellipse at 50% 70%, rgba(245,166,35,0.12) 0%, transparent 55%), radial-gradient(ellipse at 85% 10%, rgba(255,210,150,0.15) 0%, transparent 40%)',
  'warm-paper':      'radial-gradient(ellipse at 50% 60%, rgba(255,107,50,0.3) 0%, transparent 55%), radial-gradient(ellipse at 20% 30%, rgba(255,200,80,0.25) 0%, transparent 40%)',
};

// Text color recommendations per preset
export const BG_TEXT: Record<BgPreset, { primary: string; accent: string; muted: string }> = {
  // Dark
  'midnight-ink':    { primary: C.white,      accent: C.cyan,       muted: 'rgba(255,255,255,0.5)'  },
  'electric-aurora': { primary: C.white,      accent: C.pink,       muted: 'rgba(255,255,255,0.5)'  },
  'solar-flare':     { primary: C.cream,      accent: C.goldBright, muted: 'rgba(255,247,237,0.55)' },
  'fresh-mint':      { primary: '#0A1A14',    accent: '#00A87A',    muted: 'rgba(10,26,20,0.5)'     },
  'neon-night':      { primary: C.white,      accent: C.lime,       muted: 'rgba(255,255,255,0.45)' },
  'warm-paper':      { primary: '#2A1800',    accent: '#D4520A',    muted: 'rgba(42,24,0,0.5)'      },
  // Light — dark text on light bg
  'soft-white':      { primary: C.charcoal,   accent: C.periwinkle, muted: 'rgba(28,28,46,0.45)'    },
  'pastel-lavender': { primary: C.deepNavy,   accent: C.periwinkle, muted: 'rgba(37,58,130,0.45)'   },
  'light-cream':     { primary: '#1C1C1C',    accent: C.gold,       muted: 'rgba(28,28,28,0.4)'     },
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

// ─── FLUID CURVE DECORATION ──────────────────────────────────────────────────
/**
 * Decorative fluid SVG ribbon — like the "fevereiro roxo" Pinterest reference.
 * position: 'top-right' | 'bottom-left' | 'full'
 * Animates slowly rotating/drifting for motion feel.
 */
export type CurveVariant = 'top-right' | 'bottom-left' | 'center-swirl' | 'full-bg';

export const FluidCurve: React.FC<{
  color?: string;
  opacity?: number;
  variant?: CurveVariant;
  strokeWidth?: number;
}> = ({ color = C.periwinkle, opacity = 0.9, variant = 'top-right', strokeWidth = 52 }) => {
  const frame = useCurrentFrame();
  const drift = interpolate(frame, [0, 1200], [0, 8], clamp);

  const paths: Record<CurveVariant, { viewBox: string; d: string; style: React.CSSProperties }> = {
    'top-right': {
      viewBox: '0 0 500 600',
      d: 'M 480 -30 C 420 80, 350 120, 380 240 C 410 360, 520 380, 460 500 C 400 620, 280 600, 260 720',
      style: { position: 'absolute', top: -60, right: -60, width: 420, height: 620, transform: `translateY(${drift}px)` },
    },
    'bottom-left': {
      viewBox: '0 0 500 600',
      d: 'M -30 650 C 80 560, 180 480, 120 360 C 60 240, -40 200, 40 80 C 120 -40, 260 20, 300 -80',
      style: { position: 'absolute', bottom: -80, left: -60, width: 400, height: 600, transform: `translateY(${-drift}px)` },
    },
    'center-swirl': {
      viewBox: '0 0 800 800',
      d: 'M 100 400 C 150 200, 350 100, 400 300 C 450 500, 250 600, 300 400 C 350 200, 550 150, 600 350 C 650 550, 500 680, 400 600',
      style: { position: 'absolute', top: '50%', left: '50%', width: 700, height: 700, transform: `translate(-50%,-50%) rotate(${drift * 0.5}deg)` },
    },
    'full-bg': {
      viewBox: '0 0 1080 1920',
      d: 'M -80 200 C 200 100, 500 300, 400 600 C 300 900, -100 1000, 200 1300 C 500 1600, 900 1400, 1100 1700 M 1160 400 C 900 500, 700 700, 800 1000 C 900 1300, 1200 1500, 1000 1800',
      style: { position: 'absolute', inset: 0, width: '100%', height: '100%' },
    },
  };

  const p = paths[variant];
  return (
    <svg
      viewBox={p.viewBox}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ ...p.style, opacity, pointerEvents: 'none' }}
    >
      <path
        d={p.d}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
};

// ─── LAYERED TITLE (Pinterest ref style) ─────────────────────────────────────
/**
 * 3-layer title like "fevereiro roxo":
 * - Light weight ghost text behind
 * - Script/italic middle layer
 * - Bold solid front layer
 */
export const LayeredTitle: React.FC<{
  text: string;
  colorLight?: string;
  colorBold?: string;
  size?: number;
  frame: number;
  start?: number;
}> = ({ text, colorLight = C.periwinkle, colorBold = C.deepNavy, size = 160, frame, start = 0 }) => {
  const fadeIn  = interpolate(frame, [start, start + 20], [0, 1], clamp);
  const slideUp = interpolate(frame, [start, start + 22], [40, 0], clamp);
  return (
    <div style={{ position: 'relative', display: 'inline-block', fontFamily: FONT, lineHeight: 0.9 }}>
      {/* Layer 1 — light ghost */}
      <div style={{
        fontSize: size, fontWeight: 400, color: colorLight,
        opacity: fadeIn * 0.55, letterSpacing: -2,
        transform: `translateY(${slideUp + 12}px)`,
        position: 'absolute', top: 0, left: 0, whiteSpace: 'nowrap',
      }}>
        {text}
      </div>
      {/* Layer 2 — bold solid */}
      <div style={{
        fontSize: size, fontWeight: 900, color: colorBold,
        opacity: fadeIn, letterSpacing: -3,
        transform: `translateY(${slideUp}px)`,
        position: 'relative',
      }}>
        {text}
      </div>
    </div>
  );
};

// ─── PASTEL CARD ──────────────────────────────────────────────────────────────
/** Card with pastel background fill — like the 2×2 grid reference */
export const PastelCard: React.FC<{
  title: string;
  desc?: string;
  tags?: string[];
  bg?: string;
  textColor?: string;
  style?: React.CSSProperties;
}> = ({ title, desc, tags = [], bg = C.skyBlue, textColor = C.charcoal, style = {} }) => (
  <div style={{
    background: bg, borderRadius: 28, padding: '32px 28px',
    display: 'flex', flexDirection: 'column', gap: 16,
    fontFamily: FONT, ...style,
  }}>
    <div style={{ fontSize: 52, fontWeight: 900, color: textColor, lineHeight: 1.1 }}>{title}</div>
    {desc && <div style={{ fontSize: 28, color: textColor, opacity: 0.65, lineHeight: 1.4 }}>{desc}</div>}
    {tags.length > 0 && (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 8 }}>
        {tags.map(tag => (
          <div key={tag} style={{
            background: 'rgba(255,255,255,0.55)', color: textColor,
            fontSize: 22, fontWeight: 700, borderRadius: 100,
            padding: '6px 18px',
          }}>
            {tag}
          </div>
        ))}
      </div>
    )}
  </div>
);

// ─── ARROW CTA ────────────────────────────────────────────────────────────────
/** Pill arrow button like "Thank You →" reference */
export const ArrowCTA: React.FC<{ label?: string; color?: string; bg?: string }> = ({
  label, color = C.white, bg = C.periwinkle,
}) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontFamily: FONT }}>
    <div style={{
      width: 80, height: 80, borderRadius: 999,
      background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <path d="M8 18H28M28 18L20 10M28 18L20 26" stroke={color} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
    {label && <div style={{ fontSize: 44, fontWeight: 900, color: bg }}>{label}</div>}
  </div>
);
