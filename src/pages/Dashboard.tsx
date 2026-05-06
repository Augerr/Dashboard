import { useCallback, useEffect, useState } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
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
    return (
      <Box className="flex h-screen items-center justify-center bg-black">
        <CircularProgress color="primary" />
      </Box>
    );
  }

  const condition = current.weather[0]?.main ?? "default";
  const theme = weatherTheme[condition] ?? weatherTheme.default;

  return (
    <Box
      component="main"
      className={`min-h-screen bg-gradient-to-br ${theme.bg} animated-bg p-4`}
    >
      <Box className="mx-auto mb-4 grid grid-cols-6 gap-4">
        <Box className="col-span-5 h-full portrait:col-span-6 xl:col-span-4 ">
          <Panel>
            <NhlPanel />
          </Panel>
        </Box>

        <Box className="col-span-1 portrait:col-span-6 portrait:row-2 xl:col-span-2">
          <Panel>
            {current != null && daily != null ? (
              <WeatherCard weather={current} daily={daily} />
            ) : (
              <Typography color="text.secondary">
                Loading weather forecast...
              </Typography>
            )}
          </Panel>
        </Box>
      </Box>

      <Box className="col-span-6 h-full">
        <Panel>
          {calendarEvents != null ? (
            <CalendarPanel
              events={calendarEvents}
              daily={daily}
              eventColor={theme.secondary}
            />
          ) : (
            <Typography color="text.secondary">Loading calendar...</Typography>
          )}
        </Panel>
      </Box>
    </Box>
  );
}

export default Dashboard;
