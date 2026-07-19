const enum CharacterCodes {
    NULL = 0,   // \0 Null character

    TAB = 9,    // \t Horizontal Tab
    LF = 10,    // \n Line Feed
    VT = 11,    // \v Vertical Tab
    FF = 12,    // \f Form Feed
    CR = 13,    // \r Carriage Return
    SPACE = 32, // (space)

    DOUBLE_QUOTE = 34, // "
    SINGLE_QUOTE = 39, // '

    HASH = 35,      // #
    PERCENT = 37,   // %
    AMPERSAND = 38, // &
    ASTERISK = 42,  // *
    PLUS = 43,      // +
    COMMA = 44,     // ,
    MINUS = 45,     // -
    DOT = 46,       // .
    SLASH = 47,     // /
    COLON = 58,     // :
    SEMICOLON = 59, // ;
    LESS = 60,      // <
    EQUAL = 61,     // =
    GREATER = 62,   // >
    CARET = 94,     // ^
    PIPE = 124,     // |
    TILDE = 126,    // ~

    BACKSLASH = 92,  // \
    UNDERSCORE = 95, // _

    LEFT_PAREN = 40,    // (
    RIGHT_PAREN = 41,   // )
    LEFT_BRACKET = 91,  // [
    RIGHT_BRACKET = 93, // ]
    LEFT_BRACE = 123,   // {
    RIGHT_BRACE = 125,  // }

    DIGIT_0 = 48, // 0
    DIGIT_1 = 49, // 1
    DIGIT_2 = 50, // 2
    DIGIT_3 = 51, // 3
    DIGIT_4 = 52, // 4
    DIGIT_5 = 53, // 5
    DIGIT_6 = 54, // 6
    DIGIT_7 = 55, // 7
    DIGIT_8 = 56, // 8
    DIGIT_9 = 57, // 9

    LOWER_A = 97,  // a
    LOWER_B = 98,  // b
    LOWER_C = 99,  // c
    LOWER_D = 100, // d
    LOWER_E = 101, // e
    LOWER_F = 102, // f
    LOWER_G = 103, // g
    LOWER_H = 104, // h
    LOWER_I = 105, // i
    LOWER_J = 106, // j
    LOWER_K = 107, // k
    LOWER_L = 108, // l
    LOWER_M = 109, // m
    LOWER_N = 110, // n
    LOWER_O = 111, // o
    LOWER_P = 112, // p
    LOWER_Q = 113, // q
    LOWER_R = 114, // r
    LOWER_S = 115, // s
    LOWER_T = 116, // t
    LOWER_U = 117, // u
    LOWER_V = 118, // v
    LOWER_W = 119, // w
    LOWER_X = 120, // x
    LOWER_Y = 121, // y
    LOWER_Z = 122, // z

    UPPER_A = 65, // A
    UPPER_B = 66, // B
    UPPER_C = 67, // C
    UPPER_D = 68, // D
    UPPER_E = 69, // E
    UPPER_F = 70, // F
    UPPER_G = 71, // G
    UPPER_H = 72, // H
    UPPER_I = 73, // I
    UPPER_J = 74, // J
    UPPER_K = 75, // K
    UPPER_L = 76, // L
    UPPER_M = 77, // M
    UPPER_N = 78, // N
    UPPER_O = 79, // O
    UPPER_P = 80, // P
    UPPER_Q = 81, // Q
    UPPER_R = 82, // R
    UPPER_S = 83, // S
    UPPER_T = 84, // T
    UPPER_U = 85, // U
    UPPER_V = 86, // V
    UPPER_W = 87, // W
    UPPER_X = 88, // X
    UPPER_Y = 89, // Y
    UPPER_Z = 90, // Z
}

/**
 * Represents the type of a scanned Lua token.
 * Contains values for keywords, operators, literals, and special tokens.
 */
export const enum LuaTokenType {
    // End of File
    END_OF_FILE,

    // Error
    ERROR,

    // Keywords
    AND,        BREAK,      DO,         ELSE,       ELSEIF,     END,
    FALSE,      FOR,        FUNCTION,   GLOBAL,     GOTO,       IF,
    IN,         LOCAL,      NIL,        NOT,        OR,         REPEAT,
    RETURN,     THEN,       TRUE,       UNTIL,      WHILE,

    // Operators and Punctuation
    PLUS,           MINUS,        ASTERISK,     SLASH,          PERCENT,            CARET,          HASH,
    AMPERSAND,      TILDE,        PIPE,         LESS_LESS,      GREATER_GREATER,    DOUBLE_SLASH,
    EQUAL_EQUAL,    TILDE_EQUAL,  LESS_EQUAL,   GREATER_EQUAL,  LESS,               GREATER,        EQUAL,
    LEFT_PAREN,     RIGHT_PAREN,  LEFT_BRACE,   RIGHT_BRACE,    LEFT_BRACKET,       RIGHT_BRACKET,  DOUBLE_COLON,
    SEMICOLON,      COLON,        COMMA,        DOT,            DOUBLE_DOT,         TRIPLE_DOT,

    // Literals
    STRING_LITERAL,   NUMBER_LITERAL,

    // Identifier
    IDENTIFIER,

    // Comment
    COMMENT
}

/**
 * Represents the value extracted from a token.
 * - Strings for identifiers, string literals, and comments.
 * - Numbers for numeric literals.
 * - Booleans for `true` and `false`.
 * - `null` for `nil`.
 * - `undefined` for punctuation and generic keywords.
 */
export type LuaTokenValue = string | number | boolean | null | undefined;

/**
 * Represents a single lexical token emitted by the LuaLexer.
 */
