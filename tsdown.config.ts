import { defineConfig } from "tsdown";

const isDev = process.env.npm_lifecycle_event === "dev";

export default defineConfig({
  clean: true,
  entry: ["src/index.ts"],
  format: ["esm"],
  target: "esnext",
  minify: !isDev,
  outDir: "dist",
  onSuccess: isDev ? "node dist/index.js" : undefined,
});