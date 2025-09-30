'use client'

import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <motion.h1 
          className="text-4xl font-bold text-gray-900 mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Welcome to Claims Fast Lane
        </motion.h1>
        <motion.p 
          className="text-xl text-gray-600 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Upload a First Notice of Loss (FNOL) email with attachments and watch our AI orchestrate the entire claims processing workflow.
        </motion.p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Email Input */}
        <motion.div 
          className="card p-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center space-x-2 mb-4">
            <Mail className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold">FNOL Email Content</h2>
          </div>
          
          <textarea
            value={emailText}
            onChange={(e) => setEmailText(e.target.value)}
            placeholder="Paste the FNOL email content here...&#10;&#10;Example:&#10;Hi, I was rear-ended at an intersection on 12/15/2023. I've attached the police report and photos of the damage. My policy number is 123456789. Please let me know what I need to do next."
            className="w-full h-48 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          
          <div className="mt-3 text-sm text-gray-500">
            {emailText.length} characters
          </div>
        </motion.div>

        {/* File Upload */}
        <motion.div 
          className="card p-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center space-x-2 mb-4">
            <Upload className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold">Attachments</h2>
          </div>

          <div
            {...getRootProps()}
            className={`
              border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
              ${isDragActive 
                ? 'border-blue-600 bg-blue-50' 
                : 'border-gray-300 hover:border-blue-600 hover:bg-gray-50'
              }
            `}
          >
            <input {...getInputProps()} />
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            {isDragActive ? (
              <p className="text-blue-600 font-medium">Drop files here...</p>
            ) : (
              <div>
                <p className="text-gray-600 font-medium">Drag & drop files here, or click to select</p>
                <p className="text-sm text-gray-500 mt-2">Supports PDF, images, and text files (max 5 files)</p>
              </div>
            )}
          </div>

          {/* Uploaded Files */}
          {uploadedFiles.length > 0 && (
            <div className="mt-4 space-y-2">
              {uploadedFiles.map((file) => (
                <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    {file.type.startsWith('image/') ? (
                      <Image className="w-5 h-5 text-blue-500" />
                    ) : (
                      <FileText className="w-5 h-5 text-green-500" />
                    )}
                    <div>
                      <p className="text-sm font-medium text-gray-900">{file.name}</p>
                      <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFile(file.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <AlertCircle className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Process Button */}
      <motion.div 
        className="text-center mt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <button
          onClick={handleProcessClaim}
          disabled={!canProcess}
          className={`
            btn-primary text-lg px-8 py-4 disabled:opacity-50 disabled:cursor-not-allowed
            ${isProcessing ? 'bg-blue-400' : ''}
          `}
        >
          {isProcessing ? (
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 animate-spin" />
              <span>Processing...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Play className="w-5 h-5" />
              <span>Process FNOL</span>
            </div>
          )}
        </button>
      </motion.div>

      {/* Processing Steps */}
      {isProcessing && (
        <motion.div 
          className="mt-8 card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
            <Clock className="w-5 h-5 text-blue-600" />
            <span>Processing Steps</span>
          </h3>
          
          <div className="space-y-3">
            {processingSteps.map((step, index) => (
              <div key={index} className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-success-500" />
                <span className="text-sm text-gray-700">{step}</span>
              </div>
            ))}
            
            {currentStep && !processingSteps.includes(currentStep) && (
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm text-blue-600 font-medium">{currentStep}</span>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </motion.div>
  )
} 