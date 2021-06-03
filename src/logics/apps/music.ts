import {
  diatonicChord,
  diatonicSeventhChord,
  sus2Chord,
  sus4Chord,
} from '../core/chord ';
import { MelodyStructure, Sound } from '../core/melody';
import { createReasonableChords } from './chord';
import { Feelings } from './feeling';
import { feelingsToScales } from './scale';

export function createMusicStructure(
  bpm: number,
  timeSigneture: [number, number],
  timeSeconds: number,
  key: Sound,
  feelings: Feelings
): MelodyStructure {
  const scales = feelingsToScales(feelings);
  const count = calculateBarCount(bpm, timeSigneture, timeSeconds);
  const chordProgression = createReasonableChords(
    count,
    [diatonicChord, diatonicSeventhChord, sus2Chord, sus4Chord],
    scales,
    key
  );

  return {
    bpm: bpm,
    chordProgression: chordProgression,
    timeSigneture: timeSigneture,
    scales: scales,
  };
}

function calculateBarCount(
  bpm: number,
  timeSignetures: [number, number],
  timeSecounds: number
) {
  // - 120 / 60 = 2 ... 1秒あたり2回ビートを刻む＝1beatごとに0.5秒
  //     - 1 / (bpm / 60) * n = timeLength
  // - n = timeLength * (bpm / 60)
  // - 合計n回4部音符がある
  // - measured音符は何回？　＝ n : 4 = x : measured <=> 4x = n * measured <=> x = n * measured / 4
  // - 1barあたりpluses回ビートを刻む= x / pluses個のbarが存在する

  const [pulses, measured] = timeSignetures;
  const countOf4n = timeSecounds * (bpm / 60);
  const countOfMeasured = (countOf4n * measured) / 4;

  return countOfMeasured / pulses;
}
