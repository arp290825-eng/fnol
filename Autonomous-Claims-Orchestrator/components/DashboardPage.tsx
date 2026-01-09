'use client'

import { 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  TrendingUp,
  RefreshCw,
  Download
} from 'lucide-react'
import { ClaimData } from '@/types/claims'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend } from 'recharts'

interface DashboardPageProps {
  claimData: ClaimData
  onReset: () => void
}

export default function DashboardPage({ claimData, onReset }: DashboardPageProps) {
  // Handle null claimData
  if (!claimData || !claimData.decisionPack) {
    return (
      <div className="max-w-7xl mx-auto text-center py-16">
        <AlertTriangle className="w-12 h-12 text-[#9CA3AF] mx-auto mb-4" />
        <h2 className="text-2xl font-semibold text-[#111827] mb-2">No Claim Data Available</h2>
        <p className="text-[#6B7280] mb-8">
          Please process a claim first to view the dashboard.
        </p>
        <button
          onClick={onReset}
          className="btn-primary inline-flex items-center space-x-2"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Process New Claim</span>
        </button>
      </div>
    )
  }

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
    { name: 'High (≥80%)', value: evidence.filter(e => e.confidence >= 0.8).length, color: '#2563EB' },
    { name: 'Medium (60-79%)', value: evidence.filter(e => e.confidence >= 0.6 && e.confidence < 0.8).length, color: '#93C5FD' },
    { name: 'Low (<60%)', value: evidence.filter(e => e.confidence < 0.6).length, color: '#DBEAFE' }
  ]

  const documentTypeData = documents.map(doc => ({
    name: doc.type,
    value: 1,
    color: '#2563EB'
  }))

  const averageHandleTime = historicalData.reduce((sum, item) => sum + item.handleTime, 0) / historicalData.length
  const averageAutoPop = historicalData.reduce((sum, item) => sum + item.autoPop, 0) / historicalData.length
  const averageOverride = historicalData.reduce((sum, item) => sum + item.override, 0) / historicalData.length

  return (
    <div className="max-w-7xl mx-auto">
      {/* Page Title */}
      <div className="mb-16">
        <h1 className="text-3xl font-semibold text-[#111827] mb-2">
          Operations Dashboard
        </h1>
        <p className="text-sm text-[#6B7280]">
          Performance metrics and operational insights
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-16">
        <div className="card p-6 h-full">
          <div className="flex items-start justify-between mb-4">
            <Clock className="w-5 h-5 text-[#9CA3AF] flex-shrink-0 mt-1" />
          </div>
          <p className="text-xs font-medium text-[#6B7280] uppercase tracking-wider mb-2">
            Avg Handle Time
          </p>
          <p className="text-3xl font-semibold text-[#111827] mb-3">
            {averageHandleTime.toFixed(1)}s
          </p>
          <p className="text-xs text-[#6B7280]">
            ↓ 12% from last week
          </p>
        </div>

        <div className="card p-6 h-full">
          <div className="flex items-start justify-between mb-4">
            <CheckCircle className="w-5 h-5 text-[#9CA3AF] flex-shrink-0 mt-1" />
          </div>
          <p className="text-xs font-medium text-[#6B7280] uppercase tracking-wider mb-2">
            Auto-population
          </p>
          <p className="text-3xl font-semibold text-[#111827] mb-3">
            {averageAutoPop.toFixed(0)}%
          </p>
          <p className="text-xs text-[#6B7280]">
            ↑ 8% from last week
          </p>
        </div>

        <div className="card p-6 h-full">
          <div className="flex items-start justify-between mb-4">
            <AlertTriangle className="w-5 h-5 text-[#9CA3AF] flex-shrink-0 mt-1" />
          </div>
          <p className="text-xs font-medium text-[#6B7280] uppercase tracking-wider mb-2">
            Override Rate
          </p>
          <p className="text-3xl font-semibold text-[#111827] mb-3">
            {averageOverride.toFixed(1)}%
          </p>
          <p className="text-xs text-[#6B7280]">
            ↓ 3% from last week
          </p>
        </div>

        <div className="card p-6 h-full">
          <div className="flex items-start justify-between mb-4">
            <TrendingUp className="w-5 h-5 text-[#9CA3AF] flex-shrink-0 mt-1" />
          </div>
          <p className="text-xs font-medium text-[#6B7280] uppercase tracking-wider mb-2">
            RAG Hit Rate
          </p>
          <p className="text-3xl font-semibold text-[#111827] mb-3">
            {(ragHitRate * 100).toFixed(0)}%
          </p>
          <p className="text-xs text-[#6B7280]">
            ↑ 15% from last week
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6 mb-16">
        {/* Handle Time Trend */}
        <div className="card p-6">
          <h3 className="text-sm font-semibold text-[#111827] mb-6">Handle Time Trend</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={historicalData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis 
                dataKey="date" 
                stroke="#9CA3AF"
                tick={{ fill: '#6B7280', fontSize: 12 }}
                axisLine={{ stroke: '#E5E7EB' }}
              />
              <YAxis 
                stroke="#9CA3AF"
                tick={{ fill: '#6B7280', fontSize: 12 }}
                axisLine={{ stroke: '#E5E7EB' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#FFFFFF', 
                  border: '1px solid #E5E7EB',
                  borderRadius: '6px',
                  fontSize: '12px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="handleTime" 
                stroke="#2563EB" 
                strokeWidth={2}
                dot={{ fill: '#2563EB', r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Auto-population vs Override */}
        <div className="card p-6">
          <h3 className="text-sm font-semibold text-[#111827] mb-6">Auto-population vs Override</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={historicalData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis 
                dataKey="date" 
                stroke="#9CA3AF"
                tick={{ fill: '#6B7280', fontSize: 12 }}
                axisLine={{ stroke: '#E5E7EB' }}
              />
              <YAxis 
                stroke="#9CA3AF"
                tick={{ fill: '#6B7280', fontSize: 12 }}
                axisLine={{ stroke: '#E5E7EB' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#FFFFFF', 
                  border: '1px solid #E5E7EB',
                  borderRadius: '6px',
                  fontSize: '12px'
                }}
              />
              <Legend 
                wrapperStyle={{ fontSize: '12px', color: '#6B7280' }}
                iconType="square"
              />
              <Bar dataKey="autoPop" fill="#2563EB" name="Auto-population" radius={[4, 4, 0, 0]} />
              <Bar dataKey="override" fill="#DBEAFE" name="Override" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Metrics */}
      <div className="grid lg:grid-cols-3 gap-6 mb-16">
        {/* Field Confidence Distribution */}
        <div className="card p-6">
          <h3 className="text-sm font-semibold text-[#111827] mb-6">Field Confidence Distribution</h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={confidenceData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                outerRadius={70}
                fill="#2563EB"
                dataKey="value"
              >
                {confidenceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#FFFFFF', 
                  border: '1px solid #E5E7EB',
                  borderRadius: '6px',
                  fontSize: '12px'
                }}
              />
              <Legend 
                wrapperStyle={{ fontSize: '12px', color: '#6B7280' }}
                iconType="circle"
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Document Types */}
        <div className="card p-6">
          <h3 className="text-sm font-semibold text-[#111827] mb-6">Document Types Processed</h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={documentTypeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name }) => name}
                outerRadius={70}
                fill="#2563EB"
                dataKey="value"
              >
                {documentTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#FFFFFF', 
                  border: '1px solid #E5E7EB',
                  borderRadius: '6px',
                  fontSize: '12px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Current Claim Summary */}
        <div className="card p-6">
          <h3 className="text-sm font-semibold text-[#111827] mb-6">Current Claim Summary</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-[#F3F4F6]">
              <span className="text-sm text-[#6B7280]">Processing Time</span>
              <span className="text-sm font-semibold text-[#111827]">{(processingTime / 1000).toFixed(1)}s</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-[#F3F4F6]">
              <span className="text-sm text-[#6B7280]">Fields Extracted</span>
              <span className="text-sm font-semibold text-[#111827]">{totalFields}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-[#F3F4F6]">
              <span className="text-sm text-[#6B7280]">High Confidence</span>
              <span className="text-sm font-semibold text-[#111827]">{autoPopulatedFields}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-[#F3F4F6]">
              <span className="text-sm text-[#6B7280]">Policy Matches</span>
              <span className="text-sm font-semibold text-[#111827]">{policyGrounding.length}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-[#6B7280]">Documents</span>
              <span className="text-sm font-semibold text-[#111827]">{documents.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Governance & Compliance */}
      <div className="card p-8 mb-12">
        <h3 className="text-sm font-semibold text-[#111827] mb-8">
          Governance & Compliance
        </h3>
        
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h4 className="text-xs font-medium text-[#6B7280] uppercase tracking-wider mb-4">
              Human-in-the-Loop Policy
            </h4>
            <ul className="text-sm text-[#374151] space-y-3">
              <li className="flex items-start">
                <span className="text-[#9CA3AF] mr-2">•</span>
                <span>No automatic claim denials</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#9CA3AF] mr-2">•</span>
                <span>Fields below 70% confidence require review</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#9CA3AF] mr-2">•</span>
                <span>Policy clause matches require verification</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#9CA3AF] mr-2">•</span>
                <span>All decisions logged with audit trail</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-xs font-medium text-[#6B7280] uppercase tracking-wider mb-4">
              Explainability Standards
            </h4>
            <ul className="text-sm text-[#374151] space-y-3">
              <li className="flex items-start">
                <span className="text-[#9CA3AF] mr-2">•</span>
                <span>Every extracted field has evidence source</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#9CA3AF] mr-2">•</span>
                <span>Policy clauses include similarity scores</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#9CA3AF] mr-2">•</span>
                <span>Clear rationale for each decision</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#9CA3AF] mr-2">•</span>
                <span>Complete audit trail maintained</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-[#E5E7EB]">
          <h4 className="text-xs font-medium text-[#6B7280] uppercase tracking-wider mb-2">
            Retraining & Improvement Loop
          </h4>
          <p className="text-sm text-[#374151] leading-relaxed">
            The system continuously learns from human overrides and feedback. When confidence thresholds are consistently exceeded or underperformed, 
            the AI models are retrained with new data to improve accuracy and reduce manual intervention.
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center pt-6 border-t border-[#E5E7EB]">
        <button
          onClick={onReset}
          className="btn-secondary inline-flex items-center space-x-2"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Process New Claim</span>
        </button>
        
        <button className="btn-secondary inline-flex items-center space-x-2">
          <Download className="w-4 h-4" />
          <span>Export Report</span>
        </button>
      </div>
    </div>
  )
} 