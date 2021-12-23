// import { testInput as input } from "./23-input";
import { input } from "./23-input";

export function doIt() {
  const lines = input.split(`\n`);
  const aTop = lines[2][3];
  const aBottom = lines[3][3];
  const bTop = lines[2][5];
  const bBottom = lines[3][5];
  const cTop = lines[2][7];
  const cBottom = lines[3][7];
  const dTop = lines[2][9];
  const dBottom = lines[3][9];
  console.log(aTop, aBottom, bTop, bBottom, cTop, cBottom, dTop, dBottom);
  const s: IState = {
    [Tile.A1]: aTop as TileState,
    [Tile.A2]: TileState.D,
    [Tile.A3]: TileState.D,
    [Tile.A4]: aBottom as TileState,
    [Tile.B1]: bTop as TileState,
    [Tile.B2]: TileState.C,
    [Tile.B3]: TileState.B,
    [Tile.B4]: bBottom as TileState,
    [Tile.C1]: cTop as TileState,
    [Tile.C2]: TileState.B,
    [Tile.C3]: TileState.A,
    [Tile.C4]: cBottom as TileState,
    [Tile.D1]: dTop as TileState,
    [Tile.D2]: TileState.A,
    [Tile.D3]: TileState.C,
    [Tile.D4]: dBottom as TileState,
    [Tile.LeftC]: TileState.Empty,
    [Tile.LeftD]: TileState.Empty,
    [Tile.AB]: TileState.Empty,
    [Tile.BC]: TileState.Empty,
    [Tile.CD]: TileState.Empty,
    [Tile.RightC]: TileState.Empty,
    [Tile.RightD]: TileState.Empty,
  };

  const start = Date.now();
  const first = solve(s);
  console.log(first, Date.now() - start);
}

enum TileState {
  A = "A",
  B = "B",
  C = "C",
  D = "D",
  Empty = ".",
}

enum Tile {
  A1,
  A2,
  A3,
  A4,
  B1,
  B2,
  B3,
  B4,
  C1,
  C2,
  C3,
  C4,
  D1,
  D2,
  D3,
  D4,
  LeftC,
  LeftD,
  AB,
  BC,
  CD,
  RightC,
  RightD,
}

type IState = {
  [k in Tile]: TileState;
};

interface IMove {
  tile: Tile;
  cost: number;
}

function getNeighbors(t: Tile): IMove[] {
  switch (t) {
    case Tile.A2:
      return [
        { tile: Tile.A1, cost: 1 },
        { tile: Tile.A3, cost: 1 },
      ];
    case Tile.A3:
      return [
        { tile: Tile.A2, cost: 1 },
        { tile: Tile.A4, cost: 1 },
      ];
    case Tile.A4:
      return [{ tile: Tile.A3, cost: 1 }];
    case Tile.B2:
      return [
        { tile: Tile.B1, cost: 1 },
        { tile: Tile.B3, cost: 1 },
      ];
    case Tile.B3:
      return [
        { tile: Tile.B2, cost: 1 },
        { tile: Tile.B4, cost: 1 },
      ];
    case Tile.B4:
      return [{ tile: Tile.B3, cost: 1 }];
    case Tile.C2:
      return [
        { tile: Tile.C1, cost: 1 },
        { tile: Tile.C3, cost: 1 },
      ];
    case Tile.C3:
      return [
        { tile: Tile.C2, cost: 1 },
        { tile: Tile.C4, cost: 1 },
      ];
    case Tile.C4:
      return [{ tile: Tile.C3, cost: 1 }];
    case Tile.D2:
      return [
        { tile: Tile.D1, cost: 1 },
        { tile: Tile.D3, cost: 1 },
      ];
    case Tile.D3:
      return [
        { tile: Tile.D2, cost: 1 },
        { tile: Tile.D4, cost: 1 },
      ];
    case Tile.D4:
      return [{ tile: Tile.D3, cost: 1 }];
    case Tile.RightD:
      return [{ tile: Tile.RightC, cost: 1 }];
    case Tile.LeftD:
      return [{ tile: Tile.LeftC, cost: 1 }];
    case Tile.A1:
      return [
        { tile: Tile.A2, cost: 1 },
        { tile: Tile.LeftC, cost: 2 },
        { tile: Tile.AB, cost: 2 },
      ];
    case Tile.B1:
      return [
        { tile: Tile.B2, cost: 1 },
        { tile: Tile.AB, cost: 2 },
        { tile: Tile.BC, cost: 2 },
      ];
    case Tile.C1:
      return [
        { tile: Tile.C2, cost: 1 },
        { tile: Tile.BC, cost: 2 },
        { tile: Tile.CD, cost: 2 },
      ];
    case Tile.D1:
      return [
        { tile: Tile.D2, cost: 1 },
        { tile: Tile.CD, cost: 2 },
        { tile: Tile.RightC, cost: 2 },
      ];
    case Tile.LeftC:
      return [
        { tile: Tile.LeftD, cost: 1 },
        { tile: Tile.AB, cost: 2 },
        { tile: Tile.A1, cost: 2 },
      ];
    case Tile.AB:
      return [
        { tile: Tile.LeftC, cost: 2 },
        { tile: Tile.A1, cost: 2 },
        { tile: Tile.B1, cost: 2 },
        { tile: Tile.BC, cost: 2 },
      ];
    case Tile.BC:
      return [
        { tile: Tile.AB, cost: 2 },
        { tile: Tile.B1, cost: 2 },
        { tile: Tile.C1, cost: 2 },
        { tile: Tile.CD, cost: 2 },
      ];
    case Tile.CD:
      return [
        { tile: Tile.BC, cost: 2 },
        { tile: Tile.C1, cost: 2 },
        { tile: Tile.D1, cost: 2 },
        { tile: Tile.RightC, cost: 2 },
      ];
    case Tile.RightC:
      return [
        { tile: Tile.CD, cost: 2 },
        { tile: Tile.D1, cost: 2 },
        { tile: Tile.RightD, cost: 1 },
      ];
    default:
      assertNever(t);
  }
  return [];
}

