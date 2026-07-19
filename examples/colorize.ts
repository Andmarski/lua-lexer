import { LuaLexer, LuaTokenType } from '../source/index';
import * as fs from 'fs';
import * as path from 'path';

const colors = {
    reset: "\x1b[0m",
    blue: "\x1b[38;5;75m",
    purple: "\x1b[38;5;170m",
    orange: "\x1b[38;5;173m",
    lightGreen: "\x1b[38;5;151m",
    darkGreen: "\x1b[38;5;71m",
    lightBlue: "\x1b[38;5;117m",
    lightGray: "\x1b[38;5;252m",
    yellow: "\x1b[38;5;186m",
    celadon: "\x1b[38;5;43m",
    green: "\x1b[38;5;119m",
    beige: "\x1b[38;5;180m",
    bracket1: "\x1b[38;5;220m",
    bracket2: "\x1b[38;5;170m",
    bracket3: "\x1b[38;5;27m",
    red: "\x1b[38;5;196m"
};

const bracketColors = [colors.bracket1, colors.bracket2, colors.bracket3];

const controlFlowKeywords = new Set([
    LuaTokenType.BREAK, LuaTokenType.DO, LuaTokenType.ELSE, 
    LuaTokenType.ELSEIF, LuaTokenType.END, LuaTokenType.FOR, 
    LuaTokenType.GOTO, LuaTokenType.IF, LuaTokenType.IN, 
    LuaTokenType.REPEAT, LuaTokenType.RETURN, LuaTokenType.THEN, 
    LuaTokenType.UNTIL, LuaTokenType.WHILE, LuaTokenType.FUNCTION
]);

function getColorForToken(type: LuaTokenType, prevType?: LuaTokenType, isFunction?: boolean, isTableKey?: boolean, isProperty?: boolean, bracketLevel?: number): string {
    if (type === LuaTokenType.ERROR) return colors.red;
    
    if (type === LuaTokenType.IDENTIFIER && (prevType === LuaTokenType.GOTO || prevType === LuaTokenType.DOUBLE_COLON)) return colors.orange;
    if (type === LuaTokenType.IDENTIFIER && (isTableKey || isProperty)) return colors.celadon;
    if (type === LuaTokenType.IDENTIFIER && isFunction) return colors.yellow;
    if (controlFlowKeywords.has(type)) return colors.purple;
    
    if (type === LuaTokenType.AND || type === LuaTokenType.OR || type === LuaTokenType.NOT) return colors.lightGray;
    if (type >= LuaTokenType.AND && type <= LuaTokenType.WHILE) return colors.blue;
    
    if (type === LuaTokenType.STRING_LITERAL) return colors.orange;
    if (type === LuaTokenType.NUMBER_LITERAL) return colors.lightGreen;
    if (type === LuaTokenType.COMMENT) return colors.darkGreen;
    if (type === LuaTokenType.IDENTIFIER) return colors.lightBlue;
    
    if (bracketLevel !== undefined) return bracketColors[bracketLevel];

    if (type === LuaTokenType.TRIPLE_DOT || type === LuaTokenType.DOUBLE_COLON || type === LuaTokenType.COLON) return colors.blue;
    if (type >= LuaTokenType.PLUS && type <= LuaTokenType.TRIPLE_DOT) return colors.lightGray;
    
    return colors.reset;
}

// ============================================================================
// LUA LEXER CLI COLORIZER
//
// This script tokenizes a Lua file and outputs the result to the console with 
// ANSI 256 colors that mimic the VS Code Dark+ theme (DCDCAA, etc.).
// ============================================================================

const targetFile = process.argv[2];
if (!targetFile) {
    console.error("Usage: npx tsx examples/colorize.ts <path-to-lua-file>");
    process.exit(1);
}

const resolvedPath = path.resolve(targetFile);
if (!fs.existsSync(resolvedPath)) {
    console.error(`File not found: ${resolvedPath}`);
    process.exit(1);
}

const sourceCode = fs.readFileSync(resolvedPath, 'utf8');
const lexer = new LuaLexer({ skipComments: false });
lexer.load(sourceCode);

const allTokens = lexer.tokenizeAll();
const knownFunctions = new Set<string>();

/**
 * Helper to step backwards and find the last token that isn't a comment.
 * Crucial for context-dependent coloring (e.g., properties after dots).
 */
function getPrevSignificantToken(index: number) {
    for (let j = index - 1; j >= 0; j--) {
        if (allTokens[j].type !== LuaTokenType.COMMENT) return allTokens[j];
    }
    return null;
}

/**
 * Helper to step forwards and find the next token that isn't a comment.
 * Crucial for detecting function calls and table keys (e.g., `key =`).
 */
