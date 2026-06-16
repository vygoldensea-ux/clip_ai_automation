import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

const btc = '#f7931a';
const red = '#ff4f2f';
const green = '#20e08a';
const white = '#f7f7f2';
const muted = '#b8b2a6';

const price = 73476;
const high = 75104;
const low = 72559;
const change = -2.17;

const fmt = (n: number) => `$${Math.round(n).toLocaleString('en-US')}`;

const sceneOpacity = (frame: number, duration: number) => {
  const enter = interpolate(frame, [0, 18], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const exit = interpolate(frame, [duration - 24, duration], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return Math.min(enter, exit);
};

const BigText: React.FC<{
  top?: string;
  main: string;
  accent: string;
  sub: string;
  duration: number;
}> = ({top, main, accent, sub, duration}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 18, stiffness: 110}});
  const y = interpolate(enter, [0, 1], [52, 0]);
  const scale = interpolate(enter, [0, 1], [0.94, 1]);

  return (
    <AbsoluteFill
      style={{
        opacity: sceneOpacity(frame, duration),
        alignItems: 'center',
        justifyContent: 'center',
        padding: 58,
        transform: `translateY(${y}px) scale(${scale})`,
      }}
    >
      <div
        style={{
          border: `1px solid ${btc}`,
          color: btc,
          borderRadius: 12,
          padding: '12px 22px',
          fontFamily: 'Consolas, monospace',
          fontSize: 30,
          background: 'rgba(247,147,26,0.08)',
        }}
      >
        {top ?? 'BTC HOM NAY'}
      </div>
      <div
        style={{
          color: white,
          fontFamily: 'Arial, sans-serif',
          fontWeight: 900,
          fontSize: main.length > 18 ? 78 : 92,
          lineHeight: 0.98,
          textAlign: 'center',
          marginTop: 70,
          textShadow: '0 6px 0 rgba(0,0,0,0.55)',
        }}
      >
        {main}
      </div>
      <div
        style={{
          width: 1080,
          height: 6,
          marginTop: 34,
          background: red,
          boxShadow: `0 0 30px ${red}`,
        }}
      />
      <div
        style={{
          color: btc,
          fontFamily: 'Arial, sans-serif',
          fontWeight: 900,
          fontSize: accent.length > 14 ? 86 : 122,
          lineHeight: 0.94,
          textAlign: 'center',
          marginTop: 38,
          textShadow: '0 6px 0 rgba(0,0,0,0.55)',
        }}
      >
        {accent}
      </div>
      <div
        style={{
          width: 1080,
          height: 6,
          marginTop: 34,
          background: red,
          boxShadow: `0 0 30px ${red}`,
        }}
      />
      <div
        style={{
          color: white,
          fontFamily: 'Arial, sans-serif',
          fontWeight: 800,
          fontSize: sub.length > 34 ? 34 : 44,
          lineHeight: 1.12,
          textAlign: 'center',
          marginTop: 116,
          maxWidth: 900,
          textShadow: '0 4px 0 rgba(0,0,0,0.62)',
        }}
      >
        {sub}
      </div>
    </AbsoluteFill>
  );
};

const PriceScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame, fps, config: {damping: 18, stiffness: 110}});
  const animated = interpolate(s, [0, 1], [70600, price]);
  return (
    <BigText
      duration={210}
      top="BTC PRICE"
      main="BITCOIN RUNG LAC"
      accent={fmt(animated)}
      sub={`${change.toFixed(2)}% trong 24h`}
    />
  );
};

const RangeScene: React.FC = () => {
  const frame = useCurrentFrame();
  const p = spring({frame, fps: 30, config: {damping: 18, stiffness: 90}});
  const w = interpolate(p, [0, 1], [0, 820]);
  return (
    <AbsoluteFill
      style={{
        opacity: sceneOpacity(frame, 210),
        alignItems: 'center',
        justifyContent: 'center',
        padding: 70,
      }}
    >
      <div
        style={{
          width: 900,
          border: '1px solid rgba(255,255,255,0.16)',
          borderRadius: 34,
          padding: 54,
          background: 'rgba(255,255,255,0.06)',
          fontFamily: 'Arial, sans-serif',
        }}
      >
        <div style={{color: muted, fontSize: 34}}>Bien do trong ngay</div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: 46,
            fontSize: 40,
            fontWeight: 900,
          }}
        >
          <span style={{color: red}}>LOW {fmt(low)}</span>
          <span style={{color: green}}>HIGH {fmt(high)}</span>
        </div>
        <div
          style={{
            marginTop: 60,
            height: 16,
            borderRadius: 16,
            background: 'rgba(255,255,255,0.18)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: w,
              background: `linear-gradient(90deg, ${red}, ${btc}, ${green})`,
            }}
          />
        </div>
        <div style={{color: white, fontSize: 78, fontWeight: 900, marginTop: 76}}>
          Vung can giu
        </div>
        <div style={{color: btc, fontSize: 112, fontWeight: 900, marginTop: 14}}>
          $72K
        </div>
      </div>
    </AbsoluteFill>
  );
};

