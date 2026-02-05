'use client'

import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { 
  FileText, 
  Search, 
  BookOpen, 
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Shield,
  User,
  Calendar,
  MapPin,
  FileCheck,
  Clock,
  TrendingUp,
  ImageIcon,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import ClaimSummaryBar from './ClaimSummaryBar'
import { ClaimData, Document, FieldEvidence, PolicyHit } from '@/types/claims'
import { CONFIDENCE } from '@/lib/confidence'

/** Render flat KPI key-values (e.g. from damage photos, water leakage images) */
function ImageKpiContent({ keyFields }: { keyFields: Record<string, unknown> }) {
  const formatLabel = (key: string) =>
    key.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase()).trim()
  const entries = Object.entries(keyFields).filter(
    ([k, v]) => !String(k).startsWith('_') && v != null && v !== ''
  )
  if (entries.length === 0) return null
  return (
    <div className="grid gap-x-4 gap-y-2 text-xs" style={{ gridTemplateColumns: 'auto 1fr' }}>
      {entries.map(([k, v]) => (
        <React.Fragment key={k}>
          <span className="font-medium text-[#6B7280]">{formatLabel(k)}:</span>
          <span className="text-[#374151] break-words">{String(v)}</span>
        </React.Fragment>
      ))}
    </div>
  )
}

