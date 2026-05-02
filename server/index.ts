import dotenv from "dotenv";
dotenv.config();

import path from "path";
import express, { type Request, type Response } from "express";
import axios from "axios";
import cors from "cors";
import { google } from "googleapis";

const app = express();
const rootDir = path.resolve();

const TIME_ZONE = "America/Montreal";
const CURRENT_WEATHER_URL = "https://api.openweathermap.org/data/2.5/weather";
const FORECAST_URL = "https://api.openweathermap.org/data/2.5/forecast";

const LAT = 45.24316555682251;
const LON = -73.57681729532432;

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
const PORT = 3001;

type NhlScheduleDay = {
  date: string;
  games?: unknown[];
};

type NhlScheduleResponse = {
  gameWeek?: NhlScheduleDay[];
};

type FinnhubQuote = {
  c?: number;
  d?: number;
  dp?: number;
  h?: number;
  l?: number;
  o?: number;
  pc?: number;
};

type FinnhubNewsArticle = {
  id: string | number;
  headline: string;
  summary?: string;
  source?: string;
  url: string;
  image?: string;
  datetime?: number;
};

const getErrorMessage = (error: unknown): string => {
  return error instanceof Error ? error.message : String(error);
};

const getDatePart = (
  parts: Intl.DateTimeFormatPart[],
  type: Intl.DateTimeFormatPartTypes,
): string => {
  const part = parts.find((datePart) => datePart.type === type);
  if (!part) throw new Error(`Missing date part: ${type}`);
  return part.value;
};

const formatDateInTimeZone = (date: Date, timeZone = TIME_ZONE): string => {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const year = getDatePart(parts, "year");
  const month = getDatePart(parts, "month");
  const day = getDatePart(parts, "day");

  return `${year}-${month}-${day}`;
};

const getDateKey = (offsetDays = 0): string => {
  const now = new Date();

  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);

  const year = Number(getDatePart(parts, "year"));
  const month = Number(getDatePart(parts, "month"));
  const day = Number(getDatePart(parts, "day"));

  const shifted = new Date(Date.UTC(year, month - 1, day + offsetDays, 12));

  return formatDateInTimeZone(shifted);
};

const extractGamesForDate = (
  data: NhlScheduleResponse,
  dateKey: string,
): unknown[] => {
  const day = data.gameWeek?.find((scheduleDay) => scheduleDay.date === dateKey);
  return day?.games || [];
};

const getMarketStatus = (): "Open" | "Closed" => {
  const now = new Date();
  const utcDay = now.getUTCDay();
  const utcHour = now.getUTCHours();
  const utcMinute = now.getUTCMinutes();

  const minutesSinceMidnight = utcHour * 60 + utcMinute;
  const marketOpen = 13 * 60 + 30;
  const marketClose = 20 * 60;

  const isWeekday = utcDay >= 1 && utcDay <= 5;
  const isMarketOpen =
    isWeekday &&
    minutesSinceMidnight >= marketOpen &&
    minutesSinceMidnight <= marketClose;

  return isMarketOpen ? "Open" : "Closed";
};

app.use(cors());
app.use(express.static(path.join(rootDir, "../dist")));

app.get("/", (_req: Request, res: Response) => {
  res.sendFile(path.join(rootDir, "../dist", "index.html"));
});

app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ ok: true });
});

app.get("/api/nhl", async (_req: Request, res: Response) => {
  try {
    const BASE_URL = "https://api-web.nhle.com/v1/schedule";

    const yesterdayKey = getDateKey(-1);
    const todayKey = getDateKey(0);
    const tomorrowKey = getDateKey(1);

    const [yRes, tRes, tmRes] = await Promise.all([
      axios.get<NhlScheduleResponse>(`${BASE_URL}/${yesterdayKey}`),
      axios.get<NhlScheduleResponse>(`${BASE_URL}/${todayKey}`),
      axios.get<NhlScheduleResponse>(`${BASE_URL}/${tomorrowKey}`),
    ]);

    res.set("Cache-Control", "no-store");

    res.json({
      yesterday: extractGamesForDate(yRes.data, yesterdayKey),
      today: extractGamesForDate(tRes.data, todayKey),
      tomorrow: extractGamesForDate(tmRes.data, tomorrowKey),
      debug: {
        yesterdayKey,
        todayKey,
        tomorrowKey,
      },
    });
  } catch (error) {
    console.error(getErrorMessage(error));
    res.status(500).json({ error: "Failed to fetch NHL data" });
  }
});

