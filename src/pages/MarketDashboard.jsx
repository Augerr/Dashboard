import MarketNewsWidget from "../components/MarketNewsWidget";
import WatchlistWidget from "../components/WatchlistWidget";
import CryptoListWidget from "../components/CryptoListWidget";

function MarketDashboard() {
   return (
    <main className="min-h-screen max-w-[1800px]
       bg-gradient-to-br from-[#0f172a] via-[#020617] to-black 
       animated-bg p-3 pr-11 text-white mx-auto p-6
        grid grid-cols-4 grid-rows-3
        md:grid-cols-6`">

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