export interface Melody {
    bpms: number[];
    chordProgression: Chord[];
    timeSignetures: TimeSigneture[];
    scales: Scale[];
    parts: Part[];
}

interface TimeSigneture {
    value: [number, number];
    position: Position;
}

interface Scale {
    degrees: Degree[];
    position: Position;
}



export interface Chord {
    root: Sound;
    (): Sound[];
}

export class Sound {
    constructor(
        public readonly pitch: number,
        public readonly degree: Degree,
    ) { }

    static fromDegree(degree: Degree): Sound {
        return new Sound(
            Math.floor(degree / 12),
            degree % 12
        );
    }

    toDegree(): Degree {
        return this.pitch * 12 + this.degree;
    }

    add(other: Degree): Sound {
        const added = this.degree + other;
        return new Sound(
            this.pitch + Math.floor(added / 12),
            this.degree + (added % 12)
        );
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

export type Degree = number;
export type Position = number;
export type Beat = 0.25 | 0.5 | 1 | 2 | 4;