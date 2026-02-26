#!/bin/bash

# Setup script for OpenAI API Key
# This script helps you configure your OpenAI API key in the .env file

set -e

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_FILE="$PROJECT_ROOT/.env"
ENV_EXAMPLE="$PROJECT_ROOT/env.example"

echo "=========================================="
echo "OpenAI API Key Setup"
echo "=========================================="
echo ""

# Check if .env file exists
if [ -f "$ENV_FILE" ]; then
    echo "✓ .env file already exists"
    current_key=$(grep "^OPENAI_API_KEY=" "$ENV_FILE" | cut -d'=' -f2- | tr -d '"' | tr -d "'")
    
    if [ -n "$current_key" ]; then
        echo "Current API key: ${current_key:0:20}... (hidden)"
        read -p "Do you want to update it? (y/n): " update_key
        if [ "$update_key" != "y" ] && [ "$update_key" != "Y" ]; then
            echo "Keeping existing key."
            exit 0
        fi
    fi
else
    echo "Creating .env file from env.example..."
    if [ -f "$ENV_EXAMPLE" ]; then
        cp "$ENV_EXAMPLE" "$ENV_FILE"
        echo "✓ Created .env file"
    else
        echo "✗ env.example not found. Creating basic .env file..."
        cat > "$ENV_FILE" << EOF
# OpenAI API Configuration (set key via this script or manually; never commit .env)
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o
OPENAI_TEMPERATURE=0.1

# Demo Configuration
DEMO_MODE=true
ENABLE_REAL_AI=false
EOF
    fi
fi

echo ""
echo "To get your OpenAI API key:"
echo "1. Visit: https://platform.openai.com/api-keys"
echo "2. Sign in or create an account"
echo "3. Click 'Create new secret key'"
echo "4. Copy the key (it starts with 'sk-' or 'sk-proj-')"
echo ""
read -p "Enter your OpenAI API key (or press Enter to skip): " api_key

if [ -z "$api_key" ]; then
    echo ""
    echo "No API key provided. You can:"
    echo "1. Run this script again later"
    echo "2. Manually edit the .env file"
    echo "3. Use the frontend Settings modal to configure it"
    echo ""
    echo "Note: Without an API key, the system will run in Demo Mode"
    exit 0
fi

# Validate key format
if [[ ! "$api_key" =~ ^sk- ]]; then
    echo "⚠️  Warning: API key should start with 'sk-' or 'sk-proj-'"
    read -p "Continue anyway? (y/n): " continue_anyway
    if [ "$continue_anyway" != "y" ] && [ "$continue_anyway" != "Y" ]; then
        echo "Aborted."
        exit 1
    fi
fi

# Update .env file
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    sed -i '' "s|^OPENAI_API_KEY=.*|OPENAI_API_KEY=$api_key|" "$ENV_FILE"
else
    # Linux
    sed -i "s|^OPENAI_API_KEY=.*|OPENAI_API_KEY=$api_key|" "$ENV_FILE"
fi

echo ""
echo "✓ API key updated in .env file"
echo ""
echo "Next steps:"
echo "1. Restart your backend server if it's running"
echo "2. The API key is now configured for backend services"
echo "3. For frontend, you can also set it via the Settings modal in the UI"
echo ""
echo "To test the configuration, try processing a claim."
echo ""