app.get("/api/calendar", async (_req: Request, res: Response) => {
  try {
    const calendar = google.calendar({
      version: "v3",
      auth: process.env.GOOGLE_CALENDAR_API_KEY,
    });

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1, 0, 0, 0);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1, 0, 0, 0);

    const result = await calendar.events.list({
      calendarId: process.env.GOOGLE_CALENDAR_ID,
      timeMin: startOfMonth.toISOString(),
      timeMax: endOfMonth.toISOString(),
      singleEvents: true,
      orderBy: "startTime",
      maxResults: 250,
    });

    const events = (result.data.items || []).map((event) => ({
      id: event.id || `${event.start?.dateTime || event.start?.date}-${event.summary}`,
      title: event.summary || "Untitled event",
      start: event.start?.dateTime || event.start?.date,
      end: event.end?.dateTime || event.end?.date,
      location: event.location || "",
    }));

    res.json(events);
  } catch (error) {
    console.error("Calendar fetch failed:", getErrorMessage(error));
    res.status(500).json({ error: "Failed to fetch calendar events" });
  }
});

app.get("/api/weather/current", async (_req: Request, res: Response) => {
  try {
    const response = await axios.get(CURRENT_WEATHER_URL, {
      params: {
        lat: LAT,
        lon: LON,
        units: "metric",
        appid: OPENWEATHER_API_KEY,
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error("Weather error:", getErrorMessage(error));
    res.status(500).json({ error: "Failed to fetch current weather" });
  }
});

app.get("/api/weather/forecast", async (_req: Request, res: Response) => {
  try {
    const response = await axios.get(FORECAST_URL, {
      params: {
        lat: LAT,
        lon: LON,
        units: "metric",
        appid: OPENWEATHER_API_KEY,
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error("Forecast error:", getErrorMessage(error));
    res.status(500).json({ error: "Failed to fetch forecast" });
  }
});

app.get("/api/market-news", async (_req: Request, res: Response) => {
  try {
    const url = `https://finnhub.io/api/v1/news?token=${process.env.FINNHUB_API_KEY}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Finnhub news request failed: ${response.status}`);
    }

    const data = (await response.json()) as FinnhubNewsArticle[];

    const articles = data.slice(0, 8).map((article) => ({
      id: article.id,
      headline: article.headline,
      summary: article.summary,
      source: article.source,
      url: article.url,
      image: article.image,
      datetime: article.datetime,
    }));

    res.json(articles);
  } catch (error) {
    console.error("Market news API error:", error);
    res.status(500).json({ error: "Failed to fetch market news" });
  }
});

app.get("/api/stocks/:symbol", async (req: Request<{ symbol: string }>, res: Response) => {
  try {
    const symbol = req.params.symbol.toUpperCase();
    const url = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${process.env.FINNHUB_API_KEY}`;
    const response = await fetch(url);
    const data = (await response.json()) as FinnhubQuote;

    res.json({
      marketStatus: getMarketStatus(),
      symbol,
      price: data.c,
      change: data.d,
      percentChange: data.dp,
      high: data.h,
      low: data.l,
      open: data.o,
      previousClose: data.pc,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Stock API error:", error);
    res.status(500).json({ error: "Failed to fetch stock data" });
  }
});

app.get("/api/crypto/:symbol", async (req: Request<{ symbol: string }>, res: Response) => {
  try {
    const symbol = req.params.symbol.toUpperCase();
    const finnhubSymbol = `BINANCE:${symbol}`;
    const url = `https://finnhub.io/api/v1/quote?symbol=${finnhubSymbol}&token=${process.env.FINNHUB_API_KEY}`;

    const response = await fetch(url);
    console.log(response);

    if (!response.ok) {
      throw new Error(`Finnhub crypto request failed: ${response.status}`);
    }

    const data = (await response.json()) as FinnhubQuote;
    console.log(data);

    res.json({
      symbol,
      price: data.c,
      change: data.d,
      percentChange: data.dp,
      high: data.h,
      low: data.l,
      open: data.o,
      previousClose: data.pc,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Crypto API error:", error);
    res.status(500).json({ error: "Failed to fetch crypto data" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
