function Panel({ children }) {
  return (
    <div className="h-full rounded-2xl bg-white/10 p-4 shadow-lg">
      {children}
    </div>
  );
}

export default Panel;