export function randomInt(max: number): number {
  return Math.floor(Math.random() * max);
}

export function randomNormal(mu: number = 0, sigma: number = 1): number {
  const x: number = Math.random();
  const y: number = Math.random();
  const coefficient: number = Math.sqrt(-2 * Math.log(x));
  const radian: number = 2 * y * Math.PI;
  const z1: number = coefficient * Math.cos(radian);
  return mu + z1 * sigma;
}
