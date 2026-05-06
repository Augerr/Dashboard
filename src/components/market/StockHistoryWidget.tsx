import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useEffect, useState } from "react";
import { fetchStockHistory } from "../../services/market.ts";

type StockHistoryPoint = {
  date: string;
  close: number;
};

type Props = {
  symbol: string;
};

export default function StockHistoryWidget({ symbol }: Props) {
  const [data, setData] = useState<StockHistoryPoint[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadHistory() {
      try {
        setLoading(true);

        const data = await fetchStockHistory(symbol);

        setData(data);
      } catch (err) {
        console.error("Failed to load stock history", err);
        setData([]);
      } finally {
        setLoading(false);
      }
    }

    loadHistory();
  }, [symbol]);

  return (
    <div className="h-full w-full rounded-2xl bg-white/10 p-4 col-span-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">{symbol} History</h2>
          <p className="text-sm opacity-60">Stock price over time</p>
        </div>
      </div>

      <div className="h-[260px] xl:h-[340px] 2xl:h-[420px]">
        {loading ? (
          <div className="flex h-full items-center justify-center opacity-60">
            Loading chart...
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 16, fontWeight: "bold" }}
              />
              <YAxis
                domain={["auto", "auto"]}
                tick={{ fontSize: 16, fontWeight: "bold" }}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip
                formatter={(value) => [`$${value}`, "Close"]}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Line
                type="monotone"
                dataKey="close"
                strokeWidth={5}
                dot={true}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
