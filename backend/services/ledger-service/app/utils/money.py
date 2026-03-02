# app/utils/money.py
from decimal import Decimal


def normalize_decimal(value: Decimal) -> str:
    """
    Normalize a Decimal:
    - strip trailing zeros
    - avoid scientific notation
    """
    normalized = value.normalize()
    return format(normalized, "f")


class Money(str):
    """String-based money representation, already normalised."""

    @classmethod
    def from_decimal(cls, value: Decimal) -> "Money":
        return cls(normalize_decimal(value))

