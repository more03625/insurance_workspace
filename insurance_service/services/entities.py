from typing import List, Optional
import uuid
import logging
from datetime import datetime
from sqlmodel import Session
from insurance_service.models.entities import User, PolicyMaster, UserPolicy, Claimant, Loss, Claim, Document, UserRole
from insurance_service.repositories.entities import (
    UserRepository, PolicyMasterRepository, UserPolicyRepository,
    ClaimantRepository, LossRepository, ClaimRepository, DocumentRepository
)
from insurance_service.schemas.entities import (
    UserCreate, PolicyMasterCreate, UserPolicyCreate,
    ClaimantCreate, LossCreate, ClaimCreate, ClaimUpdate, DocumentCreate
)
from core.errorcodes import ErrorCodes

logger = logging.getLogger(__name__)

class UserService:
    def __init__(self, session: Session):
        self.session = session
        self.repo = UserRepository(session)

    def create_user(self, data: UserCreate) -> dict:
        try:
            if self.repo.get_by_username(data.username):
                return {"success": False, "error": {"code": 100004, "message": "Username already exists"}}
            
            # In a real app, we would hash the password here
            new_user = User(
                username=data.username,
                email=data.email,
                password_hash=data.password, # Mock hashing
                first_name=data.first_name,
                last_name=data.last_name,
                role=data.role
            )
            created = self.repo.create(new_user)
            return {"success": True, "data": created}
        except Exception as e:
            logger.error(f"Error creating user: {str(e)}")
            return {"success": False, "error": ErrorCodes.GENERIC_ERROR}

class PolicyMasterService:
    def __init__(self, session: Session):
        self.session = session
        self.repo = PolicyMasterRepository(session)

    def create_policy_master(self, data: PolicyMasterCreate) -> dict:
        try:
            new_policy = PolicyMaster(**data.dict())
            created = self.repo.create(new_policy)
            return {"success": True, "data": created}
        except Exception as e:
            logger.error(f"Error creating policy master: {str(e)}")
            return {"success": False, "error": ErrorCodes.GENERIC_ERROR}

    def list_policies(self) -> dict:
        try:
            policies = self.repo.get_all()
            return {"success": True, "data": policies}
        except Exception as e:
            return {"success": False, "error": ErrorCodes.GENERIC_ERROR}

class UserPolicyService:
    def __init__(self, session: Session):
        self.session = session
        self.repo = UserPolicyRepository(session)

    def purchase_policy(self, data: UserPolicyCreate) -> dict:
        try:
            new_user_policy = UserPolicy(**data.dict())
            created = self.repo.create(new_user_policy)
            return {"success": True, "data": created}
        except Exception as e:
            logger.error(f"Error purchasing policy: {str(e)}")
            return {"success": False, "error": ErrorCodes.GENERIC_ERROR}

    def get_user_policies(self, user_id: uuid.UUID) -> dict:
        try:
            policies = self.repo.get_by_user_id(user_id)
            return {"success": True, "data": policies}
        except Exception as e:
            return {"success": False, "error": ErrorCodes.GENERIC_ERROR}

class ClaimService:
    def __init__(self, session: Session):
        self.session = session
        self.repo = ClaimRepository(session)
        self.loss_repo = LossRepository(session)

    def create_claim(self, data: ClaimCreate) -> dict:
        try:
            # Handle nested Loss creation
            loss_id = data.loss_id
            if data.loss:
                new_loss = Loss(**data.loss.dict())
                created_loss = self.loss_repo.create(new_loss)
                loss_id = created_loss.id

            new_claim = Claim(
                claim_number=data.claim_number,
                estimated_loss_amount=data.estimated_loss_amount,
                user_policy_id=data.user_policy_id,
                claimant_id=data.claimant_id,
                loss_id=loss_id
            )
            created = self.repo.create(new_claim)
            return {"success": True, "data": created}
        except Exception as e:
            logger.error(f"Error creating claim: {str(e)}")
            return {"success": False, "error": ErrorCodes.CLAIM_CREATION_FAILED}

    def verify_claim(self, claim_id: uuid.UUID, employee_id: uuid.UUID, status: str) -> dict:
        try:
            claim = self.repo.get_by_id(claim_id)
            if not claim:
                return {"success": False, "error": ErrorCodes.CLAIM_NOT_FOUND}
            
            claim.claim_status = status
            claim.verified_at = datetime.utcnow()
            claim.verified_by_id = employee_id
            
            updated = self.repo.update(claim)
            return {"success": True, "data": updated}
        except Exception as e:
            return {"success": False, "error": ErrorCodes.CLAIM_UPDATE_FAILED}

    def list_claims(self, offset: int = 0, limit: int = 100) -> dict:
        try:
            claims = self.repo.get_all(offset, limit)
            return {"success": True, "data": claims}
        except Exception as e:
            return {"success": False, "error": ErrorCodes.GENERIC_ERROR}

class DocumentService:
    def __init__(self, session: Session):
        self.session = session
        self.repo = DocumentRepository(session)

    def upload_document(self, data: DocumentCreate) -> dict:
        try:
            new_doc = Document(**data.dict())
            created = self.repo.create(new_doc)
            return {"success": True, "data": created}
        except Exception as e:
            return {"success": False, "error": ErrorCodes.UPLOAD_FAILED}

class ClaimantService:
    def __init__(self, session: Session):
        self.session = session
        self.repo = ClaimantRepository(session)

    def create_claimant(self, data: ClaimantCreate) -> dict:
        try:
            new_claimant = Claimant(**data.dict())
            created = self.repo.create(new_claimant)
            return {"success": True, "data": created}
        except Exception as e:
            return {"success": False, "error": ErrorCodes.GENERIC_ERROR}
