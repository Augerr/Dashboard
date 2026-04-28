import express from "express"
import axios from "axios"
import cors from "cors"

const app = express()

// allow your React app to call this server
app.use(cors())

const PORT = 3001

app.get("/api/nhl", async (req, res) => {
  try {
    const today = new Date()
    const yesterday = new Date()
    yesterday.setDate(today.getDate() - 1)

    const formatDate = (d) => d.toISOString().split("T")[0]

    const BASE_URL = "https://api-web.nhle.com/v1/schedule"

    const [yRes, tRes] = await Promise.all([
      axios.get(`${BASE_URL}/${formatDate(yesterday)}`),
      axios.get(`${BASE_URL}/${formatDate(today)}`),
    ])
    const extractGames = (data) => {
        console.log(data.gameWeek?.[0]?.games)
      return data.gameWeek?.[0]?.games || []
    }

    res.json({
      yesterday: extractGames(yRes.data),
      today: extractGames(tRes.data),
    })
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ error: "Failed to fetch NHL data" })
  }
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})