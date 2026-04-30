import axios from "axios"
const API_BASE = import.meta.env.VITE_API_URL

export const fetchCalendar = async () => {
  const res = await axios.get(`${API_BASE}/api/calendar`)
  return res.data
}