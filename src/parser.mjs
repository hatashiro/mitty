import { Stack } from "./stack";

const pos = [1, 1];

function node(type, data = null) {
  return { type, data, pos: [...pos] };
}

function processPos(c) {
  if (c === "\n") {
    pos[0]++;
    pos[1] = 1;
  } else {
    pos[1]++;
  }
}

const simpleCommands = {
  ">": "IncrPointer",
  "<": "DecrPointer",
  "+": "Increment",
  "-": "Decrement",
  ".": "PutChar",
  ",": "GetChar"
};

export function parse(code) {
  const stack = new Stack();

  stack.push([]); // top-level sequence

  for (const c of code) {
    if (simpleCommands[c]) {
      stack.top.push(node(simpleCommands[c]));
    } else if (c === "[") {
      stack.push([]);
    } else if (c === "]") {
      const data = stack.pop();
      stack.top.push(node("Loop", data));
    } else {
      // ignore comments and white spaces
    }

    processPos(c);
  }

  return node("Program", stack.top);
}
