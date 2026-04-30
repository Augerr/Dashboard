function WeeklyCalendar({ events = [] }) {
  const today = new Date()

  const daysToShow = 5
  const startHour = 6
  const endHour = 22
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

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white/80 text-lg font-semibold">
          Calendar
        </h3>

        <span className="text-white/50 text-sm">
          Next {daysToShow} days
        </span>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[720px] grid grid-cols-[64px_repeat(5,1fr)] gap-2">

          {/* Empty top-left */}
          <div />

          {/* Day headers */}
          {days.map((day) => {
            const isToday = isSameDay(day, today)

            return (
              <div
                key={day.toISOString()}
                className={`
                  text-center rounded-xl py-2
                  ${isToday ? "bg-blue-500 text-white" : "bg-white/5 text-white/70"}
                `}
              >
                <div className="text-xs">
                  {day.toLocaleDateString([], { weekday: "short" })}
                </div>
                <div className="text-lg font-semibold">
                  {day.getDate()}
                </div>
              </div>
            )
          })}

          {/* Time labels */}
          <div className="relative">
            {hours.map((hour) => (
              <div
                key={hour}
                className="text-xs text-white/40"
                style={{ height: `${hourHeight}px` }}
              >
                {formatHour(hour)}
              </div>
            ))}
          </div>

          {/* Day columns */}
          {days.map((day) => {
            const dayEvents = getEventsForDay(day)

            return (
              <div
                key={day.toISOString()}
                className="relative bg-white/5 rounded-2xl border border-white/10 overflow-hidden"
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

                {/* Events */}
                {dayEvents.map((event) => {
                  const start = new Date(event.start)
                  const allDay = !event.start.includes("T")

                  if (allDay) {
                    return (
                      <div
                        key={event.id}
                        className="absolute top-2 left-2 right-2 rounded-xl bg-purple-500/80 p-2 text-xs text-white"
                      >
                        {event.title}
                      </div>
                    )
                  }

                  return (
                    <div
                      key={event.id}
                      className="
                        absolute left-2 right-2
                        rounded-xl
                        bg-blue-500/80
                        border border-white/20
                        p-2
                        text-xs
                        text-white
                        shadow-lg
                        overflow-hidden
                      "
                      style={getEventStyle(event)}
                    >
                      <div className="font-semibold truncate">
                        {event.title}
                      </div>

                      <div className="text-white/80 mt-1">
                        {start.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default WeeklyCalendar