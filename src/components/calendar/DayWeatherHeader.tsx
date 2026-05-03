import type { DailyForecast } from "@/types/app";

type DayWeatherHeaderProps = {
  day: Date;
  forecast?: DailyForecast;
};

function DayWeatherHeader({ day, forecast }: DayWeatherHeaderProps) {
  const icon = forecast?.icon;
  const min = forecast?.min;
  const max = forecast?.max;

  return (
    <div className="flex items-center rounded-xl bg-black/30 px-3 py-2 text-white">
      {/* ICON (bigger + pushed left) */}
      <div className="flex w-14 2xl:w-16 justify-start">
        {icon && (
          <img
            className="h-12 w-12 2xl:w-16 2xl:h-16"
            src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
            alt=""
          />
        )}
      </div>

      {/* RIGHT CONTENT */}
      <div className="flex flex-1 flex-col items-center text-center mr-4 2xl:mr-12">
        {/* DATE */}
        <p className="text-base font-semibold leading-tight">
          {day.toLocaleDateString([], { weekday: "short" })}
        </p>
        <p className="text-xs fonnt-bold text-white/60 leading-tight">
          {day.toLocaleDateString([], { month: "short", day: "numeric" })}
        </p>

        {/* TEMPS CENTERED */}
        <div className="flex w-full justify-center">
          <span className="font-bold text-orange-300">
            {max != null ? `${Math.round(max)}°` : "--"}
          </span>
          <span className="font-semibold mx-1">/</span>
          <span className="font-bold text-blue-300">
            {min != null ? `${Math.round(min)}°` : ""}
          </span>
        </div>
      </div>
    </div>
  );
}

export default DayWeatherHeader;
