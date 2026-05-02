import { Router } from "express";
import { getCurrentWeather, getForecast } from "../services/weatherService.js";
import { getErrorMessage } from "../utils/errors.js";

export const weatherRouter = Router();

weatherRouter.get("/weather/current", async (_req, res) => {
  try {
    const weather = await getCurrentWeather();
    res.json(weather);
  } catch (error) {
    console.error("Weather error:", getErrorMessage(error));
    res.status(500).json({ error: "Failed to fetch current weather" });
  }
});

weatherRouter.get("/weather/forecast", async (_req, res) => {
  try {
    const forecast = await getForecast();
    res.json(forecast);
  } catch (error) {
    console.error("Forecast error:", getErrorMessage(error));
    res.status(500).json({ error: "Failed to fetch forecast" });
  }
});
