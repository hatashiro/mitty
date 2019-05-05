import { promises as afs } from "fs";
import { interpret } from "./src/interpreter";

const commands = {
  async interpret(path) {
    if (!path) {
      throw new Error(`No input file is specified.`);
    }

    const content = await afs.readFile(path, "utf-8");
    interpret(content);
  },

  compile(path) {
    // TODO
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
