function ForecastStrip({ daily }) {
  if (!daily) return null
  return (
    <div className="w-full flex flex-row gap-3 overflow-x-auto pb-2">

      {daily.slice(0, 5).map((day, i) => {
        const date = day.date.slice(0,3)

        return (
          <div
            key={i}
            className="text-center flex-shrink-0 flex- rounded-xl bg-white/10 mt-2"
          >
            <p className="text-sm opacity-80">{date}</p>

            <img
              className="mx-auto w-8 h-8"
              src={`https://openweathermap.org/img/wn/${day.icon}.png`}
              alt=""
            />

            <p className="text-sm">
              {Math.round(day.max)}°
            </p>

            <p className="text-sm opacity-50">
              {Math.round(day.min)}°
            </p>
          </div>
        )
      })}
    </div>
  )
}

export default ForecastStrip