function WeeklyCalendar({ events = [] }) {
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
    <div>
      <div className="overflow-x-auto">
        <div className="min-w-[720px] grid grid-cols-[64px_repeat(7,1fr)] gap-2">

          {/* Empty top-left */}
          <div />

          {/* Day headers */}
          {days.map((day) => {
            const isToday = isSameDay(day, today)

            return (
              <div
                key={day.toISOString()}
                className={`text-center rounded-xl py-1
                  ${isToday ? "bg-blue-500 text-white" : 
                    isWeekend(day) ? "bg-white/10 text-white/60" : "bg-white/20 text-white/70"}
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
                className="text-sm text-white/40"
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
                className={`
                  relative rounded-2xl border overflow-hidden
                  ${isSameDay(day, today)} ? "bg-blue-500/10 border-blue-400/40 shadow-[0_0_30px_rgba(59,130,246,0.18)]" :
                  ${isWeekend(day)} ? "bg-black/40 border-white/5": "bg-black/20 border-white/10"}
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
                {isSameDay(day, today) && getCurrentTimePosition() !== null && (
                  <div
                    className="absolute left-0 right-0 z-20 flex items-center"
                    style={{ top: `${getCurrentTimePosition()}px` }}
                  >
                    <div className="w-2 h-2 rounded-full bg-red-400 shadow-lg shadow-red-500/50" />
                    <div className="flex-1 h-[2px] bg-red-400 shadow-lg shadow-red-500/40" />
                  </div>
                )}

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