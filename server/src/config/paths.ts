import path from "path";
import { fileURLToPath } from "url";

export const serverDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);

export const rootDir = path.resolve(serverDir, "..");

export const distDir = path.join(rootDir, "dist");
export const marketNewsCacheFile = path.join(
  serverDir,
  ".cache",
  "market-news.json",
);
