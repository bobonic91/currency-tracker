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
import {HISTORY, PROJECTION, valueAt} from '../data';
import {clamp, COLORS} from '../theme';

// Plot geometry
const X0 = 200;
const X1 = 1720;
const Y_TOP = 360;
const Y_BOT = 900;
const YEAR_MIN = 1970;
const YEAR_MAX = 2050;
const V_MAX = 7;

const xs = (year: number) => X0 + ((year - YEAR_MIN) / (YEAR_MAX - YEAR_MIN)) * (X1 - X0);
const ys = (v: number) => Y_BOT - (v / V_MAX) * (Y_BOT - Y_TOP);

const toPath = (pts: Array<[number, number]>) =>
  pts.map(([yr, v], i) => `${i === 0 ? 'M' : 'L'} ${xs(yr).toFixed(1)} ${ys(v).toFixed(1)}`).join(' ');

const HISTORY_PATH = toPath(HISTORY);
const HISTORY_AREA = `${HISTORY_PATH} L ${xs(2026)} ${Y_BOT} L ${xs(1970)} ${Y_BOT} Z`;
const PROJECTION_PATH = toPath(PROJECTION);

// Timeline (scene-local frames)
const HIST_START = 18;
const HIST_END = 125;
const PROJ_START = 140;
const PROJ_END = 200;

const Label: React.FC<{
  x: number;
  y: number;
  anchor?: 'start' | 'middle' | 'end';
  opacity: number;
  title: string;
  detail?: string;
  color?: string;
}> = ({x, y, anchor = 'start', opacity, title, detail, color = COLORS.white}) => (
  <g opacity={opacity} transform={`translate(0 ${(1 - opacity) * 12})`}>
    <text x={x} y={y} textAnchor={anchor} fill={color} fontSize={34} fontWeight={800}>
      {title}
    </text>
    {detail ? (
      <text x={x} y={y + 30} textAnchor={anchor} fill={COLORS.muted} fontSize={22} fontWeight={500}>
        {detail}
      </text>
    ) : null}
  </g>
);

