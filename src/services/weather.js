import axios from "axios"
const API_BASE = import.meta.env.VITE_API_URL

export const fetchWeather = async () => {
  const res = await axios.get(`${API_BASE}/api/weather/current`)
  return res.data
}

export const fetchForecast = async () => {
  const res =  await axios.get(`${API_BASE}/api/weather/forecast`)
  return res.data
}