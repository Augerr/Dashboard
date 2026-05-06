import { useEffect, useState } from "react";
import { Box, Paper, Stack, Typography } from "@mui/material";
import ForecastStrip from "./ForecastStrip";
import type { CurrentWeather, DailyForecast } from "@/types/app";

type WeatherCardProps = {
  weather: CurrentWeather | null;
  daily: DailyForecast[];
};

function WeatherCard({ weather, daily }: WeatherCardProps) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!weather) return <Typography color="text.primary">Loading...</Typography>;

  const temp = Math.round(weather.main.temp);
  const condition = weather.weather[0]?.main ?? "";
  const icon = weather.weather[0]?.icon;
  const currentDate = new Intl.DateTimeFormat([], {
    weekday: "long",
    month: "short",
    day: "numeric",
  }).format(now);
  const currentTime = new Intl.DateTimeFormat([], {
    hour: "numeric",
    minute: "2-digit",
  }).format(now);

  return (
    <Box className="animate-fade-in flex w-full flex-col overflow-hidden p-3 text-white">
      <Box className="relative flex shrink-0 flex-row items-center justify-center">
        <Stack
          direction="row"
          spacing={0.5}
          className="absolute right-0 top-0 min-w-0"
        >
          <Typography className="!mr-2 truncate text-xs !font-semibold uppercase tracking-wide text-white/80 2xl:text-sm">
            {currentDate}
          </Typography>
          <Typography className="ml-0.5 text-base !font-bold leading-tight text-white">
            {currentTime}
          </Typography>
        </Stack>

        <Box className="-mt-2 flex flex-col">
          <Stack direction="row" className="shrink-0 items-center">
            <Typography
              component="h1"
              className="!text-3xl font-bold leading-none"
            >
              {temp}&deg;
            </Typography>

            {icon && (
              <img
                className="-m-4 h-16 w-16 2xl:h-32 2xl:w-32 shrink-0"
                src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
                alt=""
              />
            )}
          </Stack>
          <Stack direction="row" className="justify-center">
            <Typography className="!-my-2 2xl:!-ml-8 max-w-[80px] !font-medium truncate text-white/90 2xl:!text-xl">
              {condition}
            </Typography>
          </Stack>
        </Box>
      </Box>

      <Box className="mt-3 grid shrink-0 grid-cols-2 gap-2 text-center">
        <Paper className="rounded-lg !bg-black/50 px-3 py-2">
          <Typography className="text-xs text-white/50">Humidity</Typography>
          <Typography className="text-base font-bold">
            {weather.main.humidity}%
          </Typography>
        </Paper>

        <Paper className="rounded-lg !bg-black/50 px-3 py-2">
          <Typography className="text-xs text-white/50">Feels Like</Typography>
          <Typography className="text-base font-bold">
            {Math.round(weather.main.feels_like)}&deg;
          </Typography>
        </Paper>
      </Box>

      <Box className="mt-2 w-full shrink-0">
        <ForecastStrip daily={daily} />
      </Box>
    </Box>
  );
}

export default WeatherCard;
