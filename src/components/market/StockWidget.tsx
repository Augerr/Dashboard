import { useEffect, useState } from "react";
import { fetchStock } from "@/services/market";
import type { MarketNumber, MarketQuote } from "@/types/app";

type StockWidgetProps = {
  symbol: string;
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

function StockWidget({ symbol }: StockWidgetProps) {
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
      <div className="rounded-2xl bg-white/10 p-4 text-white shadow-lg">
        <h2 className="text-xl font-semibold">{symbol}</h2>
        <p className="mt-2 text-sm text-red-300">Unable to load stock data</p>
        <p className="mt-1 text-xs text-white/50">{error}</p>
      </div>
    );
  }

  if (!stock) {
    return (
      <div className="rounded-2xl bg-white/10 p-4 text-white shadow-lg">
        <h2 className="text-xl font-semibold">{symbol}</h2>
        <p className="mt-2 text-sm text-white/70">Loading...</p>
      </div>
    );
  }

  const change = Number(stock.change);
  const isUp = change >= 0;

  return (
    <div className="rounded-2xl bg-black/50 p-3 text-white shadow-lg transition hover:bg-white/15">
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <h2 className="truncate text-lg font-semibold leading-tight">
            {stock.symbol || symbol}
          </h2>
          <p className="text-xs leading-tight text-white/50">
            Market {stock.marketStatus || "Unknown"}
          </p>
        </div>

        <span
          className={`shrink-0 rounded-full px-2 py-0.5 text-sm font-bold ${
            isUp
              ? "bg-green-500/20 text-green-300"
              : "bg-red-500/20 text-red-300"
          }`}
        >
          {isUp ? "▲" : "▼"} {formatPercent(stock.percentChange)}
        </span>
      </div>

      <div className="mt-2 flex items-end justify-between gap-2">
        <div>
          <div className="text-2xl font-bold leading-none 2xl:text-3xl">
            {formatMoney(stock.price)}
          </div>

          <div
            className={`mt-1 text-sm font-bold leading-tight ${
              isUp ? "text-green-300" : "text-red-300"
            }`}
          >
            {isUp ? "+" : ""}
            {Number.isNaN(change) ? "--" : change.toFixed(2)}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-right text-sm text-white/80">
          <div>O {formatMoney(stock.open)}</div>
          <div>H {formatMoney(stock.high)}</div>
          <div>L {formatMoney(stock.low)}</div>
          <div>P {formatMoney(stock.previousClose)}</div>
        </div>
      </div>
    </div>
  );
}

export default StockWidget;
