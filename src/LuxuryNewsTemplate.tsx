import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import templateData from './data/luxury-news-template.sample.json';

type Phrase = {
  start: number;
  duration: number;
  text: string;
  highlight?: string;
};

type Metric = {
  label: string;
  value: string;
  detail: string;
};

type Scene = {
  kind: 'hook' | 'explain' | 'data' | 'cta';
  start: number;
  duration: number;
  title: string;
  accent?: string;
  subtitle?: string;
  phrases?: Phrase[];
  metrics?: Metric[];
};

type TemplateData = {
  durationInFrames: number;
  backgroundVariant: number;
  audioSrc: string;
  musicSrc?: string;
  kicker: string;
  source: string;
  cta: string;
  scenes: Scene[];
};

const data = templateData as TemplateData;

const gold = '#F5C542';
const goldLight = '#FFE08A';
const black = '#060606';
const white = '#F5F5F5';
const muted = '#B8B8B8';
const bodyText = '#E8E8E8';
const fontFamily = '"Be Vietnam Pro", sans-serif';

const clamp = {
  extrapolateLeft: 'clamp' as const,
  extrapolateRight: 'clamp' as const,
};

const fontFaceCss = `
@font-face {
  font-family: "Be Vietnam Pro";
  src: url("${staticFile('assets/fonts/BeVietnamPro-Regular.ttf')}") format("truetype");
  font-weight: 400;
}
@font-face {
  font-family: "Be Vietnam Pro";
  src: url("${staticFile('assets/fonts/BeVietnamPro-Medium.ttf')}") format("truetype");
  font-weight: 500;
}
@font-face {
  font-family: "Be Vietnam Pro";
  src: url("${staticFile('assets/fonts/BeVietnamPro-SemiBold.ttf')}") format("truetype");
  font-weight: 600;
}
@font-face {
  font-family: "Be Vietnam Pro";
  src: url("${staticFile('assets/fonts/BeVietnamPro-ExtraBold.ttf')}") format("truetype");
  font-weight: 800;
}
@font-face {
  font-family: "Be Vietnam Pro";
  src: url("${staticFile('assets/fonts/BeVietnamPro-Black.ttf')}") format("truetype");
  font-weight: 900;
}
* {
  font-family: "Be Vietnam Pro", sans-serif;
}
`;

const fadeFor = (frame: number, start: number, duration: number) => {
  const enter = interpolate(frame, [start, start + 18], [0, 1], clamp);
  const exit = interpolate(frame, [start + duration - 24, start + duration], [1, 0], clamp);
  return Math.min(enter, exit);
};

const sceneFrame = (frame: number, scene: Scene) => frame - scene.start;

const backgroundFor = (variant: number) => {
  const normalized = ((variant - 1) % 3) + 1;
  return staticFile(`news-backgrounds/bg-${normalized}.png`);
};

const splitHighlight = (text: string, highlight?: string) => {
  if (!highlight) {
    return [text, '', ''] as const;
  }
  const index = text.toLowerCase().indexOf(highlight.toLowerCase());
  if (index === -1) {
    return [text, '', ''] as const;
  }
  return [
    text.slice(0, index),
    text.slice(index, index + highlight.length),
    text.slice(index + highlight.length),
  ] as const;
};

