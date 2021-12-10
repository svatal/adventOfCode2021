// import { testInput as input } from "./10-input";
import { input } from "./10-input";

export function doIt() {
  const parsed = input.split(`\n`).map(parse);
  const first = parsed.map<number>(evalError).reduce((a, b) => a + b, 0);
  const second = parsed
    .map(evalClosing)
    .filter((score) => score > 0)
    .sort((a, b) => a - b);
  console.log(first, second[(second.length - 1) / 2]);
}

function parse(line: string) {
  const open: string[] = [];
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    switch (char) {
      case "(":
        open.push(")");
        break;
      case "[":
        open.push("]");
        break;
      case "{":
        open.push("}");
        break;
      case "<":
        open.push(">");
        break;
      default: {
        const expected = open.pop();
        if (char !== expected) {
          return char;
        }
      }
    }
  }
  return open.reverse();
}

function evalError(error: string | string[]) {
  if (Array.isArray(error)) return 0;
  switch (error) {
    case ")":
      return 3;
    case "]":
      return 57;
    case "}":
      return 1197;
    case ">":
      return 25137;
  }
  return 0;
}

function evalClosing(closing: string | string[]) {
  if (!Array.isArray(closing)) return 0;
  return closing.reduce((a, b) => a * 5 + " )]}>".split("").indexOf(b), 0);
}
