import * as io from "./io";

export async function exec(buffer, lib = io) {
  await WebAssembly.instantiate(buffer, { lib });
}
