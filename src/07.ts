// import { testInput as input } from "./07-input";
import { input } from "./07-input";

export function doIt() {
  const parsed = input.split(`,`).map(
    (line) => +line //
  );

  const first = iterate(parsed, getCost1);
  const second = iterate(parsed, getCost2);
  console.log(first, second);
}

function iterate(
  positions: number[],
  getCost: (positions: number[], candidate: number) => number
) {
  let candidate = Math.round(
    positions.reduce((a, b) => a + b) / positions.length
  );
  let cost = getCost(positions, candidate);
  let beforeCost = getCost(positions, candidate - 1);
  while (beforeCost < cost) {
    candidate--;
    cost = beforeCost;
    beforeCost = getCost(positions, candidate - 1);
  }
  let afterCost = getCost(positions, candidate + 1);
  while (afterCost < cost) {
    candidate++;
    cost = afterCost;
    afterCost = getCost(positions, candidate + 1);
  }
  return cost;
}

function getCost1(positions: number[], candidate: number) {
  const cost = positions.reduce((p, c) => p + Math.abs(candidate - c), 0);
  return cost;
}

function getCost2(positions: number[], candidate: number) {
  const cost = positions.reduce((p, c) => {
    const dist = Math.abs(candidate - c);
    return p + (dist * (dist + 1)) / 2;
  }, 0);
  return cost;
}
