// import { testInput as input } from "./19-input";
import { input } from "./19-input";
import {
  IPosition,
  minusPos,
  plusPos,
  posFromString,
  posToString,
} from "./utils/positions3D";

export function doIt() {
  let [spaceP, ...toMatchProt] = input.split(`\n\n`).map((line) => {
    const [first, ...rest] = line.split("\n");
    const id = +first.split(" ")[2];
    const positions = rest.map(posFromString);
    return { id, positions };
  });
  const start = Date.now();
  let toMatch = toMatchProt.map((p) => {
    const candidatesWithRotation = getCandidates(p.positions).map(
      expandRotations
    );
    const rotations = expandRotations(p.positions);
    return rotations.map((r, i) => ({
      positions: r,
      candidates: candidatesWithRotation.map((c) => c[i]),
    }));
  });
  console.log("preparations", Date.now() - start, "ms");
  const space = new Set<string>(spaceP.positions.map((p) => posToString(p)));
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

function getCandidates(r: IPosition[]) {
  return [
    everyGroupFromCornerContains(r, true, true, true),
    everyGroupFromCornerContains(r, true, false, true),
    everyGroupFromCornerContains(r, true, true, false),
    everyGroupFromCornerContains(r, true, false, false),
    everyGroupFromCornerContains(r, false, true, true),
    everyGroupFromCornerContains(r, false, false, true),
    everyGroupFromCornerContains(r, false, true, false),
    everyGroupFromCornerContains(r, false, false, false),
  ];
}

function everyGroupFromCornerContains(
  positions: IPosition[],
  xPlus: boolean,
  yPlus: boolean,
  zPlus: boolean
) {
  const xs = positions.map((p) => p.x).sort((a, b) => (xPlus ? a - b : b - a));
  const ys = positions.map((p) => p.y).sort((a, b) => (yPlus ? a - b : b - a));
  const zs = positions.map((p) => p.z).sort((a, b) => (zPlus ? a - b : b - a));
  const groups = new Map<string, IPosition[]>();
  let shouldCheckX = true;
  for (const x of xs) {
    if (
      shouldCheckX &&
      positions.filter((p) => (xPlus ? p.x <= x : p.x >= x)).length < 12
    )
      continue;
    shouldCheckX = false;
    let shouldCheckY = true;
    for (const y of ys) {
      if (
        shouldCheckY &&
        positions.filter(
          (p) => (xPlus ? p.x <= x : p.x >= x) && (yPlus ? p.y <= y : p.y >= y)
        ).length < 12
      )
        continue;
      shouldCheckY = false;
      for (const z of zs) {
        const match = positions.filter(
          (p) =>
            (xPlus ? p.x <= x : p.x >= x) &&
            (yPlus ? p.y <= y : p.y >= y) &&
            (zPlus ? p.z <= z : p.z >= z)
        );
        if (match.length < 12) continue;
        groups.set(match.map(posToString).join("; "), match);
        break;
      }
    }
  }
  const matches = Array.from(groups.values());
  const points = matches.reduce((map, match) => {
    match.map(posToString).forEach((p) => {
      map.set(p, (map.get(p) || 0) + 1);
    });
    return map;
  }, new Map<string, number>());
  return Array.from(points.entries())
    .filter(([p, c]) => c === matches.length)
    .map(([p]) => posFromString(p));
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
  rotations: { positions: IPosition[]; candidates: IPosition[][] }[]
) {
  for (const rotation of rotations) {
    for (const rPosS of Array.from(refPositions.values())) {
      const rPos = posFromString(rPosS);
      for (const candidates of rotation.candidates) {
        const diff = minusPos(rPos, candidates[0]);
        if (match(refPositions, candidates.slice(1), diff).length !== 0)
          continue;
        const newPositions = match(refPositions, rotation.positions, diff);
        if (rotation.positions.length - newPositions.length >= 12) {
          newPositions.forEach((p) => refPositions.add(p));
          return diff;
        }
      }
    }
  }
  return undefined;
}

function match(
  refPositions: Set<string>,
  positions: IPosition[],
  diff: IPosition
) {
  return positions
    .map((p) => posToString(plusPos(p, diff)))
    .filter((p) => !refPositions.has(p));
}
