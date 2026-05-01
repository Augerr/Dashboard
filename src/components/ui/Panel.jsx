function Panel({ children }) {
  return (
    <div className="
      h-full w-full rounded-3xl bg-white/10 p-4 shadow-2xl
      backdrop-blur-2xl
      transition-all duration-300
      hover:scale-[1.01] hover:bg-white/15 hover:shadow-white/10
    ">
      {children}
    </div>
  );
}

export default Panel;