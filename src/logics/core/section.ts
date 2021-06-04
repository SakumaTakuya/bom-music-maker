import { Bar, Beat, MelodyStructure, Note, Position, Chord } from './melody';

// 同じビートでセクションを作り出す
export abstract class SectionCreator {
  constructor(public beats: Beat[], public structure: MelodyStructure) {}
  abstract create(startPosition: Position, count: number): Bar[];
}

export class AccompanimentSectionCreator extends SectionCreator {
  createBar(chord: Chord): Bar {
    return buildChordBar(chord, this.beats, 0);
  }

  create(startPosition: Position, count: number): Bar[] {
    const bars: Bar[] = [];

    const barPosition = startPosition + count;
    for (let i = startPosition; i < barPosition; i++) {
      const chord = this.structure.chordProgression[i];

      bars.push(this.createBar(chord));
    }

    return bars;
  }
}

function buildChordBar(
  chord: Chord,
  beats: Beat[],
  restProbability: number = 0.1
): Bar {
  const notes: Note[] = beats.map((beat) => {
    if (restProbability > Math.random()) {
      return {
        sounds: [],
        beat: beat,
      };
    }

    return {
      sounds: chord ?? [],
      beat: beat,
    };
  });

  return {
    notes: notes,
  };
}
