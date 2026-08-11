"""Declarative base for all SQLAlchemy ORM models."""

from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    """
    All ORM models inherit from this base.
    Provides type-aware column declarations via Python 3.12 annotations.
    """

    pass
