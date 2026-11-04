import React from 'react';
import {COLORS} from '../theme';

export const Eyebrow: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({
  children,
  style,
}) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      fontSize: 24,
      fontWeight: 700,
      letterSpacing: '0.22em',
      textTransform: 'uppercase',
      color: COLORS.muted,
      ...style,
    }}
  >
    <span
      style={{
        width: 12,
        height: 12,
        borderRadius: 6,
        background: COLORS.red,
        boxShadow: `0 0 16px ${COLORS.red}`,
      }}
    />
    {children}
  </div>
);
