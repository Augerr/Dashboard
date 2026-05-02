import { useCallback, useState } from "react"
import { getNhlGames } from "../services/nhl"
import GameRow from "./ui/GameRow"
import { useAutoRefresh } from "../hooks/useAutoRefresh"

function GameColumn({ title, games = [], isToday = false }) {
  const visibleGames = games.slice(0, 3);

  return (
    <section className="animate-fade-in grid min-h-0 grid-rows-[auto_1fr]">
      <h2 className="mb-2 px-2 text-sm font-semibold text-white/70">
        {title}
      </h2>

      <div className="grid grid-rows-3 gap-2">
        {visibleGames.map((game) => (
          <GameRow key={game.id} game={game} isToday={isToday} />
        ))}

        {Array.from({ length: 3 - visibleGames.length }).map((_, index) => (
          <div
            key={`empty-${index}`}
            className="rounded-xl border border-white/10 bg-white/5"
          />
        ))}
      </div>
    </section>
  );
}

function NhlPanel() {
  const [nhlGames, setNhlGames] = useState(null);

  const loadNhlGames = useCallback(async () => {
    try {
      const data = await getNhlGames();
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
    <div className="h-full w-full text-white">
      <div className="grid h-full grid-cols-1 gap-4 font-semibold text-white/90 md:grid-cols-3">
        <GameColumn title="Yesterday" games={nhlGames.yesterday} />
        <GameColumn title="Today" games={nhlGames.today} isToday />
        <GameColumn title="Tomorrow" games={nhlGames.tomorrow} />
      </div>
    </div>
  );
}
export default NhlPanel
