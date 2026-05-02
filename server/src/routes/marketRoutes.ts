import { Router, type Request } from "express";
import {
  getMarketNews,
  getMarketNewsCacheAgeSeconds,
  getStaleMarketNews,
} from "../services/marketNewsService.js";
import {
  getCryptoQuote,
  getStockQuote,
} from "../services/marketQuoteService.js";
import { getErrorMessage } from "../utils/errors.js";

export const marketRouter = Router();

marketRouter.get("/market-news", async (_req, res) => {
  try {
    const articles = await getMarketNews();

    res.set(
      "Cache-Control",
      "public, max-age=3600, stale-while-revalidate=43200",
    );
    res.set(
      "X-Market-News-Cache-Age",
      String(getMarketNewsCacheAgeSeconds() ?? 0),
    );
    res.json(articles);
  } catch (error) {
    const staleArticles = getStaleMarketNews();
    if (staleArticles) {
      res.set("Cache-Control", "public, max-age=300");
      res.set("X-Market-News-Cache", "stale");
      res.json(staleArticles);
      return;
    }

    console.error("Market news API error:", getErrorMessage(error));
    res.status(500).json({ error: "Failed to fetch market news" });
  }
});

marketRouter.get(
  "/stocks/:symbol",
  async (req: Request<{ symbol: string }>, res) => {
    try {
      const quote = await getStockQuote(req.params.symbol);
      res.json(quote);
    } catch (error) {
      console.error("Stock API error:", getErrorMessage(error));
      res.status(500).json({ error: "Failed to fetch stock data" });
    }
  },
);

marketRouter.get(
  "/crypto/:symbol",
  async (req: Request<{ symbol: string }>, res) => {
    try {
      const quote = await getCryptoQuote(req.params.symbol);
      res.json(quote);
    } catch (error) {
      console.error("Crypto API error:", getErrorMessage(error));
      res.status(500).json({ error: "Failed to fetch crypto data" });
    }
  },
);
