'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import HomePage from '@/components/HomePage'
import ReviewPage from '@/components/ReviewPage'
import DecisionPage from '@/components/DecisionPage'
import DashboardPage from '@/components/DashboardPage'
import { ClaimData, ProcessingStage } from '@/types/claims'
import { useAuth } from '@/lib/auth/AuthContext'

export default function Home() {
  const router = useRouter()
  const { isAuthenticated, loading } = useAuth()
  const [currentStage, setCurrentStage] = useState<ProcessingStage>('home')
  const [claimData, setClaimData] = useState<ClaimData | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, loading, router])

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#2563EB] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#64748B]">Loading...</p>
        </div>
      </div>
    )
  }

  // Don't render main app if not authenticated
  if (!isAuthenticated) {
    return null
  }

  const handleStageChange = (stage: ProcessingStage) => {
    // Prevent navigation to stages that require claimData if it's not available
    if ((stage === 'review' || stage === 'decision' || stage === 'dashboard') && !claimData) {
      // Stay on current stage or go to home
      return
    }
    setCurrentStage(stage)
  }

  const handleClaimProcessed = (data: ClaimData) => {
    setClaimData(data)
    setCurrentStage('review')
  }

  const handleLoadClaim = async (claimId: string) => {
    try {
      const res = await fetch(`/api/claims/${encodeURIComponent(claimId)}`)
      if (res.ok) {
        const data = await res.json()
        setClaimData(data)
      }
    } catch (err) {
      console.error('Failed to load claim:', err)
    }
  }

  const renderCurrentStage = () => {
    switch (currentStage) {
      case 'home':
        return (
          <HomePage
            onProcessClaim={handleClaimProcessed}
            isProcessing={isProcessing}
            setIsProcessing={setIsProcessing}
          />
        )
      case 'review':
        return (
          <ReviewPage
            claimData={claimData!}
            onNextStage={() => setCurrentStage('decision')}
            onPreviousStage={() => setCurrentStage('home')}
            onLoadClaim={handleLoadClaim}
          />
        )
      case 'decision':
        return (
          <DecisionPage
            claimData={claimData!}
            onNextStage={() => setCurrentStage('dashboard')}
            onPreviousStage={() => setCurrentStage('review')}
            onLoadClaim={handleLoadClaim}
          />
        )
      case 'dashboard':
        return (
          <DashboardPage
            claimData={claimData!}
            onReset={() => {
              setCurrentStage('home')
              setClaimData(null)
            }}
          />
        )
      default:
        return <HomePage onProcessClaim={handleClaimProcessed} isProcessing={isProcessing} setIsProcessing={setIsProcessing} />
    }
  }

  return (
    <div className="min-h-screen bg-white relative">
      <Header currentStage={currentStage} onStageChange={handleStageChange} />
      <main className="container mx-auto px-8 py-16 relative z-10">
        {renderCurrentStage()}
      </main>
    </div>
  )
} 