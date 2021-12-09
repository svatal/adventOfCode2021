// import { testInput as input } from "./09-input";
import { posix } from "path/posix";
import { input } from "./09-input";
import { log } from "./utils";

export function doIt() {
  const parsed = input.split(`\n`).map(
    (line) => line.split("").map((c) => +c) //
  );
  const first = parsed.reduce(
    (p, l, il) =>
      p +
      l.reduce((p, h, ih) => {
        const isLow =
          (ih === 0 || l[ih - 1] > h) &&
          (ih === l.length - 1 || l[ih + 1] > h) &&
          (il === 0 || parsed[il - 1][ih] > h) &&
          (il === parsed.length - 1 || parsed[il + 1][ih] > h);

        return p + (isLow ? h + 1 : 0);
      }, 0),
    0
  );
  const second = parsed.reduce(
    (p, l, il) => [
      ...p,
      ...l.reduce((p, h, ih) => {
        const isLow =
          (ih === 0 || l[ih - 1] > h) &&
          (ih === l.length - 1 || l[ih + 1] > h) &&
          (il === 0 || parsed[il - 1][ih] > h) &&
          (il === parsed.length - 1 || parsed[il + 1][ih] > h);

        return isLow ? [...p, countBasin(parsed, { y: il, x: ih })] : p;
      }, [] as number[]),
    ],
    [] as number[]
  );
  console.log(
    first,
    second
      .sort((a, b) => a - b)
      .map(log)
      .filter((n, i) => i > second.length - 4)
      .map(log)
      .reduce((a, b) => a * b, 1)
  );
}

function toString(p: { x: number; y: number }) {
  const { x, y } = p;
  return `${x}|${y}`;
}

function fromString(s: string) {
  const [x, y] = s.split("|").map((v) => +v);
  return { x, y };
}

function neighbors(
  p: { x: number; y: number } /*, xLen: number, yLen: number*/
) {
  const { x, y } = p;
  return [
    { x: x + 1, y },
    { x: x - 1, y },
    { x, y: y + 1 },
    { x, y: y - 1 },
  ]; //.filter(p => p.x >=0 && p.y >=0 && p.x < xLen && p.y < yLen );
}

function countBasin(map: number[][], p: { x: number; y: number }): number {
  const edge = new Set([toString(p)]);
  const inner = new Set<string>();
  while (edge.size > 0) {
    edge.forEach((pointS) => {
      const point = fromString(pointS);
      neighbors(point)
        .filter(
          (n) =>
            map[n.y] !== undefined &&
            map[n.y][n.x] !== undefined &&
            map[n.y][n.x] < 9
        )
        .map(toString)
        .filter((n) => !edge.has(n) && !inner.has(n))
        .forEach((n) => edge.add(n));
      edge.delete(pointS);
      inner.add(pointS);
    });
  }
  return inner.size;
}
