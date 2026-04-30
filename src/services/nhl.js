import axios from "axios"
const API_BASE = import.meta.env.VITE_API_URL

export const getNhlGames = async () => {

  const nhlGames = await axios.get(`${API_BASE}/api/nhl`)
  return {
    yesterday: nhlGames.data.yesterday || [],
    today: nhlGames.data.today || [],
    tomorrow: nhlGames.data.tomorrow || [],
  }
}