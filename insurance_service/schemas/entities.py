from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List
import uuid
from insurance_service.models.entities import UserRole

# User Schemas
class UserBase(BaseModel):
    username: str
    email: str
    first_name: str
    last_name: str
    role: UserRole = UserRole.POLICYHOLDER

class UserCreate(UserBase):
    password: str

class UserRead(UserBase):
    id: uuid.UUID
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

# PolicyMaster Schemas
class PolicyMasterBase(BaseModel):
    name: str
    description: str
    policy_type: str
    base_premium: float
    coverage_details: str

class PolicyMasterCreate(PolicyMasterBase):
    pass

class PolicyMasterRead(PolicyMasterBase):
    id: uuid.UUID

    class Config:
        from_attributes = True

# UserPolicy Schemas
class UserPolicyBase(BaseModel):
    policy_number: str
    start_date: datetime
    end_date: datetime
    premium_paid: float
    user_id: uuid.UUID
    policy_master_id: uuid.UUID

class UserPolicyCreate(UserPolicyBase):
    pass

class UserPolicyRead(UserPolicyBase):
    id: uuid.UUID
    status: str

    class Config:
        from_attributes = True

# Claimant Schemas
class ClaimantBase(BaseModel):
    first_name: str
    last_name: str
    email: str
    phone: str
    relationship_to_insured: str

class ClaimantCreate(ClaimantBase):
    pass

class ClaimantRead(ClaimantBase):
    id: uuid.UUID

    class Config:
        from_attributes = True

# Loss Schemas
class LossBase(BaseModel):
    loss_date: datetime
    loss_type: str
    loss_cause: str
    loss_location: str
    loss_description: str

class LossCreate(LossBase):
    pass

class LossRead(LossBase):
    id: uuid.UUID

    class Config:
        from_attributes = True

# Claim Schemas
class ClaimBase(BaseModel):
    claim_number: str
    estimated_loss_amount: float
    user_policy_id: uuid.UUID
    claimant_id: uuid.UUID
    loss_id: Optional[uuid.UUID] = None

class ClaimCreate(ClaimBase):
    loss: Optional[LossCreate] = None

class ClaimUpdate(BaseModel):
    claim_status: Optional[str] = None
    estimated_loss_amount: Optional[float] = None
    verified_by_id: Optional[uuid.UUID] = None

class ClaimRead(ClaimBase):
    id: uuid.UUID
    claim_status: str
    verified_at: Optional[datetime] = None
    verified_by_id: Optional[uuid.UUID] = None
    created_at: datetime

    class Config:
        from_attributes = True

# Document Schemas
class DocumentBase(BaseModel):
    document_name: str
    document_type: str
    file_path: str
    file_format: str
    claim_id: uuid.UUID

class DocumentCreate(DocumentBase):
    pass

class DocumentRead(DocumentBase):
    id: uuid.UUID

    class Config:
        from_attributes = True