/** Render structured keyFields for any document type (Invoice, Police Report, Repair Estimate, etc.) */
function StructuredDocContent({ doc }: { doc: Document }) {
  const keyFields = doc.keyFields as Record<string, unknown> | undefined
  if (!keyFields || Object.keys(keyFields).length === 0) return null

  const formatLabel = (key: string) =>
    key.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase()).trim()

  const renderValue = (val: unknown): React.ReactNode => {
    if (val == null || val === '') return '—'
    if (typeof val === 'string') return val
    if (typeof val === 'number') return String(val)
    if (Array.isArray(val)) {
      if (val.length === 0) return '—'
      return (
        <ul className="list-disc list-inside space-y-0.5 mt-1">
          {val.map((item, i) => (
            <li key={i} className="text-[#374151]">
              {typeof item === 'object' && item !== null && !Array.isArray(item)
                ? Object.entries(item as Record<string, unknown>).map(([k, v]) => (
                    <span key={k} className="mr-2">
                      <span className="font-medium text-[#6B7280]">{formatLabel(k)}:</span>{' '}
                      {String(v)}
                    </span>
                  ))
                : String(item)}
            </li>
          ))}
        </ul>
      )
    }
    if (typeof val === 'object' && val !== null) {
      return (
        <div className="mt-1 space-y-1 pl-2 border-l-2 border-[#E5E7EB]">
          {Object.entries(val as Record<string, unknown>).map(([k, v]) => (
            <div key={k} className="text-xs">
              <span className="font-medium text-[#6B7280]">{formatLabel(k)}:</span>{' '}
              <span className="text-[#374151]">{renderValue(v)}</span>
            </div>
          ))}
        </div>
      )
    }
    return String(val)
  }

  const renderSection = (sectionKey: string, sectionVal: unknown) => {
    const title = formatLabel(sectionKey)
    if (Array.isArray(sectionVal) && sectionVal.length > 0) {
      const first = sectionVal[0]
      const isTable =
        typeof first === 'object' && first !== null && !Array.isArray(first)
      if (isTable) {
        const keys = Object.keys(first as Record<string, unknown>)
        return (
          <div key={sectionKey}>
            <div className="text-xs font-semibold text-[#6366F1] uppercase tracking-wider mb-2">
              {title}
            </div>
            <div className="bg-[#F9FAFB] rounded-lg overflow-hidden">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-[#EEF2FF]">
                    {keys.map((k) => (
                      <th
                        key={k}
                        className="px-3 py-2 text-left font-semibold text-[#4F46E5]"
                      >
                        {formatLabel(k)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sectionVal.map((row: unknown, i: number) => (
                    <tr key={i} className="border-t border-[#E5E7EB]">
                      {keys.map((k) => (
                        <td key={k} className="px-3 py-2 text-[#374151]">
                          {renderValue((row as Record<string, unknown>)[k])}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      }
    }
    return (
      <div key={sectionKey}>
        <div className="text-xs font-semibold text-[#6366F1] uppercase tracking-wider mb-2">
          {title}
        </div>
        <div className="bg-[#F9FAFB] rounded-lg p-3 text-xs">
          {typeof sectionVal === 'object' && sectionVal !== null && !Array.isArray(sectionVal) ? (
            <div className="grid gap-x-4 gap-y-2" style={{ gridTemplateColumns: 'auto 1fr' }}>
              {Object.entries(sectionVal as Record<string, unknown>).map(([k, v]) => (
                <React.Fragment key={k}>
                  <span className="font-medium text-[#6B7280] min-w-0">
                    {formatLabel(k)}:
                  </span>
                  <span className="text-[#374151] break-words">{renderValue(v)}</span>
                </React.Fragment>
              ))}
            </div>
          ) : (
            <span className="text-[#374151]">{renderValue(sectionVal)}</span>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 max-h-[400px] overflow-y-auto">
      {Object.entries(keyFields).map(([sectionKey, sectionVal]) =>
        renderSection(sectionKey, sectionVal)
      )}
    </div>
  )
}

interface ReviewPageProps {
  claimData: ClaimData
  onNextStage: () => void
  onPreviousStage: () => void
  onLoadClaim?: (claimId: string) => void
}

// Group fields by category
const categorizeFields = (evidence: FieldEvidence[]) => {
  const categories = {
    'Claim Metadata': ['policyId', 'policyNumber', 'claimId'],
    'Contact Details': ['claimantName', 'contactEmail', 'contactPhone'],
    'Incident Details': ['lossDate', 'lossType', 'lossLocation', 'location', 'description', 'deductible', 'estimatedAmount']
  }

  const grouped: Record<string, FieldEvidence[]> = {
    'Claim Metadata': [],
    'Contact Details': [],
    'Incident Details': []
  }

  evidence.forEach((field) => {
    const fieldName = (field.fieldName || field.field || '').toLowerCase()
    let categorized = false

    for (const [category, fields] of Object.entries(categories)) {
      if (fields.some(f => fieldName.includes(f.toLowerCase()))) {
        grouped[category].push(field)
        categorized = true
        break
      }
    }

    if (!categorized) {
      grouped['Incident Details'].push(field)
    }
  })

  return grouped
}

const SUMMARY_PREVIEW_LENGTH = 280

export default function ReviewPage({ claimData, onNextStage, onPreviousStage, onLoadClaim }: ReviewPageProps) {
  const [selectedField, setSelectedField] = useState<string | null>(null)
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null)
  const [expandedDocId, setExpandedDocId] = useState<string | null>(null)
  const [expandedPolicyIds, setExpandedPolicyIds] = useState<Set<string>>(new Set())

  // Handle null claimData
  if (!claimData || !claimData.decisionPack) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto text-center py-12"
      >
        <AlertTriangle className="w-16 h-16 text-warning-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">No Claim Data Available</h2>
        <p className="text-gray-600 mb-6">
          Please process a claim first before reviewing.
        </p>
        <button
          onClick={onPreviousStage}
          className="btn-primary flex items-center space-x-2 mx-auto"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Ingest</span>
        </button>
      </motion.div>
    )
  }

  const { decisionPack, claimId, status, ingestedClaimId } = claimData
  const { 
    evidence = [], 
    documents = [], 
    policyGrounding = [],
    claimDraft
  } = decisionPack || {}

  // Calculate overall confidence
  const overallConfidence = useMemo(() => {
    if (evidence.length === 0) return 0
    const avg = evidence.reduce((sum, e) => sum + e.confidence, 0) / evidence.length
    return Math.round(avg * 100)
  }, [evidence])

  // Group fields by category
  const groupedFields = useMemo(() => categorizeFields(evidence), [evidence])

  // Policy grounding state
  const policyState = useMemo(() => {
    if (policyGrounding.length === 0) {
      return { type: 'warning', message: 'No policy clauses found', subMessage: 'Proceeding without policy grounding' }
    }
    const avgScore = policyGrounding.reduce((sum, p) => sum + (p.score || p.similarity || 0), 0) / policyGrounding.length
    if (avgScore >= 0.7) {
      return { type: 'success', message: `${policyGrounding.length} policy matches found`, subMessage: `${Math.round(avgScore * 100)}% average similarity` }
    }
    return { type: 'neutral', message: `${policyGrounding.length} policy matches`, subMessage: 'Review recommended' }
  }, [policyGrounding])

  const getConfidenceBadge = (confidence: number) => {
    if (confidence >= CONFIDENCE.THRESHOLD_HIGH) {
      return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[#ECFDF5] text-[#047857] border border-[#A7F3D0]">High</span>
    } else if (confidence >= CONFIDENCE.THRESHOLD_MEDIUM) {
      return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[#EFF6FF] text-[#1E40AF] border border-[#DBEAFE]">Medium</span>
    } else {
      return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[#FFFBEB] text-[#B45309] border border-[#FDE68A]">Review</span>
    }
  }

  const getFieldIcon = (fieldName: string) => {
    const iconMap: Record<string, any> = {
      policyId: Shield,
      policyNumber: Shield,
      claimantName: User,
      contactEmail: FileText,
      contactPhone: FileText,
      lossDate: Calendar,
      lossType: FileCheck,
      lossLocation: MapPin,
      location: MapPin,
      description: FileText,
      deductible: TrendingUp
    }
    
    const field = (fieldName || '').toLowerCase()
    for (const [key, Icon] of Object.entries(iconMap)) {
      if (field.includes(key.toLowerCase())) {
        return Icon
      }
    }
    return FileText
  }

  const getStatusColor = (status?: string) => {
    if (!status) return 'bg-[#E5E7EB] text-[#374151]'
    const s = status.toLowerCase()
    if (s.includes('complete') || s.includes('approved')) return 'bg-[#ECFDF5] text-[#047857]'
    if (s.includes('pending') || s.includes('processing')) return 'bg-[#EFF6FF] text-[#1E40AF]'
    if (s.includes('reject') || s.includes('error')) return 'bg-[#FEF2F2] text-[#B91C1C]'
    return 'bg-[#FFFBEB] text-[#B45309]'
  }

  return (
    <div className="max-w-[1920px] mx-auto">
      <ClaimSummaryBar
        claimData={claimData}
        onBack={onPreviousStage}
        onContinue={onNextStage}
        continueLabel="Continue"
        showClaimDropdown
        onClaimSelect={onLoadClaim}
      />

      {/* Main Content - Three Column Layout */}
      <div className="px-8 py-8">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Column - Source Documents (Compact) */}
          <div className="col-span-12 lg:col-span-3">
            <motion.div 
              className="card p-5 h-fit sticky top-[88px]"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="flex items-center space-x-2 mb-4">
                <FileText className="w-4 h-4 text-[#6366F1]" />
                <h2 className="text-sm font-bold text-[#111827] uppercase tracking-wider">Source Documents</h2>
                <span className="ml-auto text-xs font-medium text-[#6B7280] bg-[#F3F4F6] px-2 py-0.5 rounded">
                  {documents.length}
                </span>
              </div>
              
              <div className="space-y-2">
                {documents.map((doc) => {
                  const isSelected = selectedDoc === doc.id
                  const isImageDoc =
                    doc.type === 'DamagePhoto' || doc.mimeType?.startsWith('image/')
                  const imageUrl =
                    isImageDoc &&
                    ingestedClaimId &&
                    `/api/ingested-claims/${ingestedClaimId}/attachments?name=${encodeURIComponent(doc.name)}`

                  return (
                    <div
                      key={doc.id}
                      className={`rounded-lg border cursor-pointer transition-all overflow-hidden ${
                        isSelected
                          ? 'border-[#6366F1] bg-[#EEF2FF] shadow-sm'
                          : 'border-[#E5E7EB] hover:border-[#CBD5E1] hover:bg-[#F9FAFB] bg-white'
                      }`}
                      onClick={() => setSelectedDoc(isSelected ? null : doc.id)}
                    >
                      <div className="p-3">
                        <div className="flex items-start justify-between mb-2 gap-2">
                          <div className="flex items-center space-x-2 flex-1 min-w-0 overflow-x-auto" style={{ scrollbarWidth: 'thin' }}>
                            {isImageDoc ? (
                              <ImageIcon className="w-4 h-4 text-[#6366F1] flex-shrink-0" />
                            ) : (
                              <FileText className="w-4 h-4 text-[#6B7280] flex-shrink-0" />
                            )}
                            <span className="text-xs font-semibold text-[#111827] whitespace-nowrap">
                              {doc.name}
                            </span>
                          </div>
                          <span className="text-xs font-medium text-[#6B7280] bg-[#F3F4F6] px-1.5 py-0.5 rounded flex-shrink-0">
                            {doc.type}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-1">
                            <div
                              className={`w-1.5 h-1.5 rounded-full ${
                                doc.confidence >= CONFIDENCE.THRESHOLD_HIGH
                                  ? 'bg-[#10B981]'
                                  : doc.confidence >= CONFIDENCE.THRESHOLD_MEDIUM
                                    ? 'bg-[#3B82F6]'
                                    : 'bg-[#F59E0B]'
                              }`}
                            />
                            <span className="text-xs text-[#6B7280]">
                              {Math.round(doc.confidence * 100)}%
                            </span>
                          </div>
                        </div>
                      </div>
                      {/* Image preview + detailed summary + extracted KPIs for image documents */}
                      {isImageDoc && isSelected && (
                        <div className="border-t border-[#E5E7EB] bg-white/80 p-3 space-y-4">
                          {imageUrl && (
                            <div className="rounded-lg overflow-hidden bg-[#F3F4F6] aspect-video flex items-center justify-center">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={imageUrl}
                                alt={doc.name}
                                className="max-w-full max-h-40 object-contain"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none'
                                }}
                              />
                            </div>
                          )}
                          {/* Detailed Summary - Show prominently if available */}
                          {doc.content && typeof doc.content === 'string' && doc.content.trim() ? (
                            <div className="bg-[#F0F9FF] border border-[#BAE6FD] rounded-lg p-4">
                              <div className="text-xs font-semibold text-[#0369A1] uppercase tracking-wider mb-3 flex items-center space-x-2">
                                <FileText className="w-4 h-4" />
                                <span>Detailed Image Analysis Summary</span>
                              </div>
                              <div className="text-sm text-[#1E3A5F] leading-relaxed whitespace-pre-wrap overflow-x-auto" style={{ scrollbarWidth: 'thin' }}>
                                {doc.content}
                              </div>
                            </div>
                          ) : null}
                          {/* Extracted KPIs - Show if available */}
                          {doc.keyFields &&
                          Object.keys(doc.keyFields as object).length > 0 ? (
                            <div>
                              <div className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-2">
                                Extracted KPIs
                              </div>
                              <div className="overflow-x-auto" style={{ scrollbarWidth: 'thin' }}>
                                <ImageKpiContent keyFields={doc.keyFields as Record<string, unknown>} />
                              </div>
                            </div>
                          ) : null}
                        </div>
                      )}
                      {/* Text document content when selected */}
                      {!isImageDoc && isSelected && (
                        <div className="border-t border-[#E5E7EB] bg-white/80 p-3">
                          {doc.keyFields &&
                          Object.keys(doc.keyFields as object).length > 0 ? (
                            <>
                              <div className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-2">
                                Structured Content
                              </div>
                              <div className="overflow-x-auto" style={{ scrollbarWidth: 'thin' }}>
                                <StructuredDocContent doc={doc} />
                              </div>
                            </>
                          ) : doc.content && typeof doc.content === 'string' ? (
                            <>
                              <div className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-1">
                                Content
                              </div>
                              <div className="overflow-x-auto" style={{ scrollbarWidth: 'thin' }}>
                                <p className="text-xs text-[#374151] leading-relaxed whitespace-pre-wrap min-w-max">
                                  {expandedDocId === doc.id
                                    ? doc.content
                                    : doc.content.length > SUMMARY_PREVIEW_LENGTH
                                      ? `${doc.content.slice(0, SUMMARY_PREVIEW_LENGTH).trim()}...`
                                      : doc.content}
                                </p>
                              </div>
                              {doc.content.length > SUMMARY_PREVIEW_LENGTH && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setExpandedDocId(expandedDocId === doc.id ? null : doc.id)
                                  }}
                                  className="mt-1 text-xs font-medium text-[#6366F1] hover:text-[#4F46E5] hover:underline"
                                >
                                  {expandedDocId === doc.id ? 'View less' : 'View more'}
                                </button>
                              )}
                            </>
                          ) : (
                            <p className="text-xs text-[#6B7280] italic">No structured content extracted</p>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </motion.div>
          </div>

          {/* Center Column - Extracted Fields (Dominant) */}
          <div className="col-span-12 lg:col-span-6">
            <motion.div 
              className="card p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center space-x-2 mb-6">
                <Search className="w-5 h-5 text-[#6366F1]" />
                <h2 className="text-base font-bold text-[#111827] uppercase tracking-wider">Extracted Fields</h2>
                <span className="ml-auto text-xs font-medium text-[#6B7280] bg-[#F3F4F6] px-2 py-0.5 rounded">
                  {evidence.length} fields
                </span>
              </div>

              {/* Grouped Fields by Category */}
              <div className="space-y-6">
                {Object.entries(groupedFields).map(([category, fields]) => {
                  if (fields.length === 0) return null
                  
                  return (
                    <div key={category} className="border-b border-[#E5E7EB] pb-6 last:border-0 last:pb-0">
                      <h3 className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-4">
                        {category}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {fields.map((field) => {
                          const fieldName = field.fieldName || field.field || ''
                          const fieldKey = (fieldName || (field.field || '')).toLowerCase().replace(/\s/g, '')
                          const isLongField = ['description', 'losslocation', 'location', 'details'].includes(fieldKey)
                          const Icon = getFieldIcon(fieldName)
                          const isSelected = selectedField === fieldName

                          return (
                            <div
                              key={fieldName}
                              className={`p-4 rounded-lg border transition-all cursor-pointer ${
                                isLongField ? 'md:col-span-2' : ''
                              } ${
                                isSelected
                                  ? 'border-[#6366F1] bg-[#EEF2FF] shadow-sm'
                                  : 'border-[#E5E7EB] hover:border-[#CBD5E1] hover:bg-[#F9FAFB] bg-white'
                              }`}
                              onClick={() => setSelectedField(isSelected ? null : fieldName)}
                            >
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center space-x-2 flex-1 min-w-0">
                                  <Icon className="w-4 h-4 text-[#6B7280] flex-shrink-0" />
                                  <span className="text-sm font-medium text-[#111827] capitalize truncate">
                                    {fieldName.replace(/([A-Z])/g, ' $1').trim()}
                                  </span>
                                </div>
                                {getConfidenceBadge(field.confidence)}
                              </div>
                              
                              <div
                                className={`text-sm text-[#374151] font-medium mb-1 break-words ${
                                  isLongField ? 'line-clamp-6' : 'truncate'
                                }`}
                                title={String(field.value)}
                              >
                                {String(field.value)}
                              </div>
                              
                              {isSelected && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  className="mt-3 pt-3 border-t border-[#E5E7EB]"
                                >
                                  <div className="text-xs text-[#6B7280] space-y-1">
                                    <div>
                                      <span className="font-medium">Source:</span>{' '}
                                      {typeof field.sourceLocator === 'string' 
                                        ? field.sourceLocator 
                                        : field.sourceLocator.docId}
                                    </div>
                                    <div>
                                      <span className="font-medium">Rationale:</span> {field.rationale}
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>
            </motion.div>
          </div>

          {/* Right Column - Policy Grounding (Narrow) */}
          <div className="col-span-12 lg:col-span-3">
            <motion.div 
              className="card p-5 h-fit sticky top-[88px]"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="flex items-center space-x-2 mb-4">
                <BookOpen className="w-4 h-4 text-[#6366F1]" />
                <h2 className="text-sm font-bold text-[#111827] uppercase tracking-wider">Policy Grounding</h2>
              </div>

              {/* State-based Policy Card */}
              <div className={`p-4 rounded-lg border-2 ${
                policyState.type === 'success' 
                  ? 'border-[#10B981] bg-[#ECFDF5]' 
                  : policyState.type === 'warning'
                  ? 'border-[#F59E0B] bg-[#FFFBEB]'
                  : 'border-[#E5E7EB] bg-[#F9FAFB]'
              }`}>
                <div className="flex items-start space-x-3">
                  {policyState.type === 'success' ? (
                    <CheckCircle className="w-5 h-5 text-[#10B981] flex-shrink-0 mt-0.5" />
                  ) : policyState.type === 'warning' ? (
                    <AlertTriangle className="w-5 h-5 text-[#F59E0B] flex-shrink-0 mt-0.5" />
                  ) : (
                    <Shield className="w-5 h-5 text-[#6B7280] flex-shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm font-semibold mb-1 ${
                      policyState.type === 'success' 
                        ? 'text-[#047857]' 
                        : policyState.type === 'warning'
                        ? 'text-[#B45309]'
                        : 'text-[#374151]'
                    }`}>
                      {policyState.message}
                    </div>
                    <div className={`text-xs ${
                      policyState.type === 'success' 
                        ? 'text-[#065F46]' 
                        : policyState.type === 'warning'
                        ? 'text-[#92400E]'
                        : 'text-[#6B7280]'
                    }`}>
                      {policyState.subMessage}
                    </div>
                  </div>
                </div>
              </div>

              {/* Policy Matches List – expandable */}
              {policyGrounding.length > 0 && (
                <div className="mt-4 space-y-2">
                  <div className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-2">
                    Matches ({policyGrounding.length})
                  </div>
                  {policyGrounding.map((policy) => {
                    const isExpanded = expandedPolicyIds.has(policy.clauseId)
                    const fullContent = policy.content || policy.snippet || ''
                    const toggle = () => {
                      setExpandedPolicyIds((prev) => {
                        const next = new Set(prev)
                        if (next.has(policy.clauseId)) next.delete(policy.clauseId)
                        else next.add(policy.clauseId)
                        return next
                      })
                    }
                    return (
                      <div
                        key={policy.clauseId}
                        className="rounded-lg border border-[#E5E7EB] bg-white hover:border-[#CBD5E1] overflow-hidden"
                      >
                        <button
                          type="button"
                          onClick={toggle}
                          className="w-full p-3 text-left hover:bg-[#F9FAFB] transition-colors focus:outline-none focus:ring-2 focus:ring-[#6366F1]/20 focus:ring-inset"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-semibold text-[#111827]">{policy.clauseId}</span>
                                <span className="text-xs font-medium text-[#10B981] bg-[#ECFDF5] px-1.5 py-0.5 rounded flex-shrink-0">
                                  {Math.round((policy.score || policy.similarity || 0) * 100)}%
                                </span>
                                {policy.sourceRef && (
                                  <span className="text-[10px] text-[#9CA3AF]">{policy.sourceRef}</span>
                                )}
                              </div>
                              <div className="text-xs text-[#374151] font-medium mb-0.5">
                                {policy.title}
                              </div>
                              {policy.section && (
                                <div className="text-[11px] text-[#6366F1] mb-1">
                                  {policy.section}
                                </div>
                              )}
                              <div className={`text-xs text-[#6B7280] ${!isExpanded ? 'line-clamp-2' : 'line-clamp-1'}`}>
                                {policy.snippet || fullContent.slice(0, 140) + (fullContent.length > 140 ? '...' : '')}
                              </div>
                              <span className="text-[10px] text-[#6366F1] font-medium mt-1 block">
                                {isExpanded ? 'Click to collapse' : 'Click to read full clause'}
                              </span>
                            </div>
                            <span className="flex-shrink-0 text-[#9CA3AF]" aria-hidden>
                              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </span>
                          </div>
                        </button>
                        {isExpanded && fullContent && (
                          <div className="px-3 pb-3 pt-0 border-t border-[#F3F4F6] bg-[#FAFAFA]">
                            <div className="text-xs text-[#4B5563] leading-relaxed whitespace-pre-wrap">
                              {fullContent}
                            </div>
                            <p className="text-[10px] text-[#9CA3AF] mt-2 italic">{policy.rationale}</p>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
