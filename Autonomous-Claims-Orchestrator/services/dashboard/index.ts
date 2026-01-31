/**
 * Dashboard Microservice
 *
 * Delegates to Python (dashboard.py) for processed claims history:
 * save, list, retrieve by ID, export CSV.
 */

import { spawn } from 'child_process'
import path from 'path'
import type { ClaimData } from '@/types/claims'
import type { ProcessedClaimSummary } from './types'

const SCRIPT_PATH = path.join(process.cwd(), 'services', 'dashboard', 'dashboard.py')
const PY_CMD = process.platform === 'win32' ? 'python' : 'python3'

async function runPython(args: string[], stdin?: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const proc = spawn(PY_CMD, [SCRIPT_PATH, ...args], {
      cwd: process.cwd(),
      env: { ...process.env },
      stdio: stdin !== undefined ? ['pipe', 'pipe', 'pipe'] : ['ignore', 'pipe', 'pipe'],
    })

    let stdout = ''
    let stderr = ''

    proc.stdout?.on('data', (d) => { stdout += d.toString() })
    proc.stderr?.on('data', (d) => { stderr += d.toString() })

    if (stdin !== undefined && proc.stdin) {
      proc.stdin.write(stdin, 'utf-8')
      proc.stdin.end()
    }

    proc.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(stderr || stdout || `Python exited with code ${code}`))
      } else {
        resolve(stdout)
      }
    })

    proc.on('error', (err) => reject(err))
  })
}

/** Save a processed claim to history and CSV */
export async function saveProcessedClaim(claim: ClaimData): Promise<void> {
  const input = JSON.stringify(claim)
  const out = await runPython(['save'], input)
  const parsed = JSON.parse(out.trim())
  if (parsed.error) {
    throw new Error(parsed.error)
  }
}

/** Get list of processed claim summaries for dropdown */
export async function getProcessedClaimSummaries(): Promise<ProcessedClaimSummary[]> {
  const out = await runPython(['list'])
  return JSON.parse(out.trim())
}

/** Get full claim data by ID */
export async function getProcessedClaimById(claimId: string): Promise<ClaimData | null> {
  const out = await runPython(['get', claimId])
  const trimmed = out.trim()
  if (trimmed === 'null') return null
  return JSON.parse(trimmed) as ClaimData
}

/** Get CSV content for export */
export async function getCsvContent(): Promise<string> {
  return runPython(['csv'])
}
