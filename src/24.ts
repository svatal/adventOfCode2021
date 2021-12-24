// import { testInput as input } from "./24-input";
import { input } from "./24-input";

export function doIt() {
  const parsed = input.split(`\n`).map(
    (line) => line.split(" ") //
  );
  const r: { A: number; B: number; C: number }[] = new Array(14)
    .fill(0)
    .map((_, i) => ({
      A: +parsed[i * 18 + 4][2],
      B: +parsed[i * 18 + 5][2],
      C: +parsed[i * 18 + 15][2],
    }));
  console.log(r);

  console.log(solve(r, true));
  console.log(solve(r, false));
  // let t = Date.now();
  // for (let mn = 99999999999999; mn > 99999999999989; mn--) {
  //   const a = mn
  //     .toFixed(0)
  //     .split("")
  //     .map((x) => +x);
  //   if (a.some((x) => x === 0)) continue;
  //   if (Date.now() - t > 1000) {
  //     t = Date.now();
  //     console.log(mn.toFixed(0));
  //   }
  //   console.log(validate(parsed, [...a]), validate2(r, a));
  //   // const isValid = validate(parsed, a);
  //   // if (isValid) {
  //   //   console.log(mn);
  //   //   return;
  //   // }
  // }
  // console.log("dnf");
  //   const first = parsed.length;
  //   const second = parsed.length;
  //   console.log(first, second);
}

function solve(code: { A: number; B: number; C: number }[], max: boolean) {
  const buff: { pos: number; C: number }[] = [];
  const result: number[] = [];
  for (let i = 0; i < code.length; i++) {
    const iter = code[i];
    if (iter.A === 1) {
      buff.push({ pos: i, C: iter.C });
    } else {
      const other = buff.pop()!;
      const diff = other.C + iter.B;
      const base = max ? Math.min(9 - diff, 9) : Math.max(1 - diff, 1);
      console.log(i, other.pos, diff, base, base + diff);
      result[other.pos] = base;
      result[i] = base + diff;
    }
  }
  return result.join("");
}

function validate2(code: { A: number; B: number; C: number }[], num: number[]) {
  let z = 0;
  for (let iter of code) {
    const n = num.shift()!;
    const x = (z % 26) + iter.B === n ? 0 : 1;
    z = Math.trunc(z / iter.A) * (25 * x + 1) + (x === 1 ? n + iter.C : 0);

    // console.log(iter, n, x, z);
  }
  return z;
}

function validate(code: string[][], num: number[]): number {
  let w = 0;
  let x = 0;
  let y = 0;
  let z = 0;
  function read(register: string) {
    switch (register) {
      case "w":
        return w;
      case "x":
        return x;
      case "y":
        return y;
      case "z":
        return z;
      default:
        return +register;
    }
  }
  function write(register: string, n: number) {
    switch (register) {
      case "w":
        w = n;
        return;
      case "x":
        x = n;
        return;
      case "y":
        y = n;
        return;
      case "z":
        z = n;
        return;
      default:
        throw "write " + register;
    }
  }
  for (const [operation, op1, op2] of code) {
    // console.log(operation, op1, op2, "|", w, x, y, z);
    switch (operation) {
      case "inp": {
        write(op1, num.shift()!);
        break;
      }
      case "add": {
        write(op1, read(op1) + read(op2));
        // if (op1 === "z" && op2 === "y") console.log("orig", w, x, y, z);
        break;
      }
      case "mul": {
        write(op1, read(op1) * read(op2));
        break;
      }
      case "div": {
        write(op1, Math.trunc(read(op1) / read(op2)));
        break;
      }
      case "mod": {
        write(op1, read(op1) % read(op2));
        break;
      }
      case "eql": {
        write(op1, read(op1) === read(op2) ? 1 : 0);
        break;
      }
      default:
        throw "unknown op " + operation;
    }
  }
  return z;
}
