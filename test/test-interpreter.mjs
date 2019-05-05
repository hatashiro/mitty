export default async function(test, input, output) {
  // TODO
  // if (Math.random() > 0.9) throw new Error("No!");
  return new Promise(resolve => setTimeout(resolve, Math.random() * 2000));
}
