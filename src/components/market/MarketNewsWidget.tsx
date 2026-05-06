import { useCallback, useState } from "react";
import { Box, Chip, Link, Paper, Stack, Typography } from "@mui/material";
import ArticleIcon from "@mui/icons-material/Article";
import { useAutoRefresh } from "@/hooks/useAutoRefresh";
import { fetchMarketNews } from "@/services/market";
import type { MarketNewsArticle } from "@/types/app";

function MarketNewsWidget() {
  const [news, setNews] = useState<MarketNewsArticle[]>([]);
  const [error, setError] = useState<string | null>(null);

  const loadNews = useCallback(async () => {
    try {
      setError(null);

      const data = await fetchMarketNews();

      setNews(data || []);
    } catch (err) {
      console.error("Market news error:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  }, []);

  useAutoRefresh(loadNews, 60 * 60 * 1000);

  return (
    <Paper className="col-span-5 rounded-lg bg-white/10 p-4 text-white shadow-lg">
      <Stack direction="row" className="mb-3 items-center justify-between">
        <Typography component="h2" className="text-lg font-semibold 2xl:text-2xl">
          Market News
        </Typography>
        <Chip
          size="small"
          icon={<ArticleIcon />}
          label="General"
          className="bg-black/20 text-white/70"
        />
      </Stack>

      {error && (
        <Typography className="text-sm text-red-300">
          Unable to load market news: {error}
        </Typography>
      )}

      {!error && news.length === 0 && (
        <Typography className="text-sm text-white/60">
          Loading market news...
        </Typography>
      )}

      <Stack spacing={1.5}>
        {news.map((article) => (
          <Link
            key={article.id}
            href={article.link}
            target="_blank"
            rel="noreferrer"
            underline="none"
            className="block rounded-lg bg-black/20 p-3 text-white transition hover:bg-white/10"
          >
            <Stack direction="row" spacing={1.5}>
              {article.thumbnail && (
                <img
                  src={article.thumbnail}
                  alt=""
                  className="h-16 w-20 rounded-lg object-cover"
                />
              )}

              <Box className="min-w-0">
                <Typography component="h3" className="line-clamp-2 text-sm font-semibold">
                  {article.title}
                </Typography>

                <Typography className="mt-1 text-xs text-white/50">
                  {[article.source?.name, article.date]
                    .filter(Boolean)
                    .join(" - ")}
                </Typography>
              </Box>
            </Stack>
          </Link>
        ))}
      </Stack>
    </Paper>
  );
}

export default MarketNewsWidget;
