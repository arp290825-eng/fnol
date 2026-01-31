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
function normalizeDedupKey(s) {
    return s.trim().toLowerCase();
}
function normalizedSubjectFrom(subject, from) {
    return normalizeDedupKey(`${subject}|${from}`);
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
    const subjectFrom = normalizedSubjectFrom(subject, from);
    if (existingIds.has(subjectFrom)) return true;
    const dedupKey = messageId ? normalizeDedupKey(messageId) : normalizeDedupKey(`${subject}|${from}|${dateHeader}`);
    if (existingIds.has(dedupKey)) return true;
    if (messageId) {
        const inner = messageId.replace(/^<|>$/g, '').trim();
        if (inner && existingIds.has(normalizeDedupKey(inner))) return true;
    }
    return false;
}
/** Use email Message-ID as identifier when policy number not found */ function fallbackPolicyDisplay(messageId, claimId) {
    if (!messageId) return claimId;
    // Message-ID format: <local@domain> - use the email ID itself (strip angle brackets)
    if (messageId.includes('<') && messageId.includes('@')) {
        const inner = messageId.replace(/^<|>$/g, '').trim();
        return inner || claimId;
    }
    return claimId;
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
"[project]/Autonomous-Claims-Orchestrator/lib/processedClaims.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getProcessedClaimById",
    ()=>getProcessedClaimById,
    "getProcessedClaimSummaries",
    ()=>getProcessedClaimSummaries,
    "saveProcessedClaim",
    ()=>saveProcessedClaim
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/fs [external] (fs, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
;
;
const DATA_DIR = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), 'data');
const CLAIMS_DIR = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(DATA_DIR, 'processed-claims');
const INDEX_FILE = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(CLAIMS_DIR, 'claims-index.json');
const CSV_FILE = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(CLAIMS_DIR, 'claims-history.csv');
function ensureDir() {
    if (!__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].existsSync(DATA_DIR)) __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].mkdirSync(DATA_DIR, {
        recursive: true
    });
    if (!__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].existsSync(CLAIMS_DIR)) __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].mkdirSync(CLAIMS_DIR, {
        recursive: true
    });
}
function getIndex() {
    ensureDir();
    if (!__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].existsSync(INDEX_FILE)) return [];
    try {
        return JSON.parse(__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].readFileSync(INDEX_FILE, 'utf-8'));
    } catch  {
        return [];
    }
}
function saveIndex(index) {
    ensureDir();
    __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].writeFileSync(INDEX_FILE, JSON.stringify(index, null, 2), 'utf-8');
}
function escapeCsv(val) {
    if (val == null || val === undefined) return '';
    const s = String(val);
    if (s.includes(',') || s.includes('"') || s.includes('\n')) {
        return `"${s.replace(/"/g, '""')}"`;
    }
    return s;
}
function appendToCsv(claim) {
    ensureDir();
    const draft = claim.decisionPack?.claimDraft;
    const isNew = !__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].existsSync(CSV_FILE);
    const headers = [
        'claimId',
        'ingestedClaimId',
        'policyNumber',
        'claimantName',
        'contactEmail',
        'contactPhone',
        'lossDate',
        'lossType',
        'lossLocation',
        'description',
        'status',
        'createdAt'
    ];
    const row = [
        claim.claimId ?? '',
        claim.ingestedClaimId ?? '',
        draft?.policyNumber ?? '',
        draft?.claimantName ?? '',
        draft?.contactEmail ?? '',
        draft?.contactPhone ?? '',
        draft?.lossDate ?? '',
        draft?.lossType ?? '',
        (draft?.lossLocation || draft?.location) ?? '',
        draft?.description ?? '',
        claim.status ?? '',
        claim.createdAt ?? new Date().toISOString()
    ];
    const line = isNew ? headers.map(escapeCsv).join(',') + '\n' : '';
    __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].appendFileSync(CSV_FILE, line + row.map(escapeCsv).join(',') + '\n', 'utf-8');
}
function saveProcessedClaim(claim) {
    ensureDir();
    const claimId = claim.claimId || `CLM-${Date.now()}`;
    const filePath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(CLAIMS_DIR, `${claimId.replace(/[/\\:]/g, '_')}.json`);
    const toSave = {
        ...claim,
        claimId
    };
    __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].writeFileSync(filePath, JSON.stringify(toSave, null, 2), 'utf-8');
    const draft = claim.decisionPack?.claimDraft;
    const index = getIndex();
    const existing = index.findIndex((e)=>e.claimId === claimId);
    if (existing < 0) appendToCsv(toSave);
    const entry = {
        claimId,
        ingestedClaimId: claim.ingestedClaimId,
        policyNumber: draft?.policyNumber,
        claimantName: draft?.claimantName,
        createdAt: claim.createdAt || new Date().toISOString(),
        filePath
    };
    if (existing >= 0) {
        index[existing] = entry;
    } else {
        index.unshift(entry);
    }
    saveIndex(index);
}
function getProcessedClaimSummaries() {
    const index = getIndex();
    return index.map(({ claimId, ingestedClaimId, policyNumber, claimantName, createdAt })=>({
            claimId,
            ingestedClaimId,
            policyNumber,
            claimantName,
            createdAt
        }));
}
function getProcessedClaimById(claimId) {
    const index = getIndex();
    const entry = index.find((e)=>e.claimId === claimId);
    if (!entry || !__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].existsSync(entry.filePath)) return null;
    try {
        return JSON.parse(__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].readFileSync(entry.filePath, 'utf-8'));
    } catch  {
        return null;
    }
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
"[externals]/child_process [external] (child_process, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("child_process", () => require("child_process"));

