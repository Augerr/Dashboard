import { useEffect, useState } from "react"
import { getCurrentWeather } from "../services/weather"

function WeatherCard() {
  const [weather, setWeather] = useState(null)

  useEffect(() => {
    const fetchWeather = async () => {
      const data = await getCurrentWeather()
      setWeather(data)
    }

    fetchWeather()
  }, [])

  if (!weather) return <div className="text-white">Loading...</div>

  const temp = Math.round(weather.main.temp)
  const condition = weather.weather[0].main
  const city = weather.name

  return (
    <div className="w-full max-w-md p-8 rounded-3xl backdrop-blur-2xl bg-white/10 border border-white/20 shadow-2xl">
      
      {/* Location */}
      <div className="text-center">
        <h2 className="text-2xl font-semibold">{city}</h2>
        <img
          className="mx-auto"
          width="100"
          src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
          alt=""
        />
        <p className="text-sm opacity-70">{condition}</p>
      </div>

      {/* Temperature */}
      <div className="text-center mt-4">
        <h1 className="text-8xl font-thin">{temp}°</h1>
      </div>

      {/* Extra Info */}
      <div className="flex justify-between mt-6 text-sm opacity-80">
        <div>
          <p>Humidity</p>
          <p>{weather.main.humidity}%</p>
        </div>
        <div>
          <p>Feels Like</p>
          <p>{Math.round(weather.main.feels_like)}°</p>
        </div>
      </div>
    </div>
  )
}

export default WeatherCard