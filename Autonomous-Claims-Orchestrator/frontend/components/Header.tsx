'use client'

import React from 'react'
import { ProcessingStage } from '@/types/claims'
import {
  Home,
  Search,
  CheckCircle,
  BarChart3,
  LogOut,
  User,
  HelpCircle,
} from 'lucide-react'
import { useAuth } from '@/lib/auth/AuthContext'

interface HeaderProps {
  currentStage: ProcessingStage
  onStageChange: (stage: ProcessingStage) => void
}

const stages = [
  { id: 'faq', label: 'FAQ Auto Resolution', icon: HelpCircle, description: 'FAQ threads' },
  { id: 'home', label: 'Inbox', icon: Home, description: 'FNOL & select' },
  { id: 'review', label: 'Review', icon: Search, description: 'Extraction & Evidence' },
  { id: 'decision', label: 'Decision', icon: CheckCircle, description: 'Draft Claim & Actions' },
  { id: 'dashboard', label: 'Dashboard', icon: BarChart3, description: 'Ops & Metrics' },
] as const

export default function Header({ currentStage, onStageChange }: HeaderProps) {
  const { user, logout } = useAuth()

  return (
    <header className="bg-white border-b border-[#E5E7EB] sticky top-0 z-50">
      <div className="container mx-auto px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3 min-w-0">
            <img
              src="/reversed_high_res.png"
              alt=""
              className="h-10 w-10 object-contain shrink-0"
              width={40}
              height={40}
            />
            <div className="flex flex-col min-w-0 leading-tight">
              <h1 className="text-lg font-semibold text-[#111827] truncate">Claims FastLane</h1>
              <p className="text-xs text-[#9CA3AF] font-medium truncate">By AI Mill</p>
            </div>
          </div>

          <nav className="flex items-center space-x-1">
            {stages.map((stage) => {
              const Icon = stage.icon
              const isActive = currentStage === stage.id

              return (
                <button
                  key={stage.id}
                  onClick={() => onStageChange(stage.id as ProcessingStage)}
                  className={`
                      flex items-center space-x-2 px-4 py-2 text-sm font-medium transition-colors rounded-md
                      ${
                        isActive
                          ? 'bg-[#2563EB] text-white shadow-sm'
                          : 'text-[#6B7280] hover:text-[#1D4ED8] hover:bg-[#EFF6FF]'
                      }
                    `}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{stage.label}</span>
                </button>
              )
            })}
          </nav>

          <div className="flex items-center space-x-3">
            {user && (
              <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-[#F3F4F6]">
                <User className="w-3.5 h-3.5 text-[#6B7280]" />
                <span className="text-xs text-[#6B7280] font-medium hidden sm:inline">{user.name}</span>
              </div>
            )}
            <button
              onClick={logout}
              className="p-1.5 text-[#9CA3AF] hover:text-[#EF4444] transition-colors"
              title="Logout"
              type="button"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
