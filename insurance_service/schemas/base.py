from pydantic import BaseModel
from typing import Optional, Generic, TypeVar, Any

T = TypeVar("T")

class ResponseSchema(BaseModel, Generic[T]):
    success: bool
    data: Optional[T] = None
    error: Optional[dict] = None

class ErrorDetail(BaseModel):
    code: int
    message: str
