# Claims Fast Lane Demo Scenarios

This folder contains realistic demo data organized by claim type. Each scenario includes a complete FNOL email and supporting attachments.

## Available Scenarios

### 1. Auto Collision (`auto-collision/`)
**Scenario**: Passenger side vehicle damage from intersection collision
- **Email**: FNOL submission from Sarah Johnson 
- **Attachments**:
  - `police-report.txt` - Official police incident report
  - `repair-estimate.txt` - Auto body shop damage estimate 
  - `damage-photos.txt` - Description of vehicle damage photos

### 2. Property Water Damage (`property-water-damage/`)
**Scenario**: Storm damage causing roof leak and interior water damage
- **Email**: FNOL submission from Robert Chen
- **Attachments**:
  - `emergency-invoice.txt` - Emergency roof repair invoice
  - `water-extraction-estimate.txt` - Water damage restoration estimate

### 3. Commercial Liability (`commercial-liability/`)
**Scenario**: Slip and fall incident at restaurant
- **Email**: FNOL submission from restaurant owner Antonio Martinez
- **Attachments**:
  - `incident-report.txt` - Business incident report
  - `medical-report.txt` - Hospital emergency department report

## How to Use Demo Data

### Option 1: Copy and Paste
1. Navigate to the scenario folder you want to test
2. Open the `email.txt` file and copy the entire content
3. In the Claims Fast Lane app, paste this content into the email field
4. For attachments, create text files with the content from the `attachments/` folder

### Option 2: File Upload Simulation
1. Create local text files using the content from the attachments folder
2. Use the drag-and-drop interface to upload these files
3. The system will classify and process them automatically

## Testing Different AI Modes

### Demo Mode (No OpenAI API Key)
- Uses rule-based extraction and classification
- Faster processing with simulated results
- Good for demonstrations and testing UI flow

### AI Mode (With OpenAI API Key)
- Real GPT-4 powered field extraction
- Intelligent document classification
- Advanced policy clause matching
- More accurate confidence scoring

## Expected Processing Results

### Auto Collision Claims
- **Loss Type**: Collision
- **Key Fields**: Policy number, vehicle info, damage estimate, police report details
- **Policy Matches**: Collision coverage, deductible clauses
- **Processing Time**: 3-5 seconds

### Property Water Damage Claims
- **Loss Type**: Water
- **Key Fields**: Property address, storm details, repair costs
- **Policy Matches**: Water damage coverage, storm damage clauses
- **Processing Time**: 3-5 seconds

### Commercial Liability Claims
- **Loss Type**: Liability
- **Key Fields**: Business info, incident details, medical information
- **Policy Matches**: Premises liability, medical payments coverage
- **Processing Time**: 3-5 seconds

## Quality Indicators

Watch for these indicators of successful processing:

✅ **High Confidence (80%+)**
- Policy numbers extracted correctly
- Dates and amounts parsed accurately
- Document types classified properly

⚠️ **Medium Confidence (60-80%)**
- Some manual verification needed
- Partial field extraction
- Ambiguous document content

❌ **Low Confidence (<60%)**
- Requires manual review
- Missing critical information
- Poor document quality

## Pro Tips

1. **Mix Scenarios**: Try processing different claim types in sequence to see how the system adapts
2. **Check Evidence**: Click on extracted fields to see the evidence highlighting
3. **Review Policy Hits**: Examine similarity scores and rationales for policy clause matches
4. **Monitor Audit Trail**: Watch the real-time processing steps in the audit timeline
5. **Use Real OpenAI**: Configure your OpenAI API key for the most realistic results

## Troubleshooting

- **No Extraction Results**: Check that email content is properly pasted
- **Low Confidence Scores**: Try using more detailed demo data
- **Processing Errors**: Ensure all file attachments are text-based for the demo
- **OpenAI Issues**: Verify API key is correctly configured in settings