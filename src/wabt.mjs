import global from "./global.mjs";

const FILENAME = "main.wat";

export function wat2wasm(wat) {
  const wabt = global.WabtModule();
  const module = wabt.parseWat(FILENAME, wat);
  const binary = module.toBinary({
    log: false,
    canonicalize_lebs: false,
    relocatable: false,
    write_debug_names: false
  });
  return binary.buffer;
}
