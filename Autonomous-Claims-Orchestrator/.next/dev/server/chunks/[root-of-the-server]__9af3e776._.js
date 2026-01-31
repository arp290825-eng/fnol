module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[project]/Autonomous-Claims-Orchestrator/lib/ingestedClaims.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "clearAllIngestedClaims",
    ()=>clearAllIngestedClaims,
    "extractPolicyNumber",
    ()=>extractPolicyNumber,
    "getAllIngestedClaims",
    ()=>getAllIngestedClaims,
    "getIngestedClaimById",
    ()=>getIngestedClaimById,
    "getPolicyNumbers",
    ()=>getPolicyNumbers,
    "readAttachmentContent",
    ()=>readAttachmentContent,
    "saveIngestedClaim",
    ()=>saveIngestedClaim
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/fs [external] (fs, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
;
;
const DATA_DIR = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), 'data');
const INGESTED_DIR = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(DATA_DIR, 'ingested-attachments');
const CLAIMS_FILE = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(DATA_DIR, 'ingested-claims.json');
function ensureDataDir() {
    if (!__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].existsSync(DATA_DIR)) {
        __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].mkdirSync(DATA_DIR, {
            recursive: true
        });
    }
    if (!__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].existsSync(INGESTED_DIR)) {
        __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].mkdirSync(INGESTED_DIR, {
            recursive: true
        });
    }
}
function getClaimsData() {
    ensureDataDir();
    if (!__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].existsSync(CLAIMS_FILE)) {
        return [];
    }
    try {
        const content = __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].readFileSync(CLAIMS_FILE, 'utf-8');
        return JSON.parse(content);
    } catch  {
        return [];
    }
}
function saveClaimsData(claims) {
    ensureDataDir();
    __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].writeFileSync(CLAIMS_FILE, JSON.stringify(claims, null, 2), 'utf-8');
}
function extractPolicyNumber(emailBody) {
    const patterns = [
        /policy\s*#?\s*:?\s*([A-Z0-9]{6,})/i,
        /policy\s*number\s*:?\s*([A-Z0-9]{6,})/i,
        /Policy\s*#([A-Z0-9]+)/i,
        /#([A-Z]{2}\d{6,})/,
        /\b([A-Z]{2}\d{6,})\b/
    ];
    for (const pattern of patterns){
        const match = emailBody.match(pattern);
        if (match && match[1]) {
            return match[1];
        }
    }
    return null;
}
function saveIngestedClaim(from, to, subject, emailBody, attachmentFiles, source = 'sendgrid') {
    const policyNumber = extractPolicyNumber(emailBody) || extractPolicyNumber(subject) || 'UNKNOWN';
    const claimId = `ING-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    ensureDataDir();
    const claimDir = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(INGESTED_DIR, claimId);
    __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].mkdirSync(claimDir, {
        recursive: true
    });
    const attachments = [];
    for (const file of attachmentFiles){
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
        const filePath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(claimDir, safeName);
        __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].writeFileSync(filePath, file.buffer);
        attachments.push({
            name: file.name,
            path: filePath,
            size: file.buffer.length,
            mimeType: file.mimeType || 'application/octet-stream'
        });
    }
    const claim = {
        id: claimId,
        policyNumber,
        from,
        to,
        subject,
        emailBody,
        attachments,
        createdAt: new Date().toISOString(),
        source
    };
    const claims = getClaimsData();
    claims.unshift(claim);
    saveClaimsData(claims);
    return claim;
}
function getAllIngestedClaims() {
    let claims = getClaimsData();
    if (claims.length === 0) {
        seedDemoClaims();
        claims = getClaimsData();
    }
    const hasRealClaims = claims.some((c)=>c.source === 'imap' || c.source === 'sendgrid');
    if (hasRealClaims) {
        return claims.filter((c)=>c.source !== 'demo');
    }
    return claims;
}
function getIngestedClaimById(id) {
    const claims = getClaimsData();
    return claims.find((c)=>c.id === id) || null;
}
function getPolicyNumbers() {
    let claims = getClaimsData();
    if (claims.length === 0) {
        seedDemoClaims();
        claims = getClaimsData();
    }
    const hasRealClaims = claims.some((c)=>c.source === 'imap' || c.source === 'sendgrid');
    const toShow = hasRealClaims ? claims.filter((c)=>c.source !== 'demo') : claims;
    return toShow.map((c)=>({
            id: c.id,
            policyNumber: c.policyNumber,
            subject: c.subject
        }));
}
/** Seed demo claims from scenarios folder when no claims exist */ function seedDemoClaims() {
    const scenariosDir = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), 'demo-data', 'scenarios');
    if (!__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].existsSync(scenariosDir)) return;
    const scenarios = [
        {
            folder: 'auto-collision',
            policyNumber: 'AC789456123',
            from: 'sarah.johnson@email.com',
            to: 'pranay.nath@aimill.in',
            subject: 'Car Accident Claim - Policy #AC789456123'
        },
        {
            folder: 'commercial-liability',
            policyNumber: 'CL789012345',
            from: 'antonio.martinez@tonysrestaurant.com',
            to: 'pranay.nath@aimill.in',
            subject: 'Commercial Liability Claim - Slip and Fall - Policy #CL789012345'
        },
        {
            folder: 'property-water-damage',
            policyNumber: 'HO456789234',
            from: 'robert.chen@email.com',
            to: 'pranay.nath@aimill.in',
            subject: 'Urgent - Water Damage Claim - Policy #HO456789234'
        }
    ];
    const claims = [];
    const baseTime = Date.now() - 86400000 * 2;
    for(let i = 0; i < scenarios.length; i++){
        const s = scenarios[i];
        const emailPath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(scenariosDir, s.folder, 'email.txt');
        const attachmentsDir = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(scenariosDir, s.folder, 'attachments');
        if (!__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].existsSync(emailPath)) continue;
        const emailBody = __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].readFileSync(emailPath, 'utf-8');
        const claimId = `DEMO-${s.policyNumber}-${i}`;
        const claimDir = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(INGESTED_DIR, claimId);
        __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].mkdirSync(claimDir, {
            recursive: true
        });
        const attachments = [];
        if (__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].existsSync(attachmentsDir)) {
            for (const file of __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].readdirSync(attachmentsDir)){
                const srcPath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(attachmentsDir, file);
                if (__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].statSync(srcPath).isFile()) {
                    const destPath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(claimDir, file);
                    __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].copyFileSync(srcPath, destPath);
                    attachments.push({
                        name: file,
                        path: destPath,
                        size: __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].statSync(destPath).size,
                        mimeType: 'text/plain'
                    });
                }
            }
        }
        claims.push({
            id: claimId,
            policyNumber: s.policyNumber,
            from: s.from,
            to: s.to,
            subject: s.subject,
            emailBody,
            attachments,
            createdAt: new Date(baseTime + i * 3600000).toISOString(),
            source: 'demo'
        });
    }
    if (claims.length > 0) {
        saveClaimsData(claims);
    }
}
function clearAllIngestedClaims() {
    ensureDataDir();
    if (__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].existsSync(CLAIMS_FILE)) __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].unlinkSync(CLAIMS_FILE);
    if (__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].existsSync(INGESTED_DIR)) {
        for (const entry of __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].readdirSync(INGESTED_DIR, {
            withFileTypes: true
        })){
            const fullPath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(INGESTED_DIR, entry.name);
            if (entry.isDirectory()) {
                __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].rmSync(fullPath, {
                    recursive: true
                });
            }
        }
    }
}
function readAttachmentContent(claimId, attachmentName) {
    const claim = getIngestedClaimById(claimId);
    if (!claim) throw new Error('Claim not found');
    const att = claim.attachments.find((a)=>a.name === attachmentName);
    if (!att || !__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].existsSync(att.path)) throw new Error('Attachment not found');
    const ext = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].extname(att.name).toLowerCase();
    if ([
        '.txt',
        '.csv',
        '.log'
    ].includes(ext)) {
        return __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].readFileSync(att.path, 'utf-8');
    }
    return `[Document: ${att.name} - content extracted for processing]`;
}
}),
"[project]/Autonomous-Claims-Orchestrator/lib/services/openai.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "OpenAIService",
    ()=>OpenAIService,
    "openaiService",
    ()=>openaiService
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$openai$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Autonomous-Claims-Orchestrator/node_modules/openai/index.mjs [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$openai$2f$client$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__OpenAI__as__default$3e$__ = __turbopack_context__.i("[project]/Autonomous-Claims-Orchestrator/node_modules/openai/client.mjs [app-route] (ecmascript) <export OpenAI as default>");
;
// Initialize OpenAI client
const openai = new __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$openai$2f$client$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__OpenAI__as__default$3e$__["default"]({
    apiKey: process.env.OPENAI_API_KEY || '',
    dangerouslyAllowBrowser: true // For demo purposes - in production, use server-side API routes
});
class OpenAIService {
    model;
    temperature;
    constructor(model = 'gpt-4-1106-preview', temperature = 0.1){
        this.model = model;
        this.temperature = temperature;
    }
    async callLLM(prompt, systemPrompt, functions) {
        try {
            const messages = [];
            if (systemPrompt) {
                messages.push({
                    role: 'system',
                    content: systemPrompt
                });
            }
            messages.push({
                role: 'user',
                content: prompt
            });
            const requestConfig = {
                model: this.model,
                messages,
                temperature: this.temperature,
                max_tokens: 2000
            };
            // Add function calling if functions are provided
            if (functions && functions.length > 0) {
                requestConfig.functions = functions;
                requestConfig.function_call = 'auto';
            }
            const response = await openai.chat.completions.create(requestConfig);
            const choice = response.choices[0];
            if (!choice) {
                throw new Error('No response from OpenAI');
            }
            const result = {
                content: choice.message?.content || ''
            };
            // Handle function calls
            if (choice.message?.function_call) {
                result.functionCalls = [
                    {
                        name: choice.message.function_call.name,
                        arguments: JSON.parse(choice.message.function_call.arguments || '{}')
                    }
                ];
            }
            return result;
        } catch (error) {
            console.error('OpenAI API call failed:', error);
            throw new Error(`OpenAI API call failed: ${error}`);
        }
    }
    async extractClaimFields(emailText, documents) {
        const systemPrompt = `You are an expert insurance claims processor. Extract structured claim information from the provided email and documents. Be precise and only extract information that is explicitly stated or can be confidently inferred.`;
        const prompt = `Extract claim fields from this FNOL email and attachments:

EMAIL:
${emailText}

DOCUMENTS:
${documents.join('\n\n---\n\n')}

Extract the following fields if present:
- policyNumber: Insurance policy number
- claimantName: Name of the person filing the claim
- contactEmail: Contact email address
- contactPhone: Contact phone number
- lossDate: Date when the loss occurred (YYYY-MM-DD format)
- lossType: Type of loss (Collision, Water, Fire, Theft, Liability, Other)
- lossLocation: Where the loss occurred
- description: Brief description of what happened
- vehicleInfo: If auto claim - year, make, model, license plate
- propertyAddress: If property claim - property address
- estimatedDamage: Estimated damage amount if mentioned

Return ONLY a JSON object with the extracted fields. Use null for missing fields.`;
        const functions = [
            {
                name: 'extract_claim_fields',
                description: 'Extract structured claim information from email and documents',
                parameters: {
                    type: 'object',
                    properties: {
                        policyNumber: {
                            type: 'string',
                            description: 'Insurance policy number'
                        },
                        claimantName: {
                            type: 'string',
                            description: 'Name of claimant'
                        },
                        contactEmail: {
                            type: 'string',
                            description: 'Contact email'
                        },
                        contactPhone: {
                            type: 'string',
                            description: 'Contact phone number'
                        },
                        lossDate: {
                            type: 'string',
                            description: 'Loss date in YYYY-MM-DD format'
                        },
                        lossType: {
                            type: 'string',
                            enum: [
                                'Collision',
                                'Water',
                                'Fire',
                                'Theft',
                                'Liability',
                                'Other'
                            ],
                            description: 'Type of loss'
                        },
                        lossLocation: {
                            type: 'string',
                            description: 'Location where loss occurred'
                        },
                        description: {
                            type: 'string',
                            description: 'Description of what happened'
                        },
                        vehicleInfo: {
                            type: 'object',
                            properties: {
                                year: {
                                    type: 'string'
                                },
                                make: {
                                    type: 'string'
                                },
                                model: {
                                    type: 'string'
                                },
                                licensePlate: {
                                    type: 'string'
                                }
                            },
                            description: 'Vehicle information for auto claims'
                        },
                        propertyAddress: {
                            type: 'string',
                            description: 'Property address for property claims'
                        },
                        estimatedDamage: {
                            type: 'number',
                            description: 'Estimated damage amount'
                        }
                    },
                    required: []
                }
            }
        ];
        const response = await this.callLLM(prompt, systemPrompt, functions);
        if (response.functionCalls && response.functionCalls.length > 0) {
            return response.functionCalls[0].arguments;
        }
        // Fallback: try to parse JSON from content
        try {
            return JSON.parse(response.content);
        } catch  {
            throw new Error('Failed to extract structured claim fields from LLM response');
        }
    }
    async classifyDocument(filename, content) {
        const systemPrompt = `You are a document classification expert for insurance claims. Classify the document type and extract key fields.`;
        const prompt = `Classify this document and extract key information:

FILENAME: ${filename}
CONTENT:
${content.substring(0, 2000)}...

Classify the document type as one of:
- PoliceReport
- RepairEstimate  
- Invoice
- MedicalRecord
- IncidentReport
- DamagePhoto
- Other

Also extract relevant key fields based on the document type.`;
        const functions = [
            {
                name: 'classify_document',
                description: 'Classify document type and extract key fields',
                parameters: {
                    type: 'object',
                    properties: {
                        type: {
                            type: 'string',
                            enum: [
                                'PoliceReport',
                                'RepairEstimate',
                                'Invoice',
                                'MedicalRecord',
                                'IncidentReport',
                                'DamagePhoto',
                                'Other'
                            ],
                            description: 'Document type classification'
                        },
                        confidence: {
                            type: 'number',
                            minimum: 0,
                            maximum: 1,
                            description: 'Confidence score for classification'
                        },
                        keyFields: {
                            type: 'object',
                            description: 'Key fields extracted from the document'
                        }
                    },
                    required: [
                        'type',
                        'confidence',
                        'keyFields'
                    ]
                }
            }
        ];
        const response = await this.callLLM(prompt, systemPrompt, functions);
        if (response.functionCalls && response.functionCalls.length > 0) {
            const args = response.functionCalls[0].arguments;
            return {
                type: args.type || 'Other',
                confidence: args.confidence || 0.5,
                keyFields: args.keyFields || {}
            };
        }
        // Fallback classification
        return {
            type: 'Other',
            confidence: 0.5,
            keyFields: {}
        };
    }
    async generateFieldEvidence(fieldName, value, emailText, documents) {
        const systemPrompt = `You are an evidence analyst for insurance claims. Identify the source and rationale for extracted field values.`;
        const prompt = `Analyze the evidence for this extracted field:

FIELD: ${fieldName}
VALUE: ${value}

SOURCE TEXT:
EMAIL: ${emailText}

DOCUMENTS:
${documents.join('\n\n---\n\n')}

Provide:
1. Confidence score (0-1) for this field extraction
2. Source locator (where in the text this value was found)
3. Brief rationale explaining why this value was extracted`;
        const functions = [
            {
                name: 'analyze_field_evidence',
                description: 'Analyze evidence for extracted field',
                parameters: {
                    type: 'object',
                    properties: {
                        confidence: {
                            type: 'number',
                            minimum: 0,
                            maximum: 1,
                            description: 'Confidence score for field extraction'
                        },
                        sourceLocator: {
                            type: 'string',
                            description: 'Location where value was found (e.g., email_text:100-150, doc1:50-75)'
                        },
                        rationale: {
                            type: 'string',
                            description: 'Brief explanation of why this value was extracted'
                        }
                    },
                    required: [
                        'confidence',
                        'sourceLocator',
                        'rationale'
                    ]
                }
            }
        ];
        const response = await this.callLLM(prompt, systemPrompt, functions);
        if (response.functionCalls && response.functionCalls.length > 0) {
            const args = response.functionCalls[0].arguments;
            return {
                confidence: args.confidence || 0.7,
                sourceLocator: args.sourceLocator || 'text_inference',
                rationale: args.rationale || 'Inferred from document context'
            };
        }
        // Fallback evidence
        return {
            confidence: 0.7,
            sourceLocator: 'text_inference',
            rationale: 'Inferred from document context'
        };
    }
    async queryPolicyDatabase(lossType, description, extractedFields) {
        const systemPrompt = `You are a policy database search expert. Given claim information, identify the most relevant policy clauses.`;
        const prompt = `Find relevant policy clauses for this claim:

LOSS TYPE: ${lossType}
DESCRIPTION: ${description}
EXTRACTED FIELDS: ${JSON.stringify(extractedFields, null, 2)}

Based on this information, identify which of these policy clauses are most relevant:

AUTO INSURANCE:
- AUTO-COL-001: Collision Coverage - covers vehicle collisions
- AUTO-LIAB-001: Bodily Injury Liability - covers injury to others
- AUTO-PD-001: Property Damage Liability - covers damage to others' property

HOMEOWNERS:
- HO-WATER-001: Water Damage Coverage - covers sudden water damage
- HO-STORM-001: Wind and Hail Coverage - covers storm damage

COMMERCIAL LIABILITY:
- CGL-SLIP-001: Premises Liability Coverage - covers slip and fall
- CGL-MED-001: Medical Payments Coverage - covers medical expenses

Return the top 3 most relevant clauses with similarity scores.`;
        const functions = [
            {
                name: 'query_policy_clauses',
                description: 'Find relevant policy clauses for the claim',
                parameters: {
                    type: 'object',
                    properties: {
                        relevantClauses: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    clauseId: {
                                        type: 'string',
                                        description: 'Policy clause ID'
                                    },
                                    title: {
                                        type: 'string',
                                        description: 'Clause title'
                                    },
                                    similarity: {
                                        type: 'number',
                                        minimum: 0,
                                        maximum: 1,
                                        description: 'Similarity score to the claim'
                                    },
                                    rationale: {
                                        type: 'string',
                                        description: 'Why this clause is relevant'
                                    }
                                },
                                required: [
                                    'clauseId',
                                    'title',
                                    'similarity',
                                    'rationale'
                                ]
                            },
                            maxItems: 3
                        }
                    },
                    required: [
                        'relevantClauses'
                    ]
                }
            }
        ];
        const response = await this.callLLM(prompt, systemPrompt, functions);
        if (response.functionCalls && response.functionCalls.length > 0) {
            return response.functionCalls[0].arguments.relevantClauses || [];
        }
        return [];
    }
    async summarizeProcessing(extractedFields, documents, policyHits) {
        const systemPrompt = `You are a claims processing supervisor. Summarize the automated processing results and provide recommendations.`;
        const prompt = `Summarize this automated claim processing:

EXTRACTED FIELDS:
${JSON.stringify(extractedFields, null, 2)}

DOCUMENTS PROCESSED: ${documents.length}
DOCUMENT TYPES: ${documents.map((d)=>d.type).join(', ')}

POLICY HITS: ${policyHits.length}
TOP POLICY MATCH: ${policyHits[0]?.title || 'None'}

Provide:
1. A brief summary of the claim
2. Recommendations for next steps
3. Any risk flags or concerns`;
        const functions = [
            {
                name: 'summarize_claim_processing',
                description: 'Summarize claim processing results',
                parameters: {
                    type: 'object',
                    properties: {
                        summary: {
                            type: 'string',
                            description: 'Brief summary of the claim and processing'
                        },
                        recommendations: {
                            type: 'array',
                            items: {
                                type: 'string'
                            },
                            description: 'Recommended next steps'
                        },
                        riskFlags: {
                            type: 'array',
                            items: {
                                type: 'string'
                            },
                            description: 'Risk flags or concerns identified'
                        }
                    },
                    required: [
                        'summary',
                        'recommendations',
                        'riskFlags'
                    ]
                }
            }
        ];
        const response = await this.callLLM(prompt, systemPrompt, functions);
        if (response.functionCalls && response.functionCalls.length > 0) {
            const args = response.functionCalls[0].arguments;
            return {
                summary: args.summary || 'Claim processed automatically with extracted information.',
                recommendations: args.recommendations || [
                    'Review extracted information',
                    'Verify policy coverage'
                ],
                riskFlags: args.riskFlags || []
            };
        }
        return {
            summary: 'Claim processed automatically with extracted information.',
            recommendations: [
                'Review extracted information',
                'Verify policy coverage'
            ],
            riskFlags: []
        };
    }
}
const openaiService = new OpenAIService();
}),
"[project]/Autonomous-Claims-Orchestrator/lib/agents/nodes/ingestionAgent.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "IngestionAgent",
    ()=>IngestionAgent
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$lib$2f$services$2f$openai$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Autonomous-Claims-Orchestrator/lib/services/openai.ts [app-route] (ecmascript)");
;
class IngestionAgent {
    async execute(state, config) {
        const startTime = Date.now();
        try {
            // Log ingestion start
            const auditEvent = {
                step: 'ingestion',
                timestamp: new Date().toISOString(),
                duration: 0,
                agent: 'IngestionAgent',
                status: 'started',
                details: {
                    emailLength: state.emailText.length,
                    fileCount: state.files.length,
                    files: state.files.map((f)=>({
                            name: f.name,
                            size: f.size,
                            type: f.mimeType
                        }))
                }
            };
            // Normalize email text
            const normalizedEmail = this.normalizeEmailText(state.emailText);
            // Process and classify attachments
            const documents = await this.processAttachments(state.files);
            // Extract basic metadata
            const metadata = this.extractEmailMetadata(normalizedEmail);
            const duration = Date.now() - startTime;
            return {
                currentStep: 'Document Classification',
                documents,
                auditEvents: [
                    ...state.auditEvents,
                    {
                        ...auditEvent,
                        duration,
                        status: 'completed',
                        details: {
                            ...auditEvent.details,
                            documentsProcessed: documents.length,
                            metadata
                        }
                    }
                ]
            };
        } catch (error) {
            const duration = Date.now() - startTime;
            return {
                errors: [
                    ...state.errors,
                    `Ingestion failed: ${error}`
                ],
                auditEvents: [
                    ...state.auditEvents,
                    {
                        step: 'ingestion',
                        timestamp: new Date().toISOString(),
                        duration,
                        agent: 'IngestionAgent',
                        status: 'failed',
                        details: {
                            error: String(error)
                        }
                    }
                ]
            };
        }
    }
    normalizeEmailText(emailText) {
        // Remove forwarding headers, normalize whitespace
        return emailText.replace(/^(From:|To:|Subject:|Date:).*$/gm, '') // Remove headers
        .replace(/\s+/g, ' ') // Normalize whitespace
        .trim();
    }
    async processAttachments(files) {
        const documents = [];
        for (const file of files){
            // Simulate OCR/text extraction
            const extractedText = await this.simulateOCR(file);
            try {
                // Use OpenAI for document classification
                const classification = await __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$lib$2f$services$2f$openai$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["openaiService"].classifyDocument(file.name, extractedText);
                documents.push({
                    id: `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                    name: file.name,
                    type: classification.type,
                    mimeType: file.mimeType,
                    content: extractedText,
                    confidence: classification.confidence,
                    keyFields: classification.keyFields,
                    metadata: {
                        size: file.size,
                        processedAt: new Date().toISOString(),
                        classificationMethod: 'openai'
                    }
                });
            } catch (error) {
                // Fallback to rule-based classification
                console.warn(`OpenAI classification failed for ${file.name}, using fallback:`, error);
                const docType = this.classifyDocument(file.name, extractedText);
                documents.push({
                    id: `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                    name: file.name,
                    type: docType,
                    mimeType: file.mimeType,
                    content: extractedText,
                    confidence: this.calculateConfidence(file.name, extractedText, docType),
                    keyFields: {},
                    metadata: {
                        size: file.size,
                        processedAt: new Date().toISOString(),
                        classificationMethod: 'rule_based_fallback'
                    }
                });
            }
        }
        return documents;
    }
    async simulateOCR(file) {
        // In a real implementation, this would call Azure Form Recognizer or AWS Textract
        // For demo, we return the provided content (which simulates extracted text)
        // Add some realistic OCR processing delay
        await new Promise((resolve)=>setTimeout(resolve, 500 + Math.random() * 1000));
        return file.content || `[OCR extracted content from ${file.name}]`;
    }
    classifyDocument(fileName, content) {
        const name = fileName.toLowerCase();
        const text = content.toLowerCase();
        // Rule-based classification
        if (name.includes('police') || text.includes('police report') || text.includes('officer')) {
            return 'PoliceReport';
        }
        if (name.includes('estimate') || name.includes('repair') || text.includes('estimate') || text.includes('labor')) {
            return 'RepairEstimate';
        }
        if (name.includes('invoice') || name.includes('bill') || text.includes('invoice') || text.includes('total due')) {
            return 'Invoice';
        }
        if (name.includes('photo') || name.includes('image') || name.includes('damage') || text.includes('photo')) {
            return 'DamagePhoto';
        }
        if (name.includes('medical') || text.includes('hospital') || text.includes('patient') || text.includes('diagnosis')) {
            return 'MedicalRecord';
        }
        return 'Other';
    }
    calculateConfidence(fileName, content, docType) {
        // Simple confidence scoring based on keyword matches
        let confidence = 0.6 // Base confidence
        ;
        const keywords = this.getKeywordsForDocType(docType);
        const text = (fileName + ' ' + content).toLowerCase();
        for (const keyword of keywords){
            if (text.includes(keyword)) {
                confidence += 0.1;
            }
        }
        return Math.min(confidence, 1.0);
    }
    getKeywordsForDocType(docType) {
        const keywordMap = {
            PoliceReport: [
                'police',
                'officer',
                'badge',
                'incident',
                'citation',
                'vehicle'
            ],
            RepairEstimate: [
                'estimate',
                'repair',
                'labor',
                'parts',
                'total',
                'damage'
            ],
            Invoice: [
                'invoice',
                'bill',
                'payment',
                'due',
                'amount',
                'services'
            ],
            DamagePhoto: [
                'photo',
                'image',
                'damage',
                'picture',
                'scene'
            ],
            MedicalRecord: [
                'hospital',
                'patient',
                'diagnosis',
                'treatment',
                'doctor',
                'medical'
            ],
            IncidentReport: [
                'incident',
                'report',
                'accident',
                'occurred',
                'witness',
                'details'
            ],
            Other: []
        };
        return keywordMap[docType] || [];
    }
    extractEmailMetadata(emailText) {
        const lines = emailText.split('\n');
        const metadata = {};
        // Extract basic email components
        for (const line of lines){
            if (line.startsWith('Subject:')) {
                metadata.subject = line.replace('Subject:', '').trim();
            }
            if (line.startsWith('From:')) {
                metadata.from = line.replace('From:', '').trim();
            }
            if (line.startsWith('Date:')) {
                metadata.date = line.replace('Date:', '').trim();
            }
        }
        return metadata;
    }
}
}),
"[project]/Autonomous-Claims-Orchestrator/lib/agents/nodes/extractionAgent.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ExtractionAgent",
    ()=>ExtractionAgent
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$lib$2f$services$2f$openai$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Autonomous-Claims-Orchestrator/lib/services/openai.ts [app-route] (ecmascript)");
;
class ExtractionAgent {
    async execute(state, config) {
        const startTime = Date.now();
        try {
            // Extract claim fields using real OpenAI API
            const extractedFields = await this.extractClaimFields(state.emailText, state.documents);
            // Generate evidence for each field using OpenAI
            const fieldEvidence = await this.generateFieldEvidence(extractedFields, state.emailText, state.documents);
            const duration = Date.now() - startTime;
            return {
                currentStep: 'Policy Grounding',
                extractedFields,
                fieldEvidence,
                auditEvents: [
                    ...state.auditEvents,
                    {
                        step: 'extraction',
                        timestamp: new Date().toISOString(),
                        duration,
                        agent: 'ExtractionAgent',
                        status: 'completed',
                        details: {
                            fieldsExtracted: Object.keys(extractedFields).length,
                            evidenceCount: fieldEvidence.length,
                            avgConfidence: fieldEvidence.reduce((sum, e)=>sum + e.confidence, 0) / fieldEvidence.length,
                            llmModel: config.llmModel
                        }
                    }
                ]
            };
        } catch (error) {
            const duration = Date.now() - startTime;
            // Fallback to rule-based extraction if OpenAI fails
            console.warn('OpenAI extraction failed, falling back to rule-based extraction:', error);
            const fallbackFields = await this.extractClaimFieldsFallback(state.emailText, state.documents);
            const fallbackEvidence = await this.generateFieldEvidenceFallback(fallbackFields, state.emailText, state.documents);
            return {
                currentStep: 'Policy Grounding',
                extractedFields: fallbackFields,
                fieldEvidence: fallbackEvidence,
                warnings: [
                    ...state.warnings,
                    'OpenAI extraction failed, used fallback extraction'
                ],
                auditEvents: [
                    ...state.auditEvents,
                    {
                        step: 'extraction',
                        timestamp: new Date().toISOString(),
                        duration,
                        agent: 'ExtractionAgent',
                        status: 'completed_with_fallback',
                        details: {
                            error: String(error),
                            fallbackUsed: true,
                            fieldsExtracted: Object.keys(fallbackFields).length
                        }
                    }
                ]
            };
        }
    }
    async extractClaimFields(emailText, documents) {
        try {
            // Use OpenAI to extract claim fields
            const documentContents = documents.map((d)=>d.content || '');
            const extractedFields = await __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$lib$2f$services$2f$openai$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["openaiService"].extractClaimFields(emailText, documentContents);
            // Validate and clean the extracted fields
            return this.validateAndCleanFields(extractedFields);
        } catch (error) {
            console.error('OpenAI extraction failed:', error);
            throw error;
        }
    }
    async extractClaimFieldsFallback(emailText, documents) {
        // Fallback to rule-based extraction
        const allText = emailText + '\n\n' + documents.map((d)=>d.content).join('\n\n');
        return {
            policyNumber: this.extractPolicyNumber(allText),
            claimantName: this.extractClaimantName(allText),
            contactEmail: this.extractContactEmail(allText),
            contactPhone: this.extractContactPhone(allText),
            lossDate: this.extractLossDate(allText),
            lossType: this.extractLossType(allText),
            lossLocation: this.extractLossLocation(allText),
            description: this.extractDescription(allText),
            vehicleInfo: this.extractVehicleInfo(allText),
            propertyAddress: this.extractPropertyAddress(allText),
            estimatedDamage: this.extractEstimatedDamage(allText)
        };
    }
    async generateFieldEvidence(fields, emailText, documents) {
        const evidence = [];
        const documentContents = documents.map((d)=>d.content || '');
        for (const [fieldName, value] of Object.entries(fields)){
            if (value) {
                try {
                    // Use OpenAI to generate evidence analysis
                    const evidenceAnalysis = await __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$lib$2f$services$2f$openai$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["openaiService"].generateFieldEvidence(fieldName, value, emailText, documentContents);
                    evidence.push({
                        field: fieldName,
                        value: String(value),
                        confidence: evidenceAnalysis.confidence,
                        sourceLocator: evidenceAnalysis.sourceLocator,
                        rationale: evidenceAnalysis.rationale
                    });
                } catch (error) {
                    // Fallback to rule-based evidence
                    const sourceEvidence = this.findTextEvidence(fieldName, value, emailText + '\n\n' + documentContents.join('\n\n'), documents);
                    evidence.push({
                        field: fieldName,
                        value: String(value),
                        confidence: sourceEvidence.confidence,
                        sourceLocator: sourceEvidence.locator,
                        rationale: sourceEvidence.rationale
                    });
                }
            }
        }
        return evidence;
    }
    async generateFieldEvidenceFallback(fields, emailText, documents) {
        const evidence = [];
        const allText = emailText + '\n\n' + documents.map((d)=>d.content).join('\n\n');
        for (const [fieldName, value] of Object.entries(fields)){
            if (value) {
                const sourceEvidence = this.findTextEvidence(fieldName, value, allText, documents);
                evidence.push({
                    field: fieldName,
                    value: String(value),
                    confidence: sourceEvidence.confidence,
                    sourceLocator: sourceEvidence.locator,
                    rationale: sourceEvidence.rationale
                });
            }
        }
        return evidence;
    }
    validateAndCleanFields(fields) {
        const cleaned = {};
        // Clean and validate each field
        for (const [key, value] of Object.entries(fields)){
            if (value !== null && value !== undefined && value !== '') {
                switch(key){
                    case 'policyNumber':
                        cleaned[key] = this.maskPolicyNumber(String(value));
                        break;
                    case 'contactEmail':
                        cleaned[key] = this.maskEmail(String(value));
                        break;
                    case 'contactPhone':
                        cleaned[key] = this.maskPhone(String(value));
                        break;
                    case 'lossDate':
                        cleaned[key] = this.validateDate(String(value));
                        break;
                    case 'estimatedDamage':
                        cleaned[key] = this.validateAmount(value);
                        break;
                    default:
                        cleaned[key] = value;
                }
            }
        }
        return cleaned;
    }
    maskPolicyNumber(policyNumber) {
        // Mask policy number for privacy (show only last 3 digits)
        return policyNumber.length > 3 ? '*'.repeat(policyNumber.length - 3) + policyNumber.slice(-3) : policyNumber;
    }
    maskEmail(email) {
        const [username, domain] = email.split('@');
        if (!domain) return email;
        const maskedUsername = username.length > 4 ? username.substring(0, 2) + '*'.repeat(username.length - 4) + username.slice(-2) : username;
        return `${maskedUsername}@${domain}`;
    }
    maskPhone(phone) {
        // Show only last 4 digits
        const digits = phone.replace(/\D/g, '');
        return digits.length > 4 ? '*'.repeat(digits.length - 4) + digits.slice(-4) : phone;
    }
    validateDate(dateStr) {
        try {
            const date = new Date(dateStr);
            return date.toISOString().split('T')[0] // YYYY-MM-DD format
            ;
        } catch  {
            return dateStr // Return original if parsing fails
            ;
        }
    }
    validateAmount(amount) {
        const num = typeof amount === 'number' ? amount : parseFloat(String(amount));
        return isNaN(num) ? null : num;
    }
    findTextEvidence(fieldName, value, allText, documents) {
        const valueStr = String(value).toLowerCase();
        const text = allText.toLowerCase();
        // Find exact matches first
        if (text.includes(valueStr)) {
            const index = text.indexOf(valueStr);
            const context = allText.substring(Math.max(0, index - 50), index + valueStr.length + 50);
            return {
                confidence: 0.95,
                locator: `text_offset:${index}-${index + valueStr.length}`,
                rationale: `Direct text match found: "${context.trim()}"`
            };
        }
        // Pattern-based matching for specific field types
        return this.getPatternBasedEvidence(fieldName, value, allText);
    }
    getPatternBasedEvidence(fieldName, value, text) {
        switch(fieldName){
            case 'policyNumber':
                return {
                    confidence: 0.9,
                    locator: 'pattern_match:policy_format',
                    rationale: 'Matches standard policy number format with prefix and digits'
                };
            case 'lossDate':
                return {
                    confidence: 0.85,
                    locator: 'pattern_match:date_format',
                    rationale: 'Extracted from date context in incident description'
                };
            case 'contactEmail':
                return {
                    confidence: 0.95,
                    locator: 'pattern_match:email_format',
                    rationale: 'Valid email format in sender or contact information'
                };
            case 'contactPhone':
                return {
                    confidence: 0.9,
                    locator: 'pattern_match:phone_format',
                    rationale: 'Standard phone number format with area code'
                };
            default:
                return {
                    confidence: 0.7,
                    locator: 'inference:context',
                    rationale: 'Inferred from contextual information in documents'
                };
        }
    }
    // Field extraction methods
    extractPolicyNumber(text) {
        const patterns = [
            /policy[#\s]*:?\s*([A-Z]{2}\d{9})/i,
            /policy[#\s]*:?\s*([A-Z]{2}\d{6}\d{3})/i,
            /policy[#\s]*:?\s*([A-Z]+\d+)/i
        ];
        for (const pattern of patterns){
            const match = text.match(pattern);
            if (match) {
                return match[1];
            }
        }
        return null;
    }
    extractClaimantName(text) {
        // Look for name in various contexts
        const patterns = [
            /(?:from|name|claimant):\s*([A-Z][a-z]+\s+[A-Z][a-z]+)/i,
            /([A-Z][a-z]+\s+[A-Z][a-z]+)(?:\s+<?[\w._%+-]+@[\w.-]+\.[A-Z]{2,}>?)/i
        ];
        for (const pattern of patterns){
            const match = text.match(pattern);
            if (match) {
                return match[1];
            }
        }
        return null;
    }
    extractContactEmail(text) {
        const pattern = /[\w._%+-]+@[\w.-]+\.[A-Z]{2,}/i;
        const match = text.match(pattern);
        return match ? match[0] : null;
    }
    extractContactPhone(text) {
        const patterns = [
            /\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/,
            /\d{3}[-.\s]\d{3}[-.\s]\d{4}/
        ];
        for (const pattern of patterns){
            const match = text.match(pattern);
            if (match) {
                return match[0];
            }
        }
        return null;
    }
    extractLossDate(text) {
        const patterns = [
            /(?:accident|incident|loss|occurred?).*?(\d{1,2}\/\d{1,2}\/\d{4})/i,
            /(?:march|april|may|june|july|august|september|october|november|december)\s+\d{1,2},?\s+\d{4}/i
        ];
        for (const pattern of patterns){
            const match = text.match(pattern);
            if (match) {
                return match[1] || match[0];
            }
        }
        return null;
    }
    extractLossType(text) {
        if (/collision|accident|crash|vehicle|car/i.test(text)) {
            return 'Collision';
        }
        if (/water|flood|leak|pipe|storm/i.test(text)) {
            return 'Water';
        }
        if (/fire|burn|smoke/i.test(text)) {
            return 'Fire';
        }
        if (/theft|stolen|burglary/i.test(text)) {
            return 'Theft';
        }
        if (/liability|slip|fall|injury/i.test(text)) {
            return 'Liability';
        }
        return 'Other';
    }
    extractLossLocation(text) {
        const patterns = [
            /(?:at|location|address):\s*([^,\n]+(?:,\s*[^,\n]+)*)/i,
            /(\d+\s+[A-Za-z\s]+(?:street|st|avenue|ave|road|rd|drive|dr|lane|ln|boulevard|blvd))/i
        ];
        for (const pattern of patterns){
            const match = text.match(pattern);
            if (match) {
                return match[1].trim();
            }
        }
        return null;
    }
    extractDescription(text) {
        // Extract the main incident description
        const sentences = text.split(/[.!?]+/);
        const relevantSentences = sentences.filter((s)=>/accident|incident|damage|occurred|happened|hit|struck|fell|slip|crash/i.test(s));
        return relevantSentences.slice(0, 3).join('. ').trim() || null;
    }
    extractVehicleInfo(text) {
        const yearMatch = text.match(/\b(19|20)\d{2}\b/);
        const makeMatch = text.match(/\b(Honda|Toyota|Ford|Chevrolet|BMW|Mercedes|Audi|Nissan|Hyundai|Kia|Mazda|Subaru|Volkswagen|Volvo|Lexus|Acura|Infiniti|Cadillac|Buick|GMC|Jeep|Chrysler|Dodge|Ram)\b/i);
        const modelMatch = text.match(/\b(Civic|Accord|Camry|Corolla|F-150|Silverado|Malibu|Escape|Explorer|CR-V|Pilot|Altima|Sentra|Elantra|Sonata|Optima|Soul|CX-5|Outback|Forester|Jetta|Passat|XC90|ES|IS|RX|GS|LS|Q50|Q60|ATS|CTS|Escalade|LaCrosse|Enclave|Sierra|Terrain|Wrangler|Grand Cherokee|Compass|300|Charger|Challenger|1500|2500|3500)\b/i);
        const licenseMatch = text.match(/(?:license|plate)[#\s]*:?\s*([A-Z0-9-]+)/i);
        if (yearMatch || makeMatch || modelMatch) {
            return {
                year: yearMatch ? yearMatch[0] : null,
                make: makeMatch ? makeMatch[0] : null,
                model: modelMatch ? modelMatch[0] : null,
                licensePlate: licenseMatch ? licenseMatch[1] : null
            };
        }
        return null;
    }
    extractPropertyAddress(text) {
        const patterns = [
            /(?:property|home|house|address):\s*([^,\n]+(?:,\s*[A-Z]{2}\s*\d{5})?)/i,
            /(\d+\s+[A-Za-z\s]+(?:street|st|avenue|ave|road|rd|drive|dr|lane|ln|boulevard|blvd)[^,\n]*(?:,\s*[A-Za-z\s]+,?\s*[A-Z]{2}\s*\d{5})?)/i
        ];
        for (const pattern of patterns){
            const match = text.match(pattern);
            if (match) {
                return match[1].trim();
            }
        }
        return null;
    }
    extractEstimatedDamage(text) {
        const patterns = [
            /\$([0-9,]+\.?\d*)/g,
            /([0-9,]+\.?\d*)\s*dollars?/gi
        ];
        const amounts = [];
        for (const pattern of patterns){
            let match;
            while((match = pattern.exec(text)) !== null){
                const amount = parseFloat(match[1].replace(/,/g, ''));
                if (amount > 100 && amount < 100000) {
                    amounts.push(amount);
                }
            }
        }
        return amounts.length > 0 ? Math.max(...amounts) : null;
    }
}
}),
"[project]/Autonomous-Claims-Orchestrator/lib/agents/nodes/policyAgent.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PolicyAgent",
    ()=>PolicyAgent
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$lib$2f$services$2f$openai$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Autonomous-Claims-Orchestrator/lib/services/openai.ts [app-route] (ecmascript)");
;
class PolicyAgent {
    policyDatabase;
    constructor(){
        this.policyDatabase = this.initializePolicyDatabase();
    }
    async execute(state, config) {
        const startTime = Date.now();
        try {
            // Query policy database using extracted fields and document context
            const policyHits = await this.queryPolicyDatabase(state.extractedFields, state.documents, state.emailText);
            const duration = Date.now() - startTime;
            return {
                currentStep: 'Decision Assembly',
                policyHits,
                auditEvents: [
                    ...state.auditEvents,
                    {
                        step: 'policy_grounding',
                        timestamp: new Date().toISOString(),
                        duration,
                        agent: 'PolicyAgent',
                        status: 'completed',
                        details: {
                            clausesFound: policyHits.length,
                            avgSimilarity: policyHits.reduce((sum, h)=>sum + (h.similarity || h.score || 0), 0) / policyHits.length,
                            topScore: policyHits.length > 0 ? Math.max(...policyHits.map((h)=>h.similarity || h.score || 0)) : 0
                        }
                    }
                ]
            };
        } catch (error) {
            const duration = Date.now() - startTime;
            return {
                errors: [
                    ...state.errors,
                    `Policy grounding failed: ${error}`
                ],
                auditEvents: [
                    ...state.auditEvents,
                    {
                        step: 'policy_grounding',
                        timestamp: new Date().toISOString(),
                        duration,
                        agent: 'PolicyAgent',
                        status: 'failed',
                        details: {
                            error: String(error)
                        }
                    }
                ]
            };
        }
    }
    async queryPolicyDatabase(extractedFields, documents, emailText) {
        try {
            // Use OpenAI to find relevant policy clauses
            const lossType = extractedFields.lossType || 'Other';
            const description = extractedFields.description || 'Claim submitted';
            const openaiResults = await __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$lib$2f$services$2f$openai$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["openaiService"].queryPolicyDatabase(lossType, description, extractedFields);
            // Convert OpenAI results to full PolicyHit format
            const policyHits = openaiResults.map((result)=>{
                const clause = this.policyDatabase.find((c)=>c.id === result.clauseId);
                return {
                    clauseId: result.clauseId,
                    title: result.title,
                    content: clause?.content || 'Policy clause content',
                    similarity: result.similarity,
                    rationale: result.rationale,
                    sourceDocument: clause?.sourceDocument || 'Policy Document',
                    section: clause?.section || 'Section Unknown'
                };
            });
            return policyHits;
        } catch (error) {
            console.warn('OpenAI policy query failed, using fallback:', error);
            // Fallback to rule-based policy search
            await new Promise((resolve)=>setTimeout(resolve, 800 + Math.random() * 500));
            const searchContext = this.buildSearchContext(extractedFields, documents, emailText);
            const candidateHits = this.findRelevantClauses(searchContext);
            const scoredHits = candidateHits.map((clause)=>({
                    clauseId: clause.id,
                    title: clause.title,
                    content: clause.content,
                    similarity: this.calculateSimilarity(searchContext, clause),
                    rationale: this.generateRationale(searchContext, clause),
                    sourceDocument: clause.sourceDocument,
                    section: clause.section
                }));
            return scoredHits.filter((hit)=>hit.similarity >= 0.6).sort((a, b)=>b.similarity - a.similarity).slice(0, 5);
        }
    }
    buildSearchContext(extractedFields, documents, emailText) {
        const context = [];
        // Add loss type and description
        if (extractedFields.lossType) {
            context.push(`Loss Type: ${extractedFields.lossType}`);
        }
        if (extractedFields.description) {
            context.push(`Description: ${extractedFields.description}`);
        }
        // Add document types as context
        const docTypes = documents.map((d)=>d.type).join(', ');
        if (docTypes) {
            context.push(`Document Types: ${docTypes}`);
        }
        // Add key extracted fields
        const keyFields = [
            'vehicleInfo',
            'propertyAddress',
            'estimatedDamage'
        ];
        for (const field of keyFields){
            if (extractedFields[field]) {
                context.push(`${field}: ${JSON.stringify(extractedFields[field])}`);
            }
        }
        return context.join('\n');
    }
    findRelevantClauses(searchContext) {
        const context = searchContext.toLowerCase();
        const relevantClauses = [];
        for (const clause of this.policyDatabase){
            const clauseText = clause.content.toLowerCase();
            const clauseKeywords = clause.keywords.map((k)=>k.toLowerCase());
            // Check for keyword matches
            let hasMatch = false;
            for (const keyword of clauseKeywords){
                if (context.includes(keyword) || clauseText.includes(keyword)) {
                    hasMatch = true;
                    break;
                }
            }
            // Check for loss type matches
            if (context.includes('collision') && clause.coverage.includes('collision')) hasMatch = true;
            if (context.includes('water') && clause.coverage.includes('water')) hasMatch = true;
            if (context.includes('liability') && clause.coverage.includes('liability')) hasMatch = true;
            if (context.includes('fire') && clause.coverage.includes('fire')) hasMatch = true;
            if (hasMatch) {
                relevantClauses.push(clause);
            }
        }
        return relevantClauses;
    }
    calculateSimilarity(searchContext, clause) {
        const context = searchContext.toLowerCase();
        const clauseText = clause.content.toLowerCase();
        let score = 0.0;
        // Keyword matching (40% of score)
        let keywordMatches = 0;
        for (const keyword of clause.keywords){
            if (context.includes(keyword.toLowerCase())) {
                keywordMatches++;
            }
        }
        score += keywordMatches / clause.keywords.length * 0.4;
        // Coverage type matching (30% of score)
        for (const coverage of clause.coverage){
            if (context.includes(coverage.toLowerCase())) {
                score += 0.3;
                break;
            }
        }
        // Text overlap (20% of score)
        const contextWords = context.split(/\s+/);
        const clauseWords = clauseText.split(/\s+/);
        const commonWords = contextWords.filter((word)=>word.length > 3 && clauseWords.includes(word));
        score += commonWords.length / Math.max(contextWords.length, clauseWords.length) * 0.2;
        // Document type relevance (10% of score)
        if (clause.applicableDocuments.some((docType)=>context.includes(docType.toLowerCase()))) {
            score += 0.1;
        }
        return Math.min(score, 1.0);
    }
    generateRationale(searchContext, clause) {
        const context = searchContext.toLowerCase();
        const reasons = [];
        // Check keyword matches
        const matchedKeywords = clause.keywords.filter((k)=>context.includes(k.toLowerCase()));
        if (matchedKeywords.length > 0) {
            reasons.push(`Matched keywords: ${matchedKeywords.join(', ')}`);
        }
        // Check coverage matches
        const matchedCoverage = clause.coverage.filter((c)=>context.includes(c.toLowerCase()));
        if (matchedCoverage.length > 0) {
            reasons.push(`Relevant coverage: ${matchedCoverage.join(', ')}`);
        }
        // Check document type matches
        const matchedDocs = clause.applicableDocuments.filter((d)=>context.includes(d.toLowerCase()));
        if (matchedDocs.length > 0) {
            reasons.push(`Applicable documents: ${matchedDocs.join(', ')}`);
        }
        return reasons.join('; ') || 'General policy relevance';
    }
    initializePolicyDatabase() {
        return [
            // Auto Insurance Clauses
            {
                id: 'AUTO-COL-001',
                title: 'Collision Coverage',
                content: 'We will pay for direct and accidental loss to your covered auto caused by collision with another object or by upset of your covered auto. Collision coverage is subject to the deductible shown in the Declarations.',
                coverage: [
                    'collision',
                    'auto'
                ],
                keywords: [
                    'collision',
                    'crash',
                    'accident',
                    'vehicle',
                    'auto',
                    'car',
                    'deductible'
                ],
                applicableDocuments: [
                    'PoliceReport',
                    'RepairEstimate',
                    'DamagePhoto'
                ],
                sourceDocument: 'Auto Policy Form AP-2024',
                section: 'Part D - Coverage for Damage to Your Auto',
                deductible: 500
            },
            {
                id: 'AUTO-LIAB-001',
                title: 'Bodily Injury Liability',
                content: 'We will pay damages for bodily injury for which any insured becomes legally responsible because of an auto accident. We will settle or defend, as we consider appropriate, any claim or suit asking for these damages.',
                coverage: [
                    'liability',
                    'bodily injury'
                ],
                keywords: [
                    'bodily injury',
                    'liability',
                    'accident',
                    'damages',
                    'lawsuit',
                    'medical'
                ],
                applicableDocuments: [
                    'PoliceReport',
                    'MedicalRecord',
                    'MedicalBill'
                ],
                sourceDocument: 'Auto Policy Form AP-2024',
                section: 'Part A - Liability Coverage'
            },
            {
                id: 'AUTO-PD-001',
                title: 'Property Damage Liability',
                content: 'We will pay damages for property damage for which any insured becomes legally responsible because of an auto accident. Property damage means physical injury to, destruction of, or loss of use of tangible property.',
                coverage: [
                    'liability',
                    'property damage'
                ],
                keywords: [
                    'property damage',
                    'liability',
                    'accident',
                    'damages',
                    'physical injury'
                ],
                applicableDocuments: [
                    'PoliceReport',
                    'RepairEstimate',
                    'DamagePhoto'
                ],
                sourceDocument: 'Auto Policy Form AP-2024',
                section: 'Part A - Liability Coverage'
            },
            // Homeowners Insurance Clauses  
            {
                id: 'HO-WATER-001',
                title: 'Water Damage Coverage',
                content: 'We cover sudden and accidental discharge or overflow of water or steam from within a plumbing, heating, air conditioning, or automatic fire protective sprinkler system, or from within a household appliance.',
                coverage: [
                    'water damage',
                    'property'
                ],
                keywords: [
                    'water',
                    'discharge',
                    'overflow',
                    'plumbing',
                    'pipe',
                    'leak',
                    'sudden'
                ],
                applicableDocuments: [
                    'DamagePhoto',
                    'RepairEstimate',
                    'Invoice'
                ],
                sourceDocument: 'Homeowners Policy Form HO-3',
                section: 'Section I - Property Coverages',
                deductible: 1000
            },
            {
                id: 'HO-STORM-001',
                title: 'Wind and Hail Coverage',
                content: 'We cover direct physical loss to property caused by windstorm or hail. This coverage includes damage caused by objects blown by wind or falling trees due to wind.',
                coverage: [
                    'wind',
                    'hail',
                    'storm'
                ],
                keywords: [
                    'wind',
                    'windstorm',
                    'hail',
                    'storm',
                    'tree',
                    'branch',
                    'roof'
                ],
                applicableDocuments: [
                    'DamagePhoto',
                    'WeatherReport',
                    'RepairEstimate'
                ],
                sourceDocument: 'Homeowners Policy Form HO-3',
                section: 'Section I - Property Coverages',
                deductible: 1000
            },
            // Commercial Liability Clauses
            {
                id: 'CGL-SLIP-001',
                title: 'Premises Liability Coverage',
                content: 'We will pay those sums that the insured becomes legally obligated to pay as damages because of bodily injury or property damage to which this insurance applies caused by an occurrence on premises owned or rented by you.',
                coverage: [
                    'liability',
                    'premises',
                    'slip and fall'
                ],
                keywords: [
                    'slip',
                    'fall',
                    'premises',
                    'liability',
                    'bodily injury',
                    'occurrence'
                ],
                applicableDocuments: [
                    'IncidentReport',
                    'MedicalRecord',
                    'WitnessStatement'
                ],
                sourceDocument: 'Commercial General Liability Policy CGL-2024',
                section: 'Coverage A - Bodily Injury and Property Damage Liability'
            },
            {
                id: 'CGL-MED-001',
                title: 'Medical Payments Coverage',
                content: 'We will pay medical expenses incurred by a person for bodily injury caused by an accident on premises you own or rent or because of your operations, without regard to fault.',
                coverage: [
                    'medical payments',
                    'no fault'
                ],
                keywords: [
                    'medical expenses',
                    'medical payments',
                    'accident',
                    'premises',
                    'no fault'
                ],
                applicableDocuments: [
                    'MedicalRecord',
                    'MedicalBill',
                    'IncidentReport'
                ],
                sourceDocument: 'Commercial General Liability Policy CGL-2024',
                section: 'Coverage C - Medical Payments'
            }
        ];
    }
}
}),
"[project]/Autonomous-Claims-Orchestrator/lib/agents/nodes/assemblerAgent.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AssemblerAgent",
    ()=>AssemblerAgent
]);
class AssemblerAgent {
    async execute(state, config) {
        const startTime = Date.now();
        try {
            // Create the final claim data structure
            const claimData = await this.assembleClaimData(state);
            const duration = Date.now() - startTime;
            return {
                currentStep: 'Review',
                claimData,
                auditEvents: [
                    ...state.auditEvents,
                    {
                        step: 'assembly',
                        timestamp: new Date().toISOString(),
                        duration,
                        agent: 'AssemblerAgent',
                        status: 'completed',
                        details: {
                            fieldsAssembled: Object.keys(state.extractedFields).length,
                            documentsProcessed: state.documents.length,
                            policyHitsIncluded: state.policyHits.length,
                            totalProcessingTime: Date.now() - state.startTime
                        }
                    }
                ]
            };
        } catch (error) {
            const duration = Date.now() - startTime;
            return {
                errors: [
                    ...state.errors,
                    `Assembly failed: ${error}`
                ],
                auditEvents: [
                    ...state.auditEvents,
                    {
                        step: 'assembly',
                        timestamp: new Date().toISOString(),
                        duration,
                        agent: 'AssemblerAgent',
                        status: 'failed',
                        details: {
                            error: String(error)
                        }
                    }
                ]
            };
        }
    }
    async assembleClaimData(state) {
        // Create claim draft
        const claimDraft = this.createClaimDraft(state.extractedFields, state.documents);
        // Assemble decision pack
        const decisionPack = this.createDecisionPack(claimDraft, state.fieldEvidence, state.documents, state.policyHits, state.auditEvents);
        // Calculate processing metrics
        const processingMetrics = this.calculateProcessingMetrics(state);
        return {
            claimId: this.generateClaimId(),
            decisionPack: {
                ...decisionPack,
                claimDraft,
                evidence: state.fieldEvidence,
                documents: state.documents,
                policyGrounding: state.policyHits,
                audit: state.auditEvents
            },
            auditTrail: state.auditEvents,
            processingMetrics,
            createdAt: new Date().toISOString(),
            status: 'draft'
        };
    }
    createClaimDraft(extractedFields, documents) {
        return {
            id: this.generateDraftId(),
            policyNumber: this.sanitizePolicyNumber(extractedFields.policyNumber),
            claimantName: extractedFields.claimantName || 'Unknown',
            contactEmail: this.maskEmail(extractedFields.contactEmail),
            contactPhone: this.maskPhone(extractedFields.contactPhone),
            lossDate: this.formatDate(extractedFields.lossDate),
            lossType: extractedFields.lossType || 'Other',
            lossLocation: extractedFields.lossLocation || 'Not specified',
            description: extractedFields.description || 'Claim details extracted from submitted documents',
            estimatedAmount: extractedFields.estimatedDamage || null,
            // Vehicle-specific fields
            vehicleInfo: extractedFields.vehicleInfo || null,
            // Property-specific fields  
            propertyAddress: extractedFields.propertyAddress || null,
            // Attachments reference
            attachments: documents.map((doc)=>({
                    id: doc.id,
                    name: doc.name,
                    mimeType: doc.mimeType || 'application/octet-stream',
                    type: doc.type,
                    confidence: doc.confidence
                })),
            // Coverage assessment
            coverageFound: this.assessCoverage(extractedFields),
            deductible: this.determineDeductible(extractedFields),
            // Metadata
            createdAt: new Date().toISOString(),
            source: 'automated_extraction',
            confidence: this.calculateOverallConfidence(extractedFields)
        };
    }
    createDecisionPack(claimDraft, evidence, documents, policyHits, auditEvents) {
        return {
            id: this.generateDecisionPackId(),
            claimDraft,
            evidence,
            documents,
            policyGrounding: policyHits,
            audit: auditEvents,
            // Evidence summary
            evidenceSummary: {
                totalFields: evidence.length,
                highConfidenceFields: evidence.filter((e)=>e.confidence >= 0.8).length,
                lowConfidenceFields: evidence.filter((e)=>e.confidence < 0.6).length,
                avgConfidence: evidence.reduce((sum, e)=>sum + e.confidence, 0) / evidence.length
            },
            // Document analysis
            documentAnalysis: {
                totalDocuments: documents.length,
                documentTypes: [
                    ...new Set(documents.map((d)=>d.type))
                ],
                avgDocumentConfidence: documents.reduce((sum, d)=>sum + d.confidence, 0) / documents.length,
                missingDocuments: this.identifyMissingDocuments(claimDraft.lossType, documents)
            },
            // Policy assessment
            policyAssessment: {
                clausesFound: policyHits.length,
                coverageConfirmed: policyHits.length > 0,
                topSimilarityScore: policyHits.length > 0 ? Math.max(...policyHits.map((h)=>h.similarity)) : 0,
                recommendedActions: this.generateRecommendations(claimDraft, policyHits, evidence)
            },
            // Processing summary
            processingSummary: {
                totalTime: auditEvents.length > 0 ? auditEvents.reduce((sum, e)=>sum + e.duration, 0) : 0,
                stepsCompleted: auditEvents.filter((e)=>e.status === 'completed').length,
                stepsWithErrors: auditEvents.filter((e)=>e.status === 'failed').length,
                automationLevel: this.calculateAutomationLevel(evidence)
            },
            createdAt: new Date().toISOString()
        };
    }
    calculateProcessingMetrics(state) {
        const totalTime = Date.now() - state.startTime;
        const completedSteps = state.auditEvents.filter((e)=>e.status === 'completed').length;
        const failedSteps = state.auditEvents.filter((e)=>e.status === 'failed').length;
        return {
            totalProcessingTime: totalTime,
            averageHandleTime: totalTime / 60000,
            fieldsAutoPopulated: Object.keys(state.extractedFields).filter((key)=>state.extractedFields[key] !== null && state.extractedFields[key] !== undefined).length,
            overrideRate: 0,
            ragHitRate: state.policyHits.length > 0 ? 1 : 0,
            stepsCompleted: completedSteps,
            stepsFailed: failedSteps,
            successRate: completedSteps / (completedSteps + failedSteps)
        };
    }
    // Utility methods
    generateClaimId() {
        return `CLM-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    }
    generateDraftId() {
        return `DRAFT-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
    }
    generateDecisionPackId() {
        return `DP-${Date.now()}-${Math.random().toString(36).substr(2, 8).toUpperCase()}`;
    }
    sanitizePolicyNumber(policyNumber) {
        if (!policyNumber) return 'Unknown';
        // Mask policy number for privacy (show only last 3 digits)
        return policyNumber.length > 3 ? '*'.repeat(policyNumber.length - 3) + policyNumber.slice(-3) : policyNumber;
    }
    maskEmail(email) {
        if (!email) return '';
        const [username, domain] = email.split('@');
        if (!domain) return email;
        const maskedUsername = username.length > 4 ? username.substring(0, 2) + '*'.repeat(username.length - 4) + username.slice(-2) : username;
        return `${maskedUsername}@${domain}`;
    }
    maskPhone(phone) {
        if (!phone) return '';
        // Show only last 4 digits
        const digits = phone.replace(/\D/g, '');
        return digits.length > 4 ? '*'.repeat(digits.length - 4) + digits.slice(-4) : phone;
    }
    formatDate(dateStr) {
        if (!dateStr) return '';
        try {
            const date = new Date(dateStr);
            return date.toISOString().split('T')[0] // YYYY-MM-DD format
            ;
        } catch  {
            return dateStr // Return original if parsing fails
            ;
        }
    }
    assessCoverage(extractedFields) {
        // Simple coverage assessment based on policy number presence
        return !!extractedFields.policyNumber;
    }
    determineDeductible(extractedFields) {
        // Default deductibles based on loss type
        const lossType = extractedFields.lossType;
        const defaultDeductibles = {
            'Collision': 500,
            'Water': 1000,
            'Wind': 1000,
            'Liability': 0
        };
        return defaultDeductibles[lossType] || undefined;
    }
    calculateOverallConfidence(extractedFields) {
        const fields = Object.values(extractedFields).filter((v)=>v !== null && v !== undefined);
        const requiredFields = [
            'policyNumber',
            'claimantName',
            'lossDate',
            'lossType'
        ];
        const presentRequired = requiredFields.filter((field)=>extractedFields[field]).length;
        return presentRequired / requiredFields.length * 0.6 + fields.length / 10 * 0.4;
    }
    identifyMissingDocuments(lossType, documents) {
        const presentTypes = new Set(documents.map((d)=>d.type));
        const expectedDocuments = {
            'Collision': [
                'PoliceReport',
                'RepairEstimate',
                'DamagePhoto'
            ],
            'Water': [
                'DamagePhoto',
                'RepairEstimate'
            ],
            'Liability': [
                'IncidentReport',
                'MedicalRecord'
            ],
            'Fire': [
                'DamagePhoto',
                'RepairEstimate',
                'FireReport'
            ],
            'Theft': [
                'PoliceReport',
                'ItemList'
            ]
        };
        const expected = expectedDocuments[lossType] || [];
        return expected.filter((docType)=>!presentTypes.has(docType));
    }
    generateRecommendations(claimDraft, policyHits, evidence) {
        const recommendations = [];
        // Coverage recommendations
        if (policyHits.length === 0) {
            recommendations.push('No matching policy clauses found - review coverage manually');
        } else if (policyHits[0].similarity < 0.8) {
            recommendations.push('Low policy match confidence - adjuster review recommended');
        }
        // Evidence recommendations
        const lowConfidenceFields = evidence.filter((e)=>e.confidence < 0.6);
        if (lowConfidenceFields.length > 0) {
            recommendations.push(`${lowConfidenceFields.length} fields need manual verification`);
        }
        // Amount recommendations
        if (claimDraft.estimatedAmount && claimDraft.estimatedAmount > 10000) {
            recommendations.push('High-value claim - senior adjuster review required');
        }
        // Document recommendations
        if (!claimDraft.attachments.some((a)=>a.type === 'DamagePhoto')) {
            recommendations.push('Damage photos recommended for claim validation');
        }
        return recommendations;
    }
    calculateAutomationLevel(evidence) {
        const highConfidenceFields = evidence.filter((e)=>e.confidence >= 0.8).length;
        return evidence.length > 0 ? highConfidenceFields / evidence.length : 0;
    }
}
}),
"[project]/Autonomous-Claims-Orchestrator/lib/agents/orchestrator.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LangGraphOrchestrator",
    ()=>LangGraphOrchestrator
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$lib$2f$agents$2f$nodes$2f$ingestionAgent$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Autonomous-Claims-Orchestrator/lib/agents/nodes/ingestionAgent.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$lib$2f$agents$2f$nodes$2f$extractionAgent$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Autonomous-Claims-Orchestrator/lib/agents/nodes/extractionAgent.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$lib$2f$agents$2f$nodes$2f$policyAgent$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Autonomous-Claims-Orchestrator/lib/agents/nodes/policyAgent.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$lib$2f$agents$2f$nodes$2f$assemblerAgent$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Autonomous-Claims-Orchestrator/lib/agents/nodes/assemblerAgent.ts [app-route] (ecmascript)");
;
;
;
;
class LangGraphOrchestrator {
    ingestionAgent;
    extractionAgent;
    policyAgent;
    assemblerAgent;
    config;
    hasOpenAIKey;
    constructor(config){
        this.config = {
            llmModel: process.env.OPENAI_MODEL || 'gpt-4-1106-preview',
            confidenceThreshold: 0.6,
            maxRetries: 3,
            timeoutMs: 30000,
            ...config
        };
        // Check if OpenAI API key is available
        this.hasOpenAIKey = !!(process.env.OPENAI_API_KEY || ("TURBOPACK compile-time value", "undefined") !== 'undefined' && window.OPENAI_API_KEY);
        // Initialize agent nodes
        this.ingestionAgent = new __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$lib$2f$agents$2f$nodes$2f$ingestionAgent$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["IngestionAgent"]();
        this.extractionAgent = new __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$lib$2f$agents$2f$nodes$2f$extractionAgent$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ExtractionAgent"]();
        this.policyAgent = new __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$lib$2f$agents$2f$nodes$2f$policyAgent$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PolicyAgent"]();
        this.assemblerAgent = new __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$lib$2f$agents$2f$nodes$2f$assemblerAgent$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AssemblerAgent"]();
    }
    async processClaim(emailText, files) {
        const startTime = Date.now();
        // Initialize agent state
        let state = {
            emailText,
            files,
            currentStep: 'Initializing',
            startTime,
            documents: [],
            extractedFields: {},
            fieldEvidence: [],
            policyHits: [],
            auditEvents: [],
            errors: [],
            warnings: []
        };
        try {
            // Execute agent workflow in sequence
            state = await this.executeWorkflow(state);
            if (state.claimData) {
                return state.claimData;
            } else {
                throw new Error('Workflow completed but no claim data generated');
            }
        } catch (error) {
            // Add error to audit trail
            state.auditEvents.push({
                step: 'orchestrator_error',
                timestamp: new Date().toISOString(),
                duration: Date.now() - startTime,
                agent: 'Orchestrator',
                status: 'failed',
                details: {
                    error: String(error)
                }
            });
            throw new Error(`Claim processing failed: ${error}`);
        }
    }
    async executeWorkflow(initialState) {
        let state = {
            ...initialState
        };
        // Step 1: Ingestion Agent
        state.currentStep = 'Document Ingestion';
        state = {
            ...state,
            ...await this.executeWithRetry(()=>this.ingestionAgent.execute(state, this.config), 'ingestion')
        };
        // Step 2: Extraction Agent
        state.currentStep = 'Field Extraction';
        state = {
            ...state,
            ...await this.executeWithRetry(()=>this.extractionAgent.execute(state, this.config), 'extraction')
        };
        // Step 3: Policy Agent
        state.currentStep = 'Policy Grounding';
        state = {
            ...state,
            ...await this.executeWithRetry(()=>this.policyAgent.execute(state, this.config), 'policy_grounding')
        };
        // Step 4: Assembler Agent
        state.currentStep = 'Decision Assembly';
        state = {
            ...state,
            ...await this.executeWithRetry(()=>this.assemblerAgent.execute(state, this.config), 'assembly')
        };
        return state;
    }
    async executeWithRetry(operation, stepName, retryCount = 0) {
        try {
            return await Promise.race([
                operation(),
                this.createTimeoutPromise()
            ]);
        } catch (error) {
            if (retryCount < this.config.maxRetries) {
                // Log retry attempt
                console.warn(`Retrying ${stepName} (attempt ${retryCount + 1}): ${error}`);
                // Exponential backoff
                await new Promise((resolve)=>setTimeout(resolve, Math.pow(2, retryCount) * 1000));
                return this.executeWithRetry(operation, stepName, retryCount + 1);
            } else {
                throw new Error(`${stepName} failed after ${this.config.maxRetries} retries: ${error}`);
            }
        }
    }
    createTimeoutPromise() {
        return new Promise((_, reject)=>{
            setTimeout(()=>{
                reject(new Error(`Operation timed out after ${this.config.timeoutMs}ms`));
            }, this.config.timeoutMs);
        });
    }
    // Utility methods for monitoring and debugging
    getProcessingStatus(state) {
        const totalSteps = 4 // ingestion, extraction, policy, assembly
        ;
        const completedSteps = state.auditEvents.filter((e)=>e.status === 'completed').length;
        const progress = completedSteps / totalSteps;
        const avgStepTime = state.auditEvents.length > 0 ? state.auditEvents.reduce((sum, e)=>sum + e.duration, 0) / state.auditEvents.length : 2000 // Default 2 seconds per step
        ;
        const estimatedTimeRemaining = (totalSteps - completedSteps) * avgStepTime;
        return {
            currentStep: state.currentStep,
            progress,
            estimatedTimeRemaining,
            errors: state.errors
        };
    }
    getAuditTrail(state) {
        return state.auditEvents.map((event)=>({
                ...event,
                formattedDuration: `${event.duration}ms`,
                formattedTimestamp: new Date(event.timestamp).toLocaleString()
            }));
    }
    // Configuration management
    updateConfig(newConfig) {
        this.config = {
            ...this.config,
            ...newConfig
        };
    }
    getConfig() {
        return {
            ...this.config
        };
    }
    // Check OpenAI integration status
    getOpenAIStatus() {
        return {
            available: this.hasOpenAIKey,
            model: this.config.llmModel,
            message: this.hasOpenAIKey ? `OpenAI integration active with ${this.config.llmModel}` : 'OpenAI API key not configured - using simulation mode'
        };
    }
    // Health check for the orchestrator
    async healthCheck() {
        try {
            // Test with minimal input
            const testState = {
                emailText: 'Test health check',
                files: [],
                currentStep: 'health_check',
                startTime: Date.now(),
                documents: [],
                extractedFields: {},
                fieldEvidence: [],
                policyHits: [],
                auditEvents: [],
                errors: [],
                warnings: []
            };
            // Quick test of each agent
            const results = await Promise.allSettled([
                this.ingestionAgent.execute(testState, this.config),
                this.extractionAgent.execute(testState, this.config),
                this.policyAgent.execute(testState, this.config),
                this.assemblerAgent.execute(testState, this.config)
            ]);
            const failedAgents = results.filter((r)=>r.status === 'rejected').length;
            const openaiStatus = this.getOpenAIStatus();
            return {
                status: failedAgents === 0 ? 'healthy' : failedAgents <= 1 ? 'degraded' : 'unhealthy',
                details: {
                    agentsOnline: results.length - failedAgents,
                    totalAgents: results.length,
                    config: this.config,
                    openaiStatus,
                    timestamp: new Date().toISOString()
                }
            };
        } catch (error) {
            return {
                status: 'unhealthy',
                details: {
                    error: String(error),
                    timestamp: new Date().toISOString()
                }
            };
        }
    }
}
}),
"[project]/Autonomous-Claims-Orchestrator/app/api/process-claim/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Autonomous-Claims-Orchestrator/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$lib$2f$ingestedClaims$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Autonomous-Claims-Orchestrator/lib/ingestedClaims.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$lib$2f$agents$2f$orchestrator$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Autonomous-Claims-Orchestrator/lib/agents/orchestrator.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/fs [external] (fs, cjs)");
;
;
;
;
async function POST(request) {
    try {
        const body = await request.json();
        const { ingestedClaimId } = body;
        if (!ingestedClaimId) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'ingestedClaimId is required'
            }, {
                status: 400
            });
        }
        const claim = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$lib$2f$ingestedClaims$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getIngestedClaimById"])(ingestedClaimId);
        if (!claim) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Claim not found'
            }, {
                status: 404
            });
        }
        const files = claim.attachments.map((att)=>{
            let content;
            try {
                const ext = att.name.toLowerCase().split('.').pop() || '';
                if ([
                    'txt',
                    'csv',
                    'log'
                ].includes(ext)) {
                    content = __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].readFileSync(att.path, 'utf-8');
                } else {
                    content = `[Document: ${att.name} - binary content]`;
                }
            } catch  {
                content = `[Could not read: ${att.name}]`;
            }
            return {
                name: att.name,
                content,
                mimeType: att.mimeType,
                size: att.size
            };
        });
        const orchestrator = new __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$lib$2f$agents$2f$orchestrator$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["LangGraphOrchestrator"]({
            llmModel: process.env.OPENAI_MODEL || 'gpt-4-1106-preview',
            confidenceThreshold: 0.6,
            maxRetries: 2,
            timeoutMs: 30000
        });
        const claimData = await orchestrator.processClaim(claim.emailBody, files);
        const openaiStatus = orchestrator.getOpenAIStatus();
        claimData.auditTrail.push({
            step: 'system_info',
            timestamp: new Date().toISOString(),
            duration: 0,
            agent: 'System',
            status: 'completed',
            details: {
                openaiIntegration: openaiStatus.available ? 'active' : 'demo_mode',
                model: openaiStatus.model
            }
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(claimData);
    } catch (error) {
        console.error('Process claim error:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Claim processing failed',
            details: String(error)
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__9af3e776._.js.map