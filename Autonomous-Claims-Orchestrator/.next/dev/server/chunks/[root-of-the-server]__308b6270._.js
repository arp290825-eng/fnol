module.exports = [
"[externals]/pino [external] (pino, cjs, [project]/Autonomous-Claims-Orchestrator/node_modules/pino)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("pino-458e23959dc14141", () => require("pino-458e23959dc14141"));

module.exports = mod;
}),
"[project]/Autonomous-Claims-Orchestrator/node_modules/safer-buffer/safer.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/* eslint-disable node/no-deprecated-api */ var buffer = __turbopack_context__.r("[externals]/buffer [external] (buffer, cjs)");
var Buffer = buffer.Buffer;
var safer = {};
var key;
for(key in buffer){
    if (!buffer.hasOwnProperty(key)) continue;
    if (key === 'SlowBuffer' || key === 'Buffer') continue;
    safer[key] = buffer[key];
}
var Safer = safer.Buffer = {};
for(key in Buffer){
    if (!Buffer.hasOwnProperty(key)) continue;
    if (key === 'allocUnsafe' || key === 'allocUnsafeSlow') continue;
    Safer[key] = Buffer[key];
}
safer.Buffer.prototype = Buffer.prototype;
if (!Safer.from || Safer.from === Uint8Array.from) {
    Safer.from = function(value, encodingOrOffset, length) {
        if (typeof value === 'number') {
            throw new TypeError('The "value" argument must not be of type number. Received type ' + typeof value);
        }
        if (value && typeof value.length === 'undefined') {
            throw new TypeError('The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type ' + typeof value);
        }
        return Buffer(value, encodingOrOffset, length);
    };
}
if (!Safer.alloc) {
    Safer.alloc = function(size, fill, encoding) {
        if (typeof size !== 'number') {
            throw new TypeError('The "size" argument must be of type number. Received type ' + typeof size);
        }
        if (size < 0 || size >= 2 * (1 << 30)) {
            throw new RangeError('The value "' + size + '" is invalid for option "size"');
        }
        var buf = Buffer(size);
        if (!fill || fill.length === 0) {
            buf.fill(0);
        } else if (typeof encoding === 'string') {
            buf.fill(fill, encoding);
        } else {
            buf.fill(fill);
        }
        return buf;
    };
}
if (!safer.kStringMaxLength) {
    try {
        safer.kStringMaxLength = process.binding('buffer').kStringMaxLength;
    } catch (e) {
    // we can't determine kStringMaxLength in environments where process.binding
    // is unsupported, so let's not set it
    }
}
if (!safer.constants) {
    safer.constants = {
        MAX_LENGTH: safer.kMaxLength
    };
    if (safer.kStringMaxLength) {
        safer.constants.MAX_STRING_LENGTH = safer.kStringMaxLength;
    }
}
module.exports = safer;
}),
"[project]/Autonomous-Claims-Orchestrator/node_modules/libbase64/lib/libbase64.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const { Buffer } = __turbopack_context__.r("[externals]/node:buffer [external] (node:buffer, cjs)");
const stream = __turbopack_context__.r("[externals]/node:stream [external] (node:stream, cjs)");
const Transform = stream.Transform;
/**
 * Encodes a Buffer into a base64 encoded string
 *
 * @param {Buffer} buffer Buffer to convert
 * @returns {String} base64 encoded string
 */ function encode(buffer) {
    if (typeof buffer === 'string') {
        buffer = Buffer.from(buffer, 'utf-8');
    }
    return buffer.toString('base64');
}
/**
 * Decodes a base64 encoded string to a Buffer object
 *
 * @param {String} str base64 encoded string
 * @returns {Buffer} Decoded value
 */ function decode(str) {
    str = str || '';
    return Buffer.from(str, 'base64');
}
/**
 * Adds soft line breaks to a base64 string
 *
 * @param {String} str base64 encoded string that might need line wrapping
 * @param {Number} [lineLength=76] Maximum allowed length for a line
 * @returns {String} Soft-wrapped base64 encoded string
 */ function wrap(str, lineLength) {
    str = (str || '').toString();
    lineLength = lineLength || 76;
    if (str.length <= lineLength) {
        return str;
    }
    let result = [];
    let pos = 0;
    let chunkLength = lineLength * 1024;
    while(pos < str.length){
        let wrappedLines = str.substr(pos, chunkLength).replace(new RegExp('.{' + lineLength + '}', 'g'), '$&\r\n').trim();
        result.push(wrappedLines);
        pos += chunkLength;
    }
    return result.join('\r\n').trim();
}
/**
 * Creates a transform stream for encoding data to base64 encoding
 *
 * @constructor
 * @param {Object} options Stream options
 * @param {Number} [options.lineLength=76] Maximum lenght for lines, set to false to disable wrapping
 */ class Encoder extends Transform {
    constructor(options){
        super();
        // init Transform
        this.options = options || {};
        if (this.options.lineLength !== false) {
            this.options.lineLength = Number(this.options.lineLength) || 76;
        }
        this.skipStartBytes = Number(this.options.skipStartBytes) || 0;
        this.limitOutbutBytes = Number(this.options.limitOutbutBytes) || 0;
        // startPadding can be used together with skipStartBytes
        this._curLine = this.options.startPadding || '';
        this._remainingBytes = false;
        this.inputBytes = 0;
        this.outputBytes = 0;
    }
    _writeChunk(chunk /*, isFinal */ ) {
        if (this.skipStartBytes) {
            if (chunk.length <= this.skipStartBytes) {
                this.skipStartBytes -= chunk.length;
                return;
            }
            chunk = chunk.slice(this.skipStartBytes);
            this.skipStartBytes = 0;
        }
        if (this.limitOutbutBytes) {
            if (this.outputBytes + chunk.length <= this.limitOutbutBytes) {
            // ignore, can use entire chunk
            } else if (this.outputBytes >= this.limitOutbutBytes) {
                // chunks already processed
                return;
            } else {
                // use partial chunk
                chunk = chunk.slice(0, this.limitOutbutBytes - this.outputBytes);
            }
        }
        this.outputBytes += chunk.length;
        this.push(chunk);
    }
    _getWrapped(str, isFinal) {
        str = wrap(str, this.options.lineLength);
        if (!isFinal && str.length === this.options.lineLength) {
            str += '\r\n';
        }
        return str;
    }
    _transform(chunk, encoding, done) {
        if (encoding !== 'buffer') {
            chunk = Buffer.from(chunk, encoding);
        }
        if (!chunk || !chunk.length) {
            return setImmediate(done);
        }
        this.inputBytes += chunk.length;
        if (this._remainingBytes && this._remainingBytes.length) {
            chunk = Buffer.concat([
                this._remainingBytes,
                chunk
            ], this._remainingBytes.length + chunk.length);
            this._remainingBytes = false;
        }
        if (chunk.length % 3) {
            this._remainingBytes = chunk.slice(chunk.length - chunk.length % 3);
            chunk = chunk.slice(0, chunk.length - chunk.length % 3);
        } else {
            this._remainingBytes = false;
        }
        let b64 = this._curLine + encode(chunk);
        if (this.options.lineLength) {
            b64 = this._getWrapped(b64);
            // remove last line as it is still most probably incomplete
            let lastLF = b64.lastIndexOf('\n');
            if (lastLF < 0) {
                this._curLine = b64;
                b64 = '';
            } else if (lastLF === b64.length - 1) {
                this._curLine = '';
            } else {
                this._curLine = b64.substr(lastLF + 1);
                b64 = b64.substr(0, lastLF + 1);
            }
        }
        if (b64) {
            this._writeChunk(Buffer.from(b64, 'ascii'), false);
        }
        setImmediate(done);
    }
    _flush(done) {
        if (this._remainingBytes && this._remainingBytes.length) {
            this._curLine += encode(this._remainingBytes);
        }
        if (this._curLine) {
            this._curLine = this._getWrapped(this._curLine, true);
            this._writeChunk(Buffer.from(this._curLine, 'ascii'), true);
            this._curLine = '';
        }
        done();
    }
}
/**
 * Creates a transform stream for decoding base64 encoded strings
 *
 * @constructor
 * @param {Object} options Stream options
 */ class Decoder extends Transform {
    constructor(options){
        super();
        // init Transform
        this.options = options || {};
        this._curLine = '';
        this.inputBytes = 0;
        this.outputBytes = 0;
    }
    _transform(chunk, encoding, done) {
        if (!chunk || !chunk.length) {
            return setImmediate(done);
        }
        this.inputBytes += chunk.length;
        let b64 = this._curLine + chunk.toString('ascii');
        this._curLine = '';
        if (/[^a-zA-Z0-9+/=]/.test(b64)) {
            b64 = b64.replace(/[^a-zA-Z0-9+/=]/g, '');
        }
        if (b64.length < 4) {
            this._curLine = b64;
            b64 = '';
        } else if (b64.length % 4) {
            this._curLine = b64.substr(-b64.length % 4);
            b64 = b64.substr(0, b64.length - this._curLine.length);
        }
        if (b64) {
            let buf = decode(b64);
            this.outputBytes += buf.length;
            this.push(buf);
        }
        setImmediate(done);
    }
    _flush(done) {
        if (this._curLine) {
            let buf = decode(this._curLine);
            this.outputBytes += buf.length;
            this.push(buf);
            this._curLine = '';
        }
        setImmediate(done);
    }
}
// expose to the world
module.exports = {
    encode,
    decode,
    wrap,
    Encoder,
    Decoder
};
}),
"[project]/Autonomous-Claims-Orchestrator/node_modules/libqp/lib/libqp.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/* eslint no-useless-escape: 0 */ const { Buffer } = __turbopack_context__.r("[externals]/node:buffer [external] (node:buffer, cjs)");
const stream = __turbopack_context__.r("[externals]/node:stream [external] (node:stream, cjs)");
const Transform = stream.Transform;
/**
 * Encodes a Buffer into a Quoted-Printable encoded string
 *
 * @param {Buffer} buffer Buffer to convert
 * @returns {String} Quoted-Printable encoded string
 */ function encode(buffer) {
    if (typeof buffer === 'string') {
        buffer = Buffer.from(buffer, 'utf-8');
    }
    // usable characters that do not need encoding
    let ranges = [
        // https://tools.ietf.org/html/rfc2045#section-6.7
        [
            0x09
        ],
        [
            0x0a
        ],
        [
            0x0d
        ],
        [
            0x20,
            0x3c
        ],
        [
            0x3e,
            0x7e
        ] // >?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\]^_`abcdefghijklmnopqrstuvwxyz{|}
    ];
    let result = '';
    let ord;
    for(let i = 0, len = buffer.length; i < len; i++){
        ord = buffer[i];
        // if the char is in allowed range, then keep as is, unless it is a ws in the end of a line
        if (checkRanges(ord, ranges) && !((ord === 0x20 || ord === 0x09) && (i === len - 1 || buffer[i + 1] === 0x0a || buffer[i + 1] === 0x0d))) {
            result += String.fromCharCode(ord);
            continue;
        }
        result += '=' + (ord < 0x10 ? '0' : '') + ord.toString(16).toUpperCase();
    }
    return result;
}
/**
 * Decodes a Quoted-Printable encoded string to a Buffer object
 *
 * @param {String} str Quoted-Printable encoded string
 * @returns {Buffer} Decoded value
 */ function decode(str) {
    str = (str || '').toString()// remove invalid whitespace from the end of lines
    .replace(/[\t ]+$/gm, '')// remove soft line breaks
    .replace(/\=(?:\r?\n|$)/g, '');
    let encodedBytesCount = (str.match(/\=[\da-fA-F]{2}/g) || []).length, bufferLength = str.length - encodedBytesCount * 2, chr, hex, buffer = Buffer.alloc(bufferLength), bufferPos = 0;
    for(let i = 0, len = str.length; i < len; i++){
        chr = str.charAt(i);
        if (chr === '=' && (hex = str.substr(i + 1, 2)) && /[\da-fA-F]{2}/.test(hex)) {
            buffer[bufferPos++] = parseInt(hex, 16);
            i += 2;
            continue;
        }
        buffer[bufferPos++] = chr.charCodeAt(0);
    }
    return buffer;
}
/**
 * Adds soft line breaks to a Quoted-Printable string
 *
 * @param {String} str Quoted-Printable encoded string that might need line wrapping
 * @param {Number} [lineLength=76] Maximum allowed length for a line
 * @returns {String} Soft-wrapped Quoted-Printable encoded string
 */ function wrap(str, lineLength) {
    str = (str || '').toString();
    lineLength = lineLength || 76;
    if (str.length <= lineLength) {
        return str;
    }
    let pos = 0, len = str.length, match, code, line, lineMargin = Math.floor(lineLength / 3), result = '';
    // insert soft linebreaks where needed
    while(pos < len){
        line = str.substr(pos, lineLength);
        if (match = line.match(/\r\n/)) {
            line = line.substr(0, match.index + match[0].length);
            result += line;
            pos += line.length;
            continue;
        }
        if (line.substr(-1) === '\n') {
            // nothing to change here
            result += line;
            pos += line.length;
            continue;
        } else if (match = line.substr(-lineMargin).match(/\n.*?$/)) {
            // truncate to nearest line break
            line = line.substr(0, line.length - (match[0].length - 1));
            result += line;
            pos += line.length;
            continue;
        } else if (line.length > lineLength - lineMargin && (match = line.substr(-lineMargin).match(/[ \t\.,!\?][^ \t\.,!\?]*$/))) {
            // truncate to nearest space
            line = line.substr(0, line.length - (match[0].length - 1));
        } else if (line.match(/\=[\da-f]{0,2}$/i)) {
            // push incomplete encoding sequences to the next line
            if (match = line.match(/\=[\da-f]{0,1}$/i)) {
                line = line.substr(0, line.length - match[0].length);
            }
            // ensure that utf-8 sequences are not split
            while(line.length > 3 && line.length < len - pos && !line.match(/^(?:=[\da-f]{2}){1,4}$/i) && (match = line.match(/\=[\da-f]{2}$/gi))){
                code = parseInt(match[0].substr(1, 2), 16);
                if (code < 128) {
                    break;
                }
                line = line.substr(0, line.length - 3);
                if (code >= 0xc0) {
                    break;
                }
            }
        }
        if (pos + line.length < len && line.substr(-1) !== '\n') {
            if (line.length === lineLength && line.match(/\=[\da-f]{2}$/i)) {
                line = line.substr(0, line.length - 3);
            } else if (line.length === lineLength) {
                line = line.substr(0, line.length - 1);
            }
            pos += line.length;
            line += '=\r\n';
        } else {
            pos += line.length;
        }
        result += line;
    }
    return result;
}
/**
 * Helper function to check if a number is inside provided ranges
 *
 * @param {Number} nr Number to check for
 * @param {Array} ranges An Array of allowed values
 * @returns {Boolean} True if the value was found inside allowed ranges, false otherwise
 */ function checkRanges(nr, ranges) {
    for(let i = ranges.length - 1; i >= 0; i--){
        if (!ranges[i].length) {
            continue;
        }
        if (ranges[i].length === 1 && nr === ranges[i][0]) {
            return true;
        }
        if (ranges[i].length === 2 && nr >= ranges[i][0] && nr <= ranges[i][1]) {
            return true;
        }
    }
    return false;
}
/**
 * Creates a transform stream for encoding data to Quoted-Printable encoding
 *
 * @constructor
 * @param {Object} options Stream options
 * @param {Number} [options.lineLength=76] Maximum lenght for lines, set to false to disable wrapping
 */ class Encoder extends Transform {
    constructor(options){
        super();
        // init Transform
        this.options = options || {};
        if (this.options.lineLength !== false) {
            this.options.lineLength = this.options.lineLength || 76;
        }
        this._curLine = '';
        this.inputBytes = 0;
        this.outputBytes = 0;
        Transform.call(this, this.options);
    }
    _transform(chunk, encoding, done) {
        let qp;
        if (encoding !== 'buffer') {
            chunk = Buffer.from(chunk, encoding);
        }
        if (!chunk || !chunk.length) {
            return done();
        }
        this.inputBytes += chunk.length;
        if (this.options.lineLength) {
            qp = this._curLine + encode(chunk);
            qp = wrap(qp, this.options.lineLength);
            qp = qp.replace(/(^|\n)([^\n]*)$/, (match, lineBreak, lastLine)=>{
                this._curLine = lastLine;
                return lineBreak;
            });
            if (qp) {
                this.outputBytes += qp.length;
                this.push(qp);
            }
        } else {
            qp = encode(chunk);
            this.outputBytes += qp.length;
            this.push(qp, 'ascii');
        }
        done();
    }
    _flush(done) {
        if (this._curLine) {
            this.outputBytes += this._curLine.length;
            this.push(this._curLine, 'ascii');
        }
        done();
    }
}
/**
 * Creates a transform stream for decoding Quoted-Printable encoded strings
 * The input is not actually processed as a stream but concatted and processed as a single input
 *
 * @constructor
 * @param {Object} options Stream options
 */ class Decoder extends Transform {
    constructor(options){
        options = options || {};
        super(options);
        // init Transform
        this.options = options;
        this._curLine = '';
        this.inputBytes = 0;
        this.outputBytes = 0;
        this.qpChunks = [];
    }
    _transform(chunk, encoding, done) {
        if (!chunk || !chunk.length) {
            return done();
        }
        if (typeof chunk === 'string') {
            chunk = Buffer.from(chunk, encoding);
        }
        this.qpChunks.push(chunk);
        this.inputBytes += chunk.length;
        done();
    }
    _flush(done) {
        if (this.inputBytes) {
            let buf = decode(Buffer.concat(this.qpChunks, this.inputBytes).toString());
            this.outputBytes += buf.length;
            this.push(buf);
        }
        done();
    }
}
// expose to the world
module.exports = {
    encode,
    decode,
    wrap,
    Encoder,
    Decoder
};
}),
"[project]/Autonomous-Claims-Orchestrator/node_modules/@zone-eu/mailsplit/lib/headers.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const libmime = __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/libmime/lib/libmime.js [app-route] (ecmascript)");
/**
 * Class Headers to parse and handle message headers. Headers instance allows to
 * check existing, delete or add new headers
 */ class Headers {
    constructor(headers, config){
        config = config || {};
        if (Array.isArray(headers)) {
            // already using parsed headers
            this.changed = true;
            this.headers = false;
            this.parsed = true;
            this.lines = headers;
        } else {
            // using original string/buffer headers
            this.changed = false;
            this.headers = headers;
            this.parsed = false;
            this.lines = false;
        }
        this.mbox = false;
        this.http = false;
        this.libmime = new libmime.Libmime({
            Iconv: config.Iconv
        });
    }
    hasHeader(key) {
        if (!this.parsed) {
            this._parseHeaders();
        }
        key = this._normalizeHeader(key);
        return typeof this.lines.find((line)=>line.key === key) === 'object';
    }
    get(key) {
        if (!this.parsed) {
            this._parseHeaders();
        }
        key = this._normalizeHeader(key);
        let lines = this.lines.filter((line)=>line.key === key).map((line)=>line.line);
        return lines;
    }
    getDecoded(key) {
        return this.get(key).map((line)=>this.libmime.decodeHeader(line)).filter((line)=>line && line.value);
    }
    getFirst(key) {
        if (!this.parsed) {
            this._parseHeaders();
        }
        key = this._normalizeHeader(key);
        let header = this.lines.find((line)=>line.key === key);
        if (!header) {
            return '';
        }
        return ((this.libmime.decodeHeader(header.line) || {}).value || '').toString().trim();
    }
    getList() {
        if (!this.parsed) {
            this._parseHeaders();
        }
        return this.lines;
    }
    add(key, value, index) {
        if (typeof value === 'undefined') {
            return;
        }
        if (typeof value === 'number') {
            value = value.toString();
        }
        if (typeof value === 'string') {
            value = Buffer.from(value);
        }
        value = value.toString('binary');
        this.addFormatted(key, this.libmime.foldLines(key + ': ' + value.replace(/\r?\n/g, ''), 76, false), index);
    }
    addFormatted(key, line, index) {
        if (!this.parsed) {
            this._parseHeaders();
        }
        index = index || 0;
        this.changed = true;
        if (!line) {
            return;
        }
        if (typeof line !== 'string') {
            line = line.toString('binary');
        }
        let header = {
            key: this._normalizeHeader(key),
            line
        };
        if (index < 1) {
            this.lines.unshift(header);
        } else if (index >= this.lines.length) {
            this.lines.push(header);
        } else {
            this.lines.splice(index, 0, header);
        }
    }
    remove(key) {
        if (!this.parsed) {
            this._parseHeaders();
        }
        key = this._normalizeHeader(key);
        for(let i = this.lines.length - 1; i >= 0; i--){
            if (this.lines[i].key === key) {
                this.changed = true;
                this.lines.splice(i, 1);
            }
        }
    }
    update(key, value, relativeIndex) {
        if (!this.parsed) {
            this._parseHeaders();
        }
        let keyName = key;
        let index = 0;
        key = this._normalizeHeader(key);
        let relativeIndexCount = 0;
        let relativeMatchFound = false;
        for(let i = this.lines.length - 1; i >= 0; i--){
            if (this.lines[i].key === key) {
                if (relativeIndex && relativeIndex !== relativeIndexCount) {
                    relativeIndexCount++;
                    continue;
                }
                index = i;
                this.changed = true;
                this.lines.splice(i, 1);
                if (relativeIndex) {
                    relativeMatchFound = true;
                    break;
                }
            }
        }
        if (relativeIndex && !relativeMatchFound) {
            return;
        }
        this.add(keyName, value, index);
    }
    build(lineEnd) {
        if (!this.changed && !lineEnd) {
            return typeof this.headers === 'string' ? Buffer.from(this.headers, 'binary') : this.headers;
        }
        if (!this.parsed) {
            this._parseHeaders();
        }
        lineEnd = lineEnd || '\r\n';
        let headers = this.lines.map((line)=>line.line.replace(/\r?\n/g, lineEnd)).join(lineEnd) + `${lineEnd}${lineEnd}`;
        if (this.mbox) {
            headers = this.mbox + lineEnd + headers;
        }
        if (this.http) {
            headers = this.http + lineEnd + headers;
        }
        return Buffer.from(headers, 'binary');
    }
    _normalizeHeader(key) {
        return (key || '').toLowerCase().trim();
    }
    _parseHeaders() {
        if (!this.headers) {
            this.lines = [];
            this.parsed = true;
            return;
        }
        let lines = this.headers.toString('binary').replace(/[\r\n]+$/, '').split(/\r?\n/);
        for(let i = lines.length - 1; i >= 0; i--){
            let chr = lines[i].charAt(0);
            if (i && (chr === ' ' || chr === '\t')) {
                lines[i - 1] += '\r\n' + lines[i];
                lines.splice(i, 1);
            } else {
                let line = lines[i];
                if (!i && /^From /i.test(line)) {
                    // mbox file
                    this.mbox = line;
                    lines.splice(i, 1);
                    continue;
                } else if (!i && /^POST /i.test(line)) {
                    // HTTP POST request
                    this.http = line;
                    lines.splice(i, 1);
                    continue;
                }
                let key = this._normalizeHeader(line.substr(0, line.indexOf(':')));
                lines[i] = {
                    key,
                    line
                };
            }
        }
        this.lines = lines;
        this.parsed = true;
    }
}
// expose to the world
module.exports = Headers;
}),
"[project]/Autonomous-Claims-Orchestrator/node_modules/@zone-eu/mailsplit/lib/mime-node.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const Headers = __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/@zone-eu/mailsplit/lib/headers.js [app-route] (ecmascript)");
const libmime = __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/libmime/lib/libmime.js [app-route] (ecmascript)");
const libqp = __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/libqp/lib/libqp.js [app-route] (ecmascript)");
const libbase64 = __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/libbase64/lib/libbase64.js [app-route] (ecmascript)");
const PassThrough = __turbopack_context__.r("[externals]/stream [external] (stream, cjs)").PassThrough;
const pathlib = __turbopack_context__.r("[externals]/path [external] (path, cjs)");
class MimeNode {
    constructor(parentNode, config){
        this.type = 'node';
        this.root = !parentNode;
        this.parentNode = parentNode;
        this._parentBoundary = this.parentNode && this.parentNode._boundary;
        this._headersLines = [];
        this._headerlen = 0;
        this._parsedContentType = false;
        this._boundary = false;
        this.multipart = false;
        this.encoding = false;
        this.headers = false;
        this.contentType = false;
        this.flowed = false;
        this.delSp = false;
        this.config = config || {};
        this.libmime = new libmime.Libmime({
            Iconv: this.config.Iconv
        });
        this.parentPartNumber = parentNode && this.partNr || [];
        this.partNr = false; // resolved later
        this.childPartNumbers = 0;
    }
    getPartNr(provided) {
        if (provided) {
            return [].concat(this.partNr || []).filter((nr)=>!isNaN(nr)).concat(provided);
        }
        let childPartNr = ++this.childPartNumbers;
        return [].concat(this.partNr || []).filter((nr)=>!isNaN(nr)).concat(childPartNr);
    }
    addHeaderChunk(line) {
        if (!line) {
            return;
        }
        this._headersLines.push(line);
        this._headerlen += line.length;
    }
    parseHeaders() {
        if (this.headers) {
            return;
        }
        this.headers = new Headers(Buffer.concat(this._headersLines, this._headerlen), this.config);
        this._parsedContentDisposition = this.libmime.parseHeaderValue(this.headers.getFirst('Content-Disposition'));
        // if content-type is missing default to plaintext
        let contentHeader;
        if (this.headers.get('Content-Type').length) {
            contentHeader = this.headers.getFirst('Content-Type');
        } else {
            if (this._parsedContentDisposition.params.filename) {
                let extension = pathlib.parse(this._parsedContentDisposition.params.filename).ext.replace(/^\./, '');
                if (extension) {
                    contentHeader = libmime.detectMimeType(extension);
                }
            }
            if (!contentHeader) {
                if (/^attachment$/i.test(this._parsedContentDisposition.value)) {
                    contentHeader = 'application/octet-stream';
                } else {
                    contentHeader = 'text/plain';
                }
            }
        }
        this._parsedContentType = this.libmime.parseHeaderValue(contentHeader);
        this.encoding = this.headers.getFirst('Content-Transfer-Encoding').replace(/\(.*\)/g, '').toLowerCase().trim();
        this.contentType = (this._parsedContentType.value || '').toLowerCase().trim() || false;
        this.charset = this._parsedContentType.params.charset || false;
        this.disposition = (this._parsedContentDisposition.value || '').toLowerCase().trim() || false;
        // fix invalidly encoded disposition values
        if (this.disposition) {
            try {
                this.disposition = this.libmime.decodeWords(this.disposition);
            } catch (E) {
            // failed to parse disposition, keep as is (most probably an unknown charset is used)
            }
        }
        this.filename = this._parsedContentDisposition.params.filename || this._parsedContentType.params.name || false;
        if (this._parsedContentType.params.format && this._parsedContentType.params.format.toLowerCase().trim() === 'flowed') {
            this.flowed = true;
            if (this._parsedContentType.params.delsp && this._parsedContentType.params.delsp.toLowerCase().trim() === 'yes') {
                this.delSp = true;
            }
        }
        if (this.filename) {
            try {
                this.filename = this.libmime.decodeWords(this.filename);
            } catch (E) {
            // failed to parse filename, keep as is (most probably an unknown charset is used)
            }
        }
        this.multipart = this.contentType && this.contentType.substr(0, this.contentType.indexOf('/')) === 'multipart' && this.contentType.substr(this.contentType.indexOf('/') + 1) || false;
        this._boundary = this._parsedContentType.params.boundary && Buffer.from(this._parsedContentType.params.boundary) || false;
        this.rfc822 = this.contentType === 'message/rfc822';
        if (!this.parentNode || this.parentNode.rfc822) {
            this.partNr = this.parentNode ? this.parentNode.getPartNr('TEXT') : [
                'TEXT'
            ];
        } else {
            this.partNr = this.parentNode ? this.parentNode.getPartNr() : [];
        }
    }
    getHeaders() {
        if (!this.headers) {
            this.parseHeaders();
        }
        return this.headers.build();
    }
    setContentType(contentType) {
        if (!this.headers) {
            this.parseHeaders();
        }
        contentType = (contentType || '').toLowerCase().trim();
        if (contentType) {
            this._parsedContentType.value = contentType;
        }
        if (!this.flowed && this._parsedContentType.params.format) {
            delete this._parsedContentType.params.format;
        }
        if (!this.delSp && this._parsedContentType.params.delsp) {
            delete this._parsedContentType.params.delsp;
        }
        this.headers.update('Content-Type', this.libmime.buildHeaderValue(this._parsedContentType));
    }
    setCharset(charset) {
        if (!this.headers) {
            this.parseHeaders();
        }
        charset = (charset || '').toLowerCase().trim();
        if (charset === 'ascii') {
            charset = '';
        }
        if (!charset) {
            if (!this._parsedContentType.value) {
                // nothing to set or update
                return;
            }
            delete this._parsedContentType.params.charset;
        } else {
            this._parsedContentType.params.charset = charset;
        }
        if (!this._parsedContentType.value) {
            this._parsedContentType.value = 'text/plain';
        }
        this.headers.update('Content-Type', this.libmime.buildHeaderValue(this._parsedContentType));
    }
    setFilename(filename) {
        if (!this.headers) {
            this.parseHeaders();
        }
        this.filename = (filename || '').toLowerCase().trim();
        if (this._parsedContentType.params.name) {
            delete this._parsedContentType.params.name;
            this.headers.update('Content-Type', this.libmime.buildHeaderValue(this._parsedContentType));
        }
        if (!this.filename) {
            if (!this._parsedContentDisposition.value) {
                // nothing to set or update
                return;
            }
            delete this._parsedContentDisposition.params.filename;
        } else {
            this._parsedContentDisposition.params.filename = this.filename;
        }
        if (!this._parsedContentDisposition.value) {
            this._parsedContentDisposition.value = 'attachment';
        }
        this.headers.update('Content-Disposition', this.libmime.buildHeaderValue(this._parsedContentDisposition));
    }
    getDecoder() {
        if (!this.headers) {
            this.parseHeaders();
        }
        switch(this.encoding){
            case 'base64':
                return new libbase64.Decoder();
            case 'quoted-printable':
                return new libqp.Decoder();
            default:
                return new PassThrough();
        }
    }
    getEncoder(encoding) {
        if (!this.headers) {
            this.parseHeaders();
        }
        encoding = (encoding || '').toString().toLowerCase().trim();
        if (encoding && encoding !== this.encoding) {
            this.headers.update('Content-Transfer-Encoding', encoding);
        } else {
            encoding = this.encoding;
        }
        switch(encoding){
            case 'base64':
                return new libbase64.Encoder();
            case 'quoted-printable':
                return new libqp.Encoder();
            default:
                return new PassThrough();
        }
    }
}
module.exports = MimeNode;
}),
"[project]/Autonomous-Claims-Orchestrator/node_modules/@zone-eu/mailsplit/lib/message-splitter.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const Transform = __turbopack_context__.r("[externals]/stream [external] (stream, cjs)").Transform;
const MimeNode = __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/@zone-eu/mailsplit/lib/mime-node.js [app-route] (ecmascript)");
const MAX_HEAD_SIZE = 1 * 1024 * 1024;
const MAX_CHILD_NODES = 1000;
const HEAD = 0x01;
const BODY = 0x02;
class MessageSplitter extends Transform {
    constructor(config){
        let options = {
            readableObjectMode: true,
            writableObjectMode: false
        };
        super(options);
        this.config = config || {};
        this.maxHeadSize = this.config.maxHeadSize || MAX_HEAD_SIZE;
        this.maxChildNodes = this.config.maxChildNodes || MAX_CHILD_NODES;
        this.tree = [];
        this.nodeCounter = 0;
        this.newNode();
        this.tree.push(this.node);
        this.line = false;
        this.hasFailed = false;
    }
    _transform(chunk, encoding, callback) {
        // process line by line
        // find next line ending
        let pos = 0;
        let i = 0;
        let group = {
            type: 'none'
        };
        let groupstart = this.line ? -this.line.length : 0;
        let groupend = 0;
        let checkTrailingLinebreak = (data)=>{
            if (data.type === 'body' && data.node.parentNode && data.value && data.value.length) {
                if (data.value[data.value.length - 1] === 0x0a) {
                    groupstart--;
                    groupend--;
                    pos--;
                    if (data.value.length > 1 && data.value[data.value.length - 2] === 0x0d) {
                        groupstart--;
                        groupend--;
                        pos--;
                        if (groupstart < 0 && !this.line) {
                            // store only <CR> as <LF> should be on the positive side
                            this.line = Buffer.allocUnsafe(1);
                            this.line[0] = 0x0d;
                        }
                        data.value = data.value.slice(0, data.value.length - 2);
                    } else {
                        data.value = data.value.slice(0, data.value.length - 1);
                    }
                } else if (data.value[data.value.length - 1] === 0x0d) {
                    groupstart--;
                    groupend--;
                    pos--;
                    data.value = data.value.slice(0, data.value.length - 1);
                }
            }
        };
        let iterateData = ()=>{
            for(let len = chunk.length; i < len; i++){
                // find next <LF>
                if (chunk[i] === 0x0a) {
                    // line end
                    let start = Math.max(pos, 0);
                    pos = ++i;
                    return this.processLine(chunk.slice(start, i), false, (err, data, flush)=>{
                        if (err) {
                            this.hasFailed = true;
                            return setImmediate(()=>callback(err));
                        }
                        if (!data) {
                            return setImmediate(iterateData);
                        }
                        if (flush) {
                            if (group && group.type !== 'none') {
                                if (group.type === 'body' && groupend >= groupstart && group.node.parentNode) {
                                    // do not include the last line ending for body
                                    if (chunk[groupend - 1] === 0x0a) {
                                        groupend--;
                                        if (groupend >= groupstart && chunk[groupend - 1] === 0x0d) {
                                            groupend--;
                                        }
                                    }
                                }
                                if (groupstart !== groupend) {
                                    group.value = chunk.slice(groupstart, groupend);
                                    if (groupend < i) {
                                        data.value = chunk.slice(groupend, i);
                                    }
                                }
                                this.push(group);
                                group = {
                                    type: 'none'
                                };
                                groupstart = groupend = i;
                            }
                            this.push(data);
                            groupend = i;
                            return setImmediate(iterateData);
                        }
                        if (data.type === group.type) {
                            // shift slice end position forward
                            groupend = i;
                        } else {
                            if (group.type === 'body' && groupend >= groupstart && group.node.parentNode) {
                                // do not include the last line ending for body
                                if (chunk[groupend - 1] === 0x0a) {
                                    groupend--;
                                    if (groupend >= groupstart && chunk[groupend - 1] === 0x0d) {
                                        groupend--;
                                    }
                                }
                            }
                            if (group.type !== 'none' && group.type !== 'node') {
                                // we have a previous data/body chunk to output
                                if (groupstart !== groupend) {
                                    group.value = chunk.slice(groupstart, groupend);
                                    if (group.value && group.value.length) {
                                        this.push(group);
                                        group = {
                                            type: 'none'
                                        };
                                    }
                                }
                            }
                            if (data.type === 'node') {
                                this.push(data);
                                groupstart = i;
                                groupend = i;
                            } else if (groupstart < 0) {
                                groupstart = i;
                                groupend = i;
                                checkTrailingLinebreak(data);
                                if (data.value && data.value.length) {
                                    this.push(data);
                                }
                            } else {
                                // start new body/data chunk
                                group = data;
                                groupstart = groupend;
                                groupend = i;
                            }
                        }
                        return setImmediate(iterateData);
                    });
                }
            }
            // skip last linebreak for body
            if (pos >= groupstart + 1 && group.type === 'body' && group.node.parentNode) {
                // do not include the last line ending for body
                if (chunk[pos - 1] === 0x0a) {
                    pos--;
                    if (pos >= groupstart && chunk[pos - 1] === 0x0d) {
                        pos--;
                    }
                }
            }
            if (group.type !== 'none' && group.type !== 'node' && pos > groupstart) {
                // we have a leftover data/body chunk to push out
                group.value = chunk.slice(groupstart, pos);
                if (group.value && group.value.length) {
                    this.push(group);
                    group = {
                        type: 'none'
                    };
                }
            }
            if (pos < chunk.length) {
                if (this.line) {
                    this.line = Buffer.concat([
                        this.line,
                        chunk.slice(pos)
                    ]);
                } else {
                    this.line = chunk.slice(pos);
                }
            }
            callback();
        };
        setImmediate(iterateData);
    }
    _flush(callback) {
        if (this.hasFailed) {
            return callback();
        }
        this.processLine(false, true, (err, data)=>{
            if (err) {
                return setImmediate(()=>callback(err));
            }
            if (data && (data.type === 'node' || data.value && data.value.length)) {
                this.push(data);
            }
            callback();
        });
    }
    compareBoundary(line, startpos, boundary) {
        // --{boundary}\r\n or --{boundary}--\r\n
        if (line.length < boundary.length + 3 + startpos || line.length > boundary.length + 6 + startpos) {
            return false;
        }
        for(let i = 0; i < boundary.length; i++){
            if (line[i + 2 + startpos] !== boundary[i]) {
                return false;
            }
        }
        let pos = 0;
        for(let i = boundary.length + 2 + startpos; i < line.length; i++){
            let c = line[i];
            if (pos === 0 && (c === 0x0d || c === 0x0a)) {
                // 1: next node
                return 1;
            }
            if (pos === 0 && c !== 0x2d) {
                // expecting "-"
                return false;
            }
            if (pos === 1 && c !== 0x2d) {
                // expecting "-"
                return false;
            }
            if (pos === 2 && c !== 0x0d && c !== 0x0a) {
                // expecting line terminator, either <CR> or <LF>
                return false;
            }
            if (pos === 3 && c !== 0x0a) {
                // expecting line terminator <LF>
                return false;
            }
            pos++;
        }
        // 2: multipart end
        return 2;
    }
    checkBoundary(line) {
        let startpos = 0;
        if (line.length >= 1 && (line[0] === 0x0d || line[0] === 0x0a)) {
            startpos++;
            if (line.length >= 2 && (line[0] === 0x0d || line[1] === 0x0a)) {
                startpos++;
            }
        }
        if (line.length < 4 || line[startpos] !== 0x2d || line[startpos + 1] !== 0x2d) {
            // defnitely not a boundary
            return false;
        }
        let boundary;
        if (this.node._boundary && (boundary = this.compareBoundary(line, startpos, this.node._boundary))) {
            // 1: next child
            // 2: multipart end
            return boundary;
        }
        if (this.node._parentBoundary && (boundary = this.compareBoundary(line, startpos, this.node._parentBoundary))) {
            // 3: next sibling
            // 4: parent end
            return boundary + 2;
        }
        return false;
    }
    processLine(line, final, next) {
        let flush = false;
        if (this.line && line) {
            line = Buffer.concat([
                this.line,
                line
            ]);
            this.line = false;
        } else if (this.line && !line) {
            line = this.line;
            this.line = false;
        }
        if (!line) {
            line = Buffer.alloc(0);
        }
        if (this.nodeCounter > this.maxChildNodes) {
            let err = new Error('Max allowed child nodes exceeded');
            err.code = 'EMAXLEN';
            return next(err);
        }
        // we check boundary outside the HEAD/BODY scope as it may appear anywhere
        let boundary = this.checkBoundary(line);
        if (boundary) {
            // reached boundary, switch context
            switch(boundary){
                case 1:
                    // next child
                    this.newNode(this.node);
                    flush = true;
                    break;
                case 2:
                    break;
                case 3:
                    {
                        // next sibling
                        let parentNode = this.node.parentNode;
                        if (parentNode && parentNode.contentType === 'message/rfc822') {
                            // special case where immediate parent is an inline message block
                            // move up another step
                            parentNode = parentNode.parentNode;
                        }
                        this.newNode(parentNode);
                        flush = true;
                        break;
                    }
                case 4:
                    // special case when boundary close a node with only header.
                    if (this.node && this.node._headerlen && !this.node.headers) {
                        this.node.parseHeaders();
                        this.push(this.node);
                    }
                    // move up
                    if (this.tree.length) {
                        this.node = this.tree.pop();
                    }
                    this.state = BODY;
                    break;
            }
            return next(null, {
                node: this.node,
                type: 'data',
                value: line
            }, flush);
        }
        switch(this.state){
            case HEAD:
                {
                    this.node.addHeaderChunk(line);
                    if (this.node._headerlen > this.maxHeadSize) {
                        let err = new Error('Max header size for a MIME node exceeded');
                        err.code = 'EMAXLEN';
                        return next(err);
                    }
                    if (final || line.length === 1 && line[0] === 0x0a || line.length === 2 && line[0] === 0x0d && line[1] === 0x0a) {
                        let currentNode = this.node;
                        currentNode.parseHeaders();
                        // if the content is attached message then just continue
                        if (currentNode.contentType === 'message/rfc822' && !this.config.ignoreEmbedded && (!currentNode.encoding || [
                            '7bit',
                            '8bit',
                            'binary'
                        ].includes(currentNode.encoding)) && (this.config.defaultInlineEmbedded ? currentNode.disposition !== 'attachment' : currentNode.disposition === 'inline')) {
                            currentNode.messageNode = true;
                            this.newNode(currentNode);
                            if (currentNode.parentNode) {
                                this.node._parentBoundary = currentNode.parentNode._boundary;
                            }
                        } else {
                            if (currentNode.contentType === 'message/rfc822') {
                                currentNode.messageNode = false;
                            }
                            this.state = BODY;
                            if (currentNode.multipart && currentNode._boundary) {
                                this.tree.push(currentNode);
                            }
                        }
                        return next(null, currentNode, flush);
                    }
                    return next();
                }
            case BODY:
                {
                    return next(null, {
                        node: this.node,
                        type: this.node.multipart ? 'data' : 'body',
                        value: line
                    }, flush);
                }
        }
        next(null, false);
    }
    newNode(parent) {
        this.node = new MimeNode(parent || false, this.config);
        this.state = HEAD;
        this.nodeCounter++;
    }
}
module.exports = MessageSplitter;
}),
"[project]/Autonomous-Claims-Orchestrator/node_modules/@zone-eu/mailsplit/lib/message-joiner.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const Transform = __turbopack_context__.r("[externals]/stream [external] (stream, cjs)").Transform;
class MessageJoiner extends Transform {
    constructor(){
        let options = {
            readableObjectMode: false,
            writableObjectMode: true
        };
        super(options);
    }
    _transform(obj, encoding, callback) {
        if (Buffer.isBuffer(obj)) {
            this.push(obj);
        } else if (obj.type === 'node') {
            this.push(obj.getHeaders());
        } else if (obj.value) {
            this.push(obj.value);
        }
        return callback();
    }
    _flush(callback) {
        return callback();
    }
}
module.exports = MessageJoiner;
}),
"[project]/Autonomous-Claims-Orchestrator/node_modules/@zone-eu/mailsplit/lib/flowed-decoder.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

// Helper class to rewrite nodes with specific mime type
const Transform = __turbopack_context__.r("[externals]/stream [external] (stream, cjs)").Transform;
const libmime = __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/libmime/lib/libmime.js [app-route] (ecmascript)");
/**
 * Really bad "stream" transform to parse format=flowed content
 *
 * @constructor
 * @param {String} delSp True if delsp option was used
 */ class FlowedDecoder extends Transform {
    constructor(config){
        super();
        this.config = config || {};
        this.chunks = [];
        this.chunklen = 0;
        this.libmime = new libmime.Libmime({
            Iconv: config.Iconv
        });
    }
    _transform(chunk, encoding, callback) {
        if (!chunk || !chunk.length) {
            return callback();
        }
        if (!encoding !== 'buffer') {
            chunk = Buffer.from(chunk, encoding);
        }
        this.chunks.push(chunk);
        this.chunklen += chunk.length;
        callback();
    }
    _flush(callback) {
        if (this.chunklen) {
            let currentBody = Buffer.concat(this.chunks, this.chunklen);
            if (this.config.encoding === 'base64') {
                currentBody = Buffer.from(currentBody.toString('binary'), 'base64');
            }
            let content = this.libmime.decodeFlowed(currentBody.toString('binary'), this.config.delSp);
            this.push(Buffer.from(content, 'binary'));
        }
        return callback();
    }
}
module.exports = FlowedDecoder;
}),
"[project]/Autonomous-Claims-Orchestrator/node_modules/@zone-eu/mailsplit/lib/node-rewriter.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

// Helper class to rewrite nodes with specific mime type
const Transform = __turbopack_context__.r("[externals]/stream [external] (stream, cjs)").Transform;
const FlowedDecoder = __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/@zone-eu/mailsplit/lib/flowed-decoder.js [app-route] (ecmascript)");
/**
 * NodeRewriter Transform stream. Updates content for all nodes with specified mime type
 *
 * @constructor
 * @param {String} mimeType Define the Mime-Type to look for
 * @param {Function} rewriteAction Function to run with the node content
 */ class NodeRewriter extends Transform {
    constructor(filterFunc, rewriteAction){
        let options = {
            readableObjectMode: true,
            writableObjectMode: true
        };
        super(options);
        this.filterFunc = filterFunc;
        this.rewriteAction = rewriteAction;
        this.decoder = false;
        this.encoder = false;
        this.continue = false;
    }
    _transform(data, encoding, callback) {
        this.processIncoming(data, callback);
    }
    _flush(callback) {
        if (this.decoder) {
            // emit an empty node just in case there is pending data to end
            return this.processIncoming({
                type: 'none'
            }, callback);
        }
        return callback();
    }
    processIncoming(data, callback) {
        if (this.decoder && data.type === 'body') {
            // data to parse
            if (!this.decoder.write(data.value)) {
                return this.decoder.once('drain', callback);
            } else {
                return callback();
            }
        } else if (this.decoder && data.type !== 'body') {
            // stop decoding.
            // we can not process the current data chunk as we need to wait until
            // the parsed data is completely processed, so we store a reference to the
            // continue callback
            this.continue = ()=>{
                this.continue = false;
                this.decoder = false;
                this.encoder = false;
                this.processIncoming(data, callback);
            };
            return this.decoder.end();
        } else if (data.type === 'node' && this.filterFunc(data)) {
            // found matching node, create new handler
            this.emit('node', this.createDecodePair(data));
        } else if (this.readable && data.type !== 'none') {
            // we don't care about this data, just pass it over to the joiner
            this.push(data);
        }
        callback();
    }
    createDecodePair(node) {
        this.decoder = node.getDecoder();
        if ([
            'base64',
            'quoted-printable'
        ].includes(node.encoding)) {
            this.encoder = node.getEncoder();
        } else {
            this.encoder = node.getEncoder('quoted-printable');
        }
        let lastByte = false;
        let decoder = this.decoder;
        let encoder = this.encoder;
        let firstChunk = true;
        decoder.$reading = false;
        let readFromEncoder = ()=>{
            decoder.$reading = true;
            let data = encoder.read();
            if (data === null) {
                decoder.$reading = false;
                return;
            }
            if (firstChunk) {
                firstChunk = false;
                if (this.readable) {
                    this.push(node);
                    if (node.type === 'body') {
                        lastByte = node.value && node.value.length && node.value[node.value.length - 1];
                    }
                }
            }
            let writeMore = true;
            if (this.readable) {
                writeMore = this.push({
                    node,
                    type: 'body',
                    value: data
                });
                lastByte = data && data.length && data[data.length - 1];
            }
            if (writeMore) {
                return setImmediate(readFromEncoder);
            } else {
                encoder.pause();
                // no idea how to catch drain? use timeout for now as poor man's substitute
                // this.once('drain', () => encoder.resume());
                setTimeout(()=>{
                    encoder.resume();
                    setImmediate(readFromEncoder);
                }, 100);
            }
        };
        encoder.on('readable', ()=>{
            if (!decoder.$reading) {
                return readFromEncoder();
            }
        });
        encoder.on('end', ()=>{
            if (firstChunk) {
                firstChunk = false;
                if (this.readable) {
                    this.push(node);
                    if (node.type === 'body') {
                        lastByte = node.value && node.value.length && node.value[node.value.length - 1];
                    }
                }
            }
            if (lastByte !== 0x0a) {
                // make sure there is a terminating line break
                this.push({
                    node,
                    type: 'body',
                    value: Buffer.from([
                        0x0a
                    ])
                });
            }
            if (this.continue) {
                return this.continue();
            }
        });
        if (/^text\//.test(node.contentType) && node.flowed) {
            // text/plain; format=flowed is a special case
            let flowDecoder = decoder;
            decoder = new FlowedDecoder({
                delSp: node.delSp,
                encoding: node.encoding
            });
            flowDecoder.on('error', (err)=>{
                decoder.emit('error', err);
            });
            flowDecoder.pipe(decoder);
            // we don't know what kind of data we are going to get, does it comply with the
            // requirements of format=flowed, so we just cancel it
            node.flowed = false;
            node.delSp = false;
            node.setContentType();
        }
        return {
            node,
            decoder,
            encoder
        };
    }
}
module.exports = NodeRewriter;
}),
"[project]/Autonomous-Claims-Orchestrator/node_modules/@zone-eu/mailsplit/lib/node-streamer.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

// Helper class to rewrite nodes with specific mime type
const Transform = __turbopack_context__.r("[externals]/stream [external] (stream, cjs)").Transform;
const FlowedDecoder = __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/@zone-eu/mailsplit/lib/flowed-decoder.js [app-route] (ecmascript)");
/**
 * NodeRewriter Transform stream. Updates content for all nodes with specified mime type
 *
 * @constructor
 * @param {String} mimeType Define the Mime-Type to look for
 * @param {Function} streamAction Function to run with the node content
 */ class NodeStreamer extends Transform {
    constructor(filterFunc, streamAction){
        let options = {
            readableObjectMode: true,
            writableObjectMode: true
        };
        super(options);
        this.filterFunc = filterFunc;
        this.streamAction = streamAction;
        this.decoder = false;
        this.canContinue = false;
        this.continue = false;
    }
    _transform(data, encoding, callback) {
        this.processIncoming(data, callback);
    }
    _flush(callback) {
        if (this.decoder) {
            // emit an empty node just in case there is pending data to end
            return this.processIncoming({
                type: 'none'
            }, callback);
        }
        return callback();
    }
    processIncoming(data, callback) {
        if (this.decoder && data.type === 'body') {
            // data to parse
            this.push(data);
            if (!this.decoder.write(data.value)) {
                return this.decoder.once('drain', callback);
            } else {
                return callback();
            }
        } else if (this.decoder && data.type !== 'body') {
            // stop decoding.
            // we can not process the current data chunk as we need to wait until
            // the parsed data is completely processed, so we store a reference to the
            // continue callback
            let doContinue = ()=>{
                this.continue = false;
                this.decoder = false;
                this.canContinue = false;
                this.processIncoming(data, callback);
            };
            if (this.canContinue) {
                setImmediate(doContinue);
            } else {
                this.continue = ()=>doContinue();
            }
            return this.decoder.end();
        } else if (data.type === 'node' && this.filterFunc(data)) {
            this.push(data);
            // found matching node, create new handler
            this.emit('node', this.createDecoder(data));
        } else if (this.readable && data.type !== 'none') {
            // we don't care about this data, just pass it over to the joiner
            this.push(data);
        }
        callback();
    }
    createDecoder(node) {
        this.decoder = node.getDecoder();
        let decoder = this.decoder;
        decoder.$reading = false;
        if (/^text\//.test(node.contentType) && node.flowed) {
            let flowDecoder = decoder;
            decoder = new FlowedDecoder({
                delSp: node.delSp
            });
            flowDecoder.on('error', (err)=>{
                decoder.emit('error', err);
            });
            flowDecoder.pipe(decoder);
        }
        return {
            node,
            decoder,
            done: ()=>{
                if (typeof this.continue === 'function') {
                    // called once input stream is processed
                    this.continue();
                } else {
                    // called before input stream is processed
                    this.canContinue = true;
                }
            }
        };
    }
}
module.exports = NodeStreamer;
}),
"[project]/Autonomous-Claims-Orchestrator/node_modules/@zone-eu/mailsplit/lib/chunked-passthrough.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const { Transform } = __turbopack_context__.r("[externals]/stream [external] (stream, cjs)");
class ChunkedPassthrough extends Transform {
    constructor(options = {}){
        let config = {
            readableObjectMode: true,
            writableObjectMode: false
        };
        super(config);
        this.chunkSize = options.chunkSize || 64 * 1024; // 64KB default
        this.buffer = Buffer.alloc(0);
    }
    _transform(chunk, encoding, callback) {
        this.buffer = Buffer.concat([
            this.buffer,
            chunk
        ]);
        if (this.buffer.length >= this.chunkSize) {
            this.push(this.buffer);
            this.buffer = Buffer.alloc(0);
        }
        callback();
    }
    _flush(callback) {
        // Send remaining data
        if (this.buffer.length > 0) {
            this.push(this.buffer);
            this.buffer = Buffer.alloc(0);
        }
        callback();
    }
}
module.exports = ChunkedPassthrough;
}),
"[project]/Autonomous-Claims-Orchestrator/node_modules/@zone-eu/mailsplit/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const MessageSplitter = __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/@zone-eu/mailsplit/lib/message-splitter.js [app-route] (ecmascript)");
const MessageJoiner = __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/@zone-eu/mailsplit/lib/message-joiner.js [app-route] (ecmascript)");
const NodeRewriter = __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/@zone-eu/mailsplit/lib/node-rewriter.js [app-route] (ecmascript)");
const NodeStreamer = __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/@zone-eu/mailsplit/lib/node-streamer.js [app-route] (ecmascript)");
const Headers = __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/@zone-eu/mailsplit/lib/headers.js [app-route] (ecmascript)");
const ChunkedPassthrough = __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/@zone-eu/mailsplit/lib/chunked-passthrough.js [app-route] (ecmascript)");
module.exports = {
    Splitter: MessageSplitter,
    Joiner: MessageJoiner,
    Rewriter: NodeRewriter,
    Streamer: NodeStreamer,
    ChunkedPassthrough,
    Headers
};
}),
"[project]/Autonomous-Claims-Orchestrator/node_modules/nodemailer/lib/smtp-connection/http-proxy-client.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/**
 * Minimal HTTP/S proxy client
 */ const net = __turbopack_context__.r("[externals]/net [external] (net, cjs)");
const tls = __turbopack_context__.r("[externals]/tls [external] (tls, cjs)");
const urllib = __turbopack_context__.r("[externals]/url [external] (url, cjs)");
/**
 * Establishes proxied connection to destinationPort
 *
 * httpProxyClient("http://localhost:3128/", 80, "google.com", function(err, socket){
 *     socket.write("GET / HTTP/1.0\r\n\r\n");
 * });
 *
 * @param {String} proxyUrl proxy configuration, etg "http://proxy.host:3128/"
 * @param {Number} destinationPort Port to open in destination host
 * @param {String} destinationHost Destination hostname
 * @param {Function} callback Callback to run with the rocket object once connection is established
 */ function httpProxyClient(proxyUrl, destinationPort, destinationHost, callback) {
    let proxy = urllib.parse(proxyUrl);
    // create a socket connection to the proxy server
    let options;
    let connect;
    let socket;
    options = {
        host: proxy.hostname,
        port: Number(proxy.port) ? Number(proxy.port) : proxy.protocol === 'https:' ? 443 : 80
    };
    if (proxy.protocol === 'https:') {
        // we can use untrusted proxies as long as we verify actual SMTP certificates
        options.rejectUnauthorized = false;
        connect = tls.connect.bind(tls);
    } else {
        connect = net.connect.bind(net);
    }
    // Error harness for initial connection. Once connection is established, the responsibility
    // to handle errors is passed to whoever uses this socket
    let finished = false;
    let tempSocketErr = (err)=>{
        if (finished) {
            return;
        }
        finished = true;
        try {
            socket.destroy();
        } catch (_E) {
        // ignore
        }
        callback(err);
    };
    let timeoutErr = ()=>{
        let err = new Error('Proxy socket timed out');
        err.code = 'ETIMEDOUT';
        tempSocketErr(err);
    };
    socket = connect(options, ()=>{
        if (finished) {
            return;
        }
        let reqHeaders = {
            Host: destinationHost + ':' + destinationPort,
            Connection: 'close'
        };
        if (proxy.auth) {
            reqHeaders['Proxy-Authorization'] = 'Basic ' + Buffer.from(proxy.auth).toString('base64');
        }
        socket.write(// HTTP method
        'CONNECT ' + destinationHost + ':' + destinationPort + ' HTTP/1.1\r\n' + // HTTP request headers
        Object.keys(reqHeaders).map((key)=>key + ': ' + reqHeaders[key]).join('\r\n') + // End request
        '\r\n\r\n');
        let headers = '';
        let onSocketData = (chunk)=>{
            let match;
            let remainder;
            if (finished) {
                return;
            }
            headers += chunk.toString('binary');
            if (match = headers.match(/\r\n\r\n/)) {
                socket.removeListener('data', onSocketData);
                remainder = headers.substr(match.index + match[0].length);
                headers = headers.substr(0, match.index);
                if (remainder) {
                    socket.unshift(Buffer.from(remainder, 'binary'));
                }
                // proxy connection is now established
                finished = true;
                // check response code
                match = headers.match(/^HTTP\/\d+\.\d+ (\d+)/i);
                if (!match || (match[1] || '').charAt(0) !== '2') {
                    try {
                        socket.destroy();
                    } catch (_E) {
                    // ignore
                    }
                    return callback(new Error('Invalid response from proxy' + (match && ': ' + match[1] || '')));
                }
                socket.removeListener('error', tempSocketErr);
                socket.removeListener('timeout', timeoutErr);
                socket.setTimeout(0);
                return callback(null, socket);
            }
        };
        socket.on('data', onSocketData);
    });
    socket.setTimeout(httpProxyClient.timeout || 30 * 1000);
    socket.on('timeout', timeoutErr);
    socket.once('error', tempSocketErr);
}
module.exports = httpProxyClient;
}),
"[project]/Autonomous-Claims-Orchestrator/node_modules/nodemailer/lib/addressparser/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/**
 * Converts tokens for a single address into an address object
 *
 * @param {Array} tokens Tokens object
 * @param {Number} depth Current recursion depth for nested group protection
 * @return {Object} Address object
 */ function _handleAddress(tokens, depth) {
    let isGroup = false;
    let state = 'text';
    let address;
    let addresses = [];
    let data = {
        address: [],
        comment: [],
        group: [],
        text: [],
        textWasQuoted: [] // Track which text tokens came from inside quotes
    };
    let i;
    let len;
    let insideQuotes = false; // Track if we're currently inside a quoted string
    // Filter out <addresses>, (comments) and regular text
    for(i = 0, len = tokens.length; i < len; i++){
        let token = tokens[i];
        let prevToken = i ? tokens[i - 1] : null;
        if (token.type === 'operator') {
            switch(token.value){
                case '<':
                    state = 'address';
                    insideQuotes = false;
                    break;
                case '(':
                    state = 'comment';
                    insideQuotes = false;
                    break;
                case ':':
                    state = 'group';
                    isGroup = true;
                    insideQuotes = false;
                    break;
                case '"':
                    // Track quote state for text tokens
                    insideQuotes = !insideQuotes;
                    state = 'text';
                    break;
                default:
                    state = 'text';
                    insideQuotes = false;
                    break;
            }
        } else if (token.value) {
            if (state === 'address') {
                // handle use case where unquoted name includes a "<"
                // Apple Mail truncates everything between an unexpected < and an address
                // and so will we
                token.value = token.value.replace(/^[^<]*<\s*/, '');
            }
            if (prevToken && prevToken.noBreak && data[state].length) {
                // join values
                data[state][data[state].length - 1] += token.value;
                if (state === 'text' && insideQuotes) {
                    data.textWasQuoted[data.textWasQuoted.length - 1] = true;
                }
            } else {
                data[state].push(token.value);
                if (state === 'text') {
                    data.textWasQuoted.push(insideQuotes);
                }
            }
        }
    }
    // If there is no text but a comment, replace the two
    if (!data.text.length && data.comment.length) {
        data.text = data.comment;
        data.comment = [];
    }
    if (isGroup) {
        // http://tools.ietf.org/html/rfc2822#appendix-A.1.3
        data.text = data.text.join(' ');
        // Parse group members, but flatten any nested groups (RFC 5322 doesn't allow nesting)
        let groupMembers = [];
        if (data.group.length) {
            let parsedGroup = addressparser(data.group.join(','), {
                _depth: depth + 1
            });
            // Flatten: if any member is itself a group, extract its members into the sequence
            parsedGroup.forEach((member)=>{
                if (member.group) {
                    // Nested group detected - flatten it by adding its members directly
                    groupMembers = groupMembers.concat(member.group);
                } else {
                    groupMembers.push(member);
                }
            });
        }
        addresses.push({
            name: data.text || address && address.name,
            group: groupMembers
        });
    } else {
        // If no address was found, try to detect one from regular text
        if (!data.address.length && data.text.length) {
            for(i = data.text.length - 1; i >= 0; i--){
                // Security fix: Do not extract email addresses from quoted strings
                // RFC 5321 allows @ inside quoted local-parts like "user@domain"@example.com
                // Extracting emails from quoted text leads to misrouting vulnerabilities
                if (!data.textWasQuoted[i] && data.text[i].match(/^[^@\s]+@[^@\s]+$/)) {
                    data.address = data.text.splice(i, 1);
                    data.textWasQuoted.splice(i, 1);
                    break;
                }
            }
            let _regexHandler = function(address) {
                if (!data.address.length) {
                    data.address = [
                        address.trim()
                    ];
                    return ' ';
                } else {
                    return address;
                }
            };
            // still no address
            if (!data.address.length) {
                for(i = data.text.length - 1; i >= 0; i--){
                    // Security fix: Do not extract email addresses from quoted strings
                    if (!data.textWasQuoted[i]) {
                        // fixed the regex to parse email address correctly when email address has more than one @
                        data.text[i] = data.text[i].replace(/\s*\b[^@\s]+@[^\s]+\b\s*/, _regexHandler).trim();
                        if (data.address.length) {
                            break;
                        }
                    }
                }
            }
        }
        // If there's still is no text but a comment exixts, replace the two
        if (!data.text.length && data.comment.length) {
            data.text = data.comment;
            data.comment = [];
        }
        // Keep only the first address occurence, push others to regular text
        if (data.address.length > 1) {
            data.text = data.text.concat(data.address.splice(1));
        }
        // Join values with spaces
        data.text = data.text.join(' ');
        data.address = data.address.join(' ');
        if (!data.address && isGroup) {
            return [];
        } else {
            address = {
                address: data.address || data.text || '',
                name: data.text || data.address || ''
            };
            if (address.address === address.name) {
                if ((address.address || '').match(/@/)) {
                    address.name = '';
                } else {
                    address.address = '';
                }
            }
            addresses.push(address);
        }
    }
    return addresses;
}
/**
 * Creates a Tokenizer object for tokenizing address field strings
 *
 * @constructor
 * @param {String} str Address field string
 */ class Tokenizer {
    constructor(str){
        this.str = (str || '').toString();
        this.operatorCurrent = '';
        this.operatorExpecting = '';
        this.node = null;
        this.escaped = false;
        this.list = [];
        /**
         * Operator tokens and which tokens are expected to end the sequence
         */ this.operators = {
            '"': '"',
            '(': ')',
            '<': '>',
            ',': '',
            ':': ';',
            // Semicolons are not a legal delimiter per the RFC2822 grammar other
            // than for terminating a group, but they are also not valid for any
            // other use in this context.  Given that some mail clients have
            // historically allowed the semicolon as a delimiter equivalent to the
            // comma in their UI, it makes sense to treat them the same as a comma
            // when used outside of a group.
            ';': ''
        };
    }
    /**
     * Tokenizes the original input string
     *
     * @return {Array} An array of operator|text tokens
     */ tokenize() {
        let list = [];
        for(let i = 0, len = this.str.length; i < len; i++){
            let chr = this.str.charAt(i);
            let nextChr = i < len - 1 ? this.str.charAt(i + 1) : null;
            this.checkChar(chr, nextChr);
        }
        this.list.forEach((node)=>{
            node.value = (node.value || '').toString().trim();
            if (node.value) {
                list.push(node);
            }
        });
        return list;
    }
    /**
     * Checks if a character is an operator or text and acts accordingly
     *
     * @param {String} chr Character from the address field
     */ checkChar(chr, nextChr) {
        if (this.escaped) {
        // ignore next condition blocks
        } else if (chr === this.operatorExpecting) {
            this.node = {
                type: 'operator',
                value: chr
            };
            if (nextChr && ![
                ' ',
                '\t',
                '\r',
                '\n',
                ',',
                ';'
            ].includes(nextChr)) {
                this.node.noBreak = true;
            }
            this.list.push(this.node);
            this.node = null;
            this.operatorExpecting = '';
            this.escaped = false;
            return;
        } else if (!this.operatorExpecting && chr in this.operators) {
            this.node = {
                type: 'operator',
                value: chr
            };
            this.list.push(this.node);
            this.node = null;
            this.operatorExpecting = this.operators[chr];
            this.escaped = false;
            return;
        } else if ([
            '"',
            "'"
        ].includes(this.operatorExpecting) && chr === '\\') {
            this.escaped = true;
            return;
        }
        if (!this.node) {
            this.node = {
                type: 'text',
                value: ''
            };
            this.list.push(this.node);
        }
        if (chr === '\n') {
            // Convert newlines to spaces. Carriage return is ignored as \r and \n usually
            // go together anyway and there already is a WS for \n. Lone \r means something is fishy.
            chr = ' ';
        }
        if (chr.charCodeAt(0) >= 0x21 || [
            ' ',
            '\t'
        ].includes(chr)) {
            // skip command bytes
            this.node.value += chr;
        }
        this.escaped = false;
    }
}
/**
 * Maximum recursion depth for parsing nested groups.
 * RFC 5322 doesn't allow nested groups, so this is a safeguard against
 * malicious input that could cause stack overflow.
 */ const MAX_NESTED_GROUP_DEPTH = 50;
/**
 * Parses structured e-mail addresses from an address field
 *
 * Example:
 *
 *    'Name <address@domain>'
 *
 * will be converted to
 *
 *     [{name: 'Name', address: 'address@domain'}]
 *
 * @param {String} str Address field
 * @param {Object} options Optional options object
 * @param {Number} options._depth Internal recursion depth counter (do not set manually)
 * @return {Array} An array of address objects
 */ function addressparser(str, options) {
    options = options || {};
    let depth = options._depth || 0;
    // Prevent stack overflow from deeply nested groups (DoS protection)
    if (depth > MAX_NESTED_GROUP_DEPTH) {
        return [];
    }
    let tokenizer = new Tokenizer(str);
    let tokens = tokenizer.tokenize();
    let addresses = [];
    let address = [];
    let parsedAddresses = [];
    tokens.forEach((token)=>{
        if (token.type === 'operator' && (token.value === ',' || token.value === ';')) {
            if (address.length) {
                addresses.push(address);
            }
            address = [];
        } else {
            address.push(token);
        }
    });
    if (address.length) {
        addresses.push(address);
    }
    addresses.forEach((address)=>{
        address = _handleAddress(address, depth);
        if (address.length) {
            parsedAddresses = parsedAddresses.concat(address);
        }
    });
    if (options.flatten) {
        let addresses = [];
        let walkAddressList = (list)=>{
            list.forEach((address)=>{
                if (address.group) {
                    return walkAddressList(address.group);
                } else {
                    addresses.push(address);
                }
            });
        };
        walkAddressList(parsedAddresses);
        return addresses;
    }
    return parsedAddresses;
}
// expose to the world
module.exports = addressparser;
}),
"[project]/Autonomous-Claims-Orchestrator/node_modules/smart-buffer/build/utils.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
const buffer_1 = __turbopack_context__.r("[externals]/buffer [external] (buffer, cjs)");
/**
 * Error strings
 */ const ERRORS = {
    INVALID_ENCODING: 'Invalid encoding provided. Please specify a valid encoding the internal Node.js Buffer supports.',
    INVALID_SMARTBUFFER_SIZE: 'Invalid size provided. Size must be a valid integer greater than zero.',
    INVALID_SMARTBUFFER_BUFFER: 'Invalid Buffer provided in SmartBufferOptions.',
    INVALID_SMARTBUFFER_OBJECT: 'Invalid SmartBufferOptions object supplied to SmartBuffer constructor or factory methods.',
    INVALID_OFFSET: 'An invalid offset value was provided.',
    INVALID_OFFSET_NON_NUMBER: 'An invalid offset value was provided. A numeric value is required.',
    INVALID_LENGTH: 'An invalid length value was provided.',
    INVALID_LENGTH_NON_NUMBER: 'An invalid length value was provived. A numeric value is required.',
    INVALID_TARGET_OFFSET: 'Target offset is beyond the bounds of the internal SmartBuffer data.',
    INVALID_TARGET_LENGTH: 'Specified length value moves cursor beyong the bounds of the internal SmartBuffer data.',
    INVALID_READ_BEYOND_BOUNDS: 'Attempted to read beyond the bounds of the managed data.',
    INVALID_WRITE_BEYOND_BOUNDS: 'Attempted to write beyond the bounds of the managed data.'
};
exports.ERRORS = ERRORS;
/**
 * Checks if a given encoding is a valid Buffer encoding. (Throws an exception if check fails)
 *
 * @param { String } encoding The encoding string to check.
 */ function checkEncoding(encoding) {
    if (!buffer_1.Buffer.isEncoding(encoding)) {
        throw new Error(ERRORS.INVALID_ENCODING);
    }
}
exports.checkEncoding = checkEncoding;
/**
 * Checks if a given number is a finite integer. (Throws an exception if check fails)
 *
 * @param { Number } value The number value to check.
 */ function isFiniteInteger(value) {
    return typeof value === 'number' && isFinite(value) && isInteger(value);
}
exports.isFiniteInteger = isFiniteInteger;
/**
 * Checks if an offset/length value is valid. (Throws an exception if check fails)
 *
 * @param value The value to check.
 * @param offset True if checking an offset, false if checking a length.
 */ function checkOffsetOrLengthValue(value, offset) {
    if (typeof value === 'number') {
        // Check for non finite/non integers
        if (!isFiniteInteger(value) || value < 0) {
            throw new Error(offset ? ERRORS.INVALID_OFFSET : ERRORS.INVALID_LENGTH);
        }
    } else {
        throw new Error(offset ? ERRORS.INVALID_OFFSET_NON_NUMBER : ERRORS.INVALID_LENGTH_NON_NUMBER);
    }
}
/**
 * Checks if a length value is valid. (Throws an exception if check fails)
 *
 * @param { Number } length The value to check.
 */ function checkLengthValue(length) {
    checkOffsetOrLengthValue(length, false);
}
exports.checkLengthValue = checkLengthValue;
/**
 * Checks if a offset value is valid. (Throws an exception if check fails)
 *
 * @param { Number } offset The value to check.
 */ function checkOffsetValue(offset) {
    checkOffsetOrLengthValue(offset, true);
}
exports.checkOffsetValue = checkOffsetValue;
/**
 * Checks if a target offset value is out of bounds. (Throws an exception if check fails)
 *
 * @param { Number } offset The offset value to check.
 * @param { SmartBuffer } buff The SmartBuffer instance to check against.
 */ function checkTargetOffset(offset, buff) {
    if (offset < 0 || offset > buff.length) {
        throw new Error(ERRORS.INVALID_TARGET_OFFSET);
    }
}
exports.checkTargetOffset = checkTargetOffset;
/**
 * Determines whether a given number is a integer.
 * @param value The number to check.
 */ function isInteger(value) {
    return typeof value === 'number' && isFinite(value) && Math.floor(value) === value;
}
/**
 * Throws if Node.js version is too low to support bigint
 */ function bigIntAndBufferInt64Check(bufferMethod) {
    if (typeof BigInt === 'undefined') {
        throw new Error('Platform does not support JS BigInt type.');
    }
    if (typeof buffer_1.Buffer.prototype[bufferMethod] === 'undefined') {
        throw new Error(`Platform does not support Buffer.prototype.${bufferMethod}.`);
    }
}
exports.bigIntAndBufferInt64Check = bigIntAndBufferInt64Check; //# sourceMappingURL=utils.js.map
}),
"[project]/Autonomous-Claims-Orchestrator/node_modules/smart-buffer/build/smartbuffer.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
const utils_1 = __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/smart-buffer/build/utils.js [app-route] (ecmascript)");
// The default Buffer size if one is not provided.
const DEFAULT_SMARTBUFFER_SIZE = 4096;
// The default string encoding to use for reading/writing strings.
const DEFAULT_SMARTBUFFER_ENCODING = 'utf8';
class SmartBuffer {
    /**
     * Creates a new SmartBuffer instance.
     *
     * @param options { SmartBufferOptions } The SmartBufferOptions to apply to this instance.
     */ constructor(options){
        this.length = 0;
        this._encoding = DEFAULT_SMARTBUFFER_ENCODING;
        this._writeOffset = 0;
        this._readOffset = 0;
        if (SmartBuffer.isSmartBufferOptions(options)) {
            // Checks for encoding
            if (options.encoding) {
                utils_1.checkEncoding(options.encoding);
                this._encoding = options.encoding;
            }
            // Checks for initial size length
            if (options.size) {
                if (utils_1.isFiniteInteger(options.size) && options.size > 0) {
                    this._buff = Buffer.allocUnsafe(options.size);
                } else {
                    throw new Error(utils_1.ERRORS.INVALID_SMARTBUFFER_SIZE);
                }
            // Check for initial Buffer
            } else if (options.buff) {
                if (Buffer.isBuffer(options.buff)) {
                    this._buff = options.buff;
                    this.length = options.buff.length;
                } else {
                    throw new Error(utils_1.ERRORS.INVALID_SMARTBUFFER_BUFFER);
                }
            } else {
                this._buff = Buffer.allocUnsafe(DEFAULT_SMARTBUFFER_SIZE);
            }
        } else {
            // If something was passed but it's not a SmartBufferOptions object
            if (typeof options !== 'undefined') {
                throw new Error(utils_1.ERRORS.INVALID_SMARTBUFFER_OBJECT);
            }
            // Otherwise default to sane options
            this._buff = Buffer.allocUnsafe(DEFAULT_SMARTBUFFER_SIZE);
        }
    }
    /**
     * Creates a new SmartBuffer instance with the provided internal Buffer size and optional encoding.
     *
     * @param size { Number } The size of the internal Buffer.
     * @param encoding { String } The BufferEncoding to use for strings.
     *
     * @return { SmartBuffer }
     */ static fromSize(size, encoding) {
        return new this({
            size: size,
            encoding: encoding
        });
    }
    /**
     * Creates a new SmartBuffer instance with the provided Buffer and optional encoding.
     *
     * @param buffer { Buffer } The Buffer to use as the internal Buffer value.
     * @param encoding { String } The BufferEncoding to use for strings.
     *
     * @return { SmartBuffer }
     */ static fromBuffer(buff, encoding) {
        return new this({
            buff: buff,
            encoding: encoding
        });
    }
    /**
     * Creates a new SmartBuffer instance with the provided SmartBufferOptions options.
     *
     * @param options { SmartBufferOptions } The options to use when creating the SmartBuffer instance.
     */ static fromOptions(options) {
        return new this(options);
    }
    /**
     * Type checking function that determines if an object is a SmartBufferOptions object.
     */ static isSmartBufferOptions(options) {
        const castOptions = options;
        return castOptions && (castOptions.encoding !== undefined || castOptions.size !== undefined || castOptions.buff !== undefined);
    }
    // Signed integers
    /**
     * Reads an Int8 value from the current read position or an optionally provided offset.
     *
     * @param offset { Number } The offset to read data from (optional)
     * @return { Number }
     */ readInt8(offset) {
        return this._readNumberValue(Buffer.prototype.readInt8, 1, offset);
    }
    /**
     * Reads an Int16BE value from the current read position or an optionally provided offset.
     *
     * @param offset { Number } The offset to read data from (optional)
     * @return { Number }
     */ readInt16BE(offset) {
        return this._readNumberValue(Buffer.prototype.readInt16BE, 2, offset);
    }
    /**
     * Reads an Int16LE value from the current read position or an optionally provided offset.
     *
     * @param offset { Number } The offset to read data from (optional)
     * @return { Number }
     */ readInt16LE(offset) {
        return this._readNumberValue(Buffer.prototype.readInt16LE, 2, offset);
    }
    /**
     * Reads an Int32BE value from the current read position or an optionally provided offset.
     *
     * @param offset { Number } The offset to read data from (optional)
     * @return { Number }
     */ readInt32BE(offset) {
        return this._readNumberValue(Buffer.prototype.readInt32BE, 4, offset);
    }
    /**
     * Reads an Int32LE value from the current read position or an optionally provided offset.
     *
     * @param offset { Number } The offset to read data from (optional)
     * @return { Number }
     */ readInt32LE(offset) {
        return this._readNumberValue(Buffer.prototype.readInt32LE, 4, offset);
    }
    /**
     * Reads a BigInt64BE value from the current read position or an optionally provided offset.
     *
     * @param offset { Number } The offset to read data from (optional)
     * @return { BigInt }
     */ readBigInt64BE(offset) {
        utils_1.bigIntAndBufferInt64Check('readBigInt64BE');
        return this._readNumberValue(Buffer.prototype.readBigInt64BE, 8, offset);
    }
    /**
     * Reads a BigInt64LE value from the current read position or an optionally provided offset.
     *
     * @param offset { Number } The offset to read data from (optional)
     * @return { BigInt }
     */ readBigInt64LE(offset) {
        utils_1.bigIntAndBufferInt64Check('readBigInt64LE');
        return this._readNumberValue(Buffer.prototype.readBigInt64LE, 8, offset);
    }
    /**
     * Writes an Int8 value to the current write position (or at optional offset).
     *
     * @param value { Number } The value to write.
     * @param offset { Number } The offset to write the value at.
     *
     * @return this
     */ writeInt8(value, offset) {
        this._writeNumberValue(Buffer.prototype.writeInt8, 1, value, offset);
        return this;
    }
    /**
     * Inserts an Int8 value at the given offset value.
     *
     * @param value { Number } The value to insert.
     * @param offset { Number } The offset to insert the value at.
     *
     * @return this
     */ insertInt8(value, offset) {
        return this._insertNumberValue(Buffer.prototype.writeInt8, 1, value, offset);
    }
    /**
     * Writes an Int16BE value to the current write position (or at optional offset).
     *
     * @param value { Number } The value to write.
     * @param offset { Number } The offset to write the value at.
     *
     * @return this
     */ writeInt16BE(value, offset) {
        return this._writeNumberValue(Buffer.prototype.writeInt16BE, 2, value, offset);
    }
    /**
     * Inserts an Int16BE value at the given offset value.
     *
     * @param value { Number } The value to insert.
     * @param offset { Number } The offset to insert the value at.
     *
     * @return this
     */ insertInt16BE(value, offset) {
        return this._insertNumberValue(Buffer.prototype.writeInt16BE, 2, value, offset);
    }
    /**
     * Writes an Int16LE value to the current write position (or at optional offset).
     *
     * @param value { Number } The value to write.
     * @param offset { Number } The offset to write the value at.
     *
     * @return this
     */ writeInt16LE(value, offset) {
        return this._writeNumberValue(Buffer.prototype.writeInt16LE, 2, value, offset);
    }
    /**
     * Inserts an Int16LE value at the given offset value.
     *
     * @param value { Number } The value to insert.
     * @param offset { Number } The offset to insert the value at.
     *
     * @return this
     */ insertInt16LE(value, offset) {
        return this._insertNumberValue(Buffer.prototype.writeInt16LE, 2, value, offset);
    }
    /**
     * Writes an Int32BE value to the current write position (or at optional offset).
     *
     * @param value { Number } The value to write.
     * @param offset { Number } The offset to write the value at.
     *
     * @return this
     */ writeInt32BE(value, offset) {
        return this._writeNumberValue(Buffer.prototype.writeInt32BE, 4, value, offset);
    }
    /**
     * Inserts an Int32BE value at the given offset value.
     *
     * @param value { Number } The value to insert.
     * @param offset { Number } The offset to insert the value at.
     *
     * @return this
     */ insertInt32BE(value, offset) {
        return this._insertNumberValue(Buffer.prototype.writeInt32BE, 4, value, offset);
    }
    /**
     * Writes an Int32LE value to the current write position (or at optional offset).
     *
     * @param value { Number } The value to write.
     * @param offset { Number } The offset to write the value at.
     *
     * @return this
     */ writeInt32LE(value, offset) {
        return this._writeNumberValue(Buffer.prototype.writeInt32LE, 4, value, offset);
    }
    /**
     * Inserts an Int32LE value at the given offset value.
     *
     * @param value { Number } The value to insert.
     * @param offset { Number } The offset to insert the value at.
     *
     * @return this
     */ insertInt32LE(value, offset) {
        return this._insertNumberValue(Buffer.prototype.writeInt32LE, 4, value, offset);
    }
    /**
     * Writes a BigInt64BE value to the current write position (or at optional offset).
     *
     * @param value { BigInt } The value to write.
     * @param offset { Number } The offset to write the value at.
     *
     * @return this
     */ writeBigInt64BE(value, offset) {
        utils_1.bigIntAndBufferInt64Check('writeBigInt64BE');
        return this._writeNumberValue(Buffer.prototype.writeBigInt64BE, 8, value, offset);
    }
    /**
     * Inserts a BigInt64BE value at the given offset value.
     *
     * @param value { BigInt } The value to insert.
     * @param offset { Number } The offset to insert the value at.
     *
     * @return this
     */ insertBigInt64BE(value, offset) {
        utils_1.bigIntAndBufferInt64Check('writeBigInt64BE');
        return this._insertNumberValue(Buffer.prototype.writeBigInt64BE, 8, value, offset);
    }
    /**
     * Writes a BigInt64LE value to the current write position (or at optional offset).
     *
     * @param value { BigInt } The value to write.
     * @param offset { Number } The offset to write the value at.
     *
     * @return this
     */ writeBigInt64LE(value, offset) {
        utils_1.bigIntAndBufferInt64Check('writeBigInt64LE');
        return this._writeNumberValue(Buffer.prototype.writeBigInt64LE, 8, value, offset);
    }
    /**
     * Inserts a Int64LE value at the given offset value.
     *
     * @param value { BigInt } The value to insert.
     * @param offset { Number } The offset to insert the value at.
     *
     * @return this
     */ insertBigInt64LE(value, offset) {
        utils_1.bigIntAndBufferInt64Check('writeBigInt64LE');
        return this._insertNumberValue(Buffer.prototype.writeBigInt64LE, 8, value, offset);
    }
    // Unsigned Integers
    /**
     * Reads an UInt8 value from the current read position or an optionally provided offset.
     *
     * @param offset { Number } The offset to read data from (optional)
     * @return { Number }
     */ readUInt8(offset) {
        return this._readNumberValue(Buffer.prototype.readUInt8, 1, offset);
    }
    /**
     * Reads an UInt16BE value from the current read position or an optionally provided offset.
     *
     * @param offset { Number } The offset to read data from (optional)
     * @return { Number }
     */ readUInt16BE(offset) {
        return this._readNumberValue(Buffer.prototype.readUInt16BE, 2, offset);
    }
    /**
     * Reads an UInt16LE value from the current read position or an optionally provided offset.
     *
     * @param offset { Number } The offset to read data from (optional)
     * @return { Number }
     */ readUInt16LE(offset) {
        return this._readNumberValue(Buffer.prototype.readUInt16LE, 2, offset);
    }
    /**
     * Reads an UInt32BE value from the current read position or an optionally provided offset.
     *
     * @param offset { Number } The offset to read data from (optional)
     * @return { Number }
     */ readUInt32BE(offset) {
        return this._readNumberValue(Buffer.prototype.readUInt32BE, 4, offset);
    }
    /**
     * Reads an UInt32LE value from the current read position or an optionally provided offset.
     *
     * @param offset { Number } The offset to read data from (optional)
     * @return { Number }
     */ readUInt32LE(offset) {
        return this._readNumberValue(Buffer.prototype.readUInt32LE, 4, offset);
    }
    /**
     * Reads a BigUInt64BE value from the current read position or an optionally provided offset.
     *
     * @param offset { Number } The offset to read data from (optional)
     * @return { BigInt }
     */ readBigUInt64BE(offset) {
        utils_1.bigIntAndBufferInt64Check('readBigUInt64BE');
        return this._readNumberValue(Buffer.prototype.readBigUInt64BE, 8, offset);
    }
    /**
     * Reads a BigUInt64LE value from the current read position or an optionally provided offset.
     *
     * @param offset { Number } The offset to read data from (optional)
     * @return { BigInt }
     */ readBigUInt64LE(offset) {
        utils_1.bigIntAndBufferInt64Check('readBigUInt64LE');
        return this._readNumberValue(Buffer.prototype.readBigUInt64LE, 8, offset);
    }
    /**
     * Writes an UInt8 value to the current write position (or at optional offset).
     *
     * @param value { Number } The value to write.
     * @param offset { Number } The offset to write the value at.
     *
     * @return this
     */ writeUInt8(value, offset) {
        return this._writeNumberValue(Buffer.prototype.writeUInt8, 1, value, offset);
    }
    /**
     * Inserts an UInt8 value at the given offset value.
     *
     * @param value { Number } The value to insert.
     * @param offset { Number } The offset to insert the value at.
     *
     * @return this
     */ insertUInt8(value, offset) {
        return this._insertNumberValue(Buffer.prototype.writeUInt8, 1, value, offset);
    }
    /**
     * Writes an UInt16BE value to the current write position (or at optional offset).
     *
     * @param value { Number } The value to write.
     * @param offset { Number } The offset to write the value at.
     *
     * @return this
     */ writeUInt16BE(value, offset) {
        return this._writeNumberValue(Buffer.prototype.writeUInt16BE, 2, value, offset);
    }
    /**
     * Inserts an UInt16BE value at the given offset value.
     *
     * @param value { Number } The value to insert.
     * @param offset { Number } The offset to insert the value at.
     *
     * @return this
     */ insertUInt16BE(value, offset) {
        return this._insertNumberValue(Buffer.prototype.writeUInt16BE, 2, value, offset);
    }
    /**
     * Writes an UInt16LE value to the current write position (or at optional offset).
     *
     * @param value { Number } The value to write.
     * @param offset { Number } The offset to write the value at.
     *
     * @return this
     */ writeUInt16LE(value, offset) {
        return this._writeNumberValue(Buffer.prototype.writeUInt16LE, 2, value, offset);
    }
    /**
     * Inserts an UInt16LE value at the given offset value.
     *
     * @param value { Number } The value to insert.
     * @param offset { Number } The offset to insert the value at.
     *
     * @return this
     */ insertUInt16LE(value, offset) {
        return this._insertNumberValue(Buffer.prototype.writeUInt16LE, 2, value, offset);
    }
    /**
     * Writes an UInt32BE value to the current write position (or at optional offset).
     *
     * @param value { Number } The value to write.
     * @param offset { Number } The offset to write the value at.
     *
     * @return this
     */ writeUInt32BE(value, offset) {
        return this._writeNumberValue(Buffer.prototype.writeUInt32BE, 4, value, offset);
    }
    /**
     * Inserts an UInt32BE value at the given offset value.
     *
     * @param value { Number } The value to insert.
     * @param offset { Number } The offset to insert the value at.
     *
     * @return this
     */ insertUInt32BE(value, offset) {
        return this._insertNumberValue(Buffer.prototype.writeUInt32BE, 4, value, offset);
    }
    /**
     * Writes an UInt32LE value to the current write position (or at optional offset).
     *
     * @param value { Number } The value to write.
     * @param offset { Number } The offset to write the value at.
     *
     * @return this
     */ writeUInt32LE(value, offset) {
        return this._writeNumberValue(Buffer.prototype.writeUInt32LE, 4, value, offset);
    }
    /**
     * Inserts an UInt32LE value at the given offset value.
     *
     * @param value { Number } The value to insert.
     * @param offset { Number } The offset to insert the value at.
     *
     * @return this
     */ insertUInt32LE(value, offset) {
        return this._insertNumberValue(Buffer.prototype.writeUInt32LE, 4, value, offset);
    }
    /**
     * Writes a BigUInt64BE value to the current write position (or at optional offset).
     *
     * @param value { Number } The value to write.
     * @param offset { Number } The offset to write the value at.
     *
     * @return this
     */ writeBigUInt64BE(value, offset) {
        utils_1.bigIntAndBufferInt64Check('writeBigUInt64BE');
        return this._writeNumberValue(Buffer.prototype.writeBigUInt64BE, 8, value, offset);
    }
    /**
     * Inserts a BigUInt64BE value at the given offset value.
     *
     * @param value { Number } The value to insert.
     * @param offset { Number } The offset to insert the value at.
     *
     * @return this
     */ insertBigUInt64BE(value, offset) {
        utils_1.bigIntAndBufferInt64Check('writeBigUInt64BE');
        return this._insertNumberValue(Buffer.prototype.writeBigUInt64BE, 8, value, offset);
    }
    /**
     * Writes a BigUInt64LE value to the current write position (or at optional offset).
     *
     * @param value { Number } The value to write.
     * @param offset { Number } The offset to write the value at.
     *
     * @return this
     */ writeBigUInt64LE(value, offset) {
        utils_1.bigIntAndBufferInt64Check('writeBigUInt64LE');
        return this._writeNumberValue(Buffer.prototype.writeBigUInt64LE, 8, value, offset);
    }
    /**
     * Inserts a BigUInt64LE value at the given offset value.
     *
     * @param value { Number } The value to insert.
     * @param offset { Number } The offset to insert the value at.
     *
     * @return this
     */ insertBigUInt64LE(value, offset) {
        utils_1.bigIntAndBufferInt64Check('writeBigUInt64LE');
        return this._insertNumberValue(Buffer.prototype.writeBigUInt64LE, 8, value, offset);
    }
    // Floating Point
    /**
     * Reads an FloatBE value from the current read position or an optionally provided offset.
     *
     * @param offset { Number } The offset to read data from (optional)
     * @return { Number }
     */ readFloatBE(offset) {
        return this._readNumberValue(Buffer.prototype.readFloatBE, 4, offset);
    }
    /**
     * Reads an FloatLE value from the current read position or an optionally provided offset.
     *
     * @param offset { Number } The offset to read data from (optional)
     * @return { Number }
     */ readFloatLE(offset) {
        return this._readNumberValue(Buffer.prototype.readFloatLE, 4, offset);
    }
    /**
     * Writes a FloatBE value to the current write position (or at optional offset).
     *
     * @param value { Number } The value to write.
     * @param offset { Number } The offset to write the value at.
     *
     * @return this
     */ writeFloatBE(value, offset) {
        return this._writeNumberValue(Buffer.prototype.writeFloatBE, 4, value, offset);
    }
    /**
     * Inserts a FloatBE value at the given offset value.
     *
     * @param value { Number } The value to insert.
     * @param offset { Number } The offset to insert the value at.
     *
     * @return this
     */ insertFloatBE(value, offset) {
        return this._insertNumberValue(Buffer.prototype.writeFloatBE, 4, value, offset);
    }
    /**
     * Writes a FloatLE value to the current write position (or at optional offset).
     *
     * @param value { Number } The value to write.
     * @param offset { Number } The offset to write the value at.
     *
     * @return this
     */ writeFloatLE(value, offset) {
        return this._writeNumberValue(Buffer.prototype.writeFloatLE, 4, value, offset);
    }
    /**
     * Inserts a FloatLE value at the given offset value.
     *
     * @param value { Number } The value to insert.
     * @param offset { Number } The offset to insert the value at.
     *
     * @return this
     */ insertFloatLE(value, offset) {
        return this._insertNumberValue(Buffer.prototype.writeFloatLE, 4, value, offset);
    }
    // Double Floating Point
    /**
     * Reads an DoublEBE value from the current read position or an optionally provided offset.
     *
     * @param offset { Number } The offset to read data from (optional)
     * @return { Number }
     */ readDoubleBE(offset) {
        return this._readNumberValue(Buffer.prototype.readDoubleBE, 8, offset);
    }
    /**
     * Reads an DoubleLE value from the current read position or an optionally provided offset.
     *
     * @param offset { Number } The offset to read data from (optional)
     * @return { Number }
     */ readDoubleLE(offset) {
        return this._readNumberValue(Buffer.prototype.readDoubleLE, 8, offset);
    }
    /**
     * Writes a DoubleBE value to the current write position (or at optional offset).
     *
     * @param value { Number } The value to write.
     * @param offset { Number } The offset to write the value at.
     *
     * @return this
     */ writeDoubleBE(value, offset) {
        return this._writeNumberValue(Buffer.prototype.writeDoubleBE, 8, value, offset);
    }
    /**
     * Inserts a DoubleBE value at the given offset value.
     *
     * @param value { Number } The value to insert.
     * @param offset { Number } The offset to insert the value at.
     *
     * @return this
     */ insertDoubleBE(value, offset) {
        return this._insertNumberValue(Buffer.prototype.writeDoubleBE, 8, value, offset);
    }
    /**
     * Writes a DoubleLE value to the current write position (or at optional offset).
     *
     * @param value { Number } The value to write.
     * @param offset { Number } The offset to write the value at.
     *
     * @return this
     */ writeDoubleLE(value, offset) {
        return this._writeNumberValue(Buffer.prototype.writeDoubleLE, 8, value, offset);
    }
    /**
     * Inserts a DoubleLE value at the given offset value.
     *
     * @param value { Number } The value to insert.
     * @param offset { Number } The offset to insert the value at.
     *
     * @return this
     */ insertDoubleLE(value, offset) {
        return this._insertNumberValue(Buffer.prototype.writeDoubleLE, 8, value, offset);
    }
    // Strings
    /**
     * Reads a String from the current read position.
     *
     * @param arg1 { Number | String } The number of bytes to read as a String, or the BufferEncoding to use for
     *             the string (Defaults to instance level encoding).
     * @param encoding { String } The BufferEncoding to use for the string (Defaults to instance level encoding).
     *
     * @return { String }
     */ readString(arg1, encoding) {
        let lengthVal;
        // Length provided
        if (typeof arg1 === 'number') {
            utils_1.checkLengthValue(arg1);
            lengthVal = Math.min(arg1, this.length - this._readOffset);
        } else {
            encoding = arg1;
            lengthVal = this.length - this._readOffset;
        }
        // Check encoding
        if (typeof encoding !== 'undefined') {
            utils_1.checkEncoding(encoding);
        }
        const value = this._buff.slice(this._readOffset, this._readOffset + lengthVal).toString(encoding || this._encoding);
        this._readOffset += lengthVal;
        return value;
    }
    /**
     * Inserts a String
     *
     * @param value { String } The String value to insert.
     * @param offset { Number } The offset to insert the string at.
     * @param encoding { String } The BufferEncoding to use for writing strings (defaults to instance encoding).
     *
     * @return this
     */ insertString(value, offset, encoding) {
        utils_1.checkOffsetValue(offset);
        return this._handleString(value, true, offset, encoding);
    }
    /**
     * Writes a String
     *
     * @param value { String } The String value to write.
     * @param arg2 { Number | String } The offset to write the string at, or the BufferEncoding to use.
     * @param encoding { String } The BufferEncoding to use for writing strings (defaults to instance encoding).
     *
     * @return this
     */ writeString(value, arg2, encoding) {
        return this._handleString(value, false, arg2, encoding);
    }
    /**
     * Reads a null-terminated String from the current read position.
     *
     * @param encoding { String } The BufferEncoding to use for the string (Defaults to instance level encoding).
     *
     * @return { String }
     */ readStringNT(encoding) {
        if (typeof encoding !== 'undefined') {
            utils_1.checkEncoding(encoding);
        }
        // Set null character position to the end SmartBuffer instance.
        let nullPos = this.length;
        // Find next null character (if one is not found, default from above is used)
        for(let i = this._readOffset; i < this.length; i++){
            if (this._buff[i] === 0x00) {
                nullPos = i;
                break;
            }
        }
        // Read string value
        const value = this._buff.slice(this._readOffset, nullPos);
        // Increment internal Buffer read offset
        this._readOffset = nullPos + 1;
        return value.toString(encoding || this._encoding);
    }
    /**
     * Inserts a null-terminated String.
     *
     * @param value { String } The String value to write.
     * @param arg2 { Number | String } The offset to write the string to, or the BufferEncoding to use.
     * @param encoding { String } The BufferEncoding to use for writing strings (defaults to instance encoding).
     *
     * @return this
     */ insertStringNT(value, offset, encoding) {
        utils_1.checkOffsetValue(offset);
        // Write Values
        this.insertString(value, offset, encoding);
        this.insertUInt8(0x00, offset + value.length);
        return this;
    }
    /**
     * Writes a null-terminated String.
     *
     * @param value { String } The String value to write.
     * @param arg2 { Number | String } The offset to write the string to, or the BufferEncoding to use.
     * @param encoding { String } The BufferEncoding to use for writing strings (defaults to instance encoding).
     *
     * @return this
     */ writeStringNT(value, arg2, encoding) {
        // Write Values
        this.writeString(value, arg2, encoding);
        this.writeUInt8(0x00, typeof arg2 === 'number' ? arg2 + value.length : this.writeOffset);
        return this;
    }
    // Buffers
    /**
     * Reads a Buffer from the internal read position.
     *
     * @param length { Number } The length of data to read as a Buffer.
     *
     * @return { Buffer }
     */ readBuffer(length) {
        if (typeof length !== 'undefined') {
            utils_1.checkLengthValue(length);
        }
        const lengthVal = typeof length === 'number' ? length : this.length;
        const endPoint = Math.min(this.length, this._readOffset + lengthVal);
        // Read buffer value
        const value = this._buff.slice(this._readOffset, endPoint);
        // Increment internal Buffer read offset
        this._readOffset = endPoint;
        return value;
    }
    /**
     * Writes a Buffer to the current write position.
     *
     * @param value { Buffer } The Buffer to write.
     * @param offset { Number } The offset to write the Buffer to.
     *
     * @return this
     */ insertBuffer(value, offset) {
        utils_1.checkOffsetValue(offset);
        return this._handleBuffer(value, true, offset);
    }
    /**
     * Writes a Buffer to the current write position.
     *
     * @param value { Buffer } The Buffer to write.
     * @param offset { Number } The offset to write the Buffer to.
     *
     * @return this
     */ writeBuffer(value, offset) {
        return this._handleBuffer(value, false, offset);
    }
    /**
     * Reads a null-terminated Buffer from the current read poisiton.
     *
     * @return { Buffer }
     */ readBufferNT() {
        // Set null character position to the end SmartBuffer instance.
        let nullPos = this.length;
        // Find next null character (if one is not found, default from above is used)
        for(let i = this._readOffset; i < this.length; i++){
            if (this._buff[i] === 0x00) {
                nullPos = i;
                break;
            }
        }
        // Read value
        const value = this._buff.slice(this._readOffset, nullPos);
        // Increment internal Buffer read offset
        this._readOffset = nullPos + 1;
        return value;
    }
    /**
     * Inserts a null-terminated Buffer.
     *
     * @param value { Buffer } The Buffer to write.
     * @param offset { Number } The offset to write the Buffer to.
     *
     * @return this
     */ insertBufferNT(value, offset) {
        utils_1.checkOffsetValue(offset);
        // Write Values
        this.insertBuffer(value, offset);
        this.insertUInt8(0x00, offset + value.length);
        return this;
    }
    /**
     * Writes a null-terminated Buffer.
     *
     * @param value { Buffer } The Buffer to write.
     * @param offset { Number } The offset to write the Buffer to.
     *
     * @return this
     */ writeBufferNT(value, offset) {
        // Checks for valid numberic value;
        if (typeof offset !== 'undefined') {
            utils_1.checkOffsetValue(offset);
        }
        // Write Values
        this.writeBuffer(value, offset);
        this.writeUInt8(0x00, typeof offset === 'number' ? offset + value.length : this._writeOffset);
        return this;
    }
    /**
     * Clears the SmartBuffer instance to its original empty state.
     */ clear() {
        this._writeOffset = 0;
        this._readOffset = 0;
        this.length = 0;
        return this;
    }
    /**
     * Gets the remaining data left to be read from the SmartBuffer instance.
     *
     * @return { Number }
     */ remaining() {
        return this.length - this._readOffset;
    }
    /**
     * Gets the current read offset value of the SmartBuffer instance.
     *
     * @return { Number }
     */ get readOffset() {
        return this._readOffset;
    }
    /**
     * Sets the read offset value of the SmartBuffer instance.
     *
     * @param offset { Number } - The offset value to set.
     */ set readOffset(offset) {
        utils_1.checkOffsetValue(offset);
        // Check for bounds.
        utils_1.checkTargetOffset(offset, this);
        this._readOffset = offset;
    }
    /**
     * Gets the current write offset value of the SmartBuffer instance.
     *
     * @return { Number }
     */ get writeOffset() {
        return this._writeOffset;
    }
    /**
     * Sets the write offset value of the SmartBuffer instance.
     *
     * @param offset { Number } - The offset value to set.
     */ set writeOffset(offset) {
        utils_1.checkOffsetValue(offset);
        // Check for bounds.
        utils_1.checkTargetOffset(offset, this);
        this._writeOffset = offset;
    }
    /**
     * Gets the currently set string encoding of the SmartBuffer instance.
     *
     * @return { BufferEncoding } The string Buffer encoding currently set.
     */ get encoding() {
        return this._encoding;
    }
    /**
     * Sets the string encoding of the SmartBuffer instance.
     *
     * @param encoding { BufferEncoding } The string Buffer encoding to set.
     */ set encoding(encoding) {
        utils_1.checkEncoding(encoding);
        this._encoding = encoding;
    }
    /**
     * Gets the underlying internal Buffer. (This includes unmanaged data in the Buffer)
     *
     * @return { Buffer } The Buffer value.
     */ get internalBuffer() {
        return this._buff;
    }
    /**
     * Gets the value of the internal managed Buffer (Includes managed data only)
     *
     * @param { Buffer }
     */ toBuffer() {
        return this._buff.slice(0, this.length);
    }
    /**
     * Gets the String value of the internal managed Buffer
     *
     * @param encoding { String } The BufferEncoding to display the Buffer as (defaults to instance level encoding).
     */ toString(encoding) {
        const encodingVal = typeof encoding === 'string' ? encoding : this._encoding;
        // Check for invalid encoding.
        utils_1.checkEncoding(encodingVal);
        return this._buff.toString(encodingVal, 0, this.length);
    }
    /**
     * Destroys the SmartBuffer instance.
     */ destroy() {
        this.clear();
        return this;
    }
    /**
     * Handles inserting and writing strings.
     *
     * @param value { String } The String value to insert.
     * @param isInsert { Boolean } True if inserting a string, false if writing.
     * @param arg2 { Number | String } The offset to insert the string at, or the BufferEncoding to use.
     * @param encoding { String } The BufferEncoding to use for writing strings (defaults to instance encoding).
     */ _handleString(value, isInsert, arg3, encoding) {
        let offsetVal = this._writeOffset;
        let encodingVal = this._encoding;
        // Check for offset
        if (typeof arg3 === 'number') {
            offsetVal = arg3;
        // Check for encoding
        } else if (typeof arg3 === 'string') {
            utils_1.checkEncoding(arg3);
            encodingVal = arg3;
        }
        // Check for encoding (third param)
        if (typeof encoding === 'string') {
            utils_1.checkEncoding(encoding);
            encodingVal = encoding;
        }
        // Calculate bytelength of string.
        const byteLength = Buffer.byteLength(value, encodingVal);
        // Ensure there is enough internal Buffer capacity.
        if (isInsert) {
            this.ensureInsertable(byteLength, offsetVal);
        } else {
            this._ensureWriteable(byteLength, offsetVal);
        }
        // Write value
        this._buff.write(value, offsetVal, byteLength, encodingVal);
        // Increment internal Buffer write offset;
        if (isInsert) {
            this._writeOffset += byteLength;
        } else {
            // If an offset was given, check to see if we wrote beyond the current writeOffset.
            if (typeof arg3 === 'number') {
                this._writeOffset = Math.max(this._writeOffset, offsetVal + byteLength);
            } else {
                // If no offset was given, we wrote to the end of the SmartBuffer so increment writeOffset.
                this._writeOffset += byteLength;
            }
        }
        return this;
    }
    /**
     * Handles writing or insert of a Buffer.
     *
     * @param value { Buffer } The Buffer to write.
     * @param offset { Number } The offset to write the Buffer to.
     */ _handleBuffer(value, isInsert, offset) {
        const offsetVal = typeof offset === 'number' ? offset : this._writeOffset;
        // Ensure there is enough internal Buffer capacity.
        if (isInsert) {
            this.ensureInsertable(value.length, offsetVal);
        } else {
            this._ensureWriteable(value.length, offsetVal);
        }
        // Write buffer value
        value.copy(this._buff, offsetVal);
        // Increment internal Buffer write offset;
        if (isInsert) {
            this._writeOffset += value.length;
        } else {
            // If an offset was given, check to see if we wrote beyond the current writeOffset.
            if (typeof offset === 'number') {
                this._writeOffset = Math.max(this._writeOffset, offsetVal + value.length);
            } else {
                // If no offset was given, we wrote to the end of the SmartBuffer so increment writeOffset.
                this._writeOffset += value.length;
            }
        }
        return this;
    }
    /**
     * Ensures that the internal Buffer is large enough to read data.
     *
     * @param length { Number } The length of the data that needs to be read.
     * @param offset { Number } The offset of the data that needs to be read.
     */ ensureReadable(length, offset) {
        // Offset value defaults to managed read offset.
        let offsetVal = this._readOffset;
        // If an offset was provided, use it.
        if (typeof offset !== 'undefined') {
            // Checks for valid numberic value;
            utils_1.checkOffsetValue(offset);
            // Overide with custom offset.
            offsetVal = offset;
        }
        // Checks if offset is below zero, or the offset+length offset is beyond the total length of the managed data.
        if (offsetVal < 0 || offsetVal + length > this.length) {
            throw new Error(utils_1.ERRORS.INVALID_READ_BEYOND_BOUNDS);
        }
    }
    /**
     * Ensures that the internal Buffer is large enough to insert data.
     *
     * @param dataLength { Number } The length of the data that needs to be written.
     * @param offset { Number } The offset of the data to be written.
     */ ensureInsertable(dataLength, offset) {
        // Checks for valid numberic value;
        utils_1.checkOffsetValue(offset);
        // Ensure there is enough internal Buffer capacity.
        this._ensureCapacity(this.length + dataLength);
        // If an offset was provided and its not the very end of the buffer, copy data into appropriate location in regards to the offset.
        if (offset < this.length) {
            this._buff.copy(this._buff, offset + dataLength, offset, this._buff.length);
        }
        // Adjust tracked smart buffer length
        if (offset + dataLength > this.length) {
            this.length = offset + dataLength;
        } else {
            this.length += dataLength;
        }
    }
    /**
     * Ensures that the internal Buffer is large enough to write data.
     *
     * @param dataLength { Number } The length of the data that needs to be written.
     * @param offset { Number } The offset of the data to be written (defaults to writeOffset).
     */ _ensureWriteable(dataLength, offset) {
        const offsetVal = typeof offset === 'number' ? offset : this._writeOffset;
        // Ensure enough capacity to write data.
        this._ensureCapacity(offsetVal + dataLength);
        // Adjust SmartBuffer length (if offset + length is larger than managed length, adjust length)
        if (offsetVal + dataLength > this.length) {
            this.length = offsetVal + dataLength;
        }
    }
    /**
     * Ensures that the internal Buffer is large enough to write at least the given amount of data.
     *
     * @param minLength { Number } The minimum length of the data needs to be written.
     */ _ensureCapacity(minLength) {
        const oldLength = this._buff.length;
        if (minLength > oldLength) {
            let data = this._buff;
            let newLength = oldLength * 3 / 2 + 1;
            if (newLength < minLength) {
                newLength = minLength;
            }
            this._buff = Buffer.allocUnsafe(newLength);
            data.copy(this._buff, 0, 0, oldLength);
        }
    }
    /**
     * Reads a numeric number value using the provided function.
     *
     * @typeparam T { number | bigint } The type of the value to be read
     *
     * @param func { Function(offset: number) => number } The function to read data on the internal Buffer with.
     * @param byteSize { Number } The number of bytes read.
     * @param offset { Number } The offset to read from (optional). When this is not provided, the managed readOffset is used instead.
     *
     * @returns { T } the number value
     */ _readNumberValue(func, byteSize, offset) {
        this.ensureReadable(byteSize, offset);
        // Call Buffer.readXXXX();
        const value = func.call(this._buff, typeof offset === 'number' ? offset : this._readOffset);
        // Adjust internal read offset if an optional read offset was not provided.
        if (typeof offset === 'undefined') {
            this._readOffset += byteSize;
        }
        return value;
    }
    /**
     * Inserts a numeric number value based on the given offset and value.
     *
     * @typeparam T { number | bigint } The type of the value to be written
     *
     * @param func { Function(offset: T, offset?) => number} The function to write data on the internal Buffer with.
     * @param byteSize { Number } The number of bytes written.
     * @param value { T } The number value to write.
     * @param offset { Number } the offset to write the number at (REQUIRED).
     *
     * @returns SmartBuffer this buffer
     */ _insertNumberValue(func, byteSize, value, offset) {
        // Check for invalid offset values.
        utils_1.checkOffsetValue(offset);
        // Ensure there is enough internal Buffer capacity. (raw offset is passed)
        this.ensureInsertable(byteSize, offset);
        // Call buffer.writeXXXX();
        func.call(this._buff, value, offset);
        // Adjusts internally managed write offset.
        this._writeOffset += byteSize;
        return this;
    }
    /**
     * Writes a numeric number value based on the given offset and value.
     *
     * @typeparam T { number | bigint } The type of the value to be written
     *
     * @param func { Function(offset: T, offset?) => number} The function to write data on the internal Buffer with.
     * @param byteSize { Number } The number of bytes written.
     * @param value { T } The number value to write.
     * @param offset { Number } the offset to write the number at (REQUIRED).
     *
     * @returns SmartBuffer this buffer
     */ _writeNumberValue(func, byteSize, value, offset) {
        // If an offset was provided, validate it.
        if (typeof offset === 'number') {
            // Check if we're writing beyond the bounds of the managed data.
            if (offset < 0) {
                throw new Error(utils_1.ERRORS.INVALID_WRITE_BEYOND_BOUNDS);
            }
            utils_1.checkOffsetValue(offset);
        }
        // Default to writeOffset if no offset value was given.
        const offsetVal = typeof offset === 'number' ? offset : this._writeOffset;
        // Ensure there is enough internal Buffer capacity. (raw offset is passed)
        this._ensureWriteable(byteSize, offsetVal);
        func.call(this._buff, value, offsetVal);
        // If an offset was given, check to see if we wrote beyond the current writeOffset.
        if (typeof offset === 'number') {
            this._writeOffset = Math.max(this._writeOffset, offsetVal + byteSize);
        } else {
            // If no numeric offset was given, we wrote to the end of the SmartBuffer so increment writeOffset.
            this._writeOffset += byteSize;
        }
        return this;
    }
}
exports.SmartBuffer = SmartBuffer; //# sourceMappingURL=smartbuffer.js.map
}),
"[project]/Autonomous-Claims-Orchestrator/node_modules/socks/build/common/constants.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.SOCKS5_NO_ACCEPTABLE_AUTH = exports.SOCKS5_CUSTOM_AUTH_END = exports.SOCKS5_CUSTOM_AUTH_START = exports.SOCKS_INCOMING_PACKET_SIZES = exports.SocksClientState = exports.Socks5Response = exports.Socks5HostType = exports.Socks5Auth = exports.Socks4Response = exports.SocksCommand = exports.ERRORS = exports.DEFAULT_TIMEOUT = void 0;
const DEFAULT_TIMEOUT = 30000;
exports.DEFAULT_TIMEOUT = DEFAULT_TIMEOUT;
// prettier-ignore
const ERRORS = {
    InvalidSocksCommand: 'An invalid SOCKS command was provided. Valid options are connect, bind, and associate.',
    InvalidSocksCommandForOperation: 'An invalid SOCKS command was provided. Only a subset of commands are supported for this operation.',
    InvalidSocksCommandChain: 'An invalid SOCKS command was provided. Chaining currently only supports the connect command.',
    InvalidSocksClientOptionsDestination: 'An invalid destination host was provided.',
    InvalidSocksClientOptionsExistingSocket: 'An invalid existing socket was provided. This should be an instance of stream.Duplex.',
    InvalidSocksClientOptionsProxy: 'Invalid SOCKS proxy details were provided.',
    InvalidSocksClientOptionsTimeout: 'An invalid timeout value was provided. Please enter a value above 0 (in ms).',
    InvalidSocksClientOptionsProxiesLength: 'At least two socks proxies must be provided for chaining.',
    InvalidSocksClientOptionsCustomAuthRange: 'Custom auth must be a value between 0x80 and 0xFE.',
    InvalidSocksClientOptionsCustomAuthOptions: 'When a custom_auth_method is provided, custom_auth_request_handler, custom_auth_response_size, and custom_auth_response_handler must also be provided and valid.',
    NegotiationError: 'Negotiation error',
    SocketClosed: 'Socket closed',
    ProxyConnectionTimedOut: 'Proxy connection timed out',
    InternalError: 'SocksClient internal error (this should not happen)',
    InvalidSocks4HandshakeResponse: 'Received invalid Socks4 handshake response',
    Socks4ProxyRejectedConnection: 'Socks4 Proxy rejected connection',
    InvalidSocks4IncomingConnectionResponse: 'Socks4 invalid incoming connection response',
    Socks4ProxyRejectedIncomingBoundConnection: 'Socks4 Proxy rejected incoming bound connection',
    InvalidSocks5InitialHandshakeResponse: 'Received invalid Socks5 initial handshake response',
    InvalidSocks5IntiailHandshakeSocksVersion: 'Received invalid Socks5 initial handshake (invalid socks version)',
    InvalidSocks5InitialHandshakeNoAcceptedAuthType: 'Received invalid Socks5 initial handshake (no accepted authentication type)',
    InvalidSocks5InitialHandshakeUnknownAuthType: 'Received invalid Socks5 initial handshake (unknown authentication type)',
    Socks5AuthenticationFailed: 'Socks5 Authentication failed',
    InvalidSocks5FinalHandshake: 'Received invalid Socks5 final handshake response',
    InvalidSocks5FinalHandshakeRejected: 'Socks5 proxy rejected connection',
    InvalidSocks5IncomingConnectionResponse: 'Received invalid Socks5 incoming connection response',
    Socks5ProxyRejectedIncomingBoundConnection: 'Socks5 Proxy rejected incoming bound connection'
};
exports.ERRORS = ERRORS;
const SOCKS_INCOMING_PACKET_SIZES = {
    Socks5InitialHandshakeResponse: 2,
    Socks5UserPassAuthenticationResponse: 2,
    // Command response + incoming connection (bind)
    Socks5ResponseHeader: 5,
    Socks5ResponseIPv4: 10,
    Socks5ResponseIPv6: 22,
    Socks5ResponseHostname: (hostNameLength)=>hostNameLength + 7,
    // Command response + incoming connection (bind)
    Socks4Response: 8
};
exports.SOCKS_INCOMING_PACKET_SIZES = SOCKS_INCOMING_PACKET_SIZES;
var SocksCommand;
(function(SocksCommand) {
    SocksCommand[SocksCommand["connect"] = 1] = "connect";
    SocksCommand[SocksCommand["bind"] = 2] = "bind";
    SocksCommand[SocksCommand["associate"] = 3] = "associate";
})(SocksCommand || (exports.SocksCommand = SocksCommand = {}));
var Socks4Response;
(function(Socks4Response) {
    Socks4Response[Socks4Response["Granted"] = 90] = "Granted";
    Socks4Response[Socks4Response["Failed"] = 91] = "Failed";
    Socks4Response[Socks4Response["Rejected"] = 92] = "Rejected";
    Socks4Response[Socks4Response["RejectedIdent"] = 93] = "RejectedIdent";
})(Socks4Response || (exports.Socks4Response = Socks4Response = {}));
var Socks5Auth;
(function(Socks5Auth) {
    Socks5Auth[Socks5Auth["NoAuth"] = 0] = "NoAuth";
    Socks5Auth[Socks5Auth["GSSApi"] = 1] = "GSSApi";
    Socks5Auth[Socks5Auth["UserPass"] = 2] = "UserPass";
})(Socks5Auth || (exports.Socks5Auth = Socks5Auth = {}));
const SOCKS5_CUSTOM_AUTH_START = 0x80;
exports.SOCKS5_CUSTOM_AUTH_START = SOCKS5_CUSTOM_AUTH_START;
const SOCKS5_CUSTOM_AUTH_END = 0xfe;
exports.SOCKS5_CUSTOM_AUTH_END = SOCKS5_CUSTOM_AUTH_END;
const SOCKS5_NO_ACCEPTABLE_AUTH = 0xff;
exports.SOCKS5_NO_ACCEPTABLE_AUTH = SOCKS5_NO_ACCEPTABLE_AUTH;
var Socks5Response;
(function(Socks5Response) {
    Socks5Response[Socks5Response["Granted"] = 0] = "Granted";
    Socks5Response[Socks5Response["Failure"] = 1] = "Failure";
    Socks5Response[Socks5Response["NotAllowed"] = 2] = "NotAllowed";
    Socks5Response[Socks5Response["NetworkUnreachable"] = 3] = "NetworkUnreachable";
    Socks5Response[Socks5Response["HostUnreachable"] = 4] = "HostUnreachable";
    Socks5Response[Socks5Response["ConnectionRefused"] = 5] = "ConnectionRefused";
    Socks5Response[Socks5Response["TTLExpired"] = 6] = "TTLExpired";
    Socks5Response[Socks5Response["CommandNotSupported"] = 7] = "CommandNotSupported";
    Socks5Response[Socks5Response["AddressNotSupported"] = 8] = "AddressNotSupported";
})(Socks5Response || (exports.Socks5Response = Socks5Response = {}));
var Socks5HostType;
(function(Socks5HostType) {
    Socks5HostType[Socks5HostType["IPv4"] = 1] = "IPv4";
    Socks5HostType[Socks5HostType["Hostname"] = 3] = "Hostname";
    Socks5HostType[Socks5HostType["IPv6"] = 4] = "IPv6";
})(Socks5HostType || (exports.Socks5HostType = Socks5HostType = {}));
var SocksClientState;
(function(SocksClientState) {
    SocksClientState[SocksClientState["Created"] = 0] = "Created";
    SocksClientState[SocksClientState["Connecting"] = 1] = "Connecting";
    SocksClientState[SocksClientState["Connected"] = 2] = "Connected";
    SocksClientState[SocksClientState["SentInitialHandshake"] = 3] = "SentInitialHandshake";
    SocksClientState[SocksClientState["ReceivedInitialHandshakeResponse"] = 4] = "ReceivedInitialHandshakeResponse";
    SocksClientState[SocksClientState["SentAuthentication"] = 5] = "SentAuthentication";
    SocksClientState[SocksClientState["ReceivedAuthenticationResponse"] = 6] = "ReceivedAuthenticationResponse";
    SocksClientState[SocksClientState["SentFinalHandshake"] = 7] = "SentFinalHandshake";
    SocksClientState[SocksClientState["ReceivedFinalResponse"] = 8] = "ReceivedFinalResponse";
    SocksClientState[SocksClientState["BoundWaitingForConnection"] = 9] = "BoundWaitingForConnection";
    SocksClientState[SocksClientState["Established"] = 10] = "Established";
    SocksClientState[SocksClientState["Disconnected"] = 11] = "Disconnected";
    SocksClientState[SocksClientState["Error"] = 99] = "Error";
})(SocksClientState || (exports.SocksClientState = SocksClientState = {})); //# sourceMappingURL=constants.js.map
}),
"[project]/Autonomous-Claims-Orchestrator/node_modules/socks/build/common/util.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.shuffleArray = exports.SocksClientError = void 0;
/**
 * Error wrapper for SocksClient
 */ class SocksClientError extends Error {
    constructor(message, options){
        super(message);
        this.options = options;
    }
}
exports.SocksClientError = SocksClientError;
/**
 * Shuffles a given array.
 * @param array The array to shuffle.
 */ function shuffleArray(array) {
    for(let i = array.length - 1; i > 0; i--){
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [
            array[j],
            array[i]
        ];
    }
}
exports.shuffleArray = shuffleArray; //# sourceMappingURL=util.js.map
}),
"[project]/Autonomous-Claims-Orchestrator/node_modules/socks/build/common/helpers.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ipToBuffer = exports.int32ToIpv4 = exports.ipv4ToInt32 = exports.validateSocksClientChainOptions = exports.validateSocksClientOptions = void 0;
const util_1 = __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/socks/build/common/util.js [app-route] (ecmascript)");
const constants_1 = __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/socks/build/common/constants.js [app-route] (ecmascript)");
const stream = __turbopack_context__.r("[externals]/stream [external] (stream, cjs)");
const ip_address_1 = __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/ip-address/dist/ip-address.js [app-route] (ecmascript)");
const net = __turbopack_context__.r("[externals]/net [external] (net, cjs)");
/**
 * Validates the provided SocksClientOptions
 * @param options { SocksClientOptions }
 * @param acceptedCommands { string[] } A list of accepted SocksProxy commands.
 */ function validateSocksClientOptions(options, acceptedCommands = [
    'connect',
    'bind',
    'associate'
]) {
    // Check SOCKs command option.
    if (!constants_1.SocksCommand[options.command]) {
        throw new util_1.SocksClientError(constants_1.ERRORS.InvalidSocksCommand, options);
    }
    // Check SocksCommand for acceptable command.
    if (acceptedCommands.indexOf(options.command) === -1) {
        throw new util_1.SocksClientError(constants_1.ERRORS.InvalidSocksCommandForOperation, options);
    }
    // Check destination
    if (!isValidSocksRemoteHost(options.destination)) {
        throw new util_1.SocksClientError(constants_1.ERRORS.InvalidSocksClientOptionsDestination, options);
    }
    // Check SOCKS proxy to use
    if (!isValidSocksProxy(options.proxy)) {
        throw new util_1.SocksClientError(constants_1.ERRORS.InvalidSocksClientOptionsProxy, options);
    }
    // Validate custom auth (if set)
    validateCustomProxyAuth(options.proxy, options);
    // Check timeout
    if (options.timeout && !isValidTimeoutValue(options.timeout)) {
        throw new util_1.SocksClientError(constants_1.ERRORS.InvalidSocksClientOptionsTimeout, options);
    }
    // Check existing_socket (if provided)
    if (options.existing_socket && !(options.existing_socket instanceof stream.Duplex)) {
        throw new util_1.SocksClientError(constants_1.ERRORS.InvalidSocksClientOptionsExistingSocket, options);
    }
}
exports.validateSocksClientOptions = validateSocksClientOptions;
/**
 * Validates the SocksClientChainOptions
 * @param options { SocksClientChainOptions }
 */ function validateSocksClientChainOptions(options) {
    // Only connect is supported when chaining.
    if (options.command !== 'connect') {
        throw new util_1.SocksClientError(constants_1.ERRORS.InvalidSocksCommandChain, options);
    }
    // Check destination
    if (!isValidSocksRemoteHost(options.destination)) {
        throw new util_1.SocksClientError(constants_1.ERRORS.InvalidSocksClientOptionsDestination, options);
    }
    // Validate proxies (length)
    if (!(options.proxies && Array.isArray(options.proxies) && options.proxies.length >= 2)) {
        throw new util_1.SocksClientError(constants_1.ERRORS.InvalidSocksClientOptionsProxiesLength, options);
    }
    // Validate proxies
    options.proxies.forEach((proxy)=>{
        if (!isValidSocksProxy(proxy)) {
            throw new util_1.SocksClientError(constants_1.ERRORS.InvalidSocksClientOptionsProxy, options);
        }
        // Validate custom auth (if set)
        validateCustomProxyAuth(proxy, options);
    });
    // Check timeout
    if (options.timeout && !isValidTimeoutValue(options.timeout)) {
        throw new util_1.SocksClientError(constants_1.ERRORS.InvalidSocksClientOptionsTimeout, options);
    }
}
exports.validateSocksClientChainOptions = validateSocksClientChainOptions;
function validateCustomProxyAuth(proxy, options) {
    if (proxy.custom_auth_method !== undefined) {
        // Invalid auth method range
        if (proxy.custom_auth_method < constants_1.SOCKS5_CUSTOM_AUTH_START || proxy.custom_auth_method > constants_1.SOCKS5_CUSTOM_AUTH_END) {
            throw new util_1.SocksClientError(constants_1.ERRORS.InvalidSocksClientOptionsCustomAuthRange, options);
        }
        // Missing custom_auth_request_handler
        if (proxy.custom_auth_request_handler === undefined || typeof proxy.custom_auth_request_handler !== 'function') {
            throw new util_1.SocksClientError(constants_1.ERRORS.InvalidSocksClientOptionsCustomAuthOptions, options);
        }
        // Missing custom_auth_response_size
        if (proxy.custom_auth_response_size === undefined) {
            throw new util_1.SocksClientError(constants_1.ERRORS.InvalidSocksClientOptionsCustomAuthOptions, options);
        }
        // Missing/invalid custom_auth_response_handler
        if (proxy.custom_auth_response_handler === undefined || typeof proxy.custom_auth_response_handler !== 'function') {
            throw new util_1.SocksClientError(constants_1.ERRORS.InvalidSocksClientOptionsCustomAuthOptions, options);
        }
    }
}
/**
 * Validates a SocksRemoteHost
 * @param remoteHost { SocksRemoteHost }
 */ function isValidSocksRemoteHost(remoteHost) {
    return remoteHost && typeof remoteHost.host === 'string' && Buffer.byteLength(remoteHost.host) < 256 && typeof remoteHost.port === 'number' && remoteHost.port >= 0 && remoteHost.port <= 65535;
}
/**
 * Validates a SocksProxy
 * @param proxy { SocksProxy }
 */ function isValidSocksProxy(proxy) {
    return proxy && (typeof proxy.host === 'string' || typeof proxy.ipaddress === 'string') && typeof proxy.port === 'number' && proxy.port >= 0 && proxy.port <= 65535 && (proxy.type === 4 || proxy.type === 5);
}
/**
 * Validates a timeout value.
 * @param value { Number }
 */ function isValidTimeoutValue(value) {
    return typeof value === 'number' && value > 0;
}
function ipv4ToInt32(ip) {
    const address = new ip_address_1.Address4(ip);
    // Convert the IPv4 address parts to an integer
    return address.toArray().reduce((acc, part)=>(acc << 8) + part, 0) >>> 0;
}
exports.ipv4ToInt32 = ipv4ToInt32;
function int32ToIpv4(int32) {
    // Extract each byte (octet) from the 32-bit integer
    const octet1 = int32 >>> 24 & 0xff;
    const octet2 = int32 >>> 16 & 0xff;
    const octet3 = int32 >>> 8 & 0xff;
    const octet4 = int32 & 0xff;
    // Combine the octets into a string in IPv4 format
    return [
        octet1,
        octet2,
        octet3,
        octet4
    ].join('.');
}
exports.int32ToIpv4 = int32ToIpv4;
function ipToBuffer(ip) {
    if (net.isIPv4(ip)) {
        // Handle IPv4 addresses
        const address = new ip_address_1.Address4(ip);
        return Buffer.from(address.toArray());
    } else if (net.isIPv6(ip)) {
        // Handle IPv6 addresses
        const address = new ip_address_1.Address6(ip);
        return Buffer.from(address.canonicalForm().split(':').map((segment)=>segment.padStart(4, '0')).join(''), 'hex');
    } else {
        throw new Error('Invalid IP address format');
    }
}
exports.ipToBuffer = ipToBuffer; //# sourceMappingURL=helpers.js.map
}),
"[project]/Autonomous-Claims-Orchestrator/node_modules/socks/build/common/receivebuffer.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ReceiveBuffer = void 0;
class ReceiveBuffer {
    constructor(size = 4096){
        this.buffer = Buffer.allocUnsafe(size);
        this.offset = 0;
        this.originalSize = size;
    }
    get length() {
        return this.offset;
    }
    append(data) {
        if (!Buffer.isBuffer(data)) {
            throw new Error('Attempted to append a non-buffer instance to ReceiveBuffer.');
        }
        if (this.offset + data.length >= this.buffer.length) {
            const tmp = this.buffer;
            this.buffer = Buffer.allocUnsafe(Math.max(this.buffer.length + this.originalSize, this.buffer.length + data.length));
            tmp.copy(this.buffer);
        }
        data.copy(this.buffer, this.offset);
        return this.offset += data.length;
    }
    peek(length) {
        if (length > this.offset) {
            throw new Error('Attempted to read beyond the bounds of the managed internal data.');
        }
        return this.buffer.slice(0, length);
    }
    get(length) {
        if (length > this.offset) {
            throw new Error('Attempted to read beyond the bounds of the managed internal data.');
        }
        const value = Buffer.allocUnsafe(length);
        this.buffer.slice(0, length).copy(value);
        this.buffer.copyWithin(0, length, length + this.offset - length);
        this.offset -= length;
        return value;
    }
}
exports.ReceiveBuffer = ReceiveBuffer; //# sourceMappingURL=receivebuffer.js.map
}),
"[project]/Autonomous-Claims-Orchestrator/node_modules/socks/build/client/socksclient.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __awaiter = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__awaiter || function(thisArg, _arguments, P, generator) {
    function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
            resolve(value);
        });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.SocksClientError = exports.SocksClient = void 0;
const events_1 = __turbopack_context__.r("[externals]/events [external] (events, cjs)");
const net = __turbopack_context__.r("[externals]/net [external] (net, cjs)");
const smart_buffer_1 = __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/smart-buffer/build/smartbuffer.js [app-route] (ecmascript)");
const constants_1 = __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/socks/build/common/constants.js [app-route] (ecmascript)");
const helpers_1 = __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/socks/build/common/helpers.js [app-route] (ecmascript)");
const receivebuffer_1 = __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/socks/build/common/receivebuffer.js [app-route] (ecmascript)");
const util_1 = __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/socks/build/common/util.js [app-route] (ecmascript)");
Object.defineProperty(exports, "SocksClientError", {
    enumerable: true,
    get: function() {
        return util_1.SocksClientError;
    }
});
const ip_address_1 = __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/ip-address/dist/ip-address.js [app-route] (ecmascript)");
class SocksClient extends events_1.EventEmitter {
    constructor(options){
        super();
        this.options = Object.assign({}, options);
        // Validate SocksClientOptions
        (0, helpers_1.validateSocksClientOptions)(options);
        // Default state
        this.setState(constants_1.SocksClientState.Created);
    }
    /**
     * Creates a new SOCKS connection.
     *
     * Note: Supports callbacks and promises. Only supports the connect command.
     * @param options { SocksClientOptions } Options.
     * @param callback { Function } An optional callback function.
     * @returns { Promise }
     */ static createConnection(options, callback) {
        return new Promise((resolve, reject)=>{
            // Validate SocksClientOptions
            try {
                (0, helpers_1.validateSocksClientOptions)(options, [
                    'connect'
                ]);
            } catch (err) {
                if (typeof callback === 'function') {
                    callback(err);
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    return resolve(err); // Resolves pending promise (prevents memory leaks).
                } else {
                    return reject(err);
                }
            }
            const client = new SocksClient(options);
            client.connect(options.existing_socket);
            client.once('established', (info)=>{
                client.removeAllListeners();
                if (typeof callback === 'function') {
                    callback(null, info);
                    resolve(info); // Resolves pending promise (prevents memory leaks).
                } else {
                    resolve(info);
                }
            });
            // Error occurred, failed to establish connection.
            client.once('error', (err)=>{
                client.removeAllListeners();
                if (typeof callback === 'function') {
                    callback(err);
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    resolve(err); // Resolves pending promise (prevents memory leaks).
                } else {
                    reject(err);
                }
            });
        });
    }
    /**
     * Creates a new SOCKS connection chain to a destination host through 2 or more SOCKS proxies.
     *
     * Note: Supports callbacks and promises. Only supports the connect method.
     * Note: Implemented via createConnection() factory function.
     * @param options { SocksClientChainOptions } Options
     * @param callback { Function } An optional callback function.
     * @returns { Promise }
     */ static createConnectionChain(options, callback) {
        // eslint-disable-next-line no-async-promise-executor
        return new Promise((resolve, reject)=>__awaiter(this, void 0, void 0, function*() {
                // Validate SocksClientChainOptions
                try {
                    (0, helpers_1.validateSocksClientChainOptions)(options);
                } catch (err) {
                    if (typeof callback === 'function') {
                        callback(err);
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        return resolve(err); // Resolves pending promise (prevents memory leaks).
                    } else {
                        return reject(err);
                    }
                }
                // Shuffle proxies
                if (options.randomizeChain) {
                    (0, util_1.shuffleArray)(options.proxies);
                }
                try {
                    let sock;
                    for(let i = 0; i < options.proxies.length; i++){
                        const nextProxy = options.proxies[i];
                        // If we've reached the last proxy in the chain, the destination is the actual destination, otherwise it's the next proxy.
                        const nextDestination = i === options.proxies.length - 1 ? options.destination : {
                            host: options.proxies[i + 1].host || options.proxies[i + 1].ipaddress,
                            port: options.proxies[i + 1].port
                        };
                        // Creates the next connection in the chain.
                        const result = yield SocksClient.createConnection({
                            command: 'connect',
                            proxy: nextProxy,
                            destination: nextDestination,
                            existing_socket: sock
                        });
                        // If sock is undefined, assign it here.
                        sock = sock || result.socket;
                    }
                    if (typeof callback === 'function') {
                        callback(null, {
                            socket: sock
                        });
                        resolve({
                            socket: sock
                        }); // Resolves pending promise (prevents memory leaks).
                    } else {
                        resolve({
                            socket: sock
                        });
                    }
                } catch (err) {
                    if (typeof callback === 'function') {
                        callback(err);
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        resolve(err); // Resolves pending promise (prevents memory leaks).
                    } else {
                        reject(err);
                    }
                }
            }));
    }
    /**
     * Creates a SOCKS UDP Frame.
     * @param options
     */ static createUDPFrame(options) {
        const buff = new smart_buffer_1.SmartBuffer();
        buff.writeUInt16BE(0);
        buff.writeUInt8(options.frameNumber || 0);
        // IPv4/IPv6/Hostname
        if (net.isIPv4(options.remoteHost.host)) {
            buff.writeUInt8(constants_1.Socks5HostType.IPv4);
            buff.writeUInt32BE((0, helpers_1.ipv4ToInt32)(options.remoteHost.host));
        } else if (net.isIPv6(options.remoteHost.host)) {
            buff.writeUInt8(constants_1.Socks5HostType.IPv6);
            buff.writeBuffer((0, helpers_1.ipToBuffer)(options.remoteHost.host));
        } else {
            buff.writeUInt8(constants_1.Socks5HostType.Hostname);
            buff.writeUInt8(Buffer.byteLength(options.remoteHost.host));
            buff.writeString(options.remoteHost.host);
        }
        // Port
        buff.writeUInt16BE(options.remoteHost.port);
        // Data
        buff.writeBuffer(options.data);
        return buff.toBuffer();
    }
    /**
     * Parses a SOCKS UDP frame.
     * @param data
     */ static parseUDPFrame(data) {
        const buff = smart_buffer_1.SmartBuffer.fromBuffer(data);
        buff.readOffset = 2;
        const frameNumber = buff.readUInt8();
        const hostType = buff.readUInt8();
        let remoteHost;
        if (hostType === constants_1.Socks5HostType.IPv4) {
            remoteHost = (0, helpers_1.int32ToIpv4)(buff.readUInt32BE());
        } else if (hostType === constants_1.Socks5HostType.IPv6) {
            remoteHost = ip_address_1.Address6.fromByteArray(Array.from(buff.readBuffer(16))).canonicalForm();
        } else {
            remoteHost = buff.readString(buff.readUInt8());
        }
        const remotePort = buff.readUInt16BE();
        return {
            frameNumber,
            remoteHost: {
                host: remoteHost,
                port: remotePort
            },
            data: buff.readBuffer()
        };
    }
    /**
     * Internal state setter. If the SocksClient is in an error state, it cannot be changed to a non error state.
     */ setState(newState) {
        if (this.state !== constants_1.SocksClientState.Error) {
            this.state = newState;
        }
    }
    /**
     * Starts the connection establishment to the proxy and destination.
     * @param existingSocket Connected socket to use instead of creating a new one (internal use).
     */ connect(existingSocket) {
        this.onDataReceived = (data)=>this.onDataReceivedHandler(data);
        this.onClose = ()=>this.onCloseHandler();
        this.onError = (err)=>this.onErrorHandler(err);
        this.onConnect = ()=>this.onConnectHandler();
        // Start timeout timer (defaults to 30 seconds)
        const timer = setTimeout(()=>this.onEstablishedTimeout(), this.options.timeout || constants_1.DEFAULT_TIMEOUT);
        // check whether unref is available as it differs from browser to NodeJS (#33)
        if (timer.unref && typeof timer.unref === 'function') {
            timer.unref();
        }
        // If an existing socket is provided, use it to negotiate SOCKS handshake. Otherwise create a new Socket.
        if (existingSocket) {
            this.socket = existingSocket;
        } else {
            this.socket = new net.Socket();
        }
        // Attach Socket error handlers.
        this.socket.once('close', this.onClose);
        this.socket.once('error', this.onError);
        this.socket.once('connect', this.onConnect);
        this.socket.on('data', this.onDataReceived);
        this.setState(constants_1.SocksClientState.Connecting);
        this.receiveBuffer = new receivebuffer_1.ReceiveBuffer();
        if (existingSocket) {
            this.socket.emit('connect');
        } else {
            this.socket.connect(this.getSocketOptions());
            if (this.options.set_tcp_nodelay !== undefined && this.options.set_tcp_nodelay !== null) {
                this.socket.setNoDelay(!!this.options.set_tcp_nodelay);
            }
        }
        // Listen for established event so we can re-emit any excess data received during handshakes.
        this.prependOnceListener('established', (info)=>{
            setImmediate(()=>{
                if (this.receiveBuffer.length > 0) {
                    const excessData = this.receiveBuffer.get(this.receiveBuffer.length);
                    info.socket.emit('data', excessData);
                }
                info.socket.resume();
            });
        });
    }
    // Socket options (defaults host/port to options.proxy.host/options.proxy.port)
    getSocketOptions() {
        return Object.assign(Object.assign({}, this.options.socket_options), {
            host: this.options.proxy.host || this.options.proxy.ipaddress,
            port: this.options.proxy.port
        });
    }
    /**
     * Handles internal Socks timeout callback.
     * Note: If the Socks client is not BoundWaitingForConnection or Established, the connection will be closed.
     */ onEstablishedTimeout() {
        if (this.state !== constants_1.SocksClientState.Established && this.state !== constants_1.SocksClientState.BoundWaitingForConnection) {
            this.closeSocket(constants_1.ERRORS.ProxyConnectionTimedOut);
        }
    }
    /**
     * Handles Socket connect event.
     */ onConnectHandler() {
        this.setState(constants_1.SocksClientState.Connected);
        // Send initial handshake.
        if (this.options.proxy.type === 4) {
            this.sendSocks4InitialHandshake();
        } else {
            this.sendSocks5InitialHandshake();
        }
        this.setState(constants_1.SocksClientState.SentInitialHandshake);
    }
    /**
     * Handles Socket data event.
     * @param data
     */ onDataReceivedHandler(data) {
        /*
          All received data is appended to a ReceiveBuffer.
          This makes sure that all the data we need is received before we attempt to process it.
        */ this.receiveBuffer.append(data);
        // Process data that we have.
        this.processData();
    }
    /**
     * Handles processing of the data we have received.
     */ processData() {
        // If we have enough data to process the next step in the SOCKS handshake, proceed.
        while(this.state !== constants_1.SocksClientState.Established && this.state !== constants_1.SocksClientState.Error && this.receiveBuffer.length >= this.nextRequiredPacketBufferSize){
            // Sent initial handshake, waiting for response.
            if (this.state === constants_1.SocksClientState.SentInitialHandshake) {
                if (this.options.proxy.type === 4) {
                    // Socks v4 only has one handshake response.
                    this.handleSocks4FinalHandshakeResponse();
                } else {
                    // Socks v5 has two handshakes, handle initial one here.
                    this.handleInitialSocks5HandshakeResponse();
                }
            // Sent auth request for Socks v5, waiting for response.
            } else if (this.state === constants_1.SocksClientState.SentAuthentication) {
                this.handleInitialSocks5AuthenticationHandshakeResponse();
            // Sent final Socks v5 handshake, waiting for final response.
            } else if (this.state === constants_1.SocksClientState.SentFinalHandshake) {
                this.handleSocks5FinalHandshakeResponse();
            // Socks BIND established. Waiting for remote connection via proxy.
            } else if (this.state === constants_1.SocksClientState.BoundWaitingForConnection) {
                if (this.options.proxy.type === 4) {
                    this.handleSocks4IncomingConnectionResponse();
                } else {
                    this.handleSocks5IncomingConnectionResponse();
                }
            } else {
                this.closeSocket(constants_1.ERRORS.InternalError);
                break;
            }
        }
    }
    /**
     * Handles Socket close event.
     * @param had_error
     */ onCloseHandler() {
        this.closeSocket(constants_1.ERRORS.SocketClosed);
    }
    /**
     * Handles Socket error event.
     * @param err
     */ onErrorHandler(err) {
        this.closeSocket(err.message);
    }
    /**
     * Removes internal event listeners on the underlying Socket.
     */ removeInternalSocketHandlers() {
        // Pauses data flow of the socket (this is internally resumed after 'established' is emitted)
        this.socket.pause();
        this.socket.removeListener('data', this.onDataReceived);
        this.socket.removeListener('close', this.onClose);
        this.socket.removeListener('error', this.onError);
        this.socket.removeListener('connect', this.onConnect);
    }
    /**
     * Closes and destroys the underlying Socket. Emits an error event.
     * @param err { String } An error string to include in error event.
     */ closeSocket(err) {
        // Make sure only one 'error' event is fired for the lifetime of this SocksClient instance.
        if (this.state !== constants_1.SocksClientState.Error) {
            // Set internal state to Error.
            this.setState(constants_1.SocksClientState.Error);
            // Destroy Socket
            this.socket.destroy();
            // Remove internal listeners
            this.removeInternalSocketHandlers();
            // Fire 'error' event.
            this.emit('error', new util_1.SocksClientError(err, this.options));
        }
    }
    /**
     * Sends initial Socks v4 handshake request.
     */ sendSocks4InitialHandshake() {
        const userId = this.options.proxy.userId || '';
        const buff = new smart_buffer_1.SmartBuffer();
        buff.writeUInt8(0x04);
        buff.writeUInt8(constants_1.SocksCommand[this.options.command]);
        buff.writeUInt16BE(this.options.destination.port);
        // Socks 4 (IPv4)
        if (net.isIPv4(this.options.destination.host)) {
            buff.writeBuffer((0, helpers_1.ipToBuffer)(this.options.destination.host));
            buff.writeStringNT(userId);
        // Socks 4a (hostname)
        } else {
            buff.writeUInt8(0x00);
            buff.writeUInt8(0x00);
            buff.writeUInt8(0x00);
            buff.writeUInt8(0x01);
            buff.writeStringNT(userId);
            buff.writeStringNT(this.options.destination.host);
        }
        this.nextRequiredPacketBufferSize = constants_1.SOCKS_INCOMING_PACKET_SIZES.Socks4Response;
        this.socket.write(buff.toBuffer());
    }
    /**
     * Handles Socks v4 handshake response.
     * @param data
     */ handleSocks4FinalHandshakeResponse() {
        const data = this.receiveBuffer.get(8);
        if (data[1] !== constants_1.Socks4Response.Granted) {
            this.closeSocket(`${constants_1.ERRORS.Socks4ProxyRejectedConnection} - (${constants_1.Socks4Response[data[1]]})`);
        } else {
            // Bind response
            if (constants_1.SocksCommand[this.options.command] === constants_1.SocksCommand.bind) {
                const buff = smart_buffer_1.SmartBuffer.fromBuffer(data);
                buff.readOffset = 2;
                const remoteHost = {
                    port: buff.readUInt16BE(),
                    host: (0, helpers_1.int32ToIpv4)(buff.readUInt32BE())
                };
                // If host is 0.0.0.0, set to proxy host.
                if (remoteHost.host === '0.0.0.0') {
                    remoteHost.host = this.options.proxy.ipaddress;
                }
                this.setState(constants_1.SocksClientState.BoundWaitingForConnection);
                this.emit('bound', {
                    remoteHost,
                    socket: this.socket
                });
            // Connect response
            } else {
                this.setState(constants_1.SocksClientState.Established);
                this.removeInternalSocketHandlers();
                this.emit('established', {
                    socket: this.socket
                });
            }
        }
    }
    /**
     * Handles Socks v4 incoming connection request (BIND)
     * @param data
     */ handleSocks4IncomingConnectionResponse() {
        const data = this.receiveBuffer.get(8);
        if (data[1] !== constants_1.Socks4Response.Granted) {
            this.closeSocket(`${constants_1.ERRORS.Socks4ProxyRejectedIncomingBoundConnection} - (${constants_1.Socks4Response[data[1]]})`);
        } else {
            const buff = smart_buffer_1.SmartBuffer.fromBuffer(data);
            buff.readOffset = 2;
            const remoteHost = {
                port: buff.readUInt16BE(),
                host: (0, helpers_1.int32ToIpv4)(buff.readUInt32BE())
            };
            this.setState(constants_1.SocksClientState.Established);
            this.removeInternalSocketHandlers();
            this.emit('established', {
                remoteHost,
                socket: this.socket
            });
        }
    }
    /**
     * Sends initial Socks v5 handshake request.
     */ sendSocks5InitialHandshake() {
        const buff = new smart_buffer_1.SmartBuffer();
        // By default we always support no auth.
        const supportedAuthMethods = [
            constants_1.Socks5Auth.NoAuth
        ];
        // We should only tell the proxy we support user/pass auth if auth info is actually provided.
        // Note: As of Tor v0.3.5.7+, if user/pass auth is an option from the client, by default it will always take priority.
        if (this.options.proxy.userId || this.options.proxy.password) {
            supportedAuthMethods.push(constants_1.Socks5Auth.UserPass);
        }
        // Custom auth method?
        if (this.options.proxy.custom_auth_method !== undefined) {
            supportedAuthMethods.push(this.options.proxy.custom_auth_method);
        }
        // Build handshake packet
        buff.writeUInt8(0x05);
        buff.writeUInt8(supportedAuthMethods.length);
        for (const authMethod of supportedAuthMethods){
            buff.writeUInt8(authMethod);
        }
        this.nextRequiredPacketBufferSize = constants_1.SOCKS_INCOMING_PACKET_SIZES.Socks5InitialHandshakeResponse;
        this.socket.write(buff.toBuffer());
        this.setState(constants_1.SocksClientState.SentInitialHandshake);
    }
    /**
     * Handles initial Socks v5 handshake response.
     * @param data
     */ handleInitialSocks5HandshakeResponse() {
        const data = this.receiveBuffer.get(2);
        if (data[0] !== 0x05) {
            this.closeSocket(constants_1.ERRORS.InvalidSocks5IntiailHandshakeSocksVersion);
        } else if (data[1] === constants_1.SOCKS5_NO_ACCEPTABLE_AUTH) {
            this.closeSocket(constants_1.ERRORS.InvalidSocks5InitialHandshakeNoAcceptedAuthType);
        } else {
            // If selected Socks v5 auth method is no auth, send final handshake request.
            if (data[1] === constants_1.Socks5Auth.NoAuth) {
                this.socks5ChosenAuthType = constants_1.Socks5Auth.NoAuth;
                this.sendSocks5CommandRequest();
            // If selected Socks v5 auth method is user/password, send auth handshake.
            } else if (data[1] === constants_1.Socks5Auth.UserPass) {
                this.socks5ChosenAuthType = constants_1.Socks5Auth.UserPass;
                this.sendSocks5UserPassAuthentication();
            // If selected Socks v5 auth method is the custom_auth_method, send custom handshake.
            } else if (data[1] === this.options.proxy.custom_auth_method) {
                this.socks5ChosenAuthType = this.options.proxy.custom_auth_method;
                this.sendSocks5CustomAuthentication();
            } else {
                this.closeSocket(constants_1.ERRORS.InvalidSocks5InitialHandshakeUnknownAuthType);
            }
        }
    }
    /**
     * Sends Socks v5 user & password auth handshake.
     *
     * Note: No auth and user/pass are currently supported.
     */ sendSocks5UserPassAuthentication() {
        const userId = this.options.proxy.userId || '';
        const password = this.options.proxy.password || '';
        const buff = new smart_buffer_1.SmartBuffer();
        buff.writeUInt8(0x01);
        buff.writeUInt8(Buffer.byteLength(userId));
        buff.writeString(userId);
        buff.writeUInt8(Buffer.byteLength(password));
        buff.writeString(password);
        this.nextRequiredPacketBufferSize = constants_1.SOCKS_INCOMING_PACKET_SIZES.Socks5UserPassAuthenticationResponse;
        this.socket.write(buff.toBuffer());
        this.setState(constants_1.SocksClientState.SentAuthentication);
    }
    sendSocks5CustomAuthentication() {
        return __awaiter(this, void 0, void 0, function*() {
            this.nextRequiredPacketBufferSize = this.options.proxy.custom_auth_response_size;
            this.socket.write((yield this.options.proxy.custom_auth_request_handler()));
            this.setState(constants_1.SocksClientState.SentAuthentication);
        });
    }
    handleSocks5CustomAuthHandshakeResponse(data) {
        return __awaiter(this, void 0, void 0, function*() {
            return yield this.options.proxy.custom_auth_response_handler(data);
        });
    }
    handleSocks5AuthenticationNoAuthHandshakeResponse(data) {
        return __awaiter(this, void 0, void 0, function*() {
            return data[1] === 0x00;
        });
    }
    handleSocks5AuthenticationUserPassHandshakeResponse(data) {
        return __awaiter(this, void 0, void 0, function*() {
            return data[1] === 0x00;
        });
    }
    /**
     * Handles Socks v5 auth handshake response.
     * @param data
     */ handleInitialSocks5AuthenticationHandshakeResponse() {
        return __awaiter(this, void 0, void 0, function*() {
            this.setState(constants_1.SocksClientState.ReceivedAuthenticationResponse);
            let authResult = false;
            if (this.socks5ChosenAuthType === constants_1.Socks5Auth.NoAuth) {
                authResult = yield this.handleSocks5AuthenticationNoAuthHandshakeResponse(this.receiveBuffer.get(2));
            } else if (this.socks5ChosenAuthType === constants_1.Socks5Auth.UserPass) {
                authResult = yield this.handleSocks5AuthenticationUserPassHandshakeResponse(this.receiveBuffer.get(2));
            } else if (this.socks5ChosenAuthType === this.options.proxy.custom_auth_method) {
                authResult = yield this.handleSocks5CustomAuthHandshakeResponse(this.receiveBuffer.get(this.options.proxy.custom_auth_response_size));
            }
            if (!authResult) {
                this.closeSocket(constants_1.ERRORS.Socks5AuthenticationFailed);
            } else {
                this.sendSocks5CommandRequest();
            }
        });
    }
    /**
     * Sends Socks v5 final handshake request.
     */ sendSocks5CommandRequest() {
        const buff = new smart_buffer_1.SmartBuffer();
        buff.writeUInt8(0x05);
        buff.writeUInt8(constants_1.SocksCommand[this.options.command]);
        buff.writeUInt8(0x00);
        // ipv4, ipv6, domain?
        if (net.isIPv4(this.options.destination.host)) {
            buff.writeUInt8(constants_1.Socks5HostType.IPv4);
            buff.writeBuffer((0, helpers_1.ipToBuffer)(this.options.destination.host));
        } else if (net.isIPv6(this.options.destination.host)) {
            buff.writeUInt8(constants_1.Socks5HostType.IPv6);
            buff.writeBuffer((0, helpers_1.ipToBuffer)(this.options.destination.host));
        } else {
            buff.writeUInt8(constants_1.Socks5HostType.Hostname);
            buff.writeUInt8(this.options.destination.host.length);
            buff.writeString(this.options.destination.host);
        }
        buff.writeUInt16BE(this.options.destination.port);
        this.nextRequiredPacketBufferSize = constants_1.SOCKS_INCOMING_PACKET_SIZES.Socks5ResponseHeader;
        this.socket.write(buff.toBuffer());
        this.setState(constants_1.SocksClientState.SentFinalHandshake);
    }
    /**
     * Handles Socks v5 final handshake response.
     * @param data
     */ handleSocks5FinalHandshakeResponse() {
        // Peek at available data (we need at least 5 bytes to get the hostname length)
        const header = this.receiveBuffer.peek(5);
        if (header[0] !== 0x05 || header[1] !== constants_1.Socks5Response.Granted) {
            this.closeSocket(`${constants_1.ERRORS.InvalidSocks5FinalHandshakeRejected} - ${constants_1.Socks5Response[header[1]]}`);
        } else {
            // Read address type
            const addressType = header[3];
            let remoteHost;
            let buff;
            // IPv4
            if (addressType === constants_1.Socks5HostType.IPv4) {
                // Check if data is available.
                const dataNeeded = constants_1.SOCKS_INCOMING_PACKET_SIZES.Socks5ResponseIPv4;
                if (this.receiveBuffer.length < dataNeeded) {
                    this.nextRequiredPacketBufferSize = dataNeeded;
                    return;
                }
                buff = smart_buffer_1.SmartBuffer.fromBuffer(this.receiveBuffer.get(dataNeeded).slice(4));
                remoteHost = {
                    host: (0, helpers_1.int32ToIpv4)(buff.readUInt32BE()),
                    port: buff.readUInt16BE()
                };
                // If given host is 0.0.0.0, assume remote proxy ip instead.
                if (remoteHost.host === '0.0.0.0') {
                    remoteHost.host = this.options.proxy.ipaddress;
                }
            // Hostname
            } else if (addressType === constants_1.Socks5HostType.Hostname) {
                const hostLength = header[4];
                const dataNeeded = constants_1.SOCKS_INCOMING_PACKET_SIZES.Socks5ResponseHostname(hostLength); // header + host length + host + port
                // Check if data is available.
                if (this.receiveBuffer.length < dataNeeded) {
                    this.nextRequiredPacketBufferSize = dataNeeded;
                    return;
                }
                buff = smart_buffer_1.SmartBuffer.fromBuffer(this.receiveBuffer.get(dataNeeded).slice(5));
                remoteHost = {
                    host: buff.readString(hostLength),
                    port: buff.readUInt16BE()
                };
            // IPv6
            } else if (addressType === constants_1.Socks5HostType.IPv6) {
                // Check if data is available.
                const dataNeeded = constants_1.SOCKS_INCOMING_PACKET_SIZES.Socks5ResponseIPv6;
                if (this.receiveBuffer.length < dataNeeded) {
                    this.nextRequiredPacketBufferSize = dataNeeded;
                    return;
                }
                buff = smart_buffer_1.SmartBuffer.fromBuffer(this.receiveBuffer.get(dataNeeded).slice(4));
                remoteHost = {
                    host: ip_address_1.Address6.fromByteArray(Array.from(buff.readBuffer(16))).canonicalForm(),
                    port: buff.readUInt16BE()
                };
            }
            // We have everything we need
            this.setState(constants_1.SocksClientState.ReceivedFinalResponse);
            // If using CONNECT, the client is now in the established state.
            if (constants_1.SocksCommand[this.options.command] === constants_1.SocksCommand.connect) {
                this.setState(constants_1.SocksClientState.Established);
                this.removeInternalSocketHandlers();
                this.emit('established', {
                    remoteHost,
                    socket: this.socket
                });
            } else if (constants_1.SocksCommand[this.options.command] === constants_1.SocksCommand.bind) {
                /* If using BIND, the Socks client is now in BoundWaitingForConnection state.
                   This means that the remote proxy server is waiting for a remote connection to the bound port. */ this.setState(constants_1.SocksClientState.BoundWaitingForConnection);
                this.nextRequiredPacketBufferSize = constants_1.SOCKS_INCOMING_PACKET_SIZES.Socks5ResponseHeader;
                this.emit('bound', {
                    remoteHost,
                    socket: this.socket
                });
            /*
                  If using Associate, the Socks client is now Established. And the proxy server is now accepting UDP packets at the
                  given bound port. This initial Socks TCP connection must remain open for the UDP relay to continue to work.
                */ } else if (constants_1.SocksCommand[this.options.command] === constants_1.SocksCommand.associate) {
                this.setState(constants_1.SocksClientState.Established);
                this.removeInternalSocketHandlers();
                this.emit('established', {
                    remoteHost,
                    socket: this.socket
                });
            }
        }
    }
    /**
     * Handles Socks v5 incoming connection request (BIND).
     */ handleSocks5IncomingConnectionResponse() {
        // Peek at available data (we need at least 5 bytes to get the hostname length)
        const header = this.receiveBuffer.peek(5);
        if (header[0] !== 0x05 || header[1] !== constants_1.Socks5Response.Granted) {
            this.closeSocket(`${constants_1.ERRORS.Socks5ProxyRejectedIncomingBoundConnection} - ${constants_1.Socks5Response[header[1]]}`);
        } else {
            // Read address type
            const addressType = header[3];
            let remoteHost;
            let buff;
            // IPv4
            if (addressType === constants_1.Socks5HostType.IPv4) {
                // Check if data is available.
                const dataNeeded = constants_1.SOCKS_INCOMING_PACKET_SIZES.Socks5ResponseIPv4;
                if (this.receiveBuffer.length < dataNeeded) {
                    this.nextRequiredPacketBufferSize = dataNeeded;
                    return;
                }
                buff = smart_buffer_1.SmartBuffer.fromBuffer(this.receiveBuffer.get(dataNeeded).slice(4));
                remoteHost = {
                    host: (0, helpers_1.int32ToIpv4)(buff.readUInt32BE()),
                    port: buff.readUInt16BE()
                };
                // If given host is 0.0.0.0, assume remote proxy ip instead.
                if (remoteHost.host === '0.0.0.0') {
                    remoteHost.host = this.options.proxy.ipaddress;
                }
            // Hostname
            } else if (addressType === constants_1.Socks5HostType.Hostname) {
                const hostLength = header[4];
                const dataNeeded = constants_1.SOCKS_INCOMING_PACKET_SIZES.Socks5ResponseHostname(hostLength); // header + host length + port
                // Check if data is available.
                if (this.receiveBuffer.length < dataNeeded) {
                    this.nextRequiredPacketBufferSize = dataNeeded;
                    return;
                }
                buff = smart_buffer_1.SmartBuffer.fromBuffer(this.receiveBuffer.get(dataNeeded).slice(5));
                remoteHost = {
                    host: buff.readString(hostLength),
                    port: buff.readUInt16BE()
                };
            // IPv6
            } else if (addressType === constants_1.Socks5HostType.IPv6) {
                // Check if data is available.
                const dataNeeded = constants_1.SOCKS_INCOMING_PACKET_SIZES.Socks5ResponseIPv6;
                if (this.receiveBuffer.length < dataNeeded) {
                    this.nextRequiredPacketBufferSize = dataNeeded;
                    return;
                }
                buff = smart_buffer_1.SmartBuffer.fromBuffer(this.receiveBuffer.get(dataNeeded).slice(4));
                remoteHost = {
                    host: ip_address_1.Address6.fromByteArray(Array.from(buff.readBuffer(16))).canonicalForm(),
                    port: buff.readUInt16BE()
                };
            }
            this.setState(constants_1.SocksClientState.Established);
            this.removeInternalSocketHandlers();
            this.emit('established', {
                remoteHost,
                socket: this.socket
            });
        }
    }
    get socksClientOptions() {
        return Object.assign({}, this.options);
    }
}
exports.SocksClient = SocksClient; //# sourceMappingURL=socksclient.js.map
}),
"[project]/Autonomous-Claims-Orchestrator/node_modules/socks/build/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __createBinding = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__createBinding || (Object.create ? function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = {
            enumerable: true,
            get: function() {
                return m[k];
            }
        };
    }
    Object.defineProperty(o, k2, desc);
} : function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
});
var __exportStar = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__exportStar || function(m, exports1) {
    for(var p in m)if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports1, p)) __createBinding(exports1, m, p);
};
Object.defineProperty(exports, "__esModule", {
    value: true
});
__exportStar(__turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/socks/build/client/socksclient.js [app-route] (ecmascript)"), exports); //# sourceMappingURL=index.js.map
}),
"[project]/Autonomous-Claims-Orchestrator/node_modules/ip-address/dist/common.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.isInSubnet = isInSubnet;
exports.isCorrect = isCorrect;
exports.numberToPaddedHex = numberToPaddedHex;
exports.stringToPaddedHex = stringToPaddedHex;
exports.testBit = testBit;
function isInSubnet(address) {
    if (this.subnetMask < address.subnetMask) {
        return false;
    }
    if (this.mask(address.subnetMask) === address.mask()) {
        return true;
    }
    return false;
}
function isCorrect(defaultBits) {
    return function() {
        if (this.addressMinusSuffix !== this.correctForm()) {
            return false;
        }
        if (this.subnetMask === defaultBits && !this.parsedSubnet) {
            return true;
        }
        return this.parsedSubnet === String(this.subnetMask);
    };
}
function numberToPaddedHex(number) {
    return number.toString(16).padStart(2, '0');
}
function stringToPaddedHex(numberString) {
    return numberToPaddedHex(parseInt(numberString, 10));
}
/**
 * @param binaryValue Binary representation of a value (e.g. `10`)
 * @param position Byte position, where 0 is the least significant bit
 */ function testBit(binaryValue, position) {
    const { length } = binaryValue;
    if (position > length) {
        return false;
    }
    const positionInString = length - position;
    return binaryValue.substring(positionInString, positionInString + 1) === '1';
} //# sourceMappingURL=common.js.map
}),
"[project]/Autonomous-Claims-Orchestrator/node_modules/ip-address/dist/v4/constants.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.RE_SUBNET_STRING = exports.RE_ADDRESS = exports.GROUPS = exports.BITS = void 0;
exports.BITS = 32;
exports.GROUPS = 4;
exports.RE_ADDRESS = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/g;
exports.RE_SUBNET_STRING = /\/\d{1,2}$/; //# sourceMappingURL=constants.js.map
}),
"[project]/Autonomous-Claims-Orchestrator/node_modules/ip-address/dist/address-error.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.AddressError = void 0;
class AddressError extends Error {
    constructor(message, parseMessage){
        super(message);
        this.name = 'AddressError';
        this.parseMessage = parseMessage;
    }
}
exports.AddressError = AddressError; //# sourceMappingURL=address-error.js.map
}),
"[project]/Autonomous-Claims-Orchestrator/node_modules/ip-address/dist/ipv4.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/* eslint-disable no-param-reassign */ var __createBinding = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__createBinding || (Object.create ? function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = {
            enumerable: true,
            get: function() {
                return m[k];
            }
        };
    }
    Object.defineProperty(o, k2, desc);
} : function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
});
var __setModuleDefault = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__setModuleDefault || (Object.create ? function(o, v) {
    Object.defineProperty(o, "default", {
        enumerable: true,
        value: v
    });
} : function(o, v) {
    o["default"] = v;
});
var __importStar = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__importStar || function(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) {
        for(var k in mod)if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    }
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Address4 = void 0;
const common = __importStar(__turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/ip-address/dist/common.js [app-route] (ecmascript)"));
const constants = __importStar(__turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/ip-address/dist/v4/constants.js [app-route] (ecmascript)"));
const address_error_1 = __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/ip-address/dist/address-error.js [app-route] (ecmascript)");
/**
 * Represents an IPv4 address
 * @class Address4
 * @param {string} address - An IPv4 address string
 */ class Address4 {
    constructor(address){
        this.groups = constants.GROUPS;
        this.parsedAddress = [];
        this.parsedSubnet = '';
        this.subnet = '/32';
        this.subnetMask = 32;
        this.v4 = true;
        /**
         * Returns true if the address is correct, false otherwise
         * @memberof Address4
         * @instance
         * @returns {Boolean}
         */ this.isCorrect = common.isCorrect(constants.BITS);
        /**
         * Returns true if the given address is in the subnet of the current address
         * @memberof Address4
         * @instance
         * @returns {boolean}
         */ this.isInSubnet = common.isInSubnet;
        this.address = address;
        const subnet = constants.RE_SUBNET_STRING.exec(address);
        if (subnet) {
            this.parsedSubnet = subnet[0].replace('/', '');
            this.subnetMask = parseInt(this.parsedSubnet, 10);
            this.subnet = `/${this.subnetMask}`;
            if (this.subnetMask < 0 || this.subnetMask > constants.BITS) {
                throw new address_error_1.AddressError('Invalid subnet mask.');
            }
            address = address.replace(constants.RE_SUBNET_STRING, '');
        }
        this.addressMinusSuffix = address;
        this.parsedAddress = this.parse(address);
    }
    static isValid(address) {
        try {
            // eslint-disable-next-line no-new
            new Address4(address);
            return true;
        } catch (e) {
            return false;
        }
    }
    /*
     * Parses a v4 address
     */ parse(address) {
        const groups = address.split('.');
        if (!address.match(constants.RE_ADDRESS)) {
            throw new address_error_1.AddressError('Invalid IPv4 address.');
        }
        return groups;
    }
    /**
     * Returns the correct form of an address
     * @memberof Address4
     * @instance
     * @returns {String}
     */ correctForm() {
        return this.parsedAddress.map((part)=>parseInt(part, 10)).join('.');
    }
    /**
     * Converts a hex string to an IPv4 address object
     * @memberof Address4
     * @static
     * @param {string} hex - a hex string to convert
     * @returns {Address4}
     */ static fromHex(hex) {
        const padded = hex.replace(/:/g, '').padStart(8, '0');
        const groups = [];
        let i;
        for(i = 0; i < 8; i += 2){
            const h = padded.slice(i, i + 2);
            groups.push(parseInt(h, 16));
        }
        return new Address4(groups.join('.'));
    }
    /**
     * Converts an integer into a IPv4 address object
     * @memberof Address4
     * @static
     * @param {integer} integer - a number to convert
     * @returns {Address4}
     */ static fromInteger(integer) {
        return Address4.fromHex(integer.toString(16));
    }
    /**
     * Return an address from in-addr.arpa form
     * @memberof Address4
     * @static
     * @param {string} arpaFormAddress - an 'in-addr.arpa' form ipv4 address
     * @returns {Adress4}
     * @example
     * var address = Address4.fromArpa(42.2.0.192.in-addr.arpa.)
     * address.correctForm(); // '192.0.2.42'
     */ static fromArpa(arpaFormAddress) {
        // remove ending ".in-addr.arpa." or just "."
        const leader = arpaFormAddress.replace(/(\.in-addr\.arpa)?\.$/, '');
        const address = leader.split('.').reverse().join('.');
        return new Address4(address);
    }
    /**
     * Converts an IPv4 address object to a hex string
     * @memberof Address4
     * @instance
     * @returns {String}
     */ toHex() {
        return this.parsedAddress.map((part)=>common.stringToPaddedHex(part)).join(':');
    }
    /**
     * Converts an IPv4 address object to an array of bytes
     * @memberof Address4
     * @instance
     * @returns {Array}
     */ toArray() {
        return this.parsedAddress.map((part)=>parseInt(part, 10));
    }
    /**
     * Converts an IPv4 address object to an IPv6 address group
     * @memberof Address4
     * @instance
     * @returns {String}
     */ toGroup6() {
        const output = [];
        let i;
        for(i = 0; i < constants.GROUPS; i += 2){
            output.push(`${common.stringToPaddedHex(this.parsedAddress[i])}${common.stringToPaddedHex(this.parsedAddress[i + 1])}`);
        }
        return output.join(':');
    }
    /**
     * Returns the address as a `bigint`
     * @memberof Address4
     * @instance
     * @returns {bigint}
     */ bigInt() {
        return BigInt(`0x${this.parsedAddress.map((n)=>common.stringToPaddedHex(n)).join('')}`);
    }
    /**
     * Helper function getting start address.
     * @memberof Address4
     * @instance
     * @returns {bigint}
     */ _startAddress() {
        return BigInt(`0b${this.mask() + '0'.repeat(constants.BITS - this.subnetMask)}`);
    }
    /**
     * The first address in the range given by this address' subnet.
     * Often referred to as the Network Address.
     * @memberof Address4
     * @instance
     * @returns {Address4}
     */ startAddress() {
        return Address4.fromBigInt(this._startAddress());
    }
    /**
     * The first host address in the range given by this address's subnet ie
     * the first address after the Network Address
     * @memberof Address4
     * @instance
     * @returns {Address4}
     */ startAddressExclusive() {
        const adjust = BigInt('1');
        return Address4.fromBigInt(this._startAddress() + adjust);
    }
    /**
     * Helper function getting end address.
     * @memberof Address4
     * @instance
     * @returns {bigint}
     */ _endAddress() {
        return BigInt(`0b${this.mask() + '1'.repeat(constants.BITS - this.subnetMask)}`);
    }
    /**
     * The last address in the range given by this address' subnet
     * Often referred to as the Broadcast
     * @memberof Address4
     * @instance
     * @returns {Address4}
     */ endAddress() {
        return Address4.fromBigInt(this._endAddress());
    }
    /**
     * The last host address in the range given by this address's subnet ie
     * the last address prior to the Broadcast Address
     * @memberof Address4
     * @instance
     * @returns {Address4}
     */ endAddressExclusive() {
        const adjust = BigInt('1');
        return Address4.fromBigInt(this._endAddress() - adjust);
    }
    /**
     * Converts a BigInt to a v4 address object
     * @memberof Address4
     * @static
     * @param {bigint} bigInt - a BigInt to convert
     * @returns {Address4}
     */ static fromBigInt(bigInt) {
        return Address4.fromHex(bigInt.toString(16));
    }
    /**
     * Convert a byte array to an Address4 object
     * @memberof Address4
     * @static
     * @param {Array<number>} bytes - an array of 4 bytes (0-255)
     * @returns {Address4}
     */ static fromByteArray(bytes) {
        if (bytes.length !== 4) {
            throw new address_error_1.AddressError('IPv4 addresses require exactly 4 bytes');
        }
        // Validate that all bytes are within valid range (0-255)
        for(let i = 0; i < bytes.length; i++){
            if (!Number.isInteger(bytes[i]) || bytes[i] < 0 || bytes[i] > 255) {
                throw new address_error_1.AddressError('All bytes must be integers between 0 and 255');
            }
        }
        return this.fromUnsignedByteArray(bytes);
    }
    /**
     * Convert an unsigned byte array to an Address4 object
     * @memberof Address4
     * @static
     * @param {Array<number>} bytes - an array of 4 unsigned bytes (0-255)
     * @returns {Address4}
     */ static fromUnsignedByteArray(bytes) {
        if (bytes.length !== 4) {
            throw new address_error_1.AddressError('IPv4 addresses require exactly 4 bytes');
        }
        const address = bytes.join('.');
        return new Address4(address);
    }
    /**
     * Returns the first n bits of the address, defaulting to the
     * subnet mask
     * @memberof Address4
     * @instance
     * @returns {String}
     */ mask(mask) {
        if (mask === undefined) {
            mask = this.subnetMask;
        }
        return this.getBitsBase2(0, mask);
    }
    /**
     * Returns the bits in the given range as a base-2 string
     * @memberof Address4
     * @instance
     * @returns {string}
     */ getBitsBase2(start, end) {
        return this.binaryZeroPad().slice(start, end);
    }
    /**
     * Return the reversed ip6.arpa form of the address
     * @memberof Address4
     * @param {Object} options
     * @param {boolean} options.omitSuffix - omit the "in-addr.arpa" suffix
     * @instance
     * @returns {String}
     */ reverseForm(options) {
        if (!options) {
            options = {};
        }
        const reversed = this.correctForm().split('.').reverse().join('.');
        if (options.omitSuffix) {
            return reversed;
        }
        return `${reversed}.in-addr.arpa.`;
    }
    /**
     * Returns true if the given address is a multicast address
     * @memberof Address4
     * @instance
     * @returns {boolean}
     */ isMulticast() {
        return this.isInSubnet(new Address4('224.0.0.0/4'));
    }
    /**
     * Returns a zero-padded base-2 string representation of the address
     * @memberof Address4
     * @instance
     * @returns {string}
     */ binaryZeroPad() {
        return this.bigInt().toString(2).padStart(constants.BITS, '0');
    }
    /**
     * Groups an IPv4 address for inclusion at the end of an IPv6 address
     * @returns {String}
     */ groupForV6() {
        const segments = this.parsedAddress;
        return this.address.replace(constants.RE_ADDRESS, `<span class="hover-group group-v4 group-6">${segments.slice(0, 2).join('.')}</span>.<span class="hover-group group-v4 group-7">${segments.slice(2, 4).join('.')}</span>`);
    }
}
exports.Address4 = Address4; //# sourceMappingURL=ipv4.js.map
}),
"[project]/Autonomous-Claims-Orchestrator/node_modules/ip-address/dist/v6/constants.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.RE_URL_WITH_PORT = exports.RE_URL = exports.RE_ZONE_STRING = exports.RE_SUBNET_STRING = exports.RE_BAD_ADDRESS = exports.RE_BAD_CHARACTERS = exports.TYPES = exports.SCOPES = exports.GROUPS = exports.BITS = void 0;
exports.BITS = 128;
exports.GROUPS = 8;
/**
 * Represents IPv6 address scopes
 * @memberof Address6
 * @static
 */ exports.SCOPES = {
    0: 'Reserved',
    1: 'Interface local',
    2: 'Link local',
    4: 'Admin local',
    5: 'Site local',
    8: 'Organization local',
    14: 'Global',
    15: 'Reserved'
};
/**
 * Represents IPv6 address types
 * @memberof Address6
 * @static
 */ exports.TYPES = {
    'ff01::1/128': 'Multicast (All nodes on this interface)',
    'ff01::2/128': 'Multicast (All routers on this interface)',
    'ff02::1/128': 'Multicast (All nodes on this link)',
    'ff02::2/128': 'Multicast (All routers on this link)',
    'ff05::2/128': 'Multicast (All routers in this site)',
    'ff02::5/128': 'Multicast (OSPFv3 AllSPF routers)',
    'ff02::6/128': 'Multicast (OSPFv3 AllDR routers)',
    'ff02::9/128': 'Multicast (RIP routers)',
    'ff02::a/128': 'Multicast (EIGRP routers)',
    'ff02::d/128': 'Multicast (PIM routers)',
    'ff02::16/128': 'Multicast (MLDv2 reports)',
    'ff01::fb/128': 'Multicast (mDNSv6)',
    'ff02::fb/128': 'Multicast (mDNSv6)',
    'ff05::fb/128': 'Multicast (mDNSv6)',
    'ff02::1:2/128': 'Multicast (All DHCP servers and relay agents on this link)',
    'ff05::1:2/128': 'Multicast (All DHCP servers and relay agents in this site)',
    'ff02::1:3/128': 'Multicast (All DHCP servers on this link)',
    'ff05::1:3/128': 'Multicast (All DHCP servers in this site)',
    '::/128': 'Unspecified',
    '::1/128': 'Loopback',
    'ff00::/8': 'Multicast',
    'fe80::/10': 'Link-local unicast'
};
/**
 * A regular expression that matches bad characters in an IPv6 address
 * @memberof Address6
 * @static
 */ exports.RE_BAD_CHARACTERS = /([^0-9a-f:/%])/gi;
/**
 * A regular expression that matches an incorrect IPv6 address
 * @memberof Address6
 * @static
 */ exports.RE_BAD_ADDRESS = /([0-9a-f]{5,}|:{3,}|[^:]:$|^:[^:]|\/$)/gi;
/**
 * A regular expression that matches an IPv6 subnet
 * @memberof Address6
 * @static
 */ exports.RE_SUBNET_STRING = /\/\d{1,3}(?=%|$)/;
/**
 * A regular expression that matches an IPv6 zone
 * @memberof Address6
 * @static
 */ exports.RE_ZONE_STRING = /%.*$/;
exports.RE_URL = /^\[{0,1}([0-9a-f:]+)\]{0,1}/;
exports.RE_URL_WITH_PORT = /\[([0-9a-f:]+)\]:([0-9]{1,5})/; //# sourceMappingURL=constants.js.map
}),
"[project]/Autonomous-Claims-Orchestrator/node_modules/ip-address/dist/v6/helpers.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.spanAllZeroes = spanAllZeroes;
exports.spanAll = spanAll;
exports.spanLeadingZeroes = spanLeadingZeroes;
exports.simpleGroup = simpleGroup;
/**
 * @returns {String} the string with all zeroes contained in a <span>
 */ function spanAllZeroes(s) {
    return s.replace(/(0+)/g, '<span class="zero">$1</span>');
}
/**
 * @returns {String} the string with each character contained in a <span>
 */ function spanAll(s, offset = 0) {
    const letters = s.split('');
    return letters.map((n, i)=>`<span class="digit value-${n} position-${i + offset}">${spanAllZeroes(n)}</span>`).join('');
}
function spanLeadingZeroesSimple(group) {
    return group.replace(/^(0+)/, '<span class="zero">$1</span>');
}
/**
 * @returns {String} the string with leading zeroes contained in a <span>
 */ function spanLeadingZeroes(address) {
    const groups = address.split(':');
    return groups.map((g)=>spanLeadingZeroesSimple(g)).join(':');
}
/**
 * Groups an address
 * @returns {String} a grouped address
 */ function simpleGroup(addressString, offset = 0) {
    const groups = addressString.split(':');
    return groups.map((g, i)=>{
        if (/group-v4/.test(g)) {
            return g;
        }
        return `<span class="hover-group group-${i + offset}">${spanLeadingZeroesSimple(g)}</span>`;
    });
} //# sourceMappingURL=helpers.js.map
}),
"[project]/Autonomous-Claims-Orchestrator/node_modules/ip-address/dist/v6/regular-expressions.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __createBinding = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__createBinding || (Object.create ? function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = {
            enumerable: true,
            get: function() {
                return m[k];
            }
        };
    }
    Object.defineProperty(o, k2, desc);
} : function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
});
var __setModuleDefault = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__setModuleDefault || (Object.create ? function(o, v) {
    Object.defineProperty(o, "default", {
        enumerable: true,
        value: v
    });
} : function(o, v) {
    o["default"] = v;
});
var __importStar = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__importStar || function(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) {
        for(var k in mod)if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    }
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ADDRESS_BOUNDARY = void 0;
exports.groupPossibilities = groupPossibilities;
exports.padGroup = padGroup;
exports.simpleRegularExpression = simpleRegularExpression;
exports.possibleElisions = possibleElisions;
const v6 = __importStar(__turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/ip-address/dist/v6/constants.js [app-route] (ecmascript)"));
function groupPossibilities(possibilities) {
    return `(${possibilities.join('|')})`;
}
function padGroup(group) {
    if (group.length < 4) {
        return `0{0,${4 - group.length}}${group}`;
    }
    return group;
}
exports.ADDRESS_BOUNDARY = '[^A-Fa-f0-9:]';
function simpleRegularExpression(groups) {
    const zeroIndexes = [];
    groups.forEach((group, i)=>{
        const groupInteger = parseInt(group, 16);
        if (groupInteger === 0) {
            zeroIndexes.push(i);
        }
    });
    // You can technically elide a single 0, this creates the regular expressions
    // to match that eventuality
    const possibilities = zeroIndexes.map((zeroIndex)=>groups.map((group, i)=>{
            if (i === zeroIndex) {
                const elision = i === 0 || i === v6.GROUPS - 1 ? ':' : '';
                return groupPossibilities([
                    padGroup(group),
                    elision
                ]);
            }
            return padGroup(group);
        }).join(':'));
    // The simplest case
    possibilities.push(groups.map(padGroup).join(':'));
    return groupPossibilities(possibilities);
}
function possibleElisions(elidedGroups, moreLeft, moreRight) {
    const left = moreLeft ? '' : ':';
    const right = moreRight ? '' : ':';
    const possibilities = [];
    // 1. elision of everything (::)
    if (!moreLeft && !moreRight) {
        possibilities.push('::');
    }
    // 2. complete elision of the middle
    if (moreLeft && moreRight) {
        possibilities.push('');
    }
    if (moreRight && !moreLeft || !moreRight && moreLeft) {
        // 3. complete elision of one side
        possibilities.push(':');
    }
    // 4. elision from the left side
    possibilities.push(`${left}(:0{1,4}){1,${elidedGroups - 1}}`);
    // 5. elision from the right side
    possibilities.push(`(0{1,4}:){1,${elidedGroups - 1}}${right}`);
    // 6. no elision
    possibilities.push(`(0{1,4}:){${elidedGroups - 1}}0{1,4}`);
    // 7. elision (including sloppy elision) from the middle
    for(let groups = 1; groups < elidedGroups - 1; groups++){
        for(let position = 1; position < elidedGroups - groups; position++){
            possibilities.push(`(0{1,4}:){${position}}:(0{1,4}:){${elidedGroups - position - groups - 1}}0{1,4}`);
        }
    }
    return groupPossibilities(possibilities);
} //# sourceMappingURL=regular-expressions.js.map
}),
"[project]/Autonomous-Claims-Orchestrator/node_modules/ip-address/dist/ipv6.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/* eslint-disable prefer-destructuring */ /* eslint-disable no-param-reassign */ var __createBinding = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__createBinding || (Object.create ? function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = {
            enumerable: true,
            get: function() {
                return m[k];
            }
        };
    }
    Object.defineProperty(o, k2, desc);
} : function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
});
var __setModuleDefault = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__setModuleDefault || (Object.create ? function(o, v) {
    Object.defineProperty(o, "default", {
        enumerable: true,
        value: v
    });
} : function(o, v) {
    o["default"] = v;
});
var __importStar = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__importStar || function(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) {
        for(var k in mod)if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    }
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Address6 = void 0;
const common = __importStar(__turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/ip-address/dist/common.js [app-route] (ecmascript)"));
const constants4 = __importStar(__turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/ip-address/dist/v4/constants.js [app-route] (ecmascript)"));
const constants6 = __importStar(__turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/ip-address/dist/v6/constants.js [app-route] (ecmascript)"));
const helpers = __importStar(__turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/ip-address/dist/v6/helpers.js [app-route] (ecmascript)"));
const ipv4_1 = __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/ip-address/dist/ipv4.js [app-route] (ecmascript)");
const regular_expressions_1 = __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/ip-address/dist/v6/regular-expressions.js [app-route] (ecmascript)");
const address_error_1 = __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/ip-address/dist/address-error.js [app-route] (ecmascript)");
const common_1 = __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/ip-address/dist/common.js [app-route] (ecmascript)");
function assert(condition) {
    if (!condition) {
        throw new Error('Assertion failed.');
    }
}
function addCommas(number) {
    const r = /(\d+)(\d{3})/;
    while(r.test(number)){
        number = number.replace(r, '$1,$2');
    }
    return number;
}
function spanLeadingZeroes4(n) {
    n = n.replace(/^(0{1,})([1-9]+)$/, '<span class="parse-error">$1</span>$2');
    n = n.replace(/^(0{1,})(0)$/, '<span class="parse-error">$1</span>$2');
    return n;
}
/*
 * A helper function to compact an array
 */ function compact(address, slice) {
    const s1 = [];
    const s2 = [];
    let i;
    for(i = 0; i < address.length; i++){
        if (i < slice[0]) {
            s1.push(address[i]);
        } else if (i > slice[1]) {
            s2.push(address[i]);
        }
    }
    return s1.concat([
        'compact'
    ]).concat(s2);
}
function paddedHex(octet) {
    return parseInt(octet, 16).toString(16).padStart(4, '0');
}
function unsignByte(b) {
    // eslint-disable-next-line no-bitwise
    return b & 0xff;
}
/**
 * Represents an IPv6 address
 * @class Address6
 * @param {string} address - An IPv6 address string
 * @param {number} [groups=8] - How many octets to parse
 * @example
 * var address = new Address6('2001::/32');
 */ class Address6 {
    constructor(address, optionalGroups){
        this.addressMinusSuffix = '';
        this.parsedSubnet = '';
        this.subnet = '/128';
        this.subnetMask = 128;
        this.v4 = false;
        this.zone = '';
        // #region Attributes
        /**
         * Returns true if the given address is in the subnet of the current address
         * @memberof Address6
         * @instance
         * @returns {boolean}
         */ this.isInSubnet = common.isInSubnet;
        /**
         * Returns true if the address is correct, false otherwise
         * @memberof Address6
         * @instance
         * @returns {boolean}
         */ this.isCorrect = common.isCorrect(constants6.BITS);
        if (optionalGroups === undefined) {
            this.groups = constants6.GROUPS;
        } else {
            this.groups = optionalGroups;
        }
        this.address = address;
        const subnet = constants6.RE_SUBNET_STRING.exec(address);
        if (subnet) {
            this.parsedSubnet = subnet[0].replace('/', '');
            this.subnetMask = parseInt(this.parsedSubnet, 10);
            this.subnet = `/${this.subnetMask}`;
            if (Number.isNaN(this.subnetMask) || this.subnetMask < 0 || this.subnetMask > constants6.BITS) {
                throw new address_error_1.AddressError('Invalid subnet mask.');
            }
            address = address.replace(constants6.RE_SUBNET_STRING, '');
        } else if (/\//.test(address)) {
            throw new address_error_1.AddressError('Invalid subnet mask.');
        }
        const zone = constants6.RE_ZONE_STRING.exec(address);
        if (zone) {
            this.zone = zone[0];
            address = address.replace(constants6.RE_ZONE_STRING, '');
        }
        this.addressMinusSuffix = address;
        this.parsedAddress = this.parse(this.addressMinusSuffix);
    }
    static isValid(address) {
        try {
            // eslint-disable-next-line no-new
            new Address6(address);
            return true;
        } catch (e) {
            return false;
        }
    }
    /**
     * Convert a BigInt to a v6 address object
     * @memberof Address6
     * @static
     * @param {bigint} bigInt - a BigInt to convert
     * @returns {Address6}
     * @example
     * var bigInt = BigInt('1000000000000');
     * var address = Address6.fromBigInt(bigInt);
     * address.correctForm(); // '::e8:d4a5:1000'
     */ static fromBigInt(bigInt) {
        const hex = bigInt.toString(16).padStart(32, '0');
        const groups = [];
        let i;
        for(i = 0; i < constants6.GROUPS; i++){
            groups.push(hex.slice(i * 4, (i + 1) * 4));
        }
        return new Address6(groups.join(':'));
    }
    /**
     * Convert a URL (with optional port number) to an address object
     * @memberof Address6
     * @static
     * @param {string} url - a URL with optional port number
     * @example
     * var addressAndPort = Address6.fromURL('http://[ffff::]:8080/foo/');
     * addressAndPort.address.correctForm(); // 'ffff::'
     * addressAndPort.port; // 8080
     */ static fromURL(url) {
        let host;
        let port = null;
        let result;
        // If we have brackets parse them and find a port
        if (url.indexOf('[') !== -1 && url.indexOf(']:') !== -1) {
            result = constants6.RE_URL_WITH_PORT.exec(url);
            if (result === null) {
                return {
                    error: 'failed to parse address with port',
                    address: null,
                    port: null
                };
            }
            host = result[1];
            port = result[2];
        // If there's a URL extract the address
        } else if (url.indexOf('/') !== -1) {
            // Remove the protocol prefix
            url = url.replace(/^[a-z0-9]+:\/\//, '');
            // Parse the address
            result = constants6.RE_URL.exec(url);
            if (result === null) {
                return {
                    error: 'failed to parse address from URL',
                    address: null,
                    port: null
                };
            }
            host = result[1];
        // Otherwise just assign the URL to the host and let the library parse it
        } else {
            host = url;
        }
        // If there's a port convert it to an integer
        if (port) {
            port = parseInt(port, 10);
            // squelch out of range ports
            if (port < 0 || port > 65536) {
                port = null;
            }
        } else {
            // Standardize `undefined` to `null`
            port = null;
        }
        return {
            address: new Address6(host),
            port
        };
    }
    /**
     * Create an IPv6-mapped address given an IPv4 address
     * @memberof Address6
     * @static
     * @param {string} address - An IPv4 address string
     * @returns {Address6}
     * @example
     * var address = Address6.fromAddress4('192.168.0.1');
     * address.correctForm(); // '::ffff:c0a8:1'
     * address.to4in6(); // '::ffff:192.168.0.1'
     */ static fromAddress4(address) {
        const address4 = new ipv4_1.Address4(address);
        const mask6 = constants6.BITS - (constants4.BITS - address4.subnetMask);
        return new Address6(`::ffff:${address4.correctForm()}/${mask6}`);
    }
    /**
     * Return an address from ip6.arpa form
     * @memberof Address6
     * @static
     * @param {string} arpaFormAddress - an 'ip6.arpa' form address
     * @returns {Adress6}
     * @example
     * var address = Address6.fromArpa(e.f.f.f.3.c.2.6.f.f.f.e.6.6.8.e.1.0.6.7.9.4.e.c.0.0.0.0.1.0.0.2.ip6.arpa.)
     * address.correctForm(); // '2001:0:ce49:7601:e866:efff:62c3:fffe'
     */ static fromArpa(arpaFormAddress) {
        // remove ending ".ip6.arpa." or just "."
        let address = arpaFormAddress.replace(/(\.ip6\.arpa)?\.$/, '');
        const semicolonAmount = 7;
        // correct ip6.arpa form with ending removed will be 63 characters
        if (address.length !== 63) {
            throw new address_error_1.AddressError("Invalid 'ip6.arpa' form.");
        }
        const parts = address.split('.').reverse();
        for(let i = semicolonAmount; i > 0; i--){
            const insertIndex = i * 4;
            parts.splice(insertIndex, 0, ':');
        }
        address = parts.join('');
        return new Address6(address);
    }
    /**
     * Return the Microsoft UNC transcription of the address
     * @memberof Address6
     * @instance
     * @returns {String} the Microsoft UNC transcription of the address
     */ microsoftTranscription() {
        return `${this.correctForm().replace(/:/g, '-')}.ipv6-literal.net`;
    }
    /**
     * Return the first n bits of the address, defaulting to the subnet mask
     * @memberof Address6
     * @instance
     * @param {number} [mask=subnet] - the number of bits to mask
     * @returns {String} the first n bits of the address as a string
     */ mask(mask = this.subnetMask) {
        return this.getBitsBase2(0, mask);
    }
    /**
     * Return the number of possible subnets of a given size in the address
     * @memberof Address6
     * @instance
     * @param {number} [subnetSize=128] - the subnet size
     * @returns {String}
     */ // TODO: probably useful to have a numeric version of this too
    possibleSubnets(subnetSize = 128) {
        const availableBits = constants6.BITS - this.subnetMask;
        const subnetBits = Math.abs(subnetSize - constants6.BITS);
        const subnetPowers = availableBits - subnetBits;
        if (subnetPowers < 0) {
            return '0';
        }
        return addCommas((BigInt('2') ** BigInt(subnetPowers)).toString(10));
    }
    /**
     * Helper function getting start address.
     * @memberof Address6
     * @instance
     * @returns {bigint}
     */ _startAddress() {
        return BigInt(`0b${this.mask() + '0'.repeat(constants6.BITS - this.subnetMask)}`);
    }
    /**
     * The first address in the range given by this address' subnet
     * Often referred to as the Network Address.
     * @memberof Address6
     * @instance
     * @returns {Address6}
     */ startAddress() {
        return Address6.fromBigInt(this._startAddress());
    }
    /**
     * The first host address in the range given by this address's subnet ie
     * the first address after the Network Address
     * @memberof Address6
     * @instance
     * @returns {Address6}
     */ startAddressExclusive() {
        const adjust = BigInt('1');
        return Address6.fromBigInt(this._startAddress() + adjust);
    }
    /**
     * Helper function getting end address.
     * @memberof Address6
     * @instance
     * @returns {bigint}
     */ _endAddress() {
        return BigInt(`0b${this.mask() + '1'.repeat(constants6.BITS - this.subnetMask)}`);
    }
    /**
     * The last address in the range given by this address' subnet
     * Often referred to as the Broadcast
     * @memberof Address6
     * @instance
     * @returns {Address6}
     */ endAddress() {
        return Address6.fromBigInt(this._endAddress());
    }
    /**
     * The last host address in the range given by this address's subnet ie
     * the last address prior to the Broadcast Address
     * @memberof Address6
     * @instance
     * @returns {Address6}
     */ endAddressExclusive() {
        const adjust = BigInt('1');
        return Address6.fromBigInt(this._endAddress() - adjust);
    }
    /**
     * Return the scope of the address
     * @memberof Address6
     * @instance
     * @returns {String}
     */ getScope() {
        let scope = constants6.SCOPES[parseInt(this.getBits(12, 16).toString(10), 10)];
        if (this.getType() === 'Global unicast' && scope !== 'Link local') {
            scope = 'Global';
        }
        return scope || 'Unknown';
    }
    /**
     * Return the type of the address
     * @memberof Address6
     * @instance
     * @returns {String}
     */ getType() {
        for (const subnet of Object.keys(constants6.TYPES)){
            if (this.isInSubnet(new Address6(subnet))) {
                return constants6.TYPES[subnet];
            }
        }
        return 'Global unicast';
    }
    /**
     * Return the bits in the given range as a BigInt
     * @memberof Address6
     * @instance
     * @returns {bigint}
     */ getBits(start, end) {
        return BigInt(`0b${this.getBitsBase2(start, end)}`);
    }
    /**
     * Return the bits in the given range as a base-2 string
     * @memberof Address6
     * @instance
     * @returns {String}
     */ getBitsBase2(start, end) {
        return this.binaryZeroPad().slice(start, end);
    }
    /**
     * Return the bits in the given range as a base-16 string
     * @memberof Address6
     * @instance
     * @returns {String}
     */ getBitsBase16(start, end) {
        const length = end - start;
        if (length % 4 !== 0) {
            throw new Error('Length of bits to retrieve must be divisible by four');
        }
        return this.getBits(start, end).toString(16).padStart(length / 4, '0');
    }
    /**
     * Return the bits that are set past the subnet mask length
     * @memberof Address6
     * @instance
     * @returns {String}
     */ getBitsPastSubnet() {
        return this.getBitsBase2(this.subnetMask, constants6.BITS);
    }
    /**
     * Return the reversed ip6.arpa form of the address
     * @memberof Address6
     * @param {Object} options
     * @param {boolean} options.omitSuffix - omit the "ip6.arpa" suffix
     * @instance
     * @returns {String}
     */ reverseForm(options) {
        if (!options) {
            options = {};
        }
        const characters = Math.floor(this.subnetMask / 4);
        const reversed = this.canonicalForm().replace(/:/g, '').split('').slice(0, characters).reverse().join('.');
        if (characters > 0) {
            if (options.omitSuffix) {
                return reversed;
            }
            return `${reversed}.ip6.arpa.`;
        }
        if (options.omitSuffix) {
            return '';
        }
        return 'ip6.arpa.';
    }
    /**
     * Return the correct form of the address
     * @memberof Address6
     * @instance
     * @returns {String}
     */ correctForm() {
        let i;
        let groups = [];
        let zeroCounter = 0;
        const zeroes = [];
        for(i = 0; i < this.parsedAddress.length; i++){
            const value = parseInt(this.parsedAddress[i], 16);
            if (value === 0) {
                zeroCounter++;
            }
            if (value !== 0 && zeroCounter > 0) {
                if (zeroCounter > 1) {
                    zeroes.push([
                        i - zeroCounter,
                        i - 1
                    ]);
                }
                zeroCounter = 0;
            }
        }
        // Do we end with a string of zeroes?
        if (zeroCounter > 1) {
            zeroes.push([
                this.parsedAddress.length - zeroCounter,
                this.parsedAddress.length - 1
            ]);
        }
        const zeroLengths = zeroes.map((n)=>n[1] - n[0] + 1);
        if (zeroes.length > 0) {
            const index = zeroLengths.indexOf(Math.max(...zeroLengths));
            groups = compact(this.parsedAddress, zeroes[index]);
        } else {
            groups = this.parsedAddress;
        }
        for(i = 0; i < groups.length; i++){
            if (groups[i] !== 'compact') {
                groups[i] = parseInt(groups[i], 16).toString(16);
            }
        }
        let correct = groups.join(':');
        correct = correct.replace(/^compact$/, '::');
        correct = correct.replace(/(^compact)|(compact$)/, ':');
        correct = correct.replace(/compact/, '');
        return correct;
    }
    /**
     * Return a zero-padded base-2 string representation of the address
     * @memberof Address6
     * @instance
     * @returns {String}
     * @example
     * var address = new Address6('2001:4860:4001:803::1011');
     * address.binaryZeroPad();
     * // '0010000000000001010010000110000001000000000000010000100000000011
     * //  0000000000000000000000000000000000000000000000000001000000010001'
     */ binaryZeroPad() {
        return this.bigInt().toString(2).padStart(constants6.BITS, '0');
    }
    // TODO: Improve the semantics of this helper function
    parse4in6(address) {
        const groups = address.split(':');
        const lastGroup = groups.slice(-1)[0];
        const address4 = lastGroup.match(constants4.RE_ADDRESS);
        if (address4) {
            this.parsedAddress4 = address4[0];
            this.address4 = new ipv4_1.Address4(this.parsedAddress4);
            for(let i = 0; i < this.address4.groups; i++){
                if (/^0[0-9]+/.test(this.address4.parsedAddress[i])) {
                    throw new address_error_1.AddressError("IPv4 addresses can't have leading zeroes.", address.replace(constants4.RE_ADDRESS, this.address4.parsedAddress.map(spanLeadingZeroes4).join('.')));
                }
            }
            this.v4 = true;
            groups[groups.length - 1] = this.address4.toGroup6();
            address = groups.join(':');
        }
        return address;
    }
    // TODO: Make private?
    parse(address) {
        address = this.parse4in6(address);
        const badCharacters = address.match(constants6.RE_BAD_CHARACTERS);
        if (badCharacters) {
            throw new address_error_1.AddressError(`Bad character${badCharacters.length > 1 ? 's' : ''} detected in address: ${badCharacters.join('')}`, address.replace(constants6.RE_BAD_CHARACTERS, '<span class="parse-error">$1</span>'));
        }
        const badAddress = address.match(constants6.RE_BAD_ADDRESS);
        if (badAddress) {
            throw new address_error_1.AddressError(`Address failed regex: ${badAddress.join('')}`, address.replace(constants6.RE_BAD_ADDRESS, '<span class="parse-error">$1</span>'));
        }
        let groups = [];
        const halves = address.split('::');
        if (halves.length === 2) {
            let first = halves[0].split(':');
            let last = halves[1].split(':');
            if (first.length === 1 && first[0] === '') {
                first = [];
            }
            if (last.length === 1 && last[0] === '') {
                last = [];
            }
            const remaining = this.groups - (first.length + last.length);
            if (!remaining) {
                throw new address_error_1.AddressError('Error parsing groups');
            }
            this.elidedGroups = remaining;
            this.elisionBegin = first.length;
            this.elisionEnd = first.length + this.elidedGroups;
            groups = groups.concat(first);
            for(let i = 0; i < remaining; i++){
                groups.push('0');
            }
            groups = groups.concat(last);
        } else if (halves.length === 1) {
            groups = address.split(':');
            this.elidedGroups = 0;
        } else {
            throw new address_error_1.AddressError('Too many :: groups found');
        }
        groups = groups.map((group)=>parseInt(group, 16).toString(16));
        if (groups.length !== this.groups) {
            throw new address_error_1.AddressError('Incorrect number of groups found');
        }
        return groups;
    }
    /**
     * Return the canonical form of the address
     * @memberof Address6
     * @instance
     * @returns {String}
     */ canonicalForm() {
        return this.parsedAddress.map(paddedHex).join(':');
    }
    /**
     * Return the decimal form of the address
     * @memberof Address6
     * @instance
     * @returns {String}
     */ decimal() {
        return this.parsedAddress.map((n)=>parseInt(n, 16).toString(10).padStart(5, '0')).join(':');
    }
    /**
     * Return the address as a BigInt
     * @memberof Address6
     * @instance
     * @returns {bigint}
     */ bigInt() {
        return BigInt(`0x${this.parsedAddress.map(paddedHex).join('')}`);
    }
    /**
     * Return the last two groups of this address as an IPv4 address string
     * @memberof Address6
     * @instance
     * @returns {Address4}
     * @example
     * var address = new Address6('2001:4860:4001::1825:bf11');
     * address.to4().correctForm(); // '24.37.191.17'
     */ to4() {
        const binary = this.binaryZeroPad().split('');
        return ipv4_1.Address4.fromHex(BigInt(`0b${binary.slice(96, 128).join('')}`).toString(16));
    }
    /**
     * Return the v4-in-v6 form of the address
     * @memberof Address6
     * @instance
     * @returns {String}
     */ to4in6() {
        const address4 = this.to4();
        const address6 = new Address6(this.parsedAddress.slice(0, 6).join(':'), 6);
        const correct = address6.correctForm();
        let infix = '';
        if (!/:$/.test(correct)) {
            infix = ':';
        }
        return correct + infix + address4.address;
    }
    /**
     * Return an object containing the Teredo properties of the address
     * @memberof Address6
     * @instance
     * @returns {Object}
     */ inspectTeredo() {
        /*
        - Bits 0 to 31 are set to the Teredo prefix (normally 2001:0000::/32).
        - Bits 32 to 63 embed the primary IPv4 address of the Teredo server that
          is used.
        - Bits 64 to 79 can be used to define some flags. Currently only the
          higher order bit is used; it is set to 1 if the Teredo client is
          located behind a cone NAT, 0 otherwise. For Microsoft's Windows Vista
          and Windows Server 2008 implementations, more bits are used. In those
          implementations, the format for these 16 bits is "CRAAAAUG AAAAAAAA",
          where "C" remains the "Cone" flag. The "R" bit is reserved for future
          use. The "U" bit is for the Universal/Local flag (set to 0). The "G" bit
          is Individual/Group flag (set to 0). The A bits are set to a 12-bit
          randomly generated number chosen by the Teredo client to introduce
          additional protection for the Teredo node against IPv6-based scanning
          attacks.
        - Bits 80 to 95 contains the obfuscated UDP port number. This is the
          port number that is mapped by the NAT to the Teredo client with all
          bits inverted.
        - Bits 96 to 127 contains the obfuscated IPv4 address. This is the
          public IPv4 address of the NAT with all bits inverted.
        */ const prefix = this.getBitsBase16(0, 32);
        const bitsForUdpPort = this.getBits(80, 96);
        // eslint-disable-next-line no-bitwise
        const udpPort = (bitsForUdpPort ^ BigInt('0xffff')).toString();
        const server4 = ipv4_1.Address4.fromHex(this.getBitsBase16(32, 64));
        const bitsForClient4 = this.getBits(96, 128);
        // eslint-disable-next-line no-bitwise
        const client4 = ipv4_1.Address4.fromHex((bitsForClient4 ^ BigInt('0xffffffff')).toString(16));
        const flagsBase2 = this.getBitsBase2(64, 80);
        const coneNat = (0, common_1.testBit)(flagsBase2, 15);
        const reserved = (0, common_1.testBit)(flagsBase2, 14);
        const groupIndividual = (0, common_1.testBit)(flagsBase2, 8);
        const universalLocal = (0, common_1.testBit)(flagsBase2, 9);
        const nonce = BigInt(`0b${flagsBase2.slice(2, 6) + flagsBase2.slice(8, 16)}`).toString(10);
        return {
            prefix: `${prefix.slice(0, 4)}:${prefix.slice(4, 8)}`,
            server4: server4.address,
            client4: client4.address,
            flags: flagsBase2,
            coneNat,
            microsoft: {
                reserved,
                universalLocal,
                groupIndividual,
                nonce
            },
            udpPort
        };
    }
    /**
     * Return an object containing the 6to4 properties of the address
     * @memberof Address6
     * @instance
     * @returns {Object}
     */ inspect6to4() {
        /*
        - Bits 0 to 15 are set to the 6to4 prefix (2002::/16).
        - Bits 16 to 48 embed the IPv4 address of the 6to4 gateway that is used.
        */ const prefix = this.getBitsBase16(0, 16);
        const gateway = ipv4_1.Address4.fromHex(this.getBitsBase16(16, 48));
        return {
            prefix: prefix.slice(0, 4),
            gateway: gateway.address
        };
    }
    /**
     * Return a v6 6to4 address from a v6 v4inv6 address
     * @memberof Address6
     * @instance
     * @returns {Address6}
     */ to6to4() {
        if (!this.is4()) {
            return null;
        }
        const addr6to4 = [
            '2002',
            this.getBitsBase16(96, 112),
            this.getBitsBase16(112, 128),
            '',
            '/16'
        ].join(':');
        return new Address6(addr6to4);
    }
    /**
     * Return a byte array
     * @memberof Address6
     * @instance
     * @returns {Array}
     */ toByteArray() {
        const valueWithoutPadding = this.bigInt().toString(16);
        const leadingPad = '0'.repeat(valueWithoutPadding.length % 2);
        const value = `${leadingPad}${valueWithoutPadding}`;
        const bytes = [];
        for(let i = 0, length = value.length; i < length; i += 2){
            bytes.push(parseInt(value.substring(i, i + 2), 16));
        }
        return bytes;
    }
    /**
     * Return an unsigned byte array
     * @memberof Address6
     * @instance
     * @returns {Array}
     */ toUnsignedByteArray() {
        return this.toByteArray().map(unsignByte);
    }
    /**
     * Convert a byte array to an Address6 object
     * @memberof Address6
     * @static
     * @returns {Address6}
     */ static fromByteArray(bytes) {
        return this.fromUnsignedByteArray(bytes.map(unsignByte));
    }
    /**
     * Convert an unsigned byte array to an Address6 object
     * @memberof Address6
     * @static
     * @returns {Address6}
     */ static fromUnsignedByteArray(bytes) {
        const BYTE_MAX = BigInt('256');
        let result = BigInt('0');
        let multiplier = BigInt('1');
        for(let i = bytes.length - 1; i >= 0; i--){
            result += multiplier * BigInt(bytes[i].toString(10));
            multiplier *= BYTE_MAX;
        }
        return Address6.fromBigInt(result);
    }
    /**
     * Returns true if the address is in the canonical form, false otherwise
     * @memberof Address6
     * @instance
     * @returns {boolean}
     */ isCanonical() {
        return this.addressMinusSuffix === this.canonicalForm();
    }
    /**
     * Returns true if the address is a link local address, false otherwise
     * @memberof Address6
     * @instance
     * @returns {boolean}
     */ isLinkLocal() {
        // Zeroes are required, i.e. we can't check isInSubnet with 'fe80::/10'
        if (this.getBitsBase2(0, 64) === '1111111010000000000000000000000000000000000000000000000000000000') {
            return true;
        }
        return false;
    }
    /**
     * Returns true if the address is a multicast address, false otherwise
     * @memberof Address6
     * @instance
     * @returns {boolean}
     */ isMulticast() {
        return this.getType() === 'Multicast';
    }
    /**
     * Returns true if the address is a v4-in-v6 address, false otherwise
     * @memberof Address6
     * @instance
     * @returns {boolean}
     */ is4() {
        return this.v4;
    }
    /**
     * Returns true if the address is a Teredo address, false otherwise
     * @memberof Address6
     * @instance
     * @returns {boolean}
     */ isTeredo() {
        return this.isInSubnet(new Address6('2001::/32'));
    }
    /**
     * Returns true if the address is a 6to4 address, false otherwise
     * @memberof Address6
     * @instance
     * @returns {boolean}
     */ is6to4() {
        return this.isInSubnet(new Address6('2002::/16'));
    }
    /**
     * Returns true if the address is a loopback address, false otherwise
     * @memberof Address6
     * @instance
     * @returns {boolean}
     */ isLoopback() {
        return this.getType() === 'Loopback';
    }
    // #endregion
    // #region HTML
    /**
     * @returns {String} the address in link form with a default port of 80
     */ href(optionalPort) {
        if (optionalPort === undefined) {
            optionalPort = '';
        } else {
            optionalPort = `:${optionalPort}`;
        }
        return `http://[${this.correctForm()}]${optionalPort}/`;
    }
    /**
     * @returns {String} a link suitable for conveying the address via a URL hash
     */ link(options) {
        if (!options) {
            options = {};
        }
        if (options.className === undefined) {
            options.className = '';
        }
        if (options.prefix === undefined) {
            options.prefix = '/#address=';
        }
        if (options.v4 === undefined) {
            options.v4 = false;
        }
        let formFunction = this.correctForm;
        if (options.v4) {
            formFunction = this.to4in6;
        }
        const form = formFunction.call(this);
        if (options.className) {
            return `<a href="${options.prefix}${form}" class="${options.className}">${form}</a>`;
        }
        return `<a href="${options.prefix}${form}">${form}</a>`;
    }
    /**
     * Groups an address
     * @returns {String}
     */ group() {
        if (this.elidedGroups === 0) {
            // The simple case
            return helpers.simpleGroup(this.address).join(':');
        }
        assert(typeof this.elidedGroups === 'number');
        assert(typeof this.elisionBegin === 'number');
        // The elided case
        const output = [];
        const [left, right] = this.address.split('::');
        if (left.length) {
            output.push(...helpers.simpleGroup(left));
        } else {
            output.push('');
        }
        const classes = [
            'hover-group'
        ];
        for(let i = this.elisionBegin; i < this.elisionBegin + this.elidedGroups; i++){
            classes.push(`group-${i}`);
        }
        output.push(`<span class="${classes.join(' ')}"></span>`);
        if (right.length) {
            output.push(...helpers.simpleGroup(right, this.elisionEnd));
        } else {
            output.push('');
        }
        if (this.is4()) {
            assert(this.address4 instanceof ipv4_1.Address4);
            output.pop();
            output.push(this.address4.groupForV6());
        }
        return output.join(':');
    }
    // #endregion
    // #region Regular expressions
    /**
     * Generate a regular expression string that can be used to find or validate
     * all variations of this address
     * @memberof Address6
     * @instance
     * @param {boolean} substringSearch
     * @returns {string}
     */ regularExpressionString(substringSearch = false) {
        let output = [];
        // TODO: revisit why this is necessary
        const address6 = new Address6(this.correctForm());
        if (address6.elidedGroups === 0) {
            // The simple case
            output.push((0, regular_expressions_1.simpleRegularExpression)(address6.parsedAddress));
        } else if (address6.elidedGroups === constants6.GROUPS) {
            // A completely elided address
            output.push((0, regular_expressions_1.possibleElisions)(constants6.GROUPS));
        } else {
            // A partially elided address
            const halves = address6.address.split('::');
            if (halves[0].length) {
                output.push((0, regular_expressions_1.simpleRegularExpression)(halves[0].split(':')));
            }
            assert(typeof address6.elidedGroups === 'number');
            output.push((0, regular_expressions_1.possibleElisions)(address6.elidedGroups, halves[0].length !== 0, halves[1].length !== 0));
            if (halves[1].length) {
                output.push((0, regular_expressions_1.simpleRegularExpression)(halves[1].split(':')));
            }
            output = [
                output.join(':')
            ];
        }
        if (!substringSearch) {
            output = [
                '(?=^|',
                regular_expressions_1.ADDRESS_BOUNDARY,
                '|[^\\w\\:])(',
                ...output,
                ')(?=[^\\w\\:]|',
                regular_expressions_1.ADDRESS_BOUNDARY,
                '|$)'
            ];
        }
        return output.join('');
    }
    /**
     * Generate a regular expression that can be used to find or validate all
     * variations of this address.
     * @memberof Address6
     * @instance
     * @param {boolean} substringSearch
     * @returns {RegExp}
     */ regularExpression(substringSearch = false) {
        return new RegExp(this.regularExpressionString(substringSearch), 'i');
    }
}
exports.Address6 = Address6; //# sourceMappingURL=ipv6.js.map
}),
"[project]/Autonomous-Claims-Orchestrator/node_modules/ip-address/dist/ip-address.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __createBinding = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__createBinding || (Object.create ? function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = {
            enumerable: true,
            get: function() {
                return m[k];
            }
        };
    }
    Object.defineProperty(o, k2, desc);
} : function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
});
var __setModuleDefault = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__setModuleDefault || (Object.create ? function(o, v) {
    Object.defineProperty(o, "default", {
        enumerable: true,
        value: v
    });
} : function(o, v) {
    o["default"] = v;
});
var __importStar = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__importStar || function(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) {
        for(var k in mod)if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    }
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.v6 = exports.AddressError = exports.Address6 = exports.Address4 = void 0;
var ipv4_1 = __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/ip-address/dist/ipv4.js [app-route] (ecmascript)");
Object.defineProperty(exports, "Address4", {
    enumerable: true,
    get: function() {
        return ipv4_1.Address4;
    }
});
var ipv6_1 = __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/ip-address/dist/ipv6.js [app-route] (ecmascript)");
Object.defineProperty(exports, "Address6", {
    enumerable: true,
    get: function() {
        return ipv6_1.Address6;
    }
});
var address_error_1 = __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/ip-address/dist/address-error.js [app-route] (ecmascript)");
Object.defineProperty(exports, "AddressError", {
    enumerable: true,
    get: function() {
        return address_error_1.AddressError;
    }
});
const helpers = __importStar(__turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/ip-address/dist/v6/helpers.js [app-route] (ecmascript)"));
exports.v6 = {
    helpers
}; //# sourceMappingURL=ip-address.js.map
}),
"[project]/Autonomous-Claims-Orchestrator/node_modules/punycode.js/punycode.es6.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "decode",
    ()=>decode,
    "default",
    ()=>__TURBOPACK__default__export__,
    "encode",
    ()=>encode,
    "toASCII",
    ()=>toASCII,
    "toUnicode",
    ()=>toUnicode,
    "ucs2decode",
    ()=>ucs2decode,
    "ucs2encode",
    ()=>ucs2encode
]);
'use strict';
/** Highest positive signed 32-bit float value */ const maxInt = 2147483647; // aka. 0x7FFFFFFF or 2^31-1
/** Bootstring parameters */ const base = 36;
const tMin = 1;
const tMax = 26;
const skew = 38;
const damp = 700;
const initialBias = 72;
const initialN = 128; // 0x80
const delimiter = '-'; // '\x2D'
/** Regular expressions */ const regexPunycode = /^xn--/;
const regexNonASCII = /[^\0-\x7F]/; // Note: U+007F DEL is excluded too.
const regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g; // RFC 3490 separators
/** Error messages */ const errors = {
    'overflow': 'Overflow: input needs wider integers to process',
    'not-basic': 'Illegal input >= 0x80 (not a basic code point)',
    'invalid-input': 'Invalid input'
};
/** Convenience shortcuts */ const baseMinusTMin = base - tMin;
const floor = Math.floor;
const stringFromCharCode = String.fromCharCode;
/*--------------------------------------------------------------------------*/ /**
 * A generic error utility function.
 * @private
 * @param {String} type The error type.
 * @returns {Error} Throws a `RangeError` with the applicable error message.
 */ function error(type) {
    throw new RangeError(errors[type]);
}
/**
 * A generic `Array#map` utility function.
 * @private
 * @param {Array} array The array to iterate over.
 * @param {Function} callback The function that gets called for every array
 * item.
 * @returns {Array} A new array of values returned by the callback function.
 */ function map(array, callback) {
    const result = [];
    let length = array.length;
    while(length--){
        result[length] = callback(array[length]);
    }
    return result;
}
/**
 * A simple `Array#map`-like wrapper to work with domain name strings or email
 * addresses.
 * @private
 * @param {String} domain The domain name or email address.
 * @param {Function} callback The function that gets called for every
 * character.
 * @returns {String} A new string of characters returned by the callback
 * function.
 */ function mapDomain(domain, callback) {
    const parts = domain.split('@');
    let result = '';
    if (parts.length > 1) {
        // In email addresses, only the domain name should be punycoded. Leave
        // the local part (i.e. everything up to `@`) intact.
        result = parts[0] + '@';
        domain = parts[1];
    }
    // Avoid `split(regex)` for IE8 compatibility. See #17.
    domain = domain.replace(regexSeparators, '\x2E');
    const labels = domain.split('.');
    const encoded = map(labels, callback).join('.');
    return result + encoded;
}
/**
 * Creates an array containing the numeric code points of each Unicode
 * character in the string. While JavaScript uses UCS-2 internally,
 * this function will convert a pair of surrogate halves (each of which
 * UCS-2 exposes as separate characters) into a single code point,
 * matching UTF-16.
 * @see `punycode.ucs2.encode`
 * @see <https://mathiasbynens.be/notes/javascript-encoding>
 * @memberOf punycode.ucs2
 * @name decode
 * @param {String} string The Unicode input string (UCS-2).
 * @returns {Array} The new array of code points.
 */ function ucs2decode(string) {
    const output = [];
    let counter = 0;
    const length = string.length;
    while(counter < length){
        const value = string.charCodeAt(counter++);
        if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
            // It's a high surrogate, and there is a next character.
            const extra = string.charCodeAt(counter++);
            if ((extra & 0xFC00) == 0xDC00) {
                output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
            } else {
                // It's an unmatched surrogate; only append this code unit, in case the
                // next code unit is the high surrogate of a surrogate pair.
                output.push(value);
                counter--;
            }
        } else {
            output.push(value);
        }
    }
    return output;
}
/**
 * Creates a string based on an array of numeric code points.
 * @see `punycode.ucs2.decode`
 * @memberOf punycode.ucs2
 * @name encode
 * @param {Array} codePoints The array of numeric code points.
 * @returns {String} The new Unicode string (UCS-2).
 */ const ucs2encode = (codePoints)=>String.fromCodePoint(...codePoints);
/**
 * Converts a basic code point into a digit/integer.
 * @see `digitToBasic()`
 * @private
 * @param {Number} codePoint The basic numeric code point value.
 * @returns {Number} The numeric value of a basic code point (for use in
 * representing integers) in the range `0` to `base - 1`, or `base` if
 * the code point does not represent a value.
 */ const basicToDigit = function(codePoint) {
    if (codePoint >= 0x30 && codePoint < 0x3A) {
        return 26 + (codePoint - 0x30);
    }
    if (codePoint >= 0x41 && codePoint < 0x5B) {
        return codePoint - 0x41;
    }
    if (codePoint >= 0x61 && codePoint < 0x7B) {
        return codePoint - 0x61;
    }
    return base;
};
/**
 * Converts a digit/integer into a basic code point.
 * @see `basicToDigit()`
 * @private
 * @param {Number} digit The numeric value of a basic code point.
 * @returns {Number} The basic code point whose value (when used for
 * representing integers) is `digit`, which needs to be in the range
 * `0` to `base - 1`. If `flag` is non-zero, the uppercase form is
 * used; else, the lowercase form is used. The behavior is undefined
 * if `flag` is non-zero and `digit` has no uppercase form.
 */ const digitToBasic = function(digit, flag) {
    //  0..25 map to ASCII a..z or A..Z
    // 26..35 map to ASCII 0..9
    return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
};
/**
 * Bias adaptation function as per section 3.4 of RFC 3492.
 * https://tools.ietf.org/html/rfc3492#section-3.4
 * @private
 */ const adapt = function(delta, numPoints, firstTime) {
    let k = 0;
    delta = firstTime ? floor(delta / damp) : delta >> 1;
    delta += floor(delta / numPoints);
    for(; delta > baseMinusTMin * tMax >> 1; k += base){
        delta = floor(delta / baseMinusTMin);
    }
    return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
};
/**
 * Converts a Punycode string of ASCII-only symbols to a string of Unicode
 * symbols.
 * @memberOf punycode
 * @param {String} input The Punycode string of ASCII-only symbols.
 * @returns {String} The resulting string of Unicode symbols.
 */ const decode = function(input) {
    // Don't use UCS-2.
    const output = [];
    const inputLength = input.length;
    let i = 0;
    let n = initialN;
    let bias = initialBias;
    // Handle the basic code points: let `basic` be the number of input code
    // points before the last delimiter, or `0` if there is none, then copy
    // the first basic code points to the output.
    let basic = input.lastIndexOf(delimiter);
    if (basic < 0) {
        basic = 0;
    }
    for(let j = 0; j < basic; ++j){
        // if it's not a basic code point
        if (input.charCodeAt(j) >= 0x80) {
            error('not-basic');
        }
        output.push(input.charCodeAt(j));
    }
    // Main decoding loop: start just after the last delimiter if any basic code
    // points were copied; start at the beginning otherwise.
    for(let index = basic > 0 ? basic + 1 : 0; index < inputLength;){
        // `index` is the index of the next character to be consumed.
        // Decode a generalized variable-length integer into `delta`,
        // which gets added to `i`. The overflow checking is easier
        // if we increase `i` as we go, then subtract off its starting
        // value at the end to obtain `delta`.
        const oldi = i;
        for(let w = 1, k = base;; k += base){
            if (index >= inputLength) {
                error('invalid-input');
            }
            const digit = basicToDigit(input.charCodeAt(index++));
            if (digit >= base) {
                error('invalid-input');
            }
            if (digit > floor((maxInt - i) / w)) {
                error('overflow');
            }
            i += digit * w;
            const t = k <= bias ? tMin : k >= bias + tMax ? tMax : k - bias;
            if (digit < t) {
                break;
            }
            const baseMinusT = base - t;
            if (w > floor(maxInt / baseMinusT)) {
                error('overflow');
            }
            w *= baseMinusT;
        }
        const out = output.length + 1;
        bias = adapt(i - oldi, out, oldi == 0);
        // `i` was supposed to wrap around from `out` to `0`,
        // incrementing `n` each time, so we'll fix that now:
        if (floor(i / out) > maxInt - n) {
            error('overflow');
        }
        n += floor(i / out);
        i %= out;
        // Insert `n` at position `i` of the output.
        output.splice(i++, 0, n);
    }
    return String.fromCodePoint(...output);
};
/**
 * Converts a string of Unicode symbols (e.g. a domain name label) to a
 * Punycode string of ASCII-only symbols.
 * @memberOf punycode
 * @param {String} input The string of Unicode symbols.
 * @returns {String} The resulting Punycode string of ASCII-only symbols.
 */ const encode = function(input) {
    const output = [];
    // Convert the input in UCS-2 to an array of Unicode code points.
    input = ucs2decode(input);
    // Cache the length.
    const inputLength = input.length;
    // Initialize the state.
    let n = initialN;
    let delta = 0;
    let bias = initialBias;
    // Handle the basic code points.
    for (const currentValue of input){
        if (currentValue < 0x80) {
            output.push(stringFromCharCode(currentValue));
        }
    }
    const basicLength = output.length;
    let handledCPCount = basicLength;
    // `handledCPCount` is the number of code points that have been handled;
    // `basicLength` is the number of basic code points.
    // Finish the basic string with a delimiter unless it's empty.
    if (basicLength) {
        output.push(delimiter);
    }
    // Main encoding loop:
    while(handledCPCount < inputLength){
        // All non-basic code points < n have been handled already. Find the next
        // larger one:
        let m = maxInt;
        for (const currentValue of input){
            if (currentValue >= n && currentValue < m) {
                m = currentValue;
            }
        }
        // Increase `delta` enough to advance the decoder's <n,i> state to <m,0>,
        // but guard against overflow.
        const handledCPCountPlusOne = handledCPCount + 1;
        if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
            error('overflow');
        }
        delta += (m - n) * handledCPCountPlusOne;
        n = m;
        for (const currentValue of input){
            if (currentValue < n && ++delta > maxInt) {
                error('overflow');
            }
            if (currentValue === n) {
                // Represent delta as a generalized variable-length integer.
                let q = delta;
                for(let k = base;; k += base){
                    const t = k <= bias ? tMin : k >= bias + tMax ? tMax : k - bias;
                    if (q < t) {
                        break;
                    }
                    const qMinusT = q - t;
                    const baseMinusT = base - t;
                    output.push(stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0)));
                    q = floor(qMinusT / baseMinusT);
                }
                output.push(stringFromCharCode(digitToBasic(q, 0)));
                bias = adapt(delta, handledCPCountPlusOne, handledCPCount === basicLength);
                delta = 0;
                ++handledCPCount;
            }
        }
        ++delta;
        ++n;
    }
    return output.join('');
};
/**
 * Converts a Punycode string representing a domain name or an email address
 * to Unicode. Only the Punycoded parts of the input will be converted, i.e.
 * it doesn't matter if you call it on a string that has already been
 * converted to Unicode.
 * @memberOf punycode
 * @param {String} input The Punycoded domain name or email address to
 * convert to Unicode.
 * @returns {String} The Unicode representation of the given Punycode
 * string.
 */ const toUnicode = function(input) {
    return mapDomain(input, function(string) {
        return regexPunycode.test(string) ? decode(string.slice(4).toLowerCase()) : string;
    });
};
/**
 * Converts a Unicode string representing a domain name or an email address to
 * Punycode. Only the non-ASCII parts of the domain name will be converted,
 * i.e. it doesn't matter if you call it with a domain that's already in
 * ASCII.
 * @memberOf punycode
 * @param {String} input The domain name or email address to convert, as a
 * Unicode string.
 * @returns {String} The Punycode representation of the given domain name or
 * email address.
 */ const toASCII = function(input) {
    return mapDomain(input, function(string) {
        return regexNonASCII.test(string) ? 'xn--' + encode(string) : string;
    });
};
/*--------------------------------------------------------------------------*/ /** Define the public API */ const punycode = {
    /**
	 * A string representing the current Punycode.js version number.
	 * @memberOf punycode
	 * @type String
	 */ 'version': '2.3.1',
    /**
	 * An object of methods to convert from JavaScript's internal character
	 * representation (UCS-2) to Unicode code points, and back.
	 * @see <https://mathiasbynens.be/notes/javascript-encoding>
	 * @memberOf punycode
	 * @type Object
	 */ 'ucs2': {
        'decode': ucs2decode,
        'encode': ucs2encode
    },
    'decode': decode,
    'encode': encode,
    'toASCII': toASCII,
    'toUnicode': toUnicode
};
;
const __TURBOPACK__default__export__ = punycode;
}),
"[project]/Autonomous-Claims-Orchestrator/node_modules/mailparser/lib/stream-hash.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const crypto = __turbopack_context__.r("[externals]/crypto [external] (crypto, cjs)");
const Transform = __turbopack_context__.r("[externals]/stream [external] (stream, cjs)").Transform;
class StreamHash extends Transform {
    constructor(attachment, algo){
        super();
        this.attachment = attachment;
        this.algo = (algo || 'md5').toLowerCase();
        this.hash = crypto.createHash(algo);
        this.byteCount = 0;
    }
    _transform(chunk, encoding, done) {
        this.hash.update(chunk);
        this.byteCount += chunk.length;
        done(null, chunk);
    }
    _flush(done) {
        this.attachment.checksum = this.hash.digest('hex');
        this.attachment.size = this.byteCount;
        done();
    }
}
module.exports = StreamHash;
}),
"[project]/Autonomous-Claims-Orchestrator/node_modules/mailparser/lib/mail-parser.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const mailsplit = __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/@zone-eu/mailsplit/index.js [app-route] (ecmascript)");
const libmime = __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/libmime/lib/libmime.js [app-route] (ecmascript)");
const addressparser = __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/nodemailer/lib/addressparser/index.js [app-route] (ecmascript)");
const Transform = __turbopack_context__.r("[externals]/stream [external] (stream, cjs)").Transform;
const Splitter = mailsplit.Splitter;
const ChunkedPassthrough = mailsplit.ChunkedPassthrough;
const punycode = __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/punycode.js/punycode.es6.js [app-route] (ecmascript)");
const FlowedDecoder = __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/@zone-eu/mailsplit/lib/flowed-decoder.js [app-route] (ecmascript)");
const StreamHash = __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/mailparser/lib/stream-hash.js [app-route] (ecmascript)");
const iconv = __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/iconv-lite/lib/index.js [app-route] (ecmascript)");
const { htmlToText } = __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/html-to-text/lib/html-to-text.cjs [app-route] (ecmascript)");
const he = __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/he/he.js [app-route] (ecmascript)");
const linkify = __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/linkify-it/build/index.cjs.js [app-route] (ecmascript)")();
const tlds = __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/tlds/index.json (json)");
const encodingJapanese = __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/encoding-japanese/src/index.js [app-route] (ecmascript)");
linkify.tlds(tlds) // Reload with full tlds list
.tlds('onion', true) // Add unofficial `.onion` domain
.add('git:', 'http:') // Add `git:` ptotocol as "alias"
.add('ftp:', null) // Disable `ftp:` ptotocol
.set({
    fuzzyIP: true,
    fuzzyLink: true,
    fuzzyEmail: true
});
// twitter linkifier from
// https://github.com/markdown-it/linkify-it#example-2-add-twitter-mentions-handler
linkify.add('@', {
    validate (text, pos, self) {
        let tail = text.slice(pos);
        if (!self.re.twitter) {
            self.re.twitter = new RegExp('^([a-zA-Z0-9_]){1,15}(?!_)(?=$|' + self.re.src_ZPCc + ')');
        }
        if (self.re.twitter.test(tail)) {
            // Linkifier allows punctuation chars before prefix,
            // but we additionally disable `@` ("@@mention" is invalid)
            if (pos >= 2 && tail[pos - 2] === '@') {
                return false;
            }
            return tail.match(self.re.twitter)[0].length;
        }
        return 0;
    },
    normalize (match) {
        match.url = 'https://twitter.com/' + match.url.replace(/^@/, '');
    }
});
class IconvDecoder extends Transform {
    constructor(Iconv, charset){
        super();
        // Iconv throws error on ks_c_5601-1987 when it is mapped to EUC-KR
        // https://github.com/bnoordhuis/node-iconv/issues/169
        if (charset.toLowerCase() === 'ks_c_5601-1987') {
            charset = 'CP949';
        }
        this.stream = new Iconv(charset, 'UTF-8//TRANSLIT//IGNORE');
        this.inputEnded = false;
        this.endCb = false;
        this.stream.on('error', (err)=>this.emit('error', err));
        this.stream.on('data', (chunk)=>this.push(chunk));
        this.stream.on('end', ()=>{
            this.inputEnded = true;
            if (typeof this.endCb === 'function') {
                this.endCb();
            }
        });
    }
    _transform(chunk, encoding, done) {
        this.stream.write(chunk);
        done();
    }
    _flush(done) {
        this.endCb = done;
        this.stream.end();
    }
}
class JPDecoder extends Transform {
    constructor(charset){
        super();
        this.charset = charset;
        this.chunks = [];
        this.chunklen = 0;
    }
    _transform(chunk, encoding, done) {
        if (typeof chunk === 'string') {
            chunk = Buffer.from(chunk, encoding);
        }
        this.chunks.push(chunk);
        this.chunklen += chunk.length;
        done();
    }
    _flush(done) {
        let input = Buffer.concat(this.chunks, this.chunklen);
        try {
            let output = encodingJapanese.convert(input, {
                to: 'UNICODE',
                from: this.charset,
                type: 'string'
            });
            if (typeof output === 'string') {
                output = Buffer.from(output);
            }
            this.push(output);
        } catch (err) {
            // keep as is on errors
            this.push(input);
        }
        done();
    }
}
class MailParser extends Transform {
    constructor(config){
        super({
            readableObjectMode: true,
            writableObjectMode: false
        });
        this.options = config || {};
        this.chunkedPassthrough = new ChunkedPassthrough();
        this.splitter = new Splitter(config);
        this.chunkedPassthrough.pipe(this.splitter);
        this.finished = false;
        this.waitingEnd = false;
        this.headers = false;
        this.headerLines = false;
        this.endReceived = false;
        this.reading = false;
        this.hasFailed = false;
        this.tree = false;
        this.curnode = false;
        this.waitUntilAttachmentEnd = false;
        this.attachmentCallback = false;
        this.hasHtml = false;
        this.hasText = false;
        this.text = false;
        this.html = false;
        this.textAsHtml = false;
        this.attachmentList = [];
        this.boundaries = [];
        this.textTypes = [
            'text/plain',
            'text/html'
        ].concat(!this.options.keepDeliveryStatus ? 'message/delivery-status' : []);
        this.decoder = this.getDecoder();
        this.chunkedPassthrough.on('error', (err)=>{
            this.splitter.emit('error', err);
        });
        this.splitter.on('readable', ()=>{
            if (this.reading) {
                return false;
            }
            this.readData();
        });
        this.splitter.on('end', ()=>{
            this.endReceived = true;
            if (!this.reading) {
                this.endStream();
            }
        });
        this.splitter.on('error', (err)=>{
            this.hasFailed = true;
            if (typeof this.waitingEnd === 'function') {
                return this.waitingEnd(err);
            }
            this.emit('error', err);
        });
        this.libmime = new libmime.Libmime({
            Iconv: this.options.Iconv
        });
    }
    getDecoder() {
        if (this.options.Iconv) {
            const Iconv = this.options.Iconv;
            // create wrapper
            return {
                decodeStream (charset) {
                    return new IconvDecoder(Iconv, charset);
                }
            };
        } else {
            return {
                decodeStream (charset) {
                    charset = (charset || 'ascii').toString().trim().toLowerCase();
                    if (/^jis|^iso-?2022-?jp|^EUCJP/i.test(charset)) {
                        // special case not supported by iconv-lite
                        return new JPDecoder(charset);
                    }
                    return iconv.decodeStream(charset);
                }
            };
        }
    }
    readData() {
        if (this.hasFailed) {
            return false;
        }
        this.reading = true;
        let data = this.splitter.read();
        if (data === null) {
            this.reading = false;
            if (this.endReceived) {
                this.endStream();
            }
            return;
        }
        this.processChunk(data, (err)=>{
            if (err) {
                if (typeof this.waitingEnd === 'function') {
                    return this.waitingEnd(err);
                }
                return this.emit('error', err);
            }
            setImmediate(()=>this.readData());
        });
    }
    endStream() {
        this.finished = true;
        if (this.curnode && this.curnode.decoder) {
            this.curnode.decoder.end();
        }
        if (typeof this.waitingEnd === 'function') {
            this.waitingEnd();
        }
    }
    _transform(chunk, encoding, done) {
        if (!chunk || !chunk.length) {
            return done();
        }
        if (this.chunkedPassthrough.write(chunk) === false) {
            return this.chunkedPassthrough.once('drain', ()=>{
                done();
            });
        } else {
            return done();
        }
    }
    _flush(done) {
        setImmediate(()=>this.chunkedPassthrough.end());
        if (this.finished) {
            return this.cleanup(done);
        }
        this.waitingEnd = ()=>{
            this.cleanup(()=>{
                done();
            });
        };
    }
    cleanup(done) {
        let finish = ()=>{
            try {
                let t = this.getTextContent();
                this.push(t);
            } catch (err) {
                return this.emit('error', err);
            }
            done();
        };
        if (this.curnode && this.curnode.decoder && this.curnode.decoder.readable && !this.decoderEnded) {
            (this.curnode.contentStream || this.curnode.decoder).once('end', ()=>{
                finish();
            });
            this.curnode.decoder.end();
        } else {
            setImmediate(()=>{
                finish();
            });
        }
    }
    processHeaders(lines) {
        let headers = new Map();
        (lines || []).forEach((line)=>{
            let key = line.key;
            let value = ((this.libmime.decodeHeader(line.line) || {}).value || '').toString().trim();
            value = Buffer.from(value, 'binary').toString();
            switch(key){
                case 'content-type':
                case 'content-disposition':
                case 'dkim-signature':
                    value = this.libmime.parseHeaderValue(value);
                    if (value.value) {
                        value.value = this.libmime.decodeWords(value.value);
                    }
                    Object.keys(value && value.params || {}).forEach((key)=>{
                        try {
                            value.params[key] = this.libmime.decodeWords(value.params[key]);
                        } catch (E) {
                        // ignore, keep as is
                        }
                    });
                    break;
                case 'date':
                    {
                        let dateValue = new Date(value);
                        if (isNaN(dateValue)) {
                            // date parsing failed :S
                            dateValue = new Date();
                        }
                        value = dateValue;
                        break;
                    }
                case 'subject':
                    try {
                        value = this.libmime.decodeWords(value);
                    } catch (E) {
                    // ignore, keep as is
                    }
                    break;
                case 'references':
                    try {
                        value = this.libmime.decodeWords(value);
                    } catch (E) {
                    // ignore
                    }
                    value = value.split(/\s+/).map(this.ensureMessageIDFormat);
                    break;
                case 'message-id':
                case 'in-reply-to':
                    try {
                        value = this.libmime.decodeWords(value);
                    } catch (E) {
                    // ignore
                    }
                    value = this.ensureMessageIDFormat(value);
                    break;
                case 'priority':
                case 'x-priority':
                case 'x-msmail-priority':
                case 'importance':
                    key = 'priority';
                    value = this.parsePriority(value);
                    break;
                case 'from':
                case 'to':
                case 'cc':
                case 'bcc':
                case 'sender':
                case 'reply-to':
                case 'delivered-to':
                case 'return-path':
                case 'disposition-notification-to':
                    value = addressparser(value);
                    this.decodeAddresses(value);
                    value = {
                        value,
                        html: this.getAddressesHTML(value),
                        text: this.getAddressesText(value)
                    };
                    break;
            }
            // handle list-* keys
            if (key.substr(0, 5) === 'list-') {
                value = this.parseListHeader(key.substr(5), value);
                key = 'list';
            }
            if (value) {
                if (!headers.has(key)) {
                    headers.set(key, [].concat(value || []));
                } else if (Array.isArray(value)) {
                    headers.set(key, headers.get(key).concat(value));
                } else {
                    headers.get(key).push(value);
                }
            }
        });
        // keep only the first value
        let singleKeys = [
            'message-id',
            'content-id',
            'from',
            'sender',
            'in-reply-to',
            'reply-to',
            'subject',
            'date',
            'content-disposition',
            'content-type',
            'content-transfer-encoding',
            'priority',
            'mime-version',
            'content-description',
            'precedence',
            'errors-to',
            'disposition-notification-to'
        ];
        headers.forEach((value, key)=>{
            if (Array.isArray(value)) {
                if (singleKeys.includes(key) && value.length) {
                    headers.set(key, value[value.length - 1]);
                } else if (value.length === 1) {
                    headers.set(key, value[0]);
                }
            }
            if (key === 'list') {
                // normalize List-* headers
                let listValue = {};
                [].concat(value || []).forEach((val)=>{
                    Object.keys(val || {}).forEach((listKey)=>{
                        listValue[listKey] = val[listKey];
                    });
                });
                headers.set(key, listValue);
            }
        });
        return headers;
    }
    parseListHeader(key, value) {
        let addresses = addressparser(value);
        let response = {};
        let data = addresses.map((address)=>{
            if (/^https?:/i.test(address.name)) {
                response.url = address.name;
            } else if (address.name) {
                response.name = address.name;
            }
            if (/^mailto:/.test(address.address)) {
                response.mail = address.address.substr(7);
            } else if (address.address && address.address.indexOf('@') < 0) {
                response.id = address.address;
            } else if (address.address) {
                response.mail = address.address;
            }
            if (Object.keys(response).length) {
                return response;
            }
            return false;
        }).filter((address)=>address);
        if (data.length) {
            return {
                [key]: response
            };
        }
        return false;
    }
    parsePriority(value) {
        value = value.toLowerCase().trim();
        if (!isNaN(parseInt(value, 10))) {
            // support "X-Priority: 1 (Highest)"
            value = parseInt(value, 10) || 0;
            if (value === 3) {
                return 'normal';
            } else if (value > 3) {
                return 'low';
            } else {
                return 'high';
            }
        } else {
            switch(value){
                case 'non-urgent':
                case 'low':
                    return 'low';
                case 'urgent':
                case 'high':
                    return 'high';
            }
        }
        return 'normal';
    }
    ensureMessageIDFormat(value) {
        if (!value.length) {
            return false;
        }
        if (value.charAt(0) !== '<') {
            value = '<' + value;
        }
        if (value.charAt(value.length - 1) !== '>') {
            value += '>';
        }
        return value;
    }
    decodeAddresses(addresses) {
        let processedAddress = new WeakSet();
        for(let i = 0; i < addresses.length; i++){
            let address = addresses[i];
            address.name = (address.name || '').toString().trim();
            if (!address.address && /^(=\?([^?]+)\?[Bb]\?[^?]*\?=)(\s*=\?([^?]+)\?[Bb]\?[^?]*\?=)*$/.test(address.name) && !processedAddress.has(address)) {
                let parsed = addressparser(this.libmime.decodeWords(address.name));
                if (parsed.length) {
                    parsed.forEach((entry)=>{
                        processedAddress.add(entry);
                        addresses.push(entry);
                    });
                }
                // remove current element
                addresses.splice(i, 1);
                i--;
                continue;
            }
            if (address.name) {
                try {
                    address.name = this.libmime.decodeWords(address.name);
                } catch (E) {
                //ignore, keep as is
                }
            }
            if (/@xn--/.test(address.address)) {
                try {
                    address.address = address.address.substr(0, address.address.lastIndexOf('@') + 1) + punycode.toUnicode(address.address.substr(address.address.lastIndexOf('@') + 1));
                } catch (E) {
                // Not a valid punycode string; keep as is
                }
            }
            if (address.group) {
                this.decodeAddresses(address.group);
            }
        }
    }
    createNode(node) {
        let contentType = node.contentType;
        let disposition = node.disposition;
        let encoding = node.encoding;
        let charset = node.charset;
        if (!contentType && node.root) {
            contentType = 'text/plain';
        }
        let newNode = {
            node,
            headerLines: node.headers.lines,
            headers: this.processHeaders(node.headers.getList()),
            contentType,
            children: []
        };
        if (!/^multipart\//i.test(contentType)) {
            if (disposition && ![
                'attachment',
                'inline'
            ].includes(disposition)) {
                disposition = 'attachment';
            }
            if (!disposition && !this.textTypes.includes(contentType)) {
                newNode.disposition = 'attachment';
            } else {
                newNode.disposition = disposition || 'inline';
            }
            newNode.isAttachment = !this.textTypes.includes(contentType) || newNode.disposition !== 'inline';
            newNode.encoding = [
                'quoted-printable',
                'base64'
            ].includes(encoding) ? encoding : 'binary';
            if (charset) {
                newNode.charset = charset;
            }
            let decoder = node.getDecoder();
            decoder.on('end', ()=>{
                this.decoderEnded = true;
            });
            newNode.decoder = decoder;
        }
        if (node.root) {
            this.headers = newNode.headers;
            this.headerLines = newNode.headerLines;
        }
        // find location in tree
        if (!this.tree) {
            newNode.root = true;
            this.curnode = this.tree = newNode;
            return newNode;
        }
        // immediate child of root node
        if (!this.curnode.parent) {
            newNode.parent = this.curnode;
            this.curnode.children.push(newNode);
            this.curnode = newNode;
            return newNode;
        }
        // siblings
        if (this.curnode.parent.node === node.parentNode) {
            newNode.parent = this.curnode.parent;
            this.curnode.parent.children.push(newNode);
            this.curnode = newNode;
            return newNode;
        }
        // first child
        if (this.curnode.node === node.parentNode) {
            newNode.parent = this.curnode;
            this.curnode.children.push(newNode);
            this.curnode = newNode;
            return newNode;
        }
        // move up
        let parentNode = this.curnode;
        while(parentNode = parentNode.parent){
            if (parentNode.node === node.parentNode) {
                newNode.parent = parentNode;
                parentNode.children.push(newNode);
                this.curnode = newNode;
                return newNode;
            }
        }
        // should never happen, can't detect parent
        this.curnode = newNode;
        return newNode;
    }
    getTextContent() {
        let text = [];
        let html = [];
        let processNode = (alternative, level, node)=>{
            if (node.showMeta) {
                let meta = [
                    'From',
                    'Subject',
                    'Date',
                    'To',
                    'Cc',
                    'Bcc'
                ].map((fkey)=>{
                    let key = fkey.toLowerCase();
                    if (!node.headers.has(key)) {
                        return false;
                    }
                    let value = node.headers.get(key);
                    if (!value) {
                        return false;
                    }
                    return {
                        key: fkey,
                        value: Array.isArray(value) ? value[value.length - 1] : value
                    };
                }).filter((entry)=>entry);
                if (this.hasHtml) {
                    html.push('<table class="mp_head">' + meta.map((entry)=>{
                        let value = entry.value;
                        switch(entry.key){
                            case 'From':
                            case 'To':
                            case 'Cc':
                            case 'Bcc':
                                value = value.html;
                                break;
                            case 'Date':
                                value = this.options.formatDateString ? this.options.formatDateString(value) : value.toUTCString();
                                break;
                            case 'Subject':
                                value = '<strong>' + he.encode(value) + '</strong>';
                                break;
                            default:
                                value = he.encode(value);
                        }
                        return '<tr><td class="mp_head_key">' + he.encode(entry.key) + ':</td><td class="mp_head_value">' + value + '<td></tr>';
                    }).join('\n') + '<table>');
                }
                if (this.hasText) {
                    text.push('\n' + meta.map((entry)=>{
                        let value = entry.value;
                        switch(entry.key){
                            case 'From':
                            case 'To':
                            case 'Cc':
                            case 'Bcc':
                                value = value.text;
                                break;
                            case 'Date':
                                value = this.options.formatDateString ? this.options.formatDateString(value) : value.toUTCString();
                                break;
                        }
                        return entry.key + ': ' + value;
                    }).join('\n') + '\n');
                }
            }
            if (node.textContent) {
                if (node.contentType === 'text/plain') {
                    text.push(node.textContent);
                    if (!alternative && this.hasHtml) {
                        html.push(this.textToHtml(node.textContent));
                    }
                } else if (node.contentType === 'message/delivery-status' && !this.options.keepDeliveryStatus) {
                    text.push(node.textContent);
                    if (!alternative && this.hasHtml) {
                        html.push(this.textToHtml(node.textContent));
                    }
                } else if (node.contentType === 'text/html') {
                    let failedToParseHtml = false;
                    if (!alternative && this.hasText || node.root && !this.hasText) {
                        if (this.options.skipHtmlToText) {
                            text.push('');
                        } else if (node.textContent.length > this.options.maxHtmlLengthToParse) {
                            this.emit('error', new Error(`HTML too long for parsing ${node.textContent.length} bytes`));
                            text.push('Invalid HTML content (too long)');
                            failedToParseHtml = true;
                        } else {
                            try {
                                text.push(htmlToText(node.textContent));
                            } catch (err) {
                                this.emit('error', new Error('Failed to parse HTML'));
                                text.push('Invalid HTML content');
                                failedToParseHtml = true;
                            }
                        }
                    }
                    if (!failedToParseHtml) {
                        html.push(node.textContent);
                    }
                }
            }
            alternative = alternative || node.contentType === 'multipart/alternative';
            if (node.children) {
                node.children.forEach((subNode)=>{
                    processNode(alternative, level + 1, subNode);
                });
            }
        };
        processNode(false, 0, this.tree);
        let response = {
            type: 'text'
        };
        if (html.length) {
            this.html = response.html = html.join('<br/>\n');
        }
        if (text.length) {
            this.text = response.text = text.join('\n');
            this.textAsHtml = response.textAsHtml = text.map((part)=>this.textToHtml(part)).join('<br/>\n');
        }
        return response;
    }
    processChunk(data, done) {
        let partId = null;
        if (data._parentBoundary) {
            partId = this._getPartId(data._parentBoundary);
        }
        switch(data.type){
            case 'node':
                {
                    let node = this.createNode(data);
                    if (node === this.tree) {
                        [
                            'subject',
                            'references',
                            'date',
                            'to',
                            'from',
                            'to',
                            'cc',
                            'bcc',
                            'message-id',
                            'in-reply-to',
                            'reply-to'
                        ].forEach((key)=>{
                            if (node.headers.has(key)) {
                                this[key.replace(/-([a-z])/g, (m, c)=>c.toUpperCase())] = node.headers.get(key);
                            }
                        });
                        this.emit('headers', node.headers);
                        if (node.headerLines) {
                            this.emit('headerLines', node.headerLines);
                        }
                    }
                    if (data.contentType === 'message/rfc822' && data.messageNode) {
                        break;
                    }
                    if (data.parentNode && data.parentNode.contentType === 'message/rfc822') {
                        node.showMeta = true;
                    }
                    if (node.isAttachment) {
                        let contentType = node.contentType;
                        if (node.contentType === 'application/octet-stream' && data.filename) {
                            contentType = this.libmime.detectMimeType(data.filename) || 'application/octet-stream';
                        }
                        let attachment = {
                            type: 'attachment',
                            content: null,
                            contentType,
                            partId,
                            release: ()=>{
                                attachment.release = null;
                                if (this.waitUntilAttachmentEnd && typeof this.attachmentCallback === 'function') {
                                    setImmediate(this.attachmentCallback);
                                }
                                this.attachmentCallback = false;
                                this.waitUntilAttachmentEnd = false;
                            }
                        };
                        let algo = this.options.checksumAlgo || 'md5';
                        let hasher = new StreamHash(attachment, algo);
                        node.decoder.on('error', (err)=>{
                            hasher.emit('error', err);
                        });
                        node.decoder.on('readable', ()=>{
                            let chunk;
                            while((chunk = node.decoder.read()) !== null){
                                hasher.write(chunk);
                            }
                        });
                        node.decoder.once('end', ()=>{
                            hasher.end();
                        });
                        //node.decoder.pipe(hasher);
                        attachment.content = hasher;
                        this.waitUntilAttachmentEnd = true;
                        if (data.disposition) {
                            attachment.contentDisposition = data.disposition;
                        }
                        if (data.filename) {
                            attachment.filename = data.filename;
                        }
                        if (node.headers.has('content-id')) {
                            attachment.contentId = [].concat(node.headers.get('content-id') || []).shift();
                            attachment.cid = attachment.contentId.trim().replace(/^<|>$/g, '').trim();
                            // check if the attachment is "related" to text content like an embedded image etc
                            let parentNode = node;
                            while(parentNode = parentNode.parent){
                                if (parentNode.contentType === 'multipart/related') {
                                    attachment.related = true;
                                }
                            }
                        }
                        attachment.headers = node.headers;
                        this.push(attachment);
                        this.attachmentList.push(attachment);
                    } else if (node.disposition === 'inline') {
                        let chunks = [];
                        let chunklen = 0;
                        node.contentStream = node.decoder;
                        if (node.contentType === 'text/plain') {
                            this.hasText = true;
                        } else if (node.contentType === 'text/html') {
                            this.hasHtml = true;
                        } else if (node.contentType === 'message/delivery-status' && !this.options.keepDeliveryStatus) {
                            this.hasText = true;
                        }
                        if (node.node.flowed) {
                            let contentStream = node.contentStream;
                            let flowDecoder = new FlowedDecoder({
                                delSp: node.node.delSp
                            });
                            contentStream.on('error', (err)=>{
                                flowDecoder.emit('error', err);
                            });
                            contentStream.pipe(flowDecoder);
                            node.contentStream = flowDecoder;
                        }
                        let charset = node.charset || 'utf-8';
                        //charset = charset || 'windows-1257';
                        if (![
                            'ascii',
                            'usascii',
                            'utf8'
                        ].includes(charset.toLowerCase().replace(/[^a-z0-9]+/g, ''))) {
                            try {
                                let contentStream = node.contentStream;
                                let decodeStream = this.decoder.decodeStream(charset);
                                contentStream.on('error', (err)=>{
                                    decodeStream.emit('error', err);
                                });
                                contentStream.pipe(decodeStream);
                                node.contentStream = decodeStream;
                            } catch (E) {
                            // do not decode charset
                            }
                        }
                        node.contentStream.on('readable', ()=>{
                            let chunk;
                            while((chunk = node.contentStream.read()) !== null){
                                if (typeof chunk === 'string') {
                                    chunk = Buffer.from(chunk);
                                }
                                chunks.push(chunk);
                                chunklen += chunk.length;
                            }
                        });
                        node.contentStream.once('end', ()=>{
                            node.textContent = Buffer.concat(chunks, chunklen).toString().replace(/\r?\n/g, '\n');
                        });
                        node.contentStream.once('error', (err)=>{
                            this.emit('error', err);
                        });
                    }
                    break;
                }
            case 'data':
                if (this.curnode && this.curnode.decoder) {
                    this.curnode.decoder.end();
                }
                if (this.waitUntilAttachmentEnd) {
                    this.attachmentCallback = done;
                    return;
                }
                break;
            case 'body':
                if (this.curnode && this.curnode.decoder && this.curnode.decoder.writable) {
                    if (this.curnode.decoder.write(data.value) === false) {
                        return this.curnode.decoder.once('drain', done);
                    }
                }
                break;
        }
        setImmediate(done);
    }
    _getPartId(parentBoundary) {
        let boundaryIndex = this.boundaries.findIndex((item)=>item.name === parentBoundary);
        if (boundaryIndex === -1) {
            this.boundaries.push({
                name: parentBoundary,
                count: 1
            });
            boundaryIndex = this.boundaries.length - 1;
        } else {
            this.boundaries[boundaryIndex].count++;
        }
        let partId = '1';
        for(let i = 0; i <= boundaryIndex; i++){
            if (i === 0) partId = this.boundaries[i].count.toString();
            else partId += '.' + this.boundaries[i].count.toString();
        }
        return partId;
    }
    getAddressesHTML(value) {
        let formatSingleLevel = (addresses)=>addresses.map((address)=>{
                let str = '<span class="mp_address_group">';
                if (address.name) {
                    str += '<span class="mp_address_name">' + he.encode(address.name) + (address.group ? ': ' : '') + '</span>';
                }
                if (address.address) {
                    let link = '<a href="mailto:' + he.encode(address.address) + '" class="mp_address_email">' + he.encode(address.address) + '</a>';
                    if (address.name) {
                        str += ' &lt;' + link + '&gt;';
                    } else {
                        str += link;
                    }
                }
                if (address.group) {
                    str += formatSingleLevel(address.group) + ';';
                }
                return str + '</span>';
            }).join(', ');
        return formatSingleLevel([].concat(value || []));
    }
    getAddressesText(value) {
        let formatSingleLevel = (addresses)=>addresses.map((address)=>{
                let str = '';
                if (address.name) {
                    str += `"${address.name}"` + (address.group ? ': ' : '');
                }
                if (address.address) {
                    let link = address.address;
                    if (address.name) {
                        str += ' <' + link + '>';
                    } else {
                        str += link;
                    }
                }
                if (address.group) {
                    str += formatSingleLevel(address.group) + ';';
                }
                return str;
            }).join(', ');
        return formatSingleLevel([].concat(value || []));
    }
    updateImageLinks(replaceCallback, done) {
        if (!this.html) {
            return setImmediate(()=>done(null, false));
        }
        let cids = new Map();
        let html = (this.html || '').toString();
        if (this.options.skipImageLinks) {
            return done(null, html);
        }
        html.replace(/\bcid:([^'"\s]{1,256})/g, (match, cid)=>{
            for(let i = 0, len = this.attachmentList.length; i < len; i++){
                if (this.attachmentList[i].cid === cid && /^image\/[\w]+$/i.test(this.attachmentList[i].contentType)) {
                    cids.set(cid, {
                        attachment: this.attachmentList[i]
                    });
                    break;
                }
            }
            return match;
        });
        let cidList = [];
        cids.forEach((entry)=>{
            cidList.push(entry);
        });
        let pos = 0;
        let processNext = ()=>{
            if (pos >= cidList.length) {
                html = html.replace(/\bcid:([^'"\s]{1,256})/g, (match, cid)=>{
                    if (cids.has(cid) && cids.get(cid).url) {
                        return cids.get(cid).url;
                    }
                    return match;
                });
                return done(null, html);
            }
            let entry = cidList[pos++];
            replaceCallback(entry.attachment, (err, url)=>{
                if (err) {
                    return setImmediate(()=>done(err));
                }
                entry.url = url;
                setImmediate(processNext);
            });
        };
        setImmediate(processNext);
    }
    textToHtml(str) {
        if (this.options.skipTextToHtml) {
            return '';
        }
        str = (str || '').toString();
        let encoded;
        let linkified = false;
        if (!this.options.skipTextLinks) {
            try {
                if (linkify.pretest(str)) {
                    linkified = true;
                    let links = linkify.match(str) || [];
                    let result = [];
                    let last = 0;
                    links.forEach((link)=>{
                        if (last < link.index) {
                            let textPart = he// encode special chars
                            .encode(str.slice(last, link.index), {
                                useNamedReferences: true
                            });
                            result.push(textPart);
                        }
                        // Escape quotes in URL to prevent XSS
                        let safeUrl = link.url.replace(/"/g, '&quot;');
                        // Escape HTML entities in link text
                        let safeText = he.encode(link.text, {
                            useNamedReferences: true
                        });
                        result.push(`<a href="${safeUrl}">${safeText}</a>`);
                        last = link.lastIndex;
                    });
                    let textPart = he// encode special chars
                    .encode(str.slice(last), {
                        useNamedReferences: true
                    });
                    result.push(textPart);
                    encoded = result.join('');
                }
            } catch (E) {
            // failed, don't linkify
            }
        }
        if (!linkified) {
            encoded = he// encode special chars
            .encode(str, {
                useNamedReferences: true
            });
        }
        let text = '<p>' + encoded.replace(/\r?\n/g, '\n').trim() // normalize line endings
        .replace(/[ \t]+$/gm, '').trim() // trim empty line endings
        .replace(/\n\n+/g, '</p><p>').trim() // insert <p> to multiple linebreaks
        .replace(/\n/g, '<br/>') + // insert <br> to single linebreaks
        '</p>';
        return text;
    }
}
module.exports = MailParser;
}),
"[project]/Autonomous-Claims-Orchestrator/node_modules/mailparser/lib/simple-parser.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const MailParser = __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/mailparser/lib/mail-parser.js [app-route] (ecmascript)");
module.exports = (input, options, callback)=>{
    if (input === null || input === undefined) {
        throw new TypeError('Input cannot be null or undefined.');
    }
    if (!callback && typeof options === 'function') {
        callback = options;
        options = false;
    }
    let promise;
    if (!callback) {
        promise = new Promise((resolve, reject)=>{
            callback = callbackPromise(resolve, reject);
        });
    }
    options = options || {};
    let keepCidLinks = !!options.keepCidLinks;
    let mail = {
        attachments: []
    };
    let parser = new MailParser(options);
    parser.on('error', (err)=>{
        callback(err);
    });
    parser.on('headers', (headers)=>{
        mail.headers = headers;
        mail.headerLines = parser.headerLines;
    });
    let reading = false;
    let reader = ()=>{
        reading = true;
        let data = parser.read();
        if (data === null) {
            reading = false;
            return;
        }
        if (data.type === 'text') {
            Object.keys(data).forEach((key)=>{
                if ([
                    'text',
                    'html',
                    'textAsHtml'
                ].includes(key)) {
                    mail[key] = data[key];
                }
            });
        }
        if (data.type === 'attachment') {
            mail.attachments.push(data);
            let chunks = [];
            let chunklen = 0;
            data.content.on('readable', ()=>{
                let chunk;
                while((chunk = data.content.read()) !== null){
                    chunks.push(chunk);
                    chunklen += chunk.length;
                }
            });
            data.content.on('end', ()=>{
                data.content = Buffer.concat(chunks, chunklen);
                data.release();
                reader();
            });
        } else {
            reader();
        }
    };
    parser.on('readable', ()=>{
        if (!reading) {
            reader();
        }
    });
    parser.on('end', ()=>{
        [
            'subject',
            'references',
            'date',
            'to',
            'from',
            'to',
            'cc',
            'bcc',
            'message-id',
            'in-reply-to',
            'reply-to'
        ].forEach((key)=>{
            if (mail.headers && mail.headers.has(key)) {
                mail[key.replace(/-([a-z])/g, (m, c)=>c.toUpperCase())] = mail.headers.get(key);
            }
        });
        if (keepCidLinks) {
            return callback(null, mail);
        }
        parser.updateImageLinks((attachment, done)=>done(false, 'data:' + attachment.contentType + ';base64,' + attachment.content.toString('base64')), (err, html)=>{
            if (err) {
                return callback(err);
            }
            mail.html = html;
            callback(null, mail);
        });
    });
    if (typeof input === 'string') {
        parser.end(Buffer.from(input));
    } else if (Buffer.isBuffer(input)) {
        parser.end(input);
    } else {
        input.once('error', (err)=>{
            input.destroy();
            parser.destroy();
            callback(err);
        }).pipe(parser);
    }
    return promise;
};
function callbackPromise(resolve, reject) {
    return function(...args) {
        let err = args.shift();
        if (err) {
            reject(err);
        } else {
            resolve(...args);
        }
    };
}
}),
"[project]/Autonomous-Claims-Orchestrator/node_modules/mailparser/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const MailParser = __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/mailparser/lib/mail-parser.js [app-route] (ecmascript)");
const simpleParser = __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/mailparser/lib/simple-parser.js [app-route] (ecmascript)");
module.exports = {
    MailParser,
    simpleParser
};
}),
"[project]/Autonomous-Claims-Orchestrator/node_modules/domelementtype/lib/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Doctype = exports.CDATA = exports.Tag = exports.Style = exports.Script = exports.Comment = exports.Directive = exports.Text = exports.Root = exports.isTag = exports.ElementType = void 0;
/** Types of elements found in htmlparser2's DOM */ var ElementType;
(function(ElementType) {
    /** Type for the root element of a document */ ElementType["Root"] = "root";
    /** Type for Text */ ElementType["Text"] = "text";
    /** Type for <? ... ?> */ ElementType["Directive"] = "directive";
    /** Type for <!-- ... --> */ ElementType["Comment"] = "comment";
    /** Type for <script> tags */ ElementType["Script"] = "script";
    /** Type for <style> tags */ ElementType["Style"] = "style";
    /** Type for Any tag */ ElementType["Tag"] = "tag";
    /** Type for <![CDATA[ ... ]]> */ ElementType["CDATA"] = "cdata";
    /** Type for <!doctype ...> */ ElementType["Doctype"] = "doctype";
})(ElementType = exports.ElementType || (exports.ElementType = {}));
/**
 * Tests whether an element is a tag or not.
 *
 * @param elem Element to test
 */ function isTag(elem) {
    return elem.type === ElementType.Tag || elem.type === ElementType.Script || elem.type === ElementType.Style;
}
exports.isTag = isTag;
// Exports for backwards compatibility
/** Type for the root element of a document */ exports.Root = ElementType.Root;
/** Type for Text */ exports.Text = ElementType.Text;
/** Type for <? ... ?> */ exports.Directive = ElementType.Directive;
/** Type for <!-- ... --> */ exports.Comment = ElementType.Comment;
/** Type for <script> tags */ exports.Script = ElementType.Script;
/** Type for <style> tags */ exports.Style = ElementType.Style;
/** Type for Any tag */ exports.Tag = ElementType.Tag;
/** Type for <![CDATA[ ... ]]> */ exports.CDATA = ElementType.CDATA;
/** Type for <!doctype ...> */ exports.Doctype = ElementType.Doctype;
}),
"[project]/Autonomous-Claims-Orchestrator/node_modules/domhandler/lib/node.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __extends = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__extends || function() {
    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || ({
            __proto__: []
        }) instanceof Array && function(d, b) {
            d.__proto__ = b;
        } || function(d, b) {
            for(var p in b)if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
        };
        return extendStatics(d, b);
    };
    return function(d, b) {
        if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
}();
var __assign = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__assign || function() {
    __assign = Object.assign || function(t) {
        for(var s, i = 1, n = arguments.length; i < n; i++){
            s = arguments[i];
            for(var p in s)if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.cloneNode = exports.hasChildren = exports.isDocument = exports.isDirective = exports.isComment = exports.isText = exports.isCDATA = exports.isTag = exports.Element = exports.Document = exports.CDATA = exports.NodeWithChildren = exports.ProcessingInstruction = exports.Comment = exports.Text = exports.DataNode = exports.Node = void 0;
var domelementtype_1 = __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/domelementtype/lib/index.js [app-route] (ecmascript)");
/**
 * This object will be used as the prototype for Nodes when creating a
 * DOM-Level-1-compliant structure.
 */ var Node = function() {
    function Node() {
        /** Parent of the node */ this.parent = null;
        /** Previous sibling */ this.prev = null;
        /** Next sibling */ this.next = null;
        /** The start index of the node. Requires `withStartIndices` on the handler to be `true. */ this.startIndex = null;
        /** The end index of the node. Requires `withEndIndices` on the handler to be `true. */ this.endIndex = null;
    }
    Object.defineProperty(Node.prototype, "parentNode", {
        // Read-write aliases for properties
        /**
         * Same as {@link parent}.
         * [DOM spec](https://dom.spec.whatwg.org)-compatible alias.
         */ get: function() {
            return this.parent;
        },
        set: function(parent) {
            this.parent = parent;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Node.prototype, "previousSibling", {
        /**
         * Same as {@link prev}.
         * [DOM spec](https://dom.spec.whatwg.org)-compatible alias.
         */ get: function() {
            return this.prev;
        },
        set: function(prev) {
            this.prev = prev;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Node.prototype, "nextSibling", {
        /**
         * Same as {@link next}.
         * [DOM spec](https://dom.spec.whatwg.org)-compatible alias.
         */ get: function() {
            return this.next;
        },
        set: function(next) {
            this.next = next;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Clone this node, and optionally its children.
     *
     * @param recursive Clone child nodes as well.
     * @returns A clone of the node.
     */ Node.prototype.cloneNode = function(recursive) {
        if (recursive === void 0) {
            recursive = false;
        }
        return cloneNode(this, recursive);
    };
    return Node;
}();
exports.Node = Node;
/**
 * A node that contains some data.
 */ var DataNode = function(_super) {
    __extends(DataNode, _super);
    /**
     * @param data The content of the data node
     */ function DataNode(data) {
        var _this = _super.call(this) || this;
        _this.data = data;
        return _this;
    }
    Object.defineProperty(DataNode.prototype, "nodeValue", {
        /**
         * Same as {@link data}.
         * [DOM spec](https://dom.spec.whatwg.org)-compatible alias.
         */ get: function() {
            return this.data;
        },
        set: function(data) {
            this.data = data;
        },
        enumerable: false,
        configurable: true
    });
    return DataNode;
}(Node);
exports.DataNode = DataNode;
/**
 * Text within the document.
 */ var Text = function(_super) {
    __extends(Text, _super);
    function Text() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = domelementtype_1.ElementType.Text;
        return _this;
    }
    Object.defineProperty(Text.prototype, "nodeType", {
        get: function() {
            return 3;
        },
        enumerable: false,
        configurable: true
    });
    return Text;
}(DataNode);
exports.Text = Text;
/**
 * Comments within the document.
 */ var Comment = function(_super) {
    __extends(Comment, _super);
    function Comment() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = domelementtype_1.ElementType.Comment;
        return _this;
    }
    Object.defineProperty(Comment.prototype, "nodeType", {
        get: function() {
            return 8;
        },
        enumerable: false,
        configurable: true
    });
    return Comment;
}(DataNode);
exports.Comment = Comment;
/**
 * Processing instructions, including doc types.
 */ var ProcessingInstruction = function(_super) {
    __extends(ProcessingInstruction, _super);
    function ProcessingInstruction(name, data) {
        var _this = _super.call(this, data) || this;
        _this.name = name;
        _this.type = domelementtype_1.ElementType.Directive;
        return _this;
    }
    Object.defineProperty(ProcessingInstruction.prototype, "nodeType", {
        get: function() {
            return 1;
        },
        enumerable: false,
        configurable: true
    });
    return ProcessingInstruction;
}(DataNode);
exports.ProcessingInstruction = ProcessingInstruction;
/**
 * A `Node` that can have children.
 */ var NodeWithChildren = function(_super) {
    __extends(NodeWithChildren, _super);
    /**
     * @param children Children of the node. Only certain node types can have children.
     */ function NodeWithChildren(children) {
        var _this = _super.call(this) || this;
        _this.children = children;
        return _this;
    }
    Object.defineProperty(NodeWithChildren.prototype, "firstChild", {
        // Aliases
        /** First child of the node. */ get: function() {
            var _a;
            return (_a = this.children[0]) !== null && _a !== void 0 ? _a : null;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(NodeWithChildren.prototype, "lastChild", {
        /** Last child of the node. */ get: function() {
            return this.children.length > 0 ? this.children[this.children.length - 1] : null;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(NodeWithChildren.prototype, "childNodes", {
        /**
         * Same as {@link children}.
         * [DOM spec](https://dom.spec.whatwg.org)-compatible alias.
         */ get: function() {
            return this.children;
        },
        set: function(children) {
            this.children = children;
        },
        enumerable: false,
        configurable: true
    });
    return NodeWithChildren;
}(Node);
exports.NodeWithChildren = NodeWithChildren;
var CDATA = function(_super) {
    __extends(CDATA, _super);
    function CDATA() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = domelementtype_1.ElementType.CDATA;
        return _this;
    }
    Object.defineProperty(CDATA.prototype, "nodeType", {
        get: function() {
            return 4;
        },
        enumerable: false,
        configurable: true
    });
    return CDATA;
}(NodeWithChildren);
exports.CDATA = CDATA;
/**
 * The root node of the document.
 */ var Document = function(_super) {
    __extends(Document, _super);
    function Document() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = domelementtype_1.ElementType.Root;
        return _this;
    }
    Object.defineProperty(Document.prototype, "nodeType", {
        get: function() {
            return 9;
        },
        enumerable: false,
        configurable: true
    });
    return Document;
}(NodeWithChildren);
exports.Document = Document;
/**
 * An element within the DOM.
 */ var Element = function(_super) {
    __extends(Element, _super);
    /**
     * @param name Name of the tag, eg. `div`, `span`.
     * @param attribs Object mapping attribute names to attribute values.
     * @param children Children of the node.
     */ function Element(name, attribs, children, type) {
        if (children === void 0) {
            children = [];
        }
        if (type === void 0) {
            type = name === "script" ? domelementtype_1.ElementType.Script : name === "style" ? domelementtype_1.ElementType.Style : domelementtype_1.ElementType.Tag;
        }
        var _this = _super.call(this, children) || this;
        _this.name = name;
        _this.attribs = attribs;
        _this.type = type;
        return _this;
    }
    Object.defineProperty(Element.prototype, "nodeType", {
        get: function() {
            return 1;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Element.prototype, "tagName", {
        // DOM Level 1 aliases
        /**
         * Same as {@link name}.
         * [DOM spec](https://dom.spec.whatwg.org)-compatible alias.
         */ get: function() {
            return this.name;
        },
        set: function(name) {
            this.name = name;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Element.prototype, "attributes", {
        get: function() {
            var _this = this;
            return Object.keys(this.attribs).map(function(name) {
                var _a, _b;
                return {
                    name: name,
                    value: _this.attribs[name],
                    namespace: (_a = _this["x-attribsNamespace"]) === null || _a === void 0 ? void 0 : _a[name],
                    prefix: (_b = _this["x-attribsPrefix"]) === null || _b === void 0 ? void 0 : _b[name]
                };
            });
        },
        enumerable: false,
        configurable: true
    });
    return Element;
}(NodeWithChildren);
exports.Element = Element;
/**
 * @param node Node to check.
 * @returns `true` if the node is a `Element`, `false` otherwise.
 */ function isTag(node) {
    return (0, domelementtype_1.isTag)(node);
}
exports.isTag = isTag;
/**
 * @param node Node to check.
 * @returns `true` if the node has the type `CDATA`, `false` otherwise.
 */ function isCDATA(node) {
    return node.type === domelementtype_1.ElementType.CDATA;
}
exports.isCDATA = isCDATA;
/**
 * @param node Node to check.
 * @returns `true` if the node has the type `Text`, `false` otherwise.
 */ function isText(node) {
    return node.type === domelementtype_1.ElementType.Text;
}
exports.isText = isText;
/**
 * @param node Node to check.
 * @returns `true` if the node has the type `Comment`, `false` otherwise.
 */ function isComment(node) {
    return node.type === domelementtype_1.ElementType.Comment;
}
exports.isComment = isComment;
/**
 * @param node Node to check.
 * @returns `true` if the node has the type `ProcessingInstruction`, `false` otherwise.
 */ function isDirective(node) {
    return node.type === domelementtype_1.ElementType.Directive;
}
exports.isDirective = isDirective;
/**
 * @param node Node to check.
 * @returns `true` if the node has the type `ProcessingInstruction`, `false` otherwise.
 */ function isDocument(node) {
    return node.type === domelementtype_1.ElementType.Root;
}
exports.isDocument = isDocument;
/**
 * @param node Node to check.
 * @returns `true` if the node has children, `false` otherwise.
 */ function hasChildren(node) {
    return Object.prototype.hasOwnProperty.call(node, "children");
}
exports.hasChildren = hasChildren;
/**
 * Clone a node, and optionally its children.
 *
 * @param recursive Clone child nodes as well.
 * @returns A clone of the node.
 */ function cloneNode(node, recursive) {
    if (recursive === void 0) {
        recursive = false;
    }
    var result;
    if (isText(node)) {
        result = new Text(node.data);
    } else if (isComment(node)) {
        result = new Comment(node.data);
    } else if (isTag(node)) {
        var children = recursive ? cloneChildren(node.children) : [];
        var clone_1 = new Element(node.name, __assign({}, node.attribs), children);
        children.forEach(function(child) {
            return child.parent = clone_1;
        });
        if (node.namespace != null) {
            clone_1.namespace = node.namespace;
        }
        if (node["x-attribsNamespace"]) {
            clone_1["x-attribsNamespace"] = __assign({}, node["x-attribsNamespace"]);
        }
        if (node["x-attribsPrefix"]) {
            clone_1["x-attribsPrefix"] = __assign({}, node["x-attribsPrefix"]);
        }
        result = clone_1;
    } else if (isCDATA(node)) {
        var children = recursive ? cloneChildren(node.children) : [];
        var clone_2 = new CDATA(children);
        children.forEach(function(child) {
            return child.parent = clone_2;
        });
        result = clone_2;
    } else if (isDocument(node)) {
        var children = recursive ? cloneChildren(node.children) : [];
        var clone_3 = new Document(children);
        children.forEach(function(child) {
            return child.parent = clone_3;
        });
        if (node["x-mode"]) {
            clone_3["x-mode"] = node["x-mode"];
        }
        result = clone_3;
    } else if (isDirective(node)) {
        var instruction = new ProcessingInstruction(node.name, node.data);
        if (node["x-name"] != null) {
            instruction["x-name"] = node["x-name"];
            instruction["x-publicId"] = node["x-publicId"];
            instruction["x-systemId"] = node["x-systemId"];
        }
        result = instruction;
    } else {
        throw new Error("Not implemented yet: ".concat(node.type));
    }
    result.startIndex = node.startIndex;
    result.endIndex = node.endIndex;
    if (node.sourceCodeLocation != null) {
        result.sourceCodeLocation = node.sourceCodeLocation;
    }
    return result;
}
exports.cloneNode = cloneNode;
function cloneChildren(childs) {
    var children = childs.map(function(child) {
        return cloneNode(child, true);
    });
    for(var i = 1; i < children.length; i++){
        children[i].prev = children[i - 1];
        children[i - 1].next = children[i];
    }
    return children;
}
}),
"[project]/Autonomous-Claims-Orchestrator/node_modules/domhandler/lib/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __createBinding = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__createBinding || (Object.create ? function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = {
            enumerable: true,
            get: function() {
                return m[k];
            }
        };
    }
    Object.defineProperty(o, k2, desc);
} : function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
});
var __exportStar = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__exportStar || function(m, exports1) {
    for(var p in m)if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports1, p)) __createBinding(exports1, m, p);
};
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.DomHandler = void 0;
var domelementtype_1 = __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/domelementtype/lib/index.js [app-route] (ecmascript)");
var node_js_1 = __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/domhandler/lib/node.js [app-route] (ecmascript)");
__exportStar(__turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/domhandler/lib/node.js [app-route] (ecmascript)"), exports);
// Default options
var defaultOpts = {
    withStartIndices: false,
    withEndIndices: false,
    xmlMode: false
};
var DomHandler = function() {
    /**
     * @param callback Called once parsing has completed.
     * @param options Settings for the handler.
     * @param elementCB Callback whenever a tag is closed.
     */ function DomHandler(callback, options, elementCB) {
        /** The elements of the DOM */ this.dom = [];
        /** The root element for the DOM */ this.root = new node_js_1.Document(this.dom);
        /** Indicated whether parsing has been completed. */ this.done = false;
        /** Stack of open tags. */ this.tagStack = [
            this.root
        ];
        /** A data node that is still being written to. */ this.lastNode = null;
        /** Reference to the parser instance. Used for location information. */ this.parser = null;
        // Make it possible to skip arguments, for backwards-compatibility
        if (typeof options === "function") {
            elementCB = options;
            options = defaultOpts;
        }
        if (typeof callback === "object") {
            options = callback;
            callback = undefined;
        }
        this.callback = callback !== null && callback !== void 0 ? callback : null;
        this.options = options !== null && options !== void 0 ? options : defaultOpts;
        this.elementCB = elementCB !== null && elementCB !== void 0 ? elementCB : null;
    }
    DomHandler.prototype.onparserinit = function(parser) {
        this.parser = parser;
    };
    // Resets the handler back to starting state
    DomHandler.prototype.onreset = function() {
        this.dom = [];
        this.root = new node_js_1.Document(this.dom);
        this.done = false;
        this.tagStack = [
            this.root
        ];
        this.lastNode = null;
        this.parser = null;
    };
    // Signals the handler that parsing is done
    DomHandler.prototype.onend = function() {
        if (this.done) return;
        this.done = true;
        this.parser = null;
        this.handleCallback(null);
    };
    DomHandler.prototype.onerror = function(error) {
        this.handleCallback(error);
    };
    DomHandler.prototype.onclosetag = function() {
        this.lastNode = null;
        var elem = this.tagStack.pop();
        if (this.options.withEndIndices) {
            elem.endIndex = this.parser.endIndex;
        }
        if (this.elementCB) this.elementCB(elem);
    };
    DomHandler.prototype.onopentag = function(name, attribs) {
        var type = this.options.xmlMode ? domelementtype_1.ElementType.Tag : undefined;
        var element = new node_js_1.Element(name, attribs, undefined, type);
        this.addNode(element);
        this.tagStack.push(element);
    };
    DomHandler.prototype.ontext = function(data) {
        var lastNode = this.lastNode;
        if (lastNode && lastNode.type === domelementtype_1.ElementType.Text) {
            lastNode.data += data;
            if (this.options.withEndIndices) {
                lastNode.endIndex = this.parser.endIndex;
            }
        } else {
            var node = new node_js_1.Text(data);
            this.addNode(node);
            this.lastNode = node;
        }
    };
    DomHandler.prototype.oncomment = function(data) {
        if (this.lastNode && this.lastNode.type === domelementtype_1.ElementType.Comment) {
            this.lastNode.data += data;
            return;
        }
        var node = new node_js_1.Comment(data);
        this.addNode(node);
        this.lastNode = node;
    };
    DomHandler.prototype.oncommentend = function() {
        this.lastNode = null;
    };
    DomHandler.prototype.oncdatastart = function() {
        var text = new node_js_1.Text("");
        var node = new node_js_1.CDATA([
            text
        ]);
        this.addNode(node);
        text.parent = node;
        this.lastNode = text;
    };
    DomHandler.prototype.oncdataend = function() {
        this.lastNode = null;
    };
    DomHandler.prototype.onprocessinginstruction = function(name, data) {
        var node = new node_js_1.ProcessingInstruction(name, data);
        this.addNode(node);
    };
    DomHandler.prototype.handleCallback = function(error) {
        if (typeof this.callback === "function") {
            this.callback(error, this.dom);
        } else if (error) {
            throw error;
        }
    };
    DomHandler.prototype.addNode = function(node) {
        var parent = this.tagStack[this.tagStack.length - 1];
        var previousSibling = parent.children[parent.children.length - 1];
        if (this.options.withStartIndices) {
            node.startIndex = this.parser.startIndex;
        }
        if (this.options.withEndIndices) {
            node.endIndex = this.parser.endIndex;
        }
        parent.children.push(node);
        if (previousSibling) {
            node.prev = previousSibling;
            previousSibling.next = node;
        }
        node.parent = parent;
        this.lastNode = null;
    };
    return DomHandler;
}();
exports.DomHandler = DomHandler;
exports.default = DomHandler;
}),
"[project]/Autonomous-Claims-Orchestrator/node_modules/leac/lib/leac.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: !0
});
const e = /\n/g;
function t(t) {
    const o = [
        ...t.matchAll(e)
    ].map((e)=>e.index || 0);
    o.unshift(-1);
    const s = n(o, 0, o.length);
    return (e)=>r(s, e);
}
function n(e, t, r) {
    if (r - t == 1) return {
        offset: e[t],
        index: t + 1
    };
    const o = Math.ceil((t + r) / 2), s = n(e, t, o), l = n(e, o, r);
    return {
        offset: s.offset,
        low: s,
        high: l
    };
}
function r(e, t) {
    return function(e) {
        return Object.prototype.hasOwnProperty.call(e, "index");
    }(e) ? {
        line: e.index,
        column: t - e.offset
    } : r(e.high.offset < t ? e.high : e.low, t);
}
function o(e, t) {
    return {
        ...e,
        regex: s(e, t)
    };
}
function s(e, t) {
    if (0 === e.name.length) throw new Error(`Rule #${t} has empty name, which is not allowed.`);
    if (function(e) {
        return Object.prototype.hasOwnProperty.call(e, "regex");
    }(e)) return function(e) {
        if (e.global) throw new Error(`Regular expression /${e.source}/${e.flags} contains the global flag, which is not allowed.`);
        return e.sticky ? e : new RegExp(e.source, e.flags + "y");
    }(e.regex);
    if (function(e) {
        return Object.prototype.hasOwnProperty.call(e, "str");
    }(e)) {
        if (0 === e.str.length) throw new Error(`Rule #${t} ("${e.name}") has empty "str" property, which is not allowed.`);
        return new RegExp(l(e.str), "y");
    }
    return new RegExp(l(e.name), "y");
}
function l(e) {
    return e.replace(/[-[\]{}()*+!<=:?./\\^$|#\s,]/g, "\\$&");
}
exports.createLexer = function(e, n = "", r = {}) {
    const s = "string" != typeof n ? n : r, l = "string" == typeof n ? n : "", c = e.map(o), i = !!s.lineNumbers;
    return function(e, n = 0) {
        const r = i ? t(e) : ()=>({
                line: 0,
                column: 0
            });
        let o = n;
        const s = [];
        e: for(; o < e.length;){
            let t = !1;
            for (const n of c){
                n.regex.lastIndex = o;
                const c = n.regex.exec(e);
                if (c && c[0].length > 0) {
                    if (!n.discard) {
                        const e = r(o), t = "string" == typeof n.replace ? c[0].replace(new RegExp(n.regex.source, n.regex.flags), n.replace) : c[0];
                        s.push({
                            state: l,
                            name: n.name,
                            text: t,
                            offset: o,
                            len: c[0].length,
                            line: e.line,
                            column: e.column
                        });
                    }
                    if (o = n.regex.lastIndex, t = !0, n.push) {
                        const t = n.push(e, o);
                        s.push(...t.tokens), o = t.offset;
                    }
                    if (n.pop) break e;
                    break;
                }
            }
            if (!t) break;
        }
        return {
            tokens: s,
            offset: o,
            complete: e.length <= o
        };
    };
};
}),
"[project]/Autonomous-Claims-Orchestrator/node_modules/peberminta/lib/util.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, '__esModule', {
    value: true
});
function clamp(left, x, right) {
    return Math.max(left, Math.min(x, right));
}
function escapeWhitespace(str) {
    return str.replace(/(\t)|(\r)|(\n)/g, (m, t, r)=>t ? '\\t' : r ? '\\r' : '\\n');
}
exports.clamp = clamp;
exports.escapeWhitespace = escapeWhitespace;
}),
"[project]/Autonomous-Claims-Orchestrator/node_modules/peberminta/lib/core.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, '__esModule', {
    value: true
});
var util = __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/peberminta/lib/util.cjs [app-route] (ecmascript)");
function emit(value) {
    return (data, i)=>({
            matched: true,
            position: i,
            value: value
        });
}
function make(f) {
    return (data, i)=>({
            matched: true,
            position: i,
            value: f(data, i)
        });
}
function action(f) {
    return (data, i)=>{
        f(data, i);
        return {
            matched: true,
            position: i,
            value: null
        };
    };
}
function fail(data, i) {
    return {
        matched: false
    };
}
function error(message) {
    return (data, i)=>{
        throw new Error(message instanceof Function ? message(data, i) : message);
    };
}
function token(onToken, onEnd) {
    return (data, i)=>{
        let position = i;
        let value = undefined;
        if (i < data.tokens.length) {
            value = onToken(data.tokens[i], data, i);
            if (value !== undefined) {
                position++;
            }
        } else {
            onEnd?.(data, i);
        }
        return value === undefined ? {
            matched: false
        } : {
            matched: true,
            position: position,
            value: value
        };
    };
}
function any(data, i) {
    return i < data.tokens.length ? {
        matched: true,
        position: i + 1,
        value: data.tokens[i]
    } : {
        matched: false
    };
}
function satisfy(test) {
    return (data, i)=>i < data.tokens.length && test(data.tokens[i], data, i) ? {
            matched: true,
            position: i + 1,
            value: data.tokens[i]
        } : {
            matched: false
        };
}
function mapInner(r, f) {
    return r.matched ? {
        matched: true,
        position: r.position,
        value: f(r.value, r.position)
    } : r;
}
function mapOuter(r, f) {
    return r.matched ? f(r) : r;
}
function map(p, mapper) {
    return (data, i)=>mapInner(p(data, i), (v, j)=>mapper(v, data, i, j));
}
function map1(p, mapper) {
    return (data, i)=>mapOuter(p(data, i), (m)=>mapper(m, data, i));
}
function peek(p, f) {
    return (data, i)=>{
        const r = p(data, i);
        f(r, data, i);
        return r;
    };
}
function option(p, def) {
    return (data, i)=>{
        const r = p(data, i);
        return r.matched ? r : {
            matched: true,
            position: i,
            value: def
        };
    };
}
function not(p) {
    return (data, i)=>{
        const r = p(data, i);
        return r.matched ? {
            matched: false
        } : {
            matched: true,
            position: i,
            value: true
        };
    };
}
function choice(...ps) {
    return (data, i)=>{
        for (const p of ps){
            const result = p(data, i);
            if (result.matched) {
                return result;
            }
        }
        return {
            matched: false
        };
    };
}
function otherwise(pa, pb) {
    return (data, i)=>{
        const r1 = pa(data, i);
        return r1.matched ? r1 : pb(data, i);
    };
}
function longest(...ps) {
    return (data, i)=>{
        let match = undefined;
        for (const p of ps){
            const result = p(data, i);
            if (result.matched && (!match || match.position < result.position)) {
                match = result;
            }
        }
        return match || {
            matched: false
        };
    };
}
function takeWhile(p, test) {
    return (data, i)=>{
        const values = [];
        let success = true;
        do {
            const r = p(data, i);
            if (r.matched && test(r.value, values.length + 1, data, i, r.position)) {
                values.push(r.value);
                i = r.position;
            } else {
                success = false;
            }
        }while (success)
        return {
            matched: true,
            position: i,
            value: values
        };
    };
}
function takeUntil(p, test) {
    return takeWhile(p, (value, n, data, i, j)=>!test(value, n, data, i, j));
}
function takeWhileP(pValue, pTest) {
    return takeWhile(pValue, (value, n, data, i)=>pTest(data, i).matched);
}
function takeUntilP(pValue, pTest) {
    return takeWhile(pValue, (value, n, data, i)=>!pTest(data, i).matched);
}
function many(p) {
    return takeWhile(p, ()=>true);
}
function many1(p) {
    return ab(p, many(p), (head, tail)=>[
            head,
            ...tail
        ]);
}
function ab(pa, pb, join) {
    return (data, i)=>mapOuter(pa(data, i), (ma)=>mapInner(pb(data, ma.position), (vb, j)=>join(ma.value, vb, data, i, j)));
}
function left(pa, pb) {
    return ab(pa, pb, (va)=>va);
}
function right(pa, pb) {
    return ab(pa, pb, (va, vb)=>vb);
}
function abc(pa, pb, pc, join) {
    return (data, i)=>mapOuter(pa(data, i), (ma)=>mapOuter(pb(data, ma.position), (mb)=>mapInner(pc(data, mb.position), (vc, j)=>join(ma.value, mb.value, vc, data, i, j))));
}
function middle(pa, pb, pc) {
    return abc(pa, pb, pc, (ra, rb)=>rb);
}
function all(...ps) {
    return (data, i)=>{
        const result = [];
        let position = i;
        for (const p of ps){
            const r1 = p(data, position);
            if (r1.matched) {
                result.push(r1.value);
                position = r1.position;
            } else {
                return {
                    matched: false
                };
            }
        }
        return {
            matched: true,
            position: position,
            value: result
        };
    };
}
function skip(...ps) {
    return map(all(...ps), ()=>null);
}
function flatten(...ps) {
    return flatten1(all(...ps));
}
function flatten1(p) {
    return map(p, (vs)=>vs.flatMap((v)=>v));
}
function sepBy1(pValue, pSep) {
    return ab(pValue, many(right(pSep, pValue)), (head, tail)=>[
            head,
            ...tail
        ]);
}
function sepBy(pValue, pSep) {
    return otherwise(sepBy1(pValue, pSep), emit([]));
}
function chainReduce(acc, f) {
    return (data, i)=>{
        let loop = true;
        let acc1 = acc;
        let pos = i;
        do {
            const r = f(acc1, data, pos)(data, pos);
            if (r.matched) {
                acc1 = r.value;
                pos = r.position;
            } else {
                loop = false;
            }
        }while (loop)
        return {
            matched: true,
            position: pos,
            value: acc1
        };
    };
}
function reduceLeft(acc, p, reducer) {
    return chainReduce(acc, (acc)=>map(p, (v, data, i, j)=>reducer(acc, v, data, i, j)));
}
function reduceRight(p, acc, reducer) {
    return map(many(p), (vs, data, i, j)=>vs.reduceRight((acc, v)=>reducer(v, acc, data, i, j), acc));
}
function leftAssoc1(pLeft, pOper) {
    return chain(pLeft, (v0)=>reduceLeft(v0, pOper, (acc, f)=>f(acc)));
}
function rightAssoc1(pOper, pRight) {
    return ab(reduceRight(pOper, (y)=>y, (f, acc)=>(y)=>f(acc(y))), pRight, (f, v)=>f(v));
}
function leftAssoc2(pLeft, pOper, pRight) {
    return chain(pLeft, (v0)=>reduceLeft(v0, ab(pOper, pRight, (f, y)=>[
                f,
                y
            ]), (acc, [f, y])=>f(acc, y)));
}
function rightAssoc2(pLeft, pOper, pRight) {
    return ab(reduceRight(ab(pLeft, pOper, (x, f)=>[
            x,
            f
        ]), (y)=>y, ([x, f], acc)=>(y)=>f(x, acc(y))), pRight, (f, v)=>f(v));
}
function condition(cond, pTrue, pFalse) {
    return (data, i)=>cond(data, i) ? pTrue(data, i) : pFalse(data, i);
}
function decide(p) {
    return (data, i)=>mapOuter(p(data, i), (m1)=>m1.value(data, m1.position));
}
function chain(p, f) {
    return (data, i)=>mapOuter(p(data, i), (m1)=>f(m1.value, data, i, m1.position)(data, m1.position));
}
function ahead(p) {
    return (data, i)=>mapOuter(p(data, i), (m1)=>({
                matched: true,
                position: i,
                value: m1.value
            }));
}
function recursive(f) {
    return function(data, i) {
        return f()(data, i);
    };
}
function start(data, i) {
    return i !== 0 ? {
        matched: false
    } : {
        matched: true,
        position: i,
        value: true
    };
}
function end(data, i) {
    return i < data.tokens.length ? {
        matched: false
    } : {
        matched: true,
        position: i,
        value: true
    };
}
function remainingTokensNumber(data, i) {
    return data.tokens.length - i;
}
function parserPosition(data, i, formatToken, contextTokens = 3) {
    const len = data.tokens.length;
    const lowIndex = util.clamp(0, i - contextTokens, len - contextTokens);
    const highIndex = util.clamp(contextTokens, i + 1 + contextTokens, len);
    const tokensSlice = data.tokens.slice(lowIndex, highIndex);
    const lines = [];
    const indexWidth = String(highIndex - 1).length + 1;
    if (i < 0) {
        lines.push(`${String(i).padStart(indexWidth)} >>`);
    }
    if (0 < lowIndex) {
        lines.push('...'.padStart(indexWidth + 6));
    }
    for(let j = 0; j < tokensSlice.length; j++){
        const index = lowIndex + j;
        lines.push(`${String(index).padStart(indexWidth)} ${index === i ? '>' : ' '} ${util.escapeWhitespace(formatToken(tokensSlice[j]))}`);
    }
    if (highIndex < len) {
        lines.push('...'.padStart(indexWidth + 6));
    }
    if (len <= i) {
        lines.push(`${String(i).padStart(indexWidth)} >>`);
    }
    return lines.join('\n');
}
function parse(parser, tokens, options, formatToken = JSON.stringify) {
    const data = {
        tokens: tokens,
        options: options
    };
    const result = parser(data, 0);
    if (!result.matched) {
        throw new Error('No match');
    }
    if (result.position < data.tokens.length) {
        throw new Error(`Partial match. Parsing stopped at:\n${parserPosition(data, result.position, formatToken)}`);
    }
    return result.value;
}
function tryParse(parser, tokens, options) {
    const result = parser({
        tokens: tokens,
        options: options
    }, 0);
    return result.matched ? result.value : undefined;
}
function match(matcher, tokens, options) {
    const result = matcher({
        tokens: tokens,
        options: options
    }, 0);
    return result.value;
}
exports.ab = ab;
exports.abc = abc;
exports.action = action;
exports.ahead = ahead;
exports.all = all;
exports.and = all;
exports.any = any;
exports.chain = chain;
exports.chainReduce = chainReduce;
exports.choice = choice;
exports.condition = condition;
exports.decide = decide;
exports.discard = skip;
exports.eitherOr = otherwise;
exports.emit = emit;
exports.end = end;
exports.eof = end;
exports.error = error;
exports.fail = fail;
exports.flatten = flatten;
exports.flatten1 = flatten1;
exports.left = left;
exports.leftAssoc1 = leftAssoc1;
exports.leftAssoc2 = leftAssoc2;
exports.longest = longest;
exports.lookAhead = ahead;
exports.make = make;
exports.many = many;
exports.many1 = many1;
exports.map = map;
exports.map1 = map1;
exports.match = match;
exports.middle = middle;
exports.not = not;
exports.of = emit;
exports.option = option;
exports.or = choice;
exports.otherwise = otherwise;
exports.parse = parse;
exports.parserPosition = parserPosition;
exports.peek = peek;
exports.recursive = recursive;
exports.reduceLeft = reduceLeft;
exports.reduceRight = reduceRight;
exports.remainingTokensNumber = remainingTokensNumber;
exports.right = right;
exports.rightAssoc1 = rightAssoc1;
exports.rightAssoc2 = rightAssoc2;
exports.satisfy = satisfy;
exports.sepBy = sepBy;
exports.sepBy1 = sepBy1;
exports.skip = skip;
exports.some = many1;
exports.start = start;
exports.takeUntil = takeUntil;
exports.takeUntilP = takeUntilP;
exports.takeWhile = takeWhile;
exports.takeWhileP = takeWhileP;
exports.token = token;
exports.tryParse = tryParse;
}),
"[project]/Autonomous-Claims-Orchestrator/node_modules/parseley/lib/parseley.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, '__esModule', {
    value: true
});
var leac = __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/leac/lib/leac.cjs [app-route] (ecmascript)");
var p = __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/peberminta/lib/core.cjs [app-route] (ecmascript)");
function _interopNamespace(e) {
    if (e && e.__esModule) return e;
    var n = Object.create(null);
    if (e) {
        Object.keys(e).forEach(function(k) {
            if (k !== 'default') {
                var d = Object.getOwnPropertyDescriptor(e, k);
                Object.defineProperty(n, k, d.get ? d : {
                    enumerable: true,
                    get: function() {
                        return e[k];
                    }
                });
            }
        });
    }
    n["default"] = e;
    return Object.freeze(n);
}
var p__namespace = /*#__PURE__*/ _interopNamespace(p);
var ast = /*#__PURE__*/ Object.freeze({
    __proto__: null
});
const ws = `(?:[ \\t\\r\\n\\f]*)`;
const nl = `(?:\\n|\\r\\n|\\r|\\f)`;
const nonascii = `[^\\x00-\\x7F]`;
const unicode = `(?:\\\\[0-9a-f]{1,6}(?:\\r\\n|[ \\n\\r\\t\\f])?)`;
const escape = `(?:\\\\[^\\n\\r\\f0-9a-f])`;
const nmstart = `(?:[_a-z]|${nonascii}|${unicode}|${escape})`;
const nmchar = `(?:[_a-z0-9-]|${nonascii}|${unicode}|${escape})`;
const name = `(?:${nmchar}+)`;
const ident = `(?:[-]?${nmstart}${nmchar}*)`;
const string1 = `'([^\\n\\r\\f\\\\']|\\\\${nl}|${nonascii}|${unicode}|${escape})*'`;
const string2 = `"([^\\n\\r\\f\\\\"]|\\\\${nl}|${nonascii}|${unicode}|${escape})*"`;
const lexSelector = leac.createLexer([
    {
        name: 'ws',
        regex: new RegExp(ws)
    },
    {
        name: 'hash',
        regex: new RegExp(`#${name}`, 'i')
    },
    {
        name: 'ident',
        regex: new RegExp(ident, 'i')
    },
    {
        name: 'str1',
        regex: new RegExp(string1, 'i')
    },
    {
        name: 'str2',
        regex: new RegExp(string2, 'i')
    },
    {
        name: '*'
    },
    {
        name: '.'
    },
    {
        name: ','
    },
    {
        name: '['
    },
    {
        name: ']'
    },
    {
        name: '='
    },
    {
        name: '>'
    },
    {
        name: '|'
    },
    {
        name: '+'
    },
    {
        name: '~'
    },
    {
        name: '^'
    },
    {
        name: '$'
    }
]);
const lexEscapedString = leac.createLexer([
    {
        name: 'unicode',
        regex: new RegExp(unicode, 'i')
    },
    {
        name: 'escape',
        regex: new RegExp(escape, 'i')
    },
    {
        name: 'any',
        regex: new RegExp('[\\s\\S]', 'i')
    }
]);
function sumSpec([a0, a1, a2], [b0, b1, b2]) {
    return [
        a0 + b0,
        a1 + b1,
        a2 + b2
    ];
}
function sumAllSpec(ss) {
    return ss.reduce(sumSpec, [
        0,
        0,
        0
    ]);
}
const unicodeEscapedSequence_ = p__namespace.token((t)=>t.name === 'unicode' ? String.fromCodePoint(parseInt(t.text.slice(1), 16)) : undefined);
const escapedSequence_ = p__namespace.token((t)=>t.name === 'escape' ? t.text.slice(1) : undefined);
const anyChar_ = p__namespace.token((t)=>t.name === 'any' ? t.text : undefined);
const escapedString_ = p__namespace.map(p__namespace.many(p__namespace.or(unicodeEscapedSequence_, escapedSequence_, anyChar_)), (cs)=>cs.join(''));
function unescape(escapedString) {
    const lexerResult = lexEscapedString(escapedString);
    const result = escapedString_({
        tokens: lexerResult.tokens,
        options: undefined
    }, 0);
    return result.value;
}
function literal(name) {
    return p__namespace.token((t)=>t.name === name ? true : undefined);
}
const whitespace_ = p__namespace.token((t)=>t.name === 'ws' ? null : undefined);
const optionalWhitespace_ = p__namespace.option(whitespace_, null);
function optionallySpaced(parser) {
    return p__namespace.middle(optionalWhitespace_, parser, optionalWhitespace_);
}
const identifier_ = p__namespace.token((t)=>t.name === 'ident' ? unescape(t.text) : undefined);
const hashId_ = p__namespace.token((t)=>t.name === 'hash' ? unescape(t.text.slice(1)) : undefined);
const string_ = p__namespace.token((t)=>t.name.startsWith('str') ? unescape(t.text.slice(1, -1)) : undefined);
const namespace_ = p__namespace.left(p__namespace.option(identifier_, ''), literal('|'));
const qualifiedName_ = p__namespace.eitherOr(p__namespace.ab(namespace_, identifier_, (ns, name)=>({
        name: name,
        namespace: ns
    })), p__namespace.map(identifier_, (name)=>({
        name: name,
        namespace: null
    })));
const uniSelector_ = p__namespace.eitherOr(p__namespace.ab(namespace_, literal('*'), (ns)=>({
        type: 'universal',
        namespace: ns,
        specificity: [
            0,
            0,
            0
        ]
    })), p__namespace.map(literal('*'), ()=>({
        type: 'universal',
        namespace: null,
        specificity: [
            0,
            0,
            0
        ]
    })));
const tagSelector_ = p__namespace.map(qualifiedName_, ({ name, namespace })=>({
        type: 'tag',
        name: name,
        namespace: namespace,
        specificity: [
            0,
            0,
            1
        ]
    }));
const classSelector_ = p__namespace.ab(literal('.'), identifier_, (fullstop, name)=>({
        type: 'class',
        name: name,
        specificity: [
            0,
            1,
            0
        ]
    }));
const idSelector_ = p__namespace.map(hashId_, (name)=>({
        type: 'id',
        name: name,
        specificity: [
            1,
            0,
            0
        ]
    }));
const attrModifier_ = p__namespace.token((t)=>{
    if (t.name === 'ident') {
        if (t.text === 'i' || t.text === 'I') {
            return 'i';
        }
        if (t.text === 's' || t.text === 'S') {
            return 's';
        }
    }
    return undefined;
});
const attrValue_ = p__namespace.eitherOr(p__namespace.ab(string_, p__namespace.option(p__namespace.right(optionalWhitespace_, attrModifier_), null), (v, mod)=>({
        value: v,
        modifier: mod
    })), p__namespace.ab(identifier_, p__namespace.option(p__namespace.right(whitespace_, attrModifier_), null), (v, mod)=>({
        value: v,
        modifier: mod
    })));
const attrMatcher_ = p__namespace.choice(p__namespace.map(literal('='), ()=>'='), p__namespace.ab(literal('~'), literal('='), ()=>'~='), p__namespace.ab(literal('|'), literal('='), ()=>'|='), p__namespace.ab(literal('^'), literal('='), ()=>'^='), p__namespace.ab(literal('$'), literal('='), ()=>'$='), p__namespace.ab(literal('*'), literal('='), ()=>'*='));
const attrPresenceSelector_ = p__namespace.abc(literal('['), optionallySpaced(qualifiedName_), literal(']'), (lbr, { name, namespace })=>({
        type: 'attrPresence',
        name: name,
        namespace: namespace,
        specificity: [
            0,
            1,
            0
        ]
    }));
const attrValueSelector_ = p__namespace.middle(literal('['), p__namespace.abc(optionallySpaced(qualifiedName_), attrMatcher_, optionallySpaced(attrValue_), ({ name, namespace }, matcher, { value, modifier })=>({
        type: 'attrValue',
        name: name,
        namespace: namespace,
        matcher: matcher,
        value: value,
        modifier: modifier,
        specificity: [
            0,
            1,
            0
        ]
    })), literal(']'));
const attrSelector_ = p__namespace.eitherOr(attrPresenceSelector_, attrValueSelector_);
const typeSelector_ = p__namespace.eitherOr(uniSelector_, tagSelector_);
const subclassSelector_ = p__namespace.choice(idSelector_, classSelector_, attrSelector_);
const compoundSelector_ = p__namespace.map(p__namespace.eitherOr(p__namespace.flatten(typeSelector_, p__namespace.many(subclassSelector_)), p__namespace.many1(subclassSelector_)), (ss)=>{
    return {
        type: 'compound',
        list: ss,
        specificity: sumAllSpec(ss.map((s)=>s.specificity))
    };
});
const combinator_ = p__namespace.choice(p__namespace.map(literal('>'), ()=>'>'), p__namespace.map(literal('+'), ()=>'+'), p__namespace.map(literal('~'), ()=>'~'), p__namespace.ab(literal('|'), literal('|'), ()=>'||'));
const combinatorSeparator_ = p__namespace.eitherOr(optionallySpaced(combinator_), p__namespace.map(whitespace_, ()=>' '));
const complexSelector_ = p__namespace.leftAssoc2(compoundSelector_, p__namespace.map(combinatorSeparator_, (c)=>(left, right)=>({
            type: 'compound',
            list: [
                ...right.list,
                {
                    type: 'combinator',
                    combinator: c,
                    left: left,
                    specificity: left.specificity
                }
            ],
            specificity: sumSpec(left.specificity, right.specificity)
        })), compoundSelector_);
const listSelector_ = p__namespace.leftAssoc2(p__namespace.map(complexSelector_, (s)=>({
        type: 'list',
        list: [
            s
        ]
    })), p__namespace.map(optionallySpaced(literal(',')), ()=>(acc, next)=>({
            type: 'list',
            list: [
                ...acc.list,
                next
            ]
        })), complexSelector_);
function parse_(parser, str) {
    if (!(typeof str === 'string' || str instanceof String)) {
        throw new Error('Expected a selector string. Actual input is not a string!');
    }
    const lexerResult = lexSelector(str);
    if (!lexerResult.complete) {
        throw new Error(`The input "${str}" was only partially tokenized, stopped at offset ${lexerResult.offset}!\n` + prettyPrintPosition(str, lexerResult.offset));
    }
    const result = optionallySpaced(parser)({
        tokens: lexerResult.tokens,
        options: undefined
    }, 0);
    if (!result.matched) {
        throw new Error(`No match for "${str}" input!`);
    }
    if (result.position < lexerResult.tokens.length) {
        const token = lexerResult.tokens[result.position];
        throw new Error(`The input "${str}" was only partially parsed, stopped at offset ${token.offset}!\n` + prettyPrintPosition(str, token.offset, token.len));
    }
    return result.value;
}
function prettyPrintPosition(str, offset, len = 1) {
    return `${str.replace(/(\t)|(\r)|(\n)/g, (m, t, r)=>t ? '\u2409' : r ? '\u240d' : '\u240a')}\n${''.padEnd(offset)}${'^'.repeat(len)}`;
}
function parse(str) {
    return parse_(listSelector_, str);
}
function parse1(str) {
    return parse_(complexSelector_, str);
}
function serialize(selector) {
    if (!selector.type) {
        throw new Error('This is not an AST node.');
    }
    switch(selector.type){
        case 'universal':
            return _serNs(selector.namespace) + '*';
        case 'tag':
            return _serNs(selector.namespace) + _serIdent(selector.name);
        case 'class':
            return '.' + _serIdent(selector.name);
        case 'id':
            return '#' + _serIdent(selector.name);
        case 'attrPresence':
            return `[${_serNs(selector.namespace)}${_serIdent(selector.name)}]`;
        case 'attrValue':
            return `[${_serNs(selector.namespace)}${_serIdent(selector.name)}${selector.matcher}"${_serStr(selector.value)}"${selector.modifier ? selector.modifier : ''}]`;
        case 'combinator':
            return serialize(selector.left) + selector.combinator;
        case 'compound':
            return selector.list.reduce((acc, node)=>{
                if (node.type === 'combinator') {
                    return serialize(node) + acc;
                } else {
                    return acc + serialize(node);
                }
            }, '');
        case 'list':
            return selector.list.map(serialize).join(',');
    }
}
function _serNs(ns) {
    return ns || ns === '' ? _serIdent(ns) + '|' : '';
}
function _codePoint(char) {
    return `\\${char.codePointAt(0).toString(16)} `;
}
function _serIdent(str) {
    return str.replace(/(^[0-9])|(^-[0-9])|(^-$)|([-0-9a-zA-Z_]|[^\x00-\x7F])|(\x00)|([\x01-\x1f]|\x7f)|([\s\S])/g, (m, d1, d2, hy, safe, nl, ctrl, other)=>d1 ? _codePoint(d1) : d2 ? '-' + _codePoint(d2.slice(1)) : hy ? '\\-' : safe ? safe : nl ? '\ufffd' : ctrl ? _codePoint(ctrl) : '\\' + other);
}
function _serStr(str) {
    return str.replace(/(")|(\\)|(\x00)|([\x01-\x1f]|\x7f)/g, (m, dq, bs, nl, ctrl)=>dq ? '\\"' : bs ? '\\\\' : nl ? '\ufffd' : _codePoint(ctrl));
}
function normalize(selector) {
    if (!selector.type) {
        throw new Error('This is not an AST node.');
    }
    switch(selector.type){
        case 'compound':
            {
                selector.list.forEach(normalize);
                selector.list.sort((a, b)=>_compareArrays(_getSelectorPriority(a), _getSelectorPriority(b)));
                break;
            }
        case 'combinator':
            {
                normalize(selector.left);
                break;
            }
        case 'list':
            {
                selector.list.forEach(normalize);
                selector.list.sort((a, b)=>serialize(a) < serialize(b) ? -1 : 1);
                break;
            }
    }
    return selector;
}
function _getSelectorPriority(selector) {
    switch(selector.type){
        case 'universal':
            return [
                1
            ];
        case 'tag':
            return [
                1
            ];
        case 'id':
            return [
                2
            ];
        case 'class':
            return [
                3,
                selector.name
            ];
        case 'attrPresence':
            return [
                4,
                serialize(selector)
            ];
        case 'attrValue':
            return [
                5,
                serialize(selector)
            ];
        case 'combinator':
            return [
                15,
                serialize(selector)
            ];
    }
}
function compareSelectors(a, b) {
    return _compareArrays(a.specificity, b.specificity);
}
function compareSpecificity(a, b) {
    return _compareArrays(a, b);
}
function _compareArrays(a, b) {
    if (!Array.isArray(a) || !Array.isArray(b)) {
        throw new Error('Arguments must be arrays.');
    }
    const shorter = a.length < b.length ? a.length : b.length;
    for(let i = 0; i < shorter; i++){
        if (a[i] === b[i]) {
            continue;
        }
        return a[i] < b[i] ? -1 : 1;
    }
    return a.length - b.length;
}
exports.Ast = ast;
exports.compareSelectors = compareSelectors;
exports.compareSpecificity = compareSpecificity;
exports.normalize = normalize;
exports.parse = parse;
exports.parse1 = parse1;
exports.serialize = serialize;
}),
"[project]/Autonomous-Claims-Orchestrator/node_modules/selderee/lib/selderee.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, '__esModule', {
    value: true
});
var parseley = __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/parseley/lib/parseley.cjs [app-route] (ecmascript)");
function _interopNamespace(e) {
    if (e && e.__esModule) return e;
    var n = Object.create(null);
    if (e) {
        Object.keys(e).forEach(function(k) {
            if (k !== 'default') {
                var d = Object.getOwnPropertyDescriptor(e, k);
                Object.defineProperty(n, k, d.get ? d : {
                    enumerable: true,
                    get: function() {
                        return e[k];
                    }
                });
            }
        });
    }
    n["default"] = e;
    return Object.freeze(n);
}
var parseley__namespace = /*#__PURE__*/ _interopNamespace(parseley);
var Ast = /*#__PURE__*/ Object.freeze({
    __proto__: null
});
var Types = /*#__PURE__*/ Object.freeze({
    __proto__: null
});
const treeify = (nodes)=>'▽\n' + treeifyArray(nodes, thinLines);
const thinLines = [
    [
        '├─',
        '│ '
    ],
    [
        '└─',
        '  '
    ]
];
const heavyLines = [
    [
        '┠─',
        '┃ '
    ],
    [
        '┖─',
        '  '
    ]
];
const doubleLines = [
    [
        '╟─',
        '║ '
    ],
    [
        '╙─',
        '  '
    ]
];
function treeifyArray(nodes, tpl = heavyLines) {
    return prefixItems(tpl, nodes.map((n)=>treeifyNode(n)));
}
function treeifyNode(node) {
    switch(node.type){
        case 'terminal':
            {
                const vctr = node.valueContainer;
                return `◁ #${vctr.index} ${JSON.stringify(vctr.specificity)} ${vctr.value}`;
            }
        case 'tagName':
            return `◻ Tag name\n${treeifyArray(node.variants, doubleLines)}`;
        case 'attrValue':
            return `▣ Attr value: ${node.name}\n${treeifyArray(node.matchers, doubleLines)}`;
        case 'attrPresence':
            return `◨ Attr presence: ${node.name}\n${treeifyArray(node.cont)}`;
        case 'pushElement':
            return `◉ Push element: ${node.combinator}\n${treeifyArray(node.cont, thinLines)}`;
        case 'popElement':
            return `◌ Pop element\n${treeifyArray(node.cont, thinLines)}`;
        case 'variant':
            return `◇ = ${node.value}\n${treeifyArray(node.cont)}`;
        case 'matcher':
            return `◈ ${node.matcher} "${node.value}"${node.modifier || ''}\n${treeifyArray(node.cont)}`;
    }
}
function prefixItems(tpl, items) {
    return items.map((item, i, { length })=>prefixItem(tpl, item, i === length - 1)).join('\n');
}
function prefixItem(tpl, item, tail = true) {
    const tpl1 = tpl[tail ? 1 : 0];
    return tpl1[0] + item.split('\n').join('\n' + tpl1[1]);
}
var TreeifyBuilder = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    treeify: treeify
});
class DecisionTree {
    constructor(input){
        this.branches = weave(toAstTerminalPairs(input));
    }
    build(builder) {
        return builder(this.branches);
    }
}
function toAstTerminalPairs(array) {
    const len = array.length;
    const results = new Array(len);
    for(let i = 0; i < len; i++){
        const [selectorString, val] = array[i];
        const ast = preprocess(parseley__namespace.parse1(selectorString));
        results[i] = {
            ast: ast,
            terminal: {
                type: 'terminal',
                valueContainer: {
                    index: i,
                    value: val,
                    specificity: ast.specificity
                }
            }
        };
    }
    return results;
}
function preprocess(ast) {
    reduceSelectorVariants(ast);
    parseley__namespace.normalize(ast);
    return ast;
}
function reduceSelectorVariants(ast) {
    const newList = [];
    ast.list.forEach((sel)=>{
        switch(sel.type){
            case 'class':
                newList.push({
                    matcher: '~=',
                    modifier: null,
                    name: 'class',
                    namespace: null,
                    specificity: sel.specificity,
                    type: 'attrValue',
                    value: sel.name
                });
                break;
            case 'id':
                newList.push({
                    matcher: '=',
                    modifier: null,
                    name: 'id',
                    namespace: null,
                    specificity: sel.specificity,
                    type: 'attrValue',
                    value: sel.name
                });
                break;
            case 'combinator':
                reduceSelectorVariants(sel.left);
                newList.push(sel);
                break;
            case 'universal':
                break;
            default:
                newList.push(sel);
                break;
        }
    });
    ast.list = newList;
}
function weave(items) {
    const branches = [];
    while(items.length){
        const topKind = findTopKey(items, (sel)=>true, getSelectorKind);
        const { matches, nonmatches, empty } = breakByKind(items, topKind);
        items = nonmatches;
        if (matches.length) {
            branches.push(branchOfKind(topKind, matches));
        }
        if (empty.length) {
            branches.push(...terminate(empty));
        }
    }
    return branches;
}
function terminate(items) {
    const results = [];
    for (const item of items){
        const terminal = item.terminal;
        if (terminal.type === 'terminal') {
            results.push(terminal);
        } else {
            const { matches, rest } = partition(terminal.cont, (node)=>node.type === 'terminal');
            matches.forEach((node)=>results.push(node));
            if (rest.length) {
                terminal.cont = rest;
                results.push(terminal);
            }
        }
    }
    return results;
}
function breakByKind(items, selectedKind) {
    const matches = [];
    const nonmatches = [];
    const empty = [];
    for (const item of items){
        const simpsels = item.ast.list;
        if (simpsels.length) {
            const isMatch = simpsels.some((node)=>getSelectorKind(node) === selectedKind);
            (isMatch ? matches : nonmatches).push(item);
        } else {
            empty.push(item);
        }
    }
    return {
        matches,
        nonmatches,
        empty
    };
}
function getSelectorKind(sel) {
    switch(sel.type){
        case 'attrPresence':
            return `attrPresence ${sel.name}`;
        case 'attrValue':
            return `attrValue ${sel.name}`;
        case 'combinator':
            return `combinator ${sel.combinator}`;
        default:
            return sel.type;
    }
}
function branchOfKind(kind, items) {
    if (kind === 'tag') {
        return tagNameBranch(items);
    }
    if (kind.startsWith('attrValue ')) {
        return attrValueBranch(kind.substring(10), items);
    }
    if (kind.startsWith('attrPresence ')) {
        return attrPresenceBranch(kind.substring(13), items);
    }
    if (kind === 'combinator >') {
        return combinatorBranch('>', items);
    }
    if (kind === 'combinator +') {
        return combinatorBranch('+', items);
    }
    throw new Error(`Unsupported selector kind: ${kind}`);
}
function tagNameBranch(items) {
    const groups = spliceAndGroup(items, (x)=>x.type === 'tag', (x)=>x.name);
    const variants = Object.entries(groups).map(([name, group])=>({
            type: 'variant',
            value: name,
            cont: weave(group.items)
        }));
    return {
        type: 'tagName',
        variants: variants
    };
}
function attrPresenceBranch(name, items) {
    for (const item of items){
        spliceSimpleSelector(item, (x)=>x.type === 'attrPresence' && x.name === name);
    }
    return {
        type: 'attrPresence',
        name: name,
        cont: weave(items)
    };
}
function attrValueBranch(name, items) {
    const groups = spliceAndGroup(items, (x)=>x.type === 'attrValue' && x.name === name, (x)=>`${x.matcher} ${x.modifier || ''} ${x.value}`);
    const matchers = [];
    for (const group of Object.values(groups)){
        const sel = group.oneSimpleSelector;
        const predicate = getAttrPredicate(sel);
        const continuation = weave(group.items);
        matchers.push({
            type: 'matcher',
            matcher: sel.matcher,
            modifier: sel.modifier,
            value: sel.value,
            predicate: predicate,
            cont: continuation
        });
    }
    return {
        type: 'attrValue',
        name: name,
        matchers: matchers
    };
}
function getAttrPredicate(sel) {
    if (sel.modifier === 'i') {
        const expected = sel.value.toLowerCase();
        switch(sel.matcher){
            case '=':
                return (actual)=>expected === actual.toLowerCase();
            case '~=':
                return (actual)=>actual.toLowerCase().split(/[ \t]+/).includes(expected);
            case '^=':
                return (actual)=>actual.toLowerCase().startsWith(expected);
            case '$=':
                return (actual)=>actual.toLowerCase().endsWith(expected);
            case '*=':
                return (actual)=>actual.toLowerCase().includes(expected);
            case '|=':
                return (actual)=>{
                    const lower = actual.toLowerCase();
                    return expected === lower || lower.startsWith(expected) && lower[expected.length] === '-';
                };
        }
    } else {
        const expected = sel.value;
        switch(sel.matcher){
            case '=':
                return (actual)=>expected === actual;
            case '~=':
                return (actual)=>actual.split(/[ \t]+/).includes(expected);
            case '^=':
                return (actual)=>actual.startsWith(expected);
            case '$=':
                return (actual)=>actual.endsWith(expected);
            case '*=':
                return (actual)=>actual.includes(expected);
            case '|=':
                return (actual)=>expected === actual || actual.startsWith(expected) && actual[expected.length] === '-';
        }
    }
}
function combinatorBranch(combinator, items) {
    const groups = spliceAndGroup(items, (x)=>x.type === 'combinator' && x.combinator === combinator, (x)=>parseley__namespace.serialize(x.left));
    const leftItems = [];
    for (const group of Object.values(groups)){
        const rightCont = weave(group.items);
        const leftAst = group.oneSimpleSelector.left;
        leftItems.push({
            ast: leftAst,
            terminal: {
                type: 'popElement',
                cont: rightCont
            }
        });
    }
    return {
        type: 'pushElement',
        combinator: combinator,
        cont: weave(leftItems)
    };
}
function spliceAndGroup(items, predicate, keyCallback) {
    const groups = {};
    while(items.length){
        const bestKey = findTopKey(items, predicate, keyCallback);
        const bestKeyPredicate = (sel)=>predicate(sel) && keyCallback(sel) === bestKey;
        const hasBestKeyPredicate = (item)=>item.ast.list.some(bestKeyPredicate);
        const { matches, rest } = partition1(items, hasBestKeyPredicate);
        let oneSimpleSelector = null;
        for (const item of matches){
            const splicedNode = spliceSimpleSelector(item, bestKeyPredicate);
            if (!oneSimpleSelector) {
                oneSimpleSelector = splicedNode;
            }
        }
        if (oneSimpleSelector == null) {
            throw new Error('No simple selector is found.');
        }
        groups[bestKey] = {
            oneSimpleSelector: oneSimpleSelector,
            items: matches
        };
        items = rest;
    }
    return groups;
}
function spliceSimpleSelector(item, predicate) {
    const simpsels = item.ast.list;
    const matches = new Array(simpsels.length);
    let firstIndex = -1;
    for(let i = simpsels.length; i-- > 0;){
        if (predicate(simpsels[i])) {
            matches[i] = true;
            firstIndex = i;
        }
    }
    if (firstIndex == -1) {
        throw new Error(`Couldn't find the required simple selector.`);
    }
    const result = simpsels[firstIndex];
    item.ast.list = simpsels.filter((sel, i)=>!matches[i]);
    return result;
}
function findTopKey(items, predicate, keyCallback) {
    const candidates = {};
    for (const item of items){
        const candidates1 = {};
        for (const node of item.ast.list.filter(predicate)){
            candidates1[keyCallback(node)] = true;
        }
        for (const key of Object.keys(candidates1)){
            if (candidates[key]) {
                candidates[key]++;
            } else {
                candidates[key] = 1;
            }
        }
    }
    let topKind = '';
    let topCounter = 0;
    for (const entry of Object.entries(candidates)){
        if (entry[1] > topCounter) {
            topKind = entry[0];
            topCounter = entry[1];
        }
    }
    return topKind;
}
function partition(src, predicate) {
    const matches = [];
    const rest = [];
    for (const x of src){
        if (predicate(x)) {
            matches.push(x);
        } else {
            rest.push(x);
        }
    }
    return {
        matches,
        rest
    };
}
function partition1(src, predicate) {
    const matches = [];
    const rest = [];
    for (const x of src){
        if (predicate(x)) {
            matches.push(x);
        } else {
            rest.push(x);
        }
    }
    return {
        matches,
        rest
    };
}
class Picker {
    constructor(f){
        this.f = f;
    }
    pickAll(el) {
        return this.f(el);
    }
    pick1(el, preferFirst = false) {
        const results = this.f(el);
        const len = results.length;
        if (len === 0) {
            return null;
        }
        if (len === 1) {
            return results[0].value;
        }
        const comparator = preferFirst ? comparatorPreferFirst : comparatorPreferLast;
        let result = results[0];
        for(let i = 1; i < len; i++){
            const next = results[i];
            if (comparator(result, next)) {
                result = next;
            }
        }
        return result.value;
    }
}
function comparatorPreferFirst(acc, next) {
    const diff = parseley.compareSpecificity(next.specificity, acc.specificity);
    return diff > 0 || diff === 0 && next.index < acc.index;
}
function comparatorPreferLast(acc, next) {
    const diff = parseley.compareSpecificity(next.specificity, acc.specificity);
    return diff > 0 || diff === 0 && next.index > acc.index;
}
exports.Ast = Ast;
exports.DecisionTree = DecisionTree;
exports.Picker = Picker;
exports.Treeify = TreeifyBuilder;
exports.Types = Types;
}),
"[project]/Autonomous-Claims-Orchestrator/node_modules/@selderee/plugin-htmlparser2/lib/hp2-builder.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, '__esModule', {
    value: true
});
var domhandler = __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/domhandler/lib/index.js [app-route] (ecmascript)");
var selderee = __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/selderee/lib/selderee.cjs [app-route] (ecmascript)");
function hp2Builder(nodes) {
    return new selderee.Picker(handleArray(nodes));
}
function handleArray(nodes) {
    const matchers = nodes.map(handleNode);
    return (el, ...tail)=>matchers.flatMap((m)=>m(el, ...tail));
}
function handleNode(node) {
    switch(node.type){
        case 'terminal':
            {
                const result = [
                    node.valueContainer
                ];
                return (el, ...tail)=>result;
            }
        case 'tagName':
            return handleTagName(node);
        case 'attrValue':
            return handleAttrValueName(node);
        case 'attrPresence':
            return handleAttrPresenceName(node);
        case 'pushElement':
            return handlePushElementNode(node);
        case 'popElement':
            return handlePopElementNode(node);
    }
}
function handleTagName(node) {
    const variants = {};
    for (const variant of node.variants){
        variants[variant.value] = handleArray(variant.cont);
    }
    return (el, ...tail)=>{
        const continuation = variants[el.name];
        return continuation ? continuation(el, ...tail) : [];
    };
}
function handleAttrPresenceName(node) {
    const attrName = node.name;
    const continuation = handleArray(node.cont);
    return (el, ...tail)=>Object.prototype.hasOwnProperty.call(el.attribs, attrName) ? continuation(el, ...tail) : [];
}
function handleAttrValueName(node) {
    const callbacks = [];
    for (const matcher of node.matchers){
        const predicate = matcher.predicate;
        const continuation = handleArray(matcher.cont);
        callbacks.push((attr, el, ...tail)=>predicate(attr) ? continuation(el, ...tail) : []);
    }
    const attrName = node.name;
    return (el, ...tail)=>{
        const attr = el.attribs[attrName];
        return attr || attr === '' ? callbacks.flatMap((cb)=>cb(attr, el, ...tail)) : [];
    };
}
function handlePushElementNode(node) {
    const continuation = handleArray(node.cont);
    const leftElementGetter = node.combinator === '+' ? getPrecedingElement : getParentElement;
    return (el, ...tail)=>{
        const next = leftElementGetter(el);
        if (next === null) {
            return [];
        }
        return continuation(next, el, ...tail);
    };
}
const getPrecedingElement = (el)=>{
    const prev = el.prev;
    if (prev === null) {
        return null;
    }
    return domhandler.isTag(prev) ? prev : getPrecedingElement(prev);
};
const getParentElement = (el)=>{
    const parent = el.parent;
    return parent && domhandler.isTag(parent) ? parent : null;
};
function handlePopElementNode(node) {
    const continuation = handleArray(node.cont);
    return (el, next, ...tail)=>continuation(next, ...tail);
}
exports.hp2Builder = hp2Builder;
}),
"[project]/Autonomous-Claims-Orchestrator/node_modules/dom-serializer/lib/foreignNames.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.attributeNames = exports.elementNames = void 0;
exports.elementNames = new Map([
    "altGlyph",
    "altGlyphDef",
    "altGlyphItem",
    "animateColor",
    "animateMotion",
    "animateTransform",
    "clipPath",
    "feBlend",
    "feColorMatrix",
    "feComponentTransfer",
    "feComposite",
    "feConvolveMatrix",
    "feDiffuseLighting",
    "feDisplacementMap",
    "feDistantLight",
    "feDropShadow",
    "feFlood",
    "feFuncA",
    "feFuncB",
    "feFuncG",
    "feFuncR",
    "feGaussianBlur",
    "feImage",
    "feMerge",
    "feMergeNode",
    "feMorphology",
    "feOffset",
    "fePointLight",
    "feSpecularLighting",
    "feSpotLight",
    "feTile",
    "feTurbulence",
    "foreignObject",
    "glyphRef",
    "linearGradient",
    "radialGradient",
    "textPath"
].map(function(val) {
    return [
        val.toLowerCase(),
        val
    ];
}));
exports.attributeNames = new Map([
    "definitionURL",
    "attributeName",
    "attributeType",
    "baseFrequency",
    "baseProfile",
    "calcMode",
    "clipPathUnits",
    "diffuseConstant",
    "edgeMode",
    "filterUnits",
    "glyphRef",
    "gradientTransform",
    "gradientUnits",
    "kernelMatrix",
    "kernelUnitLength",
    "keyPoints",
    "keySplines",
    "keyTimes",
    "lengthAdjust",
    "limitingConeAngle",
    "markerHeight",
    "markerUnits",
    "markerWidth",
    "maskContentUnits",
    "maskUnits",
    "numOctaves",
    "pathLength",
    "patternContentUnits",
    "patternTransform",
    "patternUnits",
    "pointsAtX",
    "pointsAtY",
    "pointsAtZ",
    "preserveAlpha",
    "preserveAspectRatio",
    "primitiveUnits",
    "refX",
    "refY",
    "repeatCount",
    "repeatDur",
    "requiredExtensions",
    "requiredFeatures",
    "specularConstant",
    "specularExponent",
    "spreadMethod",
    "startOffset",
    "stdDeviation",
    "stitchTiles",
    "surfaceScale",
    "systemLanguage",
    "tableValues",
    "targetX",
    "targetY",
    "textLength",
    "viewBox",
    "viewTarget",
    "xChannelSelector",
    "yChannelSelector",
    "zoomAndPan"
].map(function(val) {
    return [
        val.toLowerCase(),
        val
    ];
}));
}),
"[project]/Autonomous-Claims-Orchestrator/node_modules/dom-serializer/lib/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __assign = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__assign || function() {
    __assign = Object.assign || function(t) {
        for(var s, i = 1, n = arguments.length; i < n; i++){
            s = arguments[i];
            for(var p in s)if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__createBinding || (Object.create ? function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = {
            enumerable: true,
            get: function() {
                return m[k];
            }
        };
    }
    Object.defineProperty(o, k2, desc);
} : function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
});
var __setModuleDefault = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__setModuleDefault || (Object.create ? function(o, v) {
    Object.defineProperty(o, "default", {
        enumerable: true,
        value: v
    });
} : function(o, v) {
    o["default"] = v;
});
var __importStar = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__importStar || function(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) {
        for(var k in mod)if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    }
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.render = void 0;
/*
 * Module dependencies
 */ var ElementType = __importStar(__turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/domelementtype/lib/index.js [app-route] (ecmascript)"));
var entities_1 = __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/entities/lib/index.js [app-route] (ecmascript)");
/**
 * Mixed-case SVG and MathML tags & attributes
 * recognized by the HTML parser.
 *
 * @see https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-inforeign
 */ var foreignNames_js_1 = __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/dom-serializer/lib/foreignNames.js [app-route] (ecmascript)");
var unencodedElements = new Set([
    "style",
    "script",
    "xmp",
    "iframe",
    "noembed",
    "noframes",
    "plaintext",
    "noscript"
]);
function replaceQuotes(value) {
    return value.replace(/"/g, "&quot;");
}
/**
 * Format attributes
 */ function formatAttributes(attributes, opts) {
    var _a;
    if (!attributes) return;
    var encode = ((_a = opts.encodeEntities) !== null && _a !== void 0 ? _a : opts.decodeEntities) === false ? replaceQuotes : opts.xmlMode || opts.encodeEntities !== "utf8" ? entities_1.encodeXML : entities_1.escapeAttribute;
    return Object.keys(attributes).map(function(key) {
        var _a, _b;
        var value = (_a = attributes[key]) !== null && _a !== void 0 ? _a : "";
        if (opts.xmlMode === "foreign") {
            /* Fix up mixed-case attribute names */ key = (_b = foreignNames_js_1.attributeNames.get(key)) !== null && _b !== void 0 ? _b : key;
        }
        if (!opts.emptyAttrs && !opts.xmlMode && value === "") {
            return key;
        }
        return "".concat(key, "=\"").concat(encode(value), "\"");
    }).join(" ");
}
/**
 * Self-enclosing tags
 */ var singleTag = new Set([
    "area",
    "base",
    "basefont",
    "br",
    "col",
    "command",
    "embed",
    "frame",
    "hr",
    "img",
    "input",
    "isindex",
    "keygen",
    "link",
    "meta",
    "param",
    "source",
    "track",
    "wbr"
]);
/**
 * Renders a DOM node or an array of DOM nodes to a string.
 *
 * Can be thought of as the equivalent of the `outerHTML` of the passed node(s).
 *
 * @param node Node to be rendered.
 * @param options Changes serialization behavior
 */ function render(node, options) {
    if (options === void 0) {
        options = {};
    }
    var nodes = "length" in node ? node : [
        node
    ];
    var output = "";
    for(var i = 0; i < nodes.length; i++){
        output += renderNode(nodes[i], options);
    }
    return output;
}
exports.render = render;
exports.default = render;
function renderNode(node, options) {
    switch(node.type){
        case ElementType.Root:
            return render(node.children, options);
        // @ts-expect-error We don't use `Doctype` yet
        case ElementType.Doctype:
        case ElementType.Directive:
            return renderDirective(node);
        case ElementType.Comment:
            return renderComment(node);
        case ElementType.CDATA:
            return renderCdata(node);
        case ElementType.Script:
        case ElementType.Style:
        case ElementType.Tag:
            return renderTag(node, options);
        case ElementType.Text:
            return renderText(node, options);
    }
}
var foreignModeIntegrationPoints = new Set([
    "mi",
    "mo",
    "mn",
    "ms",
    "mtext",
    "annotation-xml",
    "foreignObject",
    "desc",
    "title"
]);
var foreignElements = new Set([
    "svg",
    "math"
]);
function renderTag(elem, opts) {
    var _a;
    // Handle SVG / MathML in HTML
    if (opts.xmlMode === "foreign") {
        /* Fix up mixed-case element names */ elem.name = (_a = foreignNames_js_1.elementNames.get(elem.name)) !== null && _a !== void 0 ? _a : elem.name;
        /* Exit foreign mode at integration points */ if (elem.parent && foreignModeIntegrationPoints.has(elem.parent.name)) {
            opts = __assign(__assign({}, opts), {
                xmlMode: false
            });
        }
    }
    if (!opts.xmlMode && foreignElements.has(elem.name)) {
        opts = __assign(__assign({}, opts), {
            xmlMode: "foreign"
        });
    }
    var tag = "<".concat(elem.name);
    var attribs = formatAttributes(elem.attribs, opts);
    if (attribs) {
        tag += " ".concat(attribs);
    }
    if (elem.children.length === 0 && (opts.xmlMode ? opts.selfClosingTags !== false : opts.selfClosingTags && singleTag.has(elem.name))) {
        if (!opts.xmlMode) tag += " ";
        tag += "/>";
    } else {
        tag += ">";
        if (elem.children.length > 0) {
            tag += render(elem.children, opts);
        }
        if (opts.xmlMode || !singleTag.has(elem.name)) {
            tag += "</".concat(elem.name, ">");
        }
    }
    return tag;
}
function renderDirective(elem) {
    return "<".concat(elem.data, ">");
}
function renderText(elem, opts) {
    var _a;
    var data = elem.data || "";
    // If entities weren't decoded, no need to encode them back
    if (((_a = opts.encodeEntities) !== null && _a !== void 0 ? _a : opts.decodeEntities) !== false && !(!opts.xmlMode && elem.parent && unencodedElements.has(elem.parent.name))) {
        data = opts.xmlMode || opts.encodeEntities !== "utf8" ? (0, entities_1.encodeXML)(data) : (0, entities_1.escapeText)(data);
    }
    return data;
}
function renderCdata(elem) {
    return "<![CDATA[".concat(elem.children[0].data, "]]>");
}
function renderComment(elem) {
    return "<!--".concat(elem.data, "-->");
}
}),
"[project]/Autonomous-Claims-Orchestrator/node_modules/domutils/lib/stringify.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __importDefault = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : {
        "default": mod
    };
};
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getOuterHTML = getOuterHTML;
exports.getInnerHTML = getInnerHTML;
exports.getText = getText;
exports.textContent = textContent;
exports.innerText = innerText;
var domhandler_1 = __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/domhandler/lib/index.js [app-route] (ecmascript)");
var dom_serializer_1 = __importDefault(__turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/dom-serializer/lib/index.js [app-route] (ecmascript)"));
var domelementtype_1 = __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/domelementtype/lib/index.js [app-route] (ecmascript)");
/**
 * @category Stringify
 * @deprecated Use the `dom-serializer` module directly.
 * @param node Node to get the outer HTML of.
 * @param options Options for serialization.
 * @returns `node`'s outer HTML.
 */ function getOuterHTML(node, options) {
    return (0, dom_serializer_1.default)(node, options);
}
/**
 * @category Stringify
 * @deprecated Use the `dom-serializer` module directly.
 * @param node Node to get the inner HTML of.
 * @param options Options for serialization.
 * @returns `node`'s inner HTML.
 */ function getInnerHTML(node, options) {
    return (0, domhandler_1.hasChildren)(node) ? node.children.map(function(node) {
        return getOuterHTML(node, options);
    }).join("") : "";
}
/**
 * Get a node's inner text. Same as `textContent`, but inserts newlines for `<br>` tags. Ignores comments.
 *
 * @category Stringify
 * @deprecated Use `textContent` instead.
 * @param node Node to get the inner text of.
 * @returns `node`'s inner text.
 */ function getText(node) {
    if (Array.isArray(node)) return node.map(getText).join("");
    if ((0, domhandler_1.isTag)(node)) return node.name === "br" ? "\n" : getText(node.children);
    if ((0, domhandler_1.isCDATA)(node)) return getText(node.children);
    if ((0, domhandler_1.isText)(node)) return node.data;
    return "";
}
/**
 * Get a node's text content. Ignores comments.
 *
 * @category Stringify
 * @param node Node to get the text content of.
 * @returns `node`'s text content.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent}
 */ function textContent(node) {
    if (Array.isArray(node)) return node.map(textContent).join("");
    if ((0, domhandler_1.hasChildren)(node) && !(0, domhandler_1.isComment)(node)) {
        return textContent(node.children);
    }
    if ((0, domhandler_1.isText)(node)) return node.data;
    return "";
}
/**
 * Get a node's inner text, ignoring `<script>` and `<style>` tags. Ignores comments.
 *
 * @category Stringify
 * @param node Node to get the inner text of.
 * @returns `node`'s inner text.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Node/innerText}
 */ function innerText(node) {
    if (Array.isArray(node)) return node.map(innerText).join("");
    if ((0, domhandler_1.hasChildren)(node) && (node.type === domelementtype_1.ElementType.Tag || (0, domhandler_1.isCDATA)(node))) {
        return innerText(node.children);
    }
    if ((0, domhandler_1.isText)(node)) return node.data;
    return "";
} //# sourceMappingURL=stringify.js.map
}),
"[project]/Autonomous-Claims-Orchestrator/node_modules/domutils/lib/traversal.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getChildren = getChildren;
exports.getParent = getParent;
exports.getSiblings = getSiblings;
exports.getAttributeValue = getAttributeValue;
exports.hasAttrib = hasAttrib;
exports.getName = getName;
exports.nextElementSibling = nextElementSibling;
exports.prevElementSibling = prevElementSibling;
var domhandler_1 = __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/domhandler/lib/index.js [app-route] (ecmascript)");
/**
 * Get a node's children.
 *
 * @category Traversal
 * @param elem Node to get the children of.
 * @returns `elem`'s children, or an empty array.
 */ function getChildren(elem) {
    return (0, domhandler_1.hasChildren)(elem) ? elem.children : [];
}
/**
 * Get a node's parent.
 *
 * @category Traversal
 * @param elem Node to get the parent of.
 * @returns `elem`'s parent node, or `null` if `elem` is a root node.
 */ function getParent(elem) {
    return elem.parent || null;
}
/**
 * Gets an elements siblings, including the element itself.
 *
 * Attempts to get the children through the element's parent first. If we don't
 * have a parent (the element is a root node), we walk the element's `prev` &
 * `next` to get all remaining nodes.
 *
 * @category Traversal
 * @param elem Element to get the siblings of.
 * @returns `elem`'s siblings, including `elem`.
 */ function getSiblings(elem) {
    var _a, _b;
    var parent = getParent(elem);
    if (parent != null) return getChildren(parent);
    var siblings = [
        elem
    ];
    var prev = elem.prev, next = elem.next;
    while(prev != null){
        siblings.unshift(prev);
        _a = prev, prev = _a.prev;
    }
    while(next != null){
        siblings.push(next);
        _b = next, next = _b.next;
    }
    return siblings;
}
/**
 * Gets an attribute from an element.
 *
 * @category Traversal
 * @param elem Element to check.
 * @param name Attribute name to retrieve.
 * @returns The element's attribute value, or `undefined`.
 */ function getAttributeValue(elem, name) {
    var _a;
    return (_a = elem.attribs) === null || _a === void 0 ? void 0 : _a[name];
}
/**
 * Checks whether an element has an attribute.
 *
 * @category Traversal
 * @param elem Element to check.
 * @param name Attribute name to look for.
 * @returns Returns whether `elem` has the attribute `name`.
 */ function hasAttrib(elem, name) {
    return elem.attribs != null && Object.prototype.hasOwnProperty.call(elem.attribs, name) && elem.attribs[name] != null;
}
/**
 * Get the tag name of an element.
 *
 * @category Traversal
 * @param elem The element to get the name for.
 * @returns The tag name of `elem`.
 */ function getName(elem) {
    return elem.name;
}
/**
 * Returns the next element sibling of a node.
 *
 * @category Traversal
 * @param elem The element to get the next sibling of.
 * @returns `elem`'s next sibling that is a tag, or `null` if there is no next
 * sibling.
 */ function nextElementSibling(elem) {
    var _a;
    var next = elem.next;
    while(next !== null && !(0, domhandler_1.isTag)(next))_a = next, next = _a.next;
    return next;
}
/**
 * Returns the previous element sibling of a node.
 *
 * @category Traversal
 * @param elem The element to get the previous sibling of.
 * @returns `elem`'s previous sibling that is a tag, or `null` if there is no
 * previous sibling.
 */ function prevElementSibling(elem) {
    var _a;
    var prev = elem.prev;
    while(prev !== null && !(0, domhandler_1.isTag)(prev))_a = prev, prev = _a.prev;
    return prev;
} //# sourceMappingURL=traversal.js.map
}),
"[project]/Autonomous-Claims-Orchestrator/node_modules/domutils/lib/manipulation.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.removeElement = removeElement;
exports.replaceElement = replaceElement;
exports.appendChild = appendChild;
exports.append = append;
exports.prependChild = prependChild;
exports.prepend = prepend;
/**
 * Remove an element from the dom
 *
 * @category Manipulation
 * @param elem The element to be removed
 */ function removeElement(elem) {
    if (elem.prev) elem.prev.next = elem.next;
    if (elem.next) elem.next.prev = elem.prev;
    if (elem.parent) {
        var childs = elem.parent.children;
        var childsIndex = childs.lastIndexOf(elem);
        if (childsIndex >= 0) {
            childs.splice(childsIndex, 1);
        }
    }
    elem.next = null;
    elem.prev = null;
    elem.parent = null;
}
/**
 * Replace an element in the dom
 *
 * @category Manipulation
 * @param elem The element to be replaced
 * @param replacement The element to be added
 */ function replaceElement(elem, replacement) {
    var prev = replacement.prev = elem.prev;
    if (prev) {
        prev.next = replacement;
    }
    var next = replacement.next = elem.next;
    if (next) {
        next.prev = replacement;
    }
    var parent = replacement.parent = elem.parent;
    if (parent) {
        var childs = parent.children;
        childs[childs.lastIndexOf(elem)] = replacement;
        elem.parent = null;
    }
}
/**
 * Append a child to an element.
 *
 * @category Manipulation
 * @param parent The element to append to.
 * @param child The element to be added as a child.
 */ function appendChild(parent, child) {
    removeElement(child);
    child.next = null;
    child.parent = parent;
    if (parent.children.push(child) > 1) {
        var sibling = parent.children[parent.children.length - 2];
        sibling.next = child;
        child.prev = sibling;
    } else {
        child.prev = null;
    }
}
/**
 * Append an element after another.
 *
 * @category Manipulation
 * @param elem The element to append after.
 * @param next The element be added.
 */ function append(elem, next) {
    removeElement(next);
    var parent = elem.parent;
    var currNext = elem.next;
    next.next = currNext;
    next.prev = elem;
    elem.next = next;
    next.parent = parent;
    if (currNext) {
        currNext.prev = next;
        if (parent) {
            var childs = parent.children;
            childs.splice(childs.lastIndexOf(currNext), 0, next);
        }
    } else if (parent) {
        parent.children.push(next);
    }
}
/**
 * Prepend a child to an element.
 *
 * @category Manipulation
 * @param parent The element to prepend before.
 * @param child The element to be added as a child.
 */ function prependChild(parent, child) {
    removeElement(child);
    child.parent = parent;
    child.prev = null;
    if (parent.children.unshift(child) !== 1) {
        var sibling = parent.children[1];
        sibling.prev = child;
        child.next = sibling;
    } else {
        child.next = null;
    }
}
/**
 * Prepend an element before another.
 *
 * @category Manipulation
 * @param elem The element to prepend before.
 * @param prev The element be added.
 */ function prepend(elem, prev) {
    removeElement(prev);
    var parent = elem.parent;
    if (parent) {
        var childs = parent.children;
        childs.splice(childs.indexOf(elem), 0, prev);
    }
    if (elem.prev) {
        elem.prev.next = prev;
    }
    prev.parent = parent;
    prev.prev = elem.prev;
    prev.next = elem;
    elem.prev = prev;
} //# sourceMappingURL=manipulation.js.map
}),
"[project]/Autonomous-Claims-Orchestrator/node_modules/domutils/lib/querying.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.filter = filter;
exports.find = find;
exports.findOneChild = findOneChild;
exports.findOne = findOne;
exports.existsOne = existsOne;
exports.findAll = findAll;
var domhandler_1 = __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/domhandler/lib/index.js [app-route] (ecmascript)");
/**
 * Search a node and its children for nodes passing a test function. If `node` is not an array, it will be wrapped in one.
 *
 * @category Querying
 * @param test Function to test nodes on.
 * @param node Node to search. Will be included in the result set if it matches.
 * @param recurse Also consider child nodes.
 * @param limit Maximum number of nodes to return.
 * @returns All nodes passing `test`.
 */ function filter(test, node, recurse, limit) {
    if (recurse === void 0) {
        recurse = true;
    }
    if (limit === void 0) {
        limit = Infinity;
    }
    return find(test, Array.isArray(node) ? node : [
        node
    ], recurse, limit);
}
/**
 * Search an array of nodes and their children for nodes passing a test function.
 *
 * @category Querying
 * @param test Function to test nodes on.
 * @param nodes Array of nodes to search.
 * @param recurse Also consider child nodes.
 * @param limit Maximum number of nodes to return.
 * @returns All nodes passing `test`.
 */ function find(test, nodes, recurse, limit) {
    var result = [];
    /** Stack of the arrays we are looking at. */ var nodeStack = [
        Array.isArray(nodes) ? nodes : [
            nodes
        ]
    ];
    /** Stack of the indices within the arrays. */ var indexStack = [
        0
    ];
    for(;;){
        // First, check if the current array has any more elements to look at.
        if (indexStack[0] >= nodeStack[0].length) {
            // If we have no more arrays to look at, we are done.
            if (indexStack.length === 1) {
                return result;
            }
            // Otherwise, remove the current array from the stack.
            nodeStack.shift();
            indexStack.shift();
            continue;
        }
        var elem = nodeStack[0][indexStack[0]++];
        if (test(elem)) {
            result.push(elem);
            if (--limit <= 0) return result;
        }
        if (recurse && (0, domhandler_1.hasChildren)(elem) && elem.children.length > 0) {
            /*
             * Add the children to the stack. We are depth-first, so this is
             * the next array we look at.
             */ indexStack.unshift(0);
            nodeStack.unshift(elem.children);
        }
    }
}
/**
 * Finds the first element inside of an array that matches a test function. This is an alias for `Array.prototype.find`.
 *
 * @category Querying
 * @param test Function to test nodes on.
 * @param nodes Array of nodes to search.
 * @returns The first node in the array that passes `test`.
 * @deprecated Use `Array.prototype.find` directly.
 */ function findOneChild(test, nodes) {
    return nodes.find(test);
}
/**
 * Finds one element in a tree that passes a test.
 *
 * @category Querying
 * @param test Function to test nodes on.
 * @param nodes Node or array of nodes to search.
 * @param recurse Also consider child nodes.
 * @returns The first node that passes `test`.
 */ function findOne(test, nodes, recurse) {
    if (recurse === void 0) {
        recurse = true;
    }
    var searchedNodes = Array.isArray(nodes) ? nodes : [
        nodes
    ];
    for(var i = 0; i < searchedNodes.length; i++){
        var node = searchedNodes[i];
        if ((0, domhandler_1.isTag)(node) && test(node)) {
            return node;
        }
        if (recurse && (0, domhandler_1.hasChildren)(node) && node.children.length > 0) {
            var found = findOne(test, node.children, true);
            if (found) return found;
        }
    }
    return null;
}
/**
 * Checks if a tree of nodes contains at least one node passing a test.
 *
 * @category Querying
 * @param test Function to test nodes on.
 * @param nodes Array of nodes to search.
 * @returns Whether a tree of nodes contains at least one node passing the test.
 */ function existsOne(test, nodes) {
    return (Array.isArray(nodes) ? nodes : [
        nodes
    ]).some(function(node) {
        return (0, domhandler_1.isTag)(node) && test(node) || (0, domhandler_1.hasChildren)(node) && existsOne(test, node.children);
    });
}
/**
 * Search an array of nodes and their children for elements passing a test function.
 *
 * Same as `find`, but limited to elements and with less options, leading to reduced complexity.
 *
 * @category Querying
 * @param test Function to test nodes on.
 * @param nodes Array of nodes to search.
 * @returns All nodes passing `test`.
 */ function findAll(test, nodes) {
    var result = [];
    var nodeStack = [
        Array.isArray(nodes) ? nodes : [
            nodes
        ]
    ];
    var indexStack = [
        0
    ];
    for(;;){
        if (indexStack[0] >= nodeStack[0].length) {
            if (nodeStack.length === 1) {
                return result;
            }
            // Otherwise, remove the current array from the stack.
            nodeStack.shift();
            indexStack.shift();
            continue;
        }
        var elem = nodeStack[0][indexStack[0]++];
        if ((0, domhandler_1.isTag)(elem) && test(elem)) result.push(elem);
        if ((0, domhandler_1.hasChildren)(elem) && elem.children.length > 0) {
            indexStack.unshift(0);
            nodeStack.unshift(elem.children);
        }
    }
} //# sourceMappingURL=querying.js.map
}),
"[project]/Autonomous-Claims-Orchestrator/node_modules/domutils/lib/legacy.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.testElement = testElement;
exports.getElements = getElements;
exports.getElementById = getElementById;
exports.getElementsByTagName = getElementsByTagName;
exports.getElementsByClassName = getElementsByClassName;
exports.getElementsByTagType = getElementsByTagType;
var domhandler_1 = __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/domhandler/lib/index.js [app-route] (ecmascript)");
var querying_js_1 = __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/domutils/lib/querying.js [app-route] (ecmascript)");
/**
 * A map of functions to check nodes against.
 */ var Checks = {
    tag_name: function(name) {
        if (typeof name === "function") {
            return function(elem) {
                return (0, domhandler_1.isTag)(elem) && name(elem.name);
            };
        } else if (name === "*") {
            return domhandler_1.isTag;
        }
        return function(elem) {
            return (0, domhandler_1.isTag)(elem) && elem.name === name;
        };
    },
    tag_type: function(type) {
        if (typeof type === "function") {
            return function(elem) {
                return type(elem.type);
            };
        }
        return function(elem) {
            return elem.type === type;
        };
    },
    tag_contains: function(data) {
        if (typeof data === "function") {
            return function(elem) {
                return (0, domhandler_1.isText)(elem) && data(elem.data);
            };
        }
        return function(elem) {
            return (0, domhandler_1.isText)(elem) && elem.data === data;
        };
    }
};
/**
 * Returns a function to check whether a node has an attribute with a particular
 * value.
 *
 * @param attrib Attribute to check.
 * @param value Attribute value to look for.
 * @returns A function to check whether the a node has an attribute with a
 *   particular value.
 */ function getAttribCheck(attrib, value) {
    if (typeof value === "function") {
        return function(elem) {
            return (0, domhandler_1.isTag)(elem) && value(elem.attribs[attrib]);
        };
    }
    return function(elem) {
        return (0, domhandler_1.isTag)(elem) && elem.attribs[attrib] === value;
    };
}
/**
 * Returns a function that returns `true` if either of the input functions
 * returns `true` for a node.
 *
 * @param a First function to combine.
 * @param b Second function to combine.
 * @returns A function taking a node and returning `true` if either of the input
 *   functions returns `true` for the node.
 */ function combineFuncs(a, b) {
    return function(elem) {
        return a(elem) || b(elem);
    };
}
/**
 * Returns a function that executes all checks in `options` and returns `true`
 * if any of them match a node.
 *
 * @param options An object describing nodes to look for.
 * @returns A function that executes all checks in `options` and returns `true`
 *   if any of them match a node.
 */ function compileTest(options) {
    var funcs = Object.keys(options).map(function(key) {
        var value = options[key];
        return Object.prototype.hasOwnProperty.call(Checks, key) ? Checks[key](value) : getAttribCheck(key, value);
    });
    return funcs.length === 0 ? null : funcs.reduce(combineFuncs);
}
/**
 * Checks whether a node matches the description in `options`.
 *
 * @category Legacy Query Functions
 * @param options An object describing nodes to look for.
 * @param node The element to test.
 * @returns Whether the element matches the description in `options`.
 */ function testElement(options, node) {
    var test = compileTest(options);
    return test ? test(node) : true;
}
/**
 * Returns all nodes that match `options`.
 *
 * @category Legacy Query Functions
 * @param options An object describing nodes to look for.
 * @param nodes Nodes to search through.
 * @param recurse Also consider child nodes.
 * @param limit Maximum number of nodes to return.
 * @returns All nodes that match `options`.
 */ function getElements(options, nodes, recurse, limit) {
    if (limit === void 0) {
        limit = Infinity;
    }
    var test = compileTest(options);
    return test ? (0, querying_js_1.filter)(test, nodes, recurse, limit) : [];
}
/**
 * Returns the node with the supplied ID.
 *
 * @category Legacy Query Functions
 * @param id The unique ID attribute value to look for.
 * @param nodes Nodes to search through.
 * @param recurse Also consider child nodes.
 * @returns The node with the supplied ID.
 */ function getElementById(id, nodes, recurse) {
    if (recurse === void 0) {
        recurse = true;
    }
    if (!Array.isArray(nodes)) nodes = [
        nodes
    ];
    return (0, querying_js_1.findOne)(getAttribCheck("id", id), nodes, recurse);
}
/**
 * Returns all nodes with the supplied `tagName`.
 *
 * @category Legacy Query Functions
 * @param tagName Tag name to search for.
 * @param nodes Nodes to search through.
 * @param recurse Also consider child nodes.
 * @param limit Maximum number of nodes to return.
 * @returns All nodes with the supplied `tagName`.
 */ function getElementsByTagName(tagName, nodes, recurse, limit) {
    if (recurse === void 0) {
        recurse = true;
    }
    if (limit === void 0) {
        limit = Infinity;
    }
    return (0, querying_js_1.filter)(Checks["tag_name"](tagName), nodes, recurse, limit);
}
/**
 * Returns all nodes with the supplied `className`.
 *
 * @category Legacy Query Functions
 * @param className Class name to search for.
 * @param nodes Nodes to search through.
 * @param recurse Also consider child nodes.
 * @param limit Maximum number of nodes to return.
 * @returns All nodes with the supplied `className`.
 */ function getElementsByClassName(className, nodes, recurse, limit) {
    if (recurse === void 0) {
        recurse = true;
    }
    if (limit === void 0) {
        limit = Infinity;
    }
    return (0, querying_js_1.filter)(getAttribCheck("class", className), nodes, recurse, limit);
}
/**
 * Returns all nodes with the supplied `type`.
 *
 * @category Legacy Query Functions
 * @param type Element type to look for.
 * @param nodes Nodes to search through.
 * @param recurse Also consider child nodes.
 * @param limit Maximum number of nodes to return.
 * @returns All nodes with the supplied `type`.
 */ function getElementsByTagType(type, nodes, recurse, limit) {
    if (recurse === void 0) {
        recurse = true;
    }
    if (limit === void 0) {
        limit = Infinity;
    }
    return (0, querying_js_1.filter)(Checks["tag_type"](type), nodes, recurse, limit);
} //# sourceMappingURL=legacy.js.map
}),
"[project]/Autonomous-Claims-Orchestrator/node_modules/domutils/lib/helpers.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.DocumentPosition = void 0;
exports.removeSubsets = removeSubsets;
exports.compareDocumentPosition = compareDocumentPosition;
exports.uniqueSort = uniqueSort;
var domhandler_1 = __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/domhandler/lib/index.js [app-route] (ecmascript)");
/**
 * Given an array of nodes, remove any member that is contained by another
 * member.
 *
 * @category Helpers
 * @param nodes Nodes to filter.
 * @returns Remaining nodes that aren't contained by other nodes.
 */ function removeSubsets(nodes) {
    var idx = nodes.length;
    /*
     * Check if each node (or one of its ancestors) is already contained in the
     * array.
     */ while(--idx >= 0){
        var node = nodes[idx];
        /*
         * Remove the node if it is not unique.
         * We are going through the array from the end, so we only
         * have to check nodes that preceed the node under consideration in the array.
         */ if (idx > 0 && nodes.lastIndexOf(node, idx - 1) >= 0) {
            nodes.splice(idx, 1);
            continue;
        }
        for(var ancestor = node.parent; ancestor; ancestor = ancestor.parent){
            if (nodes.includes(ancestor)) {
                nodes.splice(idx, 1);
                break;
            }
        }
    }
    return nodes;
}
/**
 * @category Helpers
 * @see {@link http://dom.spec.whatwg.org/#dom-node-comparedocumentposition}
 */ var DocumentPosition;
(function(DocumentPosition) {
    DocumentPosition[DocumentPosition["DISCONNECTED"] = 1] = "DISCONNECTED";
    DocumentPosition[DocumentPosition["PRECEDING"] = 2] = "PRECEDING";
    DocumentPosition[DocumentPosition["FOLLOWING"] = 4] = "FOLLOWING";
    DocumentPosition[DocumentPosition["CONTAINS"] = 8] = "CONTAINS";
    DocumentPosition[DocumentPosition["CONTAINED_BY"] = 16] = "CONTAINED_BY";
})(DocumentPosition || (exports.DocumentPosition = DocumentPosition = {}));
/**
 * Compare the position of one node against another node in any other document,
 * returning a bitmask with the values from {@link DocumentPosition}.
 *
 * Document order:
 * > There is an ordering, document order, defined on all the nodes in the
 * > document corresponding to the order in which the first character of the
 * > XML representation of each node occurs in the XML representation of the
 * > document after expansion of general entities. Thus, the document element
 * > node will be the first node. Element nodes occur before their children.
 * > Thus, document order orders element nodes in order of the occurrence of
 * > their start-tag in the XML (after expansion of entities). The attribute
 * > nodes of an element occur after the element and before its children. The
 * > relative order of attribute nodes is implementation-dependent.
 *
 * Source:
 * http://www.w3.org/TR/DOM-Level-3-Core/glossary.html#dt-document-order
 *
 * @category Helpers
 * @param nodeA The first node to use in the comparison
 * @param nodeB The second node to use in the comparison
 * @returns A bitmask describing the input nodes' relative position.
 *
 * See http://dom.spec.whatwg.org/#dom-node-comparedocumentposition for
 * a description of these values.
 */ function compareDocumentPosition(nodeA, nodeB) {
    var aParents = [];
    var bParents = [];
    if (nodeA === nodeB) {
        return 0;
    }
    var current = (0, domhandler_1.hasChildren)(nodeA) ? nodeA : nodeA.parent;
    while(current){
        aParents.unshift(current);
        current = current.parent;
    }
    current = (0, domhandler_1.hasChildren)(nodeB) ? nodeB : nodeB.parent;
    while(current){
        bParents.unshift(current);
        current = current.parent;
    }
    var maxIdx = Math.min(aParents.length, bParents.length);
    var idx = 0;
    while(idx < maxIdx && aParents[idx] === bParents[idx]){
        idx++;
    }
    if (idx === 0) {
        return DocumentPosition.DISCONNECTED;
    }
    var sharedParent = aParents[idx - 1];
    var siblings = sharedParent.children;
    var aSibling = aParents[idx];
    var bSibling = bParents[idx];
    if (siblings.indexOf(aSibling) > siblings.indexOf(bSibling)) {
        if (sharedParent === nodeB) {
            return DocumentPosition.FOLLOWING | DocumentPosition.CONTAINED_BY;
        }
        return DocumentPosition.FOLLOWING;
    }
    if (sharedParent === nodeA) {
        return DocumentPosition.PRECEDING | DocumentPosition.CONTAINS;
    }
    return DocumentPosition.PRECEDING;
}
/**
 * Sort an array of nodes based on their relative position in the document,
 * removing any duplicate nodes. If the array contains nodes that do not belong
 * to the same document, sort order is unspecified.
 *
 * @category Helpers
 * @param nodes Array of DOM nodes.
 * @returns Collection of unique nodes, sorted in document order.
 */ function uniqueSort(nodes) {
    nodes = nodes.filter(function(node, i, arr) {
        return !arr.includes(node, i + 1);
    });
    nodes.sort(function(a, b) {
        var relative = compareDocumentPosition(a, b);
        if (relative & DocumentPosition.PRECEDING) {
            return -1;
        } else if (relative & DocumentPosition.FOLLOWING) {
            return 1;
        }
        return 0;
    });
    return nodes;
} //# sourceMappingURL=helpers.js.map
}),
"[project]/Autonomous-Claims-Orchestrator/node_modules/domutils/lib/feeds.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getFeed = getFeed;
var stringify_js_1 = __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/domutils/lib/stringify.js [app-route] (ecmascript)");
var legacy_js_1 = __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/domutils/lib/legacy.js [app-route] (ecmascript)");
/**
 * Get the feed object from the root of a DOM tree.
 *
 * @category Feeds
 * @param doc - The DOM to to extract the feed from.
 * @returns The feed.
 */ function getFeed(doc) {
    var feedRoot = getOneElement(isValidFeed, doc);
    return !feedRoot ? null : feedRoot.name === "feed" ? getAtomFeed(feedRoot) : getRssFeed(feedRoot);
}
/**
 * Parse an Atom feed.
 *
 * @param feedRoot The root of the feed.
 * @returns The parsed feed.
 */ function getAtomFeed(feedRoot) {
    var _a;
    var childs = feedRoot.children;
    var feed = {
        type: "atom",
        items: (0, legacy_js_1.getElementsByTagName)("entry", childs).map(function(item) {
            var _a;
            var children = item.children;
            var entry = {
                media: getMediaElements(children)
            };
            addConditionally(entry, "id", "id", children);
            addConditionally(entry, "title", "title", children);
            var href = (_a = getOneElement("link", children)) === null || _a === void 0 ? void 0 : _a.attribs["href"];
            if (href) {
                entry.link = href;
            }
            var description = fetch("summary", children) || fetch("content", children);
            if (description) {
                entry.description = description;
            }
            var pubDate = fetch("updated", children);
            if (pubDate) {
                entry.pubDate = new Date(pubDate);
            }
            return entry;
        })
    };
    addConditionally(feed, "id", "id", childs);
    addConditionally(feed, "title", "title", childs);
    var href = (_a = getOneElement("link", childs)) === null || _a === void 0 ? void 0 : _a.attribs["href"];
    if (href) {
        feed.link = href;
    }
    addConditionally(feed, "description", "subtitle", childs);
    var updated = fetch("updated", childs);
    if (updated) {
        feed.updated = new Date(updated);
    }
    addConditionally(feed, "author", "email", childs, true);
    return feed;
}
/**
 * Parse a RSS feed.
 *
 * @param feedRoot The root of the feed.
 * @returns The parsed feed.
 */ function getRssFeed(feedRoot) {
    var _a, _b;
    var childs = (_b = (_a = getOneElement("channel", feedRoot.children)) === null || _a === void 0 ? void 0 : _a.children) !== null && _b !== void 0 ? _b : [];
    var feed = {
        type: feedRoot.name.substr(0, 3),
        id: "",
        items: (0, legacy_js_1.getElementsByTagName)("item", feedRoot.children).map(function(item) {
            var children = item.children;
            var entry = {
                media: getMediaElements(children)
            };
            addConditionally(entry, "id", "guid", children);
            addConditionally(entry, "title", "title", children);
            addConditionally(entry, "link", "link", children);
            addConditionally(entry, "description", "description", children);
            var pubDate = fetch("pubDate", children) || fetch("dc:date", children);
            if (pubDate) entry.pubDate = new Date(pubDate);
            return entry;
        })
    };
    addConditionally(feed, "title", "title", childs);
    addConditionally(feed, "link", "link", childs);
    addConditionally(feed, "description", "description", childs);
    var updated = fetch("lastBuildDate", childs);
    if (updated) {
        feed.updated = new Date(updated);
    }
    addConditionally(feed, "author", "managingEditor", childs, true);
    return feed;
}
var MEDIA_KEYS_STRING = [
    "url",
    "type",
    "lang"
];
var MEDIA_KEYS_INT = [
    "fileSize",
    "bitrate",
    "framerate",
    "samplingrate",
    "channels",
    "duration",
    "height",
    "width"
];
/**
 * Get all media elements of a feed item.
 *
 * @param where Nodes to search in.
 * @returns Media elements.
 */ function getMediaElements(where) {
    return (0, legacy_js_1.getElementsByTagName)("media:content", where).map(function(elem) {
        var attribs = elem.attribs;
        var media = {
            medium: attribs["medium"],
            isDefault: !!attribs["isDefault"]
        };
        for(var _i = 0, MEDIA_KEYS_STRING_1 = MEDIA_KEYS_STRING; _i < MEDIA_KEYS_STRING_1.length; _i++){
            var attrib = MEDIA_KEYS_STRING_1[_i];
            if (attribs[attrib]) {
                media[attrib] = attribs[attrib];
            }
        }
        for(var _a = 0, MEDIA_KEYS_INT_1 = MEDIA_KEYS_INT; _a < MEDIA_KEYS_INT_1.length; _a++){
            var attrib = MEDIA_KEYS_INT_1[_a];
            if (attribs[attrib]) {
                media[attrib] = parseInt(attribs[attrib], 10);
            }
        }
        if (attribs["expression"]) {
            media.expression = attribs["expression"];
        }
        return media;
    });
}
/**
 * Get one element by tag name.
 *
 * @param tagName Tag name to look for
 * @param node Node to search in
 * @returns The element or null
 */ function getOneElement(tagName, node) {
    return (0, legacy_js_1.getElementsByTagName)(tagName, node, true, 1)[0];
}
/**
 * Get the text content of an element with a certain tag name.
 *
 * @param tagName Tag name to look for.
 * @param where Node to search in.
 * @param recurse Whether to recurse into child nodes.
 * @returns The text content of the element.
 */ function fetch(tagName, where, recurse) {
    if (recurse === void 0) {
        recurse = false;
    }
    return (0, stringify_js_1.textContent)((0, legacy_js_1.getElementsByTagName)(tagName, where, recurse, 1)).trim();
}
/**
 * Adds a property to an object if it has a value.
 *
 * @param obj Object to be extended
 * @param prop Property name
 * @param tagName Tag name that contains the conditionally added property
 * @param where Element to search for the property
 * @param recurse Whether to recurse into child nodes.
 */ function addConditionally(obj, prop, tagName, where, recurse) {
    if (recurse === void 0) {
        recurse = false;
    }
    var val = fetch(tagName, where, recurse);
    if (val) obj[prop] = val;
}
/**
 * Checks if an element is a feed root node.
 *
 * @param value The name of the element to check.
 * @returns Whether an element is a feed root node.
 */ function isValidFeed(value) {
    return value === "rss" || value === "feed" || value === "rdf:RDF";
} //# sourceMappingURL=feeds.js.map
}),
"[project]/Autonomous-Claims-Orchestrator/node_modules/domutils/lib/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __createBinding = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__createBinding || (Object.create ? function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = {
            enumerable: true,
            get: function() {
                return m[k];
            }
        };
    }
    Object.defineProperty(o, k2, desc);
} : function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
});
var __exportStar = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__exportStar || function(m, exports1) {
    for(var p in m)if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports1, p)) __createBinding(exports1, m, p);
};
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.hasChildren = exports.isDocument = exports.isComment = exports.isText = exports.isCDATA = exports.isTag = void 0;
__exportStar(__turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/domutils/lib/stringify.js [app-route] (ecmascript)"), exports);
__exportStar(__turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/domutils/lib/traversal.js [app-route] (ecmascript)"), exports);
__exportStar(__turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/domutils/lib/manipulation.js [app-route] (ecmascript)"), exports);
__exportStar(__turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/domutils/lib/querying.js [app-route] (ecmascript)"), exports);
__exportStar(__turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/domutils/lib/legacy.js [app-route] (ecmascript)"), exports);
__exportStar(__turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/domutils/lib/helpers.js [app-route] (ecmascript)"), exports);
__exportStar(__turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/domutils/lib/feeds.js [app-route] (ecmascript)"), exports);
/** @deprecated Use these methods from `domhandler` directly. */ var domhandler_1 = __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/domhandler/lib/index.js [app-route] (ecmascript)");
Object.defineProperty(exports, "isTag", {
    enumerable: true,
    get: function() {
        return domhandler_1.isTag;
    }
});
Object.defineProperty(exports, "isCDATA", {
    enumerable: true,
    get: function() {
        return domhandler_1.isCDATA;
    }
});
Object.defineProperty(exports, "isText", {
    enumerable: true,
    get: function() {
        return domhandler_1.isText;
    }
});
Object.defineProperty(exports, "isComment", {
    enumerable: true,
    get: function() {
        return domhandler_1.isComment;
    }
});
Object.defineProperty(exports, "isDocument", {
    enumerable: true,
    get: function() {
        return domhandler_1.isDocument;
    }
});
Object.defineProperty(exports, "hasChildren", {
    enumerable: true,
    get: function() {
        return domhandler_1.hasChildren;
    }
}); //# sourceMappingURL=index.js.map
}),
"[project]/Autonomous-Claims-Orchestrator/node_modules/htmlparser2/lib/Tokenizer.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.QuoteType = void 0;
var decode_js_1 = __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/entities/lib/decode.js [app-route] (ecmascript)");
var CharCodes;
(function(CharCodes) {
    CharCodes[CharCodes["Tab"] = 9] = "Tab";
    CharCodes[CharCodes["NewLine"] = 10] = "NewLine";
    CharCodes[CharCodes["FormFeed"] = 12] = "FormFeed";
    CharCodes[CharCodes["CarriageReturn"] = 13] = "CarriageReturn";
    CharCodes[CharCodes["Space"] = 32] = "Space";
    CharCodes[CharCodes["ExclamationMark"] = 33] = "ExclamationMark";
    CharCodes[CharCodes["Number"] = 35] = "Number";
    CharCodes[CharCodes["Amp"] = 38] = "Amp";
    CharCodes[CharCodes["SingleQuote"] = 39] = "SingleQuote";
    CharCodes[CharCodes["DoubleQuote"] = 34] = "DoubleQuote";
    CharCodes[CharCodes["Dash"] = 45] = "Dash";
    CharCodes[CharCodes["Slash"] = 47] = "Slash";
    CharCodes[CharCodes["Zero"] = 48] = "Zero";
    CharCodes[CharCodes["Nine"] = 57] = "Nine";
    CharCodes[CharCodes["Semi"] = 59] = "Semi";
    CharCodes[CharCodes["Lt"] = 60] = "Lt";
    CharCodes[CharCodes["Eq"] = 61] = "Eq";
    CharCodes[CharCodes["Gt"] = 62] = "Gt";
    CharCodes[CharCodes["Questionmark"] = 63] = "Questionmark";
    CharCodes[CharCodes["UpperA"] = 65] = "UpperA";
    CharCodes[CharCodes["LowerA"] = 97] = "LowerA";
    CharCodes[CharCodes["UpperF"] = 70] = "UpperF";
    CharCodes[CharCodes["LowerF"] = 102] = "LowerF";
    CharCodes[CharCodes["UpperZ"] = 90] = "UpperZ";
    CharCodes[CharCodes["LowerZ"] = 122] = "LowerZ";
    CharCodes[CharCodes["LowerX"] = 120] = "LowerX";
    CharCodes[CharCodes["OpeningSquareBracket"] = 91] = "OpeningSquareBracket";
})(CharCodes || (CharCodes = {}));
/** All the states the tokenizer can be in. */ var State;
(function(State) {
    State[State["Text"] = 1] = "Text";
    State[State["BeforeTagName"] = 2] = "BeforeTagName";
    State[State["InTagName"] = 3] = "InTagName";
    State[State["InSelfClosingTag"] = 4] = "InSelfClosingTag";
    State[State["BeforeClosingTagName"] = 5] = "BeforeClosingTagName";
    State[State["InClosingTagName"] = 6] = "InClosingTagName";
    State[State["AfterClosingTagName"] = 7] = "AfterClosingTagName";
    // Attributes
    State[State["BeforeAttributeName"] = 8] = "BeforeAttributeName";
    State[State["InAttributeName"] = 9] = "InAttributeName";
    State[State["AfterAttributeName"] = 10] = "AfterAttributeName";
    State[State["BeforeAttributeValue"] = 11] = "BeforeAttributeValue";
    State[State["InAttributeValueDq"] = 12] = "InAttributeValueDq";
    State[State["InAttributeValueSq"] = 13] = "InAttributeValueSq";
    State[State["InAttributeValueNq"] = 14] = "InAttributeValueNq";
    // Declarations
    State[State["BeforeDeclaration"] = 15] = "BeforeDeclaration";
    State[State["InDeclaration"] = 16] = "InDeclaration";
    // Processing instructions
    State[State["InProcessingInstruction"] = 17] = "InProcessingInstruction";
    // Comments & CDATA
    State[State["BeforeComment"] = 18] = "BeforeComment";
    State[State["CDATASequence"] = 19] = "CDATASequence";
    State[State["InSpecialComment"] = 20] = "InSpecialComment";
    State[State["InCommentLike"] = 21] = "InCommentLike";
    // Special tags
    State[State["BeforeSpecialS"] = 22] = "BeforeSpecialS";
    State[State["SpecialStartSequence"] = 23] = "SpecialStartSequence";
    State[State["InSpecialTag"] = 24] = "InSpecialTag";
    State[State["BeforeEntity"] = 25] = "BeforeEntity";
    State[State["BeforeNumericEntity"] = 26] = "BeforeNumericEntity";
    State[State["InNamedEntity"] = 27] = "InNamedEntity";
    State[State["InNumericEntity"] = 28] = "InNumericEntity";
    State[State["InHexEntity"] = 29] = "InHexEntity";
})(State || (State = {}));
function isWhitespace(c) {
    return c === CharCodes.Space || c === CharCodes.NewLine || c === CharCodes.Tab || c === CharCodes.FormFeed || c === CharCodes.CarriageReturn;
}
function isEndOfTagSection(c) {
    return c === CharCodes.Slash || c === CharCodes.Gt || isWhitespace(c);
}
function isNumber(c) {
    return c >= CharCodes.Zero && c <= CharCodes.Nine;
}
function isASCIIAlpha(c) {
    return c >= CharCodes.LowerA && c <= CharCodes.LowerZ || c >= CharCodes.UpperA && c <= CharCodes.UpperZ;
}
function isHexDigit(c) {
    return c >= CharCodes.UpperA && c <= CharCodes.UpperF || c >= CharCodes.LowerA && c <= CharCodes.LowerF;
}
var QuoteType;
(function(QuoteType) {
    QuoteType[QuoteType["NoValue"] = 0] = "NoValue";
    QuoteType[QuoteType["Unquoted"] = 1] = "Unquoted";
    QuoteType[QuoteType["Single"] = 2] = "Single";
    QuoteType[QuoteType["Double"] = 3] = "Double";
})(QuoteType = exports.QuoteType || (exports.QuoteType = {}));
/**
 * Sequences used to match longer strings.
 *
 * We don't have `Script`, `Style`, or `Title` here. Instead, we re-use the *End
 * sequences with an increased offset.
 */ var Sequences = {
    Cdata: new Uint8Array([
        0x43,
        0x44,
        0x41,
        0x54,
        0x41,
        0x5b
    ]),
    CdataEnd: new Uint8Array([
        0x5d,
        0x5d,
        0x3e
    ]),
    CommentEnd: new Uint8Array([
        0x2d,
        0x2d,
        0x3e
    ]),
    ScriptEnd: new Uint8Array([
        0x3c,
        0x2f,
        0x73,
        0x63,
        0x72,
        0x69,
        0x70,
        0x74
    ]),
    StyleEnd: new Uint8Array([
        0x3c,
        0x2f,
        0x73,
        0x74,
        0x79,
        0x6c,
        0x65
    ]),
    TitleEnd: new Uint8Array([
        0x3c,
        0x2f,
        0x74,
        0x69,
        0x74,
        0x6c,
        0x65
    ])
};
var Tokenizer = function() {
    function Tokenizer(_a, cbs) {
        var _b = _a.xmlMode, xmlMode = _b === void 0 ? false : _b, _c = _a.decodeEntities, decodeEntities = _c === void 0 ? true : _c;
        this.cbs = cbs;
        /** The current state the tokenizer is in. */ this.state = State.Text;
        /** The read buffer. */ this.buffer = "";
        /** The beginning of the section that is currently being read. */ this.sectionStart = 0;
        /** The index within the buffer that we are currently looking at. */ this.index = 0;
        /** Some behavior, eg. when decoding entities, is done while we are in another state. This keeps track of the other state type. */ this.baseState = State.Text;
        /** For special parsing behavior inside of script and style tags. */ this.isSpecial = false;
        /** Indicates whether the tokenizer has been paused. */ this.running = true;
        /** The offset of the current buffer. */ this.offset = 0;
        this.currentSequence = undefined;
        this.sequenceIndex = 0;
        this.trieIndex = 0;
        this.trieCurrent = 0;
        /** For named entities, the index of the value. For numeric entities, the code point. */ this.entityResult = 0;
        this.entityExcess = 0;
        this.xmlMode = xmlMode;
        this.decodeEntities = decodeEntities;
        this.entityTrie = xmlMode ? decode_js_1.xmlDecodeTree : decode_js_1.htmlDecodeTree;
    }
    Tokenizer.prototype.reset = function() {
        this.state = State.Text;
        this.buffer = "";
        this.sectionStart = 0;
        this.index = 0;
        this.baseState = State.Text;
        this.currentSequence = undefined;
        this.running = true;
        this.offset = 0;
    };
    Tokenizer.prototype.write = function(chunk) {
        this.offset += this.buffer.length;
        this.buffer = chunk;
        this.parse();
    };
    Tokenizer.prototype.end = function() {
        if (this.running) this.finish();
    };
    Tokenizer.prototype.pause = function() {
        this.running = false;
    };
    Tokenizer.prototype.resume = function() {
        this.running = true;
        if (this.index < this.buffer.length + this.offset) {
            this.parse();
        }
    };
    /**
     * The current index within all of the written data.
     */ Tokenizer.prototype.getIndex = function() {
        return this.index;
    };
    /**
     * The start of the current section.
     */ Tokenizer.prototype.getSectionStart = function() {
        return this.sectionStart;
    };
    Tokenizer.prototype.stateText = function(c) {
        if (c === CharCodes.Lt || !this.decodeEntities && this.fastForwardTo(CharCodes.Lt)) {
            if (this.index > this.sectionStart) {
                this.cbs.ontext(this.sectionStart, this.index);
            }
            this.state = State.BeforeTagName;
            this.sectionStart = this.index;
        } else if (this.decodeEntities && c === CharCodes.Amp) {
            this.state = State.BeforeEntity;
        }
    };
    Tokenizer.prototype.stateSpecialStartSequence = function(c) {
        var isEnd = this.sequenceIndex === this.currentSequence.length;
        var isMatch = isEnd ? isEndOfTagSection(c) : (c | 0x20) === this.currentSequence[this.sequenceIndex];
        if (!isMatch) {
            this.isSpecial = false;
        } else if (!isEnd) {
            this.sequenceIndex++;
            return;
        }
        this.sequenceIndex = 0;
        this.state = State.InTagName;
        this.stateInTagName(c);
    };
    /** Look for an end tag. For <title> tags, also decode entities. */ Tokenizer.prototype.stateInSpecialTag = function(c) {
        if (this.sequenceIndex === this.currentSequence.length) {
            if (c === CharCodes.Gt || isWhitespace(c)) {
                var endOfText = this.index - this.currentSequence.length;
                if (this.sectionStart < endOfText) {
                    // Spoof the index so that reported locations match up.
                    var actualIndex = this.index;
                    this.index = endOfText;
                    this.cbs.ontext(this.sectionStart, endOfText);
                    this.index = actualIndex;
                }
                this.isSpecial = false;
                this.sectionStart = endOfText + 2; // Skip over the `</`
                this.stateInClosingTagName(c);
                return; // We are done; skip the rest of the function.
            }
            this.sequenceIndex = 0;
        }
        if ((c | 0x20) === this.currentSequence[this.sequenceIndex]) {
            this.sequenceIndex += 1;
        } else if (this.sequenceIndex === 0) {
            if (this.currentSequence === Sequences.TitleEnd) {
                // We have to parse entities in <title> tags.
                if (this.decodeEntities && c === CharCodes.Amp) {
                    this.state = State.BeforeEntity;
                }
            } else if (this.fastForwardTo(CharCodes.Lt)) {
                // Outside of <title> tags, we can fast-forward.
                this.sequenceIndex = 1;
            }
        } else {
            // If we see a `<`, set the sequence index to 1; useful for eg. `<</script>`.
            this.sequenceIndex = Number(c === CharCodes.Lt);
        }
    };
    Tokenizer.prototype.stateCDATASequence = function(c) {
        if (c === Sequences.Cdata[this.sequenceIndex]) {
            if (++this.sequenceIndex === Sequences.Cdata.length) {
                this.state = State.InCommentLike;
                this.currentSequence = Sequences.CdataEnd;
                this.sequenceIndex = 0;
                this.sectionStart = this.index + 1;
            }
        } else {
            this.sequenceIndex = 0;
            this.state = State.InDeclaration;
            this.stateInDeclaration(c); // Reconsume the character
        }
    };
    /**
     * When we wait for one specific character, we can speed things up
     * by skipping through the buffer until we find it.
     *
     * @returns Whether the character was found.
     */ Tokenizer.prototype.fastForwardTo = function(c) {
        while(++this.index < this.buffer.length + this.offset){
            if (this.buffer.charCodeAt(this.index - this.offset) === c) {
                return true;
            }
        }
        /*
         * We increment the index at the end of the `parse` loop,
         * so set it to `buffer.length - 1` here.
         *
         * TODO: Refactor `parse` to increment index before calling states.
         */ this.index = this.buffer.length + this.offset - 1;
        return false;
    };
    /**
     * Comments and CDATA end with `-->` and `]]>`.
     *
     * Their common qualities are:
     * - Their end sequences have a distinct character they start with.
     * - That character is then repeated, so we have to check multiple repeats.
     * - All characters but the start character of the sequence can be skipped.
     */ Tokenizer.prototype.stateInCommentLike = function(c) {
        if (c === this.currentSequence[this.sequenceIndex]) {
            if (++this.sequenceIndex === this.currentSequence.length) {
                if (this.currentSequence === Sequences.CdataEnd) {
                    this.cbs.oncdata(this.sectionStart, this.index, 2);
                } else {
                    this.cbs.oncomment(this.sectionStart, this.index, 2);
                }
                this.sequenceIndex = 0;
                this.sectionStart = this.index + 1;
                this.state = State.Text;
            }
        } else if (this.sequenceIndex === 0) {
            // Fast-forward to the first character of the sequence
            if (this.fastForwardTo(this.currentSequence[0])) {
                this.sequenceIndex = 1;
            }
        } else if (c !== this.currentSequence[this.sequenceIndex - 1]) {
            // Allow long sequences, eg. --->, ]]]>
            this.sequenceIndex = 0;
        }
    };
    /**
     * HTML only allows ASCII alpha characters (a-z and A-Z) at the beginning of a tag name.
     *
     * XML allows a lot more characters here (@see https://www.w3.org/TR/REC-xml/#NT-NameStartChar).
     * We allow anything that wouldn't end the tag.
     */ Tokenizer.prototype.isTagStartChar = function(c) {
        return this.xmlMode ? !isEndOfTagSection(c) : isASCIIAlpha(c);
    };
    Tokenizer.prototype.startSpecial = function(sequence, offset) {
        this.isSpecial = true;
        this.currentSequence = sequence;
        this.sequenceIndex = offset;
        this.state = State.SpecialStartSequence;
    };
    Tokenizer.prototype.stateBeforeTagName = function(c) {
        if (c === CharCodes.ExclamationMark) {
            this.state = State.BeforeDeclaration;
            this.sectionStart = this.index + 1;
        } else if (c === CharCodes.Questionmark) {
            this.state = State.InProcessingInstruction;
            this.sectionStart = this.index + 1;
        } else if (this.isTagStartChar(c)) {
            var lower = c | 0x20;
            this.sectionStart = this.index;
            if (!this.xmlMode && lower === Sequences.TitleEnd[2]) {
                this.startSpecial(Sequences.TitleEnd, 3);
            } else {
                this.state = !this.xmlMode && lower === Sequences.ScriptEnd[2] ? State.BeforeSpecialS : State.InTagName;
            }
        } else if (c === CharCodes.Slash) {
            this.state = State.BeforeClosingTagName;
        } else {
            this.state = State.Text;
            this.stateText(c);
        }
    };
    Tokenizer.prototype.stateInTagName = function(c) {
        if (isEndOfTagSection(c)) {
            this.cbs.onopentagname(this.sectionStart, this.index);
            this.sectionStart = -1;
            this.state = State.BeforeAttributeName;
            this.stateBeforeAttributeName(c);
        }
    };
    Tokenizer.prototype.stateBeforeClosingTagName = function(c) {
        if (isWhitespace(c)) {
        // Ignore
        } else if (c === CharCodes.Gt) {
            this.state = State.Text;
        } else {
            this.state = this.isTagStartChar(c) ? State.InClosingTagName : State.InSpecialComment;
            this.sectionStart = this.index;
        }
    };
    Tokenizer.prototype.stateInClosingTagName = function(c) {
        if (c === CharCodes.Gt || isWhitespace(c)) {
            this.cbs.onclosetag(this.sectionStart, this.index);
            this.sectionStart = -1;
            this.state = State.AfterClosingTagName;
            this.stateAfterClosingTagName(c);
        }
    };
    Tokenizer.prototype.stateAfterClosingTagName = function(c) {
        // Skip everything until ">"
        if (c === CharCodes.Gt || this.fastForwardTo(CharCodes.Gt)) {
            this.state = State.Text;
            this.baseState = State.Text;
            this.sectionStart = this.index + 1;
        }
    };
    Tokenizer.prototype.stateBeforeAttributeName = function(c) {
        if (c === CharCodes.Gt) {
            this.cbs.onopentagend(this.index);
            if (this.isSpecial) {
                this.state = State.InSpecialTag;
                this.sequenceIndex = 0;
            } else {
                this.state = State.Text;
            }
            this.baseState = this.state;
            this.sectionStart = this.index + 1;
        } else if (c === CharCodes.Slash) {
            this.state = State.InSelfClosingTag;
        } else if (!isWhitespace(c)) {
            this.state = State.InAttributeName;
            this.sectionStart = this.index;
        }
    };
    Tokenizer.prototype.stateInSelfClosingTag = function(c) {
        if (c === CharCodes.Gt) {
            this.cbs.onselfclosingtag(this.index);
            this.state = State.Text;
            this.baseState = State.Text;
            this.sectionStart = this.index + 1;
            this.isSpecial = false; // Reset special state, in case of self-closing special tags
        } else if (!isWhitespace(c)) {
            this.state = State.BeforeAttributeName;
            this.stateBeforeAttributeName(c);
        }
    };
    Tokenizer.prototype.stateInAttributeName = function(c) {
        if (c === CharCodes.Eq || isEndOfTagSection(c)) {
            this.cbs.onattribname(this.sectionStart, this.index);
            this.sectionStart = -1;
            this.state = State.AfterAttributeName;
            this.stateAfterAttributeName(c);
        }
    };
    Tokenizer.prototype.stateAfterAttributeName = function(c) {
        if (c === CharCodes.Eq) {
            this.state = State.BeforeAttributeValue;
        } else if (c === CharCodes.Slash || c === CharCodes.Gt) {
            this.cbs.onattribend(QuoteType.NoValue, this.index);
            this.state = State.BeforeAttributeName;
            this.stateBeforeAttributeName(c);
        } else if (!isWhitespace(c)) {
            this.cbs.onattribend(QuoteType.NoValue, this.index);
            this.state = State.InAttributeName;
            this.sectionStart = this.index;
        }
    };
    Tokenizer.prototype.stateBeforeAttributeValue = function(c) {
        if (c === CharCodes.DoubleQuote) {
            this.state = State.InAttributeValueDq;
            this.sectionStart = this.index + 1;
        } else if (c === CharCodes.SingleQuote) {
            this.state = State.InAttributeValueSq;
            this.sectionStart = this.index + 1;
        } else if (!isWhitespace(c)) {
            this.sectionStart = this.index;
            this.state = State.InAttributeValueNq;
            this.stateInAttributeValueNoQuotes(c); // Reconsume token
        }
    };
    Tokenizer.prototype.handleInAttributeValue = function(c, quote) {
        if (c === quote || !this.decodeEntities && this.fastForwardTo(quote)) {
            this.cbs.onattribdata(this.sectionStart, this.index);
            this.sectionStart = -1;
            this.cbs.onattribend(quote === CharCodes.DoubleQuote ? QuoteType.Double : QuoteType.Single, this.index);
            this.state = State.BeforeAttributeName;
        } else if (this.decodeEntities && c === CharCodes.Amp) {
            this.baseState = this.state;
            this.state = State.BeforeEntity;
        }
    };
    Tokenizer.prototype.stateInAttributeValueDoubleQuotes = function(c) {
        this.handleInAttributeValue(c, CharCodes.DoubleQuote);
    };
    Tokenizer.prototype.stateInAttributeValueSingleQuotes = function(c) {
        this.handleInAttributeValue(c, CharCodes.SingleQuote);
    };
    Tokenizer.prototype.stateInAttributeValueNoQuotes = function(c) {
        if (isWhitespace(c) || c === CharCodes.Gt) {
            this.cbs.onattribdata(this.sectionStart, this.index);
            this.sectionStart = -1;
            this.cbs.onattribend(QuoteType.Unquoted, this.index);
            this.state = State.BeforeAttributeName;
            this.stateBeforeAttributeName(c);
        } else if (this.decodeEntities && c === CharCodes.Amp) {
            this.baseState = this.state;
            this.state = State.BeforeEntity;
        }
    };
    Tokenizer.prototype.stateBeforeDeclaration = function(c) {
        if (c === CharCodes.OpeningSquareBracket) {
            this.state = State.CDATASequence;
            this.sequenceIndex = 0;
        } else {
            this.state = c === CharCodes.Dash ? State.BeforeComment : State.InDeclaration;
        }
    };
    Tokenizer.prototype.stateInDeclaration = function(c) {
        if (c === CharCodes.Gt || this.fastForwardTo(CharCodes.Gt)) {
            this.cbs.ondeclaration(this.sectionStart, this.index);
            this.state = State.Text;
            this.sectionStart = this.index + 1;
        }
    };
    Tokenizer.prototype.stateInProcessingInstruction = function(c) {
        if (c === CharCodes.Gt || this.fastForwardTo(CharCodes.Gt)) {
            this.cbs.onprocessinginstruction(this.sectionStart, this.index);
            this.state = State.Text;
            this.sectionStart = this.index + 1;
        }
    };
    Tokenizer.prototype.stateBeforeComment = function(c) {
        if (c === CharCodes.Dash) {
            this.state = State.InCommentLike;
            this.currentSequence = Sequences.CommentEnd;
            // Allow short comments (eg. <!-->)
            this.sequenceIndex = 2;
            this.sectionStart = this.index + 1;
        } else {
            this.state = State.InDeclaration;
        }
    };
    Tokenizer.prototype.stateInSpecialComment = function(c) {
        if (c === CharCodes.Gt || this.fastForwardTo(CharCodes.Gt)) {
            this.cbs.oncomment(this.sectionStart, this.index, 0);
            this.state = State.Text;
            this.sectionStart = this.index + 1;
        }
    };
    Tokenizer.prototype.stateBeforeSpecialS = function(c) {
        var lower = c | 0x20;
        if (lower === Sequences.ScriptEnd[3]) {
            this.startSpecial(Sequences.ScriptEnd, 4);
        } else if (lower === Sequences.StyleEnd[3]) {
            this.startSpecial(Sequences.StyleEnd, 4);
        } else {
            this.state = State.InTagName;
            this.stateInTagName(c); // Consume the token again
        }
    };
    Tokenizer.prototype.stateBeforeEntity = function(c) {
        // Start excess with 1 to include the '&'
        this.entityExcess = 1;
        this.entityResult = 0;
        if (c === CharCodes.Number) {
            this.state = State.BeforeNumericEntity;
        } else if (c === CharCodes.Amp) {
        // We have two `&` characters in a row. Stay in the current state.
        } else {
            this.trieIndex = 0;
            this.trieCurrent = this.entityTrie[0];
            this.state = State.InNamedEntity;
            this.stateInNamedEntity(c);
        }
    };
    Tokenizer.prototype.stateInNamedEntity = function(c) {
        this.entityExcess += 1;
        this.trieIndex = (0, decode_js_1.determineBranch)(this.entityTrie, this.trieCurrent, this.trieIndex + 1, c);
        if (this.trieIndex < 0) {
            this.emitNamedEntity();
            this.index--;
            return;
        }
        this.trieCurrent = this.entityTrie[this.trieIndex];
        var masked = this.trieCurrent & decode_js_1.BinTrieFlags.VALUE_LENGTH;
        // If the branch is a value, store it and continue
        if (masked) {
            // The mask is the number of bytes of the value, including the current byte.
            var valueLength = (masked >> 14) - 1;
            // If we have a legacy entity while parsing strictly, just skip the number of bytes
            if (!this.allowLegacyEntity() && c !== CharCodes.Semi) {
                this.trieIndex += valueLength;
            } else {
                // Add 1 as we have already incremented the excess
                var entityStart = this.index - this.entityExcess + 1;
                if (entityStart > this.sectionStart) {
                    this.emitPartial(this.sectionStart, entityStart);
                }
                // If this is a surrogate pair, consume the next two bytes
                this.entityResult = this.trieIndex;
                this.trieIndex += valueLength;
                this.entityExcess = 0;
                this.sectionStart = this.index + 1;
                if (valueLength === 0) {
                    this.emitNamedEntity();
                }
            }
        }
    };
    Tokenizer.prototype.emitNamedEntity = function() {
        this.state = this.baseState;
        if (this.entityResult === 0) {
            return;
        }
        var valueLength = (this.entityTrie[this.entityResult] & decode_js_1.BinTrieFlags.VALUE_LENGTH) >> 14;
        switch(valueLength){
            case 1:
                {
                    this.emitCodePoint(this.entityTrie[this.entityResult] & ~decode_js_1.BinTrieFlags.VALUE_LENGTH);
                    break;
                }
            case 2:
                {
                    this.emitCodePoint(this.entityTrie[this.entityResult + 1]);
                    break;
                }
            case 3:
                {
                    this.emitCodePoint(this.entityTrie[this.entityResult + 1]);
                    this.emitCodePoint(this.entityTrie[this.entityResult + 2]);
                }
        }
    };
    Tokenizer.prototype.stateBeforeNumericEntity = function(c) {
        if ((c | 0x20) === CharCodes.LowerX) {
            this.entityExcess++;
            this.state = State.InHexEntity;
        } else {
            this.state = State.InNumericEntity;
            this.stateInNumericEntity(c);
        }
    };
    Tokenizer.prototype.emitNumericEntity = function(strict) {
        var entityStart = this.index - this.entityExcess - 1;
        var numberStart = entityStart + 2 + Number(this.state === State.InHexEntity);
        if (numberStart !== this.index) {
            // Emit leading data if any
            if (entityStart > this.sectionStart) {
                this.emitPartial(this.sectionStart, entityStart);
            }
            this.sectionStart = this.index + Number(strict);
            this.emitCodePoint((0, decode_js_1.replaceCodePoint)(this.entityResult));
        }
        this.state = this.baseState;
    };
    Tokenizer.prototype.stateInNumericEntity = function(c) {
        if (c === CharCodes.Semi) {
            this.emitNumericEntity(true);
        } else if (isNumber(c)) {
            this.entityResult = this.entityResult * 10 + (c - CharCodes.Zero);
            this.entityExcess++;
        } else {
            if (this.allowLegacyEntity()) {
                this.emitNumericEntity(false);
            } else {
                this.state = this.baseState;
            }
            this.index--;
        }
    };
    Tokenizer.prototype.stateInHexEntity = function(c) {
        if (c === CharCodes.Semi) {
            this.emitNumericEntity(true);
        } else if (isNumber(c)) {
            this.entityResult = this.entityResult * 16 + (c - CharCodes.Zero);
            this.entityExcess++;
        } else if (isHexDigit(c)) {
            this.entityResult = this.entityResult * 16 + ((c | 0x20) - CharCodes.LowerA + 10);
            this.entityExcess++;
        } else {
            if (this.allowLegacyEntity()) {
                this.emitNumericEntity(false);
            } else {
                this.state = this.baseState;
            }
            this.index--;
        }
    };
    Tokenizer.prototype.allowLegacyEntity = function() {
        return !this.xmlMode && (this.baseState === State.Text || this.baseState === State.InSpecialTag);
    };
    /**
     * Remove data that has already been consumed from the buffer.
     */ Tokenizer.prototype.cleanup = function() {
        // If we are inside of text or attributes, emit what we already have.
        if (this.running && this.sectionStart !== this.index) {
            if (this.state === State.Text || this.state === State.InSpecialTag && this.sequenceIndex === 0) {
                this.cbs.ontext(this.sectionStart, this.index);
                this.sectionStart = this.index;
            } else if (this.state === State.InAttributeValueDq || this.state === State.InAttributeValueSq || this.state === State.InAttributeValueNq) {
                this.cbs.onattribdata(this.sectionStart, this.index);
                this.sectionStart = this.index;
            }
        }
    };
    Tokenizer.prototype.shouldContinue = function() {
        return this.index < this.buffer.length + this.offset && this.running;
    };
    /**
     * Iterates through the buffer, calling the function corresponding to the current state.
     *
     * States that are more likely to be hit are higher up, as a performance improvement.
     */ Tokenizer.prototype.parse = function() {
        while(this.shouldContinue()){
            var c = this.buffer.charCodeAt(this.index - this.offset);
            switch(this.state){
                case State.Text:
                    {
                        this.stateText(c);
                        break;
                    }
                case State.SpecialStartSequence:
                    {
                        this.stateSpecialStartSequence(c);
                        break;
                    }
                case State.InSpecialTag:
                    {
                        this.stateInSpecialTag(c);
                        break;
                    }
                case State.CDATASequence:
                    {
                        this.stateCDATASequence(c);
                        break;
                    }
                case State.InAttributeValueDq:
                    {
                        this.stateInAttributeValueDoubleQuotes(c);
                        break;
                    }
                case State.InAttributeName:
                    {
                        this.stateInAttributeName(c);
                        break;
                    }
                case State.InCommentLike:
                    {
                        this.stateInCommentLike(c);
                        break;
                    }
                case State.InSpecialComment:
                    {
                        this.stateInSpecialComment(c);
                        break;
                    }
                case State.BeforeAttributeName:
                    {
                        this.stateBeforeAttributeName(c);
                        break;
                    }
                case State.InTagName:
                    {
                        this.stateInTagName(c);
                        break;
                    }
                case State.InClosingTagName:
                    {
                        this.stateInClosingTagName(c);
                        break;
                    }
                case State.BeforeTagName:
                    {
                        this.stateBeforeTagName(c);
                        break;
                    }
                case State.AfterAttributeName:
                    {
                        this.stateAfterAttributeName(c);
                        break;
                    }
                case State.InAttributeValueSq:
                    {
                        this.stateInAttributeValueSingleQuotes(c);
                        break;
                    }
                case State.BeforeAttributeValue:
                    {
                        this.stateBeforeAttributeValue(c);
                        break;
                    }
                case State.BeforeClosingTagName:
                    {
                        this.stateBeforeClosingTagName(c);
                        break;
                    }
                case State.AfterClosingTagName:
                    {
                        this.stateAfterClosingTagName(c);
                        break;
                    }
                case State.BeforeSpecialS:
                    {
                        this.stateBeforeSpecialS(c);
                        break;
                    }
                case State.InAttributeValueNq:
                    {
                        this.stateInAttributeValueNoQuotes(c);
                        break;
                    }
                case State.InSelfClosingTag:
                    {
                        this.stateInSelfClosingTag(c);
                        break;
                    }
                case State.InDeclaration:
                    {
                        this.stateInDeclaration(c);
                        break;
                    }
                case State.BeforeDeclaration:
                    {
                        this.stateBeforeDeclaration(c);
                        break;
                    }
                case State.BeforeComment:
                    {
                        this.stateBeforeComment(c);
                        break;
                    }
                case State.InProcessingInstruction:
                    {
                        this.stateInProcessingInstruction(c);
                        break;
                    }
                case State.InNamedEntity:
                    {
                        this.stateInNamedEntity(c);
                        break;
                    }
                case State.BeforeEntity:
                    {
                        this.stateBeforeEntity(c);
                        break;
                    }
                case State.InHexEntity:
                    {
                        this.stateInHexEntity(c);
                        break;
                    }
                case State.InNumericEntity:
                    {
                        this.stateInNumericEntity(c);
                        break;
                    }
                default:
                    {
                        // `this._state === State.BeforeNumericEntity`
                        this.stateBeforeNumericEntity(c);
                    }
            }
            this.index++;
        }
        this.cleanup();
    };
    Tokenizer.prototype.finish = function() {
        if (this.state === State.InNamedEntity) {
            this.emitNamedEntity();
        }
        // If there is remaining data, emit it in a reasonable way
        if (this.sectionStart < this.index) {
            this.handleTrailingData();
        }
        this.cbs.onend();
    };
    /** Handle any trailing data. */ Tokenizer.prototype.handleTrailingData = function() {
        var endIndex = this.buffer.length + this.offset;
        if (this.state === State.InCommentLike) {
            if (this.currentSequence === Sequences.CdataEnd) {
                this.cbs.oncdata(this.sectionStart, endIndex, 0);
            } else {
                this.cbs.oncomment(this.sectionStart, endIndex, 0);
            }
        } else if (this.state === State.InNumericEntity && this.allowLegacyEntity()) {
            this.emitNumericEntity(false);
        // All trailing data will have been consumed
        } else if (this.state === State.InHexEntity && this.allowLegacyEntity()) {
            this.emitNumericEntity(false);
        // All trailing data will have been consumed
        } else if (this.state === State.InTagName || this.state === State.BeforeAttributeName || this.state === State.BeforeAttributeValue || this.state === State.AfterAttributeName || this.state === State.InAttributeName || this.state === State.InAttributeValueSq || this.state === State.InAttributeValueDq || this.state === State.InAttributeValueNq || this.state === State.InClosingTagName) {
        /*
             * If we are currently in an opening or closing tag, us not calling the
             * respective callback signals that the tag should be ignored.
             */ } else {
            this.cbs.ontext(this.sectionStart, endIndex);
        }
    };
    Tokenizer.prototype.emitPartial = function(start, endIndex) {
        if (this.baseState !== State.Text && this.baseState !== State.InSpecialTag) {
            this.cbs.onattribdata(start, endIndex);
        } else {
            this.cbs.ontext(start, endIndex);
        }
    };
    Tokenizer.prototype.emitCodePoint = function(cp) {
        if (this.baseState !== State.Text && this.baseState !== State.InSpecialTag) {
            this.cbs.onattribentity(cp);
        } else {
            this.cbs.ontextentity(cp);
        }
    };
    return Tokenizer;
}();
exports.default = Tokenizer; //# sourceMappingURL=Tokenizer.js.map
}),
"[project]/Autonomous-Claims-Orchestrator/node_modules/htmlparser2/lib/Parser.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __createBinding = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__createBinding || (Object.create ? function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = {
            enumerable: true,
            get: function() {
                return m[k];
            }
        };
    }
    Object.defineProperty(o, k2, desc);
} : function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
});
var __setModuleDefault = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__setModuleDefault || (Object.create ? function(o, v) {
    Object.defineProperty(o, "default", {
        enumerable: true,
        value: v
    });
} : function(o, v) {
    o["default"] = v;
});
var __importStar = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__importStar || function(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) {
        for(var k in mod)if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    }
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Parser = void 0;
var Tokenizer_js_1 = __importStar(__turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/htmlparser2/lib/Tokenizer.js [app-route] (ecmascript)"));
var decode_js_1 = __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/entities/lib/decode.js [app-route] (ecmascript)");
var formTags = new Set([
    "input",
    "option",
    "optgroup",
    "select",
    "button",
    "datalist",
    "textarea"
]);
var pTag = new Set([
    "p"
]);
var tableSectionTags = new Set([
    "thead",
    "tbody"
]);
var ddtTags = new Set([
    "dd",
    "dt"
]);
var rtpTags = new Set([
    "rt",
    "rp"
]);
var openImpliesClose = new Map([
    [
        "tr",
        new Set([
            "tr",
            "th",
            "td"
        ])
    ],
    [
        "th",
        new Set([
            "th"
        ])
    ],
    [
        "td",
        new Set([
            "thead",
            "th",
            "td"
        ])
    ],
    [
        "body",
        new Set([
            "head",
            "link",
            "script"
        ])
    ],
    [
        "li",
        new Set([
            "li"
        ])
    ],
    [
        "p",
        pTag
    ],
    [
        "h1",
        pTag
    ],
    [
        "h2",
        pTag
    ],
    [
        "h3",
        pTag
    ],
    [
        "h4",
        pTag
    ],
    [
        "h5",
        pTag
    ],
    [
        "h6",
        pTag
    ],
    [
        "select",
        formTags
    ],
    [
        "input",
        formTags
    ],
    [
        "output",
        formTags
    ],
    [
        "button",
        formTags
    ],
    [
        "datalist",
        formTags
    ],
    [
        "textarea",
        formTags
    ],
    [
        "option",
        new Set([
            "option"
        ])
    ],
    [
        "optgroup",
        new Set([
            "optgroup",
            "option"
        ])
    ],
    [
        "dd",
        ddtTags
    ],
    [
        "dt",
        ddtTags
    ],
    [
        "address",
        pTag
    ],
    [
        "article",
        pTag
    ],
    [
        "aside",
        pTag
    ],
    [
        "blockquote",
        pTag
    ],
    [
        "details",
        pTag
    ],
    [
        "div",
        pTag
    ],
    [
        "dl",
        pTag
    ],
    [
        "fieldset",
        pTag
    ],
    [
        "figcaption",
        pTag
    ],
    [
        "figure",
        pTag
    ],
    [
        "footer",
        pTag
    ],
    [
        "form",
        pTag
    ],
    [
        "header",
        pTag
    ],
    [
        "hr",
        pTag
    ],
    [
        "main",
        pTag
    ],
    [
        "nav",
        pTag
    ],
    [
        "ol",
        pTag
    ],
    [
        "pre",
        pTag
    ],
    [
        "section",
        pTag
    ],
    [
        "table",
        pTag
    ],
    [
        "ul",
        pTag
    ],
    [
        "rt",
        rtpTags
    ],
    [
        "rp",
        rtpTags
    ],
    [
        "tbody",
        tableSectionTags
    ],
    [
        "tfoot",
        tableSectionTags
    ]
]);
var voidElements = new Set([
    "area",
    "base",
    "basefont",
    "br",
    "col",
    "command",
    "embed",
    "frame",
    "hr",
    "img",
    "input",
    "isindex",
    "keygen",
    "link",
    "meta",
    "param",
    "source",
    "track",
    "wbr"
]);
var foreignContextElements = new Set([
    "math",
    "svg"
]);
var htmlIntegrationElements = new Set([
    "mi",
    "mo",
    "mn",
    "ms",
    "mtext",
    "annotation-xml",
    "foreignobject",
    "desc",
    "title"
]);
var reNameEnd = /\s|\//;
var Parser = function() {
    function Parser(cbs, options) {
        if (options === void 0) {
            options = {};
        }
        var _a, _b, _c, _d, _e;
        this.options = options;
        /** The start index of the last event. */ this.startIndex = 0;
        /** The end index of the last event. */ this.endIndex = 0;
        /**
         * Store the start index of the current open tag,
         * so we can update the start index for attributes.
         */ this.openTagStart = 0;
        this.tagname = "";
        this.attribname = "";
        this.attribvalue = "";
        this.attribs = null;
        this.stack = [];
        this.foreignContext = [];
        this.buffers = [];
        this.bufferOffset = 0;
        /** The index of the last written buffer. Used when resuming after a `pause()`. */ this.writeIndex = 0;
        /** Indicates whether the parser has finished running / `.end` has been called. */ this.ended = false;
        this.cbs = cbs !== null && cbs !== void 0 ? cbs : {};
        this.lowerCaseTagNames = (_a = options.lowerCaseTags) !== null && _a !== void 0 ? _a : !options.xmlMode;
        this.lowerCaseAttributeNames = (_b = options.lowerCaseAttributeNames) !== null && _b !== void 0 ? _b : !options.xmlMode;
        this.tokenizer = new ((_c = options.Tokenizer) !== null && _c !== void 0 ? _c : Tokenizer_js_1.default)(this.options, this);
        (_e = (_d = this.cbs).onparserinit) === null || _e === void 0 ? void 0 : _e.call(_d, this);
    }
    // Tokenizer event handlers
    /** @internal */ Parser.prototype.ontext = function(start, endIndex) {
        var _a, _b;
        var data = this.getSlice(start, endIndex);
        this.endIndex = endIndex - 1;
        (_b = (_a = this.cbs).ontext) === null || _b === void 0 ? void 0 : _b.call(_a, data);
        this.startIndex = endIndex;
    };
    /** @internal */ Parser.prototype.ontextentity = function(cp) {
        var _a, _b;
        /*
         * Entities can be emitted on the character, or directly after.
         * We use the section start here to get accurate indices.
         */ var index = this.tokenizer.getSectionStart();
        this.endIndex = index - 1;
        (_b = (_a = this.cbs).ontext) === null || _b === void 0 ? void 0 : _b.call(_a, (0, decode_js_1.fromCodePoint)(cp));
        this.startIndex = index;
    };
    Parser.prototype.isVoidElement = function(name) {
        return !this.options.xmlMode && voidElements.has(name);
    };
    /** @internal */ Parser.prototype.onopentagname = function(start, endIndex) {
        this.endIndex = endIndex;
        var name = this.getSlice(start, endIndex);
        if (this.lowerCaseTagNames) {
            name = name.toLowerCase();
        }
        this.emitOpenTag(name);
    };
    Parser.prototype.emitOpenTag = function(name) {
        var _a, _b, _c, _d;
        this.openTagStart = this.startIndex;
        this.tagname = name;
        var impliesClose = !this.options.xmlMode && openImpliesClose.get(name);
        if (impliesClose) {
            while(this.stack.length > 0 && impliesClose.has(this.stack[this.stack.length - 1])){
                var element = this.stack.pop();
                (_b = (_a = this.cbs).onclosetag) === null || _b === void 0 ? void 0 : _b.call(_a, element, true);
            }
        }
        if (!this.isVoidElement(name)) {
            this.stack.push(name);
            if (foreignContextElements.has(name)) {
                this.foreignContext.push(true);
            } else if (htmlIntegrationElements.has(name)) {
                this.foreignContext.push(false);
            }
        }
        (_d = (_c = this.cbs).onopentagname) === null || _d === void 0 ? void 0 : _d.call(_c, name);
        if (this.cbs.onopentag) this.attribs = {};
    };
    Parser.prototype.endOpenTag = function(isImplied) {
        var _a, _b;
        this.startIndex = this.openTagStart;
        if (this.attribs) {
            (_b = (_a = this.cbs).onopentag) === null || _b === void 0 ? void 0 : _b.call(_a, this.tagname, this.attribs, isImplied);
            this.attribs = null;
        }
        if (this.cbs.onclosetag && this.isVoidElement(this.tagname)) {
            this.cbs.onclosetag(this.tagname, true);
        }
        this.tagname = "";
    };
    /** @internal */ Parser.prototype.onopentagend = function(endIndex) {
        this.endIndex = endIndex;
        this.endOpenTag(false);
        // Set `startIndex` for next node
        this.startIndex = endIndex + 1;
    };
    /** @internal */ Parser.prototype.onclosetag = function(start, endIndex) {
        var _a, _b, _c, _d, _e, _f;
        this.endIndex = endIndex;
        var name = this.getSlice(start, endIndex);
        if (this.lowerCaseTagNames) {
            name = name.toLowerCase();
        }
        if (foreignContextElements.has(name) || htmlIntegrationElements.has(name)) {
            this.foreignContext.pop();
        }
        if (!this.isVoidElement(name)) {
            var pos = this.stack.lastIndexOf(name);
            if (pos !== -1) {
                if (this.cbs.onclosetag) {
                    var count = this.stack.length - pos;
                    while(count--){
                        // We know the stack has sufficient elements.
                        this.cbs.onclosetag(this.stack.pop(), count !== 0);
                    }
                } else this.stack.length = pos;
            } else if (!this.options.xmlMode && name === "p") {
                // Implicit open before close
                this.emitOpenTag("p");
                this.closeCurrentTag(true);
            }
        } else if (!this.options.xmlMode && name === "br") {
            // We can't use `emitOpenTag` for implicit open, as `br` would be implicitly closed.
            (_b = (_a = this.cbs).onopentagname) === null || _b === void 0 ? void 0 : _b.call(_a, "br");
            (_d = (_c = this.cbs).onopentag) === null || _d === void 0 ? void 0 : _d.call(_c, "br", {}, true);
            (_f = (_e = this.cbs).onclosetag) === null || _f === void 0 ? void 0 : _f.call(_e, "br", false);
        }
        // Set `startIndex` for next node
        this.startIndex = endIndex + 1;
    };
    /** @internal */ Parser.prototype.onselfclosingtag = function(endIndex) {
        this.endIndex = endIndex;
        if (this.options.xmlMode || this.options.recognizeSelfClosing || this.foreignContext[this.foreignContext.length - 1]) {
            this.closeCurrentTag(false);
            // Set `startIndex` for next node
            this.startIndex = endIndex + 1;
        } else {
            // Ignore the fact that the tag is self-closing.
            this.onopentagend(endIndex);
        }
    };
    Parser.prototype.closeCurrentTag = function(isOpenImplied) {
        var _a, _b;
        var name = this.tagname;
        this.endOpenTag(isOpenImplied);
        // Self-closing tags will be on the top of the stack
        if (this.stack[this.stack.length - 1] === name) {
            // If the opening tag isn't implied, the closing tag has to be implied.
            (_b = (_a = this.cbs).onclosetag) === null || _b === void 0 ? void 0 : _b.call(_a, name, !isOpenImplied);
            this.stack.pop();
        }
    };
    /** @internal */ Parser.prototype.onattribname = function(start, endIndex) {
        this.startIndex = start;
        var name = this.getSlice(start, endIndex);
        this.attribname = this.lowerCaseAttributeNames ? name.toLowerCase() : name;
    };
    /** @internal */ Parser.prototype.onattribdata = function(start, endIndex) {
        this.attribvalue += this.getSlice(start, endIndex);
    };
    /** @internal */ Parser.prototype.onattribentity = function(cp) {
        this.attribvalue += (0, decode_js_1.fromCodePoint)(cp);
    };
    /** @internal */ Parser.prototype.onattribend = function(quote, endIndex) {
        var _a, _b;
        this.endIndex = endIndex;
        (_b = (_a = this.cbs).onattribute) === null || _b === void 0 ? void 0 : _b.call(_a, this.attribname, this.attribvalue, quote === Tokenizer_js_1.QuoteType.Double ? '"' : quote === Tokenizer_js_1.QuoteType.Single ? "'" : quote === Tokenizer_js_1.QuoteType.NoValue ? undefined : null);
        if (this.attribs && !Object.prototype.hasOwnProperty.call(this.attribs, this.attribname)) {
            this.attribs[this.attribname] = this.attribvalue;
        }
        this.attribvalue = "";
    };
    Parser.prototype.getInstructionName = function(value) {
        var index = value.search(reNameEnd);
        var name = index < 0 ? value : value.substr(0, index);
        if (this.lowerCaseTagNames) {
            name = name.toLowerCase();
        }
        return name;
    };
    /** @internal */ Parser.prototype.ondeclaration = function(start, endIndex) {
        this.endIndex = endIndex;
        var value = this.getSlice(start, endIndex);
        if (this.cbs.onprocessinginstruction) {
            var name = this.getInstructionName(value);
            this.cbs.onprocessinginstruction("!".concat(name), "!".concat(value));
        }
        // Set `startIndex` for next node
        this.startIndex = endIndex + 1;
    };
    /** @internal */ Parser.prototype.onprocessinginstruction = function(start, endIndex) {
        this.endIndex = endIndex;
        var value = this.getSlice(start, endIndex);
        if (this.cbs.onprocessinginstruction) {
            var name = this.getInstructionName(value);
            this.cbs.onprocessinginstruction("?".concat(name), "?".concat(value));
        }
        // Set `startIndex` for next node
        this.startIndex = endIndex + 1;
    };
    /** @internal */ Parser.prototype.oncomment = function(start, endIndex, offset) {
        var _a, _b, _c, _d;
        this.endIndex = endIndex;
        (_b = (_a = this.cbs).oncomment) === null || _b === void 0 ? void 0 : _b.call(_a, this.getSlice(start, endIndex - offset));
        (_d = (_c = this.cbs).oncommentend) === null || _d === void 0 ? void 0 : _d.call(_c);
        // Set `startIndex` for next node
        this.startIndex = endIndex + 1;
    };
    /** @internal */ Parser.prototype.oncdata = function(start, endIndex, offset) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        this.endIndex = endIndex;
        var value = this.getSlice(start, endIndex - offset);
        if (this.options.xmlMode || this.options.recognizeCDATA) {
            (_b = (_a = this.cbs).oncdatastart) === null || _b === void 0 ? void 0 : _b.call(_a);
            (_d = (_c = this.cbs).ontext) === null || _d === void 0 ? void 0 : _d.call(_c, value);
            (_f = (_e = this.cbs).oncdataend) === null || _f === void 0 ? void 0 : _f.call(_e);
        } else {
            (_h = (_g = this.cbs).oncomment) === null || _h === void 0 ? void 0 : _h.call(_g, "[CDATA[".concat(value, "]]"));
            (_k = (_j = this.cbs).oncommentend) === null || _k === void 0 ? void 0 : _k.call(_j);
        }
        // Set `startIndex` for next node
        this.startIndex = endIndex + 1;
    };
    /** @internal */ Parser.prototype.onend = function() {
        var _a, _b;
        if (this.cbs.onclosetag) {
            // Set the end index for all remaining tags
            this.endIndex = this.startIndex;
            for(var index = this.stack.length; index > 0; this.cbs.onclosetag(this.stack[--index], true));
        }
        (_b = (_a = this.cbs).onend) === null || _b === void 0 ? void 0 : _b.call(_a);
    };
    /**
     * Resets the parser to a blank state, ready to parse a new HTML document
     */ Parser.prototype.reset = function() {
        var _a, _b, _c, _d;
        (_b = (_a = this.cbs).onreset) === null || _b === void 0 ? void 0 : _b.call(_a);
        this.tokenizer.reset();
        this.tagname = "";
        this.attribname = "";
        this.attribs = null;
        this.stack.length = 0;
        this.startIndex = 0;
        this.endIndex = 0;
        (_d = (_c = this.cbs).onparserinit) === null || _d === void 0 ? void 0 : _d.call(_c, this);
        this.buffers.length = 0;
        this.bufferOffset = 0;
        this.writeIndex = 0;
        this.ended = false;
    };
    /**
     * Resets the parser, then parses a complete document and
     * pushes it to the handler.
     *
     * @param data Document to parse.
     */ Parser.prototype.parseComplete = function(data) {
        this.reset();
        this.end(data);
    };
    Parser.prototype.getSlice = function(start, end) {
        while(start - this.bufferOffset >= this.buffers[0].length){
            this.shiftBuffer();
        }
        var slice = this.buffers[0].slice(start - this.bufferOffset, end - this.bufferOffset);
        while(end - this.bufferOffset > this.buffers[0].length){
            this.shiftBuffer();
            slice += this.buffers[0].slice(0, end - this.bufferOffset);
        }
        return slice;
    };
    Parser.prototype.shiftBuffer = function() {
        this.bufferOffset += this.buffers[0].length;
        this.writeIndex--;
        this.buffers.shift();
    };
    /**
     * Parses a chunk of data and calls the corresponding callbacks.
     *
     * @param chunk Chunk to parse.
     */ Parser.prototype.write = function(chunk) {
        var _a, _b;
        if (this.ended) {
            (_b = (_a = this.cbs).onerror) === null || _b === void 0 ? void 0 : _b.call(_a, new Error(".write() after done!"));
            return;
        }
        this.buffers.push(chunk);
        if (this.tokenizer.running) {
            this.tokenizer.write(chunk);
            this.writeIndex++;
        }
    };
    /**
     * Parses the end of the buffer and clears the stack, calls onend.
     *
     * @param chunk Optional final chunk to parse.
     */ Parser.prototype.end = function(chunk) {
        var _a, _b;
        if (this.ended) {
            (_b = (_a = this.cbs).onerror) === null || _b === void 0 ? void 0 : _b.call(_a, new Error(".end() after done!"));
            return;
        }
        if (chunk) this.write(chunk);
        this.ended = true;
        this.tokenizer.end();
    };
    /**
     * Pauses parsing. The parser won't emit events until `resume` is called.
     */ Parser.prototype.pause = function() {
        this.tokenizer.pause();
    };
    /**
     * Resumes parsing after `pause` was called.
     */ Parser.prototype.resume = function() {
        this.tokenizer.resume();
        while(this.tokenizer.running && this.writeIndex < this.buffers.length){
            this.tokenizer.write(this.buffers[this.writeIndex++]);
        }
        if (this.ended) this.tokenizer.end();
    };
    /**
     * Alias of `write`, for backwards compatibility.
     *
     * @param chunk Chunk to parse.
     * @deprecated
     */ Parser.prototype.parseChunk = function(chunk) {
        this.write(chunk);
    };
    /**
     * Alias of `end`, for backwards compatibility.
     *
     * @param chunk Optional final chunk to parse.
     * @deprecated
     */ Parser.prototype.done = function(chunk) {
        this.end(chunk);
    };
    return Parser;
}();
exports.Parser = Parser; //# sourceMappingURL=Parser.js.map
}),
"[project]/Autonomous-Claims-Orchestrator/node_modules/htmlparser2/lib/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __createBinding = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__createBinding || (Object.create ? function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = {
            enumerable: true,
            get: function() {
                return m[k];
            }
        };
    }
    Object.defineProperty(o, k2, desc);
} : function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
});
var __setModuleDefault = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__setModuleDefault || (Object.create ? function(o, v) {
    Object.defineProperty(o, "default", {
        enumerable: true,
        value: v
    });
} : function(o, v) {
    o["default"] = v;
});
var __importStar = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__importStar || function(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) {
        for(var k in mod)if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    }
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : {
        "default": mod
    };
};
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.DomUtils = exports.parseFeed = exports.getFeed = exports.ElementType = exports.Tokenizer = exports.createDomStream = exports.parseDOM = exports.parseDocument = exports.DefaultHandler = exports.DomHandler = exports.Parser = void 0;
var Parser_js_1 = __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/htmlparser2/lib/Parser.js [app-route] (ecmascript)");
var Parser_js_2 = __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/htmlparser2/lib/Parser.js [app-route] (ecmascript)");
Object.defineProperty(exports, "Parser", {
    enumerable: true,
    get: function() {
        return Parser_js_2.Parser;
    }
});
var domhandler_1 = __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/domhandler/lib/index.js [app-route] (ecmascript)");
var domhandler_2 = __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/domhandler/lib/index.js [app-route] (ecmascript)");
Object.defineProperty(exports, "DomHandler", {
    enumerable: true,
    get: function() {
        return domhandler_2.DomHandler;
    }
});
// Old name for DomHandler
Object.defineProperty(exports, "DefaultHandler", {
    enumerable: true,
    get: function() {
        return domhandler_2.DomHandler;
    }
});
// Helper methods
/**
 * Parses the data, returns the resulting document.
 *
 * @param data The data that should be parsed.
 * @param options Optional options for the parser and DOM builder.
 */ function parseDocument(data, options) {
    var handler = new domhandler_1.DomHandler(undefined, options);
    new Parser_js_1.Parser(handler, options).end(data);
    return handler.root;
}
exports.parseDocument = parseDocument;
/**
 * Parses data, returns an array of the root nodes.
 *
 * Note that the root nodes still have a `Document` node as their parent.
 * Use `parseDocument` to get the `Document` node instead.
 *
 * @param data The data that should be parsed.
 * @param options Optional options for the parser and DOM builder.
 * @deprecated Use `parseDocument` instead.
 */ function parseDOM(data, options) {
    return parseDocument(data, options).children;
}
exports.parseDOM = parseDOM;
/**
 * Creates a parser instance, with an attached DOM handler.
 *
 * @param callback A callback that will be called once parsing has been completed.
 * @param options Optional options for the parser and DOM builder.
 * @param elementCallback An optional callback that will be called every time a tag has been completed inside of the DOM.
 */ function createDomStream(callback, options, elementCallback) {
    var handler = new domhandler_1.DomHandler(callback, options, elementCallback);
    return new Parser_js_1.Parser(handler, options);
}
exports.createDomStream = createDomStream;
var Tokenizer_js_1 = __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/htmlparser2/lib/Tokenizer.js [app-route] (ecmascript)");
Object.defineProperty(exports, "Tokenizer", {
    enumerable: true,
    get: function() {
        return __importDefault(Tokenizer_js_1).default;
    }
});
/*
 * All of the following exports exist for backwards-compatibility.
 * They should probably be removed eventually.
 */ exports.ElementType = __importStar(__turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/domelementtype/lib/index.js [app-route] (ecmascript)"));
var domutils_1 = __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/domutils/lib/index.js [app-route] (ecmascript)");
var domutils_2 = __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/domutils/lib/index.js [app-route] (ecmascript)");
Object.defineProperty(exports, "getFeed", {
    enumerable: true,
    get: function() {
        return domutils_2.getFeed;
    }
});
var parseFeedDefaultOptions = {
    xmlMode: true
};
/**
 * Parse a feed.
 *
 * @param feed The feed that should be parsed, as a string.
 * @param options Optionally, options for parsing. When using this, you should set `xmlMode` to `true`.
 */ function parseFeed(feed, options) {
    if (options === void 0) {
        options = parseFeedDefaultOptions;
    }
    return (0, domutils_1.getFeed)(parseDOM(feed, options));
}
exports.parseFeed = parseFeed;
exports.DomUtils = __importStar(__turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/domutils/lib/index.js [app-route] (ecmascript)")); //# sourceMappingURL=index.js.map
}),
"[project]/Autonomous-Claims-Orchestrator/node_modules/deepmerge/dist/cjs.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var isMergeableObject = function isMergeableObject(value) {
    return isNonNullObject(value) && !isSpecial(value);
};
function isNonNullObject(value) {
    return !!value && typeof value === 'object';
}
function isSpecial(value) {
    var stringValue = Object.prototype.toString.call(value);
    return stringValue === '[object RegExp]' || stringValue === '[object Date]' || isReactElement(value);
}
// see https://github.com/facebook/react/blob/b5ac963fb791d1298e7f396236383bc955f916c1/src/isomorphic/classic/element/ReactElement.js#L21-L25
var canUseSymbol = typeof Symbol === 'function' && Symbol.for;
var REACT_ELEMENT_TYPE = canUseSymbol ? Symbol.for('react.element') : 0xeac7;
function isReactElement(value) {
    return value.$$typeof === REACT_ELEMENT_TYPE;
}
function emptyTarget(val) {
    return Array.isArray(val) ? [] : {};
}
function cloneUnlessOtherwiseSpecified(value, options) {
    return options.clone !== false && options.isMergeableObject(value) ? deepmerge(emptyTarget(value), value, options) : value;
}
function defaultArrayMerge(target, source, options) {
    return target.concat(source).map(function(element) {
        return cloneUnlessOtherwiseSpecified(element, options);
    });
}
function getMergeFunction(key, options) {
    if (!options.customMerge) {
        return deepmerge;
    }
    var customMerge = options.customMerge(key);
    return typeof customMerge === 'function' ? customMerge : deepmerge;
}
function getEnumerableOwnPropertySymbols(target) {
    return Object.getOwnPropertySymbols ? Object.getOwnPropertySymbols(target).filter(function(symbol) {
        return Object.propertyIsEnumerable.call(target, symbol);
    }) : [];
}
function getKeys(target) {
    return Object.keys(target).concat(getEnumerableOwnPropertySymbols(target));
}
function propertyIsOnObject(object, property) {
    try {
        return property in object;
    } catch (_) {
        return false;
    }
}
// Protects from prototype poisoning and unexpected merging up the prototype chain.
function propertyIsUnsafe(target, key) {
    return propertyIsOnObject(target, key) // Properties are safe to merge if they don't exist in the target yet,
     && !(Object.hasOwnProperty.call(target, key) // unsafe if they exist up the prototype chain,
     && Object.propertyIsEnumerable.call(target, key)) // and also unsafe if they're nonenumerable.
    ;
}
function mergeObject(target, source, options) {
    var destination = {};
    if (options.isMergeableObject(target)) {
        getKeys(target).forEach(function(key) {
            destination[key] = cloneUnlessOtherwiseSpecified(target[key], options);
        });
    }
    getKeys(source).forEach(function(key) {
        if (propertyIsUnsafe(target, key)) {
            return;
        }
        if (propertyIsOnObject(target, key) && options.isMergeableObject(source[key])) {
            destination[key] = getMergeFunction(key, options)(target[key], source[key], options);
        } else {
            destination[key] = cloneUnlessOtherwiseSpecified(source[key], options);
        }
    });
    return destination;
}
function deepmerge(target, source, options) {
    options = options || {};
    options.arrayMerge = options.arrayMerge || defaultArrayMerge;
    options.isMergeableObject = options.isMergeableObject || isMergeableObject;
    // cloneUnlessOtherwiseSpecified is added to `options` so that custom arrayMerge()
    // implementations can use it. The caller may not replace it.
    options.cloneUnlessOtherwiseSpecified = cloneUnlessOtherwiseSpecified;
    var sourceIsArray = Array.isArray(source);
    var targetIsArray = Array.isArray(target);
    var sourceAndTargetTypesMatch = sourceIsArray === targetIsArray;
    if (!sourceAndTargetTypesMatch) {
        return cloneUnlessOtherwiseSpecified(source, options);
    } else if (sourceIsArray) {
        return options.arrayMerge(target, source, options);
    } else {
        return mergeObject(target, source, options);
    }
}
deepmerge.all = function deepmergeAll(array, options) {
    if (!Array.isArray(array)) {
        throw new Error('first argument should be an array');
    }
    return array.reduce(function(prev, next) {
        return deepmerge(prev, next, options);
    }, {});
};
var deepmerge_1 = deepmerge;
module.exports = deepmerge_1;
}),
"[project]/Autonomous-Claims-Orchestrator/node_modules/html-to-text/lib/html-to-text.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, '__esModule', {
    value: true
});
var pluginHtmlparser2 = __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/@selderee/plugin-htmlparser2/lib/hp2-builder.cjs [app-route] (ecmascript)");
var htmlparser2 = __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/htmlparser2/lib/index.js [app-route] (ecmascript)");
var selderee = __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/selderee/lib/selderee.cjs [app-route] (ecmascript)");
var merge = __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/deepmerge/dist/cjs.js [app-route] (ecmascript)");
var domSerializer = __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/dom-serializer/lib/index.js [app-route] (ecmascript)");
function _interopDefaultLegacy(e) {
    return e && typeof e === 'object' && 'default' in e ? e : {
        'default': e
    };
}
var merge__default = /*#__PURE__*/ _interopDefaultLegacy(merge);
/**
 * Make a recursive function that will only run to a given depth
 * and switches to an alternative function at that depth. \
 * No limitation if `n` is `undefined` (Just wraps `f` in that case).
 *
 * @param   { number | undefined } n   Allowed depth of recursion. `undefined` for no limitation.
 * @param   { Function }           f   Function that accepts recursive callback as the first argument.
 * @param   { Function }           [g] Function to run instead, when maximum depth was reached. Do nothing by default.
 * @returns { Function }
 */ function limitedDepthRecursive(n, f, g = ()=>undefined) {
    if (n === undefined) {
        const f1 = function(...args) {
            return f(f1, ...args);
        };
        return f1;
    }
    if (n >= 0) {
        return function(...args) {
            return f(limitedDepthRecursive(n - 1, f, g), ...args);
        };
    }
    return g;
}
/**
 * Return the same string or a substring with
 * the given character occurrences removed from each side.
 *
 * @param   { string } str  A string to trim.
 * @param   { string } char A character to be trimmed.
 * @returns { string }
 */ function trimCharacter(str, char) {
    let start = 0;
    let end = str.length;
    while(start < end && str[start] === char){
        ++start;
    }
    while(end > start && str[end - 1] === char){
        --end;
    }
    return start > 0 || end < str.length ? str.substring(start, end) : str;
}
/**
 * Return the same string or a substring with
 * the given character occurrences removed from the end only.
 *
 * @param   { string } str  A string to trim.
 * @param   { string } char A character to be trimmed.
 * @returns { string }
 */ function trimCharacterEnd(str, char) {
    let end = str.length;
    while(end > 0 && str[end - 1] === char){
        --end;
    }
    return end < str.length ? str.substring(0, end) : str;
}
/**
 * Return a new string will all characters replaced with unicode escape sequences.
 * This extreme kind of escaping can used to be safely compose regular expressions.
 *
 * @param { string } str A string to escape.
 * @returns { string } A string of unicode escape sequences.
 */ function unicodeEscape(str) {
    return str.replace(/[\s\S]/g, (c)=>'\\u' + c.charCodeAt().toString(16).padStart(4, '0'));
}
/**
 * Deduplicate an array by a given key callback.
 * Item properties are merged recursively and with the preference for last defined values.
 * Of items with the same key, merged item takes the place of the last item,
 * others are omitted.
 *
 * @param { any[] } items An array to deduplicate.
 * @param { (x: any) => string } getKey Callback to get a value that distinguishes unique items.
 * @returns { any[] }
 */ function mergeDuplicatesPreferLast(items, getKey) {
    const map = new Map();
    for(let i = items.length; i-- > 0;){
        const item = items[i];
        const key = getKey(item);
        map.set(key, map.has(key) ? merge__default["default"](item, map.get(key), {
            arrayMerge: overwriteMerge$1
        }) : item);
    }
    return [
        ...map.values()
    ].reverse();
}
const overwriteMerge$1 = (acc, src, options)=>[
        ...src
    ];
/**
 * Get a nested property from an object.
 *
 * @param   { object }   obj  The object to query for the value.
 * @param   { string[] } path The path to the property.
 * @returns { any }
 */ function get(obj, path) {
    for (const key of path){
        if (!obj) {
            return undefined;
        }
        obj = obj[key];
    }
    return obj;
}
/**
 * Convert a number into alphabetic sequence representation (Sequence without zeroes).
 *
 * For example: `a, ..., z, aa, ..., zz, aaa, ...`.
 *
 * @param   { number } num              Number to convert. Must be >= 1.
 * @param   { string } [baseChar = 'a'] Character for 1 in the sequence.
 * @param   { number } [base = 26]      Number of characters in the sequence.
 * @returns { string }
 */ function numberToLetterSequence(num, baseChar = 'a', base = 26) {
    const digits = [];
    do {
        num -= 1;
        digits.push(num % base);
        num = num / base >> 0; // quick `floor`
    }while (num > 0)
    const baseCode = baseChar.charCodeAt(0);
    return digits.reverse().map((n)=>String.fromCharCode(baseCode + n)).join('');
}
const I = [
    'I',
    'X',
    'C',
    'M'
];
const V = [
    'V',
    'L',
    'D'
];
/**
 * Convert a number to it's Roman representation. No large numbers extension.
 *
 * @param   { number } num Number to convert. `0 < num <= 3999`.
 * @returns { string }
 */ function numberToRoman(num) {
    return [
        ...num + ''
    ].map((n)=>+n).reverse().map((v, i)=>v % 5 < 4 ? (v < 5 ? '' : V[i]) + I[i].repeat(v % 5) : I[i] + (v < 5 ? V[i] : I[i + 1])).reverse().join('');
}
/**
 * Helps to build text from words.
 */ class InlineTextBuilder {
    /**
   * Creates an instance of InlineTextBuilder.
   *
   * If `maxLineLength` is not provided then it is either `options.wordwrap` or unlimited.
   *
   * @param { Options } options           HtmlToText options.
   * @param { number }  [ maxLineLength ] This builder will try to wrap text to fit this line length.
   */ constructor(options, maxLineLength = undefined){
        /** @type { string[][] } */ this.lines = [];
        /** @type { string[] }   */ this.nextLineWords = [];
        this.maxLineLength = maxLineLength || options.wordwrap || Number.MAX_VALUE;
        this.nextLineAvailableChars = this.maxLineLength;
        this.wrapCharacters = get(options, [
            'longWordSplit',
            'wrapCharacters'
        ]) || [];
        this.forceWrapOnLimit = get(options, [
            'longWordSplit',
            'forceWrapOnLimit'
        ]) || false;
        this.stashedSpace = false;
        this.wordBreakOpportunity = false;
    }
    /**
   * Add a new word.
   *
   * @param { string } word A word to add.
   * @param { boolean } [noWrap] Don't wrap text even if the line is too long.
   */ pushWord(word, noWrap = false) {
        if (this.nextLineAvailableChars <= 0 && !noWrap) {
            this.startNewLine();
        }
        const isLineStart = this.nextLineWords.length === 0;
        const cost = word.length + (isLineStart ? 0 : 1);
        if (cost <= this.nextLineAvailableChars || noWrap) {
            this.nextLineWords.push(word);
            this.nextLineAvailableChars -= cost;
        } else {
            // The word is moved to a new line - prefer to wrap between words.
            const [first, ...rest] = this.splitLongWord(word);
            if (!isLineStart) {
                this.startNewLine();
            }
            this.nextLineWords.push(first);
            this.nextLineAvailableChars -= first.length;
            for (const part of rest){
                this.startNewLine();
                this.nextLineWords.push(part);
                this.nextLineAvailableChars -= part.length;
            }
        }
    }
    /**
   * Pop a word from the currently built line.
   * This doesn't affect completed lines.
   *
   * @returns { string }
   */ popWord() {
        const lastWord = this.nextLineWords.pop();
        if (lastWord !== undefined) {
            const isLineStart = this.nextLineWords.length === 0;
            const cost = lastWord.length + (isLineStart ? 0 : 1);
            this.nextLineAvailableChars += cost;
        }
        return lastWord;
    }
    /**
   * Concat a word to the last word already in the builder.
   * Adds a new word in case there are no words yet in the last line.
   *
   * @param { string } word A word to be concatenated.
   * @param { boolean } [noWrap] Don't wrap text even if the line is too long.
   */ concatWord(word, noWrap = false) {
        if (this.wordBreakOpportunity && word.length > this.nextLineAvailableChars) {
            this.pushWord(word, noWrap);
            this.wordBreakOpportunity = false;
        } else {
            const lastWord = this.popWord();
            this.pushWord(lastWord ? lastWord.concat(word) : word, noWrap);
        }
    }
    /**
   * Add current line (and more empty lines if provided argument > 1) to the list of complete lines and start a new one.
   *
   * @param { number } n Number of line breaks that will be added to the resulting string.
   */ startNewLine(n = 1) {
        this.lines.push(this.nextLineWords);
        if (n > 1) {
            this.lines.push(...Array.from({
                length: n - 1
            }, ()=>[]));
        }
        this.nextLineWords = [];
        this.nextLineAvailableChars = this.maxLineLength;
    }
    /**
   * No words in this builder.
   *
   * @returns { boolean }
   */ isEmpty() {
        return this.lines.length === 0 && this.nextLineWords.length === 0;
    }
    clear() {
        this.lines.length = 0;
        this.nextLineWords.length = 0;
        this.nextLineAvailableChars = this.maxLineLength;
    }
    /**
   * Join all lines of words inside the InlineTextBuilder into a complete string.
   *
   * @returns { string }
   */ toString() {
        return [
            ...this.lines,
            this.nextLineWords
        ].map((words)=>words.join(' ')).join('\n');
    }
    /**
   * Split a long word up to fit within the word wrap limit.
   * Use either a character to split looking back from the word wrap limit,
   * or truncate to the word wrap limit.
   *
   * @param   { string }   word Input word.
   * @returns { string[] }      Parts of the word.
   */ splitLongWord(word) {
        const parts = [];
        let idx = 0;
        while(word.length > this.maxLineLength){
            const firstLine = word.substring(0, this.maxLineLength);
            const remainingChars = word.substring(this.maxLineLength);
            const splitIndex = firstLine.lastIndexOf(this.wrapCharacters[idx]);
            if (splitIndex > -1) {
                word = firstLine.substring(splitIndex + 1) + remainingChars;
                parts.push(firstLine.substring(0, splitIndex + 1));
            } else {
                idx++;
                if (idx < this.wrapCharacters.length) {
                    word = firstLine + remainingChars;
                } else {
                    if (this.forceWrapOnLimit) {
                        parts.push(firstLine);
                        word = remainingChars;
                        if (word.length > this.maxLineLength) {
                            continue;
                        }
                    } else {
                        word = firstLine + remainingChars;
                    }
                    break;
                }
            }
        }
        parts.push(word); // Add remaining part to array
        return parts;
    }
}
/* eslint-disable max-classes-per-file */ class StackItem {
    constructor(next = null){
        this.next = next;
    }
    getRoot() {
        return this.next ? this.next : this;
    }
}
class BlockStackItem extends StackItem {
    constructor(options, next = null, leadingLineBreaks = 1, maxLineLength = undefined){
        super(next);
        this.leadingLineBreaks = leadingLineBreaks;
        this.inlineTextBuilder = new InlineTextBuilder(options, maxLineLength);
        this.rawText = '';
        this.stashedLineBreaks = 0;
        this.isPre = next && next.isPre;
        this.isNoWrap = next && next.isNoWrap;
    }
}
class ListStackItem extends BlockStackItem {
    constructor(options, next = null, { interRowLineBreaks = 1, leadingLineBreaks = 2, maxLineLength = undefined, maxPrefixLength = 0, prefixAlign = 'left' } = {}){
        super(options, next, leadingLineBreaks, maxLineLength);
        this.maxPrefixLength = maxPrefixLength;
        this.prefixAlign = prefixAlign;
        this.interRowLineBreaks = interRowLineBreaks;
    }
}
class ListItemStackItem extends BlockStackItem {
    constructor(options, next = null, { leadingLineBreaks = 1, maxLineLength = undefined, prefix = '' } = {}){
        super(options, next, leadingLineBreaks, maxLineLength);
        this.prefix = prefix;
    }
}
class TableStackItem extends StackItem {
    constructor(next = null){
        super(next);
        this.rows = [];
        this.isPre = next && next.isPre;
        this.isNoWrap = next && next.isNoWrap;
    }
}
class TableRowStackItem extends StackItem {
    constructor(next = null){
        super(next);
        this.cells = [];
        this.isPre = next && next.isPre;
        this.isNoWrap = next && next.isNoWrap;
    }
}
class TableCellStackItem extends StackItem {
    constructor(options, next = null, maxColumnWidth = undefined){
        super(next);
        this.inlineTextBuilder = new InlineTextBuilder(options, maxColumnWidth);
        this.rawText = '';
        this.stashedLineBreaks = 0;
        this.isPre = next && next.isPre;
        this.isNoWrap = next && next.isNoWrap;
    }
}
class TransformerStackItem extends StackItem {
    constructor(next = null, transform){
        super(next);
        this.transform = transform;
    }
}
function charactersToCodes(str) {
    return [
        ...str
    ].map((c)=>'\\u' + c.charCodeAt(0).toString(16).padStart(4, '0')).join('');
}
/**
 * Helps to handle HTML whitespaces.
 *
 * @class WhitespaceProcessor
 */ class WhitespaceProcessor {
    /**
   * Creates an instance of WhitespaceProcessor.
   *
   * @param { Options } options    HtmlToText options.
   * @memberof WhitespaceProcessor
   */ constructor(options){
        this.whitespaceChars = options.preserveNewlines ? options.whitespaceCharacters.replace(/\n/g, '') : options.whitespaceCharacters;
        const whitespaceCodes = charactersToCodes(this.whitespaceChars);
        this.leadingWhitespaceRe = new RegExp(`^[${whitespaceCodes}]`);
        this.trailingWhitespaceRe = new RegExp(`[${whitespaceCodes}]$`);
        this.allWhitespaceOrEmptyRe = new RegExp(`^[${whitespaceCodes}]*$`);
        this.newlineOrNonWhitespaceRe = new RegExp(`(\\n|[^\\n${whitespaceCodes}])`, 'g');
        this.newlineOrNonNewlineStringRe = new RegExp(`(\\n|[^\\n]+)`, 'g');
        if (options.preserveNewlines) {
            const wordOrNewlineRe = new RegExp(`\\n|[^\\n${whitespaceCodes}]+`, 'gm');
            /**
       * Shrink whitespaces and wrap text, add to the builder.
       *
       * @param { string }                  text              Input text.
       * @param { InlineTextBuilder }       inlineTextBuilder A builder to receive processed text.
       * @param { (str: string) => string } [ transform ]     A transform to be applied to words.
       * @param { boolean }                 [noWrap] Don't wrap text even if the line is too long.
       */ this.shrinkWrapAdd = function(text, inlineTextBuilder, transform = (str)=>str, noWrap = false) {
                if (!text) {
                    return;
                }
                const previouslyStashedSpace = inlineTextBuilder.stashedSpace;
                let anyMatch = false;
                let m = wordOrNewlineRe.exec(text);
                if (m) {
                    anyMatch = true;
                    if (m[0] === '\n') {
                        inlineTextBuilder.startNewLine();
                    } else if (previouslyStashedSpace || this.testLeadingWhitespace(text)) {
                        inlineTextBuilder.pushWord(transform(m[0]), noWrap);
                    } else {
                        inlineTextBuilder.concatWord(transform(m[0]), noWrap);
                    }
                    while((m = wordOrNewlineRe.exec(text)) !== null){
                        if (m[0] === '\n') {
                            inlineTextBuilder.startNewLine();
                        } else {
                            inlineTextBuilder.pushWord(transform(m[0]), noWrap);
                        }
                    }
                }
                inlineTextBuilder.stashedSpace = previouslyStashedSpace && !anyMatch || this.testTrailingWhitespace(text);
            // No need to stash a space in case last added item was a new line,
            // but that won't affect anything later anyway.
            };
        } else {
            const wordRe = new RegExp(`[^${whitespaceCodes}]+`, 'g');
            this.shrinkWrapAdd = function(text, inlineTextBuilder, transform = (str)=>str, noWrap = false) {
                if (!text) {
                    return;
                }
                const previouslyStashedSpace = inlineTextBuilder.stashedSpace;
                let anyMatch = false;
                let m = wordRe.exec(text);
                if (m) {
                    anyMatch = true;
                    if (previouslyStashedSpace || this.testLeadingWhitespace(text)) {
                        inlineTextBuilder.pushWord(transform(m[0]), noWrap);
                    } else {
                        inlineTextBuilder.concatWord(transform(m[0]), noWrap);
                    }
                    while((m = wordRe.exec(text)) !== null){
                        inlineTextBuilder.pushWord(transform(m[0]), noWrap);
                    }
                }
                inlineTextBuilder.stashedSpace = previouslyStashedSpace && !anyMatch || this.testTrailingWhitespace(text);
            };
        }
    }
    /**
   * Add text with only minimal processing.
   * Everything between newlines considered a single word.
   * No whitespace is trimmed.
   * Not affected by preserveNewlines option - `\n` always starts a new line.
   *
   * `noWrap` argument is `true` by default - this won't start a new line
   * even if there is not enough space left in the current line.
   *
   * @param { string }            text              Input text.
   * @param { InlineTextBuilder } inlineTextBuilder A builder to receive processed text.
   * @param { boolean }           [noWrap] Don't wrap text even if the line is too long.
   */ addLiteral(text, inlineTextBuilder, noWrap = true) {
        if (!text) {
            return;
        }
        const previouslyStashedSpace = inlineTextBuilder.stashedSpace;
        let anyMatch = false;
        let m = this.newlineOrNonNewlineStringRe.exec(text);
        if (m) {
            anyMatch = true;
            if (m[0] === '\n') {
                inlineTextBuilder.startNewLine();
            } else if (previouslyStashedSpace) {
                inlineTextBuilder.pushWord(m[0], noWrap);
            } else {
                inlineTextBuilder.concatWord(m[0], noWrap);
            }
            while((m = this.newlineOrNonNewlineStringRe.exec(text)) !== null){
                if (m[0] === '\n') {
                    inlineTextBuilder.startNewLine();
                } else {
                    inlineTextBuilder.pushWord(m[0], noWrap);
                }
            }
        }
        inlineTextBuilder.stashedSpace = previouslyStashedSpace && !anyMatch;
    }
    /**
   * Test whether the given text starts with HTML whitespace character.
   *
   * @param   { string }  text  The string to test.
   * @returns { boolean }
   */ testLeadingWhitespace(text) {
        return this.leadingWhitespaceRe.test(text);
    }
    /**
   * Test whether the given text ends with HTML whitespace character.
   *
   * @param   { string }  text  The string to test.
   * @returns { boolean }
   */ testTrailingWhitespace(text) {
        return this.trailingWhitespaceRe.test(text);
    }
    /**
   * Test whether the given text contains any non-whitespace characters.
   *
   * @param   { string }  text  The string to test.
   * @returns { boolean }
   */ testContainsWords(text) {
        return !this.allWhitespaceOrEmptyRe.test(text);
    }
    /**
   * Return the number of newlines if there are no words.
   *
   * If any word is found then return zero regardless of the actual number of newlines.
   *
   * @param   { string }  text  Input string.
   * @returns { number }
   */ countNewlinesNoWords(text) {
        this.newlineOrNonWhitespaceRe.lastIndex = 0;
        let counter = 0;
        let match;
        while((match = this.newlineOrNonWhitespaceRe.exec(text)) !== null){
            if (match[0] === '\n') {
                counter++;
            } else {
                return 0;
            }
        }
        return counter;
    }
}
/**
 * Helps to build text from inline and block elements.
 *
 * @class BlockTextBuilder
 */ class BlockTextBuilder {
    /**
   * Creates an instance of BlockTextBuilder.
   *
   * @param { Options } options HtmlToText options.
   * @param { import('selderee').Picker<DomNode, TagDefinition> } picker Selectors decision tree picker.
   * @param { any} [metadata] Optional metadata for HTML document, for use in formatters.
   */ constructor(options, picker, metadata = undefined){
        this.options = options;
        this.picker = picker;
        this.metadata = metadata;
        this.whitespaceProcessor = new WhitespaceProcessor(options);
        /** @type { StackItem } */ this._stackItem = new BlockStackItem(options);
        /** @type { TransformerStackItem } */ this._wordTransformer = undefined;
    }
    /**
   * Put a word-by-word transform function onto the transformations stack.
   *
   * Mainly used for uppercasing. Can be bypassed to add unformatted text such as URLs.
   *
   * Word transformations applied before wrapping.
   *
   * @param { (str: string) => string } wordTransform Word transformation function.
   */ pushWordTransform(wordTransform) {
        this._wordTransformer = new TransformerStackItem(this._wordTransformer, wordTransform);
    }
    /**
   * Remove a function from the word transformations stack.
   *
   * @returns { (str: string) => string } A function that was removed.
   */ popWordTransform() {
        if (!this._wordTransformer) {
            return undefined;
        }
        const transform = this._wordTransformer.transform;
        this._wordTransformer = this._wordTransformer.next;
        return transform;
    }
    /**
   * Ignore wordwrap option in followup inline additions and disable automatic wrapping.
   */ startNoWrap() {
        this._stackItem.isNoWrap = true;
    }
    /**
   * Return automatic wrapping to behavior defined by options.
   */ stopNoWrap() {
        this._stackItem.isNoWrap = false;
    }
    /** @returns { (str: string) => string } */ _getCombinedWordTransformer() {
        const wt = this._wordTransformer ? (str)=>applyTransformer(str, this._wordTransformer) : undefined;
        const ce = this.options.encodeCharacters;
        return wt ? ce ? (str)=>ce(wt(str)) : wt : ce;
    }
    _popStackItem() {
        const item = this._stackItem;
        this._stackItem = item.next;
        return item;
    }
    /**
   * Add a line break into currently built block.
   */ addLineBreak() {
        if (!(this._stackItem instanceof BlockStackItem || this._stackItem instanceof ListItemStackItem || this._stackItem instanceof TableCellStackItem)) {
            return;
        }
        if (this._stackItem.isPre) {
            this._stackItem.rawText += '\n';
        } else {
            this._stackItem.inlineTextBuilder.startNewLine();
        }
    }
    /**
   * Allow to break line in case directly following text will not fit.
   */ addWordBreakOpportunity() {
        if (this._stackItem instanceof BlockStackItem || this._stackItem instanceof ListItemStackItem || this._stackItem instanceof TableCellStackItem) {
            this._stackItem.inlineTextBuilder.wordBreakOpportunity = true;
        }
    }
    /**
   * Add a node inline into the currently built block.
   *
   * @param { string } str
   * Text content of a node to add.
   *
   * @param { object } [param1]
   * Object holding the parameters of the operation.
   *
   * @param { boolean } [param1.noWordTransform]
   * Ignore word transformers if there are any.
   * Don't encode characters as well.
   * (Use this for things like URL addresses).
   */ addInline(str, { noWordTransform = false } = {}) {
        if (!(this._stackItem instanceof BlockStackItem || this._stackItem instanceof ListItemStackItem || this._stackItem instanceof TableCellStackItem)) {
            return;
        }
        if (this._stackItem.isPre) {
            this._stackItem.rawText += str;
            return;
        }
        if (str.length === 0 || this._stackItem.stashedLineBreaks && // stashed linebreaks make whitespace irrelevant
        !this.whitespaceProcessor.testContainsWords(str) // no words to add
        ) {
            return;
        }
        if (this.options.preserveNewlines) {
            const newlinesNumber = this.whitespaceProcessor.countNewlinesNoWords(str);
            if (newlinesNumber > 0) {
                this._stackItem.inlineTextBuilder.startNewLine(newlinesNumber);
                // keep stashedLineBreaks unchanged
                return;
            }
        }
        if (this._stackItem.stashedLineBreaks) {
            this._stackItem.inlineTextBuilder.startNewLine(this._stackItem.stashedLineBreaks);
        }
        this.whitespaceProcessor.shrinkWrapAdd(str, this._stackItem.inlineTextBuilder, noWordTransform ? undefined : this._getCombinedWordTransformer(), this._stackItem.isNoWrap);
        this._stackItem.stashedLineBreaks = 0; // inline text doesn't introduce line breaks
    }
    /**
   * Add a string inline into the currently built block.
   *
   * Use this for markup elements that don't have to adhere
   * to text layout rules.
   *
   * @param { string } str Text to add.
   */ addLiteral(str) {
        if (!(this._stackItem instanceof BlockStackItem || this._stackItem instanceof ListItemStackItem || this._stackItem instanceof TableCellStackItem)) {
            return;
        }
        if (str.length === 0) {
            return;
        }
        if (this._stackItem.isPre) {
            this._stackItem.rawText += str;
            return;
        }
        if (this._stackItem.stashedLineBreaks) {
            this._stackItem.inlineTextBuilder.startNewLine(this._stackItem.stashedLineBreaks);
        }
        this.whitespaceProcessor.addLiteral(str, this._stackItem.inlineTextBuilder, this._stackItem.isNoWrap);
        this._stackItem.stashedLineBreaks = 0;
    }
    /**
   * Start building a new block.
   *
   * @param { object } [param0]
   * Object holding the parameters of the block.
   *
   * @param { number } [param0.leadingLineBreaks]
   * This block should have at least this number of line breaks to separate it from any preceding block.
   *
   * @param { number }  [param0.reservedLineLength]
   * Reserve this number of characters on each line for block markup.
   *
   * @param { boolean } [param0.isPre]
   * Should HTML whitespace be preserved inside this block.
   */ openBlock({ leadingLineBreaks = 1, reservedLineLength = 0, isPre = false } = {}) {
        const maxLineLength = Math.max(20, this._stackItem.inlineTextBuilder.maxLineLength - reservedLineLength);
        this._stackItem = new BlockStackItem(this.options, this._stackItem, leadingLineBreaks, maxLineLength);
        if (isPre) {
            this._stackItem.isPre = true;
        }
    }
    /**
   * Finalize currently built block, add it's content to the parent block.
   *
   * @param { object } [param0]
   * Object holding the parameters of the block.
   *
   * @param { number } [param0.trailingLineBreaks]
   * This block should have at least this number of line breaks to separate it from any following block.
   *
   * @param { (str: string) => string } [param0.blockTransform]
   * A function to transform the block text before adding to the parent block.
   * This happens after word wrap and should be used in combination with reserved line length
   * in order to keep line lengths correct.
   * Used for whole block markup.
   */ closeBlock({ trailingLineBreaks = 1, blockTransform = undefined } = {}) {
        const block = this._popStackItem();
        const blockText = blockTransform ? blockTransform(getText(block)) : getText(block);
        addText(this._stackItem, blockText, block.leadingLineBreaks, Math.max(block.stashedLineBreaks, trailingLineBreaks));
    }
    /**
   * Start building a new list.
   *
   * @param { object } [param0]
   * Object holding the parameters of the list.
   *
   * @param { number } [param0.maxPrefixLength]
   * Length of the longest list item prefix.
   * If not supplied or too small then list items won't be aligned properly.
   *
   * @param { 'left' | 'right' } [param0.prefixAlign]
   * Specify how prefixes of different lengths have to be aligned
   * within a column.
   *
   * @param { number } [param0.interRowLineBreaks]
   * Minimum number of line breaks between list items.
   *
   * @param { number } [param0.leadingLineBreaks]
   * This list should have at least this number of line breaks to separate it from any preceding block.
   */ openList({ maxPrefixLength = 0, prefixAlign = 'left', interRowLineBreaks = 1, leadingLineBreaks = 2 } = {}) {
        this._stackItem = new ListStackItem(this.options, this._stackItem, {
            interRowLineBreaks: interRowLineBreaks,
            leadingLineBreaks: leadingLineBreaks,
            maxLineLength: this._stackItem.inlineTextBuilder.maxLineLength,
            maxPrefixLength: maxPrefixLength,
            prefixAlign: prefixAlign
        });
    }
    /**
   * Start building a new list item.
   *
   * @param {object} param0
   * Object holding the parameters of the list item.
   *
   * @param { string } [param0.prefix]
   * Prefix for this list item (item number, bullet point, etc).
   */ openListItem({ prefix = '' } = {}) {
        if (!(this._stackItem instanceof ListStackItem)) {
            throw new Error('Can\'t add a list item to something that is not a list! Check the formatter.');
        }
        const list = this._stackItem;
        const prefixLength = Math.max(prefix.length, list.maxPrefixLength);
        const maxLineLength = Math.max(20, list.inlineTextBuilder.maxLineLength - prefixLength);
        this._stackItem = new ListItemStackItem(this.options, list, {
            prefix: prefix,
            maxLineLength: maxLineLength,
            leadingLineBreaks: list.interRowLineBreaks
        });
    }
    /**
   * Finalize currently built list item, add it's content to the parent list.
   */ closeListItem() {
        const listItem = this._popStackItem();
        const list = listItem.next;
        const prefixLength = Math.max(listItem.prefix.length, list.maxPrefixLength);
        const spacing = '\n' + ' '.repeat(prefixLength);
        const prefix = list.prefixAlign === 'right' ? listItem.prefix.padStart(prefixLength) : listItem.prefix.padEnd(prefixLength);
        const text = prefix + getText(listItem).replace(/\n/g, spacing);
        addText(list, text, listItem.leadingLineBreaks, Math.max(listItem.stashedLineBreaks, list.interRowLineBreaks));
    }
    /**
   * Finalize currently built list, add it's content to the parent block.
   *
   * @param { object } param0
   * Object holding the parameters of the list.
   *
   * @param { number } [param0.trailingLineBreaks]
   * This list should have at least this number of line breaks to separate it from any following block.
   */ closeList({ trailingLineBreaks = 2 } = {}) {
        const list = this._popStackItem();
        const text = getText(list);
        if (text) {
            addText(this._stackItem, text, list.leadingLineBreaks, trailingLineBreaks);
        }
    }
    /**
   * Start building a table.
   */ openTable() {
        this._stackItem = new TableStackItem(this._stackItem);
    }
    /**
   * Start building a table row.
   */ openTableRow() {
        if (!(this._stackItem instanceof TableStackItem)) {
            throw new Error('Can\'t add a table row to something that is not a table! Check the formatter.');
        }
        this._stackItem = new TableRowStackItem(this._stackItem);
    }
    /**
   * Start building a table cell.
   *
   * @param { object } [param0]
   * Object holding the parameters of the cell.
   *
   * @param { number } [param0.maxColumnWidth]
   * Wrap cell content to this width. Fall back to global wordwrap value if undefined.
   */ openTableCell({ maxColumnWidth = undefined } = {}) {
        if (!(this._stackItem instanceof TableRowStackItem)) {
            throw new Error('Can\'t add a table cell to something that is not a table row! Check the formatter.');
        }
        this._stackItem = new TableCellStackItem(this.options, this._stackItem, maxColumnWidth);
    }
    /**
   * Finalize currently built table cell and add it to parent table row's cells.
   *
   * @param { object } [param0]
   * Object holding the parameters of the cell.
   *
   * @param { number } [param0.colspan] How many columns this cell should occupy.
   * @param { number } [param0.rowspan] How many rows this cell should occupy.
   */ closeTableCell({ colspan = 1, rowspan = 1 } = {}) {
        const cell = this._popStackItem();
        const text = trimCharacter(getText(cell), '\n');
        cell.next.cells.push({
            colspan: colspan,
            rowspan: rowspan,
            text: text
        });
    }
    /**
   * Finalize currently built table row and add it to parent table's rows.
   */ closeTableRow() {
        const row = this._popStackItem();
        row.next.rows.push(row.cells);
    }
    /**
   * Finalize currently built table and add the rendered text to the parent block.
   *
   * @param { object } param0
   * Object holding the parameters of the table.
   *
   * @param { TablePrinter } param0.tableToString
   * A function to convert a table of stringified cells into a complete table.
   *
   * @param { number } [param0.leadingLineBreaks]
   * This table should have at least this number of line breaks to separate if from any preceding block.
   *
   * @param { number } [param0.trailingLineBreaks]
   * This table should have at least this number of line breaks to separate it from any following block.
   */ closeTable({ tableToString, leadingLineBreaks = 2, trailingLineBreaks = 2 }) {
        const table = this._popStackItem();
        const output = tableToString(table.rows);
        if (output) {
            addText(this._stackItem, output, leadingLineBreaks, trailingLineBreaks);
        }
    }
    /**
   * Return the rendered text content of this builder.
   *
   * @returns { string }
   */ toString() {
        return getText(this._stackItem.getRoot());
    // There should only be the root item if everything is closed properly.
    }
}
function getText(stackItem) {
    if (!(stackItem instanceof BlockStackItem || stackItem instanceof ListItemStackItem || stackItem instanceof TableCellStackItem)) {
        throw new Error('Only blocks, list items and table cells can be requested for text contents.');
    }
    return stackItem.inlineTextBuilder.isEmpty() ? stackItem.rawText : stackItem.rawText + stackItem.inlineTextBuilder.toString();
}
function addText(stackItem, text, leadingLineBreaks, trailingLineBreaks) {
    if (!(stackItem instanceof BlockStackItem || stackItem instanceof ListItemStackItem || stackItem instanceof TableCellStackItem)) {
        throw new Error('Only blocks, list items and table cells can contain text.');
    }
    const parentText = getText(stackItem);
    const lineBreaks = Math.max(stackItem.stashedLineBreaks, leadingLineBreaks);
    stackItem.inlineTextBuilder.clear();
    if (parentText) {
        stackItem.rawText = parentText + '\n'.repeat(lineBreaks) + text;
    } else {
        stackItem.rawText = text;
        stackItem.leadingLineBreaks = lineBreaks;
    }
    stackItem.stashedLineBreaks = trailingLineBreaks;
}
/**
 * @param { string } str A string to transform.
 * @param { TransformerStackItem } transformer A transformer item (with possible continuation).
 * @returns { string }
 */ function applyTransformer(str, transformer) {
    return transformer ? applyTransformer(transformer.transform(str), transformer.next) : str;
}
/**
 * Compile selectors into a decision tree,
 * return a function intended for batch processing.
 *
 * @param   { Options } [options = {}]   HtmlToText options (defaults, formatters, user options merged, deduplicated).
 * @returns { (html: string, metadata?: any) => string } Pre-configured converter function.
 * @static
 */ function compile$1(options = {}) {
    const selectorsWithoutFormat = options.selectors.filter((s)=>!s.format);
    if (selectorsWithoutFormat.length) {
        throw new Error('Following selectors have no specified format: ' + selectorsWithoutFormat.map((s)=>`\`${s.selector}\``).join(', '));
    }
    const picker = new selderee.DecisionTree(options.selectors.map((s)=>[
            s.selector,
            s
        ])).build(pluginHtmlparser2.hp2Builder);
    if (typeof options.encodeCharacters !== 'function') {
        options.encodeCharacters = makeReplacerFromDict(options.encodeCharacters);
    }
    const baseSelectorsPicker = new selderee.DecisionTree(options.baseElements.selectors.map((s, i)=>[
            s,
            i + 1
        ])).build(pluginHtmlparser2.hp2Builder);
    function findBaseElements(dom) {
        return findBases(dom, options, baseSelectorsPicker);
    }
    const limitedWalk = limitedDepthRecursive(options.limits.maxDepth, recursiveWalk, function(dom, builder) {
        builder.addInline(options.limits.ellipsis || '');
    });
    return function(html, metadata = undefined) {
        return process(html, metadata, options, picker, findBaseElements, limitedWalk);
    };
}
/**
 * Convert given HTML according to preprocessed options.
 *
 * @param { string } html HTML content to convert.
 * @param { any } metadata Optional metadata for HTML document, for use in formatters.
 * @param { Options } options HtmlToText options (preprocessed).
 * @param { import('selderee').Picker<DomNode, TagDefinition> } picker
 * Tag definition picker for DOM nodes processing.
 * @param { (dom: DomNode[]) => DomNode[] } findBaseElements
 * Function to extract elements from HTML DOM
 * that will only be present in the output text.
 * @param { RecursiveCallback } walk Recursive callback.
 * @returns { string }
 */ function process(html, metadata, options, picker, findBaseElements, walk) {
    const maxInputLength = options.limits.maxInputLength;
    if (maxInputLength && html && html.length > maxInputLength) {
        console.warn(`Input length ${html.length} is above allowed limit of ${maxInputLength}. Truncating without ellipsis.`);
        html = html.substring(0, maxInputLength);
    }
    const document = htmlparser2.parseDocument(html, {
        decodeEntities: options.decodeEntities
    });
    const bases = findBaseElements(document.children);
    const builder = new BlockTextBuilder(options, picker, metadata);
    walk(bases, builder);
    return builder.toString();
}
function findBases(dom, options, baseSelectorsPicker) {
    const results = [];
    function recursiveWalk(walk, /** @type { DomNode[] } */ dom) {
        dom = dom.slice(0, options.limits.maxChildNodes);
        for (const elem of dom){
            if (elem.type !== 'tag') {
                continue;
            }
            const pickedSelectorIndex = baseSelectorsPicker.pick1(elem);
            if (pickedSelectorIndex > 0) {
                results.push({
                    selectorIndex: pickedSelectorIndex,
                    element: elem
                });
            } else if (elem.children) {
                walk(elem.children);
            }
            if (results.length >= options.limits.maxBaseElements) {
                return;
            }
        }
    }
    const limitedWalk = limitedDepthRecursive(options.limits.maxDepth, recursiveWalk);
    limitedWalk(dom);
    if (options.baseElements.orderBy !== 'occurrence') {
        results.sort((a, b)=>a.selectorIndex - b.selectorIndex);
    }
    return options.baseElements.returnDomByDefault && results.length === 0 ? dom : results.map((x)=>x.element);
}
/**
 * Function to walk through DOM nodes and accumulate their string representations.
 *
 * @param   { RecursiveCallback } walk    Recursive callback.
 * @param   { DomNode[] }         [dom]   Nodes array to process.
 * @param   { BlockTextBuilder }  builder Passed around to accumulate output text.
 * @private
 */ function recursiveWalk(walk, dom, builder) {
    if (!dom) {
        return;
    }
    const options = builder.options;
    const tooManyChildNodes = dom.length > options.limits.maxChildNodes;
    if (tooManyChildNodes) {
        dom = dom.slice(0, options.limits.maxChildNodes);
        dom.push({
            data: options.limits.ellipsis,
            type: 'text'
        });
    }
    for (const elem of dom){
        switch(elem.type){
            case 'text':
                {
                    builder.addInline(elem.data);
                    break;
                }
            case 'tag':
                {
                    const tagDefinition = builder.picker.pick1(elem);
                    const format = options.formatters[tagDefinition.format];
                    format(elem, walk, builder, tagDefinition.options || {});
                    break;
                }
        }
    }
    return;
}
/**
 * @param { Object<string,string | false> } dict
 * A dictionary where keys are characters to replace
 * and values are replacement strings.
 *
 * First code point from dict keys is used.
 * Compound emojis with ZWJ are not supported (not until Node 16).
 *
 * @returns { ((str: string) => string) | undefined }
 */ function makeReplacerFromDict(dict) {
    if (!dict || Object.keys(dict).length === 0) {
        return undefined;
    }
    /** @type { [string, string][] } */ const entries = Object.entries(dict).filter(([, v])=>v !== false);
    const regex = new RegExp(entries.map(([c])=>`(${unicodeEscape([
            ...c
        ][0])})`).join('|'), 'g');
    const values = entries.map(([, v])=>v);
    const replacer = (m, ...cgs)=>values[cgs.findIndex((cg)=>cg)];
    return (str)=>str.replace(regex, replacer);
}
/**
 * Dummy formatter that discards the input and does nothing.
 *
 * @type { FormatCallback }
 */ function formatSkip(elem, walk, builder, formatOptions) {
/* do nothing */ }
/**
 * Insert the given string literal inline instead of a tag.
 *
 * @type { FormatCallback }
 */ function formatInlineString(elem, walk, builder, formatOptions) {
    builder.addLiteral(formatOptions.string || '');
}
/**
 * Insert a block with the given string literal instead of a tag.
 *
 * @type { FormatCallback }
 */ function formatBlockString(elem, walk, builder, formatOptions) {
    builder.openBlock({
        leadingLineBreaks: formatOptions.leadingLineBreaks || 2
    });
    builder.addLiteral(formatOptions.string || '');
    builder.closeBlock({
        trailingLineBreaks: formatOptions.trailingLineBreaks || 2
    });
}
/**
 * Process an inline-level element.
 *
 * @type { FormatCallback }
 */ function formatInline(elem, walk, builder, formatOptions) {
    walk(elem.children, builder);
}
/**
 * Process a block-level container.
 *
 * @type { FormatCallback }
 */ function formatBlock$1(elem, walk, builder, formatOptions) {
    builder.openBlock({
        leadingLineBreaks: formatOptions.leadingLineBreaks || 2
    });
    walk(elem.children, builder);
    builder.closeBlock({
        trailingLineBreaks: formatOptions.trailingLineBreaks || 2
    });
}
function renderOpenTag(elem) {
    const attrs = elem.attribs && elem.attribs.length ? ' ' + Object.entries(elem.attribs).map(([k, v])=>v === '' ? k : `${k}=${v.replace(/"/g, '&quot;')}`).join(' ') : '';
    return `<${elem.name}${attrs}>`;
}
function renderCloseTag(elem) {
    return `</${elem.name}>`;
}
/**
 * Render an element as inline HTML tag, walk through it's children.
 *
 * @type { FormatCallback }
 */ function formatInlineTag(elem, walk, builder, formatOptions) {
    builder.startNoWrap();
    builder.addLiteral(renderOpenTag(elem));
    builder.stopNoWrap();
    walk(elem.children, builder);
    builder.startNoWrap();
    builder.addLiteral(renderCloseTag(elem));
    builder.stopNoWrap();
}
/**
 * Render an element as HTML block bag, walk through it's children.
 *
 * @type { FormatCallback }
 */ function formatBlockTag(elem, walk, builder, formatOptions) {
    builder.openBlock({
        leadingLineBreaks: formatOptions.leadingLineBreaks || 2
    });
    builder.startNoWrap();
    builder.addLiteral(renderOpenTag(elem));
    builder.stopNoWrap();
    walk(elem.children, builder);
    builder.startNoWrap();
    builder.addLiteral(renderCloseTag(elem));
    builder.stopNoWrap();
    builder.closeBlock({
        trailingLineBreaks: formatOptions.trailingLineBreaks || 2
    });
}
/**
 * Render an element with all it's children as inline HTML.
 *
 * @type { FormatCallback }
 */ function formatInlineHtml(elem, walk, builder, formatOptions) {
    builder.startNoWrap();
    builder.addLiteral(domSerializer.render(elem, {
        decodeEntities: builder.options.decodeEntities
    }));
    builder.stopNoWrap();
}
/**
 * Render an element with all it's children as HTML block.
 *
 * @type { FormatCallback }
 */ function formatBlockHtml(elem, walk, builder, formatOptions) {
    builder.openBlock({
        leadingLineBreaks: formatOptions.leadingLineBreaks || 2
    });
    builder.startNoWrap();
    builder.addLiteral(domSerializer.render(elem, {
        decodeEntities: builder.options.decodeEntities
    }));
    builder.stopNoWrap();
    builder.closeBlock({
        trailingLineBreaks: formatOptions.trailingLineBreaks || 2
    });
}
/**
 * Render inline element wrapped with given strings.
 *
 * @type { FormatCallback }
 */ function formatInlineSurround(elem, walk, builder, formatOptions) {
    builder.addLiteral(formatOptions.prefix || '');
    walk(elem.children, builder);
    builder.addLiteral(formatOptions.suffix || '');
}
var genericFormatters = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    block: formatBlock$1,
    blockHtml: formatBlockHtml,
    blockString: formatBlockString,
    blockTag: formatBlockTag,
    inline: formatInline,
    inlineHtml: formatInlineHtml,
    inlineString: formatInlineString,
    inlineSurround: formatInlineSurround,
    inlineTag: formatInlineTag,
    skip: formatSkip
});
function getRow(matrix, j) {
    if (!matrix[j]) {
        matrix[j] = [];
    }
    return matrix[j];
}
function findFirstVacantIndex(row, x = 0) {
    while(row[x]){
        x++;
    }
    return x;
}
function transposeInPlace(matrix, maxSize) {
    for(let i = 0; i < maxSize; i++){
        const rowI = getRow(matrix, i);
        for(let j = 0; j < i; j++){
            const rowJ = getRow(matrix, j);
            if (rowI[j] || rowJ[i]) {
                const temp = rowI[j];
                rowI[j] = rowJ[i];
                rowJ[i] = temp;
            }
        }
    }
}
function putCellIntoLayout(cell, layout, baseRow, baseCol) {
    for(let r = 0; r < cell.rowspan; r++){
        const layoutRow = getRow(layout, baseRow + r);
        for(let c = 0; c < cell.colspan; c++){
            layoutRow[baseCol + c] = cell;
        }
    }
}
function getOrInitOffset(offsets, index) {
    if (offsets[index] === undefined) {
        offsets[index] = index === 0 ? 0 : 1 + getOrInitOffset(offsets, index - 1);
    }
    return offsets[index];
}
function updateOffset(offsets, base, span, value) {
    offsets[base + span] = Math.max(getOrInitOffset(offsets, base + span), getOrInitOffset(offsets, base) + value);
}
/**
 * Render a table into a string.
 * Cells can contain multiline text and span across multiple rows and columns.
 *
 * Modifies cells to add lines array.
 *
 * @param { TablePrinterCell[][] } tableRows Table to render.
 * @param { number } rowSpacing Number of spaces between columns.
 * @param { number } colSpacing Number of empty lines between rows.
 * @returns { string }
 */ function tableToString(tableRows, rowSpacing, colSpacing) {
    const layout = [];
    let colNumber = 0;
    const rowNumber = tableRows.length;
    const rowOffsets = [
        0
    ];
    // Fill the layout table and row offsets row-by-row.
    for(let j = 0; j < rowNumber; j++){
        const layoutRow = getRow(layout, j);
        const cells = tableRows[j];
        let x = 0;
        for(let i = 0; i < cells.length; i++){
            const cell = cells[i];
            x = findFirstVacantIndex(layoutRow, x);
            putCellIntoLayout(cell, layout, j, x);
            x += cell.colspan;
            cell.lines = cell.text.split('\n');
            const cellHeight = cell.lines.length;
            updateOffset(rowOffsets, j, cell.rowspan, cellHeight + rowSpacing);
        }
        colNumber = layoutRow.length > colNumber ? layoutRow.length : colNumber;
    }
    transposeInPlace(layout, rowNumber > colNumber ? rowNumber : colNumber);
    const outputLines = [];
    const colOffsets = [
        0
    ];
    // Fill column offsets and output lines column-by-column.
    for(let x = 0; x < colNumber; x++){
        let y = 0;
        let cell;
        const rowsInThisColumn = Math.min(rowNumber, layout[x].length);
        while(y < rowsInThisColumn){
            cell = layout[x][y];
            if (cell) {
                if (!cell.rendered) {
                    let cellWidth = 0;
                    for(let j = 0; j < cell.lines.length; j++){
                        const line = cell.lines[j];
                        const lineOffset = rowOffsets[y] + j;
                        outputLines[lineOffset] = (outputLines[lineOffset] || '').padEnd(colOffsets[x]) + line;
                        cellWidth = line.length > cellWidth ? line.length : cellWidth;
                    }
                    updateOffset(colOffsets, x, cell.colspan, cellWidth + colSpacing);
                    cell.rendered = true;
                }
                y += cell.rowspan;
            } else {
                const lineOffset = rowOffsets[y];
                outputLines[lineOffset] = outputLines[lineOffset] || '';
                y++;
            }
        }
    }
    return outputLines.join('\n');
}
/**
 * Process a line-break.
 *
 * @type { FormatCallback }
 */ function formatLineBreak(elem, walk, builder, formatOptions) {
    builder.addLineBreak();
}
/**
 * Process a `wbr` tag (word break opportunity).
 *
 * @type { FormatCallback }
 */ function formatWbr(elem, walk, builder, formatOptions) {
    builder.addWordBreakOpportunity();
}
/**
 * Process a horizontal line.
 *
 * @type { FormatCallback }
 */ function formatHorizontalLine(elem, walk, builder, formatOptions) {
    builder.openBlock({
        leadingLineBreaks: formatOptions.leadingLineBreaks || 2
    });
    builder.addInline('-'.repeat(formatOptions.length || builder.options.wordwrap || 40));
    builder.closeBlock({
        trailingLineBreaks: formatOptions.trailingLineBreaks || 2
    });
}
/**
 * Process a paragraph.
 *
 * @type { FormatCallback }
 */ function formatParagraph(elem, walk, builder, formatOptions) {
    builder.openBlock({
        leadingLineBreaks: formatOptions.leadingLineBreaks || 2
    });
    walk(elem.children, builder);
    builder.closeBlock({
        trailingLineBreaks: formatOptions.trailingLineBreaks || 2
    });
}
/**
 * Process a preformatted content.
 *
 * @type { FormatCallback }
 */ function formatPre(elem, walk, builder, formatOptions) {
    builder.openBlock({
        isPre: true,
        leadingLineBreaks: formatOptions.leadingLineBreaks || 2
    });
    walk(elem.children, builder);
    builder.closeBlock({
        trailingLineBreaks: formatOptions.trailingLineBreaks || 2
    });
}
/**
 * Process a heading.
 *
 * @type { FormatCallback }
 */ function formatHeading(elem, walk, builder, formatOptions) {
    builder.openBlock({
        leadingLineBreaks: formatOptions.leadingLineBreaks || 2
    });
    if (formatOptions.uppercase !== false) {
        builder.pushWordTransform((str)=>str.toUpperCase());
        walk(elem.children, builder);
        builder.popWordTransform();
    } else {
        walk(elem.children, builder);
    }
    builder.closeBlock({
        trailingLineBreaks: formatOptions.trailingLineBreaks || 2
    });
}
/**
 * Process a blockquote.
 *
 * @type { FormatCallback }
 */ function formatBlockquote(elem, walk, builder, formatOptions) {
    builder.openBlock({
        leadingLineBreaks: formatOptions.leadingLineBreaks || 2,
        reservedLineLength: 2
    });
    walk(elem.children, builder);
    builder.closeBlock({
        trailingLineBreaks: formatOptions.trailingLineBreaks || 2,
        blockTransform: (str)=>(formatOptions.trimEmptyLines !== false ? trimCharacter(str, '\n') : str).split('\n').map((line)=>'> ' + line).join('\n')
    });
}
function withBrackets(str, brackets) {
    if (!brackets) {
        return str;
    }
    const lbr = typeof brackets[0] === 'string' ? brackets[0] : '[';
    const rbr = typeof brackets[1] === 'string' ? brackets[1] : ']';
    return lbr + str + rbr;
}
function pathRewrite(path, rewriter, baseUrl, metadata, elem) {
    const modifiedPath = typeof rewriter === 'function' ? rewriter(path, metadata, elem) : path;
    return modifiedPath[0] === '/' && baseUrl ? trimCharacterEnd(baseUrl, '/') + modifiedPath : modifiedPath;
}
/**
 * Process an image.
 *
 * @type { FormatCallback }
 */ function formatImage(elem, walk, builder, formatOptions) {
    const attribs = elem.attribs || {};
    const alt = attribs.alt ? attribs.alt : '';
    const src = !attribs.src ? '' : pathRewrite(attribs.src, formatOptions.pathRewrite, formatOptions.baseUrl, builder.metadata, elem);
    const text = !src ? alt : !alt ? withBrackets(src, formatOptions.linkBrackets) : alt + ' ' + withBrackets(src, formatOptions.linkBrackets);
    builder.addInline(text, {
        noWordTransform: true
    });
}
// a img baseUrl
// a img pathRewrite
// a img linkBrackets
// a     ignoreHref: false
//            ignoreText ?
// a     noAnchorUrl: true
//            can be replaced with selector
// a     hideLinkHrefIfSameAsText: false
//            how to compare, what to show (text, href, normalized) ?
// a     mailto protocol removed without options
// a     protocols: mailto, tel, ...
//            can be matched with selector?
// anchors, protocols - only if no pathRewrite fn is provided
// normalize-url ?
// a
// a[href^="#"] - format:skip by default
// a[href^="mailto:"] - ?
/**
 * Process an anchor.
 *
 * @type { FormatCallback }
 */ function formatAnchor(elem, walk, builder, formatOptions) {
    function getHref() {
        if (formatOptions.ignoreHref) {
            return '';
        }
        if (!elem.attribs || !elem.attribs.href) {
            return '';
        }
        let href = elem.attribs.href.replace(/^mailto:/, '');
        if (formatOptions.noAnchorUrl && href[0] === '#') {
            return '';
        }
        href = pathRewrite(href, formatOptions.pathRewrite, formatOptions.baseUrl, builder.metadata, elem);
        return href;
    }
    const href = getHref();
    if (!href) {
        walk(elem.children, builder);
    } else {
        let text = '';
        builder.pushWordTransform((str)=>{
            if (str) {
                text += str;
            }
            return str;
        });
        walk(elem.children, builder);
        builder.popWordTransform();
        const hideSameLink = formatOptions.hideLinkHrefIfSameAsText && href === text;
        if (!hideSameLink) {
            builder.addInline(!text ? href : ' ' + withBrackets(href, formatOptions.linkBrackets), {
                noWordTransform: true
            });
        }
    }
}
/**
 * @param { DomNode }           elem               List items with their prefixes.
 * @param { RecursiveCallback } walk               Recursive callback to process child nodes.
 * @param { BlockTextBuilder }  builder            Passed around to accumulate output text.
 * @param { FormatOptions }     formatOptions      Options specific to a formatter.
 * @param { () => string }      nextPrefixCallback Function that returns increasing index each time it is called.
 */ function formatList(elem, walk, builder, formatOptions, nextPrefixCallback) {
    const isNestedList = get(elem, [
        'parent',
        'name'
    ]) === 'li';
    // With Roman numbers, index length is not as straightforward as with Arabic numbers or letters,
    // so the dumb length comparison is the most robust way to get the correct value.
    let maxPrefixLength = 0;
    const listItems = (elem.children || [])// it might be more accurate to check only for html spaces here, but no significant benefit
    .filter((child)=>child.type !== 'text' || !/^\s*$/.test(child.data)).map(function(child) {
        if (child.name !== 'li') {
            return {
                node: child,
                prefix: ''
            };
        }
        const prefix = isNestedList ? nextPrefixCallback().trimStart() : nextPrefixCallback();
        if (prefix.length > maxPrefixLength) {
            maxPrefixLength = prefix.length;
        }
        return {
            node: child,
            prefix: prefix
        };
    });
    if (!listItems.length) {
        return;
    }
    builder.openList({
        interRowLineBreaks: 1,
        leadingLineBreaks: isNestedList ? 1 : formatOptions.leadingLineBreaks || 2,
        maxPrefixLength: maxPrefixLength,
        prefixAlign: 'left'
    });
    for (const { node, prefix } of listItems){
        builder.openListItem({
            prefix: prefix
        });
        walk([
            node
        ], builder);
        builder.closeListItem();
    }
    builder.closeList({
        trailingLineBreaks: isNestedList ? 1 : formatOptions.trailingLineBreaks || 2
    });
}
/**
 * Process an unordered list.
 *
 * @type { FormatCallback }
 */ function formatUnorderedList(elem, walk, builder, formatOptions) {
    const prefix = formatOptions.itemPrefix || ' * ';
    return formatList(elem, walk, builder, formatOptions, ()=>prefix);
}
/**
 * Process an ordered list.
 *
 * @type { FormatCallback }
 */ function formatOrderedList(elem, walk, builder, formatOptions) {
    let nextIndex = Number(elem.attribs.start || '1');
    const indexFunction = getOrderedListIndexFunction(elem.attribs.type);
    const nextPrefixCallback = ()=>' ' + indexFunction(nextIndex++) + '. ';
    return formatList(elem, walk, builder, formatOptions, nextPrefixCallback);
}
/**
 * Return a function that can be used to generate index markers of a specified format.
 *
 * @param   { string } [olType='1'] Marker type.
 * @returns { (i: number) => string }
 */ function getOrderedListIndexFunction(olType = '1') {
    switch(olType){
        case 'a':
            return (i)=>numberToLetterSequence(i, 'a');
        case 'A':
            return (i)=>numberToLetterSequence(i, 'A');
        case 'i':
            return (i)=>numberToRoman(i).toLowerCase();
        case 'I':
            return (i)=>numberToRoman(i);
        case '1':
        default:
            return (i)=>i.toString();
    }
}
/**
 * Given a list of class and ID selectors (prefixed with '.' and '#'),
 * return them as separate lists of names without prefixes.
 *
 * @param { string[] } selectors Class and ID selectors (`[".class", "#id"]` etc).
 * @returns { { classes: string[], ids: string[] } }
 */ function splitClassesAndIds(selectors) {
    const classes = [];
    const ids = [];
    for (const selector of selectors){
        if (selector.startsWith('.')) {
            classes.push(selector.substring(1));
        } else if (selector.startsWith('#')) {
            ids.push(selector.substring(1));
        }
    }
    return {
        classes: classes,
        ids: ids
    };
}
function isDataTable(attr, tables) {
    if (tables === true) {
        return true;
    }
    if (!attr) {
        return false;
    }
    const { classes, ids } = splitClassesAndIds(tables);
    const attrClasses = (attr['class'] || '').split(' ');
    const attrIds = (attr['id'] || '').split(' ');
    return attrClasses.some((x)=>classes.includes(x)) || attrIds.some((x)=>ids.includes(x));
}
/**
 * Process a table (either as a container or as a data table, depending on options).
 *
 * @type { FormatCallback }
 */ function formatTable(elem, walk, builder, formatOptions) {
    return isDataTable(elem.attribs, builder.options.tables) ? formatDataTable(elem, walk, builder, formatOptions) : formatBlock(elem, walk, builder, formatOptions);
}
function formatBlock(elem, walk, builder, formatOptions) {
    builder.openBlock({
        leadingLineBreaks: formatOptions.leadingLineBreaks
    });
    walk(elem.children, builder);
    builder.closeBlock({
        trailingLineBreaks: formatOptions.trailingLineBreaks
    });
}
/**
 * Process a data table.
 *
 * @type { FormatCallback }
 */ function formatDataTable(elem, walk, builder, formatOptions) {
    builder.openTable();
    elem.children.forEach(walkTable);
    builder.closeTable({
        tableToString: (rows)=>tableToString(rows, formatOptions.rowSpacing ?? 0, formatOptions.colSpacing ?? 3),
        leadingLineBreaks: formatOptions.leadingLineBreaks,
        trailingLineBreaks: formatOptions.trailingLineBreaks
    });
    function formatCell(cellNode) {
        const colspan = +get(cellNode, [
            'attribs',
            'colspan'
        ]) || 1;
        const rowspan = +get(cellNode, [
            'attribs',
            'rowspan'
        ]) || 1;
        builder.openTableCell({
            maxColumnWidth: formatOptions.maxColumnWidth
        });
        walk(cellNode.children, builder);
        builder.closeTableCell({
            colspan: colspan,
            rowspan: rowspan
        });
    }
    function walkTable(elem) {
        if (elem.type !== 'tag') {
            return;
        }
        const formatHeaderCell = formatOptions.uppercaseHeaderCells !== false ? (cellNode)=>{
            builder.pushWordTransform((str)=>str.toUpperCase());
            formatCell(cellNode);
            builder.popWordTransform();
        } : formatCell;
        switch(elem.name){
            case 'thead':
            case 'tbody':
            case 'tfoot':
            case 'center':
                elem.children.forEach(walkTable);
                return;
            case 'tr':
                {
                    builder.openTableRow();
                    for (const childOfTr of elem.children){
                        if (childOfTr.type !== 'tag') {
                            continue;
                        }
                        switch(childOfTr.name){
                            case 'th':
                                {
                                    formatHeaderCell(childOfTr);
                                    break;
                                }
                            case 'td':
                                {
                                    formatCell(childOfTr);
                                    break;
                                }
                        }
                    }
                    builder.closeTableRow();
                    break;
                }
        }
    }
}
var textFormatters = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    anchor: formatAnchor,
    blockquote: formatBlockquote,
    dataTable: formatDataTable,
    heading: formatHeading,
    horizontalLine: formatHorizontalLine,
    image: formatImage,
    lineBreak: formatLineBreak,
    orderedList: formatOrderedList,
    paragraph: formatParagraph,
    pre: formatPre,
    table: formatTable,
    unorderedList: formatUnorderedList,
    wbr: formatWbr
});
/**
 * Default options.
 *
 * @constant
 * @type { Options }
 * @default
 * @private
 */ const DEFAULT_OPTIONS = {
    baseElements: {
        selectors: [
            'body'
        ],
        orderBy: 'selectors',
        returnDomByDefault: true
    },
    decodeEntities: true,
    encodeCharacters: {},
    formatters: {},
    limits: {
        ellipsis: '...',
        maxBaseElements: undefined,
        maxChildNodes: undefined,
        maxDepth: undefined,
        maxInputLength: 1 << 24
    },
    longWordSplit: {
        forceWrapOnLimit: false,
        wrapCharacters: []
    },
    preserveNewlines: false,
    selectors: [
        {
            selector: '*',
            format: 'inline'
        },
        {
            selector: 'a',
            format: 'anchor',
            options: {
                baseUrl: null,
                hideLinkHrefIfSameAsText: false,
                ignoreHref: false,
                linkBrackets: [
                    '[',
                    ']'
                ],
                noAnchorUrl: true
            }
        },
        {
            selector: 'article',
            format: 'block',
            options: {
                leadingLineBreaks: 1,
                trailingLineBreaks: 1
            }
        },
        {
            selector: 'aside',
            format: 'block',
            options: {
                leadingLineBreaks: 1,
                trailingLineBreaks: 1
            }
        },
        {
            selector: 'blockquote',
            format: 'blockquote',
            options: {
                leadingLineBreaks: 2,
                trailingLineBreaks: 2,
                trimEmptyLines: true
            }
        },
        {
            selector: 'br',
            format: 'lineBreak'
        },
        {
            selector: 'div',
            format: 'block',
            options: {
                leadingLineBreaks: 1,
                trailingLineBreaks: 1
            }
        },
        {
            selector: 'footer',
            format: 'block',
            options: {
                leadingLineBreaks: 1,
                trailingLineBreaks: 1
            }
        },
        {
            selector: 'form',
            format: 'block',
            options: {
                leadingLineBreaks: 1,
                trailingLineBreaks: 1
            }
        },
        {
            selector: 'h1',
            format: 'heading',
            options: {
                leadingLineBreaks: 3,
                trailingLineBreaks: 2,
                uppercase: true
            }
        },
        {
            selector: 'h2',
            format: 'heading',
            options: {
                leadingLineBreaks: 3,
                trailingLineBreaks: 2,
                uppercase: true
            }
        },
        {
            selector: 'h3',
            format: 'heading',
            options: {
                leadingLineBreaks: 3,
                trailingLineBreaks: 2,
                uppercase: true
            }
        },
        {
            selector: 'h4',
            format: 'heading',
            options: {
                leadingLineBreaks: 2,
                trailingLineBreaks: 2,
                uppercase: true
            }
        },
        {
            selector: 'h5',
            format: 'heading',
            options: {
                leadingLineBreaks: 2,
                trailingLineBreaks: 2,
                uppercase: true
            }
        },
        {
            selector: 'h6',
            format: 'heading',
            options: {
                leadingLineBreaks: 2,
                trailingLineBreaks: 2,
                uppercase: true
            }
        },
        {
            selector: 'header',
            format: 'block',
            options: {
                leadingLineBreaks: 1,
                trailingLineBreaks: 1
            }
        },
        {
            selector: 'hr',
            format: 'horizontalLine',
            options: {
                leadingLineBreaks: 2,
                length: undefined,
                trailingLineBreaks: 2
            }
        },
        {
            selector: 'img',
            format: 'image',
            options: {
                baseUrl: null,
                linkBrackets: [
                    '[',
                    ']'
                ]
            }
        },
        {
            selector: 'main',
            format: 'block',
            options: {
                leadingLineBreaks: 1,
                trailingLineBreaks: 1
            }
        },
        {
            selector: 'nav',
            format: 'block',
            options: {
                leadingLineBreaks: 1,
                trailingLineBreaks: 1
            }
        },
        {
            selector: 'ol',
            format: 'orderedList',
            options: {
                leadingLineBreaks: 2,
                trailingLineBreaks: 2
            }
        },
        {
            selector: 'p',
            format: 'paragraph',
            options: {
                leadingLineBreaks: 2,
                trailingLineBreaks: 2
            }
        },
        {
            selector: 'pre',
            format: 'pre',
            options: {
                leadingLineBreaks: 2,
                trailingLineBreaks: 2
            }
        },
        {
            selector: 'section',
            format: 'block',
            options: {
                leadingLineBreaks: 1,
                trailingLineBreaks: 1
            }
        },
        {
            selector: 'table',
            format: 'table',
            options: {
                colSpacing: 3,
                leadingLineBreaks: 2,
                maxColumnWidth: 60,
                rowSpacing: 0,
                trailingLineBreaks: 2,
                uppercaseHeaderCells: true
            }
        },
        {
            selector: 'ul',
            format: 'unorderedList',
            options: {
                itemPrefix: ' * ',
                leadingLineBreaks: 2,
                trailingLineBreaks: 2
            }
        },
        {
            selector: 'wbr',
            format: 'wbr'
        }
    ],
    tables: [],
    whitespaceCharacters: ' \t\r\n\f\u200b',
    wordwrap: 80
};
const concatMerge = (acc, src, options)=>[
        ...acc,
        ...src
    ];
const overwriteMerge = (acc, src, options)=>[
        ...src
    ];
const selectorsMerge = (acc, src, options)=>acc.some((s)=>typeof s === 'object') ? concatMerge(acc, src) // selectors
     : overwriteMerge(acc, src) // baseElements.selectors
;
/**
 * Preprocess options, compile selectors into a decision tree,
 * return a function intended for batch processing.
 *
 * @param   { Options } [options = {}]   HtmlToText options.
 * @returns { (html: string, metadata?: any) => string } Pre-configured converter function.
 * @static
 */ function compile(options = {}) {
    options = merge__default["default"](DEFAULT_OPTIONS, options, {
        arrayMerge: overwriteMerge,
        customMerge: (key)=>key === 'selectors' ? selectorsMerge : undefined
    });
    options.formatters = Object.assign({}, genericFormatters, textFormatters, options.formatters);
    options.selectors = mergeDuplicatesPreferLast(options.selectors, (s)=>s.selector);
    handleDeprecatedOptions(options);
    return compile$1(options);
}
/**
 * Convert given HTML content to plain text string.
 *
 * @param   { string }  html           HTML content to convert.
 * @param   { Options } [options = {}] HtmlToText options.
 * @param   { any }     [metadata]     Optional metadata for HTML document, for use in formatters.
 * @returns { string }                 Plain text string.
 * @static
 *
 * @example
 * const { convert } = require('html-to-text');
 * const text = convert('<h1>Hello World</h1>', {
 *   wordwrap: 130
 * });
 * console.log(text); // HELLO WORLD
 */ function convert(html, options = {}, metadata = undefined) {
    return compile(options)(html, metadata);
}
/**
 * Map previously existing and now deprecated options to the new options layout.
 * This is a subject for cleanup in major releases.
 *
 * @param { Options } options HtmlToText options.
 */ function handleDeprecatedOptions(options) {
    if (options.tags) {
        const tagDefinitions = Object.entries(options.tags).map(([selector, definition])=>({
                ...definition,
                selector: selector || '*'
            }));
        options.selectors.push(...tagDefinitions);
        options.selectors = mergeDuplicatesPreferLast(options.selectors, (s)=>s.selector);
    }
    function set(obj, path, value) {
        const valueKey = path.pop();
        for (const key of path){
            let nested = obj[key];
            if (!nested) {
                nested = {};
                obj[key] = nested;
            }
            obj = nested;
        }
        obj[valueKey] = value;
    }
    if (options['baseElement']) {
        const baseElement = options['baseElement'];
        set(options, [
            'baseElements',
            'selectors'
        ], Array.isArray(baseElement) ? baseElement : [
            baseElement
        ]);
    }
    if (options['returnDomByDefault'] !== undefined) {
        set(options, [
            'baseElements',
            'returnDomByDefault'
        ], options['returnDomByDefault']);
    }
    for (const definition of options.selectors){
        if (definition.format === 'anchor' && get(definition, [
            'options',
            'noLinkBrackets'
        ])) {
            set(definition, [
                'options',
                'linkBrackets'
            ], false);
        }
    }
}
exports.compile = compile;
exports.convert = convert;
exports.htmlToText = convert;
}),
"[project]/Autonomous-Claims-Orchestrator/node_modules/uc.micro/build/index.cjs.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var regex$5 = /[\0-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/;
var regex$4 = /[\0-\x1F\x7F-\x9F]/;
var regex$3 = /[\xAD\u0600-\u0605\u061C\u06DD\u070F\u0890\u0891\u08E2\u180E\u200B-\u200F\u202A-\u202E\u2060-\u2064\u2066-\u206F\uFEFF\uFFF9-\uFFFB]|\uD804[\uDCBD\uDCCD]|\uD80D[\uDC30-\uDC3F]|\uD82F[\uDCA0-\uDCA3]|\uD834[\uDD73-\uDD7A]|\uDB40[\uDC01\uDC20-\uDC7F]/;
var regex$2 = /[!-#%-\*,-\/:;\?@\[-\]_\{\}\xA1\xA7\xAB\xB6\xB7\xBB\xBF\u037E\u0387\u055A-\u055F\u0589\u058A\u05BE\u05C0\u05C3\u05C6\u05F3\u05F4\u0609\u060A\u060C\u060D\u061B\u061D-\u061F\u066A-\u066D\u06D4\u0700-\u070D\u07F7-\u07F9\u0830-\u083E\u085E\u0964\u0965\u0970\u09FD\u0A76\u0AF0\u0C77\u0C84\u0DF4\u0E4F\u0E5A\u0E5B\u0F04-\u0F12\u0F14\u0F3A-\u0F3D\u0F85\u0FD0-\u0FD4\u0FD9\u0FDA\u104A-\u104F\u10FB\u1360-\u1368\u1400\u166E\u169B\u169C\u16EB-\u16ED\u1735\u1736\u17D4-\u17D6\u17D8-\u17DA\u1800-\u180A\u1944\u1945\u1A1E\u1A1F\u1AA0-\u1AA6\u1AA8-\u1AAD\u1B5A-\u1B60\u1B7D\u1B7E\u1BFC-\u1BFF\u1C3B-\u1C3F\u1C7E\u1C7F\u1CC0-\u1CC7\u1CD3\u2010-\u2027\u2030-\u2043\u2045-\u2051\u2053-\u205E\u207D\u207E\u208D\u208E\u2308-\u230B\u2329\u232A\u2768-\u2775\u27C5\u27C6\u27E6-\u27EF\u2983-\u2998\u29D8-\u29DB\u29FC\u29FD\u2CF9-\u2CFC\u2CFE\u2CFF\u2D70\u2E00-\u2E2E\u2E30-\u2E4F\u2E52-\u2E5D\u3001-\u3003\u3008-\u3011\u3014-\u301F\u3030\u303D\u30A0\u30FB\uA4FE\uA4FF\uA60D-\uA60F\uA673\uA67E\uA6F2-\uA6F7\uA874-\uA877\uA8CE\uA8CF\uA8F8-\uA8FA\uA8FC\uA92E\uA92F\uA95F\uA9C1-\uA9CD\uA9DE\uA9DF\uAA5C-\uAA5F\uAADE\uAADF\uAAF0\uAAF1\uABEB\uFD3E\uFD3F\uFE10-\uFE19\uFE30-\uFE52\uFE54-\uFE61\uFE63\uFE68\uFE6A\uFE6B\uFF01-\uFF03\uFF05-\uFF0A\uFF0C-\uFF0F\uFF1A\uFF1B\uFF1F\uFF20\uFF3B-\uFF3D\uFF3F\uFF5B\uFF5D\uFF5F-\uFF65]|\uD800[\uDD00-\uDD02\uDF9F\uDFD0]|\uD801\uDD6F|\uD802[\uDC57\uDD1F\uDD3F\uDE50-\uDE58\uDE7F\uDEF0-\uDEF6\uDF39-\uDF3F\uDF99-\uDF9C]|\uD803[\uDEAD\uDF55-\uDF59\uDF86-\uDF89]|\uD804[\uDC47-\uDC4D\uDCBB\uDCBC\uDCBE-\uDCC1\uDD40-\uDD43\uDD74\uDD75\uDDC5-\uDDC8\uDDCD\uDDDB\uDDDD-\uDDDF\uDE38-\uDE3D\uDEA9]|\uD805[\uDC4B-\uDC4F\uDC5A\uDC5B\uDC5D\uDCC6\uDDC1-\uDDD7\uDE41-\uDE43\uDE60-\uDE6C\uDEB9\uDF3C-\uDF3E]|\uD806[\uDC3B\uDD44-\uDD46\uDDE2\uDE3F-\uDE46\uDE9A-\uDE9C\uDE9E-\uDEA2\uDF00-\uDF09]|\uD807[\uDC41-\uDC45\uDC70\uDC71\uDEF7\uDEF8\uDF43-\uDF4F\uDFFF]|\uD809[\uDC70-\uDC74]|\uD80B[\uDFF1\uDFF2]|\uD81A[\uDE6E\uDE6F\uDEF5\uDF37-\uDF3B\uDF44]|\uD81B[\uDE97-\uDE9A\uDFE2]|\uD82F\uDC9F|\uD836[\uDE87-\uDE8B]|\uD83A[\uDD5E\uDD5F]/;
var regex$1 = /[\$\+<->\^`\|~\xA2-\xA6\xA8\xA9\xAC\xAE-\xB1\xB4\xB8\xD7\xF7\u02C2-\u02C5\u02D2-\u02DF\u02E5-\u02EB\u02ED\u02EF-\u02FF\u0375\u0384\u0385\u03F6\u0482\u058D-\u058F\u0606-\u0608\u060B\u060E\u060F\u06DE\u06E9\u06FD\u06FE\u07F6\u07FE\u07FF\u0888\u09F2\u09F3\u09FA\u09FB\u0AF1\u0B70\u0BF3-\u0BFA\u0C7F\u0D4F\u0D79\u0E3F\u0F01-\u0F03\u0F13\u0F15-\u0F17\u0F1A-\u0F1F\u0F34\u0F36\u0F38\u0FBE-\u0FC5\u0FC7-\u0FCC\u0FCE\u0FCF\u0FD5-\u0FD8\u109E\u109F\u1390-\u1399\u166D\u17DB\u1940\u19DE-\u19FF\u1B61-\u1B6A\u1B74-\u1B7C\u1FBD\u1FBF-\u1FC1\u1FCD-\u1FCF\u1FDD-\u1FDF\u1FED-\u1FEF\u1FFD\u1FFE\u2044\u2052\u207A-\u207C\u208A-\u208C\u20A0-\u20C0\u2100\u2101\u2103-\u2106\u2108\u2109\u2114\u2116-\u2118\u211E-\u2123\u2125\u2127\u2129\u212E\u213A\u213B\u2140-\u2144\u214A-\u214D\u214F\u218A\u218B\u2190-\u2307\u230C-\u2328\u232B-\u2426\u2440-\u244A\u249C-\u24E9\u2500-\u2767\u2794-\u27C4\u27C7-\u27E5\u27F0-\u2982\u2999-\u29D7\u29DC-\u29FB\u29FE-\u2B73\u2B76-\u2B95\u2B97-\u2BFF\u2CE5-\u2CEA\u2E50\u2E51\u2E80-\u2E99\u2E9B-\u2EF3\u2F00-\u2FD5\u2FF0-\u2FFF\u3004\u3012\u3013\u3020\u3036\u3037\u303E\u303F\u309B\u309C\u3190\u3191\u3196-\u319F\u31C0-\u31E3\u31EF\u3200-\u321E\u322A-\u3247\u3250\u3260-\u327F\u328A-\u32B0\u32C0-\u33FF\u4DC0-\u4DFF\uA490-\uA4C6\uA700-\uA716\uA720\uA721\uA789\uA78A\uA828-\uA82B\uA836-\uA839\uAA77-\uAA79\uAB5B\uAB6A\uAB6B\uFB29\uFBB2-\uFBC2\uFD40-\uFD4F\uFDCF\uFDFC-\uFDFF\uFE62\uFE64-\uFE66\uFE69\uFF04\uFF0B\uFF1C-\uFF1E\uFF3E\uFF40\uFF5C\uFF5E\uFFE0-\uFFE6\uFFE8-\uFFEE\uFFFC\uFFFD]|\uD800[\uDD37-\uDD3F\uDD79-\uDD89\uDD8C-\uDD8E\uDD90-\uDD9C\uDDA0\uDDD0-\uDDFC]|\uD802[\uDC77\uDC78\uDEC8]|\uD805\uDF3F|\uD807[\uDFD5-\uDFF1]|\uD81A[\uDF3C-\uDF3F\uDF45]|\uD82F\uDC9C|\uD833[\uDF50-\uDFC3]|\uD834[\uDC00-\uDCF5\uDD00-\uDD26\uDD29-\uDD64\uDD6A-\uDD6C\uDD83\uDD84\uDD8C-\uDDA9\uDDAE-\uDDEA\uDE00-\uDE41\uDE45\uDF00-\uDF56]|\uD835[\uDEC1\uDEDB\uDEFB\uDF15\uDF35\uDF4F\uDF6F\uDF89\uDFA9\uDFC3]|\uD836[\uDC00-\uDDFF\uDE37-\uDE3A\uDE6D-\uDE74\uDE76-\uDE83\uDE85\uDE86]|\uD838[\uDD4F\uDEFF]|\uD83B[\uDCAC\uDCB0\uDD2E\uDEF0\uDEF1]|\uD83C[\uDC00-\uDC2B\uDC30-\uDC93\uDCA0-\uDCAE\uDCB1-\uDCBF\uDCC1-\uDCCF\uDCD1-\uDCF5\uDD0D-\uDDAD\uDDE6-\uDE02\uDE10-\uDE3B\uDE40-\uDE48\uDE50\uDE51\uDE60-\uDE65\uDF00-\uDFFF]|\uD83D[\uDC00-\uDED7\uDEDC-\uDEEC\uDEF0-\uDEFC\uDF00-\uDF76\uDF7B-\uDFD9\uDFE0-\uDFEB\uDFF0]|\uD83E[\uDC00-\uDC0B\uDC10-\uDC47\uDC50-\uDC59\uDC60-\uDC87\uDC90-\uDCAD\uDCB0\uDCB1\uDD00-\uDE53\uDE60-\uDE6D\uDE70-\uDE7C\uDE80-\uDE88\uDE90-\uDEBD\uDEBF-\uDEC5\uDECE-\uDEDB\uDEE0-\uDEE8\uDEF0-\uDEF8\uDF00-\uDF92\uDF94-\uDFCA]/;
var regex = /[ \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000]/;
exports.Any = regex$5;
exports.Cc = regex$4;
exports.Cf = regex$3;
exports.P = regex$2;
exports.S = regex$1;
exports.Z = regex;
}),
"[project]/Autonomous-Claims-Orchestrator/node_modules/linkify-it/build/index.cjs.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var uc_micro = __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/uc.micro/build/index.cjs.js [app-route] (ecmascript)");
function reFactory(opts) {
    const re = {};
    opts = opts || {};
    re.src_Any = uc_micro.Any.source;
    re.src_Cc = uc_micro.Cc.source;
    re.src_Z = uc_micro.Z.source;
    re.src_P = uc_micro.P.source;
    // \p{\Z\P\Cc\CF} (white spaces + control + format + punctuation)
    re.src_ZPCc = [
        re.src_Z,
        re.src_P,
        re.src_Cc
    ].join('|');
    // \p{\Z\Cc} (white spaces + control)
    re.src_ZCc = [
        re.src_Z,
        re.src_Cc
    ].join('|');
    // Experimental. List of chars, completely prohibited in links
    // because can separate it from other part of text
    const text_separators = '[><\uff5c]';
    // All possible word characters (everything without punctuation, spaces & controls)
    // Defined via punctuation & spaces to save space
    // Should be something like \p{\L\N\S\M} (\w but without `_`)
    re.src_pseudo_letter = '(?:(?!' + text_separators + '|' + re.src_ZPCc + ')' + re.src_Any + ')';
    // The same as abothe but without [0-9]
    // var src_pseudo_letter_non_d = '(?:(?![0-9]|' + src_ZPCc + ')' + src_Any + ')';
    re.src_ip4 = '(?:(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)';
    // Prohibit any of "@/[]()" in user/pass to avoid wrong domain fetch.
    re.src_auth = '(?:(?:(?!' + re.src_ZCc + '|[@/\\[\\]()]).)+@)?';
    re.src_port = '(?::(?:6(?:[0-4]\\d{3}|5(?:[0-4]\\d{2}|5(?:[0-2]\\d|3[0-5])))|[1-5]?\\d{1,4}))?';
    re.src_host_terminator = '(?=$|' + text_separators + '|' + re.src_ZPCc + ')' + '(?!' + (opts['---'] ? '-(?!--)|' : '-|') + '_|:\\d|\\.-|\\.(?!$|' + re.src_ZPCc + '))';
    re.src_path = '(?:' + '[/?#]' + '(?:' + '(?!' + re.src_ZCc + '|' + text_separators + '|[()[\\]{}.,"\'?!\\-;]).|' + '\\[(?:(?!' + re.src_ZCc + '|\\]).)*\\]|' + '\\((?:(?!' + re.src_ZCc + '|[)]).)*\\)|' + '\\{(?:(?!' + re.src_ZCc + '|[}]).)*\\}|' + '\\"(?:(?!' + re.src_ZCc + '|["]).)+\\"|' + "\\'(?:(?!" + re.src_ZCc + "|[']).)+\\'|" + // allow `I'm_king` if no pair found
    "\\'(?=" + re.src_pseudo_letter + '|[-])|' + // google has many dots in "google search" links (#66, #81).
    // github has ... in commit range links,
    // Restrict to
    // - english
    // - percent-encoded
    // - parts of file path
    // - params separator
    // until more examples found.
    '\\.{2,}[a-zA-Z0-9%/&]|' + '\\.(?!' + re.src_ZCc + '|[.]|$)|' + (opts['---'] ? '\\-(?!--(?:[^-]|$))(?:-*)|' // `---` => long dash, terminate
     : '\\-+|') + // allow `,,,` in paths
    ',(?!' + re.src_ZCc + '|$)|' + // allow `;` if not followed by space-like char
    ';(?!' + re.src_ZCc + '|$)|' + // allow `!!!` in paths, but not at the end
    '\\!+(?!' + re.src_ZCc + '|[!]|$)|' + '\\?(?!' + re.src_ZCc + '|[?]|$)' + ')+' + '|\\/' + ')?';
    // Allow anything in markdown spec, forbid quote (") at the first position
    // because emails enclosed in quotes are far more common
    re.src_email_name = '[\\-;:&=\\+\\$,\\.a-zA-Z0-9_][\\-;:&=\\+\\$,\\"\\.a-zA-Z0-9_]*';
    re.src_xn = 'xn--[a-z0-9\\-]{1,59}';
    // More to read about domain names
    // http://serverfault.com/questions/638260/
    re.src_domain_root = // Allow letters & digits (http://test1)
    '(?:' + re.src_xn + '|' + re.src_pseudo_letter + '{1,63}' + ')';
    re.src_domain = '(?:' + re.src_xn + '|' + '(?:' + re.src_pseudo_letter + ')' + '|' + '(?:' + re.src_pseudo_letter + '(?:-|' + re.src_pseudo_letter + '){0,61}' + re.src_pseudo_letter + ')' + ')';
    re.src_host = '(?:' + // Don't need IP check, because digits are already allowed in normal domain names
    //   src_ip4 +
    // '|' +
    '(?:(?:(?:' + re.src_domain + ')\\.)*' + re.src_domain /* _root */  + ')' + ')';
    re.tpl_host_fuzzy = '(?:' + re.src_ip4 + '|' + '(?:(?:(?:' + re.src_domain + ')\\.)+(?:%TLDS%))' + ')';
    re.tpl_host_no_ip_fuzzy = '(?:(?:(?:' + re.src_domain + ')\\.)+(?:%TLDS%))';
    re.src_host_strict = re.src_host + re.src_host_terminator;
    re.tpl_host_fuzzy_strict = re.tpl_host_fuzzy + re.src_host_terminator;
    re.src_host_port_strict = re.src_host + re.src_port + re.src_host_terminator;
    re.tpl_host_port_fuzzy_strict = re.tpl_host_fuzzy + re.src_port + re.src_host_terminator;
    re.tpl_host_port_no_ip_fuzzy_strict = re.tpl_host_no_ip_fuzzy + re.src_port + re.src_host_terminator;
    //
    // Main rules
    //
    // Rude test fuzzy links by host, for quick deny
    re.tpl_host_fuzzy_test = 'localhost|www\\.|\\.\\d{1,3}\\.|(?:\\.(?:%TLDS%)(?:' + re.src_ZPCc + '|>|$))';
    re.tpl_email_fuzzy = '(^|' + text_separators + '|"|\\(|' + re.src_ZCc + ')' + '(' + re.src_email_name + '@' + re.tpl_host_fuzzy_strict + ')';
    re.tpl_link_fuzzy = // Fuzzy link can't be prepended with .:/\- and non punctuation.
    // but can start with > (markdown blockquote)
    '(^|(?![.:/\\-_@])(?:[$+<=>^`|\uff5c]|' + re.src_ZPCc + '))' + '((?![$+<=>^`|\uff5c])' + re.tpl_host_port_fuzzy_strict + re.src_path + ')';
    re.tpl_link_no_ip_fuzzy = // Fuzzy link can't be prepended with .:/\- and non punctuation.
    // but can start with > (markdown blockquote)
    '(^|(?![.:/\\-_@])(?:[$+<=>^`|\uff5c]|' + re.src_ZPCc + '))' + '((?![$+<=>^`|\uff5c])' + re.tpl_host_port_no_ip_fuzzy_strict + re.src_path + ')';
    return re;
}
//
// Helpers
//
// Merge objects
//
function assign(obj /* from1, from2, from3, ... */ ) {
    const sources = Array.prototype.slice.call(arguments, 1);
    sources.forEach(function(source) {
        if (!source) {
            return;
        }
        Object.keys(source).forEach(function(key) {
            obj[key] = source[key];
        });
    });
    return obj;
}
function _class(obj) {
    return Object.prototype.toString.call(obj);
}
function isString(obj) {
    return _class(obj) === '[object String]';
}
function isObject(obj) {
    return _class(obj) === '[object Object]';
}
function isRegExp(obj) {
    return _class(obj) === '[object RegExp]';
}
function isFunction(obj) {
    return _class(obj) === '[object Function]';
}
function escapeRE(str) {
    return str.replace(/[.?*+^$[\]\\(){}|-]/g, '\\$&');
}
//
const defaultOptions = {
    fuzzyLink: true,
    fuzzyEmail: true,
    fuzzyIP: false
};
function isOptionsObj(obj) {
    return Object.keys(obj || {}).reduce(function(acc, k) {
        /* eslint-disable-next-line no-prototype-builtins */ return acc || defaultOptions.hasOwnProperty(k);
    }, false);
}
const defaultSchemas = {
    'http:': {
        validate: function(text, pos, self) {
            const tail = text.slice(pos);
            if (!self.re.http) {
                // compile lazily, because "host"-containing variables can change on tlds update.
                self.re.http = new RegExp('^\\/\\/' + self.re.src_auth + self.re.src_host_port_strict + self.re.src_path, 'i');
            }
            if (self.re.http.test(tail)) {
                return tail.match(self.re.http)[0].length;
            }
            return 0;
        }
    },
    'https:': 'http:',
    'ftp:': 'http:',
    '//': {
        validate: function(text, pos, self) {
            const tail = text.slice(pos);
            if (!self.re.no_http) {
                // compile lazily, because "host"-containing variables can change on tlds update.
                self.re.no_http = new RegExp('^' + self.re.src_auth + // Don't allow single-level domains, because of false positives like '//test'
                // with code comments
                '(?:localhost|(?:(?:' + self.re.src_domain + ')\\.)+' + self.re.src_domain_root + ')' + self.re.src_port + self.re.src_host_terminator + self.re.src_path, 'i');
            }
            if (self.re.no_http.test(tail)) {
                // should not be `://` & `///`, that protects from errors in protocol name
                if (pos >= 3 && text[pos - 3] === ':') {
                    return 0;
                }
                if (pos >= 3 && text[pos - 3] === '/') {
                    return 0;
                }
                return tail.match(self.re.no_http)[0].length;
            }
            return 0;
        }
    },
    'mailto:': {
        validate: function(text, pos, self) {
            const tail = text.slice(pos);
            if (!self.re.mailto) {
                self.re.mailto = new RegExp('^' + self.re.src_email_name + '@' + self.re.src_host_strict, 'i');
            }
            if (self.re.mailto.test(tail)) {
                return tail.match(self.re.mailto)[0].length;
            }
            return 0;
        }
    }
};
// RE pattern for 2-character tlds (autogenerated by ./support/tlds_2char_gen.js)
/* eslint-disable-next-line max-len */ const tlds_2ch_src_re = 'a[cdefgilmnoqrstuwxz]|b[abdefghijmnorstvwyz]|c[acdfghiklmnoruvwxyz]|d[ejkmoz]|e[cegrstu]|f[ijkmor]|g[abdefghilmnpqrstuwy]|h[kmnrtu]|i[delmnoqrst]|j[emop]|k[eghimnprwyz]|l[abcikrstuvy]|m[acdeghklmnopqrstuvwxyz]|n[acefgilopruz]|om|p[aefghklmnrstwy]|qa|r[eosuw]|s[abcdeghijklmnortuvxyz]|t[cdfghjklmnortvwz]|u[agksyz]|v[aceginu]|w[fs]|y[et]|z[amw]';
// DON'T try to make PRs with changes. Extend TLDs with LinkifyIt.tlds() instead
const tlds_default = 'biz|com|edu|gov|net|org|pro|web|xxx|aero|asia|coop|info|museum|name|shop|рф'.split('|');
function resetScanCache(self) {
    self.__index__ = -1;
    self.__text_cache__ = '';
}
function createValidator(re) {
    return function(text, pos) {
        const tail = text.slice(pos);
        if (re.test(tail)) {
            return tail.match(re)[0].length;
        }
        return 0;
    };
}
function createNormalizer() {
    return function(match, self) {
        self.normalize(match);
    };
}
// Schemas compiler. Build regexps.
//
function compile(self) {
    // Load & clone RE patterns.
    const re = self.re = reFactory(self.__opts__);
    // Define dynamic patterns
    const tlds = self.__tlds__.slice();
    self.onCompile();
    if (!self.__tlds_replaced__) {
        tlds.push(tlds_2ch_src_re);
    }
    tlds.push(re.src_xn);
    re.src_tlds = tlds.join('|');
    function untpl(tpl) {
        return tpl.replace('%TLDS%', re.src_tlds);
    }
    re.email_fuzzy = RegExp(untpl(re.tpl_email_fuzzy), 'i');
    re.link_fuzzy = RegExp(untpl(re.tpl_link_fuzzy), 'i');
    re.link_no_ip_fuzzy = RegExp(untpl(re.tpl_link_no_ip_fuzzy), 'i');
    re.host_fuzzy_test = RegExp(untpl(re.tpl_host_fuzzy_test), 'i');
    //
    // Compile each schema
    //
    const aliases = [];
    self.__compiled__ = {}; // Reset compiled data
    function schemaError(name, val) {
        throw new Error('(LinkifyIt) Invalid schema "' + name + '": ' + val);
    }
    Object.keys(self.__schemas__).forEach(function(name) {
        const val = self.__schemas__[name];
        // skip disabled methods
        if (val === null) {
            return;
        }
        const compiled = {
            validate: null,
            link: null
        };
        self.__compiled__[name] = compiled;
        if (isObject(val)) {
            if (isRegExp(val.validate)) {
                compiled.validate = createValidator(val.validate);
            } else if (isFunction(val.validate)) {
                compiled.validate = val.validate;
            } else {
                schemaError(name, val);
            }
            if (isFunction(val.normalize)) {
                compiled.normalize = val.normalize;
            } else if (!val.normalize) {
                compiled.normalize = createNormalizer();
            } else {
                schemaError(name, val);
            }
            return;
        }
        if (isString(val)) {
            aliases.push(name);
            return;
        }
        schemaError(name, val);
    });
    //
    // Compile postponed aliases
    //
    aliases.forEach(function(alias) {
        if (!self.__compiled__[self.__schemas__[alias]]) {
            // Silently fail on missed schemas to avoid errons on disable.
            // schemaError(alias, self.__schemas__[alias]);
            return;
        }
        self.__compiled__[alias].validate = self.__compiled__[self.__schemas__[alias]].validate;
        self.__compiled__[alias].normalize = self.__compiled__[self.__schemas__[alias]].normalize;
    });
    //
    // Fake record for guessed links
    //
    self.__compiled__[''] = {
        validate: null,
        normalize: createNormalizer()
    };
    //
    // Build schema condition
    //
    const slist = Object.keys(self.__compiled__).filter(function(name) {
        // Filter disabled & fake schemas
        return name.length > 0 && self.__compiled__[name];
    }).map(escapeRE).join('|');
    // (?!_) cause 1.5x slowdown
    self.re.schema_test = RegExp('(^|(?!_)(?:[><\uff5c]|' + re.src_ZPCc + '))(' + slist + ')', 'i');
    self.re.schema_search = RegExp('(^|(?!_)(?:[><\uff5c]|' + re.src_ZPCc + '))(' + slist + ')', 'ig');
    self.re.schema_at_start = RegExp('^' + self.re.schema_search.source, 'i');
    self.re.pretest = RegExp('(' + self.re.schema_test.source + ')|(' + self.re.host_fuzzy_test.source + ')|@', 'i');
    //
    // Cleanup
    //
    resetScanCache(self);
}
/**
 * class Match
 *
 * Match result. Single element of array, returned by [[LinkifyIt#match]]
 **/ function Match(self, shift) {
    const start = self.__index__;
    const end = self.__last_index__;
    const text = self.__text_cache__.slice(start, end);
    /**
   * Match#schema -> String
   *
   * Prefix (protocol) for matched string.
   **/ this.schema = self.__schema__.toLowerCase();
    /**
   * Match#index -> Number
   *
   * First position of matched string.
   **/ this.index = start + shift;
    /**
   * Match#lastIndex -> Number
   *
   * Next position after matched string.
   **/ this.lastIndex = end + shift;
    /**
   * Match#raw -> String
   *
   * Matched string.
   **/ this.raw = text;
    /**
   * Match#text -> String
   *
   * Notmalized text of matched string.
   **/ this.text = text;
    /**
   * Match#url -> String
   *
   * Normalized url of matched string.
   **/ this.url = text;
}
function createMatch(self, shift) {
    const match = new Match(self, shift);
    self.__compiled__[match.schema].normalize(match, self);
    return match;
}
/**
 * class LinkifyIt
 **/ /**
 * new LinkifyIt(schemas, options)
 * - schemas (Object): Optional. Additional schemas to validate (prefix/validator)
 * - options (Object): { fuzzyLink|fuzzyEmail|fuzzyIP: true|false }
 *
 * Creates new linkifier instance with optional additional schemas.
 * Can be called without `new` keyword for convenience.
 *
 * By default understands:
 *
 * - `http(s)://...` , `ftp://...`, `mailto:...` & `//...` links
 * - "fuzzy" links and emails (example.com, foo@bar.com).
 *
 * `schemas` is an object, where each key/value describes protocol/rule:
 *
 * - __key__ - link prefix (usually, protocol name with `:` at the end, `skype:`
 *   for example). `linkify-it` makes shure that prefix is not preceeded with
 *   alphanumeric char and symbols. Only whitespaces and punctuation allowed.
 * - __value__ - rule to check tail after link prefix
 *   - _String_ - just alias to existing rule
 *   - _Object_
 *     - _validate_ - validator function (should return matched length on success),
 *       or `RegExp`.
 *     - _normalize_ - optional function to normalize text & url of matched result
 *       (for example, for @twitter mentions).
 *
 * `options`:
 *
 * - __fuzzyLink__ - recognige URL-s without `http(s):` prefix. Default `true`.
 * - __fuzzyIP__ - allow IPs in fuzzy links above. Can conflict with some texts
 *   like version numbers. Default `false`.
 * - __fuzzyEmail__ - recognize emails without `mailto:` prefix.
 *
 **/ function LinkifyIt(schemas, options) {
    if (!(this instanceof LinkifyIt)) {
        return new LinkifyIt(schemas, options);
    }
    if (!options) {
        if (isOptionsObj(schemas)) {
            options = schemas;
            schemas = {};
        }
    }
    this.__opts__ = assign({}, defaultOptions, options);
    // Cache last tested result. Used to skip repeating steps on next `match` call.
    this.__index__ = -1;
    this.__last_index__ = -1; // Next scan position
    this.__schema__ = '';
    this.__text_cache__ = '';
    this.__schemas__ = assign({}, defaultSchemas, schemas);
    this.__compiled__ = {};
    this.__tlds__ = tlds_default;
    this.__tlds_replaced__ = false;
    this.re = {};
    compile(this);
}
/** chainable
 * LinkifyIt#add(schema, definition)
 * - schema (String): rule name (fixed pattern prefix)
 * - definition (String|RegExp|Object): schema definition
 *
 * Add new rule definition. See constructor description for details.
 **/ LinkifyIt.prototype.add = function add(schema, definition) {
    this.__schemas__[schema] = definition;
    compile(this);
    return this;
};
/** chainable
 * LinkifyIt#set(options)
 * - options (Object): { fuzzyLink|fuzzyEmail|fuzzyIP: true|false }
 *
 * Set recognition options for links without schema.
 **/ LinkifyIt.prototype.set = function set(options) {
    this.__opts__ = assign(this.__opts__, options);
    return this;
};
/**
 * LinkifyIt#test(text) -> Boolean
 *
 * Searches linkifiable pattern and returns `true` on success or `false` on fail.
 **/ LinkifyIt.prototype.test = function test(text) {
    // Reset scan cache
    this.__text_cache__ = text;
    this.__index__ = -1;
    if (!text.length) {
        return false;
    }
    let m, ml, me, len, shift, next, re, tld_pos, at_pos;
    // try to scan for link with schema - that's the most simple rule
    if (this.re.schema_test.test(text)) {
        re = this.re.schema_search;
        re.lastIndex = 0;
        while((m = re.exec(text)) !== null){
            len = this.testSchemaAt(text, m[2], re.lastIndex);
            if (len) {
                this.__schema__ = m[2];
                this.__index__ = m.index + m[1].length;
                this.__last_index__ = m.index + m[0].length + len;
                break;
            }
        }
    }
    if (this.__opts__.fuzzyLink && this.__compiled__['http:']) {
        // guess schemaless links
        tld_pos = text.search(this.re.host_fuzzy_test);
        if (tld_pos >= 0) {
            // if tld is located after found link - no need to check fuzzy pattern
            if (this.__index__ < 0 || tld_pos < this.__index__) {
                if ((ml = text.match(this.__opts__.fuzzyIP ? this.re.link_fuzzy : this.re.link_no_ip_fuzzy)) !== null) {
                    shift = ml.index + ml[1].length;
                    if (this.__index__ < 0 || shift < this.__index__) {
                        this.__schema__ = '';
                        this.__index__ = shift;
                        this.__last_index__ = ml.index + ml[0].length;
                    }
                }
            }
        }
    }
    if (this.__opts__.fuzzyEmail && this.__compiled__['mailto:']) {
        // guess schemaless emails
        at_pos = text.indexOf('@');
        if (at_pos >= 0) {
            // We can't skip this check, because this cases are possible:
            // 192.168.1.1@gmail.com, my.in@example.com
            if ((me = text.match(this.re.email_fuzzy)) !== null) {
                shift = me.index + me[1].length;
                next = me.index + me[0].length;
                if (this.__index__ < 0 || shift < this.__index__ || shift === this.__index__ && next > this.__last_index__) {
                    this.__schema__ = 'mailto:';
                    this.__index__ = shift;
                    this.__last_index__ = next;
                }
            }
        }
    }
    return this.__index__ >= 0;
};
/**
 * LinkifyIt#pretest(text) -> Boolean
 *
 * Very quick check, that can give false positives. Returns true if link MAY BE
 * can exists. Can be used for speed optimization, when you need to check that
 * link NOT exists.
 **/ LinkifyIt.prototype.pretest = function pretest(text) {
    return this.re.pretest.test(text);
};
/**
 * LinkifyIt#testSchemaAt(text, name, position) -> Number
 * - text (String): text to scan
 * - name (String): rule (schema) name
 * - position (Number): text offset to check from
 *
 * Similar to [[LinkifyIt#test]] but checks only specific protocol tail exactly
 * at given position. Returns length of found pattern (0 on fail).
 **/ LinkifyIt.prototype.testSchemaAt = function testSchemaAt(text, schema, pos) {
    // If not supported schema check requested - terminate
    if (!this.__compiled__[schema.toLowerCase()]) {
        return 0;
    }
    return this.__compiled__[schema.toLowerCase()].validate(text, pos, this);
};
/**
 * LinkifyIt#match(text) -> Array|null
 *
 * Returns array of found link descriptions or `null` on fail. We strongly
 * recommend to use [[LinkifyIt#test]] first, for best speed.
 *
 * ##### Result match description
 *
 * - __schema__ - link schema, can be empty for fuzzy links, or `//` for
 *   protocol-neutral  links.
 * - __index__ - offset of matched text
 * - __lastIndex__ - index of next char after mathch end
 * - __raw__ - matched text
 * - __text__ - normalized text
 * - __url__ - link, generated from matched text
 **/ LinkifyIt.prototype.match = function match(text) {
    const result = [];
    let shift = 0;
    // Try to take previous element from cache, if .test() called before
    if (this.__index__ >= 0 && this.__text_cache__ === text) {
        result.push(createMatch(this, shift));
        shift = this.__last_index__;
    }
    // Cut head if cache was used
    let tail = shift ? text.slice(shift) : text;
    // Scan string until end reached
    while(this.test(tail)){
        result.push(createMatch(this, shift));
        tail = tail.slice(this.__last_index__);
        shift += this.__last_index__;
    }
    if (result.length) {
        return result;
    }
    return null;
};
/**
 * LinkifyIt#matchAtStart(text) -> Match|null
 *
 * Returns fully-formed (not fuzzy) link if it starts at the beginning
 * of the string, and null otherwise.
 **/ LinkifyIt.prototype.matchAtStart = function matchAtStart(text) {
    // Reset scan cache
    this.__text_cache__ = text;
    this.__index__ = -1;
    if (!text.length) return null;
    const m = this.re.schema_at_start.exec(text);
    if (!m) return null;
    const len = this.testSchemaAt(text, m[2], m[0].length);
    if (!len) return null;
    this.__schema__ = m[2];
    this.__index__ = m.index + m[1].length;
    this.__last_index__ = m.index + m[0].length + len;
    return createMatch(this, 0);
};
/** chainable
 * LinkifyIt#tlds(list [, keepOld]) -> this
 * - list (Array): list of tlds
 * - keepOld (Boolean): merge with current list if `true` (`false` by default)
 *
 * Load (or merge) new tlds list. Those are user for fuzzy links (without prefix)
 * to avoid false positives. By default this algorythm used:
 *
 * - hostname with any 2-letter root zones are ok.
 * - biz|com|edu|gov|net|org|pro|web|xxx|aero|asia|coop|info|museum|name|shop|рф
 *   are ok.
 * - encoded (`xn--...`) root zones are ok.
 *
 * If list is replaced, then exact match for 2-chars root zones will be checked.
 **/ LinkifyIt.prototype.tlds = function tlds(list, keepOld) {
    list = Array.isArray(list) ? list : [
        list
    ];
    if (!keepOld) {
        this.__tlds__ = list.slice();
        this.__tlds_replaced__ = true;
        compile(this);
        return this;
    }
    this.__tlds__ = this.__tlds__.concat(list).sort().filter(function(el, idx, arr) {
        return el !== arr[idx - 1];
    }).reverse();
    compile(this);
    return this;
};
/**
 * LinkifyIt#normalize(match)
 *
 * Default normalizer (if schema does not define it's own).
 **/ LinkifyIt.prototype.normalize = function normalize(match) {
    // Do minimal possible changes by default. Need to collect feedback prior
    // to move forward https://github.com/markdown-it/linkify-it/issues/1
    if (!match.schema) {
        match.url = 'http://' + match.url;
    }
    if (match.schema === 'mailto:' && !/^mailto:/i.test(match.url)) {
        match.url = 'mailto:' + match.url;
    }
};
/**
 * LinkifyIt#onCompile()
 *
 * Override to modify basic RegExp-s.
 **/ LinkifyIt.prototype.onCompile = function onCompile() {};
module.exports = LinkifyIt;
}),
"[project]/Autonomous-Claims-Orchestrator/node_modules/tlds/index.json (json)", ((__turbopack_context__) => {

__turbopack_context__.v(JSON.parse("[\"aaa\",\"aarp\",\"abb\",\"abbott\",\"abbvie\",\"abc\",\"able\",\"abogado\",\"abudhabi\",\"ac\",\"academy\",\"accenture\",\"accountant\",\"accountants\",\"aco\",\"actor\",\"ad\",\"ads\",\"adult\",\"ae\",\"aeg\",\"aero\",\"aetna\",\"af\",\"afl\",\"africa\",\"ag\",\"agakhan\",\"agency\",\"ai\",\"aig\",\"airbus\",\"airforce\",\"airtel\",\"akdn\",\"al\",\"alibaba\",\"alipay\",\"allfinanz\",\"allstate\",\"ally\",\"alsace\",\"alstom\",\"am\",\"amazon\",\"americanexpress\",\"americanfamily\",\"amex\",\"amfam\",\"amica\",\"amsterdam\",\"analytics\",\"android\",\"anquan\",\"anz\",\"ao\",\"aol\",\"apartments\",\"app\",\"apple\",\"aq\",\"aquarelle\",\"ar\",\"arab\",\"aramco\",\"archi\",\"army\",\"arpa\",\"art\",\"arte\",\"as\",\"asda\",\"asia\",\"associates\",\"at\",\"athleta\",\"attorney\",\"au\",\"auction\",\"audi\",\"audible\",\"audio\",\"auspost\",\"author\",\"auto\",\"autos\",\"aw\",\"aws\",\"ax\",\"axa\",\"az\",\"azure\",\"ba\",\"baby\",\"baidu\",\"banamex\",\"band\",\"bank\",\"bar\",\"barcelona\",\"barclaycard\",\"barclays\",\"barefoot\",\"bargains\",\"baseball\",\"basketball\",\"bauhaus\",\"bayern\",\"bb\",\"bbc\",\"bbt\",\"bbva\",\"bcg\",\"bcn\",\"bd\",\"be\",\"beats\",\"beauty\",\"beer\",\"berlin\",\"best\",\"bestbuy\",\"bet\",\"bf\",\"bg\",\"bh\",\"bharti\",\"bi\",\"bible\",\"bid\",\"bike\",\"bing\",\"bingo\",\"bio\",\"biz\",\"bj\",\"black\",\"blackfriday\",\"blockbuster\",\"blog\",\"bloomberg\",\"blue\",\"bm\",\"bms\",\"bmw\",\"bn\",\"bnpparibas\",\"bo\",\"boats\",\"boehringer\",\"bofa\",\"bom\",\"bond\",\"boo\",\"book\",\"booking\",\"bosch\",\"bostik\",\"boston\",\"bot\",\"boutique\",\"box\",\"br\",\"bradesco\",\"bridgestone\",\"broadway\",\"broker\",\"brother\",\"brussels\",\"bs\",\"bt\",\"build\",\"builders\",\"business\",\"buy\",\"buzz\",\"bv\",\"bw\",\"by\",\"bz\",\"bzh\",\"ca\",\"cab\",\"cafe\",\"cal\",\"call\",\"calvinklein\",\"cam\",\"camera\",\"camp\",\"canon\",\"capetown\",\"capital\",\"capitalone\",\"car\",\"caravan\",\"cards\",\"care\",\"career\",\"careers\",\"cars\",\"casa\",\"case\",\"cash\",\"casino\",\"cat\",\"catering\",\"catholic\",\"cba\",\"cbn\",\"cbre\",\"cc\",\"cd\",\"center\",\"ceo\",\"cern\",\"cf\",\"cfa\",\"cfd\",\"cg\",\"ch\",\"chanel\",\"channel\",\"charity\",\"chase\",\"chat\",\"cheap\",\"chintai\",\"christmas\",\"chrome\",\"church\",\"ci\",\"cipriani\",\"circle\",\"cisco\",\"citadel\",\"citi\",\"citic\",\"city\",\"ck\",\"cl\",\"claims\",\"cleaning\",\"click\",\"clinic\",\"clinique\",\"clothing\",\"cloud\",\"club\",\"clubmed\",\"cm\",\"cn\",\"co\",\"coach\",\"codes\",\"coffee\",\"college\",\"cologne\",\"com\",\"commbank\",\"community\",\"company\",\"compare\",\"computer\",\"comsec\",\"condos\",\"construction\",\"consulting\",\"contact\",\"contractors\",\"cooking\",\"cool\",\"coop\",\"corsica\",\"country\",\"coupon\",\"coupons\",\"courses\",\"cpa\",\"cr\",\"credit\",\"creditcard\",\"creditunion\",\"cricket\",\"crown\",\"crs\",\"cruise\",\"cruises\",\"cu\",\"cuisinella\",\"cv\",\"cw\",\"cx\",\"cy\",\"cymru\",\"cyou\",\"cz\",\"dad\",\"dance\",\"data\",\"date\",\"dating\",\"datsun\",\"day\",\"dclk\",\"dds\",\"de\",\"deal\",\"dealer\",\"deals\",\"degree\",\"delivery\",\"dell\",\"deloitte\",\"delta\",\"democrat\",\"dental\",\"dentist\",\"desi\",\"design\",\"dev\",\"dhl\",\"diamonds\",\"diet\",\"digital\",\"direct\",\"directory\",\"discount\",\"discover\",\"dish\",\"diy\",\"dj\",\"dk\",\"dm\",\"dnp\",\"do\",\"docs\",\"doctor\",\"dog\",\"domains\",\"dot\",\"download\",\"drive\",\"dtv\",\"dubai\",\"dupont\",\"durban\",\"dvag\",\"dvr\",\"dz\",\"earth\",\"eat\",\"ec\",\"eco\",\"edeka\",\"edu\",\"education\",\"ee\",\"eg\",\"email\",\"emerck\",\"energy\",\"engineer\",\"engineering\",\"enterprises\",\"epson\",\"equipment\",\"er\",\"ericsson\",\"erni\",\"es\",\"esq\",\"estate\",\"et\",\"eu\",\"eurovision\",\"eus\",\"events\",\"exchange\",\"expert\",\"exposed\",\"express\",\"extraspace\",\"fage\",\"fail\",\"fairwinds\",\"faith\",\"family\",\"fan\",\"fans\",\"farm\",\"farmers\",\"fashion\",\"fast\",\"fedex\",\"feedback\",\"ferrari\",\"ferrero\",\"fi\",\"fidelity\",\"fido\",\"film\",\"final\",\"finance\",\"financial\",\"fire\",\"firestone\",\"firmdale\",\"fish\",\"fishing\",\"fit\",\"fitness\",\"fj\",\"fk\",\"flickr\",\"flights\",\"flir\",\"florist\",\"flowers\",\"fly\",\"fm\",\"fo\",\"foo\",\"food\",\"football\",\"ford\",\"forex\",\"forsale\",\"forum\",\"foundation\",\"fox\",\"fr\",\"free\",\"fresenius\",\"frl\",\"frogans\",\"frontier\",\"ftr\",\"fujitsu\",\"fun\",\"fund\",\"furniture\",\"futbol\",\"fyi\",\"ga\",\"gal\",\"gallery\",\"gallo\",\"gallup\",\"game\",\"games\",\"gap\",\"garden\",\"gay\",\"gb\",\"gbiz\",\"gd\",\"gdn\",\"ge\",\"gea\",\"gent\",\"genting\",\"george\",\"gf\",\"gg\",\"ggee\",\"gh\",\"gi\",\"gift\",\"gifts\",\"gives\",\"giving\",\"gl\",\"glass\",\"gle\",\"global\",\"globo\",\"gm\",\"gmail\",\"gmbh\",\"gmo\",\"gmx\",\"gn\",\"godaddy\",\"gold\",\"goldpoint\",\"golf\",\"goo\",\"goodyear\",\"goog\",\"google\",\"gop\",\"got\",\"gov\",\"gp\",\"gq\",\"gr\",\"grainger\",\"graphics\",\"gratis\",\"green\",\"gripe\",\"grocery\",\"group\",\"gs\",\"gt\",\"gu\",\"gucci\",\"guge\",\"guide\",\"guitars\",\"guru\",\"gw\",\"gy\",\"hair\",\"hamburg\",\"hangout\",\"haus\",\"hbo\",\"hdfc\",\"hdfcbank\",\"health\",\"healthcare\",\"help\",\"helsinki\",\"here\",\"hermes\",\"hiphop\",\"hisamitsu\",\"hitachi\",\"hiv\",\"hk\",\"hkt\",\"hm\",\"hn\",\"hockey\",\"holdings\",\"holiday\",\"homedepot\",\"homegoods\",\"homes\",\"homesense\",\"honda\",\"horse\",\"hospital\",\"host\",\"hosting\",\"hot\",\"hotels\",\"hotmail\",\"house\",\"how\",\"hr\",\"hsbc\",\"ht\",\"hu\",\"hughes\",\"hyatt\",\"hyundai\",\"ibm\",\"icbc\",\"ice\",\"icu\",\"id\",\"ie\",\"ieee\",\"ifm\",\"ikano\",\"il\",\"im\",\"imamat\",\"imdb\",\"immo\",\"immobilien\",\"in\",\"inc\",\"industries\",\"infiniti\",\"info\",\"ing\",\"ink\",\"institute\",\"insurance\",\"insure\",\"int\",\"international\",\"intuit\",\"investments\",\"io\",\"ipiranga\",\"iq\",\"ir\",\"irish\",\"is\",\"ismaili\",\"ist\",\"istanbul\",\"it\",\"itau\",\"itv\",\"jaguar\",\"java\",\"jcb\",\"je\",\"jeep\",\"jetzt\",\"jewelry\",\"jio\",\"jll\",\"jm\",\"jmp\",\"jnj\",\"jo\",\"jobs\",\"joburg\",\"jot\",\"joy\",\"jp\",\"jpmorgan\",\"jprs\",\"juegos\",\"juniper\",\"kaufen\",\"kddi\",\"ke\",\"kerryhotels\",\"kerryproperties\",\"kfh\",\"kg\",\"kh\",\"ki\",\"kia\",\"kids\",\"kim\",\"kindle\",\"kitchen\",\"kiwi\",\"km\",\"kn\",\"koeln\",\"komatsu\",\"kosher\",\"kp\",\"kpmg\",\"kpn\",\"kr\",\"krd\",\"kred\",\"kuokgroup\",\"kw\",\"ky\",\"kyoto\",\"kz\",\"la\",\"lacaixa\",\"lamborghini\",\"lamer\",\"land\",\"landrover\",\"lanxess\",\"lasalle\",\"lat\",\"latino\",\"latrobe\",\"law\",\"lawyer\",\"lb\",\"lc\",\"lds\",\"lease\",\"leclerc\",\"lefrak\",\"legal\",\"lego\",\"lexus\",\"lgbt\",\"li\",\"lidl\",\"life\",\"lifeinsurance\",\"lifestyle\",\"lighting\",\"like\",\"lilly\",\"limited\",\"limo\",\"lincoln\",\"link\",\"live\",\"living\",\"lk\",\"llc\",\"llp\",\"loan\",\"loans\",\"locker\",\"locus\",\"lol\",\"london\",\"lotte\",\"lotto\",\"love\",\"lpl\",\"lplfinancial\",\"lr\",\"ls\",\"lt\",\"ltd\",\"ltda\",\"lu\",\"lundbeck\",\"luxe\",\"luxury\",\"lv\",\"ly\",\"ma\",\"madrid\",\"maif\",\"maison\",\"makeup\",\"man\",\"management\",\"mango\",\"map\",\"market\",\"marketing\",\"markets\",\"marriott\",\"marshalls\",\"mattel\",\"mba\",\"mc\",\"mckinsey\",\"md\",\"me\",\"med\",\"media\",\"meet\",\"melbourne\",\"meme\",\"memorial\",\"men\",\"menu\",\"merckmsd\",\"mg\",\"mh\",\"miami\",\"microsoft\",\"mil\",\"mini\",\"mint\",\"mit\",\"mitsubishi\",\"mk\",\"ml\",\"mlb\",\"mls\",\"mm\",\"mma\",\"mn\",\"mo\",\"mobi\",\"mobile\",\"moda\",\"moe\",\"moi\",\"mom\",\"monash\",\"money\",\"monster\",\"mormon\",\"mortgage\",\"moscow\",\"moto\",\"motorcycles\",\"mov\",\"movie\",\"mp\",\"mq\",\"mr\",\"ms\",\"msd\",\"mt\",\"mtn\",\"mtr\",\"mu\",\"museum\",\"music\",\"mv\",\"mw\",\"mx\",\"my\",\"mz\",\"na\",\"nab\",\"nagoya\",\"name\",\"navy\",\"nba\",\"nc\",\"ne\",\"nec\",\"net\",\"netbank\",\"netflix\",\"network\",\"neustar\",\"new\",\"news\",\"next\",\"nextdirect\",\"nexus\",\"nf\",\"nfl\",\"ng\",\"ngo\",\"nhk\",\"ni\",\"nico\",\"nike\",\"nikon\",\"ninja\",\"nissan\",\"nissay\",\"nl\",\"no\",\"nokia\",\"norton\",\"now\",\"nowruz\",\"nowtv\",\"np\",\"nr\",\"nra\",\"nrw\",\"ntt\",\"nu\",\"nyc\",\"nz\",\"obi\",\"observer\",\"office\",\"okinawa\",\"olayan\",\"olayangroup\",\"ollo\",\"om\",\"omega\",\"one\",\"ong\",\"onl\",\"online\",\"ooo\",\"open\",\"oracle\",\"orange\",\"org\",\"organic\",\"origins\",\"osaka\",\"otsuka\",\"ott\",\"ovh\",\"pa\",\"page\",\"panasonic\",\"paris\",\"pars\",\"partners\",\"parts\",\"party\",\"pay\",\"pccw\",\"pe\",\"pet\",\"pf\",\"pfizer\",\"pg\",\"ph\",\"pharmacy\",\"phd\",\"philips\",\"phone\",\"photo\",\"photography\",\"photos\",\"physio\",\"pics\",\"pictet\",\"pictures\",\"pid\",\"pin\",\"ping\",\"pink\",\"pioneer\",\"pizza\",\"pk\",\"pl\",\"place\",\"play\",\"playstation\",\"plumbing\",\"plus\",\"pm\",\"pn\",\"pnc\",\"pohl\",\"poker\",\"politie\",\"porn\",\"post\",\"pr\",\"praxi\",\"press\",\"prime\",\"pro\",\"prod\",\"productions\",\"prof\",\"progressive\",\"promo\",\"properties\",\"property\",\"protection\",\"pru\",\"prudential\",\"ps\",\"pt\",\"pub\",\"pw\",\"pwc\",\"py\",\"qa\",\"qpon\",\"quebec\",\"quest\",\"racing\",\"radio\",\"re\",\"read\",\"realestate\",\"realtor\",\"realty\",\"recipes\",\"red\",\"redumbrella\",\"rehab\",\"reise\",\"reisen\",\"reit\",\"reliance\",\"ren\",\"rent\",\"rentals\",\"repair\",\"report\",\"republican\",\"rest\",\"restaurant\",\"review\",\"reviews\",\"rexroth\",\"rich\",\"richardli\",\"ricoh\",\"ril\",\"rio\",\"rip\",\"ro\",\"rocks\",\"rodeo\",\"rogers\",\"room\",\"rs\",\"rsvp\",\"ru\",\"rugby\",\"ruhr\",\"run\",\"rw\",\"rwe\",\"ryukyu\",\"sa\",\"saarland\",\"safe\",\"safety\",\"sakura\",\"sale\",\"salon\",\"samsclub\",\"samsung\",\"sandvik\",\"sandvikcoromant\",\"sanofi\",\"sap\",\"sarl\",\"sas\",\"save\",\"saxo\",\"sb\",\"sbi\",\"sbs\",\"sc\",\"scb\",\"schaeffler\",\"schmidt\",\"scholarships\",\"school\",\"schule\",\"schwarz\",\"science\",\"scot\",\"sd\",\"se\",\"search\",\"seat\",\"secure\",\"security\",\"seek\",\"select\",\"sener\",\"services\",\"seven\",\"sew\",\"sex\",\"sexy\",\"sfr\",\"sg\",\"sh\",\"shangrila\",\"sharp\",\"shell\",\"shia\",\"shiksha\",\"shoes\",\"shop\",\"shopping\",\"shouji\",\"show\",\"si\",\"silk\",\"sina\",\"singles\",\"site\",\"sj\",\"sk\",\"ski\",\"skin\",\"sky\",\"skype\",\"sl\",\"sling\",\"sm\",\"smart\",\"smile\",\"sn\",\"sncf\",\"so\",\"soccer\",\"social\",\"softbank\",\"software\",\"sohu\",\"solar\",\"solutions\",\"song\",\"sony\",\"soy\",\"spa\",\"space\",\"sport\",\"spot\",\"sr\",\"srl\",\"ss\",\"st\",\"stada\",\"staples\",\"star\",\"statebank\",\"statefarm\",\"stc\",\"stcgroup\",\"stockholm\",\"storage\",\"store\",\"stream\",\"studio\",\"study\",\"style\",\"su\",\"sucks\",\"supplies\",\"supply\",\"support\",\"surf\",\"surgery\",\"suzuki\",\"sv\",\"swatch\",\"swiss\",\"sx\",\"sy\",\"sydney\",\"systems\",\"sz\",\"tab\",\"taipei\",\"talk\",\"taobao\",\"target\",\"tatamotors\",\"tatar\",\"tattoo\",\"tax\",\"taxi\",\"tc\",\"tci\",\"td\",\"tdk\",\"team\",\"tech\",\"technology\",\"tel\",\"temasek\",\"tennis\",\"teva\",\"tf\",\"tg\",\"th\",\"thd\",\"theater\",\"theatre\",\"tiaa\",\"tickets\",\"tienda\",\"tips\",\"tires\",\"tirol\",\"tj\",\"tjmaxx\",\"tjx\",\"tk\",\"tkmaxx\",\"tl\",\"tm\",\"tmall\",\"tn\",\"to\",\"today\",\"tokyo\",\"tools\",\"top\",\"toray\",\"toshiba\",\"total\",\"tours\",\"town\",\"toyota\",\"toys\",\"tr\",\"trade\",\"trading\",\"training\",\"travel\",\"travelers\",\"travelersinsurance\",\"trust\",\"trv\",\"tt\",\"tube\",\"tui\",\"tunes\",\"tushu\",\"tv\",\"tvs\",\"tw\",\"tz\",\"ua\",\"ubank\",\"ubs\",\"ug\",\"uk\",\"unicom\",\"university\",\"uno\",\"uol\",\"ups\",\"us\",\"uy\",\"uz\",\"va\",\"vacations\",\"vana\",\"vanguard\",\"vc\",\"ve\",\"vegas\",\"ventures\",\"verisign\",\"vermögensberater\",\"vermögensberatung\",\"versicherung\",\"vet\",\"vg\",\"vi\",\"viajes\",\"video\",\"vig\",\"viking\",\"villas\",\"vin\",\"vip\",\"virgin\",\"visa\",\"vision\",\"viva\",\"vivo\",\"vlaanderen\",\"vn\",\"vodka\",\"volvo\",\"vote\",\"voting\",\"voto\",\"voyage\",\"vu\",\"wales\",\"walmart\",\"walter\",\"wang\",\"wanggou\",\"watch\",\"watches\",\"weather\",\"weatherchannel\",\"webcam\",\"weber\",\"website\",\"wed\",\"wedding\",\"weibo\",\"weir\",\"wf\",\"whoswho\",\"wien\",\"wiki\",\"williamhill\",\"win\",\"windows\",\"wine\",\"winners\",\"wme\",\"wolterskluwer\",\"woodside\",\"work\",\"works\",\"world\",\"wow\",\"ws\",\"wtc\",\"wtf\",\"xbox\",\"xerox\",\"xihuan\",\"xin\",\"xxx\",\"xyz\",\"yachts\",\"yahoo\",\"yamaxun\",\"yandex\",\"ye\",\"yodobashi\",\"yoga\",\"yokohama\",\"you\",\"youtube\",\"yt\",\"yun\",\"za\",\"zappos\",\"zara\",\"zero\",\"zip\",\"zm\",\"zone\",\"zuerich\",\"zw\",\"ελ\",\"ευ\",\"бг\",\"бел\",\"дети\",\"ею\",\"католик\",\"ком\",\"мкд\",\"мон\",\"москва\",\"онлайн\",\"орг\",\"рус\",\"рф\",\"сайт\",\"срб\",\"укр\",\"қаз\",\"հայ\",\"ישראל\",\"קום\",\"ابوظبي\",\"ارامكو\",\"الاردن\",\"البحرين\",\"الجزائر\",\"السعودية\",\"العليان\",\"المغرب\",\"امارات\",\"ایران\",\"بارت\",\"بازار\",\"بيتك\",\"بھارت\",\"تونس\",\"سودان\",\"سورية\",\"شبكة\",\"عراق\",\"عرب\",\"عمان\",\"فلسطين\",\"قطر\",\"كاثوليك\",\"كوم\",\"مصر\",\"مليسيا\",\"موريتانيا\",\"موقع\",\"همراه\",\"پاکستان\",\"ڀارت\",\"कॉम\",\"नेट\",\"भारत\",\"भारतम्\",\"भारोत\",\"संगठन\",\"বাংলা\",\"ভারত\",\"ভাৰত\",\"ਭਾਰਤ\",\"ભારત\",\"ଭାରତ\",\"இந்தியா\",\"இலங்கை\",\"சிங்கப்பூர்\",\"భారత్\",\"ಭಾರತ\",\"ഭാരതം\",\"ලංකා\",\"คอม\",\"ไทย\",\"ລາວ\",\"გე\",\"みんな\",\"アマゾン\",\"クラウド\",\"グーグル\",\"コム\",\"ストア\",\"セール\",\"ファッション\",\"ポイント\",\"世界\",\"中信\",\"中国\",\"中國\",\"中文网\",\"亚马逊\",\"企业\",\"佛山\",\"信息\",\"健康\",\"八卦\",\"公司\",\"公益\",\"台湾\",\"台灣\",\"商城\",\"商店\",\"商标\",\"嘉里\",\"嘉里大酒店\",\"在线\",\"大拿\",\"天主教\",\"娱乐\",\"家電\",\"广东\",\"微博\",\"慈善\",\"我爱你\",\"手机\",\"招聘\",\"政务\",\"政府\",\"新加坡\",\"新闻\",\"时尚\",\"書籍\",\"机构\",\"淡马锡\",\"游戏\",\"澳門\",\"点看\",\"移动\",\"组织机构\",\"网址\",\"网店\",\"网站\",\"网络\",\"联通\",\"谷歌\",\"购物\",\"通販\",\"集团\",\"電訊盈科\",\"飞利浦\",\"食品\",\"餐厅\",\"香格里拉\",\"香港\",\"닷넷\",\"닷컴\",\"삼성\",\"한국\"]"));}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__308b6270._.js.map