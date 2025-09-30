'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  CheckCircle, 
  FileText, 
  Send, 
  Download, 
  Clock,
  ArrowRight,
  ArrowLeft,
  AlertTriangle,
  Check,
  X
} from 'lucide-react'
import { ClaimData } from '@/types/claims'

interface DecisionPageProps {
  claimData: ClaimData
  onNextStage: () => void
  onPreviousStage: () => void
}

export default function DecisionPage({ claimData, onNextStage, onPreviousStage }: DecisionPageProps) {
  const [isCreatingDraft, setIsCreatingDraft] = useState(false)
  const [isSendingAck, setIsSendingAck] = useState(false)
  const [draftCreated, setDraftCreated] = useState(false)
  const [ackSent, setAckSent] = useState(false)
  const [showAcknowledgment, setShowAcknowledgment] = useState(false)

  const { decisionPack, processingTime } = claimData
  const { 
    claimDraft, 
    evidence = [], 
    documents = [], 
    policyGrounding = [], 
    audit = [] 
  } = decisionPack || {}

  const handleCreateDraft = async () => {
    setIsCreatingDraft(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setDraftCreated(true)
    setIsCreatingDraft(false)
  }

  const handleSendAcknowledgment = async () => {
    setIsSendingAck(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setAckSent(true)
    setIsSendingAck(false)
    setShowAcknowledgment(true)
  }

  const generateAcknowledgment = () => {
    const { claimantName, lossDate, lossType, policyId } = claimDraft || {}
    const policyInfo = policyGrounding.length > 0 
      ? `Based on your policy coverage, this appears to be a covered loss.` 
      : `We're reviewing your policy to determine coverage.`
    
    return `Dear ${claimantName},

Thank you for reporting your claim. We have received your First Notice of Loss for the incident that occurred on ${lossDate}.

${policyInfo}

Your claim has been assigned claim number: CLM-${Date.now().toString().slice(-8)}

What happens next:
1. Our team will review the submitted documents and information
2. We'll contact you within 24 hours to discuss next steps
3. If you have any questions, please call our claims hotline

We appreciate your patience and will work to resolve your claim as quickly as possible.

Best regards,
Claims Team`
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Decision & Actions</h1>
        <p className="text-lg text-gray-600">
          Review the assembled claim draft and take action
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Decision Pack */}
        <motion.div 
          className="card p-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center space-x-2 mb-4">
            <CheckCircle className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold">Decision Pack</h2>
          </div>
          
          <div className="space-y-4">
            {/* Claim Summary */}
            <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
              <h3 className="font-medium text-blue-900 mb-2">Claim Summary</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div><span className="font-medium">Policy:</span> {claimDraft.policyId}</div>
                <div><span className="font-medium">Claimant:</span> {claimDraft.claimantName}</div>
                <div><span className="font-medium">Loss Date:</span> {claimDraft.lossDate}</div>
                <div><span className="font-medium">Type:</span> {claimDraft.lossType}</div>
                <div><span className="font-medium">Location:</span> {claimDraft.location}</div>
                {claimDraft.deductible && (
                  <div><span className="font-medium">Deductible:</span> ${claimDraft.deductible}</div>
                )}
              </div>
            </div>

            {/* Evidence Summary */}
            <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-400">
              <h3 className="font-medium text-green-900 mb-2">Evidence Summary</h3>
              <div className="text-sm text-green-800">
                <div className="mb-2">
                  <span className="font-medium">Documents:</span> {documents.length} attached
                </div>
                <div className="mb-2">
                  <span className="font-medium">Fields Extracted:</span> {evidence.length} total
                </div>
                <div>
                  <span className="font-medium">High Confidence:</span> {evidence.filter(e => e.confidence >= 0.8).length} fields
                </div>
              </div>
            </div>

            {/* Policy Grounding */}
            {policyGrounding.length > 0 && (
              <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-400">
                <h3 className="font-medium text-purple-900 mb-2">Policy Grounding</h3>
                <div className="text-sm text-purple-800">
                  <div className="mb-2">
                    <span className="font-medium">Clauses Found:</span> {policyGrounding.length}
                  </div>
                  <div>
                    <span className="font-medium">Coverage:</span> {claimDraft.coverageFound ? 'Confirmed' : 'Under Review'}
                  </div>
                </div>
              </div>
            )}

            {/* Processing Metrics */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Processing Metrics</h3>
              <div className="text-sm text-gray-700">
                <div className="mb-1">
                  <span className="font-medium">Total Time:</span> {((processingTime || 2000) / 1000).toFixed(1)}s
                </div>
                <div className="mb-1">
                  <span className="font-medium">Auto-population:</span> {(((claimData.autoPopulatedFields || 8) / (claimData.totalFields || 10)) * 100).toFixed(0)}%
                </div>
                <div>
                  <span className="font-medium">RAG Hit Rate:</span> {((claimData.ragHitRate || 1) * 100).toFixed(0)}%
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div 
          className="card p-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center space-x-2 mb-4">
            <FileText className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold">Actions</h2>
          </div>
          
          <div className="space-y-4">
            {/* Create Draft in Core */}
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Create Draft in Core System</h3>
              <p className="text-sm text-gray-600 mb-3">
                Send the assembled claim data to the core claims management system
              </p>
              
              {!draftCreated ? (
                <button
                  onClick={handleCreateDraft}
                  disabled={isCreatingDraft}
                  className="btn-primary w-full disabled:opacity-50"
                >
                  {isCreatingDraft ? (
                    <div className="flex items-center justify-center space-x-2">
                      <Clock className="w-4 h-4 animate-spin" />
                      <span>Creating Draft...</span>
                    </div>
                  ) : (
                    <span>Create Draft in Core</span>
                  )}
                </button>
              ) : (
                <div className="flex items-center space-x-2 text-success-600">
                  <Check className="w-5 h-5" />
                  <span className="font-medium">Draft Created Successfully</span>
                </div>
              )}
            </div>

            {/* Send Acknowledgment */}
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Send Customer Acknowledgment</h3>
              <p className="text-sm text-gray-600 mb-3">
                Generate and send a personalized acknowledgment email to the claimant
              </p>
              
              {!ackSent ? (
                <button
                  onClick={handleSendAcknowledgment}
                  disabled={isSendingAck || !draftCreated}
                  className="btn-secondary w-full disabled:opacity-50"
                >
                  {isSendingAck ? (
                    <div className="flex items-center justify-center space-x-2">
                      <Clock className="w-4 h-4 animate-spin" />
                      <span>Sending...</span>
                    </div>
                  ) : (
                    <span>Send Acknowledgment</span>
                  )}
                </button>
              ) : (
                <div className="flex items-center space-x-2 text-success-600">
                  <Check className="w-5 h-5" />
                  <span className="font-medium">Acknowledgment Sent</span>
                </div>
              )}
            </div>

            {/* Download Decision Pack */}
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Download Decision Pack</h3>
              <p className="text-sm text-gray-600 mb-3">
                Download a complete record of the decision pack for audit purposes
              </p>
              
              <button className="btn-secondary w-full flex items-center justify-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Download PDF</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Acknowledgment Preview */}
      {showAcknowledgment && (
        <motion.div 
          className="mt-8 card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Customer Acknowledgment</h3>
            <button
              onClick={() => setShowAcknowledgment(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <pre className="text-sm text-gray-800 whitespace-pre-wrap font-mono">
              {generateAcknowledgment()}
            </pre>
          </div>
          
          <div className="mt-4 text-sm text-gray-600">
            <p><span className="font-medium">Note:</span> This acknowledgment is grounded in the extracted claim facts and policy clauses, ensuring accuracy and compliance.</p>
          </div>
        </motion.div>
      )}

      {/* Audit Timeline */}
      <motion.div 
        className="mt-8 card p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h3 className="text-lg font-semibold mb-4">Audit Timeline</h3>
        <div className="space-y-3">
          {audit.map((event, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${
                event.success ? 'bg-success-500' : 'bg-danger-500'
              }`}></div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">{event.step}</span>
                  <span className="text-sm text-gray-500">{event.duration}ms</span>
                </div>
                <div className="text-sm text-gray-600">
                  {new Date(event.timestamp).toLocaleTimeString()} - {event.modelVersion}
                  {event.fallbackUsed && (
                    <span className="text-warning-600 ml-2">(Fallback used)</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <button
          onClick={onPreviousStage}
          className="btn-secondary flex items-center space-x-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Review</span>
        </button>
        
        <button
          onClick={onNextStage}
          className="btn-primary flex items-center space-x-2"
        >
          <span>View Dashboard</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  )
} 