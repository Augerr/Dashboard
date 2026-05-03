import type { CalendarEvent } from "@/types/app";
import { getEventsForDay, isPastDay, isSameDay } from "@/utils/dateUtils";

type MonthlyCalendarProps = {
  events?: CalendarEvent[];
  eventColor: string;
};

function MonthlyCalendar({ events = [], eventColor }: MonthlyCalendarProps) {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const startDay = firstDay.getDay();
  const daysInMonth = lastDay.getDate();

  const cells: Array<Date | null> = [];

  for (let i = 0; i < startDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));

  return (
    <div className="animate-fade-in flex flex-col grid h-full min-h-0">
      <div className="grid grid-cols-7 gap-2 text-center ">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div className="text-sm text-white/90 mb-2" key={d}>
            {d}
          </div>
        ))}
        <div className="shrink-0">
          <h2
            className="col-1 absolute top-8 left-8 text-white
              font-serif font-bold text-center text-2xl"
          >
            May 2026
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-4">
        {cells.map((day, index) => {
          const dayEvents = getEventsForDay(events, day);
          const isToday = isSameDay(day, today);

          return (
            <div
              key={index}
              className={`
                min-h-0
                rounded-2xl
                border flex flex-col
                p-2 grid-col-7 grid-rows-6 gap-2
                overflow-hidden
                ${isPastDay(day) ? "opacity-40 grayscale pointer-events-none" : ""}
                ${day ? "bg-black/2 border-white/50" : "bg-transparent border-transparent"}
                ${isToday ? "ring-4 ring-stone/70 shadow-lg shadow-blue-500/20" : ""}
              `}
            >
              {day && (
                <>
                  <div className="flex justify-between items-center mb-2">
                    <span
                      className={`p-4
                        flex items-center justify-center 
                        w-6 h-6 rounded-full text-xl font-bold
                        ${isToday ? "bg-green-400/90 text-white" : "text-white/70"}
                      `}
                    >
                      {day.getDate()}
                    </span>
                  </div>
                  {/* Events */}
                  <div className="mt-2 min-h-0 flex-1 space-y-1 overflow-y-auto pr-1">
                    {dayEvents.map((event) => {
                      const start = new Date(event.start);
                      const allDay = !event.start.includes("T");

                      return (
                        <div
                          key={event.id}
                          style={{ backgroundColor: eventColor }}
                          className={`
                            truncate 
                            rounded-lg 
                            px-2 font-semibold
                            py-1 
                            text-xs text-white`}
                        >
                          {!allDay && (
                            <span className="text-white/70 mr-1">
                              {start.toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          )}

                          {event.title}
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default MonthlyCalendar;
