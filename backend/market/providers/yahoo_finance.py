"""
Yahoo Finance Provider
======================
Implements MarketProvider using the ``yfinance`` library (version 1.5+).

- No API key required.
- NSE tickers: append ``.NS``  (e.g. ``RELIANCE.NS``, ``TCS.NS``)
- BSE tickers: append ``.BO``  (e.g. ``RELIANCE.BO``)
- US & Global tickers supported natively (e.g. ``AAPL``, ``NVDA``, ``MSFT``)
- All sync yfinance calls are wrapped in ``asyncio.to_thread`` to keep
  the FastAPI event loop non-blocking.

Official docs: https://ranaroussi.github.io/yfinance/
"""

from __future__ import annotations

import asyncio
import logging
from datetime import UTC, date, datetime
from typing import Any

from backend.market.base import (
    CompanyInfo,
    FinancialRatios,
    HistoricalPrices,
    MarketProvider,
    NewsArticle,
    PriceBar,
    SearchResult,
    StockQuote,
)

logger = logging.getLogger(__name__)


def _sanitize_symbol(symbol: str) -> str:
    """Format and strip whitespace from ticker symbols."""
    return symbol.strip().upper()


class YahooFinanceProvider(MarketProvider):
    """
    MarketProvider backed by Yahoo Finance via ``yfinance``.

    This is the primary provider for live/delayed quotes, company profiles,
    financial ratios, and historical OHLCV prices across Indian & global equities.
    """

    @property
    def name(self) -> str:
        return "Yahoo Finance (yfinance)"

    async def get_stock_quote(self, symbol: str) -> StockQuote:
        """Fetch delayed or live quote from Yahoo Finance."""
        clean_symbol = _sanitize_symbol(symbol)
        return await asyncio.to_thread(self._sync_get_quote, clean_symbol)

    def _sync_get_quote(self, symbol: str) -> StockQuote:
        import yfinance as yf

        ticker = yf.Ticker(symbol)

        # First attempt fast_info (fast, reliable real-time attributes)
        price = 0.0
        change = 0.0
        change_pct = 0.0
        currency = "INR" if symbol.endswith((".NS", ".BO")) else "USD"
        market_cap: float | None = None
        day_high: float | None = None
        day_low: float | None = None
        year_high: float | None = None
        year_low: float | None = None
        volume = 0
        name = symbol

        try:
            fast = ticker.fast_info
            price = float(getattr(fast, "last_price", 0.0) or 0.0)
            prev_close = float(getattr(fast, "previous_close", 0.0) or 0.0)
            if price and prev_close:
                change = price - prev_close
                change_pct = (change / prev_close) * 100.0
            currency = str(getattr(fast, "currency", currency) or currency)
            market_cap = getattr(fast, "market_cap", None)
            day_high = getattr(fast, "day_high", None)
            day_low = getattr(fast, "day_low", None)
            year_high = getattr(fast, "year_high", None)
            year_low = getattr(fast, "year_low", None)
            volume = int(getattr(fast, "last_volume", 0) or 0)
        except Exception as exc:
            logger.debug("Fast info extraction fallback for %s: %s", symbol, exc)

        # Fallback / augment with info dict if name or attributes missing
        try:
            info = ticker.info or {}
            name = info.get("longName") or info.get("shortName") or symbol
            if not price:
                price = float(info.get("currentPrice") or info.get("regularMarketPrice") or 0.0)
                change = float(info.get("regularMarketChange") or 0.0)
                change_pct = float(info.get("regularMarketChangePercent") or 0.0)
            if not volume:
                volume = int(info.get("regularMarketVolume") or info.get("volume") or 0)
            if market_cap is None:
                market_cap = info.get("marketCap")
            if day_high is None:
                day_high = info.get("dayHigh") or info.get("regularMarketDayHigh")
            if day_low is None:
                day_low = info.get("dayLow") or info.get("regularMarketDayLow")
            if year_high is None:
                year_high = info.get("fiftyTwoWeekHigh")
            if year_low is None:
                year_low = info.get("fiftyTwoWeekLow")
            if "currency" in info:
                currency = info["currency"]
        except Exception as exc:
            logger.debug("Info extraction fallback for %s: %s", symbol, exc)

        return StockQuote(
            symbol=symbol,
            name=name,
            price=price,
            currency=currency,
            change=round(change, 2),
            change_pct=round(change_pct, 2),
            volume=volume,
            market_cap=float(market_cap) if market_cap is not None else None,
            day_high=float(day_high) if day_high is not None else None,
            day_low=float(day_low) if day_low is not None else None,
            fifty_two_week_high=float(year_high) if year_high is not None else None,
            fifty_two_week_low=float(year_low) if year_low is not None else None,
            source=self.name,
        )

    async def get_company_info(self, symbol: str) -> CompanyInfo:
        clean_symbol = _sanitize_symbol(symbol)
        return await asyncio.to_thread(self._sync_get_company_info, clean_symbol)

    def _sync_get_company_info(self, symbol: str) -> CompanyInfo:
        import yfinance as yf

        ticker = yf.Ticker(symbol)
        info = ticker.info or {}
        return CompanyInfo(
            symbol=symbol,
            name=info.get("longName") or info.get("shortName") or symbol,
            exchange=info.get(
                "exchange",
                "NSE" if symbol.endswith(".NS") else "BSE" if symbol.endswith(".BO") else "",
            ),
            sector=info.get("sector"),
            industry=info.get("industry"),
            description=info.get("longBusinessSummary"),
            website=info.get("website"),
            country=info.get("country"),
            employees=info.get("fullTimeEmployees"),
            source=self.name,
        )

    async def get_financial_ratios(self, symbol: str) -> FinancialRatios:
        clean_symbol = _sanitize_symbol(symbol)
        return await asyncio.to_thread(self._sync_get_ratios, clean_symbol)

    def _sync_get_ratios(self, symbol: str) -> FinancialRatios:
        import yfinance as yf

        ticker = yf.Ticker(symbol)
        info = ticker.info or {}
        return FinancialRatios(
            symbol=symbol,
            pe_ratio=info.get("trailingPE"),
            pb_ratio=info.get("priceToBook"),
            ps_ratio=info.get("priceToSalesTrailing12Months"),
            ev_ebitda=info.get("enterpriseToEbitda"),
            roe=info.get("returnOnEquity"),
            roa=info.get("returnOnAssets"),
            debt_to_equity=info.get("debtToEquity"),
            current_ratio=info.get("currentRatio"),
            dividend_yield=info.get("dividendYield"),
            eps=info.get("trailingEps"),
            source=self.name,
        )

    async def get_historical_prices(
        self,
        symbol: str,
        start: date,
        end: date,
        interval: str = "1d",
    ) -> HistoricalPrices:
        clean_symbol = _sanitize_symbol(symbol)
        return await asyncio.to_thread(self._sync_get_history, clean_symbol, start, end, interval)

    def _sync_get_history(
        self, symbol: str, start: date, end: date, interval: str
    ) -> HistoricalPrices:
        import yfinance as yf

        ticker = yf.Ticker(symbol)
        df = ticker.history(
            start=start.isoformat(),
            end=end.isoformat(),
            interval=interval,
            auto_adjust=True,
        )
        bars: list[PriceBar] = []
        for idx, row in df.iterrows():
            date_str = str(idx.date()) if hasattr(idx, "date") else str(idx).split(" ")[0]
            bars.append(
                PriceBar(
                    date=date_str,
                    open=float(row.get("Open", 0.0)),
                    high=float(row.get("High", 0.0)),
                    low=float(row.get("Low", 0.0)),
                    close=float(row.get("Close", 0.0)),
                    volume=int(row.get("Volume", 0)),
                )
            )
        return HistoricalPrices(symbol=symbol, interval=interval, bars=bars, source=self.name)

    async def search_company(self, query: str, limit: int = 10) -> list[SearchResult]:
        return await asyncio.to_thread(self._sync_search, query, limit)

    def _sync_search(self, query: str, limit: int) -> list[SearchResult]:
        import yfinance as yf

        try:
            search = yf.Search(query, max_results=limit)
            quotes = getattr(search, "quotes", []) or []
            results: list[SearchResult] = []
            for item in quotes[:limit]:
                results.append(
                    SearchResult(
                        symbol=item.get("symbol", ""),
                        name=item.get("shortname")
                        or item.get("longname")
                        or item.get("symbol", ""),
                        exchange=item.get("exchange", ""),
                        type=item.get("quoteType", "equity").lower(),
                        score=float(item.get("score", 1.0) or 1.0),
                    )
                )
            return results
        except Exception as exc:
            logger.debug("yfinance search error for query '%s': %s", query, exc)
            return []

    async def get_news(self, query: str, limit: int = 10, locale: str = "in") -> list[NewsArticle]:
        clean_query = _sanitize_symbol(query)
        return await asyncio.to_thread(self._sync_get_news, clean_query, limit)

    def _sync_get_news(self, query: str, limit: int) -> list[NewsArticle]:
        import yfinance as yf

        articles: list[NewsArticle] = []
        try:
            ticker = yf.Ticker(query)
            news_items = ticker.news or []
            for item in news_items[:limit]:
                # Publish time is unix timestamp in yfinance news
                ts = item.get("providerPublishTime")
                pub_date = (
                    datetime.fromtimestamp(ts, tz=UTC).isoformat()
                    if ts
                    else datetime.now(UTC).isoformat()
                )
                articles.append(
                    NewsArticle(
                        title=item.get("title", ""),
                        description=item.get("summary") or item.get("description"),
                        url=item.get("link", ""),
                        source=item.get("publisher", "Yahoo Finance"),
                        published_at=pub_date,
                        categories=item.get("relatedTickers", []),
                        provider=self.name,
                    )
                )
        except Exception as exc:
            logger.debug("yfinance news retrieval error for query '%s': %s", query, exc)

        return articles

    async def health_check(self) -> dict[str, Any]:
        try:
            quote = await self.get_stock_quote("TCS.NS")
            if quote.price > 0:
                return {
                    "provider": self.name,
                    "status": "ok",
                    "test_symbol": "TCS.NS",
                    "price": quote.price,
                }
            return {"provider": self.name, "status": "degraded", "detail": "Quote price zero"}
        except Exception as exc:
            return {"provider": self.name, "status": "error", "detail": str(exc)}
