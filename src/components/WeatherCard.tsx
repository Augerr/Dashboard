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
    <div className="animate-fade-in flex w-full flex-col overflow-hidden rounded-3xl bg-white/10 p-3 text-white shadow-2xl backdrop-blur-2xl">
      {/* TOP COMPACT ROW */}
      <div className="relative flex flex-row shrink-0 items-center justify-center">
        {/* Date / time */}
        <div className="min-w-0 flex flex-row absolute top-0 left-0">
          <p className="truncate text-xs 2xl:text-sm font-semibold uppercase tracking-wide text-white/70 mr-1">
            {currentDate}
          </p>
          <p className="text-md font-semibold leading-tight text-white ml-0.5">
            {currentTime}
          </p>
        </div>

        {/* Temperature / icon / condition */}
        <div className="flex flex-col -mt-2">
          <div className="flex shrink-0 items-center">
            <h1 className="text-4xl font-bold leading-none tracking-tighter">
              {temp}°
            </h1>

            {icon && (
              <img
                className="h-16 w-16 shrink-0 -m-2"
                src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
                alt=""
              />
            )}
          </div>
          <p className="max-w-[80px] justify-center ml-3 -my-2 gap-1 truncate font-semibold text-white/90">
            {condition}
          </p>
        </div>
      </div>

      {/* STATS */}
      <div className="mt-3 grid shrink-0 grid-cols-2 gap-2 text-center">
        <div className="rounded-xl bg-black/30 px-3 py-2">
          <p className="text-xs text-white/50">Humidity</p>
          <p className="text-base font-bold">{weather.main.humidity}%</p>
        </div>

        <div className="rounded-xl bg-black/30 px-3 py-2">
          <p className="text-xs text-white/50">Feels Like</p>
          <p className="text-base font-bold">
            {Math.round(weather.main.feels_like)}°
          </p>
        </div>
      </div>

      {/* FORECAST */}
      <div className="mt-2 w-full shrink-0">
        <ForecastStrip daily={daily} />
      </div>
    </div>
  );
}

export default WeatherCard;
