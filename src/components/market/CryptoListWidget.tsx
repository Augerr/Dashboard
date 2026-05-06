import { Box, Paper } from "@mui/material";
import CryptoWidget from "./CryptoWidget";

function CryptoListWidget() {
  const symbols = [
    { symbol: "BTCUSDT", label: "Bitcoin" },
    { symbol: "ETHUSDT", label: "Ethereum" },
    { symbol: "XRPUSDT", label: "XRP" },
    { symbol: "USDT", label: "Tether" },
  ];

  return (
    <Paper className="col-span-2 rounded-lg bg-white/10 p-4 text-white shadow-lg">
      <Box className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
        {symbols.map((crypto) => (
          <CryptoWidget
            key={crypto.symbol}
            symbol={crypto.symbol}
            label={crypto.label}
          />
        ))}
      </Box>
    </Paper>
  );
}

export default CryptoListWidget;
