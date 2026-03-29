# Insurance Claim Management System

A full-stack insurance claim management application with a FastAPI backend and React frontend.

## Project Structure

```
insurance_workspace/
├── config/              # Application settings
├── core/                # Database connection & error codes
├── insurance_service/   # FastAPI backend (see insurance_service/README.md)
├── insurance_web/       # React frontend (see insurance_web/README.md)
└── README.md
```

## Quick Start

Run all commands from the repository root.

```bash
# 1. Backend
pip install -r insurance_service/requirements.txt
python insurance_service/create_db.py
python insurance_service/migrate_db.py
python insurance_service/seed_data.py
python -m uvicorn insurance_service.main:app --reload

# 2. Frontend (in a separate terminal)
cd insurance_web
npm install
npm run dev
```

- Backend: http://localhost:8000
- Frontend: http://localhost:3000

## Demo Credentials

| Username   | Password     | Role         |
|------------|--------------|--------------|
| admin_emp  | password@123 | Employee     |
| johndoe    | password@123 | Policyholder |
