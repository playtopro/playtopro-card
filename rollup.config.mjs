// rollup.config.mjs
import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser"; // <-- default import

/** @type {import('rollup').RollupOptions} */
export default {
  input: "src/playtopro-card.ts",       // or .js if your source is JS
  output: {
    file: "dist/playtopro-card.js",
    format: "es",
    sourcemap: true,
  },
  plugins: [
    resolve({ extensions: [".mjs", ".js", ".ts"] }),
    typescript({ tsconfig: "tsconfig.json", sourceMap: true }),
    terser(),                           // <-- call the default export
  ],
};