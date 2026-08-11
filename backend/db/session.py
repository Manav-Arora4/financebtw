"""
FinanceBtw — Database Session
Async SQLAlchemy 2.x engine and session factory.
"""

from __future__ import annotations

from collections.abc import AsyncGenerator

from sqlalchemy.ext.asyncio import (
    AsyncEngine,
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)

from backend.config import get_settings

_settings = get_settings()

# Engine — created once at module import, reused across all requests.
# pool_pre_ping keeps connections alive across network interruptions.
engine: AsyncEngine = create_async_engine(
    _settings.database_url,
    echo=_settings.is_development,  # SQL logging in dev only
    pool_size=10,
    max_overflow=20,
    pool_pre_ping=True,
)

# Session factory — bound to the engine above.
AsyncSessionLocal: async_sessionmaker[AsyncSession] = async_sessionmaker(
    bind=engine,
    autocommit=False,
    autoflush=False,
    expire_on_commit=False,
)


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """
    FastAPI dependency that yields an AsyncSession.
    The session is committed on success and rolled back on any exception.

    Usage::

        @router.get("/example")
        async def example(db: AsyncSession = Depends(get_db)) -> dict:
            ...
    """
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
