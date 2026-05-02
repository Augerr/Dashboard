export type NhlScheduleDay = {
  date: string;
  games?: unknown[];
};

export type NhlScheduleResponse = {
  gameWeek?: NhlScheduleDay[];
};

export type FinnhubQuote = {
  c?: number;
  d?: number;
  dp?: number;
  h?: number;
  l?: number;
  o?: number;
  pc?: number;
};

export type SerpApiNewsResult = {
  position?: number;
  title?: string;
  link?: string;
  thumbnail?: string;
  thumbnail_small?: string;
  date?: string;
  iso_date?: string;
  source?: {
    title?: string;
    name?: string;
    icon?: string;
  };
  highlight?: SerpApiNewsResult;
  stories?: SerpApiNewsResult[];
};

export type SerpApiGoogleNewsResponse = {
  error?: string;
  news_results?: SerpApiNewsResult[];
};
