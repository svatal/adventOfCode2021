// import { testInput as input } from "./16-input";
import { input } from "./16-input";

export function doIt() {
  const m = new Message(input);
  let r = parsePacket(m);
  const first = r.version;
  const second = r.result;
  console.log(first, second);
}

function leftPad(s: string) {
  while (s.length < 4) s = "0" + s;
  return s;
}

function parsePacket(m: Message, isSubpacket = false) {
  let version = m.readBits(3);
  const typeId = m.readBits(3);
  let result = 0;
  switch (typeId) {
    case 4: {
      const numbers = [];
      while (m.readBits(1) === 1) {
        numbers.push(m.readBits(4));
      }
      numbers.push(m.readBits(4));
      result += numbers.reduce((a, b) => a * 16 + b, 0);
      console.log("literal", version, typeId, result);
      break;
    }
    default: {
      const lengthTypeId = m.readBits(1);
      console.log("operation", version, typeId, lengthTypeId);
      const messages = [];
      switch (lengthTypeId) {
        case 0: {
          const len = m.readBits(15);
          const innerMessage = new Message(m.getBits(len));
          while (innerMessage.currentChar.length > 0) {
            messages.push(parsePacket(innerMessage, true));
          }
          break;
        }
        case 1: {
          const subPackets = m.readBits(11);
          for (let i = 0; i < subPackets; i++) {
            messages.push(parsePacket(m, true));
          }
          break;
        }
      }
      version += messages.reduce((p, c) => p + c.version, 0);
      const res = messages.map((m) => m.result);
      switch (typeId) {
        case 0: {
          result = messages.map((m) => m.result).reduce((a, b) => a + b, 0);
          break;
        }
        case 1: {
          result = messages.map((m) => m.result).reduce((a, b) => a * b, 1);
          break;
        }
        case 2: {
          result = Math.min(...messages.map((m) => m.result));
          break;
        }
        case 3: {
          result = Math.max(...messages.map((m) => m.result));
          break;
        }
        case 5: {
          result = res[0] > res[1] ? 1 : 0;
          break;
        }

        case 6: {
          result = res[0] < res[1] ? 1 : 0;
          break;
        }
        case 7: {
          result = res[0] === res[1] ? 1 : 0;
          break;
        }
      }
      break;
    }
  }
  if (!isSubpacket) {
    m.discardRemaining();
  }
  return { version, result };
  //   console.log("chars remaining", m.chars.length);
}

class Message {
  chars: number[][];
  constructor(input: string | number[]) {
    if (typeof input === "string") {
      this.chars = input
        .split(``)
        .map((hexa) =>
          leftPad(parseInt(hexa, 16).toString(2))
            .split("")
            .map((b) => +b)
        )
        .reverse();
    } else {
      this.chars = [];
      this.currentChar = input;
    }
  }
  currentChar: number[] = [];
  getBits(n: number) {
    let r: number[] = [];
    while (n > this.currentChar.length) {
      r.push(...this.currentChar);
      n -= this.currentChar.length;
      this.currentChar = [];
      if (n) {
        this.currentChar = this.chars.pop()!;
      }
    }
    if (n) {
      r.push(...this.currentChar.splice(0, n));
    }
    return r;
  }

  readBits(n: number) {
    const r = this.getBits(n);
    return r.reduce((a, b) => a * 2 + b, 0);
  }

  discardRemaining() {
    this.currentChar = [];
    if (this.chars.length % 2 === 1) {
      this.chars.pop();
    }
  }
}
