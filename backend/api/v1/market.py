"""
Market API Router
=================
Exposes live equity quotes, indices ribbon, financial ratios, historical prices,
and financial news via the registered MarketProvider implementations.
"""

from __future__ import annotations

import asyncio
from dataclasses import asdict
from datetime import date, timedelta
from typing import Any

from fastapi import APIRouter, HTTPException, Query

from backend.market.base import MarketProvider
from backend.market.providers.yahoo_finance import YahooFinanceProvider
from backend.market.registry import registry

router = APIRouter(prefix="/market", tags=["Market Data"])


def _get_quotes_provider() -> MarketProvider:
    try:
        return registry.get("quotes")
    except KeyError:
        return YahooFinanceProvider()


def _normalize_symbol(symbol: str) -> str:
    sym = symbol.strip().upper()
    if (
        not sym.startswith("^")
        and not sym.endswith((".NS", ".BO", ".O", ".K", ".TO", ".L"))
        and "." not in sym
    ):
        return f"{sym}.NS"
    return sym


@router.get("/quote/{symbol}", response_model=dict[str, Any])
async def get_quote(symbol: str) -> dict[str, Any]:
    """Fetch live or delayed stock quote for an equity or index."""
    provider = _get_quotes_provider()
    norm = _normalize_symbol(symbol)
    try:
        quote = await provider.get_stock_quote(norm)
        return asdict(quote)
    except Exception:
        # Fallback to raw symbol if normalized failed
        try:
            quote = await provider.get_stock_quote(symbol)
            return asdict(quote)
        except Exception as exc:
            raise HTTPException(
                status_code=502, detail=f"Failed to fetch quote for '{symbol}': {exc}"
            ) from exc


@router.get("/tickers", response_model=list[dict[str, Any]])
async def get_tickers(
    symbols: str | None = Query(None, description="Comma-separated list of symbols"),
) -> list[dict[str, Any]]:
    """
    Fetch live ribbon ticker quotes for top indices and active Indian stocks.
    Defaults to major benchmark indices and market leaders if symbols not specified.
    """
    provider = _get_quotes_provider()
    default_symbols = [
        "^NSEI",
        "^NSEBANK",
        "^BSESN",
        "RELIANCE.NS",
        "TCS.NS",
        "HDFCBANK.NS",
        "INFY.NS",
        "ICICIBANK.NS",
        "BHARTIARTL.NS",
    ]
    target_symbols = (
        [s.strip() for s in symbols.split(",") if s.strip()] if symbols else default_symbols
    )

    async def _fetch_safe(sym: str) -> dict[str, Any] | None:
        try:
            q = await provider.get_stock_quote(sym)
            data = asdict(q)
            # Friendly display names for top indices
            display_names = {
                "^NSEI": "NIFTY 50",
                "^NSEBANK": "BANKNIFTY",
                "^BSESN": "SENSEX",
                "RELIANCE.NS": "RELIANCE",
                "TCS.NS": "TCS",
                "HDFCBANK.NS": "HDFCBANK",
                "INFY.NS": "INFY",
                "ICICIBANK.NS": "ICICIBANK",
                "BHARTIARTL.NS": "BHARTIARTL",
            }
            if sym in display_names:
                data["display_symbol"] = display_names[sym]
            return data
        except Exception:
            return None

    results = await asyncio.gather(*[_fetch_safe(s) for s in target_symbols])
    return [r for r in results if r is not None]


@router.get("/company/{symbol}", response_model=dict[str, Any])
async def get_company_info(symbol: str) -> dict[str, Any]:
    """Fetch company profile, description, sector, and industry classification."""
    provider = _get_quotes_provider()
    try:
        info = await provider.get_company_info(symbol)
        return asdict(info)
    except Exception as exc:
        raise HTTPException(
            status_code=502, detail=f"Failed to fetch company info for '{symbol}': {exc}"
        ) from exc


@router.get("/ratios/{symbol}", response_model=dict[str, Any])
async def get_financial_ratios(symbol: str) -> dict[str, Any]:
    """Fetch key valuation multiples, margins, and financial health ratios."""
    provider = _get_quotes_provider()
    try:
        ratios = await provider.get_financial_ratios(symbol)
        return asdict(ratios)
    except Exception as exc:
        raise HTTPException(
            status_code=502, detail=f"Failed to fetch ratios for '{symbol}': {exc}"
        ) from exc


@router.get("/history/{symbol}", response_model=dict[str, Any])
async def get_history(
    symbol: str,
    days: int = Query(30, ge=1, le=3650, description="Number of past days of OHLCV history"),
    interval: str = Query("1d", description="Bar interval: 1d, 1wk, 1mo, 1h, 15m, 5m"),
) -> dict[str, Any]:
    """Fetch historical OHLCV price bars for charting."""
    provider = _get_quotes_provider()
    end = date.today()
    start = end - timedelta(days=days)
    try:
        hist = await provider.get_historical_prices(symbol, start=start, end=end, interval=interval)
        return asdict(hist)
    except Exception as exc:
        raise HTTPException(
            status_code=502, detail=f"Failed to fetch historical prices for '{symbol}': {exc}"
        ) from exc


@router.get("/news", response_model=list[dict[str, Any]])
async def get_news(
    query: str = Query(
        "Indian Stock Market", description="Search query for business/financial news"
    ),
    limit: int = Query(10, ge=1, le=50),
) -> list[dict[str, Any]]:
    """Fetch recent financial news articles."""
    try:
        provider = registry.get("news")
    except KeyError:
        provider = _get_quotes_provider()

    try:
        articles = await provider.get_news(query=query, limit=limit)
        return [asdict(a) for a in articles]
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"Failed to fetch news: {exc}") from exc
