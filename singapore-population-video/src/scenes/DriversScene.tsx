import React from 'react';
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {Eyebrow} from '../components/Eyebrow';
import {Sources} from '../components/Sources';
import {SENIORS, TFR} from '../data';
import {clamp, COLORS} from '../theme';

const CARD_TOP = 290;
const CARD_HEIGHT = 640;
const CARD_WIDTH = 810;

const Card: React.FC<{left: number; delay: number; children: React.ReactNode}> = ({
  left,
  delay,
  children,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: frame - delay, fps, config: {damping: 200}});
  return (
    <div
      style={{
        position: 'absolute',
        left,
        top: CARD_TOP,
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        boxSizing: 'border-box',
        padding: 56,
        borderRadius: 28,
        background: COLORS.card,
        border: `1.5px solid ${COLORS.cardBorder}`,
        boxShadow: '0 30px 80px rgba(0,0,0,0.35)',
        opacity: s,
        transform: `translateY(${interpolate(s, [0, 1], [60, 0])}px)`,
      }}
    >
      {children}
    </div>
  );
};

const CardLabel: React.FC<{children: React.ReactNode}> = ({children}) => (
  <div style={{fontSize: 24, fontWeight: 800, letterSpacing: '0.2em', color: COLORS.muted}}>{children}</div>
);

