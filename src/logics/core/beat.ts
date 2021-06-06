import { select } from '../../utils/array';
import { Beat } from './melody';

export type LeaderBoard = Beat[];

export function selectBeats(
  timeSigneture: [number, number],
  leaderBoard: LeaderBoard
): Beat[] {
  const results: Beat[] = [];
  const [pulses, measured] = timeSigneture;
  let sum = 0;
  while (sum < pulses * measured) {
    const limit = pulses - sum;
    const maxi = Math.max(...leaderBoard.filter((v) => v <= limit));
    const beat = select(...leaderBoard.filter((v) => v <= maxi));

    if (beat === undefined) {
      break;
    }

    sum += beat;

    results.push(beat);
  }

  return results;
}
