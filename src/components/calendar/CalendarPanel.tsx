import { useState } from "react";
import WeeklyCalendar from "./WeeklyCalendar";
import MonthlyCalendar from "./MonthlyCalendar";
import type { CalendarEvent, DailyForecast } from "@/types/app";

type CalendarPanelProps = {
  events: CalendarEvent[];
  daily: DailyForecast[];
};

type CalendarView = "weekly" | "monthly";

function CalendarPanel({ events, daily }: CalendarPanelProps) {
  const [view, setView] = useState<CalendarView>("weekly");

  return (
    <div className="animate-fade-in flex h-full w-full flex-col text-white">
      <div className="flex mb-2 ml-2 items-center justify-between">
        <div className="flex rounded-xl bg-black/30 text-sm">
          <button
            onClick={() => setView("weekly")}
            className={`rounded-lg px-3 py-1 transition ${
              view === "weekly"
                ? "bg-white/25 text-white"
                : "text-white/60 hover:text-white"
            }`}
          >
            Week
          </button>

          <button
            onClick={() => setView("monthly")}
            className={`rounded-lg px-3 py-1 transition ${
              view === "monthly"
                ? "bg-white/25 text-white"
                : "text-white/60 hover:text-white"
            }`}
          >
            Month
          </button>
        </div>
      </div>

      <div className="min-h-0 flex-1">
        {view === "weekly" ? (
          <WeeklyCalendar events={events} dailyForecast={daily} />
        ) : (
          <MonthlyCalendar events={events} />
        )}
      </div>
    </div>
  );
}

export default CalendarPanel;
