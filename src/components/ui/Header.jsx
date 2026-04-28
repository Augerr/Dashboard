function Header() {
  return (
    <div className="
      sticky top-0 z-50
      backdrop-blur-xl
      bg-white/5
      border-b border-white/10
      px-6 py-4
      flex items-center justify-between
    ">

      <h1 className="text-lg font-semibold">
        Dashboard
      </h1>

      <div className="flex items-center gap-4 text-sm text-white/60">

        <span>Live</span>
        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />

      </div>

    </div>
  )
}

export default Header