export interface LuaToken {
    /** The categorized type of the token. */
    type: LuaTokenType;
    /** The parsed value of the token (e.g. the actual number, string content). */
    value: LuaTokenValue;
    /** The 1-indexed line number where the token starts. */
    line: number;
    /** The 0-indexed column number where the token starts. */
    column: number;
    /** The 0-indexed absolute string index where the token begins in the source. */
    start: number;
    /** The length of the token in characters. */
    length: number;
}

/**
 * Options to configure the behavior of LuaLexer.
 */
export interface LuaLexerOptions {
    /**
     * If true, the lexer will skip over comments and not emit them as tokens.
     * @default false
     */
    skipComments?: boolean;
    
    /**
     * The specific Lua language version to tokenize against.
     * Determines the availability of certain operators, keywords, and escape sequences.
     * @default "5.4"
     */
    luaVersion?: "5.1" | "5.2" | "5.3" | "5.4" | "5.5";
}

/**
 * A highly optimized lexical analyzer for Lua source code.
 */
export class LuaLexer {
    private raw:       string = "";
    private index:     number = 0;
    private line:      number = 1;
    private lineStart: number = 0;
    public options:   LuaLexerOptions;

    private isLua52Plus: boolean;
    private isLua53Plus: boolean;
    private isLua55Plus: boolean;
    private skipComments: boolean;

    /**
     * Creates a new instance of the LuaLexer.
     * @param options Configuration options for the lexer behavior.
     */
    constructor(options: LuaLexerOptions = {}) {
        this.options = options;
        this.skipComments = options.skipComments === true;
        const version = options.luaVersion || "5.4";
        this.isLua52Plus = version !== "5.1";
        this.isLua53Plus = version !== "5.1" && version !== "5.2";
        this.isLua55Plus = version === "5.5";
    }

    /**
     * Loads a new Lua source string into the lexer and resets its internal state.
     * Appends an internal null-terminator sentinel to safely avoid out-of-bounds checks.
     * @param source The raw Lua source code string to scan.
     */
    load(source: string) {
        this.raw = source + "\0\0\0\0\0\0\0\0"; // add sentinel to prevent out of bounds
        this.index = 0;
        this.line = 1;
        this.lineStart = 0;
    }

    tokenizeAll(): LuaToken[] {
        const tokens: LuaToken[] = [];
        while (true) {
            const token = this.next();
            tokens.push(token);
            if (token.type === LuaTokenType.END_OF_FILE) {
                break;
            }
        }
        return tokens;
    }


    private yieldToken(type: LuaTokenType, value: LuaTokenValue, length: number): LuaToken {
        const token = {
            type,
            value,
            line: this.line,
            column: this.index - this.lineStart + 1,
            start: this.index,
            length
        }

        this.index += length;
        this.lineStart += length;

        return token;
    }

