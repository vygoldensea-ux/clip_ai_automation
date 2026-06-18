/**
 * GoldNewsClip — 40s vertical clip (1080×1920)
 * Tin: Giá vàng 18/6/2026 chịu sức ép sau tuyên bố Fed
 * Source: laodong.vn
 *
 * Structure (40s = 1200 frames @ 30fps):
 *  Scene 1 — HookStoryOffer (viral opener)  0–7.5s   (0–225f)   Framework #2
 *  Scene 2 — PAS Pressure                  7.5–17s  (225–510f)  Framework #7
 *  Scene 3 — BAB Before/After Fed          17–26.5s (510–795f)  Framework #3
 *  Scene 4 — Formula Cards (4 yếu tố)      26.5–36s (795–1080f) Framework #4
 *  Scene 5 — CTA/Outro                     36–40s   (1080–1200f)
 *
 * VOICE SCRIPT (generate via OmniVoice seed 250610):
 *  [0–7s]   "Vàng vừa giảm 57 đô trong 48 giờ. Tất cả vì một câu nói của Fed."
 *  [7–17s]  "Fed giữ lãi suất cao — Powell nói chưa thấy đủ bằng chứng lạm phát giảm.
 *            USD mạnh lên, dòng tiền rút khỏi vàng. Nhưng vùng hỗ trợ 3.200 vẫn giữ."
 *  [17–27s] "Trước tuyên bố Fed ngày 15/6, vàng đứng ở 3.342. Sau 48 giờ — còn 3.285.
 *            Mức giảm 57 đô. Vàng SJC giảm 300 nghìn. Nhẫn trơn giảm 200 nghìn."
 *  [27–36s] "Giá vàng phụ thuộc 4 yếu tố: Fed, USD, lạm phát, và địa chính trị.
 *            Ngắn hạn áp lực. Dài hạn — vàng vẫn là kênh trú ẩn."
 *  [36–40s] "Lưu lại nếu bạn đang theo dõi vàng. Gặp lại ở video sau."
 */
import React from 'react';
import { AbsoluteFill, Audio, interpolate, staticFile, useCurrentFrame } from 'remotion';
import {
  Background, FluidCurve, BrandTag, AccentLine, Pill,
  C, FONT, anim, clamp, Highlight,
} from './DesignSystem';
import {
  HookStoryOfferOpening,
  PASPressureOpening,
  BABTransformationOpening,
  FormulaCardsOpening,
} from './OpeningFrameworks';

const FPS = 30;

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

      {/* Main headline */}
      <div style={{
        position: 'absolute', left: 60, right: 60, top: 240, fontFamily: FONT,
        ...anim.scaleIn(frame, 1092, 22),
      }}>
        <div style={{ fontSize: 96, fontWeight: 900, color: '#2A1800', lineHeight: 1.08, letterSpacing: -2 }}>
          Vàng vẫn là<br />
          <Highlight color="#D4520A">kênh trú ẩn.</Highlight>
        </div>
        <AccentLine color="#D4520A" width={50} style={{ marginTop: 24 }} />
      </div>

      {/* Body text */}
      <div style={{
        position: 'absolute', left: 60, right: 60, top: 580,
        fontFamily: '"Be Vietnam Pro", sans-serif',
        fontSize: 38, color: 'rgba(42,24,0,0.7)', lineHeight: 1.6, fontWeight: 500,
        ...anim.fadeUp(frame, 1108, 20),
      }}>
        <Highlight color="#D4520A">Fed cứng rắn</Highlight> → USD mạnh → vàng giảm ngắn hạn.<br /><br />
        Nhưng kịch bản <Highlight color="#D4520A">lạm phát dai dẳng</Highlight> vẫn ủng hộ vàng dài hạn.
      </div>

      {/* Two mini stat cards */}
      <div style={{
        position: 'absolute', left: 60, right: 60,
        top: 1000,
        display: 'flex', gap: 16,
        ...anim.fadeUp(frame, 1118, 18),
      }}>
        <div style={{
          flex: 1, background: 'rgba(212,82,10,0.1)', border: '1.5px solid rgba(212,82,10,0.3)',
          borderRadius: 20, padding: '20px 22px', fontFamily: '"Be Vietnam Pro", sans-serif',
        }}>
          <div style={{ fontSize: 44, fontWeight: 900, color: '#D4520A' }}>$3.200</div>
          <div style={{ fontSize: 22, color: 'rgba(42,24,0,0.55)', marginTop: 4 }}>Vùng hỗ trợ mạnh</div>
        </div>
        <div style={{
          flex: 1, background: 'rgba(201,168,76,0.1)', border: '1.5px solid rgba(201,168,76,0.35)',
          borderRadius: 20, padding: '20px 22px', fontFamily: '"Be Vietnam Pro", sans-serif',
        }}>
          <div style={{ fontSize: 44, fontWeight: 900, color: '#C9A84C' }}>Dài hạn</div>
          <div style={{ fontSize: 22, color: 'rgba(42,24,0,0.55)', marginTop: 4 }}>Tích lũy dần</div>
        </div>
      </div>

      {/* CTA + source */}
      <div style={{
        position: 'absolute', left: 60, bottom: 170, fontFamily: FONT,
        ...anim.fadeUp(frame, 1130, 18),
      }}>
        <Pill bg="#D4520A" color={C.white}>Lưu lại nếu bạn đang theo dõi vàng</Pill>
      </div>

      <div style={{
        position: 'absolute', left: 60, bottom: 90, fontFamily: FONT,
        fontSize: 22, color: 'rgba(42,24,0,0.35)', fontWeight: 600,
        ...anim.fadeUp(frame, 1140, 16),
      }}>
        Nguồn: Lao Động · laodong.vn · 18/06/2026
      </div>
    </AbsoluteFill>
  );
};

