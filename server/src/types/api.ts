export type ApiErrorResponse = {
  error: string;
};

export type CalendarEventResponse = {
  id: string;
  title: string;
  start?: string;
  end?: string;
  location: string;
};

export type MarketStatus = "Open" | "Closed";

export type MarketQuoteResponse = {
  marketStatus?: MarketStatus;
  symbol: string;
  price?: number;
  change?: number;
  percentChange?: number;
  high?: number;
  low?: number;
  open?: number;
  previousClose?: number;
  updatedAt: string;
};

export type MarketNewsArticle = {
  id: string | number;
  title: string;
  link: string;
  thumbnail?: string;
  source?: {
    name?: string;
    icon?: string;
  };
  date?: string;
  isoDate?: string;
};

export type NHLGamesByDayResponse = {
  yesterday: unknown[];
  today: unknown[];
  tomorrow: unknown[];
  debug: {
    yesterdayKey: string;
    todayKey: string;
    tomorrowKey: string;
  };
};
