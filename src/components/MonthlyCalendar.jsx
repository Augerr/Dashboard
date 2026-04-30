function MonthlyCalendar({ events = [] }) {
  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth()

  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)

  const startDay = firstDay.getDay()
  const daysInMonth = lastDay.getDate()

  const cells = []

  for (let i = 0; i < startDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d))

  const isSameDay = (a, b) =>
    a &&
    b &&
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()

  const getEventsForDay = (day) => {
    if (!day) return []

    return events.filter((event) => {
      const eventDate = new Date(event.start)
      return isSameDay(eventDate, day)
    })
  }

  return (
    <div>
      <div className="grid grid-cols-7 gap-2 text-center text-sm text-white/50 mb-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {cells.map((day, index) => {
          const dayEvents = getEventsForDay(day)
          const isToday = isSameDay(day, today)

          return (
            <div
              key={index}
              className={`
                min-h-[110px]
                rounded-2xl
                border
                p-2
                overflow-hidden
                ${day ? "bg-black/20 border-white/10" : "bg-transparent border-transparent"}
                ${isToday ? "ring-2 ring-blue-400 shadow-lg shadow-blue-500/20" : ""}
              `}
            >
              {day && (
                <>
                  <div className="flex justify-between items-center mb-2">
                    <span
                      className={`
                        flex items-center justify-center
                        w-7 h-7 rounded-full text-sm font-semibold
                        ${isToday ? "bg-blue-500 text-white" : "text-white/70"}
                      `}
                    >
                      {day.getDate()}
                    </span>

                    {dayEvents.length > 0 && (
                      <span className="text-xs text-white/40">
                        {dayEvents.length}
                      </span>
                    )}
                  </div>

                  <div className="space-y-1">
                    {dayEvents.slice(0, 3).map((event) => {
                      const start = new Date(event.start)
                      const allDay = !event.start.includes("T")

                      return (
                        <div
                          key={event.id}
                          className="
                            truncate
                            rounded-lg
                            bg-blue-500/70
                            px-2 py-1
                            text-xs
                            text-white
                          "
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
                      )
                    })}

                    {dayEvents.length > 3 && (
                      <div className="text-xs text-white/40 px-1">
                        +{dayEvents.length - 3} more
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default MonthlyCalendar