'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  FileText, 
  Search, 
  BookOpen, 
  Eye, 
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  ArrowLeft
} from 'lucide-react'
import { ClaimData, FieldEvidence, PolicyHit } from '@/types/claims'

interface ReviewPageProps {
  claimData: ClaimData
  onNextStage: () => void
  onPreviousStage: () => void
}

export default function ReviewPage({ claimData, onNextStage, onPreviousStage }: ReviewPageProps) {
  const [selectedField, setSelectedField] = useState<string | null>(null)
  const [selectedPolicy, setSelectedPolicy] = useState<string | null>(null)

  const { decisionPack } = claimData
  const { 
    evidence = [], 
    documents = [], 
    policyGrounding = [] 
  } = decisionPack || {}

  const getConfidenceBadge = (confidence: number) => {
    if (confidence >= 0.8) {
      return <span className="status-badge status-completed">High Confidence</span>
    } else if (confidence >= 0.6) {
      return <span className="status-badge status-processing">Medium Confidence</span>
    } else {
      return <span className="status-badge status-needs-review">Needs Review</span>
    }
  }

  const getFieldIcon = (fieldName: string) => {
    const fieldIcons: Record<string, string> = {
      policyId: '🔢',
      claimantName: '👤',
      contactEmail: '📧',
      lossDate: '📅',
      lossType: '🚗',
      description: '📝',
      location: '📍',
      deductible: '💰'
    }
    return fieldIcons[fieldName] || '📋'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Review & Explainability</h1>
        <p className="text-lg text-gray-600">
          Review extracted claim fields, evidence sources, and policy clause matches
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Source Pane */}
        <motion.div 
          className="card p-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center space-x-2 mb-4">
            <FileText className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold">Source Documents</h2>
          </div>
          
          <div className="space-y-4">
            {documents.map((doc) => (
              <div key={doc.id} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-sm font-medium text-gray-900">{doc.name}</span>
                  <span className="status-badge status-completed">{doc.type}</span>
                </div>
                <p className="text-xs text-gray-600 mb-2">
                  Confidence: {(doc.confidence * 100).toFixed(0)}%
                </p>
                {Object.entries(doc.keyFields || {}).map(([key, value]) => (
                  <div key={key} className="text-xs text-gray-700">
                    <span className="font-medium">{key}:</span> {String(value)}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Extraction Pane */}
        <motion.div 
          className="card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center space-x-2 mb-4">
            <Search className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold">Extracted Fields</h2>
          </div>
          
          <div className="space-y-3">
            {evidence.map((field) => (
              <div 
                key={field.fieldName}
                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                  selectedField === field.fieldName 
                    ? 'border-blue-600 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedField(selectedField === (field.fieldName || field.field) ? null : (field.fieldName || field.field))}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{getFieldIcon(field.fieldName || field.field)}</span>
                    <span className="font-medium text-gray-900 capitalize">
                      {(field.fieldName || field.field)?.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                  </div>
                  {getConfidenceBadge(field.confidence)}
                </div>
                
                <div className="text-sm text-gray-700 mb-2">
                  <span className="font-medium">Value:</span> {field.value}
                </div>
                
                <div className="text-xs text-gray-600">
                  <span className="font-medium">Rationale:</span> {field.rationale}
                </div>
                
                {selectedField === field.fieldName && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-3 p-2 bg-blue-50 rounded border-l-4 border-blue-400"
                  >
                    <p className="text-xs text-blue-800">
                      <span className="font-medium">Source:</span> {
                        typeof field.sourceLocator === 'string' 
                          ? field.sourceLocator 
                          : field.sourceLocator.docId
                      }
                      {typeof field.sourceLocator === 'object' && field.sourceLocator.textOffsets && (
                        <span> (offsets: {field.sourceLocator.textOffsets.join('-')})</span>
                      )}
                    </p>
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Policy Grounding Pane */}
        <motion.div 
          className="card p-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center space-x-2 mb-4">
            <BookOpen className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold">Policy Grounding</h2>
          </div>
          
          {policyGrounding.length > 0 ? (
            <div className="space-y-4">
              {policyGrounding.map((policy) => (
                <div 
                  key={policy.clauseId}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedPolicy === policy.clauseId 
                      ? 'border-blue-600 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedPolicy(selectedPolicy === policy.clauseId ? null : policy.clauseId)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">{policy.clauseId}</span>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                      {((policy.score || policy.similarity || 0) * 100).toFixed(0)}% match
                    </span>
                  </div>
                  
                  <h4 className="font-medium text-gray-900 mb-2">{policy.title}</h4>
                  
                  <p className="text-sm text-gray-700 mb-2 line-clamp-3">
                    {policy.snippet}
                  </p>
                  
                  <div className="text-xs text-gray-600 mb-2">
                    <span className="font-medium">Source:</span> {policy.sourceRef}
                  </div>
                  
                  <div className="text-xs text-gray-600">
                    <span className="font-medium">Why:</span> {policy.rationale}
                  </div>
                  
                  {selectedPolicy === policy.clauseId && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-3 p-2 bg-green-50 rounded border-l-4 border-green-400"
                    >
                      <p className="text-xs text-green-800">
                        <span className="font-medium">Full Context:</span> This clause was retrieved using vector similarity search over the policy corpus, matching keywords and context from the claim description.
                      </p>
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p>No policy clauses found</p>
              <p className="text-sm">The system will proceed without policy grounding</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Summary Stats */}
      <motion.div 
        className="mt-8 card p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="grid md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600">{evidence.length}</div>
            <div className="text-sm text-gray-600">Total Fields</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-success">
              {evidence.filter(e => e.confidence >= 0.8).length}
            </div>
            <div className="text-sm text-gray-600">High Confidence</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-warning">
              {evidence.filter(e => e.confidence < 0.8).length}
            </div>
            <div className="text-sm text-gray-600">Needs Review</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600">{policyGrounding.length}</div>
            <div className="text-sm text-gray-600">Policy Matches</div>
          </div>
        </div>
      </motion.div>

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <button
          onClick={onPreviousStage}
          className="btn-secondary flex items-center space-x-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Ingest</span>
        </button>
        
        <button
          onClick={onNextStage}
          className="btn-primary flex items-center space-x-2"
        >
          <span>Continue to Decision</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  )
} 