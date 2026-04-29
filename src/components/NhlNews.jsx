import { useEffect, useState } from "react"
import axios from "axios"

function NhlNews() {
  const [news, setNews] = useState([])

  useEffect(() => {
    axios.get("http://localhost:3001/api/nhl-news")
      .then(res => setNews(res.data))
  }, [])

  return (
    <div className="
      bg-black/30
      backdrop-blur-xl
      border border-white/10
      rounded-3xl
      p-4
      text-white overflow-y-auto
    ">

      <h3 className="text-white/80 text-sm mb-3">
        NHL News
      </h3>

      <div className="space-y-3 overflow-y-auto max-h-[500px] pr-1">

        {news.map((item, idx) => (
          <a
            key={idx}
            href={item.url}
            target="_blank"
            className="
              block
              bg-white/5
              hover:bg-white/10
              rounded-2xl
              p-3
              transition
            "
          >

            <p className="text-sm font-medium leading-snug">
              {item.title}
            </p>

            <p className="text-xs text-white/50 mt-1 line-clamp-2">
              {item.description}
            </p>

          </a>
        ))}

      </div>
    </div>
  )
}

export default NhlNews