const GlobalBackground: React.FC = () => {
  const frame = useCurrentFrame();
  const drift = interpolate(frame, [0, data.durationInFrames], [0, -18], clamp);
  const scale = interpolate(frame, [0, data.durationInFrames], [1, 1.02], clamp);
  const pulse = 0.7 + Math.sin(frame / 58) * 0.05;

  return (
    <AbsoluteFill style={{backgroundColor: black, overflow: 'hidden'}}>
      <Img
        src={backgroundFor(data.backgroundVariant)}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: 0.64,
          transform: `scale(${scale}) translateY(${drift}px)`,
        }}
      />
      <AbsoluteFill
        style={{
          background:
            'linear-gradient(180deg, rgba(0,0,0,0.38) 0%, rgba(6,6,6,0.2) 42%, rgba(0,0,0,0.64) 100%)',
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage:
            'linear-gradient(rgba(245,197,66,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(245,197,66,0.04) 1px, transparent 1px)',
          backgroundSize: '96px 96px',
          transform: `translateY(${drift * 0.3}px)`,
          opacity: 0.3,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: -180,
          right: -180,
          bottom: -230,
          height: 520,
          background: `radial-gradient(circle at 50% 70%, rgba(245,197,66,${0.22 * pulse}) 0%, rgba(169,120,24,${0.12 * pulse}) 30%, transparent 70%)`,
        }}
      />
      <AbsoluteFill
        style={{
          boxShadow: 'inset 0 0 170px rgba(0,0,0,0.82)',
        }}
      />
    </AbsoluteFill>
  );
};

const Chrome: React.FC = () => {
  return (
    <>
      <div
        style={{
          position: 'absolute',
          left: 76,
          top: 58,
          color: gold,
          fontFamily,
          fontSize: 22,
          fontWeight: 700,
          letterSpacing: 1.5,
          opacity: 0.88,
          textTransform: 'uppercase',
        }}
      >
        {data.kicker}
      </div>
    </>
  );
};

const ease = (value: number) => 1 - Math.pow(1 - value, 3);

