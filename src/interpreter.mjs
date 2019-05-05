import { parse } from "./parser";
import { getChar, putChar } from "./lib";

const BUFFER_SIZE = 65536; // 64 KiB
let buffer = new Uint8Array(BUFFER_SIZE);

function increaseBufferSize() {
  const newBuffer = new Uint8Array(buffer.byteLength + BUFFER_SIZE);
  newBuffer.set(buffer);
  buffer = newBuffer;
}

let pointer = 0;

const commands = {
  Program(nodes) {
    nodes.forEach(run);
  },

  IncrPointer() {
    pointer++;
    if (pointer >= buffer.byteLength) {
      increaseBufferSize();
    }
  },

  DecrPointer() {
    pointer--;
    if (pointer < 0) {
      pointer += buffer.byteLength;
    }
  },

  Increment() {
    buffer[pointer]++;
  },

  Decrement() {
    buffer[pointer]--;
  },

  GetChar() {
    buffer[pointer] = getChar();
  },

  PutChar() {
    putChar(buffer[pointer]);
  },

  Loop(nodes) {
    if (!buffer[pointer]) return;

    let idx = 0;
    while (idx < nodes.length) {
      run(nodes[idx]);

      if (idx === nodes.length - 1 && buffer[pointer]) {
        idx = 0;
      } else {
        idx++;
      }
    }
  }
};

function run(node) {
  commands[node.type](node.data);
}

export function interpret(code) {
  const program = parse(code);
  run(program);
}
