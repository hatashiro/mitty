import { strictEqual } from "assert";
import { interpret } from "../../src/interpreter";
import { TestIO } from "./test-io";

export default function(test, input, output) {
  const io = new TestIO(input);
  interpret(test, io);
  strictEqual(io.output, output);
}
