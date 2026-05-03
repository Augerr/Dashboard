import type { ReactNode } from "react";

type PanelProps = {
  children: ReactNode;
};

function Panel({ children }: PanelProps) {
  return (
    <div
      className="
      h-full w-full rounded-3xl bg-black/10 p-2 shadow-2xl
      backdrop-blur-2xl border-1 border-gray-500
      transition-all duration-300
      hover:scale-[1.01] hover:bg-white/15 hover:shadow-white/10
    "
    >
      {children}
    </div>
  );
}

export default Panel;
