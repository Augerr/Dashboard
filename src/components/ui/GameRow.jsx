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
    className={`relative h-full min-h-[72px]
      bg-white/75 backdrop-blur-xl
      border border-white/10 rounded-xl
      text-white
      grid grid-rows-[1fr_auto] grid-cols-[2fr_auto_2fr]
      px-2 py-2
      md:min-h-[86px]
      xl:min-h-[96px]
      2xl:min-h-[120px]
      transition-all duration-300
      ${isLive ? "shadow-lg shadow-red-500/30 ring-1 ring-red-500/40" : ""}
    `}
    style={{
      borderLeft: `2px solid ${accentAway}`,
      borderRight: `2px solid ${accentHome}`,
      boxShadow: `0 0 25px ${accentHome}22`,
    }}
  >
    {/* SCORE GRID */}
    <section className="col-span-3 grid grid-cols-subgrid items-center gap-1 md:gap-2">
      {/* AWAY */}
      <div className="flex min-w-0 items-center gap-1 md:gap-2">
        <img
          src={getLogo(away.abbrev)}
          className="h-8 w-8 shrink-0 object-contain md:h-10 md:w-10 xl:h-12 xl:w-12 2xl:h-20 2xl:w-20"
        />

        <span className="truncate text-sm font-bold text-black md:text-lg xl:text-xl 2xl:text-3xl">
          {away.abbrev}
        </span>
      </div>

      {/* SCORE CENTER */}
      <div className="flex justify-center whitespace-nowrap px-1 text-center text-lg font-bold tracking-tighter text-black md:text-2xl xl:text-3xl 2xl:text-4xl">
        {awayScore} - {homeScore}
      </div>

      {/* HOME */}
      <div className="flex min-w-0 items-center justify-end gap-1 md:gap-2">
        <span className="truncate text-sm font-bold text-black md:text-lg xl:text-xl 2xl:text-3xl">
          {home.abbrev}
        </span>

        <img
          src={getLogo(home.abbrev)}
          className="h-8 w-8 shrink-0 object-contain md:h-10 md:w-10 xl:h-12 xl:w-12 2xl:h-20 2xl:w-20"
        />
      </div>
    </section>

    {/* FOOTER */}
    <section className="col-span-3 flex min-w-0 items-center justify-between gap-2 px-1 text-xs font-bold text-black/90 md:text-sm xl:text-base 2xl:text-lg">
      <div className="min-w-0 whitespace-nowrap">
        {isLive ? (
          <div className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-red-600 animate-pulse md:h-3 md:w-3"></span>
            <span className="text-red-600">{period}</span>
          </div>
        ) : isFinal ? (
          "Final"
        ) : (
          time
        )}
      </div>

      <span className="truncate whitespace-nowrap tracking-tighter">
        {bottomSeedWins > topSeedWins
          ? bottomSeed + " "
          : topSeedWins > bottomSeedWins
          ? topSeed + " "
          : "Tied "}
        {bottomSeedWins > topSeedWins ? bottomSeedWins : topSeedWins} -{" "}
        {bottomSeedWins > topSeedWins ? topSeedWins : bottomSeedWins}
      </span>
    </section>
  </main>
);
}
export default GameRow