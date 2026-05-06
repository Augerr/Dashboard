export type WeatherTheme = {
  bg: string;
  glow: string;
  secondary: string;
};

export const weatherTheme: Record<string, WeatherTheme> = {
  Clear: {
    bg: "from-sky-400 via-blue-500 to-indigo-900",
    glow: "rgba(59,130,246,0.4)",
    secondary: "rgb(216, 107, 13)",
  },
  Clouds: {
    bg: "from-gray-500 via-slate-600 to-gray-900",
    glow: "rgba(148,163,184,0.3)",
    secondary: "rgba(0, 42, 68, 0.68)",
  },
  Rain: {
    bg: "from-slate-900 via-blue-900 to-black",
    glow: "rgba(59,130,246,0.25)",
    secondary: "rgba(82, 81, 81, 0.78)",
  },
  Snow: {
    bg: "from-blue-200 via-slate-300 to-gray-500",
    glow: "rgba(255,255,255,0.3)",
    secondary: "rgba(107, 124, 152, 0.57)",
  },
  Thunderstorm: {
    bg: "from-gray-800 via-purple-900 to-black",
    glow: "rgba(168,85,247,0.3)",
    secondary: "rgb(0, 0, 0)",
  },
  default: {
    bg: "from-[#0f172a] via-[#020617] to-black",
    glow: "rgba(255,255,255,0.1)",
    secondary: "rgba(59,130,246,0.4)",
  },
};
