"""
Pytest configuration and shared fixtures for FinanceBtw tests.

Provides:
- async test client for FastAPI app
- overridden settings for test isolation
"""

from __future__ import annotations

import os

import pytest

# Force test environment before any backend imports
os.environ.setdefault("DATABASE_URL", "postgresql+asyncpg://test:test@localhost/test")
os.environ.setdefault("JWT_SECRET_KEY", "test_secret_key_for_unit_tests_only_32_chars")
os.environ.setdefault("APP_ENV", "development")
os.environ.setdefault("THE_NEWS_API_KEY", "")
os.environ.setdefault("GROQ_API_KEY", "")


@pytest.fixture
def anyio_backend() -> str:
    return "asyncio"


@pytest.fixture
async def client():
    """
    Async test client for the FastAPI application.
    Uses ASGI transport — no real HTTP server needed.
    """
    from httpx import ASGITransport, AsyncClient

    from backend.config.settings import get_settings

    get_settings.cache_clear()  # ensure test env vars are picked up

    from backend.main import app

    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://testserver",
    ) as ac:
        yield ac
