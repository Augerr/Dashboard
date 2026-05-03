import axios from "axios"
import type { CurrentWeather, ForecastResponse } from "@/types/app"

const API_BASE = import.meta.env.VITE_API_URL

export const fetchWeather = async (): Promise<CurrentWeather> => {
  const res = await axios.get<CurrentWeather>(`${API_BASE}/api/weather/current`)
  return res.data
}

export const fetchForecast = async (): Promise<ForecastResponse> => {
  const res = await axios.get<ForecastResponse>(`${API_BASE}/api/weather/forecast`)
  return res.data
}
