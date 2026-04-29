function AppLayout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#020617] to-black text-white">

      {/* HEADER */}
      {/* <Header /> */}

      {/* BODY */}
      <div className="flex">

        {/* SIDEBAR */}
        {/* <Sidebar /> */}

        {/* MAIN CONTENT */}
        <main className="flex-1 p-6">
          {children}
        </main>

      </div>

    </div>
  )
}

export default AppLayout