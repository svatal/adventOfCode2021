// import { testInput as input } from "./12-input";
import { input } from "./12-input";

export function doIt() {
  const parsed = input.split(`\n`).reduce((p, line) => {
    const [a, b] = line.split("-");
    p[a] = [...(p[a] || []), b];
    p[b] = [...(p[b] || []), a];
    return p;
  }, {} as Record<string, string[]>);
  const first = getPaths(parsed, "start", [], false);
  const second = getPaths(parsed, "start", [], true);
  console.log(first, second);
}

function getPaths(
  maze: Record<string, string[]>,
  from: string,
  smallVisited: string[],
  canVisitSmallAgain: boolean
): number {
  const isSmall = from === from.toLowerCase();
  return maze[from]
    .filter((c) => canVisitSmallAgain || smallVisited.indexOf(c) === -1)
    .reduce((p, c) => {
      if (c === "end") return p + 1;
      if (c === "start") return p;
      return (
        p +
        getPaths(
          maze,
          c,
          isSmall ? [...smallVisited, from] : smallVisited,
          canVisitSmallAgain && smallVisited.indexOf(c) === -1
        )
      );
    }, 0);
}
