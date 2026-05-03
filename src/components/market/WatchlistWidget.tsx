import StockWidget from "./StockWidget";

function WatchlistWidget() {
  const symbols = [
    "AAPL",
    "MSFT",
    "NVDA",
    "SPY",
    "TSLA",
    "GOOG",
    "NVDA",
    "AMZN",
  ];

  return (
    <div
      className="
      rounded-2xl 
      bg-white/10 
      p-4  col-1
      col-span-3
      text-white 
      shadow-lg
    "
    >
      <div className="grid grid-cols-3 gap-3">
        {symbols.map((symbol) => (
          <StockWidget key={symbol} symbol={symbol} />
        ))}
      </div>
    </div>
  );
}

export default WatchlistWidget;
