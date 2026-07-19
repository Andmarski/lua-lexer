# lua-lexer

[![npm version](https://img.shields.io/npm/v/lua-lexer.svg)](https://npmjs.org/package/lua-lexer)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![Zero Dependencies](https://img.shields.io/badge/dependencies-0-brightgreen.svg)](https://npmjs.org/package/lua-lexer)

A fast, zero-dependency, and lightweight Lua lexer written in TypeScript. 

This library is designed solely for tokenizing Lua source code into an array of tokens, making it a solid foundation for building parsers, formatters, syntax highlighters, or static analysis tools without the overhead of building an Abstract Syntax Tree (AST).

## Features

* **High Performance:** Optimized with zero-allocation strategies and tight loops to minimize execution time.
* **Zero Dependencies:** Keeps your dependency tree small and secure.
* **Dual API:** Choose between a standard `tokenize()` function or a Streaming API optimized for large files.
* **Lua 5.3+ Support:** Fully handles modern Lua lexical syntax, including bitwise operators and hexadecimal floats.
* **TypeScript Support:** Includes comprehensive type definitions.


## Installation

Install via npm:

```bash
npm install lua-lexer
```


## Usage

### ES Modules (ESM) / TypeScript

```typescript
import { tokenize, LuaTokenType } from "lua-lexer";

const tokens = tokenize("i = 0");
console.log(JSON.stringify(tokens, null, 2));
```

### CommonJS

```javascript
const { tokenize, LuaTokenType } = require("lua-lexer");

const tokens = tokenize("i = 0");
console.log(JSON.stringify(tokens, null, 2));
```

## Lexer Interface

### 1. The `tokenize` Helper

The standard way to use the library is the `tokenize` function, which processes the entire string and returns an array of `LuaToken` objects:

```typescript
tokenize(code, options?);
```

**Available Options:**
* `skipComments?: boolean` *(default: `false`)*: Skips parsing and yielding comment tokens to save memory and CPU cycles.
* `luaVersion?: "5.1" | "5.2" | "5.3" | "5.4" | "5.5"` *(default: `"5.4"`)*: The specific Lua language version to tokenize against. Determines the availability of version-specific operators, keywords, and escape sequences.

### 2. Streaming / Manual Iteration Interface

A streaming interface is also available. This is preferable when dealing with large files or when building a parser that consumes tokens on-demand.

```typescript
import { LuaLexer, LuaTokenType } from "lua-lexer";

const lexer = new LuaLexer({ skipComments: true });
lexer.load("foo = 'bar'");

let token;
while (true) {
    token = lexer.next();
    if (token.type === LuaTokenType.END_OF_FILE) break;
    console.log(token);
}
```


## Token Format

If the following code is executed:

```typescript
tokenize("i = 0");
```

The returned array will look like:

```js
[
  {
    "type": 60,
    "value": "i",
    "line": 1,
    "column": 1,
    "start": 0,
    "length": 1
  },
  {
    "type": 44,
    "value": undefined,
    "line": 1,
    "column": 3,
    "start": 2,
    "length": 1
  },
  {
    "type": 59,
    "value": 0,
    "line": 1,
    "column": 5,
    "start": 4,
    "length": 1
  },
  {
    "type": 0,
    "line": 1,
    "column": 6,
    "start": 5,
    "length": 0
  }
]
```

### Token Properties:
* **`type`**: Expressed as an enum integer which can be matched with the exported `LuaTokenType` enum (e.g., `60` equals `LuaTokenType.IDENTIFIER`).
* **`value`**: The parsed value of the token (e.g., numeric value for numbers, string values for strings and identifiers).
* **`line`**: The 1-indexed line number where the token starts.
* **`column`**: The 1-indexed column number where the token starts.
* **`start`**: The 0-indexed character offset where the token begins in the raw source string.
* **`length`**: The length of the token in characters. Slicing `code.substring(start, start + length)` will return the raw token string.


## Performance

Below is a benchmark comparing the raw tokenization speed of `lua-lexer` against the tokenization phase of the `luaparse` package.

| Library | Avg Time (Raw Lexing) | Relative Performance |
| :--- | :--- | :--- |
| **lua-lexer** | **~0.83 ms** | **~1.50x Faster** |
| luaparse | ~1.24 ms | Baseline (1.0x) |

> **Note:** For full methodology, reproduction instructions, and details on optimizations like `skipComments`, please read the [Performance Benchmarks](./benchmarks/README.md) documentation.


## Acknowledgements

This project was heavily inspired by the excellent [`luaparse`](https://github.com/fstirlitz/luaparse/) library created by Oskar Schöldström. Ultimately, `lua-lexer` started as a fun experiment with code - a playground to see just how fast and optimized a zero-dependency Lua lexer could be written in TypeScript. 


## License

MIT
