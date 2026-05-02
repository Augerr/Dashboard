import type { DailyForecast } from "../types/app";

type ForecastStripProps = {
  daily: DailyForecast[];
};

function ForecastStrip({ daily }: ForecastStripProps) {
  if (!daily) return null;
  return (
    <div className="flex h-full min-h-0 w-full gap-2 overflow-x-auto">
      {daily.slice(0, 5).map((day, i) => {
        const date = day?.date?.toDateString().slice(0, 3);
        return (
          <div
            key={i}
            className="flex min-w-[70px] flex-col items-center justify-center rounded-xl bg-white/10 p-2 text-center xl:min-w-0 xl:flex-1"
          >
            <p className="text-sm font-semibold opacity-80">{date}</p>

            <img
              className="h-9 w-9 2xl:h-12 2xl:w-12"
              src={`https://openweathermap.org/img/wn/${day.icon}.png`}
              alt=""
            />

            <p className="text-sm font-bold text-orange-300">
              {Math.round(day.max)}°
            </p>

            <p className="text-sm font-semibold text-blue-300">
              {Math.round(day.min)}°
            </p>
          </div>
        );
      })}
    </div>
  );
}

export default ForecastStrip;