function getNextSignificantToken(index: number) {
    for (let j = index + 1; j < allTokens.length; j++) {
        if (allTokens[j].type !== LuaTokenType.COMMENT) return allTokens[j];
    }
    return null;
}

// ============================================================================
// PASS 1: COLLECT FUNCTIONS
// We iterate through all tokens first to detect all function declarations 
// and function calls. This allows us to colorize function identifiers even 
// when they are passed as variables or defined elsewhere.
// ============================================================================
for (let i = 0; i < allTokens.length; i++) {
    const token = allTokens[i];
    if (token.type === LuaTokenType.IDENTIFIER) {
        const prev = getPrevSignificantToken(i);
        const next = getNextSignificantToken(i);

        const isFunctionDecl = prev && prev.type === LuaTokenType.FUNCTION;
        const isCall = next && (
            next.type === LuaTokenType.LEFT_PAREN ||
            next.type === LuaTokenType.LEFT_BRACE ||
            next.type === LuaTokenType.STRING_LITERAL
        );

        if (isFunctionDecl || isCall) knownFunctions.add(token.value as string);
    }
}

// Track depth specifically for `{ ... }` to know if we are inside a table constructor
let braceDepth = 0;
// Track overall depth for rainbow bracket pair colorization
let totalBracketDepth = 0;
let output = "";
let lastIndex = 0;
let prevType: LuaTokenType | undefined = undefined;

// ============================================================================
// PASS 2: CONTEXTUAL PARSING & COLORIZATION
// Iterate through the tokens again, computing context (e.g., table keys, 
// properties) and applying standard ANSI colors for the console.
// ============================================================================
for (let i = 0; i < allTokens.length; i++) {
    const token = allTokens[i];
    if (token.type === LuaTokenType.END_OF_FILE) break;
    
    let bracketLevelForColor: number | undefined = undefined;

    // Track rainbow bracket depth
    if (token.type === LuaTokenType.LEFT_BRACE || token.type === LuaTokenType.LEFT_PAREN || token.type === LuaTokenType.LEFT_BRACKET) {
        if (token.type === LuaTokenType.LEFT_BRACE) braceDepth++;
        bracketLevelForColor = totalBracketDepth % 3;
        totalBracketDepth++;
    } else if (token.type === LuaTokenType.RIGHT_BRACE || token.type === LuaTokenType.RIGHT_PAREN || token.type === LuaTokenType.RIGHT_BRACKET) {
        if (token.type === LuaTokenType.RIGHT_BRACE) braceDepth--;
        totalBracketDepth--;
        if (totalBracketDepth < 0) totalBracketDepth = 0;
        bracketLevelForColor = totalBracketDepth % 3;
    }
    
    // Append any trailing whitespace between the previous token and this token
    output += sourceCode.substring(lastIndex, token.start);
    const tokenText = sourceCode.substring(token.start, token.start + token.length);
    
    const isFunction = token.type === LuaTokenType.IDENTIFIER && knownFunctions.has(token.value as string);
    let isTableKey = false;
    let isProperty = false;

    // Advanced Identifier Classification
    if (token.type === LuaTokenType.IDENTIFIER) {
        const prev = getPrevSignificantToken(i);
        const next = getNextSignificantToken(i);
        
        // Properties follow a dot (e.g. `table.property`)
        if (prev && prev.type === LuaTokenType.DOT) isProperty = true;
        
        // Table keys are surrounded by `{`, `,`, or `;` and followed by `=` 
        const isPrecededBySeparator = prev && (
            prev.type === LuaTokenType.LEFT_BRACE ||
            prev.type === LuaTokenType.COMMA ||
            prev.type === LuaTokenType.SEMICOLON
        );
        
        if (braceDepth > 0 && isPrecededBySeparator && next && next.type === LuaTokenType.EQUAL) isTableKey = true;
    }
    
    const colorCode = getColorForToken(token.type, prevType, isFunction, isTableKey, isProperty, bracketLevelForColor);
    
    let coloredText = tokenText;
    if (token.type === LuaTokenType.STRING_LITERAL) {
        // Find and highlight Lua escape sequences in strings with a beige color
        const escapeRegex = /\\(?:[abfnrtv\\'"]|z|\d{1,3}|x[0-9a-fA-F]{2}|u\{[0-9a-fA-F]+\})/g;
        coloredText = coloredText.replace(escapeRegex, (match) => `${colors.beige}${match}${colorCode}`);
    }
    
    // Commit the token back into the output stream
    output += `${colorCode}${coloredText}${colors.reset}`;
    
    lastIndex = token.start + token.length;
    prevType = token.type;
}

output += sourceCode.substring(lastIndex);
console.log(output);
