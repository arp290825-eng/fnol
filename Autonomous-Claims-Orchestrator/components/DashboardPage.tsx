'use client'

import { motion } from 'framer-motion'
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Shield,
  RefreshCw,
  ArrowLeft,
  Download,
  Eye
} from 'lucide-react'
import { ClaimData, ProcessingMetrics } from '@/types/claims'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'

interface DashboardPageProps {
  claimData: ClaimData
  onReset: () => void
}

export default function DashboardPage({ claimData, onReset }: DashboardPageProps) {
  const { 
    decisionPack, 
    processingTime = 2000, 
    autoPopulatedFields = 8, 
    totalFields = 10, 
    ragHitRate = 1, 
    overrideRate = 0.1 
  } = claimData
  const { 
    evidence = [], 
    documents = [], 
    policyGrounding = [], 
    audit = [] 
  } = decisionPack || {}

  // Simulate historical data for charts
  const historicalData = [
    { date: '12/10', handleTime: 45, autoPop: 78, override: 12 },
    { date: '12/11', handleTime: 42, autoPop: 82, override: 8 },
    { date: '12/12', handleTime: 38, autoPop: 85, override: 6 },
    { date: '12/13', handleTime: 41, autoPop: 80, override: 10 },
    { date: '12/14', handleTime: 35, autoPop: 88, override: 5 },
    { date: '12/15', handleTime: processingTime / 1000, autoPop: (autoPopulatedFields / totalFields) * 100, override: overrideRate * 100 }
  ]

  const confidenceData = [
    { name: 'High (≥80%)', value: evidence.filter(e => e.confidence >= 0.8).length, color: '#22c55e' },
    { name: 'Medium (60-79%)', value: evidence.filter(e => e.confidence >= 0.6 && e.confidence < 0.8).length, color: '#f59e0b' },
    { name: 'Low (<60%)', value: evidence.filter(e => e.confidence < 0.6).length, color: '#ef4444' }
  ]

  const documentTypeData = documents.map(doc => ({
    name: doc.type,
    value: 1,
    color: getDocumentColor(doc.type)
  }))

  function getDocumentColor(type: string): string {
    const colors: Record<string, string> = {
      'PoliceReport': '#3b82f6',
      'RepairEstimate': '#10b981',
      'DamagePhoto': '#f59e0b',
      'Invoice': '#8b5cf6',
      'Other': '#6b7280'
    }
    return colors[type] || '#6b7280'
  }

  const averageHandleTime = historicalData.reduce((sum, item) => sum + item.handleTime, 0) / historicalData.length
  const averageAutoPop = historicalData.reduce((sum, item) => sum + item.autoPop, 0) / historicalData.length
  const averageOverride = historicalData.reduce((sum, item) => sum + item.override, 0) / historicalData.length

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Operations Dashboard</h1>
        <p className="text-lg text-gray-600">
          Monitor performance metrics and governance compliance
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <motion.div 
          className="card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Handle Time</p>
              <p className="text-2xl font-bold text-gray-900">{averageHandleTime.toFixed(1)}s</p>
            </div>
            <Clock className="w-8 h-8 text-blue-600" />
          </div>
          <div className="mt-2">
            <span className="text-sm text-success-600">↓ 12% from last week</span>
          </div>
        </motion.div>

        <motion.div 
          className="card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Auto-population %</p>
              <p className="text-2xl font-bold text-gray-900">{averageAutoPop.toFixed(0)}%</p>
            </div>
            <CheckCircle className="w-8 h-8 text-success" />
          </div>
          <div className="mt-2">
            <span className="text-sm text-success-600">↑ 8% from last week</span>
          </div>
        </motion.div>

        <motion.div 
          className="card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Override Rate</p>
              <p className="text-2xl font-bold text-gray-900">{averageOverride.toFixed(1)}%</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-warning" />
          </div>
          <div className="mt-2">
            <span className="text-sm text-success-600">↓ 3% from last week</span>
          </div>
        </motion.div>

        <motion.div 
          className="card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">RAG Hit Rate</p>
              <p className="text-2xl font-bold text-gray-900">{(ragHitRate * 100).toFixed(0)}%</p>
            </div>
            <TrendingUp className="w-8 h-8 text-blue-600" />
          </div>
          <div className="mt-2">
            <span className="text-sm text-success-600">↑ 15% from last week</span>
          </div>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        {/* Handle Time Trend */}
        <motion.div 
          className="card p-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-lg font-semibold mb-4">Handle Time Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={historicalData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="handleTime" stroke="#3b82f6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Auto-population vs Override */}
        <motion.div 
          className="card p-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h3 className="text-lg font-semibold mb-4">Auto-population vs Override</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={historicalData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="autoPop" fill="#22c55e" name="Auto-population %" />
              <Bar dataKey="override" fill="#f59e0b" name="Override %" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Detailed Metrics */}
      <div className="grid lg:grid-cols-3 gap-8 mb-8">
        {/* Field Confidence Distribution */}
        <motion.div 
          className="card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <h3 className="text-lg font-semibold mb-4">Field Confidence Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={confidenceData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {confidenceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Document Types */}
        <motion.div 
          className="card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <h3 className="text-lg font-semibold mb-4">Document Types Processed</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={documentTypeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name }) => name}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {documentTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Current Claim Summary */}
        <motion.div 
          className="card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <h3 className="text-lg font-semibold mb-4">Current Claim Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Processing Time:</span>
              <span className="text-sm font-medium">{(processingTime / 1000).toFixed(1)}s</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Fields Extracted:</span>
              <span className="text-sm font-medium">{totalFields}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">High Confidence:</span>
              <span className="text-sm font-medium">{autoPopulatedFields}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Policy Matches:</span>
              <span className="text-sm font-medium">{policyGrounding.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Documents:</span>
              <span className="text-sm font-medium">{documents.length}</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Governance & Compliance */}
      <motion.div 
        className="card p-6 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
      >
        <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
          <Shield className="w-5 h-5 text-blue-600" />
          <span>Governance & Compliance</span>
        </h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Human-in-the-Loop Policy</h4>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• No automatic claim denials</li>
              <li>• Fields below 70% confidence require review</li>
              <li>• Policy clause matches require verification</li>
              <li>• All decisions logged with audit trail</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Explainability Standards</h4>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• Every extracted field has evidence source</li>
              <li>• Policy clauses include similarity scores</li>
              <li>• Clear rationale for each decision</li>
              <li>• Complete audit trail maintained</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
          <h4 className="font-medium text-blue-900 mb-2">Retraining & Improvement Loop</h4>
          <p className="text-sm text-blue-800">
            The system continuously learns from human overrides and feedback. When confidence thresholds are consistently exceeded or underperformed, 
            the AI models are retrained with new data to improve accuracy and reduce manual intervention.
          </p>
        </div>
      </motion.div>

      {/* Actions */}
      <div className="flex justify-between items-center">
        <button
          onClick={onReset}
          className="btn-secondary flex items-center space-x-2"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Process New Claim</span>
        </button>
        
        <div className="flex space-x-3">
          <button className="btn-secondary flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export Report</span>
          </button>
          <button className="btn-primary flex items-center space-x-2">
            <Eye className="w-4 h-4" />
            <span>View Analytics</span>
          </button>
        </div>
      </div>
    </motion.div>
  )
} 