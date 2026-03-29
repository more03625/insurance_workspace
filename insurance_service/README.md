# Insurance Service (Backend)

FastAPI backend with SQLModel ORM and PostgreSQL.

## Setup

```bash
# From the repository root
pip install -r insurance_service/requirements.txt
```

## Database Configuration

Update `insurance_service/.env`:

```
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/insurance_db
```

## Database Setup

```bash
# Create the database (first time only)
python insurance_service/create_db.py

# Run migrations (creates missing tables, applies only new migrations)
python insurance_service/migrate_db.py

# Seed demo data (skips tables that already have data)
python insurance_service/seed_data.py
```

## Run

```bash
insurance_workspace/python -m uvicorn insurance_service.main:app --reload
```

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Project Structure

```
insurance_service/
├── models/          # SQLModel database entities
├── schemas/         # Pydantic request/response DTOs
├── repositories/    # Data access layer
├── services/        # Business logic layer
├── routers/         # API endpoints
├── migrate_db.py    # Incremental migrations
├── seed_data.py     # Per-table demo data seeder
├── create_db.py     # Database creation script
├── main.py          # FastAPI application entry point
└── requirements.txt # Python dependencies
```

## Migration & Seeding Strategy

- **migrate_db.py**: Uses `create_all` (creates only missing tables) + an `_applied_migrations` tracking table for custom SQL migrations. Never drops existing tables.
- **seed_data.py**: Checks each table independently. If a table already has rows, seeding is skipped. Safe to re-run on every deploy.
- **build.sh**: Runs both automatically during each Render deploy.

## Deploy to Render

1. Create a PostgreSQL database on [Neon](https://neon.tech) (free tier)
2. Create a Web Service on Render:
   - **Root Directory**: *(leave blank)*
   - **Build Command**: `bash insurance_service/build.sh`
   - **Start Command**: `uvicorn insurance_service.main:app --host 0.0.0.0 --port $PORT`
3. Set environment variables:
   - `DATABASE_URL` = Neon connection string
   - `DEBUG` = `False`
   - `CORS_ORIGINS` = your Netlify frontend URL
   - `PYTHON_VERSION` = `3.13.0`
