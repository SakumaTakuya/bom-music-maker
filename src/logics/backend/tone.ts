import * as Tone from 'tone';
import { Degree, Melody, Player, Sound, Synth } from '../core/melody';

type ToneSound = string | string[];
type ToneInstrument = Tone.Sampler | Tone.PolySynth;

interface ToneMelody {
  time: string;
  note: ToneSound;
  duration: string;
}

interface TonePart {
  synth: Promise<ToneInstrument>;
  melody: ToneMelody[];
}

const synthMap: { [index in Synth]: () => Promise<ToneInstrument> } = {
  synth: () => Promise.resolve(new Tone.PolySynth()),
  am: () => Promise.resolve(new Tone.PolySynth(Tone.AMSynth)),
  piano: () =>
    new Promise((resolve, reject) => {
      const sampler = new Tone.Sampler({
        urls: {
          C4: 'maou_se_inst_piano2_1do.mp3',
          C5: 'maou_se_inst_piano2_2do.mp3',
        },
        baseUrl: '/static/audio/',
        release: 1,
        onload: () => resolve(sampler),
        onerror: () => reject(),
        volume: -20,
      });
    }),
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
  datas: [ToneInstrument, Tone.Part][] = [];

  stop(): void {
    Tone.Transport.stop();
  }

  async load(melody: Melody): Promise<void> {
    this.melodyLines = [];
    Tone.Transport.bpm.value = melody.structure.bpm;
    Tone.Transport.timeSignature = melody.structure.timeSigneture;

    for (const part of melody.parts) {
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

    this.clean();

    for (const melodyLine of this.melodyLines) {
      const synth = (await melodyLine.synth).toDestination();

      const part = new Tone.Part((_, value) => {
        synth.triggerAttackRelease(value.note, value.duration);
      }, melodyLine.melody).start();

      this.datas.push([synth, part]);
    }

    Tone.Transport.start();
  }

  clean(): void {
    for (const data of this.datas) {
      data[0].dispose();
      data[1].stop().dispose();
    }
    this.datas = [];
  }
}
