
import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import { terser } from "@rollup/plugin-terser";

/** @type {import('rollup').RollupOptions} */
export default {
  input: "src/playtopro-card.ts", // change to .js if your entry is JS
  output: {
    file: "dist/playtopro-card.js",
    format: "es",
    sourcemap: true
  },
  plugins: [
    resolve({ extensions: [".mjs", ".js", ".ts"] }),
    typescript({ tsconfig: "tsconfig.json", sourceMap: true }),
    terser()
  ]
};