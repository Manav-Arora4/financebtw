"""
Authentication API Endpoints
============================
Routes for user identity verification, profile retrieval, and synchronization
with the Supabase Auth backend and local PostgreSQL store.
"""

from __future__ import annotations

import logging
import uuid

from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from backend.api.deps import get_current_user
from backend.config import get_settings
from backend.core.auth.supabase import CurrentUser
from backend.db.session import get_db
from backend.models.user import User
from backend.schemas.auth import UserProfileResponse, UserSyncRequest, UserSyncResponse

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/auth", tags=["Authentication"])
settings = get_settings()


@router.get(
    "/me",
    response_model=UserProfileResponse,
    summary="Get current authenticated user profile",
    status_code=status.HTTP_200_OK,
)
async def get_my_profile(
    current_user: CurrentUser = Depends(get_current_user),
) -> UserProfileResponse:
    """
    Returns the authenticated Supabase user profile, extracted from the verified JWT.
    """
    return UserProfileResponse(
        id=current_user.id,
        email=current_user.email,
        full_name=current_user.full_name,
        role=current_user.role,
        is_anonymous=current_user.is_anonymous,
        app_metadata=current_user.app_metadata,
        user_metadata=current_user.user_metadata,
    )


@router.post(
    "/sync",
    response_model=UserSyncResponse,
    summary="Synchronize Supabase user with local database",
    status_code=status.HTTP_200_OK,
)
async def sync_user_profile(
    payload: UserSyncRequest | None = None,
    current_user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> UserSyncResponse:
    """
    Ensures a corresponding local User record exists in PostgreSQL for joins
    with portfolios, watchlists, and agent chat sessions.
    """
    try:
        user_uuid = uuid.UUID(current_user.id)
    except ValueError:
        user_uuid = uuid.uuid4()

    # Query if user already exists
    result = await db.execute(select(User).where(User.email == current_user.email))
    existing_user = result.scalars().first()

    if not existing_user:
        # Create local user record
        new_user = User(
            id=user_uuid,
            email=current_user.email,
            hashed_password="[supabase_managed]",
            is_active=True,
            is_superuser=(current_user.role == "admin"),
        )
        db.add(new_user)
        await db.flush()
        logger.info(
            "Created local User record for Supabase user %s (%s)",
            current_user.id,
            current_user.email,
        )
    else:
        logger.debug("Local user record already exists for %s", current_user.email)

    return UserSyncResponse(user_id=current_user.id, status="synced")


@router.get(
    "/config",
    summary="Get public authentication configuration",
    status_code=status.HTTP_200_OK,
)
async def get_auth_public_config() -> dict[str, str]:
    """
    Provides public Supabase configuration values to the frontend.
    """
    return {
        "auth_provider": "supabase",
        "supabase_url": settings.supabase_url,
        "supabase_publishable_key": settings.effective_supabase_publishable_key,
        "supabase_anon_key": settings.effective_supabase_publishable_key,  # Backwards compatibility
    }
