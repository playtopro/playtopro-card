// rollup.config.mjs — single entry (simple and safe)
import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";

export default {
  input: "src/playtopro-card.ts",
  output: {
    file: "dist/playtopro-card.js",
    format: "es",
    sourcemap: false,
    inlineDynamicImports: true   // <— fold everything into one file
  },
  plugins: [
    resolve({ extensions: [".mjs", ".js", ".ts"] }),
    typescript({ tsconfig: "tsconfig.json", sourceMap: false, inlineSources: false }),
    terser()
  ]
};