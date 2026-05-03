import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import WeatherCard from "./WeatherCard";
import type { CurrentWeather, DailyForecast } from "@/types/app";

const weather: CurrentWeather = {
  main: {
    temp: 21.4,
    humidity: 62,
    feels_like: 19.2,
  },
  weather: [{ main: "Clear", icon: "01d" }],
};

const daily: DailyForecast[] = [
  {
    date: new Date(2026, 4, 3),
    icon: "01d",
    min: 9,
    max: 20,
    weather: { main: "Clear", icon: "01d" },
  },
  {
    date: new Date(2026, 4, 4),
    icon: "02d",
    min: 11,
    max: 22,
    weather: { main: "Clouds", icon: "02d" },
  },
];

describe("WeatherCard", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 4, 3, 9, 15));
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  it("renders current conditions, stats, and forecast", () => {
    render(<WeatherCard weather={weather} daily={daily} />);

    expect(screen.getByText("Sunday, May 3")).toBeInTheDocument();
    expect(screen.getByText(/9:15/i)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /21/ })).toBeInTheDocument();
    expect(screen.getByText("Clear")).toBeInTheDocument();
    expect(screen.getByText("Humidity")).toBeInTheDocument();
    expect(screen.getByText("62%")).toBeInTheDocument();
    expect(screen.getByText("Feels Like")).toBeInTheDocument();
    expect(screen.getByText(/19/)).toBeInTheDocument();
    expect(screen.getByText("Sun")).toBeInTheDocument();
    expect(screen.getByText("Mon")).toBeInTheDocument();
  });

  it("renders a loading state when weather is missing", () => {
    render(<WeatherCard weather={null} daily={[]} />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });
});
