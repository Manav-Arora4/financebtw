"""
Unit tests for NSEProvider
"""

from __future__ import annotations

from unittest.mock import patch

import pytest

from backend.market.providers.nse import NSEProvider, _clean_nse_symbol


def test_clean_nse_symbol() -> None:
    assert _clean_nse_symbol("tcs.ns") == "TCS"
    assert _clean_nse_symbol("RELIANCE.BO") == "RELIANCE"
    assert _clean_nse_symbol("INFY") == "INFY"


@pytest.mark.asyncio
async def test_nse_get_quote() -> None:
    provider = NSEProvider()
    assert provider.name == "NSE India (nsepython)"

    mock_nse_data = {
        "priceInfo": {
            "lastPrice": 3500.0,
            "change": 25.0,
            "pChange": 0.72,
            "intraDayHighLow": {"max": 3550.0, "min": 3480.0},
            "weekHighLow": {"max": 4000.0, "min": 3000.0},
        },
        "metadata": {
            "companyName": "Tata Consultancy Services Limited",
        },
        "securityWiseDP": {
            "quantityTraded": 1500000,
        },
    }

    with patch("nsepython.nse_eq", return_value=mock_nse_data):
        quote = await provider.get_stock_quote("TCS.NS")
        assert quote.symbol == "TCS.NS"
        assert quote.name == "Tata Consultancy Services Limited"
        assert quote.price == 3500.0
        assert quote.change == 25.0
        assert quote.day_high == 3550.0


@pytest.mark.asyncio
async def test_nse_company_info() -> None:
    provider = NSEProvider()

    mock_nse_data = {
        "metadata": {"companyName": "State Bank of India", "industry": "BANKING"},
        "info": {"industry": "Financial Services"},
    }

    with patch("nsepython.nse_eq", return_value=mock_nse_data):
        info = await provider.get_company_info("SBIN.NS")
        assert info.name == "State Bank of India"
        assert info.exchange == "NSE"
        assert info.country == "India"


@pytest.mark.asyncio
async def test_nse_search_company() -> None:
    provider = NSEProvider()

    with patch("nsepython.nse_eq_symbols", return_value=["TCS", "TATAMOTORS", "TATASTEEL", "INFY"]):
        results = await provider.search_company("TATA", limit=2)
        assert len(results) == 2
        assert results[0].symbol == "TATAMOTORS.NS"


@pytest.mark.asyncio
async def test_nse_index_and_events() -> None:
    provider = NSEProvider()

    with patch("nsepython.nse_get_index_quote", return_value={"name": "NIFTY 50", "last": 24500.0}):
        idx = await provider.get_index_quote("NIFTY 50")
        assert idx["name"] == "NIFTY 50"

    with patch("nsepython.nse_events", return_value=[{"event": "AGM"}]):
        events = await provider.get_corporate_events()
        assert len(events) == 1
