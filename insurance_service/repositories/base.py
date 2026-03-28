from typing import TypeVar, Generic, List, Optional, Type
from sqlmodel import Session, select, SQLModel
import uuid

T = TypeVar("T", bound=SQLModel)

class BaseRepository(Generic[T]):
    def __init__(self, session: Session, model: Type[T]):
        self.session = session
        self.model = model

    def get_by_id(self, id: uuid.UUID) -> Optional[T]:
        statement = select(self.model).where(self.model.id == id, self.model.is_deleted == False)
        return self.session.exec(statement).first()

    def get_all(self, offset: int = 0, limit: int = 100) -> List[T]:
        statement = select(self.model).where(self.model.is_deleted == False).offset(offset).limit(limit)
        return self.session.exec(statement).all()

    def create(self, entity: T) -> T:
        self.session.add(entity)
        self.session.commit()
        self.session.refresh(entity)
        return entity

    def update(self, entity: T) -> T:
        self.session.add(entity)
        self.session.commit()
        self.session.refresh(entity)
        return entity

    def soft_delete(self, id: uuid.UUID) -> bool:
        entity = self.get_by_id(id)
        if entity:
            entity.is_deleted = True
            self.session.add(entity)
            self.session.commit()
            return True
        return False
