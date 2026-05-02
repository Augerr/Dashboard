export const isSameDay = (a, b) => {
  const sameDay = 
    a &&
    b &&
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  return sameDay
}

export const isPastDay = (date) => {
  if (!date) return false;

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const dayStart = new Date(date);
  dayStart.setHours(0, 0, 0, 0);

  return dayStart < todayStart;
};

export const getEventsForDay = (events, day) => {
  if (!day) return []

  return events.filter((event) => {
    const eventDate = new Date(event.start)
    return isSameDay(eventDate, day)
  })
}