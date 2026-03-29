from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from core.jwt_utils import decode_access_token

bearer_scheme = HTTPBearer()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
) -> dict:
    payload = decode_access_token(credentials.credentials)
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"success": False, "error": {"code": 100001, "message": "Invalid or expired token"}},
        )
    return {
        "id": payload["sub"],
        "username": payload["username"],
        "role": payload["role"],
    }


def require_role(*allowed_roles: str):
    """Returns a dependency that ensures the user has one of the allowed roles."""
    def _guard(current_user: dict = Depends(get_current_user)) -> dict:
        if current_user["role"] not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail={"success": False, "error": {"code": 100001, "message": "You do not have access to this resource"}},
            )
        return current_user
    return _guard


require_policyholder = require_role("policyholder")
require_admin = require_role("employee", "admin")
require_any = get_current_user
