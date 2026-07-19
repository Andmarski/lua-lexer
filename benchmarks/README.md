# lua-lexer Performance Benchmarks

This directory contains the benchmarking suite for `lua-lexer`. The primary goal of this suite is to measure the raw tokenization throughput and compare it against `luaparse`, the standard Lua parser for JavaScript and TypeScript ecosystems.

## System Specifications

The benchmarks were executed under the following hardware and runtime environment:

* **CPU:** Intel(R) Core(TM) i7-8700K CPU @ 3.70GHz
* **Clock Speed:** ~4.25 GHz
* **Runtime:** Node.js v25.8.2 (x64-win32)

## Benchmarking Methodology

To ensure an objective and rigorous performance comparison, the benchmarking suite is designed with the following constraints:

1. **Lexing Isolation & Identical Capabilities:** 
   Standard parsers consume significant CPU time generating Abstract Syntax Trees (AST). To isolate the tokenization phase and ensure a direct comparison, `luaparse` is strictly configured with `{ wait: true, comments: true, scope: false, locations: false, ranges: false }`. Furthermore, both lexers are explicitly configured to parse under the exact same language target (`luaVersion: "5.3"`) and both are forced to extract and emit all comments (`skipComments: false` / `comments: true`). This ensures `lua-lexer` is evaluated on performing the exact same workload.

2. **Zero-Allocation Profiling:** 
   Storing thousands of emitted tokens in an array creates an artificial bottleneck due to memory allocation and subsequent Garbage Collection (GC) pressure. The benchmark mitigates this by executing `lexer.next()` (and `luaparse.lex()`) in a tight, unrolled `while(true)` loop. Tokens are yielded and immediately discarded.

3. **Heavy Synthetic Payload:** 
   The test environment dynamically constructs a massive ~100KB payload of pure Lua code by replicating a foundational `sample.lua` file. This file contains every Lua keyword, operator, multi-line string, depth-nested comment, and bitwise operation to simulate extreme stress conditions.

## Reproduction Instructions

The suite utilizes [mitata](https://github.com/evanwashere/mitata), a benchmarking engine for JavaScript runtimes.

To run the benchmark suite locally, execute the following command from the project root:

```bash
npm run bench
```

## Interpreting the Results

Under identical benchmarking conditions (both tracking comments and parsing Lua 5.3 rules), `lua-lexer` repeatedly outperforms the tokenization phase of `luaparse`.

| Metric | `lua-lexer` | `luaparse` |
| --- | --- | --- |
| **Execution Time (Avg)** | ~825 - 840 µs/iter | ~1.22 - 1.25 ms/iter |
| **Relative Performance** | **~1.50x Faster (50% boost)** | Baseline (1.0x) |
