import ForecastStrip from "./ForecastStrip"
import { useEffect, useState } from "react";

function WeatherCard({weather, daily}) {
  const [now, setNow] = useState(new Date());
  
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const time = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (!weather) return <div className="text-white">Loading...</div>

  const temp = Math.round(weather.main.temp)
  const condition = weather.weather[0].main

  return (
    <div className="flex h-full w-full flex-col rounded-3xl border-4 border-white/50 bg-white/10 p-4 text-white shadow-2xl backdrop-blur-2xl">
      <div className="text-center text-md tracking-tight text-white/70">
        {time}
      </div>

      <div className="flex-1 text-center">
        <img
          className="mx-auto h-16 w-16 object-contain"
          src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
          alt=""
        />

        <p className="text-lg opacity-80">{condition}</p>

        <h1 className="mt-2 text-4xl font-bold">
          {temp}°
        </h1>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3 text-center text-sm opacity-80 lg:text-base">
        <div className="rounded-xl bg-white/10 p-2">
          <p>Humidity</p>
          <p className="font-bold">{weather.main.humidity}%</p>
        </div>

        <div className="rounded-xl bg-white/10 p-2">
          <p>Feels Like</p>
          <p className="font-bold">{Math.round(weather.main.feels_like)}°</p>
        </div>
      </div>

      <div className="mt-auto pt-3">
        <ForecastStrip daily={daily} />
      </div>
    </div>
  )
}

export default WeatherCard