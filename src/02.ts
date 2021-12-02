// import { testInput as input } from "./02-input";
import { input } from "./02-input";

export function doIt() {
  const parsed = input.split(`\n`).map((line) => {
    const [dir, len] = line.split(" ");
    return { dir, len: +len };
  });
  const first = parsed.reduce(
    (prev, c) => {
      switch (c.dir) {
        case "forward":
          prev.horizontal += c.len;
          break;
        case "down":
          prev.depth += c.len;
          break;
        case "up":
          prev.depth -= c.len;
          break;
      }
      return prev;
    },
    { horizontal: 0, depth: 0 }
  );
  const second = parsed.reduce(
    (prev, c) => {
      switch (c.dir) {
        case "forward":
          prev.horizontal += c.len;
          prev.depth += c.len * prev.aim;
          break;
        case "down":
          prev.aim += c.len;
          break;
        case "up":
          prev.aim -= c.len;
          break;
      }
      return prev;
    },
    { horizontal: 0, depth: 0, aim: 0 }
  );
  console.log(first.depth * first.horizontal, second.depth * second.horizontal);
}
