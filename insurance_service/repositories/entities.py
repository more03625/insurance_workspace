from typing import List, Optional
from sqlmodel import Session, select
import uuid
from insurance_service.repositories.base import BaseRepository
from insurance_service.models.entities import User, PolicyMaster, UserPolicy, Claimant, Loss, Claim, Document

class UserRepository(BaseRepository[User]):
    def __init__(self, session: Session):
        super().__init__(session, User)

    def get_by_username(self, username: str) -> Optional[User]:
        statement = select(User).where(User.username == username, User.is_deleted == False)
        return self.session.exec(statement).first()

class PolicyMasterRepository(BaseRepository[PolicyMaster]):
    def __init__(self, session: Session):
        super().__init__(session, PolicyMaster)

class UserPolicyRepository(BaseRepository[UserPolicy]):
    def __init__(self, session: Session):
        super().__init__(session, UserPolicy)

    def get_by_user_id(self, user_id: uuid.UUID) -> List[UserPolicy]:
        statement = select(UserPolicy).where(UserPolicy.user_id == user_id, UserPolicy.is_deleted == False)
        return self.session.exec(statement).all()

class ClaimantRepository(BaseRepository[Claimant]):
    def __init__(self, session: Session):
        super().__init__(session, Claimant)

class LossRepository(BaseRepository[Loss]):
    def __init__(self, session: Session):
        super().__init__(session, Loss)

class ClaimRepository(BaseRepository[Claim]):
    def __init__(self, session: Session):
        super().__init__(session, Claim)

    def get_by_claim_number(self, claim_number: str) -> Optional[Claim]:
        statement = select(Claim).where(Claim.claim_number == claim_number, Claim.is_deleted == False)
        return self.session.exec(statement).first()

class DocumentRepository(BaseRepository[Document]):
    def __init__(self, session: Session):
        super().__init__(session, Document)

    def get_by_claim_id(self, claim_id: uuid.UUID) -> List[Document]:
        statement = select(Document).where(Document.claim_id == claim_id, Document.is_deleted == False)
        return self.session.exec(statement).all()
