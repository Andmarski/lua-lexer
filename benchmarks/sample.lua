-- lua-lexer Benchmark Payload: "The Kitchen Sink"
-- This file is designed to contain EVERY possible token type and lexical structure in Lua
-- to ensure the benchmark tests the entire state machine of the lexer.

-- 1. Keywords & Control Structures
local function factorial(n)
    if n <= 0 then
        return 1
    elseif n == 1 then
        return 1
    else
        return n * factorial(n - 1)
    end
end

local a, b = true, false
local c = nil

for i = 1, 10 do
    while a do
        repeat
            a = not a
            if c == nil then break end
        until b
    end
end

-- 2. Operators & Punctuation
-- Arithmetic & Relational
local calc = (1 + 2) * 3 / 4 % 5 ^ 6
local rel = (calc == 0) or (calc ~= 1) and (calc <= 2) or (calc >= 3)
local len = #("length")

-- Bitwise (Lua 5.3+)
local bitwise = (0xFF & 0x0F) | (~0x0A) << 2 >> 1 // 3

-- Concatenation & Varargs
local function concat(...)
    return "prefix_" .. ... .. "_suffix"
end

-- 3. Numbers (Decimals, Hex, Scientific)
local num1 = 12345
local num2 = 123.45
local num3 = .45
local num4 = 123.
local num5 = 1e3
local num6 = 1.5e-2
local hex1 = 0x1A
local hex2 = 0x1.A
local hex3 = 0x1p-2

-- 4. Strings (Single, Double, Multi-line, Escape Sequences)
local str1 = "Double quoted string with \n \t \\ \" escapes."
local str2 = 'Single quoted string with \n \t \\ \' escapes.'
local str3 = [[
    Simple multi-line string.
    Spanning multiple lines.
]]
local str4 = [=[
    Multi-line string with nesting depth 1.
]=]
local str5 = [===[
    Multi-line string with nesting depth 2.
]===]

-- 5. Tables & Identifiers
local complex_table = {
    ["key_with_spaces"] = 1,
    [2] = "two",
    nested = {
        field1 = true,
        field2 = function()
            goto my_label
            ::my_label::
        end
    }
}

-- 6. Method Calls
complex_table.nested:field2()

-- 7. Various Comments
-- Short comment at the end of the file

--[[
    Standard multi-line comment.
]]

--[=[
    Multi-line comment with depth 1.
    --[[ inside ]]
]=]

--[===[
    Multi-line comment with depth 2.
]===]
