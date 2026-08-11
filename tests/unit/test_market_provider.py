"""
Unit tests for backend/market/base.py and backend/market/registry.py
"""

from __future__ import annotations

from dataclasses import FrozenInstanceError

import pytest

from backend.market.base import CompanyInfo, MarketProvider, StockQuote
from backend.market.registry import ProviderRegistry

# ─── Minimal concrete provider for testing ───────────────────────────────────


class _MockProvider(MarketProvider):
    @property
    def name(self) -> str:
        return "MockProvider"

    async def get_stock_quote(self, symbol: str) -> StockQuote:
        return StockQuote(
            symbol=symbol,
            name="Mock Corp",
            price=100.0,
            currency="INR",
            change=1.0,
            change_pct=1.0,
            volume=1000,
            market_cap=None,
            day_high=101.0,
            day_low=99.0,
            fifty_two_week_high=120.0,
            fifty_two_week_low=80.0,
            source="MockProvider",
        )

    async def get_company_info(self, symbol: str) -> CompanyInfo:  # type: ignore[override]
        raise NotImplementedError

    async def get_financial_ratios(self, symbol):  # type: ignore[override]
        raise NotImplementedError

    async def get_historical_prices(self, symbol, start, end, interval="1d"):  # type: ignore[override]
        raise NotImplementedError

    async def search_company(self, query, limit=10):  # type: ignore[override]
        return []

    async def get_news(self, query, limit=10, locale="in"):  # type: ignore[override]
        return []


# ─── ProviderRegistry tests ───────────────────────────────────────────────────


def test_registry_register_and_get() -> None:
    reg = ProviderRegistry()
    provider = _MockProvider()
    reg.register("quotes", provider)
    assert reg.get("quotes") is provider


def test_registry_get_missing_raises_key_error() -> None:
    reg = ProviderRegistry()
    with pytest.raises(KeyError, match="No provider registered"):
        reg.get("nonexistent")


def test_registry_list_capabilities() -> None:
    reg = ProviderRegistry()
    reg.register("quotes", _MockProvider())
    reg.register("news", _MockProvider())
    caps = reg.list_capabilities()
    assert "quotes" in caps
    assert "news" in caps


def test_registry_list_providers_returns_names() -> None:
    reg = ProviderRegistry()
    reg.register("quotes", _MockProvider())
    providers = reg.list_providers()
    assert providers["quotes"] == "MockProvider"


# ─── MarketProvider dataclass tests ──────────────────────────────────────────


@pytest.mark.asyncio
async def test_mock_provider_get_stock_quote() -> None:
    provider = _MockProvider()
    quote = await provider.get_stock_quote("TEST.NS")
    assert quote.symbol == "TEST.NS"
    assert quote.price == 100.0
    assert quote.source == "MockProvider"
    assert quote.fetched_at is not None
    assert "T" in quote.fetched_at


def test_stock_quote_is_frozen() -> None:
    quote = StockQuote(
        symbol="X",
        name="X Corp",
        price=1.0,
        currency="INR",
        change=0.0,
        change_pct=0.0,
        volume=0,
        market_cap=None,
        day_high=None,
        day_low=None,
        fifty_two_week_high=None,
        fifty_two_week_low=None,
        source="test",
    )
    with pytest.raises(FrozenInstanceError):
        quote.price = 999.0  # type: ignore[misc]
