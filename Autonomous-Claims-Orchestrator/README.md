# Claims Fast Lane - Autonomous Claims Orchestrator

An AI-powered insurance claims processing system featuring real LangGraph agents and OpenAI integration.

## 🚀 Features

### Real AI Integration
- **LangGraph Multi-Agent System**: 4 specialized agents working in orchestrated workflow
- **OpenAI GPT-4 Integration**: Real AI-powered field extraction and document classification
- **Fallback Processing**: Graceful degradation to rule-based processing when AI is unavailable
- **Policy RAG System**: Intelligent policy clause matching with similarity scoring

### Enterprise UI
- **Modern Next.js Interface**: Clean, responsive design with Tailwind CSS
- **Real-time Processing**: Live progress tracking with detailed audit trails
- **Evidence Linking**: Click any extracted field to see source evidence
- **Policy Grounding**: Explainable policy clause matches with confidence scores

### Demo Data
- **3 Complete Scenarios**: Auto collision, property water damage, commercial liability
- **Realistic Documents**: Police reports, repair estimates, medical records, incident reports
- **End-to-End Testing**: Complete FNOL emails with attachments for each scenario

## 🛠 Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, Framer Motion
- **AI Framework**: LangGraph (TypeScript), OpenAI GPT-4
- **Components**: shadcn/ui, Lucide React, Recharts
- **Processing**: Real multi-agent orchestration with typed state management

## 🚀 Quick Start

### 1. Installation
```bash
git clone <repository-url>
cd Autonomous-Claims-Orchestrator
npm install
```

### 2. Configuration
Either:
- **Option A**: Click the settings gear in the app header to configure your OpenAI API key
- **Option B**: Create a `.env.local` file:
```bash
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4-1106-preview
```

### 3. Run the Application
```bash
npm run dev
```
Visit `http://localhost:3000`

## 🎮 Using the Demo

### Demo Modes

#### 🤖 AI Mode (With OpenAI API Key)
- Real GPT-4 powered field extraction
- Intelligent document classification
- Advanced policy clause matching
- High accuracy confidence scoring

#### ⚡ Demo Mode (No API Key)
- Rule-based extraction and classification
- Faster processing with simulated results
- Perfect for demonstrations and UI testing

### Available Test Scenarios

#### 1. Auto Collision Claim
**Location**: `demo-data/scenarios/auto-collision/`
- Rear-end collision at intersection
- Police report + repair estimate + damage photos
- Tests: Vehicle info extraction, collision coverage matching

#### 2. Property Water Damage
**Location**: `demo-data/scenarios/property-water-damage/`
- Storm damage causing roof leak
- Emergency repair invoice + water extraction estimate
- Tests: Property damage assessment, storm coverage

#### 3. Commercial Liability
**Location**: `demo-data/scenarios/commercial-liability/`
- Restaurant slip and fall incident
- Incident report + medical records
- Tests: Liability coverage, medical payment processing

### Testing Steps
1. **Ingest**: Copy email content from scenario folder, drag-drop attachment files
2. **Review**: Examine extracted fields, click for evidence, review policy matches
3. **Decision**: See assembled decision pack, trigger mock actions
4. **Dashboard**: View processing metrics and compliance information

## 🏗 Architecture

### LangGraph Agent Workflow
```
Ingestion Agent → Extraction Agent → Policy Agent → Assembler Agent
     ↓               ↓                ↓              ↓
  OCR/Classify    Extract Fields   RAG Search    Decision Pack
```

### Agent Responsibilities

1. **Ingestion Agent**
   - Email normalization
   - Document OCR simulation
   - AI-powered document classification

2. **Extraction Agent**
   - Structured field extraction using OpenAI
   - Evidence generation with source linking
   - Confidence scoring and validation

3. **Policy Agent**
   - RAG-based policy clause search
   - Similarity scoring and ranking
   - Coverage determination

4. **Assembler Agent**
   - Decision pack assembly
   - Risk assessment
   - Recommendation generation

### Data Flow
```
FNOL Email + Attachments
    ↓
Multi-Agent Processing
    ↓
Structured Claim Data + Evidence + Policy Matches
    ↓
Decision Pack + Audit Trail
```

## 🔧 Configuration Options

### OpenAI Integration
- **Model**: Configure GPT model (default: gpt-4-1106-preview)
- **Temperature**: Adjust randomness (default: 0.1 for consistency)
- **Timeout**: API call timeout (default: 30 seconds)
- **Retries**: Max retry attempts (default: 2)

### Processing Tuning
- **Confidence Threshold**: Minimum confidence for auto-processing (default: 0.6)
- **Field Masking**: PII protection settings (emails, phones, policy numbers)
- **Policy Scoring**: RAG similarity thresholds

## 📊 Features Demonstrated

### AI Capabilities
- ✅ Real-time field extraction from unstructured text
- ✅ Document type classification with confidence scoring  
- ✅ Policy clause matching using semantic search
- ✅ Evidence linking and source attribution
- ✅ Risk assessment and recommendation generation

### Enterprise Features
- ✅ PII masking and data protection
- ✅ Comprehensive audit trails
- ✅ Confidence-based processing decisions
- ✅ Human-in-the-loop workflow design
- ✅ Graceful error handling and fallbacks

### UX Excellence
- ✅ Real-time processing visualization
- ✅ Interactive evidence exploration
- ✅ Policy clause explainability
- ✅ Mobile-responsive design
- ✅ Accessibility considerations

## 🔍 Monitoring & Observability

### Real-time Metrics
- Processing time per agent
- Field extraction accuracy
- Policy match confidence
- Error rates and fallback usage

### Audit Trail
- Complete processing history
- Agent execution times
- Model versions used
- Fallback events

### Compliance Features
- PII masking logs
- Processing decision rationale
- Evidence preservation
- Regulatory reporting readiness

## 🛡 Security & Privacy

### Data Protection
- Automatic PII masking (emails, phones, policy numbers)
- No raw customer data in vector stores
- Configurable redaction rules
- Secure API key handling

### Compliance
- Complete audit trails
- Evidence preservation
- Processing transparency
- Regulatory alignment

## 🚀 Production Considerations

### Scaling
- Stateless agent design for horizontal scaling
- Configurable timeouts and retry logic
- Resource-efficient processing
- Graceful degradation capabilities

### Integration
- RESTful API endpoints
- Webhook support for external systems
- Standard data formats (JSON)
- Event-driven architecture ready

### Monitoring
- Health check endpoints
- Performance metrics
- Error tracking
- Business intelligence integration

## 📝 License

This is a demonstration project showcasing AI-powered claims processing capabilities.

## 🤝 Contributing

This project demonstrates enterprise-grade AI implementation patterns for insurance technology.