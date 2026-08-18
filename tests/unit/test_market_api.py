"""
Unit tests for the Market API router (/api/v1/market).
"""

from unittest.mock import AsyncMock, patch

import pytest
from httpx import ASGITransport, AsyncClient

from backend.main import create_app
from backend.market.base import (
    FinancialRatios,
    HistoricalPrices,
    NewsArticle,
    PriceBar,
    StockQuote,
)

app = create_app()


@pytest.fixture
def mock_quote() -> StockQuote:
    return StockQuote(
        symbol="TCS.NS",
        name="Tata Consultancy Services Limited",
        price=2280.0,
        currency="INR",
        change=-33.20,
        change_pct=-1.44,
        volume=2180000,
        market_cap=1510000000000.0,
        day_high=2307.0,
        day_low=2280.0,
        fifty_two_week_high=4500.0,
        fifty_two_week_low=2200.0,
        source="Yahoo Finance (yfinance)",
    )


@pytest.fixture
def mock_ratios() -> FinancialRatios:
    return FinancialRatios(
        symbol="TCS.NS",
        pe_ratio=16.56,
        pb_ratio=7.52,
        ps_ratio=2.99,
        ev_ebitda=11.16,
        roe=0.477,
        roa=0.244,
        debt_to_equity=10.21,
        current_ratio=2.27,
        dividend_yield=2.75,
        eps=134.86,
        source="Yahoo Finance (yfinance)",
    )


@pytest.fixture
def mock_history() -> HistoricalPrices:
    return HistoricalPrices(
        symbol="TCS.NS",
        interval="1d",
        bars=[
            PriceBar(
                date="2026-08-15",
                open=2290.0,
                high=2310.0,
                low=2275.0,
                close=2280.0,
                volume=1500000,
            )
        ],
        source="Yahoo Finance (yfinance)",
    )


@pytest.mark.asyncio
async def test_get_quote_endpoint(mock_quote: StockQuote) -> None:
    with patch(
        "backend.market.providers.yahoo_finance.YahooFinanceProvider.get_stock_quote",
        new_callable=AsyncMock,
    ) as m:
        m.return_value = mock_quote
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
            res = await client.get("/api/v1/market/quote/TCS")
            assert res.status_code == 200
            data = res.json()
            assert data["symbol"] == "TCS.NS"
            assert data["price"] == 2280.0


@pytest.mark.asyncio
async def test_get_tickers_endpoint(mock_quote: StockQuote) -> None:
    with patch(
        "backend.market.providers.yahoo_finance.YahooFinanceProvider.get_stock_quote",
        new_callable=AsyncMock,
    ) as m:
        m.return_value = mock_quote
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
            res = await client.get("/api/v1/market/tickers?symbols=TCS.NS,INFY.NS")
            assert res.status_code == 200
            data = res.json()
            assert len(data) == 2
            assert data[0]["symbol"] == "TCS.NS"


@pytest.mark.asyncio
async def test_get_ratios_endpoint(mock_ratios: FinancialRatios) -> None:
    with patch(
        "backend.market.providers.yahoo_finance.YahooFinanceProvider.get_financial_ratios",
        new_callable=AsyncMock,
    ) as m:
        m.return_value = mock_ratios
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
            res = await client.get("/api/v1/market/ratios/TCS")
            assert res.status_code == 200
            data = res.json()
            assert data["pe_ratio"] == 16.56
            assert data["dividend_yield"] == 2.75


@pytest.mark.asyncio
async def test_get_history_endpoint(mock_history: HistoricalPrices) -> None:
    with patch(
        "backend.market.providers.yahoo_finance.YahooFinanceProvider.get_historical_prices",
        new_callable=AsyncMock,
    ) as m:
        m.return_value = mock_history
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
            res = await client.get("/api/v1/market/history/TCS?days=30&interval=1d")
            assert res.status_code == 200
            data = res.json()
            assert len(data["bars"]) == 1
            assert data["bars"][0]["close"] == 2280.0


@pytest.mark.asyncio
async def test_get_news_endpoint() -> None:
    mock_articles = [
        NewsArticle(
            title="Tech Earnings Highlight Cloud Strength",
            description="Indian IT sector reports Q3 results.",
            url="https://example.com/news/1",
            source="Reuters",
            published_at="2026-08-18T10:00:00Z",
            categories=["TCS", "INFY"],
            provider="TheNewsAPI (thenewsapi.com)",
        )
    ]
    with patch(
        "backend.market.providers.thenewsapi.TheNewsAPIProvider.get_news", new_callable=AsyncMock
    ) as m:
        m.return_value = mock_articles
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
            res = await client.get("/api/v1/market/news?query=TCS&limit=5")
            assert res.status_code == 200
            data = res.json()
            assert len(data) == 1
            assert data[0]["title"] == "Tech Earnings Highlight Cloud Strength"
