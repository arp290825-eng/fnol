'use client'

import { useState, useMemo } from 'react'
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
  TrendingUp
} from 'lucide-react'
import { ClaimData, FieldEvidence, PolicyHit } from '@/types/claims'

interface ReviewPageProps {
  claimData: ClaimData
  onNextStage: () => void
  onPreviousStage: () => void
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

export default function ReviewPage({ claimData, onNextStage, onPreviousStage }: ReviewPageProps) {
  const [selectedField, setSelectedField] = useState<string | null>(null)
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null)

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

  const { decisionPack, claimId, status } = claimData
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
    if (confidence >= 0.8) {
      return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[#ECFDF5] text-[#047857] border border-[#A7F3D0]">High</span>
    } else if (confidence >= 0.6) {
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
      {/* Sticky Claim Summary Header */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[#E5E7EB] shadow-sm">
        <div className="px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div>
                <div className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-1">Claim ID</div>
                <div className="text-lg font-bold text-[#111827]">
                  {claimId || claimDraft?.id || 'N/A'}
                </div>
              </div>
              <div className="h-12 w-px bg-[#E5E7EB]"></div>
              <div>
                <div className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-1">Overall Confidence</div>
                <div className="flex items-center space-x-2">
                  <div className="text-lg font-bold text-[#111827]">{overallConfidence}%</div>
                  <div className={`w-2 h-2 rounded-full ${
                    overallConfidence >= 80 ? 'bg-[#10B981]' : overallConfidence >= 60 ? 'bg-[#3B82F6]' : 'bg-[#F59E0B]'
                  }`}></div>
                </div>
              </div>
              <div className="h-12 w-px bg-[#E5E7EB]"></div>
              <div>
                <div className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-1">Status</div>
                <div className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-medium ${getStatusColor(status)}`}>
                  {status || 'Processing'}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={onPreviousStage}
                className="btn-secondary flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                onClick={onNextStage}
                className="btn-primary flex items-center space-x-2"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

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
                  return (
                    <div 
                      key={doc.id} 
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-[#6366F1] bg-[#EEF2FF] shadow-sm'
                          : 'border-[#E5E7EB] hover:border-[#CBD5E1] hover:bg-[#F9FAFB] bg-white'
                      }`}
                      onClick={() => setSelectedDoc(isSelected ? null : doc.id)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2 flex-1 min-w-0">
                          <FileText className="w-4 h-4 text-[#6B7280] flex-shrink-0" />
                          <span className="text-xs font-semibold text-[#111827] truncate">{doc.name}</span>
                        </div>
                        <span className="text-xs font-medium text-[#6B7280] bg-[#F3F4F6] px-1.5 py-0.5 rounded ml-2 flex-shrink-0">
                          {doc.type}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1">
                          <div className={`w-1.5 h-1.5 rounded-full ${
                            doc.confidence >= 0.8 ? 'bg-[#10B981]' : doc.confidence >= 0.6 ? 'bg-[#3B82F6]' : 'bg-[#F59E0B]'
                          }`}></div>
                          <span className="text-xs text-[#6B7280]">
                            {Math.round(doc.confidence * 100)}%
                          </span>
                        </div>
                      </div>
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
                          const Icon = getFieldIcon(fieldName)
                          const isSelected = selectedField === fieldName
                          
                          return (
                            <div
                              key={fieldName}
                              className={`p-4 rounded-lg border transition-all cursor-pointer ${
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
                              
                              <div className="text-sm text-[#374151] font-medium mb-1 truncate" title={String(field.value)}>
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

              {/* Policy Matches List (if any) */}
              {policyGrounding.length > 0 && (
                <div className="mt-4 space-y-2">
                  <div className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-2">
                    Matches ({policyGrounding.length})
                  </div>
                  {policyGrounding.slice(0, 3).map((policy) => (
                    <div 
                      key={policy.clauseId}
                      className="p-3 rounded-lg border border-[#E5E7EB] bg-white hover:border-[#CBD5E1] hover:bg-[#F9FAFB] transition-all"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold text-[#111827] truncate">{policy.clauseId}</span>
                        <span className="text-xs font-medium text-[#10B981] bg-[#ECFDF5] px-1.5 py-0.5 rounded flex-shrink-0 ml-2">
                          {Math.round((policy.score || policy.similarity || 0) * 100)}%
                        </span>
                      </div>
                      <div className="text-xs text-[#374151] font-medium mb-1 line-clamp-1">
                        {policy.title}
                      </div>
                      <div className="text-xs text-[#6B7280] line-clamp-2">
                        {policy.snippet}
                      </div>
                    </div>
                  ))}
                  {policyGrounding.length > 3 && (
                    <div className="text-xs text-[#6366F1] font-medium text-center pt-2">
                      +{policyGrounding.length - 3} more matches
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
