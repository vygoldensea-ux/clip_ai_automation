import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
} from 'remotion';

const fps = 30;
const duration = 40 * fps;

const ink = '#fff7ed';
const softInk = '#f3eadf';
const paper = '#17121c';
const warmPaper = 'rgba(255,159,28,0.13)';
const orange = '#ff9f1c';
const purple = '#c084fc';
const red = '#ef4444';
const green = '#22c55e';
const blue = '#38d9ff';
const navy = '#102033';
const line = 'rgba(255,255,255,0.085)';
const font = '"BTC Young", serif';

const clamp = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

const fontFaceCss = `
@font-face {
  font-family: "BTC Young";
  src: url("${staticFile('assets/fonts/young/Young-Typeface.otf')}") format("opentype");
  font-weight: 400;
}
@font-face {
  font-family: "BTC Young";
  src: url("${staticFile('assets/fonts/young/Young-Typeface.otf')}") format("opentype");
  font-weight: 500;
}
@font-face {
  font-family: "BTC Young";
  src: url("${staticFile('assets/fonts/young/Young-Typeface-Bold-Display.otf')}") format("opentype");
  font-weight: 600;
}
@font-face {
  font-family: "BTC Young";
  src: url("${staticFile('assets/fonts/young/Young-Typeface-Bold-Display.otf')}") format("opentype");
  font-weight: 700;
}
@font-face {
  font-family: "BTC Young";
  src: url("${staticFile('assets/fonts/young/Young-Typeface-Bold-Display.otf')}") format("opentype");
  font-weight: 800;
}
@font-face {
  font-family: "BTC Young";
  src: url("${staticFile('assets/fonts/young/Young-Typeface-Bold-Display.otf')}") format("opentype");
  font-weight: 900;
}
* { box-sizing: border-box; }
`;

const fadeScene = (frame: number, start: number, length: number) => {
  const enter = interpolate(frame, [start, start + 14], [0, 1], clamp);
  const exit = interpolate(frame, [start + length - 16, start + length], [1, 0], clamp);
  return Math.min(enter, exit);
};

const slideIn = (frame: number, start: number, distance = 28) =>
  interpolate(frame, [start, start + 18], [distance, 0], clamp);

const ease = (frame: number, start: number, end: number, from: number, to: number) =>
  interpolate(frame, [start, end], [from, to], clamp);