    /**
     * Scans and returns the next lexical token from the loaded source code.
     * This method automatically skips whitespaces. 
     * If the end of the file is reached, it yields an `END_OF_FILE` token.
     * @returns The parsed LuaToken.
     */
    next(): LuaToken {
        const raw = this.raw;

        let index = this.index;
        let line = this.line;
        let lineStart = this.lineStart;

        while (true) {
            const code = raw.charCodeAt(index);
            switch (code) {
                case CharacterCodes.NULL: {
                    this.index = index;
                    this.line = line;
                    this.lineStart = lineStart;
                    return this.yieldToken(LuaTokenType.END_OF_FILE, undefined, 0);
                }

                // whitespace
                case CharacterCodes.TAB:
                case CharacterCodes.VT:
                case CharacterCodes.FF:
                case CharacterCodes.SPACE: {
                    index++;
                    continue;
                }

                // new line (\r), new line (\r\n)
                case CharacterCodes.CR: {
                    if (raw.charCodeAt(index + 1) === CharacterCodes.LF) {
                        index += 2;
                    } else {
                        index++;
                    }
                    line++;
                    lineStart = index;
                    continue;
                }

                // new line (\n), new line (\n\r)
                case CharacterCodes.LF: {
                    if (raw.charCodeAt(index + 1) === CharacterCodes.CR) {
                        index += 2;
                    } else {
                        index++;
                    }
                    line++;
                    lineStart = index;
                    continue;
                }

                case CharacterCodes.UNDERSCORE: {
                    this.index = index;
                    this.line = line;
                    this.lineStart = lineStart;
                    return this.readIdentifierOrKeyword();
                }

                // string literal
                case CharacterCodes.DOUBLE_QUOTE:
                case CharacterCodes.SINGLE_QUOTE: {
                    this.index = index;
                    this.line = line;
                    this.lineStart = lineStart;
                    return this.readShortStringLiteral(code);
                }

                // number literal
                case CharacterCodes.DIGIT_0: {
                    this.index = index;
                    this.line = line;
                    this.lineStart = lineStart;
                    
                    const next = raw.charCodeAt(index + 1);
                    if (next === CharacterCodes.LOWER_X || next === CharacterCodes.UPPER_X) {
                        return this.readHexadecimalLiteral();
                    }
                    return this.readDecimalLiteral();
                }

                case CharacterCodes.DIGIT_1:
                case CharacterCodes.DIGIT_2:
                case CharacterCodes.DIGIT_3:
                case CharacterCodes.DIGIT_4:
                case CharacterCodes.DIGIT_5:
                case CharacterCodes.DIGIT_6:
                case CharacterCodes.DIGIT_7:
                case CharacterCodes.DIGIT_8:
                case CharacterCodes.DIGIT_9: {
                    this.index = index;
                    this.line = line;
                    this.lineStart = lineStart;
                    return this.readDecimalLiteral();
                }

                // punctator (.), number literal (.1), operator (..), operator (...)
                case CharacterCodes.DOT: {
                    this.index = index;
                    this.line = line;
                    this.lineStart = lineStart;

                    const second = raw.charCodeAt(index + 1);
                    if (second === CharacterCodes.DOT) {
                        if (raw.charCodeAt(index + 2) === CharacterCodes.DOT) { // operator (...)
                            return this.yieldToken(LuaTokenType.TRIPLE_DOT, undefined, 3);
                        } else { // operator (..)
                            return this.yieldToken(LuaTokenType.DOUBLE_DOT, undefined, 2);
                        }
                    } else if (((second - CharacterCodes.DIGIT_0) >>> 0) <= 9) { // number literal starting with a dot (e.g. .5)
                        return this.readDecimalLiteral();
                    } else {
                        return this.yieldToken(LuaTokenType.DOT, undefined, 1);
                    }
                }

                // operator (/), operator (//)
                case CharacterCodes.SLASH: {
                    this.index = index;
                    this.line = line;
                    this.lineStart = lineStart;

                    if (raw.charCodeAt(index + 1) === CharacterCodes.SLASH) { // operator (//)
                        if (!this.isLua53Plus) return this.yieldToken(LuaTokenType.SLASH, undefined, 1);
                        return this.yieldToken(LuaTokenType.DOUBLE_SLASH, undefined, 2);
                    } else { // operator (/)
                        return this.yieldToken(LuaTokenType.SLASH, undefined, 1);
                    }
                }

                // operator (~), operator (~=)
                case CharacterCodes.TILDE: {
                    this.index = index;
                    this.line = line;
                    this.lineStart = lineStart;

                    if (raw.charCodeAt(index + 1) === CharacterCodes.EQUAL) { // operator (~=)
                        return this.yieldToken(LuaTokenType.TILDE_EQUAL, undefined, 2);
                    } else { // operator (~)
                        if (!this.isLua53Plus) return this.yieldToken(LuaTokenType.ERROR, "unexpected symbol '~'", 1);
                        return this.yieldToken(LuaTokenType.TILDE, undefined, 1);
                    }
                }

                // operator (=), operator (==)
                case CharacterCodes.EQUAL: {
                    this.index = index;
                    this.line = line;
                    this.lineStart = lineStart;

                    if (raw.charCodeAt(index + 1) === CharacterCodes.EQUAL) { // operator (==)
                        return this.yieldToken(LuaTokenType.EQUAL_EQUAL, undefined, 2);
                    } else { // operator (=)
                        return this.yieldToken(LuaTokenType.EQUAL, undefined, 1);
                    }
                }

                // punctator (:), punctator (::)
                case CharacterCodes.COLON: {
                    this.index = index;
                    this.line = line;
                    this.lineStart = lineStart;

                    if (raw.charCodeAt(index + 1) === CharacterCodes.COLON) { // punctator (::)
                        if (!this.isLua52Plus) return this.yieldToken(LuaTokenType.COLON, undefined, 1);
                        return this.yieldToken(LuaTokenType.DOUBLE_COLON, undefined, 2);
                    } else { // punctator (:)
                        return this.yieldToken(LuaTokenType.COLON, undefined, 1);
                    }
                }

                // operator (<), operator (<<), operator (<=)
                case CharacterCodes.LESS: {
                    this.index = index;
                    this.line = line;
                    this.lineStart = lineStart;

                    const second = raw.charCodeAt(index + 1);
                    if (second === CharacterCodes.LESS) {
                        if (!this.isLua53Plus) return this.yieldToken(LuaTokenType.LESS, undefined, 1);
                        return this.yieldToken(LuaTokenType.LESS_LESS, undefined, 2);
                    } else if (second === CharacterCodes.EQUAL) {
                        return this.yieldToken(LuaTokenType.LESS_EQUAL, undefined, 2);
                    } else {
                        return this.yieldToken(LuaTokenType.LESS, undefined, 1);
                    }
                }

                // operator (>), operator (>>), operator (>=)
                case CharacterCodes.GREATER: {
                    this.index = index;
                    this.line = line;
                    this.lineStart = lineStart;

                    const second = raw.charCodeAt(index + 1);
                    if (second === CharacterCodes.GREATER) {
                        if (!this.isLua53Plus) return this.yieldToken(LuaTokenType.GREATER, undefined, 1);
                        return this.yieldToken(LuaTokenType.GREATER_GREATER, undefined, 2);
                    } else if (second === CharacterCodes.EQUAL) {
                        return this.yieldToken(LuaTokenType.GREATER_EQUAL, undefined, 2);
                    } else {
                        return this.yieldToken(LuaTokenType.GREATER, undefined, 1);
                    }
                }

                // punctator ([]), multiline string ([=[ ]=])
                case CharacterCodes.LEFT_BRACKET: {
                    this.index = index;
                    this.line = line;
                    this.lineStart = lineStart;

                    let cursor = index + 1;
                    let level = 0;

                    while (raw.charCodeAt(cursor) === CharacterCodes.EQUAL) {
                        level++;
                        cursor++;
                    }

                    if (raw.charCodeAt(cursor) === CharacterCodes.LEFT_BRACKET) { // multiline string ([=[ ]=])
                        return this.readLongStringLiteralOrComment(level, false)!;
                    } else { // punctator ([])
                        return this.yieldToken(LuaTokenType.LEFT_BRACKET, undefined, 1);
                    }
                }

                // operator (-), inline comment (--), multiline comment (--[=[ ]=])
                case CharacterCodes.MINUS: {
                    this.index = index;
                    this.line = line;
                    this.lineStart = lineStart;

                    // operator (-)
                    if (raw.charCodeAt(index + 1) !== CharacterCodes.MINUS) {
                        return this.yieldToken(LuaTokenType.MINUS, undefined, 1);
                    }

                    // is multiline comment (--[=[ ... ]=])
                    if (raw.charCodeAt(index + 2) === CharacterCodes.LEFT_BRACKET) {
                        let cursor = index + 3;
                        let level = 0;

                        while (raw.charCodeAt(cursor) === CharacterCodes.EQUAL) {
                            level++;
                            cursor++;
                        }

                        // multiline comment found
                        if (raw.charCodeAt(cursor) === CharacterCodes.LEFT_BRACKET) {
                            const token = this.readLongStringLiteralOrComment(level, true);
                            if (token) return token;
                            
                            index = this.index;
                            line = this.line;
                            lineStart = this.lineStart;
                            continue;
                        }
                    }

                    // inline comment (-- ...)
                    let cursor = index + 2;
                    while (cursor < raw.length) {
                        const character = raw.charCodeAt(cursor);
                        if (character === CharacterCodes.CR || character === CharacterCodes.LF) break;
                        cursor++;
                    }

                    if (this.skipComments) {
                        this.index = cursor;
                        index = cursor;
                        continue;
                    }

                    return this.yieldToken(LuaTokenType.COMMENT, raw.substring(index + 2, cursor), cursor - index);
                }

                // single character operator or punctuator
                case CharacterCodes.PLUS: {
                    this.index = index;
                    this.line = line;
                    this.lineStart = lineStart;
                    return this.yieldToken(LuaTokenType.PLUS, undefined, 1);
                }

                case CharacterCodes.ASTERISK: {
                    this.index = index;
                    this.line = line;
                    this.lineStart = lineStart;
                    return this.yieldToken(LuaTokenType.ASTERISK, undefined, 1);
                }

                case CharacterCodes.PERCENT: {
                    this.index = index;
                    this.line = line;
                    this.lineStart = lineStart;
                    return this.yieldToken(LuaTokenType.PERCENT, undefined, 1);
                }

                case CharacterCodes.CARET: {
                    this.index = index;
                    this.line = line;
                    this.lineStart = lineStart;
                    return this.yieldToken(LuaTokenType.CARET, undefined, 1);
                }

                case CharacterCodes.HASH: {
                    this.index = index;
                    this.line = line;
                    this.lineStart = lineStart;
                    return this.yieldToken(LuaTokenType.HASH, undefined, 1);
                }

                case CharacterCodes.AMPERSAND: {
                    this.index = index;
                    this.line = line;
                    this.lineStart = lineStart;
                    if (!this.isLua53Plus) return this.yieldToken(LuaTokenType.ERROR, "unexpected symbol '&'", 1);
                    return this.yieldToken(LuaTokenType.AMPERSAND, undefined, 1);
                }

                case CharacterCodes.PIPE: {
                    this.index = index;
                    this.line = line;
                    this.lineStart = lineStart;
                    if (!this.isLua53Plus) return this.yieldToken(LuaTokenType.ERROR, "unexpected symbol '|'", 1);
                    return this.yieldToken(LuaTokenType.PIPE, undefined, 1);
                }

                case CharacterCodes.LEFT_PAREN: {
                    this.index = index;
                    this.line = line;
                    this.lineStart = lineStart;
                    return this.yieldToken(LuaTokenType.LEFT_PAREN, undefined, 1);
                }

                case CharacterCodes.RIGHT_PAREN: {
                    this.index = index;
                    this.line = line;
                    this.lineStart = lineStart;
                    return this.yieldToken(LuaTokenType.RIGHT_PAREN, undefined, 1);
                }

                case CharacterCodes.LEFT_BRACE: {
                    this.index = index;
                    this.line = line;
                    this.lineStart = lineStart;
                    return this.yieldToken(LuaTokenType.LEFT_BRACE, undefined, 1);
                }

                case CharacterCodes.RIGHT_BRACE: {
                    this.index = index;
                    this.line = line;
                    this.lineStart = lineStart;
                    return this.yieldToken(LuaTokenType.RIGHT_BRACE, undefined, 1);
                }

                case CharacterCodes.RIGHT_BRACKET: {
                    this.index = index;
                    this.line = line;
                    this.lineStart = lineStart;
                    return this.yieldToken(LuaTokenType.RIGHT_BRACKET, undefined, 1);
                }

                case CharacterCodes.SEMICOLON: {
                    this.index = index;
                    this.line = line;
                    this.lineStart = lineStart;
                    return this.yieldToken(LuaTokenType.SEMICOLON, undefined, 1);
                }

                case CharacterCodes.COMMA: {
                    this.index = index;
                    this.line = line;
                    this.lineStart = lineStart;
                    return this.yieldToken(LuaTokenType.COMMA, undefined, 1);
                }

                default: {
                    if ((((code | 32) - CharacterCodes.LOWER_A) >>> 0) <= 25) {
                        this.index = index;
                        this.line = line;
                        this.lineStart = lineStart;
                        return this.readIdentifierOrKeyword();
                    }

                    index++;
                    continue;
                }
            }
        }
    }

