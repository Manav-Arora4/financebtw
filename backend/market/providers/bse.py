"""
BSE Provider (stub)
====================
Implements MarketProvider for BSE-specific data using ``bsedata``.

Phase 11 will flesh this out fully.
"""

from __future__ import annotations

import asyncio
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


class BSEProvider(MarketProvider):
    """MarketProvider backed by BSE India via ``bsedata``."""

    @property
    def name(self) -> str:
        return "BSE India (bsedata)"

    async def get_stock_quote(self, symbol: str) -> StockQuote:
        return await asyncio.to_thread(self._sync_get_quote, symbol)

    def _sync_get_quote(self, symbol: str) -> StockQuote:
        from bsedata.bse import BSE  # type: ignore[import-untyped]

        bse = BSE()
        # bsedata uses numeric scrip codes, not symbols
        # Phase 11 will add symbol→code mapping
        data = bse.getQuote(symbol)
        return StockQuote(
            symbol=symbol,
            name=data.get("companyName", symbol),
            price=float(data.get("currentValue", 0.0)),
            currency="INR",
            change=float(data.get("change", 0.0)),
            change_pct=float(data.get("pChange", 0.0)),
            volume=int(data.get("totalTradedQuantity", 0)),
            market_cap=None,
            day_high=data.get("dayHigh"),
            day_low=data.get("dayLow"),
            fifty_two_week_high=data.get("52weekHigh"),
            fifty_two_week_low=data.get("52weekLow"),
            source=self.name,
        )

    async def get_company_info(self, symbol: str) -> CompanyInfo:  # type: ignore[override]
        raise NotImplementedError("BSEProvider.get_company_info — Phase 11")

    async def get_financial_ratios(self, symbol: str) -> FinancialRatios:  # type: ignore[override]
        raise NotImplementedError("BSEProvider.get_financial_ratios — Phase 11")

    async def get_historical_prices(  # type: ignore[override]
        self, symbol: str, start: date, end: date, interval: str = "1d"
    ) -> HistoricalPrices:
        raise NotImplementedError("BSEProvider.get_historical_prices — Phase 11")

    async def search_company(self, query: str, limit: int = 10) -> list[SearchResult]:
        return []

    async def get_news(self, query: str, limit: int = 10, locale: str = "in") -> list[NewsArticle]:
        return []

    async def health_check(self) -> dict[str, Any]:
        return {"provider": self.name, "status": "stub — Phase 11"}
