# Claims Fast Lane Demo Instructions

## 🎯 **Quick Demo Setup**

### Step 1: Copy Sample Email
Choose one of these sample emails from `sample-emails.md`:

**For Auto Collision Demo (Recommended):**
```
Hi,

I was rear-ended at the intersection of Main Street and Oak Avenue on December 15, 2023 around 3:30 PM. The other driver ran a red light and hit my 2019 Honda Accord. 

My car has significant damage to the rear bumper and trunk. The police came to the scene and filed a report (attached). I also took photos of the damage and got a repair estimate from Quality Auto Body Shop.

The other driver's insurance is State Farm, policy #SF789012. Officer Johnson handled the scene and said it was clearly the other driver's fault.

I need to get my car repaired as soon as possible as I use it for work. Please let me know what information you need from me.

My policy number is 123456789 and my phone is (555) 123-4567.

Thanks,
John Smith
john.smith@email.com
```

### Step 2: Prepare Attachments
Use these sample files as attachments:

1. **Police Report**: `sample-police-report.txt` 
   - Rename to: `Police_Report_PR-2023-1215-001.txt`
   - Shows clear fault determination

2. **Repair Estimate**: `sample-repair-estimate.txt`
   - Rename to: `Auto_Repair_Estimate_Honda_Accord.txt` 
   - Professional estimate with detailed breakdown

3. **Damage Photos**: `sample-damage-description.txt`
   - Rename to: `Damage_Photos_Description.txt`
   - Represents photo documentation

### Step 3: Run the Demo

1. **Open** `http://localhost:3000` in your browser
2. **Paste** the sample email into the FNOL Email Content field
3. **Upload** the 3 sample files (drag & drop or click to select)
4. **Click** "Process FNOL" button
5. **Watch** the AI agents process the claim in real-time

### Step 4: Navigate Through Stages

**Review Stage:**
- Click on extracted fields to see evidence sources
- Review policy clause matches with similarity scores
- Note confidence badges for each field

**Decision Stage:**
- Review the assembled decision pack
- Click "Create Draft in Core System"
- Click "Send Customer Acknowledgment" 
- Download the decision pack

**Dashboard Stage:**
- View operational metrics and KPIs
- See processing time and auto-population rates
- Review governance and compliance policies

## 🎬 **Executive Demo Script**

### Opening (30 seconds)
"This is Claims Fast Lane - our AI-powered autonomous claims orchestrator. It processes messy FNOL emails into structured claims with complete explainability. Let me show you a real example."

### Ingestion (1 minute)  
"I'm pasting an actual FNOL email about a rear-end collision. Notice how messy and unstructured it is. Now I'll upload the attachments - a police report, repair estimate, and damage photos. Watch as our AI orchestrates multiple agents to process this claim."

### Processing (30 seconds)
"See the real-time agent timeline - ingestion, document classification, field extraction, policy grounding, and decision assembly. Each step is audited with timing and model versions."

### Review (2 minutes)
"Now we're in the explainability hub. Every extracted field has evidence you can click to see the exact source. Notice the confidence scores - anything below 70% gets flagged for human review. The policy grounding shows matched clauses with similarity scores from our vector database."

### Decision (1 minute)
"The decision pack assembles everything - claim summary, evidence links, policy grounding, and complete audit trail. I can create a draft in our core system and send an AI-generated acknowledgment that's grounded in the extracted facts."

### Dashboard (1 minute)
"Finally, our ops dashboard shows the power of automation - average handle time, auto-population rates, and governance controls. Notice we never auto-deny claims and maintain complete auditability."

### Closing (30 seconds)
"From chaos to structure in under 5 minutes, with complete explainability and human oversight. This is the future of claims processing."

## 🔧 **Customization Tips**

### Different Claim Types
- Use the property damage email for water claims
- Try the commercial claim for business coverage
- Modify policy numbers to test different scenarios

### Testing Edge Cases
- Remove policy number to test fallback behavior
- Use unclear descriptions to see confidence scoring
- Upload different file types to test classification

### Performance Metrics
- The system tracks auto-population rates
- Confidence thresholds can be adjusted
- Override rates show human intervention needs

## 📊 **Key Demo Points**

### Technical Excellence
- ✅ Real-time processing with visible agent orchestration
- ✅ Type-safe TypeScript implementation  
- ✅ Modern React/Next.js architecture
- ✅ Responsive design with smooth animations

### Business Value
- ✅ Instant structure from chaos
- ✅ Complete explainability for compliance
- ✅ Human oversight with guardrails
- ✅ Operational metrics for continuous improvement

### Enterprise Ready
- ✅ Audit trails for every decision
- ✅ Configurable confidence thresholds
- ✅ PII protection and masking
- ✅ Governance policies built-in

## 🚀 **Next Steps**

After the demo, discuss:
1. Integration with existing claims systems
2. Training on company-specific policy corpus
3. Customization for different lines of business
4. Scaling and deployment architecture
5. ROI projections and implementation timeline

---

**The Claims Fast Lane demo is ready to showcase the future of autonomous claims processing!**