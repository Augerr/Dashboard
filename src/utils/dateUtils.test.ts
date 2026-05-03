import { describe, expect, it } from "vitest";
import { getEventsForDay, isPastDay, isSameDay } from "./dateUtils";
import type { CalendarEvent } from "@/types/app";

describe("dateUtils", () => {
  it("compares dates by calendar day", () => {
    expect(
      isSameDay(
        new Date("2026-05-03T09:00:00"),
        new Date("2026-05-03T18:30:00"),
      ),
    ).toBe(true);
    expect(isSameDay(new Date("2026-05-03"), new Date("2026-05-04"))).toBe(
      false,
    );
    expect(isSameDay(null, new Date("2026-05-03"))).toBe(false);
  });

  it("filters calendar events for a given day", () => {
    const events: CalendarEvent[] = [
      { id: 1, title: "Morning", start: new Date(2026, 4, 3, 9).toISOString() },
      { id: 2, title: "Tomorrow", start: new Date(2026, 4, 4, 9).toISOString() },
    ];

    expect(getEventsForDay(events, new Date(2026, 4, 3))).toEqual([
      events[0],
    ]);
    expect(getEventsForDay(events, null)).toEqual([]);
  });

  it("detects past days relative to today", () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    expect(isPastDay(yesterday)).toBe(true);
    expect(isPastDay(tomorrow)).toBe(false);
    expect(isPastDay(null)).toBe(false);
  });
});
