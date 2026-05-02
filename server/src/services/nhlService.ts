import axios from "axios";
import { getDateKey } from "../utils/date.js";
import type { NHLGamesByDayResponse } from "../types/api.js";
import type { NhlScheduleResponse } from "../types/external.js";

const BASE_URL = "https://api-web.nhle.com/v1/schedule";

const extractGamesForDate = (
  data: NhlScheduleResponse,
  dateKey: string,
): unknown[] => {
  const day = data.gameWeek?.find(
    (scheduleDay) => scheduleDay.date === dateKey,
  );
  return day?.games || [];
};

export const getNhlGames = async (): Promise<NHLGamesByDayResponse> => {
  const yesterdayKey = getDateKey(-1);
  const todayKey = getDateKey(0);
  const tomorrowKey = getDateKey(1);

  const [yRes, tRes, tmRes] = await Promise.all([
    axios.get<NhlScheduleResponse>(`${BASE_URL}/${yesterdayKey}`),
    axios.get<NhlScheduleResponse>(`${BASE_URL}/${todayKey}`),
    axios.get<NhlScheduleResponse>(`${BASE_URL}/${tomorrowKey}`),
  ]);

  return {
    yesterday: extractGamesForDate(yRes.data, yesterdayKey),
    today: extractGamesForDate(tRes.data, todayKey),
    tomorrow: extractGamesForDate(tmRes.data, tomorrowKey),
    debug: {
      yesterdayKey,
      todayKey,
      tomorrowKey,
    },
  };
};
