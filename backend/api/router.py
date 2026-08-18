"""Central API router — mounts all versioned sub-routers."""

from fastapi import APIRouter

from backend.api.v1.auth import router as auth_router
from backend.api.v1.health import router as health_router
from backend.api.v1.market import router as market_router

api_router = APIRouter(prefix="/api/v1")
api_router.include_router(health_router)
api_router.include_router(auth_router)
api_router.include_router(market_router)
