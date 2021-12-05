// import { testInput as input } from "./05-input";
import { input } from "./05-input";

export function doIt() {
  const lines = input.split(`\n`).map(
    (line) =>
      line.split(" -> ").map((point) => {
        const [x, y] = point.split(",").map((c) => +c);
        return { x, y };
      }) //
  );
  const map = lines
    .filter((line) => line[0].x === line[1].x || line[0].y === line[1].y)
    .map((l) => (l[0].x < l[1].x || l[0].y < l[1].y ? l : [l[1], l[0]]))
    .reduce((m, line) => {
      const xLen = line[1].x - line[0].x;
      const yLen = line[1].y - line[0].y;
      //   console.log(line, xLen, yLen);
      for (let i = 0; i <= xLen + yLen; i++) {
        const x = line[0].x + (xLen ? i : 0);
        const y = line[0].y + (yLen ? i : 0);
        // console.log(x, y);
        m[y] = m[y] ?? [];
        m[y][x] = (m[y][x] ?? 0) + 1;
      }
      return m;
    }, [] as number[][]);
  //   console.log(map);
  const first = map.reduce(
    (p, c) => p + c.reduce((p, c) => p + (c > 1 ? 1 : 0), 0),
    0
  );
  const map2 = lines.reduce((m, line) => {
    const xLen = line[1].x - line[0].x;
    const yLen = line[1].y - line[0].y;
    // console.log(line, xLen, yLen);
    for (let i = 0; i <= Math.max(Math.abs(xLen), Math.abs(yLen)); i++) {
      const x = line[0].x + (xLen > 0 ? i : xLen < 0 ? -i : 0);
      const y = line[0].y + (yLen > 0 ? i : yLen < 0 ? -i : 0);
      //   console.log(x, y);
      m[y] = m[y] ?? [];
      m[y][x] = (m[y][x] ?? 0) + 1;
    }
    return m;
  }, [] as number[][]);
  //   console.log(map2);
  const second = map2.reduce(
    (p, c) => p + c.reduce((p, c) => p + (c > 1 ? 1 : 0), 0),
    0
  );
  console.log(first, second);
}
