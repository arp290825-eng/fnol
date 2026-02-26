# Claims Fast Lane - Autonomous Claims Orchestrator

An AI-powered insurance claims processing system with modular **Python backend** microservices and a **Next.js frontend**.

## 🏗 Architecture

### Clear Separation: Backend vs Frontend

```
├── backend/                    # Python microservices (modular, reusable)
│   ├── common/                 # Shared config and utilities
│   ├── extraction/             # LLM extraction (email, docs, Vision API)
│   ├── decision/               # Policy grounding, decision pack assembly
│   ├── dashboard/              # Processed claims history, CSV, KPIs
│   ├── ingested_claims/        # Ingested claims CRUD, deduplication
│   ├── email_ingestion/        # IMAP sync, FNOL classification
│   └── process_claim/          # Orchestrator (chains extraction + decision + dashboard)
│
├── frontend/                   # Next.js 14 App (UI, API routes as BFF)
│   ├── app/                    # Pages and API routes
│   ├── components/             # React components
│   └── lib/                    # Frontend utilities, auth
│
├── data/                       # Shared data (ingested claims, processed claims)
└── demo-data/                  # Test scenarios
```

### Backend Microservices (Python)

Each module in `backend/` is **modular and independently usable** as a microservice:

| Module | Description | CLI / Usage |
|--------|-------------|-------------|
| **extraction** | LLM-based extraction from email, documents, images (Vision) | `python -m backend.extraction <claim_id>` |
| **decision** | Policy grounding, claim draft, decision pack assembly | Import `build_decision_pack` |
| **dashboard** | Processed claims: save, list, get, CSV, KPIs | `python -m backend.dashboard list\|get\|save\|csv\|stats` |
| **ingested_claims** | Ingested claims CRUD, deduplication, attachments | `python -m backend.ingested_claims list\|get\|clear` |
| **email_ingestion** | IMAP sync, FNOL classification, claim ingestion | `python -m backend.email_ingestion` |
| **process_claim** | End-to-end orchestration | `python -m backend.process_claim <ingested_claim_id>` |

### Frontend (Next.js)

- **App Router** with TypeScript, Tailwind CSS, Framer Motion
- **API routes** act as BFF (Backend for Frontend), spawning Python services
- **UI components**: Home, Review, Decision, Dashboard pages

## 🚀 Quick Start

### 1. Installation

```bash
git clone <repository-url>
cd Autonomous-Claims-Orchestrator

# Install frontend dependencies
npm run install:frontend

# Install Python backend dependencies
pip install -r backend/requirements.txt
```

### 2. Configuration

Create a `.env` file in the **project root** (never commit this file):

- `OPENAI_API_KEY` – Get from [platform.openai.com/api-keys](https://platform.openai.com/api-keys); required for real AI extraction.
- `OPENAI_MODEL` – Optional; default `gpt-4o`.
- `SENDER_EMAIL` / `EMAIL_PASSWORD` – For IMAP Sync Inbox.
- `SENDGRID_API_KEY` – Optional; for inbound webhook.

### 3. Run the Application

```bash
npm run dev
```

Visit `http://localhost:3000`

> The dev server runs from `frontend/`. API routes invoke Python backend services via subprocess.

## 🎮 Using the Demo

### Demo Modes

- **AI Mode** (with OpenAI API key): Real GPT-4 extraction, document classification, policy grounding
- **Demo Mode** (no key): Graceful fallback; demo scenarios work for UI testing

### Test Scenarios

1. **Auto Collision** – `demo-data/scenarios/auto-collision/`
2. **Property Water Damage** – `demo-data/scenarios/property-water-damage/`
3. **Commercial Liability** – `demo-data/scenarios/commercial-liability/`

### FNOL Workflow

1. **Sync Inbox** – Fetch FNOL emails from IMAP (Gmail/Outlook)
2. **Select Policy** – Choose from ingested claims dropdown
3. **Process** – Run AI extraction and policy matching
4. **Review / Decision / Dashboard** – Navigate through stages

## 🛠 Tech Stack

- **Backend**: Python 3.9+, OpenAI API
- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, Framer Motion
- **Data**: JSON files in `data/` (ingested-claims, processed-claims)

## 📁 Backend Coding Conventions

All Python files in `backend/` follow:

- **PEP 8** style
- Type hints where appropriate
- Modular design for reuse as standalone microservices
- CLI entry points via `python -m backend.<module>`

## 📝 License

Demonstration project for AI-powered claims processing in insurance technology.
