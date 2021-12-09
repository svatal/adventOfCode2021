// import { testInput as input } from "./09-input";
import { input } from "./09-input";
import {
  neighbors4,
  existIn,
  valueInMap,
  IPosition,
  posFromString,
  posToString,
} from "./utils/position";

export function doIt() {
  const parsed = input.split(`\n`).map((line) => line.split("").map((h) => +h));
  const first = parsed.reduce(
    (p, line, y) =>
      p +
      line.reduce(
        (p, h, x) => p + (neighborsAreHigher(parsed, { x, y }) ? h + 1 : 0),
        0
      ),
    0
  );
  const second = parsed
    .reduce(
      (p, l, y) => [
        ...p,
        ...l.reduce(
          (p, h, x) =>
            neighborsAreHigher(parsed, { x, y })
              ? [...p, getBasinSize(parsed, { y, x })]
              : p,
          [] as number[]
        ),
      ],
      [] as number[]
    )
    .sort((a, b) => b - a)
    .slice(0, 3)
    .reduce((a, b) => a * b, 1);

  console.log(first, second);
}

function neighborsAreHigher(map: number[][], pos: IPosition) {
  const val = valueInMap(map)(pos)!;
  return neighbors4(pos)
    .filter(existIn(map))
    .map(valueInMap(map))
    .every((nh) => nh > val);
}

function getBasinSize(map: number[][], p: IPosition): number {
  const edge = new Set([posToString(p)]);
  const inner = new Set<string>();
  while (edge.size > 0) {
    edge.forEach((pointS) => {
      const point = posFromString(pointS);
      neighbors4(point)
        .filter(existIn(map))
        .filter((n) => valueInMap(map)(n) < 9)
        .map(posToString)
        .filter((n) => !edge.has(n) && !inner.has(n))
        .forEach((n) => edge.add(n));
      edge.delete(pointS);
      inner.add(pointS);
    });
  }
  return inner.size;
}
