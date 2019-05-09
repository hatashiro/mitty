export async function exec(buffer, lib) {
  const { instance } = await WebAssembly.instantiate(buffer, { lib });
  instance.exports.main();
}
