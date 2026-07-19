# Examples

This directory contains example scripts demonstrating how to use `lua-lexer`.

## CLI Colorizer (`colorize.ts`)

A practical example of using `lua-lexer` to build a syntax highlighter for the terminal. It tokenizes a given Lua file and outputs it using ANSI 256 colors that mimic the VS Code Dark+ theme. It showcases advanced lexer usage, including:
* Two-pass tokenization (to identify functions ahead of time).
* Contextual parsing (distinguishing properties, table keys, and function calls).
* Rainbow bracket pairing.

### Usage

You can run the colorizer against any Lua file. We've included a `sample.lua` file for convenience:

```bash
npx tsx colorize.ts sample.lua
```

Or, run it from the root of the project:

```bash
npm run dev
# or
npx tsx examples/colorize.ts examples/sample.lua
```
