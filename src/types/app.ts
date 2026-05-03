export type WeatherCondition = {
  main: string;
  icon: string;
  description?: string;
};

export type CurrentWeather = {
  weather: WeatherCondition[];
  main: {
    temp: number;
    humidity: number;
    feels_like: number;
  };
};

export type ForecastListItem = {
  dt: number;
  main: {
    temp_min: number;
    temp_max: number;
  };
  weather: WeatherCondition[];
};

export type ForecastResponse = {
  list: ForecastListItem[];
};

export type DailyForecast = {
  date: Date;
  icon: string;
  min: number;
  max: number;
  weather: WeatherCondition;
};

export type CalendarEvent = {
  id: string | number;
  title: string;
  start: string;
  end?: string;
  color: string;
};

export type MarketNumber = number | string | null | undefined;

export type MarketQuote = {
  symbol?: string;
  price?: MarketNumber;
  change?: MarketNumber;
  percentChange?: MarketNumber;
  open?: MarketNumber;
  high?: MarketNumber;
  low?: MarketNumber;
  previousClose?: MarketNumber;
  marketStatus?: string;
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
