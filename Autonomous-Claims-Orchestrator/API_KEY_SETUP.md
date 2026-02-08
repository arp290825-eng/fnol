# OpenAI API Key Setup Guide

## Error: Invalid API Key (401)

If you're seeing this error:
```
Error code: 401 - {'error': {'message': 'Incorrect API key provided...', 'type': 'invalid_request_error', 'code': 'invalid_api_key'}}
```

This means your OpenAI API key is either:
- Missing
- Invalid or expired
- Incorrectly formatted
- Not properly configured

## Solution: Get and Configure Your API Key

### Step 1: Get Your OpenAI API Key

1. Go to [OpenAI Platform API Keys](https://platform.openai.com/api-keys)
2. Sign in to your OpenAI account (or create one if needed)
3. Click **"Create new secret key"**
4. Give it a name (e.g., "Claims Orchestrator")
5. Copy the key immediately (it starts with `sk-` and you won't be able to see it again)

### Step 2: Configure the API Key

You need to set the API key in **two places**:

#### Option A: Backend Configuration (Recommended)

1. Open the `.env` file in the project root
2. Find the line: `OPENAI_API_KEY=your_openai_api_key_here`
3. Replace `your_openai_api_key_here` with your actual API key:
   ```
   OPENAI_API_KEY=sk-proj-your-actual-key-here
   ```
4. Save the file
5. Restart your backend server

#### Option B: Frontend Configuration (Alternative)

1. Open the Claims Fast Lane application
2. Click the **Settings/Config** button (usually in the header)
3. Paste your API key in the "OpenAI API Key" field
4. Click **Save**
5. The key will be stored in browser localStorage

**Note:** The frontend method stores the key in your browser only. For production, use the backend `.env` file method.

### Step 3: Verify the Configuration

#### Check Backend:
```bash
# In the backend directory
python -c "import os; from dotenv import load_dotenv; load_dotenv(); print('API Key set:', bool(os.getenv('OPENAI_API_KEY')))"
```

#### Check Frontend:
- Open browser DevTools (F12)
- Go to Application/Storage > Local Storage
- Look for `openai_api_key` key

### Step 4: Test the Connection

Try processing a claim again. The error should be resolved if the key is valid.

## API Key Format

Valid OpenAI API keys:
- Start with `sk-` (for standard keys) or `sk-proj-` (for project keys)
- Are typically 40-60 characters long
- Example: `sk-proj-abc123def456...`

## Troubleshooting

### Still Getting 401 Error?

1. **Verify the key is correct:**
   - No extra spaces before/after the key
   - No quotes around the key in `.env` file
   - Key hasn't been revoked in OpenAI dashboard

2. **Check API key permissions:**
   - Go to [OpenAI API Keys](https://platform.openai.com/api-keys)
   - Ensure the key is active (not revoked)
   - Check if you have billing set up (required for API usage)

3. **Check billing:**
   - Go to [OpenAI Billing](https://platform.openai.com/account/billing)
   - Ensure you have credits or payment method set up
   - Free tier may have limited usage

4. **Restart services:**
   ```bash
   # Stop the backend server (Ctrl+C)
   # Restart it
   cd backend
   python -m email_ingestion
   ```

5. **Check environment variables:**
   ```bash
   # Make sure .env file is being loaded
   # Backend should load it automatically if python-dotenv is installed
   ```

### Using Demo Mode (No API Key)

If you don't want to use OpenAI API:
- Leave `OPENAI_API_KEY` empty or unset
- Set `DEMO_MODE=true` in `.env`
- The system will use rule-based extraction instead of AI

## Security Notes

⚠️ **Important:**
- Never commit your `.env` file to git (it's in `.gitignore`)
- Never share your API key publicly
- Rotate keys if you suspect they've been compromised
- Use environment variables, not hardcoded keys in code

## Need Help?

- Check [OpenAI API Documentation](https://platform.openai.com/docs/api-reference)
- Review [OpenAI API Status](https://status.openai.com/)
- Check your [OpenAI Usage Dashboard](https://platform.openai.com/usage)
