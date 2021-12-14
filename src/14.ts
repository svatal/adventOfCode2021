// import { testInput as input } from "./14-input";
import { input } from "./14-input";

export function doIt() {
  const [template, rulesS] = input.split(`\n\n`);
  const rules = rulesS.split("\n").reduce((p, r) => {
    const [input, output] = r.split(" -> ");
    return p.set(input, output);
  }, new Map<string, string>());
  let t = template
    .split("")
    .map((c, i) => c + template[i + 1])
    .filter((i) => i.length === 2)
    .reduce((m, c) => m.set(c, (m.get(c) || 0) + 1), new Map<string, number>());
  for (let i = 0; i < 10; i++) {
    t = step(t, rules);
  }
  const first = getResult(t, template[template.length - 1]);
  for (let i = 0; i < 30; i++) {
    t = step(t, rules);
  }
  const second = getResult(t, template[template.length - 1]);
  console.log(first, second);
}

function getResult(t: Map<string, number>, lastLetter: string) {
  const a = Array.from(
    Array.from(t.entries())
      .reduce((p, [key, count]) => {
        const c = key[0];
        p.set(c, (p.get(c) || 0) + count);
        return p;
      }, new Map<string, number>([[lastLetter, 1]]))
      .values()
  ).sort((a, b) => a - b);
  return a[a.length - 1] - a[0];
}

function step(template: Map<string, number>, rules: Map<string, string>) {
  const result = new Map<string, number>();
  Array.from(template.entries()).forEach(([key, count]) => {
    const r = rules.get(key);
    if (r) {
      const key1 = key[0] + r;
      const key2 = r + key[1];
      result.set(key1, (result.get(key1) || 0) + count);
      result.set(key2, (result.get(key2) || 0) + count);
    } else {
      result.set(key, (result.get(key) || 0) + count);
    }
  });
  return result;
}
