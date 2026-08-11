"""
FinanceBtw — Provider Registry
==============================
Central registry that maps capability keys to MarketProvider instances.
The Agent and API layer resolve providers through this registry — they
never import concrete provider classes directly.

Usage::

    from backend.market.registry import registry

    quote = await registry.get("quotes").get_stock_quote("RELIANCE.NS")
    news  = await registry.get("news").get_news("Infosys earnings")
"""

from __future__ import annotations

import logging
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from backend.market.base import MarketProvider

logger = logging.getLogger(__name__)


class ProviderRegistry:
    """
    Thread-safe registry mapping capability strings to provider instances.

    Capabilities (by convention):
        - ``"quotes"``   → get_stock_quote, get_company_info, get_financial_ratios
        - ``"history"``  → get_historical_prices
        - ``"search"``   → search_company
        - ``"news"``     → get_news
        - ``"indices"``  → NSE/BSE index data
    """

    def __init__(self) -> None:
        self._providers: dict[str, MarketProvider] = {}

    def register(self, capability: str, provider: MarketProvider) -> None:
        """
        Register a provider for a given capability.

        If a provider was already registered for this capability, it is
        replaced and a warning is logged.

        Args:
            capability: The capability key (e.g. ``"quotes"``).
            provider:   A concrete :class:`~backend.market.base.MarketProvider`.
        """
        if capability in self._providers:
            logger.warning(
                "Replacing existing provider for capability '%s': %s → %s",
                capability,
                self._providers[capability].name,
                provider.name,
            )
        self._providers[capability] = provider
        logger.info("Registered provider '%s' for capability '%s'", provider.name, capability)

    def get(self, capability: str) -> MarketProvider:
        """
        Retrieve the provider registered for *capability*.

        Raises:
            KeyError: If no provider is registered for the capability.
        """
        try:
            return self._providers[capability]
        except KeyError:
            available = list(self._providers.keys())
            raise KeyError(
                f"No provider registered for capability '{capability}'. " f"Available: {available}"
            ) from None

    def list_capabilities(self) -> list[str]:
        """Return all registered capability keys."""
        return list(self._providers.keys())

    def list_providers(self) -> dict[str, str]:
        """Return a map of capability → provider name for health checks."""
        return {cap: p.name for cap, p in self._providers.items()}

    def __repr__(self) -> str:
        return f"<ProviderRegistry capabilities={self.list_capabilities()!r}>"


# Module-level singleton — imported everywhere
registry = ProviderRegistry()
