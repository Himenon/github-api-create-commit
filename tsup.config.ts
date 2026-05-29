import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["./src/api.ts", "./src/ApiClientImpl.ts", "./src/GitHub.ts", "./src/index.ts", "./src/types.ts"],
  minify: false,
  target: "es2022",
  format: ["cjs", "esm"],
  clean: true,
  dts: true,
  tsconfig: "./tsconfig.build.json",
  sourcemap: true,
});
