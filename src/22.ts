// import { testInput as input } from "./22-input";
import { input } from "./22-input";
import { posToString } from "./utils/positions3D";

export function doIt() {
  const parsed = input.split(`\n`).map((line) => {
    const [onOff, coords] = line.split(" ");
    const [x, y, z] = coords.split(",").map((c) => {
      const [min, max] = c
        .split("=")[1]
        .split("..")
        .map((c) => +c);
      return { min, max };
    });
    return { onOff, x, y, z };
  });

  const start1 = Date.now();
  const grid = new Set<string>();
  parsed.forEach((s) => step(s, grid));
  const first = grid.size;
  console.log("1st star", Date.now() - start1);

  const start2 = Date.now();
  let onGrid: ICuboid[] = [];
  parsed.forEach((s) => (onGrid = step2(s, onGrid)));
  const second = onGrid.reduce((p, c) => p + size(c), 0);
  console.log("2nd star", Date.now() - start2);
  console.log(first, second);
}

interface IRange {
  min: number;
  max: number;
}

interface ICuboid {
  x: IRange;
  y: IRange;
  z: IRange;
}
interface IStep extends ICuboid {
  onOff: string;
}

const boundary = {
  min: -50,
  max: +50,
};

function step(s: IStep, grid: Set<string>) {
  const area = generateCoords(
    mergeRange(boundary, s.x),
    mergeRange(boundary, s.y),
    mergeRange(boundary, s.z)
  );
  area.forEach((c) => (s.onOff === "on" ? grid.add(c) : grid.delete(c)));
}

function generateCoords(xR: IRange, yR: IRange, zR: IRange) {
  const positions = [];
  for (let x = xR.min; x <= xR.max; x++)
    for (let y = yR.min; y <= yR.max; y++)
      for (let z = zR.min; z <= zR.max; z++)
        positions.push(posToString({ x, y, z }));
  return positions;
}

/* second star */

function mergeRange(a: IRange, b: IRange) {
  return {
    min: Math.max(a.min, b.min),
    max: Math.min(a.max, b.max),
  };
}

function step2(s: IStep, grid: ICuboid[]): ICuboid[] {
  if (s.onOff === "on") {
    let gToAdd: ICuboid[] = [s];
    grid.forEach((alreadyOn) => {
      let g: ICuboid[] = [];
      gToAdd.forEach((c) => {
        const overlap = overlapCuboids(c, alreadyOn);
        const overlapSize = size(overlap);
        if (overlapSize === 0) {
          g.push(c);
          return;
        }
        if (overlapSize === size(c)) {
          return;
        }
        const outside = invertCuboid(alreadyOn);
        outside.forEach((oc) => {
          const candidate = overlapCuboids(c, oc);
          if (size(candidate) > 0) {
            g.push(candidate);
          }
        });
      });
      gToAdd = g;
    });

    return [...grid, ...gToAdd];
  }
  const g: ICuboid[] = [];
  grid.forEach((c) => {
    const overlap = overlapCuboids(c, s);
    const overlapSize = size(overlap);
    if (overlapSize === 0) {
      g.push(c);
      return;
    }
    if (overlapSize === size(c)) {
      return;
    }
    const outside = invertCuboid(s);
    outside.forEach((oc) => {
      const candidate = overlapCuboids(c, oc);
      if (size(candidate) > 0) {
        g.push(candidate);
      }
    });
  });
  return g;
}

function overlapCuboids(c: ICuboid, s: ICuboid): ICuboid {
  return {
    x: mergeRange(c.x, s.x),
    y: mergeRange(c.y, s.y),
    z: mergeRange(c.z, s.z),
  };
}

const everything: IRange = {
  min: -Number.MAX_VALUE,
  max: Number.MAX_VALUE,
};

function invertCuboid({ x, y, z }: ICuboid): ICuboid[] {
  return [
    { x: everything, y: everything, z: under(z) },
    { x: everything, y: everything, z: above(z) },
    { x: everything, y: under(y), z },
    { x: everything, y: above(y), z },
    { x: under(x), y, z },
    { x: above(x), y, z },
  ];
}

function under(r: IRange): IRange {
  return { min: -Number.MAX_VALUE, max: r.min - 1 };
}

function above(r: IRange): IRange {
  return { min: r.max + 1, max: Number.MAX_VALUE };
}

function size(c: ICuboid): number {
  return rangeSize(c.x) * rangeSize(c.y) * rangeSize(c.z);
}

function rangeSize(r: IRange): number {
  if (r.min > r.max) return 0;
  return r.max - r.min + 1;
}
