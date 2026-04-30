import axios from "axios"
const API_BASE = import.meta.env.VITE_API_URL

export const getNhlGames = async () => {

  const nhlGames = await axios.get(`${API_BASE}/api/nhl`)

  return {
    yesterday: nhlGames[0].data.yesterday || [],
    today: nhlGames[0].data.today || [],
    tomorrow: nhlGames[0].data.tomorrow || [],
  }
}