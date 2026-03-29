#!/usr/bin/env bash
set -o errexit

pip install --upgrade pip
pip install -r insurance_service/requirements.txt

python insurance_service/seed_data.py
