"""
FastAPI Dependencies Module
============================
Provides reusable dependency injectors for:
- Database session (`get_db`)
- Supabase user authentication (`get_current_user`, `get_optional_user`, `get_admin_user`)
- Market data provider registry (`get_market_registry`)
"""

from __future__ import annotations

import logging

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from backend.core.auth.supabase import AuthError, CurrentUser, supabase_verifier
from backend.market.registry import ProviderRegistry, registry

logger = logging.getLogger(__name__)

# Security scheme for Bearer token extraction in OpenAPI / Swagger docs
_bearer_scheme = HTTPBearer(auto_error=True)
_optional_bearer_scheme = HTTPBearer(auto_error=False)


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(_bearer_scheme),
) -> CurrentUser:
    """
    FastAPI dependency: enforces valid Supabase authentication.

    Raises:
        HTTPException(401): If token is missing, invalid, or expired.
    """
    if not credentials or not credentials.credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing Bearer token in Authorization header",
            headers={"WWW-Authenticate": "Bearer"},
        )

    try:
        return supabase_verifier.verify_token(credentials.credentials)
    except AuthError as exc:
        raise HTTPException(
            status_code=exc.status_code,
            detail=exc.message,
            headers={"WWW-Authenticate": "Bearer"},
        ) from exc


async def get_optional_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(_optional_bearer_scheme),
) -> CurrentUser | None:
    """
    FastAPI dependency: returns CurrentUser if valid token is provided, else None.
    Does not raise 401 on missing token.
    """
    if not credentials or not credentials.credentials:
        return None

    try:
        return supabase_verifier.verify_token(credentials.credentials)
    except Exception as exc:
        logger.debug("Optional user authentication ignored: %s", exc)
        return None


async def get_admin_user(
    current_user: CurrentUser = Depends(get_current_user),
) -> CurrentUser:
    """
    FastAPI dependency: requires user to have admin privileges (role == 'admin' or is_superuser).
    """
    is_admin = (
        current_user.role == "admin"
        or current_user.app_metadata.get("claims_admin", False)
        or current_user.user_metadata.get("is_admin", False)
    )
    if not is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Administrator access required",
        )
    return current_user


def get_market_registry() -> ProviderRegistry:
    """FastAPI dependency: returns the market ProviderRegistry singleton."""
    return registry
