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

const getPeriod = (pNum) => {
  if (pNum > 3)
    pNum -= 3
  return pNum === 1 ? "1st" : pNum === 2 ? "2nd" : "3rd"
}

function GameRow({ game }) {
  const home = game.homeTeam
  const away = game.awayTeam
  const accentHome = getTeamColor(home.abbrev)
  const accentAway = getTeamColor(away.abbrev)
  const isLive = game.gameState === "LIVE" || game.gameState === "CRIT"
  const isFinal = game.gameState === "OFF"
  const period = `${getPeriod(game.periodDescriptor.number)} ${game.periodDescriptor.periodType}`

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
        rounded-xl
        p-2
        text-white
      "
      style={{
        borderLeft: `2px solid ${accentAway}`,
        borderRight: `2px solid ${accentHome}`,
        boxShadow: `0 0 25px ${accentHome}22`,
      }}
    >

      {/* SCORE GRID */}
      <div className="grid grid-cols-3 items-center">

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
          <span className={`mx-1 text-sm md:text-lg ${homeWon ? "text-white" : "text-white/50"}`}>
            {home.abbrev}
          </span>
          <img
            src={getLogo(home.abbrev)}
            className="w-10 h-10 object-contain"
          />
        </div>

      </div>

      {/* FOOTER */}
      <div className="flex justify-between text-sm text-white/80 mx-2">

        <span>
          {isLive ? (
              <div className="flex items-center gap-1">
                <span className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></span>
                <span className="text-sm text-green-400">{period}</span>
              </div>
            ) : isFinal ? "Final" : time
          }
        </span>

        {
          <span className="text-white/70 mx-1 text-sm">
            {bottomSeedWins > topSeedWins ? bottomSeed + " " : topSeedWins > bottomSeedWins ? topSeed  + " " : "Tied "} 
            {bottomSeedWins > topSeedWins ? bottomSeedWins : topSeedWins} - {bottomSeedWins > topSeedWins ? topSeedWins : bottomSeedWins}
          </span>
        }
      </div>

    </div>
  )
}
export default GameRow