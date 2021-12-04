// import { testInput as input } from "./04-input";
import { input } from "./04-input";

export function doIt() {
  const [numbersDrawnS, boardsS] = input.split(`\n\n\n`).map(
    (line) => line //
  );
  const numbersDrawn = numbersDrawnS.split(",").map((n) => +n);
  let boards = boardsS.split("\n\n").map((board) =>
    board.split("\n").map((line) =>
      line
        .split(" ")
        .filter((n) => n !== "")
        .map((n) => +n)
    )
  );
  //   console.log(numbersDrawn);
  //   console.log(boards);
  const first = solve(numbersDrawn, boards, 1);
  const second = solve(numbersDrawn, boards, boards.length);
  console.log(first, second);
}

const crossed = "X";
const solved = "solved";

function solve(
  numbersDrawn: number[],
  boards: ((number | typeof crossed)[][] | typeof solved)[],
  remainsToSolve: number
) {
  let i = 0;
  let result = -1;
  do {
    const draw = numbersDrawn[i];
    boards = boards.map((board) => {
      if (board === solved) return board;
      const updated = board.map((line) =>
        line.map((n) => (n === draw ? crossed : n))
      );
      const isHLine = updated.some((line) => line.every((n) => n === crossed));
      const isVLine = updated.some((_, i) =>
        updated.every((line) => line[i] === crossed)
      );
      if (isHLine || isVLine) {
        result =
          draw *
          updated.reduce(
            (prev, line) =>
              prev +
              line.reduce((p: number, n) => p + (n === crossed ? 0 : n), 0),
            0
          );
        remainsToSolve--;
        return solved;
      }
      return updated;
    });
    i++;
  } while (remainsToSolve);
  return result;
}
