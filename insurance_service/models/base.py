from sqlmodel import SQLModel, Field
from datetime import datetime
from typing import Optional
import uuid

class AuditModel(SQLModel):
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    is_deleted: bool = Field(default=False)
