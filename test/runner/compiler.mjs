import { strictEqual } from "assert";
import { compile } from "../../src/compiler";
import { exec } from "../../src/exec";
import { TestIO } from "./test-io";

export default async function(test, input, output) {
  const io = new TestIO(input);
  const { wasm } = compile(test);
  await exec(wasm, io);
  strictEqual(io.output, output);
}
