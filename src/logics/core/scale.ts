import { Degree, Scale, Sound } from './melody';

export type ScaleFunction = (key: Sound) => Scale;

export function majorScale(key: Sound): Scale {
  const degrees: Degree[] = [0, 2, 4, 5, 7, 9, 11];
  return scale(degrees, key);
}

export function minorScale(key: Sound): Scale {
  const degrees: Degree[] = [0, 2, 3, 5, 7, 8, 10];
  return scale(degrees, key);
}

function scale(degrees: Degree[], key: Sound): Scale {
  return degrees.map((v) => key.add(v)) as Scale;
}
