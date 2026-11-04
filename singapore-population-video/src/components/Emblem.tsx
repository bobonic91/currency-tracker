import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS} from '../theme';

const starPath = (outer: number) => {
  const inner = outer * 0.4;
  const pts: string[] = [];
  for (let k = 0; k < 10; k++) {
    const a = (-90 + k * 36) * (Math.PI / 180);
    const rad = k % 2 === 0 ? outer : inner;
    pts.push(`${(Math.cos(a) * rad).toFixed(2)},${(Math.sin(a) * rad).toFixed(2)}`);
  }
  return `M ${pts.join(' L ')} Z`;
};

/**
 * Red disc with the crescent and five stars of Singapore's flag.
 * Render inside an <svg>. `id` must be unique per instance (used for the mask).
 */
export const Emblem: React.FC<{id: string; cx: number; cy: number; r: number; delay?: number}> = ({
  id,
  cx,
  cy,
  r,
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const disc = spring({frame: frame - delay, fps, config: {damping: 200}, durationInFrames: 40});
  const rise = interpolate(disc, [0, 1], [r * 0.45, 0]);
  const crescent = spring({frame: frame - delay - 14, fps, config: {damping: 200}});

  const ringR = 0.24 * r;
  const starR = 0.085 * r;
  const ringCx = 0.16 * r;
  const star = starPath(starR);

  return (
    <g transform={`translate(${cx} ${cy + rise})`} opacity={disc}>
      <defs>
        <radialGradient id={`${id}-disc`} cx="40%" cy="40%" r="65%">
          <stop offset="0%" stopColor="#FF4F5C" />
          <stop offset="65%" stopColor={COLORS.red} />
          <stop offset="100%" stopColor="#A50F1C" />
        </radialGradient>
        <mask id={`${id}-mask`}>
          <rect x={-r} y={-r} width={2 * r} height={2 * r} fill="white" />
          <circle cx={-0.02 * r} cy={0} r={0.54 * r} fill="black" />
        </mask>
      </defs>
      <circle r={r * 1.32} fill="none" stroke={COLORS.red} strokeOpacity={0.16} strokeWidth={2} />
      <circle r={r} fill={`url(#${id}-disc)`} />
      <g opacity={crescent} transform={`scale(${interpolate(crescent, [0, 1], [0.85, 1])})`}>
        <circle cx={-0.18 * r} cy={0} r={0.58 * r} fill="#FFFFFF" mask={`url(#${id}-mask)`} />
      </g>
      {Array.from({length: 5}).map((_, k) => {
        const a = (-90 + k * 72) * (Math.PI / 180);
        const s = spring({frame: frame - delay - 20 - k * 3, fps, config: {damping: 12, mass: 0.6}});
        return (
          <path
            key={k}
            d={star}
            fill="#FFFFFF"
            transform={`translate(${ringCx + Math.cos(a) * ringR} ${Math.sin(a) * ringR}) scale(${s})`}
          />
        );
      })}
    </g>
  );
};
