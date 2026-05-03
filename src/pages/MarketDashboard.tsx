import CryptoListWidget from "@/components/market/CryptoListWidget";
import MarketNewsWidget from "@/components/market/MarketNewsWidget";
import WatchlistWidget from "@/components/market/WatchlistWidget";

function MarketDashboard() {
  return (
    <main
      className="min-h-screen text-white
       bg-gradient-to-br from-[#0f172a] via-[#020617] to-black 
       p-3 pr-11"
    >
      <section
        className="
        grid 
        grid-cols-5 
        gap-3 
        auto-rows-[minmax(150px,auto)]
      "
      >
        <WatchlistWidget />

        <CryptoListWidget />

        <MarketNewsWidget />
      </section>
    </main>
  );
}

export default MarketDashboard;
