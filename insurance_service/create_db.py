import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

def create_db():
    try:
        # Connect to the default 'postgres' database
        conn = psycopg2.connect(
            dbname='postgres',
            user='postgres',
            password='postgres',
            host='localhost',
            port='5432'
        )
        conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cur = conn.cursor()
        
        # Check if database exists
        cur.execute("SELECT 1 FROM pg_catalog.pg_database WHERE datname = 'insurance_db'")
        exists = cur.fetchone()
        
        if not exists:
            cur.execute('CREATE DATABASE insurance_db')
            print("Database 'insurance_db' created successfully.")
        else:
            print("Database 'insurance_db' already exists.")
            
        cur.close()
        conn.close()
    except Exception as e:
        print(f"Error creating database: {e}")

if __name__ == "__main__":
    create_db()
