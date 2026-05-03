// src/utils/eventTheme.ts

export function getEventColor(index = 0) {
  const colors = [
    "bg-fuchsia-500/80 border-fuchsia-200/30 shadow-fuchsia-500/20",
    "bg-emerald-500/80 border-emerald-200/30 shadow-emerald-500/20",
    "bg-orange-500/80 border-orange-200/30 shadow-orange-500/20",
    "bg-violet-500/80 border-violet-200/30 shadow-violet-500/20",
    "bg-rose-500/80 border-rose-200/30 shadow-rose-500/20",
  ];
  console.log(index);
  return colors[index % colors.length];
}
