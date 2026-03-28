# Centralized error codes and messages for the application

class ErrorCodes:
    # Generic Errors
    GENERIC_ERROR = {"code": 100000, "message": "An unexpected error occurred"}
    UNAUTHORIZED = {"code": 100001, "message": "Unauthorized access"}
    INVALID_INPUT = {"code": 100002, "message": "Invalid input provided"}
    NOT_FOUND = {"code": 100003, "message": "Requested resource not found"}
    
    # Claim Errors
    CLAIM_NOT_FOUND = {"code": 200001, "message": "Claim not found"}
    INVALID_CLAIM_TYPE = {"code": 200002, "message": "Please select a valid claim type"}
    CLAIM_UPDATE_FAILED = {"code": 200003, "message": "Failed to update claim"}
    CLAIM_CREATION_FAILED = {"code": 200004, "message": "Failed to create claim"}
    
    # Policy/Policyholder Errors
    POLICY_NOT_FOUND = {"code": 300001, "message": "Policy not found"}
    POLICYHOLDER_NOT_FOUND = {"code": 300002, "message": "Policyholder not found"}
    
    # Claimant Errors
    CLAIMANT_NOT_FOUND = {"code": 400001, "message": "Claimant not found"}
    
    # Loss/Incident Errors
    LOSS_NOT_FOUND = {"code": 500001, "message": "Loss record not found"}
    
    # Document Errors
    DOCUMENT_NOT_FOUND = {"code": 600001, "message": "Document not found"}
    UPLOAD_FAILED = {"code": 600002, "message": "File upload failed"}
