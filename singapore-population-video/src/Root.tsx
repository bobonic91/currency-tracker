import React from 'react';
import {Composition} from 'remotion';
import {FPS, HEIGHT, TOTAL_DURATION, WIDTH} from './timing';
import {SingaporePopulation2050} from './SingaporePopulation2050';

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="SingaporePopulation2050"
      component={SingaporePopulation2050}
      durationInFrames={TOTAL_DURATION}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
    />
  );
};
