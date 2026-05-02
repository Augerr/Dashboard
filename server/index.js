import dotenv from "dotenv"
dotenv.config()
import path from "path"
import express from "express"
import axios from "axios"
import cors from "cors"
import { google } from "googleapis"

const app = express()
const __dirname = path.resolve();

const TIME_ZONE = "America/Montreal"
const CURRENT_WEATHER_URL = "https://api.openweathermap.org/data/2.5/weather"
const FORECAST_URL = "https://api.openweathermap.org/data/2.5/forecast"

const LAT = 45.24316555682251
const LON = -73.57681729532432

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY

const formatDateInTimeZone = (date, timeZone = TIME_ZONE) => {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date)

  const year = parts.find(p => p.type === "year").value
  const month = parts.find(p => p.type === "month").value
  const day = parts.find(p => p.type === "day").value

  return `${year}-${month}-${day}`
}

const getDateKey = (offsetDays = 0) => {
  const now = new Date()


  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now)

  const year = Number(parts.find(p => p.type === "year").value)
  const month = Number(parts.find(p => p.type === "month").value)
  const day = Number(parts.find(p => p.type === "day").value)

  const shifted = new Date(Date.UTC(year, month - 1, day + offsetDays, 12))

  return formatDateInTimeZone(shifted)
}

// allow your React app to call this server
app.use(cors())
app.use(express.static(path.join(__dirname, "../dist")));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist", "index.html"));
});
const PORT = 3001

app.get("/api/nhl", async (req, res) => {
  try {
    const BASE_URL = "https://api-web.nhle.com/v1/schedule"

    const yesterdayKey = getDateKey(-1)
    const todayKey = getDateKey(0)
    const tomorrowKey = getDateKey(1)

    const [yRes, tRes, tmRes] = await Promise.all([
      axios.get(`${BASE_URL}/${yesterdayKey}`),
      axios.get(`${BASE_URL}/${todayKey}`),
      axios.get(`${BASE_URL}/${tomorrowKey}`),
    ])

    const extractGamesForDate = (data, dateKey) => {
      const day = data.gameWeek?.find(d => d.date === dateKey)
      return day?.games || []
    }

    res.set("Cache-Control", "no-store")

    res.json({
      yesterday: extractGamesForDate(yRes.data, yesterdayKey),
      today: extractGamesForDate(tRes.data, todayKey),
      tomorrow: extractGamesForDate(tmRes.data, tomorrowKey),
      debug: {
        yesterdayKey,
        todayKey,
        tomorrowKey,
      },
    })

  } catch (err) {
    console.error(err.message)
    res.status(500).json({ error: "Failed to fetch NHL data" })
  }
})

app.get("/api/calendar", async (req, res) => {
  try {
    const calendar = google.calendar({
      version: "v3",
      auth: process.env.GOOGLE_CALENDAR_API_KEY,
    })

    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1, 0, 0, 0 );
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1, 0, 0, 0);

    const result = await calendar.events.list({
      calendarId: process.env.GOOGLE_CALENDAR_ID,
      timeMin: startOfMonth.toISOString(),
      timeMax: endOfMonth.toISOString(),
      singleEvents: true,
      orderBy: "startTime",
      maxResults: 250,
    })

    const events = result.data.items.map((event) => ({
      id: event.id,
      title: event.summary || "Untitled event",
      start: event.start?.dateTime || event.start?.date,
      end: event.end?.dateTime || event.end?.date,
      location: event.location || "",
    }))

    res.json(events)
  } catch (err) {
    console.error("Calendar fetch failed:", err.message)
    res.status(500).json({ error: "Failed to fetch calendar events" })
  }
})

// 🌤 Current weather
app.get("/api/weather/current", async (req, res) => {
  try {
    const response = await axios.get(CURRENT_WEATHER_URL, {
      params: {
        lat: LAT,
        lon: LON,
        units: "metric",
        appid: OPENWEATHER_API_KEY,
      },
    })

    res.json(response.data)
  } catch (err) {
    console.error("Weather error:", err.message)
    res.status(500).json({ error: "Failed to fetch current weather" })
  }
})


// 📅 Forecast
app.get("/api/weather/forecast", async (req, res) => {
  try {
    const response = await axios.get(FORECAST_URL, {
      params: {
        lat: LAT,
        lon: LON,
        units: "metric",
        appid: OPENWEATHER_API_KEY,
      },
    })

    res.json(response.data)
  } catch (err) {
    console.error("Forecast error:", err.message)
    res.status(500).json({ error: "Failed to fetch forecast" })
  }
})

app.get("/api/market-news", async (req, res) => {
  try {
    const category = req.query.category || "general";

    const url = `https://finnhub.io/api/v1/news?token=${process.env.FINNHUB_API_KEY}`;

    const response = await fetch(url);
   
    if (!response.ok) {
      throw new Error(`Finnhub news request failed: ${response.status}`);
    }

    const data = await response.json();

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

app.get("/api/stocks/:symbol", async (req, res) => {
  try {
    const symbol = req.params.symbol.toUpperCase();
    const url = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${process.env.FINNHUB_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    const now = new Date();
    const utcDay = now.getUTCDay();
    const utcHour = now.getUTCHours();
    const utcMinute = now.getUTCMinutes();

    const minutesSinceMidnight = utcHour * 60 + utcMinute;

    // US market: 9:30 AM - 4:00 PM Eastern
    // During daylight savings, Eastern = UTC-4
    const marketOpen = 13 * 60 + 30;
    const marketClose = 20 * 60;

    const isWeekday = utcDay >= 1 && utcDay <= 5;
    const isMarketOpen =
      isWeekday &&
      minutesSinceMidnight >= marketOpen &&
      minutesSinceMidnight <= marketClose;
    res.json({
      marketStatus: isMarketOpen ? "Open" : "Closed",
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

app.get("/api/crypto/:symbol", async (req, res) => {
  try {
    const symbol = req.params.symbol.toUpperCase();

    // Examples:
    // BTCUSDT -> BINANCE:BTCUSDT
    // ETHUSDT -> BINANCE:ETHUSDT
    const finnhubSymbol = `BINANCE:${symbol}`;

    const url = `https://finnhub.io/api/v1/quote?symbol=${finnhubSymbol}&token=${process.env.FINNHUB_API_KEY}`;

    const response = await fetch(url);
    console.log(response)
    if (!response.ok) {
      throw new Error(`Finnhub crypto request failed: ${response.status}`);
    }

    const data = await response.json();
    console.log(data)
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
  console.log(`Server running on http://localhost:${PORT}`)
})