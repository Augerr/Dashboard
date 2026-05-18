import { useCallback, useState } from "react";
import { Box, Chip, Paper, Stack, Typography } from "@mui/material";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { useAutoRefresh } from "@/hooks/useAutoRefresh";
import { fetchCrypto } from "@/services/market";
import type { MarketNumber, MarketQuote } from "@/types/app";

type CryptoWidgetProps = {
  symbol?: string;
  label?: string;
};

function formatMoney(value: MarketNumber): string {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return "--";
  }

  return `$${Number(value).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatPercent(value: MarketNumber): string {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return "--";
  }

  return `${Number(value).toFixed(2)}%`;
}

function CryptoWidget({
  symbol = "BTCUSDT",
  label = "Bitcoin",
}: CryptoWidgetProps) {
  const [crypto, setCrypto] = useState<MarketQuote | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadCrypto = useCallback(async () => {
    try {
      setError(null);

      const data = await fetchCrypto(symbol);

      setCrypto(data);
    } catch (err) {
      console.error("Crypto fetch error:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  }, [symbol]);

  useAutoRefresh(loadCrypto, 30 * 1000);

  if (error) {
    return (
      <Paper className="rounded-lg bg-white/10 p-4 text-white shadow-lg">
        <Typography component="h2" className="text-xl font-semibold">
          {label}
        </Typography>
        <Typography className="mt-2 text-sm text-red-300">
          Unable to load crypto data
        </Typography>
        <Typography className="mt-1 text-xs text-white/50">{error}</Typography>
      </Paper>
    );
  }

  if (!crypto) {
    return (
      <Paper className="rounded-lg bg-white/10 p-4 text-white shadow-lg">
        <Typography component="h2" className="text-xl font-semibold">
          {label}
        </Typography>
        <Typography className="mt-2 text-sm text-white/70">
          Loading...
        </Typography>
      </Paper>
    );
  }

  const change = Number(crypto.change);
  const isUp = change >= 0;

  return (
    <Paper className="rounded-lg !bg-black/50 p-4 text-white shadow-lg transition hover:bg-white/15">
      <Stack direction="row" className="items-start justify-between gap-2">
        <Box>
          <Typography component="h2" className="text-xl font-semibold">
            {label}
          </Typography>
          <Typography className="text-xs text-white/50">
            {crypto.symbol}
          </Typography>
        </Box>

        <Chip
          size="small"
          icon={isUp ? <TrendingUpIcon /> : <TrendingDownIcon />}
          label={formatPercent(crypto.percentChange)}
          className={`font-bold ${
            isUp
              ? "bg-green-500/20 text-green-300"
              : "bg-red-500/20 text-red-300"
          }`}
        />
      </Stack>

      <Box className="mt-2 flex items-end justify-between gap-2">
        <Box>
          <Typography className="mt-4 text-3xl font-bold">
            {formatMoney(crypto.price)}
          </Typography>

          <Typography
            className={`mt-1 text-sm font-bold ${
              isUp ? "text-green-300" : "text-red-300"
            }`}
          >
            {isUp ? "+" : ""}
            {Number.isNaN(change) ? "--" : change.toFixed(2)}
          </Typography>
        </Box>

        <Box className="grid grid-cols-2 gap-x-3 gap-y-1 text-right text-sm text-white/80">
          <div>O: {formatMoney(crypto.open)}</div>
          <div>H: {formatMoney(crypto.high)}</div>
          <div>L: {formatMoney(crypto.low)}</div>
          <div>P: {formatMoney(crypto.previousClose)}</div>
        </Box>
      </Box>
    </Paper>
  );
}

export default CryptoWidget;
