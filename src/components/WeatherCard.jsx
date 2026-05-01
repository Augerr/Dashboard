import ForecastStrip from "./ForecastStrip"

function WeatherCard({weather, daily}) {

  if (!weather) return <div className="text-white">Loading...</div>

  const temp = Math.round(weather.main.temp)
  const condition = weather.weather[0].main

  return (
    <div className="w-full p-4 rounded-3xl backdrop-blur-2xl bg-slate/10 border-4 border-white/50 shadow-2xl">
      <div className="text-center">
        <img
          className="mx-auto"
          src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
          alt=""
        />
        <p className="text-lg md:text-lg opacity-80">{condition}</p>
      </div>

      {/* Temperature */}
      <div className="text-center">
        <h1 className="text-2xl font-bold">{temp}°</h1>
      </div>

      {/* Extra Info */}
      <div className="flex flex-grow justify-between text-sm lg:text-lg opacity-80 mb-8 mt-2 text-center">
        <div className="flex-1">
          <p>Humidity</p>
          <p className="font-bold">{weather.main.humidity}%</p>
        </div>
        <div className="flex-1">  
          <p>Feels Like</p>
          <p className="font-bold">{Math.round(weather.main.feels_like)}°</p>
        </div>
      </div>
      <ForecastStrip daily={daily} />
    </div> 
  )
}

export default WeatherCard