"""
Unit tests for FastAPI main application lifecycle and middleware
"""

from __future__ import annotations

from unittest.mock import AsyncMock, patch

import pytest
from httpx import ASGITransport, AsyncClient

from backend.main import create_app, lifespan
from backend.market.registry import registry


@pytest.mark.asyncio
async def test_app_lifespan_registers_providers() -> None:
    app = create_app()
    async with lifespan(app):
        # In lifespan startup, quotes, history, search, indices, news should be registered
        caps = registry.list_capabilities()
        assert "quotes" in caps
        assert "history" in caps
        assert "search" in caps
        assert "indices" in caps
        assert "news" in caps
        assert registry.get("quotes").name == "Yahoo Finance (yfinance)"
        assert registry.get("indices").name == "NSE India (nsepython)"
        assert registry.get("news").name == "TheNewsAPI (thenewsapi.com)"


@pytest.mark.asyncio
async def test_cors_middleware_headers() -> None:
    app = create_app()
    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://testserver",
    ) as ac:
        response = await ac.options(
            "/api/v1/health",
            headers={
                "Origin": "http://localhost:3000",
                "Access-Control-Request-Method": "GET",
            },
        )
        assert response.status_code == 200
        assert "access-control-allow-origin" in response.headers
        assert response.headers["access-control-allow-origin"] == "http://localhost:3000"


@pytest.mark.asyncio
async def test_health_endpoint_with_provider_error() -> None:
    app = create_app()
    # Mock a provider throwing an error during health check
    mock_provider = AsyncMock()
    mock_provider.name = "FailingProvider"
    mock_provider.health_check.side_effect = RuntimeError("Provider timeout")

    with patch.object(registry, "get", return_value=mock_provider):
        async with AsyncClient(
            transport=ASGITransport(app=app),
            base_url="http://testserver",
        ) as ac:
            response = await ac.get("/api/v1/health")
            assert response.status_code == 200
            data = response.json()
            assert data["status"] == "ok"
            assert "quotes" in data["providers"]
            assert data["providers"]["quotes"]["status"] == "error"
            assert "Provider timeout" in data["providers"]["quotes"]["detail"]
