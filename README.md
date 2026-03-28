# Insurance Claim Management System - Backend Service

This is a production-grade FastAPI backend service for the Insurance Claim Management System, built with SQLModel and PostgreSQL.

## 🚀 How to Run the Project

### 1. Prerequisites
- Python 3.10+
- PostgreSQL (Running on localhost:5432)
- Fast API / Uvicorn

### 2. Environment Setup
Create a virtual environment (optional but recommended) and install dependencies:
```bash
pip install fastapi uvicorn sqlmodel sqlalchemy psycopg2-binary pydantic pydantic-settings python-dotenv
```

### 3. Database Configuration
Ensure your PostgreSQL server is running. The default connection string is:
`postgresql://postgres:postgres@localhost:5432/insurance_db`

### 4. Initialize Database and Seed Data
Run the following commands to create the database, apply migrations, and seed it with demo data:
```bash
# Set PYTHONPATH to root directory
set PYTHONPATH=.

# Create the database record (if not exists)
python insurance_service/create_db.py

# Run migration to create/update tables
python insurance_service/migrate_db.py

# Seed demo data (Users, Policy Masters, User Policies, Claims)
python insurance_service/seed_data.py
```

### 5. Start the Application
Run the FastAPI server using Uvicorn (using `python -m` to avoid PATH issues):
```bash
python -m uvicorn insurance_service.main:app --reload
```

### 6. Access API Documentation
Once the server is running, you can access the interactive Swagger documentation at:
- **Swagger UI**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc**: [http://localhost:8000/redoc](http://localhost:8000/redoc)

## 📁 Project Structure
- `core/`: Database connection and error handling logic.
- `config/`: Application settings and environment configurations.
- `insurance_service/models/`: SQLModel database entities.
- `insurance_service/schemas/`: Pydantic request/response DTOs.
- `insurance_service/repositories/`: Data access layer.
- `insurance_service/services/`: Business logic layer.
- `insurance_service/routers/`: API endpoints.

## 🛠 Features
- **Layered Architecture**: Separation of concerns for maintainability.
- **PostgreSQL Integration**: Robust data storage with SQLModel ORM.
- **Centralized Error Handling**: Standardized error responses.
- **Audit Support**: Automatic timestamps and soft delete capabilities.
- **Demo Ready**: Pre-seeded with a complete claim workflow.
