import { SectionCreator } from "../core/creator";
import { Bar, Beat, MelodyStructure, Note, Position, Scale, ScaleIndex } from "../core/melody";

export class AccompanimentSectionCreator implements SectionCreator {
    constructor(
        public beats: Beat[],
        public structure: MelodyStructure,
    ) { }

    createBar(chord: ScaleIndex[], scale: Scale): Bar {
        return buildChordBar(chord, scale, this.beats, 0);
    }

    create(startPosition: Position, count: number): Bar[] {
        const bars: Bar[] = [];

        const barPosition = startPosition + count;
        for (let i = startPosition; i < barPosition; i++) {
            const chord = this.structure.chordProgression[i].indices();
            const scale = this.structure.scales.current(i).value;

            bars.push(this.createBar(chord, scale));
        }

        return bars;
    }

}

function buildChordBar(chord: ScaleIndex[], scale: Scale, beats: Beat[], restProbability: number = 0.1): Bar {
    const notes: Note[] = beats.map(beat => {
        if (restProbability > Math.random()) {
            return {
                sounds: [],
                beat: beat
            }
        }

        return {
            sounds: chord.map(v => scale[v]),
            beat: beat
        };
    });

    return {
        notes: notes
    };
}