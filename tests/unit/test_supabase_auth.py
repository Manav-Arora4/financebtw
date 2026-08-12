"""
Supabase Authentication & JWT Verifier Unit Tests
=================================================
Tests token parsing, expiration enforcement, claim extraction,
FastAPI dependencies, and authentication API endpoints.
"""

from __future__ import annotations

import time
import uuid

import jwt
import pytest
from fastapi import HTTPException
from fastapi.security import HTTPAuthorizationCredentials
from httpx import ASGITransport, AsyncClient

from backend.api.deps import get_admin_user, get_current_user, get_optional_user
from backend.config import get_settings
from backend.core.auth.supabase import AuthError, CurrentUser, SupabaseAuthVerifier
from backend.main import create_app

settings = get_settings()
TEST_SECRET = "test_jwt_secret_key_for_testing_purposes_only_32_chars"


def _create_token(
    sub: str = "123e4567-e89b-12d3-a456-426614174000",
    email: str = "trader@financebtw.ai",
    role: str = "authenticated",
    user_metadata: dict | None = None,
    expires_in_seconds: int = 3600,
    secret: str = TEST_SECRET,
) -> str:
    """Helper to generate signed test JWT tokens."""
    payload = {
        "sub": sub,
        "email": email,
        "role": role,
        "exp": int(time.time()) + expires_in_seconds,
        "aud": "authenticated",
        "user_metadata": user_metadata or {"full_name": "Antigravity Trader"},
        "app_metadata": {"provider": "email"},
    }
    return jwt.encode(payload, secret, algorithm="HS256")


def test_current_user_dataclass() -> None:
    """Verify CurrentUser dataclass properties and name extraction."""
    user = CurrentUser(
        id="user-123",
        email="alex@financebtw.ai",
        role="authenticated",
        user_metadata={"full_name": "Alex Mercer"},
    )
    assert user.id == "user-123"
    assert user.email == "alex@financebtw.ai"
    assert user.full_name == "Alex Mercer"
    assert not user.is_anonymous

    # Fallback to email prefix if full_name is missing
    user_no_name = CurrentUser(id="u2", email="bob@test.com")
    assert user_no_name.full_name == "bob"


def test_verify_token_valid_claims() -> None:
    """Verify decoding of a valid signed JWT."""
    verifier = SupabaseAuthVerifier(jwt_secret=TEST_SECRET)
    token = _create_token(
        sub="usr-999",
        email="test@market.com",
        user_metadata={"full_name": "Market Analyst"},
    )

    user = verifier.verify_token(token)
    assert isinstance(user, CurrentUser)
    assert user.id == "usr-999"
    assert user.email == "test@market.com"
    assert user.full_name == "Market Analyst"
    assert user.role == "authenticated"


def test_verify_token_bearer_prefix_stripping() -> None:
    """Verify that 'Bearer <token>' prefix is automatically stripped."""
    verifier = SupabaseAuthVerifier(jwt_secret=TEST_SECRET)
    token = _create_token(email="bearer@test.com")

    user = verifier.verify_token(f"Bearer {token}")
    assert user.email == "bearer@test.com"


def test_verify_token_expired_raises_auth_error() -> None:
    """Verify expired token raises AuthError with 401 status."""
    verifier = SupabaseAuthVerifier(jwt_secret=TEST_SECRET)
    expired_token = _create_token(expires_in_seconds=-100)

    with pytest.raises(AuthError) as exc_info:
        verifier.verify_token(expired_token)
    assert exc_info.value.status_code == 401
    assert "expired" in exc_info.value.message.lower()


def test_verify_token_missing_sub_raises_auth_error() -> None:
    """Verify token missing 'sub' claim raises AuthError."""
    verifier = SupabaseAuthVerifier(jwt_secret=TEST_SECRET)
    token = jwt.encode(
        {"email": "no-sub@test.com", "exp": int(time.time()) + 3600}, TEST_SECRET, algorithm="HS256"
    )

    with pytest.raises(AuthError) as exc_info:
        verifier.verify_token(token)
    assert exc_info.value.status_code == 401
    assert "sub" in exc_info.value.message.lower()


def test_verify_token_empty_input_raises_auth_error() -> None:
    """Verify empty or invalid token inputs raise AuthError."""
    verifier = SupabaseAuthVerifier(jwt_secret=TEST_SECRET)
    with pytest.raises(AuthError):
        verifier.verify_token("")


@pytest.mark.asyncio
async def test_get_current_user_dependency_success(monkeypatch: pytest.MonkeyPatch) -> None:
    """Verify get_current_user FastAPI dependency returns CurrentUser."""
    monkeypatch.setattr(settings, "supabase_jwt_secret", TEST_SECRET)
    token = _create_token(email="dep@test.com")
    creds = HTTPAuthorizationCredentials(scheme="Bearer", credentials=token)

    user = await get_current_user(creds)
    assert user.email == "dep@test.com"


