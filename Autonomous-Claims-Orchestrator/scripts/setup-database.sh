#!/bin/bash

# Database Setup Script
# This script creates the database and executes all SQL schema and data files

set -e

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DATABASE_DIR="$PROJECT_ROOT/database"
SCHEMA_DIR="$DATABASE_DIR/schema"
DATA_DIR="$DATABASE_DIR/data"

# Database configuration
DB_NAME="insurance_claims_db"
DB_USER="${DB_USER:-root}"
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-3306}"

echo "=========================================="
echo "Insurance Claims Database Setup"
echo "=========================================="
echo ""

# Check if MySQL/MariaDB is installed
if ! command -v mysql &> /dev/null; then
    echo "❌ Error: MySQL/MariaDB client not found"
    echo "Please install MySQL or MariaDB client tools"
    echo ""
    echo "macOS: brew install mysql"
    echo "Ubuntu/Debian: sudo apt-get install mysql-client"
    echo "CentOS/RHEL: sudo yum install mysql"
    exit 1
fi

echo "Database Configuration:"
echo "  Host: $DB_HOST"
echo "  Port: $DB_PORT"
echo "  User: $DB_USER"
echo "  Database: $DB_NAME"
echo ""

# Prompt for password
read -sp "Enter MySQL password for user '$DB_USER': " DB_PASSWORD
echo ""

# Test connection
echo "Testing database connection..."
if ! mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASSWORD" -e "SELECT 1;" &> /dev/null; then
    echo "❌ Error: Cannot connect to MySQL server"
    echo "Please check your credentials and ensure MySQL is running"
    exit 1
fi
echo "✓ Connection successful"
echo ""

# Create database
echo "Creating database '$DB_NAME'..."
mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASSWORD" -e "CREATE DATABASE IF NOT EXISTS $DB_NAME CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" 2>/dev/null || {
    echo "⚠️  Database might already exist, continuing..."
}
echo "✓ Database created/verified"
echo ""

# Execute schema files
echo "Creating tables (executing schema files)..."
echo ""

SCHEMA_FILES=(
    "customers.sql"
    "policies.sql"
    "policy_details.sql"
)

for schema_file in "${SCHEMA_FILES[@]}"; do
    schema_path="$SCHEMA_DIR/$schema_file"
    if [ -f "$schema_path" ]; then
        echo "  Executing: $schema_file"
        mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" < "$schema_path" 2>/dev/null || {
            echo "  ⚠️  Warning: Some errors occurred (tables might already exist)"
        }
        echo "  ✓ Completed: $schema_file"
    else
        echo "  ⚠️  Warning: $schema_file not found, skipping"
    fi
done

echo ""

# Execute data files
echo "Inserting dummy data..."
echo ""

DATA_FILES=(
    "customers_data.sql"
    "policies_data.sql"
    "policy_details_data.sql"
)

for data_file in "${DATA_FILES[@]}"; do
    data_path="$DATA_DIR/$data_file"
    if [ -f "$data_path" ]; then
        echo "  Executing: $data_file"
        mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" < "$data_path" 2>/dev/null || {
            echo "  ⚠️  Warning: Some errors occurred (data might already exist)"
        }
        echo "  ✓ Completed: $data_file"
    else
        echo "  ⚠️  Warning: $data_file not found, skipping"
    fi
done

echo ""

# Verify setup
echo "Verifying database setup..."
TABLES=$(mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" -e "SHOW TABLES;" 2>/dev/null | wc -l | tr -d ' ')
TABLES=$((TABLES - 1))  # Subtract header row

if [ "$TABLES" -ge 3 ]; then
    echo "✓ Database setup complete!"
    echo ""
    echo "Tables created: $TABLES"
    echo ""
    echo "You can now:"
    echo "1. Connect to the database using:"
    echo "   mysql -u $DB_USER -p $DB_NAME"
    echo ""
    echo "2. Query the data:"
    echo "   SELECT COUNT(*) FROM Customers;"
    echo "   SELECT COUNT(*) FROM Policies;"
    echo "   SELECT COUNT(*) FROM PolicyDetails;"
    echo ""
    echo "3. Test policy grounding queries from:"
    echo "   database/queries/policy_grounding_queries.sql"
else
    echo "⚠️  Warning: Expected 3 tables, found $TABLES"
    echo "Please check for errors above"
fi

echo ""
echo "=========================================="
