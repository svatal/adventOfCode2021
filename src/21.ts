// import { testInput as input } from "./21-input";
import { input } from "./21-input";

export function doIt() {
  const positions = input.split(`\n`).map((line) => +line.split(": ")[1]);
  play([...positions]);
  const second = play2(positions.map((pos) => ({ pos, score: 0 })));
  console.log(Math.max(...second));
}

function play(positions: number[]) {
  let dice = new DeterministicDice();
  const score = positions.map((p) => 0);
  while (score.every((s) => s < 1000)) {
    const s = score.shift()!;
    let p = move(positions.shift()!, dice.roll3());
    score.push(s + p);
    positions.push(p);
  }
  const loser = Math.min(...score);
  console.log(loser, dice.rolls, loser * dice.rolls);
}

function move(position: number, roll: number) {
  position += roll;
  position %= 10;
  if (position === 0) position = 10;
  return position;
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
  [1, 2, 3]
    .reduce((m, n1, _i, possibilities) => {
      possibilities
        .reduce(
          (p, n2) => [...p, ...possibilities.map((n3) => n1 + n2 + n3)],
          [] as number[]
        )
        .forEach((r) => m.set(r, (m.get(r) ?? 0) + 1));
      return m;
    }, new Map<number, number>())
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
      pos = move(pos, roll);
      score += pos;
      next[playerNumber] = { pos, score };
      const r =
        score >= 21
          ? playerNumber === 0
            ? [1, 0]
            : [0, 1]
          : play2(next, otherPlayerNumber);
      return [p[0] + r[0] * count, p[1] + r[1] * count];
    },
    [0, 0]
  );
  return result;
}
