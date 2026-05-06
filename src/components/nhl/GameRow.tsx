import type { CSSProperties } from "react";
import { Box, Chip, Paper, Stack, Typography } from "@mui/material";
import type { NHLGame } from "@/types/nhl";
import { teamColorMap, teamAbbrevMap } from "@/utils/nhlUtils";

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
  const accentStyles = {
    "--accent-away": accentAway,
    "--accent-home": accentHome,
    "--accent-home-shadow": `${accentHome}22`,
  } as CSSProperties;

  return (
    <Paper
      component="article"
      className={`relative grid h-full min-h-[72px] grid-cols-[2fr_auto_2fr] grid-rows-[1fr_auto] rounded-lg border border-l-2 border-r-2 border-white/10 
        border-l-[var(--accent-away)] border-r-[var(--accent-home)] !bg-black px-2 py-2 shadow-[0_0_25px_var(--accent-home-shadow)] backdrop-blur-xl 
        transition-all duration-300 md:min-h-[86px] xl:min-h-[96px] 2xl:max-h-[140px] 2xl:min-h-[140px] text-scoreBoard 
        ${isLive ? "shadow-lg shadow-red-500/30 ring-1 ring-red-500/40" : ""}`}
      style={accentStyles}
    >
      <Box
        component="section"
        className="col-span-3 mb-2 grid grid-col-5 grid-cols-subgrid items-center gap-1 md:gap-2 2xl:text-3xl mb-2"
      >
        <Box className="grid grid-col-3">
          <img
            src={getTeamLogoUrl(away.abbrev)}
            alt={`${away.placeName?.default ?? away.abbrev} logo`}
            loading="lazy"
            className="h-8 w-8 shrink-0 object-contain col-2 lg:h-12 lg:w-12 2xl:-mb-16 2xl:-mt-14 2xl:h-32 2xl:w-32 3xl:h-34 3xl:w-34"
          />
        </Box>

        <Typography className="col-2 flex-1 whitespace-nowrap px-1 text-center text-yellow-300 lg:!text-2xl 2xl:!text-4xl">
          {awayScore} - {homeScore}
        </Typography>

        <Box className="flex-2 grid grid-col-3">
          <img
            src={getTeamLogoUrl(home.abbrev)}
            alt={`${home.placeName?.default ?? home.abbrev} logo`}
            loading="lazy"
            className="col-2 !-ml-4 h-8 w-8 shrink-0 object-contain xl:h-12 xl:w-12 2xl:-mb-16 2xl:-mt-14 2xl:h-30 2xl:w-30"
          />
        </Box>
      </Box>

      <Box
        component="section"
        className="-mb-2 col-span-3 flex min-w-0 items-center justify-between gap-2 text-xs font-bold text-black/90 md:text-sm xl:text-base 2xl:text-lg"
      >
        <Box className="min-w-0 whitespace-nowrap  text-yellow-300">
          {isLive ? (
            <Stack direction="row" className="items-center gap-1">
              <Box className="h-2 w-2 animate-pulse rounded-full bg-red-600 md:h-3 md:w-3" />
              <Typography component="span" className="text-red-600">
                {period}
              </Typography>
            </Stack>
          ) : isFinal ? (
            "Final"
          ) : (
            time
          )}
        </Box>

        {seriesSummary && (
          <Chip
            size="small"
            label={seriesSummary}
            className="h-6 whitespace-nowrap font-bold !text-yellow-300 text-scoreBoard 2xl:!text-lg"
          />
        )}
      </Box>
    </Paper>
  );
}

export default GameRow;
