'use client'

import React, { useState, useEffect } from 'react'
import { ProcessingStage } from '@/types/claims'
import { motion } from 'framer-motion'
import { 
  Home, 
  Search, 
  CheckCircle, 
  BarChart3,
  Zap,
  Settings,
  Brain
} from 'lucide-react'
import ConfigModal from './ConfigModal'

interface HeaderProps {
  currentStage: ProcessingStage
  onStageChange: (stage: ProcessingStage) => void
}

const stages = [
  { id: 'home', label: 'Ingest', icon: Home, description: 'Upload FNOL & Attachments' },
  { id: 'review', label: 'Review', icon: Search, description: 'Extraction & Evidence' },
  { id: 'decision', label: 'Decision', icon: CheckCircle, description: 'Draft Claim & Actions' },
  { id: 'dashboard', label: 'Dashboard', icon: BarChart3, description: 'Ops & Metrics' },
] as const

export default function Header({ currentStage, onStageChange }: HeaderProps) {
  const [showConfig, setShowConfig] = useState(false)
  const [hasOpenAIKey, setHasOpenAIKey] = useState(false)

  useEffect(() => {
    // Check for OpenAI API key
    const checkOpenAIKey = () => {
      if (typeof window !== 'undefined') {
        const key = localStorage.getItem('openai_api_key') || (window as any).OPENAI_API_KEY
        setHasOpenAIKey(!!key)
      }
    }
    
    checkOpenAIKey()
    // Check periodically in case key is updated elsewhere
    const interval = setInterval(checkOpenAIKey, 2000)
    return () => clearInterval(interval)
  }, [])

  const handleConfigSave = (apiKey: string) => {
    setHasOpenAIKey(!!apiKey)
  }

  return (
    <>
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Title */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Claims Fast Lane</h1>
                <p className="text-sm text-gray-500">AI-Powered Claims Orchestrator</p>
              </div>
            </div>

          {/* Navigation */}
          <nav className="flex items-center space-x-1">
            {stages.map((stage, index) => {
              const Icon = stage.icon
              const isActive = currentStage === stage.id
              const isCompleted = stages.findIndex(s => s.id === currentStage) > index
              
              return (
                <motion.button
                  key={stage.id}
                  onClick={() => onStageChange(stage.id as ProcessingStage)}
                  className={`
                    relative flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                    ${isActive 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : isCompleted 
                        ? 'bg-success-50 text-success-700 hover:bg-success-100' 
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    }
                  `}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : ''}`} />
                  <span className="hidden sm:inline">{stage.label}</span>
                  
                  {/* Progress indicator */}
                  {isCompleted && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-success-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-3 h-3 text-white" />
                    </div>
                  )}
                </motion.button>
              )
            })}
          </nav>

          {/* Status indicators and config */}
          <div className="flex items-center space-x-4">
            {/* OpenAI Status */}
            <div className="flex items-center space-x-2">
              {hasOpenAIKey ? (
                <>
                  <Brain className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-blue-600 font-medium">AI Active</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 text-amber-500" />
                  <span className="text-sm text-amber-600 font-medium">Demo Mode</span>
                </>
              )}
            </div>

            {/* System Status */}
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-500">System Online</span>
            </div>

            {/* Config button */}
            <button 
              onClick={() => setShowConfig(true)}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="Configure OpenAI API"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>

    <ConfigModal
      isOpen={showConfig}
      onClose={() => setShowConfig(false)}
      onSave={handleConfigSave}
    />
  </>
  )
} 