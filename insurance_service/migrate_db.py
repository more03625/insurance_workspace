import sys
from pathlib import Path
from datetime import datetime

_root = Path(__file__).resolve().parent.parent
if str(_root) not in sys.path:
    sys.path.insert(0, str(_root))

from sqlmodel import SQLModel, Session, Field, create_engine, text
from typing import Optional
from config.settings import settings
from insurance_service.models.entities import User, PolicyMaster, UserPolicy, Claimant, Loss, Claim, Document

engine = create_engine(settings.DATABASE_URL, echo=settings.DEBUG)


class AppliedMigration(SQLModel, table=True):
    __tablename__ = "_applied_migrations"
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(unique=True)
    applied_at: datetime = Field(default_factory=datetime.utcnow)


MIGRATIONS = [
    # ("002_add_some_column", "ALTER TABLE users ADD COLUMN phone VARCHAR DEFAULT NULL"),
]


def _ensure_migration_table(eng):
    """Create the _applied_migrations tracking table if it doesn't exist."""
    AppliedMigration.metadata.create_all(eng, tables=[AppliedMigration.__table__])


def _get_applied(session: Session) -> set:
    results = session.exec(
        text("SELECT name FROM _applied_migrations")
    ).all()
    return {row[0] for row in results}


def migrate():
    masked_url = settings.DATABASE_URL[:30] + "..."
    print(f"[migrate] Connecting to {masked_url}")

    # Step 1: create any tables that don't exist yet (safe, idempotent)
    SQLModel.metadata.create_all(engine)
    print("[migrate] create_all complete — missing tables created, existing tables untouched.")

    # Step 2: ensure migration tracking table exists
    _ensure_migration_table(engine)

    # Step 3: run only unapplied migrations
    with Session(engine) as session:
        applied = _get_applied(session)
        pending = [(name, sql) for name, sql in MIGRATIONS if name not in applied]

        if not pending:
            print("[migrate] No pending migrations.")
        else:
            for name, sql in pending:
                print(f"[migrate] Applying: {name}")
                session.exec(text(sql))
                session.add(AppliedMigration(name=name))
                session.commit()
                print(f"[migrate] Applied: {name}")

    print("[migrate] Done.")


if __name__ == "__main__":
    migrate()
