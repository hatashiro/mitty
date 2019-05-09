import { parse } from "./parser.mjs";
import { optimize } from "./optimizer.mjs";
import { wat2wasm } from "./wabt.mjs";

class Compiler {
  generate = node => this[node.type](node.data);

  Program(nodes) {
    return `
      (module
        (import "lib" "getChar" (func $getChar (result i32)))
        (import "lib" "putChar" (func $putChar (param i32)))

        (memory 2048)

        (global $pointer (mut i32) (i32.const 0))

        (func $Pointer (param $diff i32)
          (global.get $pointer)
          (local.get $diff)
          (i32.const 4)
          (i32.mul)
          (i32.add)
          (global.set $pointer)
          )

        (func $Value (param $diff i32)
          (global.get $pointer)
          (global.get $pointer)
          (i32.load)
          (local.get $diff)
          (i32.add)
          (i32.store)
          )

        (func $Zero
          (global.get $pointer)
          (i32.const 0)
          (i32.store)
          )

        (func $Mul (param $pointerDiff i32) (param $valueDiff i32) (local $targetPointer i32)
          (global.get $pointer)
          (local.get $pointerDiff)
          (i32.const 4)
          (i32.mul)
          (i32.add)
          (local.set $targetPointer)

          (local.get $targetPointer)

          (local.get $targetPointer)
          (i32.load)

          (global.get $pointer)
          (i32.load)
          (local.get $valueDiff)
          (i32.mul)

          (i32.add)

          (i32.store)
          )

        (func $main
          ${nodes.map(this.generate).join("\n")}
          )

        (start $main)
      )
    `;
  }

  Pointer(diff) {
    return `
      (i32.const ${diff})
      (call $Pointer)
    `;
  }

  Value(diff) {
    return `
      (i32.const ${diff})
      (call $Value)
    `;
  }

  Zero() {
    return `
      (call $Zero)
    `;
  }

  Mul({ pointerDiff, valueDiff }) {
    return `
      (i32.const ${pointerDiff})
      (i32.const ${valueDiff})
      (call $Mul)
    `;
  }

  GetChar() {
    return `
      (global.get $pointer)
      (call $getChar)
      (i32.store)
    `;
  }

  PutChar() {
    return `
      (global.get $pointer)
      (i32.load)
      (call $putChar)
    `;
  }

  Loop(nodes) {
    return `
      (loop
        (global.get $pointer)
        (i32.load)
        (if
          (then
            ${nodes.map(this.generate).join("\n")}
            (br 1)
            )
          )
        )
    `;
  }
}

export function compile(code) {
  const program = optimize(parse(code));
  const compiler = new Compiler();

  const wat = compiler
    .generate(program)
    .replace(/\s+/g, " ")
    .trim();
  const wasm = wat2wasm(wat);

  return { wat, wasm };
}
