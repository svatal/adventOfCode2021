// import { testInput as input } from "./25-input";
import { input } from "./25-input";
import { posFromString, posToString } from "./utils/position2D";

export function doIt() {
  const parsed = input.split(`\n`).map((line) => line.split(""));
  const map = parsed.reduce((m, l, y) => {
    l.forEach((c, x) => {
      if (c === Cucumber.EastFC || c === Cucumber.SouthFC) {
        m.set(posToString({ x, y }), c);
      }
    });
    return m;
  }, new Map<string, Cucumber>());
  console.log(findEquilibrium(map, parsed.length, parsed[0].length));
}

enum Cucumber {
  SouthFC = "v",
  EastFC = ">",
}

function move(pos: string, c: Cucumber, yMax: number, xMax: number): string {
  const origPos = posFromString(pos);
  return posToString({
    x: (origPos.x + (c === Cucumber.EastFC ? 1 : 0)) % xMax,
    y: (origPos.y + (c === Cucumber.SouthFC ? 1 : 0)) % yMax,
  });
}

function moveAll(
  map: Map<string, Cucumber>,
  cType: Cucumber,
  yMax: number,
  xMax: number
) {
  const toMove = Array.from(map.entries())
    .filter(([_, c]) => c === cType)
    .map(([origPos]) => ({
      origPos,
      targetPos: move(origPos, cType, yMax, xMax),
    }))
    .filter(({ targetPos }) => !map.has(targetPos));
  for (const { origPos, targetPos } of toMove) {
    map.delete(origPos);
    map.set(targetPos, cType);
  }
  return toMove.length > 0;
}

function findEquilibrium(
  map: Map<string, Cucumber>,
  yMax: number,
  xMax: number
) {
  let moved = false;
  let step = 0;
  do {
    step++;
    const movedToEast = moveAll(map, Cucumber.EastFC, yMax, xMax);
    const movedToSouth = moveAll(map, Cucumber.SouthFC, yMax, xMax);
    moved = movedToEast || movedToSouth;
  } while (moved);
  return step;
}
