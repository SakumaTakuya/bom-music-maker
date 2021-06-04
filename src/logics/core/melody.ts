import { clip } from '../../utils/math';

export interface Melody {
  structure: MelodyStructure;
  parts: Part[];
}

export interface MelodyStructure {
  bpm: number;
  chordProgression: Chord[];
  timeSigneture: [number, number];
  scales: PositionalOption<Scale>[];
}

export interface PositionalOption<T> {
  value: T;
  position: Position;
}

export type Chord = Sound[];

export class Sound {
  constructor(public readonly octave: Octave, public readonly pitch: Degree) {}

  static fromNumber(num: number): Sound {
    const pitch = Math.abs(num % 12) as Degree;

    const octave = clip(Math.floor(num / 12), -4, 11) as Octave;

    return new Sound(octave, pitch);
  }

  add(degree: Degree, canChangePitch: boolean = true): Sound {
    const added = this.pitch + degree;
    const pitch = Math.abs(added % 12) as Degree;
    const octave = clip(
      canChangePitch ? this.octave + Math.floor(added / 12) : this.octave,
      -4,
      11
    ) as Octave;

    return new Sound(octave, pitch);
  }
}

export interface Part {
  synth: Synth;
  bars: Bar[];
  position: Position;
}

export interface Bar {
  notes: Note[];
}

export interface Note {
  sounds: Sound[];
  beat: Beat;
}

export type Octave =
  | -4
  | -3
  | -2
  | -1
  | 0
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11;
export type Scale = [Degree, Degree, Degree, Degree, Degree, Degree, Degree];
export type ScaleIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6;
export type Degree = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;
export type Position = number;
export type Beat = 0.25 | 0.5 | 1 | 2 | 4;

declare global {
  interface Array<T extends PositionalOption<unknown>> {
    current(position: Position): T;
  }
}

Array.prototype.current = function <U>(position: Position) {
  const array = this as Array<PositionalOption<U>>;
  return array
    .filter((value) => value.position <= position)
    .sort((a, b) => b.position - a.position)[0];
};

export interface Player {
  melody: Melody;
  load(): Promise<void>;
  play(): Promise<void>;
}

export type Synth = 'synth' | 'am';
