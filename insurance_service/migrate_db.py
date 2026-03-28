import os
from sqlmodel import SQLModel, create_engine, text
from config.settings import settings
from insurance_service.models.entities import User, PolicyMaster, UserPolicy, Claimant, Loss, Claim, Document

# Use the database URL from settings
engine = create_engine(settings.DATABASE_URL, echo=True)

def migrate():
    print(f"Starting migration on {settings.DATABASE_URL}...")
    
    with engine.connect() as conn:
        # Drop all tables with CASCADE to handle dependent objects like types
        # We list the tables explicitly to ensure they are dropped in the right order or with CASCADE
        tables = ["documents", "claims", "user_policies", "losses", "claimants", "policy_masters", "users", "user", "policymaster", "userpolicy", "claimant", "loss", "claim", "document"]
        
        for table in tables:
            try:
                conn.execute(text(f"DROP TABLE IF EXISTS \"{table}\" CASCADE"))
                print(f"Dropped table {table}")
            except Exception as e:
                print(f"Could not drop table {table}: {e}")
        
        # Drop the enum type explicitly with CASCADE
        try:
            conn.execute(text("DROP TYPE IF EXISTS userrole CASCADE"))
            print("Dropped type userrole")
        except Exception as e:
            print(f"Could not drop type userrole: {e}")
            
        conn.commit()

    # Recreate all tables
    SQLModel.metadata.create_all(engine)
    print("Migration completed successfully. All tables recreated.")

if __name__ == "__main__":
    migrate()
