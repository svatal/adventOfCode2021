// import { testInput as input } from "./06-input";
import { input } from "./06-input";

export function doIt() {
  const parsed = input
    .split(`,`)
    .map((line) => +line)
    .reduce((p, c) => {
      p[c] = (p[c] || 0) + 1;
      return p;
    }, [] as number[]);
  console.log(runSimulation(parsed, 80), runSimulation(parsed, 256));
}

function runSimulation(state: number[], steps: number) {
  for (let step = 0; step < steps; step++) {
    const spawn = state[0] ?? 0;
    const newState: number[] = [];
    for (let i = 1; i <= 8; i++) {
      newState[i - 1] = state[i] ?? 0;
    }
    newState[6] += spawn;
    newState[8] = spawn;
    state = newState;
  }
  return state.reduce((a, b) => a + b);
}
