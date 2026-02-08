#!/bin/bash

# Quick script to view database data

DB_NAME="insurance_claims_db"
DB_USER="${DB_USER:-root}"
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-3306}"

echo "=========================================="
echo "Insurance Claims Database - Data Viewer"
echo "=========================================="
echo ""

# Get password (or use empty)
read -sp "Enter MySQL password (or press Enter for no password): " DB_PASSWORD
echo ""
echo ""

# Function to run query
run_query() {
    local query="$1"
    local title="$2"
    echo "--- $title ---"
    mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" ${DB_PASSWORD:+-p"$DB_PASSWORD"} "$DB_NAME" -e "$query" 2>/dev/null
    echo ""
}

# Show summary counts
echo "=========================================="
echo "DATABASE SUMMARY"
echo "=========================================="
run_query "SELECT 'Customers' as TableName, COUNT(*) as Count FROM Customers UNION ALL SELECT 'Policies', COUNT(*) FROM Policies UNION ALL SELECT 'PolicyDetails', COUNT(*) FROM PolicyDetails;" "Record Counts"

# Show all customers
echo "=========================================="
echo "CUSTOMERS (All Records)"
echo "=========================================="
run_query "SELECT customer_id, first_name, last_name, email_id, phone_number, city, state, customer_status FROM Customers ORDER BY customer_id;" "All Customers"

# Show all policies
echo "=========================================="
echo "POLICIES (All Records)"
echo "=========================================="
run_query "SELECT policy_number, customer_id, policy_type, policy_status, effective_date, expiration_date, premium_amount, total_coverage_limit FROM Policies ORDER BY policy_number;" "All Policies"

# Show key policies
echo "=========================================="
echo "KEY POLICIES (AC789456123 & HO456789234)"
echo "=========================================="
run_query "SELECT p.policy_number, p.policy_type, c.first_name, c.last_name, c.email_id, p.policy_status, p.effective_date, p.expiration_date, p.premium_amount FROM Policies p JOIN Customers c ON p.customer_id = c.customer_id WHERE p.policy_number IN ('AC789456123', 'HO456789234');" "Key Policies"

# Show policy details for key policies
echo "=========================================="
echo "POLICY DETAILS (AC789456123 - Auto)"
echo "=========================================="
run_query "SELECT coverage_code, coverage_name, limit_per_occurrence, deductible_amount, is_active FROM PolicyDetails WHERE policy_number = 'AC789456123' ORDER BY coverage_code;" "Auto Policy Coverage"

echo "=========================================="
echo "POLICY DETAILS (HO456789234 - Home)"
echo "=========================================="
run_query "SELECT coverage_code, coverage_name, limit_per_occurrence, deductible_amount, is_active FROM PolicyDetails WHERE policy_number = 'HO456789234' ORDER BY coverage_code;" "Home Policy Coverage"

# Show full policy grounding example
echo "=========================================="
echo "COMPLETE POLICY GROUNDING (AC789456123)"
echo "=========================================="
run_query "SELECT c.customer_id, c.first_name, c.last_name, c.email_id, p.policy_number, p.policy_type, p.policy_status, pd.coverage_code, pd.coverage_name, pd.limit_per_occurrence, pd.deductible_amount FROM Customers c JOIN Policies p ON c.customer_id = p.customer_id JOIN PolicyDetails pd ON p.policy_number = pd.policy_number WHERE p.policy_number = 'AC789456123' AND pd.is_active = TRUE;" "Full Policy Grounding Example"

echo "=========================================="
echo "View complete! Use MySQL client for more queries."
echo "=========================================="
