const fs = require("fs");

if (process.stdin.setRawMode) {
  process.stdin.setRawMode(true);
}

const f = fs.openSync("/dev/stdin", 0);

export function getChar() {
  const b = Buffer.alloc(1);
  while (true) {
    try {
      fs.readSync(f, b, 0, 1, null);
      return b[0];
    } catch (err) {
      continue;
    }
  }
}

export function putChar(c) {
  process.stdout.write(String.fromCharCode(c));
}
