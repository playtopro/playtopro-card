// rollup.config.mjs
import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";

export default {
  input: {
    "playtopro-card": "src/playtopro-card.ts",
    "playtopro-card-editor": "src/editor/playtopro-card-editor.ts",
  },
  output: {
    dir: "dist",
    entryFileNames: "[name].js",
    format: "es",
    sourcemap: true,
  },
  plugins: [resolve({ extensions: [".mjs", ".js", ".ts"] }), typescript(), terser()],
};
