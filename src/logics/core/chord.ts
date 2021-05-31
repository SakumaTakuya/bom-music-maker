import { ScaleIndex, Chord } from './melody';
import { select } from '../../utils/array';

export type ChordFunction = (root: ScaleIndex) => ScaleIndex[];

export function diatonicChord(root: ScaleIndex): ScaleIndex[] {
  return [0, 2, 4].map((id) => ((id + root) % 7) as ScaleIndex);
}

export function diatonicSeventhChord(root: ScaleIndex): ScaleIndex[] {
  return [0, 2, 4, 6].map((id) => ((id + root) % 7) as ScaleIndex);
}

export function susChord(root: ScaleIndex): ScaleIndex[] {
  return [0, 4].map((id) => ((id + root) % 7) as ScaleIndex);
}

interface ScaleIndexElement {
  index: ScaleIndex;
  nexts: ScaleIndex[];
}

const scaleIndexMap: ScaleIndexElement[] = [
  { index: 0, nexts: [0, 1, 2, 3, 4, 5] },
  { index: 1, nexts: [4] },
  { index: 2, nexts: [0, 1, 2, 3, 4, 5] },
  { index: 3, nexts: [0, 1, 2, 3, 5] },
  { index: 4, nexts: [0, 5] },
  { index: 5, nexts: [0, 1, 2, 3, 4, 5] },
  { index: 6, nexts: [0] },
];

const scaleIndexReverseMap: ScaleIndex[][] = [
  [0, 2, 3, 4, 5],
  [0, 2, 3, 5],
  [0, 2, 3, 5],
  [0, 2, 3, 5],
  [0, 1, 2, 5],
  [0, 2, 3, 4, 5],
  [],
];

// 理論通りにコード進行を作成
export function createChordProgression(
  length: number,
  chordFuncs: ChordFunction[],
  start?: ScaleIndex,
  end?: ScaleIndex
): Chord[] {
  const chords: Chord[] = [];
  let currentRoot = scaleIndexMap[start || 0];
  for (let i = 0; i < length; i++) {
    const next = select(...currentRoot.nexts);
    const chordFunc = select(...chordFuncs);
    currentRoot = scaleIndexMap[next];
    chords.push({
      root: currentRoot.index,
      indices: function () {
        return chordFunc(this.root);
      },
    });
  }

  if (typeof end === 'undefined') {
    return chords;
  }

  chords[length - 1].root = end;
  let destination = end;
  for (let i = length - 2; i > 0; i--) {
    const root = chords[i].root;
    if (destination in scaleIndexMap[root].nexts) {
      break;
    }

    // 目標値に到達できないので到達できるScaleIndexに置き換える
    const altered = select(...scaleIndexReverseMap[destination]);
    chords[i].root = altered;
    destination = altered;
  }

  return chords;
}
