'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Mail,
  FileText,
  Image,
  AlertCircle,
  Clock,
  CheckCircle,
  RefreshCw,
  Trash2,
  Paperclip,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import { ClaimData } from '@/types/claims'

/** One automatic IMAP sync per browser tab session (avoids React Strict Mode / remount double sync). */
const AUTO_SYNC_SESSION_KEY = 'fnol_claim_inbox_auto_sync_v1'

interface HomePageProps {
  onProcessClaim: (data: ClaimData) => void
  isProcessing: boolean
  setIsProcessing: (processing: boolean) => void
}

interface MailChainEntry {
  from: string
  fromLabel: string
  to: string
  subject: string
  body: string
  dateIso?: string
  dateDisplay?: string
  attachmentCount?: number
  isOutbound?: boolean
}

interface IngestedClaim {
  id: string
  policyNumber: string
  from: string
  to: string
  subject: string
  emailBody: string
  mailChain?: MailChainEntry[]
  attachments: Array<{ name: string; path: string; size: number; mimeType: string }>
  createdAt: string
  source: 'sendgrid' | 'demo' | 'imap'
}

interface PolicyOption {
  id: string
  policyNumber: string
  subject: string
  from?: string
  createdAt?: string
  source?: string
}

function initialsFromLabel(label: string): string {
  const parts = label.replace(/[<>]/g, ' ').trim().split(/\s+/)
  if (!parts.length) return '?'
  const a = parts[0]?.[0] || ''
  const b = parts.length > 1 ? parts[parts.length - 1][0] || '' : parts[0]?.[1] || ''
  return (a + b).toUpperCase().slice(0, 2) || '?'
}

function formatListTime(iso: string | undefined): string {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: false })
}

