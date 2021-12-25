// import { testInput as input } from "./25-input";
import { input } from "./25-input";
import { posFromString, posToString } from "./utils/position2D";

export function doIt() {
  const parsed = input.split(`\n`).map((line) => line.split("") as TileState[]);
  const map = parsed.reduce((m, l, y) => {
    l.forEach((c, x) => {
      if (c !== TileState.Empty) {
        m.set(posToString({ x, y }), c as unknown as Cucumber);
      }
    });
    return m;
  }, new Map<string, Cucumber>());
  const first = step(map, parsed.length, parsed[0].length);
  const second = parsed.length;
  console.log(first, second);
}

enum Cucumber {
  SouthFC = "v",
  EastFC = ">",
}

enum TileState {
  SouthFC = "v",
  EastFC = ">",
  Empty = ".",
}

function moveEast(pos: string, xMax: number): string {
  const origPos = posFromString(pos);
  return posToString({
    x: (origPos.x + 1) % xMax,
    y: origPos.y,
  });
}

function moveSouth(pos: string, yMax: number): string {
  const origPos = posFromString(pos);
  return posToString({
    y: (origPos.y + 1) % yMax,
    x: origPos.x,
  });
}

function step(map: Map<string, Cucumber>, yMax: number, xMax: number) {
  let moved = false;
  let step = 0;
  do {
    step++;
    const eastFC = Array.from(map.entries())
      .filter(([_, c]) => c === Cucumber.EastFC)
      .map(([p]) => p)
      .filter((origPosS) => !map.has(moveEast(origPosS, xMax)));
    for (const origPosS of eastFC) {
      const targetPosS = moveEast(origPosS, xMax);
      map.delete(origPosS);
      map.set(targetPosS, Cucumber.EastFC);
    }
    const southFC = Array.from(map.entries())
      .filter(([_, c]) => c === Cucumber.SouthFC)
      .map(([p]) => p)
      .filter((origPosS) => !map.has(moveSouth(origPosS, yMax)));
    for (const origPosS of southFC) {
      const targetPosS = moveSouth(origPosS, yMax);
      map.delete(origPosS);
      map.set(targetPosS, Cucumber.SouthFC);
    }
    moved = eastFC.length > 0 || southFC.length > 0;
  } while (moved);
  console.log(step);
  return step;
}
