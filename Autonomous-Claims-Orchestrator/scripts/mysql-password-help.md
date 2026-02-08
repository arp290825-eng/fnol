# MySQL Root Password Help

## I Don't Know Your Password

The MySQL root password is something **you set** when you installed MySQL. I don't have access to it.

## How to Find/Reset Your MySQL Password

### Option 1: Try Common Defaults

If you just installed MySQL, try:
- **No password** (just press Enter)
- **`root`**
- **`password`**
- **`admin`**

### Option 2: Check if MySQL Has No Password

Try connecting without a password:
```bash
mysql -u root
```

If this works, MySQL has no password set.

### Option 3: Reset MySQL Root Password

If you forgot your password, reset it:

#### Step 1: Stop MySQL
```bash
brew services stop mysql
# Or
sudo /usr/local/mysql/support-files/mysql.server stop
```

#### Step 2: Start MySQL in Safe Mode (skip password)
```bash
sudo mysqld_safe --skip-grant-tables &
```

#### Step 3: Connect without password
```bash
mysql -u root
```

#### Step 4: Reset password
```sql
USE mysql;
UPDATE user SET authentication_string=PASSWORD('your_new_password') WHERE User='root';
FLUSH PRIVILEGES;
EXIT;
```

#### Step 5: Restart MySQL normally
```bash
# Kill the safe mode process
sudo pkill mysqld

# Start MySQL normally
brew services start mysql
```

### Option 4: Use a Different User

Instead of root, create a new MySQL user:

```bash
# Connect as root (if you can)
mysql -u root -p

# Then create new user
CREATE USER 'claims_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON insurance_claims_db.* TO 'claims_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

Then use this user in the setup script:
```bash
DB_USER=claims_user ./scripts/setup-database.sh
```

### Option 5: Check MySQL Configuration

Check if password is stored in a config file:
```bash
# Check for .my.cnf file
cat ~/.my.cnf

# Check MySQL config
cat /usr/local/mysql/my.cnf
```

## Quick Test

Try these in order:

1. **No password:**
   ```bash
   mysql -u root
   ```

2. **Common passwords:**
   ```bash
   mysql -u root -p
   # Then try: root, password, admin, or just press Enter
   ```

3. **Check if MySQL is even installed:**
   ```bash
   which mysql
   mysql --version
   ```

## If MySQL is Not Installed

Install MySQL on macOS:
```bash
brew install mysql
brew services start mysql

# Set root password during installation or run:
mysql_secure_installation
```

## For the Setup Script

Once you know your password (or if there's no password), you can:

1. **Run the script and enter password when prompted**
2. **Or set it as environment variable:**
   ```bash
   export MYSQL_PWD=your_password
   ./scripts/setup-database.sh
   ```

## Still Stuck?

If you can't remember the password and can't reset it, you can:
1. Reinstall MySQL (will lose any existing databases)
2. Use a different database user
3. Use SQLite instead (simpler, no password needed)
