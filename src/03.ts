// import { testInput as input } from "./03-input";
import { input } from "./03-input";

type Bit = "1" | "0";

export function doIt() {
  const parsed = input.split(`\n`).map((line) => line.split("") as Bit[]);
  const bitCounts = getBitCounts(parsed);
  console.log(
    getCommonBits(bitCounts, parsed.length, true) *
      getCommonBits(bitCounts, parsed.length, false),
    getUnique(parsed, true) * getUnique(parsed, false)
  );
}

function getBitCounts(values: Bit[][]) {
  return values.reduce((prev, c) => {
    c.forEach((bit, i) => {
      if (bit === "1") prev[i] = (prev[i] ?? 0) + 1;
    });
    return prev;
  }, [] as number[]);
}

function getUnique(values: Bit[][], findMost: boolean) {
  let candidates = [...values];
  while (candidates.length > 1) {
    const bitCounts = getBitCounts(candidates);
    const i = bitCounts.findIndex(
      (count) => count < candidates.length && count > 0
    );
    const expectedBitValue = getBit(bitCounts[i], candidates.length, findMost);
    candidates = candidates.filter((v) => v[i] === expectedBitValue);
  }
  return toNum(candidates[0]);
}

function getBit(onesCount: number, totalCount: number, findMost: boolean): Bit {
  const mostZeroes = onesCount * 2 < totalCount;
  return mostZeroes !== findMost ? "1" : "0";
}

function getCommonBits(bitCounts: number[], len: number, findMost: boolean) {
  return toNum(bitCounts.map((c) => getBit(c, len, findMost)));
}

function toNum(vs: string[]) {
  return vs.reduce((prev, c) => prev * 2 + (c === "1" ? 1 : 0), 0);
}
