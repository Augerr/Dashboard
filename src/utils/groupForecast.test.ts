import { describe, expect, it } from "vitest";
import { groupToDaily } from "./groupForecast";
import type { ForecastResponse } from "@/types/app";

describe("groupToDaily", () => {
  it("groups forecast entries by day and tracks min, max, and daytime icon", () => {
    const forecast: ForecastResponse = {
      list: [
        {
          dt: new Date(2026, 4, 3, 3).getTime() / 1000,
          main: { temp_min: 8, temp_max: 14 },
          weather: [{ main: "Clouds", icon: "02n" }],
        },
        {
          dt: new Date(2026, 4, 3, 15).getTime() / 1000,
          main: { temp_min: 10, temp_max: 18 },
          weather: [{ main: "Clouds", icon: "03d" }],
        },
        {
          dt: new Date(2026, 4, 4, 15).getTime() / 1000,
          main: { temp_min: 5, temp_max: 11 },
          weather: [{ main: "Rain", icon: "04n" }],
        },
      ],
    };

    expect(groupToDaily(forecast)).toMatchObject([
      { icon: "03d", min: 8, max: 18, weather: { main: "Clouds" } },
      { icon: "02d", min: 5, max: 11, weather: { main: "Rain" } },
    ]);
  });
});
