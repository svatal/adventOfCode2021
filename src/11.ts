// import { testInput as input } from "./11-input";
import { input } from "./11-input";
import { existIn, neighbors8, valueInMap } from "./utils/position";

export function doIt() {
  const parsed = input.split(`\n`).map((line) => line.split("").map((x) => +x));

  const first = iterate(parsed, 100);
  const second = iterate2(parsed);
  console.log(first, second);
}

function iterate(map: number[][], steps: number) {
  let flashes = 0;
  for (let i = 0; i < steps; i++) {
    const next = step(map);
    flashes += next.flashes;
    map = next.map;
  }
  return flashes;
}

function iterate2(map: number[][]) {
  let i = 0;
  while (true) {
    i++;
    const next = step(map);
    map = next.map;
    if (next.flashes === 100) return i;
  }
}

function step(map: number[][]) {
  const newMap = map.map((line, y) => line.map((o, x) => o + 1));
  let flashes = 0;
  let didFlash = false;
  do {
    didFlash = false;
    newMap.forEach((line, y) =>
      line.forEach((o, x) => {
        if (o > 9) {
          flashes++;
          newMap[y][x] = 0;
          didFlash = true;
          neighbors8({ x, y })
            .filter(existIn(newMap))
            .filter((p) => valueInMap(newMap)(p) > 0)
            .forEach((p) => (newMap[p.y][p.x] += 1));
        }
      })
    );
  } while (didFlash);

  return { flashes, map: newMap };
}
