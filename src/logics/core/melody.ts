import { assert } from 'console';

export interface Melody {
  structure: MelodyStructure;
  parts: Part[];
}

export interface MelodyStructure {
  bpms: PositionalOption<number>[];
  chordProgression: Chord[];
  timeSignetures: PositionalOption<[number, number]>[];
  scales: PositionalOption<Scale>[];
}

interface PositionalOption<T> {
  value: T;
  position: Position;
}

export interface Chord {
  root: ScaleIndex;
  indices(): ScaleIndex[];
}

export class Sound {
  constructor(public readonly pitch: number, public readonly degree: Degree) {}

  static fromDegree(degree: Degree): Sound {
    const deg = Math.abs(degree % 12) as Degree;
    assert(deg >= 0 && deg < 12);

    return new Sound(Math.floor(degree / 12), deg);
  }

  add(other: Degree): Sound {
    const added = this.degree + other;
    const deg = Math.abs(added % 12) as Degree;
    assert(deg >= 0 && deg < 12);

    return new Sound(this.pitch + Math.floor(added / 12), deg);
  }
}

export interface Part {
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

export type Scale = [Sound, Sound, Sound, Sound, Sound, Sound, Sound];
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
