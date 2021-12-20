// import { testInput as input } from "./20-input";
import { input } from "./20-input";
import { IPosition, posToString } from "./utils/position2D";

export function doIt() {
  const [algS, imgS] = input.split(`\n\n`);
  const alg = algS.split("").map((p) => (p === "." ? 0 : 1));
  const img = imgS
    .split("\n")
    .map((l) => l.split("").map((p) => (p === "." ? 0 : 1)));
  let litMap = img.reduce(
    (prev, l, y) => [
      ...prev,
      ...l.reduce(
        (l, p, x) => [...l, ...(p ? [{ x, y }] : [])],
        [] as IPosition[]
      ),
    ],
    [] as IPosition[]
  );
  let backgroundIsLit = false;
  for (let i = 0; i < 50; i++) {
    const result = enhance(litMap, alg, backgroundIsLit);
    litMap = result.next;
    backgroundIsLit = result.backgroundIsLit;
  }
  console.log(litMap.length);
}

function enhance(lit: IPosition[], alg: (0 | 1)[], backgroundIsLit: boolean) {
  const next: IPosition[] = [];
  const xMin = Math.min(...lit.map((p) => p.x));
  const xMax = Math.max(...lit.map((p) => p.x));
  const yMin = Math.min(...lit.map((p) => p.y));
  const yMax = Math.max(...lit.map((p) => p.y));
  const map = new Set(lit.map(posToString));
  for (let x = xMin - 1; x <= xMax + 1; x++)
    for (let y = yMin - 1; y <= yMax + 1; y++) {
      const idx = [
        { y: y - 1, x: x - 1 },
        { y: y - 1, x: x },
        { y: y - 1, x: x + 1 },
        { y: y, x: x - 1 },
        { y: y, x: x },
        { y: y, x: x + 1 },
        { y: y + 1, x: x - 1 },
        { y: y + 1, x: x },
        { y: y + 1, x: x + 1 },
      ]
        .map((p) =>
          p.x < xMin || p.x > xMax || p.y < yMin || p.y > yMax
            ? backgroundIsLit
            : map.has(posToString(p))
        )
        .reduce((p, has) => p * 2 + (has ? 1 : 0), 0);
      if (alg[idx]) {
        next.push({ x, y });
      }
    }
  return { next, backgroundIsLit: alg[0] ? !backgroundIsLit : backgroundIsLit };
}

function display(lit: IPosition[]) {
  console.log(
    lit
      .map((p) => ({ x: p.x + 20, y: p.y + 20 }))
      .reduce((pic, p) => {
        pic[p.y] = pic[p.y] || Array(150).fill(".");
        pic[p.y][p.x] = "#";
        return pic;
      }, [] as string[][])
      .map((l) => l.join(""))
  );
}
