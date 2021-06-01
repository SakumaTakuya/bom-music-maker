import { PositionalOption, Scale } from '../core/melody';
import { Feelings, scaleMap } from './feeling';

type Scales = PositionalOption<Scale>[];

export function feelingsToScales(feelings: Feelings): Scales {
  const result: Scales = [];
  for (const feeling of feelings) {
    result.push({
      position: feeling.position,
      value: scaleMap[feeling.value],
    });
  }
  return result;
}
