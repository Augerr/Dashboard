import axios from "axios"

const BASE_URL = "http://localhost:3001/api/nhl"

const formatDate = (date) => date.toISOString().split("T")[0]

export const getNhlGames = async () => {
  const today = new Date()
  const yesterday = new Date()
  yesterday.setDate(today.getDate() - 1)

  const [yRes, tRes] = await Promise.all([
    axios.get(BASE_URL, {
      params: { date: formatDate(yesterday) },
    }),
    axios.get(BASE_URL, {
      params: { date: formatDate(today) },
    }),
  ])
  
  return {
    yesterday: yRes.data.yesterday || [],
    today: tRes.data.today || [],
  }
}