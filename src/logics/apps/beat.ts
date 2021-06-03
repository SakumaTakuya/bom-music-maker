import { Beat, PositionalOption } from '../core/melody';
import { Heats, accompanimentBeatLeaderBoardMap } from './feeling';

type Beats = PositionalOption<Beat[]>[];

export function heatsToBeatsBoard(heats: Heats): Beats {
  const result: Beats = [];
  for (const heat of heats) {
    result.push({
      position: heat.position,
      value: accompanimentBeatLeaderBoardMap[heat.value],
    });
  }
  return result;
}
