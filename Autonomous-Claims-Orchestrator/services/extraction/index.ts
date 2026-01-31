/**
 * Extraction Microservice
 *
 * Runs information_extraction.py (LLM-based extraction from email, documents, images).
 * Returns structured claim fields, evidence, and document analysis.
 */

import { spawn } from 'child_process'
import path from 'path'
import { getIngestedClaimById } from '@/services/ingested-claims'
import type { ExtractionResult } from './types'
export type { ExtractionResult } from './types'

const SCRIPT_PATH = path.join(process.cwd(), 'services', 'extraction', 'extraction.py')
const PY_CMD = process.platform === 'win32' ? 'python' : 'python3'

/** Run extraction for an ingested claim */
export async function runExtraction(ingestedClaimId: string): Promise<ExtractionResult> {
  const claim = getIngestedClaimById(ingestedClaimId)
  if (!claim) {
    throw new Error('Claim not found')
  }

  return new Promise<ExtractionResult>((resolve, reject) => {
    const proc = spawn(PY_CMD, [SCRIPT_PATH, ingestedClaimId], {
      cwd: process.cwd(),
      env: { ...process.env },
    })

    let stdout = ''
    let stderr = ''

    proc.stdout?.on('data', (d) => {
      stdout += d.toString()
    })
    proc.stderr?.on('data', (d) => {
      stderr += d.toString()
    })

    proc.on('close', (code) => {
      try {
        const parsed = JSON.parse(stdout.trim())
        if (parsed.error) {
          reject(new Error(parsed.error))
        } else {
          resolve(parsed)
        }
      } catch {
        reject(
          new Error(stderr || stdout || `Python exited with code ${code}`)
        )
      }
    })

    proc.on('error', (err) => reject(err))
  })
}
