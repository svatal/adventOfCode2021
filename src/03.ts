// import { testInput as input } from "./03-input";
import { input } from "./03-input";

export function doIt() {
  const parsed = input.split(`\n`).map(
    (line) => line.split("") //
  );
  const first = parsed.reduce((prev, c) => {
    c.forEach((v, i) => {
      if (v === "1") prev[i] = (prev[i] ?? 0) + 1;
    });
    return prev;
  }, [] as number[]);
  console.log(
    gama(first, parsed.length) * epsilon(first, parsed.length),
    getUnique(parsed, (v, com, i, len) =>
      com[i] * 2 >= len ? v[i] === "1" : v[i] === "0"
    ) *
      getUnique(parsed, (v, com, i, len) =>
        com[i] * 2 < len ? v[i] === "1" : v[i] === "0"
      )
  );
}

function commonity(vals: string[][]) {
  return vals.reduce((prev, c) => {
    c.forEach((v, i) => {
      if (v === "1") prev[i] = (prev[i] ?? 0) + 1;
    });
    return prev;
  }, [] as number[]);
}

function getUnique(
  vals: string[][],
  cond: (v: string[], com: number[], i: number, len: number) => boolean
) {
  let second = [...vals];
  while (second.length > 1) {
    const com = commonity(second);
    const i = com.findIndex((v) => v < second.length && v > 0);
    second = second.filter((v) => cond(v, com, i, second.length));
  }
  return toNum(second[0]);
}

function gama(vs: number[], len: number) {
  return vs
    .map<number>((v) => (v * 2 > len ? 0 : 1))
    .reduce((prev, c) => prev * 2 + c, 0);
}

function epsilon(vs: number[], len: number) {
  return vs
    .map<number>((v) => (v * 2 < len ? 0 : 1))
    .reduce((prev, c) => prev * 2 + c, 0);
}

function toNum(vs: string[]) {
  console.log(vs);
  return vs.reduce((prev, c) => prev * 2 + (c === "1" ? 1 : 0), 0);
}
