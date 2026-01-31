/**
 * Seed demo ingested claims from scenarios folder.
 * Run: npx ts-node --compiler-options '{"module":"CommonJS"}' scripts/seed-demo-claims.ts
 * Or: node scripts/seed-demo-claims.js (after tsc)
 */
import * as fs from 'fs'
import * as path from 'path'

const DATA_DIR = path.join(process.cwd(), 'data')
const INGESTED_DIR = path.join(DATA_DIR, 'ingested-attachments')
const CLAIMS_FILE = path.join(DATA_DIR, 'ingested-claims.json')
const SCENARIOS_DIR = path.join(process.cwd(), 'demo-data', 'scenarios')

interface DemoClaim {
  id: string
  policyNumber: string
  from: string
  to: string
  subject: string
  emailBody: string
  attachments: Array<{ name: string; path: string; size: number; mimeType: string }>
  createdAt: string
  source: 'demo'
}

const scenarios = [
  {
    folder: 'auto-collision',
    policyNumber: 'AC789456123',
    from: 'sarah.johnson@email.com',
    to: 'pranay.nath@aimill.in',
    subject: 'Car Accident Claim - Policy #AC789456123',
  },
  {
    folder: 'commercial-liability',
    policyNumber: 'CL789012345',
    from: 'antonio.martinez@tonysrestaurant.com',
    to: 'pranay.nath@aimill.in',
    subject: 'Commercial Liability Claim - Slip and Fall Incident - Policy #CL789012345',
  },
  {
    folder: 'property-water-damage',
    policyNumber: 'HO456789234',
    from: 'robert.chen@email.com',
    to: 'pranay.nath@aimill.in',
    subject: 'Urgent - Water Damage Claim - Policy #HO456789234',
  },
]

function seed() {
  if (!fs.existsSync(SCENARIOS_DIR)) {
    console.error('Scenarios directory not found')
    process.exit(1)
  }

  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }
  if (!fs.existsSync(INGESTED_DIR)) {
    fs.mkdirSync(INGESTED_DIR, { recursive: true })
  }

  const claims: DemoClaim[] = []
  const baseTime = Date.now() - 86400000 * 2 // 2 days ago

  scenarios.forEach((scenario, idx) => {
    const emailPath = path.join(SCENARIOS_DIR, scenario.folder, 'email.txt')
    const attachmentsDir = path.join(SCENARIOS_DIR, scenario.folder, 'attachments')

    if (!fs.existsSync(emailPath)) return

    const emailBody = fs.readFileSync(emailPath, 'utf-8')
    const claimId = `DEMO-${scenario.policyNumber}-${idx}`
    const claimDir = path.join(INGESTED_DIR, claimId)

    fs.mkdirSync(claimDir, { recursive: true })

    const attachments: DemoClaim['attachments'] = []
    if (fs.existsSync(attachmentsDir)) {
      const files = fs.readdirSync(attachmentsDir)
      for (const file of files) {
        const srcPath = path.join(attachmentsDir, file)
        const stat = fs.statSync(srcPath)
        if (stat.isFile()) {
          const destPath = path.join(claimDir, file)
          fs.copyFileSync(srcPath, destPath)
          attachments.push({
            name: file,
            path: destPath,
            size: stat.size,
            mimeType: 'text/plain',
          })
        }
      }
    }

    claims.push({
      id: claimId,
      policyNumber: scenario.policyNumber,
      from: scenario.from,
      to: scenario.to,
      subject: scenario.subject,
      emailBody,
      attachments,
      createdAt: new Date(baseTime + idx * 3600000).toISOString(),
      source: 'demo',
    })
  })

  fs.writeFileSync(CLAIMS_FILE, JSON.stringify(claims, null, 2), 'utf-8')
  console.log(`Seeded ${claims.length} demo claims to ${CLAIMS_FILE}`)
}

seed()
