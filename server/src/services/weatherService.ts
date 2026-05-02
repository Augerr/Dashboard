import axios from "axios";
import { weatherConfig } from "../config/constants.js";
import { env } from "../config/env.js";

const weatherParams = {
  lat: weatherConfig.lat,
  lon: weatherConfig.lon,
  units: "metric",
  appid: env.openWeatherApiKey,
};

export const getCurrentWeather = async (): Promise<unknown> => {
  const response = await axios.get(weatherConfig.currentUrl, {
    params: weatherParams,
  });

  return response.data;
};

export const getForecast = async (): Promise<unknown> => {
  const response = await axios.get(weatherConfig.forecastUrl, {
    params: weatherParams,
  });

  return response.data;
};
