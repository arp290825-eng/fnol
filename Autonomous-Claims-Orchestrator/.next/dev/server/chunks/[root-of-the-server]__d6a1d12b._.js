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
"[externals]/child_process [external] (child_process, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("child_process", () => require("child_process"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[project]/Autonomous-Claims-Orchestrator/services/ingested-claims/index.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "addDedupKeysToSet",
    ()=>addDedupKeysToSet,
    "clearAllIngestedClaims",
    ()=>clearAllIngestedClaims,
    "extractPolicyNumber",
    ()=>extractPolicyNumber,
    "getAllIngestedClaims",
    ()=>getAllIngestedClaims,
    "getExistingMessageIds",
    ()=>getExistingMessageIds,
    "getIngestedClaimById",
    ()=>getIngestedClaimById,
    "getPolicyNumbers",
    ()=>getPolicyNumbers,
    "isDuplicateEmail",
    ()=>isDuplicateEmail,
    "readAttachmentContent",
    ()=>readAttachmentContent,
    "saveIngestedClaim",
    ()=>saveIngestedClaim
]);
/**
 * Ingested Claims Microservice
 *
 * Manages FNOL claims ingested from email (IMAP, SendGrid, demo).
 * Provides CRUD, policy extraction, deduplication, and attachment handling.
 */ var __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/fs [external] (fs, cjs)");
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
    if (!__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].existsSync(CLAIMS_FILE)) return [];
    try {
        return JSON.parse(__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].readFileSync(CLAIMS_FILE, 'utf-8'));
    } catch  {
        return [];
    }
}
function saveClaimsData(claims) {
    ensureDataDir();
    __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].writeFileSync(CLAIMS_FILE, JSON.stringify(claims, null, 2), 'utf-8');
}
function normalizeDedupKey(s) {
    return s.trim().toLowerCase();
}
function normalizedSubjectFrom(subject, from) {
    return normalizeDedupKey(`${subject}|${from}`);
}
function fallbackPolicyDisplay(messageId, claimId) {
    if (!messageId) return claimId;
    if (messageId.includes('<') && messageId.includes('@')) {
        const inner = messageId.replace(/^<|>$/g, '').trim();
        return inner || claimId;
    }
    return claimId;
}
function seedDemoClaims() {
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
    if (claims.length > 0) saveClaimsData(claims);
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
        if (match?.[1]) return match[1];
    }
    return null;
}
function getExistingMessageIds() {
    const claims = getClaimsData();
    const ids = new Set();
    for (const c of claims){
        ids.add(normalizedSubjectFrom(c.subject, c.from));
        if (c.messageId) {
            ids.add(normalizeDedupKey(c.messageId));
            const inner = c.messageId.replace(/^<|>$/g, '').trim();
            if (inner) ids.add(normalizeDedupKey(inner));
        }
    }
    return ids;
}
function addDedupKeysToSet(ids, subject, from, messageId, dedupKey) {
    ids.add(normalizedSubjectFrom(subject, from));
    ids.add(normalizeDedupKey(dedupKey));
    if (messageId) {
        const inner = messageId.replace(/^<|>$/g, '').trim();
        if (inner) ids.add(normalizeDedupKey(inner));
    }
}
function isDuplicateEmail(subject, from, messageId, dateHeader, existingIds) {
    if (existingIds.has(normalizedSubjectFrom(subject, from))) return true;
    const dedupKey = messageId ? normalizeDedupKey(messageId) : normalizeDedupKey(`${subject}|${from}|${dateHeader}`);
    if (existingIds.has(dedupKey)) return true;
    if (messageId) {
        const inner = messageId.replace(/^<|>$/g, '').trim();
        if (inner && existingIds.has(normalizeDedupKey(inner))) return true;
    }
    return false;
}
function saveIngestedClaim(from, to, subject, emailBody, attachmentFiles, source = 'sendgrid', messageId, emailMessageIdForDisplay) {
    const claimId = `ING-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const extracted = extractPolicyNumber(emailBody) || extractPolicyNumber(subject);
    const policyNumber = extracted ?? fallbackPolicyDisplay(emailMessageIdForDisplay ?? messageId, claimId);
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
    if (messageId) claim.messageId = messageId;
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
    return hasRealClaims ? claims.filter((c)=>c.source !== 'demo') : claims;
}
function getIngestedClaimById(id) {
    const claims = getClaimsData();
    return claims.find((c)=>c.id === id) ?? null;
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
function clearAllIngestedClaims() {
    ensureDataDir();
    if (__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].existsSync(CLAIMS_FILE)) __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].unlinkSync(CLAIMS_FILE);
    if (__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].existsSync(INGESTED_DIR)) {
        for (const entry of __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].readdirSync(INGESTED_DIR, {
            withFileTypes: true
        })){
            const fullPath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(INGESTED_DIR, entry.name);
            if (entry.isDirectory()) __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].rmSync(fullPath, {
                recursive: true
            });
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
"[project]/Autonomous-Claims-Orchestrator/services/extraction/index.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "runExtraction",
    ()=>runExtraction
]);
/**
 * Extraction Microservice
 *
 * Runs information_extraction.py (LLM-based extraction from email, documents, images).
 * Returns structured claim fields, evidence, and document analysis.
 */ var __TURBOPACK__imported__module__$5b$externals$5d2f$child_process__$5b$external$5d$__$28$child_process$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/child_process [external] (child_process, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$services$2f$ingested$2d$claims$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Autonomous-Claims-Orchestrator/services/ingested-claims/index.ts [app-route] (ecmascript)");
;
;
;
const SCRIPT_PATH = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), 'services', 'extraction', 'extraction.py');
const PY_CMD = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : 'python3';
async function runExtraction(ingestedClaimId) {
    const claim = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$services$2f$ingested$2d$claims$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getIngestedClaimById"])(ingestedClaimId);
    if (!claim) {
        throw new Error('Claim not found');
    }
    return new Promise((resolve, reject)=>{
        const proc = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$child_process__$5b$external$5d$__$28$child_process$2c$__cjs$29$__["spawn"])(PY_CMD, [
            SCRIPT_PATH,
            ingestedClaimId
        ], {
            cwd: process.cwd(),
            env: {
                ...process.env
            }
        });
        let stdout = '';
        let stderr = '';
        proc.stdout?.on('data', (d)=>{
            stdout += d.toString();
        });
        proc.stderr?.on('data', (d)=>{
            stderr += d.toString();
        });
        proc.on('close', (code)=>{
            try {
                const parsed = JSON.parse(stdout.trim());
                if (parsed.error) {
                    reject(new Error(parsed.error));
                } else {
                    resolve(parsed);
                }
            } catch  {
                reject(new Error(stderr || stdout || `Python exited with code ${code}`));
            }
        });
        proc.on('error', (err)=>reject(err));
    });
}
}),
"[project]/Autonomous-Claims-Orchestrator/lib/policyClauses.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Policy clauses database — ISO form references and market-standard language.
 * Clauses align with ISO Personal Auto Policy (PAP), ISO HO-3, and ISO CGL forms.
 */ __turbopack_context__.s([
    "getPolicyGrounding",
    ()=>getPolicyGrounding
]);
const POLICY_CLAUSES = [
    {
        clauseId: 'PAP-D-001',
        formRef: 'ISO PAP 2018',
        title: 'Part D – Coverage for Damage to Your Auto (Collision)',
        section: 'Part D – Physical Damage',
        content: 'We will pay for direct and accidental loss to your covered auto caused by collision. "Collision" means the upset of your covered auto or its impact with another vehicle or object. Our limit of liability for loss will be the lesser of: (1) the actual cash value of the stolen or damaged property; or (2) the amount necessary to repair or replace the property with other property of like kind and quality. The deductible shown in the Declarations applies to each loss.',
        lossTypes: [
            'collision',
            'autocollision',
            'auto'
        ],
        productTypes: [
            'auto',
            'ac'
        ]
    },
    {
        clauseId: 'PAP-A-002',
        formRef: 'ISO PAP 2018',
        title: 'Part A – Liability Coverage (Bodily Injury)',
        section: 'Part A – Liability',
        content: 'We will pay damages for bodily injury or death for which any insured becomes legally responsible because of an auto accident. Damages include prejudgment interest awarded against the insured. We will settle or defend, as we consider appropriate, any claim or suit asking for these damages. In addition to our limit of liability, we will pay all defense costs we incur. Our duty to settle or defend ends when our limit of liability for this coverage has been exhausted by payment of judgments or settlements.',
        lossTypes: [
            'collision',
            'autocollision',
            'liability',
            'bodily injury'
        ],
        productTypes: [
            'auto',
            'ac',
            'cl'
        ]
    },
    {
        clauseId: 'PAP-C-003',
        formRef: 'ISO PAP 2018',
        title: 'Part C – Uninsured Motorists Coverage',
        section: 'Part C – Uninsured Motorists',
        content: 'We will pay compensatory damages which an insured is legally entitled to recover from the owner or operator of an uninsured motor vehicle because of bodily injury sustained by an insured caused by an accident. The owner\'s or operator\'s liability for these damages must arise out of the ownership, maintenance or use of the uninsured motor vehicle. Any judgment for damages arising out of a suit brought without our written consent is not binding on us.',
        lossTypes: [
            'collision',
            'autocollision'
        ],
        productTypes: [
            'auto',
            'ac'
        ]
    },
    {
        clauseId: 'HO3-I-004',
        formRef: 'ISO HO-3 2011',
        title: 'Section I – Accidental Discharge or Overflow of Water',
        section: 'Section I – Perils Insured Against (Coverage A & B)',
        content: 'We insure for direct physical loss to property described in Coverages A and B caused by: (8) Accidental discharge or overflow of water or steam from within a plumbing, heating, air conditioning or automatic fire protective sprinkler system or from within a household appliance, on the residence premises. This includes the cost to tear out and replace any part of a building necessary to repair the system or appliance from which the water or steam escaped. We do not cover loss to the system or appliance from which the water or steam escaped, or loss caused by or resulting from freezing except as provided in the Freezing of Plumbing peril. We do not cover loss from constant or repeated seepage or leakage over a period of 14 or more days.',
        lossTypes: [
            'water',
            'propertydamage',
            'property'
        ],
        productTypes: [
            'home',
            'ho',
            'property'
        ]
    },
    {
        clauseId: 'HO3-I-005',
        formRef: 'ISO HO-3 2011',
        title: 'Section I – Windstorm or Hail',
        section: 'Section I – Perils Insured Against',
        content: 'We insure for direct physical loss to property described in Coverages A and B caused by: (1) Windstorm or hail. This includes damage to roofs, siding, and other exterior surfaces. Tree limb or debris impact to the roof resulting in water intrusion is covered when windstorm or hail is the proximate cause of the damage. We do not cover loss to the interior of a building or the property inside it unless the wind or hail first damages the building, allowing the wind or hail to enter.',
        lossTypes: [
            'water',
            'propertydamage',
            'property',
            'storm'
        ],
        productTypes: [
            'home',
            'ho',
            'property'
        ]
    },
    {
        clauseId: 'HO3-I-006',
        formRef: 'ISO HO-3 2011',
        title: 'Section I – Deductible',
        section: 'Section I – Conditions',
        content: 'Our payment for loss will be the amount of loss minus your deductible. The deductible applies per occurrence. For loss caused by windstorm or hail, a separate windstorm or hail deductible may apply as shown in the Declarations. This deductible is calculated as a percentage of the Coverage A limit of liability. For all other covered perils, the deductible shown in the Declarations applies. No deductible applies to loss from theft.',
        lossTypes: [
            'water',
            'fire',
            'theft',
            'propertydamage',
            'collision'
        ],
        productTypes: [
            'home',
            'ho',
            'auto',
            'ac'
        ]
    },
    {
        clauseId: 'HO3-I-007',
        formRef: 'ISO HO-3 2011',
        primaryPeril: 'fire',
        title: 'Section I – Fire or Lightning',
        section: 'Section I – Perils Insured Against',
        content: 'We insure for direct physical loss to property described in Coverages A and B caused by: (2) Fire or lightning. This includes loss from smoke, scorching, or other damage caused by fire or lightning. We also cover loss from water or other substances used to extinguish the fire. We cover the cost of debris removal resulting from a loss we cover. We do not cover loss caused by fire resulting from agricultural smudging or industrial operations.',
        lossTypes: [
            'fire'
        ],
        productTypes: [
            'home',
            'ho',
            'property'
        ]
    },
    {
        clauseId: 'HO3-I-008',
        formRef: 'ISO HO-3 2011',
        primaryPeril: 'theft',
        title: 'Section I – Theft',
        section: 'Section I – Perils Insured Against',
        content: 'We insure for direct physical loss to property described in Coverages A and B caused by: (11) Theft, including attempted theft. We also cover loss of property from a known place when it is likely that the property has been stolen. We do not cover loss caused by theft committed by an insured. Proof of loss may require you to furnish a copy of the police report. We may require you to submit to examination under oath.',
        lossTypes: [
            'theft'
        ],
        productTypes: [
            'home',
            'ho',
            'property'
        ]
    },
    {
        clauseId: 'CGL-A-009',
        formRef: 'ISO CG 00 01',
        title: 'Coverage A – Bodily Injury and Property Damage Liability',
        section: 'Coverage A – Insuring Agreement',
        content: 'We will pay those sums that the insured becomes legally obligated to pay as damages because of "bodily injury" or "property damage" to which this insurance applies. We will have the right and duty to defend the insured against any "suit" seeking those damages. However, we will have no duty to defend the insured against any "suit" seeking damages for "bodily injury" or "property damage" to which this insurance does not apply. We may, at our discretion, investigate any "occurrence" and settle any claim or "suit" that may result. Our duty to settle or defend ends when we have used up the applicable limit of insurance in the payment of judgments or settlements.',
        lossTypes: [
            'liability',
            'slip and fall',
            'bodily injury'
        ],
        productTypes: [
            'commercial',
            'cl'
        ]
    },
    {
        clauseId: 'CGL-A-010',
        formRef: 'ISO CG 00 01',
        title: 'Coverage A – Premises and Operations',
        section: 'Coverage A – Bodily Injury and Property Damage',
        content: 'This insurance applies to "bodily injury" and "property damage" only if: (1) The "bodily injury" or "property damage" is caused by an "occurrence" that takes place in the "coverage territory"; (2) The "bodily injury" or "property damage" occurs during the policy period; and (3) Prior to the policy period, no insured listed under Paragraph 1. of Section II – Who Is An Insured and no "employee" authorized by you to give or receive notice of an "occurrence" or claim, knew that the "bodily injury" or "property damage" had occurred. "Occurrence" means an accident, including continuous or repeated exposure to substantially the same general harmful conditions. Premises liability, including slip, trip and fall incidents on your premises, falls within this coverage.',
        lossTypes: [
            'liability',
            'slip and fall',
            'premises'
        ],
        productTypes: [
            'commercial',
            'cl'
        ]
    },
    {
        clauseId: 'GEN-011',
        formRef: 'Standard Conditions',
        title: 'Duties in the Event of Loss',
        section: 'Conditions – Notice and Cooperation',
        content: 'You must see that the following are done in the event of loss: (a) Give prompt notice to us or our agent; (b) Give a description of how, when and where the loss occurred; (c) Take all reasonable steps to protect the property from further damage, and keep a record of your expenses for consideration in the settlement of the claim; (d) As often as we reasonably require, show the damaged property and provide us with records and documents we request; (e) Submit to examination under oath if we require it.',
        lossTypes: [
            'collision',
            'water',
            'fire',
            'theft',
            'liability',
            'propertydamage',
            'other'
        ],
        productTypes: [
            'auto',
            'home',
            'commercial',
            'ac',
            'ho',
            'cl'
        ]
    },
    {
        clauseId: 'GEN-012',
        formRef: 'Standard Conditions',
        title: 'Loss Payment',
        section: 'Conditions – Settlement',
        content: 'We will pay for covered loss within 30 days after we receive your proof of loss, if you have complied with all of the terms of this policy and: (a) We have reached agreement with you on the amount of loss; or (b) An appraisal award has been made. We will pay only for the actual cash value of the damage until actual repair or replacement is complete. Once actual repair or replacement is complete, we will pay the amount you actually spend that is necessary to complete the repair or replacement.',
        lossTypes: [
            'collision',
            'water',
            'fire',
            'theft',
            'liability',
            'other'
        ],
        productTypes: [
            'auto',
            'home',
            'commercial',
            'ac',
            'ho',
            'cl'
        ]
    }
];
function inferProductTypes(policyNumber) {
    const p = (policyNumber || '').toUpperCase().replace(/\*+/g, '').trim();
    if (p.startsWith('AC') || p.startsWith('AUTO')) return [
        'auto',
        'ac'
    ];
    if (p.startsWith('HO') || p.startsWith('HP') || p.startsWith('PROP')) return [
        'home',
        'ho',
        'property'
    ];
    if (p.startsWith('CL') || p.startsWith('GL') || p.startsWith('COM')) return [
        'commercial',
        'cl'
    ];
    return [
        'auto',
        'home',
        'commercial',
        'ac',
        'ho',
        'cl'
    ];
}
function inferLossTypes(lossType, description) {
    const types = new Set();
    const lt = (lossType || '').toLowerCase();
    const desc = (description || '').toLowerCase();
    const combined = `${lt} ${desc}`;
    if (/\b(collision|auto|autocollision|accident|vehicle|car)\b/.test(combined)) {
        types.add('collision').add('autocollision').add('auto');
    }
    if (/\b(water|leak|flood|storm|roof|intrusion|ceiling|pipe)\b/.test(combined)) {
        types.add('water').add('propertydamage').add('property');
    }
    if (/\b(fire|smoke)\b/.test(combined)) types.add('fire').add('propertydamage');
    if (/\b(theft|stolen)\b/.test(combined)) types.add('theft').add('propertydamage');
    if (/\b(liability|slip|fall|premises|customer|restaurant|business)\b/.test(combined)) {
        types.add('liability').add('slip and fall').add('premises');
    }
    if (/\b(property|home|house|property damage)\b/.test(combined)) {
        types.add('property').add('propertydamage');
    }
    if (types.size === 0) {
        if (lt) types.add(lt.replace(/\s+/g, ''));
        types.add('other');
    }
    return Array.from(types);
}
function computeSimilarity(clause, lossTypes, productTypes) {
    const claimLossSet = new Set(lossTypes.map((t)=>t.toLowerCase()));
    // Peril-specific clauses (e.g. Theft, Fire) must match their primary peril
    if (clause.primaryPeril) {
        const required = clause.primaryPeril.toLowerCase();
        if (!claimLossSet.has(required) && ![
            ...claimLossSet
        ].some((lt)=>lt.includes(required) || required.includes(lt))) {
            return 0;
        }
    }
    let score = 0.5;
    const clauseLoss = clause.lossTypes.map((t)=>t.toLowerCase());
    const clauseProduct = clause.productTypes.map((t)=>t.toLowerCase());
    for (const lt of lossTypes){
        if (clauseLoss.some((c)=>c.includes(lt) || lt.includes(c))) {
            score += 0.28;
            break;
        }
    }
    for (const pt of productTypes){
        if (clauseProduct.some((c)=>c.includes(pt) || pt.includes(c))) {
            score += 0.2;
            break;
        }
    }
    return Math.min(0.97, score);
}
function buildRationale(clause, lossType, policyNumber) {
    const parts = [
        clause.formRef
    ];
    if (lossType) parts.push(`Loss type: ${lossType}`);
    if (policyNumber) parts.push('Product type applicable');
    return parts.join(' • ');
}
function getPolicyGrounding(extractedFields) {
    const policyNumber = String(extractedFields.policyNumber || '').replace(/\*+/g, '').trim();
    const lossType = String(extractedFields.lossType || 'Other').trim();
    const description = String(extractedFields.description || '');
    const productTypes = policyNumber ? inferProductTypes(policyNumber) : [
        'auto',
        'home',
        'commercial',
        'ac',
        'ho',
        'cl'
    ];
    const lossTypes = inferLossTypes(lossType, description);
    const scored = POLICY_CLAUSES.map((clause)=>{
        const similarity = computeSimilarity(clause, lossTypes, productTypes);
        return {
            ...clause,
            similarity,
            rationale: buildRationale(clause, lossType, policyNumber)
        };
    });
    scored.sort((a, b)=>b.similarity - a.similarity);
    const hits = scored.slice(0, 6).filter((s)=>s.similarity >= 0.6);
    return hits.map((c)=>({
            clauseId: c.clauseId,
            title: c.title,
            snippet: c.content.slice(0, 140) + (c.content.length > 140 ? '...' : ''),
            content: c.content,
            section: c.section,
            score: c.similarity,
            similarity: c.similarity,
            rationale: c.rationale,
            sourceRef: c.formRef,
            sourceDocument: 'Policy Schedule'
        }));
}
}),
"[project]/Autonomous-Claims-Orchestrator/lib/confidence.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Confidence score thresholds used across the application.
 * All displayed confidence values should be real-time (from extraction), not static.
 */ __turbopack_context__.s([
    "CONFIDENCE",
    ()=>CONFIDENCE,
    "isHighConfidence",
    ()=>isHighConfidence,
    "isLowConfidence",
    ()=>isLowConfidence,
    "isMediumConfidence",
    ()=>isMediumConfidence
]);
const CONFIDENCE = {
    /** High: auto-approve / trusted */ THRESHOLD_HIGH: 0.8,
    /** Medium: proceed with normal review */ THRESHOLD_MEDIUM: 0.6,
    /** Low: requires manual review */ THRESHOLD_LOW: 0
};
function isHighConfidence(c) {
    return c >= CONFIDENCE.THRESHOLD_HIGH;
}
function isMediumConfidence(c) {
    return c >= CONFIDENCE.THRESHOLD_MEDIUM && c < CONFIDENCE.THRESHOLD_HIGH;
}
function isLowConfidence(c) {
    return c < CONFIDENCE.THRESHOLD_MEDIUM;
}
}),
"[project]/Autonomous-Claims-Orchestrator/services/decision/index.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "buildDecisionPack",
    ()=>buildDecisionPack
]);
/**
 * Decision Microservice
 *
 * Builds decision pack: policy grounding, claim draft, evidence summary,
 * document analysis, and policy assessment.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$lib$2f$policyClauses$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Autonomous-Claims-Orchestrator/lib/policyClauses.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$lib$2f$confidence$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Autonomous-Claims-Orchestrator/lib/confidence.ts [app-route] (ecmascript)");
;
;
function maskEmail(email) {
    if (!email) return 'Not found';
    const [user, domain] = email.split('@');
    return `${user.slice(0, 2)}***@${domain}`;
}
function maskPhone(phone) {
    if (!phone) return 'Not found';
    return phone.replace(/\d(?=\d{4})/g, '*');
}
/** Build claim draft from extraction result */ function buildClaimDraft(fields, claim, extraction) {
    const now = new Date().toISOString();
    return {
        id: `DRAFT-${Date.now()}`,
        policyNumber: fields.policyNumber ? `***${String(fields.policyNumber).slice(-3)}` : 'Not found',
        claimantName: fields.claimantName || 'Not found',
        contactEmail: maskEmail(fields.contactEmail ?? null),
        contactPhone: maskPhone(fields.contactPhone ?? null),
        lossDate: fields.lossDate || now.split('T')[0],
        lossType: fields.lossType || 'Other',
        lossLocation: fields.lossLocation || 'See description',
        description: fields.description || 'Claim submitted via email',
        estimatedAmount: fields.estimatedAmount ?? fields.estimatedDamage ?? 0,
        vehicleInfo: fields.vehicleInfo,
        propertyAddress: fields.propertyAddress,
        attachments: claim.attachments.map((a, i)=>({
                id: `doc_${i}`,
                name: a.name,
                type: extraction.documents[i]?.type || 'Other',
                mimeType: a.mimeType,
                confidence: extraction.documents[i]?.confidence ?? 0.7
            })),
        coverageFound: !!fields.policyNumber,
        deductible: fields.policyNumber ? 500 : undefined,
        createdAt: now,
        source: 'information_extraction',
        confidence: extraction.evidence.length > 0 ? extraction.evidence.reduce((s, e)=>s + e.confidence, 0) / extraction.evidence.length : 0
    };
}
function buildDecisionPack(ingestedClaimId, claim, extraction) {
    const fields = extraction.extractedFields || {};
    const policyGrounding = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$lib$2f$policyClauses$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getPolicyGrounding"])(fields);
    const claimDraft = buildClaimDraft(fields, claim, extraction);
    const now = new Date().toISOString();
    const claimId = `CLM-${ingestedClaimId}`;
    const ev = extraction.evidence;
    const docs = extraction.documents;
    return {
        claimId,
        ingestedClaimId,
        sourceEmailFrom: claim.from,
        decisionPack: {
            id: `DP-${Date.now()}`,
            claimDraft,
            evidence: extraction.evidence,
            documents: extraction.documents.map((d)=>({
                    ...d,
                    metadata: {}
                })),
            policyGrounding,
            audit: [
                {
                    step: 'Information Extraction',
                    timestamp: now,
                    duration: 0,
                    agent: 'Extraction',
                    status: 'completed',
                    success: true,
                    details: {
                        documentsProcessed: extraction.documents.length,
                        errors: extraction.errors
                    }
                },
                {
                    step: 'Policy Grounding: Querying policy clause database',
                    timestamp: now,
                    duration: 0,
                    agent: 'PolicyRAG',
                    status: 'completed',
                    success: true,
                    details: {
                        clausesFound: policyGrounding.length,
                        coverageConfirmed: !!fields.policyNumber && policyGrounding.length > 0
                    }
                },
                {
                    step: 'Assembling Decision Pack',
                    timestamp: now,
                    duration: 0,
                    agent: 'Assembler',
                    status: 'completed',
                    success: true,
                    details: {
                        evidenceCount: ev.length,
                        documentCount: docs.length
                    }
                }
            ],
            evidenceSummary: {
                totalFields: 8,
                highConfidenceFields: ev.filter((e)=>e.confidence >= __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$lib$2f$confidence$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["CONFIDENCE"].THRESHOLD_HIGH).length,
                lowConfidenceFields: ev.filter((e)=>e.confidence < __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$lib$2f$confidence$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["CONFIDENCE"].THRESHOLD_MEDIUM).length,
                avgConfidence: ev.length > 0 ? ev.reduce((s, e)=>s + e.confidence, 0) / ev.length : 0
            },
            documentAnalysis: {
                totalDocuments: docs.length,
                documentTypes: docs.map((d)=>d.type),
                avgDocumentConfidence: docs.length > 0 ? docs.reduce((s, d)=>s + d.confidence, 0) / docs.length : 0,
                missingDocuments: []
            },
            policyAssessment: {
                clausesFound: policyGrounding.length,
                coverageConfirmed: !!fields.policyNumber && policyGrounding.length > 0,
                topSimilarityScore: policyGrounding[0]?.score ?? policyGrounding[0]?.similarity ?? 0,
                recommendedActions: policyGrounding.length > 0 ? [
                    'Proceed with claim – policy clauses matched'
                ] : [
                    'Manual review – no matching policy clauses found'
                ]
            },
            processingSummary: {
                totalTime: 0,
                stepsCompleted: 4,
                stepsWithErrors: extraction.errors.length,
                automationLevel: 0.9
            },
            createdAt: now
        },
        auditTrail: [
            {
                step: 'process_claim',
                timestamp: now,
                duration: 0,
                agent: 'ProcessClaimAPI',
                status: 'completed',
                details: {
                    openaiIntegration: 'active',
                    model: 'gpt-4o'
                }
            }
        ],
        processingMetrics: {
            totalProcessingTime: 0,
            averageHandleTime: 0,
            fieldsAutoPopulated: extraction.evidence.length,
            overrideRate: 0.1,
            ragHitRate: 1.0,
            stepsCompleted: 4,
            stepsFailed: extraction.errors.length,
            successRate: extraction.errors.length === 0 ? 1.0 : 0.9
        },
        createdAt: now,
        status: 'draft'
    };
}
}),
"[project]/Autonomous-Claims-Orchestrator/services/dashboard/index.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getCsvContent",
    ()=>getCsvContent,
    "getDashboardKpis",
    ()=>getDashboardKpis,
    "getProcessedClaimById",
    ()=>getProcessedClaimById,
    "getProcessedClaimSummaries",
    ()=>getProcessedClaimSummaries,
    "saveProcessedClaim",
    ()=>saveProcessedClaim
]);
/**
 * Dashboard Microservice
 *
 * Delegates to Python (dashboard.py) for processed claims history:
 * save, list, retrieve by ID, export CSV.
 */ var __TURBOPACK__imported__module__$5b$externals$5d2f$child_process__$5b$external$5d$__$28$child_process$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/child_process [external] (child_process, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
;
;
const SCRIPT_PATH = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), 'services', 'dashboard', 'dashboard.py');
const PY_CMD = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : 'python3';
async function runPython(args, stdin) {
    return new Promise((resolve, reject)=>{
        const proc = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$child_process__$5b$external$5d$__$28$child_process$2c$__cjs$29$__["spawn"])(PY_CMD, [
            SCRIPT_PATH,
            ...args
        ], {
            cwd: process.cwd(),
            env: {
                ...process.env
            },
            stdio: stdin !== undefined ? [
                'pipe',
                'pipe',
                'pipe'
            ] : [
                'ignore',
                'pipe',
                'pipe'
            ]
        });
        let stdout = '';
        let stderr = '';
        proc.stdout?.on('data', (d)=>{
            stdout += d.toString();
        });
        proc.stderr?.on('data', (d)=>{
            stderr += d.toString();
        });
        if (stdin !== undefined && proc.stdin) {
            proc.stdin.write(stdin, 'utf-8');
            proc.stdin.end();
        }
        proc.on('close', (code)=>{
            if (code !== 0) {
                reject(new Error(stderr || stdout || `Python exited with code ${code}`));
            } else {
                resolve(stdout);
            }
        });
        proc.on('error', (err)=>reject(err));
    });
}
async function saveProcessedClaim(claim) {
    const input = JSON.stringify(claim);
    const out = await runPython([
        'save'
    ], input);
    const parsed = JSON.parse(out.trim());
    if (parsed.error) {
        throw new Error(parsed.error);
    }
}
async function getProcessedClaimSummaries() {
    const out = await runPython([
        'list'
    ]);
    return JSON.parse(out.trim());
}
async function getProcessedClaimById(claimId) {
    const out = await runPython([
        'get',
        claimId
    ]);
    const trimmed = out.trim();
    if (trimmed === 'null') return null;
    return JSON.parse(trimmed);
}
async function getCsvContent() {
    return runPython([
        'csv'
    ]);
}
async function getDashboardKpis() {
    const out = await runPython([
        'stats'
    ]);
    return JSON.parse(out.trim());
}
}),
"[project]/Autonomous-Claims-Orchestrator/app/api/process-claim/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
/**
 * POST /api/process-claim
 * Orchestrates Extraction + Decision microservices.
 * Runs information_extraction.py, builds decision pack, saves to dashboard.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Autonomous-Claims-Orchestrator/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$services$2f$extraction$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Autonomous-Claims-Orchestrator/services/extraction/index.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$services$2f$decision$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Autonomous-Claims-Orchestrator/services/decision/index.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$services$2f$ingested$2d$claims$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Autonomous-Claims-Orchestrator/services/ingested-claims/index.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$services$2f$dashboard$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Autonomous-Claims-Orchestrator/services/dashboard/index.ts [app-route] (ecmascript)");
;
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
        const claim = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$services$2f$ingested$2d$claims$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getIngestedClaimById"])(ingestedClaimId);
        if (!claim) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Claim not found'
            }, {
                status: 404
            });
        }
        const extraction = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$services$2f$extraction$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["runExtraction"])(ingestedClaimId);
        const claimData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$services$2f$decision$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["buildDecisionPack"])(ingestedClaimId, claim, extraction);
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$services$2f$dashboard$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["saveProcessedClaim"])(claimData);
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

//# sourceMappingURL=%5Broot-of-the-server%5D__d6a1d12b._.js.map