// import { testInput as input } from "./08-input";
import { input } from "./08-input";

export function doIt() {
  const parsed = input.split(`\n`).map((line) => {
    const [numbers, output] = line.split(" | ").map((x) => x.split(" "));
    return {
      numbers,
      output,
    };
  });
  const first = parsed.reduce(
    (p, c) => p + c.output.filter((o) => o.length < 5 || o.length > 6).length,
    0
  );
  const second = parsed.reduce((p, c) => p + getOutput(c.numbers, c.output), 0);
  console.log(first, second);
}

function getOutput(numbers: string[], output: string[]): number {
  numbers = numbers.map((n) => n.split("").sort().join(""));
  output = output.map((n) => n.split("").sort().join(""));
  const [cf] = numbers.filter((n) => n.length === 2); // 1
  const [acf] = numbers.filter((n) => n.length === 3); // 7
  const [bcdf] = numbers.filter((n) => n.length === 4); // 4
  const acdeg_acdfg_abdfg = numbers.filter((n) => n.length === 5); // 2,3,5
  const abcefg_abdefg_abcdfg = numbers.filter((n) => n.length === 6); // 0,6,9
  const [abcdefg] = numbers.filter((n) => n.length === 7); // 8
  const { right: as } = match(cf, acf);
  const [a] = as;
  const acdeg_abdfg = acdeg_acdfg_abdfg.filter(
    (n) => match(n, cf).both.length === 1
  ); // 2,5
  const [acdfg] = acdeg_acdfg_abdfg.filter(
    (n) => match(n, cf).both.length === 2
  ); // 3
  const [acdeg] = acdeg_abdfg.filter((n) => match(n, bcdf).both.length === 2); // 2
  const [abdfg] = acdeg_abdfg.filter((n) => match(n, bcdf).both.length === 3); // 5
  const [abdefg] = abcefg_abdefg_abcdfg.filter(
    (n) => match(n, cf).both.length === 1
  ); // 6
  const abcefg_abcdfg = abcefg_abdefg_abcdfg.filter(
    (n) => match(n, cf).both.length === 2
  ); // 0,9
  const [abcefg] = abcefg_abcdfg.filter(
    (n) => match(n, bcdf).both.length === 3
  ); // 0
  const [abcdfg] = abcefg_abcdfg.filter(
    (n) => match(n, bcdf).both.length === 4
  ); // 9
  function getDigit(n: string) {
    switch (n) {
      case abcefg:
        return 0;
      case cf:
        return 1;
      case acdeg:
        return 2;
      case acdfg:
        return 3;
      case bcdf:
        return 4;
      case abdfg:
        return 5;
      case abdefg:
        return 6;
      case acf:
        return 7;
      case abcdefg:
        return 8;
      case abcdfg:
        return 9;
    }
    throw `${n} not found in ${numbers.join(", ")}!`;
  }
  return output.reduce((p, c) => p * 10 + getDigit(c), 0);
}

function match(x: string, y: string) {
  const xs = x.split("");
  const ys = y.split("");
  return {
    both: xs.filter((x) => ys.includes(x)),
    left: xs.filter((x) => !ys.includes(x)),
    right: ys.filter((y) => !xs.includes(y)),
  };
}
