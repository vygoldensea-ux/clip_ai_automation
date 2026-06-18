import React from 'react';
import { AbsoluteFill, Audio, Img, interpolate, staticFile, useCurrentFrame } from 'remotion';
import {
  Background, BrandTag, AccentLine, Pill, LiveDot,
  C, FONT, anim, clamp, sec, inScene,
} from './DesignSystem';

const FPS = 30;
const DURATION = 40 * FPS; // 1200 frames

// ─── SCENE WINDOWS (seconds) ─────────────────────────────────────────────────
// Hook:     0–7.5s   (0–225f)
// Strategy: 7.5–17s  (225–510f)
// Market:   17–26.5s (510–795f)
// Levels:   26.5–36s (795–1080f)
// CTA:      36–40s   (1080–1200f)

const fadeScene = (frame: number, startF: number, lengthF: number) => {
  const enter = interpolate(frame, [startF, startF + 14], [0, 1], clamp);
  const exit  = interpolate(frame, [startF + lengthF - 16, startF + lengthF], [1, 0], clamp);
  return Math.min(enter, exit);
};

// ─── SHARED COMPONENTS ───────────────────────────────────────────────────────

const SceneLabel: React.FC<{ children: React.ReactNode; color?: string }> = ({
  children, color = C.gold
}) => (
  <div style={{
    fontFamily: FONT,
    color,
    fontSize: 28,
    fontWeight: 800,
    letterSpacing: 2.5,
    textTransform: 'uppercase',
  }}>
    {children}
  </div>
);

/** Animated big headline — each line staggers in */
const BigTitle: React.FC<{
  lines: Array<{ text: string; color?: string }>;
  frame: number;
  start: number;
  top?: number;
  size?: number;
}> = ({ lines, frame, start, top = 300, size = 116 }) => (
  <div style={{ position: 'absolute', left: 60, right: 60, top, fontFamily: FONT }}>
    {lines.map((line, i) => (
      <div
        key={i}
        style={{
          color: line.color ?? C.white,
          fontSize: size,
          fontWeight: 900,
          lineHeight: 1.1,
          letterSpacing: -1,
          ...anim.fadeUp(frame, start + i * 10, 20),
        }}
      >
        {line.text}
      </div>
    ))}
  </div>
);

/** Data card row */
const DataCard: React.FC<{
  value: string;
  label: string;
  accent?: string;
  frame: number;
  start: number;
  highlight?: boolean;
}> = ({ value, label, accent = C.goldBright, frame, start, highlight = false }) => (
  <div
    style={{
      borderRadius: 24,
      padding: '24px 32px',
      background: highlight ? `linear-gradient(135deg, ${accent}22, ${accent}0A)` : 'rgba(255,255,255,0.07)',
      border: `1.5px solid ${highlight ? accent + '55' : 'rgba(255,255,255,0.1)'}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      fontFamily: FONT,
      ...anim.slideRight(frame, start, 18),
    }}
  >
    <div style={{ fontSize: 68, fontWeight: 900, color: accent, letterSpacing: -1 }}>{value}</div>
    <div style={{ fontSize: 30, fontWeight: 700, color: 'rgba(255,255,255,0.65)', textAlign: 'right', maxWidth: 300, lineHeight: 1.3 }}>{label}</div>
  </div>
);

// ─── SCENE 1 — HOOK ───────────────────────────────────────────────────────────
// BG: midnight-ink (dark premium, cyan accent)
// Anim: scaleIn for main title, fadeUp for sub
const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = fadeScene(frame, 0, 225);

  const photoZoom = interpolate(frame, [60, 290], [1.02, 1.1], clamp);

  return (
    <AbsoluteFill style={{ opacity }}>
      <Background preset="midnight-ink" grain drift />
      <BrandTag />

      {/* Live indicator */}
      <div style={{ position: 'absolute', top: 78, right: 60, ...anim.fadeUp(frame, 5) }}>
        <LiveDot color={C.pink} />
      </div>

      {/* Label */}
      <div style={{ position: 'absolute', left: 60, top: 220, ...anim.fadeUp(frame, 8) }}>
        <SceneLabel color={C.cyan}>Market Update</SceneLabel>
        <AccentLine color={C.cyan} width={40} style={{ marginTop: 10 }} />
      </div>

      {/* Main title */}
      <BigTitle
        frame={frame} start={12} top={320} size={108}
        lines={[
          { text: 'BITCOIN' },
          { text: 'VƯỢT', color: C.cyan },
          { text: '67.000 USD', color: C.goldBright },
        ]}
      />

      {/* Sub text */}
      <div style={{
        position: 'absolute', left: 60, right: 60, top: 750,
        color: 'rgba(255,255,255,0.7)', fontSize: 46, fontWeight: 500,
        lineHeight: 1.3, fontFamily: FONT,
        ...anim.fadeUp(frame, 38, 22),
      }}>
        Nhưng tin nóng không có nghĩa là mua vội.
      </div>

      {/* Article photo */}
      <div style={{
        position: 'absolute', left: 60, top: 920, right: 60,
        height: 460, borderRadius: 28, overflow: 'hidden',
        border: '2px solid rgba(255,255,255,0.15)',
        ...anim.fadeUp(frame, 55, 24),
      }}>
        <Img
          src={staticFile('assets/btc-strategy-20260616/thanhnien-btc-eth-coins.jpg')}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${photoZoom})` }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(0deg, rgba(0,0,0,0.4), transparent 60%)' }} />
      </div>

      {/* Bottom pill */}
      <div style={{
        position: 'absolute', left: 60, bottom: 140,
        ...anim.fadeUp(frame, 72, 18),
      }}>
        <Pill bg={C.goldBright} color={C.black}>Strategy vừa gom thêm 100 triệu USD Bitcoin</Pill>
      </div>
    </AbsoluteFill>
  );
};

