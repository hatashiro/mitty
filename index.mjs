import WabtModule from "wabt";
import { promises as afs } from "fs";
import { beautify } from "s-exify/dist/index.mjs";
import { interpret } from "./src/interpreter.mjs";
import { compile } from "./src/compiler.mjs";
import { exec } from "./src/exec.mjs";
import * as io from "./src/io.mjs";

global.WabtModule = WabtModule;

const commands = {
  async interpret(path) {
    if (!path) {
      throw new Error(`No input file is specified.`);
    }

    const content = await afs.readFile(path, "utf-8");
    interpret(content, io);
  },

  async compile(input, output) {
    if (!input) {
      throw new Error(`No input file is specified.`);
    }

    const content = await afs.readFile(input, "utf-8");
    const { wat, wasm } = compile(content);

    if (output) {
      await afs.writeFile(output, wasm);
    } else {
      console.log(beautify(wat));
    }
  },

  async exec(input) {
    if (!input) {
      throw new Error(`No input file is specified.`);
    }

    const content = await afs.readFile(input);
    await exec(content, io);
  }
};

const [, , command, ...argv] = process.argv;

if (!command) {
  console.log(`Supported commands: ${Object.keys(commands).join(", ")}`);
} else if (commands[command]) {
  commands[command](...argv).catch(err => {
    console.error(err);
    process.exit(1);
  });
} else {
  throw new Error(`No command: ${command}`);
}
