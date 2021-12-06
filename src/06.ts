// import { testInput as input } from "./06-input";
import { input } from "./06-input";

export function doIt() {
  const parsed = input
    .split(`,`)
    .map((line) => +line)
    .reduce(
      (p, c) => {
        p[c]++;
        return p;
      },
      [0, 0, 0, 0, 0, 0, 0, 0, 0]
    );
  console.log(runSimulation(parsed, 80), runSimulation(parsed, 256));
}

function runSimulation(state: number[], steps: number) {
  for (let step = 0; step < steps; step++) {
    const newState: number[] = [];
    for (let i = 1; i <= 8; i++) {
      newState[i - 1] = state[i];
    }
    newState[6] += state[0];
    newState[8] = state[0];
    state = newState;
  }
  return state.reduce((a, b) => a + b);
}