    private readDecimalLiteral(): LuaToken {
        const raw = this.raw;
        const index = this.index;
        let cursor = index + 1;

        let value = 0;
        let fraction = 0;
        let divisor = 1;
        let exponent = 0;
        let exponentSign = 1;

        let hasError = false;

        // first character is dot, only fractional part is considered
        if (raw.charCodeAt(index) === CharacterCodes.DOT) {
            let hasDigits = false;

            while (true) {
                const digit = raw.charCodeAt(cursor) - CharacterCodes.DIGIT_0;
                if (digit >>> 0 > 9) break;

                hasDigits = true;
                fraction = fraction * 10 + digit;
                divisor *= 10;
                cursor++;
            }

            // if we haven't seen any digits at this point, it's a malformed number
            if (!hasDigits) hasError = true; 
        }

        // first character is a digit, parse integer part and optional fraction part
        else {
            value = raw.charCodeAt(index) - CharacterCodes.DIGIT_0;

            while (true) {
                const digit = raw.charCodeAt(cursor) - CharacterCodes.DIGIT_0;
                if (digit >>> 0 > 9) break;
                
                value = value * 10 + digit;
                cursor++;
            }

            if (raw.charCodeAt(cursor) === CharacterCodes.DOT) {
                cursor++;

                while (true) {
                    const digit = raw.charCodeAt(cursor) - CharacterCodes.DIGIT_0;
                    if (digit >>> 0 > 9) break;

                    fraction = fraction * 10 + digit;
                    divisor *= 10;
                    cursor++;
                }
            }
        }

        // match exponent part if it exists
        if (!hasError && (raw.charCodeAt(cursor) | 32) === CharacterCodes.LOWER_E) {
            cursor++;

            const sign = raw.charCodeAt(cursor);
            if (sign === CharacterCodes.PLUS) {
                cursor++;
            } else if (sign === CharacterCodes.MINUS) {
                exponentSign = -1;
                cursor++;
            }

            let hasDigits = false;
            while (true) {
                const digit = raw.charCodeAt(cursor) - CharacterCodes.DIGIT_0;
                if (digit >>> 0 > 9) break;

                hasDigits = true;
                exponent = exponent * 10 + digit;
                cursor++;
            }

            // exponent part must have at least one digit
            if (!hasDigits) hasError = true; 
        }

        // malformed number recovery
        while (true) {
            const next = raw.charCodeAt(cursor);
            if (
                next === CharacterCodes.DOT ||
                ((next | 32) - CharacterCodes.LOWER_A) >>> 0 <= 25 ||
                (next - CharacterCodes.DIGIT_0) >>> 0 <= 9 ||        
                next === CharacterCodes.UNDERSCORE
            ) { 
                hasError = true;
                cursor++;
            } else {
                break;
            }
        }

        if (hasError) return this.yieldToken(LuaTokenType.ERROR, `Malformed number: ${raw.substring(index, cursor)}`, cursor - index);
        
        if (fraction > 0) value += fraction / divisor;
        if (exponent !== 0) value *= (10 ** (exponentSign * exponent)); // 10** jest nieco szybsze niż Math.pow

        return this.yieldToken(LuaTokenType.NUMBER_LITERAL, value, cursor - index);
    }

