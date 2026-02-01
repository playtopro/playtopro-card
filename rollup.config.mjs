
import resolve from "@rollup/plugin-node-resolve";
import { terser } from "@rollup/plugin-terser";

export default {
  input: "src/playtopro-card.ts",
  output: {
    file: "dist/playtopro-card.js",
    format: "es",
    sourcemap: true,
  },
  plugins: [
    resolve({ extensions: [".mjs", ".js", ".ts"] }),
    terser(),
  ],
};
``
