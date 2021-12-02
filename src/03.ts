// import { testInput as input } from "./03-input";
import { input } from "./03-input";

export function doIt() {
  const parsed = input.split(`\n`).map(
    (line) => line //
  );
  const first = parsed.length;
  const second = parsed.length;
  console.log(first, second);
}
