import { env } from "../config/env.js";
import type { MarketQuoteResponse } from "../types/api.js";
import type { FinnhubQuote } from "../types/external.js";
import { getMarketStatus } from "../utils/market.js";

const getFinnhubQuote = async (symbol: string): Promise<FinnhubQuote> => {
  const url = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${env.finnhubApiKey}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Finnhub quote request failed: ${response.status}`);
  }

  return (await response.json()) as FinnhubQuote;
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
