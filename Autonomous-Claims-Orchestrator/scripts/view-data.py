#!/usr/bin/env python3
"""
Interactive database data viewer
Shows all data in a formatted way
"""

import sys
from pathlib import Path

try:
    import mysql.connector
    from mysql.connector import Error
    HAS_MYSQL = True
except ImportError:
    print("⚠️  mysql-connector-python not installed.")
    print("   Install with: pip install mysql-connector-python")
    print("   Or use: ./scripts/view-data.sh")
    sys.exit(1)

DB_NAME = "insurance_claims_db"
DB_HOST = "localhost"
DB_PORT = 3306
DB_USER = "root"


def get_password():
    """Get database password from user."""
    import getpass
    return getpass.getpass("Enter MySQL password (or press Enter for no password): ")


def print_section(title):
    """Print a section header."""
    print("\n" + "=" * 60)
    print(title)
    print("=" * 60)


def run_query(cursor, query, title=""):
    """Run a query and display results."""
    if title:
        print_section(title)
    try:
        cursor.execute(query)
        results = cursor.fetchall()
        columns = [desc[0] for desc in cursor.description]
        
        if not results:
            print("No data found.")
            return
        
        # Print header
        print(" | ".join(f"{col:20}" for col in columns))
        print("-" * (len(columns) * 23))
        
        # Print rows
        for row in results:
            print(" | ".join(f"{str(val):20}" for val in row))
        
        print(f"\nTotal rows: {len(results)}")
    except Error as e:
        print(f"Error: {e}")


def main():
    """Main function."""
    password = get_password()
    
    try:
        # Connect to MySQL
        connection = mysql.connector.connect(
            host=DB_HOST,
            port=DB_PORT,
            user=DB_USER,
            password=password if password else None,
            database=DB_NAME
        )
        cursor = connection.cursor()
        
        print_section("Insurance Claims Database - Data Viewer")
        
        # Summary counts
        run_query(cursor, """
            SELECT 'Customers' as TableName, COUNT(*) as Count FROM Customers 
            UNION ALL 
            SELECT 'Policies', COUNT(*) FROM Policies 
            UNION ALL 
            SELECT 'PolicyDetails', COUNT(*) FROM PolicyDetails
        """, "DATABASE SUMMARY")
        
        # All customers
        run_query(cursor, """
            SELECT customer_id, first_name, last_name, email_id, phone_number, city, state, customer_status 
            FROM Customers 
            ORDER BY customer_id
        """, "CUSTOMERS (All Records)")
        
        # All policies
        run_query(cursor, """
            SELECT policy_number, customer_id, policy_type, policy_status, 
                   effective_date, expiration_date, premium_amount, total_coverage_limit 
            FROM Policies 
            ORDER BY policy_number
        """, "POLICIES (All Records)")
        
        # Key policies
        run_query(cursor, """
            SELECT p.policy_number, p.policy_type, c.first_name, c.last_name, 
                   c.email_id, p.policy_status, p.effective_date, p.expiration_date, p.premium_amount 
            FROM Policies p 
            JOIN Customers c ON p.customer_id = c.customer_id 
            WHERE p.policy_number IN ('AC789456123', 'HO456789234')
        """, "KEY POLICIES (AC789456123 & HO456789234)")
        
        # Policy details for AC789456123
        run_query(cursor, """
            SELECT coverage_code, coverage_name, limit_per_occurrence, deductible_amount, is_active 
            FROM PolicyDetails 
            WHERE policy_number = 'AC789456123' 
            ORDER BY coverage_code
        """, "POLICY DETAILS (AC789456123 - Auto Insurance)")
        
        # Policy details for HO456789234
        run_query(cursor, """
            SELECT coverage_code, coverage_name, limit_per_occurrence, deductible_amount, is_active 
            FROM PolicyDetails 
            WHERE policy_number = 'HO456789234' 
            ORDER BY coverage_code
        """, "POLICY DETAILS (HO456789234 - Home Insurance)")
        
        # Complete policy grounding example
        run_query(cursor, """
            SELECT c.customer_id, c.first_name, c.last_name, c.email_id, 
                   p.policy_number, p.policy_type, p.policy_status, 
                   pd.coverage_code, pd.coverage_name, pd.limit_per_occurrence, pd.deductible_amount 
            FROM Customers c 
            JOIN Policies p ON c.customer_id = p.customer_id 
            JOIN PolicyDetails pd ON p.policy_number = pd.policy_number 
            WHERE p.policy_number = 'AC789456123' AND pd.is_active = TRUE
        """, "COMPLETE POLICY GROUNDING EXAMPLE (AC789456123)")
        
        cursor.close()
        connection.close()
        
        print_section("View complete!")
        print("Use MySQL client or run queries from database/queries/policy_grounding_queries.sql")
        
    except Error as e:
        print(f"❌ Error: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