const FertilityCard: React.FC = () => {
  const frame = useCurrentFrame();
  const value = interpolate(frame, [20, 70], [TFR.replacement, TFR.y2025], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  const rows = [
    {label: 'Replacement', value: TFR.replacement, color: 'rgba(255,255,255,0.22)', delay: 34},
    {label: '2015', value: TFR.y2015, color: '#4B5B78', delay: 44},
    {label: '2025', value: TFR.y2025, color: COLORS.red, delay: 54},
  ];
  const TRACK = 420;
  return (
    <Card left={120} delay={6}>
      <CardLabel>FERTILITY RATE</CardLabel>
      <div
        style={{
          marginTop: 10,
          fontSize: 170,
          fontWeight: 900,
          lineHeight: 1,
          letterSpacing: '-0.03em',
          color: COLORS.red,
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {value.toFixed(2)}
      </div>
      <div style={{marginTop: 12, fontSize: 30, fontWeight: 500, color: COLORS.muted}}>
        births per woman in 2025 — <span style={{color: COLORS.white, fontWeight: 700}}>a record low</span>
      </div>
      <div style={{marginTop: 50, display: 'flex', flexDirection: 'column', gap: 22}}>
        {rows.map((r) => {
          const grow = interpolate(frame, [r.delay, r.delay + 26], [0, 1], {
            ...clamp,
            easing: Easing.out(Easing.cubic),
          });
          return (
            <div key={r.label} style={{display: 'flex', alignItems: 'center', gap: 22}}>
              <div style={{width: 190, fontSize: 26, fontWeight: 600, color: COLORS.muted}}>{r.label}</div>
              <div style={{position: 'relative', width: TRACK, height: 34}}>
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    height: 34,
                    borderRadius: 8,
                    width: (r.value / TFR.replacement) * TRACK * grow,
                    background: r.color,
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: (r.value / TFR.replacement) * TRACK * grow + 14,
                    fontSize: 26,
                    lineHeight: '34px',
                    fontWeight: 800,
                    color: COLORS.white,
                    opacity: grow,
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {r.value.toFixed(2)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

const COLS = 20;
const ROWS = 5;
const PITCH = 34;

const AgeingCard: React.FC = () => {
  const frame = useCurrentFrame();
  const filled = interpolate(
    frame,
    [30, 52, 90, 104, 140, 160],
    [0, SENIORS[0].pct, SENIORS[0].pct, SENIORS[1].pct, SENIORS[1].pct, SENIORS[2].pct],
    {...clamp, easing: Easing.inOut(Easing.quad)},
  );
  const stageOpacity = [
    interpolate(frame, [24, 36, 86, 94], [0, 1, 1, 0], clamp),
    interpolate(frame, [90, 100, 136, 144], [0, 1, 1, 0], clamp),
    interpolate(frame, [140, 150], [0, 1], clamp),
  ];

  return (
    <Card left={990} delay={14}>
      <CardLabel>CITIZENS AGED 65+</CardLabel>
      <div style={{position: 'relative', height: 250, marginTop: 10}}>
        {SENIORS.map((s, i) => (
          <div
            key={s.year}
            style={{
              position: 'absolute',
              inset: 0,
              opacity: stageOpacity[i],
              transform: `translateY(${(1 - stageOpacity[i]) * 18}px)`,
            }}
          >
            <div style={{fontSize: 170, fontWeight: 900, lineHeight: 1, letterSpacing: '-0.03em', color: COLORS.white}}>
              {s.ratio.split(' ').map((part, j) => (
                <span key={j} style={{color: j === 2 ? COLORS.red : COLORS.white}}>
                  {part}
                  {j < 2 ? ' ' : ''}
                </span>
              ))}
            </div>
            <div style={{marginTop: 18, display: 'flex', alignItems: 'center', gap: 16, fontSize: 30, fontWeight: 600, color: COLORS.muted}}>
              <span
                style={{
                  fontSize: 24,
                  fontWeight: 800,
                  color: COLORS.white,
                  background: s.projected ? 'rgba(255,255,255,0.12)' : COLORS.red,
                  padding: '6px 14px',
                  borderRadius: 8,
                  letterSpacing: '0.06em',
                }}
              >
                {s.year}
              </span>
              <span style={{fontVariantNumeric: 'tabular-nums'}}>
                {s.projected && s.year === '2050' ? '~' : ''}
                {s.pct}%{s.projected ? ' · projected' : ''}
              </span>
            </div>
          </div>
        ))}
      </div>
      <svg width={COLS * PITCH} height={ROWS * PITCH} style={{display: 'block', marginTop: 24}}>
        {Array.from({length: COLS * ROWS}).map((_, i) => {
          const col = Math.floor(i / ROWS);
          const row = i % ROWS;
          const amount = Math.max(0, Math.min(1, filled - i));
          const cx = col * PITCH + PITCH / 2;
          const cy = row * PITCH + PITCH / 2;
          return (
            <g key={i}>
              <circle cx={cx} cy={cy} r={12} fill="rgba(148,163,184,0.18)" />
              <circle cx={cx} cy={cy} r={12 * (0.4 + 0.6 * amount)} fill={COLORS.red} opacity={amount} />
            </g>
          );
        })}
      </svg>
      <div style={{marginTop: 18, display: 'flex', gap: 30, fontSize: 22, fontWeight: 600, color: COLORS.muted}}>
        <span>
          <span style={{color: COLORS.red}}>●</span> aged 65+
        </span>
        <span>
          <span style={{color: 'rgba(148,163,184,0.45)'}}>●</span> under 65 · each dot = 1% of citizens
        </span>
      </div>
    </Card>
  );
};

export const DriversScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const header = spring({frame, fps, config: {damping: 200}});
  return (
    <AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          left: 120,
          top: 92,
          opacity: header,
          transform: `translateY(${interpolate(header, [0, 1], [24, 0])}px)`,
        }}
      >
        <Eyebrow>02 · Why it stalls</Eyebrow>
        <div style={{marginTop: 22, fontSize: 72, fontWeight: 800, color: COLORS.white, letterSpacing: '-0.01em'}}>
          Fewer babies. <span style={{color: COLORS.red}}>More seniors.</span>
        </div>
      </div>
      <FertilityCard />
      <AgeingCard />
      <Sources delay={24}>
        Sources: SingStat (resident TFR) · Population in Brief 2026 (citizens 65+) · NPTD (2030 outlook) · IPS population scenarios &amp; UN WPP 2024 (2050)
      </Sources>
    </AbsoluteFill>
  );
};
