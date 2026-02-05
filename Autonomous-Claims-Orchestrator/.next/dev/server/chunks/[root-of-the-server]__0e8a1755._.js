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
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/zlib [external] (zlib, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("zlib", () => require("zlib"));

module.exports = mod;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/events [external] (events, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("events", () => require("events"));

module.exports = mod;
}),
"[project]/Autonomous-Claims-Orchestrator/app/api/decision-pack/pdf/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
/**
 * POST /api/decision-pack/pdf
 * Generates a structured PDF of the Decision Pack including Claim Status
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Autonomous-Claims-Orchestrator/node_modules/next/server.js [app-route] (ecmascript)");
;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getPDFDocumentConstructor() {
    try {
        const pdfkit = __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/pdfkit/js/pdfkit.es.js [app-route] (ecmascript)");
        const PDF = pdfkit.default ?? pdfkit;
        if (typeof PDF === 'function') return PDF;
    } catch  {
    // fallback
    }
    throw new Error('PDFDocument could not be loaded. Ensure pdfkit is installed.');
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function addSectionTitle(doc, title, y) {
    if (y !== undefined) doc.y = y;
    doc.fontSize(12).font('Helvetica-Bold').fillColor('#0369A1').text(title, {
        continued: false
    });
    doc.moveDown(0.3);
    doc.font('Helvetica').fontSize(10).fillColor('#334155');
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function addKeyValue(doc, key, value) {
    const str = value != null && value !== '' ? String(value) : '—';
    doc.text(`${key}: ${str}`, {
        indent: 10
    });
}
async function POST(request) {
    try {
        const body = await request.json();
        const { claimData, claimStatus = 'pending' } = body || {};
        if (!claimData?.decisionPack) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'claimData with decisionPack is required'
            }, {
                status: 400
            });
        }
        const PDFDocument = getPDFDocumentConstructor();
        const doc = new PDFDocument({
            margin: 50,
            size: 'A4'
        });
        const chunks = [];
        doc.on('data', (chunk)=>chunks.push(chunk));
        const claimId = claimData.claimId || 'N/A';
        const claimDraft = claimData.decisionPack.claimDraft || {};
        const evidence = claimData.decisionPack.evidence || [];
        const documents = claimData.decisionPack.documents || [];
        const policyGrounding = claimData.decisionPack.policyGrounding || [];
        const evidenceSummary = claimData.decisionPack.evidenceSummary;
        // Header
        doc.fontSize(18).font('Helvetica-Bold').fillColor('#1E293B').text('Decision Pack', 50, 50);
        doc.fontSize(10).font('Helvetica').fillColor('#64748B').text(`Claim ID: ${claimId}`, 50, 72);
        doc.text(`Generated: ${new Date().toLocaleString()}`, 50, 84);
        doc.moveDown(1);
        // Claim Status – prominent
        const statusText = claimStatus === 'accepted' ? 'Accepted' : claimStatus === 'rejected' ? 'Rejected' : 'Pending';
        doc.fontSize(14).font('Helvetica-Bold');
        if (claimStatus === 'accepted') doc.fillColor('#047857');
        else if (claimStatus === 'rejected') doc.fillColor('#B91C1C');
        else doc.fillColor('#64748B');
        doc.text(`Claim Status: ${statusText}`, 50, doc.y + 10);
        doc.moveDown(0.8);
        doc.font('Helvetica').fontSize(10).fillColor('#334155');
        // Claim Summary
        addSectionTitle(doc, 'Claim Summary');
        addKeyValue(doc, 'Policy', claimDraft.policyNumber || claimDraft.policyId);
        addKeyValue(doc, 'Claimant', claimDraft.claimantName);
        addKeyValue(doc, 'Loss Date', claimDraft.lossDate);
        addKeyValue(doc, 'Loss Type', claimDraft.lossType);
        addKeyValue(doc, 'Location', claimDraft.lossLocation || claimDraft.location || claimDraft.propertyAddress);
        if (claimDraft.deductible != null) addKeyValue(doc, 'Deductible', `$${claimDraft.deductible}`);
        doc.moveDown(0.5);
        // Evidence Summary
        addSectionTitle(doc, 'Evidence Summary');
        addKeyValue(doc, 'Documents Attached', documents.length);
        addKeyValue(doc, 'Fields Extracted', evidence.length);
        if (evidenceSummary) {
            addKeyValue(doc, 'High Confidence Fields', evidenceSummary.highConfidenceFields);
        }
        doc.moveDown(0.5);
        // Policy Grounding
        if (policyGrounding.length > 0) {
            addSectionTitle(doc, 'Policy Grounding');
            addKeyValue(doc, 'Clauses Found', policyGrounding.length);
            addKeyValue(doc, 'Coverage', claimDraft.coverageFound ? 'Confirmed' : 'Under Review');
            doc.moveDown(0.3);
            policyGrounding.forEach((policy, i)=>{
                if (doc.y > 700) {
                    doc.addPage();
                    doc.y = 50;
                }
                doc.font('Helvetica-Bold').fontSize(10).fillColor('#0C4A6E');
                doc.text(`${policy.clauseId} – ${policy.title}`, {
                    indent: 10
                });
                const score = policy.score ?? policy.similarity ?? 0;
                doc.font('Helvetica').text(`Match: ${Math.round(score * 100)}%`, {
                    indent: 10
                });
                const content = policy.content || policy.snippet || '';
                if (content) {
                    doc.fontSize(9).fillColor('#475569');
                    doc.text(content.slice(0, 300) + (content.length > 300 ? '...' : ''), {
                        indent: 15,
                        align: 'left'
                    });
                }
                if (policy.rationale) {
                    doc.fontSize(8).fillColor('#94A3B8').font('Helvetica-Oblique');
                    doc.text(`Rationale: ${policy.rationale}`, {
                        indent: 15
                    });
                    doc.font('Helvetica');
                }
                doc.moveDown(0.4);
            });
        }
        doc.end();
        const buffer = await new Promise((resolve, reject)=>{
            doc.on('end', ()=>resolve(Buffer.concat(chunks)));
            doc.on('error', reject);
        });
        const filename = `Decision-Pack-${claimId.replace(/[/\\?%*:|"<>]/g, '-')}.pdf`;
        return new __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"](new Uint8Array(buffer), {
            status: 200,
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="${filename}"`,
                'Content-Length': String(buffer.length)
            }
        });
    } catch (err) {
        console.error('PDF generation error:', err);
        return __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: err instanceof Error ? err.message : 'Failed to generate PDF'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0e8a1755._.js.map