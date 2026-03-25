import { defineConfig, loadEnv } from "vite";
import { resolve } from "path";
import { config } from "dotenv";

config();

const devMode = process.env.NODE_ENV === "development";
const isProduction = !devMode;
const outputPath = resolve(process.cwd(), isProduction ? "../../docs" : "dist");

// Load env file in correct mode
const env = loadEnv(devMode ? "development" : "production", process.cwd(), "");

const SERVER = env.SERVER || "http://localhost:4545";
const publicPath = isProduction ? "/DASF-toolset/" : "/";
const APP_PORT = parseInt(env.APP_PORT || "65533", 10);
const APP_TITLE = env.APP_TITLE || "DASF-toolset";
const APP_TITLE_SHORT = env.APP_TITLE_SHORT || "DASF";
const APP_DESC =
  env.APP_DESC ||
  "The DASF toolset consists of several core tools designed to simplify and systematize the assessment and screening process for disaster management. In addition to a user guide to support you through the assessment process. The toolset analysis is aligned with the latest EU priorities for disaster management, including the EU civil security taxonomy.";

console.log(
  `Running in ${
    isProduction ? "production" : "development"
  } mode, serving from ${SERVER} and public path ${publicPath}, output directed to ${outputPath}.`,
);

export default defineConfig({
  base: publicPath,
  build: {
    outDir: outputPath,
    assetsDir: "assets",
    emptyOutDir: true,
    sourcemap: isProduction,
    rollupOptions: {
      output: {
        entryFileNames: "[name].bundle.js",
        chunkFileNames: "[name].bundle.js",
        assetFileNames: "[name].[ext]",
      },
    },
  },
  server: {
    port: APP_PORT,
    host: "127.0.0.1",
    strictPort: true,
    open: true,
    hmr: true,
    watch: {
      usePolling: true,
    },
  },
  resolve: {
    extensions: [".ts", ".js", ".json", ".wasm"],
  },
  define: {
    "import.meta.env.SERVER": JSON.stringify(
      isProduction ? publicPath : `http://localhost:${APP_PORT}`,
    ),
    "import.meta.env.APP_TITLE": JSON.stringify(APP_TITLE),
    "import.meta.env.APP_TITLE_SHORT": JSON.stringify(APP_TITLE_SHORT),
    "import.meta.env.APP_DESC": JSON.stringify(APP_DESC),
  },
  plugins: [
    {
      name: "html-env-variables",
      transformIndexHtml: {
        order: "pre",
        handler(html) {
          return html
            .replace(/<%= env\.APP_TITLE %>/g, APP_TITLE)
            .replace(/<%= env\.APP_TITLE_SHORT %>/g, APP_TITLE_SHORT)
            .replace(/<%= env\.APP_DESC %>/g, APP_DESC);
        },
      },
    },
  ],
});
