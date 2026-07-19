import { run, bench, group } from "mitata";
import { readFileSync } from "fs";
import { LuaLexer, LuaLexerOptions } from "../source/index";
import * as luaparse from "luaparse";
import { Options as LuaParseOptions } from "luaparse";

declare module "luaparse" {
    export function lex(): any;
}

// Read the test file and replicate it to artificially increase the size (e.g., to ~2500 lines)
const sample = readFileSync(__dirname + "/sample.lua", "utf8");
const heavyCode = Array(50).fill(sample).join("\n"); 

// Ensure luaparse is configured to only lex and not build a heavy AST or scope
const luaparseOptions: Partial<LuaParseOptions> = {
    wait: true, // required for lex() to work
    scope: false,
    locations: false,
    ranges: false,
    comments: true,
    luaVersion: "5.3"
};

const lualexerOptions: LuaLexerOptions = {
    skipComments: false,
    luaVersion: "5.3"
};

console.log(`Starting benchmark (code size: ${heavyCode.length} bytes)...`);

group("Lexing & Parsing (Lua)", () => {
    bench("lua-lexer", () => {
        const lexer = new LuaLexer(lualexerOptions);
        lexer.load(heavyCode);
        while (true) {
            const token = lexer.next();
            if (token.type === 0) break;
        }
    });

    bench("luaparse", () => {
        luaparse.parse(heavyCode, luaparseOptions);
        while (true) {
            const token = luaparse.lex();
            if (token.type === 1) break;
        }
    });
});

run({
    colors: true
}).catch(console.error);