    private readHexadecimalLiteral(): LuaToken {
        const raw = this.raw;
        const index = this.index;
        let cursor = index + 2; // skip 0x or 0X

        let value = 0;
        let fraction = 0;
        let divisor = 1;
        let exponent = 0;
        let exponentSign = 1;

        let hasError = false;

        // first character is dot, only fractional part is considered
        if (raw.charCodeAt(cursor) === CharacterCodes.DOT) {
            if (!this.isLua52Plus) hasError = true;
            cursor++;
            let hasDigits = false;

            while (true) {
                const digit = raw.charCodeAt(cursor);

                const decimal = digit - CharacterCodes.DIGIT_0;
                const hexadecimal = (digit | 32) - CharacterCodes.LOWER_A;

                if (decimal >>> 0 <= 9) {
                    fraction = fraction * 16 + decimal;
                } else if (hexadecimal >>> 0 <= 5) {
                    fraction = fraction * 16 + hexadecimal + 10;
                } else {
                    break;
                }

                divisor *= 16;
                hasDigits = true;
                cursor++;
            }

            // if we haven't seen any digits at this point, it's a malformed number
            if (!hasDigits) hasError = true; 
        }

        // first character is a digit, parse integer part and optional fraction part
        else {
            let hasDigits = false;

            while (true) {
                const digit = raw.charCodeAt(cursor);
                const decimal = digit - CharacterCodes.DIGIT_0;
                const hexadecimal = (digit | 32) - CharacterCodes.LOWER_A;

                if (decimal >>> 0 <= 9) {
                    value = value * 16 + decimal;
                } else if (hexadecimal >>> 0 <= 5) {
                    value = value * 16 + hexadecimal + 10;
                } else {
                    break;
                }
                
                hasDigits = true;
                cursor++;
            }

            if (raw.charCodeAt(cursor) === CharacterCodes.DOT) {
                if (!this.isLua52Plus) hasError = true;
                cursor++;

                while (true) {
                    const digit = raw.charCodeAt(cursor);

                    const decimal = digit - CharacterCodes.DIGIT_0;
                    const hexadecimal = (digit | 32) - CharacterCodes.LOWER_A;

                    if (decimal >>> 0 <= 9) {
                        fraction = fraction * 16 + decimal;
                    } else if (hexadecimal >>> 0 <= 5) {
                        fraction = fraction * 16 + hexadecimal + 10;
                    } else {
                        break;
                    }

                    hasDigits = true;
                    divisor *= 16;
                    cursor++;
                }
            }

            if (!hasDigits) hasError = true;
        }

        // match exponent part if it exists
        if (!hasError && (raw.charCodeAt(cursor) | 32) === CharacterCodes.LOWER_P) {
            if (!this.isLua52Plus) hasError = true;
            cursor++;

            const sign = raw.charCodeAt(cursor);
            if (sign === CharacterCodes.PLUS) {
                cursor++;
            } else if (sign === CharacterCodes.MINUS) {
                exponentSign = -1;
                cursor++;
            }

            let hasDigits = false;
            while (true) {
                const digit = raw.charCodeAt(cursor) - CharacterCodes.DIGIT_0;
                if (digit >>> 0 > 9) break;

                hasDigits = true;
                exponent = exponent * 10 + digit;
                cursor++;
            }

            // exponent part must have at least one digit
            if (!hasDigits) hasError = true; 
        }

        // malformed number recovery
        while (true) {
            const next = raw.charCodeAt(cursor);
            if (
                next === CharacterCodes.DOT ||
                ((next | 32) - CharacterCodes.LOWER_A) >>> 0 <= 25 ||
                (next - CharacterCodes.DIGIT_0 >>> 0 <= 9) ||        
                next === CharacterCodes.UNDERSCORE
            ) { 
                hasError = true;
                cursor++;
            } else {
                break;
            }
        }

        if (hasError) return this.yieldToken(LuaTokenType.ERROR, `Malformed number: ${raw.substring(index, cursor)}`, cursor - index);
        
        if (fraction > 0) value += fraction / divisor;
        if (exponent !== 0) value *= (2 ** (exponentSign * exponent)); // 10** jest nieco szybsze niż Math.pow

        return this.yieldToken(LuaTokenType.NUMBER_LITERAL, value, cursor - index);
    }

