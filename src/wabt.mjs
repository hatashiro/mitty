import tmp from "tmp";
import { execSync } from "child_process";
import { dirname, resolve } from "path";
import { writeFileSync, readFileSync } from "fs";

const tempFile = ext => tmp.fileSync({ mode: 0o644, postfix: `.${ext}` }).name;

const root = resolve(dirname(new URL(import.meta.url).pathname), "..");

const bin = {
  wat2wasm: resolve(root, "wabt/bin/wat2wasm")
};

export function wat2wasm(watStr) {
  const watFile = tempFile("wat");
  const wasmFile = tempFile("wasm");
  writeFileSync(watFile, watStr);
  execSync(`${bin.wat2wasm} ${watFile} -o ${wasmFile}`);
  return readFileSync(wasmFile);
}
