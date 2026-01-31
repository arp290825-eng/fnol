(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/Autonomous-Claims-Orchestrator/components/ConfigModal.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ConfigModal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Autonomous-Claims-Orchestrator/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Autonomous-Claims-Orchestrator/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/Autonomous-Claims-Orchestrator/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$key$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Key$3e$__ = __turbopack_context__.i("[project]/Autonomous-Claims-Orchestrator/node_modules/lucide-react/dist/esm/icons/key.js [app-client] (ecmascript) <export default as Key>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__ = __turbopack_context__.i("[project]/Autonomous-Claims-Orchestrator/node_modules/lucide-react/dist/esm/icons/check-circle.js [app-client] (ecmascript) <export default as CheckCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$alert$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__ = __turbopack_context__.i("[project]/Autonomous-Claims-Orchestrator/node_modules/lucide-react/dist/esm/icons/alert-circle.js [app-client] (ecmascript) <export default as AlertCircle>");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
function ConfigModal({ isOpen, onClose, onSave }) {
    _s();
    const [apiKey, setApiKey] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [showKey, setShowKey] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isValid, setIsValid] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ConfigModal.useEffect": ()=>{
            // Load saved API key from localStorage
            if ("TURBOPACK compile-time truthy", 1) {
                const savedKey = localStorage.getItem('openai_api_key');
                if (savedKey) {
                    setApiKey(savedKey);
                    setIsValid(savedKey.startsWith('sk-') && savedKey.length > 20);
                }
            }
        }
    }["ConfigModal.useEffect"], [
        isOpen
    ]);
    const handleSave = ()=>{
        if (apiKey.trim()) {
            // Save to localStorage and window for immediate use
            if ("TURBOPACK compile-time truthy", 1) {
                localStorage.setItem('openai_api_key', apiKey.trim());
                window.OPENAI_API_KEY = apiKey.trim();
            }
            onSave(apiKey.trim());
            onClose();
        }
    };
    const handleApiKeyChange = (value)=>{
        setApiKey(value);
        setIsValid(value.startsWith('sk-') && value.length > 20);
    };
    const clearApiKey = ()=>{
        setApiKey('');
        setIsValid(false);
        if ("TURBOPACK compile-time truthy", 1) {
            localStorage.removeItem('openai_api_key');
            delete window.OPENAI_API_KEY;
        }
        onSave('');
    };
    if (!isOpen) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "bg-white rounded-lg p-6 w-full max-w-md mx-4",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-between mb-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "text-xl font-semibold text-gray-900",
                            children: "OpenAI Configuration"
                        }, void 0, false, {
                            fileName: "[project]/Autonomous-Claims-Orchestrator/components/ConfigModal.tsx",
                            lineNumber: 61,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: onClose,
                            className: "text-gray-400 hover:text-gray-600",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                className: "w-6 h-6"
                            }, void 0, false, {
                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/ConfigModal.tsx",
                                lineNumber: 66,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/Autonomous-Claims-Orchestrator/components/ConfigModal.tsx",
                            lineNumber: 62,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Autonomous-Claims-Orchestrator/components/ConfigModal.tsx",
                    lineNumber: 60,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "block text-sm font-medium text-gray-700 mb-2",
                                    children: "OpenAI API Key"
                                }, void 0, false, {
                                    fileName: "[project]/Autonomous-Claims-Orchestrator/components/ConfigModal.tsx",
                                    lineNumber: 72,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "relative",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: showKey ? 'text' : 'password',
                                            value: apiKey,
                                            onChange: (e)=>handleApiKeyChange(e.target.value),
                                            placeholder: "sk-...",
                                            className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-12"
                                        }, void 0, false, {
                                            fileName: "[project]/Autonomous-Claims-Orchestrator/components/ConfigModal.tsx",
                                            lineNumber: 76,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1",
                                            children: [
                                                isValid ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__["CheckCircle"], {
                                                    className: "w-4 h-4 text-green-500"
                                                }, void 0, false, {
                                                    fileName: "[project]/Autonomous-Claims-Orchestrator/components/ConfigModal.tsx",
                                                    lineNumber: 85,
                                                    columnNumber: 19
                                                }, this) : apiKey ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$alert$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__["AlertCircle"], {
                                                    className: "w-4 h-4 text-red-500"
                                                }, void 0, false, {
                                                    fileName: "[project]/Autonomous-Claims-Orchestrator/components/ConfigModal.tsx",
                                                    lineNumber: 87,
                                                    columnNumber: 19
                                                }, this) : null,
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>setShowKey(!showKey),
                                                    className: "text-gray-400 hover:text-gray-600",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$key$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Key$3e$__["Key"], {
                                                        className: "w-4 h-4"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Autonomous-Claims-Orchestrator/components/ConfigModal.tsx",
                                                        lineNumber: 93,
                                                        columnNumber: 19
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/Autonomous-Claims-Orchestrator/components/ConfigModal.tsx",
                                                    lineNumber: 89,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Autonomous-Claims-Orchestrator/components/ConfigModal.tsx",
                                            lineNumber: 83,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Autonomous-Claims-Orchestrator/components/ConfigModal.tsx",
                                    lineNumber: 75,
                                    columnNumber: 13
                                }, this),
                                apiKey && !isValid && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm text-red-600 mt-1",
                                    children: "API key should start with 'sk-' and be at least 20 characters"
                                }, void 0, false, {
                                    fileName: "[project]/Autonomous-Claims-Orchestrator/components/ConfigModal.tsx",
                                    lineNumber: 98,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Autonomous-Claims-Orchestrator/components/ConfigModal.tsx",
                            lineNumber: 71,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-blue-50 border border-blue-200 rounded-md p-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "text-sm font-medium text-blue-900 mb-1",
                                    children: "How to get your API key:"
                                }, void 0, false, {
                                    fileName: "[project]/Autonomous-Claims-Orchestrator/components/ConfigModal.tsx",
                                    lineNumber: 105,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ol", {
                                    className: "text-sm text-blue-800 space-y-1",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: [
                                                "1. Go to ",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                    href: "https://platform.openai.com/api-keys",
                                                    target: "_blank",
                                                    rel: "noopener noreferrer",
                                                    className: "underline",
                                                    children: "platform.openai.com/api-keys"
                                                }, void 0, false, {
                                                    fileName: "[project]/Autonomous-Claims-Orchestrator/components/ConfigModal.tsx",
                                                    lineNumber: 107,
                                                    columnNumber: 28
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Autonomous-Claims-Orchestrator/components/ConfigModal.tsx",
                                            lineNumber: 107,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: '2. Click "Create new secret key"'
                                        }, void 0, false, {
                                            fileName: "[project]/Autonomous-Claims-Orchestrator/components/ConfigModal.tsx",
                                            lineNumber: 108,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: "3. Copy the key and paste it here"
                                        }, void 0, false, {
                                            fileName: "[project]/Autonomous-Claims-Orchestrator/components/ConfigModal.tsx",
                                            lineNumber: 109,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Autonomous-Claims-Orchestrator/components/ConfigModal.tsx",
                                    lineNumber: 106,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Autonomous-Claims-Orchestrator/components/ConfigModal.tsx",
                            lineNumber: 104,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-yellow-50 border border-yellow-200 rounded-md p-3",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm text-yellow-800",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                        children: "Demo Mode:"
                                    }, void 0, false, {
                                        fileName: "[project]/Autonomous-Claims-Orchestrator/components/ConfigModal.tsx",
                                        lineNumber: 115,
                                        columnNumber: 15
                                    }, this),
                                    " Without an API key, the system will use simulated responses. With a real API key, you'll get actual AI-powered extraction and analysis."
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/ConfigModal.tsx",
                                lineNumber: 114,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/Autonomous-Claims-Orchestrator/components/ConfigModal.tsx",
                            lineNumber: 113,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex justify-between pt-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: clearApiKey,
                                    className: "px-4 py-2 text-sm text-red-600 hover:text-red-800",
                                    children: "Clear Key"
                                }, void 0, false, {
                                    fileName: "[project]/Autonomous-Claims-Orchestrator/components/ConfigModal.tsx",
                                    lineNumber: 121,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-x-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: onClose,
                                            className: "px-4 py-2 text-sm text-gray-600 hover:text-gray-800",
                                            children: "Cancel"
                                        }, void 0, false, {
                                            fileName: "[project]/Autonomous-Claims-Orchestrator/components/ConfigModal.tsx",
                                            lineNumber: 128,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: handleSave,
                                            className: "px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50",
                                            disabled: !apiKey.trim(),
                                            children: "Save"
                                        }, void 0, false, {
                                            fileName: "[project]/Autonomous-Claims-Orchestrator/components/ConfigModal.tsx",
                                            lineNumber: 134,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Autonomous-Claims-Orchestrator/components/ConfigModal.tsx",
                                    lineNumber: 127,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Autonomous-Claims-Orchestrator/components/ConfigModal.tsx",
                            lineNumber: 120,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Autonomous-Claims-Orchestrator/components/ConfigModal.tsx",
                    lineNumber: 70,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/Autonomous-Claims-Orchestrator/components/ConfigModal.tsx",
            lineNumber: 59,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/Autonomous-Claims-Orchestrator/components/ConfigModal.tsx",
        lineNumber: 58,
        columnNumber: 5
    }, this);
}
_s(ConfigModal, "qGOQACPe5HmEgO/jO1gxF3Oh6zg=");
_c = ConfigModal;
var _c;
__turbopack_context__.k.register(_c, "ConfigModal");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Autonomous-Claims-Orchestrator/components/Header.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Header
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Autonomous-Claims-Orchestrator/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Autonomous-Claims-Orchestrator/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$home$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Home$3e$__ = __turbopack_context__.i("[project]/Autonomous-Claims-Orchestrator/node_modules/lucide-react/dist/esm/icons/home.js [app-client] (ecmascript) <export default as Home>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/Autonomous-Claims-Orchestrator/node_modules/lucide-react/dist/esm/icons/search.js [app-client] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__ = __turbopack_context__.i("[project]/Autonomous-Claims-Orchestrator/node_modules/lucide-react/dist/esm/icons/check-circle.js [app-client] (ecmascript) <export default as CheckCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bar$2d$chart$2d$3$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BarChart3$3e$__ = __turbopack_context__.i("[project]/Autonomous-Claims-Orchestrator/node_modules/lucide-react/dist/esm/icons/bar-chart-3.js [app-client] (ecmascript) <export default as BarChart3>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__ = __turbopack_context__.i("[project]/Autonomous-Claims-Orchestrator/node_modules/lucide-react/dist/esm/icons/zap.js [app-client] (ecmascript) <export default as Zap>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__ = __turbopack_context__.i("[project]/Autonomous-Claims-Orchestrator/node_modules/lucide-react/dist/esm/icons/settings.js [app-client] (ecmascript) <export default as Settings>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$brain$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Brain$3e$__ = __turbopack_context__.i("[project]/Autonomous-Claims-Orchestrator/node_modules/lucide-react/dist/esm/icons/brain.js [app-client] (ecmascript) <export default as Brain>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$out$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LogOut$3e$__ = __turbopack_context__.i("[project]/Autonomous-Claims-Orchestrator/node_modules/lucide-react/dist/esm/icons/log-out.js [app-client] (ecmascript) <export default as LogOut>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__ = __turbopack_context__.i("[project]/Autonomous-Claims-Orchestrator/node_modules/lucide-react/dist/esm/icons/user.js [app-client] (ecmascript) <export default as User>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$components$2f$ConfigModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Autonomous-Claims-Orchestrator/components/ConfigModal.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$lib$2f$auth$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Autonomous-Claims-Orchestrator/lib/auth/AuthContext.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
const stages = [
    {
        id: 'home',
        label: 'Ingest',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$home$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Home$3e$__["Home"],
        description: 'Upload FNOL & Attachments'
    },
    {
        id: 'review',
        label: 'Review',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"],
        description: 'Extraction & Evidence'
    },
    {
        id: 'decision',
        label: 'Decision',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__["CheckCircle"],
        description: 'Draft Claim & Actions'
    },
    {
        id: 'dashboard',
        label: 'Dashboard',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bar$2d$chart$2d$3$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BarChart3$3e$__["BarChart3"],
        description: 'Ops & Metrics'
    }
];
function Header({ currentStage, onStageChange }) {
    _s();
    const [showConfig, setShowConfig] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [hasOpenAIKey, setHasOpenAIKey] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const { user, logout } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$lib$2f$auth$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Header.useEffect": ()=>{
            // Check for OpenAI API key
            const checkOpenAIKey = {
                "Header.useEffect.checkOpenAIKey": ()=>{
                    if ("TURBOPACK compile-time truthy", 1) {
                        const key = localStorage.getItem('openai_api_key') || window.OPENAI_API_KEY;
                        setHasOpenAIKey(!!key);
                    }
                }
            }["Header.useEffect.checkOpenAIKey"];
            checkOpenAIKey();
            // Check periodically in case key is updated elsewhere
            const interval = setInterval(checkOpenAIKey, 2000);
            return ({
                "Header.useEffect": ()=>clearInterval(interval)
            })["Header.useEffect"];
        }
    }["Header.useEffect"], []);
    const handleConfigSave = (apiKey)=>{
        setHasOpenAIKey(!!apiKey);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: "bg-white border-b border-[#E5E7EB] sticky top-0 z-50",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "container mx-auto px-8",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between h-16",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center space-x-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-center w-8 h-8 bg-[#2563EB] rounded",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__["Zap"], {
                                            className: "w-4 h-4 text-white"
                                        }, void 0, false, {
                                            fileName: "[project]/Autonomous-Claims-Orchestrator/components/Header.tsx",
                                            lineNumber: 64,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/Autonomous-Claims-Orchestrator/components/Header.tsx",
                                        lineNumber: 63,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex flex-col",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                                className: "text-lg font-semibold text-[#111827]",
                                                children: "Claims Fast Lane"
                                            }, void 0, false, {
                                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/Header.tsx",
                                                lineNumber: 67,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-[#9CA3AF] font-medium",
                                                children: "by AI Mill"
                                            }, void 0, false, {
                                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/Header.tsx",
                                                lineNumber: 70,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Autonomous-Claims-Orchestrator/components/Header.tsx",
                                        lineNumber: 66,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/Header.tsx",
                                lineNumber: 62,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                                className: "flex items-center space-x-1",
                                children: stages.map((stage, index)=>{
                                    const Icon = stage.icon;
                                    const isActive = currentStage === stage.id;
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>onStageChange(stage.id),
                                        className: `
                      flex items-center space-x-2 px-4 py-2 text-sm font-medium transition-colors
                      ${isActive ? 'text-[#2563EB] border-b-2 border-[#2563EB]' : 'text-[#6B7280] hover:text-[#374151]'}
                    `,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                                                className: "w-4 h-4"
                                            }, void 0, false, {
                                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/Header.tsx",
                                                lineNumber: 92,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "hidden sm:inline",
                                                children: stage.label
                                            }, void 0, false, {
                                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/Header.tsx",
                                                lineNumber: 93,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, stage.id, true, {
                                        fileName: "[project]/Autonomous-Claims-Orchestrator/components/Header.tsx",
                                        lineNumber: 81,
                                        columnNumber: 19
                                    }, this);
                                })
                            }, void 0, false, {
                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/Header.tsx",
                                lineNumber: 75,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center space-x-3",
                                children: [
                                    hasOpenAIKey ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center space-x-1.5 text-[#9CA3AF]",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$brain$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Brain$3e$__["Brain"], {
                                                className: "w-3.5 h-3.5"
                                            }, void 0, false, {
                                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/Header.tsx",
                                                lineNumber: 103,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-xs",
                                                children: "AI"
                                            }, void 0, false, {
                                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/Header.tsx",
                                                lineNumber: 104,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Autonomous-Claims-Orchestrator/components/Header.tsx",
                                        lineNumber: 102,
                                        columnNumber: 17
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center space-x-1.5 text-[#9CA3AF]",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__["Zap"], {
                                                className: "w-3.5 h-3.5"
                                            }, void 0, false, {
                                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/Header.tsx",
                                                lineNumber: 108,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-xs",
                                                children: "Demo"
                                            }, void 0, false, {
                                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/Header.tsx",
                                                lineNumber: 109,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Autonomous-Claims-Orchestrator/components/Header.tsx",
                                        lineNumber: 107,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setShowConfig(true),
                                        className: "p-1.5 text-[#9CA3AF] hover:text-[#6B7280] transition-colors",
                                        title: "Settings",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__["Settings"], {
                                            className: "w-4 h-4"
                                        }, void 0, false, {
                                            fileName: "[project]/Autonomous-Claims-Orchestrator/components/Header.tsx",
                                            lineNumber: 117,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/Autonomous-Claims-Orchestrator/components/Header.tsx",
                                        lineNumber: 112,
                                        columnNumber: 15
                                    }, this),
                                    user && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-[#F3F4F6]",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"], {
                                                className: "w-3.5 h-3.5 text-[#6B7280]"
                                            }, void 0, false, {
                                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/Header.tsx",
                                                lineNumber: 122,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-xs text-[#6B7280] font-medium hidden sm:inline",
                                                children: user.name
                                            }, void 0, false, {
                                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/Header.tsx",
                                                lineNumber: 123,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Autonomous-Claims-Orchestrator/components/Header.tsx",
                                        lineNumber: 121,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: logout,
                                        className: "p-1.5 text-[#9CA3AF] hover:text-[#EF4444] transition-colors",
                                        title: "Logout",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$out$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LogOut$3e$__["LogOut"], {
                                            className: "w-4 h-4"
                                        }, void 0, false, {
                                            fileName: "[project]/Autonomous-Claims-Orchestrator/components/Header.tsx",
                                            lineNumber: 133,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/Autonomous-Claims-Orchestrator/components/Header.tsx",
                                        lineNumber: 128,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center space-x-2 ml-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                src: "/image.png",
                                                alt: "AI Mill",
                                                className: "h-10 w-auto object-contain"
                                            }, void 0, false, {
                                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/Header.tsx",
                                                lineNumber: 137,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-xs text-[#9CA3AF] font-medium",
                                                children: "By AI Mill"
                                            }, void 0, false, {
                                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/Header.tsx",
                                                lineNumber: 142,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Autonomous-Claims-Orchestrator/components/Header.tsx",
                                        lineNumber: 136,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/Header.tsx",
                                lineNumber: 100,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Autonomous-Claims-Orchestrator/components/Header.tsx",
                        lineNumber: 60,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/Autonomous-Claims-Orchestrator/components/Header.tsx",
                    lineNumber: 59,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/Autonomous-Claims-Orchestrator/components/Header.tsx",
                lineNumber: 58,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$components$2f$ConfigModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                isOpen: showConfig,
                onClose: ()=>setShowConfig(false),
                onSave: handleConfigSave
            }, void 0, false, {
                fileName: "[project]/Autonomous-Claims-Orchestrator/components/Header.tsx",
                lineNumber: 149,
                columnNumber: 5
            }, this)
        ]
    }, void 0, true);
}
_s(Header, "LaiPOwfnx/2hzA85dq56lCe0HbI=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$lib$2f$auth$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"]
    ];
});
_c = Header;
var _c;
__turbopack_context__.k.register(_c, "Header");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Autonomous-Claims-Orchestrator/lib/services/openai.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "OpenAIService",
    ()=>OpenAIService,
    "openaiService",
    ()=>openaiService
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/Autonomous-Claims-Orchestrator/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$openai$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Autonomous-Claims-Orchestrator/node_modules/openai/index.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$openai$2f$client$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__OpenAI__as__default$3e$__ = __turbopack_context__.i("[project]/Autonomous-Claims-Orchestrator/node_modules/openai/client.mjs [app-client] (ecmascript) <export OpenAI as default>");
;
// Initialize OpenAI client
const openai = new __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$openai$2f$client$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__OpenAI__as__default$3e$__["default"]({
    apiKey: __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.OPENAI_API_KEY || '',
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Autonomous-Claims-Orchestrator/lib/agents/nodes/ingestionAgent.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "IngestionAgent",
    ()=>IngestionAgent
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$lib$2f$services$2f$openai$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Autonomous-Claims-Orchestrator/lib/services/openai.ts [app-client] (ecmascript)");
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
                const classification = await __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$lib$2f$services$2f$openai$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["openaiService"].classifyDocument(file.name, extractedText);
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Autonomous-Claims-Orchestrator/lib/agents/nodes/extractionAgent.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ExtractionAgent",
    ()=>ExtractionAgent
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$lib$2f$services$2f$openai$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Autonomous-Claims-Orchestrator/lib/services/openai.ts [app-client] (ecmascript)");
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
            const extractedFields = await __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$lib$2f$services$2f$openai$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["openaiService"].extractClaimFields(emailText, documentContents);
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
                    const evidenceAnalysis = await __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$lib$2f$services$2f$openai$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["openaiService"].generateFieldEvidence(fieldName, value, emailText, documentContents);
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Autonomous-Claims-Orchestrator/lib/agents/nodes/policyAgent.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PolicyAgent",
    ()=>PolicyAgent
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$lib$2f$services$2f$openai$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Autonomous-Claims-Orchestrator/lib/services/openai.ts [app-client] (ecmascript)");
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
            const openaiResults = await __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$lib$2f$services$2f$openai$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["openaiService"].queryPolicyDatabase(lossType, description, extractedFields);
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Autonomous-Claims-Orchestrator/lib/agents/nodes/assemblerAgent.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Autonomous-Claims-Orchestrator/lib/agents/orchestrator.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LangGraphOrchestrator",
    ()=>LangGraphOrchestrator
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/Autonomous-Claims-Orchestrator/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$lib$2f$agents$2f$nodes$2f$ingestionAgent$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Autonomous-Claims-Orchestrator/lib/agents/nodes/ingestionAgent.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$lib$2f$agents$2f$nodes$2f$extractionAgent$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Autonomous-Claims-Orchestrator/lib/agents/nodes/extractionAgent.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$lib$2f$agents$2f$nodes$2f$policyAgent$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Autonomous-Claims-Orchestrator/lib/agents/nodes/policyAgent.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$lib$2f$agents$2f$nodes$2f$assemblerAgent$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Autonomous-Claims-Orchestrator/lib/agents/nodes/assemblerAgent.ts [app-client] (ecmascript)");
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
            llmModel: __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.OPENAI_MODEL || 'gpt-4-1106-preview',
            confidenceThreshold: 0.6,
            maxRetries: 3,
            timeoutMs: 30000,
            ...config
        };
        // Check if OpenAI API key is available
        this.hasOpenAIKey = !!(__TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.OPENAI_API_KEY || ("TURBOPACK compile-time value", "object") !== 'undefined' && window.OPENAI_API_KEY);
        // Initialize agent nodes
        this.ingestionAgent = new __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$lib$2f$agents$2f$nodes$2f$ingestionAgent$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["IngestionAgent"]();
        this.extractionAgent = new __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$lib$2f$agents$2f$nodes$2f$extractionAgent$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ExtractionAgent"]();
        this.policyAgent = new __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$lib$2f$agents$2f$nodes$2f$policyAgent$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PolicyAgent"]();
        this.assemblerAgent = new __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$lib$2f$agents$2f$nodes$2f$assemblerAgent$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AssemblerAgent"]();
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Autonomous-Claims-Orchestrator/lib/claimProcessor.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "processClaim",
    ()=>processClaim
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$lib$2f$agents$2f$orchestrator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Autonomous-Claims-Orchestrator/lib/agents/orchestrator.ts [app-client] (ecmascript)");
;
// Initialize the LangGraph orchestrator
let orchestrator = null;
function getOrchestrator() {
    if (!orchestrator) {
        orchestrator = new __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$lib$2f$agents$2f$orchestrator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LangGraphOrchestrator"]({
            llmModel: ("TURBOPACK compile-time value", "object") !== 'undefined' && window.OPENAI_MODEL || 'gpt-4-1106-preview',
            confidenceThreshold: 0.6,
            maxRetries: 2,
            timeoutMs: 30000
        });
    }
    return orchestrator;
}
async function processClaim(emailText, files) {
    const orchestrator = getOrchestrator();
    try {
        // Convert UI files to agent format
        const agentFiles = files.map((file)=>({
                name: file.name,
                content: getFileContent(file.name),
                mimeType: file.type,
                size: file.size
            }));
        // Use the real LangGraph orchestrator
        const claimData = await orchestrator.processClaim(emailText, agentFiles);
        // Add OpenAI status to audit trail
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
        return claimData;
    } catch (error) {
        console.error('Claim processing failed:', error);
        return await processClaimFallback(emailText, files);
    }
}
// Get demo file content based on filename
function getFileContent(filename) {
    const name = filename.toLowerCase();
    if (name.includes('police')) {
        return `SPRINGFIELD POLICE DEPARTMENT
TRAFFIC ACCIDENT REPORT

Case Number: 2024-031534
Date: March 15, 2024
Location: Oak Street & 5th Avenue

VEHICLE 1:
Driver: Johnson, Sarah M.
Vehicle: 2019 Honda Civic
License Plate: XYZ-789
Damage: Moderate damage to passenger side

NARRATIVE:
Vehicle 2 proceeded through intersection against red traffic signal, striking Vehicle 1.`;
    }
    if (name.includes('repair') || name.includes('estimate')) {
        return `JOE'S AUTO BODY SHOP
REPAIR ESTIMATE

Customer: Sarah Johnson
Vehicle: 2019 Honda Civic

PARTS REQUIRED:
- Passenger front door shell: $1,245.00
- Door handle: $85.00
- Door glass: $220.00

LABOR:
- Remove and replace door: $337.50
- Paint work: $487.50

TOTAL ESTIMATE: $5,349.81`;
    }
    return `[Document content for ${filename}]`;
}
// Extract fields from email text using regex patterns
function extractFieldsFromEmail(emailText) {
    // Policy number patterns (various formats)
    const policyPatterns = [
        /policy\s*#?:?\s*([A-Z0-9]{6,})/i,
        /policy\s*number\s*:?\s*([A-Z0-9]{6,})/i,
        /#([A-Z0-9]{6,})/,
        /([A-Z]{2}\d{6,})/g
    ];
    // Phone number patterns
    const phonePatterns = [
        /(?:phone|tel|call)\s*:?\s*(\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4})/i,
        /(\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4})/g
    ];
    // Email patterns
    const emailPatterns = [
        /from:\s*([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i,
        /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g
    ];
    // Date patterns
    const datePatterns = [
        /(?:on|date|occurred|happened).*?(\d{1,2}\/\d{1,2}\/\d{4})/i,
        /(\d{1,2}\/\d{1,2}\/\d{4})/g,
        /(?:march|april|may|june|july|august|september|october|november|december)\s+\d{1,2},?\s+\d{4}/i
    ];
    // Name patterns (from signature or sender)
    const namePatterns = [
        /thanks,?\s*([A-Z][a-z]+\s+[A-Z][a-z]+)/i,
        /sincerely,?\s*([A-Z][a-z]+\s+[A-Z][a-z]+)/i,
        /from:\s*([A-Z][a-z]+\s+[A-Z][a-z]+)/i,
        /([A-Z][a-z]+\s+[A-Z][a-z]+)$/m
    ];
    const extracted = {};
    // Extract policy number
    for (const pattern of policyPatterns){
        const match = emailText.match(pattern);
        if (match && match[1]) {
            extracted.policyNumber = match[1];
            break;
        }
    }
    // Extract phone number
    for (const pattern of phonePatterns){
        const match = emailText.match(pattern);
        if (match && match[1]) {
            extracted.contactPhone = match[1];
            break;
        }
    }
    // Extract email
    for (const pattern of emailPatterns){
        const match = emailText.match(pattern);
        if (match && match[1]) {
            extracted.contactEmail = match[1];
            break;
        }
    }
    // Extract date
    for (const pattern of datePatterns){
        const match = emailText.match(pattern);
        if (match && match[1]) {
            extracted.lossDate = match[1];
            break;
        }
    }
    // Extract name
    for (const pattern of namePatterns){
        const match = emailText.match(pattern);
        if (match && match[1]) {
            extracted.claimantName = match[1];
            break;
        }
    }
    // Extract description (first substantial paragraph)
    const lines = emailText.split('\n').filter((line)=>line.trim().length > 20);
    const descriptionLine = lines.find((line)=>!line.toLowerCase().includes('subject:') && !line.toLowerCase().includes('from:') && !line.toLowerCase().includes('to:') && !line.toLowerCase().includes('date:') && line.length > 30);
    if (descriptionLine) {
        extracted.description = descriptionLine.trim();
    }
    return extracted;
}
// Fallback processing
async function processClaimFallback(emailText, files) {
    await new Promise((resolve)=>setTimeout(resolve, 2000));
    // Extract actual fields from email text using simple regex patterns
    const extractedData = extractFieldsFromEmail(emailText);
    // Create evidence based on actual extraction
    const mockEvidence = [
        {
            field: 'policyNumber',
            fieldName: 'Policy Number',
            value: extractedData.policyNumber || 'Not found',
            confidence: extractedData.policyNumber ? 0.9 : 0.1,
            sourceLocator: 'email_content',
            rationale: extractedData.policyNumber ? 'Found policy number in email text' : 'Policy number not detected'
        },
        {
            field: 'claimantName',
            fieldName: 'Claimant Name',
            value: extractedData.claimantName || 'Not found',
            confidence: extractedData.claimantName ? 0.85 : 0.1,
            sourceLocator: 'email_signature',
            rationale: extractedData.claimantName ? 'Extracted from email signature' : 'Name not detected'
        },
        {
            field: 'contactEmail',
            fieldName: 'Contact Email',
            value: extractedData.contactEmail || 'Not found',
            confidence: extractedData.contactEmail ? 0.9 : 0.1,
            sourceLocator: 'email_header',
            rationale: extractedData.contactEmail ? 'Extracted from email header' : 'Email not detected'
        },
        {
            field: 'contactPhone',
            fieldName: 'Contact Phone',
            value: extractedData.contactPhone || 'Not found',
            confidence: extractedData.contactPhone ? 0.85 : 0.1,
            sourceLocator: 'email_body',
            rationale: extractedData.contactPhone ? 'Found phone number in email' : 'Phone not detected'
        },
        {
            field: 'lossDate',
            fieldName: 'Loss Date',
            value: extractedData.lossDate || 'Not found',
            confidence: extractedData.lossDate ? 0.8 : 0.1,
            sourceLocator: 'email_body',
            rationale: extractedData.lossDate ? 'Extracted loss date from description' : 'Date not detected'
        },
        {
            field: 'description',
            fieldName: 'Description',
            value: extractedData.description || 'Claim submitted via email',
            confidence: extractedData.description ? 0.7 : 0.3,
            sourceLocator: 'email_body',
            rationale: extractedData.description ? 'Extracted incident description' : 'Using default description'
        }
    ];
    const mockDocuments = files.map((file, index)=>({
            id: `doc_${index}`,
            name: file.name,
            mimeType: file.type,
            type: 'Other',
            content: `Document content for ${file.name}`,
            confidence: 0.8,
            metadata: {}
        }));
    const mockPolicyGrounding = [
        {
            clauseId: 'SEC_003',
            title: 'Collision Coverage',
            snippet: 'Covers damage to your vehicle from collisions',
            score: 0.92,
            rationale: 'High match for collision claim type'
        }
    ];
    const mockAuditEvents = [
        {
            step: 'document_processing',
            timestamp: new Date().toISOString(),
            duration: 1500,
            agent: 'IngestionAgent',
            status: 'completed',
            details: {
                documentsProcessed: files.length
            }
        }
    ];
    // Mask PII in extracted data
    const maskEmail = (email)=>{
        if (!email) return 'Not found';
        const [user, domain] = email.split('@');
        return `${user.slice(0, 2)}***@${domain}`;
    };
    const maskPhone = (phone)=>{
        if (!phone) return 'Not found';
        return phone.replace(/\d(?=\d{4})/g, '*');
    };
    const claimDraft = {
        id: `DRAFT-${Date.now()}`,
        policyNumber: extractedData.policyNumber ? `***${extractedData.policyNumber.slice(-3)}` : 'Not found',
        claimantName: extractedData.claimantName || 'Not found',
        contactEmail: maskEmail(extractedData.contactEmail),
        contactPhone: maskPhone(extractedData.contactPhone),
        lossDate: extractedData.lossDate || new Date().toISOString().split('T')[0],
        lossType: 'Other',
        lossLocation: 'See description',
        description: extractedData.description || 'Claim submitted via email',
        estimatedAmount: 0,
        vehicleInfo: undefined,
        propertyAddress: undefined,
        attachments: files.map((file, index)=>({
                id: `doc_${index}`,
                name: file.name,
                type: 'Other',
                mimeType: file.type,
                confidence: 0.8
            })),
        coverageFound: !!extractedData.policyNumber,
        deductible: extractedData.policyNumber ? 500 : undefined,
        createdAt: new Date().toISOString(),
        source: 'rule_based_extraction',
        confidence: Object.values(extractedData).filter((v)=>v).length / 6 // Rough confidence based on fields found
    };
    return {
        claimId: `CLM-${Date.now()}`,
        decisionPack: {
            id: `DP-${Date.now()}`,
            claimDraft: claimDraft,
            evidence: mockEvidence,
            documents: mockDocuments,
            policyGrounding: mockPolicyGrounding,
            audit: mockAuditEvents,
            evidenceSummary: {
                totalFields: 8,
                highConfidenceFields: 6,
                lowConfidenceFields: 1,
                avgConfidence: 0.85
            },
            documentAnalysis: {
                totalDocuments: files.length,
                documentTypes: [
                    'PoliceReport'
                ],
                avgDocumentConfidence: 0.8,
                missingDocuments: []
            },
            policyAssessment: {
                clausesFound: 2,
                coverageConfirmed: true,
                topSimilarityScore: 0.92,
                recommendedActions: [
                    'Proceed with claim'
                ]
            },
            processingSummary: {
                totalTime: 2000,
                stepsCompleted: 4,
                stepsWithErrors: 0,
                automationLevel: 0.9
            },
            createdAt: new Date().toISOString()
        },
        auditTrail: [
            {
                step: 'fallback_processing',
                timestamp: new Date().toISOString(),
                duration: 2000,
                agent: 'FallbackAgent',
                status: 'completed',
                details: {}
            }
        ],
        processingMetrics: {
            totalProcessingTime: 2000,
            averageHandleTime: 2.0,
            fieldsAutoPopulated: 8,
            overrideRate: 0.1,
            ragHitRate: 1.0,
            stepsCompleted: 4,
            stepsFailed: 0,
            successRate: 1.0
        },
        createdAt: new Date().toISOString(),
        status: 'draft'
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Autonomous-Claims-Orchestrator/components/HomePage.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>HomePage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Autonomous-Claims-Orchestrator/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Autonomous-Claims-Orchestrator/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$react$2d$dropzone$2f$dist$2f$es$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Autonomous-Claims-Orchestrator/node_modules/react-dropzone/dist/es/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mail$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Mail$3e$__ = __turbopack_context__.i("[project]/Autonomous-Claims-Orchestrator/node_modules/lucide-react/dist/esm/icons/mail.js [app-client] (ecmascript) <export default as Mail>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$upload$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Upload$3e$__ = __turbopack_context__.i("[project]/Autonomous-Claims-Orchestrator/node_modules/lucide-react/dist/esm/icons/upload.js [app-client] (ecmascript) <export default as Upload>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__ = __turbopack_context__.i("[project]/Autonomous-Claims-Orchestrator/node_modules/lucide-react/dist/esm/icons/file-text.js [app-client] (ecmascript) <export default as FileText>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Image$3e$__ = __turbopack_context__.i("[project]/Autonomous-Claims-Orchestrator/node_modules/lucide-react/dist/esm/icons/image.js [app-client] (ecmascript) <export default as Image>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$alert$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__ = __turbopack_context__.i("[project]/Autonomous-Claims-Orchestrator/node_modules/lucide-react/dist/esm/icons/alert-circle.js [app-client] (ecmascript) <export default as AlertCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$play$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Play$3e$__ = __turbopack_context__.i("[project]/Autonomous-Claims-Orchestrator/node_modules/lucide-react/dist/esm/icons/play.js [app-client] (ecmascript) <export default as Play>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__ = __turbopack_context__.i("[project]/Autonomous-Claims-Orchestrator/node_modules/lucide-react/dist/esm/icons/clock.js [app-client] (ecmascript) <export default as Clock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__ = __turbopack_context__.i("[project]/Autonomous-Claims-Orchestrator/node_modules/lucide-react/dist/esm/icons/check-circle.js [app-client] (ecmascript) <export default as CheckCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$lib$2f$claimProcessor$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Autonomous-Claims-Orchestrator/lib/claimProcessor.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
function HomePage({ onProcessClaim, isProcessing, setIsProcessing }) {
    _s();
    const [emailText, setEmailText] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [uploadedFiles, setUploadedFiles] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [processingSteps, setProcessingSteps] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [currentStep, setCurrentStep] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const onDrop = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "HomePage.useCallback[onDrop]": (acceptedFiles)=>{
            const newFiles = acceptedFiles.map({
                "HomePage.useCallback[onDrop].newFiles": (file, index)=>({
                        id: `file-${Date.now()}-${index}`,
                        name: file.name,
                        type: file.type,
                        size: file.size,
                        preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined
                    })
            }["HomePage.useCallback[onDrop].newFiles"]);
            setUploadedFiles({
                "HomePage.useCallback[onDrop]": (prev)=>[
                        ...prev,
                        ...newFiles
                    ]
            }["HomePage.useCallback[onDrop]"]);
        }
    }["HomePage.useCallback[onDrop]"], []);
    const { getRootProps, getInputProps, isDragActive } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$react$2d$dropzone$2f$dist$2f$es$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["useDropzone"])({
        onDrop,
        accept: {
            'application/pdf': [
                '.pdf'
            ],
            'image/*': [
                '.png',
                '.jpg',
                '.jpeg',
                '.gif'
            ],
            'text/plain': [
                '.txt'
            ]
        },
        maxFiles: 5
    });
    const removeFile = (fileId)=>{
        setUploadedFiles((prev)=>prev.filter((f)=>f.id !== fileId));
    };
    const handleProcessClaim = async ()=>{
        if (!emailText.trim() || uploadedFiles.length === 0) return;
        setIsProcessing(true);
        setProcessingSteps([]);
        setCurrentStep('');
        try {
            // Simulate processing steps
            const steps = [
                'Ingestion Agent: Normalizing email and attachments...',
                'Document Classifier: Analyzing document types...',
                'Extraction Agent: Extracting claim fields...',
                'Policy RAG Agent: Querying policy database...',
                'Assembler Agent: Building decision pack...'
            ];
            for(let i = 0; i < steps.length; i++){
                setCurrentStep(steps[i]);
                setProcessingSteps((prev)=>[
                        ...prev,
                        steps[i]
                    ]);
                await new Promise((resolve)=>setTimeout(resolve, 800));
            }
            // Process the claim
            const claimData = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$lib$2f$claimProcessor$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["processClaim"])(emailText, uploadedFiles);
            onProcessClaim(claimData);
        } catch (error) {
            console.error('Error processing claim:', error);
            setCurrentStep('Error processing claim');
        } finally{
            setIsProcessing(false);
        }
    };
    const canProcess = emailText.trim().length > 0 && uploadedFiles.length > 0 && !isProcessing;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "relative min-h-screen",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute inset-0 pointer-events-none z-0",
                style: {
                    backgroundImage: `
            linear-gradient(to right, rgba(37, 99, 235, 0.06) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(37, 99, 235, 0.06) 1px, transparent 1px)
          `,
                    backgroundSize: '48px 48px',
                    backgroundPosition: '0 0'
                }
            }, void 0, false, {
                fileName: "[project]/Autonomous-Claims-Orchestrator/components/HomePage.tsx",
                lineNumber: 102,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute inset-0 pointer-events-none z-0",
                style: {
                    backgroundImage: `
            linear-gradient(45deg, rgba(124, 58, 237, 0.02) 25%, transparent 25%),
            linear-gradient(-45deg, rgba(124, 58, 237, 0.02) 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, rgba(124, 58, 237, 0.02) 75%),
            linear-gradient(-45deg, transparent 75%, rgba(124, 58, 237, 0.02) 75%)
          `,
                    backgroundSize: '96px 96px',
                    backgroundPosition: '0 0, 0 48px, 48px -48px, -48px 0px'
                }
            }, void 0, false, {
                fileName: "[project]/Autonomous-Claims-Orchestrator/components/HomePage.tsx",
                lineNumber: 115,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "max-w-6xl mx-auto relative z-10",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-center mb-24 pt-12 relative",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "absolute inset-0 -top-20 -bottom-20 flex items-center justify-center pointer-events-none",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "w-full max-w-2xl h-64 bg-gradient-radial from-[#2563EB]/10 via-[#7C3AED]/5 to-transparent rounded-full blur-3xl"
                                }, void 0, false, {
                                    fileName: "[project]/Autonomous-Claims-Orchestrator/components/HomePage.tsx",
                                    lineNumber: 134,
                                    columnNumber: 11
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/HomePage.tsx",
                                lineNumber: 133,
                                columnNumber: 9
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "relative z-10",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "inline-block text-xs font-semibold text-[#6366F1] uppercase tracking-widest mb-6",
                                        children: "AI-Powered Claims Processing"
                                    }, void 0, false, {
                                        fileName: "[project]/Autonomous-Claims-Orchestrator/components/HomePage.tsx",
                                        lineNumber: 138,
                                        columnNumber: 11
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                        className: "text-6xl font-bold text-[#0F172A] mb-6 tracking-tight leading-tight",
                                        children: [
                                            "Process Claims",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/HomePage.tsx",
                                                lineNumber: 143,
                                                columnNumber: 13
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "bg-gradient-to-r from-[#2563EB] to-[#7C3AED] bg-clip-text text-transparent",
                                                children: "Automatically"
                                            }, void 0, false, {
                                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/HomePage.tsx",
                                                lineNumber: 144,
                                                columnNumber: 13
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Autonomous-Claims-Orchestrator/components/HomePage.tsx",
                                        lineNumber: 141,
                                        columnNumber: 11
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xl text-[#475569] max-w-2xl mx-auto mb-3 font-medium leading-relaxed",
                                        children: "Upload FNOL email and attachments for intelligent extraction and processing"
                                    }, void 0, false, {
                                        fileName: "[project]/Autonomous-Claims-Orchestrator/components/HomePage.tsx",
                                        lineNumber: 148,
                                        columnNumber: 11
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-base text-[#64748B] max-w-xl mx-auto",
                                        children: "Our AI orchestrates document classification, field extraction, and policy matching"
                                    }, void 0, false, {
                                        fileName: "[project]/Autonomous-Claims-Orchestrator/components/HomePage.tsx",
                                        lineNumber: 151,
                                        columnNumber: 11
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/HomePage.tsx",
                                lineNumber: 137,
                                columnNumber: 9
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Autonomous-Claims-Orchestrator/components/HomePage.tsx",
                        lineNumber: 131,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid lg:grid-cols-2 gap-8 mb-16 relative z-10",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "card-glass p-10 h-full flex flex-col relative overflow-hidden",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "absolute inset-0 bg-gradient-to-br from-[#2563EB]/5 via-transparent to-[#7C3AED]/5 pointer-events-none"
                                    }, void 0, false, {
                                        fileName: "[project]/Autonomous-Claims-Orchestrator/components/HomePage.tsx",
                                        lineNumber: 162,
                                        columnNumber: 11
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "relative z-10 flex flex-col h-full",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center space-x-2 mb-4",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "p-2 bg-gradient-to-br from-[#2563EB]/10 to-[#7C3AED]/10 rounded-lg",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mail$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Mail$3e$__["Mail"], {
                                                            className: "w-5 h-5 text-[#6366F1]"
                                                        }, void 0, false, {
                                                            fileName: "[project]/Autonomous-Claims-Orchestrator/components/HomePage.tsx",
                                                            lineNumber: 167,
                                                            columnNumber: 17
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/Autonomous-Claims-Orchestrator/components/HomePage.tsx",
                                                        lineNumber: 166,
                                                        columnNumber: 15
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                        className: "text-sm font-semibold text-[#475569] uppercase tracking-wider",
                                                        children: "FNOL Email"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Autonomous-Claims-Orchestrator/components/HomePage.tsx",
                                                        lineNumber: 169,
                                                        columnNumber: 15
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/HomePage.tsx",
                                                lineNumber: 165,
                                                columnNumber: 13
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                                value: emailText,
                                                onChange: (e)=>setEmailText(e.target.value),
                                                placeholder: "Paste FNOL email content here...",
                                                className: "w-full flex-1 p-5 border border-[#E2E8F0] rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-[#6366F1]/20 focus:border-[#6366F1]/30 bg-white/50 backdrop-blur-sm text-[#0F172A] placeholder:text-[#94A3B8] text-sm leading-relaxed transition-all duration-200",
                                                style: {
                                                    minHeight: '340px'
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/HomePage.tsx",
                                                lineNumber: 172,
                                                columnNumber: 13
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "mt-4 text-xs text-[#94A3B8] font-medium",
                                                children: [
                                                    emailText.length,
                                                    " characters"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/HomePage.tsx",
                                                lineNumber: 180,
                                                columnNumber: 13
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Autonomous-Claims-Orchestrator/components/HomePage.tsx",
                                        lineNumber: 164,
                                        columnNumber: 11
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/HomePage.tsx",
                                lineNumber: 160,
                                columnNumber: 9
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "card-glass p-10 h-full flex flex-col relative overflow-hidden",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "absolute inset-0 bg-gradient-to-br from-[#7C3AED]/5 via-transparent to-[#2563EB]/5 pointer-events-none"
                                    }, void 0, false, {
                                        fileName: "[project]/Autonomous-Claims-Orchestrator/components/HomePage.tsx",
                                        lineNumber: 189,
                                        columnNumber: 11
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "relative z-10 flex flex-col h-full",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center space-x-2 mb-4",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "p-2 bg-gradient-to-br from-[#7C3AED]/10 to-[#2563EB]/10 rounded-lg",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$upload$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Upload$3e$__["Upload"], {
                                                            className: "w-5 h-5 text-[#6366F1]"
                                                        }, void 0, false, {
                                                            fileName: "[project]/Autonomous-Claims-Orchestrator/components/HomePage.tsx",
                                                            lineNumber: 194,
                                                            columnNumber: 17
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/Autonomous-Claims-Orchestrator/components/HomePage.tsx",
                                                        lineNumber: 193,
                                                        columnNumber: 15
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                        className: "text-sm font-semibold text-[#475569] uppercase tracking-wider",
                                                        children: "Attachments"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Autonomous-Claims-Orchestrator/components/HomePage.tsx",
                                                        lineNumber: 196,
                                                        columnNumber: 15
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/HomePage.tsx",
                                                lineNumber: 192,
                                                columnNumber: 13
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                ...getRootProps(),
                                                className: `
                flex-1 border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-300 relative overflow-hidden
                ${isDragActive ? 'border-[#6366F1] bg-gradient-to-br from-[#EEF2FF] to-[#F3E8FF] shadow-lg scale-[1.02]' : 'border-[#CBD5E1] hover:border-[#6366F1]/50 hover:bg-gradient-to-br hover:from-[#FAFBFC] hover:to-[#F8FAFC] bg-white/30 backdrop-blur-sm'}
              `,
                                                style: {
                                                    minHeight: '340px',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    justifyContent: 'center',
                                                    alignItems: 'center'
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        ...getInputProps()
                                                    }, void 0, false, {
                                                        fileName: "[project]/Autonomous-Claims-Orchestrator/components/HomePage.tsx",
                                                        lineNumber: 210,
                                                        columnNumber: 15
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: `p-4 rounded-full mb-4 transition-all duration-300 ${isDragActive ? 'bg-[#6366F1]/10' : 'bg-[#F1F5F9]'}`,
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$upload$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Upload$3e$__["Upload"], {
                                                            className: `w-12 h-12 transition-colors duration-300 ${isDragActive ? 'text-[#6366F1]' : 'text-[#94A3B8]'}`
                                                        }, void 0, false, {
                                                            fileName: "[project]/Autonomous-Claims-Orchestrator/components/HomePage.tsx",
                                                            lineNumber: 214,
                                                            columnNumber: 17
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/Autonomous-Claims-Orchestrator/components/HomePage.tsx",
                                                        lineNumber: 211,
                                                        columnNumber: 15
                                                    }, this),
                                                    isDragActive ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-base font-semibold text-[#6366F1]",
                                                        children: "Drop files here"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Autonomous-Claims-Orchestrator/components/HomePage.tsx",
                                                        lineNumber: 219,
                                                        columnNumber: 17
                                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-sm font-semibold text-[#334155] mb-2",
                                                                children: "Drag files here or click to select"
                                                            }, void 0, false, {
                                                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/HomePage.tsx",
                                                                lineNumber: 222,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-xs text-[#94A3B8]",
                                                                children: "PDF, images, text files (max 5)"
                                                            }, void 0, false, {
                                                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/HomePage.tsx",
                                                                lineNumber: 223,
                                                                columnNumber: 19
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/Autonomous-Claims-Orchestrator/components/HomePage.tsx",
                                                        lineNumber: 221,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/HomePage.tsx",
                                                lineNumber: 199,
                                                columnNumber: 13
                                            }, this),
                                            uploadedFiles.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "mt-6 space-y-2 relative z-10",
                                                children: uploadedFiles.map((file)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center justify-between p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-[#E2E8F0] hover:border-[#CBD5E1] hover:shadow-md transition-all duration-200",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex items-center space-x-3 min-w-0 flex-1",
                                                                children: [
                                                                    file.type.startsWith('image/') ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "p-2 bg-[#EEF2FF] rounded-lg",
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Image$3e$__["Image"], {
                                                                            className: "w-4 h-4 text-[#6366F1] flex-shrink-0"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/Autonomous-Claims-Orchestrator/components/HomePage.tsx",
                                                                            lineNumber: 236,
                                                                            columnNumber: 27
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/Autonomous-Claims-Orchestrator/components/HomePage.tsx",
                                                                        lineNumber: 235,
                                                                        columnNumber: 25
                                                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "p-2 bg-[#F3E8FF] rounded-lg",
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"], {
                                                                            className: "w-4 h-4 text-[#7C3AED] flex-shrink-0"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/Autonomous-Claims-Orchestrator/components/HomePage.tsx",
                                                                            lineNumber: 240,
                                                                            columnNumber: 27
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/Autonomous-Claims-Orchestrator/components/HomePage.tsx",
                                                                        lineNumber: 239,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "min-w-0 flex-1",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                className: "text-sm font-semibold text-[#0F172A] truncate",
                                                                                children: file.name
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/HomePage.tsx",
                                                                                lineNumber: 244,
                                                                                columnNumber: 25
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                className: "text-xs text-[#94A3B8] font-medium",
                                                                                children: [
                                                                                    (file.size / 1024).toFixed(1),
                                                                                    " KB"
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/HomePage.tsx",
                                                                                lineNumber: 245,
                                                                                columnNumber: 25
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/Autonomous-Claims-Orchestrator/components/HomePage.tsx",
                                                                        lineNumber: 243,
                                                                        columnNumber: 23
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/HomePage.tsx",
                                                                lineNumber: 233,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                onClick: ()=>removeFile(file.id),
                                                                className: "text-[#94A3B8] hover:text-[#64748B] p-2 hover:bg-[#F1F5F9] rounded-lg transition-all duration-200 flex-shrink-0",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$alert$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__["AlertCircle"], {
                                                                    className: "w-4 h-4"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/Autonomous-Claims-Orchestrator/components/HomePage.tsx",
                                                                    lineNumber: 252,
                                                                    columnNumber: 23
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/HomePage.tsx",
                                                                lineNumber: 248,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, file.id, true, {
                                                        fileName: "[project]/Autonomous-Claims-Orchestrator/components/HomePage.tsx",
                                                        lineNumber: 232,
                                                        columnNumber: 19
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/HomePage.tsx",
                                                lineNumber: 230,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Autonomous-Claims-Orchestrator/components/HomePage.tsx",
                                        lineNumber: 191,
                                        columnNumber: 11
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/HomePage.tsx",
                                lineNumber: 187,
                                columnNumber: 9
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Autonomous-Claims-Orchestrator/components/HomePage.tsx",
                        lineNumber: 158,
                        columnNumber: 7
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-center mb-16 relative z-10",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: handleProcessClaim,
                            disabled: !canProcess,
                            className: "btn-primary disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-100 transition-transform duration-200",
                            children: isProcessing ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center space-x-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"], {
                                        className: "w-5 h-5 animate-spin"
                                    }, void 0, false, {
                                        fileName: "[project]/Autonomous-Claims-Orchestrator/components/HomePage.tsx",
                                        lineNumber: 271,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "Processing..."
                                    }, void 0, false, {
                                        fileName: "[project]/Autonomous-Claims-Orchestrator/components/HomePage.tsx",
                                        lineNumber: 272,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/HomePage.tsx",
                                lineNumber: 270,
                                columnNumber: 13
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center space-x-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$play$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Play$3e$__["Play"], {
                                        className: "w-5 h-5"
                                    }, void 0, false, {
                                        fileName: "[project]/Autonomous-Claims-Orchestrator/components/HomePage.tsx",
                                        lineNumber: 276,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "Process Claim"
                                    }, void 0, false, {
                                        fileName: "[project]/Autonomous-Claims-Orchestrator/components/HomePage.tsx",
                                        lineNumber: 277,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/HomePage.tsx",
                                lineNumber: 275,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/Autonomous-Claims-Orchestrator/components/HomePage.tsx",
                            lineNumber: 264,
                            columnNumber: 9
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/Autonomous-Claims-Orchestrator/components/HomePage.tsx",
                        lineNumber: 263,
                        columnNumber: 7
                    }, this),
                    isProcessing && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "card-glass p-8 relative overflow-hidden z-10",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "absolute inset-0 bg-gradient-to-br from-[#EEF2FF]/50 via-transparent to-[#F3E8FF]/50 pointer-events-none"
                            }, void 0, false, {
                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/HomePage.tsx",
                                lineNumber: 286,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "relative z-10",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "text-sm font-semibold text-[#475569] uppercase tracking-wider mb-6",
                                        children: "Processing Steps"
                                    }, void 0, false, {
                                        fileName: "[project]/Autonomous-Claims-Orchestrator/components/HomePage.tsx",
                                        lineNumber: 289,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-3",
                                        children: [
                                            processingSteps.map((step, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center space-x-4 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-[#E2E8F0]",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "p-1.5 bg-gradient-to-br from-[#10B981] to-[#059669] rounded-full",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__["CheckCircle"], {
                                                                className: "w-4 h-4 text-white flex-shrink-0"
                                                            }, void 0, false, {
                                                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/HomePage.tsx",
                                                                lineNumber: 299,
                                                                columnNumber: 21
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/Autonomous-Claims-Orchestrator/components/HomePage.tsx",
                                                            lineNumber: 298,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-sm text-[#334155] font-medium",
                                                            children: step
                                                        }, void 0, false, {
                                                            fileName: "[project]/Autonomous-Claims-Orchestrator/components/HomePage.tsx",
                                                            lineNumber: 301,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, index, true, {
                                                    fileName: "[project]/Autonomous-Claims-Orchestrator/components/HomePage.tsx",
                                                    lineNumber: 294,
                                                    columnNumber: 17
                                                }, this)),
                                            currentStep && !processingSteps.includes(currentStep) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center space-x-4 p-4 bg-gradient-to-r from-[#EEF2FF] to-[#F3E8FF] rounded-xl border border-[#C7D2FE]",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "p-1.5 bg-gradient-to-br from-[#6366F1] to-[#7C3AED] rounded-full",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"], {
                                                            className: "w-4 h-4 text-white animate-spin flex-shrink-0"
                                                        }, void 0, false, {
                                                            fileName: "[project]/Autonomous-Claims-Orchestrator/components/HomePage.tsx",
                                                            lineNumber: 308,
                                                            columnNumber: 21
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/Autonomous-Claims-Orchestrator/components/HomePage.tsx",
                                                        lineNumber: 307,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-sm text-[#4338CA] font-semibold",
                                                        children: currentStep
                                                    }, void 0, false, {
                                                        fileName: "[project]/Autonomous-Claims-Orchestrator/components/HomePage.tsx",
                                                        lineNumber: 310,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/HomePage.tsx",
                                                lineNumber: 306,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Autonomous-Claims-Orchestrator/components/HomePage.tsx",
                                        lineNumber: 292,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/HomePage.tsx",
                                lineNumber: 288,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Autonomous-Claims-Orchestrator/components/HomePage.tsx",
                        lineNumber: 285,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Autonomous-Claims-Orchestrator/components/HomePage.tsx",
                lineNumber: 129,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Autonomous-Claims-Orchestrator/components/HomePage.tsx",
        lineNumber: 100,
        columnNumber: 5
    }, this);
}
_s(HomePage, "M+Jk8rANWe02C8Pt1/AyckpXx0E=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$react$2d$dropzone$2f$dist$2f$es$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["useDropzone"]
    ];
});
_c = HomePage;
var _c;
__turbopack_context__.k.register(_c, "HomePage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Autonomous-Claims-Orchestrator/components/ReviewPage.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ReviewPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Autonomous-Claims-Orchestrator/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Autonomous-Claims-Orchestrator/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$dom$2f$motion$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Autonomous-Claims-Orchestrator/node_modules/framer-motion/dist/es/render/dom/motion.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__ = __turbopack_context__.i("[project]/Autonomous-Claims-Orchestrator/node_modules/lucide-react/dist/esm/icons/file-text.js [app-client] (ecmascript) <export default as FileText>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/Autonomous-Claims-Orchestrator/node_modules/lucide-react/dist/esm/icons/search.js [app-client] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BookOpen$3e$__ = __turbopack_context__.i("[project]/Autonomous-Claims-Orchestrator/node_modules/lucide-react/dist/esm/icons/book-open.js [app-client] (ecmascript) <export default as BookOpen>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__ = __turbopack_context__.i("[project]/Autonomous-Claims-Orchestrator/node_modules/lucide-react/dist/esm/icons/check-circle.js [app-client] (ecmascript) <export default as CheckCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$alert$2d$triangle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__ = __turbopack_context__.i("[project]/Autonomous-Claims-Orchestrator/node_modules/lucide-react/dist/esm/icons/alert-triangle.js [app-client] (ecmascript) <export default as AlertTriangle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__ = __turbopack_context__.i("[project]/Autonomous-Claims-Orchestrator/node_modules/lucide-react/dist/esm/icons/arrow-right.js [app-client] (ecmascript) <export default as ArrowRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__ = __turbopack_context__.i("[project]/Autonomous-Claims-Orchestrator/node_modules/lucide-react/dist/esm/icons/arrow-left.js [app-client] (ecmascript) <export default as ArrowLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Shield$3e$__ = __turbopack_context__.i("[project]/Autonomous-Claims-Orchestrator/node_modules/lucide-react/dist/esm/icons/shield.js [app-client] (ecmascript) <export default as Shield>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__ = __turbopack_context__.i("[project]/Autonomous-Claims-Orchestrator/node_modules/lucide-react/dist/esm/icons/user.js [app-client] (ecmascript) <export default as User>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__ = __turbopack_context__.i("[project]/Autonomous-Claims-Orchestrator/node_modules/lucide-react/dist/esm/icons/calendar.js [app-client] (ecmascript) <export default as Calendar>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__ = __turbopack_context__.i("[project]/Autonomous-Claims-Orchestrator/node_modules/lucide-react/dist/esm/icons/map-pin.js [app-client] (ecmascript) <export default as MapPin>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileCheck$3e$__ = __turbopack_context__.i("[project]/Autonomous-Claims-Orchestrator/node_modules/lucide-react/dist/esm/icons/file-check.js [app-client] (ecmascript) <export default as FileCheck>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingUp$3e$__ = __turbopack_context__.i("[project]/Autonomous-Claims-Orchestrator/node_modules/lucide-react/dist/esm/icons/trending-up.js [app-client] (ecmascript) <export default as TrendingUp>");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
// Group fields by category
const categorizeFields = (evidence)=>{
    const categories = {
        'Claim Metadata': [
            'policyId',
            'policyNumber',
            'claimId'
        ],
        'Contact Details': [
            'claimantName',
            'contactEmail',
            'contactPhone'
        ],
        'Incident Details': [
            'lossDate',
            'lossType',
            'lossLocation',
            'location',
            'description',
            'deductible',
            'estimatedAmount'
        ]
    };
    const grouped = {
        'Claim Metadata': [],
        'Contact Details': [],
        'Incident Details': []
    };
    evidence.forEach((field)=>{
        const fieldName = (field.fieldName || field.field || '').toLowerCase();
        let categorized = false;
        for (const [category, fields] of Object.entries(categories)){
            if (fields.some((f)=>fieldName.includes(f.toLowerCase()))) {
                grouped[category].push(field);
                categorized = true;
                break;
            }
        }
        if (!categorized) {
            grouped['Incident Details'].push(field);
        }
    });
    return grouped;
};
function ReviewPage({ claimData, onNextStage, onPreviousStage }) {
    _s();
    const [selectedField, setSelectedField] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [selectedDoc, setSelectedDoc] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // Handle null claimData
    if (!claimData || !claimData.decisionPack) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$dom$2f$motion$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
            initial: {
                opacity: 0,
                y: 20
            },
            animate: {
                opacity: 1,
                y: 0
            },
            className: "max-w-7xl mx-auto text-center py-12",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$alert$2d$triangle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                    className: "w-16 h-16 text-warning-500 mx-auto mb-4"
                }, void 0, false, {
                    fileName: "[project]/Autonomous-Claims-Orchestrator/components/ReviewPage.tsx",
                    lineNumber: 75,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                    className: "text-2xl font-bold text-gray-900 mb-2",
                    children: "No Claim Data Available"
                }, void 0, false, {
                    fileName: "[project]/Autonomous-Claims-Orchestrator/components/ReviewPage.tsx",
                    lineNumber: 76,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-gray-600 mb-6",
                    children: "Please process a claim first before reviewing."
                }, void 0, false, {
                    fileName: "[project]/Autonomous-Claims-Orchestrator/components/ReviewPage.tsx",
                    lineNumber: 77,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: onPreviousStage,
                    className: "btn-primary flex items-center space-x-2 mx-auto",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__["ArrowLeft"], {
                            className: "w-4 h-4"
                        }, void 0, false, {
                            fileName: "[project]/Autonomous-Claims-Orchestrator/components/ReviewPage.tsx",
                            lineNumber: 84,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            children: "Back to Ingest"
                        }, void 0, false, {
                            fileName: "[project]/Autonomous-Claims-Orchestrator/components/ReviewPage.tsx",
                            lineNumber: 85,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Autonomous-Claims-Orchestrator/components/ReviewPage.tsx",
                    lineNumber: 80,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/Autonomous-Claims-Orchestrator/components/ReviewPage.tsx",
            lineNumber: 70,
            columnNumber: 7
        }, this);
    }
    const { decisionPack, claimId, status } = claimData;
    const { evidence = [], documents = [], policyGrounding = [], claimDraft } = decisionPack || {};
    // Calculate overall confidence
    const overallConfidence = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ReviewPage.useMemo[overallConfidence]": ()=>{
            if (evidence.length === 0) return 0;
            const avg = evidence.reduce({
                "ReviewPage.useMemo[overallConfidence]": (sum, e)=>sum + e.confidence
            }["ReviewPage.useMemo[overallConfidence]"], 0) / evidence.length;
            return Math.round(avg * 100);
        }
    }["ReviewPage.useMemo[overallConfidence]"], [
        evidence
    ]);
    // Group fields by category
    const groupedFields = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ReviewPage.useMemo[groupedFields]": ()=>categorizeFields(evidence)
    }["ReviewPage.useMemo[groupedFields]"], [
        evidence
    ]);
    // Policy grounding state
    const policyState = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ReviewPage.useMemo[policyState]": ()=>{
            if (policyGrounding.length === 0) {
                return {
                    type: 'warning',
                    message: 'No policy clauses found',
                    subMessage: 'Proceeding without policy grounding'
                };
            }
            const avgScore = policyGrounding.reduce({
                "ReviewPage.useMemo[policyState]": (sum, p)=>sum + (p.score || p.similarity || 0)
            }["ReviewPage.useMemo[policyState]"], 0) / policyGrounding.length;
            if (avgScore >= 0.7) {
                return {
                    type: 'success',
                    message: `${policyGrounding.length} policy matches found`,
                    subMessage: `${Math.round(avgScore * 100)}% average similarity`
                };
            }
            return {
                type: 'neutral',
                message: `${policyGrounding.length} policy matches`,
                subMessage: 'Review recommended'
            };
        }
    }["ReviewPage.useMemo[policyState]"], [
        policyGrounding
    ]);
    const getConfidenceBadge = (confidence)=>{
        if (confidence >= 0.8) {
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[#ECFDF5] text-[#047857] border border-[#A7F3D0]",
                children: "High"
            }, void 0, false, {
                fileName: "[project]/Autonomous-Claims-Orchestrator/components/ReviewPage.tsx",
                lineNumber: 123,
                columnNumber: 14
            }, this);
        } else if (confidence >= 0.6) {
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[#EFF6FF] text-[#1E40AF] border border-[#DBEAFE]",
                children: "Medium"
            }, void 0, false, {
                fileName: "[project]/Autonomous-Claims-Orchestrator/components/ReviewPage.tsx",
                lineNumber: 125,
                columnNumber: 14
            }, this);
        } else {
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[#FFFBEB] text-[#B45309] border border-[#FDE68A]",
                children: "Review"
            }, void 0, false, {
                fileName: "[project]/Autonomous-Claims-Orchestrator/components/ReviewPage.tsx",
                lineNumber: 127,
                columnNumber: 14
            }, this);
        }
    };
    const getFieldIcon = (fieldName)=>{
        const iconMap = {
            policyId: __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Shield$3e$__["Shield"],
            policyNumber: __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Shield$3e$__["Shield"],
            claimantName: __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"],
            contactEmail: __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"],
            contactPhone: __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"],
            lossDate: __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__["Calendar"],
            lossType: __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileCheck$3e$__["FileCheck"],
            lossLocation: __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__["MapPin"],
            location: __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__["MapPin"],
            description: __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"],
            deductible: __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingUp$3e$__["TrendingUp"]
        };
        const field = (fieldName || '').toLowerCase();
        for (const [key, Icon] of Object.entries(iconMap)){
            if (field.includes(key.toLowerCase())) {
                return Icon;
            }
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"];
    };
    const getStatusColor = (status)=>{
        if (!status) return 'bg-[#E5E7EB] text-[#374151]';
        const s = status.toLowerCase();
        if (s.includes('complete') || s.includes('approved')) return 'bg-[#ECFDF5] text-[#047857]';
        if (s.includes('pending') || s.includes('processing')) return 'bg-[#EFF6FF] text-[#1E40AF]';
        if (s.includes('reject') || s.includes('error')) return 'bg-[#FEF2F2] text-[#B91C1C]';
        return 'bg-[#FFFBEB] text-[#B45309]';
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "max-w-[1920px] mx-auto",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[#E5E7EB] shadow-sm",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "px-8 py-4",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center space-x-6",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-1",
                                                children: "Claim ID"
                                            }, void 0, false, {
                                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/ReviewPage.tsx",
                                                lineNumber: 172,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-lg font-bold text-[#111827]",
                                                children: claimId || claimDraft?.id || 'N/A'
                                            }, void 0, false, {
                                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/ReviewPage.tsx",
                                                lineNumber: 173,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Autonomous-Claims-Orchestrator/components/ReviewPage.tsx",
                                        lineNumber: 171,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "h-12 w-px bg-[#E5E7EB]"
                                    }, void 0, false, {
                                        fileName: "[project]/Autonomous-Claims-Orchestrator/components/ReviewPage.tsx",
                                        lineNumber: 177,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-1",
                                                children: "Overall Confidence"
                                            }, void 0, false, {
                                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/ReviewPage.tsx",
                                                lineNumber: 179,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center space-x-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-lg font-bold text-[#111827]",
                                                        children: [
                                                            overallConfidence,
                                                            "%"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/Autonomous-Claims-Orchestrator/components/ReviewPage.tsx",
                                                        lineNumber: 181,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: `w-2 h-2 rounded-full ${overallConfidence >= 80 ? 'bg-[#10B981]' : overallConfidence >= 60 ? 'bg-[#3B82F6]' : 'bg-[#F59E0B]'}`
                                                    }, void 0, false, {
                                                        fileName: "[project]/Autonomous-Claims-Orchestrator/components/ReviewPage.tsx",
                                                        lineNumber: 182,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/ReviewPage.tsx",
                                                lineNumber: 180,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Autonomous-Claims-Orchestrator/components/ReviewPage.tsx",
                                        lineNumber: 178,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "h-12 w-px bg-[#E5E7EB]"
                                    }, void 0, false, {
                                        fileName: "[project]/Autonomous-Claims-Orchestrator/components/ReviewPage.tsx",
                                        lineNumber: 187,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-1",
                                                children: "Status"
                                            }, void 0, false, {
                                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/ReviewPage.tsx",
                                                lineNumber: 189,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: `inline-flex items-center px-3 py-1 rounded-md text-sm font-medium ${getStatusColor(status)}`,
                                                children: status || 'Processing'
                                            }, void 0, false, {
                                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/ReviewPage.tsx",
                                                lineNumber: 190,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Autonomous-Claims-Orchestrator/components/ReviewPage.tsx",
                                        lineNumber: 188,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/ReviewPage.tsx",
                                lineNumber: 170,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center space-x-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: onPreviousStage,
                                        className: "btn-secondary flex items-center space-x-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__["ArrowLeft"], {
                                                className: "w-4 h-4"
                                            }, void 0, false, {
                                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/ReviewPage.tsx",
                                                lineNumber: 200,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Back"
                                            }, void 0, false, {
                                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/ReviewPage.tsx",
                                                lineNumber: 201,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Autonomous-Claims-Orchestrator/components/ReviewPage.tsx",
                                        lineNumber: 196,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: onNextStage,
                                        className: "btn-primary flex items-center space-x-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Continue"
                                            }, void 0, false, {
                                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/ReviewPage.tsx",
                                                lineNumber: 207,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__["ArrowRight"], {
                                                className: "w-4 h-4"
                                            }, void 0, false, {
                                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/ReviewPage.tsx",
                                                lineNumber: 208,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Autonomous-Claims-Orchestrator/components/ReviewPage.tsx",
                                        lineNumber: 203,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/ReviewPage.tsx",
                                lineNumber: 195,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Autonomous-Claims-Orchestrator/components/ReviewPage.tsx",
                        lineNumber: 169,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/Autonomous-Claims-Orchestrator/components/ReviewPage.tsx",
                    lineNumber: 168,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/Autonomous-Claims-Orchestrator/components/ReviewPage.tsx",
                lineNumber: 167,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "px-8 py-8",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid grid-cols-12 gap-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "col-span-12 lg:col-span-3",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$dom$2f$motion$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                                className: "card p-5 h-fit sticky top-[88px]",
                                initial: {
                                    opacity: 0,
                                    x: -20
                                },
                                animate: {
                                    opacity: 1,
                                    x: 0
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center space-x-2 mb-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"], {
                                                className: "w-4 h-4 text-[#6366F1]"
                                            }, void 0, false, {
                                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/ReviewPage.tsx",
                                                lineNumber: 226,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                className: "text-sm font-bold text-[#111827] uppercase tracking-wider",
                                                children: "Source Documents"
                                            }, void 0, false, {
                                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/ReviewPage.tsx",
                                                lineNumber: 227,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "ml-auto text-xs font-medium text-[#6B7280] bg-[#F3F4F6] px-2 py-0.5 rounded",
                                                children: documents.length
                                            }, void 0, false, {
                                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/ReviewPage.tsx",
                                                lineNumber: 228,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Autonomous-Claims-Orchestrator/components/ReviewPage.tsx",
                                        lineNumber: 225,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-2",
                                        children: documents.map((doc)=>{
                                            const isSelected = selectedDoc === doc.id;
                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: `p-3 rounded-lg border cursor-pointer transition-all ${isSelected ? 'border-[#6366F1] bg-[#EEF2FF] shadow-sm' : 'border-[#E5E7EB] hover:border-[#CBD5E1] hover:bg-[#F9FAFB] bg-white'}`,
                                                onClick: ()=>setSelectedDoc(isSelected ? null : doc.id),
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-start justify-between mb-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex items-center space-x-2 flex-1 min-w-0",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"], {
                                                                        className: "w-4 h-4 text-[#6B7280] flex-shrink-0"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/Autonomous-Claims-Orchestrator/components/ReviewPage.tsx",
                                                                        lineNumber: 248,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "text-xs font-semibold text-[#111827] truncate",
                                                                        children: doc.name
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/Autonomous-Claims-Orchestrator/components/ReviewPage.tsx",
                                                                        lineNumber: 249,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/ReviewPage.tsx",
                                                                lineNumber: 247,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-xs font-medium text-[#6B7280] bg-[#F3F4F6] px-1.5 py-0.5 rounded ml-2 flex-shrink-0",
                                                                children: doc.type
                                                            }, void 0, false, {
                                                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/ReviewPage.tsx",
                                                                lineNumber: 251,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/Autonomous-Claims-Orchestrator/components/ReviewPage.tsx",
                                                        lineNumber: 246,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center justify-between",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center space-x-1",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: `w-1.5 h-1.5 rounded-full ${doc.confidence >= 0.8 ? 'bg-[#10B981]' : doc.confidence >= 0.6 ? 'bg-[#3B82F6]' : 'bg-[#F59E0B]'}`
                                                                }, void 0, false, {
                                                                    fileName: "[project]/Autonomous-Claims-Orchestrator/components/ReviewPage.tsx",
                                                                    lineNumber: 257,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-xs text-[#6B7280]",
                                                                    children: [
                                                                        Math.round(doc.confidence * 100),
                                                                        "%"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/Autonomous-Claims-Orchestrator/components/ReviewPage.tsx",
                                                                    lineNumber: 260,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/Autonomous-Claims-Orchestrator/components/ReviewPage.tsx",
                                                            lineNumber: 256,
                                                            columnNumber: 25
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/Autonomous-Claims-Orchestrator/components/ReviewPage.tsx",
                                                        lineNumber: 255,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, doc.id, true, {
                                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/ReviewPage.tsx",
                                                lineNumber: 237,
                                                columnNumber: 21
                                            }, this);
                                        })
                                    }, void 0, false, {
                                        fileName: "[project]/Autonomous-Claims-Orchestrator/components/ReviewPage.tsx",
                                        lineNumber: 233,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/ReviewPage.tsx",
                                lineNumber: 220,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/Autonomous-Claims-Orchestrator/components/ReviewPage.tsx",
                            lineNumber: 219,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "col-span-12 lg:col-span-6",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$dom$2f$motion$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                                className: "card p-6",
                                initial: {
                                    opacity: 0,
                                    y: 20
                                },
                                animate: {
                                    opacity: 1,
                                    y: 0
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center space-x-2 mb-6",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                                className: "w-5 h-5 text-[#6366F1]"
                                            }, void 0, false, {
                                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/ReviewPage.tsx",
                                                lineNumber: 280,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                className: "text-base font-bold text-[#111827] uppercase tracking-wider",
                                                children: "Extracted Fields"
                                            }, void 0, false, {
                                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/ReviewPage.tsx",
                                                lineNumber: 281,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "ml-auto text-xs font-medium text-[#6B7280] bg-[#F3F4F6] px-2 py-0.5 rounded",
                                                children: [
                                                    evidence.length,
                                                    " fields"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/ReviewPage.tsx",
                                                lineNumber: 282,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Autonomous-Claims-Orchestrator/components/ReviewPage.tsx",
                                        lineNumber: 279,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-6",
                                        children: Object.entries(groupedFields).map(([category, fields])=>{
                                            if (fields.length === 0) return null;
                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "border-b border-[#E5E7EB] pb-6 last:border-0 last:pb-0",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        className: "text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-4",
                                                        children: category
                                                    }, void 0, false, {
                                                        fileName: "[project]/Autonomous-Claims-Orchestrator/components/ReviewPage.tsx",
                                                        lineNumber: 294,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "grid grid-cols-1 md:grid-cols-2 gap-3",
                                                        children: fields.map((field)=>{
                                                            const fieldName = field.fieldName || field.field || '';
                                                            const Icon = getFieldIcon(fieldName);
                                                            const isSelected = selectedField === fieldName;
                                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: `p-4 rounded-lg border transition-all cursor-pointer ${isSelected ? 'border-[#6366F1] bg-[#EEF2FF] shadow-sm' : 'border-[#E5E7EB] hover:border-[#CBD5E1] hover:bg-[#F9FAFB] bg-white'}`,
                                                                onClick: ()=>setSelectedField(isSelected ? null : fieldName),
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "flex items-start justify-between mb-2",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "flex items-center space-x-2 flex-1 min-w-0",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                                                                                        className: "w-4 h-4 text-[#6B7280] flex-shrink-0"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/Autonomous-Claims-Orchestrator/components/ReviewPage.tsx",
                                                                                        lineNumber: 315,
                                                                                        columnNumber: 35
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                        className: "text-sm font-medium text-[#111827] capitalize truncate",
                                                                                        children: fieldName.replace(/([A-Z])/g, ' $1').trim()
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/Autonomous-Claims-Orchestrator/components/ReviewPage.tsx",
                                                                                        lineNumber: 316,
                                                                                        columnNumber: 35
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/ReviewPage.tsx",
                                                                                lineNumber: 314,
                                                                                columnNumber: 33
                                                                            }, this),
                                                                            getConfidenceBadge(field.confidence)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/Autonomous-Claims-Orchestrator/components/ReviewPage.tsx",
                                                                        lineNumber: 313,
                                                                        columnNumber: 31
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "text-sm text-[#374151] font-medium mb-1 truncate",
                                                                        title: String(field.value),
                                                                        children: String(field.value)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/Autonomous-Claims-Orchestrator/components/ReviewPage.tsx",
                                                                        lineNumber: 323,
                                                                        columnNumber: 31
                                                                    }, this),
                                                                    isSelected && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$dom$2f$motion$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                                                                        initial: {
                                                                            opacity: 0,
                                                                            height: 0
                                                                        },
                                                                        animate: {
                                                                            opacity: 1,
                                                                            height: 'auto'
                                                                        },
                                                                        className: "mt-3 pt-3 border-t border-[#E5E7EB]",
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "text-xs text-[#6B7280] space-y-1",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                            className: "font-medium",
                                                                                            children: "Source:"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/Autonomous-Claims-Orchestrator/components/ReviewPage.tsx",
                                                                                            lineNumber: 335,
                                                                                            columnNumber: 39
                                                                                        }, this),
                                                                                        ' ',
                                                                                        typeof field.sourceLocator === 'string' ? field.sourceLocator : field.sourceLocator.docId
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/Autonomous-Claims-Orchestrator/components/ReviewPage.tsx",
                                                                                    lineNumber: 334,
                                                                                    columnNumber: 37
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                            className: "font-medium",
                                                                                            children: "Rationale:"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/Autonomous-Claims-Orchestrator/components/ReviewPage.tsx",
                                                                                            lineNumber: 341,
                                                                                            columnNumber: 39
                                                                                        }, this),
                                                                                        " ",
                                                                                        field.rationale
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/Autonomous-Claims-Orchestrator/components/ReviewPage.tsx",
                                                                                    lineNumber: 340,
                                                                                    columnNumber: 37
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/Autonomous-Claims-Orchestrator/components/ReviewPage.tsx",
                                                                            lineNumber: 333,
                                                                            columnNumber: 35
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/Autonomous-Claims-Orchestrator/components/ReviewPage.tsx",
                                                                        lineNumber: 328,
                                                                        columnNumber: 33
                                                                    }, this)
                                                                ]
                                                            }, fieldName, true, {
                                                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/ReviewPage.tsx",
                                                                lineNumber: 304,
                                                                columnNumber: 29
                                                            }, this);
                                                        })
                                                    }, void 0, false, {
                                                        fileName: "[project]/Autonomous-Claims-Orchestrator/components/ReviewPage.tsx",
                                                        lineNumber: 297,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, category, true, {
                                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/ReviewPage.tsx",
                                                lineNumber: 293,
                                                columnNumber: 21
                                            }, this);
                                        })
                                    }, void 0, false, {
                                        fileName: "[project]/Autonomous-Claims-Orchestrator/components/ReviewPage.tsx",
                                        lineNumber: 288,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/ReviewPage.tsx",
                                lineNumber: 274,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/Autonomous-Claims-Orchestrator/components/ReviewPage.tsx",
                            lineNumber: 273,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "col-span-12 lg:col-span-3",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$dom$2f$motion$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                                className: "card p-5 h-fit sticky top-[88px]",
                                initial: {
                                    opacity: 0,
                                    x: 20
                                },
                                animate: {
                                    opacity: 1,
                                    x: 0
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center space-x-2 mb-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BookOpen$3e$__["BookOpen"], {
                                                className: "w-4 h-4 text-[#6366F1]"
                                            }, void 0, false, {
                                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/ReviewPage.tsx",
                                                lineNumber: 365,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                className: "text-sm font-bold text-[#111827] uppercase tracking-wider",
                                                children: "Policy Grounding"
                                            }, void 0, false, {
                                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/ReviewPage.tsx",
                                                lineNumber: 366,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Autonomous-Claims-Orchestrator/components/ReviewPage.tsx",
                                        lineNumber: 364,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: `p-4 rounded-lg border-2 ${policyState.type === 'success' ? 'border-[#10B981] bg-[#ECFDF5]' : policyState.type === 'warning' ? 'border-[#F59E0B] bg-[#FFFBEB]' : 'border-[#E5E7EB] bg-[#F9FAFB]'}`,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-start space-x-3",
                                            children: [
                                                policyState.type === 'success' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__["CheckCircle"], {
                                                    className: "w-5 h-5 text-[#10B981] flex-shrink-0 mt-0.5"
                                                }, void 0, false, {
                                                    fileName: "[project]/Autonomous-Claims-Orchestrator/components/ReviewPage.tsx",
                                                    lineNumber: 379,
                                                    columnNumber: 21
                                                }, this) : policyState.type === 'warning' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$alert$2d$triangle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                                                    className: "w-5 h-5 text-[#F59E0B] flex-shrink-0 mt-0.5"
                                                }, void 0, false, {
                                                    fileName: "[project]/Autonomous-Claims-Orchestrator/components/ReviewPage.tsx",
                                                    lineNumber: 381,
                                                    columnNumber: 21
                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Shield$3e$__["Shield"], {
                                                    className: "w-5 h-5 text-[#6B7280] flex-shrink-0 mt-0.5"
                                                }, void 0, false, {
                                                    fileName: "[project]/Autonomous-Claims-Orchestrator/components/ReviewPage.tsx",
                                                    lineNumber: 383,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex-1 min-w-0",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: `text-sm font-semibold mb-1 ${policyState.type === 'success' ? 'text-[#047857]' : policyState.type === 'warning' ? 'text-[#B45309]' : 'text-[#374151]'}`,
                                                            children: policyState.message
                                                        }, void 0, false, {
                                                            fileName: "[project]/Autonomous-Claims-Orchestrator/components/ReviewPage.tsx",
                                                            lineNumber: 386,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: `text-xs ${policyState.type === 'success' ? 'text-[#065F46]' : policyState.type === 'warning' ? 'text-[#92400E]' : 'text-[#6B7280]'}`,
                                                            children: policyState.subMessage
                                                        }, void 0, false, {
                                                            fileName: "[project]/Autonomous-Claims-Orchestrator/components/ReviewPage.tsx",
                                                            lineNumber: 395,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/Autonomous-Claims-Orchestrator/components/ReviewPage.tsx",
                                                    lineNumber: 385,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Autonomous-Claims-Orchestrator/components/ReviewPage.tsx",
                                            lineNumber: 377,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/Autonomous-Claims-Orchestrator/components/ReviewPage.tsx",
                                        lineNumber: 370,
                                        columnNumber: 15
                                    }, this),
                                    policyGrounding.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mt-4 space-y-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-2",
                                                children: [
                                                    "Matches (",
                                                    policyGrounding.length,
                                                    ")"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/ReviewPage.tsx",
                                                lineNumber: 411,
                                                columnNumber: 19
                                            }, this),
                                            policyGrounding.slice(0, 3).map((policy)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "p-3 rounded-lg border border-[#E5E7EB] bg-white hover:border-[#CBD5E1] hover:bg-[#F9FAFB] transition-all",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center justify-between mb-1",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-xs font-semibold text-[#111827] truncate",
                                                                    children: policy.clauseId
                                                                }, void 0, false, {
                                                                    fileName: "[project]/Autonomous-Claims-Orchestrator/components/ReviewPage.tsx",
                                                                    lineNumber: 420,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-xs font-medium text-[#10B981] bg-[#ECFDF5] px-1.5 py-0.5 rounded flex-shrink-0 ml-2",
                                                                    children: [
                                                                        Math.round((policy.score || policy.similarity || 0) * 100),
                                                                        "%"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/Autonomous-Claims-Orchestrator/components/ReviewPage.tsx",
                                                                    lineNumber: 421,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/Autonomous-Claims-Orchestrator/components/ReviewPage.tsx",
                                                            lineNumber: 419,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "text-xs text-[#374151] font-medium mb-1 line-clamp-1",
                                                            children: policy.title
                                                        }, void 0, false, {
                                                            fileName: "[project]/Autonomous-Claims-Orchestrator/components/ReviewPage.tsx",
                                                            lineNumber: 425,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "text-xs text-[#6B7280] line-clamp-2",
                                                            children: policy.snippet
                                                        }, void 0, false, {
                                                            fileName: "[project]/Autonomous-Claims-Orchestrator/components/ReviewPage.tsx",
                                                            lineNumber: 428,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, policy.clauseId, true, {
                                                    fileName: "[project]/Autonomous-Claims-Orchestrator/components/ReviewPage.tsx",
                                                    lineNumber: 415,
                                                    columnNumber: 21
                                                }, this)),
                                            policyGrounding.length > 3 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-xs text-[#6366F1] font-medium text-center pt-2",
                                                children: [
                                                    "+",
                                                    policyGrounding.length - 3,
                                                    " more matches"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/ReviewPage.tsx",
                                                lineNumber: 434,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Autonomous-Claims-Orchestrator/components/ReviewPage.tsx",
                                        lineNumber: 410,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/ReviewPage.tsx",
                                lineNumber: 359,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/Autonomous-Claims-Orchestrator/components/ReviewPage.tsx",
                            lineNumber: 358,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Autonomous-Claims-Orchestrator/components/ReviewPage.tsx",
                    lineNumber: 217,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/Autonomous-Claims-Orchestrator/components/ReviewPage.tsx",
                lineNumber: 216,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Autonomous-Claims-Orchestrator/components/ReviewPage.tsx",
        lineNumber: 165,
        columnNumber: 5
    }, this);
}
_s(ReviewPage, "tnQivEwLOprelg2C5Jdm+QsNHzg=");
_c = ReviewPage;
var _c;
__turbopack_context__.k.register(_c, "ReviewPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Autonomous-Claims-Orchestrator/components/DecisionPage.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>DecisionPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Autonomous-Claims-Orchestrator/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Autonomous-Claims-Orchestrator/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$dom$2f$motion$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Autonomous-Claims-Orchestrator/node_modules/framer-motion/dist/es/render/dom/motion.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__ = __turbopack_context__.i("[project]/Autonomous-Claims-Orchestrator/node_modules/lucide-react/dist/esm/icons/check-circle.js [app-client] (ecmascript) <export default as CheckCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__ = __turbopack_context__.i("[project]/Autonomous-Claims-Orchestrator/node_modules/lucide-react/dist/esm/icons/file-text.js [app-client] (ecmascript) <export default as FileText>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__ = __turbopack_context__.i("[project]/Autonomous-Claims-Orchestrator/node_modules/lucide-react/dist/esm/icons/download.js [app-client] (ecmascript) <export default as Download>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__ = __turbopack_context__.i("[project]/Autonomous-Claims-Orchestrator/node_modules/lucide-react/dist/esm/icons/clock.js [app-client] (ecmascript) <export default as Clock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__ = __turbopack_context__.i("[project]/Autonomous-Claims-Orchestrator/node_modules/lucide-react/dist/esm/icons/arrow-right.js [app-client] (ecmascript) <export default as ArrowRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__ = __turbopack_context__.i("[project]/Autonomous-Claims-Orchestrator/node_modules/lucide-react/dist/esm/icons/arrow-left.js [app-client] (ecmascript) <export default as ArrowLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$alert$2d$triangle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__ = __turbopack_context__.i("[project]/Autonomous-Claims-Orchestrator/node_modules/lucide-react/dist/esm/icons/alert-triangle.js [app-client] (ecmascript) <export default as AlertTriangle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__ = __turbopack_context__.i("[project]/Autonomous-Claims-Orchestrator/node_modules/lucide-react/dist/esm/icons/check.js [app-client] (ecmascript) <export default as Check>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/Autonomous-Claims-Orchestrator/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
function DecisionPage({ claimData, onNextStage, onPreviousStage }) {
    _s();
    const [isCreatingDraft, setIsCreatingDraft] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isSendingAck, setIsSendingAck] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [draftCreated, setDraftCreated] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [ackSent, setAckSent] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showAcknowledgment, setShowAcknowledgment] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Handle null claimData
    if (!claimData || !claimData.decisionPack) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$dom$2f$motion$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
            initial: {
                opacity: 0,
                y: 20
            },
            animate: {
                opacity: 1,
                y: 0
            },
            className: "max-w-7xl mx-auto text-center py-12",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$alert$2d$triangle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                    className: "w-16 h-16 text-warning-500 mx-auto mb-4"
                }, void 0, false, {
                    fileName: "[project]/Autonomous-Claims-Orchestrator/components/DecisionPage.tsx",
                    lineNumber: 40,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                    className: "text-2xl font-bold text-gray-900 mb-2",
                    children: "No Claim Data Available"
                }, void 0, false, {
                    fileName: "[project]/Autonomous-Claims-Orchestrator/components/DecisionPage.tsx",
                    lineNumber: 41,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-gray-600 mb-6",
                    children: "Please process a claim first before making decisions."
                }, void 0, false, {
                    fileName: "[project]/Autonomous-Claims-Orchestrator/components/DecisionPage.tsx",
                    lineNumber: 42,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: onPreviousStage,
                    className: "btn-primary flex items-center space-x-2 mx-auto",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__["ArrowLeft"], {
                            className: "w-4 h-4"
                        }, void 0, false, {
                            fileName: "[project]/Autonomous-Claims-Orchestrator/components/DecisionPage.tsx",
                            lineNumber: 49,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            children: "Back to Review"
                        }, void 0, false, {
                            fileName: "[project]/Autonomous-Claims-Orchestrator/components/DecisionPage.tsx",
                            lineNumber: 50,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Autonomous-Claims-Orchestrator/components/DecisionPage.tsx",
                    lineNumber: 45,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/Autonomous-Claims-Orchestrator/components/DecisionPage.tsx",
            lineNumber: 35,
            columnNumber: 7
        }, this);
    }
    const { decisionPack, processingTime } = claimData;
    const { claimDraft, evidence = [], documents = [], policyGrounding = [], audit = [] } = decisionPack || {};
    const handleCreateDraft = async ()=>{
        setIsCreatingDraft(true);
        // Simulate API call
        await new Promise((resolve)=>setTimeout(resolve, 2000));
        setDraftCreated(true);
        setIsCreatingDraft(false);
    };
    const handleSendAcknowledgment = async ()=>{
        setIsSendingAck(true);
        // Simulate API call
        await new Promise((resolve)=>setTimeout(resolve, 1500));
        setAckSent(true);
        setIsSendingAck(false);
        setShowAcknowledgment(true);
    };
    const generateAcknowledgment = ()=>{
        const { claimantName, lossDate, lossType, policyId } = claimDraft || {};
        const policyInfo = policyGrounding.length > 0 ? `Based on your policy coverage, this appears to be a covered loss.` : `We're reviewing your policy to determine coverage.`;
        return `Dear ${claimantName},

Thank you for reporting your claim. We have received your First Notice of Loss for the incident that occurred on ${lossDate}.

${policyInfo}

Your claim has been assigned claim number: CLM-${Date.now().toString().slice(-8)}

What happens next:
1. Our team will review the submitted documents and information
2. We'll contact you within 24 hours to discuss next steps
3. If you have any questions, please call our claims hotline

We appreciate your patience and will work to resolve your claim as quickly as possible.

Best regards,
Claims Team`;
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$dom$2f$motion$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
        initial: {
            opacity: 0,
            y: 20
        },
        animate: {
            opacity: 1,
            y: 0
        },
        className: "max-w-6xl mx-auto",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-center mb-12",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "text-4xl font-bold bg-gradient-to-r from-[#2D3748] via-[#4A5568] to-[#2D3748] bg-clip-text text-transparent mb-4",
                        children: "Decision & Actions"
                    }, void 0, false, {
                        fileName: "[project]/Autonomous-Claims-Orchestrator/components/DecisionPage.tsx",
                        lineNumber: 119,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-lg text-[#718096] max-w-2xl mx-auto",
                        children: "Review the assembled claim draft and take action"
                    }, void 0, false, {
                        fileName: "[project]/Autonomous-Claims-Orchestrator/components/DecisionPage.tsx",
                        lineNumber: 122,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Autonomous-Claims-Orchestrator/components/DecisionPage.tsx",
                lineNumber: 118,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid lg:grid-cols-2 gap-8",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$dom$2f$motion$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                        className: "card p-6",
                        initial: {
                            opacity: 0,
                            x: -20
                        },
                        animate: {
                            opacity: 1,
                            x: 0
                        },
                        transition: {
                            delay: 0.1
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center space-x-3 mb-6",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "p-2 bg-gradient-to-br from-sky-100 to-sky-200 rounded-lg",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__["CheckCircle"], {
                                            className: "w-5 h-5 text-sky-600"
                                        }, void 0, false, {
                                            fileName: "[project]/Autonomous-Claims-Orchestrator/components/DecisionPage.tsx",
                                            lineNumber: 137,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/Autonomous-Claims-Orchestrator/components/DecisionPage.tsx",
                                        lineNumber: 136,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "text-xl font-bold text-[#2D3748]",
                                        children: "Decision Pack"
                                    }, void 0, false, {
                                        fileName: "[project]/Autonomous-Claims-Orchestrator/components/DecisionPage.tsx",
                                        lineNumber: 139,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/DecisionPage.tsx",
                                lineNumber: 135,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "p-5 bg-gradient-to-br from-sky-50 to-sky-100 rounded-xl border-l-4 border-sky-400 shadow-sm",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: "font-semibold text-[#0369A1] mb-3",
                                                children: "Claim Summary"
                                            }, void 0, false, {
                                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/DecisionPage.tsx",
                                                lineNumber: 145,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "grid grid-cols-2 gap-2 text-sm",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "font-medium",
                                                                children: "Policy:"
                                                            }, void 0, false, {
                                                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/DecisionPage.tsx",
                                                                lineNumber: 147,
                                                                columnNumber: 22
                                                            }, this),
                                                            " ",
                                                            claimDraft.policyId
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/Autonomous-Claims-Orchestrator/components/DecisionPage.tsx",
                                                        lineNumber: 147,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "font-medium",
                                                                children: "Claimant:"
                                                            }, void 0, false, {
                                                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/DecisionPage.tsx",
                                                                lineNumber: 148,
                                                                columnNumber: 22
                                                            }, this),
                                                            " ",
                                                            claimDraft.claimantName
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/Autonomous-Claims-Orchestrator/components/DecisionPage.tsx",
                                                        lineNumber: 148,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "font-medium",
                                                                children: "Loss Date:"
                                                            }, void 0, false, {
                                                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/DecisionPage.tsx",
                                                                lineNumber: 149,
                                                                columnNumber: 22
                                                            }, this),
                                                            " ",
                                                            claimDraft.lossDate
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/Autonomous-Claims-Orchestrator/components/DecisionPage.tsx",
                                                        lineNumber: 149,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "font-medium",
                                                                children: "Type:"
                                                            }, void 0, false, {
                                                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/DecisionPage.tsx",
                                                                lineNumber: 150,
                                                                columnNumber: 22
                                                            }, this),
                                                            " ",
                                                            claimDraft.lossType
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/Autonomous-Claims-Orchestrator/components/DecisionPage.tsx",
                                                        lineNumber: 150,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "font-medium",
                                                                children: "Location:"
                                                            }, void 0, false, {
                                                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/DecisionPage.tsx",
                                                                lineNumber: 151,
                                                                columnNumber: 22
                                                            }, this),
                                                            " ",
                                                            claimDraft.location
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/Autonomous-Claims-Orchestrator/components/DecisionPage.tsx",
                                                        lineNumber: 151,
                                                        columnNumber: 17
                                                    }, this),
                                                    claimDraft.deductible && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "font-medium",
                                                                children: "Deductible:"
                                                            }, void 0, false, {
                                                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/DecisionPage.tsx",
                                                                lineNumber: 153,
                                                                columnNumber: 24
                                                            }, this),
                                                            " $",
                                                            claimDraft.deductible
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/Autonomous-Claims-Orchestrator/components/DecisionPage.tsx",
                                                        lineNumber: 153,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/DecisionPage.tsx",
                                                lineNumber: 146,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Autonomous-Claims-Orchestrator/components/DecisionPage.tsx",
                                        lineNumber: 144,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "p-5 bg-gradient-to-br from-[#ECFDF5] to-[#D1FAE5] rounded-xl border-l-4 border-[#22C55E] shadow-sm",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: "font-semibold text-[#047857] mb-3",
                                                children: "Evidence Summary"
                                            }, void 0, false, {
                                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/DecisionPage.tsx",
                                                lineNumber: 160,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-sm text-[#065F46]",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "mb-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "font-medium",
                                                                children: "Documents:"
                                                            }, void 0, false, {
                                                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/DecisionPage.tsx",
                                                                lineNumber: 163,
                                                                columnNumber: 19
                                                            }, this),
                                                            " ",
                                                            documents.length,
                                                            " attached"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/Autonomous-Claims-Orchestrator/components/DecisionPage.tsx",
                                                        lineNumber: 162,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "mb-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "font-medium",
                                                                children: "Fields Extracted:"
                                                            }, void 0, false, {
                                                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/DecisionPage.tsx",
                                                                lineNumber: 166,
                                                                columnNumber: 19
                                                            }, this),
                                                            " ",
                                                            evidence.length,
                                                            " total"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/Autonomous-Claims-Orchestrator/components/DecisionPage.tsx",
                                                        lineNumber: 165,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "font-medium",
                                                                children: "High Confidence:"
                                                            }, void 0, false, {
                                                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/DecisionPage.tsx",
                                                                lineNumber: 169,
                                                                columnNumber: 19
                                                            }, this),
                                                            " ",
                                                            evidence.filter((e)=>e.confidence >= 0.8).length,
                                                            " fields"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/Autonomous-Claims-Orchestrator/components/DecisionPage.tsx",
                                                        lineNumber: 168,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/DecisionPage.tsx",
                                                lineNumber: 161,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Autonomous-Claims-Orchestrator/components/DecisionPage.tsx",
                                        lineNumber: 159,
                                        columnNumber: 13
                                    }, this),
                                    policyGrounding.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "p-5 bg-gradient-to-br from-sky-50 to-sky-100 rounded-xl border-l-4 border-sky-400 shadow-sm",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: "font-semibold text-[#0369A1] mb-3",
                                                children: "Policy Grounding"
                                            }, void 0, false, {
                                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/DecisionPage.tsx",
                                                lineNumber: 177,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-sm text-[#075985]",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "mb-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "font-medium",
                                                                children: "Clauses Found:"
                                                            }, void 0, false, {
                                                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/DecisionPage.tsx",
                                                                lineNumber: 180,
                                                                columnNumber: 21
                                                            }, this),
                                                            " ",
                                                            policyGrounding.length
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/Autonomous-Claims-Orchestrator/components/DecisionPage.tsx",
                                                        lineNumber: 179,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "font-medium",
                                                                children: "Coverage:"
                                                            }, void 0, false, {
                                                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/DecisionPage.tsx",
                                                                lineNumber: 183,
                                                                columnNumber: 21
                                                            }, this),
                                                            " ",
                                                            claimDraft.coverageFound ? 'Confirmed' : 'Under Review'
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/Autonomous-Claims-Orchestrator/components/DecisionPage.tsx",
                                                        lineNumber: 182,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/DecisionPage.tsx",
                                                lineNumber: 178,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Autonomous-Claims-Orchestrator/components/DecisionPage.tsx",
                                        lineNumber: 176,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "p-5 bg-gradient-to-br from-cloud-50 to-cloud-100 rounded-xl border border-cloud-200 shadow-sm",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: "font-semibold text-[#2D3748] mb-3",
                                                children: "Processing Metrics"
                                            }, void 0, false, {
                                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/DecisionPage.tsx",
                                                lineNumber: 191,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-sm text-[#4A5568]",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "mb-1",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "font-medium",
                                                                children: "Total Time:"
                                                            }, void 0, false, {
                                                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/DecisionPage.tsx",
                                                                lineNumber: 194,
                                                                columnNumber: 19
                                                            }, this),
                                                            " ",
                                                            ((processingTime || 2000) / 1000).toFixed(1),
                                                            "s"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/Autonomous-Claims-Orchestrator/components/DecisionPage.tsx",
                                                        lineNumber: 193,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "mb-1",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "font-medium",
                                                                children: "Auto-population:"
                                                            }, void 0, false, {
                                                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/DecisionPage.tsx",
                                                                lineNumber: 197,
                                                                columnNumber: 19
                                                            }, this),
                                                            " ",
                                                            ((claimData.autoPopulatedFields || 8) / (claimData.totalFields || 10) * 100).toFixed(0),
                                                            "%"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/Autonomous-Claims-Orchestrator/components/DecisionPage.tsx",
                                                        lineNumber: 196,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "font-medium",
                                                                children: "RAG Hit Rate:"
                                                            }, void 0, false, {
                                                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/DecisionPage.tsx",
                                                                lineNumber: 200,
                                                                columnNumber: 19
                                                            }, this),
                                                            " ",
                                                            ((claimData.ragHitRate || 1) * 100).toFixed(0),
                                                            "%"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/Autonomous-Claims-Orchestrator/components/DecisionPage.tsx",
                                                        lineNumber: 199,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/DecisionPage.tsx",
                                                lineNumber: 192,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Autonomous-Claims-Orchestrator/components/DecisionPage.tsx",
                                        lineNumber: 190,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/DecisionPage.tsx",
                                lineNumber: 142,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Autonomous-Claims-Orchestrator/components/DecisionPage.tsx",
                        lineNumber: 129,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$dom$2f$motion$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                        className: "card p-6",
                        initial: {
                            opacity: 0,
                            x: 20
                        },
                        animate: {
                            opacity: 1,
                            x: 0
                        },
                        transition: {
                            delay: 0.2
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center space-x-3 mb-6",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "p-2 bg-gradient-to-br from-sky-100 to-sky-200 rounded-lg",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"], {
                                            className: "w-5 h-5 text-sky-600"
                                        }, void 0, false, {
                                            fileName: "[project]/Autonomous-Claims-Orchestrator/components/DecisionPage.tsx",
                                            lineNumber: 216,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/Autonomous-Claims-Orchestrator/components/DecisionPage.tsx",
                                        lineNumber: 215,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "text-xl font-bold text-[#2D3748]",
                                        children: "Actions"
                                    }, void 0, false, {
                                        fileName: "[project]/Autonomous-Claims-Orchestrator/components/DecisionPage.tsx",
                                        lineNumber: 218,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/DecisionPage.tsx",
                                lineNumber: 214,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "p-5 border-2 border-cloud-200 rounded-xl bg-white hover:shadow-md transition-shadow",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: "font-semibold text-[#2D3748] mb-2",
                                                children: "Create Draft in Core System"
                                            }, void 0, false, {
                                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/DecisionPage.tsx",
                                                lineNumber: 224,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm text-[#718096] mb-4",
                                                children: "Send the assembled claim data to the core claims management system"
                                            }, void 0, false, {
                                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/DecisionPage.tsx",
                                                lineNumber: 225,
                                                columnNumber: 15
                                            }, this),
                                            !draftCreated ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: handleCreateDraft,
                                                disabled: isCreatingDraft,
                                                className: "btn-primary w-full disabled:opacity-50",
                                                children: isCreatingDraft ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center justify-center space-x-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"], {
                                                            className: "w-4 h-4 animate-spin"
                                                        }, void 0, false, {
                                                            fileName: "[project]/Autonomous-Claims-Orchestrator/components/DecisionPage.tsx",
                                                            lineNumber: 237,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            children: "Creating Draft..."
                                                        }, void 0, false, {
                                                            fileName: "[project]/Autonomous-Claims-Orchestrator/components/DecisionPage.tsx",
                                                            lineNumber: 238,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/Autonomous-Claims-Orchestrator/components/DecisionPage.tsx",
                                                    lineNumber: 236,
                                                    columnNumber: 21
                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: "Create Draft in Core"
                                                }, void 0, false, {
                                                    fileName: "[project]/Autonomous-Claims-Orchestrator/components/DecisionPage.tsx",
                                                    lineNumber: 241,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/DecisionPage.tsx",
                                                lineNumber: 230,
                                                columnNumber: 17
                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center space-x-2 text-success-600",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                                        className: "w-5 h-5"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Autonomous-Claims-Orchestrator/components/DecisionPage.tsx",
                                                        lineNumber: 246,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "font-medium",
                                                        children: "Draft Created Successfully"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Autonomous-Claims-Orchestrator/components/DecisionPage.tsx",
                                                        lineNumber: 247,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/DecisionPage.tsx",
                                                lineNumber: 245,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Autonomous-Claims-Orchestrator/components/DecisionPage.tsx",
                                        lineNumber: 223,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "p-5 border-2 border-cloud-200 rounded-xl bg-white hover:shadow-md transition-shadow",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: "font-semibold text-[#2D3748] mb-2",
                                                children: "Send Customer Acknowledgment"
                                            }, void 0, false, {
                                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/DecisionPage.tsx",
                                                lineNumber: 254,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm text-[#718096] mb-4",
                                                children: "Generate and send a personalized acknowledgment email to the claimant"
                                            }, void 0, false, {
                                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/DecisionPage.tsx",
                                                lineNumber: 255,
                                                columnNumber: 15
                                            }, this),
                                            !ackSent ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: handleSendAcknowledgment,
                                                disabled: isSendingAck || !draftCreated,
                                                className: "btn-secondary w-full disabled:opacity-50",
                                                children: isSendingAck ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center justify-center space-x-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"], {
                                                            className: "w-4 h-4 animate-spin"
                                                        }, void 0, false, {
                                                            fileName: "[project]/Autonomous-Claims-Orchestrator/components/DecisionPage.tsx",
                                                            lineNumber: 267,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            children: "Sending..."
                                                        }, void 0, false, {
                                                            fileName: "[project]/Autonomous-Claims-Orchestrator/components/DecisionPage.tsx",
                                                            lineNumber: 268,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/Autonomous-Claims-Orchestrator/components/DecisionPage.tsx",
                                                    lineNumber: 266,
                                                    columnNumber: 21
                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: "Send Acknowledgment"
                                                }, void 0, false, {
                                                    fileName: "[project]/Autonomous-Claims-Orchestrator/components/DecisionPage.tsx",
                                                    lineNumber: 271,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/DecisionPage.tsx",
                                                lineNumber: 260,
                                                columnNumber: 17
                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center space-x-2 text-success-600",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                                        className: "w-5 h-5"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Autonomous-Claims-Orchestrator/components/DecisionPage.tsx",
                                                        lineNumber: 276,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "font-medium",
                                                        children: "Acknowledgment Sent"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Autonomous-Claims-Orchestrator/components/DecisionPage.tsx",
                                                        lineNumber: 277,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/DecisionPage.tsx",
                                                lineNumber: 275,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Autonomous-Claims-Orchestrator/components/DecisionPage.tsx",
                                        lineNumber: 253,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "p-5 border-2 border-cloud-200 rounded-xl bg-white hover:shadow-md transition-shadow",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: "font-semibold text-[#2D3748] mb-2",
                                                children: "Download Decision Pack"
                                            }, void 0, false, {
                                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/DecisionPage.tsx",
                                                lineNumber: 284,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm text-[#718096] mb-4",
                                                children: "Download a complete record of the decision pack for audit purposes"
                                            }, void 0, false, {
                                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/DecisionPage.tsx",
                                                lineNumber: 285,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                className: "btn-secondary w-full flex items-center justify-center space-x-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__["Download"], {
                                                        className: "w-4 h-4"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Autonomous-Claims-Orchestrator/components/DecisionPage.tsx",
                                                        lineNumber: 290,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: "Download PDF"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Autonomous-Claims-Orchestrator/components/DecisionPage.tsx",
                                                        lineNumber: 291,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/DecisionPage.tsx",
                                                lineNumber: 289,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Autonomous-Claims-Orchestrator/components/DecisionPage.tsx",
                                        lineNumber: 283,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/DecisionPage.tsx",
                                lineNumber: 221,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Autonomous-Claims-Orchestrator/components/DecisionPage.tsx",
                        lineNumber: 208,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Autonomous-Claims-Orchestrator/components/DecisionPage.tsx",
                lineNumber: 127,
                columnNumber: 7
            }, this),
            showAcknowledgment && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$dom$2f$motion$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                className: "mt-8 card p-6",
                initial: {
                    opacity: 0,
                    y: 20
                },
                animate: {
                    opacity: 1,
                    y: 0
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between mb-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-lg font-semibold",
                                children: "Customer Acknowledgment"
                            }, void 0, false, {
                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/DecisionPage.tsx",
                                lineNumber: 306,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setShowAcknowledgment(false),
                                className: "text-gray-500 hover:text-gray-700",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                    className: "w-5 h-5"
                                }, void 0, false, {
                                    fileName: "[project]/Autonomous-Claims-Orchestrator/components/DecisionPage.tsx",
                                    lineNumber: 311,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/DecisionPage.tsx",
                                lineNumber: 307,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Autonomous-Claims-Orchestrator/components/DecisionPage.tsx",
                        lineNumber: 305,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-gray-50 p-4 rounded-lg",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("pre", {
                            className: "text-sm text-gray-800 whitespace-pre-wrap font-mono",
                            children: generateAcknowledgment()
                        }, void 0, false, {
                            fileName: "[project]/Autonomous-Claims-Orchestrator/components/DecisionPage.tsx",
                            lineNumber: 316,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/Autonomous-Claims-Orchestrator/components/DecisionPage.tsx",
                        lineNumber: 315,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-4 text-sm text-gray-600",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "font-medium",
                                    children: "Note:"
                                }, void 0, false, {
                                    fileName: "[project]/Autonomous-Claims-Orchestrator/components/DecisionPage.tsx",
                                    lineNumber: 322,
                                    columnNumber: 16
                                }, this),
                                " This acknowledgment is grounded in the extracted claim facts and policy clauses, ensuring accuracy and compliance."
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Autonomous-Claims-Orchestrator/components/DecisionPage.tsx",
                            lineNumber: 322,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/Autonomous-Claims-Orchestrator/components/DecisionPage.tsx",
                        lineNumber: 321,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Autonomous-Claims-Orchestrator/components/DecisionPage.tsx",
                lineNumber: 300,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$dom$2f$motion$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                className: "mt-8 card p-6",
                initial: {
                    opacity: 0,
                    y: 20
                },
                animate: {
                    opacity: 1,
                    y: 0
                },
                transition: {
                    delay: 0.3
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "text-lg font-semibold mb-4",
                        children: "Audit Timeline"
                    }, void 0, false, {
                        fileName: "[project]/Autonomous-Claims-Orchestrator/components/DecisionPage.tsx",
                        lineNumber: 334,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-3",
                        children: audit.map((event, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center space-x-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: `w-3 h-3 rounded-full ${event.success ? 'bg-success-500' : 'bg-danger-500'}`
                                    }, void 0, false, {
                                        fileName: "[project]/Autonomous-Claims-Orchestrator/components/DecisionPage.tsx",
                                        lineNumber: 338,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex-1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center justify-between",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "font-medium text-gray-900",
                                                        children: event.step
                                                    }, void 0, false, {
                                                        fileName: "[project]/Autonomous-Claims-Orchestrator/components/DecisionPage.tsx",
                                                        lineNumber: 343,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-sm text-gray-500",
                                                        children: [
                                                            event.duration,
                                                            "ms"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/Autonomous-Claims-Orchestrator/components/DecisionPage.tsx",
                                                        lineNumber: 344,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/DecisionPage.tsx",
                                                lineNumber: 342,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-sm text-gray-600",
                                                children: [
                                                    new Date(event.timestamp).toLocaleTimeString(),
                                                    " - ",
                                                    event.modelVersion,
                                                    event.fallbackUsed && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-warning-600 ml-2",
                                                        children: "(Fallback used)"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Autonomous-Claims-Orchestrator/components/DecisionPage.tsx",
                                                        lineNumber: 349,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/DecisionPage.tsx",
                                                lineNumber: 346,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Autonomous-Claims-Orchestrator/components/DecisionPage.tsx",
                                        lineNumber: 341,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, index, true, {
                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/DecisionPage.tsx",
                                lineNumber: 337,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/Autonomous-Claims-Orchestrator/components/DecisionPage.tsx",
                        lineNumber: 335,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Autonomous-Claims-Orchestrator/components/DecisionPage.tsx",
                lineNumber: 328,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex justify-between mt-8",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: onPreviousStage,
                        className: "btn-secondary flex items-center space-x-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__["ArrowLeft"], {
                                className: "w-4 h-4"
                            }, void 0, false, {
                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/DecisionPage.tsx",
                                lineNumber: 364,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "Back to Review"
                            }, void 0, false, {
                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/DecisionPage.tsx",
                                lineNumber: 365,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Autonomous-Claims-Orchestrator/components/DecisionPage.tsx",
                        lineNumber: 360,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: onNextStage,
                        className: "btn-primary flex items-center space-x-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "View Dashboard"
                            }, void 0, false, {
                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/DecisionPage.tsx",
                                lineNumber: 372,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__["ArrowRight"], {
                                className: "w-4 h-4"
                            }, void 0, false, {
                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/DecisionPage.tsx",
                                lineNumber: 373,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Autonomous-Claims-Orchestrator/components/DecisionPage.tsx",
                        lineNumber: 368,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Autonomous-Claims-Orchestrator/components/DecisionPage.tsx",
                lineNumber: 359,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Autonomous-Claims-Orchestrator/components/DecisionPage.tsx",
        lineNumber: 112,
        columnNumber: 5
    }, this);
}
_s(DecisionPage, "ZORhiaKox+z+gfPd76+6Ma01ffY=");
_c = DecisionPage;
var _c;
__turbopack_context__.k.register(_c, "DecisionPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Autonomous-Claims-Orchestrator/components/DashboardPage.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>DashboardPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Autonomous-Claims-Orchestrator/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__ = __turbopack_context__.i("[project]/Autonomous-Claims-Orchestrator/node_modules/lucide-react/dist/esm/icons/clock.js [app-client] (ecmascript) <export default as Clock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__ = __turbopack_context__.i("[project]/Autonomous-Claims-Orchestrator/node_modules/lucide-react/dist/esm/icons/check-circle.js [app-client] (ecmascript) <export default as CheckCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$alert$2d$triangle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__ = __turbopack_context__.i("[project]/Autonomous-Claims-Orchestrator/node_modules/lucide-react/dist/esm/icons/alert-triangle.js [app-client] (ecmascript) <export default as AlertTriangle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingUp$3e$__ = __turbopack_context__.i("[project]/Autonomous-Claims-Orchestrator/node_modules/lucide-react/dist/esm/icons/trending-up.js [app-client] (ecmascript) <export default as TrendingUp>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__ = __turbopack_context__.i("[project]/Autonomous-Claims-Orchestrator/node_modules/lucide-react/dist/esm/icons/refresh-cw.js [app-client] (ecmascript) <export default as RefreshCw>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__ = __turbopack_context__.i("[project]/Autonomous-Claims-Orchestrator/node_modules/lucide-react/dist/esm/icons/download.js [app-client] (ecmascript) <export default as Download>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$recharts$2f$es6$2f$chart$2f$LineChart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Autonomous-Claims-Orchestrator/node_modules/recharts/es6/chart/LineChart.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$Line$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Autonomous-Claims-Orchestrator/node_modules/recharts/es6/cartesian/Line.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$XAxis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Autonomous-Claims-Orchestrator/node_modules/recharts/es6/cartesian/XAxis.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$YAxis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Autonomous-Claims-Orchestrator/node_modules/recharts/es6/cartesian/YAxis.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$CartesianGrid$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Autonomous-Claims-Orchestrator/node_modules/recharts/es6/cartesian/CartesianGrid.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Tooltip$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Autonomous-Claims-Orchestrator/node_modules/recharts/es6/component/Tooltip.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$recharts$2f$es6$2f$component$2f$ResponsiveContainer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Autonomous-Claims-Orchestrator/node_modules/recharts/es6/component/ResponsiveContainer.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$recharts$2f$es6$2f$chart$2f$BarChart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Autonomous-Claims-Orchestrator/node_modules/recharts/es6/chart/BarChart.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$Bar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Autonomous-Claims-Orchestrator/node_modules/recharts/es6/cartesian/Bar.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$recharts$2f$es6$2f$chart$2f$PieChart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Autonomous-Claims-Orchestrator/node_modules/recharts/es6/chart/PieChart.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$recharts$2f$es6$2f$polar$2f$Pie$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Autonomous-Claims-Orchestrator/node_modules/recharts/es6/polar/Pie.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Cell$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Autonomous-Claims-Orchestrator/node_modules/recharts/es6/component/Cell.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Legend$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Autonomous-Claims-Orchestrator/node_modules/recharts/es6/component/Legend.js [app-client] (ecmascript)");
'use client';
;
;
;
function DashboardPage({ claimData, onReset }) {
    // Handle null claimData
    if (!claimData || !claimData.decisionPack) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "max-w-7xl mx-auto text-center py-16",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$alert$2d$triangle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                    className: "w-12 h-12 text-[#9CA3AF] mx-auto mb-4"
                }, void 0, false, {
                    fileName: "[project]/Autonomous-Claims-Orchestrator/components/DashboardPage.tsx",
                    lineNumber: 24,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                    className: "text-2xl font-semibold text-[#111827] mb-2",
                    children: "No Claim Data Available"
                }, void 0, false, {
                    fileName: "[project]/Autonomous-Claims-Orchestrator/components/DashboardPage.tsx",
                    lineNumber: 25,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-[#6B7280] mb-8",
                    children: "Please process a claim first to view the dashboard."
                }, void 0, false, {
                    fileName: "[project]/Autonomous-Claims-Orchestrator/components/DashboardPage.tsx",
                    lineNumber: 26,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: onReset,
                    className: "btn-primary inline-flex items-center space-x-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__["RefreshCw"], {
                            className: "w-4 h-4"
                        }, void 0, false, {
                            fileName: "[project]/Autonomous-Claims-Orchestrator/components/DashboardPage.tsx",
                            lineNumber: 33,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            children: "Process New Claim"
                        }, void 0, false, {
                            fileName: "[project]/Autonomous-Claims-Orchestrator/components/DashboardPage.tsx",
                            lineNumber: 34,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Autonomous-Claims-Orchestrator/components/DashboardPage.tsx",
                    lineNumber: 29,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/Autonomous-Claims-Orchestrator/components/DashboardPage.tsx",
            lineNumber: 23,
            columnNumber: 7
        }, this);
    }
    const { decisionPack, processingTime = 2000, autoPopulatedFields = 8, totalFields = 10, ragHitRate = 1, overrideRate = 0.1 } = claimData;
    const { evidence = [], documents = [], policyGrounding = [], audit = [] } = decisionPack || {};
    // Simulate historical data for charts
    const historicalData = [
        {
            date: '12/10',
            handleTime: 45,
            autoPop: 78,
            override: 12
        },
        {
            date: '12/11',
            handleTime: 42,
            autoPop: 82,
            override: 8
        },
        {
            date: '12/12',
            handleTime: 38,
            autoPop: 85,
            override: 6
        },
        {
            date: '12/13',
            handleTime: 41,
            autoPop: 80,
            override: 10
        },
        {
            date: '12/14',
            handleTime: 35,
            autoPop: 88,
            override: 5
        },
        {
            date: '12/15',
            handleTime: processingTime / 1000,
            autoPop: autoPopulatedFields / totalFields * 100,
            override: overrideRate * 100
        }
    ];
    const confidenceData = [
        {
            name: 'High (≥80%)',
            value: evidence.filter((e)=>e.confidence >= 0.8).length,
            color: '#2563EB'
        },
        {
            name: 'Medium (60-79%)',
            value: evidence.filter((e)=>e.confidence >= 0.6 && e.confidence < 0.8).length,
            color: '#93C5FD'
        },
        {
            name: 'Low (<60%)',
            value: evidence.filter((e)=>e.confidence < 0.6).length,
            color: '#DBEAFE'
        }
    ];
    const documentTypeData = documents.map((doc)=>({
            name: doc.type,
            value: 1,
            color: '#2563EB'
        }));
    const averageHandleTime = historicalData.reduce((sum, item)=>sum + item.handleTime, 0) / historicalData.length;
    const averageAutoPop = historicalData.reduce((sum, item)=>sum + item.autoPop, 0) / historicalData.length;
    const averageOverride = historicalData.reduce((sum, item)=>sum + item.override, 0) / historicalData.length;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "max-w-7xl mx-auto",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-16",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "text-3xl font-semibold text-[#111827] mb-2",
                        children: "Operations Dashboard"
                    }, void 0, false, {
                        fileName: "[project]/Autonomous-Claims-Orchestrator/components/DashboardPage.tsx",
                        lineNumber: 85,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm text-[#6B7280]",
                        children: "Performance metrics and operational insights"
                    }, void 0, false, {
                        fileName: "[project]/Autonomous-Claims-Orchestrator/components/DashboardPage.tsx",
                        lineNumber: 88,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Autonomous-Claims-Orchestrator/components/DashboardPage.tsx",
                lineNumber: 84,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid md:grid-cols-4 gap-6 mb-16",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "card p-6 h-full",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-start justify-between mb-4",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"], {
                                    className: "w-5 h-5 text-[#9CA3AF] flex-shrink-0 mt-1"
                                }, void 0, false, {
                                    fileName: "[project]/Autonomous-Claims-Orchestrator/components/DashboardPage.tsx",
                                    lineNumber: 97,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/DashboardPage.tsx",
                                lineNumber: 96,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs font-medium text-[#6B7280] uppercase tracking-wider mb-2",
                                children: "Avg Handle Time"
                            }, void 0, false, {
                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/DashboardPage.tsx",
                                lineNumber: 99,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-3xl font-semibold text-[#111827] mb-3",
                                children: [
                                    averageHandleTime.toFixed(1),
                                    "s"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/DashboardPage.tsx",
                                lineNumber: 102,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs text-[#6B7280]",
                                children: "↓ 12% from last week"
                            }, void 0, false, {
                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/DashboardPage.tsx",
                                lineNumber: 105,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Autonomous-Claims-Orchestrator/components/DashboardPage.tsx",
                        lineNumber: 95,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "card p-6 h-full",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-start justify-between mb-4",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__["CheckCircle"], {
                                    className: "w-5 h-5 text-[#9CA3AF] flex-shrink-0 mt-1"
                                }, void 0, false, {
                                    fileName: "[project]/Autonomous-Claims-Orchestrator/components/DashboardPage.tsx",
                                    lineNumber: 112,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/DashboardPage.tsx",
                                lineNumber: 111,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs font-medium text-[#6B7280] uppercase tracking-wider mb-2",
                                children: "Auto-population"
                            }, void 0, false, {
                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/DashboardPage.tsx",
                                lineNumber: 114,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-3xl font-semibold text-[#111827] mb-3",
                                children: [
                                    averageAutoPop.toFixed(0),
                                    "%"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/DashboardPage.tsx",
                                lineNumber: 117,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs text-[#6B7280]",
                                children: "↑ 8% from last week"
                            }, void 0, false, {
                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/DashboardPage.tsx",
                                lineNumber: 120,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Autonomous-Claims-Orchestrator/components/DashboardPage.tsx",
                        lineNumber: 110,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "card p-6 h-full",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-start justify-between mb-4",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$alert$2d$triangle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                                    className: "w-5 h-5 text-[#9CA3AF] flex-shrink-0 mt-1"
                                }, void 0, false, {
                                    fileName: "[project]/Autonomous-Claims-Orchestrator/components/DashboardPage.tsx",
                                    lineNumber: 127,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/DashboardPage.tsx",
                                lineNumber: 126,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs font-medium text-[#6B7280] uppercase tracking-wider mb-2",
                                children: "Override Rate"
                            }, void 0, false, {
                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/DashboardPage.tsx",
                                lineNumber: 129,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-3xl font-semibold text-[#111827] mb-3",
                                children: [
                                    averageOverride.toFixed(1),
                                    "%"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/DashboardPage.tsx",
                                lineNumber: 132,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs text-[#6B7280]",
                                children: "↓ 3% from last week"
                            }, void 0, false, {
                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/DashboardPage.tsx",
                                lineNumber: 135,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Autonomous-Claims-Orchestrator/components/DashboardPage.tsx",
                        lineNumber: 125,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "card p-6 h-full",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-start justify-between mb-4",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingUp$3e$__["TrendingUp"], {
                                    className: "w-5 h-5 text-[#9CA3AF] flex-shrink-0 mt-1"
                                }, void 0, false, {
                                    fileName: "[project]/Autonomous-Claims-Orchestrator/components/DashboardPage.tsx",
                                    lineNumber: 142,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/DashboardPage.tsx",
                                lineNumber: 141,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs font-medium text-[#6B7280] uppercase tracking-wider mb-2",
                                children: "RAG Hit Rate"
                            }, void 0, false, {
                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/DashboardPage.tsx",
                                lineNumber: 144,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-3xl font-semibold text-[#111827] mb-3",
                                children: [
                                    (ragHitRate * 100).toFixed(0),
                                    "%"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/DashboardPage.tsx",
                                lineNumber: 147,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs text-[#6B7280]",
                                children: "↑ 15% from last week"
                            }, void 0, false, {
                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/DashboardPage.tsx",
                                lineNumber: 150,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Autonomous-Claims-Orchestrator/components/DashboardPage.tsx",
                        lineNumber: 140,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Autonomous-Claims-Orchestrator/components/DashboardPage.tsx",
                lineNumber: 94,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid lg:grid-cols-2 gap-6 mb-16",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "card p-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-sm font-semibold text-[#111827] mb-6",
                                children: "Handle Time Trend"
                            }, void 0, false, {
                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/DashboardPage.tsx",
                                lineNumber: 160,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$recharts$2f$es6$2f$component$2f$ResponsiveContainer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ResponsiveContainer"], {
                                width: "100%",
                                height: 280,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$recharts$2f$es6$2f$chart$2f$LineChart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LineChart"], {
                                    data: historicalData,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$CartesianGrid$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CartesianGrid"], {
                                            strokeDasharray: "3 3",
                                            stroke: "#F3F4F6"
                                        }, void 0, false, {
                                            fileName: "[project]/Autonomous-Claims-Orchestrator/components/DashboardPage.tsx",
                                            lineNumber: 163,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$XAxis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["XAxis"], {
                                            dataKey: "date",
                                            stroke: "#9CA3AF",
                                            tick: {
                                                fill: '#6B7280',
                                                fontSize: 12
                                            },
                                            axisLine: {
                                                stroke: '#E5E7EB'
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/Autonomous-Claims-Orchestrator/components/DashboardPage.tsx",
                                            lineNumber: 164,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$YAxis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["YAxis"], {
                                            stroke: "#9CA3AF",
                                            tick: {
                                                fill: '#6B7280',
                                                fontSize: 12
                                            },
                                            axisLine: {
                                                stroke: '#E5E7EB'
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/Autonomous-Claims-Orchestrator/components/DashboardPage.tsx",
                                            lineNumber: 170,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Tooltip$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Tooltip"], {
                                            contentStyle: {
                                                backgroundColor: '#FFFFFF',
                                                border: '1px solid #E5E7EB',
                                                borderRadius: '6px',
                                                fontSize: '12px'
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/Autonomous-Claims-Orchestrator/components/DashboardPage.tsx",
                                            lineNumber: 175,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$Line$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Line"], {
                                            type: "monotone",
                                            dataKey: "handleTime",
                                            stroke: "#2563EB",
                                            strokeWidth: 2,
                                            dot: {
                                                fill: '#2563EB',
                                                r: 3
                                            },
                                            activeDot: {
                                                r: 5
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/Autonomous-Claims-Orchestrator/components/DashboardPage.tsx",
                                            lineNumber: 183,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Autonomous-Claims-Orchestrator/components/DashboardPage.tsx",
                                    lineNumber: 162,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/DashboardPage.tsx",
                                lineNumber: 161,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Autonomous-Claims-Orchestrator/components/DashboardPage.tsx",
                        lineNumber: 159,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "card p-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-sm font-semibold text-[#111827] mb-6",
                                children: "Auto-population vs Override"
                            }, void 0, false, {
                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/DashboardPage.tsx",
                                lineNumber: 197,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$recharts$2f$es6$2f$component$2f$ResponsiveContainer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ResponsiveContainer"], {
                                width: "100%",
                                height: 280,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$recharts$2f$es6$2f$chart$2f$BarChart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BarChart"], {
                                    data: historicalData,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$CartesianGrid$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CartesianGrid"], {
                                            strokeDasharray: "3 3",
                                            stroke: "#F3F4F6"
                                        }, void 0, false, {
                                            fileName: "[project]/Autonomous-Claims-Orchestrator/components/DashboardPage.tsx",
                                            lineNumber: 200,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$XAxis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["XAxis"], {
                                            dataKey: "date",
                                            stroke: "#9CA3AF",
                                            tick: {
                                                fill: '#6B7280',
                                                fontSize: 12
                                            },
                                            axisLine: {
                                                stroke: '#E5E7EB'
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/Autonomous-Claims-Orchestrator/components/DashboardPage.tsx",
                                            lineNumber: 201,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$YAxis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["YAxis"], {
                                            stroke: "#9CA3AF",
                                            tick: {
                                                fill: '#6B7280',
                                                fontSize: 12
                                            },
                                            axisLine: {
                                                stroke: '#E5E7EB'
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/Autonomous-Claims-Orchestrator/components/DashboardPage.tsx",
                                            lineNumber: 207,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Tooltip$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Tooltip"], {
                                            contentStyle: {
                                                backgroundColor: '#FFFFFF',
                                                border: '1px solid #E5E7EB',
                                                borderRadius: '6px',
                                                fontSize: '12px'
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/Autonomous-Claims-Orchestrator/components/DashboardPage.tsx",
                                            lineNumber: 212,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Legend$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Legend"], {
                                            wrapperStyle: {
                                                fontSize: '12px',
                                                color: '#6B7280'
                                            },
                                            iconType: "square"
                                        }, void 0, false, {
                                            fileName: "[project]/Autonomous-Claims-Orchestrator/components/DashboardPage.tsx",
                                            lineNumber: 220,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$Bar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Bar"], {
                                            dataKey: "autoPop",
                                            fill: "#2563EB",
                                            name: "Auto-population",
                                            radius: [
                                                4,
                                                4,
                                                0,
                                                0
                                            ]
                                        }, void 0, false, {
                                            fileName: "[project]/Autonomous-Claims-Orchestrator/components/DashboardPage.tsx",
                                            lineNumber: 224,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$Bar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Bar"], {
                                            dataKey: "override",
                                            fill: "#DBEAFE",
                                            name: "Override",
                                            radius: [
                                                4,
                                                4,
                                                0,
                                                0
                                            ]
                                        }, void 0, false, {
                                            fileName: "[project]/Autonomous-Claims-Orchestrator/components/DashboardPage.tsx",
                                            lineNumber: 225,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Autonomous-Claims-Orchestrator/components/DashboardPage.tsx",
                                    lineNumber: 199,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/DashboardPage.tsx",
                                lineNumber: 198,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Autonomous-Claims-Orchestrator/components/DashboardPage.tsx",
                        lineNumber: 196,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Autonomous-Claims-Orchestrator/components/DashboardPage.tsx",
                lineNumber: 157,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid lg:grid-cols-3 gap-6 mb-16",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "card p-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-sm font-semibold text-[#111827] mb-6",
                                children: "Field Confidence Distribution"
                            }, void 0, false, {
                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/DashboardPage.tsx",
                                lineNumber: 235,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$recharts$2f$es6$2f$component$2f$ResponsiveContainer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ResponsiveContainer"], {
                                width: "100%",
                                height: 240,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$recharts$2f$es6$2f$chart$2f$PieChart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PieChart"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$recharts$2f$es6$2f$polar$2f$Pie$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Pie"], {
                                            data: confidenceData,
                                            cx: "50%",
                                            cy: "50%",
                                            labelLine: false,
                                            label: ({ name, percent })=>`${(percent * 100).toFixed(0)}%`,
                                            outerRadius: 70,
                                            fill: "#2563EB",
                                            dataKey: "value",
                                            children: confidenceData.map((entry, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Cell$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Cell"], {
                                                    fill: entry.color
                                                }, `cell-${index}`, false, {
                                                    fileName: "[project]/Autonomous-Claims-Orchestrator/components/DashboardPage.tsx",
                                                    lineNumber: 249,
                                                    columnNumber: 19
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/Autonomous-Claims-Orchestrator/components/DashboardPage.tsx",
                                            lineNumber: 238,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Tooltip$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Tooltip"], {
                                            contentStyle: {
                                                backgroundColor: '#FFFFFF',
                                                border: '1px solid #E5E7EB',
                                                borderRadius: '6px',
                                                fontSize: '12px'
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/Autonomous-Claims-Orchestrator/components/DashboardPage.tsx",
                                            lineNumber: 252,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Legend$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Legend"], {
                                            wrapperStyle: {
                                                fontSize: '12px',
                                                color: '#6B7280'
                                            },
                                            iconType: "circle"
                                        }, void 0, false, {
                                            fileName: "[project]/Autonomous-Claims-Orchestrator/components/DashboardPage.tsx",
                                            lineNumber: 260,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Autonomous-Claims-Orchestrator/components/DashboardPage.tsx",
                                    lineNumber: 237,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/DashboardPage.tsx",
                                lineNumber: 236,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Autonomous-Claims-Orchestrator/components/DashboardPage.tsx",
                        lineNumber: 234,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "card p-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-sm font-semibold text-[#111827] mb-6",
                                children: "Document Types Processed"
                            }, void 0, false, {
                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/DashboardPage.tsx",
                                lineNumber: 270,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$recharts$2f$es6$2f$component$2f$ResponsiveContainer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ResponsiveContainer"], {
                                width: "100%",
                                height: 240,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$recharts$2f$es6$2f$chart$2f$PieChart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PieChart"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$recharts$2f$es6$2f$polar$2f$Pie$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Pie"], {
                                            data: documentTypeData,
                                            cx: "50%",
                                            cy: "50%",
                                            labelLine: false,
                                            label: ({ name })=>name,
                                            outerRadius: 70,
                                            fill: "#2563EB",
                                            dataKey: "value",
                                            children: documentTypeData.map((entry, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Cell$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Cell"], {
                                                    fill: entry.color
                                                }, `cell-${index}`, false, {
                                                    fileName: "[project]/Autonomous-Claims-Orchestrator/components/DashboardPage.tsx",
                                                    lineNumber: 284,
                                                    columnNumber: 19
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/Autonomous-Claims-Orchestrator/components/DashboardPage.tsx",
                                            lineNumber: 273,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Tooltip$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Tooltip"], {
                                            contentStyle: {
                                                backgroundColor: '#FFFFFF',
                                                border: '1px solid #E5E7EB',
                                                borderRadius: '6px',
                                                fontSize: '12px'
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/Autonomous-Claims-Orchestrator/components/DashboardPage.tsx",
                                            lineNumber: 287,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Autonomous-Claims-Orchestrator/components/DashboardPage.tsx",
                                    lineNumber: 272,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/DashboardPage.tsx",
                                lineNumber: 271,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Autonomous-Claims-Orchestrator/components/DashboardPage.tsx",
                        lineNumber: 269,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "card p-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-sm font-semibold text-[#111827] mb-6",
                                children: "Current Claim Summary"
                            }, void 0, false, {
                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/DashboardPage.tsx",
                                lineNumber: 301,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex justify-between items-center py-2 border-b border-[#F3F4F6]",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-sm text-[#6B7280]",
                                                children: "Processing Time"
                                            }, void 0, false, {
                                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/DashboardPage.tsx",
                                                lineNumber: 304,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-sm font-semibold text-[#111827]",
                                                children: [
                                                    (processingTime / 1000).toFixed(1),
                                                    "s"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/DashboardPage.tsx",
                                                lineNumber: 305,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Autonomous-Claims-Orchestrator/components/DashboardPage.tsx",
                                        lineNumber: 303,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex justify-between items-center py-2 border-b border-[#F3F4F6]",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-sm text-[#6B7280]",
                                                children: "Fields Extracted"
                                            }, void 0, false, {
                                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/DashboardPage.tsx",
                                                lineNumber: 308,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-sm font-semibold text-[#111827]",
                                                children: totalFields
                                            }, void 0, false, {
                                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/DashboardPage.tsx",
                                                lineNumber: 309,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Autonomous-Claims-Orchestrator/components/DashboardPage.tsx",
                                        lineNumber: 307,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex justify-between items-center py-2 border-b border-[#F3F4F6]",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-sm text-[#6B7280]",
                                                children: "High Confidence"
                                            }, void 0, false, {
                                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/DashboardPage.tsx",
                                                lineNumber: 312,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-sm font-semibold text-[#111827]",
                                                children: autoPopulatedFields
                                            }, void 0, false, {
                                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/DashboardPage.tsx",
                                                lineNumber: 313,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Autonomous-Claims-Orchestrator/components/DashboardPage.tsx",
                                        lineNumber: 311,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex justify-between items-center py-2 border-b border-[#F3F4F6]",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-sm text-[#6B7280]",
                                                children: "Policy Matches"
                                            }, void 0, false, {
                                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/DashboardPage.tsx",
                                                lineNumber: 316,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-sm font-semibold text-[#111827]",
                                                children: policyGrounding.length
                                            }, void 0, false, {
                                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/DashboardPage.tsx",
                                                lineNumber: 317,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Autonomous-Claims-Orchestrator/components/DashboardPage.tsx",
                                        lineNumber: 315,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex justify-between items-center py-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-sm text-[#6B7280]",
                                                children: "Documents"
                                            }, void 0, false, {
                                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/DashboardPage.tsx",
                                                lineNumber: 320,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-sm font-semibold text-[#111827]",
                                                children: documents.length
                                            }, void 0, false, {
                                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/DashboardPage.tsx",
                                                lineNumber: 321,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Autonomous-Claims-Orchestrator/components/DashboardPage.tsx",
                                        lineNumber: 319,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/DashboardPage.tsx",
                                lineNumber: 302,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Autonomous-Claims-Orchestrator/components/DashboardPage.tsx",
                        lineNumber: 300,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Autonomous-Claims-Orchestrator/components/DashboardPage.tsx",
                lineNumber: 232,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "card p-8 mb-12",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "text-sm font-semibold text-[#111827] mb-8",
                        children: "Governance & Compliance"
                    }, void 0, false, {
                        fileName: "[project]/Autonomous-Claims-Orchestrator/components/DashboardPage.tsx",
                        lineNumber: 329,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid md:grid-cols-2 gap-12",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                        className: "text-xs font-medium text-[#6B7280] uppercase tracking-wider mb-4",
                                        children: "Human-in-the-Loop Policy"
                                    }, void 0, false, {
                                        fileName: "[project]/Autonomous-Claims-Orchestrator/components/DashboardPage.tsx",
                                        lineNumber: 335,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                        className: "text-sm text-[#374151] space-y-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                className: "flex items-start",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-[#9CA3AF] mr-2",
                                                        children: "•"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Autonomous-Claims-Orchestrator/components/DashboardPage.tsx",
                                                        lineNumber: 340,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: "No automatic claim denials"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Autonomous-Claims-Orchestrator/components/DashboardPage.tsx",
                                                        lineNumber: 341,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/DashboardPage.tsx",
                                                lineNumber: 339,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                className: "flex items-start",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-[#9CA3AF] mr-2",
                                                        children: "•"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Autonomous-Claims-Orchestrator/components/DashboardPage.tsx",
                                                        lineNumber: 344,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: "Fields below 70% confidence require review"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Autonomous-Claims-Orchestrator/components/DashboardPage.tsx",
                                                        lineNumber: 345,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/DashboardPage.tsx",
                                                lineNumber: 343,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                className: "flex items-start",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-[#9CA3AF] mr-2",
                                                        children: "•"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Autonomous-Claims-Orchestrator/components/DashboardPage.tsx",
                                                        lineNumber: 348,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: "Policy clause matches require verification"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Autonomous-Claims-Orchestrator/components/DashboardPage.tsx",
                                                        lineNumber: 349,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/DashboardPage.tsx",
                                                lineNumber: 347,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                className: "flex items-start",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-[#9CA3AF] mr-2",
                                                        children: "•"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Autonomous-Claims-Orchestrator/components/DashboardPage.tsx",
                                                        lineNumber: 352,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: "All decisions logged with audit trail"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Autonomous-Claims-Orchestrator/components/DashboardPage.tsx",
                                                        lineNumber: 353,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/DashboardPage.tsx",
                                                lineNumber: 351,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Autonomous-Claims-Orchestrator/components/DashboardPage.tsx",
                                        lineNumber: 338,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/DashboardPage.tsx",
                                lineNumber: 334,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                        className: "text-xs font-medium text-[#6B7280] uppercase tracking-wider mb-4",
                                        children: "Explainability Standards"
                                    }, void 0, false, {
                                        fileName: "[project]/Autonomous-Claims-Orchestrator/components/DashboardPage.tsx",
                                        lineNumber: 359,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                        className: "text-sm text-[#374151] space-y-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                className: "flex items-start",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-[#9CA3AF] mr-2",
                                                        children: "•"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Autonomous-Claims-Orchestrator/components/DashboardPage.tsx",
                                                        lineNumber: 364,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: "Every extracted field has evidence source"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Autonomous-Claims-Orchestrator/components/DashboardPage.tsx",
                                                        lineNumber: 365,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/DashboardPage.tsx",
                                                lineNumber: 363,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                className: "flex items-start",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-[#9CA3AF] mr-2",
                                                        children: "•"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Autonomous-Claims-Orchestrator/components/DashboardPage.tsx",
                                                        lineNumber: 368,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: "Policy clauses include similarity scores"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Autonomous-Claims-Orchestrator/components/DashboardPage.tsx",
                                                        lineNumber: 369,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/DashboardPage.tsx",
                                                lineNumber: 367,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                className: "flex items-start",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-[#9CA3AF] mr-2",
                                                        children: "•"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Autonomous-Claims-Orchestrator/components/DashboardPage.tsx",
                                                        lineNumber: 372,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: "Clear rationale for each decision"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Autonomous-Claims-Orchestrator/components/DashboardPage.tsx",
                                                        lineNumber: 373,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/DashboardPage.tsx",
                                                lineNumber: 371,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                className: "flex items-start",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-[#9CA3AF] mr-2",
                                                        children: "•"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Autonomous-Claims-Orchestrator/components/DashboardPage.tsx",
                                                        lineNumber: 376,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: "Complete audit trail maintained"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Autonomous-Claims-Orchestrator/components/DashboardPage.tsx",
                                                        lineNumber: 377,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/DashboardPage.tsx",
                                                lineNumber: 375,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Autonomous-Claims-Orchestrator/components/DashboardPage.tsx",
                                        lineNumber: 362,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/DashboardPage.tsx",
                                lineNumber: 358,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Autonomous-Claims-Orchestrator/components/DashboardPage.tsx",
                        lineNumber: 333,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-8 pt-6 border-t border-[#E5E7EB]",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                className: "text-xs font-medium text-[#6B7280] uppercase tracking-wider mb-2",
                                children: "Retraining & Improvement Loop"
                            }, void 0, false, {
                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/DashboardPage.tsx",
                                lineNumber: 384,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm text-[#374151] leading-relaxed",
                                children: "The system continuously learns from human overrides and feedback. When confidence thresholds are consistently exceeded or underperformed, the AI models are retrained with new data to improve accuracy and reduce manual intervention."
                            }, void 0, false, {
                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/DashboardPage.tsx",
                                lineNumber: 387,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Autonomous-Claims-Orchestrator/components/DashboardPage.tsx",
                        lineNumber: 383,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Autonomous-Claims-Orchestrator/components/DashboardPage.tsx",
                lineNumber: 328,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex justify-between items-center pt-6 border-t border-[#E5E7EB]",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: onReset,
                        className: "btn-secondary inline-flex items-center space-x-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__["RefreshCw"], {
                                className: "w-4 h-4"
                            }, void 0, false, {
                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/DashboardPage.tsx",
                                lineNumber: 400,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "Process New Claim"
                            }, void 0, false, {
                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/DashboardPage.tsx",
                                lineNumber: 401,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Autonomous-Claims-Orchestrator/components/DashboardPage.tsx",
                        lineNumber: 396,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "btn-secondary inline-flex items-center space-x-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__["Download"], {
                                className: "w-4 h-4"
                            }, void 0, false, {
                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/DashboardPage.tsx",
                                lineNumber: 405,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "Export Report"
                            }, void 0, false, {
                                fileName: "[project]/Autonomous-Claims-Orchestrator/components/DashboardPage.tsx",
                                lineNumber: 406,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Autonomous-Claims-Orchestrator/components/DashboardPage.tsx",
                        lineNumber: 404,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Autonomous-Claims-Orchestrator/components/DashboardPage.tsx",
                lineNumber: 395,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Autonomous-Claims-Orchestrator/components/DashboardPage.tsx",
        lineNumber: 82,
        columnNumber: 5
    }, this);
}
_c = DashboardPage;
var _c;
__turbopack_context__.k.register(_c, "DashboardPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Autonomous-Claims-Orchestrator/app/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Home
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Autonomous-Claims-Orchestrator/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Autonomous-Claims-Orchestrator/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Autonomous-Claims-Orchestrator/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$components$2f$Header$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Autonomous-Claims-Orchestrator/components/Header.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$components$2f$HomePage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Autonomous-Claims-Orchestrator/components/HomePage.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$components$2f$ReviewPage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Autonomous-Claims-Orchestrator/components/ReviewPage.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$components$2f$DecisionPage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Autonomous-Claims-Orchestrator/components/DecisionPage.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$components$2f$DashboardPage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Autonomous-Claims-Orchestrator/components/DashboardPage.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$lib$2f$auth$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Autonomous-Claims-Orchestrator/lib/auth/AuthContext.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
;
;
function Home() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const { isAuthenticated, loading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$lib$2f$auth$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    const [currentStage, setCurrentStage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('home');
    const [claimData, setClaimData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isProcessing, setIsProcessing] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Redirect to login if not authenticated
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Home.useEffect": ()=>{
            if (!loading && !isAuthenticated) {
                router.push('/login');
            }
        }
    }["Home.useEffect"], [
        isAuthenticated,
        loading,
        router
    ]);
    // Show loading state while checking authentication
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen bg-white flex items-center justify-center",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-12 h-12 border-4 border-[#2563EB] border-t-transparent rounded-full animate-spin mx-auto mb-4"
                    }, void 0, false, {
                        fileName: "[project]/Autonomous-Claims-Orchestrator/app/page.tsx",
                        lineNumber: 32,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-[#64748B]",
                        children: "Loading..."
                    }, void 0, false, {
                        fileName: "[project]/Autonomous-Claims-Orchestrator/app/page.tsx",
                        lineNumber: 33,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Autonomous-Claims-Orchestrator/app/page.tsx",
                lineNumber: 31,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/Autonomous-Claims-Orchestrator/app/page.tsx",
            lineNumber: 30,
            columnNumber: 7
        }, this);
    }
    // Don't render main app if not authenticated
    if (!isAuthenticated) {
        return null;
    }
    const handleStageChange = (stage)=>{
        // Prevent navigation to stages that require claimData if it's not available
        if ((stage === 'review' || stage === 'decision' || stage === 'dashboard') && !claimData) {
            // Stay on current stage or go to home
            return;
        }
        setCurrentStage(stage);
    };
    const handleClaimProcessed = (data)=>{
        setClaimData(data);
        setCurrentStage('review');
    };
    const renderCurrentStage = ()=>{
        switch(currentStage){
            case 'home':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$components$2f$HomePage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    onProcessClaim: handleClaimProcessed,
                    isProcessing: isProcessing,
                    setIsProcessing: setIsProcessing
                }, void 0, false, {
                    fileName: "[project]/Autonomous-Claims-Orchestrator/app/page.tsx",
                    lineNumber: 62,
                    columnNumber: 11
                }, this);
            case 'review':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$components$2f$ReviewPage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    claimData: claimData,
                    onNextStage: ()=>setCurrentStage('decision'),
                    onPreviousStage: ()=>setCurrentStage('home')
                }, void 0, false, {
                    fileName: "[project]/Autonomous-Claims-Orchestrator/app/page.tsx",
                    lineNumber: 70,
                    columnNumber: 11
                }, this);
            case 'decision':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$components$2f$DecisionPage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    claimData: claimData,
                    onNextStage: ()=>setCurrentStage('dashboard'),
                    onPreviousStage: ()=>setCurrentStage('review')
                }, void 0, false, {
                    fileName: "[project]/Autonomous-Claims-Orchestrator/app/page.tsx",
                    lineNumber: 78,
                    columnNumber: 11
                }, this);
            case 'dashboard':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$components$2f$DashboardPage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    claimData: claimData,
                    onReset: ()=>{
                        setCurrentStage('home');
                        setClaimData(null);
                    }
                }, void 0, false, {
                    fileName: "[project]/Autonomous-Claims-Orchestrator/app/page.tsx",
                    lineNumber: 86,
                    columnNumber: 11
                }, this);
            default:
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$components$2f$HomePage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    onProcessClaim: handleClaimProcessed,
                    isProcessing: isProcessing,
                    setIsProcessing: setIsProcessing
                }, void 0, false, {
                    fileName: "[project]/Autonomous-Claims-Orchestrator/app/page.tsx",
                    lineNumber: 95,
                    columnNumber: 16
                }, this);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-white relative",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$components$2f$Header$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                currentStage: currentStage,
                onStageChange: handleStageChange
            }, void 0, false, {
                fileName: "[project]/Autonomous-Claims-Orchestrator/app/page.tsx",
                lineNumber: 101,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                className: "container mx-auto px-8 py-16 relative z-10",
                children: renderCurrentStage()
            }, void 0, false, {
                fileName: "[project]/Autonomous-Claims-Orchestrator/app/page.tsx",
                lineNumber: 102,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Autonomous-Claims-Orchestrator/app/page.tsx",
        lineNumber: 100,
        columnNumber: 5
    }, this);
}
_s(Home, "uJeZp/99Gn2mDB2IyMOFpFURHhc=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$Autonomous$2d$Claims$2d$Orchestrator$2f$lib$2f$auth$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"]
    ];
});
_c = Home;
var _c;
__turbopack_context__.k.register(_c, "Home");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=Autonomous-Claims-Orchestrator_002911bf._.js.map