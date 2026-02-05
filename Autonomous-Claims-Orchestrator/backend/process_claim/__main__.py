"""CLI entry for process_claim orchestrator."""
import sys
from backend.process_claim.orchestrator import main

if __name__ == "__main__":
    sys.exit(main())
