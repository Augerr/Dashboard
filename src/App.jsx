import AppLayout from "./layout/AppLayout"
import Dashboard from "./pages/Dashboard"
import MarketDashboard from "./pages/MarketDashboard";
import { useState, useEffect } from "react"

function App() {
  const [page, setPage] = useState("dashboard");

  useEffect(() => {
    const timers = [500, 1500, 3000].map((delay) =>
      setTimeout(() => {
        window.dispatchEvent(new Event("resize"));
      }, delay)
    );

    return () => timers.forEach(clearTimeout);
  }, []);

  // ✅ Keyboard navigation (global)
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "ArrowRight") setPage("second");
      if (e.key === "ArrowLeft") setPage("dashboard");
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);
  
  return (
    <AppLayout>
      {page === "dashboard" && <Dashboard />}
      {page === "market" && <MarketDashboard />}
    </AppLayout>
  )
}

export default App