import type { MarketStatus } from "../types/api.js";

export const getMarketStatus = (): MarketStatus => {
  const now = new Date();
  const utcDay = now.getUTCDay();
  const utcHour = now.getUTCHours();
  const utcMinute = now.getUTCMinutes();

  const minutesSinceMidnight = utcHour * 60 + utcMinute;
  const marketOpen = 13 * 60 + 30;
  const marketClose = 20 * 60;

  const isWeekday = utcDay >= 1 && utcDay <= 5;
  const isMarketOpen =
    isWeekday &&
    minutesSinceMidnight >= marketOpen &&
    minutesSinceMidnight <= marketClose;

  return isMarketOpen ? "Open" : "Closed";
};