export const GrowthChartScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const histYear = interpolate(frame, [HIST_START, HIST_END], [1970, 2026], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  const projYear = interpolate(frame, [PROJ_START, PROJ_END], [2026, 2050], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  const inProjection = frame >= PROJ_START;
  const currentYear = inProjection ? projYear : histYear;
  const currentValue = inProjection ? valueAt(PROJECTION, projYear) : valueAt(HISTORY, histYear);
  // Counter shows the figure for the whole year on screen (no in-between values).
  const shownYear = Math.floor(currentYear + 1e-6);
  const shownValue = valueAt(inProjection ? PROJECTION : HISTORY, shownYear);

  const header = spring({frame, fps, config: {damping: 200}});
  const axes = interpolate(frame, [4, 22], [0, 1], clamp);
  const plateau = spring({frame: frame - PROJ_START + 4, fps, config: {damping: 200}});
  const zone = interpolate(frame, [PROJ_START - 14, PROJ_START + 4], [0, 1], clamp);

  const headX = xs(currentYear);
  const headY = ys(currentValue);
  const drawing = (frame >= HIST_START && frame <= HIST_END + 4) || (frame >= PROJ_START && frame <= PROJ_END + 4);
  const pulse = 1 + 0.35 * Math.sin(frame / 4);

  const label1970 = interpolate(frame, [10, 24], [0, 1], clamp);
  const labelCovid = interpolate(histYear, [2021, 2024], [0, 1], clamp);
  const label2026 = interpolate(frame, [HIST_END - 2, HIST_END + 12], [0, 1], clamp);
  const label2050 = interpolate(frame, [PROJ_END - 2, PROJ_END + 12], [0, 1], clamp);

  const badge = interpolate(frame, [PROJ_START - 6, PROJ_START + 6], [0, 1], clamp);

  return (
    <AbsoluteFill>
      {/* Header */}
      <div
        style={{
          position: 'absolute',
          left: 120,
          top: 92,
          opacity: header,
          transform: `translateY(${interpolate(header, [0, 1], [24, 0])}px)`,
        }}
      >
        <Eyebrow>01 · The trend</Eyebrow>
        <div style={{position: 'relative', marginTop: 22, height: 86, fontSize: 72, fontWeight: 800, letterSpacing: '-0.01em', whiteSpace: 'nowrap'}}>
          <div
            style={{
              position: 'absolute',
              color: COLORS.white,
              opacity: 1 - plateau,
              transform: `translateY(${-24 * plateau}px)`,
            }}
          >
            Six decades of growth
          </div>
          <div
            style={{
              position: 'absolute',
              color: COLORS.white,
              opacity: plateau,
              transform: `translateY(${24 * (1 - plateau)}px)`,
            }}
          >
            Then, <span style={{color: COLORS.red}}>a plateau</span>
          </div>
        </div>
        <div style={{marginTop: 10, fontSize: 28, fontWeight: 500, color: COLORS.muted}}>
          Total population (residents + non-residents), millions
        </div>
      </div>

      {/* Live counter */}
      <div
        style={{
          position: 'absolute',
          right: 120,
          top: 104,
          textAlign: 'right',
          opacity: header,
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        <div style={{display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 14}}>
          <span
            style={{
              fontSize: 20,
              fontWeight: 800,
              letterSpacing: '0.16em',
              color: COLORS.white,
              background: COLORS.red,
              padding: '6px 12px',
              borderRadius: 6,
              opacity: badge,
            }}
          >
            PROJECTED
          </span>
          <span style={{fontSize: 40, fontWeight: 700, color: COLORS.muted}}>{shownYear}</span>
        </div>
        <div style={{fontSize: 112, fontWeight: 900, color: COLORS.white, lineHeight: 1, letterSpacing: '-0.02em'}}>
          {shownValue.toFixed(2)}
          <span style={{fontSize: 60, color: COLORS.red, marginLeft: 6}}>M</span>
        </div>
      </div>

      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0}}>
        <defs>
          <linearGradient id="area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={COLORS.red} stopOpacity={0.38} />
            <stop offset="100%" stopColor={COLORS.red} stopOpacity={0} />
          </linearGradient>
          <clipPath id="histClip">
            <rect x={X0 - 10} y={0} width={Math.max(0, xs(histYear) - X0 + 10)} height={1080} />
          </clipPath>
          <clipPath id="projClip">
            <rect x={xs(2026)} y={0} width={Math.max(0, xs(projYear) - xs(2026))} height={1080} />
          </clipPath>
        </defs>

        {/* Projection zone */}
        <g opacity={zone}>
          <rect x={xs(2026)} y={Y_TOP - 30} width={X1 - xs(2026) + 30} height={Y_BOT - Y_TOP + 30} fill="rgba(255,255,255,0.035)" rx={10} />
          <text x={xs(2026) + 20} y={Y_TOP - 2} fill={COLORS.muted} fontSize={20} fontWeight={700} letterSpacing="0.18em">
            UN PROJECTION
          </text>
        </g>

        {/* Grid + axes */}
        <g opacity={axes}>
          {[0, 2, 4, 6].map((v) => (
            <g key={v}>
              <line x1={X0} x2={X1 + 30} y1={ys(v)} y2={ys(v)} stroke={v === 0 ? 'rgba(148,163,184,0.35)' : COLORS.grid} strokeWidth={v === 0 ? 2 : 1.5} />
              <text x={X0 - 22} y={ys(v) + 9} textAnchor="end" fill={COLORS.dim} fontSize={24} fontWeight={600}>
                {v === 0 ? '0' : `${v}M`}
              </text>
            </g>
          ))}
          {[1970, 1980, 1990, 2000, 2010, 2020, 2030, 2040, 2050].map((yr) => (
            <text key={yr} x={xs(yr)} y={Y_BOT + 44} textAnchor="middle" fill={yr === 2050 ? COLORS.white : COLORS.dim} fontSize={24} fontWeight={yr === 2050 ? 800 : 600}>
              {yr}
            </text>
          ))}
        </g>

        {/* History */}
        <g clipPath="url(#histClip)">
          <path d={HISTORY_AREA} fill="url(#area)" />
          <path d={HISTORY_PATH} fill="none" stroke={COLORS.red} strokeWidth={7} strokeLinejoin="round" strokeLinecap="round" />
        </g>

        {/* Projection */}
        <g clipPath="url(#projClip)">
          <path d={PROJECTION_PATH} fill="none" stroke={COLORS.white} strokeOpacity={0.9} strokeWidth={6} strokeDasharray="16 14" strokeLinecap="round" />
        </g>

        {/* Moving head */}
        {drawing ? (
          <g>
            <circle cx={headX} cy={headY} r={18 * pulse} fill={inProjection ? COLORS.white : COLORS.red} opacity={0.18} />
            <circle cx={headX} cy={headY} r={10} fill={inProjection ? COLORS.white : COLORS.red} stroke={COLORS.bg} strokeWidth={3} />
          </g>
        ) : null}

        {/* Anchored points */}
        <g opacity={label1970}>
          <circle cx={xs(1970)} cy={ys(2.07)} r={9} fill={COLORS.red} stroke={COLORS.bg} strokeWidth={3} />
        </g>
        <Label x={xs(1970) + 4} y={ys(2.07) - 72} opacity={label1970} title="2.07M" detail="in 1970" />
        <Label x={xs(2021) + 6} y={ys(5.45) + 18} anchor="middle" opacity={labelCovid * (1 - zone * 0.6)} title="" detail="2021 · Covid-era dip" />

        <g opacity={label2026}>
          <circle cx={xs(2026)} cy={ys(6.21)} r={11} fill={COLORS.red} stroke={COLORS.bg} strokeWidth={3} />
        </g>
        <Label x={xs(2026) - 24} y={ys(6.21) - 66} anchor="end" opacity={label2026} title="6.21M" detail="June 2026" color={COLORS.red} />

        <g opacity={label2050}>
          <circle cx={xs(2050)} cy={ys(6.08)} r={12 * (1 + 0.15 * Math.sin(frame / 5))} fill={COLORS.white} stroke={COLORS.bg} strokeWidth={3} />
        </g>
        <Label x={xs(2050)} y={ys(6.08) - 62} anchor="end" opacity={label2050} title="≈6.1M" detail="by 2050" />
      </svg>

      <Sources delay={30}>
        Sources: Singapore Department of Statistics (1970–2026, incl. Population Trends 2026) · UN World Population Prospects 2024, medium variant (2040–2050)
      </Sources>
    </AbsoluteFill>
  );
};
