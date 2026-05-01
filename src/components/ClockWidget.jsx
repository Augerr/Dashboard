import { useEffect, useState } from "react";

function ClockWidget() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const time = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const date = now.toLocaleDateString([], {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="rounded-2xl bg-white/10 p-4 text-white shadow-lg">
      <p className="text-sm text-white/50">Current Time</p>
      <div className="mt-2 text-5xl font-bold tracking-tight">
        {time}
      </div>
      <div className="mt-2 text-lg text-white/70">
        {date}
      </div>
    </div>
  );
}

export default ClockWidget;