function ForecastStrip({ daily }) {
  if (!daily) return null

  return (
    <div>

      <h3 className="text-white/80 text-sm mb-3">
        7-Day Forecast
      </h3>

      <div className="flex gap-3 overflow-hidden pb-2 scroll-smooth snap-x">

        {daily.slice(0, 7).map((day, i) => {
          const date = day.date.slice(0,3)//new Date(day.dt * 1000)
          //const label = date.toLocaleDateString("en-US", { weekday: "short" })

          return (
            <div
              key={i}
              className="min-w-[80px] snap-start flex-shrink-0
                         bg-white/10 backdrop-blur-xl
                         border border-white/10
                         rounded-2xl p-3 text-center text-white"
            >
              <p className="text-xs opacity-70">{date}</p>

              <img
                className="mx-auto"
                src={`https://openweathermap.org/img/wn/${day.icon}.png`}
                alt=""
              />

              <p className="text-sm font-medium">
                {Math.round(day.max)}°
              </p>

              <p className="text-xs opacity-60">
                {Math.round(day.min)}°
              </p>
            </div>
          )
        })}

      </div>
    </div>
  )
}

export default ForecastStrip