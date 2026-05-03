import { useEffect, useState } from "react";
import { fetchStock } from "@/services/market"
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
        <p className="mt-2 text-sm text-red-300">
          Unable to load stock data
        </p>
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
    <div className="rounded-2xl bg-black/50 p-4 text-white shadow-lg transition hover:bg-white/15">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-semibold">{stock.symbol || symbol}</h2>
          <p className="text-xs text-white/50">
            Market {stock.marketStatus || "Unknown"}
          </p>
        </div>

        <span
          className={`rounded-full px-2 py-1 text-md font-semibold ${
            isUp
              ? "bg-green-500/20 text-green-300"
              : "bg-red-500/20 text-red-300"
          }`}
        >
          {isUp ? "▲" : "▼"} {formatPercent(stock.percentChange)}
        </span>
      </div>

     <div className="mt-4 text-3xl 2xl:text-5xl font-bold">
        {formatMoney(stock.price)}
      </div>

      <div
        className={`mt-1 text-md font-semibold ${
          isUp ? "text-green-300" : "text-red-300"
        }`}
      >
        {isUp ? "(+" : "("}
        {Number.isNaN(change) ? "--)" : change.toFixed(2) + ")"}
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2 text-sm text-white/70">
        <div>Open: {formatMoney(stock.open)}</div>
        <div>High: {formatMoney(stock.high)}</div>
        <div>Low: {formatMoney(stock.low)}</div>
        <div>Prev: {formatMoney(stock.previousClose)}</div>
      </div>
    </div>
  );
}

export default StockWidget;
