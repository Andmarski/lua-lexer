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
import { tokenize } from "lua-lexer"; // adjust based on your actual package name

const code = `
  local function hello()
      print("Hello World!")
  end
`;

const tokens = tokenize(code);
console.log(tokens);
```

### Advanced Usage

For parsing large files or advanced scenarios where you need granular control, you can use the `LuaLexer` class directly:

```typescript
import { LuaLexer, LuaTokenType } from "lua-lexer";

const lexer = new LuaLexer();
lexer.load("print(123)");

// Read token by token
const token = lexer.next();
console.log(token);
```

## License

This project is licensed under the MIT License.
