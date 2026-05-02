import { Router } from "express";
import { getCalendarEvents } from "../services/calendarService.js";
import { getErrorMessage } from "../utils/errors.js";

export const calendarRouter = Router();

calendarRouter.get("/calendar", async (_req, res) => {
  try {
    const events = await getCalendarEvents();
    res.json(events);
  } catch (error) {
    console.error("Calendar fetch failed:", getErrorMessage(error));
    res.status(500).json({ error: "Failed to fetch calendar events" });
  }
});
