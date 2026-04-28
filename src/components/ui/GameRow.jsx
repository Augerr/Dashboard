import { teamColorMap } from "../../utils/nhlColors"
import { teamAbbrevMap } from "../../utils/nhlTeams"

const getKeyByValue = (object, value) => {
  return Object.keys(object).find(key => object[key] === value);
}

const getTeamColor = (team) => {
  return (
    teamColorMap[getKeyByValue(teamAbbrevMap, team)] ||
    "#ffffff"
  )
}

const getLogo = (teamName) => {
  return `https://assets.nhle.com/logos/nhl/svg/${teamName}_light.svg`
}

function GameRow({ game }) {
  const home = game.homeTeam
  const away = game.awayTeam
  const accentHome = getTeamColor(home.abbrev)
  const accentAway = getTeamColor(away.abbrev)
  const isLive = game.gameState === "LIVE"
  const isFinal = game.gameState === "OFF"

  const homeScore = Number(home.score ?? 0)
  const awayScore = Number(away.score ?? 0)

  const homeWon = homeScore > awayScore
  const awayWon = awayScore > homeScore

  const bottomSeed = game.seriesStatus.bottomSeedTeamAbbrev
  const topSeed = game.seriesStatus.topSeedTeamAbbrev
  const bottomSeedWins = game.seriesStatus.bottomSeedWins
  const topSeedWins = game.seriesStatus.topSeedWins


  const time = new Date(game.startTimeUTC).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })
  return (
    <div
      className="
        relative
        bg-black/30
        backdrop-blur-xl
        border border-white/10
        rounded-2xl
        p-4
        text-white
        space-y-3 md:space-y-4
      "
      style={{
        borderLeft: `2px solid ${accentAway}`,
        borderRight: `2px solid ${accentHome}`,
        boxShadow: `0 0 25px ${accentHome}22`,
      }}
    >

      {/* LIVE BADGE */}
      {isLive && (
        <div className="absolute top-2 right-3 flex items-center gap-2">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
          <span className="text-xs text-green-400">LIVE</span>
        </div>
      )}

      {/* SCORE GRID */}
      <div className="grid grid-cols-3 items-center gap-2">

        {/* AWAY */}
        <div className="flex items-center">
          <img
            src={getLogo(away.abbrev)}
            className="w-8 h-8 object-contain"
          />
          <span className={`text-base md:text-lg ${awayWon ? "text-white" : "text-white/50"}`}>
            {away.abbrev}
          </span>
        </div>

        {/* SCORE CENTER */}
        <div className="text-center">
          <div className="text-2xl font-bold tracking-tight">
            {awayScore} - {homeScore}
          </div>
        </div>

        {/* HOME */}
        <div className="flex items-center justify-end">
          <span className={`text-base md:text-lg ${homeWon ? "text-white" : "text-white/50"}`}>
            {home.abbrev}
          </span>
          <img
            src={getLogo(home.abbrev)}
            className="w-8 h-8 object-contain"
          />
        </div>

      </div>

      {/* FOOTER */}
      <div className="mt-3 flex justify-between text-xs text-white/50">

        <span className="mx-1">
          {isLive ? "In Progress" : isFinal ? "Final" : time}
        </span>

        {
          <span className="text-white/70 mx-1">
            {bottomSeedWins > topSeedWins ? bottomSeed + " leads " : topSeedWins > bottomSeedWins ? topSeed  + " leads " : "Tied "} 
            {bottomSeedWins > topSeedWins ? bottomSeedWins : topSeedWins} - {bottomSeedWins > topSeedWins ? topSeedWins : bottomSeedWins}
          </span>
        }
      </div>

    </div>
  )
}
export default GameRow