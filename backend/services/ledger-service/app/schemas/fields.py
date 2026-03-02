# app/schemas/fields.py
from decimal import Decimal
from pydantic import GetCoreSchemaHandler
from pydantic_core import core_schema

class MoneyField(Decimal):
    @classmethod
    def __get_pydantic_core_schema__(cls, source, handler: GetCoreSchemaHandler):
        return core_schema.no_info_after_validator_function(
            cls.validate,
            core_schema.decimal_schema(),
        )

    @classmethod
    def validate(cls, value):
        if isinstance(value, Decimal):
            return value.quantize(Decimal("0.01"))
        return Decimal(value).quantize(Decimal("0.01"))
