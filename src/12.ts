// import { testInput as input } from "./12-input";
import { input } from "./12-input";

export function doIt() {
  const parsed = input.split(`\n`).reduce((p, line) => {
    const [a, b] = line.split("-");
    p[a] = [...(p[a] || []), b];
    p[b] = [...(p[b] || []), a];
    return p;
  }, {} as Record<string, string[]>);
  const first = getPaths(parsed, "start", []);
  const second = getPaths2(parsed, "start", [], false);
  console.log(first, second);
}

function getPaths(
  maze: Record<string, string[]>,
  from: string,
  forbidden: string[]
): number {
  const isSmall = from === from.toLowerCase();
  return maze[from]
    .filter((c) => forbidden.indexOf(c) == -1)
    .reduce((p, c) => {
      if (c === "end") return p + 1;
      return p + getPaths(maze, c, isSmall ? [...forbidden, from] : forbidden);
    }, 0);
}

function getPaths2(
  maze: Record<string, string[]>,
  from: string,
  smallVisited: string[],
  visitedTwice: boolean
): number {
  const isSmall = from === from.toLowerCase();
  return maze[from]
    .filter((c) => !visitedTwice || smallVisited.indexOf(c) == -1)
    .reduce((p, c) => {
      if (c === "end") return p + 1;
      if (c === "start") return p;
      return (
        p +
        getPaths2(
          maze,
          c,
          isSmall ? [...smallVisited, from] : smallVisited,
          visitedTwice || smallVisited.indexOf(c) >= 0
        )
      );
    }, 0);
}
