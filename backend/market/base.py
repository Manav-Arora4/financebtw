"""
FinanceBtw — Abstract Market Provider Interface
===============================================
Every market data source (Yahoo Finance, NSE, BSE, TheNewsAPI, FMP, ...)
must implement this interface. The Agent and API layer only ever interact
with this abstract contract — never with concrete providers directly.

This separation means:
- Swapping providers is a one-line config change.
- Adding a new provider requires zero changes to core logic.
- Every response carries a ``source`` and ``fetched_at`` field for citation.
"""

from __future__ import annotations

from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from datetime import UTC, date, datetime
from typing import Any


def _get_utc_now_iso() -> str:
    """Return ISO-8601 formatted UTC timestamp with timezone offset."""
    return datetime.now(UTC).isoformat()


# ─── Response Dataclasses ────────────────────────────────────────────────────
# Every dataclass carries ``source`` (which provider) and ``fetched_at``
# (ISO-8601 timestamp) so the frontend can always cite its data origin.


@dataclass(frozen=True, slots=True)
class StockQuote:
    """Real-time or delayed stock price quote."""

    symbol: str
    name: str
    price: float
    currency: str
    change: float
    change_pct: float
    volume: int
    market_cap: float | None
    day_high: float | None
    day_low: float | None
    fifty_two_week_high: float | None
    fifty_two_week_low: float | None
    source: str
    fetched_at: str = field(default_factory=_get_utc_now_iso)


@dataclass(frozen=True, slots=True)
class CompanyInfo:
    """Company metadata and profile."""

    symbol: str
    name: str
    exchange: str
    sector: str | None
    industry: str | None
    description: str | None
    website: str | None
    country: str | None
    employees: int | None
    source: str
    fetched_at: str = field(default_factory=_get_utc_now_iso)


@dataclass(frozen=True, slots=True)
class FinancialRatios:
    """Key fundamental valuation and profitability ratios."""

    symbol: str
    pe_ratio: float | None
    pb_ratio: float | None
    ps_ratio: float | None
    ev_ebitda: float | None
    roe: float | None  # Return on Equity
    roa: float | None  # Return on Assets
    debt_to_equity: float | None
    current_ratio: float | None
    dividend_yield: float | None
    eps: float | None
    source: str
    fetched_at: str = field(default_factory=_get_utc_now_iso)


@dataclass(frozen=True, slots=True)
class PriceBar:
    """Single OHLCV candlestick."""

    date: str  # ISO-8601 date string
    open: float
    high: float
    low: float
    close: float
    volume: int
    adjusted_close: float | None = None


@dataclass(frozen=True, slots=True)
class HistoricalPrices:
    """Series of OHLCV bars for a given symbol and date range."""

    symbol: str
    interval: str  # "1d", "1wk", "1mo"
    bars: list[PriceBar]
    source: str
    fetched_at: str = field(default_factory=_get_utc_now_iso)


@dataclass(frozen=True, slots=True)
class SearchResult:
    """Single company match from a search query."""

    symbol: str
    name: str
    exchange: str
    type: str  # "equity", "etf", "index", ...
    score: float = 1.0  # relevance score if available


@dataclass(frozen=True, slots=True)
class NewsArticle:
    """Single news article with full provenance."""

    title: str
    description: str | None
    url: str
    source: str  # e.g. "Economic Times"
    published_at: str  # ISO-8601
    categories: list[str]
    provider: str  # which MarketProvider served this
    fetched_at: str = field(default_factory=_get_utc_now_iso)


# ─── Abstract Base Class ─────────────────────────────────────────────────────


class MarketProvider(ABC):
    """
    Abstract base class for all market data providers.

    Concrete implementations live in ``backend/market/providers/``.
    Register them via ``ProviderRegistry`` at startup.

    All methods are async-first. Providers that use sync libraries
    (e.g. yfinance, nsepython) must wrap calls in ``asyncio.to_thread()``.
    """

    @property
    @abstractmethod
    def name(self) -> str:
        """Human-readable provider name used in ``source`` fields."""
        ...

    @abstractmethod
    async def get_stock_quote(self, symbol: str) -> StockQuote:
        """
        Fetch a real-time (or delayed) quote for the given symbol.

        Args:
            symbol: Ticker symbol. Append ``.NS`` for NSE, ``.BO`` for BSE.

        Returns:
            :class:`StockQuote` with current price and change data.
        """
        ...

    @abstractmethod
    async def get_company_info(self, symbol: str) -> CompanyInfo:
        """Fetch company profile and metadata."""
        ...

    @abstractmethod
    async def get_financial_ratios(self, symbol: str) -> FinancialRatios:
        """Fetch key fundamental ratios for a given symbol."""
        ...

    @abstractmethod
    async def get_historical_prices(
        self,
        symbol: str,
        start: date,
        end: date,
        interval: str = "1d",
    ) -> HistoricalPrices:
        """
        Fetch OHLCV history.

        Args:
            symbol: Ticker symbol.
            start: Start date (inclusive).
            end: End date (inclusive).
            interval: One of ``"1d"``, ``"1wk"``, ``"1mo"``.
        """
        ...

    @abstractmethod
    async def search_company(self, query: str, limit: int = 10) -> list[SearchResult]:
        """Search for companies by name or partial ticker."""
        ...

    @abstractmethod
    async def get_news(
        self,
        query: str,
        limit: int = 10,
        locale: str = "in",
    ) -> list[NewsArticle]:
        """
        Fetch recent financial news articles.

        Args:
            query: Search keywords or company name.
            limit: Max number of articles to return.
            locale: ISO 3166-1 alpha-2 country code (default ``"in"`` for India).
        """
        ...

    def __repr__(self) -> str:
        return f"<{self.__class__.__name__} name={self.name!r}>"

    # ── Optional helpers ──────────────────────────────────────────────────────
    # Providers may override these for efficiency; defaults are no-ops.

    async def health_check(self) -> dict[str, Any]:
        """Return provider health status. Used by /api/v1/health."""
        return {"provider": self.name, "status": "ok"}
