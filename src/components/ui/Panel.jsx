function Panel({ children, className = "" }) {
  return (
    <div
      className={`
        bg-black/30
        backdrop-blur-2xl
        border border-white/10
        rounded-3xl
        p-4
        text-white
        ${className}
      `}
    >
      {children}
    </div>
  )
}

export default Panel