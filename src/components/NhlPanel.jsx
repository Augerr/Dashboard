import { useEffect, useState } from "react"
import { getNhlGames } from "../services/nhl"
import GameRow from "./ui/GameRow"
import { useAutoRefresh } from "../hooks/useAutoRefresh"
import { useCallback } from "react"

function NhlPanel() {
  const [nhlGames, setNhlGames] = useState(null)

  const loadNhlGames = useCallback(async () => {
    try {
      const data = await getNhlGames()
      setNhlGames(data)
    } catch (err) {
      console.error("NHL games fetching error:", err)
    }
  }, [])
  
  useEffect(() => {
    loadNhlGames()
  }, [loadNhlGames])

  useAutoRefresh(loadNhlGames, 600000)

  if (!nhlGames) {
    return (
      <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-4 text-white">
        Loading NHL data...
      </div>
    )
  }
  return (
      <div className="
        w-full
        text-white
        ">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-white/90 font-semibold">
            {/* YESTERDAY (small) */}
            <div className="md:col-span-1">
                <p className="text-sm  mx-2 mb-1 -my-2">Yesterday</p>

                <div className="space-y-1.5">
                {nhlGames.yesterday?.map((game) => (
                    <GameRow key={game.id} game={game} />
                ))}
                </div>
            </div>

            {/* TODAY (largest) */}
            <div className="md:col-span-1">
                <p className="text-sm mx-2 mb-1 -my-2">Today</p>

                <div className="space-y-1.5">
                {nhlGames.today?.map((game) => (
                    <GameRow key={game.id} game={game} isToday />
                ))}
                </div>
            </div>

            {/* TOMORROW (medium) */}
            <div className="md:col-span-1">
                <p className="text-sm mx-2 mb-1 -my-2">Tomorrow</p>

                <div className="space-y-1.5">
                {nhlGames.tomorrow?.map((game) => (
                    <GameRow key={game.id} game={game} />
                ))}
                </div>
            </div>
        </div>
    </div>
  )
}

export default NhlPanel