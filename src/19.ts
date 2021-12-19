// import { testInput as input } from "./19-input";
import { input } from "./19-input";

export function doIt() {
  const parsed = input.split(`\n\n`).map((line) => {
    const [first, ...rest] = line.split("\n");
    const id = +first.split(" ")[2];
    const positions = rest.map(posFromString);
    return { id, positions };
  });
  const start = Date.now();
  let [spaceP, ...toMatch] = parsed.map((p) => expandRotations(p.positions));
  const space = new Set<string>(spaceP[0].positions.map((p) => posToString(p)));
  let beacons = [{ x: 0, y: 0, z: 0 }];
  while (toMatch.length > 0) {
    const s = toMatch.shift()!;
    const offset = tryAlign(space, s);
    if (offset !== undefined) {
      beacons.push(offset);
      console.log(
        `matched something, ${toMatch.length} remaining, ${space.size} mapped so far`
      );
    } else {
      toMatch.push(s);
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
  const first = space.size;
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
  ].map((r) => ({
    positions: r,
    candidates: /*r.slice(11)*/ [
      getClosest(r, { x: 1000, y: 1000, z: 1000 }),
      getClosest(r, { x: 1000, y: -1000, z: 1000 }),
      getClosest(r, { x: 1000, y: 1000, z: -1000 }),
      getClosest(r, { x: 1000, y: -1000, z: -1000 }),
      getClosest(r, { x: -1000, y: 1000, z: 1000 }),
      getClosest(r, { x: -1000, y: -1000, z: 1000 }),
      getClosest(r, { x: -1000, y: 1000, z: -1000 }),
      getClosest(r, { x: -1000, y: -1000, z: -1000 }),
    ],
  }));
}

function getClosest(positions: IPosition[], target: IPosition): IPosition {
  let closest: IPosition = positions[0];
  let minDist = 3000;
  for (const p of positions) {
    const diff = minusPos(p, target);
    const dist = Math.sqrt(
      [diff.x, diff.y, diff.z].reduce((a, b) => a + b * b, 0)
    );
    if (dist < minDist) {
      minDist = dist;
      closest = p;
    }
  }
  return closest;
}

function expandRotationsWithFacing(positions: IPosition[]) {
  return [
    positions,
    positions.map((p) => ({ x: p.x, y: -p.z, z: p.y })),
    positions.map((p) => ({ x: p.x, y: -p.y, z: -p.z })),
    positions.map((p) => ({ x: p.x, y: p.z, z: -p.y })),
  ];
}

function tryAlign(
  refPositions: Set<string>,
  rotations: { positions: IPosition[]; candidates: IPosition[] }[]
) {
  for (const rotation of rotations) {
    for (const rPosS of Array.from(refPositions.values())) {
      const rPos = posFromString(rPosS);
      for (const cPos of rotation.candidates) {
        const diff = minusPos(rPos, cPos);
        const match = tryMatch(refPositions, rotation.positions, diff);
        if (match) {
          match.forEach((p) => refPositions.add(p));
          return diff;
        }
      }
    }
  }

  return undefined;
}

function tryMatch(
  refPositions: Set<string>,
  positions: IPosition[],
  diff: IPosition
) {
  const newOnes = positions
    .map((p) => posToString(plusPos(p, diff)))
    .filter((p) => !refPositions.has(p));
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

function posFromString(s: string): IPosition {
  const [x, y, z] = s.split(",").map((c) => +c);
  return { x, y, z };
}
