import sys
from datetime import datetime, timedelta
from pathlib import Path

_root = Path(__file__).resolve().parent.parent
if str(_root) not in sys.path:
    sys.path.insert(0, str(_root))

from sqlmodel import Session, select, create_engine, func
from insurance_service.models.entities import (
    User, PolicyMaster, UserPolicy, Claimant, Loss, Claim, UserRole,
)
from config.settings import settings

engine = create_engine(settings.DATABASE_URL, echo=settings.DEBUG)


def _has_rows(session: Session, model) -> bool:
    count = session.exec(select(func.count()).select_from(model)).one()
    return count > 0


def _seed_users(session: Session):
    if _has_rows(session, User):
        print("[seed] users — already has data, skipped.")
        return
    session.add(User(
        username="admin_emp",
        email="admin@insurance.com",
        password_hash="password@123",
        first_name="Admin",
        last_name="Employee",
        role=UserRole.EMPLOYEE,
    ))
    session.add(User(
        username="johndoe",
        email="john.doe@example.com",
        password_hash="password@123",
        first_name="John",
        last_name="Doe",
        role=UserRole.POLICYHOLDER,
    ))
    session.commit()
    print("[seed] users — seeded 2 rows.")


def _seed_policy_masters(session: Session):
    if _has_rows(session, PolicyMaster):
        print("[seed] policy_masters — already has data, skipped.")
        return
    session.add(PolicyMaster(
        name="Premium Auto Shield",
        description="Comprehensive auto insurance covering collision and theft.",
        policy_type="Auto",
        base_premium=1200.0,
        coverage_details="Collision: ₹50,000, Theft: ₹30,000, Liability: ₹1,00,000",
    ))
    session.add(PolicyMaster(
        name="Home Secure Plus",
        description="Protection for your home against fire, flood, and natural disasters.",
        policy_type="Home",
        base_premium=800.0,
        coverage_details="Structure: ₹2,50,000, Contents: ₹50,000",
    ))
    session.commit()
    print("[seed] policy_masters — seeded 2 rows.")


def _seed_user_policies(session: Session):
    if _has_rows(session, UserPolicy):
        print("[seed] user_policies — already has data, skipped.")
        return
    policyholder = session.exec(
        select(User).where(User.username == "johndoe")
    ).first()
    auto_policy = session.exec(
        select(PolicyMaster).where(PolicyMaster.name == "Premium Auto Shield")
    ).first()
    if not policyholder or not auto_policy:
        print("[seed] user_policies — skipped (missing parent rows in users or policy_masters).")
        return
    session.add(UserPolicy(
        policy_number="POL-AUTO-999",
        start_date=datetime.utcnow() - timedelta(days=30),
        end_date=datetime.utcnow() + timedelta(days=335),
        premium_paid=1200.0,
        status="Active",
        user_id=policyholder.id,
        policy_master_id=auto_policy.id,
    ))
    session.commit()
    print("[seed] user_policies — seeded 1 row.")


def _seed_claimants(session: Session):
    if _has_rows(session, Claimant):
        print("[seed] claimants — already has data, skipped.")
        return
    session.add(Claimant(
        first_name="John",
        last_name="Doe",
        email="john.doe@example.com",
        phone="555-0123",
        relationship_to_insured="Self",
    ))
    session.commit()
    print("[seed] claimants — seeded 1 row.")


def _seed_losses(session: Session):
    if _has_rows(session, Loss):
        print("[seed] losses — already has data, skipped.")
        return
    session.add(Loss(
        loss_date=datetime.utcnow() - timedelta(days=5),
        loss_type="Collision",
        loss_cause="Fender bender at intersection",
        loss_location="Main St & 5th Ave",
        loss_description="Car hit a pole while turning.",
    ))
    session.commit()
    print("[seed] losses — seeded 1 row.")


def _seed_claims(session: Session):
    if _has_rows(session, Claim):
        print("[seed] claims — already has data, skipped.")
        return
    user_policy = session.exec(
        select(UserPolicy).where(UserPolicy.policy_number == "POL-AUTO-999")
    ).first()
    claimant = session.exec(select(Claimant).limit(1)).first()
    loss = session.exec(select(Loss).limit(1)).first()
    if not user_policy or not claimant or not loss:
        print("[seed] claims — skipped (missing parent rows in user_policies, claimants, or losses).")
        return
    session.add(Claim(
        claim_number="CLM-2024-001",
        claim_status="Submitted",
        estimated_loss_amount=1500.0,
        user_policy_id=user_policy.id,
        claimant_id=claimant.id,
        loss_id=loss.id,
    ))
    session.commit()
    print("[seed] claims — seeded 1 row.")


def seed_data():
    print("[seed] Starting...")
    with Session(engine) as session:
        _seed_users(session)
        _seed_policy_masters(session)
        _seed_user_policies(session)
        _seed_claimants(session)
        _seed_losses(session)
        _seed_claims(session)
    print("[seed] Done.")


if __name__ == "__main__":
    seed_data()
