// import { testInput as input } from "./13-input";
import { input } from "./13-input";
import { IPosition, posFromString, posToString } from "./utils/position";

export function doIt() {
  const [dotsS, instrS] = input.split(`\n\n`).map(
    (line) => line //
  );
  const dots = dotsS.split("\n").map((l) => {
    const [x, y] = l.split(",").map((x) => +x);
    return { x, y };
  });
  const folds = instrS.split("\n").map((f) => {
    const [i, n] = f.split("=");
    return { axis: i[i.length - 1], n: +n };
  });
  folds.forEach;

  // console.log(fold1(dots, folds[0]).map(posToString));
  const first = new Set(fold1(dots, folds[0]).map(posToString)).size;
  const second = Array.from(
    new Set(fold(dots, folds).map(posToString)).values()
  )
    .map(posFromString)
    .reduce((pic, p) => {
      pic[p.y] = pic[p.y] || Array(100).fill(".");
      pic[p.y][p.x] = "X";
      return pic;
    }, [] as string[][])
    .map((l) => l.join(""));
  console.log(first, second);
}

function fold(dots: IPosition[], folds: { axis: string; n: number }[]) {
  folds.forEach((f) => {
    dots = fold1(dots, f);
  });
  return dots;
}

function fold1(dots: IPosition[], f: { axis: string; n: number }) {
  return dots.map((d) =>
    f.axis === "x"
      ? d.x < f.n
        ? d
        : { x: 2 * f.n - d.x, y: d.y }
      : d.y < f.n
      ? d
      : { y: 2 * f.n - d.y, x: d.x }
  );
}
