import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

const testGlobs = ["tests/**/*.test.ts", "tests/**/*.test.tsx"];
const domTestGlobs = ["tests/**/*.dom.test.ts", "tests/**/*.dom.test.tsx"];

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./", import.meta.url)),
    },
  },
  test: {
    clearMocks: true,
    globals: true,
    mockReset: true,
    projects: [
      {
        extends: true,
        test: {
          environment: "node",
          exclude: domTestGlobs,
          include: testGlobs,
          name: "unit",
        },
      },
      {
        extends: true,
        test: {
          environment: "jsdom",
          include: domTestGlobs,
          name: "dom",
        },
      },
    ],
    restoreMocks: true,
    setupFiles: ["./vitest.setup.ts"],
    testTimeout: 10_000,
  },
});
