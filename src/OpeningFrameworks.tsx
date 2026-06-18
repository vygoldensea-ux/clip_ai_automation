/**
 * OpeningFrameworks.tsx — 8 reusable opening scene components
 * Each takes ~7.5s (225 frames) at 30fps, 1080×1920
 *
 * USAGE: Import the framework you need, pass data props, drop into your clip.
 *
 * Example:
 *   <CheatSheetOpening
 *     title="5 AI Tools"
 *     cards={[{label:'GPT-4',desc:'Writing'},{label:'Midjourney',desc:'Images'},...]}
 *     sideList={['Saves 3h/day','No code needed','Free tier']}
 *     quote="Work smarter, not harder"
 *     startFrame={0}
 *   />
 */
import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import {
  Background, FluidCurve, BrandTag, AccentLine, Pill, LiveDot,
  LayeredTitle, PastelCard, ArrowCTA,
  C, FONT, anim, clamp, sec,
} from './DesignSystem';

// ─── SHARED SCENE WRAPPER ────────────────────────────────────────────────────
const Scene: React.FC<{
  startFrame: number;
  durationFrames?: number;
  children: React.ReactNode;
}> = ({ startFrame, durationFrames = 225, children }) => {
  const frame = useCurrentFrame();
  const enter = interpolate(frame, [startFrame, startFrame + 14], [0, 1], clamp);
  const exit  = interpolate(frame, [startFrame + durationFrames - 16, startFrame + durationFrames], [1, 0], clamp);
  return (
    <AbsoluteFill style={{ opacity: Math.min(enter, exit) }}>
      {children}
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// 1. CHEAT SHEET OVERVIEW
// Best for: listicle, frameworks, multi-point educational clips
// Layout: large title + grid of mini cards + right-side use-case list + bottom quote
// ═══════════════════════════════════════════════════════════════════════════════
export interface CheatSheetCard { label: string; desc?: string; accent?: string }

export const CheatSheetOpening: React.FC<{
  title: string;
  subtitle?: string;
  cards: CheatSheetCard[];   // 4–6 cards
  sideList?: string[];       // 3–4 bullet points
  quote?: string;
  startFrame?: number;
  durationFrames?: number;
}> = ({ title, subtitle, cards, sideList = [], quote, startFrame = 0, durationFrames = 225 }) => {
  const frame = useCurrentFrame();
  const cardColors = [C.periwinkle, C.lavender, C.bubblegum, C.neonLime, C.skyBlue, C.peach];

  return (
    <Scene startFrame={startFrame} durationFrames={durationFrames}>
      <Background preset="soft-white" grain={false} drift />
      <FluidCurve variant="top-right" color={C.periwinkle} opacity={0.25} strokeWidth={60} />
      <FluidCurve variant="bottom-left" color={C.lavender} opacity={0.18} strokeWidth={45} />
      <BrandTag label="GOLDENSEA" />

      {/* Title block */}
      <div style={{ position: 'absolute', left: 60, top: 180, right: 60, fontFamily: FONT }}>
        <div style={{ fontSize: 22, fontWeight: 800, color: C.periwinkle, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 12, ...anim.fadeUp(frame, startFrame + 8) }}>
          Cheat Sheet
        </div>
        <div style={{ fontSize: 96, fontWeight: 900, color: C.charcoal, lineHeight: 1.05, letterSpacing: -2, ...anim.fadeUp(frame, startFrame + 12, 22) }}>
          {title}
        </div>
        {subtitle && (
          <div style={{ fontSize: 36, color: C.periwinkle, fontWeight: 600, marginTop: 10, ...anim.fadeUp(frame, startFrame + 18, 20) }}>
            {subtitle}
          </div>
        )}
        <AccentLine color={C.periwinkle} width={50} style={{ marginTop: 18 }} />
      </div>

      {/* Card grid */}
      <div style={{
        position: 'absolute', left: 60, right: 60, top: 460,
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16,
      }}>
        {cards.slice(0, 6).map((card, i) => (
          <div
            key={i}
            style={{
              background: cardColors[i % cardColors.length] + '33',
              border: `2px solid ${cardColors[i % cardColors.length]}66`,
              borderRadius: 20, padding: '20px 22px', fontFamily: FONT,
              ...anim.fadeUp(frame, anim.stagger(i, startFrame + 22, 10), 18),
            }}
          >
            <div style={{ fontSize: 34, fontWeight: 900, color: C.charcoal }}>{card.label}</div>
            {card.desc && <div style={{ fontSize: 24, color: C.charcoal, opacity: 0.6, marginTop: 4, lineHeight: 1.3 }}>{card.desc}</div>}
          </div>
        ))}
      </div>

      {/* Side list */}
      {sideList.length > 0 && (
        <div style={{ position: 'absolute', left: 60, right: 60, bottom: 200, fontFamily: FONT }}>
          {sideList.map((item, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 16, marginBottom: 14,
              ...anim.slideRight(frame, anim.stagger(i, startFrame + 80, 12)),
            }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: C.periwinkle, flexShrink: 0 }} />
              <div style={{ fontSize: 30, fontWeight: 700, color: C.charcoal }}>{item}</div>
            </div>
          ))}
        </div>
      )}

      {/* Quote */}
      {quote && (
        <div style={{
          position: 'absolute', left: 60, right: 60, bottom: 100,
          fontSize: 28, color: C.charcoal, fontStyle: 'italic',
          fontFamily: FONT, ...anim.fadeUp(frame, startFrame + 110, 20),
        }}>
          "{quote}"
        </div>
      )}
    </Scene>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// 2. HOOK → STORY → OFFER
// Best for: TikTok/Reels scripting, retention-focused explainers
// Layout: huge hook text + 3 step panels + hook examples at bottom
// ═══════════════════════════════════════════════════════════════════════════════
export const HookStoryOfferOpening: React.FC<{
  hook: string;             // 1 punchy sentence — stops the scroll
  steps: Array<{ label: string; text: string }>;  // exactly 3: Hook/Story/Offer
  hookExamples?: string[];  // 2-3 example hooks shown at bottom
  startFrame?: number;
  durationFrames?: number;
}> = ({ hook, steps, hookExamples = [], startFrame = 0, durationFrames = 225 }) => {
  const frame = useCurrentFrame();
  const stepColors = [C.periwinkle, C.bubblegum, C.neonLime];

  return (
    <Scene startFrame={startFrame} durationFrames={durationFrames}>
      <Background preset="pastel-lavender" grain={false} drift />
      <BrandTag />

      {/* Big hook */}
      <div style={{
        position: 'absolute', left: 60, right: 60, top: 180, fontFamily: FONT,
        fontSize: 88, fontWeight: 900, color: C.deepNavy, lineHeight: 1.1, letterSpacing: -2,
        ...anim.scaleIn(frame, startFrame + 8, 24),
      }}>
        {hook}
      </div>
      <AccentLine color={C.periwinkle} width={60} style={{ position: 'absolute', left: 60, top: 500 }} />

      {/* HSO Step panels */}
      <div style={{ position: 'absolute', left: 60, right: 60, top: 560, display: 'flex', flexDirection: 'column', gap: 18 }}>
        {steps.slice(0, 3).map((step, i) => (
          <div key={i} style={{
            borderRadius: 22, padding: '22px 28px',
            background: `${stepColors[i]}22`,
            border: `2px solid ${stepColors[i]}55`,
            display: 'flex', alignItems: 'flex-start', gap: 20, fontFamily: FONT,
            ...anim.slideRight(frame, anim.stagger(i, startFrame + 30, 14), 18),
          }}>
            <div style={{
              width: 52, height: 52, borderRadius: 14, background: stepColors[i],
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 24, fontWeight: 900, color: C.charcoal, flexShrink: 0,
            }}>
              {i + 1}
            </div>
            <div>
              <div style={{ fontSize: 30, fontWeight: 900, color: C.deepNavy, textTransform: 'uppercase', letterSpacing: 1 }}>{step.label}</div>
              <div style={{ fontSize: 26, color: C.deepNavy, opacity: 0.65, marginTop: 4, lineHeight: 1.3 }}>{step.text}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Hook examples */}
      {hookExamples.length > 0 && (
        <div style={{ position: 'absolute', left: 60, right: 60, bottom: 120, fontFamily: FONT }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: C.periwinkle, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 14 }}>Hook examples</div>
          {hookExamples.map((ex, i) => (
            <div key={i} style={{
              fontSize: 26, color: C.deepNavy, marginBottom: 8,
              paddingLeft: 16, borderLeft: `3px solid ${C.periwinkle}`,
              ...anim.fadeUp(frame, anim.stagger(i, startFrame + 90, 10)),
            }}>
              {ex}
            </div>
          ))}
        </div>
      )}
    </Scene>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// 3. BAB — BEFORE / AFTER / BRIDGE
// Best for: before/after stories, market reversal, transformation narratives
// Layout: two blocks side-by-side + bridge column + metric deltas
// ═══════════════════════════════════════════════════════════════════════════════
export const BABTransformationOpening: React.FC<{
  before: { label: string; value: string; desc: string };
  after:  { label: string; value: string; desc: string };
  bridge?: string;   // 1-line bridge statement
  metrics?: Array<{ label: string; delta: string; positive?: boolean }>;
  startFrame?: number;
  durationFrames?: number;
}> = ({ before, after, bridge, metrics = [], startFrame = 0, durationFrames = 225 }) => {
  const frame = useCurrentFrame();

  return (
    <Scene startFrame={startFrame} durationFrames={durationFrames}>
      <Background preset="midnight-ink" grain drift />
      <FluidCurve variant="top-right" color={C.periwinkle} opacity={0.15} strokeWidth={40} />
      <BrandTag />

      {/* Header */}
      <div style={{ position: 'absolute', left: 60, top: 185, fontFamily: FONT, ...anim.fadeUp(frame, startFrame + 8) }}>
        <div style={{ fontSize: 22, fontWeight: 800, color: C.periwinkle, letterSpacing: 3, textTransform: 'uppercase' }}>Transformation</div>
        <AccentLine color={C.periwinkle} width={50} style={{ marginTop: 10 }} />
      </div>

      {/* Before block */}
      <div style={{
        position: 'absolute', left: 60, top: 280, width: 440,
        background: 'rgba(255,107,107,0.12)', border: '2px solid rgba(255,107,107,0.35)',
        borderRadius: 24, padding: '28px 26px', fontFamily: FONT,
        ...anim.slideRight(frame, startFrame + 16, 20),
      }}>
        <div style={{ fontSize: 22, fontWeight: 800, color: C.coral, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 10 }}>{before.label}</div>
        <div style={{ fontSize: 72, fontWeight: 900, color: C.coral, lineHeight: 1 }}>{before.value}</div>
        <div style={{ fontSize: 26, color: 'rgba(255,255,255,0.55)', marginTop: 10, lineHeight: 1.3 }}>{before.desc}</div>
      </div>

      {/* After block */}
      <div style={{
        position: 'absolute', right: 60, top: 280, width: 440,
        background: `${C.neonLime}18`, border: `2px solid ${C.neonLime}55`,
        borderRadius: 24, padding: '28px 26px', fontFamily: FONT,
        ...anim.slideRight(frame, startFrame + 24, 20, -60),
      }}>
        <div style={{ fontSize: 22, fontWeight: 800, color: C.neonLime, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 10 }}>{after.label}</div>
        <div style={{ fontSize: 72, fontWeight: 900, color: C.neonLime, lineHeight: 1 }}>{after.value}</div>
        <div style={{ fontSize: 26, color: 'rgba(255,255,255,0.55)', marginTop: 10, lineHeight: 1.3 }}>{after.desc}</div>
      </div>

      {/* Arrow bridge */}
      <div style={{ position: 'absolute', left: '50%', top: 360, transform: 'translateX(-50%)' }}>
      <div style={{ ...anim.scaleIn(frame, startFrame + 32) }}>
        <div style={{
          width: 60, height: 60, borderRadius: '50%',
          background: C.goldBright, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <path d="M4 14H24M24 14L16 6M24 14L16 22" stroke={C.black} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div></div>

      {/* Bridge statement */}
      {bridge && (
        <div style={{
          position: 'absolute', left: 60, right: 60, top: 660,
          fontSize: 52, fontWeight: 900, color: C.white, lineHeight: 1.2,
          fontFamily: '"Be Vietnam Pro", sans-serif', textAlign: 'center',
          ...anim.fadeUp(frame, startFrame + 40, 22),
        }}>
          {bridge}
        </div>
      )}

      {/* Metrics — stretch to bottom */}
      {metrics.length > 0 && (
        <div style={{
          position: 'absolute', left: 60, right: 60,
          top: bridge ? 820 : 700,
          bottom: 80,
          display: 'flex', gap: 16,
        }}>
          {metrics.map((m, i) => (
            <div key={i} style={{
              flex: 1,
              background: 'rgba(255,255,255,0.07)', borderRadius: 22, padding: '30px 24px',
              fontFamily: '"Be Vietnam Pro", sans-serif',
              display: 'flex', flexDirection: 'column', justifyContent: 'center',
              ...anim.fadeUp(frame, anim.stagger(i, startFrame + 60, 12)),
            }}>
              <div style={{ fontSize: 56, fontWeight: 900, color: m.positive !== false ? C.neonLime : C.coral }}>{m.delta}</div>
              <div style={{ fontSize: 28, color: 'rgba(255,255,255,0.6)', marginTop: 8, lineHeight: 1.35 }}>{m.label}</div>
            </div>
          ))}
        </div>
      )}
    </Scene>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// 4. FORMULA CARDS
// Best for: overview of several models, tools, or choices
// Layout: headline + 4-5 cards center + selector row
// ═══════════════════════════════════════════════════════════════════════════════
export interface FormulaCard { title: string; tagline: string; accent?: string }

export const FormulaCardsOpening: React.FC<{
  headline: string;
  formula?: string;   // e.g. "Hook + Story + Offer = Viral"
  cards: FormulaCard[];  // 4–5 cards
  selectorRow?: string[];  // bottom tag row
  startFrame?: number;
  durationFrames?: number;
}> = ({ headline, formula, cards, selectorRow = [], startFrame = 0, durationFrames = 225 }) => {
  const frame = useCurrentFrame();
  const accents = [C.periwinkle, C.bubblegum, C.neonLime, C.lavender, C.skyBlue];

  return (
    <Scene startFrame={startFrame} durationFrames={durationFrames}>
      <Background preset="solar-flare" grain drift />
      <BrandTag />

      {/* Headline */}
      <div style={{
        position: 'absolute', left: 60, right: 60, top: 185, fontFamily: FONT,
        fontSize: 80, fontWeight: 900, color: C.cream, lineHeight: 1.1, letterSpacing: -1.5,
        ...anim.wipeReveal(frame, startFrame + 8, 22),
      }}>
        {headline}
      </div>

      {/* Formula */}
      {formula && (
        <div style={{
          position: 'absolute', left: 60, right: 60, top: 400, fontFamily: FONT,
          fontSize: 30, fontWeight: 700, color: C.goldBright, letterSpacing: 0.5,
          ...anim.fadeUp(frame, startFrame + 22, 18),
        }}>
          {formula}
        </div>
      )}

      <AccentLine color={C.goldBright} width={50} style={{ position: 'absolute', left: 60, top: formula ? 450 : 370 }} />

      {/* Cards + selector — fill lower 2/3 of screen evenly */}
      <div style={{
        position: 'absolute', left: 60, right: 60,
        top: formula ? 480 : 420,
        bottom: 80,
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {cards.slice(0, 5).map((card, i) => {
            const acc = card.accent || accents[i % accents.length];
            return (
              <div key={i} style={{
                borderRadius: 24, padding: '28px 32px',
                background: `${acc}1A`, border: `2.5px solid ${acc}55`,
                fontFamily: '"Be Vietnam Pro", sans-serif',
                ...anim.slideRight(frame, anim.stagger(i, startFrame + 30, 10)),
              }}>
                <div style={{ fontSize: 44, fontWeight: 900, color: C.cream, lineHeight: 1.15, marginBottom: 8 }}>{card.title}</div>
                <div style={{ fontSize: 30, color: acc, fontWeight: 700, lineHeight: 1.3 }}>{card.tagline}</div>
              </div>
            );
          })}
        </div>

        {selectorRow.length > 0 && (
          <div style={{
            display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 20,
            ...anim.fadeUp(frame, startFrame + 90, 20),
          }}>
            {selectorRow.map((tag, i) => (
              <div key={i} style={{
                background: i === 0 ? C.goldBright : 'rgba(255,255,255,0.1)',
                color: i === 0 ? C.black : C.cream,
                fontSize: 24, fontWeight: 800, borderRadius: 100,
                padding: '8px 22px', fontFamily: '"Be Vietnam Pro", sans-serif',
              }}>
                {tag}
              </div>
            ))}
          </div>
        )}
      </div>
    </Scene>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// 5. AIDA FUNNEL
// Best for: awareness-to-action explainers, conversion logic
// Layout: AIDA title + funnel stack (4 stages) + detail panels
// ═══════════════════════════════════════════════════════════════════════════════
export interface AIDAStage { stage: string; label: string; desc: string }

export const AIDAFunnelOpening: React.FC<{
  headline: string;
  stages: AIDAStage[];  // exactly 4: Attention, Interest, Desire, Action
  startFrame?: number;
  durationFrames?: number;
}> = ({ headline, stages, startFrame = 0, durationFrames = 225 }) => {
  const frame = useCurrentFrame();
  const stageColors = [C.bubblegum, C.periwinkle, C.lavender, C.goldBright];
  const widths = ['100%', '80%', '60%', '42%'];

  return (
    <Scene startFrame={startFrame} durationFrames={durationFrames}>
      <Background preset="electric-aurora" grain drift />
      <BrandTag />

      <div style={{
        position: 'absolute', left: 60, right: 60, top: 185, fontFamily: FONT,
        ...anim.fadeUp(frame, startFrame + 8),
      }}>
        <div style={{ fontSize: 24, fontWeight: 800, color: C.bubblegum, letterSpacing: 3, textTransform: 'uppercase' }}>AIDA Framework</div>
        <div style={{ fontSize: 78, fontWeight: 900, color: C.white, lineHeight: 1.1, marginTop: 8, letterSpacing: -1.5 }}>{headline}</div>
        <AccentLine color={C.bubblegum} width={50} style={{ marginTop: 16 }} />
      </div>

      {/* Funnel stages */}
      <div style={{ position: 'absolute', left: 60, right: 60, top: 490, display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'center' }}>
        {stages.slice(0, 4).map((s, i) => {
          const w = widths[i];
          const color = stageColors[i];
          return (
            <div key={i} style={{
              width: w, borderRadius: 16, overflow: 'hidden',
              ...anim.scaleIn(frame, anim.stagger(i, startFrame + 28, 12)),
            }}>
              <div style={{
                background: `${color}22`, border: `2px solid ${color}55`,
                padding: '16px 24px',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                fontFamily: FONT,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{
                    width: 42, height: 42, borderRadius: 10, background: color,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 18, fontWeight: 900, color: C.black,
                  }}>
                    {s.stage[0]}
                  </div>
                  <div>
                    <div style={{ fontSize: 28, fontWeight: 900, color: C.white }}>{s.stage}</div>
                    <div style={{ fontSize: 20, color, fontWeight: 700 }}>{s.label}</div>
                  </div>
                </div>
                <div style={{ fontSize: 22, color: 'rgba(255,255,255,0.55)', textAlign: 'right', maxWidth: 260, lineHeight: 1.3 }}>{s.desc}</div>
              </div>
            </div>
          );
        })}
      </div>
    </Scene>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// 6. STORYBRAND STEPS
// Best for: narrative explainers where audience is the hero
// Layout: 7-step left rail + hero/problem/guide panels
// ═══════════════════════════════════════════════════════════════════════════════
export const StoryBrandOpening: React.FC<{
  heroStatement: string;   // "You are the hero of this story"
  steps: Array<{ number: number; title: string; desc?: string }>;  // 3–7 steps
  callout?: string;        // highlighted note
  startFrame?: number;
  durationFrames?: number;
}> = ({ heroStatement, steps, callout, startFrame = 0, durationFrames = 225 }) => {
  const frame = useCurrentFrame();

  return (
    <Scene startFrame={startFrame} durationFrames={durationFrames}>
      <Background preset="soft-white" grain={false} drift />
      <FluidCurve variant="top-right" color={C.periwinkle} opacity={0.2} strokeWidth={55} />
      <BrandTag />

      {/* Hero statement */}
      <div style={{
        position: 'absolute', left: 60, right: 60, top: 185, fontFamily: FONT,
        ...anim.fadeUp(frame, startFrame + 8),
      }}>
        <div style={{ fontSize: 22, fontWeight: 800, color: C.periwinkle, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 10 }}>StoryBrand</div>
        <div style={{ fontSize: 68, fontWeight: 900, color: C.charcoal, lineHeight: 1.15, letterSpacing: -1 }}>{heroStatement}</div>
        <AccentLine color={C.periwinkle} width={50} style={{ marginTop: 16 }} />
      </div>

      {/* Step rail */}
      <div style={{ position: 'absolute', left: 60, right: 60, top: 460, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {steps.slice(0, 6).map((step, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'flex-start', gap: 20,
            fontFamily: FONT,
            ...anim.slideRight(frame, anim.stagger(i, startFrame + 28, 10)),
          }}>
            {/* Step number bubble */}
            <div style={{
              width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
              background: i < 2 ? C.periwinkle : i < 4 ? C.lavender : C.bubblegum,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 20, fontWeight: 900, color: C.charcoal,
            }}>
              {step.number}
            </div>
            {/* Connector line */}
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 30, fontWeight: 800, color: C.charcoal }}>{step.title}</div>
              {step.desc && <div style={{ fontSize: 22, color: C.charcoal, opacity: 0.55, marginTop: 3, lineHeight: 1.3 }}>{step.desc}</div>}
            </div>
          </div>
        ))}
      </div>

      {/* Callout */}
      {callout && (
        <div style={{
          position: 'absolute', left: 60, right: 60, bottom: 120,
          background: `${C.periwinkle}18`, border: `2px solid ${C.periwinkle}44`,
          borderRadius: 20, padding: '20px 26px', fontFamily: FONT,
          fontSize: 28, fontWeight: 700, color: C.deepNavy,
          ...anim.fadeUp(frame, startFrame + 110, 20),
        }}>
          {callout}
        </div>
      )}
    </Scene>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// 7. PAS — PROBLEM / AGITATE / SOLUTION
// Best for: news hooks, risk alerts, market updates, problem-solution clips
// Layout: PAS headline + tension curve + 3 cards
// ═══════════════════════════════════════════════════════════════════════════════
export const PASPressureOpening: React.FC<{
  problem: string;
  agitate: string;
  solution: string;
  tensionStat?: string;    // big number showing the pain e.g. "$2.4T lost"
  tensionLabel?: string;
  startFrame?: number;
  durationFrames?: number;
}> = ({ problem, agitate, solution, tensionStat, tensionLabel, startFrame = 0, durationFrames = 225 }) => {
  const frame = useCurrentFrame();
  const cards = [
    { label: 'Problem',  text: problem,  color: C.coral,      bg: 'rgba(255,107,107,0.12)' },
    { label: 'Agitate',  text: agitate,  color: C.bubblegum,  bg: `${C.bubblegum}15` },
    { label: 'Solution', text: solution, color: C.neonLime,   bg: `${C.neonLime}15` },
  ];

  return (
    <Scene startFrame={startFrame} durationFrames={durationFrames}>
      <Background preset="neon-night" grain grid drift />
      <BrandTag />

      {/* Tension stat */}
      {tensionStat && (
        <div style={{
          position: 'absolute', left: 60, top: 185, fontFamily: FONT,
          ...anim.scaleIn(frame, startFrame + 6, 22),
        }}>
          <div style={{ fontSize: 140, fontWeight: 900, color: C.coral, lineHeight: 1, letterSpacing: -3 }}>{tensionStat}</div>
          {tensionLabel && <div style={{ fontSize: 32, color: 'rgba(255,255,255,0.55)', fontWeight: 600, marginTop: 4 }}>{tensionLabel}</div>}
        </div>
      )}

      {/* Tension curve SVG — animated draw via strokeDashoffset */}
      {(() => {
        const pathLen = 1020;
        const drawProgress = interpolate(frame, [startFrame + 20, startFrame + 70], [0, 1], clamp);
        const drawn = drawProgress * pathLen;
        const p1Show = interpolate(frame, [startFrame + 20, startFrame + 28], [0, 1], clamp);
        const p2Show = interpolate(frame, [startFrame + 45, startFrame + 52], [0, 1], clamp);
        const p3Show = interpolate(frame, [startFrame + 65, startFrame + 72], [0, 1], clamp);
        return (
          <div style={{ position: 'absolute', left: 60, right: 60, top: tensionStat ? 420 : 200 }}>
            <svg width="960" height="120" viewBox="0 0 960 120" fill="none">
              <defs>
                <linearGradient id="tensionGrad" x1="0" y1="0" x2="960" y2="0" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor={C.coral} />
                  <stop offset="50%" stopColor={C.bubblegum} />
                  <stop offset="100%" stopColor={C.neonLime} />
                </linearGradient>
              </defs>
              <path
                d="M 0 90 Q 240 100 480 50 Q 720 10 960 30"
                stroke="url(#tensionGrad)"
                strokeWidth="5"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${pathLen}`}
                strokeDashoffset={`${pathLen - drawn}`}
              />
              <circle cx="0"   cy="90" r={8 * p1Show} fill={C.coral}     opacity={p1Show} />
              <circle cx="480" cy="50" r={8 * p2Show} fill={C.bubblegum} opacity={p2Show} />
              <circle cx="960" cy="30" r={8 * p3Show} fill={C.neonLime}  opacity={p3Show} />
            </svg>
          </div>
        );
      })()}

      {/* PAS Cards — distribute evenly in lower half */}
      <div style={{
        position: 'absolute', left: 60, right: 60,
        top: tensionStat ? 570 : 360,
        bottom: 80,
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      }}>
        {cards.map((card, i) => (
          <div key={i} style={{
            borderRadius: 24, padding: '32px 30px',
            background: card.bg, border: `2.5px solid ${card.color}55`,
            fontFamily: '"Be Vietnam Pro", sans-serif',
            ...anim.slideRight(frame, anim.stagger(i, startFrame + 35, 14)),
          }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: card.color, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 12 }}>{card.label}</div>
            <div style={{ fontSize: 38, fontWeight: 700, color: C.white, lineHeight: 1.4 }}>{card.text}</div>
          </div>
        ))}
      </div>
    </Scene>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// 8. MARKET UPDATE BRIEF
// Best for: daily finance/news updates (BTC, gold, stocks, AI news)
// Layout: market label + big hook number + 3 signal cards + source footer
// ═══════════════════════════════════════════════════════════════════════════════
export interface SignalCard {
  label: string;
  value: string;
  change?: string;
  positive?: boolean;
}

export const MarketUpdateOpening: React.FC<{
  category: string;       // e.g. "BTC UPDATE", "AI NEWS"
  hookStat: string;       // big number/stat e.g. "$67,400"
  hookLabel: string;      // context label e.g. "Bitcoin price now"
  signals: SignalCard[];  // 2–3 signal cards
  source?: string;        // e.g. "Source: CoinGecko · 18/06/2026"
  startFrame?: number;
  durationFrames?: number;
}> = ({ category, hookStat, hookLabel, signals, source, startFrame = 0, durationFrames = 225 }) => {
  const frame = useCurrentFrame();

  return (
    <Scene startFrame={startFrame} durationFrames={durationFrames}>
      <Background preset="solar-flare" grain drift />
      <FluidCurve variant="top-right" color={C.gold} opacity={0.12} strokeWidth={50} />

      {/* Live indicator + category */}
      <div style={{
        position: 'absolute', left: 60, top: 185, fontFamily: FONT,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', right: 60,
        ...anim.fadeUp(frame, startFrame + 6),
      }}>
        <div style={{ fontSize: 24, fontWeight: 900, color: C.gold, letterSpacing: 3, textTransform: 'uppercase' }}>{category}</div>
        <LiveDot color={C.coral} />
      </div>
      <AccentLine color={C.gold} width={50} style={{ position: 'absolute', left: 60, top: 240 }} />

      {/* Hook stat */}
      <div style={{ position: 'absolute', left: 60, right: 60, top: 270, fontFamily: FONT }}>
        <div style={{
          fontSize: 148, fontWeight: 900, color: C.goldBright, lineHeight: 1, letterSpacing: -4,
          ...anim.scaleIn(frame, startFrame + 12, 24),
        }}>
          {hookStat}
        </div>
        <div style={{
          fontSize: 34, color: 'rgba(255,247,237,0.65)', fontWeight: 600, marginTop: 8,
          fontFamily: '"Be Vietnam Pro", sans-serif',
          ...anim.fadeUp(frame, startFrame + 22, 18),
        }}>
          {hookLabel}
        </div>
      </div>

      {/* Signal cards — anchored to bottom, evenly spaced */}
      <div style={{
        position: 'absolute', left: 60, right: 60,
        top: 580, bottom: source ? 130 : 80,
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      }}>
        {signals.slice(0, 3).map((sig, i) => {
          const positive = sig.positive !== false;
          const changeColor = positive ? C.neonLime : C.coral;
          return (
            <div key={i} style={{
              borderRadius: 20, padding: '24px 26px',
              background: 'rgba(255,255,255,0.07)', border: '1.5px solid rgba(255,255,255,0.1)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              fontFamily: FONT,
              ...anim.slideRight(frame, anim.stagger(i, startFrame + 36, 12)),
            }}>
              <div style={{ fontSize: 32, fontWeight: 800, color: C.cream, fontFamily: '"Be Vietnam Pro", sans-serif' }}>{sig.label}</div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 36, fontWeight: 900, color: C.cream }}>{sig.value}</div>
                {sig.change && <div style={{ fontSize: 22, fontWeight: 800, color: changeColor }}>{sig.change}</div>}
              </div>
            </div>
          );
        })}
      </div>

      {/* Source footer */}
      {source && (
        <div style={{
          position: 'absolute', left: 60, bottom: 80, right: 60, fontFamily: FONT,
          fontSize: 22, color: 'rgba(255,247,237,0.35)', fontWeight: 600,
          ...anim.fadeUp(frame, startFrame + 80, 20),
        }}>
          {source}
        </div>
      )}
    </Scene>
  );
};