    private readShortStringLiteral(quoteCode: number): LuaToken {
        const raw = this.raw;
        const index = this.index;
        let cursor = index + 1;
        let chunkStart = cursor;

        let value = "";
        let localLine = this.line;
        let localLineStart = this.lineStart;
        let hasError = false;
        let errorMessage = "unfinished string";

        while (true) {

            // fast loop without escape handling
            while (true) {
                const code = raw.charCodeAt(cursor);

                // End of string
                if (code === quoteCode) {
                    value += raw.substring(chunkStart, cursor);

                    // String closed, add token and return
                    this.line = localLine;
                    this.lineStart = localLineStart;
                    return this.yieldToken(LuaTokenType.STRING_LITERAL, value, cursor - index + 1);
                }

                // Break to handle escape sequences
                if (code === CharacterCodes.BACKSLASH) {
                    value += raw.substring(chunkStart, cursor);
                    break;
                }

                if (code === CharacterCodes.CR || code === CharacterCodes.LF || code === CharacterCodes.NULL) {
                    hasError = true;
                    errorMessage = "unfinished string";
                    break;
                }

                cursor++;
            }

            if (hasError) break;

            cursor++; // skip backslash
            const escape = raw.charCodeAt(cursor);

            switch (escape) {
                case CharacterCodes.LOWER_A:      value += '\x07'; cursor++; break;
                case CharacterCodes.LOWER_B:      value += '\b';   cursor++; break;
                case CharacterCodes.LOWER_F:      value += '\f';   cursor++; break;
                case CharacterCodes.LOWER_N:      value += '\n';   cursor++; break;
                case CharacterCodes.LOWER_R:      value += '\r';   cursor++; break;
                case CharacterCodes.LOWER_T:      value += '\t';   cursor++; break;
                case CharacterCodes.LOWER_V:      value += '\v';   cursor++; break;
                case CharacterCodes.DOUBLE_QUOTE: value += '\"';   cursor++; break;
                case CharacterCodes.SINGLE_QUOTE: value += '\'';   cursor++; break;
                case CharacterCodes.BACKSLASH:    value += '\\';   cursor++; break;

                case CharacterCodes.CR: {
                    value += '\n';
                    if (raw.charCodeAt(cursor + 1) === CharacterCodes.LF) {
                        cursor += 2;
                    } else {
                        cursor++;
                    }
                    localLine++;
                    localLineStart = cursor;
                    break;
                }

                case CharacterCodes.LF: {
                    value += '\n';
                    if (raw.charCodeAt(cursor + 1) === CharacterCodes.CR) {
                        cursor += 2;
                    } else {
                        cursor++;
                    }
                    localLine++;
                    localLineStart = cursor;
                    break;
                }

                // \xXX 
                case CharacterCodes.LOWER_X: {
                    if (!this.isLua52Plus) {
                        hasError = true;
                        errorMessage = "invalid escape sequence";
                        cursor++;
                        break;
                    }
                    cursor++;
                    let code = 0;
                    
                    // first hexadecimal digit
                    let digit = raw.charCodeAt(cursor);
                    let decimal = digit - CharacterCodes.DIGIT_0;
                    let hexadecimal = (digit | 32) - CharacterCodes.LOWER_A;
                    if (decimal >>> 0 <= 9) {
                        code = decimal;
                    } else if (hexadecimal >>> 0 <= 5) {
                        code = hexadecimal + 10;
                    } else { 
                        hasError = true;
                        errorMessage = "hexadecimal digit expected";
                        break;
                    }
                    cursor++;

                    // second hexadecimal digit
                    digit = raw.charCodeAt(cursor);
                    decimal = digit - CharacterCodes.DIGIT_0;
                    hexadecimal = (digit | 32) - CharacterCodes.LOWER_A;
                    if (decimal >>> 0 <= 9) {
                        code = code * 16 + decimal;
                    } else if (hexadecimal >>> 0 <= 5) {
                        code = code * 16 + hexadecimal + 10;
                    } else { 
                        hasError = true;
                        errorMessage = "hexadecimal digit expected";
                        break;
                    }
                    cursor++;

                    value += String.fromCharCode(code);
                    break;
                }

                // Obsługa \u{XXX}
                case CharacterCodes.LOWER_U: {
                    if (!this.isLua53Plus) {
                        hasError = true;
                        errorMessage = "invalid escape sequence";
                        cursor++;
                        break;
                    }
                    cursor++; // skip 'u'

                    if (raw.charCodeAt(cursor) !== CharacterCodes.LEFT_BRACE) {
                        hasError = true;
                        errorMessage = "missing '{'";
                        break;
                    }
                    cursor++; // skip '{'
                    
                    let code = 0;
                    let hasDigits = false;

                    while (true) {
                        const digit = raw.charCodeAt(cursor);
                        const decimal = digit - CharacterCodes.DIGIT_0;
                        const hexadecimal = (digit | 32) - CharacterCodes.LOWER_A;

                        if (decimal >>> 0 <= 9) { // 0-9
                            code = code * 16 + decimal;
                        } else if (hexadecimal >>> 0 <= 5) { // a-f or A-F
                            code = code * 16 + hexadecimal + 10;
                        } else {
                            break;
                        } 

                        hasDigits = true;
                        cursor++;
                    }

                    // there must be at least one hexadecimal digit
                    if (!hasDigits) { 
                        hasError = true;
                        errorMessage = "hexadecimal digit expected";
                        break; 
                    } 

                    // check for closing brace
                    if (raw.charCodeAt(cursor) !== CharacterCodes.RIGHT_BRACE) { 
                        hasError = true;
                        errorMessage = "missing '}'";
                        break; 
                    }
                    cursor++;

                    // Unicode code point must be at most 0x10FFFF
                    if (code > 0x10ffff) { 
                        hasError = true;
                        errorMessage = "UTF-8 value too large";
                        break; 
                    }
                    
                    value += String.fromCodePoint(code);
                    break;
                }

                // Obsługa \z (Płaskie połykanie białych znaków)
                case CharacterCodes.LOWER_Z: {
                    if (!this.isLua52Plus) {
                        hasError = true;
                        errorMessage = "invalid escape sequence";
                        cursor++;
                        break;
                    }
                    cursor++;

                    while (true) {
                        const whitespaces = raw.charCodeAt(cursor);

                        if (whitespaces === CharacterCodes.SPACE || whitespaces === CharacterCodes.TAB || whitespaces === CharacterCodes.VT || whitespaces === CharacterCodes.FF) {
                            cursor++;
                        } else if (whitespaces === CharacterCodes.CR) {
                            if (raw.charCodeAt(cursor + 1) === CharacterCodes.LF) {
                                cursor += 2;
                            } else {
                                cursor++;
                            }
                            localLine++;
                            localLineStart = cursor;
                        } else if (whitespaces === CharacterCodes.LF) {
                            if (raw.charCodeAt(cursor + 1) === CharacterCodes.CR) {
                                cursor += 2;
                            } else {
                                cursor++;
                            }
                            localLine++;
                            localLineStart = cursor;
                        } else {
                            break;
                        }
                    }

                    break;
                }

                // \ddd - decimal escape (up to 3 digits)
                default: {
                    let digit = escape - CharacterCodes.DIGIT_0;
                    if (digit >>> 0 <= 9) {
                        let code = digit;
                        cursor++;
                        
                        // optional second
                        digit = raw.charCodeAt(cursor) - CharacterCodes.DIGIT_0;
                        if (digit >>> 0 <= 9) {
                            code = code * 10 + digit;
                            cursor++;
                            
                            // optional third
                            digit = raw.charCodeAt(cursor) - CharacterCodes.DIGIT_0;
                            if (digit >>> 0 <= 9) {
                                code = code * 10 + digit;
                                cursor++;
                            }
                        }

                        if (code > 255) {
                            hasError = true;
                            errorMessage = "decimal escape too large";
                        } else {
                            value += String.fromCharCode(code);
                        }

                    } else if (escape === 0) {
                        hasError = true;
                        errorMessage = "unfinished string";
                    } else {
                        hasError = true;
                        errorMessage = "invalid escape sequence";
                        cursor++;
                    }
                    break;
                }
            }

            if (hasError) break;
            
            chunkStart = cursor;
        }

        while (true) {
            const code = raw.charCodeAt(cursor);
            if (code === quoteCode) {
                cursor++;
                break;
            }
            else if (code === CharacterCodes.CR || code === CharacterCodes.LF || code === CharacterCodes.BACKSLASH) {
                break; // Przerwane na końcach linii żeby błędny token nie pożarł pół pliku
            }
            cursor++;
        }

        this.line = localLine;
        this.lineStart = localLineStart;
        return this.yieldToken(LuaTokenType.ERROR, errorMessage, cursor - index);
    }

