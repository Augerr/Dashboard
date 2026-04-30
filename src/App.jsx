import AppLayout from "./layout/AppLayout"
import Dashboard from "./pages/Dashboard"
import MarketDashboard from "./pages/MarketDashboard";
import navigationArrow from "./assets/arrow.png"
import { useState, useEffect } from "react"

function App() {
  const [page, setPage] = useState("dashboard");

  // ✅ Keyboard navigation (global)
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "ArrowRight") setPage("second");
      if (e.key === "ArrowLeft") setPage("dashboard");
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  let classButton = "right-1";
  let styleButton = "";
  if (page === "market") {
    classButton = "left-1"
    styleButton = "rotate(180deg)";
  }
  
  return (
    <AppLayout>

      <button
        className="page-switch text-4xl font-bold"
        onClick={() =>
          setPage(page === "dashboard" ? "market" : "dashboard")
        }
      >
        <img
          className={`absolute ${classButton} top-2 w-16 h-16`}
          style={{ transform: styleButton }}
          src={navigationArrow}
          alt="arrow"
        />
      </button>
      
      {page === "dashboard" && <Dashboard />}
      {page === "market" && <MarketDashboard />}
    </AppLayout>
  )
}

export default App