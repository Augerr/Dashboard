import { teamColorMap, teamAbbrevMap } from "../../utils/nhlUtils";
import type { NHLGame } from "../../types/nhl";

type GameRowProps = {
  game: NHLGame;
  isToday?: boolean;
};

const DEFAULT_TEAM_COLOR = "#ffffff";
const DEFAULT_GAME_TIME = "TBD";
const typedTeamColorMap = teamColorMap as Record<string, string>;
const typedTeamAbbrevMap = teamAbbrevMap as Record<string, string>;

const getKeyByValue = (
  object: Record<string, string>,
  value: string,
): string | undefined => {
  return Object.keys(object).find((key) => object[key] === value);
};

const getTeamColor = (team: string): string => {
  const teamName = getKeyByValue(typedTeamAbbrevMap, team);
  return teamName
    ? typedTeamColorMap[teamName] || DEFAULT_TEAM_COLOR
    : DEFAULT_TEAM_COLOR;
};

const getTeamLogoUrl = (teamName: string): string => {
  return `https://assets.nhle.com/logos/nhl/svg/${teamName}_light.svg`;
};

const getPeriod = (pNum: number): string => {
  const normalizedPeriod = pNum > 3 ? pNum - 3 : pNum;
  return normalizedPeriod === 1
    ? "1st"
    : normalizedPeriod === 2
      ? "2nd"
      : "3rd";
};

const formatGameTime = (startTimeUTC?: string): string => {
  if (!startTimeUTC) return DEFAULT_GAME_TIME;

  const date = new Date(startTimeUTC);
  if (Number.isNaN(date.getTime())) return DEFAULT_GAME_TIME;

  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getSeriesSummary = (
  seriesStatus: NHLGame["seriesStatus"] = {},
): string | null => {
  const {
    bottomSeedTeamAbbrev,
    topSeedTeamAbbrev,
    bottomSeedWins = 0,
    topSeedWins = 0,
  } = seriesStatus;

  if (!bottomSeedTeamAbbrev || !topSeedTeamAbbrev) return null;

  if (bottomSeedWins > topSeedWins) {
    return `${bottomSeedTeamAbbrev} ${bottomSeedWins} - ${topSeedWins}`;
  }

  if (topSeedWins > bottomSeedWins) {
    return `${topSeedTeamAbbrev} ${topSeedWins} - ${bottomSeedWins}`;
  }

  return `Tied ${bottomSeedWins} - ${topSeedWins}`;
};

function GameRow({ game }: GameRowProps) {
  const home = game.homeTeam;
  const away = game.awayTeam;
  const accentHome = getTeamColor(home.abbrev);
  const accentAway = getTeamColor(away.abbrev);
  const isLive = game.gameState === "LIVE" || game.gameState === "CRIT";
  const isFinal = game.gameState === "OFF";
  const periodNumber = game.periodDescriptor?.number ?? 1;
  const periodType = game.periodDescriptor?.periodType ?? "";
  const period = `${getPeriod(periodNumber)} ${periodType}`.trim();
  const homeScore = Number(home.score ?? 0);
  const awayScore = Number(away.score ?? 0);
  const time = formatGameTime(game.startTimeUTC);
  const seriesSummary = getSeriesSummary(game.seriesStatus);

  return (
    <article
      className={`relative h-full min-h-[72px]
      bg-white/75 backdrop-blur-xl
      border border-white/10 rounded-xl
      text-white
      grid grid-rows-[1fr_auto] grid-cols-[2fr_auto_2fr]
      px-2 py-2
      md:min-h-[86px]
      xl:min-h-[96px]
      2xl:min-h-[120px]
      2xl:max-h-[120px]
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
      <section className="col-span-3 grid grid-col-3 grid-cols-subgrid items-center gap-1 md:gap-2">
        {/* AWAY */}
        <div className="flex-2 grid grid-col-3">
          <img
            src={getTeamLogoUrl(away.abbrev)}
            alt={`${away.placeName?.default ?? away.abbrev} logo`}
            loading="lazy"
            className="2xl:col-3 h-8 w-8 shrink-0 object-contain md:h-10 md:w-10 xl:h-12 xl:w-12 2xl:h-30 2xl:w-30 2xl:-mt-14 2xl:-mb-16"
          />
        </div>

        {/* SCORE CENTER */}
        <div className="flex-1 col-2 whitespace-nowrap px-1 text-center text-lg font-bold tracking-tighter text-black md:text-2xl xl:text-3xl 2xl:text-4xl">
          {awayScore} - {homeScore}
        </div>

        {/* HOME */}
        <div className="flex-2 grid grid-col-3">
          <img
            src={getTeamLogoUrl(home.abbrev)}
            alt={`${home.placeName?.default ?? home.abbrev} logo`}
            loading="lazy"
            className="h-8 w-8 shrink-0 object-contain xl:h-12 xl:w-12 2xl:h-32 2xl:w-32 2xl:-mt-14 2xl:-mb-16"
          />
        </div>
      </section>

      {/* FOOTER */}
      <section className="col-span-3 flex min-w-0 items-center justify-between gap-2 text-xs font-bold text-black/90 md:text-sm xl:text-base 2xl:text-lg">
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

        {seriesSummary && (
          <span className="whitespace-nowrap tracking-tighter">
            {seriesSummary}
          </span>
        )}
      </section>
    </article>
  );
}
export default GameRow;
