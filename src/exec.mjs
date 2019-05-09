export async function exec(buffer, lib) {
  await WebAssembly.instantiate(buffer, { lib });
}
