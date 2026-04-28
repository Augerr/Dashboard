import { useEffect, useState } from "react"
import { getNhlGames } from "../services/nhl"

const getLogo = (teamName) => {
      console.log(teamName);
      //const abbr = Object.keys(teamAbbrevMap).find(key => teamAbbrevMap[key] === teamName);
  //const abbr = teamAbbrevMap[teamName]
    //console.log(abbr);
 // if (!abbr) return null

  return `https://assets.nhle.com/logos/nhl/svg/${teamName}_light.svg`
}

function GameRow({ game, isToday }) {
  const home = game.homeTeam
  const away = game.awayTeam

  const time = new Date(game.startTimeUTC).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })

  return (
    <div className="flex justify-between items-center py-2 text-sm border-b border-white/10 last:border-none">
      
      <div className="flex flex-col">

        {/* AWAY */}
        <div className="flex items-center">
            <img
            src={getLogo(away.abbrev)}
            className="w-8 h-8"
            alt="away logo"
            />
            <span>{away.abbrev} {away.score ? away.score : 0}</span>
        </div>

        {/* HOME */}
        <div className="flex items-center">
            <img
            src={getLogo(home.abbrev)}
            className="w-8 h-8"
            alt="home logo"
            />
            <span>{home.abbrev} {home.score ? home.score : 0}</span>
        </div>

        </div>
        {/* Time or status */}
        <div className="text-white/80 text-xs mx-2">
            {isToday ? time : ""}
        </div>
    </div>
  )
}

function NhlPanel() {
  const [data, setData] = useState(null)

  useEffect(() => {
    getNhlGames().then(setData)
  }, [])

  if (!data) {
    return (
      <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-4 text-white">
        Loading NHL data...
      </div>
    )
  }
  console.log(data);
  return (
      <div className="w-full bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-4 text-white">

        <h3 className="text-white/80 text-sm">
        NHL Games
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            {/* YESTERDAY (small) */}
            <div className="md:col-span-1">
                <p className="text-xs text-white/80">
                Yesterday
                </p>

                <div className="space-y-2">
                {data.yesterday?.length ? (
                    data.yesterday.map((game) => (
                    <GameRow key={game.gamePk} game={game} />
                    ))
                ) : (
                    <p className="text-white/40 text-xs">No games</p>
                )}
                </div>
            </div>

            {/* TODAY (large) */}
            <div className="md:col-span-2">
                <p className="text-xs text-white/80">
                Today
                </p>

                <div className="space-y-2">
                {data.today?.length ? (
                    data.today.map((game) => (
                    <GameRow key={game.gamePk} game={game} isToday />
                    ))
                ) : (
                    <p className="text-white/40 text-xs">No games</p>
                )}
                </div>
            </div>
        </div>
    </div>
  )
}

export default NhlPanel