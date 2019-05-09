const { parseWat } = WabtModule();

const FILENAME = "main.wat";

export function wat2wasm(wat) {
  const module = parseWat(FILENAME, wat);
  const binary = module.toBinary({
    log: false,
    canonicalize_lebs: false,
    relocatable: false,
    write_debug_names: false
  });
  return binary.buffer;
}
