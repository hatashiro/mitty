import { getChar, putChar } from "./lib";

const commands = {
  ">"() {
    // TODO
    process.stdout.write(">");
  },

  "<"() {
    // TODO
    process.stdout.write("<");
  },

  "+"() {
    // TODO
    process.stdout.write("+");
  },

  "-"() {
    // TODO
    process.stdout.write("-");
  },

  "."() {
    // TODO
    process.stdout.write(".");
  },

  ","() {
    // TODO
    process.stdout.write(",");
  },

  "["() {
    // TODO
    process.stdout.write("[");
  },

  "]"() {
    // TODO
    process.stdout.write("]");
  },
};

export function interpret(code) {
  for (const c of code) {
    const command = commands[c];
    if (command) {
      command();
    }
  }
}
