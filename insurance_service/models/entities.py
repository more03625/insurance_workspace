from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime
from typing import Optional, List
import uuid
from enum import Enum
from insurance_service.models.base import AuditModel

class UserRole(str, Enum):
    POLICYHOLDER = "policyholder"
    EMPLOYEE = "employee"
    ADMIN = "admin"

class User(AuditModel, table=True):
    __tablename__ = "users"
    id: Optional[uuid.UUID] = Field(default_factory=uuid.uuid4, primary_key=True)
    username: str = Field(unique=True, index=True)
    email: str = Field(unique=True, index=True)
    password_hash: str
    first_name: str
    last_name: str
    role: UserRole = Field(default=UserRole.POLICYHOLDER)
    is_active: bool = Field(default=True)
    
    # Relationships
    purchased_policies: List["UserPolicy"] = Relationship(back_populates="user")

class PolicyMaster(AuditModel, table=True):
    """Master catalog of available insurance products/policies."""
    __tablename__ = "policy_masters"
    id: Optional[uuid.UUID] = Field(default_factory=uuid.uuid4, primary_key=True)
    name: str = Field(index=True)
    description: str
    policy_type: str # Auto, Home, Health, etc.
    base_premium: float
    coverage_details: str
    
    # Relationships
    user_policies: List["UserPolicy"] = Relationship(back_populates="policy_master")

class UserPolicy(AuditModel, table=True):
    """Policies actually purchased by users."""
    __tablename__ = "user_policies"
    id: Optional[uuid.UUID] = Field(default_factory=uuid.uuid4, primary_key=True)
    policy_number: str = Field(unique=True, index=True)
    start_date: datetime
    end_date: datetime
    premium_paid: float
    status: str = Field(default="Active") # Active, Expired, Cancelled
    
    # Foreign Keys
    user_id: uuid.UUID = Field(foreign_key="users.id")
    policy_master_id: uuid.UUID = Field(foreign_key="policy_masters.id")
    
    # Relationships
    user: User = Relationship(back_populates="purchased_policies")
    policy_master: PolicyMaster = Relationship(back_populates="user_policies")
    claims: List["Claim"] = Relationship(back_populates="user_policy")

class Claimant(AuditModel, table=True):
    __tablename__ = "claimants"
    id: Optional[uuid.UUID] = Field(default_factory=uuid.uuid4, primary_key=True)
    first_name: str
    last_name: str
    email: str
    phone: str
    relationship_to_insured: str # Self, Spouse, Third Party
    
    claims: List["Claim"] = Relationship(back_populates="claimant")

class Loss(AuditModel, table=True):
    __tablename__ = "losses"
    id: Optional[uuid.UUID] = Field(default_factory=uuid.uuid4, primary_key=True)
    loss_date: datetime
    loss_type: str
    loss_cause: str
    loss_location: str
    loss_description: str
    
    claim: Optional["Claim"] = Relationship(back_populates="loss")

class Claim(AuditModel, table=True):
    __tablename__ = "claims"
    id: Optional[uuid.UUID] = Field(default_factory=uuid.uuid4, primary_key=True)
    claim_number: str = Field(unique=True, index=True)
    claim_status: str = Field(default="Submitted") # Submitted, Verified, Approved, Rejected
    estimated_loss_amount: float
    verified_at: Optional[datetime] = None
    verified_by_id: Optional[uuid.UUID] = Field(default=None, foreign_key="users.id")
    
    # Foreign Keys
    user_policy_id: uuid.UUID = Field(foreign_key="user_policies.id")
    claimant_id: uuid.UUID = Field(foreign_key="claimants.id")
    loss_id: Optional[uuid.UUID] = Field(foreign_key="losses.id")
    
    # Relationships
    user_policy: UserPolicy = Relationship(back_populates="claims")
    claimant: Claimant = Relationship(back_populates="claims")
    loss: Optional[Loss] = Relationship(back_populates="claim")
    documents: List["Document"] = Relationship(back_populates="claim")

class Document(AuditModel, table=True):
    __tablename__ = "documents"
    id: Optional[uuid.UUID] = Field(default_factory=uuid.uuid4, primary_key=True)
    document_name: str
    document_type: str # Photo, ID, Invoice
    file_path: str
    file_format: str
    
    claim_id: Optional[uuid.UUID] = Field(foreign_key="claims.id")
    claim: Optional[Claim] = Relationship(back_populates="documents")
