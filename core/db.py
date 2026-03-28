from sqlmodel import create_engine, SQLModel, Session
import os
from config.settings import settings

# engine = create_engine(settings.DATABASE_URL, echo=True)
# For demo, keeping echo=True to see SQL queries
engine = create_engine(settings.DATABASE_URL, echo=True)

def get_session():
    with Session(engine) as session:
        yield session

def init_db():
    # Import all models to ensure they are registered with SQLModel.metadata
    from insurance_service.models.entities import User, PolicyMaster, UserPolicy, Claimant, Loss, Claim, Document
    SQLModel.metadata.create_all(engine)
