export class TestIO {
  input = "";
  idx = 0;

  output = "";

  constructor(input) {
    this.input = input || "";
  }

  getChar = () => {
    return this.idx < this.input.length ? this.input.charCodeAt(this.idx++) : 0;
  };

  putChar = code => {
    this.output += String.fromCharCode(code);
  };
}
