import { strictEqual } from "assert";
import { interpret } from "../../src/interpreter.mjs";
import { TestIO } from "./test-io.mjs";

export default function(test, input, output) {
  const io = new TestIO(input);
  interpret(test, io);
  strictEqual(io.output, output);
}
