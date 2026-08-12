"""
Unit tests for backend/config/settings.py
"""

from __future__ import annotations

import os

import pytest
from pydantic import ValidationError

from backend.config.settings import Settings


def test_settings_loads_default_app_name() -> None:
    s = Settings(
        database_url="postgresql+asyncpg://u:p@localhost/db",
        jwt_secret_key="a" * 32,
    )
    assert s.app_name == "FinanceBtw"


def test_settings_loads_default_env() -> None:
    s = Settings(
        database_url="postgresql+asyncpg://u:p@localhost/db",
        jwt_secret_key="a" * 32,
    )
    assert s.app_env == "development"


def test_settings_is_development_flag() -> None:
    s = Settings(
        database_url="postgresql+asyncpg://u:p@localhost/db",
        jwt_secret_key="a" * 32,
        app_env="development",
    )
    assert s.is_development is True
    assert s.is_production is False


def test_settings_is_production_flag() -> None:
    s = Settings(
        database_url="postgresql+asyncpg://u:p@localhost/db",
        jwt_secret_key="a" * 32,
        app_env="production",
    )
    assert s.is_production is True
    assert s.is_development is False


def test_settings_cors_parsed_from_comma_string() -> None:
    s = Settings(
        database_url="postgresql+asyncpg://u:p@localhost/db",
        jwt_secret_key="a" * 32,
        cors_origins="http://localhost:3000,http://localhost:5173",
    )
    assert "http://localhost:3000" in s.cors_allow_origins
    assert "http://localhost:5173" in s.cors_allow_origins


def test_settings_jwt_secret_too_short_raises() -> None:
    with pytest.raises(ValidationError):
        Settings(
            database_url="postgresql+asyncpg://u:p@localhost/db",
            jwt_secret_key="short",
        )


def test_settings_database_url_required() -> None:
    """Without DATABASE_URL in env or file, Settings() should raise validation error."""
    original = os.environ.pop("DATABASE_URL", None)
    try:
        with pytest.raises(ValidationError):
            Settings(_env_file=None, jwt_secret_key="a" * 32)  # type: ignore[call-arg]
    finally:
        if original is not None:
            os.environ["DATABASE_URL"] = original


def test_settings_llm_groq_configuration() -> None:
    s = Settings(
        database_url="postgresql+asyncpg://u:p@localhost/db",
        jwt_secret_key="a" * 32,
        llm_provider="groq",
        groq_api_key="gsk_test_12345",
        llm_model="llama-3.3-70b-versatile",
    )
    assert s.llm_provider == "groq"
    assert s.groq_api_key == "gsk_test_12345"
    assert s.llm_model == "llama-3.3-70b-versatile"


def test_settings_invalid_llm_provider_raises() -> None:
    with pytest.raises(ValidationError):
        Settings(
            database_url="postgresql+asyncpg://u:p@localhost/db",
            jwt_secret_key="a" * 32,
            llm_provider="unsupported_provider",  # type: ignore[arg-type]
        )
