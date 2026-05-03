import { useState, useEffect } from "react";
import AppLayout from "@/layout/AppLayout";
import Dashboard from "@/pages/Dashboard";
import MarketDashboard from "@/pages/MarketDashboard";

type Page = "dashboard" | "market";

function App() {
  const [page, setPage] = useState<Page>("dashboard");

  useEffect(() => {
    const timers = [1500, 3000, 10000].map((delay) =>
      setTimeout(() => {
        window.dispatchEvent(new Event("resize"));
      }, delay),
    );

    return () => timers.forEach(clearTimeout);
  }, []);

  // ✅ Keyboard navigation (global)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") setPage("market");
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
  );
}

export default App;