const Background: React.FC<{variant?: 'hero' | 'data' | 'chart'}> = ({variant = 'hero'}) => {
  const frame = useCurrentFrame();
  const drift = ease(frame, 0, duration, 0, -18);
  const scale = ease(frame, 0, duration, 1, 1.018);
  const isHero = variant === 'hero';
  const isData = variant === 'data';
  const tileRows = isChartBackground(variant) ? 6 : 5;
  const bgGradient =
    variant === 'hero'
      ? 'linear-gradient(180deg, #061A56 0%, #008FE4 48%, #F06C31 100%)'
      : variant === 'data'
        ? 'linear-gradient(180deg, #062744 0%, #2A8AB0 45%, #F6A24D 100%)'
        : 'radial-gradient(circle at 18% 70%, #FF7B35 0%, transparent 30%), radial-gradient(circle at 80% 74%, #BCEEFF 0%, transparent 28%), linear-gradient(180deg, #FFFBE9 0%, #FFE78D 42%, #FAD87D 100%)';

  return (
    <AbsoluteFill
      style={{
        background: bgGradient,
        overflow: 'hidden',
        fontFamily: font,
      }}
    >
      <style>{fontFaceCss}</style>
      <AbsoluteFill
        style={{
          transform: `translateY(${drift}px) scale(${scale})`,
          backgroundImage:
            variant === 'chart'
              ? 'linear-gradient(90deg, rgba(35,32,24,0.065) 1px, transparent 1px), linear-gradient(rgba(35,32,24,0.04) 1px, transparent 1px)'
              : `linear-gradient(90deg, rgba(255,255,255,0.13) 1px, transparent 1px), linear-gradient(rgba(255,255,255,0.055) 1px, transparent 1px)`,
          backgroundSize: '116px 116px',
          backgroundPosition: '72px 0',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            variant === 'chart'
              ? 'linear-gradient(180deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.05) 38%, rgba(17,13,22,0.28) 100%)'
              : 'linear-gradient(180deg, rgba(4,10,24,0.42) 0%, rgba(4,10,24,0.16) 42%, rgba(15,9,20,0.44) 100%)',
        }}
      />
      {isHero ? (
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: 170,
            width: 2,
            height: 610,
            background: 'linear-gradient(180deg, transparent, rgba(255,255,255,0.5), transparent)',
            opacity: 0.55,
          }}
        />
      ) : null}
      <div
        style={{
          position: 'absolute',
          left: isData ? 68 : 98,
          right: isData ? 68 : 98,
          bottom: isData ? 175 : 120,
          height: isData ? 330 : 440,
          opacity: variant === 'chart' ? 0.22 : isData ? 0.28 : 0.32,
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gridAutoRows: 76,
          gap: 10,
        }}
      >
        {Array.from({length: 7 * tileRows}).map((_, i) => (
          <div
            key={i}
            style={{
              borderRadius: isData ? 12 : 16,
              background: i % 4 === 0 ? 'rgba(255,255,255,0.26)' : 'rgba(255,255,255,0.1)',
              boxShadow: '0 10px 34px rgba(0,0,0,0.12)',
            }}
          />
        ))}
      </div>
    </AbsoluteFill>
  );
};

const isChartBackground = (variant: 'hero' | 'data' | 'chart') => variant === 'chart';

const Label: React.FC<{children: React.ReactNode; color?: string}> = ({children, color = purple}) => (
  <div
    style={{
      color,
      fontSize: 34,
      lineHeight: 1.28,
      fontWeight: 800,
      letterSpacing: 1.4,
      textTransform: 'uppercase',
      textShadow: '0 0 18px rgba(0,0,0,0.36)',
    }}
  >
    {children}
  </div>
);

const Pill: React.FC<{children: React.ReactNode; color?: string}> = ({children, color = purple}) => (
  <div
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 999,
      padding: '13px 26px',
      color,
      background: 'rgba(22,17,28,0.92)',
      border: `1px solid ${color}55`,
      boxShadow: `0 12px 36px rgba(0,0,0,0.28), 0 0 24px ${color}22`,
      fontWeight: 900,
      fontSize: 29,
    }}
  >
    {children}
  </div>
);

