import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Emblem} from '../components/Emblem';
import {Eyebrow} from '../components/Eyebrow';
import {Sources} from '../components/Sources';
import {COLORS} from '../theme';

const Line: React.FC<{delay: number; children: React.ReactNode; style?: React.CSSProperties}> = ({
  delay,
  children,
  style,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: frame - delay, fps, config: {damping: 200}});
  return (
    <div
      style={{
        opacity: s,
        transform: `translateY(${interpolate(s, [0, 1], [50, 0])}px)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

const CHIPS = [
  {big: '≈6.1M', small: 'people in 2050 (UN)'},
  {big: '1 in 3', small: 'citizens aged 65+ (proj.)'},
  {big: '< 1.0', small: 'births per woman today'},
];

export const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <AbsoluteFill>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0}}>
        <Emblem id="outro-emblem" cx={1640} cy={440} r={150} delay={22} />
      </svg>
      <div style={{position: 'absolute', left: 140, top: 150}}>
        <Line delay={0}>
          <Eyebrow>The 2050 picture</Eyebrow>
        </Line>
        <Line delay={4} style={{marginTop: 34, fontSize: 64, fontWeight: 600, color: COLORS.muted}}>
          By 2050, Singapore won’t be
        </Line>
        <Line delay={10} style={{fontSize: 132, fontWeight: 900, color: COLORS.white, letterSpacing: '-0.025em', lineHeight: 1.05}}>
          much bigger —
        </Line>
        <Line delay={18} style={{fontSize: 132, fontWeight: 900, color: COLORS.white, letterSpacing: '-0.025em', lineHeight: 1.05}}>
          it will be much <span style={{color: COLORS.red}}>older.</span>
        </Line>
        <div style={{marginTop: 64, display: 'flex', gap: 28}}>
          {CHIPS.map((c, i) => {
            const s = spring({frame: frame - 36 - i * 6, fps, config: {damping: 16, mass: 0.7}});
            return (
              <div
                key={c.big}
                style={{
                  opacity: Math.min(1, s),
                  transform: `scale(${interpolate(s, [0, 1], [0.85, 1])})`,
                  padding: '22px 34px',
                  borderRadius: 20,
                  background: COLORS.card,
                  border: `1.5px solid ${COLORS.cardBorder}`,
                  minWidth: 300,
                }}
              >
                <div style={{fontSize: 54, fontWeight: 900, color: i === 1 ? COLORS.red : COLORS.white, letterSpacing: '-0.02em'}}>
                  {c.big}
                </div>
                <div style={{fontSize: 24, fontWeight: 600, color: COLORS.muted, marginTop: 4}}>{c.small}</div>
              </div>
            );
          })}
        </div>
      </div>
      <Sources delay={40}>
        Data: Singapore Department of Statistics · National Population and Talent Division · UN World Population Prospects 2024 · IPS. Projections are estimates.
      </Sources>
    </AbsoluteFill>
  );
};
