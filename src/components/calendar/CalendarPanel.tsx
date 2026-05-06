import { useState } from "react";
import type { MouseEvent } from "react";
import { Box, ToggleButton, ToggleButtonGroup } from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ViewWeekIcon from "@mui/icons-material/ViewWeek";
import WeeklyCalendar from "./WeeklyCalendar";
import MonthlyCalendar from "./MonthlyCalendar";
import type { CalendarEvent, DailyForecast } from "@/types/app";

type CalendarPanelProps = {
  events: CalendarEvent[];
  daily: DailyForecast[];
  eventColor: string;
};

type CalendarView = "weekly" | "monthly";

function CalendarPanel({ events, daily, eventColor }: CalendarPanelProps) {
  const [view, setView] = useState<CalendarView>("weekly");

  const handleViewChange = (
    _event: MouseEvent<HTMLElement>,
    nextView: CalendarView | null,
  ) => {
    if (nextView) setView(nextView);
  };

  return (
    <Box className="animate-fade-in flex h-full w-full flex-col text-white">
      <Box className="mb-2 ml-2 flex items-center justify-between">
        <ToggleButtonGroup
          exclusive
          size="small"
          value={view}
          onChange={handleViewChange}
          className="rounded-lg bg-black/30 p-1"
          aria-label="Calendar view"
        >
          <ToggleButton value="weekly" className="gap-1 rounded-lg px-3 py-1">
            <ViewWeekIcon fontSize="small" />
            Week
          </ToggleButton>
          <ToggleButton value="monthly" className="gap-1 rounded-lg px-3 py-1">
            <CalendarMonthIcon fontSize="small" />
            Month
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Box className="min-h-0 flex-1">
        {view === "weekly" ? (
          <WeeklyCalendar
            events={events}
            dailyForecast={daily}
            eventColor={eventColor}
          />
        ) : (
          <MonthlyCalendar events={events} eventColor={eventColor} />
        )}
      </Box>
    </Box>
  );
}

export default CalendarPanel;