// ─── SCENE 2 — STRATEGY DATA ──────────────────────────────────────────────────
// BG: solar-flare (GoldenSea brand, gold accent)
// Anim: slideRight for data cards
const StrategyScene: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = fadeScene(frame, 225, 285);

  const items = [
    { value: '1.587',    label: 'Bitcoin mua thêm',         accent: C.goldBright, hi: false },
    { value: '100M USD', label: 'giá trị thương vụ',        accent: C.gold,       hi: true  },
    { value: '846.842',  label: 'Bitcoin đang nắm giữ',     accent: C.cream,      hi: false },
  ];

  return (
    <AbsoluteFill style={{ opacity }}>
      <Background preset="solar-flare" grain drift />
      <BrandTag />

      <div style={{ position: 'absolute', left: 60, top: 200, ...anim.fadeUp(frame, 235) }}>
        <SceneLabel color={C.goldBright}>New Position</SceneLabel>
        <AccentLine color={C.goldBright} width={40} style={{ marginTop: 10 }} />
      </div>

      <BigTitle
        frame={frame} start={240} top={300} size={104}
        lines={[
          { text: 'STRATEGY' },
          { text: 'GOM THÊM', color: C.cream },
          { text: 'BITCOIN', color: C.goldBright },
        ]}
      />

      <div style={{
        position: 'absolute', left: 60, right: 60, top: 730,
        color: 'rgba(255,247,237,0.65)', fontSize: 42, lineHeight: 1.3,
        fontWeight: 500, fontFamily: FONT,
        ...anim.fadeUp(frame, 260, 20),
      }}>
        Một thương vụ đủ lớn để thị trường phải nhìn lại dòng tiền tổ chức.
      </div>

      <div style={{ position: 'absolute', left: 60, right: 60, top: 980, display: 'flex', flexDirection: 'column', gap: 20 }}>
        {items.map((item, i) => (
          <DataCard
            key={item.value}
            {...item}
            frame={frame}
            start={anim.stagger(i, 330, 20)}
          />
        ))}
      </div>
    </AbsoluteFill>
  );
};

