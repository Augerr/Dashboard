import type { CalendarEvent, CurrentWeather, DailyForecast } from "@/types/app";
import { fetchCalendar } from "@/services/api";
import { fetchWeather, fetchForecast } from "@/services/weather";
import { groupToDaily } from "@/utils/groupForecast";
import { retryAsync } from "@/utils/retry";
import { useAutoRefresh } from "@/hooks/useAutoRefresh";
import {
  Box,
  Chip,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CloudIcon from "@mui/icons-material/Cloud";
import DashboardCustomizeIcon from "@mui/icons-material/DashboardCustomize";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { ReactElement } from "react";

type TimelineItem = {
  id: string;
  type: "calendar" | "weather" | "nhl" | "market";
  title: string;
  subtitle?: string;
  time: Date;
  priority?: "normal" | "high";
};

function CommandCenter() {
  const [now, setNow] = useState(new Date());
  const [current, setCurrent] = useState<CurrentWeather | undefined>();
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

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useAutoRefresh(loadWeather, 1800000);
  useAutoRefresh(loadCalendar, 1200000);

  const nextHours = 6;
  const windowEnd = useMemo(
    () => new Date(now.getTime() + nextHours * 60 * 60 * 1000),
    [now],
  );

  const timelineItems = useMemo<TimelineItem[]>(() => {
    const calendarItems: TimelineItem[] = calendarEvents
      .filter((event) => {
        const start = new Date(event.start);
        return start >= now && start <= windowEnd;
      })
      .map((event) => ({
        id: String(event.id),
        type: "calendar",
        title: event.title,
        subtitle: "Calendar event",
        time: new Date(event.start),
        priority: "normal",
      }));

    const weatherItems: TimelineItem[] = daily
      .filter((forecast) => {
        const forecastTime = new Date(forecast.date);
        return forecastTime >= now && forecastTime <= windowEnd;
      })
      .map((forecast) => {
        const condition = forecast.weather?.main ?? "Weather";
        const max = forecast.max != null ? Math.round(forecast.max) : null;
        const min = forecast.min != null ? Math.round(forecast.min) : null;

        return {
          id: `weather-${forecast.date}`,
          type: "weather",
          title: `${condition} expected`,
          subtitle:
            max != null && min != null
              ? `High ${max} / Low ${min}`
              : "Weather forecast",
          time: new Date(forecast.date),
          priority:
            condition === "Rain" ||
            condition === "Snow" ||
            condition === "Thunderstorm"
              ? "high"
              : "normal",
        };
      });

    return [...calendarItems, ...weatherItems].sort(
      (a, b) => a.time.getTime() - b.time.getTime(),
    );
  }, [calendarEvents, daily, now, windowEnd]);

  const upcomingEvents = useMemo(() => {
    return calendarEvents
      .filter((event) => {
        const start = new Date(event.start);
        return start >= now && start <= windowEnd;
      })
      .sort(
        (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime(),
      );
  }, [calendarEvents, now, windowEnd]);

  const nextEvent = timelineItems[0];

  const timeText = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const dateText = now.toLocaleDateString([], {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <Box component="main" className="min-h-screen bg-slate-950 p-4 text-white">
      <Box className="mx-auto grid max-w-[1800px] grid-cols-12 gap-4">
        <Paper className="col-span-12 rounded-lg bg-white/10 p-5 shadow-2xl backdrop-blur-2xl">
          <Stack className="gap-3 xl:flex-row xl:items-center xl:justify-between">
            <Box>
              <Stack direction="row" className="mb-1 items-center gap-2">
                <DashboardCustomizeIcon fontSize="small" className="text-white/50" />
                <Typography className="text-sm uppercase tracking-wide text-white/50">
                  Command Center
                </Typography>
              </Stack>
              <Typography component="h1" className="text-5xl font-bold">
                {timeText}
              </Typography>
              <Typography className="mt-1 text-white/60">{dateText}</Typography>
            </Box>

            <Paper className="rounded-lg bg-black/30 px-5 py-4 text-right">
              <Typography className="text-sm text-white/50">Next up</Typography>
              {nextEvent ? (
                <>
                  <Typography className="text-xl font-semibold">
                    {nextEvent.title}
                  </Typography>
                  <Typography className="text-sm text-white/60">
                    {formatCountdown(nextEvent.time, now)}
                  </Typography>
                </>
              ) : (
                <Typography className="text-xl font-semibold text-white/70">
                  No events in the next {nextHours} hours
                </Typography>
              )}
            </Paper>
          </Stack>
        </Paper>

        <Paper className="col-span-12 rounded-lg bg-white/10 p-5 shadow-2xl backdrop-blur-2xl xl:col-span-8">
          <Stack direction="row" className="mb-4 items-center justify-between">
            <Typography component="h2" className="text-2xl font-bold">
              Next {nextHours} Hours
            </Typography>
            <Chip
              size="small"
              label={`${timelineItems.length} event${
                timelineItems.length === 1 ? "" : "s"
              }`}
              className="bg-black/20 text-white/60"
            />
          </Stack>

          <Stack spacing={1.5}>
            {timelineItems.length > 0 ? (
              timelineItems.map((item, index) => (
                <TimelineEvent
                  key={item.id}
                  item={item}
                  now={now}
                  isNext={index === 0}
                />
              ))
            ) : (
              <Paper className="rounded-lg border border-white/10 bg-black/20 p-6 text-center text-white/60">
                Nothing scheduled soon.
              </Paper>
            )}
          </Stack>
        </Paper>

        <Stack component="aside" className="col-span-12 gap-4 xl:col-span-4">
          <MiniWeather current={current} daily={daily} />
          <MiniMarket />
          <MiniStatus />
        </Stack>

        <Paper className="col-span-12 rounded-lg bg-white/10 p-5 shadow-2xl backdrop-blur-2xl">
          <Typography component="h2" className="mb-3 text-xl font-bold">
            Today at a glance
          </Typography>

          <Box className="grid gap-3 md:grid-cols-3">
            <InfoCard label="Upcoming" value={`${upcomingEvents.length}`} />
            <InfoCard label="Window" value={`${nextHours} hours`} />
            <InfoCard
              label="Weather"
              value={
                current?.weather?.[0]?.main ??
                current?.weather?.[0]?.description ??
                "Unknown"
              }
            />
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}

function TimelineEvent({
  item,
  now,
  isNext,
}: {
  item: TimelineItem;
  now: Date;
  isNext: boolean;
}) {
  const start = item.time;
  const Icon = item.type === "weather" ? CloudIcon : CalendarMonthIcon;

  return (
    <Paper
      className={`flex items-center gap-4 rounded-lg border p-4 transition ${
        isNext
          ? "border-blue-300/40 bg-blue-500/20 shadow-lg shadow-blue-500/20"
          : item.type === "weather"
            ? "border-yellow-300/30 bg-yellow-500/10"
            : "border-white/10 bg-black/20"
      }`}
    >
      <Box className="w-20 shrink-0 text-center">
        <Typography className="text-lg font-bold">
          {start.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Typography>
        <Typography className="text-xs text-white/50">
          {formatCountdown(start, now)}
        </Typography>
      </Box>

      <Divider orientation="vertical" flexItem className="border-white/20" />

      <Icon className="shrink-0 text-white/60" />

      <Box className="min-w-0 flex-1">
        <Typography className="truncate text-lg font-semibold">
          {item.title}
        </Typography>
        <Typography className="text-sm text-white/50">
          {item.type === "weather" ? "Weather" : item.subtitle}
        </Typography>
      </Box>

      {isNext && (
        <Chip
          size="small"
          label="Next"
          className="bg-blue-400/20 font-semibold text-blue-200"
        />
      )}
    </Paper>
  );
}

function MiniWeather({
  current,
  daily,
}: {
  current?: CurrentWeather;
  daily?: DailyForecast[];
}) {
  const temp =
    current?.main?.temp != null ? Math.round(current.main.temp) : null;
  const icon = current?.weather?.[0]?.icon;
  const condition = current?.weather?.[0]?.main ?? "Weather";

  return (
    <Paper className="rounded-lg bg-white/10 p-5 shadow-2xl backdrop-blur-2xl">
      <Typography component="h2" className="mb-3 text-xl font-bold">
        Weather
      </Typography>

      <Stack direction="row" className="items-center justify-center gap-3">
        {icon && (
          <img
            className="h-20 w-20"
            src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
            alt=""
          />
        )}

        <Box>
          <Typography className="text-5xl font-bold">
            {temp != null ? `${temp}°` : "--"}
          </Typography>
          <Typography className="text-white/60">{condition}</Typography>
        </Box>
      </Stack>

      <Box className="mt-4 grid grid-cols-3 gap-2 text-center text-sm">
        {daily?.slice(0, 3).map((day, index) => {
          const max = day?.max;
          const min = day?.min;

          return (
            <Paper key={index} className="rounded-lg bg-black/20 p-2">
              <Typography className="font-semibold">
                {day?.date
                  ? new Date(day.date).toLocaleDateString([], {
                      weekday: "short",
                    })
                  : `Day ${index + 1}`}
              </Typography>
              <Typography className="text-xs text-white/60">
                {max != null ? Math.round(max) : "--"}° /{" "}
                {min != null ? Math.round(min) : "--"}°
              </Typography>
            </Paper>
          );
        })}
      </Box>
    </Paper>
  );
}

function MiniMarket() {
  return (
    <Paper className="rounded-lg bg-white/10 p-5 shadow-2xl backdrop-blur-2xl">
      <Typography component="h2" className="mb-3 text-xl font-bold">
        Market Pulse
      </Typography>

      <Stack spacing={1} className="text-sm">
        <StatusRow label="SPY" value="Coming soon" icon={<ShowChartIcon />} />
        <StatusRow label="BTC" value="Coming soon" icon={<ShowChartIcon />} />
      </Stack>
    </Paper>
  );
}

function MiniStatus() {
  return (
    <Paper className="rounded-lg bg-white/10 p-5 shadow-2xl backdrop-blur-2xl">
      <Typography component="h2" className="mb-3 text-xl font-bold">
        System
      </Typography>

      <Stack spacing={1} className="text-sm text-white/70">
        <Typography>Dashboard online</Typography>
        <Typography>Auto-refresh active</Typography>
        <Typography>Kiosk mode ready</Typography>
      </Stack>
    </Paper>
  );
}

function StatusRow({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: ReactElement;
}) {
  return (
    <Paper className="flex items-center justify-between rounded-lg bg-black/20 p-3">
      <Stack direction="row" className="items-center gap-2">
        {icon}
        <Typography>{label}</Typography>
      </Stack>
      <Typography className="text-white/50">{value}</Typography>
    </Paper>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <Paper className="rounded-lg bg-black/20 p-4">
      <Typography className="text-sm text-white/50">{label}</Typography>
      <Typography className="mt-1 text-2xl font-bold">{value}</Typography>
    </Paper>
  );
}

function formatCountdown(target: Date, now: Date) {
  const diffMs = target.getTime() - now.getTime();

  if (diffMs <= 0) return "Now";

  const minutes = Math.ceil(diffMs / 60000);
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours <= 0) return `in ${mins} min`;
  if (mins === 0) return `in ${hours}h`;

  return `in ${hours}h ${mins}m`;
}

export default CommandCenter;
