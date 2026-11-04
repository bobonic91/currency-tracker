import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {linearTiming, TransitionSeries} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {slide} from '@remotion/transitions/slide';
import {Background} from './components/Background';
import {ProgressBar} from './components/ProgressBar';
import {DriversScene} from './scenes/DriversScene';
import {GrowthChartScene} from './scenes/GrowthChartScene';
import {OutroScene} from './scenes/OutroScene';
import {TitleScene} from './scenes/TitleScene';
import {clamp, FONT} from './theme';
import {SCENES, TRANSITION} from './timing';

const timing = linearTiming({durationInFrames: TRANSITION});

export const SingaporePopulation2050: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const fadeOut = interpolate(frame, [durationInFrames - 12, durationInFrames - 1], [0, 1], clamp);

  return (
    <AbsoluteFill style={{fontFamily: FONT}}>
      <Background />
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={SCENES.title}>
          <TitleScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={timing} />
        <TransitionSeries.Sequence durationInFrames={SCENES.growth}>
          <GrowthChartScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={slide({direction: 'from-right'})} timing={timing} />
        <TransitionSeries.Sequence durationInFrames={SCENES.drivers}>
          <DriversScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={timing} />
        <TransitionSeries.Sequence durationInFrames={SCENES.outro}>
          <OutroScene />
        </TransitionSeries.Sequence>
      </TransitionSeries>
      <ProgressBar />
      <AbsoluteFill style={{backgroundColor: '#05080F', opacity: fadeOut * 0.85, pointerEvents: 'none'}} />
    </AbsoluteFill>
  );
};
