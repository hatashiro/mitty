import { execSync } from "child_process";
import { fileSync } from "tmp";
import { resolve } from "path";
import { writeFileSync, readFileSync } from "fs";

const tempFile = ext => fileSync({ mode: 0o644, postfix: `.${ext}` }).name;

const bin = {
  wat2wasm: resolve(new URL(import.meta.url).pathname, "../wabt/bin/wat2wasm")
};

export function wat2wasm(watStr) {
  const watFile = tempFile("wat");
  const wasmFile = tempFile("wasm");
  writeFileSync(watFile, watStr);
  execSync(`${bin.wat2wasm} ${watFile} -o ${wasmFile}`);
  return readFileSync(wasmFile);
}
