import uuid
from sqlalchemy.types import TypeDecorator, CHAR
from sqlalchemy.dialects.postgresql import UUID as PG_UUID

class SQLiteUUID(TypeDecorator):
    impl = CHAR
    cache_ok = True

    def load_dialect_impl(self, dialect):
        if dialect.name == "sqlite":
            return dialect.type_descriptor(CHAR(36))
        return dialect.type_descriptor(PG_UUID(as_uuid=True))

    def process_bind_param(self, value, dialect):
        if value is None:
            return None
        if dialect.name == "sqlite":
            return str(value)
        return value

    def process_result_value(self, value, dialect):
        if value is None:
            return None
        return uuid.UUID(value)
