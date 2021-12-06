// import { testInput as input } from "./06-input";
import { input } from "./06-input";

export function doIt() {
  const parsed = input
    .split(`,`)
    .map((line) => +line)
    .reduce((p, c) => {
      p[c]++;
      return p;
    }, new Array(9).fill(0));
  console.log(runSimulation(parsed, 80), runSimulation(parsed, 256));
}

function runSimulation(state: number[], steps: number) {
  for (let step = 0; step < steps; step++) {
    const [spawn, ...newState] = state;
    newState[6] += spawn;
    newState[8] = spawn;
    state = newState;
  }
  return state.reduce((a, b) => a + b);
}
