import { useCallback, useState } from "react";
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
    <section className="animate-fade-in grid min-h-0">
      <h2 className="mb-2 px-2 text-sm font-semibold text-white/70">{title}</h2>

      <div className={`grid grid-rows-${rowCount} gap-2`}>
        {visibleGames.map((game) => (
          <GameRow key={game.id} game={game} isToday={isToday} />
        ))}

        {Array.from({ length: rowCount - visibleGames.length }).map(
          (_, index) => (
            <div
              key={`empty-${index}`}
              className="rounded-xl border border-white/10 bg-white/5"
            />
          ),
        )}
      </div>
    </section>
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
      <div className="flex h-full items-center justify-center rounded-3xl bg-white/10 p-4 text-white backdrop-blur-xl">
        Loading NHL data...
      </div>
    );
  }

  return (
    <div className="h-full w-full text-white rounded-3xl backdrop-blur-2xl">
      <div className="grid grid-cols-1 gap-4 font-semibold text-white/90 md:grid-cols-3">
        <GameColumn title="Yesterday" games={nhlGames.yesterday} />
        <GameColumn title="Today" games={nhlGames.today} isToday />
        <GameColumn title="Tomorrow" games={nhlGames.tomorrow} />
      </div>
    </div>
  );
}
export default NhlPanel;
