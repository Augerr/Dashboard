import { TIME_ZONE } from "../config/constants.js";

const getDatePart = (
  parts: Intl.DateTimeFormatPart[],
  type: Intl.DateTimeFormatPartTypes,
): string => {
  const part = parts.find((datePart) => datePart.type === type);
  if (!part) throw new Error(`Missing date part: ${type}`);
  return part.value;
};

export const formatDateInTimeZone = (
  date: Date,
  timeZone = TIME_ZONE,
): string => {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const year = getDatePart(parts, "year");
  const month = getDatePart(parts, "month");
  const day = getDatePart(parts, "day");

  return `${year}-${month}-${day}`;
};

export const getDateKey = (offsetDays = 0): string => {
  const now = new Date();

  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);

  const year = Number(getDatePart(parts, "year"));
  const month = Number(getDatePart(parts, "month"));
  const day = Number(getDatePart(parts, "day"));

  const shifted = new Date(Date.UTC(year, month - 1, day + offsetDays, 12));

  return formatDateInTimeZone(shifted);
};
