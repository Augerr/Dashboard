import { useCallback, useState } from "react";
import { Box, CircularProgress, Paper, Stack, Typography } from "@mui/material";
import GameRow from "./GameRow";
import { useAutoRefresh } from "@/hooks/useAutoRefresh";
import { getNhlGames } from "@/services/nhl";
import type { NHLGame, NHLGamesByDay } from "@/types/nhl";
import { retryAsync } from "@/utils/retry";

type GameColumnProps = {
  title: string;
  games?: NHLGame[];
  isToday?: boolean;
};

function GameColumn({ title, games = [], isToday = false }: GameColumnProps) {
  const rowCount = Math.min(3, Math.max(1, games.length));
  const visibleGames = games.slice(0, rowCount);

  return (
    <Box component="section" className="animate-fade-in grid min-h-0">
      <Typography
        component="h2"
        className="mb-2 px-2 text-sm font-semibold text-slate-950"
      >
        {title}
      </Typography>

      <Box className={`grid grid-rows-${rowCount} gap-2`}>
        {visibleGames.map((game) => (
          <GameRow key={game.id} game={game} isToday={isToday} />
        ))}

        {Array.from({ length: rowCount - visibleGames.length }).map(
          (_, index) => (
            <Paper
              key={`empty-${index}`}
              variant="outlined"
              className="rounded-lg border-white/10 bg-white/5"
            />
          ),
        )}
      </Box>
    </Box>
  );
}

function NhlPanel() {
  const [nhlGames, setNhlGames] = useState<NHLGamesByDay | null>(null);

  const loadNhlGames = useCallback(async () => {
    try {
      const data = await retryAsync(() => getNhlGames());
      setNhlGames(data);
    } catch (err) {
      console.error("NHL games fetching error:", err);
    }
  }, []);

  useAutoRefresh(loadNhlGames, 600000);

  if (!nhlGames) {
    return (
      <Stack className="h-full items-center justify-center rounded-lg bg-white/10 p-4 text-white backdrop-blur-xl">
        <CircularProgress size={28} />
        <Typography className="mt-3 text-white/70">
          Loading NHL data...
        </Typography>
      </Stack>
    );
  }

  return (
    <Box className="h-full w-full rounded-lg text-scoreBoard backdrop-blur-2xl">
      <Box className="grid grid-cols-1 gap-4 font-semibold md:grid-cols-3">
        <GameColumn title="Yesterday" games={nhlGames.yesterday} />
        <GameColumn title="Today" games={nhlGames.today} isToday />
        <GameColumn title="Tomorrow" games={nhlGames.tomorrow} />
      </Box>
    </Box>
  );
}

export default NhlPanel;
