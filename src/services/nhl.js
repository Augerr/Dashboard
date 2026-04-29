import axios from "axios"

const BASE_URL = "http://localhost:3001/api/nhl"

export const getNhlGames = async () => {

  const nhlGames = await Promise.all([
    axios.get(BASE_URL)
  ])
  console.log(nhlGames)
  return {
    yesterday: nhlGames[0].data.yesterday || [],
    today: nhlGames[0].data.today || [],
    tomorrow: nhlGames[0].data.tomorrow || [],
  }
}