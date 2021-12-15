// import { testInput as input } from "./15-input";
import { input } from "./15-input";
import {
  existIn,
  IPosition,
  neighbors4,
  posToString,
  valueInMap,
} from "./utils/position";

export function doIt() {
  const parsed = input.split(`\n`).map((line) => line.split("").map((r) => +r));
  const first = visit(parsed, new Set(), [{ x: 0, y: 0, r: 0 }]);
  const x5 = parsed.map((l) => [
    ...l,
    ...l.map((r) => (r % 9) + 1),
    ...l.map((r) => ((r + 1) % 9) + 1),
    ...l.map((r) => ((r + 2) % 9) + 1),
    ...l.map((r) => ((r + 3) % 9) + 1),
  ]);
  const y5 = [...x5];
  for (let i = 1; i < 5; i++) {
    y5.push(...x5.map((l) => l.map((r) => ((r + i - 1) % 9) + 1)));
  }
  const second = visit(y5, new Set(), [{ x: 0, y: 0, r: 0 }]);
  console.log(first, second);
}

interface IPosWithRisk extends IPosition {
  r: number;
}

function visit(
  map: number[][],
  visited: Set<string>,
  candidates: IPosWithRisk[]
): number {
  while (true) {
    candidates.sort((a, b) => b.r - a.r);
    const current = candidates.pop()!;
    visited.add(posToString(current));
    const newCandidates = neighbors4(current)
      .filter(existIn(map))
      .filter((p) => !visited.has(posToString(p)))
      .map((p) => ({ ...p, r: current.r + valueInMap(map)(p) }));
    if (newCandidates.length === 0) continue;
    newCandidates.forEach((c) => visited.add(posToString(c)));

    const target = newCandidates.find(
      (p) => p.x === map[0].length - 1 && p.y === map.length - 1
    );
    if (target) return target.r;
    candidates.push(...newCandidates);
    // console.log(
    //   map.length * map[0].length,
    //   visited.size,
    //   candidates.length,
    //   current
    // );
  }
}
