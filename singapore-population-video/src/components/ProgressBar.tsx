import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS} from '../theme';

export const ProgressBar: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const progress = (frame + 1) / durationInFrames;
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        bottom: 0,
        height: 6,
        width: `${progress * 100}%`,
        background: `linear-gradient(90deg, ${COLORS.red}, ${COLORS.redSoft})`,
        boxShadow: `0 0 18px ${COLORS.red}`,
      }}
    />
  );
};
