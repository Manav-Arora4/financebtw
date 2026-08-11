"""
FinanceBtw — Health Check Endpoint
====================================
GET /api/v1/health

Returns application status, version, environment, and individual
market provider health checks. Used by Docker health checks, load
balancers, and monitoring systems.
"""

from __future__ import annotations

import platform
from typing import Any

from fastapi import APIRouter

from backend.config import get_settings
from backend.market.registry import registry

router = APIRouter(tags=["health"])
settings = get_settings()


@router.get(
    "/health",
    summary="Application health check",
    description=(
        "Returns the health status of the application and all registered "
        "market data providers. Used by Docker, load balancers, and monitoring."
    ),
    response_model=dict[str, Any],
)
async def health_check() -> dict[str, Any]:
    """
    Perform a health check across all systems.

    Returns ``200 OK`` with a JSON body describing:
    - Application status and version
    - Environment name
    - Python version
    - Registered market providers and their individual health
    """
    provider_health: dict[str, Any] = {}
    for capability, provider_name in registry.list_providers().items():
        try:
            provider = registry.get(capability)
            result = await provider.health_check()
            provider_health[capability] = result
        except Exception as exc:
            provider_health[capability] = {
                "provider": provider_name,
                "status": "error",
                "detail": str(exc),
            }

    return {
        "status": "ok",
        "app_name": settings.app_name,
        "version": settings.app_version,
        "environment": settings.app_env,
        "python_version": platform.python_version(),
        "providers": provider_health,
    }
