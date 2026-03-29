from fastapi import APIRouter, Depends, Query, Body
from sqlmodel import Session
import uuid
from typing import List
from core.db import get_session
from insurance_service.services.entities import ClaimService
from insurance_service.schemas.entities import ClaimCreate, ClaimRead, ClaimUpdate
from insurance_service.schemas.base import ResponseSchema
from core.auth import require_any, require_admin

router = APIRouter(prefix="/claims", tags=["claims"])

@router.post("/", response_model=ResponseSchema[ClaimRead])
def create_claim(claim: ClaimCreate, session: Session = Depends(get_session), current_user: dict = Depends(require_any)):
    service = ClaimService(session)
    result = service.create_claim(claim)
    return result

@router.post("/{claim_id}/verify", response_model=ResponseSchema[ClaimRead])
def verify_claim(
    claim_id: uuid.UUID, 
    employee_id: uuid.UUID = Body(..., embed=True),
    status: str = Body(..., embed=True),
    session: Session = Depends(get_session),
    current_user: dict = Depends(require_admin),
):
    service = ClaimService(session)
    result = service.verify_claim(claim_id, employee_id, status)
    return result

@router.get("/", response_model=ResponseSchema[List[ClaimRead]])
def list_claims(
    offset: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    session: Session = Depends(get_session),
    current_user: dict = Depends(require_any),
):
    service = ClaimService(session)
    result = service.list_claims(offset, limit)
    return result
