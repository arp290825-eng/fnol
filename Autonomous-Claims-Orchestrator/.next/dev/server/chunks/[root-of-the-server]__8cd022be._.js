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
"[project]/Autonomous-Claims-Orchestrator/app/api/ingested-claims/clear/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Autonomous-Claims-Orchestrator/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$lib$2f$ingestedClaims$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Autonomous-Claims-Orchestrator/lib/ingestedClaims.ts [app-route] (ecmascript)");
;
;
async function POST() {
    try {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$lib$2f$ingestedClaims$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["clearAllIngestedClaims"])();
        return __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true
        });
    } catch (error) {
        console.error('Clear ingested claims error:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Failed to clear claims'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__8cd022be._.js.map