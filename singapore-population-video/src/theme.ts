import {loadFont} from '@remotion/fonts';
import {staticFile} from 'remotion';

export const COLORS = {
  bg: '#0A0F1C',
  bgRaised: '#111A2E',
  card: 'rgba(255,255,255,0.04)',
  cardBorder: 'rgba(255,255,255,0.09)',
  red: '#EE2536',
  redSoft: '#FF5A66',
  white: '#F8FAFC',
  muted: '#94A3B8',
  dim: '#5B6B85',
  grid: 'rgba(148,163,184,0.14)',
  building: '#141E35',
  buildingEdge: '#1E2A47',
} as const;

const FAMILY = 'Inter Video';

// Bundled Inter (SIL OFL) so the render looks identical on any machine.
const WEIGHTS = ['400', '500', '600', '700', '800', '900'] as const;
for (const weight of WEIGHTS) {
  loadFont({
    family: FAMILY,
    url: staticFile(`fonts/inter-latin-${weight}-normal.woff2`),
    weight,
  });
}

export const FONT = `'${FAMILY}', Inter, system-ui, sans-serif`;

export const clamp = {
  extrapolateLeft: 'clamp',
  extrapolateRight: 'clamp',
} as const;
