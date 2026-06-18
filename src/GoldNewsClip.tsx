/**
 * GoldNewsClip — 40s vertical clip (1080×1920)
 * Tin: Giá vàng 18/6/2026 chịu sức ép sau tuyên bố Fed
 * Source: laodong.vn
 * Image: Unsplash free (gold bars)
 *
 * Structure (40s = 1200 frames @ 30fps):
 *  Scene 1 — Hook/Market Update    0–7.5s   (0–225f)   MarketUpdateOpening
 *  Scene 2 — PAS Pressure         7.5–17s   (225–510f)  PASPressureOpening
 *  Scene 3 — BAB Before/After     17–26.5s  (510–795f)  BABTransformationOpening
 *  Scene 4 — Formula Cards (data) 26.5–36s  (795–1080f) FormulaCardsOpening
 *  Scene 5 — CTA/Outro            36–40s    (1080–1200f)
 */
import React from 'react';
import { AbsoluteFill, Audio, Img, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { Background, FluidCurve, BrandTag, AccentLine, Pill, C, FONT, anim, clamp } from './DesignSystem';
import {
  MarketUpdateOpening,
  PASPressureOpening,
  BABTransformationOpening,
  FormulaCardsOpening,
} from './OpeningFrameworks';

const FPS = 30;
const DURATION = 40 * FPS; // 1200 frames

const fadeScene = (frame: number, startF: number, lengthF: number) => {
  const enter = interpolate(frame, [startF, startF + 14], [0, 1], clamp);
  const exit  = interpolate(frame, [startF + lengthF - 16, startF + lengthF], [1, 0], clamp);
  return Math.min(enter, exit);
};

// ─── CTA SCENE (36–40s) ──────────────────────────────────────────────────────
const CtaScene: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = fadeScene(frame, 1080, 120);

  return (
    <AbsoluteFill style={{ opacity }}>
      <Background preset="warm-paper" grain drift />
      <FluidCurve variant="top-right" color={C.gold} opacity={0.2} strokeWidth={50} />
      <BrandTag label="GOLDENSEA" />

      <div style={{
        position: 'absolute', left: 60, right: 60, top: 300, fontFamily: FONT,
        ...anim.scaleIn(frame, 1092, 22),
      }}>
        <div style={{ fontSize: 100, fontWeight: 900, color: '#2A1800', lineHeight: 1.05, letterSpacing: -2 }}>
          Vàng vẫn là<br />
          <span style={{ color: '#D4520A' }}>kênh trú ẩn.</span>
        </div>
      </div>

      <div style={{
        position: 'absolute', left: 60, right: 60, top: 680, fontFamily: FONT,
        fontSize: 42, color: 'rgba(42,24,0,0.65)', lineHeight: 1.4, fontWeight: 500,
        ...anim.fadeUp(frame, 1108, 20),
      }}>
        Fed cứng rắn → USD mạnh → vàng giảm ngắn hạn.<br />
        Nhưng kịch bản lạm phát dai dẳng vẫn ủng hộ vàng dài hạn.
      </div>

      <AccentLine color="#D4520A" width={50} style={{ position: 'absolute', left: 60, top: 870 }} />

      <div style={{
        position: 'absolute', left: 60, bottom: 180, fontFamily: FONT,
        ...anim.fadeUp(frame, 1120, 18),
      }}>
        <Pill bg="#D4520A" color={C.white}>Lưu lại nếu bạn đang theo dõi vàng</Pill>
      </div>

      <div style={{
        position: 'absolute', left: 60, bottom: 100, fontFamily: FONT,
        fontSize: 22, color: 'rgba(42,24,0,0.35)', fontWeight: 600,
        ...anim.fadeUp(frame, 1130, 16),
      }}>
        Nguồn: Lao Động · laodong.vn · 18/06/2026
      </div>
    </AbsoluteFill>
  );
};

// ─── ROOT EXPORT ─────────────────────────────────────────────────────────────
export const GoldNewsClip: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: C.midnight, fontFamily: FONT }}>

    {/* Scene 1 — Market hook: giá vàng hiện tại */}
    <MarketUpdateOpening
      category="VÀNG • 18/06/2026"
      hookStat="$3.285"
      hookLabel="Giá vàng thế giới / oz — giảm sau tuyên bố Fed"
      signals={[
        { label: 'Vàng SJC',     value: '119,5 tr',  change: '▼ 0,3 tr',  positive: false },
        { label: 'Vàng nhẫn',    value: '113,8 tr',  change: '▼ 0,2 tr',  positive: false },
        { label: 'USD/VND',      value: '25.890',     change: '▲ 0,12%',   positive: true  },
      ]}
      source="Nguồn: laodong.vn · SJC · CoinGecko · 18/06/2026"
      startFrame={0}
      durationFrames={225}
    />

    {/* Scene 2 — PAS: vấn đề & giải pháp */}
    <PASPressureOpening
      tensionStat="−1,4%"
      tensionLabel="Vàng giảm trong 48h sau phát biểu Powell"
      problem="Fed giữ lãi suất cao — 'chưa thấy đủ bằng chứng lạm phát giảm'"
      agitate="USD mạnh lên, dòng tiền rút khỏi vàng, NĐT ngắn hạn bán tháo"
      solution="Vàng vẫn giữ vùng hỗ trợ $3.200 — lạm phát dai dẳng = vàng dài hạn còn giá trị"
      startFrame={225}
      durationFrames={285}
    />

    {/* Scene 3 — BAB: trước/sau tuyên bố Fed */}
    <BABTransformationOpening
      before={{
        label: 'Trước Fed (15/6)',
        value: '$3.342',
        desc: 'Vàng tăng mạnh kỳ vọng Fed cắt lãi',
      }}
      after={{
        label: 'Sau Fed (18/6)',
        value: '$3.285',
        desc: 'Điều chỉnh −1,7% sau tuyên bố cứng rắn',
      }}
      bridge="Tuyên bố của Powell = cú sốc ngắn hạn"
      metrics={[
        { label: 'Mức giảm 48h',   delta: '−$57',   positive: false },
        { label: 'Vàng SJC giảm',  delta: '−0,3 tr', positive: false },
        { label: 'Hỗ trợ mạnh',    delta: '$3.200',  positive: true  },
      ]}
      startFrame={510}
      durationFrames={285}
    />

    {/* Scene 4 — Formula: 4 yếu tố ảnh hưởng giá vàng */}
    <FormulaCardsOpening
      headline="4 yếu tố quyết định giá vàng"
      formula="Fed + USD + Lạm phát + Địa chính trị = Giá vàng"
      cards={[
        { title: '🏦 Fed cứng rắn',     tagline: 'Lãi suất cao → USD mạnh → vàng giảm', accent: C.coral },
        { title: '💵 USD Index +0,4%',  tagline: 'Mối tương quan nghịch với vàng',       accent: C.periwinkle },
        { title: '📈 CPI Mỹ 3,3%',      tagline: 'Lạm phát chưa về target 2% của Fed',  accent: C.neonLime },
        { title: '🌍 Địa chính trị',    tagline: 'Trung Đông, Nga-Ukraine vẫn căng',    accent: C.bubblegum },
      ]}
      selectorRow={['Ngắn hạn: giảm', 'Dài hạn: tích lũy', 'Hỗ trợ: $3.200']}
      startFrame={795}
      durationFrames={285}
    />

    {/* Scene 5 — CTA */}
    <CtaScene />
  </AbsoluteFill>
);