const FlowScene: React.FC = () => {
  const frame = useCurrentFrame();
  const items = [
    ['ETF OUTFLOW', 'dong tien rut manh'],
    ['IBIT BLOCK TRADE', '~$1.29B'],
    ['RISK-OFF', 'chot loi + macro'],
  ];

  return (
    <AbsoluteFill
      style={{
        opacity: sceneOpacity(frame, 240),
        alignItems: 'center',
        justifyContent: 'center',
        padding: 70,
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <div style={{color: white, fontSize: 78, fontWeight: 900, marginBottom: 60}}>
        Vi sao BTC yeu?
      </div>
      {items.map(([a, b], i) => {
        const x = interpolate(frame, [i * 18, i * 18 + 28], [120, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        const opacity = interpolate(frame, [i * 18, i * 18 + 24], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        return (
          <div
            key={a}
            style={{
              width: 900,
              padding: '36px 42px',
              marginBottom: 28,
              borderRadius: 28,
              background: 'rgba(255,255,255,0.07)',
              border: '1px solid rgba(255,255,255,0.14)',
              transform: `translateX(${x}px)`,
              opacity,
            }}
          >
            <div style={{color: btc, fontSize: 42, fontWeight: 900}}>{a}</div>
            <div style={{color: white, fontSize: 34, marginTop: 8}}>{b}</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

const TakeawayScene: React.FC = () => (
  <BigText
    duration={240}
    top="TAKEAWAY"
    main="PHE MUA CHUA MAT TRAN"
    accent="$72K PHAI GIU"
    sub="Khong phai loi khuyen dau tu"
  />
);

export const BitcoinNews: React.FC = () => {
  const frame = useCurrentFrame();
  const progress = frame / 900;
  const glow = Math.sin(frame / 20) * 0.5 + 0.5;

  return (
    <AbsoluteFill style={{backgroundColor: '#060606', overflow: 'hidden'}}>
      <Audio src={staticFile('btc-voiceover.wav')} />
      <Audio src={staticFile('background-music-20pct.wav')} volume={0.18} />

      <AbsoluteFill
        style={{
          background:
            'radial-gradient(circle at 50% 28%, rgba(247,147,26,0.24), transparent 28%), radial-gradient(circle at 20% 74%, rgba(255,79,47,0.18), transparent 25%), #080806',
        }}
      />
      <AbsoluteFill
        style={{
          opacity: 0.16,
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.12) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
          transform: `translateY(${-frame * 0.25}px)`,
        }}
      />

      <div
        style={{
          position: 'absolute',
          top: 44,
          left: 54,
          right: 54,
          display: 'flex',
          justifyContent: 'space-between',
          color: white,
          fontFamily: 'Arial, sans-serif',
          fontSize: 32,
          fontWeight: 900,
          opacity: 0.9,
        }}
      >
        <div>BTC TODAY</div>
        <div>30s</div>
      </div>

      <Sequence from={0} durationInFrames={210}>
        <PriceScene />
      </Sequence>
      <Sequence from={210} durationInFrames={210}>
        <RangeScene />
      </Sequence>
      <Sequence from={420} durationInFrames={240}>
        <FlowScene />
      </Sequence>
      <Sequence from={660} durationInFrames={240}>
        <TakeawayScene />
      </Sequence>

      <div
        style={{
          position: 'absolute',
          inset: 0,
          boxShadow: `inset 0 0 230px rgba(0,0,0,0.92), inset 0 0 ${
            70 + glow * 60
          }px rgba(247,147,26,0.18)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 80,
          right: 80,
          bottom: 86,
          height: 8,
          background: 'rgba(255,255,255,0.18)',
          borderRadius: 8,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${progress * 100}%`,
            height: '100%',
            background: `linear-gradient(90deg, ${btc}, ${red})`,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
