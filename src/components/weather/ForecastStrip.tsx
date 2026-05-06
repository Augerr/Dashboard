import { Box, Paper, Stack, Typography } from "@mui/material";
import type { DailyForecast } from "@/types/app";

type ForecastStripProps = {
  daily: DailyForecast[];
};

function ForecastStrip({ daily }: ForecastStripProps) {
  if (!daily) return null;

  return (
    <Stack direction="row" className="h-full min-h-0 w-full gap-2 overflow-x-auto">
      {daily.slice(0, 5).map((day, i) => {
        const date = day?.date?.toDateString().slice(0, 3);

        return (
          <Paper
            key={i}
            className="flex min-w-[70px] flex-col items-center justify-center rounded-lg bg-black/30 p-2 text-center xl:min-w-0 xl:flex-1"
          >
            <Typography className="text-sm font-semibold opacity-80">
              {date}
            </Typography>

            <img
              className="h-9 w-9 2xl:h-12 2xl:w-12"
              src={`https://openweathermap.org/img/wn/${day.icon}.png`}
              alt=""
            />

            <Box className="flex flex-row justify-center">
              <Typography className="font-bold text-orange-300">
                {Math.round(day.max)}&deg;
              </Typography>
              <Typography className="mx-1 font-semibold">/</Typography>
              <Typography className="font-bold text-blue-300">
                {Math.round(day.min)}&deg;
              </Typography>
            </Box>
          </Paper>
        );
      })}
    </Stack>
  );
}

export default ForecastStrip;
