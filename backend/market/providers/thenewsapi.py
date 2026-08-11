"""
TheNewsAPI Provider
===================
Implements the news capability of MarketProvider using TheNewsAPI.com.

API docs: https://www.thenewsapi.com/documentation
Endpoint: GET https://api.thenewsapi.com/v1/news/all

Default filters for India financial news:
    locale=in
    categories=business
    language=en

Free tier: ~100 requests/day (check dashboard for current limits).
"""

from __future__ import annotations

import logging
from datetime import UTC, date, datetime
from typing import Any

import httpx

from backend.config import get_settings
from backend.market.base import (
    CompanyInfo,
    FinancialRatios,
    HistoricalPrices,
    MarketProvider,
    NewsArticle,
    SearchResult,
    StockQuote,
)

logger = logging.getLogger(__name__)
_settings = get_settings()


class TheNewsAPIProvider(MarketProvider):
    """
    MarketProvider for financial news backed by TheNewsAPI.com.

    This provider only implements ``get_news()``. All other methods raise
    ``NotImplementedError`` — register separate providers for market data.

    Authentication: Bearer token via ``THE_NEWS_API_KEY`` env var.
    """

    BASE_URL = "https://api.thenewsapi.com/v1"

    @property
    def name(self) -> str:
        return "TheNewsAPI (thenewsapi.com)"

    async def get_news(
        self,
        query: str,
        limit: int = 10,
        locale: str = "in",
    ) -> list[NewsArticle]:
        """
        Fetch financial news articles matching *query* for the given *locale*.

        Args:
            query:  Search terms (e.g. ``"Reliance Industries Q2 results"``).
            limit:  Maximum articles to return (capped at 50 by the API).
            locale: Country code — ``"in"`` for India, ``"us"`` for USA, etc.
        """
        api_key = _settings.the_news_api_key
        if not api_key:
            logger.warning("THE_NEWS_API_KEY is not set — returning empty news list")
            return []

        params: dict[str, str | int] = {
            "api_token": api_key,
            "search": query,
            "locale": locale,
            "categories": "business",
            "language": "en",
            "limit": min(limit, 50),
            "sort": "published_at",
        }

        async with httpx.AsyncClient(timeout=10.0) as client:
            try:
                response = await client.get(f"{self.BASE_URL}/news/all", params=params)
                response.raise_for_status()
                data = response.json()
            except httpx.HTTPStatusError as exc:
                logger.error(
                    "TheNewsAPI request failed: %s %s", exc.response.status_code, exc.response.text
                )
                return []
            except httpx.RequestError as exc:
                logger.error("TheNewsAPI connection error: %s", exc)
                return []

        articles: list[NewsArticle] = []
        for item in data.get("data", []):
            articles.append(
                NewsArticle(
                    title=item.get("title", ""),
                    description=item.get("description"),
                    url=item.get("url", ""),
                    source=item.get("source", ""),
                    published_at=item.get("published_at", datetime.now(UTC).isoformat()),
                    categories=item.get("categories", []),
                    provider=self.name,
                )
            )
        return articles

    # ── Unsupported capabilities ──────────────────────────────────────────────

    async def get_stock_quote(self, symbol: str) -> StockQuote:  # type: ignore[override]
        raise NotImplementedError(f"{self.name} does not support stock quotes.")

    async def get_company_info(self, symbol: str) -> CompanyInfo:  # type: ignore[override]
        raise NotImplementedError(f"{self.name} does not support company info.")

    async def get_financial_ratios(self, symbol: str) -> FinancialRatios:  # type: ignore[override]
        raise NotImplementedError(f"{self.name} does not support financial ratios.")

    async def get_historical_prices(  # type: ignore[override]
        self, symbol: str, start: date, end: date, interval: str = "1d"
    ) -> HistoricalPrices:
        raise NotImplementedError(f"{self.name} does not support historical prices.")

    async def search_company(self, query: str, limit: int = 10) -> list[SearchResult]:
        raise NotImplementedError(f"{self.name} does not support company search.")

    async def health_check(self) -> dict[str, Any]:
        api_key = _settings.the_news_api_key
        if not api_key:
            return {"provider": self.name, "status": "unconfigured", "detail": "No API key set"}
        try:
            articles = await self.get_news("india market", limit=1)
            return {
                "provider": self.name,
                "status": "ok",
                "articles_returned": len(articles),
            }
        except Exception as exc:
            return {"provider": self.name, "status": "error", "detail": str(exc)}
