export type AlphaVantageMetaData = {
  "1. Information": string;
  "2. Symbol": string;
  "3. Last Refreshed": string;
  "4. Output Size": string;
  "5. Time Zone": string;
};

export type AlphaVantageDailyEntry = {
  "1. open": string;
  "2. high": string;
  "3. low": string;
  "4. close": string;
  "5. volume": string;
};

export type AlphaVantageTimeSeries = {
  [date: string]: AlphaVantageDailyEntry;
};

export type AlphaVantageResponse = {
  "Meta Data": AlphaVantageMetaData;
  "Time Series (Daily)": AlphaVantageTimeSeries;
};

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
