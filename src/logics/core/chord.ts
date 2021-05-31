import { ScaleIndex } from "./melody";

export type ChordFunction = (root: ScaleIndex) => ScaleIndex[];

export function diatonicChord(root: ScaleIndex): ScaleIndex[] {
    return [0, 2, 4].map(id => (id + root) % 7 as ScaleIndex);
}

export function diatonicSeventhChord(root: ScaleIndex): ScaleIndex[] {
    return [0, 2, 4, 6].map(id => (id + root) % 7 as ScaleIndex);
}

export function susChord(root: ScaleIndex): ScaleIndex[] {
    return [0, 4].map(id => (id + root) % 7 as ScaleIndex);
}