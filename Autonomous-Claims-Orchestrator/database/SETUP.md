# Database Setup Guide

## Current Status

**The SQL files are NOT automatically executed.** They need to be set up manually or using the provided setup scripts.

## Quick Setup

### Option 1: Using the Setup Script (Recommended)

#### Bash Script (Linux/macOS):
```bash
cd /path/to/Autonomous-Claims-Orchestrator
./scripts/setup-database.sh
```

#### Python Script:
```bash
cd /path/to/Autonomous-Claims-Orchestrator
python3 scripts/setup-database.py
```

The script will:
1. Check if MySQL is installed
2. Prompt for database credentials
3. Create the database
4. Execute all schema files (create tables)
5. Execute all data files (insert dummy data)
6. Verify the setup

### Option 2: Manual Setup

#### Step 1: Create Database
```sql
CREATE DATABASE insurance_claims_db;
USE insurance_claims_db;
```

#### Step 2: Execute Schema Files
```bash
mysql -u username -p insurance_claims_db < database/schema/customers.sql
mysql -u username -p insurance_claims_db < database/schema/policies.sql
mysql -u username -p insurance_claims_db < database/schema/policy_details.sql
```

#### Step 3: Insert Data
```bash
mysql -u username -p insurance_claims_db < database/data/customers_data.sql
mysql -u username -p insurance_claims_db < database/data/policies_data.sql
mysql -u username -p insurance_claims_db < database/data/policy_details_data.sql
```

## Environment Variables

You can set these environment variables before running the setup script:

```bash
export DB_HOST=localhost
export DB_PORT=3306
export DB_USER=root
```

Or use them inline:
```bash
DB_USER=myuser DB_HOST=myserver ./scripts/setup-database.sh
```

## Verification

After setup, verify the database:

```bash
mysql -u username -p insurance_claims_db -e "SHOW TABLES;"
mysql -u username -p insurance_claims_db -e "SELECT COUNT(*) FROM Customers;"
mysql -u username -p insurance_claims_db -e "SELECT COUNT(*) FROM Policies;"
mysql -u username -p insurance_claims_db -e "SELECT COUNT(*) FROM PolicyDetails;"
```

## Integration with Application

**Note:** Currently, the application uses in-memory policy clauses (hardcoded in `backend/decision/policy_clauses.py` and `frontend/lib/policyClauses.ts`).

To integrate the database:

1. **Install database connector:**
   ```bash
   pip install mysql-connector-python  # or pymysql
   ```

2. **Create database connection module:**
   - See `database/queries/policy_grounding_queries.sql` for example queries
   - Create a Python module in `backend/database/` to handle connections

3. **Update policy grounding code:**
   - Modify `backend/decision/service.py` to query the database instead of in-memory clauses
   - Use the queries from `database/queries/policy_grounding_queries.sql`

## Troubleshooting

### "Command not found: mysql"
Install MySQL client:
- **macOS:** `brew install mysql`
- **Ubuntu/Debian:** `sudo apt-get install mysql-client`
- **CentOS/RHEL:** `sudo yum install mysql`

### "Access denied"
- Check your MySQL username and password
- Ensure the user has CREATE DATABASE and INSERT privileges

### "Table already exists"
- The script will continue, but you may want to drop existing tables first:
  ```sql
  DROP TABLE IF EXISTS PolicyDetails;
  DROP TABLE IF EXISTS Policies;
  DROP TABLE IF EXISTS Customers;
  ```

### Connection refused
- Ensure MySQL server is running:
  ```bash
  # macOS
  brew services start mysql
  
  # Linux
  sudo systemctl start mysql
  ```

## Next Steps

1. ✅ Set up the database using the script
2. ⏳ Integrate database queries into the application (requires code changes)
3. ⏳ Update policy grounding to use database instead of in-memory data
4. ⏳ Test policy grounding with real database queries
