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
"[externals]/worker_threads [external] (worker_threads, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("worker_threads", () => require("worker_threads"));

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
 * Generates a structured PDF of the Decision Pack including Claim Status.
 * Uses jsPDF (no external font files) for compatibility with serverless/bundled environments.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Autonomous-Claims-Orchestrator/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$jspdf$2f$dist$2f$jspdf$2e$node$2e$min$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Autonomous-Claims-Orchestrator/node_modules/jspdf/dist/jspdf.node.min.js [app-route] (ecmascript)");
;
;
const MARGIN = 20;
const LINE_HEIGHT = 6;
const PAGE_HEIGHT = 297;
function addSectionTitle(doc, title, y) {
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(3, 105, 161);
    doc.text(title, MARGIN, y);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(51, 65, 85);
    return y + LINE_HEIGHT;
}
function addKeyValue(doc, key, value, y) {
    const str = value != null && value !== '' ? String(value) : '—';
    doc.text(`${key}: ${str}`, MARGIN + 5, y);
    return y + LINE_HEIGHT;
}
function addText(doc, text, x, y, maxWidth) {
    const lines = doc.splitTextToSize(text, maxWidth);
    doc.text(lines, x, y);
    return y + lines.length * LINE_HEIGHT;
}
/** Add text with automatic page breaks when content overflows */ function addTextWithPageBreaks(doc, text, x, y, maxWidth) {
    const lines = doc.splitTextToSize(text, maxWidth);
    const bottomMargin = MARGIN + 20;
    for (const line of lines){
        if (y > PAGE_HEIGHT - bottomMargin) {
            doc.addPage();
            y = MARGIN;
        }
        doc.text(line, x, y);
        y += LINE_HEIGHT;
    }
    return y;
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
        const doc = new __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$jspdf$2f$dist$2f$jspdf$2e$node$2e$min$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsPDF"]({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });
        let y = 20;
        const claimId = claimData.claimId || 'N/A';
        const claimDraft = claimData.decisionPack.claimDraft || {};
        const evidence = claimData.decisionPack.evidence || [];
        const documents = claimData.decisionPack.documents || [];
        const policyGrounding = claimData.decisionPack.policyGrounding || [];
        const evidenceSummary = claimData.decisionPack.evidenceSummary;
        const maxWidth = 210 - MARGIN * 2;
        // Header
        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(30, 41, 59);
        doc.text('Decision Pack', MARGIN, y);
        y += 8;
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100, 116, 139);
        doc.text(`Claim ID: ${claimId}`, MARGIN, y);
        y += 5;
        doc.text(`Generated: ${new Date().toLocaleString()}`, MARGIN, y);
        y += 10;
        // Claim Status – prominent
        const statusText = claimStatus === 'accepted' ? 'Accepted' : claimStatus === 'rejected' ? 'Rejected' : 'Pending';
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        if (claimStatus === 'accepted') doc.setTextColor(4, 120, 87);
        else if (claimStatus === 'rejected') doc.setTextColor(185, 28, 28);
        else doc.setTextColor(100, 116, 139);
        doc.text(`Claim Status: ${statusText}`, MARGIN, y);
        doc.setTextColor(51, 65, 85);
        y += 10;
        // Claim Summary
        y = addSectionTitle(doc, 'Claim Summary', y);
        y = addKeyValue(doc, 'Policy', claimDraft.policyNumber || claimDraft.policyId, y);
        y = addKeyValue(doc, 'Claimant', claimDraft.claimantName, y);
        y = addKeyValue(doc, 'Loss Date', claimDraft.lossDate, y);
        y = addKeyValue(doc, 'Loss Type', claimDraft.lossType, y);
        y = addKeyValue(doc, 'Location', claimDraft.lossLocation || claimDraft.location || claimDraft.propertyAddress, y);
        if (claimDraft.deductible != null) y = addKeyValue(doc, 'Deductible', `$${claimDraft.deductible}`, y);
        y += 5;
        // Evidence Summary
        y = addSectionTitle(doc, 'Evidence Summary', y);
        y = addKeyValue(doc, 'Documents Attached', documents.length, y);
        y = addKeyValue(doc, 'Fields Extracted', evidence.length, y);
        if (evidenceSummary) {
            y = addKeyValue(doc, 'High Confidence Fields', evidenceSummary.highConfidenceFields, y);
        }
        y += 5;
        // Policy Grounding
        if (policyGrounding.length > 0) {
            y = addSectionTitle(doc, 'Policy Grounding', y);
            y = addKeyValue(doc, 'Clauses Found', policyGrounding.length, y);
            y = addKeyValue(doc, 'Coverage', claimDraft.coverageFound ? 'Confirmed' : 'Under Review', y);
            y += 3;
            for (const policy of policyGrounding){
                if (y > PAGE_HEIGHT - 50) {
                    doc.addPage();
                    y = MARGIN;
                }
                doc.setFont('helvetica', 'bold');
                doc.setFontSize(10);
                doc.setTextColor(12, 74, 110);
                y = addText(doc, `${policy.clauseId} – ${policy.title}`, MARGIN + 5, y, maxWidth - 5);
                doc.setFont('helvetica', 'normal');
                const score = policy.score ?? policy.similarity ?? 0;
                doc.text(`Match: ${Math.round(score * 100)}%`, MARGIN + 5, y);
                y += LINE_HEIGHT;
                const content = policy.content || policy.snippet || '';
                if (content) {
                    doc.setFontSize(9);
                    doc.setTextColor(71, 85, 105);
                    y = addTextWithPageBreaks(doc, content, MARGIN + 10, y, maxWidth - 10);
                    doc.setTextColor(51, 65, 85);
                }
                if (policy.rationale) {
                    if (y > PAGE_HEIGHT - 50) {
                        doc.addPage();
                        y = MARGIN;
                    }
                    doc.setFontSize(8);
                    doc.setTextColor(148, 163, 184);
                    doc.setFont('helvetica', 'italic');
                    y = addTextWithPageBreaks(doc, `Rationale: ${policy.rationale}`, MARGIN + 10, y, maxWidth - 10);
                    doc.setFont('helvetica', 'normal');
                    doc.setTextColor(51, 65, 85);
                }
                y += 5;
            }
        }
        const buffer = doc.output('arraybuffer');
        const filename = `Decision-Pack-${claimId.replace(/[/\\?%*:|"<>]/g, '-')}.pdf`;
        return new __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"](buffer, {
            status: 200,
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="${filename}"`,
                'Content-Length': String(buffer.byteLength)
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

//# sourceMappingURL=%5Broot-of-the-server%5D__cd5941a1._.js.map