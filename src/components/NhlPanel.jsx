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
      console.log(data.today)
    } catch (err) {
      console.error("NHL games fetching error:", err)
    }
  }, [])
  
  useEffect(() => {
    loadNhlGames()
  }, [loadNhlGames])

  useAutoRefresh(loadNhlGames, 60000)

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
        bg-gradient-to-br from-black/60 to-black/30
        backdrop-blur-2xl
        border border-white/10
        rounded-3xl
        p-4
        text-white
        ">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* YESTERDAY (small) */}
            <div className="md:col-span-1">
                <p className="text-sm text-white/80 mx-2 mb-2">Yesterday</p>

                <div className="space-y-2">
                {nhlGames.yesterday?.map((game) => (
                    <GameRow key={game.id} game={game} />
                ))}
                </div>
            </div>

            {/* TODAY (largest) */}
            <div className="md:col-span-1">
                <p className="text-sm text-white/80 mx-2 mb-2">Today</p>

                <div className="space-y-2">
                {nhlGames.today?.map((game) => (
                    <GameRow key={game.id} game={game} isToday />
                ))}
                </div>
            </div>

            {/* TOMORROW (medium) */}
            <div className="md:col-span-1">
                <p className="text-sm text-white/80 mx-2 mb-2">Tomorrow</p>

                <div className="space-y-2">
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