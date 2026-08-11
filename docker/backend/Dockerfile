# ─── Stage 1: Builder ─────────────────────────────────────────────────────────
FROM python:3.12-slim AS builder

WORKDIR /app

# System deps for asyncpg + cryptography
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install pip-tools and create venv
RUN pip install --no-cache-dir uv

# Copy dependency spec first (layer cache optimisation)
COPY pyproject.toml .

# Install all production deps into /app/.venv
RUN uv venv .venv && \
    uv pip install --no-cache -e ".[dev]" --python .venv/bin/python

# ─── Stage 2: Runtime ─────────────────────────────────────────────────────────
FROM python:3.12-slim AS runtime

WORKDIR /app

# Runtime system deps
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq5 \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Non-root user for security
RUN useradd --create-home --shell /bin/bash financebtw
USER financebtw

# Copy venv from builder
COPY --from=builder --chown=financebtw:financebtw /app/.venv /app/.venv
ENV PATH="/app/.venv/bin:$PATH"

# Copy application source
COPY --chown=financebtw:financebtw backend/ ./backend/
COPY --chown=financebtw:financebtw pyproject.toml .

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:8000/api/v1/health || exit 1

CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "1"]
