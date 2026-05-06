import type { ReactNode } from "react";
import { Paper } from "@mui/material";

type PanelProps = {
  children: ReactNode;
  className?: string;
};

function Panel({ children, className = "" }: PanelProps) {
  return (
    <Paper
      elevation={10}
      className={`
        h-full w-full rounded-lg border border-white/15 bg-white/10 p-2
        shadow-2xl backdrop-blur-2xl transition-all duration-300
        hover:scale-[1.01] hover:bg-white/15 hover:shadow-white/10
        ${className}
    `}
    >
      {children}
    </Paper>
  );
}

export default Panel;