    private readLongStringLiteralOrComment(level: number, isComment: boolean): LuaToken | null {
        const raw = this.raw;
        const index = this.index;

        let offset;
        if (isComment) {  // --[=*[
            offset = 4 + level;
        } else { // [=*[
            offset = 2 + level;
        }

        let cursor = index + offset;
        
        let localLine = this.line;
        let localLineStart = this.lineStart;


        // skip first newline
        const first = raw.charCodeAt(cursor);
        if (first === CharacterCodes.CR) {
            if (raw.charCodeAt(cursor + 1) === CharacterCodes.LF) {
                cursor += 2;
            } else {
                cursor++;
            }
            localLine++;
            localLineStart = cursor;
        } else if (first === CharacterCodes.LF) {
            if (raw.charCodeAt(cursor + 1) === CharacterCodes.CR) {
                cursor += 2;
            } else {
                cursor++;
            }
            localLine++;
            localLineStart = cursor;
        }

        let chunkStart = cursor;
        let value = "";
        let isClosed = false;

        while (true) {
            const code = raw.charCodeAt(cursor);
            
            // 1. Złączona obsługa nowych linii (lepsze przewidywanie rozgałęzień / branch prediction)
            if (code === CharacterCodes.CR) {
                if (!isComment || !this.skipComments) {
                    if (cursor > chunkStart) value += raw.substring(chunkStart, cursor);
                    value += '\n'; 
                }
                
                if (raw.charCodeAt(cursor + 1) === CharacterCodes.LF) {
                    cursor += 2;
                } else {
                    cursor++;
                }

                localLine++;
                localLineStart = cursor;
                chunkStart = cursor;
                continue;
            } else if (code === CharacterCodes.LF) {
                if (!isComment || !this.skipComments) {
                    if (cursor > chunkStart) value += raw.substring(chunkStart, cursor);
                    value += '\n'; 
                }
                
                if (raw.charCodeAt(cursor + 1) === CharacterCodes.CR) {
                    cursor += 2;
                } else {
                    cursor++;
                }

                localLine++;
                localLineStart = cursor;
                chunkStart = cursor;
                continue;
            } else if (code === CharacterCodes.RIGHT_BRACKET) {
                let equals = 0;
                
                // lookahead to check for the correct number of '=' characters
                while (raw.charCodeAt(cursor + 1 + equals) === CharacterCodes.EQUAL) {
                    equals++;
                }

                // check if we have the correct closing delimiter
                if (equals === level && raw.charCodeAt(cursor + 1 + equals) === CharacterCodes.RIGHT_BRACKET) {
                    if (!isComment || !this.skipComments) {
                        if (cursor > chunkStart) value += raw.substring(chunkStart, cursor);
                    }

                    cursor += 2 + equals; // skip ]=*]
                    isClosed = true;
                    break;
                }
            } else if (code === 0) {
                break;
            }

            // regular character, just continue
            cursor++;
        }

        // error recovery
        let token: LuaToken | null = null;
        if (!isClosed) {
            if (!isComment || !this.skipComments) {
                if (cursor > chunkStart) value += raw.substring(chunkStart, cursor);
            }
            token = this.yieldToken(LuaTokenType.ERROR, isComment ? "unfinished long comment" : "unfinished long string", cursor - index);
        } else {
            if (isComment && this.skipComments) {
                this.index = cursor;
            } else {
                token = this.yieldToken(isComment ? LuaTokenType.COMMENT : LuaTokenType.STRING_LITERAL, value, cursor - index);
            }
        }

        this.line = localLine;
        this.lineStart = localLineStart;
        return token;
    }

