"""
FinanceBtw — FastAPI Application Entry Point
============================================
Creates the FastAPI application, configures middleware, mounts all routers,
and manages startup/shutdown lifecycle via the lifespan context manager.
"""

from __future__ import annotations

import logging
from collections.abc import AsyncGenerator
from contextlib import asynccontextmanager

import structlog
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.api.router import api_router
from backend.config import get_settings
from backend.market.providers.nse import NSEProvider
from backend.market.providers.thenewsapi import TheNewsAPIProvider
from backend.market.providers.yahoo_finance import YahooFinanceProvider
from backend.market.registry import registry

settings = get_settings()

# ─── Structured logging setup ─────────────────────────────────────────────────
structlog.configure(
    processors=[
        structlog.contextvars.merge_contextvars,
        structlog.processors.add_log_level,
        structlog.processors.TimeStamper(fmt="iso"),
        (
            structlog.dev.ConsoleRenderer()
            if settings.is_development
            else structlog.processors.JSONRenderer()
        ),
    ],
    wrapper_class=structlog.make_filtering_bound_logger(logging.getLevelName(settings.log_level)),
    context_class=dict,
    logger_factory=structlog.PrintLoggerFactory(),
)

log = structlog.get_logger(__name__)


# ─── Lifespan ─────────────────────────────────────────────────────────────────


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """
    Startup and shutdown logic.
    Runs before the first request and after the last.
    """
    # ── Startup ──
    log.info("Starting FinanceBtw", version=settings.app_version, env=settings.app_env)

    # Register market data providers
    registry.register("quotes", YahooFinanceProvider())
    registry.register("history", YahooFinanceProvider())
    registry.register("search", NSEProvider())
    registry.register("indices", NSEProvider())
    registry.register("news", TheNewsAPIProvider())

    log.info("Market providers registered", providers=registry.list_providers())

    yield  # ← application runs here

    # ── Shutdown ──
    log.info("Shutting down FinanceBtw")


# ─── Application factory ──────────────────────────────────────────────────────


def create_app() -> FastAPI:
    """Create and configure the FastAPI application."""
    app = FastAPI(
        title=settings.app_name,
        version=settings.app_version,
        description=(
            "FinanceBtw — AI-powered financial research assistant. "
            "Built with RAG, AI agents, hybrid search, and live market data."
        ),
        docs_url="/api/docs" if not settings.is_production else None,
        redoc_url="/api/redoc" if not settings.is_production else None,
        openapi_url="/api/openapi.json" if not settings.is_production else None,
        lifespan=lifespan,
    )

    # ── CORS ──
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_allow_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # ── Routers ──
    app.include_router(api_router)

    return app


app = create_app()
