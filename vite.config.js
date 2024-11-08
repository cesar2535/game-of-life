import { defineConfig } from "vite";
import jsconfigPaths from "vite-jsconfig-paths";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [jsconfigPaths(), react()],
  base: "/game-of-life/",
});
