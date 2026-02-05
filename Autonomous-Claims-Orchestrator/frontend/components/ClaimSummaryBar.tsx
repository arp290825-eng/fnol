'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, ArrowRight, ChevronDown, Download } from 'lucide-react'
import { ClaimData } from '@/types/claims'
import { CONFIDENCE } from '@/lib/confidence'
import type { ProcessedClaimSummary } from '@/types/claims'

interface ClaimSummaryBarProps {
  claimData: ClaimData
  onBack?: () => void
  onContinue?: () => void
  continueLabel?: string
  showActions?: boolean
  showClaimDropdown?: boolean
  onClaimSelect?: (claimId: string) => void
}

export default function ClaimSummaryBar({
  claimData,
  onBack,
  onContinue,
  continueLabel = 'Continue',
  showActions = true,
  showClaimDropdown = false,
  onClaimSelect,
}: ClaimSummaryBarProps) {
  const [processedClaims, setProcessedClaims] = useState<ProcessedClaimSummary[]>([])
  const [dropdownOpen, setDropdownOpen] = useState(false)

  useEffect(() => {
    if (showClaimDropdown) {
      fetch('/api/claims')
        .then((r) => r.json())
        .then((data) => setProcessedClaims(Array.isArray(data) ? data : []))
        .catch(() => setProcessedClaims([]))
    }
  }, [showClaimDropdown])

  const { decisionPack, claimId, status } = claimData
  const claimDraft = decisionPack?.claimDraft
  const evidence = decisionPack?.evidence ?? []
  const displayClaimId = claimId || claimDraft?.id || 'N/A'
  const overallConfidence =
    evidence.length > 0
      ? Math.round(
          (evidence.reduce((s, e) => s + e.confidence, 0) / evidence.length) * 100
        )
      : 0

  const getStatusColor = (s?: string) => {
    if (!s) return 'bg-[#E5E7EB] text-[#374151]'
    const lower = s.toLowerCase()
    if (lower.includes('complete') || lower.includes('approved')) return 'bg-[#ECFDF5] text-[#047857]'
    if (lower.includes('pending') || lower.includes('processing')) return 'bg-[#EFF6FF] text-[#1E40AF]'
    if (lower.includes('reject') || lower.includes('error')) return 'bg-[#FEF2F2] text-[#B91C1C]'
    return 'bg-[#FFFBEB] text-[#B45309]'
  }

  return (
    <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[#E5E7EB] shadow-sm px-8 py-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <div className="relative flex items-end gap-3">
            <div>
              <div className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-1">
                Claim ID
              </div>
              {showClaimDropdown && onClaimSelect && processedClaims.length > 0 ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 min-w-[180px] px-3 py-2 text-left text-lg font-bold text-[#111827] bg-white border border-[#E5E7EB] rounded-lg hover:border-[#6366F1] focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:ring-offset-1"
                >
                  <span className="truncate">{displayClaimId}</span>
                  <ChevronDown className={`w-4 h-4 flex-shrink-0 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {dropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} aria-hidden="true" />
                    <div className="absolute left-0 top-full mt-1 z-50 w-full max-w-md max-h-64 overflow-auto bg-white border border-[#E5E7EB] rounded-lg shadow-lg py-1">
                      {processedClaims.map((c) => (
                        <button
                          key={c.claimId}
                          type="button"
                          onClick={() => {
                            onClaimSelect(c.claimId)
                            setDropdownOpen(false)
                          }}
                          className={`w-full px-4 py-2.5 text-left text-sm hover:bg-[#F3F4F6] ${
                            c.claimId === displayClaimId ? 'bg-[#EEF2FF] text-[#4F46E5] font-medium' : 'text-[#374151]'
                          }`}
                        >
                          <div className="font-medium truncate">{c.claimId}</div>
                          <div className="text-xs text-[#6B7280] truncate">
                            {[c.policyNumber, c.claimantName].filter(Boolean).join(' • ') || new Date(c.createdAt).toLocaleDateString()}
                          </div>
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="text-lg font-bold text-[#111827]">{displayClaimId}</div>
            )}
            </div>
            {showClaimDropdown && processedClaims.length > 0 && (
              <a
                href="/api/claims/export"
                download="claims-history.csv"
                className="pb-0.5 inline-flex items-center gap-1 text-xs text-[#6366F1] hover:text-[#4F46E5] hover:underline"
                title="Download claims history CSV"
              >
                <Download className="w-3.5 h-3.5" />
                Export CSV
              </a>
            )}
          </div>
          <div className="h-12 w-px bg-[#E5E7EB]" />
          <div>
            <div className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-1">
              Overall Confidence
            </div>
            <div className="flex items-center space-x-2">
              <div className="text-lg font-bold text-[#111827]">{overallConfidence}%</div>
              <div
                className={`w-2 h-2 rounded-full ${
                  overallConfidence >= CONFIDENCE.THRESHOLD_HIGH * 100
                    ? 'bg-[#10B981]'
                    : overallConfidence >= CONFIDENCE.THRESHOLD_MEDIUM * 100
                      ? 'bg-[#3B82F6]'
                      : 'bg-[#F59E0B]'
                }`}
              />
            </div>
          </div>
          <div className="h-12 w-px bg-[#E5E7EB]" />
          <div>
            <div className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-1">
              Status
            </div>
            <div
              className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-medium ${getStatusColor(status)}`}
            >
              {status || 'Processing'}
            </div>
          </div>
        </div>
        {showActions && (onBack || onContinue) && (
          <div className="flex items-center space-x-3">
            {onBack && (
              <button onClick={onBack} className="btn-secondary flex items-center space-x-2">
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            )}
            {onContinue && (
              <button onClick={onContinue} className="btn-primary flex items-center space-x-2">
                <span>{continueLabel}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
