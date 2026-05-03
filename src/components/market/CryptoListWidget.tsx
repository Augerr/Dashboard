import CryptoWidget from "./CryptoWidget";

function CryptoListWidget() {
  const symbols = [
    { symbol: "BTCUSDT", label: "Bitcoin" },
    { symbol: "ETHUSDT", label: "Ethereum" },
    { symbol: "XRPUSDT", label: "XRP" },
    { symbol: "USDT", label: "Tether" },
  ];

  return (
    <div className="col-span-2 rounded-2xl bg-white/10 p-4 text-white shadow-lg">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
        {symbols.map((crypto) => (
          <CryptoWidget
            key={crypto.symbol}
            symbol={crypto.symbol}
            label={crypto.label}
          />
        ))}
      </div>
    </div>
  );
}

export default CryptoListWidget;
