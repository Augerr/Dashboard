import type { ReactNode } from "react"
import { Box } from "@mui/material"

type AppLayoutProps = {
  children: ReactNode;
};

function AppLayout({ children }: AppLayoutProps) {
  return (
    <Box className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#020617] to-black text-white">
      <Box className="flex">
        <Box component="main" className="flex-1 p-2">
          {children}
        </Box>
      </Box>
    </Box>
  )
}

export default AppLayout
