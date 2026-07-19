import { defineConfig } from "tsup";

export default defineConfig({
    entry: ["source/index.ts"],
    outDir: "build",
    format: ["cjs", "esm"],
    dts: true,
    clean: true,
    splitting: false,
    minify: true
});
