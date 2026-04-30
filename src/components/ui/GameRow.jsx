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
    <main
      className="h-full
        relative min-w-[220px]
        bg-white/75
        backdrop-blur-xl
        border border-white/10
        rounded-xl
        text-white
        grid
        grid-rows-2 
        grid-rows-[1fr_auto]
        grid.cols-5
        py-4
      "
      style={{
        borderLeft: `2px solid ${accentAway}`,
        borderRight: `2px solid ${accentHome}`,
        boxShadow: `0 0 25px ${accentHome}22`,
      }}
    >

      {/* SCORE GRID */}
      <section className="items-center  row-start-1 col-span-5 grid grid-cols-subgrid gap-2">

        {/* AWAY */}
        <div className="flex items-center col-start-1 col-span-2">
          <img  
            src={getLogo(away.abbrev)}
            className="w-12 h-12 object-contain"
          />
          <span className="text-md lg:text-xl font-bold text-black ">
            {away.abbrev}
          </span>
        </div>

        {/* SCORE CENTER */}
        <div className="flex text-center col-start-3 row-start-1 col-span-1
            text-xl font-bold tracking-tighter text-black whitespace-nowrap">
          {awayScore} - {homeScore}
        </div>

        {/* HOME */}
        <div className="flex col-start-4 col-span-2 justify-end items-center row-start-1">
          <span className="text-md lg:text-xl font-bold text-black">
            {home.abbrev}
          </span>
          <img 
            src={getLogo(home.abbrev)}
            className="w-12 h-12 object-contain items-end"
          />
        </div>

      </section>

      {/* FOOTER */}
      <section className="flex justify-between font-bold text-black/90 ml-1 row-2 col-span-5 px-2">

        <span>
          {isLive ? (
              <div className="flex items-center gap-1">
                <span className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></span>
                <span className="text-green-400">{period}</span>
              </div>
            ) : isFinal ? "Final" : time
          }
        </span>

        {
          <span className="mr-1">
            {bottomSeedWins > topSeedWins ? bottomSeed + " " : topSeedWins > bottomSeedWins ? topSeed  + " " : "Tied "} 
            {bottomSeedWins > topSeedWins ? bottomSeedWins : topSeedWins} - {bottomSeedWins > topSeedWins ? topSeedWins : bottomSeedWins}
          </span>
        }
      </section>

    </main>
  )
}
export default GameRow