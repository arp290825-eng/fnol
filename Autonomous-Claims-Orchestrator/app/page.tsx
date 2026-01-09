'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import HomePage from '@/components/HomePage'
import ReviewPage from '@/components/ReviewPage'
import DecisionPage from '@/components/DecisionPage'
import DashboardPage from '@/components/DashboardPage'
import { ClaimData, ProcessingStage } from '@/types/claims'

export default function Home() {
  const [currentStage, setCurrentStage] = useState<ProcessingStage>('home')
  const [claimData, setClaimData] = useState<ClaimData | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

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
          />
        )
      case 'decision':
        return (
          <DecisionPage
            claimData={claimData!}
            onNextStage={() => setCurrentStage('dashboard')}
            onPreviousStage={() => setCurrentStage('review')}
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