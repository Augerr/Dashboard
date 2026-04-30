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
    const end = new Date()
    end.setDate(now.getDate() + 7)
    console.log(process.env.GOOGLE_CALENDAR_ID)
    const result = await calendar.events.list({
      calendarId: process.env.GOOGLE_CALENDAR_ID,
      timeMin: now.toISOString(),
      timeMax: end.toISOString(),
      singleEvents: true,
      orderBy: "startTime",
      maxResults: 10,
    })
    console.log(result)
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


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})