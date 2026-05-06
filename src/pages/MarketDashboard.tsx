import { Box } from "@mui/material";
import { useState } from "react";
import CryptoListWidget from "@/components/market/CryptoListWidget";
import StockHistoryWidget from "@/components/market/StockHistoryWidget";
import WatchlistWidget from "@/components/market/WatchlistWidget";

function MarketDashboard() {
  const [selectedSymbol, setSelectedSymbol] = useState("AAPL");
  return (
    <Box
      component="main"
      className="min-h-screen text-white
       bg-gradient-to-br from-[#0f172a] via-[#020617] to-black 
       p-3 pr-11"
    >
      <Box
        component="section"
        className="
        grid 
        grid-cols-5
        grid-rows-2 
        gap-3 
        auto-rows-[minmax(150px,auto)]
      "
      >
        <WatchlistWidget
          selectedSymbol={selectedSymbol}
          onSelect={setSelectedSymbol}
        />

        <CryptoListWidget />

        <StockHistoryWidget symbol={selectedSymbol} />
      </Box>
    </Box>
  );
}

export default MarketDashboard;
