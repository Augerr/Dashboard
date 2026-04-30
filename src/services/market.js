import axios from "axios"
const API_BASE = import.meta.env.VITE_API_URL

export const fetchStock = async (stock) => {
  const res = await axios.get(`${API_BASE}/api/stocks/${stock}`)
  return res.data
}

export const fetchMarketNews = async () => {
  const res = await axios.get(`${API_BASE}/api/market-news`)
  return res.data
}

export const fetchCrypto = async (symbol) => {
  const res = await axios.get(`${API_BASE}/api/crypto/${symbol}`)
  console.log(res.data);
  return res.data
}