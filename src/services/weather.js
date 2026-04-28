import axios from "axios"

const API_KEY = "238b3480b35948e0e45181589e8d93ef"
const CURRENT_WEATHER_URL = "https://api.openweathermap.org/data/2.5/weather"
const FORECAST_URL = "https://api.openweathermap.org/data/2.5/forecast"
// Hardcoded home location (Montreal)
const LAT = 45.24316555682251
const LON = -73.57681729532432

export const getCurrentWeather = async () => {
    const res = await axios.get(
    CURRENT_WEATHER_URL,
    {
      params: {
        lat: LAT,
        lon: LON,
        units: "metric",
        appid: API_KEY,
      },
    }
  )
  return res.data
}

export const getForecast = async () => {
  const res = await axios.get(
    FORECAST_URL,
    {
      params: {
        lat: LAT,
        lon: LON,
        units: "metric",
        appid: API_KEY,
      },
    }
  )
  console.log(res.data);
  return res.data
}