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

    const octave = clip(Math.floor(num / 12), 0, 11) as Octave;

    return new Sound(octave, pitch);
  }

  toNumber(): number {
    return this.octave * 12 + this.pitch;
  }

  add(degree: Degree, canChangePitch: boolean = true): Sound {
    const added = this.toNumber() + degree;
    const pitch = Math.abs(added % 12) as Degree;
    const octave = clip(
      canChangePitch ? Math.floor(added / 12) : this.octave,
      0,
      11
    ) as Octave;

    return new Sound(octave, pitch);
  }

  closed(key: Sound): Sound {
    const diff = key.toNumber() - this.toNumber();
    const absDiff = Math.abs(diff);
    return new Sound(
      absDiff < 12
        ? this.octave
        : (clip(this.octave + diff / absDiff, 0, 11) as Octave),
      this.pitch
    );
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

export type Octave = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;
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
  load(melody: Melody): Promise<void>;
  play(): Promise<void>;
  stop(): void;
}

export type Synth = 'synth' | 'am' | 'piano';
