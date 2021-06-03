import { Beat, PositionalOption, Scale } from '../core/melody';
import { majorScale, minorScale } from '../core/scale';

export type Feeling = 'chreeful' | 'dismal';
export type Feelings = PositionalOption<Feeling>[];

export const scaleMap: { [index in Feeling]: Scale } = {
  chreeful: majorScale,
  dismal: minorScale,
};

export type Heat = 'calm' | 'agitato';
export type Heats = PositionalOption<Heat>[];

export const accompanimentBeatLeaderBoardMap: { [index in Heat]: Beat[] } = {
  calm: [4, 2, 2, 1],
  agitato: [2, 2, 1, 1, 0.5, 0.5, 0.25],
};

export const melodyBeatLeaderBoardMap: { [index in Heat]: Beat[] } = {
  calm: [4, 2, 2, 1, 1, 1, 1],
  agitato: [2, 2, 1, 1, 1, 1, 0.5, 0.5, 0.25, 0.25],
};
