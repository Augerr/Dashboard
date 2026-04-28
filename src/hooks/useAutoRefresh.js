import { useEffect } from "react"

export function useAutoRefresh(callback, interval = 60000) {
  useEffect(() => {
    callback() // run immediately

    const id = setInterval(() => {
      callback()
    }, interval)

    return () => clearInterval(id)
  }, [callback, interval])
}