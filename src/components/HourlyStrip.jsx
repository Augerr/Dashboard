function HourlyStrip({ data }) {
  const hourly = data?.list?.slice(0, 12) || []

  if (!hourly.length) return null

  return (
    <div>

      <h3 className="text-white/80 text-sm mb-3">
        Hourly Forecast
      </h3>

      <div className="flex gap-3 overflow-x-auto pb-2 scroll-smooth snap-x">

        {hourly.map((item, i) => {
          const date = new Date(item.dt * 1000)
          const hour = date.getHours()
          const label = hour === 0 ? "12AM"
            : hour === 12 ? "12PM"
            : hour > 12 ? `${hour - 12}PM`
            : `${hour}AM`

          return (
            <div
              key={i}
              className="min-w-[80px] snap-start flex-shrink-0
                         bg-white/10 backdrop-blur-xl
                         border border-white/10
                         rounded-2xl p-3 text-center text-white"
            >

              {/* Time */}
              <p className="text-xs text-white/80">
                {label}
              </p>

              {/* Icon */}
              <img
                className="mx-auto"
                src={`https://openweathermap.org/img/wn/${item.weather?.[0]?.icon}.png`}
                alt="weather icon"
              />

              {/* Temp */}
              <p className="text-sm font-medium">
                {Math.round(item.main.temp)}°
              </p>

            </div>
          )
        })}

      </div>
    </div>
  )
}

export default HourlyStrip