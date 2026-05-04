import { useState, useRef, useEffect } from "react";
import AppLayout from "@/layout/AppLayout";
import Dashboard from "@/pages/Dashboard";
import MarketDashboard from "@/pages/MarketDashboard";
import CommandCenter from "./pages/CommandCenter";

type Page = "dashboard" | "market" | "command";

const pages: Page[] = ["dashboard", "market", "command"];

function App() {
  const [page, setPage] = useState<Page>("dashboard");
  const startX = useRef<number | null>(null);

  const goNext = () => {
    setPage((current) => {
      const index = pages.indexOf(current);
      return pages[(index + 1) % pages.length];
    });
  };

  const goPrevious = () => {
    setPage((current) => {
      const index = pages.indexOf(current);
      return pages[(index - 1 + pages.length) % pages.length];
    });
  };

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
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrevious();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    startX.current = e.clientX;
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (startX.current === null) return;

    const diff = e.clientX - startX.current;
    const threshold = 80;

    if (diff > threshold) {
      goPrevious();
    }

    if (diff < -threshold) {
      goNext();
    }

    startX.current = null;
  };

  return (
    <AppLayout>
      <div
        className="min-h-screen touch-pan-y"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
      >
        {page === "dashboard" && <Dashboard />}
        {page === "market" && <MarketDashboard />}
        {page === "command" && <CommandCenter />}
      </div>
    </AppLayout>
  );
}

export default App;
