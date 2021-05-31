import { PositionalOption } from '../core/melody';
import { majorScale, minorScale, ScaleFunction } from '../core/scale';

export type Feeling = 'chreeful' | 'dismal';
export type Feelings = PositionalOption<Feeling>[];

export const scaleMap: { [index in Feeling]: ScaleFunction } = {
  chreeful: majorScale,
  dismal: minorScale,
};
