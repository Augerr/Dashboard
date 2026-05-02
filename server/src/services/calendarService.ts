import { google } from "googleapis";
import { env } from "../config/env.js";
import type { CalendarEventResponse } from "../types/api.js";

export const getCalendarEvents = async (): Promise<CalendarEventResponse[]> => {
  const calendar = google.calendar({
    version: "v3",
    auth: env.googleCalendarApiKey,
  });

  const now = new Date();
  const startOfMonth = new Date(
    now.getFullYear(),
    now.getMonth() - 1,
    1,
    0,
    0,
    0,
  );
  const endOfMonth = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    1,
    0,
    0,
    0,
  );

  const result = await calendar.events.list({
    calendarId: env.googleCalendarId,
    timeMin: startOfMonth.toISOString(),
    timeMax: endOfMonth.toISOString(),
    singleEvents: true,
    orderBy: "startTime",
    maxResults: 250,
  });

  return (result.data.items || []).map((event) => {
    const start = event.start?.dateTime ?? event.start?.date ?? undefined;
    const end = event.end?.dateTime ?? event.end?.date ?? undefined;

    return {
      id: event.id || `${start}-${event.summary}`,
      title: event.summary || "Untitled event",
      start,
      end,
      location: event.location || "",
    };
  });
};
