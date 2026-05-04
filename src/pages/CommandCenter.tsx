import type { CalendarEvent, CurrentWeather, DailyForecast } from "@/types/app";
import { fetchCalendar } from "@/services/api";
import { fetchWeather, fetchForecast } from "@/services/weather";
import { groupToDaily } from "@/utils/groupForecast";
import { retryAsync } from "@/utils/retry";
import { useAutoRefresh } from "@/hooks/useAutoRefresh";
import { useCallback, useEffect, useMemo, useState } from "react";

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
  const windowEnd = new Date(now.getTime() + nextHours * 60 * 60 * 1000);

  const timelineItems = useMemo<TimelineItem[]>(() => {
    const calendarItems: TimelineItem[] = calendarEvents
      .filter((event) => {
        const start = new Date(event.start);
        return start >= now && start <= windowEnd;
      })
      .map((event) => ({
        id: event.id,
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
              ? `High ${max}° / Low ${min}°`
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
    <main className="min-h-screen bg-slate-950 p-4 text-white">
      <div className="mx-auto grid max-w-[1800px] grid-cols-12 gap-4">
        {/* NOW BAR */}
        <section className="col-span-12 rounded-3xl bg-white/10 p-5 shadow-2xl backdrop-blur-2xl">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <p className="text-sm uppercase tracking-wide text-white/50">
                Command Center
              </p>
              <h1 className="text-5xl font-bold tracking-tight">{timeText}</h1>
              <p className="mt-1 text-white/60">{dateText}</p>
            </div>

            <div className="rounded-2xl bg-black/30 px-5 py-4 text-right">
              <p className="text-sm text-white/50">Next up</p>
              {nextEvent ? (
                <>
                  <p className="text-xl font-semibold">{nextEvent.title}</p>
                  <p className="text-sm text-white/60">
                    {formatCountdown(nextEvent.time, now)}
                  </p>
                </>
              ) : (
                <p className="text-xl font-semibold text-white/70">
                  No events in the next {nextHours} hours
                </p>
              )}
            </div>
          </div>
        </section>

        {/* TIMELINE */}
        <section className="col-span-12 rounded-3xl bg-white/10 p-5 shadow-2xl backdrop-blur-2xl xl:col-span-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold">Next {nextHours} Hours</h2>
            <span className="text-sm text-white/50">
              {timelineItems.length} event
              {timelineItems.length === 1 ? "" : "s"}
            </span>
          </div>

          <div className="space-y-3">
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
              <div className="rounded-2xl border border-white/10 bg-black/20 p-6 text-center text-white/60">
                Nothing scheduled soon.
              </div>
            )}
          </div>
        </section>

        {/* RIGHT CONTEXT */}
        <aside className="col-span-12 flex flex-col gap-4 xl:col-span-4">
          <MiniWeather current={current} daily={daily} />
          <MiniMarket />
          <MiniStatus />
        </aside>

        {/* BOTTOM */}
        <section className="col-span-12 rounded-3xl bg-white/10 p-5 shadow-2xl backdrop-blur-2xl">
          <h2 className="mb-3 text-xl font-bold">Today at a glance</h2>

          <div className="grid gap-3 md:grid-cols-3">
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
          </div>
        </section>
      </div>
    </main>
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

  return (
    <div
      className={`
        flex items-center gap-4 rounded-2xl border p-4 transition
        ${
          isNext
            ? "border-blue-300/40 bg-blue-500/20 shadow-lg shadow-blue-500/20"
            : item.type === "weather"
              ? "border-yellow-300/30 bg-yellow-500/10"
              : "border-white/10 bg-black/20"
        }
      `}
    >
      <div className="w-20 shrink-0 text-center">
        <p className="text-lg font-bold">
          {start.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
        <p className="text-xs text-white/50">{formatCountdown(start, now)}</p>
      </div>

      <div className="h-12 w-[2px] rounded-full bg-white/20" />

      <div className="min-w-0 flex-1">
        <p className="truncate text-lg font-semibold">{item.title}</p>
        <p className="text-sm text-white/50">
          {item.type === "weather" ? "Weather" : item.subtitle}
        </p>
      </div>

      {isNext && (
        <span className="rounded-full bg-blue-400/20 px-3 py-1 text-sm font-semibold text-blue-200">
          Next
        </span>
      )}
    </div>
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
    <section className="rounded-3xl bg-white/10 p-5 shadow-2xl backdrop-blur-2xl">
      <h2 className="mb-3 text-xl font-bold">Weather</h2>

      <div className="flex items-center justify-center gap-3">
        {icon && (
          <img
            className="h-20 w-20"
            src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
            alt=""
          />
        )}

        <div>
          <p className="text-5xl font-bold">
            {temp != null ? `${temp}°` : "--"}
          </p>
          <p className="text-white/60">{condition}</p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 text-center text-sm">
        {daily?.slice(0, 3).map((day, index) => {
          const max = day?.max;
          const min = day?.min;

          return (
            <div key={index} className="rounded-xl bg-black/20 p-2">
              <p className="font-semibold">
                {day?.date
                  ? new Date(day.date).toLocaleDateString([], {
                      weekday: "short",
                    })
                  : `Day ${index + 1}`}
              </p>
              <p className="text-xs text-white/60">
                {max != null ? Math.round(max) : "--"}° /{" "}
                {min != null ? Math.round(min) : "--"}°
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function MiniMarket() {
  return (
    <section className="rounded-3xl bg-white/10 p-5 shadow-2xl backdrop-blur-2xl">
      <h2 className="mb-3 text-xl font-bold">Market Pulse</h2>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between rounded-xl bg-black/20 p-3">
          <span>SPY</span>
          <span className="text-white/50">Coming soon</span>
        </div>
        <div className="flex justify-between rounded-xl bg-black/20 p-3">
          <span>BTC</span>
          <span className="text-white/50">Coming soon</span>
        </div>
      </div>
    </section>
  );
}

function MiniStatus() {
  return (
    <section className="rounded-3xl bg-white/10 p-5 shadow-2xl backdrop-blur-2xl">
      <h2 className="mb-3 text-xl font-bold">System</h2>

      <div className="space-y-2 text-sm text-white/70">
        <p>Dashboard online</p>
        <p>Auto-refresh active</p>
        <p>Kiosk mode ready</p>
      </div>
    </section>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-black/20 p-4">
      <p className="text-sm text-white/50">{label}</p>
      <p className="mt-1 text-2xl font-bold">{value}</p>
    </div>
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
