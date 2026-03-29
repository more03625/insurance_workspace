from fastapi import APIRouter, Depends, Query
from sqlmodel import Session
import uuid
from typing import List, Optional
from core.db import get_session
from insurance_service.services.entities import UserService, PolicyMasterService, UserPolicyService, ClaimantService, DocumentService
from insurance_service.schemas.entities import (
    LoginRequest, UserCreate, UserRead, 
    PolicyMasterCreate, PolicyMasterRead, 
    UserPolicyCreate, UserPolicyRead,
    ClaimantCreate, ClaimantRead,
    DocumentCreate, DocumentRead
)
from insurance_service.schemas.base import ResponseSchema

router = APIRouter(tags=["entities"])

@router.post("/login", response_model=ResponseSchema[UserRead])
def login(data: LoginRequest, session: Session = Depends(get_session)):
    service = UserService(session)
    return service.login(data)

@router.post("/users/", response_model=ResponseSchema[UserRead])
def create_user(data: UserCreate, session: Session = Depends(get_session)):
    service = UserService(session)
    return service.create_user(data)

@router.get("/users/", response_model=ResponseSchema[List[UserRead]])
def list_users(session: Session = Depends(get_session)):
    service = UserService(session)
    return service.list_users()

@router.post("/policy-master/", response_model=ResponseSchema[PolicyMasterRead])
def create_policy_master(data: PolicyMasterCreate, session: Session = Depends(get_session)):
    service = PolicyMasterService(session)
    return service.create_policy_master(data)

@router.get("/policy-master/", response_model=ResponseSchema[List[PolicyMasterRead]])
def list_policy_master(session: Session = Depends(get_session)):
    service = PolicyMasterService(session)
    return service.list_policies()

@router.post("/user-policies/", response_model=ResponseSchema[UserPolicyRead])
def purchase_policy(data: UserPolicyCreate, session: Session = Depends(get_session)):
    service = UserPolicyService(session)
    return service.purchase_policy(data)

@router.get("/user-policies/{user_id}", response_model=ResponseSchema[List[UserPolicyRead]])
def get_user_policies(user_id: uuid.UUID, session: Session = Depends(get_session)):
    service = UserPolicyService(session)
    return service.get_user_policies(user_id)

@router.post("/claimants/", response_model=ResponseSchema[ClaimantRead])
def create_claimant(data: ClaimantCreate, session: Session = Depends(get_session)):
    service = ClaimantService(session)
    return service.create_claimant(data)

@router.post("/documents/", response_model=ResponseSchema[DocumentRead])
def upload_document(data: DocumentCreate, session: Session = Depends(get_session)):
    service = DocumentService(session)
    return service.upload_document(data)
