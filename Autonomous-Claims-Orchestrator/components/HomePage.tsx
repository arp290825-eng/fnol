'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { 
  Mail, 
  Upload, 
  FileText, 
  Image, 
  AlertCircle,
  Play,
  Clock,
  CheckCircle
} from 'lucide-react'
import { ClaimData } from '@/types/claims'
import { processClaim } from '@/lib/claimProcessor'

interface HomePageProps {
  onProcessClaim: (data: ClaimData) => void
  isProcessing: boolean
  setIsProcessing: (processing: boolean) => void
}

interface UploadedFile {
  id: string
  name: string
  type: string
  size: number
  preview?: string
}

export default function HomePage({ onProcessClaim, isProcessing, setIsProcessing }: HomePageProps) {
  const [emailText, setEmailText] = useState('')
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [processingSteps, setProcessingSteps] = useState<string[]>([])
  const [currentStep, setCurrentStep] = useState('')

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles: UploadedFile[] = acceptedFiles.map((file, index) => ({
      id: `file-${Date.now()}-${index}`,
      name: file.name,
      type: file.type,
      size: file.size,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined
    }))
    setUploadedFiles(prev => [...prev, ...newFiles])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
      'text/plain': ['.txt']
    },
    maxFiles: 5
  })

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId))
  }

  const handleProcessClaim = async () => {
    if (!emailText.trim() || uploadedFiles.length === 0) return

    setIsProcessing(true)
    setProcessingSteps([])
    setCurrentStep('')

    try {
      // Simulate processing steps
      const steps = [
        'Ingestion Agent: Normalizing email and attachments...',
        'Document Classifier: Analyzing document types...',
        'Extraction Agent: Extracting claim fields...',
        'Policy RAG Agent: Querying policy database...',
        'Assembler Agent: Building decision pack...'
      ]

      for (let i = 0; i < steps.length; i++) {
        setCurrentStep(steps[i])
        setProcessingSteps(prev => [...prev, steps[i]])
        await new Promise(resolve => setTimeout(resolve, 800))
      }

      // Process the claim
      const claimData = await processClaim(emailText, uploadedFiles)
      onProcessClaim(claimData)
    } catch (error) {
      console.error('Error processing claim:', error)
      setCurrentStep('Error processing claim')
    } finally {
      setIsProcessing(false)
    }
  }

  const canProcess = emailText.trim().length > 0 && uploadedFiles.length > 0 && !isProcessing

  return (
    <div className="relative min-h-screen">
      {/* Grid Background */}
      <div 
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(37, 99, 235, 0.06) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(37, 99, 235, 0.06) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
          backgroundPosition: '0 0',
        }}
      />
      
      {/* Subtle diagonal grid overlay for depth */}
      <div 
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `
            linear-gradient(45deg, rgba(124, 58, 237, 0.02) 25%, transparent 25%),
            linear-gradient(-45deg, rgba(124, 58, 237, 0.02) 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, rgba(124, 58, 237, 0.02) 75%),
            linear-gradient(-45deg, transparent 75%, rgba(124, 58, 237, 0.02) 75%)
          `,
          backgroundSize: '96px 96px',
          backgroundPosition: '0 0, 0 48px, 48px -48px, -48px 0px',
        }}
      />
      
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Hero Section with Radial Gradient Glow */}
        <div className="text-center mb-24 pt-12 relative">
        {/* Subtle glow effect behind hero */}
        <div className="absolute inset-0 -top-20 -bottom-20 flex items-center justify-center pointer-events-none">
          <div className="w-full max-w-2xl h-64 bg-gradient-radial from-[#2563EB]/10 via-[#7C3AED]/5 to-transparent rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative z-10">
          <span className="inline-block text-xs font-semibold text-[#6366F1] uppercase tracking-widest mb-6">
            AI-Powered Claims Processing
          </span>
          <h1 className="text-6xl font-bold text-[#0F172A] mb-6 tracking-tight leading-tight">
            Process Claims
            <br />
            <span className="bg-gradient-to-r from-[#2563EB] to-[#7C3AED] bg-clip-text text-transparent">
              Automatically
            </span>
          </h1>
          <p className="text-xl text-[#475569] max-w-2xl mx-auto mb-3 font-medium leading-relaxed">
            Upload FNOL email and attachments for intelligent extraction and processing
          </p>
          <p className="text-base text-[#64748B] max-w-xl mx-auto">
            Our AI orchestrates document classification, field extraction, and policy matching
          </p>
        </div>
      </div>

      {/* Form Area - Two Elevated Glass Cards */}
      <div className="grid lg:grid-cols-2 gap-8 mb-16 relative z-10">
        {/* Email Input Card with Glassmorphism */}
        <div className="card-glass p-10 h-full flex flex-col relative overflow-hidden">
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#2563EB]/5 via-transparent to-[#7C3AED]/5 pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col h-full">
            <div className="flex items-center space-x-2 mb-4">
              <div className="p-2 bg-gradient-to-br from-[#2563EB]/10 to-[#7C3AED]/10 rounded-lg">
                <Mail className="w-5 h-5 text-[#6366F1]" />
              </div>
              <h2 className="text-sm font-semibold text-[#475569] uppercase tracking-wider">FNOL Email</h2>
            </div>
            
            <textarea
              value={emailText}
              onChange={(e) => setEmailText(e.target.value)}
              placeholder="Paste FNOL email content here..."
              className="w-full flex-1 p-5 border border-[#E2E8F0] rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-[#6366F1]/20 focus:border-[#6366F1]/30 bg-white/50 backdrop-blur-sm text-[#0F172A] placeholder:text-[#94A3B8] text-sm leading-relaxed transition-all duration-200"
              style={{ minHeight: '340px' }}
            />
            
            <div className="mt-4 text-xs text-[#94A3B8] font-medium">
              {emailText.length} characters
            </div>
          </div>
        </div>

        {/* File Upload Card with Glassmorphism */}
        <div className="card-glass p-10 h-full flex flex-col relative overflow-hidden">
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#7C3AED]/5 via-transparent to-[#2563EB]/5 pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col h-full">
            <div className="flex items-center space-x-2 mb-4">
              <div className="p-2 bg-gradient-to-br from-[#7C3AED]/10 to-[#2563EB]/10 rounded-lg">
                <Upload className="w-5 h-5 text-[#6366F1]" />
              </div>
              <h2 className="text-sm font-semibold text-[#475569] uppercase tracking-wider">Attachments</h2>
            </div>
            
            <div
              {...getRootProps()}
              className={`
                flex-1 border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-300 relative overflow-hidden
                ${isDragActive 
                  ? 'border-[#6366F1] bg-gradient-to-br from-[#EEF2FF] to-[#F3E8FF] shadow-lg scale-[1.02]' 
                  : 'border-[#CBD5E1] hover:border-[#6366F1]/50 hover:bg-gradient-to-br hover:from-[#FAFBFC] hover:to-[#F8FAFC] bg-white/30 backdrop-blur-sm'
                }
              `}
              style={{ minHeight: '340px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}
            >
              <input {...getInputProps()} />
              <div className={`p-4 rounded-full mb-4 transition-all duration-300 ${
                isDragActive ? 'bg-[#6366F1]/10' : 'bg-[#F1F5F9]'
              }`}>
                <Upload className={`w-12 h-12 transition-colors duration-300 ${
                  isDragActive ? 'text-[#6366F1]' : 'text-[#94A3B8]'
                }`} />
              </div>
              {isDragActive ? (
                <p className="text-base font-semibold text-[#6366F1]">Drop files here</p>
              ) : (
                <div>
                  <p className="text-sm font-semibold text-[#334155] mb-2">Drag files here or click to select</p>
                  <p className="text-xs text-[#94A3B8]">PDF, images, text files (max 5)</p>
                </div>
              )}
            </div>

            {/* Uploaded Files */}
            {uploadedFiles.length > 0 && (
              <div className="mt-6 space-y-2 relative z-10">
                {uploadedFiles.map((file) => (
                  <div key={file.id} className="flex items-center justify-between p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-[#E2E8F0] hover:border-[#CBD5E1] hover:shadow-md transition-all duration-200">
                    <div className="flex items-center space-x-3 min-w-0 flex-1">
                      {file.type.startsWith('image/') ? (
                        <div className="p-2 bg-[#EEF2FF] rounded-lg">
                          <Image className="w-4 h-4 text-[#6366F1] flex-shrink-0" />
                        </div>
                      ) : (
                        <div className="p-2 bg-[#F3E8FF] rounded-lg">
                          <FileText className="w-4 h-4 text-[#7C3AED] flex-shrink-0" />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-[#0F172A] truncate">{file.name}</p>
                        <p className="text-xs text-[#94A3B8] font-medium">{(file.size / 1024).toFixed(1)} KB</p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFile(file.id)}
                      className="text-[#94A3B8] hover:text-[#64748B] p-2 hover:bg-[#F1F5F9] rounded-lg transition-all duration-200 flex-shrink-0"
                    >
                      <AlertCircle className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Primary Action Button - Blue to Violet Gradient */}
      <div className="text-center mb-16 relative z-10">
        <button
          onClick={handleProcessClaim}
          disabled={!canProcess}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-100 transition-transform duration-200"
        >
          {isProcessing ? (
            <div className="flex items-center space-x-3">
              <Clock className="w-5 h-5 animate-spin" />
              <span>Processing...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Play className="w-5 h-5" />
              <span>Process Claim</span>
            </div>
          )}
        </button>
      </div>

      {/* Processing Steps */}
      {isProcessing && (
        <div className="card-glass p-8 relative overflow-hidden z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-[#EEF2FF]/50 via-transparent to-[#F3E8FF]/50 pointer-events-none"></div>
          
          <div className="relative z-10">
            <h3 className="text-sm font-semibold text-[#475569] uppercase tracking-wider mb-6">
              Processing Steps
            </h3>
            <div className="space-y-3">
              {processingSteps.map((step, index) => (
                <div 
                  key={index} 
                  className="flex items-center space-x-4 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-[#E2E8F0]"
                >
                  <div className="p-1.5 bg-gradient-to-br from-[#10B981] to-[#059669] rounded-full">
                    <CheckCircle className="w-4 h-4 text-white flex-shrink-0" />
                  </div>
                  <span className="text-sm text-[#334155] font-medium">{step}</span>
                </div>
              ))}
              
              {currentStep && !processingSteps.includes(currentStep) && (
                <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-[#EEF2FF] to-[#F3E8FF] rounded-xl border border-[#C7D2FE]">
                  <div className="p-1.5 bg-gradient-to-br from-[#6366F1] to-[#7C3AED] rounded-full">
                    <Clock className="w-4 h-4 text-white animate-spin flex-shrink-0" />
                  </div>
                  <span className="text-sm text-[#4338CA] font-semibold">{currentStep}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  )
} 