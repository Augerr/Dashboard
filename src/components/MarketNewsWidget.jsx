import { useCallback, useState } from "react";
import { useAutoRefresh } from "../hooks/useAutoRefresh"
import { fetchMarketNews } from "../services/market";

function MarketNewsWidget() {
  const [news, setNews] = useState([]);
  const [error, setError] = useState(null);

  const loadNews = useCallback(async () => {
    try {
      setError(null);

      const data = await fetchMarketNews();

      setNews(data || []);
    } catch (err) {
      console.error("Market news error:", err);
      setError(err.message);
    }
  }, [])

  useAutoRefresh(loadNews, 10 * 60 * 1000)

  return (
    <div className="
      col-span-2 
      2xl:col-span-3 
      row-span-2 
      rounded-2xl 
      bg-white/10 
      p-4 
      text-white 
      shadow-lg
    ">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg 2xl:text-2xl font-semibold">Market News</h2>
        <span className="text-xs text-white/50">General</span>
      </div>

      {error && (
        <p className="text-sm text-red-300">
          Unable to load market news: {error}
        </p>
      )}

      {!error && news.length === 0 && (
        <p className="text-sm text-white/60">Loading market news...</p>
      )}

      <div className="space-y-3">
        {news.map((article) => (
          <a
            key={article.id}
            href={article.url}
            target="_blank"
            rel="noreferrer"
            className="block rounded-xl bg-black/20 p-3 transition hover:bg-white/10"
          >
            <div className="flex gap-3">
              {article.image && (
                <img
                  src={article.image}
                  alt=""
                  className="h-16 w-20 rounded-lg object-cover"
                />
              )}

              <div className="min-w-0">
                <h3 className="line-clamp-2 text-sm font-semibold">
                  {article.headline}
                </h3>

                <p className="mt-1 text-xs text-white/50">
                  {article.source}
                </p>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

export default MarketNewsWidget;
