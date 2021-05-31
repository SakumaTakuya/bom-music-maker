
export function zip<T, U>(array1: T[], array2: U[]): [T, U][] {
    return array1.map((v, i) => [v, array2[i]]);
}

export function randomInt(max: number): number {
    return Math.floor(Math.random() * max);
}

export function randomNormal(mu: number = 0, sigma: number = 1): number {
    const x: number = Math.random()
    const y: number = Math.random()
    const coefficient: number = Math.sqrt(-2 * Math.log(x))
    const radian: number = 2 * y * Math.PI
    const z1: number = coefficient * Math.cos(radian)
    return mu + z1 * sigma
}

export function choiceIds<T>(args: T[], count: number): number[] {
    const results: number[] = []
    const len = args.length;
    const size = Math.min(count, len);
    for (let i = 0; i < size; i++) {
        results.push(randomInt(len));
    }

    return results;
}

export function select<T>(...args: T[]): T {
    const idx = randomInt(args.length);
    return args[idx];
}

export function range(start: number, end: number): number[] {
    return Array.from({ length: (end - start + 1) }, (_, k) => k + start);
}
