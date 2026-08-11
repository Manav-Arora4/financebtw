"""
Unit tests for YahooFinanceProvider
"""

from __future__ import annotations

from unittest.mock import MagicMock, patch

import pytest

from backend.market.providers.yahoo_finance import YahooFinanceProvider, _sanitize_symbol


def test_sanitize_symbol() -> None:
    assert _sanitize_symbol("  tcs.ns  ") == "TCS.NS"
    assert _sanitize_symbol("aapl") == "AAPL"


@pytest.mark.asyncio
async def test_yahoo_finance_get_quote() -> None:
    provider = YahooFinanceProvider()
    assert provider.name == "Yahoo Finance (yfinance)"

    mock_fast = MagicMock()
    mock_fast.last_price = 3500.5
    mock_fast.previous_close = 3450.0
    mock_fast.currency = "INR"
    mock_fast.market_cap = 12000000000.0
    mock_fast.day_high = 3520.0
    mock_fast.day_low = 3440.0
    mock_fast.year_high = 4000.0
    mock_fast.year_low = 3000.0
    mock_fast.last_volume = 500000

    mock_ticker = MagicMock()
    mock_ticker.fast_info = mock_fast
    mock_ticker.info = {"longName": "Tata Consultancy Services Ltd"}

    with patch("yfinance.Ticker", return_value=mock_ticker):
        quote = await provider.get_stock_quote("TCS.NS")
        assert quote.symbol == "TCS.NS"
        assert quote.price == 3500.5
        assert quote.change == 50.5
        assert quote.name == "Tata Consultancy Services Ltd"
        assert quote.source == "Yahoo Finance (yfinance)"


@pytest.mark.asyncio
async def test_yahoo_finance_get_company_info() -> None:
    provider = YahooFinanceProvider()

    mock_ticker = MagicMock()
    mock_ticker.info = {
        "longName": "Infosys Limited",
        "exchange": "NSI",
        "sector": "Technology",
        "industry": "Information Technology Services",
        "longBusinessSummary": "Leading IT services provider in India.",
        "website": "https://www.infosys.com",
        "country": "India",
        "fullTimeEmployees": 300000,
    }

    with patch("yfinance.Ticker", return_value=mock_ticker):
        info = await provider.get_company_info("INFY.NS")
        assert info.symbol == "INFY.NS"
        assert info.name == "Infosys Limited"
        assert info.sector == "Technology"
        assert info.country == "India"


@pytest.mark.asyncio
async def test_yahoo_finance_get_ratios() -> None:
    provider = YahooFinanceProvider()

    mock_ticker = MagicMock()
    mock_ticker.info = {
        "trailingPE": 28.5,
        "priceToBook": 8.2,
        "returnOnEquity": 0.32,
        "trailingEps": 120.5,
    }

    with patch("yfinance.Ticker", return_value=mock_ticker):
        ratios = await provider.get_financial_ratios("TCS.NS")
        assert ratios.pe_ratio == 28.5
        assert ratios.pb_ratio == 8.2
        assert ratios.roe == 0.32
        assert ratios.eps == 120.5


@pytest.mark.asyncio
async def test_yahoo_finance_search() -> None:
    provider = YahooFinanceProvider()

    mock_search = MagicMock()
    mock_search.quotes = [
        {
            "symbol": "RELIANCE.NS",
            "shortname": "Reliance Ind",
            "exchange": "NSI",
            "quoteType": "EQUITY",
            "score": 0.95,
        }
    ]

    with patch("yfinance.Search", return_value=mock_search):
        results = await provider.search_company("Reliance", limit=5)
        assert len(results) == 1
        assert results[0].symbol == "RELIANCE.NS"
        assert results[0].name == "Reliance Ind"


@pytest.mark.asyncio
async def test_yahoo_finance_health_check() -> None:
    provider = YahooFinanceProvider()

    with patch.object(provider, "get_stock_quote") as mock_get:
        from backend.market.base import StockQuote

        mock_get.return_value = StockQuote(
            symbol="TCS.NS",
            name="TCS",
            price=3500.0,
            currency="INR",
            change=0.0,
            change_pct=0.0,
            volume=1000,
            market_cap=None,
            day_high=None,
            day_low=None,
            fifty_two_week_high=None,
            fifty_two_week_low=None,
            source=provider.name,
        )
        health = await provider.health_check()
        assert health["status"] == "ok"
