export function createIO({ input, terminal }) {
  let i = 0;
  return {
    getChar() {
      const char = input[i];
      if (char) {
        i++;
        return char.charCodeAt(0);
      } else {
        return 0;
      }
    },
    putChar(char) {
      terminal.write(String.fromCharCode(char));
    }
  };
}
