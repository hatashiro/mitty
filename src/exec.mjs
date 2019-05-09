import * as io from "./io.mjs";

export async function exec(buffer, lib = io) {
  await WebAssembly.instantiate(buffer, { lib });
}
