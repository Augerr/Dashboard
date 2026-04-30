import StockWidget from "./StockWidget";

function WatchlistWidget() {
  const symbols = ["AAPL", "MSFT", "NVDA", "SPY", "TSLA", "GOOG", "NVDA", "AMZN"];

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
      <div className="grid grid-cols-2 gap-3">
        {symbols.map((symbol) => (
          <StockWidget key={symbol} symbol={symbol} />
        ))}
      </div>
    </div>
  );
}

export default WatchlistWidget;