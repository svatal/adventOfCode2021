// import { testInput as input } from "./10-input";
import { input } from "./10-input";

export function doIt() {
  const parsed = input.split(`\n`).map(
    (line) => line //
  );
  const first = parsed.length;
  const second = parsed.length;
  console.log(first, second);
}
