export type NHLGameState =
  | "FUT" // future
  | "PRE" // pre-game
  | "LIVE"
  | "CRIT"
  | "FINAL"
  | "OFF"; // finished

export type NHLLocalizedName = {
  default: string;
  fr?: string;
};

export type NHLTeam = {
  id?: number;
  abbrev: string;
  score?: number;
  sog?: number;
  logo?: string;
  darkLogo?: string;
  placeName?: NHLLocalizedName;
  commonName?: NHLLocalizedName;
  name?: NHLLocalizedName;
};

export type NHLPeriodDescriptor = {
  number?: number;
  periodType?: "REG" | "OT" | "SO" | string;
  maxRegulationPeriods?: number;
};

export type NHLSeriesStatus = {
  round?: number;
  seriesAbbrev?: string;
  seriesTitle?: string;
  seriesLetter?: string;
  neededToWin?: number;
  topSeedTeamAbbrev?: string;
  topSeedWins?: number;
  bottomSeedTeamAbbrev?: string;
  bottomSeedWins?: number;
  gameNumberOfSeries?: number;
};

export type NHLGame = {
  id: number;
  season?: number;
  gameType?: number;
  gameDate?: string;
  venue?: {
    default: string;
  };

  startTimeUTC?: string;
  easternUTCOffset?: string;
  venueUTCOffset?: string;
  tvBroadcasts?: unknown[];

  gameState: NHLGameState;
  gameScheduleState?: string;

  awayTeam: NHLTeam;
  homeTeam: NHLTeam;

  periodDescriptor?: NHLPeriodDescriptor;
  seriesStatus?: NHLSeriesStatus;

  clock?: {
    timeRemaining?: string;
    secondsRemaining?: number;
    running?: boolean;
    inIntermission?: boolean;
  };
};

export type NHLScheduleDay = {
  date: string;
  dayAbbrev?: string;
  numberOfGames?: number;
  games: NHLGame[];
};

export type NHLScheduleResponse = {
  nextStartDate?: string;
  previousStartDate?: string;
  gameWeek: NHLScheduleDay[];

  preSeasonStartDate?: string;
  regularSeasonStartDate?: string;
  regularSeasonEndDate?: string;
  playoffEndDate?: string;
};

export type NHLGamesByDay = {
  yesterday: NHLGame[];
  today: NHLGame[];
  tomorrow: NHLGame[];
};
