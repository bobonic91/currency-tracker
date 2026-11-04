import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {COLORS} from '../theme';

export const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const drift = frame * 0.35;
  const glowX = 70 + Math.sin(frame / 90) * 8;
  const glowY = 20 + Math.cos(frame / 110) * 6;

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.bg}}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(1200px 800px at ${glowX}% ${glowY}%, rgba(238,37,54,0.16), transparent 60%), radial-gradient(900px 700px at 10% 100%, rgba(59,91,170,0.18), transparent 60%)`,
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage:
            'radial-gradient(rgba(148,163,184,0.12) 1.4px, transparent 1.4px)',
          backgroundSize: '44px 44px',
          backgroundPosition: `${drift}px ${drift * 0.5}px`,
          maskImage:
            'radial-gradient(ellipse at center, black 30%, transparent 80%)',
          WebkitMaskImage:
            'radial-gradient(ellipse at center, black 30%, transparent 80%)',
        }}
      />
    </AbsoluteFill>
  );
};
