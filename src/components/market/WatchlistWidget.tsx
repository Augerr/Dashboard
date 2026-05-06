import { Box, Paper } from "@mui/material";
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
    <Paper className="col-1 col-span-3 rounded-lg bg-white/10 p-4 text-white shadow-lg">
      <Box className="grid grid-cols-3 gap-3">
        {symbols.map((symbol, index) => (
          <StockWidget key={`${symbol}-${index}`} symbol={symbol} />
        ))}
      </Box>
    </Paper>
  );
}

export default WatchlistWidget;
