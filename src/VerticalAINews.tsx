import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

const orange = '#ff4f2f';
const amber = '#ffb02e';
const white = '#f7f7f2';

const scenes = [
  {
    from: 0,
    duration: 135,
    kicker: 'TIN AI NÓNG',
    title: 'ANTHROPIC GỌI THÊM',
    accent: '65 TỶ ĐÔ',
    sub: 'trước thềm IPO',
  },
  {
    from: 135,
    duration: 165,
    kicker: 'CON SỐ THỨ HAI',
    title: 'ĐỊNH GIÁ GẦN',
    accent: '1 NGHÌN TỶ ĐÔ',
    sub: 'AI giờ là cuộc chơi vốn rất lớn',
  },
  {
    from: 300,
    duration: 210,
    kicker: 'LLM 2026',
    title: 'KHÔNG CÒN LÀ DEMO',
    accent: 'CHO VUI',
    sub: 'tiền thật, hạ tầng thật, khách hàng thật',
  },
  {
    from: 510,
    duration: 240,
    kicker: 'CUỘC ĐUA',
    title: 'OPENAI ỒN ÀO',
    accent: 'ANTHROPIC GOM LỰC',
    sub: 'Claude, compute và AI an toàn hơn',
  },
  {
    from: 750,
    duration: 240,
    kicker: 'TAKEAWAY',
    title: 'AI THẮNG BẰNG',
    accent: 'MODEL + VỐN + NIỀM TIN',
    sub: 'đường dài mới là thứ đáng xem',
  },
  {
    from: 990,
    duration: 150,
    kicker: 'THEO DÕI',
    title: 'TÓM TIN AI',
    accent: 'MỖI NGÀY',
    sub: 'nhanh, dễ hiểu, không buồn ngủ',
  },
];

const fitText = (text: string, base: number) => {
  if (text.length > 22) {
    return base * 0.72;
  }
  if (text.length > 16) {
    return base * 0.82;
  }
  return base;
};

const Scene: React.FC<{
  kicker: string;
  title: string;
  accent: string;
  sub: string;
}> = ({kicker, title, accent, sub}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 16, stiffness: 95}});
  const exit = interpolate(frame, [115, 145], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const scale = interpolate(enter, [0, 1], [0.94, 1]);
  const y = interpolate(enter, [0, 1], [55, 0]);
  const opacity = enter * exit;

  return (
    <AbsoluteFill
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        opacity,
        transform: `translateY(${y}px) scale(${scale})`,
        padding: 54,
      }}
    >
      <div
        style={{
          marginBottom: 56,
          border: `1px solid ${orange}`,
          color: orange,
          borderRadius: 10,
          padding: '12px 22px',
          fontFamily: 'Consolas, monospace',
          fontSize: 28,
          letterSpacing: 0,
          background: 'rgba(255,79,47,0.08)',
        }}
      >
        {kicker}
      </div>

      <div
        style={{
          color: white,
          fontFamily: 'Arial, sans-serif',
          fontWeight: 900,
          fontSize: fitText(title, 88),
          lineHeight: 0.95,
          textAlign: 'center',
          textShadow: '0 4px 0 rgba(0,0,0,0.55)',
          maxWidth: 970,
        }}
      >
        {title}
      </div>

      <div
        style={{
          width: 1080,
          height: 5,
          marginTop: 28,
          background: orange,
          boxShadow: `0 0 22px ${orange}`,
        }}
      />

      <div
        style={{
          color: orange,
          fontFamily: 'Arial, sans-serif',
          fontWeight: 900,
          fontSize: fitText(accent, 112),
          lineHeight: 0.92,
          textAlign: 'center',
          marginTop: 34,
          maxWidth: 1040,
          textShadow: '0 5px 0 rgba(0,0,0,0.55)',
        }}
      >
        {accent}
      </div>

      <div
        style={{
          width: 1080,
          height: 5,
          marginTop: 32,
          background: orange,
          boxShadow: `0 0 22px ${orange}`,
        }}
      />

      <div
        style={{
          marginTop: 118,
          color: white,
          fontFamily: 'Arial, sans-serif',
          fontSize: fitText(sub, 45),
          lineHeight: 1.14,
          fontWeight: 800,
          textAlign: 'center',
          maxWidth: 900,
          textShadow: '0 4px 0 rgba(0,0,0,0.6)',
        }}
      >
        {sub}
      </div>
    </AbsoluteFill>
  );
};

export const VerticalAINews: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const progress = frame / durationInFrames;
  const bgScale = interpolate(frame, [0, durationInFrames], [1.07, 1.18]);
  const rotate = interpolate(frame, [0, durationInFrames], [-1.4, 1.4]);
  const pulse = Math.sin(frame / 18) * 0.5 + 0.5;

  return (
    <AbsoluteFill style={{backgroundColor: '#080808', overflow: 'hidden'}}>
      <Audio src={staticFile('voiceover-reels.wav')} startFrom={0} />
      <Audio src={staticFile('background-music-20pct.wav')} volume={0.2} />

      <AbsoluteFill>
        <Img
          src={staticFile('article-og.png')}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'blur(26px) saturate(1.2)',
            opacity: 0.34,
            transform: `scale(${bgScale}) rotate(${rotate}deg)`,
          }}
        />
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          background:
            'radial-gradient(circle at 50% 42%, rgba(255,176,46,0.16), transparent 32%), radial-gradient(circle at 12% 65%, rgba(255,79,47,0.20), transparent 28%), rgba(0,0,0,0.68)',
        }}
      />

      <AbsoluteFill
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px)',
          backgroundSize: '100% 64px',
          opacity: 0.85,
        }}
      />

      <div
        style={{
          position: 'absolute',
          left: 34,
          top: 38,
          right: 34,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          color: white,
          fontFamily: 'Arial, sans-serif',
          fontSize: 28,
          fontWeight: 700,
          opacity: 0.92,
        }}
      >
        <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
          <div
            style={{
              width: 58,
              height: 58,
              borderRadius: 58,
              background: 'rgba(255,255,255,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ▶
          </div>
          AI NEWS
        </div>
        <div>Theo dõi</div>
      </div>

      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: 1080,
          height: 1920,
          boxShadow: `inset 0 0 220px rgba(0,0,0,0.88), inset 0 0 ${
            95 + pulse * 40
          }px rgba(255,79,47,0.16)`,
        }}
      />

      {scenes.map((scene) => (
        <Sequence key={scene.from} from={scene.from} durationInFrames={scene.duration}>
          <Scene {...scene} />
        </Sequence>
      ))}

      <div
        style={{
          position: 'absolute',
          left: 80,
          right: 80,
          bottom: 96,
          height: 6,
          background: 'rgba(255,255,255,0.88)',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${progress * 100}%`,
            background: `linear-gradient(90deg, ${orange}, ${amber})`,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
