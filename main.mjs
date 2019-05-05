import { interpret } from "./src/interpreter";

const commands = {
  interpret(path) {
    // TODO
    interpret(path);
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