const RevealText: React.FC<{
  children: React.ReactNode;
  delay?: number;
  localFrame: number;
  style?: React.CSSProperties;
  drift?: number;
}> = ({children, delay = 0, localFrame, style, drift = 0}) => {
  const raw = interpolate(localFrame - delay, [0, 24], [0, 1], clamp);
  const value = ease(raw);
  const y = interpolate(value, [0, 1], [22, 0]) - Math.max(0, localFrame - delay) * drift;
  const tracking = interpolate(value, [0, 1], [0.8, -1.4], clamp);
  return (
    <div
      style={{
        opacity: value,
        transform: `translateY(${y}px)`,
        letterSpacing: tracking,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

const HookScene: React.FC<{scene: Scene}> = ({scene}) => {
  const frame = useCurrentFrame();
  const local = sceneFrame(frame, scene);
  const float = Math.sin(local / 64) * 3;
  return (
    <AbsoluteFill
      style={{
        opacity: fadeFor(frame, scene.start, scene.duration),
        justifyContent: 'center',
        padding: '0 86px',
        fontFamily,
      }}
    >
      <RevealText localFrame={local} drift={0.018}>
        <div
          style={{
            color: gold,
            fontSize: 94,
            lineHeight: 0.9,
            fontWeight: 900,
            textTransform: 'uppercase',
            letterSpacing: '-0.04em',
            textShadow: '0 10px 28px rgba(0,0,0,0.5)',
            transform: `translateY(${float}px)`,
          }}
        >
          {scene.title}
        </div>
      </RevealText>
      <RevealText localFrame={local} delay={24}>
        <div
          style={{
            marginTop: 28,
            width: '100%',
            height: 1,
            background: `linear-gradient(90deg, rgba(245,197,66,0.08), rgba(245,197,66,0.55), rgba(245,197,66,0.08))`,
            opacity: 0.72,
          }}
        />
        <div
          style={{
            marginTop: 34,
            color: white,
            fontSize: 52,
            lineHeight: 0.98,
            fontWeight: 800,
            letterSpacing: '-0.025em',
            textTransform: 'uppercase',
          }}
        >
          {scene.accent}
        </div>
      </RevealText>
      <RevealText localFrame={local} delay={44}>
        <div
          style={{
            marginTop: 42,
            color: bodyText,
            fontFamily,
            fontSize: 30,
            lineHeight: 1.3,
            fontWeight: 400,
            maxWidth: 780,
          }}
        >
          {scene.subtitle}
        </div>
      </RevealText>
    </AbsoluteFill>
  );
};

const PhraseLine: React.FC<{phrase: Phrase}> = ({phrase}) => {
  const frame = useCurrentFrame();
  const local = frame - phrase.start;
  const visible = fadeFor(frame, phrase.start, phrase.duration);
  const [before, hit, after] = splitHighlight(phrase.text, phrase.highlight);
  const y = interpolate(local, [0, 24], [24, 0], clamp);
  return (
    <div
      style={{
        opacity: visible,
        transform: `translateY(${y}px)`,
        color: white,
        fontFamily,
        fontSize: 42,
        lineHeight: 1.22,
        fontWeight: 500,
        marginTop: 28,
      }}
    >
      {before}
      <span style={{color: gold, fontFamily, fontWeight: 800, textTransform: 'uppercase'}}>
        {hit}
      </span>
      {after}
    </div>
  );
};

const ExplainScene: React.FC<{scene: Scene}> = ({scene}) => {
  const frame = useCurrentFrame();
  const local = sceneFrame(frame, scene);
  return (
    <AbsoluteFill
      style={{
        opacity: fadeFor(frame, scene.start, scene.duration),
        padding: '330px 84px 0',
        fontFamily,
      }}
    >
      <RevealText localFrame={local} drift={0.012}>
        <div
          style={{
            color: goldLight,
            fontSize: 58,
            lineHeight: 0.94,
            fontWeight: 900,
            maxWidth: 900,
            letterSpacing: '-0.035em',
            textTransform: 'uppercase',
          }}
        >
          {scene.title}
        </div>
      </RevealText>
      <div style={{marginTop: 72}}>
        {(scene.phrases ?? []).map((phrase) => (
          <PhraseLine key={`${phrase.start}-${phrase.text}`} phrase={phrase} />
        ))}
      </div>
    </AbsoluteFill>
  );
};

const MetricCard: React.FC<{metric: Metric; index: number; scene: Scene}> = ({
  metric,
  index,
  scene,
}) => {
  const frame = useCurrentFrame();
  const local = frame - scene.start - 34 - index * 24;
  const raw = interpolate(local, [0, 22], [0, 1], clamp);
  const s = ease(raw);
  const y = interpolate(s, [0, 1], [24, 0]);
  return (
    <div
      style={{
        opacity: s,
        transform: `translateY(${y}px)`,
        borderRadius: 16,
        border: '1px solid rgba(245,197,66,0.18)',
        background: 'rgba(14,14,14,0.62)',
        padding: '28px 32px',
        marginTop: 24,
        boxShadow: '0 22px 70px rgba(0,0,0,0.28)',
      }}
    >
      <div
        style={{
          color: muted,
          fontFamily,
          fontSize: 20,
          fontWeight: 700,
          letterSpacing: 1.3,
          textTransform: 'uppercase',
        }}
      >
        {metric.label}
      </div>
      <div
        style={{
          color: index === 0 ? goldLight : gold,
          fontFamily,
          fontSize: 56,
          lineHeight: 0.94,
          fontWeight: 900,
          letterSpacing: '-0.035em',
          marginTop: 12,
          textTransform: 'uppercase',
        }}
      >
        {metric.value}
      </div>
      <div
        style={{
          color: bodyText,
          fontFamily,
          fontSize: 27,
          lineHeight: 1.24,
          fontWeight: 400,
          marginTop: 16,
          opacity: 0.9,
        }}
      >
        {metric.detail}
      </div>
    </div>
  );
};

const DataScene: React.FC<{scene: Scene}> = ({scene}) => {
  const frame = useCurrentFrame();
  const local = sceneFrame(frame, scene);
  return (
    <AbsoluteFill
      style={{
        opacity: fadeFor(frame, scene.start, scene.duration),
        padding: '250px 82px 0',
        fontFamily,
      }}
    >
      <RevealText localFrame={local} drift={0.012}>
        <div
          style={{
            color: white,
            fontSize: 76,
            lineHeight: 0.94,
            fontWeight: 900,
            letterSpacing: '-0.035em',
            textTransform: 'uppercase',
          }}
        >
          {scene.title}
        </div>
      </RevealText>
      <div style={{marginTop: 42}}>
        {(scene.metrics ?? []).map((metric, index) => (
          <MetricCard
            key={`${metric.label}-${metric.value}`}
            metric={metric}
            index={index}
            scene={scene}
          />
        ))}
      </div>
    </AbsoluteFill>
  );
};

const CtaScene: React.FC<{scene: Scene}> = ({scene}) => {
  const frame = useCurrentFrame();
  const local = sceneFrame(frame, scene);
  const breathe = Math.sin(local / 64) * 3;
  return (
    <AbsoluteFill
      style={{
        opacity: fadeFor(frame, scene.start, scene.duration),
        justifyContent: 'center',
        padding: '0 86px',
        fontFamily,
      }}
    >
      <RevealText localFrame={local}>
        <div
          style={{
            color: muted,
            fontSize: 26,
            fontWeight: 700,
            letterSpacing: 1.5,
            textTransform: 'uppercase',
            marginBottom: 26,
          }}
        >
          {scene.title}
        </div>
      </RevealText>
      <RevealText localFrame={local} delay={20}>
        <div
          style={{
            color: gold,
            fontSize: 86,
            lineHeight: 0.9,
            fontWeight: 900,
            letterSpacing: '-0.04em',
            textTransform: 'uppercase',
            transform: `translateY(${breathe}px)`,
          }}
        >
          {scene.accent}
        </div>
      </RevealText>
      <RevealText localFrame={local} delay={46}>
        <div
          style={{
            marginTop: 42,
            color: bodyText,
            fontFamily,
            fontSize: 30,
            lineHeight: 1.3,
            fontWeight: 400,
            opacity: 0.9,
          }}
        >
          {scene.subtitle}
        </div>
      </RevealText>
      <RevealText localFrame={local} delay={82}>
        <div
          style={{
            marginTop: 82,
            color: goldLight,
            fontFamily,
            fontSize: 27,
            fontWeight: 700,
            letterSpacing: 1.1,
            borderTop: '1px solid rgba(245,197,66,0.28)',
            paddingTop: 28,
            maxWidth: 740,
            textTransform: 'uppercase',
          }}
        >
          {data.cta}
        </div>
      </RevealText>
    </AbsoluteFill>
  );
};

const SceneRenderer: React.FC<{scene: Scene}> = ({scene}) => {
  if (scene.kind === 'hook') {
    return <HookScene scene={scene} />;
  }
  if (scene.kind === 'explain') {
    return <ExplainScene scene={scene} />;
  }
  if (scene.kind === 'data') {
    return <DataScene scene={scene} />;
  }
  return <CtaScene scene={scene} />;
};

const BackgroundMusic: React.FC<{src: string}> = ({src}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const volume = interpolate(frame, [0, 15, durationInFrames - 15, durationInFrames], [0, 0.2, 0.2, 0], clamp);

  return (
    <Audio src={staticFile(src)} volume={volume} loop />
  );
};

export const LuxuryNewsTemplate: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: black, fontFamily}}>
      <style>{fontFaceCss}</style>
      <GlobalBackground />
      {data.audioSrc ? <Audio src={staticFile(data.audioSrc)} volume={1} /> : null}
      {data.musicSrc ? <BackgroundMusic src={data.musicSrc} /> : null}
      {data.scenes.map((scene) => (
        <SceneRenderer key={`${scene.kind}-${scene.start}`} scene={scene} />
      ))}
      <div
        style={{
          position: 'absolute',
          left: 78,
          right: 78,
          bottom: 68,
          color: muted,
          fontFamily,
          fontSize: 21,
          fontWeight: 400,
          opacity: 0.58,
        }}
      >
        {data.source}
      </div>
      <Chrome />
    </AbsoluteFill>
  );
};
