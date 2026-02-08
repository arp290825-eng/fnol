#!/bin/bash

# Quick MySQL diagnostic script

echo "=========================================="
echo "MySQL Diagnostic Check"
echo "=========================================="
echo ""

# Check if MySQL is installed
echo "1. Checking if MySQL is installed..."
if command -v mysql &> /dev/null; then
    MYSQL_VERSION=$(mysql --version 2>&1)
    echo "   ✓ MySQL is installed: $MYSQL_VERSION"
    MYSQL_PATH=$(which mysql)
    echo "   Location: $MYSQL_PATH"
else
    echo "   ❌ MySQL is NOT installed"
    echo ""
    echo "   To install MySQL on macOS:"
    echo "   brew install mysql"
    echo "   brew services start mysql"
    exit 1
fi
echo ""

# Check if MySQL server is running
echo "2. Checking if MySQL server is running..."
if pgrep -x mysqld > /dev/null 2>&1 || pgrep -f mysql > /dev/null 2>&1; then
    echo "   ✓ MySQL server process is running"
else
    echo "   ❌ MySQL server is NOT running"
    echo ""
    echo "   To start MySQL:"
    echo "   brew services start mysql"
    echo "   OR"
    echo "   sudo /usr/local/mysql/support-files/mysql.server start"
    echo ""
    read -p "   Would you like to start MySQL now? (y/n): " start_mysql
    if [ "$start_mysql" = "y" ] || [ "$start_mysql" = "Y" ]; then
        if command -v brew &> /dev/null; then
            echo "   Starting MySQL with Homebrew..."
            brew services start mysql
            sleep 3
        else
            echo "   Please start MySQL manually"
        fi
    fi
fi
echo ""

# Check if we can connect without password
echo "3. Testing connection without password..."
if mysql -u root -e "SELECT 1;" &> /dev/null 2>&1; then
    echo "   ✓ Can connect as root WITHOUT password"
    echo "   → Use empty password (just press Enter) in setup script"
elif mysql -u root 2>&1 | grep -q "Access denied"; then
    echo "   ⚠️  MySQL requires a password for root user"
    echo "   → You need to enter the password you set during installation"
else
    echo "   ❌ Cannot connect - MySQL might not be running or configured"
fi
echo ""

# Check MySQL socket/port
echo "4. Checking MySQL connection details..."
if [ -S /tmp/mysql.sock ] || [ -S /var/mysql/mysql.sock ]; then
    echo "   ✓ MySQL socket file found"
else
    echo "   ⚠️  MySQL socket file not found in common locations"
fi

# Try to find MySQL port
if lsof -i :3306 &> /dev/null 2>&1; then
    echo "   ✓ Port 3306 is in use (likely MySQL)"
else
    echo "   ⚠️  Port 3306 is not in use"
fi
echo ""

# Check Homebrew services
if command -v brew &> /dev/null; then
    echo "5. Checking Homebrew MySQL service status..."
    BREW_STATUS=$(brew services list 2>/dev/null | grep mysql || echo "")
    if [ -n "$BREW_STATUS" ]; then
        echo "   $BREW_STATUS"
        if echo "$BREW_STATUS" | grep -q "started"; then
            echo "   ✓ MySQL service is started via Homebrew"
        else
            echo "   ⚠️  MySQL service is not started"
        fi
    else
        echo "   ⚠️  MySQL not managed by Homebrew"
    fi
fi
echo ""

echo "=========================================="
echo "Next Steps:"
echo "=========================================="
echo ""
echo "If MySQL is not installed:"
echo "  brew install mysql"
echo "  brew services start mysql"
echo ""
echo "If MySQL is installed but not running:"
echo "  brew services start mysql"
echo ""
echo "If you forgot your password:"
echo "  See: scripts/mysql-password-help.md"
echo ""
echo "To test connection manually:"
echo "  mysql -u root"
echo "  (or: mysql -u root -p)"
echo ""
