import { parse } from "./parser";
import { optimize } from "./optimizer";

class Compiler {
  wat = "";

  generate = node => {
    this[node.type](node.data);
  };

  get wasm() {
    // TODO
    return Buffer.alloc(0);
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
