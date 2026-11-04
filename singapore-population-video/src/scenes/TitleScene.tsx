import React from 'react';
import {
  AbsoluteFill,
  Easing,
  interpolate,
  random,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {Emblem} from '../components/Emblem';
import {Eyebrow} from '../components/Eyebrow';
import {clamp, COLORS} from '../theme';

type Building = {x: number; w: number; h: number; delay: number};

// Deterministic, generic skyline (seeded so every render is identical).
const BUILDINGS: Building[] = (() => {
  const list: Building[] = [];
  let x = 820;
  let i = 0;
  while (x < 1940) {
    const w = 46 + Math.round(random(`w${i}`) * 70);
    const tall = random(`t${i}`) > 0.72;
    const h = (tall ? 300 : 120) + Math.round(random(`h${i}`) * (tall ? 200 : 170));
    list.push({x, w, h, delay: i * 1.6});
    x += w + 6 + Math.round(random(`g${i}`) * 10);
    i++;
  }
  return list;
})();

const GROUND = 1080;

const Skyline: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <svg
      width={1920}
      height={1080}
      style={{position: 'absolute', inset: 0}}
      viewBox="0 0 1920 1080"
    >
      <defs>
        <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={COLORS.bg} stopOpacity={0} />
          <stop offset="100%" stopColor={COLORS.bg} stopOpacity={0.9} />
        </linearGradient>
      </defs>
      <Emblem id="title-emblem" cx={1440} cy={540} r={250} delay={4} />
      {BUILDINGS.map((b, i) => {
        const s = spring({
          frame: frame - 8 - b.delay,
          fps,
          config: {damping: 18, mass: 0.7},
        });
        const h = b.h * s;
        const top = GROUND - h;
        const rows = Math.floor((b.h - 40) / 34);
        const cols = Math.max(1, Math.floor((b.w - 16) / 22));
        return (
          <g key={i}>
            <rect x={b.x} y={top} width={b.w} height={h} fill={COLORS.building} />
            <rect x={b.x} y={top} width={b.w} height={3} fill={COLORS.buildingEdge} />
            {Array.from({length: rows}).map((_, r) =>
              Array.from({length: cols}).map((__, c) => {
                const wy = top + 26 + r * 34;
                if (wy > GROUND - 20) return null;
                const lit = random(`win-${i}-${r}-${c}`) > 0.62;
                if (!lit) return null;
                const flicker = interpolate(frame, [30 + ((r + c) % 7) * 4, 44 + ((r + c) % 7) * 4], [0, 1], clamp);
                return (
                  <rect
                    key={`${r}-${c}`}
                    x={b.x + 10 + c * 22}
                    y={wy}
                    width={10}
                    height={14}
                    rx={1.5}
                    fill={random(`warm-${i}-${r}-${c}`) > 0.8 ? '#FFB4A2' : '#C9D6F2'}
                    opacity={0.55 * flicker}
                  />
                );
              }),
            )}
          </g>
        );
      })}
      <rect x={0} y={760} width={1920} height={320} fill="url(#fade)" />
    </svg>
  );
};

export const TitleScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const eyebrow = spring({frame, fps, config: {damping: 200}});
  const name = spring({frame: frame - 6, fps, config: {damping: 200}});
  const yearPop = spring({frame: frame - 12, fps, config: {damping: 13, mass: 0.8}});
  const year = Math.round(
    interpolate(frame, [14, 54], [2026, 2050], {
      ...clamp,
      easing: Easing.out(Easing.cubic),
    }),
  );
  const sub = spring({frame: frame - 40, fps, config: {damping: 200}});

  return (
    <AbsoluteFill>
      <Skyline />
      <div style={{position: 'absolute', left: 140, top: 210}}>
        <Eyebrow
          style={{
            opacity: eyebrow,
            transform: `translateY(${interpolate(eyebrow, [0, 1], [20, 0])}px)`,
          }}
        >
          Population outlook · 2026 → 2050
        </Eyebrow>
        <div
          style={{
            marginTop: 34,
            fontSize: 128,
            fontWeight: 800,
            letterSpacing: '0.06em',
            color: COLORS.white,
            lineHeight: 1,
            opacity: name,
            transform: `translateY(${interpolate(name, [0, 1], [40, 0])}px)`,
          }}
        >
          SINGAPORE
        </div>
        <div
          style={{
            fontSize: 300,
            fontWeight: 900,
            lineHeight: 0.95,
            letterSpacing: '-0.03em',
            color: COLORS.red,
            fontVariantNumeric: 'tabular-nums',
            textShadow: '0 20px 80px rgba(238,37,54,0.35)',
            opacity: yearPop,
            transform: `scale(${interpolate(yearPop, [0, 1], [0.7, 1])})`,
            transformOrigin: 'left center',
          }}
        >
          {year}
        </div>
        <div
          style={{
            marginTop: 26,
            fontSize: 50,
            fontWeight: 500,
            color: COLORS.muted,
            opacity: sub,
            transform: `translateY(${interpolate(sub, [0, 1], [24, 0])}px)`,
          }}
        >
          How many of us — and <span style={{color: COLORS.white, fontWeight: 700}}>how old</span>?
        </div>
      </div>
    </AbsoluteFill>
  );
};
