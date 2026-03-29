import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from core.db import init_db
from insurance_service.routers import claims, entities

app = FastAPI(title="Insurance Claim Management System", version="1.0.0")

allowed_origins = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    init_db()

app.include_router(claims.router)
app.include_router(entities.router)

@app.get("/")
def root():
    return {"message": "Welcome to Insurance Claim Management System API v1.0.0"}
