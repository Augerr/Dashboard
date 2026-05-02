import dotenv from "dotenv";

dotenv.config();

export const env = {
  finnhubApiKey: process.env.FINNHUB_API_KEY,
  googleCalendarApiKey: process.env.GOOGLE_CALENDAR_API_KEY,
  googleCalendarId: process.env.GOOGLE_CALENDAR_ID,
  openWeatherApiKey: process.env.OPENWEATHER_API_KEY,
  serpApiKey: process.env.SERPDATA_API_KEY ?? process.env.SERPAPI_API_KEY,
  marketNewsQuery:
    process.env.MARKET_NEWS_QUERY ??
    `"S&P 500" OR Nasdaq OR Dow stocks OR Nvidia OR Apple OR Microsoft OR Tesla stock news today`,
  port: Number(process.env.PORT ?? 3001),
};
