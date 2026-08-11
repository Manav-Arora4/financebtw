"""
Unit tests for GET /api/v1/health
"""

from __future__ import annotations

import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_health_returns_200(client: AsyncClient) -> None:
    response = await client.get("/api/v1/health")
    assert response.status_code == 200


@pytest.mark.asyncio
async def test_health_status_ok(client: AsyncClient) -> None:
    data = (await client.get("/api/v1/health")).json()
    assert data["status"] == "ok"


@pytest.mark.asyncio
async def test_health_contains_version(client: AsyncClient) -> None:
    data = (await client.get("/api/v1/health")).json()
    assert "version" in data
    assert isinstance(data["version"], str)


@pytest.mark.asyncio
async def test_health_contains_app_name(client: AsyncClient) -> None:
    data = (await client.get("/api/v1/health")).json()
    assert data["app_name"] == "FinanceBtw"


@pytest.mark.asyncio
async def test_health_contains_environment(client: AsyncClient) -> None:
    data = (await client.get("/api/v1/health")).json()
    assert data["environment"] in ("development", "staging", "production")


@pytest.mark.asyncio
async def test_health_contains_providers(client: AsyncClient) -> None:
    data = (await client.get("/api/v1/health")).json()
    assert "providers" in data
    assert isinstance(data["providers"], dict)
