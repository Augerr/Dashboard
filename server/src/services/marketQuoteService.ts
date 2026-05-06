import { env } from "../config/env.js";
import type { MarketQuoteResponse } from "../types/api.js";
import type {
  FinnhubQuote,
  AlphaVantageDailyEntry,
  AlphaVantageMetaData,
  AlphaVantageResponse,
  AlphaVantageTimeSeries,
} from "../types/external.js";
import { getMarketStatus } from "../utils/market.js";

const getFinnhubQuote = async (symbol: string): Promise<FinnhubQuote> => {
  const url = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${env.finnhubApiKey}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Finnhub quote request failed: ${response.status}`);
  }

  return (await response.json()) as FinnhubQuote;
};

export function transformAlphaVantage(
  data: AlphaVantageResponse,
): StockHistoryPoint[] {
  const series = data["Time Series (Daily)"];

  return Object.entries(series)
    .map(([date, values]) => ({
      date,
      open: parseFloat(values["1. open"]),
      high: parseFloat(values["2. high"]),
      low: parseFloat(values["3. low"]),
      close: parseFloat(values["4. close"]),
      volume: parseInt(values["5. volume"], 10),
    }))
    .sort((a, b) => a.date.localeCompare(b.date)); // chronological order
}

const getAlphavantageHistory = async (
  symbol: string,
): Promise<StockHistoryPoint[]> => {
  const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${env.alphavantageApiKey}`;
  const res = await fetch(url);
  console.log(res);
  return transformAlphaVantage(
    (await res.json()) as AlphaVantageResponse,
  ) as StockHistoryPoint[];
};

const toMarketQuoteResponse = (
  symbol: string,
  data: FinnhubQuote,
  marketStatus?: MarketQuoteResponse["marketStatus"],
): MarketQuoteResponse => ({
  marketStatus,
  symbol,
  price: data.c,
  change: data.d,
  percentChange: data.dp,
  high: data.h,
  low: data.l,
  open: data.o,
  previousClose: data.pc,
  updatedAt: new Date().toISOString(),
});

export const getStockQuote = async (
  rawSymbol: string,
): Promise<MarketQuoteResponse> => {
  const symbol = rawSymbol.toUpperCase();
  const data = await getFinnhubQuote(symbol);
  return toMarketQuoteResponse(symbol, data, getMarketStatus());
};

export const getCryptoQuote = async (
  rawSymbol: string,
): Promise<MarketQuoteResponse> => {
  const symbol = rawSymbol.toUpperCase();
  const data = await getFinnhubQuote(`BINANCE:${symbol}`);
  return toMarketQuoteResponse(symbol, data);
};

export const getStockHistory = async (
  rawSymbol: string,
): Promise<StockHistoryPoint[]> => {
  const history = await getAlphavantageHistory(rawSymbol.toUpperCase());
  return history;
};
