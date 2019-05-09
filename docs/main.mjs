import { compile } from "./mitty/compiler.mjs";
import { exec } from "./mitty/exec.mjs";
import { createIO } from "./src/browser-io.mjs";
import * as examples from "./src/examples.mjs";

import { beautify } from "https://unpkg.com/s-exify@0.3.2/dist/index.mjs";

const $input = {
  bf: document.querySelector("#bf"),
  wat: document.querySelector("#wat"),
  example: document.querySelector("#example"),
  input: document.querySelector("#input"),
};

const $button = {
  compile: document.querySelector("#compile"),
  run: document.querySelector("#run")
};

const $terminal = document.querySelector("#terminal");

let wasm = null;

function selectExample() {
  const { bf, input } = examples[$input.example.value];
  $input.bf.value = bf.trim();
  $input.input.value = input || "";
  $input.wat.value = "";
  wasm = null;
}

$input.example.addEventListener("change", selectExample);
selectExample();

function compileCode() {
  const result = compile($input.bf.value);
  $input.wat.value = beautify(result.wat);
  wasm = result.wasm;
}

$button.compile.addEventListener("click", compileCode);

$input.bf.addEventListener("input", () => {
  $input.wat.value = "";
  wasm = null;
});

let terminal = null;
function createTerminal() {
  if (terminal) terminal.destroy();

  terminal = new Terminal({ convertEol: true });
  terminal.open($terminal);

  return terminal;
}
createTerminal();

$button.run.addEventListener("click", async () => {
  if (!wasm) compileCode();

  const terminal = createTerminal();

  const io = createIO({
    input: $input.input.value + "\n",
    terminal
  });

  await exec(wasm, io);
});
