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
"[project]/Autonomous-Claims-Orchestrator/app/api/claims/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Autonomous-Claims-Orchestrator/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$services$2f$dashboard$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Autonomous-Claims-Orchestrator/services/dashboard/index.ts [app-route] (ecmascript)");
;
;
async function GET() {
    try {
        const summaries = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$services$2f$dashboard$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getProcessedClaimSummaries"])();
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
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$services$2f$dashboard$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["saveProcessedClaim"])(body);
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

//# sourceMappingURL=%5Broot-of-the-server%5D__6b7d14a6._.js.map