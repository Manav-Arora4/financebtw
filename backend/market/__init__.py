"""Market provider abstraction layer."""

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
from backend.market.registry import ProviderRegistry, registry

__all__ = [
    "CompanyInfo",
    "FinancialRatios",
    "HistoricalPrices",
    "MarketProvider",
    "NewsArticle",
    "PriceBar",
    "ProviderRegistry",
    "SearchResult",
    "StockQuote",
    "registry",
]
