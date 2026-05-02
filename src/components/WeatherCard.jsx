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

  if (!weather) return <div className="text-white">Loading...</div>

  const temp = Math.round(weather.main.temp)
  const condition = weather.weather[0].main

  return (
    <div className="animate-fade-in flex h-full w-full flex-col overflow-hidden rounded-3xl bg-white/10 p-4 text-white shadow-2xl backdrop-blur-2xl">
      {/* Header */}
      <div className="flex justify-center">
        <p className="text-basis font-semibold text-white/80">{now.toString().slice(0, 24)}</p>
        {/* <p className="text-sm text-white/60">{time}</p> */}
      </div>

      {/* Main weather */}
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <img
          className="h-20 w-20 mb-2" 
          src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
          alt=""
        />

        <p className="text-base font-medium text-white/75 -mt-4">{condition}</p>

        <h1 className="text-5xl font-bold tracking-tight">
          {temp}°
        </h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-black/20 p-3 text-center">
          <p className="text-xs text-white/50">Humidity</p>
          <p className="mt-1 text-lg font-bold">{weather.main.humidity}%</p>
        </div>

        <div className="rounded-2xl bg-black/20 p-3 text-center">
          <p className="text-xs text-white/50">Feels Like</p>
          <p className="mt-1 text-lg font-bold">
            {Math.round(weather.main.feels_like)}°
          </p>
        </div>
      </div>

      {/* Forecast */}
      <div className="mt-3 w-full">
        <ForecastStrip daily={daily} />
      </div>
    </div>
  )
}

export default WeatherCard
