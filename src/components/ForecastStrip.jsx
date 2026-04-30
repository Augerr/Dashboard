function ForecastStrip({ daily }) {
  if (!daily) return null

  return (
    <div>

      <div className="flex gap-2 overflow-hidden scroll-smooth snap-x">

        {daily.slice(0, 7).map((day, i) => {
          const date = day.date.slice(0,3)

          return (
            <div
              key={i}
              className="min-w-[82px] snap-start flex-shrink-0
                         bg-white/10 backdrop-blur-xl
                         border border-white/10
                         rounded-2xl p-2 text-center text-white"
            >
              <p className="text-md opacity-80">{date}</p>

              <img
                className="mx-auto w-8 h-8"
                src={`https://openweathermap.org/img/wn/${day.icon}.png`}
                alt=""
              />

              <p className="text-md font-medium">
                {Math.round(day.max)}°
              </p>

              <p className="text-sm opacity-60">
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