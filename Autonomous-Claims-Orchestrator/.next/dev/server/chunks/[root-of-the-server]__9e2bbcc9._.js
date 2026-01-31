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
"[project]/Autonomous-Claims-Orchestrator/app/api/claims/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Autonomous-Claims-Orchestrator/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$lib$2f$processedClaims$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Autonomous-Claims-Orchestrator/lib/processedClaims.ts [app-route] (ecmascript)");
;
;
async function GET() {
    try {
        const summaries = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$lib$2f$processedClaims$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getProcessedClaimSummaries"])();
        return __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(summaries);
    } catch (error) {
        console.error('List claims error:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Failed to list claims'
        }, {
            status: 500
        });
    }
}
async function POST(request) {
    try {
        const body = await request.json();
        if (!body?.decisionPack) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Invalid claim data'
            }, {
                status: 400
            });
        }
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$lib$2f$processedClaims$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["saveProcessedClaim"])(body);
        return __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            claimId: body.claimId
        });
    } catch (error) {
        console.error('Save claim error:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Failed to save claim'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__9e2bbcc9._.js.map