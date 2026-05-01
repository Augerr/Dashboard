function ForecastStrip({ daily }) {
  if (!daily) return null
  return (
    <div className="flex w-full gap-2 overflow-x-auto">

      {daily.slice(0, 5).map((day, i) => (
          <div
            key={i}
            className="min-w-[70px] xl:min-w-0 xl:flex-1 rounded-xl bg-white/10 p-2 text-center"
          >
            <p className="text-sm opacity-80">{day.date.slice(0,3)}</p>

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
      )}
    </div>
  )
}

export default ForecastStrip