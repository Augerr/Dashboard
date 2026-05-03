import axios from "axios"
import type { CalendarEvent } from "@/types/app"

const API_BASE = import.meta.env.VITE_API_URL

export const fetchCalendar = async (): Promise<CalendarEvent[]> => {
  const res = await axios.get<CalendarEvent[]>(`${API_BASE}/api/calendar`)
  return res.data
}
