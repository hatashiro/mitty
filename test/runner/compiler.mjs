import { strictEqual } from "assert";
import { compile } from "../../src/compiler.mjs";
import { exec } from "../../src/exec.mjs";
import { TestIO } from "./test-io.mjs";

export default async function(test, input, output) {
  const io = new TestIO(input);
  const { wasm } = compile(test);
  await exec(wasm, io);
  strictEqual(io.output, output);
}
