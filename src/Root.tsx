import React from 'react';
import {Composition} from 'remotion';
import {VerticalAINews} from './VerticalAINews';
import {BitcoinNews} from './BitcoinNews';
import {LuxuryNewsTemplate} from './LuxuryNewsTemplate';
import {BTCStrategyUpdate} from './BTCStrategyUpdate';
import {GoldNewsClip} from './GoldNewsClip';

export const Root: React.FC = () => {
  return (
    <>
      <Composition
        id="VerticalAINews"
        component={VerticalAINews}
        durationInFrames={1140}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="BitcoinNews"
        component={BitcoinNews}
        durationInFrames={900}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="LuxuryNewsTemplate"
        component={LuxuryNewsTemplate}
        durationInFrames={900}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="BTCStrategyUpdate"
        component={BTCStrategyUpdate}
        durationInFrames={1200}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="GoldNewsClip"
        component={GoldNewsClip}
        durationInFrames={1200}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
