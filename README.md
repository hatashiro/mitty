# Mitty

[![Build Status](https://travis-ci.org/utatti/mitty.svg?branch=master)](https://travis-ci.org/utatti/mitty)

Mitty is a [Brain*uck](https://en.wikipedia.org/wiki/Brainfuck) to
[WASM](https://webassembly.org/) compiler and runtime.

## Demo

https://utatti.github.io/mitty/

## How to use

Install:

```
npm i -g @utatti/mitty
```

Prepare a Brain*uck code:

```brainfuck
>++++++++[-<+++++++++>]<.>>+>-[+]++
>++>+++[>[->+++<<+++>]<<]>-----.>->
+++..+++.>-.<<+[>[+>+]>>]<---------
-----.>>.+++.------.--------.>+.>+.
```

Run `mitty`:

```bash
# JavaScript interpreter
mitty interpret hello.b

# WASM compiler
mitty compile hello.b hello.wasm
mitty exec hello.wasm
```

## Requirement

Node.js >= 12 is needed to run ES Modules natively.

## Test cases

The test cases in the [/test](test) directory are copied from the following
repository. They have their own licensing.

- https://github.com/rdebath/Brainfuck

## References

- [WebAssembly Specification](https://webassembly.github.io/spec/core/index.html)
- [Brainfuck Optimization Strategies](http://calmerthanyouare.org/2015/01/07/optimizing-brainfuck.html) by Mats Linander

## License

[MIT](LICENSE)
