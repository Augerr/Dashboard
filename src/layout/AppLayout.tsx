import type { ReactNode } from "react"

type AppLayoutProps = {
  children: ReactNode;
};

function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#020617] to-black text-white">

      {/* BODY */}
      <div className="flex">

        <main className="flex-1 p-2">
          {children}
        </main>

      </div>

    </div>
  )
}

export default AppLayout