module.exports = mod;
}),
"[project]/Autonomous-Claims-Orchestrator/app/api/process-claim/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Autonomous-Claims-Orchestrator/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$lib$2f$ingestedClaims$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Autonomous-Claims-Orchestrator/lib/ingestedClaims.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$lib$2f$processedClaims$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Autonomous-Claims-Orchestrator/lib/processedClaims.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$lib$2f$confidence$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Autonomous-Claims-Orchestrator/lib/confidence.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$child_process__$5b$external$5d$__$28$child_process$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/child_process [external] (child_process, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
;
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
        const claim = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$lib$2f$ingestedClaims$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getIngestedClaimById"])(ingestedClaimId);
        if (!claim) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Claim not found'
            }, {
                status: 404
            });
        }
        const scriptPath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), 'information_extraction.py');
        const pyCmd = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : 'python3';
        const extraction = await new Promise((resolve, reject)=>{
            const proc = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$child_process__$5b$external$5d$__$28$child_process$2c$__cjs$29$__["spawn"])(pyCmd, [
                scriptPath,
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
        const fields = extraction.extractedFields || {};
        const maskEmail = (email)=>{
            if (!email) return 'Not found';
            const [user, domain] = email.split('@');
            return `${user.slice(0, 2)}***@${domain}`;
        };
        const maskPhone = (phone)=>{
            if (!phone) return 'Not found';
            return phone.replace(/\d(?=\d{4})/g, '*');
        };
        const now = new Date().toISOString();
        const claimDraft = {
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
        const policyGrounding = [
            {
                clauseId: 'SEC_003',
                title: 'Coverage Clause',
                snippet: 'Relevant coverage based on claim type',
                score: 0.92,
                rationale: 'Matched from extracted claim information'
            }
        ];
        const claimId = ingestedClaimId ? `CLM-${ingestedClaimId}` : `CLM-${Date.now()}`;
        const claimData = {
            claimId,
            ingestedClaimId,
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
                        step: 'information_extraction',
                        timestamp: now,
                        duration: 0,
                        agent: 'InformationExtraction',
                        status: 'completed',
                        details: {
                            documentsProcessed: extraction.documents.length,
                            errors: extraction.errors
                        }
                    }
                ],
                evidenceSummary: (()=>{
                    const ev = extraction.evidence;
                    const total = ev.length;
                    const high = ev.filter((e)=>e.confidence >= __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$lib$2f$confidence$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["CONFIDENCE"].THRESHOLD_HIGH).length;
                    const low = ev.filter((e)=>e.confidence < __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$lib$2f$confidence$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["CONFIDENCE"].THRESHOLD_MEDIUM).length;
                    const avg = total > 0 ? ev.reduce((s, e)=>s + e.confidence, 0) / total : 0;
                    return {
                        totalFields: 8,
                        highConfidenceFields: high,
                        lowConfidenceFields: low,
                        avgConfidence: avg
                    };
                })(),
                documentAnalysis: (()=>{
                    const docs = extraction.documents;
                    const total = docs.length;
                    const avg = total > 0 ? docs.reduce((s, d)=>s + d.confidence, 0) / total : 0;
                    return {
                        totalDocuments: total,
                        documentTypes: docs.map((d)=>d.type),
                        avgDocumentConfidence: avg,
                        missingDocuments: []
                    };
                })(),
                policyAssessment: {
                    clausesFound: 1,
                    coverageConfirmed: !!fields.policyNumber,
                    topSimilarityScore: 0.92,
                    recommendedActions: [
                        'Proceed with claim'
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
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$lib$2f$processedClaims$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["saveProcessedClaim"])(claimData);
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

//# sourceMappingURL=%5Broot-of-the-server%5D__b287b103._.js.map