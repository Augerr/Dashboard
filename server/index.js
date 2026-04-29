import dotenv from "dotenv"
dotenv.config()
import path from "path"
import express from "express"
import axios from "axios"
import cors from "cors"

const app = express()
const __dirname = path.resolve();

// allow your React app to call this server
app.use(cors())
app.use(express.static(path.join(__dirname, "../dist")));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist", "index.html"));
});
const PORT = 3001

app.get("/api/nhl", async (req, res) => {
  try {
    const today = new Date()
    const yesterday = new Date()
    const tomorrow = new Date()

    yesterday.setDate(today.getDate() - 2)
    today.setDate(today.getDate() - 1)

    const formatDate = (d) => d.toISOString().split("T")[0]
    const BASE_URL = "https://api-web.nhle.com/v1/schedule"

    const [yRes, tRes, tmRes] = await Promise.all([
      axios.get(`${BASE_URL}/${formatDate(yesterday)}`),
      axios.get(`${BASE_URL}/${formatDate(today)}`),
      axios.get(`${BASE_URL}/${formatDate(tomorrow)}`),
    ])

    const extractGamesForDate = (data, targetDate) => {
        console.log(targetDate)
        const target = targetDate.toISOString().split("T")[0]

        const day = data.gameWeek?.find(d => d.date === target)
        console.log(day?.games)
        return day?.games || []
    } 

    res.json({
        yesterday: extractGamesForDate(yRes?.data, yesterday),
        today: extractGamesForDate(tRes?.data, today),
        tomorrow: extractGamesForDate(tmRes?.data, tomorrow),
    })

  } catch (err) {
    console.error(err.message)
    res.status(500).json({ error: "Failed to fetch NHL data" })
  }
})

app.get("/api/nhl-news", async (req, res) => {
  try {
    const response = await axios.get(
      "https://site.api.espn.com/apis/site/v2/sports/hockey/nhl/news"
    )

    const articles =
      response.data?.articles?.slice(0, 8).map((a) => ({
        title: a.headline,
        description: a.description,
        url: a.links?.web?.href,
        image: a.images?.[0]?.url,
        date: a.published,
      })) || []

    res.json(articles)
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ error: "Failed to fetch news" })
  }
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})