import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";

export default {
  input: "src/playtopro-card.ts",           // your entry that imports the editor
  output: {
    file: "dist/playtopro-card.js",
    format: "es",
    sourcemap: true,
    inlineDynamicImports: true,              // <- critical: disables chunking
  },
  plugins: [
    resolve({ extensions: [".mjs", ".js", ".ts"] }),
    typescript({ tsconfig: "tsconfig.json", sourceMap: true }),
    terser(),
  ],
  // Safety levers that also prevent code-splitting:
  // preserveEntrySignatures: false,
  // manualChunks: () => null,
};