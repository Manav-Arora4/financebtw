"""
Unit tests for Database session dependency
"""

from __future__ import annotations

from unittest.mock import AsyncMock, MagicMock, patch

import pytest

from backend.db.session import get_db


@pytest.mark.asyncio
async def test_get_db_yields_session_and_commits() -> None:
    mock_session = AsyncMock()
    mock_sessionmaker = MagicMock()
    mock_sessionmaker.return_value.__aenter__.return_value = mock_session
    mock_sessionmaker.return_value.__aexit__.return_value = None

    with patch("backend.db.session.AsyncSessionLocal", mock_sessionmaker):
        generator = get_db()
        session = await anext(generator)
        assert session is mock_session
        try:
            await anext(generator)
        except StopAsyncIteration:
            pass
        mock_session.commit.assert_awaited_once()


@pytest.mark.asyncio
async def test_get_db_rolls_back_on_error() -> None:
    mock_session = AsyncMock()
    mock_session.commit.side_effect = RuntimeError("DB connection failed")
    mock_sessionmaker = MagicMock()
    mock_sessionmaker.return_value.__aenter__.return_value = mock_session
    mock_sessionmaker.return_value.__aexit__.return_value = None

    with patch("backend.db.session.AsyncSessionLocal", mock_sessionmaker):
        generator = get_db()
        session = await anext(generator)
        assert session is mock_session
        with pytest.raises(RuntimeError, match="DB connection failed"):
            await anext(generator)
        mock_session.rollback.assert_awaited_once()
