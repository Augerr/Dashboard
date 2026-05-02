import path from "path";
import cors from "cors";
import express from "express";
import { apiRouter } from "./routes/index.js";
import { distDir } from "./config/paths.js";

export const createApp = (): express.Express => {
  const app = express();

  app.use(cors());
  app.use(express.static(distDir));
  app.use("/api", apiRouter);

  app.get("/", (_req, res) => {
    res.sendFile(path.join(distDir, "index.html"));
  });

  return app;
};
