import * as Tone from 'tone';
import { Degree, Melody, Player, Sound, Synth } from '../core/melody';

type ToneSound = string | string[];

interface ToneMelody {
  time: string;
  note: ToneSound;
  duration: string;
}

interface TonePart {
  synth: Tone.PolySynth;
  melody: ToneMelody[];
}

const synthMap: { [index in Synth]: () => Tone.PolySynth } = {
  synth: () => new Tone.PolySynth(),
  am: () => new Tone.PolySynth(Tone.AMSynth),
};

const degreeMap: { [index in Degree]: string } = {
  0: 'C',
  1: 'C#',
  2: 'D',
  3: 'D#',
  4: 'E',
  5: 'F',
  6: 'F#',
  7: 'G',
  8: 'G#',
  9: 'A',
  10: 'A#',
  11: 'B',
};

function soundToToneNote(sound: Sound): string {
  return `${degreeMap[sound.pitch]}${sound.octave}`;
}

export class TonePlayer implements Player {
  melodyLines?: TonePart[];
  constructor(public melody: Melody) {}

  async load(): Promise<void> {
    this.melodyLines = [];

    for (const part of this.melody.parts) {
      const synth = synthMap[part.synth]();
      const melody: ToneMelody[] = [];

      let position = part.position;
      for (let i = 0; i < part.bars.length; i++) {
        const bar = part.bars[i];

        let beat = 0;
        for (let j = 0; j < bar.notes.length; j++) {
          const note = bar.notes[j];
          const toneNote = note.sounds.map((s) => soundToToneNote(s));
          const duration = `${Math.floor(4 / note.beat)}n`;

          melody.push({
            time: `${position}:${beat}:0`,
            note: toneNote,
            duration: duration,
          });

          beat += note.beat;
        }

        position++;
      }

      this.melodyLines.push({
        synth: synth,
        melody: melody,
      });
    }
  }

  async play(): Promise<void> {
    this.melodyLines = this.melodyLines || [];

    for (const melodyLine of this.melodyLines) {
      new Tone.Part((time, value) => {
        melodyLine.synth.triggerAttackRelease(value.note, value.duration, time);
      }, melodyLine.melody).start();
    }
  }
}
