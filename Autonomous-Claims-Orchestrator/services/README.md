# Microservices

Modular service layer for the Autonomous Claims Orchestrator. Each service has a single responsibility and clear boundaries.

## Service Overview

| Service | Description | Entry Points |
|---------|-------------|--------------|
| **email-ingestion** | IMAP sync, FNOL classification, claim ingestion | `syncInbox()` / `email_auto_ingestion.py` |
| **extraction** | LLM-based extraction from email, docs, images | `runExtraction()` / `extraction.py` |
| **decision** | Policy grounding, claim draft, decision pack assembly | `buildDecisionPack()` |
| **dashboard** | Processed claims history, CSV export (Python) | `dashboard.py` CLI, `saveProcessedClaim()`, etc. |
| **ingested-claims** | Ingested claims CRUD, deduplication, attachments | `getIngestedClaimById()`, `saveIngestedClaim()`, etc. |

## Structure

```
services/
├── email-ingestion/
│   ├── index.ts              # Node IMAP sync (primary)
│   ├── types.ts
│   └── email_auto_ingestion.py  # Python alternative (cron/standalone)
├── extraction/
│   ├── index.ts              # Spawns Python, returns extraction result
│   ├── types.ts
│   └── extraction.py         # LLM extraction (email, docs, Vision)
├── decision/
│   ├── index.ts              # Policy grounding, decision pack
│   └── types.ts
├── dashboard/
│   ├── index.ts              # Node wrapper (spawns Python)
│   ├── dashboard.py          # Python implementation
│   └── types.ts
└── ingested-claims/
    ├── index.ts              # Ingested claims storage
    └── types.ts
```

## API Routes → Services

- `POST /api/sync-inbox` → `services/email-ingestion`
- `POST /api/process-claim` → `services/extraction` + `services/decision` + `services/dashboard`
- `GET/POST /api/claims` → `services/dashboard`
- `GET /api/ingested-claims`, `GET /api/ingested-claims/[id]` → `services/ingested-claims`

## Python Scripts

- **extraction.py** – Run via `python services/extraction/extraction.py <claim_id>`
- **email_auto_ingestion.py** – Run via `python services/email-ingestion/email_auto_ingestion.py`
- **dashboard.py** – Processed claims: `python services/dashboard/dashboard.py list | get <id> | save | csv`

Paths are resolved relative to project root (`data/`, `.env`).
