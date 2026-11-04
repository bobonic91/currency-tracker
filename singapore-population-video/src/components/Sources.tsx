import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {clamp, COLORS} from '../theme';

export const Sources: React.FC<{children: React.ReactNode; delay?: number}> = ({
  children,
  delay = 20,
}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [delay, delay + 15], [0, 1], clamp);
  return (
    <div
      style={{
        position: 'absolute',
        left: 120,
        right: 120,
        bottom: 48,
        fontSize: 19,
        fontWeight: 500,
        color: COLORS.dim,
        letterSpacing: '0.01em',
        opacity,
      }}
    >
      {children}
    </div>
  );
};
