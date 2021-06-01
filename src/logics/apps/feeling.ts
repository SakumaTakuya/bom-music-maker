import { PositionalOption, Scale } from '../core/melody';
import { majorScale, minorScale } from '../core/scale';

export type Feeling = 'chreeful' | 'dismal';
export type Feelings = PositionalOption<Feeling>[];

export const scaleMap: { [index in Feeling]: Scale } = {
  chreeful: majorScale,
  dismal: minorScale,
};
