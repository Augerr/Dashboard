import { useCallback, useState } from "react";
import { useAutoRefresh } from "../hooks/useAutoRefresh"
import { fetchCrypto } from "../services/market";
import type { MarketNumber, MarketQuote } from "../types/app";

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

function CryptoWidget({ symbol = "BTCUSDT", label = "Bitcoin" }: CryptoWidgetProps) {
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
  }, [symbol])

  useAutoRefresh(loadCrypto, 30 * 1000)

  if (error) {
    return (
      <div className="rounded-2xl bg-white/10 p-4 text-white shadow-lg">
        <h2 className="text-xl font-semibold">{label}</h2>
        <p className="mt-2 text-sm text-red-300">Unable to load crypto data</p>
        <p className="mt-1 text-xs text-white/50">{error}</p>
      </div>
    );
  }

  if (!crypto) {
    return (
      <div className="rounded-2xl bg-white/10 p-4 text-white shadow-lg">
        <h2 className="text-xl font-semibold">{label}</h2>
        <p className="mt-2 text-sm text-white/70">Loading...</p>
      </div>
    );
  }

  const change = Number(crypto.change);
  const isUp = change >= 0;

  return (
    <div className="rounded-2xl bg-white/10 p-4 text-white shadow-lg transition hover:bg-white/15">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-semibold">{label}</h2>
          <p className="text-xs text-white/50">{crypto.symbol}</p>
        </div>

        <span
          className={`rounded-full px-2 py-1 text-xs font-semibold ${
            isUp
              ? "bg-green-500/20 text-green-300"
              : "bg-red-500/20 text-red-300"
          }`}
        >
          {isUp ? "▲" : "▼"} {formatPercent(crypto.percentChange)}
        </span>
      </div>

      <div className="mt-4 text-4xl font-bold">
        {formatMoney(crypto.price)}
      </div>

      <div
        className={`mt-1 text-sm font-medium ${
          isUp ? "text-green-300" : "text-red-300"
        }`}
      >
        {isUp ? "+" : ""}
        {Number.isNaN(change) ? "--" : change.toFixed(2)}
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2 text-sm text-white/70">
        <div>Open: {formatMoney(crypto.open)}</div>
        <div>High: {formatMoney(crypto.high)}</div>
        <div>Low: {formatMoney(crypto.low)}</div>
        <div>Prev: {formatMoney(crypto.previousClose)}</div>
      </div>
    </div>
  );
}

export default CryptoWidget;
