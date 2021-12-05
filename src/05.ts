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
  console.log(
    danger(
      lines.filter((line) => line[0].x === line[1].x || line[0].y === line[1].y)
    ),
    danger(lines)
  );
}

function danger(lines: { x: number; y: number }[][]) {
  const map = lines.reduce((m, line) => {
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
  return map.reduce(
    (p, c) => p + c.reduce((p, c) => p + (c > 1 ? 1 : 0), 0),
    0
  );
}
