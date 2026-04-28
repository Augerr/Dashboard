function Forecast({ daily }) {
  if (!daily) return null

  return (
    <div className="mt-6 w-full max-w-md space-y-2">
      {daily.slice(0, 7).map((day, index) => {
        const date = new Date(day.dt * 1000)
        const dayName = date.toLocaleDateString("en-US", { weekday: "short" })

        return (
          <div
            key={index}
            className="flex justify-between items-center bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl text-white border border-white/10"
          >
            <span className="w-12">{dayName}</span>

            <img
              src={`https://openweathermap.org/img/wn/${day.weather[0].icon}.png`}
              alt=""
            />

            <span className="opacity-80 text-sm">
              {Math.round(day.min)}° / {Math.round(day.max)}°
            </span>
          </div>
        )
      })}
    </div>
  )
}

export default Forecast