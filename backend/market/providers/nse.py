"""
NSE Provider
============
Implements MarketProvider for NSE-specific data using ``nsepython``.

Covers:
- NSE equity quote data via ``nse_eq()`` and ``nse_quote_ltp()``
- NSE indices (Nifty 50, Nifty Bank, sector indices) via ``nse_get_index_quote()``
- Corporate actions and events calendar via ``nse_events()``
- Institutional flows (FII/DII) via ``nse_fiidii()``
- India VIX via ``indiavix()``

All calls are wrapped in ``asyncio.to_thread`` since nsepython is synchronous.

Official docs: https://unofficed.com/nse-python/documentation/
GitHub: https://github.com/aeron7/nsepython
"""

from __future__ import annotations

import asyncio
import logging
from datetime import date
from typing import Any

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


def _clean_nse_symbol(symbol: str) -> str:
    """Purify symbol for NSE APIs (strip .NS, .BO, whitespace, uppercase)."""
    s = symbol.strip().upper()
    for suffix in [".NS", ".BO"]:
        if s.endswith(suffix):
            s = s[: -len(suffix)]
    return s


class NSEProvider(MarketProvider):
    """
    MarketProvider backed by the NSE India public REST APIs via nsepython.

    Primary use cases:
    - Real-time/snapshot quotes for NSE equities
    - Live NSE index levels (Nifty 50, Nifty Bank, sectoral indices)
    - Corporate actions & events calendar
    - FII/DII institutional flow data
    """

    @property
    def name(self) -> str:
        return "NSE India (nsepython)"

    async def get_stock_quote(self, symbol: str) -> StockQuote:
        """Fetch NSE equity quote via nsepython."""
        clean_sym = _clean_nse_symbol(symbol)
        q = await asyncio.to_thread(self._sync_get_quote, clean_sym)
        return StockQuote(
            symbol=symbol,
            name=q.name,
            price=q.price,
            currency=q.currency,
            change=q.change,
            change_pct=q.change_pct,
            volume=q.volume,
            market_cap=q.market_cap,
            day_high=q.day_high,
            day_low=q.day_low,
            fifty_two_week_high=q.fifty_two_week_high,
            fifty_two_week_low=q.fifty_two_week_low,
            source=q.source,
            fetched_at=q.fetched_at,
        )

    def _sync_get_quote(self, symbol: str) -> StockQuote:
        from nsepython import nse_eq  # type: ignore[import-untyped]

        name = symbol
        price = 0.0
        change = 0.0
        change_pct = 0.0
        volume = 0
        day_high: float | None = None
        day_low: float | None = None
        year_high: float | None = None
        year_low: float | None = None

        try:
            data = nse_eq(symbol)
            if isinstance(data, dict) and data:
                pd = data.get("priceInfo", {})
                md = data.get("metadata", {})
                sec = data.get("securityWiseDP", {})

                name = md.get("companyName", symbol)
                price = float(pd.get("lastPrice") or pd.get("close") or 0.0)
                change = float(pd.get("change") or 0.0)
                change_pct = float(pd.get("pChange") or 0.0)
                volume = int(sec.get("quantityTraded") or 0)

                intra = pd.get("intraDayHighLow", {})
                day_high = float(intra.get("max")) if intra.get("max") is not None else None
                day_low = float(intra.get("min")) if intra.get("min") is not None else None

                week = pd.get("weekHighLow", {})
                year_high = float(week.get("max")) if week.get("max") is not None else None
                year_low = float(week.get("min")) if week.get("min") is not None else None
        except Exception as exc:
            logger.debug("nsepython nse_eq error for %s: %s", symbol, exc)

        return StockQuote(
            symbol=symbol,
            name=name,
            price=price,
            currency="INR",
            change=round(change, 2),
            change_pct=round(change_pct, 2),
            volume=volume,
            market_cap=None,
            day_high=day_high,
            day_low=day_low,
            fifty_two_week_high=year_high,
            fifty_two_week_low=year_low,
            source=self.name,
        )

    async def get_company_info(self, symbol: str) -> CompanyInfo:
        clean_sym = _clean_nse_symbol(symbol)
        info = await asyncio.to_thread(self._sync_get_company_info, clean_sym)
        return CompanyInfo(
            symbol=symbol,
            name=info.name,
            exchange=info.exchange,
            sector=info.sector,
            industry=info.industry,
            description=info.description,
            website=info.website,
            country=info.country,
            employees=info.employees,
            source=info.source,
            fetched_at=info.fetched_at,
        )

    def _sync_get_company_info(self, symbol: str) -> CompanyInfo:
        from nsepython import nse_eq  # type: ignore[import-untyped]

        name = symbol
        sector: str | None = None
        industry: str | None = None

        try:
            data = nse_eq(symbol)
            if isinstance(data, dict):
                md = data.get("metadata", {})
                info = data.get("info", {})
                name = md.get("companyName", symbol)
                sector = info.get("industry")
                industry = md.get("industry") or sector
        except Exception as exc:
            logger.debug("nsepython company info error for %s: %s", symbol, exc)

        return CompanyInfo(
            symbol=symbol,
            name=name,
            exchange="NSE",
            sector=sector,
            industry=industry,
            description=None,
            website=None,
            country="India",
            employees=None,
            source=self.name,
        )

    async def get_financial_ratios(self, symbol: str) -> FinancialRatios:
        """NSE does not provide full fundamental valuation ratios."""
        clean_sym = _clean_nse_symbol(symbol)
        return FinancialRatios(
            symbol=clean_sym,
            pe_ratio=None,
            pb_ratio=None,
            ps_ratio=None,
            ev_ebitda=None,
            roe=None,
            roa=None,
            debt_to_equity=None,
            current_ratio=None,
            dividend_yield=None,
            eps=None,
            source=f"{self.name} (ratios available via YahooFinanceProvider)",
        )

    async def get_historical_prices(
        self, symbol: str, start: date, end: date, interval: str = "1d"
    ) -> HistoricalPrices:
        """Historical prices — delegated to YahooFinanceProvider for standard OHLCV."""
        clean_sym = _clean_nse_symbol(symbol)
        return HistoricalPrices(symbol=clean_sym, interval=interval, bars=[], source=self.name)

    async def search_company(self, query: str, limit: int = 10) -> list[SearchResult]:
        return await asyncio.to_thread(self._sync_search, query, limit)

    def _sync_search(self, query: str, limit: int) -> list[SearchResult]:
        from nsepython import nse_eq_symbols  # type: ignore[import-untyped]

        results: list[SearchResult] = []
        try:
            symbols = nse_eq_symbols()
            q = query.strip().upper()
            if isinstance(symbols, list):
                for sym in symbols:
                    if q in sym.upper():
                        results.append(
                            SearchResult(
                                symbol=f"{sym}.NS",
                                name=sym,
                                exchange="NSE",
                                type="equity",
                            )
                        )
                        if len(results) >= limit:
                            break
        except Exception as exc:
            logger.debug("nse_eq_symbols search error for '%s': %s", query, exc)

        return results

    async def get_news(self, query: str, limit: int = 10, locale: str = "in") -> list[NewsArticle]:
        """News is handled by TheNewsAPIProvider / YahooFinanceProvider."""
        return []

    # ─── NSE Specific Helper Methods ──────────────────────────────────────────

    async def get_index_quote(self, index_name: str = "NIFTY 50") -> dict[str, Any]:
        """Fetch index snapshot via nsepython nse_get_index_quote()."""
        from nsepython import nse_get_index_quote  # type: ignore[import-untyped]

        return await asyncio.to_thread(nse_get_index_quote, index_name)

    async def get_corporate_events(self) -> Any:  # noqa: ANN401
        """Fetch corporate events and dividend calendars via nse_events()."""
        from nsepython import nse_events  # type: ignore[import-untyped]

        return await asyncio.to_thread(nse_events)

    async def get_fii_dii_activity(self) -> Any:  # noqa: ANN401
        """Fetch institutional activity flows via nse_fiidii()."""
        from nsepython import nse_fiidii  # type: ignore[import-untyped]

        return await asyncio.to_thread(nse_fiidii)

    async def health_check(self) -> dict[str, Any]:
        return {"provider": self.name, "status": "ok"}
