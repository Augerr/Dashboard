import DayWeatherHeader from "./ui/DayWeatherHeader"

function WeeklyCalendar({ events = [], dailyForecast }) {
  const forecasts = dailyForecast ?? [];
  const today = new Date()
  const daysToShow = 7
  const startHour = 8
  const endHour = 20
  const hourHeight = 48

  const days = Array.from({ length: daysToShow }, (_, i) => {
    const d = new Date()
    d.setDate(today.getDate() + i)
    d.setHours(0, 0, 0, 0)
    return d
  })

  const hours = Array.from(
    { length: endHour - startHour + 1 },
    (_, i) => startHour + i
  )

  const isSameDay = (a, b) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()

  const isWeekend = (date) => {
    const day = date.getDay()
    return day === 0 || day === 6 // Sunday (0) or Saturday (6)
  }
  const formatHour = (hour) => {
    if (hour === 0) return "12 AM"
    if (hour === 12) return "12 PM"
    return hour > 12 ? `${hour - 12} PM` : `${hour} AM`
  }

  const getEventsForDay = (day) => {
    return events.filter((event) => {
      const start = new Date(event.start)
      return isSameDay(start, day)
    })
  }

  const getEventStyle = (event) => {
    const start = new Date(event.start)
    const end = event.end ? new Date(event.end) : new Date(start.getTime() + 60 * 60 * 1000)

    const startDecimal = start.getHours() + start.getMinutes() / 60
    const endDecimal = end.getHours() + end.getMinutes() / 60

    const top = Math.max(0, (startDecimal - startHour) * hourHeight)
    const height = Math.max(32, (endDecimal - startDecimal) * hourHeight)

    return {
      top: `${top}px`,
      height: `${height}px`,
    }
  }

  const getCurrentTimePosition = () => {
    const now = new Date()
    const currentDecimal = now.getHours() + now.getMinutes() / 60

    if (currentDecimal < startHour || currentDecimal > endHour) {
      return null
    }

    return (currentDecimal - startHour) * hourHeight
  }

  return (
  <div className="h-full w-full overflow-x-auto">
    <div className="grid h-full min-w-[900px] grid-rows-[auto_1fr] gap-2">

      {/* WEATHER / DAY HEADERS */}
      <div className="grid grid-cols-[60px_1fr] gap-2">
        <div />

        <div className="grid grid-cols-7 gap-2">
          {days.map((day) => {
            const forecast = forecasts.find((forecastDay) =>
              isSameDay(new Date(forecastDay.date), day)
            );

            return (
              <DayWeatherHeader
                key={day.toISOString()}
                day={day}
                forecast={forecast}
              />
            );
          })}
        </div>
      </div>

      {/* HOURS + EVENTS BODY */}
      <div className="grid min-h-0 grid-cols-[60px_1fr] gap-2">
        
        {/* Hour labels column */}
        <div>
          {hours.map((hour) => (
            <div
              key={hour}
              className="flex items-start justify-end pr-2 text-xs text-white/40"
              style={{ height: `${hourHeight}px` }}
            >
              {formatHour(hour)}
            </div>
          ))}
        </div>

        {/* Day columns */}
        <div className="grid grid-cols-7 gap-2">
          {days.map((day) => {
            const dayEvents = getEventsForDay(day);
            const isToday = isSameDay(day, today);

            return (
              <div
                key={day.toISOString()}
                className={`
                  relative overflow-hidden rounded-2xl border
                  ${
                    isToday
                      ? "border-blue-400/40 bg-blue-500/10 shadow-[0_0_30px_rgba(59,130,246,0.18)]"
                      : isWeekend(day)
                      ? "border-white/5 bg-black/40"
                      : "border-white/10 bg-black/20"
                  }
                `}
                style={{ height: `${hours.length * hourHeight}px` }}
              >
                {/* Hour lines */}
                {hours.map((hour) => (
                  <div
                    key={hour}
                    className="border-t border-white/10"
                    style={{ height: `${hourHeight}px` }}
                  />
                ))}

                {/* Current time line */}
                {isToday && getCurrentTimePosition() !== null && (
                  <div
                    className="absolute left-0 right-0 z-20 flex items-center"
                    style={{ top: `${getCurrentTimePosition()}px` }}
                  >
                    <div className="h-2 w-2 rounded-full bg-red-400 shadow-lg shadow-red-500/50" />
                    <div className="h-[2px] flex-1 bg-red-400 shadow-lg shadow-red-500/40" />
                  </div>
                )}

                {/* Events */}
                {dayEvents.map((event) => {
                  const start = new Date(event.start);
                  const allDay = !event.start.includes("T");

                  if (allDay) {
                    return (
                      <div
                        key={event.id}
                        className="absolute left-2 right-2 top-2 rounded-xl bg-purple-500/80 p-2 text-xs text-white"
                      >
                        {event.title}
                      </div>
                    );
                  }

                  return (
                    <div
                      key={event.id}
                      className="
                        absolute left-2 right-2
                        overflow-hidden rounded-xl
                        border border-white/20
                        bg-blue-500/80
                        p-2 text-xs text-white
                        shadow-lg
                      "
                      style={getEventStyle(event)}
                    >
                      <div className="truncate font-semibold">
                        {event.title}
                      </div>

                      <div className="mt-1 text-white/80">
                        {start.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  </div>
  );
}

export default WeeklyCalendar