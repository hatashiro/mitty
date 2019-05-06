import { parse } from "./parser";
import { optimize } from "./optimizer";
import * as io from "./io";

const BUFFER_SIZE = 65536; // 32 * 64 KiB

class Interpreter {
  buffer = new Uint32Array(BUFFER_SIZE);
  pointer = 0;

  run = node => {
    this[node.type](node.data);
  };

  constructor(lib) {
    this.lib = lib;
  }

  increaseBufferSize() {
    const buffer = new Uint32Array(this.buffer.byteLength + BUFFER_SIZE);
    buffer.set(this.buffer);
    this.buffer = buffer;
  }

  Program(nodes) {
    nodes.forEach(this.run);
  }

  Pointer(diff) {
    this.pointer += diff;

    while (this.pointer >= this.buffer.byteLength) {
      increaseBufferSize();
    }

    if (this.pointer < 0) {
      const n = this.pointer;
      const m = this.buffer.byteLength;
      this.pointer = ((n % m) + m) % m; // positive modulo
    }
  }

  Value(diff) {
    this.buffer[this.pointer] += diff;
  }

  Zero() {
    this.buffer[this.pointer] = 0;
  }

  Mul({ pointerDiff, valueDiff }) {
    this.buffer[this.pointer + pointerDiff] +=
      this.buffer[this.pointer] * valueDiff;
  }

  GetChar() {
    this.buffer[this.pointer] = this.lib.getChar();
  }

  PutChar() {
    this.lib.putChar(this.buffer[this.pointer]);
  }

  Loop(nodes) {
    if (!this.buffer[this.pointer]) return;

    let idx = 0;
    while (idx < nodes.length) {
      this.run(nodes[idx]);

      if (idx === nodes.length - 1 && this.buffer[this.pointer]) {
        idx = 0;
      } else {
        idx++;
      }
    }
  }
}

export function interpret(code, lib = io) {
  const program = optimize(parse(code));
  const interpreter = new Interpreter(lib);
  interpreter.run(program);
}