const ArticlePhoto: React.FC<{frame: number; start: number}> = ({frame, start}) => {
  const zoom = ease(frame, start, start + 230, 1.02, 1.1);
  return (
    <div
      style={{
        position: 'absolute',
        left: 90,
        top: 940,
        width: 900,
        height: 480,
        borderRadius: 34,
        overflow: 'hidden',
        boxShadow: '0 28px 84px rgba(0,0,0,0.18)',
        border: '8px solid rgba(255,255,255,0.72)',
      }}
    >
      <Img
        src={staticFile('assets/btc-strategy-20260616/thanhnien-btc-eth-coins.jpg')}
        style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${zoom})`}}
      />
      <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(0deg, rgba(0,0,0,0.22), transparent 60%)'}} />
    </div>
  );
};

const BigTitle: React.FC<{
  lines: Array<{text: string; color?: string}>;
  top?: number;
  size?: number;
  frame: number;
  start: number;
}> = ({lines, top = 250, size = 124, frame, start}) => {
  return (
    <div style={{position: 'absolute', left: 104, right: 82, top}}>
      {lines.map((lineItem, i) => (
        <div
          key={lineItem.text}
          style={{
            color: lineItem.color ?? ink,
            fontSize: size,
            fontWeight: 900,
            lineHeight: 1.2,
            letterSpacing: -0.8,
            textShadow: '0 12px 34px rgba(0,0,0,0.32)',
            transform: `translateY(${slideIn(frame, start + i * 8)}px)`,
            opacity: ease(frame, start + i * 8, start + 20 + i * 8, 0, 1),
          }}
        >
          {lineItem.text}
        </div>
      ))}
    </div>
  );
};

const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = fadeScene(frame, 0, 225);
  return (
    <AbsoluteFill style={{opacity}}>
      <Background variant="hero" />
      <div style={{position: 'absolute', left: 104, top: 220}}>
        <Label>Market update</Label>
      </div>
      <BigTitle
        frame={frame}
        start={10}
        top={335}
        size={116}
        lines={[
          {text: 'BITCOIN'},
          {text: 'VƯỢT', color: purple},
          {text: '67.000 USD', color: orange},
        ]}
      />
      <div
        style={{
          position: 'absolute',
          left: 110,
          top: 800,
          width: 700,
          color: softInk,
          fontSize: 50,
          fontWeight: 500,
          lineHeight: 1.08,
          transform: `translateY(${slideIn(frame, 42)}px)`,
          opacity: ease(frame, 42, 64, 0, 1),
        }}
      >
        Nhưng tin nóng không có nghĩa là mua vội.
      </div>
      <ArticlePhoto frame={frame} start={60} />
      <div style={{position: 'absolute', left: 108, top: 1440}}>
        <Pill color={orange}>Strategy vừa gom thêm 100 triệu đô la Bitcoin</Pill>
      </div>
      <div style={{position: 'absolute', left: 108, bottom: 160}}>
        <Pill color={purple}>Quan sát vùng giá trước khi hành động</Pill>
      </div>
    </AbsoluteFill>
  );
};

const StrategyScene: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = fadeScene(frame, 225, 285);
  const items = [
    ['1.587', 'Bitcoin mua thêm', orange],
    ['100M USD', 'giá trị thương vụ', purple],
    ['846.842', 'Bitcoin đang nắm giữ', ink],
  ] as const;

  return (
    <AbsoluteFill style={{opacity}}>
      <Background variant="data" />
      <div style={{position: 'absolute', left: 104, top: 200}}>
        <Label color={orange}>New post</Label>
      </div>
      <BigTitle
        frame={frame}
        start={245}
        top={300}
        size={106}
        lines={[
          {text: 'STRATEGY'},
          {text: 'GOM THÊM', color: ink},
          {text: 'BITCOIN', color: purple},
        ]}
      />
      <div
        style={{
          position: 'absolute',
          left: 104,
          top: 735,
          width: 760,
          color: softInk,
          fontSize: 45,
          lineHeight: 1.18,
          fontWeight: 500,
        }}
      >
        Một thương vụ đủ lớn để thị trường phải nhìn lại dòng tiền tổ chức.
      </div>
      <div style={{position: 'absolute', left: 82, right: 82, top: 1010, display: 'grid', gap: 24}}>
        {items.map(([value, label, color], i) => (
          <div
            key={value}
            style={{
              height: 164,
              borderRadius: 28,
              padding: '26px 34px',
              background: i === 1 ? warmPaper : 'rgba(255,255,255,0.09)',
              border: '1px solid rgba(255,255,255,0.12)',
              boxShadow: '0 20px 58px rgba(0,0,0,0.28)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              opacity: ease(frame, 335 + i * 18, 360 + i * 18, 0, 1),
              transform: `translateY(${slideIn(frame, 335 + i * 18, 36)}px)`,
            }}
          >
            <div style={{color, fontSize: 76, fontWeight: 900, letterSpacing: -1}}>{value}</div>
            <div style={{color: softInk, fontSize: 33, fontWeight: 800, textAlign: 'right', maxWidth: 320}}>{label}</div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

const MarketScene: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = fadeScene(frame, 510, 285);
  const data = [
    ['BTC', '+1,03%', orange, 0.62],
    ['ETH', '+4,3%', blue, 0.78],
    ['SOL', '+4,05%', green, 0.76],
    ['HYPE', '+5,71%', purple, 0.9],
  ] as const;

  return (
    <AbsoluteFill style={{opacity}}>
      <Background variant="data" />
      <div style={{position: 'absolute', left: 104, top: 190}}>
        <Label color={purple}>Crypto snapshot</Label>
      </div>
      <BigTitle
        frame={frame}
        start={525}
        top={285}
        size={96}
        lines={[
          {text: 'THỊ TRƯỜNG'},
          {text: 'ĐANG HỒI', color: purple},
          {text: 'TRỞ LẠI', color: ink},
        ]}
      />
      <div
        style={{
          position: 'absolute',
          left: 82,
          right: 82,
          top: 780,
          borderRadius: 34,
          padding: '34px 34px 18px',
          background: 'rgba(255,255,255,0.1)',
          border: '1px solid rgba(255,255,255,0.14)',
          boxShadow: '0 24px 70px rgba(0,0,0,0.3)',
        }}
      >
        {data.map(([name, value, color, width], i) => {
          const grow = ease(frame, 585 + i * 16, 645 + i * 16, 0, width);
          return (
            <div key={name} style={{marginBottom: 40}}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'}}>
                <div style={{color: ink, fontSize: 54, fontWeight: 900}}>{name}</div>
                <div style={{color, fontSize: 48, fontWeight: 900}}>{value}</div>
              </div>
              <div style={{height: 20, borderRadius: 999, background: 'rgba(255,255,255,0.18)', overflow: 'hidden', marginTop: 14}}>
                <div
                  style={{
                    height: '100%',
                    width: `${grow * 100}%`,
                    borderRadius: 999,
                    background: color,
                    boxShadow: `0 0 28px ${color}`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
      <div
        style={{
          position: 'absolute',
          left: 104,
          right: 104,
          bottom: 165,
          color: softInk,
          fontSize: 43,
          lineHeight: 1.18,
          fontWeight: 500,
        }}
      >
        Một phiên hồi phục tốt. Nhưng vẫn cần xác nhận, không chỉ cảm xúc.
      </div>
    </AbsoluteFill>
  );
};

const LevelsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = fadeScene(frame, 795, 285);
  const draw = ease(frame, 835, 1035, 0, 1);
  const points = [
    ['60K-65K', 'hỗ trợ', red, 0.13, 420],
    ['74.5K', 'xác nhận', orange, 0.46, 300],
    ['82K', 'mục tiêu', purple, 0.7, 215],
    ['100K', 'kịch bản mạnh', green, 0.93, 105],
  ] as const;

  return (
    <AbsoluteFill style={{opacity}}>
      <Background variant="chart" />
      <div style={{position: 'absolute', left: 104, top: 190}}>
        <Label color={orange}>Before you buy</Label>
      </div>
      <BigTitle
        frame={frame}
        start={815}
        top={285}
        size={104}
        lines={[
          {text: 'BẢN ĐỒ', color: navy},
          {text: 'GIÁ BTC', color: orange},
        ]}
      />
      <div
        style={{
          position: 'absolute',
          left: 82,
          right: 82,
          top: 625,
          height: 710,
          borderRadius: 34,
          padding: 38,
          background: 'rgba(255,255,255,0.1)',
          border: '1px solid rgba(255,255,255,0.14)',
          boxShadow: '0 24px 70px rgba(0,0,0,0.3)',
        }}
      >
        <svg width="900" height="495" viewBox="0 0 900 495">
          <line x1="58" y1="425" x2="842" y2="425" stroke="rgba(255,255,255,0.24)" strokeWidth="4" />
          <path
            d="M70 395 C 185 385, 230 330, 334 320 C 450 305, 500 220, 610 205 C 735 188, 780 94, 840 62"
            fill="none"
            stroke={orange}
            strokeWidth="11"
            strokeLinecap="round"
            strokeDasharray="1120"
            strokeDashoffset={1120 - draw * 1120}
            style={{filter: 'drop-shadow(0 0 14px rgba(247,147,26,0.55))'}}
          />
          {points.map(([price, label, color, pct, y], i) => {
            const x = 70 + pct * 770;
            const visible = ease(draw, pct - 0.08, pct, 0, 1);
            const yy = y - 75;
            return (
              <g key={price} opacity={visible}>
                <circle cx={x} cy={yy} r="16" fill={color} />
                <text x={x - 58} y={yy - 34} fill={color} fontSize="36" fontWeight="900">
                  {price}
                </text>
                <text x={x - 62} y={yy + 56} fill={softInk} fontSize="26" fontWeight="800">
                  {label}
                </text>
              </g>
            );
          })}
        </svg>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 16,
            marginTop: 8,
          }}
        >
          {points.map(([price, label, color], i) => (
            <div
              key={`${price}-chip`}
              style={{
                minHeight: 72,
                borderRadius: 18,
                padding: '14px 18px',
                background: i === 0 ? 'rgba(239,68,68,0.25)' : 'rgba(16,32,51,0.12)',
                border: '1px solid rgba(255,255,255,0.1)',
                color,
                fontSize: 28,
                fontWeight: 900,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <span>{price}</span>
              <span style={{color: navy, fontSize: 22, fontWeight: 800}}>{label}</span>
            </div>
          ))}
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          left: 104,
          right: 104,
          bottom: 165,
          color: navy,
          fontSize: 47,
          lineHeight: 1.18,
          fontWeight: 900,
          letterSpacing: -1.2,
        }}
      >
        Hỗ trợ là vùng cần giữ. 74.500 đô la là vùng cần lấy lại.
      </div>
    </AbsoluteFill>
  );
};

const CtaScene: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = fadeScene(frame, 1080, 120);
  return (
    <AbsoluteFill style={{opacity}}>
      <Background variant="chart" />
      <div style={{position: 'absolute', left: 104, top: 235}}>
        <Label color={purple}>Kết luận nhanh</Label>
      </div>
      <BigTitle
        frame={frame}
        start={1095}
        top={360}
        size={98}
        lines={[
          {text: 'DÒNG TIỀN LỚN', color: navy},
          {text: 'ĐANG QUAY', color: purple},
          {text: 'TRỞ LẠI', color: orange},
        ]}
      />
      <div
        style={{
          position: 'absolute',
          left: 104,
          right: 160,
          top: 890,
          color: navy,
          fontSize: 52,
          fontWeight: 500,
          lineHeight: 1.18,
        }}
      >
        Đi chậm. Quan sát kỹ. Quản trị rủi ro.
      </div>
      <div style={{position: 'absolute', left: 104, bottom: 165}}>
        <Pill color={orange}>Lưu lại nếu bạn đang theo dõi Bitcoin</Pill>
      </div>
    </AbsoluteFill>
  );
};

const AudioBed: React.FC = () => {
  const frame = useCurrentFrame();
  const musicVol = Math.min(
    interpolate(frame, [0, 18], [0, 0.1], clamp),
    interpolate(frame, [duration - fps * 5, duration], [0.1, 0.03], clamp)
  );

  return (
    <>
      <Audio src={staticFile('btc-strategy-voice.wav')} volume={1} />
      <Audio src={staticFile('btc-strategy-bg.mp3')} volume={musicVol} loop />
    </>
  );
};

export const BTCStrategyUpdate: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: paper, fontFamily: font}}>
      <HookScene />
      <StrategyScene />
      <MarketScene />
      <LevelsScene />
      <CtaScene />
      <AudioBed />
    </AbsoluteFill>
  );
};
