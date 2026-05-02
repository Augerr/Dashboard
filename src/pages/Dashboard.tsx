
import { fetchWeather, fetchForecast } from "../services/weather"
import { fetchCalendar } from "../services/api"
import { groupToDaily } from "../utils/groupForecast"
import CalendarPanel from "../components/CalendarPanel";
import NhlPanel from "../components/NhlPanel"
import Panel from "../components/ui/Panel"
import WeatherCard from "../components/WeatherCard"
import { useAutoRefresh } from "../hooks/useAutoRefresh"
import { useCallback, useEffect, useState } from "react"
import { weatherTheme } from "../utils/weatherTheme"
import type { CalendarEvent, CurrentWeather, DailyForecast } from "../types/app"

function Dashboard() {
  const [current, setCurrent] = useState<CurrentWeather | null>(null)
  const [daily, setDaily] = useState<DailyForecast[]>([])
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([])

  const loadCalendar = useCallback(async () => {
    try{
      const data = await fetchCalendar()
      setCalendarEvents(data)
      
    } catch (err) {
      console.error("Weather failed:", err)
    }
  }, [])

  const loadWeather = useCallback(async () => {
    try {
      const data = await fetchWeather()
      setCurrent(data)

      const daysForecast = await fetchForecast()
      setDaily(groupToDaily(daysForecast))
    } catch (err) {
      console.error("CurrentWeather failed:", err)
    }
  }, [])

  useAutoRefresh(loadWeather, 1800000)
  useAutoRefresh(loadCalendar, 1200000)

  useEffect(() => {
    const reloadTimer = setInterval(() => {
      window.location.reload()
    }, 3000000)

    return () => clearInterval(reloadTimer)
  }, [])

  if (!current) {
    return <div className="h-screen bg-black" />
  }

  const condition = current.weather[0]?.main ?? "default"
  const theme = weatherTheme[condition] ?? weatherTheme.default

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.bg} animated-bg p-4`}>
      
      <div className="mx-auto grid h-full gap-4 grid-cols-6 grid-rows-[auto_auto_auto] portrait:grid-rows-3">

        {/* NHL */}
        <div className="col-span-5 portrait:col-span-6 xl:col-span-4 h-full">
          <Panel>
            <NhlPanel />
          </Panel>
        </div>

        {/* WEATHER */}
        <div className="col-span-1 xl:col-span-2 portrait:col-span-6 portrait:row-2 h-full">
          <Panel>
            {current != null && daily != null ?
            <WeatherCard weather={current} daily={daily}/> : "Loading weather forecast..."
            }
          </Panel>
        </div>
      </div>
      
      {/* CALENDAR */}
      <div className="col-span-6 h-full">
        <Panel>
          {calendarEvents != null ? (
            <CalendarPanel events={calendarEvents} daily={daily}  />
          ) : (
            "Loading calendar..."
          )}
        </Panel>
      </div>
    </div>
)
}

export default Dashboard
