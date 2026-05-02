import MarketNewsWidget from "../components/MarketNewsWidget";
import WatchlistWidget from "../components/WatchlistWidget";
import CryptoListWidget from "../components/CryptoListWidget";

function MarketDashboard() {
   return (
    <main className="min-h-screen text-white
       bg-gradient-to-br from-[#0f172a] via-[#020617] to-black 
       p-3 pr-11">

      <section className="
        grid 
        grid-cols-2 
        xl:grid-cols-4 
        2xl:grid-cols-6 
        gap-3 
        auto-rows-[minmax(150px,auto)]
      ">
        <WatchlistWidget />

        <MarketNewsWidget />

        <CryptoListWidget />    
      </section>
    </main>
  );
}

export default MarketDashboard;