import { useCallback, useEffect, useState } from "react";
import CalendarPanel from "@/components/calendar/CalendarPanel";
import NhlPanel from "@/components/nhl/NhlPanel";
import Panel from "@/components/ui/Panel";
import WeatherCard from "@/components/weather/WeatherCard";
import { useAutoRefresh } from "@/hooks/useAutoRefresh";
import { fetchCalendar } from "@/services/api";
import { fetchWeather, fetchForecast } from "@/services/weather";
import type { CalendarEvent, CurrentWeather, DailyForecast } from "@/types/app";
import { groupToDaily } from "@/utils/groupForecast";
import { retryAsync } from "@/utils/retry";
import { weatherTheme } from "@/utils/weatherTheme";

function Dashboard() {
  const [current, setCurrent] = useState<CurrentWeather | null>(null);
  const [daily, setDaily] = useState<DailyForecast[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);

  const loadCalendar = useCallback(async () => {
    try {
      const data = await retryAsync(() => fetchCalendar());
      setCalendarEvents(data);
    } catch (err) {
      console.error("Weather failed:", err);
    }
  }, []);

  const loadWeather = useCallback(async () => {
    try {
      const data = await retryAsync(() => fetchWeather());
      setCurrent(data);

      const daysForecast = await retryAsync(() => fetchForecast());
      setDaily(groupToDaily(daysForecast));
    } catch (err) {
      console.error("CurrentWeather failed:", err);
    }
  }, []);

  useAutoRefresh(loadWeather, 1800000);
  useAutoRefresh(loadCalendar, 1200000);

  useEffect(() => {
    const reloadTimer = setInterval(() => {
      window.location.reload();
    }, 3000000);

    return () => clearInterval(reloadTimer);
  }, []);

  if (!current) {
    return <div className="h-screen bg-black" />;
  }

  const condition = current.weather[0]?.main ?? "default";
  console.log(condition + ": " + weatherTheme[condition].bg);
  const theme = weatherTheme[condition] ?? weatherTheme.default;

  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${theme.bg} animated-bg p-4`}
    >
      <div className="mx-auto grid gap-4 grid-cols-6 mb-4">
        {/* NHL */}
        <div className="col-span-5 portrait:col-span-6 xl:col-span-4 h-full">
          <Panel>
            <NhlPanel />
          </Panel>
        </div>

        {/* WEATHER */}
        <div className="col-span-1 xl:col-span-2 portrait:col-span-6 portrait:row-2">
          <Panel>
            {current != null && daily != null ? (
              <WeatherCard weather={current} daily={daily} />
            ) : (
              "Loading weather forecast..."
            )}
          </Panel>
        </div>
      </div>

      {/* CALENDAR */}
      <div className="col-span-6 h-full">
        <Panel>
          {calendarEvents != null ? (
            <CalendarPanel
              events={calendarEvents}
              daily={daily}
              eventColor={theme.secondary}
            />
          ) : (
            "Loading calendar..."
          )}
        </Panel>
      </div>
    </div>
  );
}

export default Dashboard;
