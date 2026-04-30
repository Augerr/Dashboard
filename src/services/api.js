import axios from "axios"

export const fetchCalendar = async () => {
  const res = await axios.get("http://localhost:3001/api/calendar")
  return res.data
}