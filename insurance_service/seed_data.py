import uuid
import os
from datetime import datetime, timedelta
from sqlmodel import Session, select, create_engine
from insurance_service.models.entities import User, PolicyMaster, UserPolicy, Claimant, Loss, Claim, UserRole
from config.settings import settings

# Use the database URL from settings
engine = create_engine(settings.DATABASE_URL, echo=True)

def seed_data():
    with Session(engine) as session:
        # Check if data already exists
        statement = select(User).limit(1)
        if session.exec(statement).first():
            print("Database already seeded.")
            return

        print("Seeding data...")

        # 1. Create Users (Employees and Policyholders)
        employee = User(
            username="admin_emp",
            email="admin@insurance.com",
            password_hash="hashed_password_123",
            first_name="Admin",
            last_name="Employee",
            role=UserRole.EMPLOYEE
        )
        
        policyholder = User(
            username="johndoe",
            email="john.doe@example.com",
            password_hash="hashed_password_456",
            first_name="John",
            last_name="Doe",
            role=UserRole.POLICYHOLDER
        )
        
        session.add(employee)
        session.add(policyholder)
        session.commit()
        session.refresh(employee)
        session.refresh(policyholder)

        # 2. Create Policy Masters (The catalog)
        auto_policy_master = PolicyMaster(
            name="Premium Auto Shield",
            description="Comprehensive auto insurance covering collision and theft.",
            policy_type="Auto",
            base_premium=1200.0,
            coverage_details="Collision: $50,000, Theft: $30,000, Liability: $100,000"
        )
        
        home_policy_master = PolicyMaster(
            name="Home Secure Plus",
            description="Protection for your home against fire, flood, and natural disasters.",
            policy_type="Home",
            base_premium=800.0,
            coverage_details="Structure: $250,000, Contents: $50,000"
        )
        
        session.add(auto_policy_master)
        session.add(home_policy_master)
        session.commit()
        session.refresh(auto_policy_master)
        session.refresh(home_policy_master)

        # 3. Create User Policies (Purchased policies)
        user_policy = UserPolicy(
            policy_number="POL-AUTO-999",
            start_date=datetime.utcnow() - timedelta(days=30),
            end_date=datetime.utcnow() + timedelta(days=335),
            premium_paid=1200.0,
            status="Active",
            user_id=policyholder.id,
            policy_master_id=auto_policy_master.id
        )
        
        session.add(user_policy)
        session.commit()
        session.refresh(user_policy)

        # 4. Create Claimant
        claimant = Claimant(
            first_name="John",
            last_name="Doe",
            email="john.doe@example.com",
            phone="555-0123",
            relationship_to_insured="Self"
        )
        session.add(claimant)
        session.commit()
        session.refresh(claimant)

        # 5. Create Loss
        loss = Loss(
            loss_date=datetime.utcnow() - timedelta(days=5),
            loss_type="Collision",
            loss_cause="Fender bender at intersection",
            loss_location="Main St & 5th Ave",
            loss_description="Car hit a pole while turning."
        )
        session.add(loss)
        session.commit()
        session.refresh(loss)

        # 6. Create Claim
        claim = Claim(
            claim_number="CLM-2024-001",
            claim_status="Submitted",
            estimated_loss_amount=1500.0,
            user_policy_id=user_policy.id,
            claimant_id=claimant.id,
            loss_id=loss.id
        )
        session.add(claim)
        session.commit()

        print("Seed data created successfully.")

if __name__ == "__main__":
    from core.db import init_db
    # Ensure tables exist
    init_db()
    seed_data()
