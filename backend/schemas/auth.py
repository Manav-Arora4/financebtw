"""
Authentication & User Pydantic Schemas
"""

from __future__ import annotations

from datetime import UTC, datetime
from typing import Any

from pydantic import BaseModel, Field


class UserProfileResponse(BaseModel):
    """Authenticated user profile representation."""

    id: str = Field(..., description="Supabase user UUID")
    email: str = Field(..., description="User email address")
    full_name: str = Field(..., description="Display name")
    role: str = Field(default="authenticated", description="User authorization role")
    is_anonymous: bool = Field(default=False, description="Whether user is anonymous session")
    app_metadata: dict[str, Any] = Field(default_factory=dict)
    user_metadata: dict[str, Any] = Field(default_factory=dict)


class UserSyncRequest(BaseModel):
    """Payload to sync Supabase user with local PostgreSQL database."""

    full_name: str | None = Field(default=None, description="Updated full name")
    avatar_url: str | None = Field(default=None, description="Avatar image URL")


class UserSyncResponse(BaseModel):
    """Response returned after syncing user profile."""

    status: str = "synced"
    user_id: str
    synced_at: str = Field(default_factory=lambda: datetime.now(UTC).isoformat())
