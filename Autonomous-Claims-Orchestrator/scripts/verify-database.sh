#!/bin/bash

# Quick script to verify database setup and show data counts

DB_NAME="insurance_claims_db"
DB_USER="${DB_USER:-root}"
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-3306}"

echo "=========================================="
echo "Database Verification"
echo "=========================================="
echo ""

# Get password (or use empty)
read -sp "Enter MySQL password (or press Enter for no password): " DB_PASSWORD
echo ""

echo "Checking table counts..."
echo ""

# Count records in each table
CUSTOMERS=$(mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" ${DB_PASSWORD:+-p"$DB_PASSWORD"} "$DB_NAME" -se "SELECT COUNT(*) FROM Customers;" 2>/dev/null)
POLICIES=$(mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" ${DB_PASSWORD:+-p"$DB_PASSWORD"} "$DB_NAME" -se "SELECT COUNT(*) FROM Policies;" 2>/dev/null)
POLICY_DETAILS=$(mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" ${DB_PASSWORD:+-p"$DB_PASSWORD"} "$DB_NAME" -se "SELECT COUNT(*) FROM PolicyDetails;" 2>/dev/null)

echo "Customers: $CUSTOMERS records"
echo "Policies: $POLICIES records"
echo "Policy Details: $POLICY_DETAILS records"
echo ""

# Check for key policy numbers
echo "Checking for key policy numbers..."
echo ""

AC_POLICY=$(mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" ${DB_PASSWORD:+-p"$DB_PASSWORD"} "$DB_NAME" -se "SELECT COUNT(*) FROM Policies WHERE policy_number = 'AC789456123';" 2>/dev/null)
HO_POLICY=$(mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" ${DB_PASSWORD:+-p"$DB_PASSWORD"} "$DB_NAME" -se "SELECT COUNT(*) FROM Policies WHERE policy_number = 'HO456789234';" 2>/dev/null)

if [ "$AC_POLICY" = "1" ]; then
    echo "✓ Policy AC789456123 (Auto) found"
else
    echo "⚠️  Policy AC789456123 not found"
fi

if [ "$HO_POLICY" = "1" ]; then
    echo "✓ Policy HO456789234 (Home) found"
else
    echo "⚠️  Policy HO456789234 not found"
fi

echo ""

# Show sample data
echo "Sample Customer Data:"
mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" ${DB_PASSWORD:+-p"$DB_PASSWORD"} "$DB_NAME" -e "SELECT customer_id, first_name, last_name, email_id FROM Customers LIMIT 3;" 2>/dev/null

echo ""
echo "Sample Policy Data:"
mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" ${DB_PASSWORD:+-p"$DB_PASSWORD"} "$DB_NAME" -e "SELECT policy_number, policy_type, customer_id, policy_status FROM Policies LIMIT 3;" 2>/dev/null

echo ""
echo "Sample Policy Details:"
mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" ${DB_PASSWORD:+-p"$DB_PASSWORD"} "$DB_NAME" -e "SELECT policy_number, coverage_code, coverage_name, limit_per_occurrence FROM PolicyDetails LIMIT 3;" 2>/dev/null

echo ""
echo "=========================================="
echo "✓ Database verification complete!"
echo "=========================================="
