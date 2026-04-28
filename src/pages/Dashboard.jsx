import { useEffect, useState } from "react"
import { getCurrentWeather, getForecast } from "../services/weather"
import { getWeatherTheme } from "../utils/getWeatherTheme"
import { groupToDaily } from "../utils/groupForecast"
import WeatherCard from "../components/WeatherCard"
import ForecastStrip from "../components/ForecastStrip"
import HourlyStrip from "../components/HourlyStrip"
import NhlPanel from "../components/NhlPanel"

function Dashboard() {
  const [current, setCurrent] = useState(null)
  const [daily, setDaily] = useState(null)
  const [forecast, setForecast] = useState(null)

  useEffect(() => {
    const load = async () => {
      const c = await getCurrentWeather()
      const f = await getForecast()

      setCurrent(c)
      setDaily(groupToDaily(f.list))
      setForecast(f)
    }

    load()
  }, [])

  if (!current) {
    return <div className="h-screen bg-black" />
  }

  const condition = current.weather[0].main
  const theme = getWeatherTheme(condition)

  return (
  <div className={`min-h-screen bg-gradient-to-br ${theme} animated-bg text-white p-6`}>

    <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-start">

      {/* LEFT */}
      <div className="md:col-span-1 top-6">
        <WeatherCard weather={current} />
      </div>

      {/* RIGHT */}
      <div className="md:col-span-2 flex flex-col gap-6">

        <HourlyStrip data={forecast} />

        <ForecastStrip daily={daily} />

      </div>

      <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-4 border border-white/10">
        <NhlPanel />
      </div>

    </div>

  </div>
)
}

export default Dashboard