// ─── SCENE 3 — MARKET SNAPSHOT ────────────────────────────────────────────────
// BG: neon-night (tech, high contrast, cyan/lime bars)
// Anim: wipeReveal for title, stagger bars
const MarketScene: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = fadeScene(frame, 510, 285);

  const coins = [
    { name: 'BTC',  pct: '+1.03%', color: C.goldBright, width: 0.62 },
    { name: 'ETH',  pct: '+4.3%',  color: C.cyan,        width: 0.78 },
    { name: 'SOL',  pct: '+4.05%', color: C.lime,        width: 0.76 },
    { name: 'HYPE', pct: '+5.71%', color: C.pink,        width: 0.92 },
  ];

  return (
    <AbsoluteFill style={{ opacity }}>
      <Background preset="neon-night" grain grid drift />
      <BrandTag label="GOLDENSEA" />

      <div style={{ position: 'absolute', left: 60, top: 200, ...anim.fadeUp(frame, 520) }}>
        <SceneLabel color={C.lime}>Crypto Snapshot</SceneLabel>
        <AccentLine color={C.lime} width={40} style={{ marginTop: 10 }} />
      </div>

      <div style={{
        position: 'absolute', left: 60, right: 60, top: 300, fontFamily: FONT,
        ...anim.wipeReveal(frame, 528, 22),
      }}>
        <div style={{ fontSize: 96, fontWeight: 900, color: C.white, lineHeight: 1.1 }}>THỊ TRƯỜNG</div>
        <div style={{ fontSize: 96, fontWeight: 900, color: C.cyan, lineHeight: 1.1 }}>ĐANG HỒI</div>
        <div style={{ fontSize: 96, fontWeight: 900, color: C.white, lineHeight: 1.1 }}>TRỞ LẠI</div>
      </div>

      {/* Bar chart */}
      <div style={{
        position: 'absolute', left: 60, right: 60, top: 760,
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 28, padding: '28px 28px 10px',
      }}>
        {coins.map((coin, i) => {
          const barW = interpolate(frame, [anim.stagger(i, 580, 16), anim.stagger(i, 580, 16) + 30], [0, coin.width], clamp);
          return (
            <div key={coin.name} style={{ marginBottom: 34, fontFamily: FONT }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                <span style={{ fontSize: 48, fontWeight: 900, color: C.white }}>{coin.name}</span>
                <span style={{ fontSize: 44, fontWeight: 900, color: coin.color }}>{coin.pct}</span>
              </div>
              <div style={{ height: 16, borderRadius: 999, background: 'rgba(255,255,255,0.12)', overflow: 'hidden' }}>
                <div style={{
                  height: '100%', width: `${barW * 100}%`,
                  background: coin.color,
                  borderRadius: 999,
                  boxShadow: `0 0 20px ${coin.color}99`,
                }} />
              </div>
            </div>
          );
        })}
      </div>

      <div style={{
        position: 'absolute', left: 60, right: 60, bottom: 130,
        color: 'rgba(255,255,255,0.55)', fontSize: 40, lineHeight: 1.3,
        fontWeight: 500, fontFamily: FONT,
        ...anim.fadeUp(frame, 650, 20),
      }}>
        Một phiên hồi phục tốt. Nhưng vẫn cần xác nhận, không chỉ cảm xúc.
      </div>
    </AbsoluteFill>
  );
};

