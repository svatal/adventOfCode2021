// import { testInput as input } from "./18-input";
import { input } from "./18-input";

export function doIt() {
  const parsed = input.split(`\n`);

  const first = parsed.reduce((a, b) => toString(reduce(parse(`[${a},${b}]`))));
  console.log(first, magnitude(parse(first)));

  let maxMag = 0;
  for (let i = 0; i < parsed.length; i++) {
    for (let j = 0; j < parsed.length; j++) {
      if (i == j) continue;
      maxMag = Math.max(
        maxMag,
        magnitude(reduce(parse(`[${parsed[i]},${parsed[j]}]`)))
      );
    }
  }
  console.log(maxMag);
}

type Branch = IPair | number;

enum BranchType {
  left,
  right,
}

interface IPair {
  up?: undefined | { pair: IPair; branch: BranchType };
  left: Branch;
  right: Branch;
}

function parse(s: string) {
  return parseInternal(s, 0).pair as IPair;
}

function parseInternal(s: string, i: number): { pair: Branch; next: number } {
  const char = s[i];
  if (char === undefined) throw "xx";
  if (!isNaN(+char)) {
    return { pair: +char, next: i + 1 };
  }
  // '['
  const left = parseInternal(s, i + 1);
  const right = parseInternal(s, left.next + 1);
  const pair = { left: left.pair, right: right.pair };
  if (typeof pair.left !== "number")
    pair.left.up = { pair, branch: BranchType.left };
  if (typeof pair.right !== "number")
    pair.right.up = { pair, branch: BranchType.right };
  return { pair, next: right.next + 1 };
}

function reduce(pair: IPair): IPair {
  let reduced = false;
  do {
    reduced = explode(pair, 0) || split(pair);
  } while (reduced);
  return pair;
}

function explode(b: Branch, d: number): boolean {
  if (typeof b === "number") return false;
  if (d === 4) {
    const up = b.up!;
    if (up.branch === BranchType.left) {
      up.pair.left = 0;
      if (typeof up.pair.right === "number") {
        up.pair.right += <number>b.right;
      } else {
        addToLeftMost(up.pair.right, <number>b.right);
      }
      let c = b.up;
      while (c?.branch === BranchType.left) {
        c = c.pair.up;
      }
      if (c) {
        if (typeof c.pair.left === "number") {
          c.pair.left += <number>b.left;
        } else {
          addToRightMost(c.pair.left, <number>b.left);
        }
      }
    } else {
      up.pair.right = 0;
      if (typeof up.pair.left === "number") {
        up.pair.left += <number>b.left;
      } else {
        addToRightMost(up.pair.left, <number>b.left);
      }
      let c = b.up;
      while (c?.branch === BranchType.right) {
        c = c.pair.up;
      }
      if (c) {
        if (typeof c.pair.right === "number") {
          c.pair.right += <number>b.right;
        } else {
          addToLeftMost(c.pair.right, <number>b.right);
        }
      }
    }
    return true;
  }
  return explode(b.left, d + 1) || explode(b.right, d + 1);
}

function addToRightMost(p: IPair, x: number) {
  while (typeof p.right !== "number") p = p.right;
  p.right += x;
}

function addToLeftMost(p: IPair, x: number) {
  while (typeof p.left !== "number") p = p.left;
  p.left += x;
}

function toString(p: Branch): string {
  return typeof p === "number"
    ? `${p}`
    : `[${toString(p.left)},${toString(p.right)}]`;
}

function split(p: IPair): boolean {
  if (typeof p.left === "number") {
    if (p.left > 9) {
      p.left = {
        left: Math.floor(p.left / 2),
        right: Math.ceil(p.left / 2),
        up: { pair: p, branch: BranchType.left },
      };
      return true;
    }
  } else {
    const r = split(p.left);
    if (r) return true;
  }
  if (typeof p.right === "number") {
    if (p.right > 9) {
      p.right = {
        left: Math.floor(p.right / 2),
        right: Math.ceil(p.right / 2),
        up: { pair: p, branch: BranchType.right },
      };
      return true;
    }
  } else {
    const r = split(p.right);
    if (r) return true;
  }
  return false;
}

function magnitude(p: Branch): number {
  if (typeof p === "number") return p;
  return 3 * magnitude(p.left) + 2 * magnitude(p.right);
}
