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
  if (!isNaN(+char)) {
    return { pair: +char, next: i + 1 };
  }
  const left = parseInternal(s, i + 1);
  const right = parseInternal(s, left.next + 1);
  const pair = { left: left.pair, right: right.pair };
  if (typeof pair.left !== "number")
    pair.left.up = { pair, branch: BranchType.left };
  if (typeof pair.right !== "number")
    pair.right.up = { pair, branch: BranchType.right };
  return { pair, next: right.next + 1 };
}

function reduce(rootPair: IPair): IPair {
  let didSomething = false;
  do {
    didSomething = tryToExplode(rootPair) || tryToSplit(rootPair);
  } while (didSomething);
  return rootPair;
}

function tryToExplode(b: Branch, d: number = 1): boolean {
  if (typeof b === "number") return false;
  if (d === 5) {
    const up = b.up!;
    if (up.branch === BranchType.left) {
      up.pair.left = 0;
      addToRight(up.pair, <number>b.right);
      let c = b.up;
      while (c?.branch === BranchType.left) {
        c = c.pair.up;
      }
      if (c) {
        addToLeft(c.pair, <number>b.left);
      }
    } else {
      up.pair.right = 0;
      addToLeft(up.pair, <number>b.left);
      let c = b.up;
      while (c?.branch === BranchType.right) {
        c = c.pair.up;
      }
      if (c) {
        addToRight(c.pair, <number>b.right);
      }
    }
    return true;
  }
  return tryToExplode(b.left, d + 1) || tryToExplode(b.right, d + 1);
}

function addToLeft(parent: IPair, n: number) {
  if (typeof parent.left === "number") {
    parent.left += n;
  } else {
    let p = parent.left;
    while (typeof p.right !== "number") p = p.right;
    p.right += n;
  }
}

function addToRight(parent: IPair, n: number) {
  if (typeof parent.right === "number") {
    parent.right += n;
  } else {
    let p = parent.right;
    while (typeof p.left !== "number") p = p.left;
    p.left += n;
  }
}

function toString(p: Branch): string {
  return typeof p === "number"
    ? `${p}`
    : `[${toString(p.left)},${toString(p.right)}]`;
}

function tryToSplit(p: IPair): boolean {
  const changedSomething = forBoth(p, (b, type, update) => {
    if (typeof b !== "number") return tryToSplit(b);
    if (b <= 9) return false;
    update({
      left: Math.floor(b / 2),
      right: Math.ceil(b / 2),
      up: { pair: p, branch: type },
    });
    return true;
  });
  return changedSomething;
}

function forBoth(
  p: IPair,
  cb: (b: Branch, type: BranchType, update: (b: Branch) => void) => boolean
): boolean {
  let shouldStop = cb(p.left, BranchType.left, (b) => (p.left = b));
  if (shouldStop) return true;
  shouldStop = cb(p.right, BranchType.right, (b) => (p.right = b));
  return shouldStop;
}

function magnitude(p: Branch): number {
  if (typeof p === "number") return p;
  return 3 * magnitude(p.left) + 2 * magnitude(p.right);
}