// ─── SCENE 4 — PRICE LEVELS ───────────────────────────────────────────────────
// BG: electric-aurora (high energy, dramatic chart reveal)
// Anim: wipeReveal chart line draw
const LevelsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = fadeScene(frame, 795, 285);
  const draw = interpolate(frame, [835, 1050], [0, 1], clamp);

  const points: Array<{ price: string; label: string; color: string; pct: number; y: number }> = [
    { price: '60K–65K', label: 'hỗ trợ',       color: C.coral,      pct: 0.13, y: 420 },
    { price: '74.5K',   label: 'xác nhận',      color: C.goldBright, pct: 0.46, y: 300 },
    { price: '82K',     label: 'mục tiêu',      color: C.cyan,       pct: 0.70, y: 215 },
    { price: '100K',    label: 'kịch bản mạnh', color: C.lime,       pct: 0.93, y: 105 },
  ];

  return (
    <AbsoluteFill style={{ opacity }}>
      <Background preset="electric-aurora" grain drift />
      <BrandTag />

      <div style={{ position: 'absolute', left: 60, top: 200, ...anim.fadeUp(frame, 805) }}>
        <SceneLabel color={C.pink}>Before You Buy</SceneLabel>
        <AccentLine color={C.pink} width={40} style={{ marginTop: 10 }} />
      </div>

      <BigTitle
        frame={frame} start={810} top={295} size={100}
        lines={[
          { text: 'BẢN ĐỒ', color: C.white },
          { text: 'GIÁ BTC', color: C.goldBright },
        ]}
      />

      {/* Chart card */}
      <div style={{
        position: 'absolute', left: 60, right: 60, top: 620,
        background: 'rgba(0,0,0,0.35)',
        border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: 28, padding: 32,
        ...anim.fadeUp(frame, 825, 18),
      }}>
        <svg width="900" height="460" viewBox="0 0 900 460" style={{ display: 'block' }}>
          <line x1="40" y1="400" x2="860" y2="400" stroke="rgba(255,255,255,0.2)" strokeWidth="3" />
          <path
            d="M55 375 C 170 360, 220 300, 330 288 C 445 272, 498 195, 612 178 C 730 160, 775 75, 845 45"
            fill="none"
            stroke={C.goldBright}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray="1200"
            strokeDashoffset={1200 - draw * 1200}
            style={{ filter: `drop-shadow(0 0 12px ${C.goldBright}99)` }}
          />
          {points.map((p) => {
            const x = 55 + p.pct * 790;
            const yy = p.y - 60;
            const vis = interpolate(draw, [p.pct - 0.06, p.pct + 0.04], [0, 1], clamp);
            return (
              <g key={p.price} opacity={vis}>
                <circle cx={x} cy={yy} r={14} fill={p.color} style={{ filter: `drop-shadow(0 0 8px ${p.color})` }} />
                <text x={x - 52} y={yy - 28} fill={p.color} fontSize={32} fontWeight={900}>{p.price}</text>
                <text x={x - 55} y={yy + 48} fill="rgba(255,255,255,0.55)" fontSize={22} fontWeight={700}>{p.label}</text>
              </g>
            );
          })}
        </svg>

        {/* Grid chips */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 14 }}>
          {points.map((p) => (
            <div key={p.price + '-chip'} style={{
              padding: '14px 18px', borderRadius: 14, fontFamily: FONT,
              background: `${p.color}18`,
              border: `1px solid ${p.color}44`,
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <span style={{ color: p.color, fontSize: 28, fontWeight: 900 }}>{p.price}</span>
              <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: 22, fontWeight: 700 }}>{p.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{
        position: 'absolute', left: 60, right: 60, bottom: 120,
        color: C.white, fontSize: 44, fontWeight: 900, lineHeight: 1.25,
        fontFamily: FONT, letterSpacing: -0.5,
        ...anim.fadeUp(frame, 1020, 18),
      }}>
        Hỗ trợ là vùng cần giữ. 74.500 đô là vùng cần lấy lại.
      </div>
    </AbsoluteFill>
  );
};

// ─── SCENE 5 — CTA ────────────────────────────────────────────────────────────
// BG: warm-paper (calm, human, outro)
// Anim: fadeUp
const CtaScene: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = fadeScene(frame, 1080, 120);

  return (
    <AbsoluteFill style={{ opacity }}>
      <Background preset="warm-paper" grain drift />
      <BrandTag label="GOLDENSEA" />

      <div style={{ position: 'absolute', left: 60, top: 220, ...anim.fadeUp(frame, 1090) }}>
        <SceneLabel color="#D4520A">Kết Luận Nhanh</SceneLabel>
        <AccentLine color="#D4520A" width={40} style={{ marginTop: 10 }} />
      </div>

      <BigTitle
        frame={frame} start={1096} top={330} size={96}
        lines={[
          { text: 'DÒNG TIỀN LỚN', color: '#2A1800' },
          { text: 'ĐANG QUAY',     color: '#D4520A'  },
          { text: 'TRỞ LẠI',       color: '#2A1800'  },
        ]}
      />

      <div style={{
        position: 'absolute', left: 60, right: 60, top: 860,
        color: 'rgba(42,24,0,0.6)', fontSize: 48, fontWeight: 500,
        lineHeight: 1.3, fontFamily: FONT,
        ...anim.fadeUp(frame, 1112, 20),
      }}>
        Đi chậm. Quan sát kỹ. Quản trị rủi ro.
      </div>

      <div style={{
        position: 'absolute', left: 60, bottom: 130,
        ...anim.popIn(frame, 1130),
      }}>
        <Pill bg="#D4520A" color={C.white}>Lưu lại nếu bạn đang theo dõi Bitcoin</Pill>
      </div>
    </AbsoluteFill>
  );
};

// ─── AUDIO ────────────────────────────────────────────────────────────────────
const AudioBed: React.FC = () => {
  const frame = useCurrentFrame();
  const musicVol = Math.min(
    interpolate(frame, [0, 18], [0, 0.1], clamp),
    interpolate(frame, [DURATION - FPS * 5, DURATION], [0.1, 0.03], clamp)
  );
  return (
    <>
      <Audio src={staticFile('btc-strategy-voice.wav')} volume={1} />
      <Audio src={staticFile('btc-strategy-bg.mp3')} volume={musicVol} loop />
    </>
  );
};

// ─── ROOT EXPORT ─────────────────────────────────────────────────────────────
export const BTCStrategyUpdate: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: C.midnight, fontFamily: FONT }}>
    <HookScene />
    <StrategyScene />
    <MarketScene />
    <LevelsScene />
    <CtaScene />
    <AudioBed />
  </AbsoluteFill>
);