    private readIdentifierOrKeyword(): LuaToken {
        const raw = this.raw;
        const index = this.index;
        let cursor = index + 1; // first character is already confirmed to be an identifier start, so we can skip it

        while (true) {
            const code = raw.charCodeAt(cursor);

            if (((code | 32) - CharacterCodes.LOWER_A) >>> 0 <= 25 || (code - CharacterCodes.DIGIT_0) >>> 0 <= 9 || code === CharacterCodes.UNDERSCORE) {
                cursor++;
            } else {
                break;
            }
        }

        const length = cursor - index;
        const value = raw.substring(index, cursor);

        if (length === 2) {
            if (value === "do") return this.yieldToken(LuaTokenType.DO, undefined, 2);
            else if (value === "if") return this.yieldToken(LuaTokenType.IF, undefined, 2);
            else if (value === "in") return this.yieldToken(LuaTokenType.IN, undefined, 2);
            else if (value === "or") return this.yieldToken(LuaTokenType.OR, undefined, 2);
            else return this.yieldToken(LuaTokenType.IDENTIFIER, value, length);
        } else if (length === 3) {
            if (value === "and") return this.yieldToken(LuaTokenType.AND, undefined, 3);
            else if (value === "end") return this.yieldToken(LuaTokenType.END, undefined, 3);
            else if (value === "for") return this.yieldToken(LuaTokenType.FOR, undefined, 3);
            else if (value === "not") return this.yieldToken(LuaTokenType.NOT, undefined, 3);
            else if (value === "nil") return this.yieldToken(LuaTokenType.NIL, null, 3);
            else return this.yieldToken(LuaTokenType.IDENTIFIER, value, length);
        } else if (length === 4) {
            if (value === "else") return this.yieldToken(LuaTokenType.ELSE, undefined, 4);
            else if (value === "goto") {
                if (!this.isLua52Plus) return this.yieldToken(LuaTokenType.IDENTIFIER, value, 4);
                return this.yieldToken(LuaTokenType.GOTO, undefined, 4);
            }
            else if (value === "then") return this.yieldToken(LuaTokenType.THEN, undefined, 4);
            else if (value === "true") return this.yieldToken(LuaTokenType.TRUE, true, 4);
            else return this.yieldToken(LuaTokenType.IDENTIFIER, value, length);
        } else if (length === 5) {
            if (value === "break") return this.yieldToken(LuaTokenType.BREAK, undefined, 5);
            else if (value === "local") return this.yieldToken(LuaTokenType.LOCAL, undefined, 5);
            else if (value === "false") return this.yieldToken(LuaTokenType.FALSE, false, 5);
            else if (value === "until") return this.yieldToken(LuaTokenType.UNTIL, undefined, 5);
            else if (value === "while") return this.yieldToken(LuaTokenType.WHILE, undefined, 5);
            else return this.yieldToken(LuaTokenType.IDENTIFIER, value, length);
        } else if (length === 6) {
            if (value === "elseif") return this.yieldToken(LuaTokenType.ELSEIF, undefined, 6);
            else if (value === "repeat") return this.yieldToken(LuaTokenType.REPEAT, undefined, 6);
            else if (value === "return") return this.yieldToken(LuaTokenType.RETURN, undefined, 6);
            else if (value === "global") {
                if (!this.isLua55Plus) return this.yieldToken(LuaTokenType.IDENTIFIER, value, 6);
                return this.yieldToken(LuaTokenType.GLOBAL, undefined, 6);
            }
            else return this.yieldToken(LuaTokenType.IDENTIFIER, value, length);
        } else if (length === 8) {
            if (value === "function") return this.yieldToken(LuaTokenType.FUNCTION, undefined, 8);
            else return this.yieldToken(LuaTokenType.IDENTIFIER, value, length);
        } else {
            return this.yieldToken(LuaTokenType.IDENTIFIER, value, length);
        }
    }
}

export function tokenize(code: string, options?: LuaLexerOptions): LuaToken[] {
    const lexer = new LuaLexer(options);
    lexer.load(code);
    return lexer.tokenizeAll();
}
