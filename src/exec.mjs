import * as io from "./io";

export function exec(buffer, lib = io) {
  WebAssembly.instantiate(buffer, { lib });
}
