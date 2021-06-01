import { select } from '../../utils/array';
import {
  ChordFunction,
  createChordProgression,
  scaleIndexMap,
  scaleIndexReverseMap,
} from '../core/chord ';
import { Chord, PositionalOption, Scale, Sound } from '../core/melody';

export function createReasonableChords(
  count: number,
  chordFuncs: ChordFunction[],
  scales: PositionalOption<Scale>[],
  key: Sound
): Chord[] {
  const createUnit = 8;
  const halfUnit = createUnit / 2;
  const result: Chord[] = [];
  let currentRoot = scaleIndexMap[0];
  for (let startPosition = 0; startPosition < count; ) {
    const start = currentRoot.index;
    const end = select(...scaleIndexReverseMap[start]);
    const next = select(...scaleIndexMap[end].nexts);

    const chord = createChordProgression(
      startPosition,
      halfUnit,
      chordFuncs,
      key,
      scales,
      start,
      end
    );

    const curerntScale = scales.current(startPosition).value;
    startPosition += halfUnit;

    // scaleが変わっている場合はコピーできない
    if (scales.current(startPosition).value != curerntScale) {
      result.push(...chord);
    } else {
      startPosition += halfUnit;
      result.push(...chord, ...chord);
    }

    currentRoot = scaleIndexMap[next];
  }

  return result;
}
