import {
  ScaleIndex,
  Chord,
  Sound,
  Scale,
  Degree,
  PositionalOption,
  Position,
} from './melody';
import { select } from '../../utils/array';

export type ChordFunction = (key: Sound, scale: Scale) => Chord;

export function diatonicChord(key: Sound, scale: Scale): Chord {
  return [0, 2, 4].map((id) => key.add(scale[id] as Degree, false));
}

export function diatonicSeventhChord(key: Sound, scale: Scale): Chord {
  return [0, 2, 4, 6].map((id) => key.add(scale[id] as Degree, false));
}

export function sus2Chord(key: Sound, scale: Scale): Chord {
  const result = [0, 4].map((id) => key.add(scale[id] as Degree, false));
  result.push(key.add(2, false));
  return result;
}

export function sus4Chord(key: Sound, scale: Scale): Chord {
  const result = [0, 4].map((id) => key.add(scale[id] as Degree, false));
  result.push(key.add(4, false));
  return result;
}

interface ScaleIndexElement {
  index: ScaleIndex;
  nexts: ScaleIndex[];
}

export const scaleIndexMap: ScaleIndexElement[] = [
  { index: 0, nexts: [0, 1, 2, 3, 4, 5] },
  { index: 1, nexts: [4] },
  { index: 2, nexts: [0, 1, 2, 3, 4, 5] },
  { index: 3, nexts: [0, 1, 2, 3, 5] },
  { index: 4, nexts: [0, 5] },
  { index: 5, nexts: [0, 1, 2, 3, 4, 5] },
  { index: 6, nexts: [0] },
];

export const scaleIndexReverseMap: ScaleIndex[][] = [
  [0, 2, 3, 4, 5],
  [0, 2, 3, 5],
  [0, 2, 3, 5],
  [0, 2, 3, 5],
  [0, 1, 2, 5],
  [0, 2, 3, 4, 5],
  [],
];

const modulationChordFuncs = [sus2Chord, sus4Chord];

// 理論通りにコード進行を作成
export function createChordProgression(
  startPosition: Position,
  count: number,
  chordFuncs: ChordFunction[],
  key: Sound,
  scales: PositionalOption<Scale>[],
  start?: ScaleIndex,
  end?: ScaleIndex
): Chord[] {
  const chords: Chord[] = [];
  let currentRoot = scaleIndexMap[start || 0];
  const roots: ScaleIndex[] = [currentRoot.index];
  const barPosition = startPosition + count;
  for (let i = startPosition; i < barPosition; i++) {
    const current = select(...currentRoot.nexts);

    const scale = scales.current(i).value;
    const nextScale = scales.current(i + 1).value;
    const selection = scale === nextScale ? chordFuncs : modulationChordFuncs;
    const chordFunc = select(...selection);

    currentRoot = scaleIndexMap[current];

    chords.push(chordFunc(key.add(scale[currentRoot.index]), scale));
    roots.push(currentRoot.index);
  }

  if (typeof end === 'undefined') {
    return chords;
  }

  roots[length - 1] = end;
  let destination = end;
  for (let i = length - 2; i > 0; i--) {
    const root = roots[i];
    if (destination in scaleIndexMap[root].nexts) {
      break;
    }

    const scale = scales.current(i).value;
    const nextScale = scales.current(i - 1).value;
    const selection = scale === nextScale ? chordFuncs : modulationChordFuncs;
    const chordFunc = select(...selection);

    // 目標値に到達できないので到達できるScaleIndexに置き換える
    const altered = select(...scaleIndexReverseMap[destination]);
    roots[i] = altered;
    chords[i] = chordFunc(key.add(scale[currentRoot.index]), scale);
    destination = altered;
  }

  return chords;
}
