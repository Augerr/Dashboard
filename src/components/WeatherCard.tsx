import { useEffect, useState } from "react";
import ForecastStrip from "./ForecastStrip";
import type { CurrentWeather, DailyForecast } from "../types/app";

type WeatherCardProps = {
  weather: CurrentWeather | null;
  daily: DailyForecast[];
};

function WeatherCard({ weather, daily }: WeatherCardProps) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!weather) return <div className="text-white">Loading...</div>;

  const temp = Math.round(weather.main.temp);
  const condition = weather.weather[0]?.main ?? "";
  const icon = weather.weather[0]?.icon;
  const currentDate = new Intl.DateTimeFormat([], {
    weekday: "long",
    month: "short",
    day: "numeric",
  }).format(now);
  const currentTime = new Intl.DateTimeFormat([], {
    hour: "numeric",
    minute: "2-digit",
  }).format(now);

  return (
    <div className="animate-fade-in flex h-full min-h-0 w-full flex-col overflow-hidden rounded-3xl bg-white/10 p-4 text-white shadow-2xl backdrop-blur-2xl">
      <div className="shrink-0 text-center leading-tight">
        <p className="text-xs font-semibold uppercase tracking-wide text-white/50">
          {currentDate}
        </p>
        <p className="mt-1 text-xl font-bold text-white 2xl:text-2xl">
          {currentTime}
        </p>
      </div>

      <div className="mt-3 flex shrink-0 items-center justify-center gap-1">
        <div className="flex min-w-0 flex-col items-center justify-center px-1 py-3 text-center">
          <div className="flex items-center justify-center">
            <h1 className="text-5xl font-bold tracking-tight 2xl:text-6xl">
              {temp}°
            </h1>
            {icon && (
              <img
                className="h-16 w-16 shrink-0 2xl:h-20 2xl:w-20"
                src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
                alt=""
              />
            )}
          </div>

          <p className="-mt-2 text-base font-semibold text-white/85">
            {condition}
          </p>
        </div>

        <div className="flex min-w-0 flex-col">
          <div className="px-1 py-2 text-center">
            <p className="text-xs text-white/50">Humidity</p>
            <p className="mt-1 text-lg font-bold">{weather.main.humidity}%</p>
          </div>

          <div className="px-1 py-2 text-center">
            <p className="text-xs text-white/50">Feels Like</p>
            <p className="mt-1 text-lg font-bold">
              {Math.round(weather.main.feels_like)}°
            </p>
          </div>
        </div>
      </div>

      <div className="mt-3 min-h-0 w-full flex-1">
        <ForecastStrip daily={daily} />
      </div>
    </div>
  );
}

export default WeatherCard;
