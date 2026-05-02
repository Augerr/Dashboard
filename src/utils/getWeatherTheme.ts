export const getWeatherTheme = (condition: string): string => {
  switch (condition) {
    case "Clear":
      return "from-blue-400 via-sky-500 to-indigo-600"
    case "Clouds":
      return "from-gray-400 via-gray-600 to-gray-800"
    case "Rain":
      return "from-gray-700 via-blue-900 to-indigo-950"
    case "Snow":
      return "from-slate-100 via-slate-300 to-slate-500"
    case "Thunderstorm":
      return "from-zinc-700 via-purple-900 to-black"
    default:
      return "from-indigo-400 via-purple-500 to-pink-500"
  }
}
