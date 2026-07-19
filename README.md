# lua-lexer

A fast and lightweight Lua lexer written in TypeScript.

This lexer tokenizes Lua source code into an array of tokens, making it easy to build parsers, formatters, syntax highlighters, or static analysis tools.

## Features
- **TypeScript Support**: Fully typed API with included `.d.ts` files.
- **Fast**: Designed for performance.
- **Universal**: Supports both CommonJS and ES Modules.

## Installation

Install using npm:

```bash
npm install lua-lexer
```

## Basic Usage

```typescript
import { LuaLexer, LuaTokenType } from "lua-lexer"; // adjust based on your actual package name

const code = `
  local function hello()
      print("Hello World!")
  end
`;

const lexer = new LuaLexer();
lexer.load(code);

const tokens = [];
while (true) {
    const token = lexer.next();
    tokens.push(token);
    if (token.type === LuaTokenType.END_OF_FILE) {
        break;
    }
}

console.log(tokens);
```

## License

This project is licensed under the MIT License.
