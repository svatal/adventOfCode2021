// import { testInput as input } from "./04-input";
import { input } from "./04-input";

const crossed = -1;

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
  const first = solve(numbersDrawn, boards);
  const second = solve2(numbersDrawn, boards);
  console.log(first, second);
}

function solve(numbersDrawn: number[], boards: number[][][]) {
  let i = 0;
  let result = -1;
  do {
    const draw = numbersDrawn[i];
    // console.log("draw", draw);
    boards = boards.map((board) => {
      const updated = board.map((line) =>
        line.map((n) => (n !== draw ? n : crossed))
      );
      //   console.log(updated);
      const isHLine = updated.some((line) => line.every((n) => n === crossed));
      const isVLine = updated.some((_, i) =>
        updated.every((line) => line[i] === crossed)
      );
      if (isHLine || isVLine) {
        result =
          draw *
          updated.reduce(
            (prev, line) =>
              prev + line.reduce((p, n) => p + (n === crossed ? 0 : n), 0),
            0
          );
        console.log(isVLine, isHLine, result);
      }
      return updated;
    });
    i++;
  } while (result === -1);
  return result;
}

function solve2(numbersDrawn: number[], boards: number[][][]) {
  let i = 0;
  let result = -1;
  let unsolved = boards.length;
  do {
    const draw = numbersDrawn[i];
    // console.log("draw", draw);
    boards = boards.map((board) => {
      if (board.length === 0) return board;
      const updated = board.map((line) =>
        line.map((n) => (n !== draw ? n : crossed))
      );
      //   console.log(updated);
      const isHLine = updated.some((line) => line.every((n) => n === crossed));
      const isVLine = updated.some((_, i) =>
        updated.every((line) => line[i] === crossed)
      );
      if (isHLine || isVLine) {
        result =
          draw *
          updated.reduce(
            (prev, line) =>
              prev + line.reduce((p, n) => p + (n === crossed ? 0 : n), 0),
            0
          );
        unsolved--;
        return [];
      }
      return updated;
    });
    i++;
  } while (unsolved);
  return result;
}
