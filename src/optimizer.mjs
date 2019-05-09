import * as parser from "./parser.mjs";

export function optimize(node) {
  if (node.type === "Program") {
    node.data = optimizeSequence(node.data);
  } else if (node.type === "Loop") {
    if (node.data.length === 1 && node.data[0].type === "Value") {
      return parser.node("Zero", node.data[0].pos);
    } else {
      node.data = optimizeSequence(node.data);
      node.data = optimizeMultiplication(node.data);
    }
  }

  return node;
}

function optimizeSequence(nodes) {
  const result = [];

  for (let i = 0; i < nodes.length; i++) {
    const node = optimize(nodes[i]);

    if (node.type === "Pointer" || node.type === "Value") {
      for (let j = i + 1; j < nodes.length; j++) {
        const next = nodes[j];
        if (next.type === node.type) {
          i++; // skip next
          node.data += next.data; // merge diff
        } else {
          break;
        }
      }
      if (node.data === 0) continue; // skip current if diff is zero
    }

    result.push(node);
  }

  return result;
}

function optimizeMultiplication(nodes) {
  try {
    if (nodes.length % 2) throw false; // even length
    if (nodes[0].type !== "Value" || nodes[0].data !== -1) throw false; // first node is Value -1

    const result = [];
    let totalPointerDiff = 0;

    for (let i = 1; i < nodes.length; i++) {
      const node = nodes[i];
      const next = nodes[i + 1];
      if (i === nodes.length - 1 && node.type === "Pointer") {
        if (totalPointerDiff + node.data === 0) {
          // should be 0
          // the original position should be zero at the end
          result.push(parser.node("Zero", nodes[0].pos));
        } else {
          throw false;
        }
      } else {
        if (node.type === "Pointer" && next.type === "Value") {
          totalPointerDiff += node.data; // add pointer diff
          if (totalPointerDiff === 0) throw 1;
          const mul = parser.node("Mul", node.pos, {
            pointerDiff: totalPointerDiff,
            valueDiff: next.data
          });
          result.push(mul); // add Mul node
          i++; // skip next
        } else {
          throw false;
        }
      }
    }

    return result;
  } catch {
    return nodes;
  }
}
