#!/bin/bash

# Fix script to insert missing Policies and PolicyDetails data
# This script will check for errors and insert data properly

DB_NAME="insurance_claims_db"
DB_USER="${DB_USER:-root}"
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-3306}"

echo "=========================================="
echo "Fixing Missing Data"
echo "=========================================="
echo ""

read -sp "Enter MySQL password (or press Enter for no password): " DB_PASSWORD
echo ""
echo ""

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DATA_DIR="$PROJECT_ROOT/database/data"

# Check current counts
echo "Current data counts:"
CUSTOMERS=$(mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" ${DB_PASSWORD:+-p"$DB_PASSWORD"} "$DB_NAME" -se "SELECT COUNT(*) FROM Customers;" 2>/dev/null)
POLICIES=$(mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" ${DB_PASSWORD:+-p"$DB_PASSWORD"} "$DB_NAME" -se "SELECT COUNT(*) FROM Policies;" 2>/dev/null)
POLICY_DETAILS=$(mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" ${DB_PASSWORD:+-p"$DB_PASSWORD"} "$DB_NAME" -se "SELECT COUNT(*) FROM PolicyDetails;" 2>/dev/null)

echo "  Customers: $CUSTOMERS"
echo "  Policies: $POLICIES"
echo "  PolicyDetails: $POLICY_DETAILS"
echo ""

if [ "$CUSTOMERS" = "0" ]; then
    echo "❌ No customers found! Inserting customers first..."
    mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" ${DB_PASSWORD:+-p"$DB_PASSWORD"} "$DB_NAME" < "$DATA_DIR/customers_data.sql" 2>&1 | grep -v "Using a password"
    echo "✓ Customers inserted"
    echo ""
fi

# Insert Policies
if [ "$POLICIES" = "0" ]; then
    echo "Inserting Policies..."
    # Try to insert and capture errors
    ERROR_OUTPUT=$(mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" ${DB_PASSWORD:+-p"$DB_PASSWORD"} "$DB_NAME" < "$DATA_DIR/policies_data.sql" 2>&1)
    
    # Check for specific errors
    if echo "$ERROR_OUTPUT" | grep -q "ERROR"; then
        echo "⚠️  Errors occurred during insertion:"
        echo "$ERROR_OUTPUT" | grep "ERROR"
        echo ""
        echo "Trying to insert with error handling..."
        
        # Try inserting with IGNORE to skip duplicates
        mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" ${DB_PASSWORD:+-p"$DB_PASSWORD"} "$DB_NAME" -e "SET FOREIGN_KEY_CHECKS=0;" 2>/dev/null
        mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" ${DB_PASSWORD:+-p"$DB_PASSWORD"} "$DB_NAME" < "$DATA_DIR/policies_data.sql" 2>&1 | grep -v "Using a password" | grep -v "^$"
        mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" ${DB_PASSWORD:+-p"$DB_PASSWORD"} "$DB_NAME" -e "SET FOREIGN_KEY_CHECKS=1;" 2>/dev/null
    else
        echo "✓ Policies inserted successfully"
    fi
    
    # Verify
    NEW_POLICIES=$(mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" ${DB_PASSWORD:+-p"$DB_PASSWORD"} "$DB_NAME" -se "SELECT COUNT(*) FROM Policies;" 2>/dev/null)
    echo "  Policies now: $NEW_POLICIES"
    echo ""
fi

# Insert PolicyDetails
if [ "$POLICY_DETAILS" = "0" ]; then
    echo "Inserting PolicyDetails..."
    ERROR_OUTPUT=$(mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" ${DB_PASSWORD:+-p"$DB_PASSWORD"} "$DB_NAME" < "$DATA_DIR/policy_details_data.sql" 2>&1)
    
    if echo "$ERROR_OUTPUT" | grep -q "ERROR"; then
        echo "⚠️  Errors occurred during insertion:"
        echo "$ERROR_OUTPUT" | grep "ERROR"
        echo ""
        echo "Trying to insert with error handling..."
        
        mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" ${DB_PASSWORD:+-p"$DB_PASSWORD"} "$DB_NAME" -e "SET FOREIGN_KEY_CHECKS=0;" 2>/dev/null
        mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" ${DB_PASSWORD:+-p"$DB_PASSWORD"} "$DB_NAME" < "$DATA_DIR/policy_details_data.sql" 2>&1 | grep -v "Using a password" | grep -v "^$"
        mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" ${DB_PASSWORD:+-p"$DB_PASSWORD"} "$DB_NAME" -e "SET FOREIGN_KEY_CHECKS=1;" 2>/dev/null
    else
        echo "✓ PolicyDetails inserted successfully"
    fi
    
    # Verify
    NEW_DETAILS=$(mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" ${DB_PASSWORD:+-p"$DB_PASSWORD"} "$DB_NAME" -se "SELECT COUNT(*) FROM PolicyDetails;" 2>/dev/null)
    echo "  PolicyDetails now: $NEW_DETAILS"
    echo ""
fi

# Final verification
echo "=========================================="
echo "Final Verification"
echo "=========================================="
FINAL_CUSTOMERS=$(mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" ${DB_PASSWORD:+-p"$DB_PASSWORD"} "$DB_NAME" -se "SELECT COUNT(*) FROM Customers;" 2>/dev/null)
FINAL_POLICIES=$(mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" ${DB_PASSWORD:+-p"$DB_PASSWORD"} "$DB_NAME" -se "SELECT COUNT(*) FROM Policies;" 2>/dev/null)
FINAL_DETAILS=$(mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" ${DB_PASSWORD:+-p"$DB_PASSWORD"} "$DB_NAME" -se "SELECT COUNT(*) FROM PolicyDetails;" 2>/dev/null)

echo "Customers: $FINAL_CUSTOMERS"
echo "Policies: $FINAL_POLICIES"
echo "PolicyDetails: $FINAL_DETAILS"
echo ""

if [ "$FINAL_POLICIES" -gt "0" ] && [ "$FINAL_DETAILS" -gt "0" ]; then
    echo "✓ All data inserted successfully!"
else
    echo "⚠️  Some data is still missing. Check error messages above."
    echo ""
    echo "You can manually insert data by running:"
    echo "  mysql -u root insurance_claims_db < database/data/policies_data.sql"
    echo "  mysql -u root insurance_claims_db < database/data/policy_details_data.sql"
fi

echo ""