// ─── ROOT EXPORT ─────────────────────────────────────────────────────────────
export const GoldNewsClip: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: C.midnight, fontFamily: FONT }}>

      {/* Background music — 15% volume, fade out last 3s */}
      <Audio
        src={staticFile('btc-strategy-bg.mp3')}
        volume={interpolate(frame, [0, 1110, 1200], [0.15, 0.15, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        })}
        loop
      />

      {/* Voice — uncomment after generating OmniVoice audio */}
      {/* <Audio src={staticFile('gold-news-voice.wav')} /> */}

      {/* Scene 1 — HookStoryOffer: viral opener, framework #2 */}
      <HookStoryOfferOpening
        hook="Vàng vừa giảm $57 trong 48h. Tại sao?"
        steps={[
          {
            label: 'Hook',
            text: 'Powell tuyên bố: chưa đủ bằng chứng lạm phát giảm → thị trường sốc',
          },
          {
            label: 'Story',
            text: 'USD mạnh, dòng tiền rút khỏi vàng. SJC −300k, nhẫn −200k trong 2 ngày',
          },
          {
            label: 'Offer',
            text: '4 yếu tố quyết định vàng đi đâu tiếp theo — xem hết clip này',
          },
        ]}
        startFrame={0}
        durationFrames={225}
      />

      {/* Scene 2 — PAS: vấn đề & áp lực */}
      <PASPressureOpening
        tensionStat="−1,4%"
        tensionLabel="Vàng giảm trong 48h sau phát biểu Powell"
        problem="Fed giữ lãi suất cao — 'chưa thấy đủ bằng chứng lạm phát giảm'"
        agitate="USD mạnh lên, dòng tiền rút khỏi vàng, NĐT ngắn hạn bán tháo"
        solution="Vàng giữ vùng hỗ trợ $3.200 — lạm phát dai dẳng = vàng dài hạn còn giá trị"
        startFrame={225}
        durationFrames={285}
      />

      {/* Scene 3 — BAB: trước/sau tuyên bố Fed */}
      <BABTransformationOpening
        before={{
          label: 'Trước Fed (15/6)',
          value: '$3.342',
          desc: 'Vàng tăng theo kỳ vọng Fed cắt lãi',
        }}
        after={{
          label: 'Sau Fed (18/6)',
          value: '$3.285',
          desc: 'Điều chỉnh −1,7% sau tuyên bố cứng rắn',
        }}
        bridge="Tuyên bố Powell = cú sốc ngắn hạn"
        metrics={[
          { label: 'Mức giảm 48h',  delta: '−$57',   positive: false },
          { label: 'Vàng SJC giảm', delta: '−300k',  positive: false },
          { label: 'Hỗ trợ mạnh',   delta: '$3.200', positive: true  },
        ]}
        startFrame={510}
        durationFrames={285}
      />

      {/* Scene 4 — Formula: 4 yếu tố ảnh hưởng giá vàng */}
      <FormulaCardsOpening
        headline="4 yếu tố quyết định giá vàng"
        formula="Fed + USD + Lạm phát + Địa chính trị"
        cards={[
          { title: 'Fed cứng rắn',    tagline: 'Lãi suất cao → USD mạnh → vàng giảm', accent: C.coral },
          { title: 'USD Index +0,4%', tagline: 'Tương quan nghịch với vàng',           accent: C.periwinkle },
          { title: 'CPI Mỹ 3,3%',    tagline: 'Lạm phát chưa về target 2% của Fed',  accent: C.neonLime },
          { title: 'Địa chính trị',   tagline: 'Trung Đông, Nga-Ukraine vẫn căng',    accent: C.bubblegum },
        ]}
        selectorRow={['Ngắn hạn: giảm', 'Dài hạn: tích lũy', 'Hỗ trợ: $3.200']}
        startFrame={795}
        durationFrames={285}
      />

      {/* Scene 5 — CTA */}
      <CtaScene />
    </AbsoluteFill>
  );
};
