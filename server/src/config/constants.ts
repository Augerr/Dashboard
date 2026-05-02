export const TIME_ZONE = "America/Montreal";

export const weatherConfig = {
  currentUrl: "https://api.openweathermap.org/data/2.5/weather",
  forecastUrl: "https://api.openweathermap.org/data/2.5/forecast",
  lat: 45.24316555682251,
  lon: -73.57681729532432,
};

export const marketNewsConfig = {
  cacheTtlMs: 24 * 60 * 60 * 1000,
  maxArticles: 8,
};
