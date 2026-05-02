import { marketNewsConfig } from "../config/constants.js";
import { env } from "../config/env.js";
import { marketNewsCacheFile } from "../config/paths.js";
import type { MarketNewsArticle } from "../types/api.js";
import type {
  SerpApiGoogleNewsResponse,
  SerpApiNewsResult,
} from "../types/external.js";
import { readDiskCache, writeDiskCache } from "../utils/diskCache.js";

type MarketNewsCache = {
  articles: MarketNewsArticle[];
  fetchedAt: number;
};

let marketNewsCache: MarketNewsCache | null = null;
let marketNewsFetchPromise: Promise<MarketNewsArticle[]> | null = null;

const isMarketNewsArticle = (article: unknown): article is MarketNewsArticle => {
  if (!article || typeof article !== "object") return false;

  const candidate = article as Partial<MarketNewsArticle>;
  return (
    typeof candidate.title === "string" && typeof candidate.link === "string"
  );
};

const isMarketNewsCache = (cache: unknown): cache is MarketNewsCache => {
  if (!cache || typeof cache !== "object") return false;

  const candidate = cache as Partial<MarketNewsCache>;
  return (
    Array.isArray(candidate.articles) &&
    typeof candidate.fetchedAt === "number" &&
    candidate.articles.every(isMarketNewsArticle)
  );
};

export const getMarketNewsCacheAgeSeconds = (): number | null => {
  if (!marketNewsCache) return null;
  return Math.max(
    0,
    Math.floor((Date.now() - marketNewsCache.fetchedAt) / 1000),
  );
};

export const getStaleMarketNews = (): MarketNewsArticle[] | null => {
  return marketNewsCache?.articles ?? null;
};

const isFresh = (cache: MarketNewsCache): boolean => {
  return Date.now() - cache.fetchedAt < marketNewsConfig.cacheTtlMs;
};

const normalizeSerpApiNewsResult = (
  article: SerpApiNewsResult,
): MarketNewsArticle | null => {
  const title = article.title ?? article.highlight?.title;
  const link = article.link ?? article.highlight?.link;

  if (!title || !link) return null;

  return {
    id: article.position ?? link,
    title,
    link,
    thumbnail:
      article.thumbnail ??
      article.thumbnail_small ??
      article.highlight?.thumbnail ??
      article.source?.icon,
    source: {
      name: article.source?.title ?? article.source?.name,
      icon: article.source?.icon,
    },
    date: article.date,
    isoDate: article.iso_date,
  };
};

const fetchMarketNewsFromSerpApi = async (): Promise<MarketNewsArticle[]> => {
  if (!env.serpApiKey) {
    throw new Error("Missing SERPDATA_API_KEY or SERPAPI_API_KEY");
  }

  const params = new URLSearchParams({
    api_key: env.serpApiKey,
    engine: "google_news",
    q: env.marketNewsQuery,
    gl: "us",
    hl: "en",
  });
  const response = await fetch(`https://serpapi.com/search.json?${params}`);

  if (!response.ok) {
    throw new Error(`SerpApi news request failed: ${response.status}`);
  }

  const data = (await response.json()) as SerpApiGoogleNewsResponse;

  if (data.error) {
    throw new Error(`SerpApi news request failed: ${data.error}`);
  }

  return (data.news_results ?? [])
    .map(normalizeSerpApiNewsResult)
    .filter((article): article is MarketNewsArticle => article !== null)
    .slice(0, marketNewsConfig.maxArticles);
};

export const getMarketNews = async (): Promise<MarketNewsArticle[]> => {
  if (marketNewsCache && isFresh(marketNewsCache)) {
    return marketNewsCache.articles;
  }

  const diskCache = await readDiskCache({
    filePath: marketNewsCacheFile,
    isValid: isMarketNewsCache,
  });
  if (diskCache && isFresh(diskCache)) {
    marketNewsCache = diskCache;
    return diskCache.articles;
  }

  if (marketNewsFetchPromise) {
    return marketNewsFetchPromise;
  }

  marketNewsFetchPromise = fetchMarketNewsFromSerpApi()
    .then((articles) => {
      const cache = {
        articles,
        fetchedAt: Date.now(),
      };

      marketNewsCache = cache;
      void writeDiskCache(marketNewsCacheFile, cache);

      return articles;
    })
    .finally(() => {
      marketNewsFetchPromise = null;
    });

  return marketNewsFetchPromise;
};
