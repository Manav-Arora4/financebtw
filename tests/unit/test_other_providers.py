"""
Unit tests for TheNewsAPIProvider, BSEProvider, and ORM Models
"""

from __future__ import annotations

from unittest.mock import AsyncMock, MagicMock, patch

import pytest

from backend.market.providers.bse import BSEProvider
from backend.market.providers.thenewsapi import TheNewsAPIProvider
from backend.models.user import User


@pytest.mark.asyncio
async def test_thenewsapi_empty_key() -> None:
    provider = TheNewsAPIProvider()
    with patch("backend.market.providers.thenewsapi._settings") as mock_settings:
        mock_settings.the_news_api_key = ""
        articles = await provider.get_news("reliance")
        assert articles == []


@pytest.mark.asyncio
async def test_thenewsapi_success() -> None:
    provider = TheNewsAPIProvider()
    mock_resp = MagicMock()
    mock_resp.status_code = 200
    mock_resp.json.return_value = {
        "data": [
            {
                "title": "Reliance Q3 Net Profit Rises 10%",
                "description": "Reliance reports strong results.",
                "url": "https://example.com/news/1",
                "source": "Financial Express",
                "published_at": "2026-08-11T10:00:00Z",
                "categories": ["business", "markets"],
            }
        ]
    }

    mock_client = AsyncMock()
    mock_client.get.return_value = mock_resp

    with patch("backend.market.providers.thenewsapi._settings") as mock_settings:
        mock_settings.the_news_api_key = "test_key"
        with patch("httpx.AsyncClient") as mock_http:
            mock_http.return_value.__aenter__.return_value = mock_client
            articles = await provider.get_news("Reliance", limit=5)
            assert len(articles) == 1
            assert articles[0].title == "Reliance Q3 Net Profit Rises 10%"
            assert articles[0].source == "Financial Express"


@pytest.mark.asyncio
async def test_bse_provider_quote() -> None:
    provider = BSEProvider()
    assert provider.name == "BSE India (bsedata)"

    mock_bse = MagicMock()
    mock_bse.getQuote.return_value = {
        "companyName": "Reliance Industries Ltd",
        "currentValue": "2950.00",
        "change": "15.00",
        "pChange": "0.51",
        "totalTradedQuantity": "50000",
        "dayHigh": "2960.00",
        "dayLow": "2940.00",
        "52weekHigh": "3200.00",
        "52weekLow": "2200.00",
    }

    with patch("bsedata.bse.BSE", return_value=mock_bse):
        quote = await provider.get_stock_quote("500325")
        assert quote.symbol == "500325"
        assert quote.name == "Reliance Industries Ltd"
        assert quote.price == 2950.00


def test_user_model_repr() -> None:
    u = User(
        email="test@financebtw.ai",
        hashed_password="fakehashpassword123",
        is_active=True,
        is_superuser=False,
    )
    assert "test@financebtw.ai" in repr(u)
    assert u.is_active is True
    assert u.is_superuser is False
