import type { DailyForecast, ForecastResponse } from "@/types/app"

type DailyAccumulator = {
  date: Date;
  icon: string;
  temps: number[];
  weather: DailyForecast["weather"];
};

export const groupToDaily = (forecast: ForecastResponse): DailyForecast[] => {
  const days: Record<number, DailyAccumulator> = {}

  for (const dayForecast of forecast.list) {
    const date = new Date(dayForecast.dt * 1000)
    const dayOfMonth = date.getDate()
    if (!days[dayOfMonth]) {
      days[dayOfMonth] = {
        date: date,
        icon: "",
        temps: [],
        weather: dayForecast.weather[0],
      }
    }

    if(dayForecast.weather[0].icon.includes('d'))
        days[dayOfMonth].icon = dayForecast.weather[0].icon;
    else 
        days[dayOfMonth].icon = dayForecast.weather[0].icon.slice(0, -1) + "d";
    if(dayForecast.weather[0].icon.includes('04')) {
        days[dayOfMonth].icon = "02d";
    }
    days[dayOfMonth].temps.push(dayForecast.main.temp_min)
    days[dayOfMonth].temps.push(dayForecast.main.temp_max)
  }
  const newWeek = Object.values(days).map((value): DailyForecast => ({
    date: value.date,
    icon: value.icon,
    min: Math.min(...value.temps),
    max: Math.max(...value.temps),
    weather: value.weather,
  }))

  return newWeek
}
