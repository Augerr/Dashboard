import { Router } from "express";
import { getNhlGames } from "../services/nhlService.js";
import { getErrorMessage } from "../utils/errors.js";

export const nhlRouter = Router();

nhlRouter.get("/nhl", async (_req, res) => {
  try {
    const games = await getNhlGames();
    res.set("Cache-Control", "no-store");
    res.json(games);
  } catch (error) {
    console.error(getErrorMessage(error));
    res.status(500).json({ error: "Failed to fetch NHL data" });
  }
});
