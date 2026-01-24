import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import viteImagemin from "vite-plugin-imagemin";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return;

          // Important: keep React core packages together to avoid cross-chunk cycles.
          // (react-dom depends on scheduler; many other deps depend on react)
          const isReactCore = /[\\/]node_modules[\\/](react|react-dom|scheduler|use-sync-external-store)[\\/]/.test(
            id
          );

          if (id.includes("react-router")) return "router";
          if (id.includes("framer-motion")) return "motion";
          if (id.includes("@radix-ui")) return "radix";
          if (isReactCore) return "react";
          return "vendor";
        },
      },
    },
  },
  plugins: [
    react(),
    // Optimize images in production builds to reduce bundle size and improve load time
    viteImagemin({
      disable: mode !== "production",
      gifsicle: false,
      optipng: {
        optimizationLevel: 7,
      },
      mozjpeg: {
        quality: 75,
      },
      pngquant: false,
      svgo: {
        plugins: [
          {
            name: "preset-default",
            params: {
              overrides: {
                // keep viewBox so responsive SVGs don't break
                removeViewBox: false,
              },
            },
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
