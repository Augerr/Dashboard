
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
    <div className={`min-h-screen bg-gradient-to-br ${theme} animated-bg p-4`}>
      
      <div className="mx-auto grid h-full gap-4 grid-cols-6 grid-rows-[auto_auto_auto]">

        {/* NHL */}
        <div className="col-span-5 xl:col-span-4 h-full">
          <Panel>
            <NhlPanel />
          </Panel>
        </div>

        {/* WEATHER */}
        <div className="col-span-1 xl:col-span-2 h-full">
          <Panel>
            {current != null && daily != null ?
            <WeatherCard weather={current} daily={daily}/> : "Loading weather forecast..."
            }
          </Panel>
        </div>
      </div>
      
      {/* WEEKLY */}
      <div className="col-span-6 h-full">
        <Panel>
          {calendarEvents != null ?
          <WeeklyCalendar events={calendarEvents} />
          : "Loading schedule..."
          }
        </Panel>
      </div>

      {/* MONTHLY */}
      <div className="col-span-6 h-full mt-8">
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