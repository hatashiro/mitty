import { parse } from "./parser";
import { optimize } from "./optimizer";
import { wat2wasm } from "./wabt";

class Compiler {
  wat = "";

  generate = node => {
    this[node.type](node.data);
  };

  get wasm() {
    return wat2wasm(this.wat);
  }

  Program(nodes) {}

  Pointer(diff) {}

  Value(diff) {}

  Zero() {}

  Mul({ pointerDiff, valueDiff }) {}

  GetChar() {}

  PutChar() {}

  Loop(nodes) {}
}

export function compile(code) {
  const program = optimize(parse(code));
  const compiler = new Compiler();
  compiler.generate(program);

  const { wat, wasm } = compiler;
  return { wat, wasm };
}
