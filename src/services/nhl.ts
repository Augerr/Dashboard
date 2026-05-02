import axios from "axios"
import type { NHLGamesByDay } from "../types/nhl"

const API_BASE = import.meta.env.VITE_API_URL

export const getNhlGames = async (): Promise<NHLGamesByDay> => {

  const nhlGames = await axios.get<Partial<NHLGamesByDay>>(`${API_BASE}/api/nhl`)
  return {
    yesterday: nhlGames.data.yesterday || [],
    today: nhlGames.data.today || [],
    tomorrow: nhlGames.data.tomorrow || [],
  }
}
