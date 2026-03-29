#!/usr/bin/env bash
set -o errexit

pip install --upgrade pip
pip install -r insurance_service/requirements.txt

echo "=== Running migrations ==="
python insurance_service/migrate_db.py

echo "=== Running seeders ==="
python insurance_service/seed_data.py
