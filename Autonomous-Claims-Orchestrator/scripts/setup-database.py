#!/usr/bin/env python3
"""
Database Setup Script (Python version)
Creates database and executes all SQL schema and data files.
"""

import os
import sys
from pathlib import Path

# Try to import MySQL connector
try:
    import mysql.connector
    from mysql.connector import Error
    HAS_MYSQL = True
except ImportError:
    HAS_MYSQL = False
    print("⚠️  mysql-connector-python not installed. Install with: pip install mysql-connector-python")
    print("   Or use the bash script: ./scripts/setup-database.sh")

PROJECT_ROOT = Path(__file__).resolve().parent.parent
DATABASE_DIR = PROJECT_ROOT / "database"
SCHEMA_DIR = DATABASE_DIR / "schema"
DATA_DIR = DATABASE_DIR / "data"

DB_NAME = "insurance_claims_db"
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = int(os.getenv("DB_PORT", "3306"))
DB_USER = os.getenv("DB_USER", "root")


def get_password():
    """Get database password from user."""
    import getpass
    return getpass.getpass(f"Enter MySQL password for user '{DB_USER}': ")


def execute_sql_file(cursor, file_path: Path):
    """Execute SQL file."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            sql_commands = f.read()
            # Split by semicolon and execute each command
            for command in sql_commands.split(';'):
                command = command.strip()
                if command and not command.startswith('--'):
                    cursor.execute(command)
        return True
    except Error as e:
        print(f"  ⚠️  Error executing {file_path.name}: {e}")
        return False


def main():
    """Main setup function."""
    if not HAS_MYSQL:
        sys.exit(1)
    
    print("=" * 50)
    print("Insurance Claims Database Setup")
    print("=" * 50)
    print()
    
    print("Database Configuration:")
    print(f"  Host: {DB_HOST}")
    print(f"  Port: {DB_PORT}")
    print(f"  User: {DB_USER}")
    print(f"  Database: {DB_NAME}")
    print()
    
    password = get_password()
    
    try:
        # Connect to MySQL
        print("Connecting to MySQL server...")
        connection = mysql.connector.connect(
            host=DB_HOST,
            port=DB_PORT,
            user=DB_USER,
            password=password
        )
        cursor = connection.cursor()
        print("✓ Connection successful")
        print()
        
        # Create database
        print(f"Creating database '{DB_NAME}'...")
        cursor.execute(f"CREATE DATABASE IF NOT EXISTS {DB_NAME} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci")
        cursor.execute(f"USE {DB_NAME}")
        print("✓ Database created/verified")
        print()
        
        # Execute schema files
        print("Creating tables (executing schema files)...")
        print()
        
        schema_files = [
            "customers.sql",
            "policies.sql",
            "policy_details.sql"
        ]
        
        for schema_file in schema_files:
            schema_path = SCHEMA_DIR / schema_file
            if schema_path.exists():
                print(f"  Executing: {schema_file}")
                if execute_sql_file(cursor, schema_path):
                    print(f"  ✓ Completed: {schema_file}")
                connection.commit()
            else:
                print(f"  ⚠️  Warning: {schema_file} not found, skipping")
        
        print()
        
        # Execute data files
        print("Inserting dummy data...")
        print()
        
        data_files = [
            "customers_data.sql",
            "policies_data.sql",
            "policy_details_data.sql"
        ]
        
        for data_file in data_files:
            data_path = DATA_DIR / data_file
            if data_path.exists():
                print(f"  Executing: {data_file}")
                if execute_sql_file(cursor, data_path):
                    print(f"  ✓ Completed: {data_file}")
                connection.commit()
            else:
                print(f"  ⚠️  Warning: {data_file} not found, skipping")
        
        print()
        
        # Verify setup
        print("Verifying database setup...")
        cursor.execute("SHOW TABLES")
        tables = cursor.fetchall()
        table_count = len(tables)
        
        if table_count >= 3:
            print("✓ Database setup complete!")
            print()
            print(f"Tables created: {table_count}")
            for table in tables:
                print(f"  - {table[0]}")
            print()
            print("You can now connect to the database and query the data.")
        else:
            print(f"⚠️  Warning: Expected 3 tables, found {table_count}")
        
        cursor.close()
        connection.close()
        
    except Error as e:
        print(f"❌ Error: {e}")
        sys.exit(1)
    
    print()
    print("=" * 50)


if __name__ == "__main__":
    main()
