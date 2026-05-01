
import { fetchWeather, fetchForecast } from "../services/weather"
import { fetchCalendar } from "../services/api"
import { groupToDaily } from "../utils/groupForecast"
import MonthlyCalendar from "../components/MonthlyCalendar"
import NhlPanel from "../components/NhlPanel"
import Panel from "../components/ui/Panel"
import WeatherCard from "../components/WeatherCard"
import WeeklyCalendar from "../components/WeeklyCalendar"
import { useAutoRefresh } from "../hooks/useAutoRefresh"
import { useCallback } from "react"
import { useEffect, useState } from "react"
import { weatherTheme } from "../utils/weatherTheme"

function Dashboard() {
  const [current, setCurrent] = useState(null)
  const [daily, setDaily] = useState([])
  const [calendarEvents, setCalendarEvents] = useState([])

  const loadCalendar = useCallback(async () => {
    try{
      const data = await fetchCalendar()
      console.log("load calendar")
      setCalendarEvents(data)
    } catch (err) {
      console.error("Weather failed:", err)
    }
  }, [])

  const loadWeather = useCallback(async () => {
    try {
      const data = await fetchWeather()
      setCurrent(data)
    } catch (err) {
      console.error("Weather failed:", err)
    }
  }, [])

  const loadForecast = useCallback(async () => {
    try {
      const data = await fetchForecast()
      setDaily(groupToDaily(data.list))
    } catch (err) {
      console.error("Weather failed:", err)
    }
  }, [])

  useEffect(() => {
    loadWeather()
    loadForecast()
    loadCalendar()
  }, [loadWeather, loadForecast, loadCalendar])

  useAutoRefresh(loadWeather, 1800000)
  useAutoRefresh(loadForecast, 1800000)
  useAutoRefresh(loadCalendar, 1200000)

  if (!current) {
    return <div className="h-screen bg-black" />
  }

  const condition = current.weather[0].main
  const theme = weatherTheme[condition]

  setInterval(() => {
    window.location.reload()
  }, 3000000)

  return (
    <div className={`bg-gradient-to-br ${theme} animated-bg
    max-w-[1800px]
    mx-auto
    p-4 flex flex-col h-full`}>
  {/* <div className={
    `bg-gradient-to-br ${theme} animated-bg
    max-w-[1800px]
    mx-auto
    p-4
    grid
    grid-cols-6
    grid-rows-3`
  }> */}
    <div className="-my-8 flex flex-row flex-auto">
      {/* NHL (wide) */}
      <div className="flex-1">
        <Panel>
          <NhlPanel />
        </Panel>
      </div>
      {/* WEATHER (1 column) */}
      <div className="flex-basis-sm">
        <Panel>
          {current != null && daily != null ?
          <WeatherCard weather={current} daily={daily}/> : "Loading weather forecast..."
          }
        </Panel>
      </div>
    </div>
    
    <div className="flex-1 my-8">
      <Panel>
        {calendarEvents != null ?
        <WeeklyCalendar events={calendarEvents} />
        : "Loading schedule..."
        }
      </Panel>
    </div>
    <div className="flex-1 -my-6">
      <Panel>
        {calendarEvents != null ?
        <MonthlyCalendar events={calendarEvents} />
        : "Loading calendar..."
        }
      </Panel>
    </div>
  </div>
)
}

export default Dashboard