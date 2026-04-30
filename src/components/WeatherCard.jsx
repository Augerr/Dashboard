import ForecastStrip from "./ForecastStrip"

function WeatherCard({weather, daily}) {

  if (!weather) return <div className="text-white">Loading...</div>

  const temp = Math.round(weather.main.temp)
  const condition = weather.weather[0].main

  return (
    <div>
      <div className="w-full max-w-md p-4 rounded-3xl backdrop-blur-2xl bg-white/10 border border-white/20 shadow-2xl">
        
        <div className="text-center -my-4">
          <img
            className="mx-auto w-24 h-24"
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
            alt=""
          />
          <p className="text-lg md:text-lg opacity-80 -my-2">{condition}</p>
        </div>

        {/* Temperature */}
        <div className="text-center mt-2">
          <h1 className="text-2xl lg:text-xl font-bold">{temp}°</h1>
        </div>

        {/* Extra Info */}
        <div className="flex justify-between text-sm lg:text-md opacity-80 -mt-4 -mx-2 text-center">
          <div>
            <p>Humidity</p>
            <p className="font-bold">{weather.main.humidity}%</p>
          </div>
          <div>
            <p>Feels Like</p>
            <p className="font-bold">{Math.round(weather.main.feels_like)}°</p>
          </div>
        </div>
      </div>
      <ForecastStrip daily={daily} />
    </div> 
  )
}

export default WeatherCard