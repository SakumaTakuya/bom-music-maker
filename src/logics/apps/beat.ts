import { clip } from '../../utils/math';
import { randomNormal } from '../../utils/random';
import { LeaderBoard } from '../core/beat';
import { Beat, PositionalOption } from '../core/melody';

export type Heat = number;

export function heatsToBeatsBoard(
  heats: PositionalOption<Heat>[]
): PositionalOption<LeaderBoard>[] {
  const result: PositionalOption<LeaderBoard>[] = [];
  for (const heat of heats) {
    result.push({
      position: heat.position,
      value: Array.from({ length: 10 }, () => heatToBeat(heat.value)),
    });
  }
  return result;
}

export function heatToBeat(heat: Heat): Beat {
  return Math.pow(2, clip(Math.round(randomNormal(heat)), -2, 2)) as Beat;
}