function isHallway(t: Tile) {
  return [
    Tile.LeftD,
    Tile.LeftC,
    Tile.AB,
    Tile.BC,
    Tile.CD,
    Tile.RightC,
    Tile.RightD,
  ].includes(t);
}

function isTarget(t: Tile, a: TileState): boolean {
  switch (a) {
    case TileState.A:
      return [Tile.A1, Tile.A2, Tile.A3, Tile.A4].includes(t);
    case TileState.B:
      return [Tile.B1, Tile.B2, Tile.B3, Tile.B4].includes(t);
    case TileState.C:
      return [Tile.C1, Tile.C2, Tile.C3, Tile.C4].includes(t);
    case TileState.D:
      return [Tile.D1, Tile.D2, Tile.D3, Tile.D4].includes(t);
    default:
      return false;
  }
}

function getDeeperTile(t: Tile): Tile | undefined {
  switch (t) {
    case Tile.A1:
      return Tile.A2;
    case Tile.A2:
      return Tile.A3;
    case Tile.A3:
      return Tile.A4;
    case Tile.B1:
      return Tile.B2;
    case Tile.B2:
      return Tile.B3;
    case Tile.B3:
      return Tile.B4;
    case Tile.C1:
      return Tile.C2;
    case Tile.C2:
      return Tile.C3;
    case Tile.C3:
      return Tile.C4;
    case Tile.D1:
      return Tile.D2;
    case Tile.D2:
      return Tile.D3;
    case Tile.D3:
      return Tile.D4;
  }
  return undefined;
}

function getDeeperTiles(t: Tile) {
  let d = getDeeperTile(t);
  const r: Tile[] = [];
  while (d !== undefined) {
    r.push(d);
    d = getDeeperTile(d);
  }
  return r;
}

function canVisit(s: IState, t: Tile, startTile: Tile): boolean {
  const a = s[startTile];
  if (s[t] !== TileState.Empty) return false;
  if (isHallway(t)) return true;
  if (getDeeperTiles(t).includes(startTile)) return true; // deeper going out of starting room
  if (isHallway(startTile)) {
    if (!isTarget(t, a)) return false;
    return getDeeperTiles(t).every(
      (d) => s[d] === TileState.Empty || s[d] === a
    );
  } else {
    return false;
  }
}

function canStopHere(s: IState, t: Tile, startTile: Tile): boolean {
  if (isHallway(t)) return !isHallway(startTile);
  const a = s[startTile];
  return isTarget(t, a) && getDeeperTiles(t).every((d) => s[d] === a);
}

function isFinal(s: IState, t: Tile) {
  if (isHallway(t)) return false;
  return isTarget(t, s[t]) && getDeeperTiles(t).every((d) => isTarget(d, s[d]));
}

function getMoves(s: IState, t: Tile): IMove[] {
  const a = s[t];
  if (a === TileState.Empty) return [];
  if (isFinal(s, t)) return [];
  let border = [{ tile: t, cost: 0 }];
  let accessible: IMove[] = [...border];
  while (border.length) {
    const c = border.pop()!;
    const ns = getNeighbors(c.tile);
    for (let n of ns) {
      if (
        canVisit(s, n.tile, t) &&
        !accessible.find((a) => a.tile === n.tile)
      ) {
        n.cost += c.cost;
        accessible.push(n);
        border.push(n);
      }
    }
  }
  return accessible.filter((c, i) => i > 0 && canStopHere(s, c.tile, t));
}

function isEnd(s: IState): boolean {
  for (const t of getTiles(s)) {
    if (!isHallway(t) && !isTarget(t, s[t])) return false;
  }
  return true;
}

function getTiles(s: IState): Tile[] {
  return Object.keys(s).map((k) => +k) as Tile[];
}

function unitMoveCost(s: TileState): number {
  switch (s) {
    case TileState.A:
      return 1;
    case TileState.B:
      return 10;
    case TileState.C:
      return 100;
    case TileState.D:
      return 1000;
  }
  throw "unitMoveCost empty";
}

function serialize(s: IState): string {
  return getTiles(s)
    .map((t) => s[t])
    .join("");
}

interface ISearchState {
  s: IState;
  cost: number;
  parent: ISearchState | undefined;
}

function solve(s: IState) {
  let states: ISearchState[] = [{ s, cost: 0, parent: undefined }];
  const solved = new Set<string>();
  while (states.length) {
    const cs = states.pop()!;
    const fingerPrint = serialize(cs.s);
    if (solved.has(fingerPrint)) continue;
    solved.add(fingerPrint);
    if (isEnd(cs.s)) {
      //   let ss: ISearchState | undefined = cs;
      //   while (ss) {
      //     console.log(ss.s, ss.cost);
      //     ss = ss.parent;
      //   }
      return cs.cost;
    }
    // console.log(cs.s);
    let added = false;
    for (const t of getTiles(cs.s)) {
      const moving = cs.s[t];
      for (const move of getMoves(cs.s, t)) {
        const next = {
          s: { ...cs.s },
          cost: cs.cost + move.cost * unitMoveCost(moving),
          parent: cs,
        };
        // console.log(t, move);
        next.s[t] = TileState.Empty;
        next.s[move.tile] = moving;
        states.push(next);
        added = true;
      }
    }
    if (added) {
      states.sort((a, b) => b.cost - a.cost);
      //   console.log(states[states.length - 1].cost, states.length);
    }
  }
}

function assertNever(x: never) {
  throw x;
}
