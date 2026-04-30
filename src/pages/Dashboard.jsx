import { useEffect, useState } from "react"
import { fetchWeather, fetchForecast } from "../services/weather"
import { fetchCalendar } from "../services/api"
import { weatherTheme } from "../utils/weatherTheme"
import { groupToDaily } from "../utils/groupForecast"
import WeatherCard from "../components/WeatherCard"
import WeeklyCalendar from "../components/WeeklyCalendar"
import NhlPanel from "../components/NhlPanel"
import Panel from "../components/ui/Panel"
import { useAutoRefresh } from "../hooks/useAutoRefresh"
import { useCallback } from "react"
import MonthlyCalendar from "../components/MonthlyCalendar"


function Dashboard() {
  const [current, setCurrent] = useState(null)
  const [daily, setDaily] = useState([])
  const [calendarEvents, setCalendarEvents] = useState([])

  const loadCalendar = useCallback(async () => {
    const data = await fetchCalendar()
    setCalendarEvents(data)
  }, [])

  const loadWeather = useCallback(async () => {
    const data = await fetchWeather()
    setCurrent(data)
  }, [])

  const loadForecast = useCallback(async () => {
    const data = await fetchForecast()
    setDaily(groupToDaily(data.list))
  }, [])

  useEffect(() => {
    loadWeather()
    loadForecast()
    loadCalendar()
  }, [loadWeather, loadForecast, loadCalendar])

  useAutoRefresh(loadWeather, 1800000)
  useAutoRefresh(loadForecast, 1800000)
  useAutoRefresh(loadCalendar, 300000)

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
    grid-rows-3
    md:grid-cols-6`
  }>
    <div className="md:col-span-6 grid grid-cols-1 lg:grid-cols-3 space-x-2">
      {/* NHL (wide) */}
      <div className="lg:col-span-2">
        <Panel>
          <NhlPanel />
        </Panel>
      </div>
      {/* WEATHER (1 column) */}
      <div className="lg:col-span-1">
        <Panel>
          <WeatherCard weather={current} daily={daily}/>
        </Panel>
      </div>
    </div>
    <div className="lg:col-span-6 -my-42">
      <Panel>
        <WeeklyCalendar events={calendarEvents} />
      </Panel>
    </div>
    <div className="lg:col-span-6 -my-8">
      <Panel>
        <MonthlyCalendar events={calendarEvents} />
      </Panel>
    </div>
  </div>
)
}

export default Dashboard