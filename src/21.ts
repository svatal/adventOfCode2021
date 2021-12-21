// import { testInput as input } from "./21-input";
import { input } from "./21-input";

export function doIt() {
  const positions = input.split(`\n`).map((line) => +line.split(": ")[1]);
  play([...positions]);
  const second = play2(positions.map((pos) => ({ pos, score: 0 })));
  console.log(second, Math.max(...second));
}

function play(positions: number[]) {
  let dice = new DeterministicDice();
  const score = positions.map((p) => 0);
  while (score.every((s) => s < 1000)) {
    const s = score.shift()!;
    let p = positions.shift()!;
    const roll = dice.roll3();
    p += roll;
    p %= 10;
    if (p === 0) p = 10;

    score.push(s + p);
    positions.push(p);
  }
  const loser = Math.min(...score);
  console.log(loser, dice.rolls, loser * dice.rolls);
}

class DeterministicDice {
  private current = 1;
  rolls = 0;
  roll() {
    const roll = this.current++;
    this.rolls++;
    if (this.current > 100) this.current = 1;
    return roll;
  }
  roll3() {
    return this.roll() + this.roll() + this.roll();
  }
}

const diracDice = Array.from(
  [
    [1, 1, 1],
    [1, 1, 2],
    [1, 1, 3],
    [1, 2, 1],
    [1, 2, 2],
    [1, 2, 3],
    [1, 3, 1],
    [1, 3, 2],
    [1, 3, 3],
    [2, 1, 1],
    [2, 1, 2],
    [2, 1, 3],
    [2, 2, 1],
    [2, 2, 2],
    [2, 2, 3],
    [2, 3, 1],
    [2, 3, 2],
    [2, 3, 3],
    [3, 1, 1],
    [3, 1, 2],
    [3, 1, 3],
    [3, 2, 1],
    [3, 2, 2],
    [3, 2, 3],
    [3, 3, 1],
    [3, 3, 2],
    [3, 3, 3],
  ]
    .map((rs) => rs.reduce((a, b) => a + b))
    .reduce(
      (m, r) => m.set(r, (m.get(r) ?? 0) + 1),

      new Map<number, number>()
    )
    .entries()
).map(([roll, count]) => ({ roll, count }));

function play2(
  players: { pos: number; score: number }[],
  playerNumber = 0
): number[] {
  const otherPlayerNumber = (playerNumber + 1) % 2;
  const result = diracDice.reduce(
    (p, { roll, count }) => {
      const next = [...players];
      let { pos, score } = players[playerNumber];
      pos += roll;
      pos %= 10;
      if (pos === 0) pos = 10;
      score += pos;
      next[playerNumber] = { pos, score };
      if (score >= 21) {
        const r = [0, 0];
        r[playerNumber] = count;
        return [p[0] + r[0], p[1] + r[1]];
      }
      const r = play2(next, otherPlayerNumber).map((n) => n * count);
      return [p[0] + r[0], p[1] + r[1]];
    },
    [0, 0]
  );
  return result;
}
