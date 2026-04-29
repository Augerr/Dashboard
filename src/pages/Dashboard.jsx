import { useEffect, useState } from "react"
import { getCurrentWeather, getForecast } from "../services/weather"
import { weatherTheme } from "../utils/weatherTheme"
import { groupToDaily } from "../utils/groupForecast"
import WeatherCard from "../components/WeatherCard"
import ForecastStrip from "../components/ForecastStrip"
import HourlyStrip from "../components/HourlyStrip"
import NhlPanel from "../components/NhlPanel"
import NhlNews from "../components/NhlNews"
import Panel from "../components/ui/Panel"
import { useAutoRefresh } from "../hooks/useAutoRefresh"
import { useCallback } from "react"

function Dashboard() {
  const [current, setCurrent] = useState(null)
  const [forecast, setForecast] = useState(null)
  const [daily, setDaily] = useState([])

  const loadWeather = useCallback(async () => {
    try {
      const data = await getCurrentWeather()
      setCurrent(data)
    } catch (err) {
      console.error("Weather error:", err)
    }
  }, [])

  const loadForecast = useCallback(async () => {
    try {
      const data = await getForecast()
      setDaily(groupToDaily(data.list))
      setForecast(data)
    } catch (err) {
      console.error("Forecast error:", err)
    }
  }, [])

  useEffect(() => {
    loadWeather()
    loadForecast()
  }, [loadWeather, loadForecast])

  useAutoRefresh(loadWeather, 30000)
  useAutoRefresh(loadForecast, 300000)

  if (!current) {
    return <div className="h-screen bg-black" />
  }

  const condition = current.weather[0].main
  const theme = weatherTheme[condition]

  return (
  <div className={
    `bg-gradient-to-br ${theme} animated-bg
    max-w-[1800px]
    mx-auto
    p-6
    grid
    grid-cols-1
    md:grid-cols-6
    gap-4`
  }>
    <div className="md:col-span-6 grid grid-cols-1 lg:grid-cols-3 gap-6x mb-2 md:mb-4 min-h-[420px]">
      {/* NHL (wide) */}
      <div className="lg:col-span-2">
        <Panel>
          <NhlPanel />
        </Panel>
      </div>
      {/* NEWS FEED (1 column) */}
      <div className="lg:col-span-1">
        <Panel>
          <NhlNews />
        </Panel>
      </div>
    </div>
    <div className="md:col-span-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* LEFT: WEATHER CARD (big) */}
      <div className="lg:col-span-1">
        <Panel className="h-full min-h-[300px]">
          <WeatherCard weather={current}/>
        </Panel>
      </div>

      {/* RIGHT: STACKED FORECASTS */}
      <div className="lg:col-span-2 flex flex-col gap-4">
        <Panel className="flex-[1]">
          <HourlyStrip data={forecast}/>
        </Panel>
        <Panel className="flex-[1]">
          <ForecastStrip daily={daily}/>
        </Panel>
      </div>
    
    </div>
  </div>
)
}

export default Dashboard