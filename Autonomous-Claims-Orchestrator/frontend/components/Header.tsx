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
  Brain,
  LogOut,
  User
} from 'lucide-react'
import ConfigModal from './ConfigModal'
import { useAuth } from '@/lib/auth/AuthContext'

interface HeaderProps {
  currentStage: ProcessingStage
  onStageChange: (stage: ProcessingStage) => void
}

const stages = [
  { id: 'home', label: 'Ingest', icon: Home, description: 'Select Policy & Process' },
  { id: 'review', label: 'Review', icon: Search, description: 'Extraction & Evidence' },
  { id: 'decision', label: 'Decision', icon: CheckCircle, description: 'Draft Claim & Actions' },
  { id: 'dashboard', label: 'Dashboard', icon: BarChart3, description: 'Ops & Metrics' },
] as const

export default function Header({ currentStage, onStageChange }: HeaderProps) {
  const [showConfig, setShowConfig] = useState(false)
  const [hasOpenAIKey, setHasOpenAIKey] = useState(false)
  const { user, logout } = useAuth()

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
      <header className="bg-white border-b border-[#E5E7EB] sticky top-0 z-50">
        <div className="container mx-auto px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-8 h-8 bg-[#2563EB] rounded">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-lg font-semibold text-[#111827]">
                  Claims Fast Lane
                </h1>
                <p className="text-xs text-[#9CA3AF] font-medium">by AI Mill</p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex items-center space-x-1">
              {stages.map((stage, index) => {
                const Icon = stage.icon
                const isActive = currentStage === stage.id
                
                return (
                  <button
                    key={stage.id}
                    onClick={() => onStageChange(stage.id as ProcessingStage)}
                    className={`
                      flex items-center space-x-2 px-4 py-2 text-sm font-medium transition-colors
                      ${isActive 
                        ? 'text-[#2563EB] border-b-2 border-[#2563EB]' 
                        : 'text-[#6B7280] hover:text-[#374151]'
                      }
                    `}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{stage.label}</span>
                  </button>
                )
              })}
            </nav>

            {/* Secondary controls - visually muted */}
            <div className="flex items-center space-x-3">
              {hasOpenAIKey ? (
                <div className="flex items-center space-x-1.5 text-[#9CA3AF]">
                  <Brain className="w-3.5 h-3.5" />
                  <span className="text-xs">AI</span>
                </div>
              ) : (
                <div className="flex items-center space-x-1.5 text-[#9CA3AF]">
                  <Zap className="w-3.5 h-3.5" />
                  <span className="text-xs">Demo</span>
                </div>
              )}
              <button 
                onClick={() => setShowConfig(true)}
                className="p-1.5 text-[#9CA3AF] hover:text-[#6B7280] transition-colors"
                title="Settings"
              >
                <Settings className="w-4 h-4" />
              </button>
              {/* User info and logout */}
              {user && (
                <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-[#F3F4F6]">
                  <User className="w-3.5 h-3.5 text-[#6B7280]" />
                  <span className="text-xs text-[#6B7280] font-medium hidden sm:inline">
                    {user.name}
                  </span>
                </div>
              )}
              <button
                onClick={logout}
                className="p-1.5 text-[#9CA3AF] hover:text-[#EF4444] transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
              {/* Image at the very right */}
              <div className="flex items-center space-x-2 ml-2">
                <img 
                  src="/image.png" 
                  alt="AI Mill" 
                  className="h-10 w-auto object-contain"
                />
                <span className="text-xs text-[#9CA3AF] font-medium">By AI Mill</span>
              </div>
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