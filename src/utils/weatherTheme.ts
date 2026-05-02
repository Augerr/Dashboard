export type WeatherTheme = {
  bg: string;
  glow: string;
};

export const weatherTheme: Record<string, WeatherTheme> = {
  Clear: {
    bg: "from-sky-400 via-blue-500 to-indigo-900",
    glow: "rgba(59,130,246,0.4)",
  },
  Clouds: {
    bg: "from-gray-500 via-slate-600 to-gray-900",
    glow: "rgba(148,163,184,0.3)",
  },
  Rain: {
    bg: "from-slate-900 via-blue-900 to-black",
    glow: "rgba(59,130,246,0.25)",
  },
  Snow: {
    bg: "from-blue-200 via-slate-300 to-gray-500",
    glow: "rgba(255,255,255,0.3)",
  },
  Thunderstorm: {
    bg: "from-gray-800 via-purple-900 to-black",
    glow: "rgba(168,85,247,0.3)",
  },
  default: {
    bg: "from-[#0f172a] via-[#020617] to-black",
    glow: "rgba(255,255,255,0.1)",
  },
};
