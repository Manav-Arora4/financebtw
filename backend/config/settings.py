"""
FinanceBtw — Application Settings
Loads from .env / environment variables via pydantic-settings.
All values are validated at startup; the app refuses to start with bad config.
"""

from __future__ import annotations

from functools import lru_cache
from typing import Literal

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Centralised, type-safe application configuration."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # ── Application ──────────────────────────────────────────────────────────
    app_env: Literal["development", "staging", "production"] = "development"
    app_name: str = "FinanceBtw"
    app_version: str = "0.1.0"
    log_level: Literal["DEBUG", "INFO", "WARNING", "ERROR", "CRITICAL"] = "INFO"

    @property
    def is_production(self) -> bool:
        return self.app_env == "production"

    @property
    def is_development(self) -> bool:
        return self.app_env == "development"

    # ── PostgreSQL ───────────────────────────────────────────────────────────
    database_url: str = Field(
        ...,
        description="Async SQLAlchemy DSN (postgresql+asyncpg://...)",
    )
    postgres_user: str = "financebtw"
    postgres_password: str = "change_me"  # noqa: S105
    postgres_db: str = "financebtw_db"
    postgres_host: str = "localhost"
    postgres_port: int = 5432

    # ── Redis ────────────────────────────────────────────────────────────────
    redis_url: str = "redis://localhost:6379/0"

    # ── Qdrant ───────────────────────────────────────────────────────────────
    qdrant_url: str = "http://localhost:6333"
    qdrant_api_key: str = ""
    qdrant_collection_name: str = "financebtw_documents"

    # ── JWT Auth & Supabase ──────────────────────────────────────────────────
    jwt_secret_key: str = Field(..., min_length=32, description="Min 32-char random secret")
    jwt_algorithm: str = "HS256"
    jwt_access_token_expire_minutes: int = 30
    jwt_refresh_token_expire_days: int = 7

    # Supabase Auth Integration
    supabase_url: str = ""
    supabase_anon_key: str = ""
    supabase_service_role_key: str = ""
    supabase_jwt_secret: str = ""
    supabase_jwt_algorithm: str = "HS256"

    # ── CORS ─────────────────────────────────────────────────────────────────
    # Stored as comma-separated string in .env to avoid JSON parsing issues.
    # Access via the `cors_allow_origins` computed property.
    cors_origins: str = "http://localhost:3000,http://localhost:5173"

    @property
    def cors_allow_origins(self) -> list[str]:
        """Return CORS origins as a list, split from the comma-separated env string."""
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]

    # ── Universal LLM Gateway (LiteLLM) ──────────────────────────────────────
    llm_provider: Literal[
        "groq",
        "openai",
        "anthropic",
        "gemini",
        "openrouter",
        "ollama",
        "together",
        "deepseek",
    ] = "groq"
    llm_model: str = "llama-3.3-70b-versatile"

    groq_api_key: str = ""
    gemini_api_key: str = ""
    openai_api_key: str = ""
    anthropic_api_key: str = ""
    deepseek_api_key: str = ""
    openrouter_api_key: str = ""
    together_api_key: str = ""
    ollama_base_url: str = "http://localhost:11434"
    ollama_default_model: str = "llama3.3"

    # ── Local Embeddings & Reranker ──────────────────────────────────────────
    embedding_model: str = "BAAI/bge-m3"
    reranker_model: str = "BAAI/bge-reranker-large"

    # ── Market Data Providers ────────────────────────────────────────────────
    # Yahoo Finance
    yahoo_finance_cache_ttl_seconds: int = 300
    yahoo_finance_request_delay_seconds: float = 1.5

    # NSE (nsepython)
    nse_cache_ttl_seconds: int = 300
    nse_request_delay_seconds: float = 1.0
    nse_use_server_edition: bool = False

    # BSE
    bse_cache_ttl_seconds: int = 600

    # TheNewsAPI
    the_news_api_key: str = ""
    the_news_api_base_url: str = "https://api.thenewsapi.com/v1"
    the_news_api_cache_ttl_seconds: int = 1800

    # ── US Market Plugin (future) ────────────────────────────────────────────
    fmp_api_key: str = ""
    sec_user_agent_email: str = ""

    # ── Crypto Plugin (future) ───────────────────────────────────────────────
    coingecko_api_key: str = ""


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    """Return cached Settings singleton. Parsed once at startup."""
    return Settings()  # type: ignore[call-arg]
