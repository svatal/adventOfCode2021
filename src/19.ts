// import { testInput as input } from "./19-input";
import { input } from "./19-input";

export function doIt() {
  const parsed = input.split(`\n\n`).map((line) => {
    const [first, ...rest] = line.split("\n");
    const id = +first.split(" ")[2];
    const positions = rest.map((p) => {
      const [x, y, z] = p.split(",").map((c) => +c);
      return { x, y, z };
    });
    return { id, positions };
  });
  let [space, ...toMatch] = parsed.map((p) => p.positions);
  let beacons = [{ x: 0, y: 0, z: 0 }];
  const start = Date.now();
  while (toMatch.length > 0) {
    const s = toMatch.pop()!;
    const result = tryAlign(space, s);
    if (result !== undefined) {
      space = result.positions;
      beacons.push(result.diff);
      console.log(
        `matched something, ${toMatch.length} remaining, ${space.length} mapped so far`
      );
    } else {
      toMatch.unshift(s);
    }
  }
  let max = 0;
  for (const b1 of beacons) {
    for (const b2 of beacons) {
      const diff = minusPos(b1, b2);
      const dist = Math.abs(diff.x) + Math.abs(diff.y) + Math.abs(diff.z);
      max = Math.max(max, dist);
    }
  }
  const first = space.length;
  const second = max;
  console.log(first, second, Date.now() - start, "ms");
}

export interface IPosition {
  x: number;
  y: number;
  z: number;
}

function expandRotations(positions: IPosition[]) {
  return [
    ...expandRotationsWithFacing(positions),
    ...expandRotationsWithFacing(
      positions.map((p) => ({ x: -p.x, y: -p.y, z: p.z }))
    ),

    ...expandRotationsWithFacing(
      positions.map((p) => ({ x: p.y, y: p.z, z: p.x }))
    ),
    ...expandRotationsWithFacing(
      positions.map((p) => ({ x: -p.y, y: -p.z, z: p.x }))
    ),

    ...expandRotationsWithFacing(
      positions.map((p) => ({ x: p.z, y: p.x, z: p.y }))
    ),
    ...expandRotationsWithFacing(
      positions.map((p) => ({ x: -p.z, y: -p.x, z: p.y }))
    ),
  ];
}

function expandRotationsWithFacing(positions: IPosition[]) {
  return [
    positions,
    positions.map((p) => ({ x: p.x, y: -p.z, z: p.y })),
    positions.map((p) => ({ x: p.x, y: -p.y, z: -p.z })),
    positions.map((p) => ({ x: p.x, y: p.z, z: -p.y })),
  ];
}

function tryAlign(refPositions: IPosition[], positions: IPosition[]) {
  const rotations = expandRotations(positions);
  for (const rotation of rotations) {
    for (const rPos of refPositions) {
      for (const cPos of rotation) {
        const diff = minusPos(rPos, cPos);
        const match = tryMatch(refPositions, rotation, diff);
        if (!reported) {
          console.log(rPos, cPos, diff, plusPos(cPos, diff));
          reported = true;
        }
        if (match) {
          return { positions: [...refPositions, ...match], diff };
        }
      }
    }
  }

  return undefined;
}

let reported = false;

function tryMatch(
  refPositions: IPosition[],
  positions: IPosition[],
  diff: IPosition
) {
  positions = positions.map((p) => plusPos(p, diff));
  const newOnes = positions.filter(
    (rp) => !refPositions.find((p) => equalPos(rp, p))
  );
  return positions.length - newOnes.length >= 12 ? newOnes : undefined;
}

function minusPos(p1: IPosition, p2: IPosition) {
  return { x: p1.x - p2.x, y: p1.y - p2.y, z: p1.z - p2.z };
}

function plusPos(p1: IPosition, p2: IPosition) {
  return { x: p1.x + p2.x, y: p1.y + p2.y, z: p1.z + p2.z };
}

function equalPos(p1: IPosition, p2: IPosition) {
  return p1.x === p2.x && p1.y === p2.y && p1.z === p2.z;
}

function posToString(p: IPosition) {
  return `${p.x},${p.y},${p.z}`;
}
