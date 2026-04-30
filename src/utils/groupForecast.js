export const groupToDaily = (list) => {
  const days = {}

  list?.forEach((item) => {
    const date = new Date(item.dt * 1000).toDateString()
    if (!days[date]) {
      days[date] = {
        icon: "",
        temps: [],
        weather: item.weather[0],
      }
    }
    
    if(item.weather[0].icon.includes('d'))
        days[date].icon = item.weather[0].icon;
    else 
        days[date].icon = item.weather[0].icon.slice(0, -1) + "d";
    if(item.weather[0].icon.includes('04')) {
        days[date].icon = "02d";
    }
    days[date].temps.push(item.main.temp_min)
    days[date].temps.push(item.main.temp_max)
  })
  console.log(days)

  return Object.entries(days).map(([date, value]) => ({
    date,
    icon: value.icon,
    min: Math.min(...value.temps),
    max: Math.max(...value.temps),
    weather: value.weather,
  }))
}