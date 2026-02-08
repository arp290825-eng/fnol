#!/bin/bash

# Manual data insertion script with better error handling
# This will show you exactly what errors occur

DB_NAME="insurance_claims_db"
DB_USER="${DB_USER:-root}"

echo "=========================================="
echo "Manual Data Insertion with Error Display"
echo "=========================================="
echo ""

read -sp "Enter MySQL password (or press Enter): " DB_PASSWORD
echo ""
echo ""

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DATA_DIR="$PROJECT_ROOT/database/data"

# Insert Policies with full error output
echo "Inserting Policies..."
echo "----------------------------------------"
mysql -u "$DB_USER" ${DB_PASSWORD:+-p"$DB_PASSWORD"} "$DB_NAME" < "$DATA_DIR/policies_data.sql" 2>&1
POLICY_EXIT=$?

if [ $POLICY_EXIT -eq 0 ]; then
    echo "✓ Policies inserted (or already exist)"
else
    echo "⚠️  Errors occurred. Trying with IGNORE..."
    # Try with INSERT IGNORE approach
    mysql -u "$DB_USER" ${DB_PASSWORD:+-p"$DB_PASSWORD"} "$DB_NAME" -e "SET FOREIGN_KEY_CHECKS=0; SET SQL_MODE='';" 2>&1
    mysql -u "$DB_USER" ${DB_PASSWORD:+-p"$DB_PASSWORD"} "$DB_NAME" < "$DATA_DIR/policies_data.sql" 2>&1
    mysql -u "$DB_USER" ${DB_PASSWORD:+-p"$DB_PASSWORD"} "$DB_NAME" -e "SET FOREIGN_KEY_CHECKS=1;" 2>&1
fi

POLICY_COUNT=$(mysql -u "$DB_USER" ${DB_PASSWORD:+-p"$DB_PASSWORD"} "$DB_NAME" -se "SELECT COUNT(*) FROM Policies;" 2>/dev/null)
echo "Policies count: $POLICY_COUNT"
echo ""

# Insert PolicyDetails
echo "Inserting PolicyDetails..."
echo "----------------------------------------"
mysql -u "$DB_USER" ${DB_PASSWORD:+-p"$DB_PASSWORD"} "$DB_NAME" < "$DATA_DIR/policy_details_data.sql" 2>&1
DETAILS_EXIT=$?

if [ $DETAILS_EXIT -eq 0 ]; then
    echo "✓ PolicyDetails inserted (or already exist)"
else
    echo "⚠️  Errors occurred. Trying with IGNORE..."
    mysql -u "$DB_USER" ${DB_PASSWORD:+-p"$DB_PASSWORD"} "$DB_NAME" -e "SET FOREIGN_KEY_CHECKS=0; SET SQL_MODE='';" 2>&1
    mysql -u "$DB_USER" ${DB_PASSWORD:+-p"$DB_PASSWORD"} "$DB_NAME" < "$DATA_DIR/policy_details_data.sql" 2>&1
    mysql -u "$DB_USER" ${DB_PASSWORD:+-p"$DB_PASSWORD"} "$DB_NAME" -e "SET FOREIGN_KEY_CHECKS=1;" 2>&1
fi

DETAILS_COUNT=$(mysql -u "$DB_USER" ${DB_PASSWORD:+-p"$DB_PASSWORD"} "$DB_NAME" -se "SELECT COUNT(*) FROM PolicyDetails;" 2>/dev/null)
echo "PolicyDetails count: $DETAILS_COUNT"
echo ""

echo "=========================================="
echo "Final Status:"
echo "  Policies: $POLICY_COUNT"
echo "  PolicyDetails: $DETAILS_COUNT"
echo "=========================================="