@pytest.mark.asyncio
async def test_get_current_user_dependency_invalid_raises_401() -> None:
    """Verify invalid token raises HTTPException(401)."""
    creds = HTTPAuthorizationCredentials(scheme="Bearer", credentials="invalid-token-string")
    with pytest.raises(HTTPException) as exc_info:
        await get_current_user(creds)
    assert exc_info.value.status_code == 401


@pytest.mark.asyncio
async def test_get_optional_user_dependency(monkeypatch: pytest.MonkeyPatch) -> None:
    """Verify get_optional_user dependency behavior with and without tokens."""
    monkeypatch.setattr(settings, "supabase_jwt_secret", TEST_SECRET)
    token = _create_token(email="optional@test.com")

    # Valid token
    valid_creds = HTTPAuthorizationCredentials(scheme="Bearer", credentials=token)
    user = await get_optional_user(valid_creds)
    assert user is not None
    assert user.email == "optional@test.com"

    # None token (guest)
    guest = await get_optional_user(None)
    assert guest is None

    # Invalid token (should return None silently without raising 401)
    bad_creds = HTTPAuthorizationCredentials(scheme="Bearer", credentials="bad.jwt.token")
    bad_user = await get_optional_user(bad_creds)
    assert bad_user is None


@pytest.mark.asyncio
async def test_get_admin_user_dependency() -> None:
    """Verify admin role requirement."""
    admin = CurrentUser(id="1", email="admin@test.com", role="admin")
    result = await get_admin_user(admin)
    assert result.id == "1"

    # Non-admin raises 403 Forbidden
    regular_user = CurrentUser(id="2", email="user@test.com", role="authenticated")
    with pytest.raises(HTTPException) as exc_info:
        await get_admin_user(regular_user)
    assert exc_info.value.status_code == 403


@pytest.mark.asyncio
async def test_auth_api_config_endpoint() -> None:
    """Test GET /api/v1/auth/config returns public configuration."""
    app = create_app()
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        res = await client.get("/api/v1/auth/config")
        assert res.status_code == 200
        data = res.json()
        assert data["auth_provider"] == "supabase"
        assert "supabase_url" in data


@pytest.mark.asyncio
async def test_auth_api_me_endpoint(monkeypatch: pytest.MonkeyPatch) -> None:
    """Test GET /api/v1/auth/me returns 401/403 without token and 200 with valid token."""
    monkeypatch.setattr(settings, "supabase_jwt_secret", TEST_SECRET)
    app = create_app()

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        # 1. Unauthenticated request -> 401 or 403
        res = await client.get("/api/v1/auth/me")
        assert res.status_code in (401, 403)

        # 2. Authenticated request -> 200
        token = _create_token(
            sub=str(uuid.uuid4()),
            email="trader@financebtw.ai",
            user_metadata={"full_name": "Pro Trader"},
        )
        headers = {"Authorization": f"Bearer {token}"}
        res_auth = await client.get("/api/v1/auth/me", headers=headers)
        assert res_auth.status_code == 200
        data = res_auth.json()
        assert data["email"] == "trader@financebtw.ai"
        assert data["full_name"] == "Pro Trader"
        assert data["role"] == "authenticated"


@pytest.mark.asyncio
async def test_auth_api_sync_endpoint(monkeypatch: pytest.MonkeyPatch) -> None:
    """Test POST /api/v1/auth/sync returns 200 and synced user_id."""
    from unittest.mock import AsyncMock, MagicMock
    from backend.db.session import get_db

    monkeypatch.setattr(settings, "supabase_jwt_secret", TEST_SECRET)
    user_uuid = str(uuid.uuid4())
    token = _create_token(sub=user_uuid, email="sync_user@financebtw.ai")

    # Mock DB session
    mock_db_session = AsyncMock()
    mock_scalars = MagicMock()
    mock_scalars.first.return_value = None  # Simulates new user
    mock_result = MagicMock()
    mock_result.scalars.return_value = mock_scalars
    mock_db_session.execute.return_value = mock_result
    mock_db_session.flush = AsyncMock()
    mock_db_session.add = MagicMock()

    async def _mock_get_db():
        yield mock_db_session

    app = create_app()
    app.dependency_overrides[get_db] = _mock_get_db

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        headers = {"Authorization": f"Bearer {token}"}
        res = await client.post(
            "/api/v1/auth/sync", json={"full_name": "Sync User"}, headers=headers
        )
        assert res.status_code == 200
        data = res.json()
        assert data["status"] == "synced"
        assert data["user_id"] == user_uuid
