import { useEffect, useState } from "react";
import { Box, Chip, Paper, Stack, Typography } from "@mui/material";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { fetchStock } from "@/services/market";
import type { MarketNumber, MarketQuote } from "@/types/app";

type StockWidgetProps = {
  symbol: string;
  isSelected?: boolean;
  onClick?: () => void;
};

function formatMoney(value: MarketNumber): string {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return "--";
  }

  return `$${Number(value).toFixed(2)}`;
}

function formatPercent(value: MarketNumber): string {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return "--";
  }

  return `${Number(value).toFixed(2)}%`;
}

function StockWidget({ symbol, isSelected, onClick }: StockWidgetProps) {
  const [stock, setStock] = useState<MarketQuote | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadStock() {
      try {
        setError(null);

        const stock = await fetchStock(symbol);

        if (!stock) {
          throw new Error(`Request failed fetching symbol ${symbol}`);
        }

        setStock(stock);
      } catch (err) {
        console.error("Stock widget error:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
      }
    }

    loadStock();

    const interval = setInterval(loadStock, 30 * 1000);
    return () => clearInterval(interval);
  }, [symbol]);

  if (error) {
    return (
      <Paper className="rounded-lg bg-white/10 p-4 text-white shadow-lg">
        <Typography component="h2" className="text-xl font-semibold">
          {symbol}
        </Typography>
        <Typography className="mt-2 text-sm text-red-300">
          Unable to load stock data
        </Typography>
        <Typography className="mt-1 text-xs text-white/50">{error}</Typography>
      </Paper>
    );
  }

  if (!stock) {
    return (
      <Paper className="rounded-lg bg-white/10 p-4 text-white shadow-lg">
        <Typography component="h2" className="text-xl font-semibold">
          {symbol}
        </Typography>
        <Typography className="mt-2 text-sm text-white/70">
          Loading...
        </Typography>
      </Paper>
    );
  }

  const change = Number(stock.change);
  const isUp = change >= 0;

  return (
    <Paper
      onClick={onClick}
      className={`rounded-lg !bg-black/50 p-3 text-white shadow-lg transition hover:!bg-white/15  ${isSelected ? "!ring-2 !ring-blue-400 !bg-white/20" : ""}`}
    >
      <Stack direction="row" className="items-center justify-between gap-2">
        <Box className="min-w-0">
          <Typography
            component="h2"
            className="truncate text-lg font-semibold leading-tight"
          >
            {stock.symbol || symbol}
          </Typography>
          <Typography className="text-xs leading-tight text-white/50">
            Market {stock.marketStatus || "Unknown"}
          </Typography>
        </Box>

        <Chip
          size="small"
          icon={isUp ? <TrendingUpIcon /> : <TrendingDownIcon />}
          label={formatPercent(stock.percentChange)}
          className={`shrink-0 font-bold ${
            isUp
              ? "bg-green-500/20 text-green-300"
              : "bg-red-500/20 text-red-300"
          }`}
        />
      </Stack>

      <Box className="mt-2 flex items-end justify-between gap-2">
        <Box>
          <Typography className="text-xl font-bold leading-none">
            {formatMoney(stock.price)}
          </Typography>

          <Typography
            className={`mt-1 text-sm font-bold leading-tight ${
              isUp ? "text-green-300" : "text-red-300"
            }`}
          >
            {isUp ? "+" : ""}
            {Number.isNaN(change) ? "--" : change.toFixed(2)}
          </Typography>
        </Box>

        <Box className="grid grid-cols-2 gap-x-3 gap-y-1 text-right text-[11px] text-white/60 2xl:text-sm">
          <div>O {formatMoney(stock.open)}</div>
          <div>H {formatMoney(stock.high)}</div>
          <div>L {formatMoney(stock.low)}</div>
          <div>P {formatMoney(stock.previousClose)}</div>
        </Box>
      </Box>
    </Paper>
  );
}

export default StockWidget;
