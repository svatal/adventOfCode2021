// import { testInput as input } from "./17-input";
import { input } from "./17-input";
import { posToString } from "./utils/position2D";

export function doIt() {
  const [as, ys] = input.split(`, y=`);
  const [y1, y2] = ys.split("..").map((y) => +y);
  const [_, xs] = as.split("x=");
  const [x1, x2] = xs.split("..").map((x) => +x);
  const targetX = { min: x1, max: x2 };
  const targetY = { min: y1, max: y2 };
  let maxMaxY = 0;
  const vs = new Set<string>();
  for (let vy0 = targetY.min; vy0 < 500; vy0++) {
    let vy = vy0;
    let y = 0;
    let maxY = 0;
    for (let stepY = 1; y >= targetY.min; stepY++) {
      y += vy--;
      maxY = Math.max(maxY, y);
      if (y >= targetY.min && y <= targetY.max) {
        for (let vx0 = targetX.max; vx0 > 0; vx0--) {
          let vx = vx0;
          let x = 0;
          for (let stepX = 1; stepX <= stepY; stepX++) {
            x += vx;
            if (vx > 0) vx--;
          }
          if (x >= targetX.min && x <= targetX.max) {
            // console.log(maxY, vy0, vx0);
            vs.add(posToString({ x: vy0, y: vx0 }));
            maxMaxY = Math.max(maxMaxY, maxY);
          }
        }
      }
    }
  }

  const first = maxMaxY;
  const second = vs.size;
  console.log(first, second);
}
