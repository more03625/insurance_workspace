from fastapi import FastAPI
from core.db import init_db
from insurance_service.routers import claims, entities

app = FastAPI(title="Insurance Claim Management System", version="1.0.0")

@app.on_event("startup")
def on_startup():
    init_db()

app.include_router(claims.router)
app.include_router(entities.router)

@app.get("/")
def root():
    return {"message": "Welcome to Insurance Claim Management System API v1.0.0"}