function formatDetailDate(dateIso?: string, dateDisplay?: string): string {
  if (dateDisplay?.trim()) return dateDisplay.trim()
  if (!dateIso) return '—'
  const d = new Date(dateIso)
  if (Number.isNaN(d.getTime())) return dateIso
  return d.toLocaleString(undefined, {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function sourceLabel(src: string | undefined): string {
  const s = (src || '').toLowerCase()
  if (s === 'imap') return 'IMAP inbox'
  if (s === 'sendgrid') return 'Inbound email'
  if (s === 'demo') return 'Demo data'
  if (s === 'imap_faq') return 'FAQ auto-reply'
  return src || '—'
}

type BodyBlock =
  | { kind: 'quote'; lines: string[] }
  | { kind: 'plain'; lines: string[] }
  | { kind: 'separator' }

const OUTLOOK_ORIGINAL = /^\s*-{5,}\s*Original Message\s*-{5,}\s*$/i
const OUTLOOK_UNDERSCORE = /^\s*_{32,}\s*$/

/** Parses body into quotes, Outlook separators, and plain runs for structured rendering. */
function parseMailBodyBlocks(text: string): BodyBlock[] {
  const lines = text.replace(/\r\n/g, '\n').split('\n')
  const blocks: BodyBlock[] = []
  let i = 0
  while (i < lines.length) {
    const line = lines[i]
    if (OUTLOOK_ORIGINAL.test(line) || OUTLOOK_UNDERSCORE.test(line)) {
      blocks.push({ kind: 'separator' })
      i += 1
      continue
    }
    if (/^>+\s?/.test(line)) {
      const q: string[] = []
      while (i < lines.length && /^>+\s?/.test(lines[i])) {
        q.push(lines[i])
        i += 1
      }
      blocks.push({ kind: 'quote', lines: q })
      continue
    }
    const p: string[] = []
    while (
      i < lines.length &&
      !/^>+\s?/.test(lines[i]) &&
      !OUTLOOK_ORIGINAL.test(lines[i]) &&
      !OUTLOOK_UNDERSCORE.test(lines[i])
    ) {
      p.push(lines[i])
      i += 1
    }
    if (p.length) blocks.push({ kind: 'plain', lines: p })
  }
  return blocks
}

/** Renders structured message body: paragraphs, reply separators, quoted history. */
function FormattedMailBody({ text, outbound }: { text: string; outbound: boolean }) {
  if (!text?.trim()) {
    return <p className="text-[#94A3B8] text-sm py-2">No body text.</p>
  }
  const blocks = parseMailBodyBlocks(text)
  const quoteBg = outbound ? 'bg-indigo-50/90 border-indigo-200' : 'bg-slate-100 border-slate-300'
  return (
    <div className="space-y-4 text-[15px] text-slate-800 leading-[1.6]">
      {blocks.map((b, i) => {
        if (b.kind === 'separator') {
          return (
            <div
              key={i}
              className="flex items-center gap-3 py-1"
              role="separator"
              aria-label="Earlier message"
            >
              <div className="h-px flex-1 bg-slate-200" />
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 shrink-0">
                Earlier message
              </span>
              <div className="h-px flex-1 bg-slate-200" />
            </div>
          )
        }
        if (b.kind === 'quote') {
          const dequoted = b.lines.map((l) => l.replace(/^>+\s?/, '')).join('\n')
          return (
            <blockquote
              key={i}
              className={`border-l-[3px] pl-4 py-3 pr-3 rounded-r-lg text-sm text-slate-600 shadow-sm ${quoteBg}`}
            >
              <div className="whitespace-pre-wrap font-sans">{dequoted}</div>
            </blockquote>
          )
        }
        const chunk = b.lines.join('\n').trimEnd()
        if (!chunk.trim()) return <div key={i} className="h-1" />
        const paras = chunk.split(/\n{2,}/).filter((p) => p.trim())
        return (
          <div key={i} className="space-y-3">
            {paras.map((para, j) => (
              <p key={j} className="whitespace-pre-wrap text-slate-800">
                {para.trim()}
              </p>
            ))}
          </div>
        )
      })}
    </div>
  )
}

function displaySender(entry: MailChainEntry): string {
  if (entry.isOutbound) return 'Claims Team'
  return entry.fromLabel || entry.from || 'Unknown'
}

function threadSnippet(entry: MailChainEntry): string {
  const line = entry.body?.split('\n').find((l) => l.trim()) || entry.subject || ''
  const t = line.trim()
  return t.length > 72 ? `${t.slice(0, 72)}…` : t
}

export default function HomePage({ onProcessClaim, isProcessing, setIsProcessing }: HomePageProps) {
  const [policyOptions, setPolicyOptions] = useState<PolicyOption[]>([])
  const [processedIngestedIds, setProcessedIngestedIds] = useState<Set<string>>(new Set())
  const [selectedClaim, setSelectedClaim] = useState<IngestedClaim | null>(null)
  const [selectedId, setSelectedId] = useState<string>('')
  const [loadingPolicies, setLoadingPolicies] = useState(true)
  const [loadingClaim, setLoadingClaim] = useState(false)
  const [syncingInbox, setSyncingInbox] = useState(false)
  const [syncMessage, setSyncMessage] = useState('')
  const [syncMessageSuccess, setSyncMessageSuccess] = useState(false)
  const [clearingClaims, setClearingClaims] = useState(false)
  const [error, setError] = useState('')
  const [processingSteps, setProcessingSteps] = useState<string[]>([])
  const [currentStep, setCurrentStep] = useState('')
  const [expandedThreadIdx, setExpandedThreadIdx] = useState<number | null>(null)

  const fetchProcessedIds = useCallback(async () => {
    try {
      const res = await fetch('/api/claims')
      if (!res.ok) return
      const rows = (await res.json()) as Array<{ ingestedClaimId?: string }>
      const next = new Set<string>()
      for (const r of rows) {
        if (r.ingestedClaimId) next.add(r.ingestedClaimId)
      }
      setProcessedIngestedIds(next)
    } catch {
      /* ignore */
    }
  }, [])

  const fetchPolicyOptions = async () => {
    setLoadingPolicies(true)
    setError('')
    try {
      const res = await fetch('/api/ingested-claims')
      if (!res.ok) throw new Error('Failed to load claims')
      const data = (await res.json()) as PolicyOption[]
      setPolicyOptions(data)
    } catch (err) {
      setError('Unable to load ingested claims. Please try again.')
      setPolicyOptions([])
    } finally {
      setLoadingPolicies(false)
    }
  }

  const handleSyncInbox = useCallback(async () => {
    setSyncingInbox(true)
    setError('')
    setSyncMessage('')
    setSyncMessageSuccess(false)
    try {
      const res = await fetch('/api/sync-inbox', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.errors?.[0] || 'Sync failed')
      if (data.ingested > 0 || (data.mergedFollowUp ?? 0) > 0) {
        const parts: string[] = []
        if (data.ingested > 0) parts.push(`${data.ingested} new claim(s) ingested`)
        if ((data.mergedFollowUp ?? 0) > 0) {
          parts.push(`${data.mergedFollowUp} follow-up(s) merged into existing claims`)
        }
        if (data.skippedDuplicate > 0) {
          parts.push(`${data.skippedDuplicate} already in inbox (exact duplicates)`)
        }
        if ((data.skippedComplaintCorrespondence ?? 0) > 0) {
          parts.push(
            `${data.skippedComplaintCorrespondence} non-FNOL (retail/complaint) skipped`,
          )
        }
        if (data.hint) parts.push(data.hint)
        setSyncMessage(parts.join('. '))
        setSyncMessageSuccess(true)
      } else if (data.scanned > 0 && data.skippedNoFnol === data.scanned) {
        setSyncMessage(`Scanned ${data.scanned} — none matched claim / FNOL filters`)
        setSyncMessageSuccess(false)
      } else if (
        data.scanned > 0 &&
        (data.skippedDuplicate ?? 0) + (data.mergedFollowUp ?? 0) === data.scanned
      ) {
        const parts: string[] = [`Scanned ${data.scanned}`]
        if ((data.mergedFollowUp ?? 0) > 0)
          parts.push(`${data.mergedFollowUp} follow-up(s) added to mail chains`)
        if ((data.skippedDuplicate ?? 0) > 0)
          parts.push(`${data.skippedDuplicate} already in inbox`)
        setSyncMessage(parts.join(' — '))
        setSyncMessageSuccess((data.mergedFollowUp ?? 0) > 0)
      } else if (data.scanned === 0) {
        setSyncMessage(data.hint || 'No emails to sync')
        setSyncMessageSuccess(false)
      } else {
        setSyncMessage(data.hint ? data.hint : 'No new emails since last sync')
        setSyncMessageSuccess(false)
      }
      await fetchPolicyOptions()
      await fetchProcessedIds()
      if (data.errors?.length) setError(data.errors.join('; '))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sync inbox')
    } finally {
      setSyncingInbox(false)
    }
  }, [fetchProcessedIds])

  useEffect(() => {
    const initialize = async () => {
      await fetchPolicyOptions()
      await fetchProcessedIds()
      const alreadySynced =
        typeof window !== 'undefined' && sessionStorage.getItem(AUTO_SYNC_SESSION_KEY) === '1'
      if (!alreadySynced) {
        await handleSyncInbox()
        if (typeof window !== 'undefined') {
          sessionStorage.setItem(AUTO_SYNC_SESSION_KEY, '1')
        }
      }
    }
    void initialize()
  }, [handleSyncInbox, fetchProcessedIds])

  useEffect(() => {
    const chain = selectedClaim?.mailChain
    if (chain && chain.length > 0) {
      setExpandedThreadIdx(chain.length - 1)
    } else {
      setExpandedThreadIdx(null)
    }
  }, [selectedClaim?.id])

  const handleClearClaims = async () => {
    if (!confirm('Clear all ingested claims? This cannot be undone.')) return
    setClearingClaims(true)
    setError('')
    setSyncMessage('')
    setSyncMessageSuccess(false)
    try {
      const res = await fetch('/api/ingested-claims/clear', { method: 'POST' })
      if (!res.ok) throw new Error('Clear failed')
      setSelectedClaim(null)
      setSelectedId('')
      await fetchPolicyOptions()
      await fetchProcessedIds()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to clear')
    } finally {
      setClearingClaims(false)
    }
  }

  const handleSelectClaim = async (claimId: string) => {
    setSelectedId(claimId)
    if (!claimId) {
      setSelectedClaim(null)
      return
    }
    setLoadingClaim(true)
    setError('')
    try {
      const res = await fetch(`/api/ingested-claims/${claimId}`)
      if (!res.ok) throw new Error('Failed to load claim')
      const data = (await res.json()) as IngestedClaim
      setSelectedClaim(data)
    } catch (err) {
      setError('Unable to load claim details.')
      setSelectedClaim(null)
    } finally {
      setLoadingClaim(false)
    }
  }

  const handleProcessClaim = async () => {
    if (!selectedClaim) return
    setError('')
    setIsProcessing(true)
    setProcessingSteps([])
    setCurrentStep('')

    const steps = [
      'Loading FNOL submission from claim inbox...',
      'Extracting information from email and attachments...',
      'Analyzing documents and images (Vision)...',
      'Policy Grounding: Matching claim against policy clause database...',
      'Assembling decision pack and saving to history...',
    ]

    for (let i = 0; i < steps.length; i++) {
      setCurrentStep(steps[i])
      setProcessingSteps((prev) => [...prev, steps[i]])
      await new Promise((resolve) => setTimeout(resolve, 700))
    }

    try {
      const res = await fetch('/api/process-claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingestedClaimId: selectedClaim.id }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Processing failed')
      onProcessClaim(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Claim processing failed')
    } finally {
      setIsProcessing(false)
    }
  }

  const canProcess = !!selectedClaim && !isProcessing
  const total = policyOptions.length
  const processedCount = policyOptions.filter((p) => processedIngestedIds.has(p.id)).length
  const pendingCount = total - processedCount

  const chain: MailChainEntry[] =
    selectedClaim?.mailChain && selectedClaim.mailChain.length > 0
      ? selectedClaim.mailChain
      : selectedClaim
        ? [
            {
              from: selectedClaim.from,
              fromLabel: selectedClaim.from || 'Unknown',
              to: selectedClaim.to,
              subject: selectedClaim.subject,
              body: selectedClaim.emailBody || '',
              dateIso: selectedClaim.createdAt,
              dateDisplay: '',
              attachmentCount: selectedClaim.attachments?.length ?? 0,
              isOutbound: false,
            },
          ]
        : []

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-white text-[#111827] overflow-hidden">
      {/* Top strip: sync + actions */}
      <div className="flex flex-wrap items-center justify-end gap-3 px-6 py-3 border-b border-[#E5E7EB] shrink-0">
        {syncingInbox && (
          <span className="flex items-center gap-2 text-sm text-[#6B7280]">
            <RefreshCw className="w-4 h-4 animate-spin" />
            Syncing…
          </span>
        )}
        {!syncingInbox && syncMessage && (
          <span
            className={`text-sm font-medium ${syncMessageSuccess ? 'text-[#059669]' : 'text-[#6B7280]'}`}
          >
            {syncMessage}
          </span>
        )}
        {!syncingInbox && !syncMessage && (
          <span className="text-sm text-[#6B7280]">No new FNOL emails since last sync</span>
        )}
        <button
          type="button"
          onClick={() => handleSyncInbox()}
          disabled={syncingInbox}
          className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg border border-[#E5E7EB] text-[#374151] hover:bg-[#F9FAFB] disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${syncingInbox ? 'animate-spin' : ''}`} />
          Refresh
        </button>
        <button
          type="button"
          onClick={handleClearClaims}
          disabled={clearingClaims || loadingPolicies || policyOptions.length === 0}
          className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg border border-[#E5E7EB] text-[#374151] hover:border-[#BFDBFE] hover:text-[#1D4ED8] disabled:opacity-50"
        >
          <Trash2 className="w-4 h-4" />
          Clear
        </button>
      </div>

      <div className="flex flex-1 min-h-0">
        {/* Sidebar — FNOL / claim submissions */}
        <aside className="w-full max-w-[380px] border-r border-[#E5E7EB] flex flex-col bg-[#FAFAFA] shrink-0">
          <div className="px-4 py-4 border-b border-[#E5E7EB] bg-white">
            <h2 className="text-lg font-semibold text-[#111827]">Claim Inbox</h2>
            <p className="text-sm text-[#6B7280] mt-1">
              <span className="font-medium text-[#374151]">{total}</span> FNOL submission{total !== 1 ? 's' : ''} ·{' '}
              <span className="font-medium text-[#374151]">{pendingCount}</span> awaiting review ·{' '}
              <span className="font-medium text-[#374151]">{processedCount}</span> processed
            </p>
          </div>
          <div className="flex-1 overflow-y-auto">
            {loadingPolicies ? (
              <div className="flex items-center justify-center py-16 text-[#9CA3AF] text-sm">
                <RefreshCw className="w-5 h-5 animate-spin mr-2" />
                Loading…
              </div>
            ) : policyOptions.length === 0 ? (
              <div className="p-6 text-sm text-[#9CA3AF] text-center">
                No claim submissions yet. Sync to pull FNOL emails.
              </div>
            ) : (
              <ul className="divide-y divide-[#E5E7EB]">
                {policyOptions.map((opt) => {
                  const done = processedIngestedIds.has(opt.id)
                  const active = selectedId === opt.id
                  const sender = opt.from?.trim() || 'Unknown'
                  const av = initialsFromLabel(sender)
                  return (
                    <li key={opt.id}>
                      <button
                        type="button"
                        onClick={() => handleSelectClaim(opt.id)}
                        className={`w-full text-left px-4 py-3 flex gap-3 transition-colors ${
                          active ? 'bg-[#EFF6FF] border-l-[3px] border-l-[#2563EB]' : 'border-l-[3px] border-l-transparent hover:bg-white'
                        }`}
                      >
                        <div
                          className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold text-white ${
                            done ? 'bg-[#94A3B8]' : 'bg-gradient-to-br from-[#2563EB] to-[#6366F1]'
                          }`}
                        >
                          {av}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-sm font-medium text-[#111827] truncate">{sender}</span>
                            <div className="flex items-center gap-1.5 shrink-0">
                              {opt.source && opt.source !== 'demo' && (
                                <span
                                  className="text-[9px] font-semibold uppercase px-1.5 py-0.5 rounded bg-[#F1F5F9] text-[#64748B]"
                                  title={sourceLabel(opt.source)}
                                >
                                  {opt.source === 'imap' ? 'IMAP' : opt.source === 'sendgrid' ? 'Email' : opt.source}
                                </span>
                              )}
                              <span
                                className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${
                                  done
                                    ? 'bg-[#D1FAE5] text-[#065F46]'
                                    : 'bg-[#EEF2FF] text-[#3730A3]'
                                }`}
                              >
                                {done ? 'Processed' : 'Awaiting'}
                              </span>
                            </div>
                          </div>
                          <p className="text-xs text-[#6B7280] mt-1">
                            <span className="text-[#9CA3AF] font-medium uppercase tracking-wide text-[10px] mr-1">
                              Policy
                            </span>
                            <span className="font-mono text-[#374151]">{opt.policyNumber || '—'}</span>
                          </p>
                          <p className="text-sm text-[#374151] truncate mt-0.5">{opt.subject}</p>
                          <div className="flex items-center justify-between mt-1 gap-2">
                            <span className="text-[10px] text-[#9CA3AF] font-mono truncate" title={opt.id}>
                              {opt.id}
                            </span>
                            <span className="text-xs text-[#9CA3AF] shrink-0 tabular-nums">
                              {formatListTime(opt.createdAt)}
                            </span>
                          </div>
                        </div>
                      </button>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        </aside>

        {/* Main — thread */}
        <section className="flex-1 flex flex-col min-w-0 bg-white">
          {!selectedClaim && !loadingClaim ? (
            <div className="flex-1 flex flex-col items-center justify-center text-[#9CA3AF] px-8">
              <Mail className="w-12 h-12 mb-4 opacity-40" />
              <p className="text-sm text-center">
                Select a claim submission to view the FNOL email thread.
              </p>
            </div>
          ) : loadingClaim ? (
            <div className="flex-1 flex items-center justify-center text-[#9CA3AF]">
              <RefreshCw className="w-6 h-6 animate-spin mr-2" />
              Loading…
            </div>
          ) : selectedClaim ? (
            <>
              <div className="px-6 py-4 border-b border-[#E5E7EB] flex flex-wrap items-start justify-between gap-4 shrink-0 bg-white">
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-[#9CA3AF] mb-1">
                    Subject line
                  </p>
                  <h1 className="text-xl font-semibold text-[#111827] leading-snug">{selectedClaim.subject}</h1>
                  <div className="flex flex-wrap items-center gap-2 mt-3 text-sm text-[#6B7280]">
                    <span
                      className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                        processedIngestedIds.has(selectedClaim.id)
                          ? 'bg-[#D1FAE5] text-[#065F46]'
                          : 'bg-[#EEF2FF] text-[#3730A3]'
                      }`}
                    >
                      {processedIngestedIds.has(selectedClaim.id) ? 'Processed' : 'Awaiting review'}
                    </span>
                    <span className="text-[#D1D5DB]">·</span>
                    <span className="inline-flex items-center gap-1.5 text-[#374151]">
                      <Paperclip className="w-3.5 h-3.5 text-[#6B7280]" />
                      {selectedClaim.attachments?.length ?? 0} file
                      {(selectedClaim.attachments?.length ?? 0) !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleProcessClaim}
                  disabled={!canProcess}
                  className={`shrink-0 px-5 py-2.5 rounded-lg text-sm font-semibold border transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                    processedIngestedIds.has(selectedClaim.id)
                      ? 'bg-[#F3F4F6] text-[#6B7280] border-[#E5E7EB]'
                      : 'bg-[#2563EB] text-white border-[#2563EB] hover:bg-[#1D4ED8] hover:border-[#1D4ED8]'
                  }`}
                >
                  {processedIngestedIds.has(selectedClaim.id) ? 'Claim processed' : 'Process claim'}
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-6">
                <div className="max-w-3xl">
                  <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-5 flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5" />
                    Thread ({chain.length})
                  </h2>
                  <ol className="space-y-5 list-none p-0 m-0">
                    {chain.map((entry, idx) => {
                      const expanded = expandedThreadIdx === idx
                      const outbound = !!entry.isOutbound
                      const label = displaySender(entry)
                      const ini = initialsFromLabel(label)
                      const partSubject =
                        (entry.subject || '').trim() || selectedClaim.subject || '(No subject)'
                      return (
                        <li
                          key={`${idx}-${entry.dateIso || ''}-${entry.from}`}
                          className="rounded-xl border border-slate-200/90 bg-white shadow-[0_1px_3px_rgba(15,23,42,0.06)] overflow-hidden"
                        >
                          <div
                            className={`px-4 py-3 border-b border-slate-200 ${outbound ? 'bg-indigo-50/50' : 'bg-slate-50/80'}`}
                          >
                            <div className="flex items-start gap-3">
                              <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-semibold text-white shrink-0 ${
                                  outbound
                                    ? 'bg-gradient-to-br from-indigo-600 to-violet-600'
                                    : 'bg-gradient-to-br from-blue-600 to-indigo-500'
                                }`}
                              >
                                {ini}
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center gap-2 justify-between">
                                  <div className="flex items-center gap-2 flex-wrap min-w-0">
                                    <span className="text-sm font-semibold text-slate-900">{label}</span>
                                    {outbound && (
                                      <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-800 shrink-0">
                                        Outbound
                                      </span>
                                    )}
                                    {(entry.attachmentCount ?? 0) > 0 && (
                                      <span
                                        className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-500 shrink-0"
                                        title={`${entry.attachmentCount} attachment(s)`}
                                      >
                                        <Paperclip className="w-3 h-3" />
                                        {entry.attachmentCount}
                                      </span>
                                    )}
                                  </div>
                                  <time
                                    className="text-xs text-slate-500 tabular-nums shrink-0"
                                    dateTime={entry.dateIso}
                                  >
                                    {formatDetailDate(entry.dateIso, entry.dateDisplay)}
                                  </time>
                                </div>
                                <dl className="mt-3 grid grid-cols-[3.75rem_1fr] gap-x-2 gap-y-1.5 text-xs text-left">
                                  <dt className="text-slate-400 font-medium">From</dt>
                                  <dd className="text-slate-700 break-all min-w-0">{entry.from || '—'}</dd>
                                  <dt className="text-slate-400 font-medium">To</dt>
                                  <dd className="text-slate-700 break-all min-w-0">{entry.to || '—'}</dd>
                                  <dt className="text-slate-400 font-medium">Subject</dt>
                                  <dd className="text-slate-700 font-medium break-words min-w-0">
                                    {partSubject}
                                  </dd>
                                </dl>
                              </div>
                            </div>
                          </div>

                          <div className="bg-white">
                            {!expanded && (
                              <button
                                type="button"
                                onClick={() => setExpandedThreadIdx(idx)}
                                className="w-full text-left px-4 py-3 text-xs text-slate-500 hover:bg-slate-50 transition-colors flex items-start justify-between gap-3 border-b border-transparent"
                              >
                                <span className="line-clamp-2 leading-relaxed flex-1">{threadSnippet(entry)}</span>
                                <ChevronDown className="w-4 h-4 shrink-0 text-slate-400 mt-0.5" />
                              </button>
                            )}
                            {expanded && (
                              <div className="border-t border-slate-100">
                                <div className="px-4 py-2 flex justify-end border-b border-slate-100 bg-slate-50/50">
                                  <button
                                    type="button"
                                    onClick={() => setExpandedThreadIdx(null)}
                                    className="text-xs font-medium text-slate-600 hover:text-slate-900 inline-flex items-center gap-1"
                                  >
                                    <ChevronUp className="w-3.5 h-3.5" />
                                    Collapse body
                                  </button>
                                </div>
                                <div
                                  className={`px-5 py-5 ${outbound ? 'bg-indigo-50/20' : 'bg-white'}`}
                                >
                                  <FormattedMailBody text={entry.body || ''} outbound={outbound} />
                                </div>
                              </div>
                            )}
                          </div>
                        </li>
                      )
                    })}
                  </ol>
                </div>

                {(selectedClaim.attachments?.length ?? 0) > 0 && (
                  <div className="max-w-3xl mt-10">
                    <h3 className="text-xs font-semibold text-[#64748B] uppercase tracking-wide mb-3 flex items-center gap-2">
                      <Paperclip className="w-3.5 h-3.5" />
                      Attachments ({selectedClaim.attachments?.length ?? 0})
                    </h3>
                    <ul className="space-y-2">
                      {selectedClaim.attachments.map((att) => (
                        <li
                          key={att.name}
                          className="flex items-center gap-3 px-4 py-3 rounded-lg border border-[#E5E7EB] bg-[#FAFAFA]"
                        >
                          {att.mimeType.startsWith('image/') ? (
                            <Image className="w-4 h-4 text-[#2563EB] shrink-0" />
                          ) : (
                            <FileText className="w-4 h-4 text-[#6B7280] shrink-0" />
                          )}
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-[#111827] truncate">{att.name}</p>
                            <p className="text-xs text-[#9CA3AF]">{(att.size / 1024).toFixed(1)} KB</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </>
          ) : null}
        </section>
      </div>

      {error && (
        <div className="mx-6 mb-4 flex items-start gap-2 p-3 bg-red-50 border border-red-100 rounded-lg shrink-0">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {isProcessing && (
        <div className="border-t border-[#E5E7EB] px-6 py-4 bg-[#FAFAFA] shrink-0">
          <h3 className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide mb-3">Processing</h3>
          <div className="space-y-2 max-w-3xl">
            {processingSteps.map((step, index) => (
              <div key={index} className="flex items-center gap-3 text-sm text-[#374151]">
                <CheckCircle className="w-4 h-4 text-[#059669] shrink-0" />
                {step}
              </div>
            ))}
            {currentStep && !processingSteps.includes(currentStep) && (
              <div className="flex items-center gap-3 text-sm text-[#2563EB] font-medium">
                <Clock className="w-4 h-4 animate-spin shrink-0" />
                {currentStep}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
