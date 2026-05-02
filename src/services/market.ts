import axios from "axios"
import type { MarketNewsArticle, MarketQuote } from "../types/app"

const API_BASE = import.meta.env.VITE_API_URL

export const fetchStock = async (stock: string): Promise<MarketQuote | null> => {
  const res = await axios.get<MarketQuote | null>(`${API_BASE}/api/stocks/${stock}`)
  return res.data
}

export const fetchMarketNews = async (): Promise<MarketNewsArticle[]> => {
  const res = await axios.get<MarketNewsArticle[]>(`${API_BASE}/api/market-news`)
  return res.data
}

export const fetchCrypto = async (symbol: string): Promise<MarketQuote | null> => {
  const res = await axios.get<MarketQuote | null>(`${API_BASE}/api/crypto/${symbol}`)
  console.log(res.data);
  return res.data
}
