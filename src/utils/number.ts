import { zip } from './array';

export function lerp(a: number, b: number, t: number): number {
  return a * t + b * (1 - t);
}

type Color = [number, number, number] | [number, number, number, number];

export function lerpColor(a: Color, b: Color, t: number): Color {
  return zip(a, b).map(([c1, c2]) => lerp(c1, c2, t)) as Color;
}
