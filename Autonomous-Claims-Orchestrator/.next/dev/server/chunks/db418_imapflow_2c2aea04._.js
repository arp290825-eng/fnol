module.exports = [
"[project]/Autonomous-Claims-Orchestrator/node_modules/imapflow/lib/logger.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const logger = __turbopack_context__.r("[externals]/pino [external] (pino, cjs, [project]/Autonomous-Claims-Orchestrator/node_modules/pino)")();
logger.level = 'trace';
module.exports = logger;
}),
"[project]/Autonomous-Claims-Orchestrator/node_modules/imapflow/lib/limited-passthrough.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const { Transform } = __turbopack_context__.r("[externals]/stream [external] (stream, cjs)");
class LimitedPassthrough extends Transform {
    constructor(options){
        super();
        this.options = options || {};
        this.maxBytes = this.options.maxBytes || Infinity;
        this.processed = 0;
        this.limited = false;
    }
    _transform(chunk, encoding, done) {
        if (this.limited) {
            return done();
        }
        if (this.processed + chunk.length > this.maxBytes) {
            if (this.maxBytes - this.processed < 1) {
                return done();
            }
            chunk = chunk.slice(0, this.maxBytes - this.processed);
        }
        this.processed += chunk.length;
        if (this.processed >= this.maxBytes) {
            this.limited = true;
        }
        this.push(chunk);
        done();
    }
}
module.exports.LimitedPassthrough = LimitedPassthrough;
}),
"[project]/Autonomous-Claims-Orchestrator/node_modules/imapflow/lib/handler/imap-stream.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const Transform = __turbopack_context__.r("[externals]/stream [external] (stream, cjs)").Transform;
const logger = __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/imapflow/lib/logger.js [app-route] (ecmascript)");
const LINE = 0x01;
const LITERAL = 0x02;
const LF = 0x0a;
const CR = 0x0d;
const NUM_0 = 0x30;
const NUM_9 = 0x39;
const CURLY_OPEN = 0x7b;
const CURLY_CLOSE = 0x7d;
// Maximum allowed literal size: 1GB (1073741824 bytes)
const MAX_LITERAL_SIZE = 1024 * 1024 * 1024;
class ImapStream extends Transform {
    constructor(options){
        super({
            //writableHighWaterMark: 3,
            readableObjectMode: true,
            writableObjectMode: false
        });
        this.options = options || {};
        this.cid = this.options.cid;
        this.log = this.options.logger && typeof this.options.logger === 'object' ? this.options.logger : logger.child({
            component: 'imap-connection',
            cid: this.cid
        });
        this.readBytesCounter = 0;
        this.state = LINE;
        this.literalWaiting = 0;
        this.inputBuffer = []; // lines
        this.lineBuffer = []; // current line
        this.literalBuffer = [];
        this.literals = [];
        this.compress = false;
        this.secureConnection = this.options.secureConnection;
        this.processingInput = false;
        this.inputQueue = []; // unprocessed input chunks
    }
    checkLiteralMarker(line) {
        if (!line || !line.length) {
            return false;
        }
        let pos = line.length - 1;
        if (line[pos] === LF) {
            pos--;
        } else {
            return false;
        }
        if (pos >= 0 && line[pos] === CR) {
            pos--;
        }
        if (pos < 0) {
            return false;
        }
        if (!pos || line[pos] !== CURLY_CLOSE) {
            return false;
        }
        pos--;
        let numBytes = [];
        for(; pos > 0; pos--){
            let c = line[pos];
            if (c >= NUM_0 && c <= NUM_9) {
                numBytes.unshift(c);
                continue;
            }
            if (c === CURLY_OPEN && numBytes.length) {
                const literalSize = Number(Buffer.from(numBytes).toString());
                if (literalSize > MAX_LITERAL_SIZE) {
                    const err = new Error(`Literal size ${literalSize} exceeds maximum allowed size of ${MAX_LITERAL_SIZE} bytes`);
                    err.code = 'LiteralTooLarge';
                    err.literalSize = literalSize;
                    err.maxSize = MAX_LITERAL_SIZE;
                    this.emit('error', err);
                    return false;
                }
                this.state = LITERAL;
                this.literalWaiting = literalSize;
                return true;
            }
            return false;
        }
        return false;
    }
    async processInputChunk(chunk, startPos) {
        startPos = startPos || 0;
        if (startPos >= chunk.length) {
            return;
        }
        switch(this.state){
            case LINE:
                {
                    let lineStart = startPos;
                    for(let i = startPos, len = chunk.length; i < len; i++){
                        if (chunk[i] === LF) {
                            // line end found
                            this.lineBuffer.push(chunk.slice(lineStart, i + 1));
                            lineStart = i + 1;
                            let line = Buffer.concat(this.lineBuffer);
                            this.inputBuffer.push(line);
                            this.lineBuffer = [];
                            // try to detect if this is a literal start
                            if (this.checkLiteralMarker(line)) {
                                // switch into line mode and start over
                                return await this.processInputChunk(chunk, lineStart);
                            }
                            // reached end of command input, emit it
                            let payload = this.inputBuffer.length === 1 ? this.inputBuffer[0] : Buffer.concat(this.inputBuffer);
                            let literals = this.literals;
                            this.inputBuffer = [];
                            this.literals = [];
                            if (payload.length) {
                                // remove final line terminator
                                let skipBytes = 0;
                                if (payload.length >= 1 && payload[payload.length - 1] === LF) {
                                    skipBytes++;
                                    if (payload.length >= 2 && payload[payload.length - 2] === CR) {
                                        skipBytes++;
                                    }
                                }
                                if (skipBytes) {
                                    payload = payload.slice(0, payload.length - skipBytes);
                                }
                                if (payload.length) {
                                    await new Promise((resolve)=>{
                                        this.push({
                                            payload,
                                            literals,
                                            next: resolve
                                        });
                                    });
                                }
                            }
                        }
                    }
                    if (lineStart < chunk.length) {
                        this.lineBuffer.push(chunk.slice(lineStart));
                    }
                    break;
                }
            case LITERAL:
                {
                    // exactly until end of chunk
                    if (chunk.length === startPos + this.literalWaiting) {
                        if (!startPos) {
                            this.literalBuffer.push(chunk);
                        } else {
                            this.literalBuffer.push(chunk.slice(startPos));
                        }
                        this.literalWaiting -= chunk.length;
                        this.literals.push(Buffer.concat(this.literalBuffer));
                        this.literalBuffer = [];
                        this.state = LINE;
                        return;
                    } else if (chunk.length > startPos + this.literalWaiting) {
                        let partial = chunk.slice(startPos, startPos + this.literalWaiting);
                        this.literalBuffer.push(partial);
                        startPos += partial.length;
                        this.literalWaiting -= partial.length;
                        this.literals.push(Buffer.concat(this.literalBuffer));
                        this.literalBuffer = [];
                        this.state = LINE;
                        return await this.processInputChunk(chunk, startPos);
                    } else {
                        let partial = chunk.slice(startPos);
                        this.literalBuffer.push(partial);
                        startPos += partial.length;
                        this.literalWaiting -= partial.length;
                        return;
                    }
                }
        }
    }
    async processInput() {
        let data;
        let processedCount = 0;
        while(data = this.inputQueue.shift()){
            await this.processInputChunk(data.chunk);
            // mark chunk as processed
            data.next();
            // Yield to event loop every 10 chunks to prevent CPU blocking
            processedCount++;
            if (processedCount % 10 === 0) {
                await new Promise((resolve)=>setImmediate(resolve));
            }
        }
    }
    _transform(chunk, encoding, next) {
        if (typeof chunk === 'string') {
            chunk = Buffer.from(chunk, encoding);
        }
        if (!chunk || !chunk.length) {
            return next();
        }
        this.readBytesCounter += chunk.length;
        if (this.options.logRaw) {
            this.log.trace({
                src: 's',
                msg: 'read from socket',
                data: chunk.toString('base64'),
                compress: !!this.compress,
                secure: !!this.secureConnection,
                cid: this.cid
            });
        }
        if (chunk && chunk.length) {
            this.inputQueue.push({
                chunk,
                next
            });
        }
        if (!this.processingInput) {
            this.processingInput = true;
            this.processInput().catch((err)=>this.emit('error', err)).finally(()=>this.processingInput = false);
        }
    }
    _flush(next) {
        next();
    }
    _destroy(err, callback) {
        this.inputBuffer = [];
        this.lineBuffer = [];
        this.literalBuffer = [];
        this.literals = [];
        // Clear inputQueue and call any pending callbacks
        while(this.inputQueue.length){
            const item = this.inputQueue.shift();
            if (typeof item.next === 'function') {
                item.next();
            }
        }
        callback(err);
    }
}
module.exports.ImapStream = ImapStream;
}),
"[project]/Autonomous-Claims-Orchestrator/node_modules/imapflow/lib/handler/imap-formal-syntax.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/* eslint object-shorthand:0, new-cap: 0, no-useless-concat: 0 */ // IMAP Formal Syntax
// http://tools.ietf.org/html/rfc3501#section-9
function expandRange(start, end) {
    let chars = [];
    for(let i = start; i <= end; i++){
        chars.push(i);
    }
    return String.fromCharCode(...chars);
}
function excludeChars(source, exclude) {
    let sourceArr = Array.prototype.slice.call(source);
    for(let i = sourceArr.length - 1; i >= 0; i--){
        if (exclude.indexOf(sourceArr[i]) >= 0) {
            sourceArr.splice(i, 1);
        }
    }
    return sourceArr.join('');
}
module.exports = {
    CHAR () {
        let value = expandRange(0x01, 0x7f);
        this.CHAR = function() {
            return value;
        };
        return value;
    },
    CHAR8 () {
        let value = expandRange(0x01, 0xff);
        this.CHAR8 = function() {
            return value;
        };
        return value;
    },
    SP () {
        return ' ';
    },
    CTL () {
        let value = expandRange(0x00, 0x1f) + '\x7F';
        this.CTL = function() {
            return value;
        };
        return value;
    },
    DQUOTE () {
        return '"';
    },
    ALPHA () {
        let value = expandRange(0x41, 0x5a) + expandRange(0x61, 0x7a);
        this.ALPHA = function() {
            return value;
        };
        return value;
    },
    DIGIT () {
        let value = expandRange(0x30, 0x39);
        this.DIGIT = function() {
            return value;
        };
        return value;
    },
    'ATOM-CHAR' () {
        let value = excludeChars(this.CHAR(), this['atom-specials']());
        this['ATOM-CHAR'] = function() {
            return value;
        };
        return value;
    },
    'ASTRING-CHAR' () {
        let value = this['ATOM-CHAR']() + this['resp-specials']();
        this['ASTRING-CHAR'] = function() {
            return value;
        };
        return value;
    },
    'TEXT-CHAR' () {
        let value = excludeChars(this.CHAR(), '\r\n');
        this['TEXT-CHAR'] = function() {
            return value;
        };
        return value;
    },
    'atom-specials' () {
        let value = '(' + ')' + '{' + this.SP() + this.CTL() + this['list-wildcards']() + this['quoted-specials']() + this['resp-specials']();
        this['atom-specials'] = function() {
            return value;
        };
        return value;
    },
    'list-wildcards' () {
        return '%' + '*';
    },
    'quoted-specials' () {
        let value = this.DQUOTE() + '\\';
        this['quoted-specials'] = function() {
            return value;
        };
        return value;
    },
    'resp-specials' () {
        return ']';
    },
    tag () {
        let value = excludeChars(this['ASTRING-CHAR'](), '+');
        this.tag = function() {
            return value;
        };
        return value;
    },
    command () {
        let value = this.ALPHA() + this.DIGIT() + '-';
        this.command = function() {
            return value;
        };
        return value;
    },
    verify (str, allowedChars) {
        for(let i = 0, len = str.length; i < len; i++){
            if (allowedChars.indexOf(str.charAt(i)) < 0) {
                return i;
            }
        }
        return -1;
    }
};
}),
"[project]/Autonomous-Claims-Orchestrator/node_modules/imapflow/lib/handler/token-parser.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/* eslint new-cap: 0 */ const imapFormalSyntax = __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/imapflow/lib/handler/imap-formal-syntax.js [app-route] (ecmascript)");
const STATE_ATOM = 0x001;
const STATE_LITERAL = 0x002;
const STATE_NORMAL = 0x003;
const STATE_PARTIAL = 0x004;
const STATE_SEQUENCE = 0x005;
const STATE_STRING = 0x006;
const STATE_TEXT = 0x007;
const RE_DIGITS = /^\d+$/;
const RE_SINGLE_DIGIT = /^\d$/;
const MAX_NODE_DEPTH = 25;
class TokenParser {
    constructor(parent, startPos, str, options){
        this.str = (str || '').toString();
        this.options = options || {};
        this.parent = parent;
        this.tree = this.currentNode = this.createNode();
        this.pos = startPos || 0;
        this.currentNode.type = 'TREE';
        this.state = STATE_NORMAL;
    }
    async getAttributes() {
        await this.processString();
        const attributes = [];
        let branch = attributes;
        let walk = async (node)=>{
            let curBranch = branch;
            let elm;
            let partial;
            if (!node.isClosed && node.type === 'SEQUENCE' && node.value === '*') {
                node.isClosed = true;
                node.type = 'ATOM';
            }
            // If the node was never closed, throw it
            if (!node.isClosed) {
                let error = new Error(`Unexpected end of input at position ${this.pos + this.str.length - 1} [E9]`);
                error.code = 'ParserError9';
                error.parserContext = {
                    input: this.str,
                    pos: this.pos + this.str.length - 1
                };
                throw error;
            }
            let type = (node.type || '').toString().toUpperCase();
            switch(type){
                case 'LITERAL':
                case 'STRING':
                case 'SEQUENCE':
                    elm = {
                        type: node.type.toUpperCase(),
                        value: node.value
                    };
                    branch.push(elm);
                    break;
                case 'ATOM':
                    if (node.value.toUpperCase() === 'NIL') {
                        branch.push(null);
                        break;
                    }
                    elm = {
                        type: node.type.toUpperCase(),
                        value: node.value
                    };
                    branch.push(elm);
                    break;
                case 'SECTION':
                    branch = branch[branch.length - 1].section = [];
                    break;
                case 'LIST':
                    elm = [];
                    branch.push(elm);
                    branch = elm;
                    break;
                case 'PARTIAL':
                    partial = node.value.split('.').map(Number);
                    branch[branch.length - 1].partial = partial;
                    break;
            }
            for (let childNode of node.childNodes){
                await walk(childNode);
            }
            branch = curBranch;
        };
        await walk(this.tree);
        return attributes;
    }
    createNode(parentNode, startPos) {
        let node = {
            childNodes: [],
            type: false,
            value: '',
            isClosed: true
        };
        if (parentNode) {
            node.parentNode = parentNode;
            node.depth = parentNode.depth + 1;
        } else {
            node.depth = 0;
        }
        if (node.depth > MAX_NODE_DEPTH) {
            let error = new Error('Too much nesting in IMAP string');
            error.code = 'MAX_IMAP_NESTING_REACHED';
            error._imapStr = this.str;
            throw error;
        }
        if (typeof startPos === 'number') {
            node.startPos = startPos;
        }
        if (parentNode) {
            parentNode.childNodes.push(node);
        }
        return node;
    }
    async processString() {
        let chr, i, len;
        const checkSP = ()=>{
            // jump to the next non whitespace pos
            while(this.str.charAt(i + 1) === ' '){
                i++;
            }
        };
        for(i = 0, len = this.str.length; i < len; i++){
            chr = this.str.charAt(i);
            switch(this.state){
                case STATE_NORMAL:
                    switch(chr){
                        // DQUOTE starts a new string
                        case '"':
                            this.currentNode = this.createNode(this.currentNode, this.pos + i);
                            this.currentNode.type = 'string';
                            this.state = STATE_STRING;
                            this.currentNode.isClosed = false;
                            break;
                        // ( starts a new list
                        case '(':
                            this.currentNode = this.createNode(this.currentNode, this.pos + i);
                            this.currentNode.type = 'LIST';
                            this.currentNode.isClosed = false;
                            break;
                        // ) closes a list
                        case ')':
                            if (this.currentNode.type !== 'LIST') {
                                let error = new Error(`Unexpected list terminator ) at position ${this.pos + i} [E10]`);
                                error.code = 'ParserError10';
                                error.parserContext = {
                                    input: this.str,
                                    pos: this.pos + i,
                                    chr
                                };
                                throw error;
                            }
                            this.currentNode.isClosed = true;
                            this.currentNode.endPos = this.pos + i;
                            this.currentNode = this.currentNode.parentNode;
                            checkSP();
                            break;
                        // ] closes section group
                        case ']':
                            if (this.currentNode.type !== 'SECTION') {
                                let error = new Error(`Unexpected section terminator ] at position ${this.pos + i} [E11]`);
                                error.code = 'ParserError11';
                                error.parserContext = {
                                    input: this.str,
                                    pos: this.pos + i,
                                    chr
                                };
                                throw error;
                            }
                            this.currentNode.isClosed = true;
                            this.currentNode.endPos = this.pos + i;
                            this.currentNode = this.currentNode.parentNode;
                            checkSP();
                            break;
                        // < starts a new partial
                        case '<':
                            if (this.str.charAt(i - 1) !== ']') {
                                this.currentNode = this.createNode(this.currentNode, this.pos + i);
                                this.currentNode.type = 'ATOM';
                                this.currentNode.value = chr;
                                this.state = STATE_ATOM;
                            } else {
                                this.currentNode = this.createNode(this.currentNode, this.pos + i);
                                this.currentNode.type = 'PARTIAL';
                                this.state = STATE_PARTIAL;
                                this.currentNode.isClosed = false;
                            }
                            break;
                        // binary literal8
                        case '~':
                            {
                                let nextChr = this.str.charAt(i + 1);
                                if (nextChr !== '{') {
                                    if (imapFormalSyntax['ATOM-CHAR']().indexOf(nextChr) >= 0) {
                                        // treat as ATOM
                                        this.currentNode = this.createNode(this.currentNode, this.pos + i);
                                        this.currentNode.type = 'ATOM';
                                        this.currentNode.value = chr;
                                        this.state = STATE_ATOM;
                                        break;
                                    }
                                    let error = new Error(`Unexpected literal8 marker at position ${this.pos + i} [E12]`);
                                    error.code = 'ParserError12';
                                    error.parserContext = {
                                        input: this.str,
                                        pos: this.pos + i,
                                        chr
                                    };
                                    throw error;
                                }
                                this.expectedLiteralType = 'literal8';
                                break;
                            }
                        // { starts a new literal
                        case '{':
                            this.currentNode = this.createNode(this.currentNode, this.pos + i);
                            this.currentNode.type = 'LITERAL';
                            this.currentNode.literalType = this.expectedLiteralType || 'literal';
                            this.expectedLiteralType = false;
                            this.state = STATE_LITERAL;
                            this.currentNode.isClosed = false;
                            break;
                        // * starts a new sequence
                        case '*':
                            this.currentNode = this.createNode(this.currentNode, this.pos + i);
                            this.currentNode.type = 'SEQUENCE';
                            this.currentNode.value = chr;
                            this.currentNode.isClosed = false;
                            this.state = STATE_SEQUENCE;
                            break;
                        // normally a space should never occur
                        case ' ':
                            break;
                        // [ starts section
                        case '[':
                            // If it is the *first* element after response command, then process as a response argument list
                            if ([
                                'OK',
                                'NO',
                                'BAD',
                                'BYE',
                                'PREAUTH'
                            ].includes(this.parent.command.toUpperCase()) && this.currentNode === this.tree) {
                                this.currentNode.endPos = this.pos + i;
                                this.currentNode = this.createNode(this.currentNode, this.pos + i);
                                this.currentNode.type = 'ATOM';
                                this.currentNode = this.createNode(this.currentNode, this.pos + i);
                                this.currentNode.type = 'SECTION';
                                this.currentNode.isClosed = false;
                                this.state = STATE_NORMAL;
                                // RFC2221 defines a response code REFERRAL whose payload is an
                                // RFC2192/RFC5092 imapurl that we will try to parse as an ATOM but
                                // fail quite badly at parsing.  Since the imapurl is such a unique
                                // (and crazy) term, we just specialize that case here.
                                if (this.str.substr(i + 1, 9).toUpperCase() === 'REFERRAL ') {
                                    // create the REFERRAL atom
                                    this.currentNode = this.createNode(this.currentNode, this.pos + i + 1);
                                    this.currentNode.type = 'ATOM';
                                    this.currentNode.endPos = this.pos + i + 8;
                                    this.currentNode.value = 'REFERRAL';
                                    this.currentNode = this.currentNode.parentNode;
                                    // eat all the way through the ] to be the  IMAPURL token.
                                    this.currentNode = this.createNode(this.currentNode, this.pos + i + 10);
                                    // just call this an ATOM, even though IMAPURL might be more correct
                                    this.currentNode.type = 'ATOM';
                                    // jump i to the ']'
                                    i = this.str.indexOf(']', i + 10);
                                    this.currentNode.endPos = this.pos + i - 1;
                                    this.currentNode.value = this.str.substring(this.currentNode.startPos - this.pos, this.currentNode.endPos - this.pos + 1);
                                    this.currentNode = this.currentNode.parentNode;
                                    // close out the SECTION
                                    this.currentNode.isClosed = true;
                                    this.currentNode = this.currentNode.parentNode;
                                    checkSP();
                                }
                                break;
                            }
                        /* falls through */ default:
                            // Any ATOM supported char starts a new Atom sequence, otherwise throw an error
                            // Allow \ as the first char for atom to support system flags
                            // Allow % to support LIST '' %
                            // Allow 8bit characters (presumably unicode)
                            if (imapFormalSyntax['ATOM-CHAR']().indexOf(chr) < 0 && chr !== '\\' && chr !== '%' && chr.charCodeAt(0) < 0x80) {
                                let error = new Error(`Unexpected char at position ${this.pos + i} [E13: ${JSON.stringify(chr)}]`);
                                error.code = 'ParserError13';
                                error.parserContext = {
                                    input: this.str,
                                    pos: this.pos + i,
                                    chr
                                };
                                throw error;
                            }
                            this.currentNode = this.createNode(this.currentNode, this.pos + i);
                            this.currentNode.type = 'ATOM';
                            this.currentNode.value = chr;
                            this.state = STATE_ATOM;
                            break;
                    }
                    break;
                case STATE_ATOM:
                    // space finishes an atom
                    if (chr === ' ') {
                        this.currentNode.endPos = this.pos + i - 1;
                        this.currentNode = this.currentNode.parentNode;
                        this.state = STATE_NORMAL;
                        break;
                    }
                    //
                    if (this.currentNode.parentNode && (chr === ')' && this.currentNode.parentNode.type === 'LIST' || chr === ']' && this.currentNode.parentNode.type === 'SECTION')) {
                        this.currentNode.endPos = this.pos + i - 1;
                        this.currentNode = this.currentNode.parentNode;
                        this.currentNode.isClosed = true;
                        this.currentNode.endPos = this.pos + i;
                        this.currentNode = this.currentNode.parentNode;
                        this.state = STATE_NORMAL;
                        checkSP();
                        break;
                    }
                    if ((chr === ',' || chr === ':') && RE_DIGITS.test(this.currentNode.value)) {
                        this.currentNode.type = 'SEQUENCE';
                        this.currentNode.isClosed = true;
                        this.state = STATE_SEQUENCE;
                    }
                    // [ starts a section group for this element
                    // Allowed only for selected elements, otherwise falls through to regular ATOM processing
                    if (chr === '[' && [
                        'BODY',
                        'BODY.PEEK',
                        'BINARY',
                        'BINARY.PEEK'
                    ].indexOf(this.currentNode.value.toUpperCase()) >= 0) {
                        this.currentNode.endPos = this.pos + i;
                        this.currentNode = this.createNode(this.currentNode.parentNode, this.pos + i);
                        this.currentNode.type = 'SECTION';
                        this.currentNode.isClosed = false;
                        this.state = STATE_NORMAL;
                        break;
                    }
                    // if the char is not ATOM compatible, throw. Allow \* as an exception
                    if (imapFormalSyntax['ATOM-CHAR']().indexOf(chr) < 0 && chr.charCodeAt(0) < 0x80 && // allow 8bit (presumably unicode) bytes
                    chr !== ']' && !(chr === '*' && this.currentNode.value === '\\') && (!this.parent || !this.parent.command || ![
                        'NO',
                        'BAD',
                        'OK'
                    ].includes(this.parent.command))) {
                        let error = new Error(`Unexpected char at position ${this.pos + i} [E16: ${JSON.stringify(chr)}]`);
                        error.code = 'ParserError16';
                        error.parserContext = {
                            input: this.str,
                            pos: this.pos + i,
                            chr
                        };
                        throw error;
                    } else if (this.currentNode.value === '\\*') {
                        let error = new Error(`Unexpected char at position ${this.pos + i} [E17: ${JSON.stringify(chr)}]`);
                        error.code = 'ParserError17';
                        error.parserContext = {
                            input: this.str,
                            pos: this.pos + i,
                            chr
                        };
                        throw error;
                    }
                    this.currentNode.value += chr;
                    break;
                case STATE_STRING:
                    // DQUOTE ends the string sequence
                    if (chr === '"') {
                        this.currentNode.endPos = this.pos + i;
                        this.currentNode.isClosed = true;
                        this.currentNode = this.currentNode.parentNode;
                        this.state = STATE_NORMAL;
                        checkSP();
                        break;
                    }
                    // \ Escapes the following char
                    if (chr === '\\') {
                        i++;
                        if (i >= len) {
                            let error = new Error(`Unexpected end of input at position ${this.pos + i} [E18]`);
                            error.code = 'ParserError18';
                            error.parserContext = {
                                input: this.str,
                                pos: this.pos + i
                            };
                            throw error;
                        }
                        chr = this.str.charAt(i);
                    }
                    this.currentNode.value += chr;
                    break;
                case STATE_PARTIAL:
                    if (chr === '>') {
                        if (this.currentNode.value.at(-1) === '.') {
                            let error = new Error(`Unexpected end of partial at position ${this.pos + i} [E19]`);
                            error.code = 'ParserError19';
                            error.parserContext = {
                                input: this.str,
                                pos: this.pos + i,
                                chr
                            };
                            throw error;
                        }
                        this.currentNode.endPos = this.pos + i;
                        this.currentNode.isClosed = true;
                        this.currentNode = this.currentNode.parentNode;
                        this.state = STATE_NORMAL;
                        checkSP();
                        break;
                    }
                    if (chr === '.' && (!this.currentNode.value.length || this.currentNode.value.match(/\./))) {
                        let error = new Error(`Unexpected partial separator . at position ${this.pos + i} [E20]`);
                        error.code = 'ParserError20';
                        error.parserContext = {
                            input: this.str,
                            pos: this.pos + i,
                            chr
                        };
                        throw error;
                    }
                    if (imapFormalSyntax.DIGIT().indexOf(chr) < 0 && chr !== '.') {
                        let error = new Error(`Unexpected char at position ${this.pos + i} [E21: ${JSON.stringify(chr)}]`);
                        error.code = 'ParserError21';
                        error.parserContext = {
                            input: this.str,
                            pos: this.pos + i,
                            chr
                        };
                        throw error;
                    }
                    if (this.currentNode.value.match(/^0$|\.0$/) && chr !== '.') {
                        let error = new Error(`Invalid partial at position ${this.pos + i} [E22: ${JSON.stringify(chr)}]`);
                        error.code = 'ParserError22';
                        error.parserContext = {
                            input: this.str,
                            pos: this.pos + i,
                            chr
                        };
                        throw error;
                    }
                    this.currentNode.value += chr;
                    break;
                case STATE_LITERAL:
                    if (this.currentNode.started) {
                        // only relevant if literals are not already parsed out from input
                        // Disabled NULL byte check
                        // See https://github.com/emailjs/emailjs-imap-handler/commit/f11b2822bedabe492236e8263afc630134a3c41c
                        /*
                        if (chr === '\u0000') {
                            throw new Error('Unexpected \\x00 at position ' + (this.pos + i));
                        }
                        */ this.currentNode.chBuffer[this.currentNode.chPos++] = chr.charCodeAt(0);
                        if (this.currentNode.chPos >= this.currentNode.literalLength) {
                            this.currentNode.endPos = this.pos + i;
                            this.currentNode.isClosed = true;
                            this.currentNode.value = this.currentNode.chBuffer.toString('binary');
                            this.currentNode.chBuffer = Buffer.alloc(0);
                            this.currentNode = this.currentNode.parentNode;
                            this.state = STATE_NORMAL;
                            checkSP();
                        }
                        break;
                    }
                    if (chr === '+' && this.options.literalPlus) {
                        this.currentNode.literalPlus = true;
                        break;
                    }
                    if (chr === '}') {
                        if (!('literalLength' in this.currentNode)) {
                            let error = new Error(`Unexpected literal prefix end char } at position ${this.pos + i} [E23]`);
                            error.code = 'ParserError23';
                            error.parserContext = {
                                input: this.str,
                                pos: this.pos + i,
                                chr
                            };
                            throw error;
                        }
                        if (this.str.charAt(i + 1) === '\n') {
                            i++;
                        } else if (this.str.charAt(i + 1) === '\r' && this.str.charAt(i + 2) === '\n') {
                            i += 2;
                        } else {
                            let error = new Error(`Unexpected char at position ${this.pos + i} [E24: ${JSON.stringify(chr)}]`);
                            error.code = 'ParserError24';
                            error.parserContext = {
                                input: this.str,
                                pos: this.pos + i,
                                chr
                            };
                            throw error;
                        }
                        this.currentNode.literalLength = Number(this.currentNode.literalLength);
                        if (!this.currentNode.literalLength) {
                            // special case where literal content length is 0
                            // close the node right away, do not wait for additional input
                            this.currentNode.endPos = this.pos + i;
                            this.currentNode.isClosed = true;
                            this.currentNode = this.currentNode.parentNode;
                            this.state = STATE_NORMAL;
                            checkSP();
                        } else if (this.options.literals) {
                            // use the next precached literal values
                            this.currentNode.value = this.options.literals.shift();
                            // only APPEND arguments are kept as Buffers
                            /*
                            if ((this.parent.command || '').toString().toUpperCase() !== 'APPEND') {
                                this.currentNode.value = this.currentNode.value.toString('binary');
                            }
                            */ this.currentNode.endPos = this.pos + i + this.currentNode.value.length;
                            this.currentNode.started = false;
                            this.currentNode.isClosed = true;
                            this.currentNode = this.currentNode.parentNode;
                            this.state = STATE_NORMAL;
                            checkSP();
                        } else {
                            this.currentNode.started = true;
                            // Allocate expected size buffer. Max size check is already performed
                            // Maybe should use allocUnsafe instead?
                            this.currentNode.chBuffer = Buffer.alloc(this.currentNode.literalLength);
                            this.currentNode.chPos = 0;
                        }
                        break;
                    }
                    if (imapFormalSyntax.DIGIT().indexOf(chr) < 0) {
                        let error = new Error(`Unexpected char at position ${this.pos + i} [E25: ${JSON.stringify(chr)}]`);
                        error.code = 'ParserError25';
                        error.parserContext = {
                            input: this.str,
                            pos: this.pos + i,
                            chr
                        };
                        throw error;
                    }
                    if (this.currentNode.literalLength === '0') {
                        let error = new Error(`Invalid literal at position ${this.pos + i} [E26]`);
                        error.code = 'ParserError26';
                        error.parserContext = {
                            input: this.str,
                            pos: this.pos + i,
                            chr
                        };
                        throw error;
                    }
                    this.currentNode.literalLength = (this.currentNode.literalLength || '') + chr;
                    break;
                case STATE_SEQUENCE:
                    // space finishes the sequence set
                    if (chr === ' ') {
                        if (!RE_SINGLE_DIGIT.test(this.currentNode.value.at(-1)) && this.currentNode.value.at(-1) !== '*') {
                            let error = new Error(`Unexpected whitespace at position ${this.pos + i} [E27]`);
                            error.code = 'ParserError27';
                            error.parserContext = {
                                input: this.str,
                                pos: this.pos + i,
                                chr
                            };
                            throw error;
                        }
                        if (this.currentNode.value !== '*' && this.currentNode.value.at(-1) === '*' && this.currentNode.value.at(-2) !== ':') {
                            let error = new Error(`Unexpected whitespace at position ${this.pos + i} [E28]`);
                            error.code = 'ParserError28';
                            error.parserContext = {
                                input: this.str,
                                pos: this.pos + i,
                                chr
                            };
                            throw error;
                        }
                        this.currentNode.isClosed = true;
                        this.currentNode.endPos = this.pos + i - 1;
                        this.currentNode = this.currentNode.parentNode;
                        this.state = STATE_NORMAL;
                        break;
                    } else if (this.currentNode.parentNode && chr === ']' && this.currentNode.parentNode.type === 'SECTION') {
                        this.currentNode.endPos = this.pos + i - 1;
                        this.currentNode = this.currentNode.parentNode;
                        this.currentNode.isClosed = true;
                        this.currentNode.endPos = this.pos + i;
                        this.currentNode = this.currentNode.parentNode;
                        this.state = STATE_NORMAL;
                        checkSP();
                        break;
                    }
                    if (chr === ':') {
                        if (!RE_SINGLE_DIGIT.test(this.currentNode.value.at(-1)) && this.currentNode.value.at(-1) !== '*') {
                            let error = new Error(`Unexpected range separator : at position ${this.pos + i} [E29]`);
                            error.code = 'ParserError29';
                            error.parserContext = {
                                input: this.str,
                                pos: this.pos + i,
                                chr
                            };
                            throw error;
                        }
                    } else if (chr === '*') {
                        if ([
                            ',',
                            ':'
                        ].indexOf(this.currentNode.value.at(-1)) < 0) {
                            let error = new Error(`Unexpected range wildcard at position ${this.pos + i} [E30]`);
                            error.code = 'ParserError30';
                            error.parserContext = {
                                input: this.str,
                                pos: this.pos + i,
                                chr
                            };
                            throw error;
                        }
                    } else if (chr === ',') {
                        if (!RE_SINGLE_DIGIT.test(this.currentNode.value.at(-1)) && this.currentNode.value.at(-1) !== '*') {
                            let error = new Error(`Unexpected sequence separator , at position ${this.pos + i} [E31]`);
                            error.code = 'ParserError31';
                            error.parserContext = {
                                input: this.str,
                                pos: this.pos + i,
                                chr
                            };
                            throw error;
                        }
                        if (this.currentNode.value.at(-1) === '*' && this.currentNode.value.at(-2) !== ':') {
                            let error = new Error(`Unexpected sequence separator , at position ${this.pos + i} [E32]`);
                            error.code = 'ParserError32';
                            error.parserContext = {
                                input: this.str,
                                pos: this.pos + i,
                                chr
                            };
                            throw error;
                        }
                    } else if (!RE_SINGLE_DIGIT.test(chr)) {
                        let error = new Error(`Unexpected char at position ${this.pos + i} [E33: ${JSON.stringify(chr)}]`);
                        error.code = 'ParserError33';
                        error.parserContext = {
                            input: this.str,
                            pos: this.pos + i,
                            chr
                        };
                        throw error;
                    }
                    if (RE_SINGLE_DIGIT.test(chr) && this.currentNode.value.at(-1) === '*') {
                        let error = new Error(`Unexpected number at position ${this.pos + i} [E34: ${JSON.stringify(chr)}]`);
                        error.code = 'ParserError34';
                        error.parserContext = {
                            input: this.str,
                            pos: this.pos + i,
                            chr
                        };
                        throw error;
                    }
                    this.currentNode.value += chr;
                    break;
                case STATE_TEXT:
                    this.currentNode.value += chr;
                    break;
            }
        }
    }
}
module.exports.TokenParser = TokenParser;
}),
"[project]/Autonomous-Claims-Orchestrator/node_modules/imapflow/lib/handler/parser-instance.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/* eslint new-cap: 0 */ const imapFormalSyntax = __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/imapflow/lib/handler/imap-formal-syntax.js [app-route] (ecmascript)");
const { TokenParser } = __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/imapflow/lib/handler/token-parser.js [app-route] (ecmascript)");
class ParserInstance {
    constructor(input, options){
        this.input = (input || '').toString();
        this.options = options || {};
        this.remainder = this.input;
        this.pos = 0;
    }
    async getTag() {
        if (!this.tag) {
            this.tag = await this.getElement(imapFormalSyntax.tag() + '*+', true);
        }
        return this.tag;
    }
    async getCommand() {
        if (this.tag === '+') {
            // special case
            this.humanReadable = this.remainder.trim();
            this.remainder = '';
            return '';
        }
        if (!this.command) {
            this.command = await this.getElement(imapFormalSyntax.command());
        }
        switch((this.command || '').toString().toUpperCase()){
            case 'OK':
            case 'NO':
            case 'BAD':
            case 'PREAUTH':
            case 'BYE':
                {
                    let match = this.remainder.match(/^\s+\[/);
                    if (match) {
                        let nesting = 1;
                        for(let i = match[0].length; i <= this.remainder.length; i++){
                            let c = this.remainder[i];
                            if (c === '[') {
                                nesting++;
                            } else if (c === ']') {
                                nesting--;
                            }
                            if (!nesting) {
                                this.humanReadable = this.remainder.substring(i + 1).trim();
                                this.remainder = this.remainder.substring(0, i + 1);
                                break;
                            }
                        }
                    } else {
                        this.humanReadable = this.remainder.trim();
                        this.remainder = '';
                    }
                }
                break;
        }
        return this.command;
    }
    async getElement(syntax) {
        let match, element, errPos;
        if (this.remainder.match(/^\s/)) {
            let error = new Error(`Unexpected whitespace at position ${this.pos} [E1]`);
            error.code = 'ParserError1';
            error.parserContext = {
                input: this.input,
                pos: this.pos
            };
            throw error;
        }
        if (match = this.remainder.match(/^\s*[^\s]+(?=\s|$)/)) {
            element = match[0];
            if ((errPos = imapFormalSyntax.verify(element, syntax)) >= 0) {
                if (this.tag === 'Server' && element === 'Unavailable.') {
                    // Exchange error
                    let error = new Error(`Server returned an error: ${this.input}`);
                    error.code = 'ParserErrorExchange';
                    error.parserContext = {
                        input: this.input,
                        element,
                        pos: this.pos,
                        value: {
                            tag: '*',
                            command: 'BAD',
                            attributes: [
                                {
                                    type: 'TEXT',
                                    value: this.input
                                }
                            ]
                        }
                    };
                    throw error;
                }
                let error = new Error(`Unexpected char at position ${this.pos + errPos} [E2: ${JSON.stringify(element.charAt(errPos))}]`);
                error.code = 'ParserError2';
                error.parserContext = {
                    input: this.input,
                    element,
                    pos: this.pos
                };
                throw error;
            }
        } else {
            let error = new Error(`Unexpected end of input at position ${this.pos} [E3]`);
            error.code = 'ParserError3';
            error.parserContext = {
                input: this.input,
                pos: this.pos
            };
            throw error;
        }
        this.pos += match[0].length;
        this.remainder = this.remainder.substr(match[0].length);
        return element;
    }
    async getSpace() {
        if (!this.remainder.length) {
            if (this.tag === '+' && this.pos === 1) {
                // special case, empty + response
                return;
            }
            let error = new Error(`Unexpected end of input at position ${this.pos} [E4]`);
            error.code = 'ParserError4';
            error.parserContext = {
                input: this.input,
                pos: this.pos
            };
            throw error;
        }
        if (imapFormalSyntax.verify(this.remainder.charAt(0), imapFormalSyntax.SP()) >= 0) {
            let error = new Error(`Unexpected char at position ${this.pos} [E5: ${JSON.stringify(this.remainder.charAt(0))}]`);
            error.code = 'ParserError5';
            error.parserContext = {
                input: this.input,
                element: this.remainder,
                pos: this.pos
            };
            throw error;
        }
        this.pos++;
        this.remainder = this.remainder.substr(1);
    }
    async getAttributes() {
        if (!this.remainder.length) {
            let error = new Error(`Unexpected end of input at position ${this.pos} [E6]`);
            error.code = 'ParserError6';
            error.parserContext = {
                input: this.input,
                pos: this.pos
            };
            throw error;
        }
        if (this.remainder.match(/^\s/)) {
            let error = new Error(`Unexpected whitespace at position ${this.pos} [E7]`);
            error.code = 'ParserError7';
            error.parserContext = {
                input: this.input,
                element: this.remainder,
                pos: this.pos
            };
            throw error;
        }
        const tokenParser = new TokenParser(this, this.pos, this.remainder, this.options);
        return await tokenParser.getAttributes();
    }
}
module.exports.ParserInstance = ParserInstance;
}),
"[project]/Autonomous-Claims-Orchestrator/node_modules/imapflow/lib/handler/imap-parser.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const imapFormalSyntax = __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/imapflow/lib/handler/imap-formal-syntax.js [app-route] (ecmascript)");
const { ParserInstance } = __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/imapflow/lib/handler/parser-instance.js [app-route] (ecmascript)");
module.exports = async (command, options)=>{
    options = options || {};
    let nullBytesRemoved = 0;
    // special case with a buggy IMAP server where responses are padded with zero bytes
    if (command[0] === 0) {
        // find the first non null byte and trim
        let firstNonNull = -1;
        for(let i = 0; i < command.length; i++){
            if (command[i] !== 0) {
                firstNonNull = i;
                break;
            }
        }
        if (firstNonNull === -1) {
            // All bytes are null
            return {
                tag: '*',
                command: 'BAD',
                attributes: []
            };
        }
        command = command.slice(firstNonNull);
        nullBytesRemoved = firstNonNull;
    }
    const parser = new ParserInstance(command, options);
    const response = {};
    try {
        response.tag = await parser.getTag();
        await parser.getSpace();
        response.command = await parser.getCommand();
        if (nullBytesRemoved) {
            response.nullBytesRemoved = nullBytesRemoved;
        }
        if ([
            'UID',
            'AUTHENTICATE'
        ].indexOf((response.command || '').toUpperCase()) >= 0) {
            await parser.getSpace();
            response.command += ' ' + await parser.getElement(imapFormalSyntax.command());
        }
        if (parser.remainder.trim().length) {
            await parser.getSpace();
            response.attributes = await parser.getAttributes();
        }
        if (parser.humanReadable) {
            response.attributes = (response.attributes || []).concat({
                type: 'TEXT',
                value: parser.humanReadable
            });
        }
    } catch (err) {
        if (err.code === 'ParserErrorExchange' && err.parserContext && err.parserContext.value) {
            return err.parserContext.value;
        }
        throw err;
    }
    return response;
};
}),
"[project]/Autonomous-Claims-Orchestrator/node_modules/imapflow/lib/handler/imap-compiler.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/* eslint no-console: 0, new-cap: 0 */ const imapFormalSyntax = __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/imapflow/lib/handler/imap-formal-syntax.js [app-route] (ecmascript)");
const formatRespEntry = (entry, returnEmpty)=>{
    if (typeof entry === 'string') {
        return Buffer.from(entry);
    }
    if (typeof entry === 'number') {
        return Buffer.from(entry.toString());
    }
    if (Buffer.isBuffer(entry)) {
        return entry;
    }
    if (returnEmpty) {
        return null;
    }
    return Buffer.alloc(0);
};
/**
 * Compiles an input object into
 */ module.exports = async (response, options)=>{
    let { asArray, isLogging, literalPlus, literalMinus } = options || {};
    const respParts = [];
    let resp = [].concat(formatRespEntry(response.tag, true) || []).concat(response.command ? formatRespEntry(' ' + response.command) : []);
    let val;
    let lastType;
    let walk = async (node, options)=>{
        options = options || {};
        let lastRespEntry = resp.length && resp[resp.length - 1];
        let lastRespByte = lastRespEntry && lastRespEntry.length && lastRespEntry[lastRespEntry.length - 1] || '';
        if (typeof lastRespByte === 'number') {
            lastRespByte = String.fromCharCode(lastRespByte);
        }
        if (lastType === 'LITERAL' || ![
            '(',
            '<',
            '['
        ].includes(lastRespByte) && resp.length) {
            if (options.subArray) {
            // ignore separator
            } else {
                resp.push(formatRespEntry(' '));
            }
        }
        if (node && node.buffer && !Buffer.isBuffer(node)) {
            // mongodb binary
            node = node.buffer;
        }
        if (Array.isArray(node)) {
            lastType = 'LIST';
            resp.push(formatRespEntry('('));
            // check if we need to skip separator WS between two arrays
            let subArray = node.length > 1 && Array.isArray(node[0]);
            for (let child of node){
                if (subArray && !Array.isArray(child)) {
                    subArray = false;
                }
                await walk(child, {
                    subArray
                });
            }
            resp.push(formatRespEntry(')'));
            return;
        }
        if (!node && typeof node !== 'string' && typeof node !== 'number' && !Buffer.isBuffer(node)) {
            resp.push(formatRespEntry('NIL'));
            return;
        }
        if (typeof node === 'string' || Buffer.isBuffer(node)) {
            if (isLogging && node.length > 100) {
                resp.push(formatRespEntry('"(* ' + node.length + 'B string *)"'));
            } else {
                resp.push(formatRespEntry(JSON.stringify(node.toString())));
            }
            return;
        }
        if (typeof node === 'number') {
            resp.push(formatRespEntry(Math.round(node) || 0)); // Only integers allowed
            return;
        }
        lastType = node.type;
        if (isLogging && node.sensitive) {
            resp.push(formatRespEntry('"(* value hidden *)"'));
            return;
        }
        switch(node.type.toUpperCase()){
            case 'LITERAL':
                if (isLogging) {
                    resp.push(formatRespEntry('"(* ' + node.value.length + 'B literal *)"'));
                } else {
                    let literalLength = !node.value ? 0 : Math.max(node.value.length, 0);
                    let canAppend = !asArray || literalPlus || literalMinus && literalLength <= 4096;
                    let usePlus = canAppend && (literalMinus || literalPlus);
                    resp.push(formatRespEntry(`${node.isLiteral8 ? '~' : ''}{${literalLength}${usePlus ? '+' : ''}}\r\n`));
                    if (canAppend) {
                        if (node.value && node.value.length) {
                            resp.push(formatRespEntry(node.value));
                        }
                    } else {
                        respParts.push(resp);
                        resp = [].concat(formatRespEntry(node.value, true) || []);
                    }
                }
                break;
            case 'STRING':
                if (isLogging && node.value.length > 100) {
                    resp.push(formatRespEntry('"(* ' + node.value.length + 'B string *)"'));
                } else {
                    resp.push(formatRespEntry(JSON.stringify((node.value || '').toString())));
                }
                break;
            case 'TEXT':
            case 'SEQUENCE':
                if (node.value) {
                    resp.push(formatRespEntry(node.value));
                }
                break;
            case 'NUMBER':
                resp.push(formatRespEntry(node.value || 0));
                break;
            case 'ATOM':
            case 'SECTION':
                val = (node.value || '').toString();
                if (!node.section || val) {
                    if (node.value === '' || imapFormalSyntax.verify(val.charAt(0) === '\\' ? val.substr(1) : val, imapFormalSyntax['ATOM-CHAR']()) >= 0) {
                        val = JSON.stringify(val);
                    }
                    resp.push(formatRespEntry(val));
                }
                if (node.section) {
                    resp.push(formatRespEntry('['));
                    for (let child of node.section){
                        await walk(child);
                    }
                    resp.push(formatRespEntry(']'));
                }
                if (node.partial) {
                    resp.push(formatRespEntry(`<${node.partial.join('.')}>`));
                }
                break;
        }
    };
    if (response.attributes) {
        let attributes = Array.isArray(response.attributes) ? response.attributes : [].concat(response.attributes);
        for (let child of attributes){
            await walk(child);
        }
    }
    if (resp.length) {
        respParts.push(resp);
    }
    for(let i = 0; i < respParts.length; i++){
        respParts[i] = Buffer.concat(respParts[i]);
    }
    return asArray ? respParts : respParts.flatMap((entry)=>entry);
};
}),
"[project]/Autonomous-Claims-Orchestrator/node_modules/imapflow/lib/handler/imap-handler.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const parser = __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/imapflow/lib/handler/imap-parser.js [app-route] (ecmascript)");
const compiler = __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/imapflow/lib/handler/imap-compiler.js [app-route] (ecmascript)");
module.exports = {
    parser,
    compiler
};
}),
"[project]/Autonomous-Claims-Orchestrator/node_modules/imapflow/package.json (json)", ((__turbopack_context__) => {

__turbopack_context__.v({"name":"imapflow","version":"1.2.8","description":"IMAP Client for Node","main":"lib/imap-flow.js","types":"lib/imap-flow.d.ts","scripts":{"test":"grunt","coverage":"c8 --reporter=text --reporter=html npx nodeunit test/*-test.js","prepare":"npm run build","docs":"rm -rf docs && mkdir -p docs && jsdoc lib/imap-flow.js -c jsdoc.json -R README.md --destination docs/ && cp assets/favicon.ico docs","build":"npm run docs","st":"npm run docs && st -d docs -i index.html","update":"rm -rf node_modules package-lock.json && ncu -u && npm install","format":"prettier --write \"**/*.{js,json,md,yml,yaml}\" --ignore-path .prettierignore","lint":"eslint ."},"repository":{"type":"git","url":"git+https://github.com/postalsys/imapflow.git"},"keywords":["imap","email","mail"],"author":"Postal Systems OÜ","license":"MIT","bugs":{"url":"https://github.com/postalsys/imapflow/issues"},"homepage":"https://imapflow.com/","devDependencies":{"@babel/eslint-parser":"7.28.6","@babel/eslint-plugin":"7.27.1","@babel/plugin-syntax-class-properties":"7.12.13","@babel/preset-env":"7.28.6","@eslint/eslintrc":"3.3.3","@eslint/js":"9.39.2","@types/node":"25.1.0","c8":"10.1.3","eslint":"9.39.2","eslint-config-nodemailer":"1.2.0","eslint-config-prettier":"10.1.8","grunt":"1.6.1","grunt-cli":"1.5.0","grunt-contrib-nodeunit":"5.0.0","grunt-eslint":"24.3.0","imapflow-jsdoc-template":"3.4.0-imapflow.3","jsdoc":"4.0.4","prettier":"3.8.1","proxyquire":"^2.1.3","st":"3.0.3","typescript":"5.9.3"},"dependencies":{"@zone-eu/mailsplit":"5.4.8","encoding-japanese":"2.2.0","iconv-lite":"0.7.2","libbase64":"1.3.0","libmime":"5.3.7","libqp":"2.1.1","nodemailer":"7.0.13","pino":"10.3.0","socks":"2.8.7"}});}),
"[project]/Autonomous-Claims-Orchestrator/node_modules/imapflow/lib/proxy-connection.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const httpProxyClient = __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/nodemailer/lib/smtp-connection/http-proxy-client.js [app-route] (ecmascript)");
const { SocksClient } = __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/socks/build/index.js [app-route] (ecmascript)");
const util = __turbopack_context__.r("[externals]/util [external] (util, cjs)");
const httpProxyClientAsync = util.promisify(httpProxyClient);
const dns = __turbopack_context__.r("[externals]/dns [external] (dns, cjs)").promises;
const net = __turbopack_context__.r("[externals]/net [external] (net, cjs)");
const proxyConnection = async (logger, connectionUrl, host, port)=>{
    let proxyUrl = new URL(connectionUrl);
    let protocol = proxyUrl.protocol.replace(/:$/, '').toLowerCase();
    if (!net.isIP(host)) {
        let resolveResult = await dns.resolve(host);
        if (resolveResult && resolveResult.length) {
            host = resolveResult[0];
        }
    }
    switch(protocol){
        // Connect using a HTTP CONNECT method
        case 'http':
        case 'https':
            {
                try {
                    let socket = await httpProxyClientAsync(proxyUrl.href, port, host);
                    if (socket) {
                        if (proxyUrl.password) {
                            proxyUrl.password = '(hidden)';
                        }
                        logger.info({
                            msg: 'Established a socket via HTTP proxy',
                            proxyUrl: proxyUrl.href,
                            port,
                            host
                        });
                    }
                    return socket;
                } catch (err) {
                    if (proxyUrl.password) {
                        proxyUrl.password = '(hidden)';
                    }
                    logger.error({
                        msg: 'Failed to establish a socket via HTTP proxy',
                        proxyUrl: proxyUrl.href,
                        port,
                        host,
                        err
                    });
                    throw err;
                }
            }
        // SOCKS proxy
        case 'socks':
        case 'socks5':
        case 'socks4':
        case 'socks4a':
            {
                let proxyType = Number(protocol.replace(/\D/g, '')) || 5;
                let targetHost = proxyUrl.hostname;
                if (!net.isIP(targetHost)) {
                    let resolveResult = await dns.resolve(targetHost);
                    if (resolveResult && resolveResult.length) {
                        targetHost = resolveResult[0];
                    }
                }
                let connectionOpts = {
                    proxy: {
                        host: targetHost,
                        port: Number(proxyUrl.port) || 1080,
                        type: proxyType
                    },
                    destination: {
                        host,
                        port
                    },
                    command: 'connect',
                    set_tcp_nodelay: true
                };
                if (proxyUrl.username || proxyUrl.password) {
                    connectionOpts.proxy.userId = proxyUrl.username;
                    connectionOpts.proxy.password = proxyUrl.password;
                }
                try {
                    const info = await SocksClient.createConnection(connectionOpts);
                    if (info && info.socket) {
                        if (proxyUrl.password) {
                            proxyUrl.password = '(hidden)';
                        }
                        logger.info({
                            msg: 'Established a socket via SOCKS proxy',
                            proxyUrl: proxyUrl.href,
                            port,
                            host
                        });
                    }
                    return info.socket;
                } catch (err) {
                    if (proxyUrl.password) {
                        proxyUrl.password = '(hidden)';
                    }
                    logger.error({
                        msg: 'Failed to establish a socket via SOCKS proxy',
                        proxyUrl: proxyUrl.href,
                        port,
                        host,
                        err
                    });
                    throw err;
                }
            }
    }
};
module.exports = {
    proxyConnection
};
}),
"[project]/Autonomous-Claims-Orchestrator/node_modules/imapflow/lib/charsets.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const CHARACTER_SETS = [
    'US-ASCII',
    'ISO-8859-1',
    'ISO-8859-2',
    'ISO-8859-3',
    'ISO-8859-4',
    'ISO-8859-5',
    'ISO-8859-6',
    'ISO-8859-7',
    'ISO-8859-8',
    'ISO-8859-9',
    'ISO-8859-10',
    'ISO_6937-2-add',
    'JIS_X0201',
    'JIS_Encoding',
    'Shift_JIS',
    'EUC-JP',
    'Extended_UNIX_Code_Fixed_Width_for_Japanese',
    'BS_4730',
    'SEN_850200_C',
    'IT',
    'ES',
    'DIN_66003',
    'NS_4551-1',
    'NF_Z_62-010',
    'ISO-10646-UTF-1',
    'ISO_646.basic:1983',
    'INVARIANT',
    'ISO_646.irv:1983',
    'NATS-SEFI',
    'NATS-SEFI-ADD',
    'NATS-DANO',
    'NATS-DANO-ADD',
    'SEN_850200_B',
    'KS_C_5601-1987',
    'ISO-2022-KR',
    'EUC-KR',
    'ISO-2022-JP',
    'ISO-2022-JP-2',
    'JIS_C6220-1969-jp',
    'JIS_C6220-1969-ro',
    'PT',
    'greek7-old',
    'latin-greek',
    'NF_Z_62-010_(1973)',
    'Latin-greek-1',
    'ISO_5427',
    'JIS_C6226-1978',
    'BS_viewdata',
    'INIS',
    'INIS-8',
    'INIS-cyrillic',
    'ISO_5427:1981',
    'ISO_5428:1980',
    'GB_1988-80',
    'GB_2312-80',
    'NS_4551-2',
    'videotex-suppl',
    'PT2',
    'ES2',
    'MSZ_7795.3',
    'JIS_C6226-1983',
    'greek7',
    'ASMO_449',
    'iso-ir-90',
    'JIS_C6229-1984-a',
    'JIS_C6229-1984-b',
    'JIS_C6229-1984-b-add',
    'JIS_C6229-1984-hand',
    'JIS_C6229-1984-hand-add',
    'JIS_C6229-1984-kana',
    'ISO_2033-1983',
    'ANSI_X3.110-1983',
    'T.61-7bit',
    'T.61-8bit',
    'ECMA-cyrillic',
    'CSA_Z243.4-1985-1',
    'CSA_Z243.4-1985-2',
    'CSA_Z243.4-1985-gr',
    'ISO-8859-6-E',
    'ISO-8859-6-I',
    'T.101-G2',
    'ISO-8859-8-E',
    'ISO-8859-8-I',
    'CSN_369103',
    'JUS_I.B1.002',
    'IEC_P27-1',
    'JUS_I.B1.003-serb',
    'JUS_I.B1.003-mac',
    'greek-ccitt',
    'NC_NC00-10:81',
    'ISO_6937-2-25',
    'GOST_19768-74',
    'ISO_8859-supp',
    'ISO_10367-box',
    'latin-lap',
    'JIS_X0212-1990',
    'DS_2089',
    'us-dk',
    'dk-us',
    'KSC5636',
    'UNICODE-1-1-UTF-7',
    'ISO-2022-CN',
    'ISO-2022-CN-EXT',
    'UTF-8',
    'ISO-8859-13',
    'ISO-8859-14',
    'ISO-8859-15',
    'ISO-8859-16',
    'GBK',
    'GB18030',
    'OSD_EBCDIC_DF04_15',
    'OSD_EBCDIC_DF03_IRV',
    'OSD_EBCDIC_DF04_1',
    'ISO-11548-1',
    'KZ-1048',
    'ISO-10646-UCS-2',
    'ISO-10646-UCS-4',
    'ISO-10646-UCS-Basic',
    'ISO-10646-Unicode-Latin1',
    'ISO-10646-J-1',
    'ISO-Unicode-IBM-1261',
    'ISO-Unicode-IBM-1268',
    'ISO-Unicode-IBM-1276',
    'ISO-Unicode-IBM-1264',
    'ISO-Unicode-IBM-1265',
    'UNICODE-1-1',
    'SCSU',
    'UTF-7',
    'UTF-16BE',
    'UTF-16LE',
    'UTF-16',
    'CESU-8',
    'UTF-32',
    'UTF-32BE',
    'UTF-32LE',
    'BOCU-1',
    'ISO-8859-1-Windows-3.0-Latin-1',
    'ISO-8859-1-Windows-3.1-Latin-1',
    'ISO-8859-2-Windows-Latin-2',
    'ISO-8859-9-Windows-Latin-5',
    'hp-roman8',
    'Adobe-Standard-Encoding',
    'Ventura-US',
    'Ventura-International',
    'DEC-MCS',
    'IBM850',
    'PC8-Danish-Norwegian',
    'IBM862',
    'PC8-Turkish',
    'IBM-Symbols',
    'IBM-Thai',
    'HP-Legal',
    'HP-Pi-font',
    'HP-Math8',
    'Adobe-Symbol-Encoding',
    'HP-DeskTop',
    'Ventura-Math',
    'Microsoft-Publishing',
    'Windows-31J',
    'GB2312',
    'Big5',
    'macintosh',
    'IBM037',
    'IBM038',
    'IBM273',
    'IBM274',
    'IBM275',
    'IBM277',
    'IBM278',
    'IBM280',
    'IBM281',
    'IBM284',
    'IBM285',
    'IBM290',
    'IBM297',
    'IBM420',
    'IBM423',
    'IBM424',
    'IBM437',
    'IBM500',
    'IBM851',
    'IBM852',
    'IBM855',
    'IBM857',
    'IBM860',
    'IBM861',
    'IBM863',
    'IBM864',
    'IBM865',
    'IBM868',
    'IBM869',
    'IBM870',
    'IBM871',
    'IBM880',
    'IBM891',
    'IBM903',
    'IBM904',
    'IBM905',
    'IBM918',
    'IBM1026',
    'EBCDIC-AT-DE',
    'EBCDIC-AT-DE-A',
    'EBCDIC-CA-FR',
    'EBCDIC-DK-NO',
    'EBCDIC-DK-NO-A',
    'EBCDIC-FI-SE',
    'EBCDIC-FI-SE-A',
    'EBCDIC-FR',
    'EBCDIC-IT',
    'EBCDIC-PT',
    'EBCDIC-ES',
    'EBCDIC-ES-A',
    'EBCDIC-ES-S',
    'EBCDIC-UK',
    'EBCDIC-US',
    'UNKNOWN-8BIT',
    'MNEMONIC',
    'MNEM',
    'VISCII',
    'VIQR',
    'KOI8-R',
    'HZ-GB-2312',
    'IBM866',
    'IBM775',
    'KOI8-U',
    'IBM00858',
    'IBM00924',
    'IBM01140',
    'IBM01141',
    'IBM01142',
    'IBM01143',
    'IBM01144',
    'IBM01145',
    'IBM01146',
    'IBM01147',
    'IBM01148',
    'IBM01149',
    'Big5-HKSCS',
    'IBM1047',
    'PTCP154',
    'Amiga-1251',
    'KOI7-switched',
    'BRF',
    'TSCII',
    'CP51932',
    'windows-874',
    'windows-1250',
    'windows-1251',
    'windows-1252',
    'windows-1253',
    'windows-1254',
    'windows-1255',
    'windows-1256',
    'windows-1257',
    'windows-1258',
    'TIS-620',
    'CP50220'
];
const CHARSET_MAP = new Map();
CHARACTER_SETS.forEach((entry)=>{
    let key = entry.replace(/[_-\s]/g, '').toLowerCase();
    let modifiedKey = key.replace(/^windows/, 'win').replace(/^usascii/, 'ascii').replace(/^iso8859/, 'latin');
    CHARSET_MAP.set(key, entry);
    if (!CHARSET_MAP.has(modifiedKey)) {
        CHARSET_MAP.set(modifiedKey, entry);
    }
});
module.exports.resolveCharset = (charset)=>{
    let key = charset.replace(/[_-\s]/g, '').toLowerCase();
    if (CHARSET_MAP.has(key)) {
        return CHARSET_MAP.get(key);
    }
    return null;
};
}),
"[project]/Autonomous-Claims-Orchestrator/node_modules/imapflow/lib/jp-decoder.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const { Transform } = __turbopack_context__.r("[externals]/stream [external] (stream, cjs)");
const encodingJapanese = __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/encoding-japanese/src/index.js [app-route] (ecmascript)");
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
        } catch  {
            // keep as is on errors
            this.push(input);
        }
        done();
    }
    _destroy(err, callback) {
        this.chunks = [];
        this.chunklen = 0;
        callback(err);
    }
}
module.exports.JPDecoder = JPDecoder;
}),
"[project]/Autonomous-Claims-Orchestrator/node_modules/imapflow/lib/tools.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/* eslint no-control-regex:0 */ const libmime = __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/libmime/lib/libmime.js [app-route] (ecmascript)");
const { resolveCharset } = __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/imapflow/lib/charsets.js [app-route] (ecmascript)");
const { compiler } = __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/imapflow/lib/handler/imap-handler.js [app-route] (ecmascript)");
const { createHash } = __turbopack_context__.r("[externals]/crypto [external] (crypto, cjs)");
const { JPDecoder } = __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/imapflow/lib/jp-decoder.js [app-route] (ecmascript)");
const iconv = __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/iconv-lite/lib/index.js [app-route] (ecmascript)");
const FLAG_COLORS = [
    'red',
    'orange',
    'yellow',
    'green',
    'blue',
    'purple',
    'grey'
];
class AuthenticationFailure extends Error {
    authenticationFailed = true;
}
const tools = {
    encodePath (connection, path) {
        path = (path || '').toString();
        if (!connection.enabled.has('UTF8=ACCEPT') && /[&\x00-\x08\x0b-\x0c\x0e-\x1f\u0080-\uffff]/.test(path)) {
            try {
                path = iconv.encode(path, 'utf-7-imap').toString();
            } catch  {
            // ignore, keep name as is
            }
        }
        return path;
    },
    decodePath (connection, path) {
        path = (path || '').toString();
        if (!connection.enabled.has('UTF8=ACCEPT') && /[&]/.test(path)) {
            try {
                path = iconv.decode(Buffer.from(path), 'utf-7-imap').toString();
            } catch  {
            // ignore, keep name as is
            }
        }
        return path;
    },
    normalizePath (connection, path, skipNamespace) {
        if (Array.isArray(path)) {
            path = path.join(connection.namespace && connection.namespace.delimiter || '');
        }
        if (path.toUpperCase() === 'INBOX') {
            // inbox is not case sensitive
            return 'INBOX';
        }
        // ensure namespace prefix if needed
        if (!skipNamespace && connection.namespace && connection.namespace.prefix && path.indexOf(connection.namespace.prefix) !== 0) {
            path = connection.namespace.prefix + path;
        }
        return path;
    },
    comparePaths (connection, a, b) {
        if (!a || !b) {
            return false;
        }
        return tools.normalizePath(connection, a) === tools.normalizePath(connection, b);
    },
    updateCapabilities (list) {
        let map = new Map();
        if (list && Array.isArray(list)) {
            list.forEach((val)=>{
                if (typeof val.value !== 'string') {
                    return false;
                }
                let capability = val.value.toUpperCase().trim();
                if (capability === 'IMAP4REV1') {
                    map.set('IMAP4rev1', true);
                    return;
                }
                if (capability.indexOf('APPENDLIMIT=') === 0) {
                    let splitPos = capability.indexOf('=');
                    let appendLimit = Number(capability.substr(splitPos + 1)) || 0;
                    map.set('APPENDLIMIT', appendLimit);
                    return;
                }
                map.set(capability, true);
            });
        }
        return map;
    },
    AuthenticationFailure,
    getStatusCode (response) {
        return response && response.attributes && response.attributes[0] && response.attributes[0].section && response.attributes[0].section[0] && typeof response.attributes[0].section[0].value === 'string' ? response.attributes[0].section[0].value.toUpperCase().trim() : false;
    },
    async getErrorText (response) {
        if (!response) {
            return false;
        }
        return (await compiler(response)).toString();
    },
    async enhanceCommandError (err) {
        let errorCode = tools.getStatusCode(err.response);
        if (errorCode) {
            err.serverResponseCode = errorCode;
        }
        err.response = await tools.getErrorText(err.response);
        return err;
    },
    getFolderTree (folders) {
        let tree = {
            root: true,
            folders: []
        };
        let getTreeNode = (parents)=>{
            let node = tree;
            if (!parents || !parents.length) {
                return node;
            }
            for (let parent of parents){
                let cur = node.folders && node.folders.find((folder)=>folder.name === parent);
                if (cur) {
                    node = cur;
                } else {
                    // not yet set
                    cur = {
                        name: parent,
                        folders: []
                    };
                }
            }
            return node;
        };
        for (let folder of folders){
            let parent = getTreeNode(folder.parent);
            // see if entry already exists
            let existing = parent.folders && parent.folders.find((existing)=>existing.name === folder.name);
            if (existing) {
                // update values
                existing.name = folder.name;
                existing.flags = folder.flags;
                existing.path = folder.path;
                existing.subscribed = !!folder.subscribed;
                existing.listed = !!folder.listed;
                existing.status = !!folder.status;
                if (folder.specialUse) {
                    existing.specialUse = folder.specialUse;
                }
                if (folder.flags.has('\\Noselect')) {
                    existing.disabled = true;
                }
                if (folder.flags.has('\\HasChildren') && !existing.folders) {
                    existing.folders = [];
                }
            } else {
                // create new
                let data = {
                    name: folder.name,
                    flags: folder.flags,
                    path: folder.path,
                    subscribed: !!folder.subscribed,
                    listed: !!folder.listed,
                    status: !!folder.status
                };
                if (folder.delimiter) {
                    data.delimiter = folder.delimiter;
                }
                if (folder.specialUse) {
                    data.specialUse = folder.specialUse;
                }
                if (folder.flags.has('\\Noselect')) {
                    data.disabled = true;
                }
                if (folder.flags.has('\\HasChildren')) {
                    data.folders = [];
                }
                if (!parent.folders) {
                    parent.folders = [];
                }
                parent.folders.push(data);
            }
        }
        return tree;
    },
    getFlagColor (flags) {
        if (!flags.has('\\Flagged')) {
            return null;
        }
        const bit0 = flags.has('$MailFlagBit0') ? 1 : 0;
        const bit1 = flags.has('$MailFlagBit1') ? 2 : 0;
        const bit2 = flags.has('$MailFlagBit2') ? 4 : 0;
        const color = bit0 | bit1 | bit2; // eslint-disable-line no-bitwise
        return FLAG_COLORS[color] || 'red'; // default to red for the unused \b111
    },
    getColorFlags (color) {
        const colorCode = color ? FLAG_COLORS.indexOf((color || '').toString().toLowerCase().trim()) : null;
        if (colorCode < 0 && colorCode !== null) {
            return null;
        }
        const bits = [];
        bits[0] = colorCode & 1; // eslint-disable-line no-bitwise
        bits[1] = colorCode & 2; // eslint-disable-line no-bitwise
        bits[2] = colorCode & 4; // eslint-disable-line no-bitwise
        let result = {
            add: colorCode ? [
                '\\Flagged'
            ] : [],
            remove: colorCode ? [] : [
                '\\Flagged'
            ]
        };
        for(let i = 0; i < bits.length; i++){
            if (bits[i]) {
                result.add.push(`$MailFlagBit${i}`);
            } else {
                result.remove.push(`$MailFlagBit${i}`);
            }
        }
        return result;
    },
    async formatMessageResponse (untagged, mailbox) {
        let map = {};
        map.seq = Number(untagged.command);
        let key;
        let attributes = untagged.attributes && untagged.attributes[1] || [];
        for(let i = 0, len = attributes.length; i < len; i++){
            let attribute = attributes[i];
            if (i % 2 === 0) {
                key = (await compiler({
                    attributes: [
                        attribute
                    ]
                })).toString().toLowerCase().replace(/<\d+(\.\d+)?>$/, '');
                continue;
            }
            if (typeof key !== 'string') {
                continue;
            }
            let getString = (attribute)=>{
                if (!attribute) {
                    return false;
                }
                if (typeof attribute.value === 'string') {
                    return attribute.value;
                }
                if (Buffer.isBuffer(attribute.value)) {
                    return attribute.value.toString();
                }
            };
            let getBuffer = (attribute)=>{
                if (!attribute) {
                    return false;
                }
                if (Buffer.isBuffer(attribute.value)) {
                    return attribute.value;
                }
            };
            let getArray = (attribute)=>{
                if (Array.isArray(attribute)) {
                    return attribute.map((entry)=>entry && typeof entry.value === 'string' ? entry.value : false).filter((entry)=>entry);
                }
            };
            switch(key){
                case 'body[]':
                case 'binary[]':
                    map.source = getBuffer(attribute);
                    break;
                case 'uid':
                    map.uid = Number(getString(attribute));
                    if (map.uid && (!mailbox.uidNext || mailbox.uidNext <= map.uid)) {
                        // current uidNext seems to be outdated, bump it
                        mailbox.uidNext = map.uid + 1;
                    }
                    break;
                case 'modseq':
                    map.modseq = BigInt(getArray(attribute)[0]);
                    if (map.modseq && (!mailbox.highestModseq || mailbox.highestModseq < map.modseq)) {
                        // current highestModseq seems to be outdated, bump it
                        mailbox.highestModseq = map.modseq;
                    }
                    break;
                case 'emailid':
                    map.emailId = getArray(attribute)[0];
                    break;
                case 'x-gm-msgid':
                    map.emailId = getString(attribute);
                    break;
                case 'threadid':
                    map.threadId = getArray(attribute)[0];
                    break;
                case 'x-gm-thrid':
                    map.threadId = getString(attribute);
                    break;
                case 'x-gm-labels':
                    map.labels = new Set(getArray(attribute));
                    break;
                case 'rfc822.size':
                    map.size = Number(getString(attribute)) || 0;
                    break;
                case 'flags':
                    map.flags = new Set(getArray(attribute));
                    break;
                case 'envelope':
                    map.envelope = tools.parseEnvelope(attribute);
                    break;
                case 'bodystructure':
                    map.bodyStructure = tools.parseBodystructure(attribute);
                    break;
                case 'internaldate':
                    {
                        let value = getString(attribute);
                        let date = new Date(value);
                        if (date.toString() === 'Invalid Date') {
                            map.internalDate = value;
                        } else {
                            map.internalDate = date;
                        }
                        break;
                    }
                default:
                    {
                        let match = key.match(/(body|binary)\[/i);
                        if (match) {
                            let partKey = key.replace(/^(body|binary)\[|]$/gi, '');
                            partKey = partKey.replace(/\.fields.*$/g, '');
                            let value = getBuffer(attribute);
                            if (partKey === 'header') {
                                map.headers = value;
                                break;
                            }
                            if (!map.bodyParts) {
                                map.bodyParts = new Map();
                            }
                            map.bodyParts.set(partKey, value);
                            break;
                        }
                        break;
                    }
            }
        }
        if (map.emailId || map.uid) {
            // define account unique ID for this email
            // normalize path to use ascii, so we would always get the same ID
            let path = mailbox.path;
            if (/[0x80-0xff]/.test(path)) {
                try {
                    path = iconv.encode(path, 'utf-7-imap').toString();
                } catch  {
                // ignore
                }
            }
            map.id = map.emailId || createHash('md5').update([
                path,
                mailbox.uidValidity?.toString() || '',
                map.uid.toString()
            ].join(':')).digest('hex');
        }
        if (map.flags) {
            let flagColor = tools.getFlagColor(map.flags);
            if (flagColor) {
                map.flagColor = flagColor;
            }
        }
        return map;
    },
    processName (name) {
        name = (name || '').toString();
        if (name.length > 2 && name.at(0) === '"' && name.at(-1) === '"') {
            name = name.replace(/^"|"$/g, '');
        }
        return name;
    },
    parseEnvelope (entry) {
        let getStrValue = (obj)=>{
            if (!obj) {
                return false;
            }
            if (typeof obj.value === 'string') {
                return obj.value;
            }
            if (Buffer.isBuffer(obj.value)) {
                return obj.value.toString();
            }
            return obj.value;
        };
        let processAddresses = function(list) {
            return [].concat(list || []).map((addr)=>{
                let address = (getStrValue(addr[2]) || '') + '@' + (getStrValue(addr[3]) || '');
                if (address === '@') {
                    address = '';
                }
                return {
                    name: tools.processName(libmime.decodeWords(getStrValue(addr[0]))),
                    address
                };
            }).filter((addr)=>addr.name || addr.address);
        }, envelope = {};
        if (entry[0] && entry[0].value) {
            let date = new Date(getStrValue(entry[0]));
            if (date.toString() === 'Invalid Date') {
                envelope.date = getStrValue(entry[0]);
            } else {
                envelope.date = date;
            }
        }
        if (entry[1] && entry[1].value) {
            envelope.subject = libmime.decodeWords(getStrValue(entry[1]));
        }
        if (entry[2] && entry[2].length) {
            envelope.from = processAddresses(entry[2]);
        }
        if (entry[3] && entry[3].length) {
            envelope.sender = processAddresses(entry[3]);
        }
        if (entry[4] && entry[4].length) {
            envelope.replyTo = processAddresses(entry[4]);
        }
        if (entry[5] && entry[5].length) {
            envelope.to = processAddresses(entry[5]);
        }
        if (entry[6] && entry[6].length) {
            envelope.cc = processAddresses(entry[6]);
        }
        if (entry[7] && entry[7].length) {
            envelope.bcc = processAddresses(entry[7]);
        }
        if (entry[8] && entry[8].value) {
            envelope.inReplyTo = (getStrValue(entry[8]) || '').toString().trim();
        }
        if (entry[9] && entry[9].value) {
            envelope.messageId = (getStrValue(entry[9]) || '').toString().trim();
        }
        return envelope;
    },
    getStructuredParams (arr) {
        let key;
        let params = {};
        [].concat(arr || []).forEach((val, j)=>{
            if (j % 2) {
                params[key] = libmime.decodeWords((val && val.value || '').toString());
            } else {
                key = (val && val.value || '').toString().toLowerCase();
            }
        });
        if (params.filename && !params['filename*'] && /^[a-z\-_0-9]+'[a-z]*'[^'\x00-\x08\x0b\x0c\x0e-\x1f\u0080-\uFFFF]+/.test(params.filename)) {
            // seems like encoded value
            let [encoding, , encodedValue] = params.filename.split("'");
            if (resolveCharset(encoding)) {
                params['filename*'] = `${encoding}''${encodedValue}`;
            }
        }
        // preprocess values
        Object.keys(params).forEach((key)=>{
            let actualKey;
            let nr;
            let value;
            let match = key.match(/\*((\d+)\*?)?$/);
            if (!match) {
                // nothing to do here, does not seem like a continuation param
                return;
            }
            actualKey = key.substr(0, match.index).toLowerCase();
            nr = Number(match[2]) || 0;
            if (!params[actualKey] || typeof params[actualKey] !== 'object') {
                params[actualKey] = {
                    charset: false,
                    values: []
                };
            }
            value = params[key];
            if (nr === 0 && match[0].charAt(match[0].length - 1) === '*' && (match = value.match(/^([^']*)'[^']*'(.*)$/))) {
                params[actualKey].charset = match[1] || 'utf-8';
                value = match[2];
            }
            params[actualKey].values.push({
                nr,
                value
            });
            // remove the old reference
            delete params[key];
        });
        // concatenate split rfc2231 strings and convert encoded strings to mime encoded words
        Object.keys(params).forEach((key)=>{
            let value;
            if (params[key] && Array.isArray(params[key].values)) {
                value = params[key].values.sort((a, b)=>a.nr - b.nr).map((val)=>val && val.value || '').join('');
                if (params[key].charset) {
                    // convert "%AB" to "=?charset?Q?=AB?=" and then to unicode
                    params[key] = libmime.decodeWords('=?' + params[key].charset + '?Q?' + value// fix invalidly encoded chars
                    .replace(/[=?_\s]/g, (s)=>{
                        let c = s.charCodeAt(0).toString(16);
                        if (s === ' ') {
                            return '_';
                        } else {
                            return '%' + (c.length < 2 ? '0' : '') + c;
                        }
                    })// change from urlencoding to percent encoding
                    .replace(/%/g, '=') + '?=');
                } else {
                    params[key] = libmime.decodeWords(value);
                }
            }
        });
        return params;
    },
    parseBodystructure (entry) {
        let walk = (node, path)=>{
            path = path || [];
            let curNode = {}, i = 0, part = 0;
            if (path.length) {
                curNode.part = path.join('.');
            }
            // multipart
            if (Array.isArray(node[0])) {
                curNode.childNodes = [];
                while(Array.isArray(node[i])){
                    curNode.childNodes.push(walk(node[i], path.concat(++part)));
                    i++;
                }
                // multipart type
                curNode.type = 'multipart/' + ((node[i++] || {}).value || '').toString().toLowerCase();
                // extension data (not available for BODY requests)
                // body parameter parenthesized list
                if (i < node.length - 1) {
                    if (node[i]) {
                        curNode.parameters = tools.getStructuredParams(node[i]);
                    }
                    i++;
                }
            } else {
                // content type
                curNode.type = [
                    ((node[i++] || {}).value || '').toString().toLowerCase(),
                    ((node[i++] || {}).value || '').toString().toLowerCase()
                ].join('/');
                // body parameter parenthesized list
                if (node[i]) {
                    curNode.parameters = tools.getStructuredParams(node[i]);
                }
                i++;
                // id
                if (node[i]) {
                    curNode.id = ((node[i] || {}).value || '').toString();
                }
                i++;
                // description
                if (node[i]) {
                    curNode.description = ((node[i] || {}).value || '').toString();
                }
                i++;
                // encoding
                if (node[i]) {
                    curNode.encoding = ((node[i] || {}).value || '').toString().toLowerCase();
                }
                i++;
                // size
                if (node[i]) {
                    curNode.size = Number((node[i] || {}).value || 0) || 0;
                }
                i++;
                if (curNode.type === 'message/rfc822') {
                    // message/rfc adds additional envelope, bodystructure and line count values
                    // envelope
                    if (node[i]) {
                        curNode.envelope = tools.parseEnvelope([].concat(node[i] || []));
                    }
                    i++;
                    if (node[i]) {
                        curNode.childNodes = [
                            // rfc822 bodyparts share the same path, difference is between MIME and HEADER
                            // path.MIME returns message/rfc822 header
                            // path.HEADER returns inlined message header
                            walk(node[i], path)
                        ];
                    }
                    i++;
                    // line count
                    if (node[i]) {
                        curNode.lineCount = Number((node[i] || {}).value || 0) || 0;
                    }
                    i++;
                }
                if (/^text\//.test(curNode.type)) {
                    // text/* adds additional line count value
                    // NB! some less known servers do not include the line count value
                    // length should be 12+
                    if (node.length === 11 && Array.isArray(node[i + 1]) && !Array.isArray(node[i + 2])) {
                    // invalid structure, disposition params are shifted
                    } else {
                        // correct structure, line count number is provided
                        if (node[i]) {
                            // line count
                            curNode.lineCount = Number((node[i] || {}).value || 0) || 0;
                        }
                        i++;
                    }
                }
                // extension data (not available for BODY requests)
                // md5
                if (i < node.length - 1) {
                    if (node[i]) {
                        curNode.md5 = ((node[i] || {}).value || '').toString().toLowerCase();
                    }
                    i++;
                }
            }
            // the following are shared extension values (for both multipart and non-multipart parts)
            // not available for BODY requests
            // body disposition
            if (i < node.length - 1) {
                if (Array.isArray(node[i]) && node[i].length) {
                    curNode.disposition = ((node[i][0] || {}).value || '').toString().toLowerCase();
                    if (Array.isArray(node[i][1])) {
                        curNode.dispositionParameters = tools.getStructuredParams(node[i][1]);
                    }
                }
                i++;
            }
            // body language
            if (i < node.length - 1) {
                if (node[i]) {
                    curNode.language = [].concat(node[i] || []).map((val)=>(val && val.value || '').toString().toLowerCase());
                }
                i++;
            }
            // body location
            // NB! defined as a "string list" in RFC3501 but replaced in errata document with "string"
            // Errata: http://www.rfc-editor.org/errata_search.php?rfc=3501
            if (i < node.length - 1) {
                if (node[i]) {
                    curNode.location = ((node[i] || {}).value || '').toString();
                }
                i++;
            }
            return curNode;
        };
        return walk(entry);
    },
    isDate (obj) {
        return Object.prototype.toString.call(obj) === '[object Date]';
    },
    toValidDate (value) {
        if (!value) {
            return null;
        }
        if (typeof value === 'string') {
            value = new Date(value);
        }
        if (!tools.isDate(value) || value.toString() === 'Invalid Date') {
            return null;
        }
        return value;
    },
    formatDate (value) {
        value = tools.toValidDate(value);
        if (!value) {
            return;
        }
        let dateParts = value.toISOString().substr(0, 10).split('-');
        dateParts.reverse();
        let months = [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec'
        ];
        dateParts[1] = months[Number(dateParts[1]) - 1];
        return dateParts.join('-');
    },
    formatDateTime (value) {
        value = tools.toValidDate(value);
        if (!value) {
            return;
        }
        let dateStr = tools.formatDate(value).replace(/^0/, ' '); //starts with date-day-fixed with leading 0 replaced by SP
        let timeStr = value.toISOString().substr(11, 8);
        return `${dateStr} ${timeStr} +0000`;
    },
    formatFlag (flag) {
        switch(flag.toLowerCase()){
            case '\\recent':
                // can not set or remove
                return false;
            case '\\seen':
            case '\\answered':
            case '\\flagged':
            case '\\deleted':
            case '\\draft':
                // can not set or remove
                return flag.toLowerCase().replace(/^\\./, (c)=>c.toUpperCase());
        }
        return flag;
    },
    canUseFlag (mailbox, flag) {
        return !mailbox || !mailbox.permanentFlags || mailbox.permanentFlags.has('\\*') || mailbox.permanentFlags.has(flag);
    },
    expandRange (range) {
        return range.split(',').flatMap((entry)=>{
            entry = entry.trim();
            let colon = entry.indexOf(':');
            if (colon < 0) {
                return Number(entry) || 0;
            }
            let first = Number(entry.substr(0, colon)) || 0;
            let second = Number(entry.substr(colon + 1)) || 0;
            if (first === second) {
                return first;
            }
            let list = [];
            if (first < second) {
                for(let i = first; i <= second; i++){
                    list.push(i);
                }
            } else {
                for(let i = first; i >= second; i--){
                    list.push(i);
                }
            }
            return list;
        });
    },
    getDecoder (charset) {
        charset = (charset || 'ascii').toString().trim().toLowerCase();
        if (/^jis|^iso-?2022-?jp|^EUCJP/i.test(charset)) {
            // special case not supported by iconv-lite
            return new JPDecoder(charset);
        }
        return iconv.decodeStream(charset);
    },
    packMessageRange (list) {
        if (!Array.isArray(list)) {
            list = [].concat(list || []);
        }
        if (!list.length) {
            return '';
        }
        list.sort((a, b)=>a - b);
        let last = list[list.length - 1];
        let result = [
            [
                last
            ]
        ];
        for(let i = list.length - 2; i >= 0; i--){
            if (list[i] === list[i + 1] - 1) {
                result[0].unshift(list[i]);
                continue;
            }
            result.unshift([
                list[i]
            ]);
        }
        result = result.map((item)=>{
            if (item.length === 1) {
                return item[0];
            }
            return item.shift() + ':' + item.pop();
        });
        return result.join(',');
    }
};
module.exports = tools;
}),
"[project]/Autonomous-Claims-Orchestrator/node_modules/imapflow/lib/commands/id.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const { formatDateTime } = __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/imapflow/lib/tools.js [app-route] (ecmascript)");
// Sends ID info to server and updates server info data based on response
module.exports = async (connection, clientInfo)=>{
    if (!connection.capabilities.has('ID')) {
        // nothing to do here
        return;
    }
    let response;
    try {
        let map = {};
        // convert object into an array of value tuples
        let formattedClientInfo = !clientInfo ? null : Object.keys(clientInfo).map((key)=>[
                key,
                formatValue(key, clientInfo[key])
            ]).filter((entry)=>entry[1]).flatMap((entry)=>entry);
        if (formattedClientInfo && !formattedClientInfo.length) {
            // value array has no elements
            formattedClientInfo = null;
        }
        response = await connection.exec('ID', [
            formattedClientInfo
        ], {
            untagged: {
                ID: async (untagged)=>{
                    let params = untagged.attributes && untagged.attributes[0];
                    let key;
                    (Array.isArray(params) ? params : [].concat(params || [])).forEach((val, i)=>{
                        if (i % 2 === 0) {
                            key = val.value;
                        } else if (typeof key === 'string' && typeof val.value === 'string') {
                            map[key.toLowerCase().trim()] = val.value;
                        }
                    });
                }
            }
        });
        connection.serverInfo = map;
        response.next();
        return map;
    } catch (err) {
        connection.log.warn({
            err,
            cid: connection.id
        });
        return false;
    }
};
function formatValue(key, value) {
    switch(key.toLowerCase()){
        case 'date':
            // Date has to be in imap date-time format
            return formatDateTime(value);
        default:
            // Other values are strings without newlines
            return (value || '').toString().replace(/\s+/g, ' ');
    }
}
}),
"[project]/Autonomous-Claims-Orchestrator/node_modules/imapflow/lib/commands/capability.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

// Refresh capabilities from server
module.exports = async (connection)=>{
    if (connection.capabilities.size && !connection.expectCapabilityUpdate) {
        return connection.capabilities;
    }
    let response;
    try {
        // untagged capability response is processed by global handler
        response = await connection.exec('CAPABILITY');
        response.next();
        return connection.capabilities;
    } catch (err) {
        connection.log.warn({
            err,
            cid: connection.id
        });
        return false;
    }
};
}),
"[project]/Autonomous-Claims-Orchestrator/node_modules/imapflow/lib/commands/namespace.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

// Requests NAMESPACE info from server
module.exports = async (connection)=>{
    if (![
        connection.states.AUTHENTICATED,
        connection.states.SELECTED
    ].includes(connection.state)) {
        // nothing to do here
        return;
    }
    if (!connection.capabilities.has('NAMESPACE')) {
        // try to derive from listing
        let { prefix, delimiter } = await getListPrefix(connection);
        if (delimiter && prefix && prefix.charAt(prefix.length - 1) !== delimiter) {
            prefix += delimiter;
        }
        let map = {
            personal: [
                {
                    prefix: prefix || '',
                    delimiter
                }
            ],
            other: false,
            shared: false
        };
        connection.namespaces = map;
        connection.namespace = connection.namespaces.personal[0];
        return connection.namespace;
    }
    let response;
    try {
        let map = {};
        response = await connection.exec('NAMESPACE', false, {
            untagged: {
                NAMESPACE: async (untagged)=>{
                    if (!untagged.attributes || !untagged.attributes.length) {
                        return;
                    }
                    map.personal = getNamsepaceInfo(untagged.attributes[0]);
                    map.other = getNamsepaceInfo(untagged.attributes[1]);
                    map.shared = getNamsepaceInfo(untagged.attributes[2]);
                }
            }
        });
        connection.namespaces = map;
        // make sure that we have the first personal namespace always set
        if (!connection.namespaces.personal[0]) {
            connection.namespaces.personal[0] = {
                prefix: '',
                delimiter: '.'
            };
        }
        connection.namespaces.personal[0].prefix = connection.namespaces.personal[0].prefix || '';
        response.next();
        connection.namespace = connection.namespaces.personal[0];
        return connection.namespace;
    } catch (err) {
        connection.log.warn({
            err,
            cid: connection.id
        });
        return {
            error: true,
            status: err.responseStatus,
            text: err.responseText
        };
    }
};
async function getListPrefix(connection) {
    let response;
    try {
        let map = {};
        response = await connection.exec('LIST', [
            '',
            ''
        ], {
            untagged: {
                LIST: async (untagged)=>{
                    if (!untagged.attributes || !untagged.attributes.length) {
                        return;
                    }
                    map.flags = new Set(untagged.attributes[0].map((entry)=>entry.value));
                    map.delimiter = untagged.attributes[1] && untagged.attributes[1].value;
                    map.prefix = untagged.attributes[2] && untagged.attributes[2].value || '';
                    if (map.delimiter && map.prefix.charAt(0) === map.delimiter) {
                        map.prefix = map.prefix.slice(1);
                    }
                }
            }
        });
        response.next();
        return map;
    } catch (err) {
        connection.log.warn({
            err,
            cid: connection.id
        });
        return {};
    }
}
function getNamsepaceInfo(attribute) {
    if (!attribute || !attribute.length) {
        return false;
    }
    return attribute.filter((entry)=>entry.length >= 2 && typeof entry[0].value === 'string' && typeof entry[1].value === 'string').map((entry)=>{
        let prefix = entry[0].value;
        let delimiter = entry[1].value;
        if (delimiter && prefix && prefix.charAt(prefix.length - 1) !== delimiter) {
            prefix += delimiter;
        }
        return {
            prefix,
            delimiter
        };
    });
}
}),
"[project]/Autonomous-Claims-Orchestrator/node_modules/imapflow/lib/commands/login.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const { getStatusCode, getErrorText } = __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/imapflow/lib/tools.js [app-route] (ecmascript)");
// Authenticates user using LOGIN
module.exports = async (connection, username, password)=>{
    if (connection.state !== connection.states.NOT_AUTHENTICATED) {
        // nothing to do here
        return;
    }
    try {
        let response = await connection.exec('LOGIN', [
            {
                type: 'STRING',
                value: username
            },
            {
                type: 'STRING',
                value: password,
                sensitive: true
            }
        ]);
        response.next();
        connection.authCapabilities.set('LOGIN', true);
        return username;
    } catch (err) {
        let errorCode = getStatusCode(err.response);
        if (errorCode) {
            err.serverResponseCode = errorCode;
        }
        err.authenticationFailed = true;
        err.response = await getErrorText(err.response);
        throw err;
    }
};
}),
"[project]/Autonomous-Claims-Orchestrator/node_modules/imapflow/lib/commands/logout.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

// Logs out user and closes connection
module.exports = async (connection)=>{
    if (connection.state === connection.states.LOGOUT) {
        // nothing to do here
        return false;
    }
    if (connection.state === connection.states.NOT_AUTHENTICATED) {
        connection.state = connection.states.LOGOUT;
        connection.close();
        return false;
    }
    let response;
    try {
        response = await connection.exec('LOGOUT');
        return true;
    } catch (err) {
        if (err.code === 'NoConnection') {
            return true;
        }
        connection.log.warn({
            err,
            cid: connection.id
        });
        return false;
    } finally{
        // close even if command failed
        connection.state = connection.states.LOGOUT;
        if (response && typeof response.next === 'function') {
            response.next();
        }
        connection.close();
    }
};
}),
"[project]/Autonomous-Claims-Orchestrator/node_modules/imapflow/lib/commands/starttls.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

// Requests STARTTLS info from server
module.exports = async (connection)=>{
    if (!connection.capabilities.has('STARTTLS') || connection.secureConnection) {
        // nothing to do here
        return false;
    }
    let response;
    try {
        response = await connection.exec('STARTTLS');
        response.next();
        return true;
    } catch (err) {
        connection.log.warn({
            err,
            cid: connection.id
        });
        return false;
    }
};
}),
"[project]/Autonomous-Claims-Orchestrator/node_modules/imapflow/lib/special-use.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

module.exports = {
    flags: [
        '\\All',
        '\\Archive',
        '\\Drafts',
        '\\Flagged',
        '\\Junk',
        '\\Sent',
        '\\Trash'
    ],
    names: {
        '\\Sent': [
            'aika',
            'bidaliak',
            'bidalita',
            'dihantar',
            'e rometsweng',
            'e tindami',
            'elküldött',
            'elküldöttek',
            'elementos enviados',
            'éléments envoyés',
            'enviadas',
            'enviadas',
            'enviados',
            'enviats',
            'envoyés',
            'ethunyelweyo',
            'expediate',
            'ezipuru',
            'gesendete',
            'gesendete elemente',
            'gestuur',
            'gönderilmiş öğeler',
            'göndərilənlər',
            'iberilen',
            'inviati',
            'išsiųstieji',
            'kuthunyelwe',
            'lasa',
            'lähetetyt',
            'messages envoyés',
            'naipadala',
            'nalefa',
            'napadala',
            'nosūtītās ziņas',
            'odeslané',
            'odeslaná pošta',
            'padala',
            'poslane',
            'poslano',
            'poslano',
            'poslané',
            'poslato',
            'saadetud',
            'saadetud kirjad',
            'saadetud üksused',
            'sendt',
            'sendt',
            'sent',
            'sent items',
            'sent messages',
            'sända poster',
            'sänt',
            'terkirim',
            'ti fi ranṣẹ',
            'të dërguara',
            'verzonden',
            'vilivyotumwa',
            'wysłane',
            'đã gửi',
            'σταλθέντα',
            'жиберилген',
            'жіберілгендер',
            'изпратени',
            'илгээсэн',
            'ирсол шуд',
            'испратено',
            'надіслані',
            'отправленные',
            'пасланыя',
            'юборилган',
            'ուղարկված',
            'נשלחו',
            'פריטים שנשלחו',
            'المرسلة',
            'بھیجے گئے',
            'سوزمژہ',
            'لېګل شوی',
            'موارد ارسال شده',
            'पाठविले',
            'पाठविलेले',
            'प्रेषित',
            'भेजा गया',
            'প্রেরিত',
            'প্রেরিত',
            'প্ৰেৰিত',
            'ਭੇਜੇ',
            'મોકલેલા',
            'ପଠାଗଲା',
            'அனுப்பியவை',
            'పంపించబడింది',
            'ಕಳುಹಿಸಲಾದ',
            'അയച്ചു',
            'යැවු පණිවුඩ',
            'ส่งแล้ว',
            'გაგზავნილი',
            'የተላኩ',
            'បាន​ផ្ញើ',
            '寄件備份',
            '寄件備份',
            '已发信息',
            '送信済みﾒｰﾙ',
            '발신 메시지',
            '보낸 편지함'
        ],
        '\\Trash': [
            'articole șterse',
            'bin',
            'borttagna objekt',
            'deleted',
            'deleted items',
            'deleted messages',
            'elementi eliminati',
            'elementos borrados',
            'elementos eliminados',
            'gelöschte objekte',
            'gelöschte elemente',
            'item dipadam',
            'itens apagados',
            'itens excluídos',
            'kustutatud üksused',
            'mục đã xóa',
            'odstraněné položky',
            'odstraněná pošta',
            'pesan terhapus',
            'poistetut',
            'praht',
            'prügikast',
            'silinmiş öğeler',
            'slettede beskeder',
            'slettede elementer',
            'trash',
            'törölt elemek',
            'törölt',
            'usunięte wiadomości',
            'verwijderde items',
            'vymazané správy',
            'éléments supprimés',
            'видалені',
            'жойылғандар',
            'удаленные',
            'פריטים שנמחקו',
            'العناصر المحذوفة',
            'موارد حذف شده',
            'รายการที่ลบ',
            '已删除邮件',
            '已刪除項目',
            '已刪除項目'
        ],
        '\\Junk': [
            'bulk mail',
            'correo no deseado',
            'courrier indésirable',
            'istenmeyen',
            'istenmeyen e-posta',
            'junk',
            'junk e-mail',
            'junk email',
            'junk-e-mail',
            'levélszemét',
            'nevyžiadaná pošta',
            'nevyžádaná pošta',
            'no deseado',
            'posta indesiderata',
            'pourriel',
            'roskaposti',
            'rämpspost',
            'skräppost',
            'spam',
            'spam',
            'spamowanie',
            'søppelpost',
            'thư rác',
            'wiadomości-śmieci',
            'спам',
            'דואר זבל',
            'الرسائل العشوائية',
            'هرزنامه',
            'สแปม',
            '垃圾郵件',
            '垃圾邮件',
            '垃圾電郵'
        ],
        '\\Drafts': [
            'ba brouillon',
            'borrador',
            'borrador',
            'borradores',
            'bozze',
            'brouillons',
            'bản thảo',
            'ciorne',
            'concepten',
            'draf',
            'draft',
            'drafts',
            'drög',
            'entwürfe',
            'esborranys',
            'garalamalar',
            'ihe edeturu',
            'iidrafti',
            'izinhlaka',
            'juodraščiai',
            'kladd',
            'kladder',
            'koncepty',
            'koncepty',
            'konsep',
            'konsepte',
            'kopie robocze',
            'layihələr',
            'luonnokset',
            'melnraksti',
            'meralo',
            'mesazhe të padërguara',
            'mga draft',
            'mustandid',
            'nacrti',
            'nacrti',
            'osnutki',
            'piszkozatok',
            'rascunhos',
            'rasimu',
            'skice',
            'taslaklar',
            'tsararrun saƙonni',
            'utkast',
            'vakiraoka',
            'vázlatok',
            'zirriborroak',
            'àwọn àkọpamọ́',
            'πρόχειρα',
            'жобалар',
            'нацрти',
            'нооргууд',
            'сиёҳнавис',
            'хомаки хатлар',
            'чарнавікі',
            'чернетки',
            'чернови',
            'черновики',
            'черновиктер',
            'սևագրեր',
            'טיוטות',
            'مسودات',
            'مسودات',
            'موسودې',
            'پیش نویسها',
            'ڈرافٹ/',
            'ड्राफ़्ट',
            'प्रारूप',
            'খসড়া',
            'খসড়া',
            'ড্ৰাফ্ট',
            'ਡ੍ਰਾਫਟ',
            'ડ્રાફ્ટસ',
            'ଡ୍ରାଫ୍ଟ',
            'வரைவுகள்',
            'చిత్తు ప్రతులు',
            'ಕರಡುಗಳು',
            'കരടുകള്‍',
            'කෙටුම් පත්',
            'ฉบับร่าง',
            'მონახაზები',
            'ረቂቆች',
            'សារព្រាង',
            '下書き',
            '草稿',
            '草稿',
            '草稿',
            '임시 보관함'
        ],
        '\\Archive': [
            'archive'
        ]
    },
    specialUse (hasSpecialUseExtension, folder) {
        let result;
        if (hasSpecialUseExtension) {
            result = {
                flag: module.exports.flags.find((flag)=>folder.flags.has(flag)),
                source: 'extension'
            };
        }
        if (!result || !result.flag) {
            let name = folder.name.toLowerCase().replace(/\u200e/g, '').trim();
            result = {
                flag: Object.keys(module.exports.names).find((flag)=>module.exports.names[flag].includes(name)),
                source: 'name'
            };
        }
        return result && result.flag ? result : {
            flag: null
        };
    }
};
}),
"[project]/Autonomous-Claims-Orchestrator/node_modules/imapflow/lib/commands/list.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const { decodePath, encodePath, normalizePath } = __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/imapflow/lib/tools.js [app-route] (ecmascript)");
const { specialUse } = __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/imapflow/lib/special-use.js [app-route] (ecmascript)");
// Lists mailboxes from server
module.exports = async (connection, reference, mailbox, options)=>{
    options = options || {};
    const FLAG_SORT_ORDER = [
        '\\Inbox',
        '\\Flagged',
        '\\Sent',
        '\\Drafts',
        '\\All',
        '\\Archive',
        '\\Junk',
        '\\Trash'
    ];
    const SOURCE_SORT_ORDER = [
        'user',
        'extension',
        'name'
    ];
    let listCommand = connection.capabilities.has('XLIST') && !connection.capabilities.has('SPECIAL-USE') ? 'XLIST' : 'LIST';
    let response;
    try {
        let entries = [];
        let statusMap = new Map();
        let returnArgs = [];
        let statusQueryAttributes = [];
        if (options.statusQuery) {
            Object.keys(options.statusQuery || {}).forEach((key)=>{
                if (!options.statusQuery[key]) {
                    return;
                }
                switch(key.toUpperCase()){
                    case 'MESSAGES':
                    case 'RECENT':
                    case 'UIDNEXT':
                    case 'UIDVALIDITY':
                    case 'UNSEEN':
                        statusQueryAttributes.push({
                            type: 'ATOM',
                            value: key.toUpperCase()
                        });
                        break;
                    case 'HIGHESTMODSEQ':
                        if (connection.capabilities.has('CONDSTORE')) {
                            statusQueryAttributes.push({
                                type: 'ATOM',
                                value: key.toUpperCase()
                            });
                        }
                        break;
                }
            });
        }
        if (listCommand === 'LIST' && connection.capabilities.has('LIST-STATUS') && statusQueryAttributes.length) {
            returnArgs.push({
                type: 'ATOM',
                value: 'STATUS'
            }, statusQueryAttributes);
            if (connection.capabilities.has('SPECIAL-USE')) {
                returnArgs.push({
                    type: 'ATOM',
                    value: 'SPECIAL-USE'
                });
            }
        }
        let specialUseMatches = {};
        let addSpecialUseMatch = (entry, type, source)=>{
            if (!specialUseMatches[type]) {
                specialUseMatches[type] = [];
            }
            specialUseMatches[type].push({
                entry,
                source
            });
        };
        let specialUseHints = {};
        if (options.specialUseHints && typeof options.specialUseHints === 'object') {
            for (let type of Object.keys(options.specialUseHints)){
                if ([
                    'sent',
                    'junk',
                    'trash',
                    'drafts',
                    'archive'
                ].includes(type) && options.specialUseHints[type] && typeof options.specialUseHints[type] === 'string') {
                    specialUseHints[normalizePath(connection, options.specialUseHints[type])] = `\\${type.replace(/^./, (c)=>c.toUpperCase())}`;
                }
            }
        }
        let runList = async (reference, mailbox)=>{
            const cmdArgs = [
                encodePath(connection, reference),
                encodePath(connection, mailbox)
            ];
            if (returnArgs.length) {
                cmdArgs.push({
                    type: 'ATOM',
                    value: 'RETURN'
                }, returnArgs);
            }
            response = await connection.exec(listCommand, cmdArgs, {
                untagged: {
                    [listCommand]: async (untagged)=>{
                        if (!untagged.attributes || !untagged.attributes.length) {
                            return;
                        }
                        let entry = {
                            path: normalizePath(connection, decodePath(connection, untagged.attributes[2] && untagged.attributes[2].value || '')),
                            pathAsListed: untagged.attributes[2] && untagged.attributes[2].value || '',
                            flags: new Set(untagged.attributes[0].map((entry)=>entry.value)),
                            delimiter: untagged.attributes[1] && untagged.attributes[1].value,
                            listed: true
                        };
                        if (specialUseHints[entry.path]) {
                            addSpecialUseMatch(entry, specialUseHints[entry.path], 'user');
                        }
                        if (listCommand === 'XLIST' && entry.flags.has('\\Inbox')) {
                            // XLIST specific flag, ignore
                            entry.flags.delete('\\Inbox');
                            if (entry.path !== 'INBOX') {
                                // XLIST may use localised inbox name
                                addSpecialUseMatch(entry, '\\Inbox', 'extension');
                            }
                        }
                        if (entry.path.toUpperCase() === 'INBOX') {
                            addSpecialUseMatch(entry, '\\Inbox', 'name');
                        }
                        if (entry.delimiter && entry.path.charAt(0) === entry.delimiter) {
                            entry.path = entry.path.slice(1);
                        }
                        entry.parentPath = entry.delimiter && entry.path ? entry.path.substr(0, entry.path.lastIndexOf(entry.delimiter)) : '';
                        entry.parent = entry.delimiter ? entry.path.split(entry.delimiter) : [
                            entry.path
                        ];
                        entry.name = entry.parent.pop();
                        let { flag: specialUseFlag, source: flagSource } = specialUse(connection.capabilities.has('XLIST') || connection.capabilities.has('SPECIAL-USE'), entry);
                        if (specialUseFlag) {
                            addSpecialUseMatch(entry, specialUseFlag, flagSource);
                        }
                        entries.push(entry);
                    },
                    STATUS: async (untagged)=>{
                        let statusPath = normalizePath(connection, decodePath(connection, untagged.attributes[0] && untagged.attributes[0].value || ''));
                        let statusList = untagged.attributes && Array.isArray(untagged.attributes[1]) ? untagged.attributes[1] : false;
                        if (!statusList || !statusPath) {
                            return;
                        }
                        let key;
                        let map = {
                            path: statusPath
                        };
                        statusList.forEach((entry, i)=>{
                            if (i % 2 === 0) {
                                key = entry && typeof entry.value === 'string' ? entry.value : false;
                                return;
                            }
                            if (!key || !entry || typeof entry.value !== 'string') {
                                return;
                            }
                            let value = false;
                            switch(key.toUpperCase()){
                                case 'MESSAGES':
                                    key = 'messages';
                                    value = !isNaN(entry.value) ? Number(entry.value) : false;
                                    break;
                                case 'RECENT':
                                    key = 'recent';
                                    value = !isNaN(entry.value) ? Number(entry.value) : false;
                                    break;
                                case 'UIDNEXT':
                                    key = 'uidNext';
                                    value = !isNaN(entry.value) ? Number(entry.value) : false;
                                    break;
                                case 'UIDVALIDITY':
                                    key = 'uidValidity';
                                    value = !isNaN(entry.value) ? BigInt(entry.value) : false;
                                    break;
                                case 'UNSEEN':
                                    key = 'unseen';
                                    value = !isNaN(entry.value) ? Number(entry.value) : false;
                                    break;
                                case 'HIGHESTMODSEQ':
                                    key = 'highestModseq';
                                    value = !isNaN(entry.value) ? BigInt(entry.value) : false;
                                    break;
                            }
                            if (value === false) {
                                return;
                            }
                            map[key] = value;
                        });
                        statusMap.set(statusPath, map);
                    }
                }
            });
            response.next();
        };
        let normalizedReference = normalizePath(connection, reference || '');
        await runList(normalizedReference, normalizePath(connection, mailbox || '', true));
        if (options.listOnly) {
            return entries;
        }
        if (normalizedReference && !specialUseMatches['\\Inbox']) {
            // INBOX was most probably not included in the listing if namespace was used
            await runList('', 'INBOX');
        }
        if (options.statusQuery) {
            for (let entry of entries){
                if (!entry.flags.has('\\Noselect') && !entry.flags.has('\\NonExistent')) {
                    if (statusMap.has(entry.path)) {
                        entry.status = statusMap.get(entry.path);
                    } else if (!statusMap.size) {
                        // run STATUS command
                        try {
                            entry.status = await connection.run('STATUS', entry.path, options.statusQuery);
                        } catch (err) {
                            entry.status = {
                                error: err
                            };
                        }
                    }
                }
            }
        }
        response = await connection.exec('LSUB', [
            encodePath(connection, normalizePath(connection, reference || '')),
            encodePath(connection, normalizePath(connection, mailbox || '', true))
        ], {
            untagged: {
                LSUB: async (untagged)=>{
                    if (!untagged.attributes || !untagged.attributes.length) {
                        return;
                    }
                    let entry = {
                        path: normalizePath(connection, decodePath(connection, untagged.attributes[2] && untagged.attributes[2].value || '')),
                        pathAsListed: untagged.attributes[2] && untagged.attributes[2].value || '',
                        flags: new Set(untagged.attributes[0].map((entry)=>entry.value)),
                        delimiter: untagged.attributes[1] && untagged.attributes[1].value,
                        subscribed: true
                    };
                    if (entry.path.toUpperCase() === 'INBOX') {
                        addSpecialUseMatch(entry, '\\Inbox', 'name');
                    }
                    if (entry.delimiter && entry.path.charAt(0) === entry.delimiter) {
                        entry.path = entry.path.slice(1);
                    }
                    entry.parentPath = entry.delimiter && entry.path ? entry.path.substr(0, entry.path.lastIndexOf(entry.delimiter)) : '';
                    entry.parent = entry.delimiter ? entry.path.split(entry.delimiter) : [
                        entry.path
                    ];
                    entry.name = entry.parent.pop();
                    let existing = entries.find((existing)=>existing.path === entry.path);
                    if (existing) {
                        existing.subscribed = true;
                        entry.flags.forEach((flag)=>existing.flags.add(flag));
                    } else {
                    // ignore non-listed folders
                    /*
                            let specialUseFlag = specialUse(connection.capabilities.has('XLIST') || connection.capabilities.has('SPECIAL-USE'), entry);
                            if (specialUseFlag && !flagsSeen.has(specialUseFlag)) {
                                entry.specialUse = specialUseFlag;
                            }
                            entries.push(entry);
                            */ }
                }
            }
        });
        response.next();
        for (let type of Object.keys(specialUseMatches)){
            let sortedEntries = specialUseMatches[type].sort((a, b)=>{
                let aSource = SOURCE_SORT_ORDER.indexOf(a.source);
                let bSource = SOURCE_SORT_ORDER.indexOf(b.source);
                if (aSource === bSource) {
                    return a.entry.path.localeCompare(b.entry.path);
                }
                return aSource - bSource;
            });
            if (!sortedEntries[0].entry.specialUse) {
                sortedEntries[0].entry.specialUse = type;
                sortedEntries[0].entry.specialUseSource = sortedEntries[0].source;
            }
        }
        let inboxEntry = entries.find((entry)=>entry.specialUse === '\\Inbox');
        if (inboxEntry && !inboxEntry.subscribed) {
            // override server settings and make INBOX always as subscribed
            inboxEntry.subscribed = true;
        }
        return entries.sort((a, b)=>{
            if (a.specialUse && !b.specialUse) {
                return -1;
            }
            if (!a.specialUse && b.specialUse) {
                return 1;
            }
            if (a.specialUse && b.specialUse) {
                return FLAG_SORT_ORDER.indexOf(a.specialUse) - FLAG_SORT_ORDER.indexOf(b.specialUse);
            }
            let aList = [].concat(a.parent).concat(a.name);
            let bList = [].concat(b.parent).concat(b.name);
            for(let i = 0; i < aList.length; i++){
                let aPart = aList[i];
                let bPart = bList[i];
                if (aPart !== bPart) {
                    return aPart.localeCompare(bPart || '');
                }
            }
            return a.path.localeCompare(b.path);
        });
    } catch (err) {
        connection.log.warn({
            msg: 'Failed to list folders',
            err,
            cid: connection.id
        });
        throw err;
    }
};
}),
"[project]/Autonomous-Claims-Orchestrator/node_modules/imapflow/lib/commands/enable.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

// Enables extensions
module.exports = async (connection, extensionList)=>{
    if (!connection.capabilities.has('ENABLE') || connection.state !== connection.states.AUTHENTICATED) {
        // nothing to do here
        return;
    }
    extensionList = extensionList.filter((extension)=>connection.capabilities.has(extension.toUpperCase()));
    if (!extensionList.length) {
        return;
    }
    let response;
    try {
        let enabled = new Set();
        response = await connection.exec('ENABLE', extensionList.map((extension)=>({
                type: 'ATOM',
                value: extension.toUpperCase()
            })), {
            untagged: {
                ENABLED: async (untagged)=>{
                    if (!untagged.attributes || !untagged.attributes.length) {
                        return;
                    }
                    untagged.attributes.forEach((attr)=>{
                        if (attr.value && typeof attr.value === 'string') {
                            enabled.add(attr.value.toUpperCase().trim());
                        }
                    });
                }
            }
        });
        connection.enabled = enabled;
        response.next();
        return enabled;
    } catch (err) {
        connection.log.warn({
            err,
            cid: connection.id
        });
        return false;
    }
};
}),
"[project]/Autonomous-Claims-Orchestrator/node_modules/imapflow/lib/commands/select.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const { encodePath, normalizePath, enhanceCommandError } = __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/imapflow/lib/tools.js [app-route] (ecmascript)");
// Selects a mailbox
module.exports = async (connection, path, options)=>{
    if (![
        connection.states.AUTHENTICATED,
        connection.states.SELECTED
    ].includes(connection.state)) {
        // nothing to do here
        return;
    }
    options = options || {};
    path = normalizePath(connection, path);
    if (!connection.folders.has(path)) {
        let folders = await connection.run('LIST', '', path);
        if (!folders) {
            throw new Error('Failed to fetch folders');
        }
        folders.forEach((folder)=>{
            connection.folders.set(folder.path, folder);
        });
    }
    let folderListData = connection.folders.has(path) ? connection.folders.get(path) : false;
    let response;
    try {
        let map = {
            path
        };
        if (folderListData) {
            [
                'delimiter',
                'specialUse',
                'subscribed',
                'listed'
            ].forEach((key)=>{
                if (folderListData[key]) {
                    map[key] = folderListData[key];
                }
            });
        }
        let extraArgs = [];
        if (connection.enabled.has('QRESYNC') && options.changedSince && options.uidValidity) {
            extraArgs.push([
                {
                    type: 'ATOM',
                    value: 'QRESYNC'
                },
                [
                    {
                        type: 'ATOM',
                        value: options.uidValidity?.toString()
                    },
                    {
                        type: 'ATOM',
                        value: options.changedSince.toString()
                    }
                ]
            ]);
            map.qresync = true;
        }
        let encodedPath = encodePath(connection, path);
        let selectCommand = {
            command: !options.readOnly ? 'SELECT' : 'EXAMINE',
            arguments: [
                {
                    type: encodedPath.indexOf('&') >= 0 ? 'STRING' : 'ATOM',
                    value: encodedPath
                }
            ].concat(extraArgs || [])
        };
        response = await connection.exec(selectCommand.command, selectCommand.arguments, {
            untagged: {
                OK: async (untagged)=>{
                    if (!untagged.attributes || !untagged.attributes.length) {
                        return;
                    }
                    let section = !untagged.attributes[0].value && untagged.attributes[0].section;
                    if (section && section.length > 1 && section[0].type === 'ATOM' && typeof section[0].value === 'string') {
                        let key = section[0].value.toLowerCase();
                        let value;
                        if (typeof section[1].value === 'string') {
                            value = section[1].value;
                        } else if (Array.isArray(section[1])) {
                            value = section[1].map((entry)=>typeof entry.value === 'string' ? entry.value : false).filter((entry)=>entry);
                        }
                        switch(key){
                            case 'highestmodseq':
                                key = 'highestModseq';
                                if (/^[0-9]+$/.test(value)) {
                                    value = BigInt(value);
                                }
                                break;
                            case 'mailboxid':
                                key = 'mailboxId';
                                if (Array.isArray(value) && value.length) {
                                    value = value[0];
                                }
                                break;
                            case 'permanentflags':
                                key = 'permanentFlags';
                                value = new Set(value);
                                break;
                            case 'uidnext':
                                key = 'uidNext';
                                value = Number(value);
                                break;
                            case 'uidvalidity':
                                key = 'uidValidity';
                                if (/^[0-9]+$/.test(value)) {
                                    value = BigInt(value);
                                }
                                break;
                        }
                        map[key] = value;
                    }
                    if (section && section.length === 1 && section[0].type === 'ATOM' && typeof section[0].value === 'string') {
                        let key = section[0].value.toLowerCase();
                        switch(key){
                            case 'nomodseq':
                                key = 'noModseq';
                                map[key] = true;
                                break;
                        }
                    }
                },
                FLAGS: async (untagged)=>{
                    if (!untagged.attributes || !untagged.attributes.length && Array.isArray(untagged.attributes[0])) {
                        return;
                    }
                    let flags = untagged.attributes[0].map((flag)=>typeof flag.value === 'string' ? flag.value : false).filter((flag)=>flag);
                    map.flags = new Set(flags);
                },
                EXISTS: async (untagged)=>{
                    let num = Number(untagged.command);
                    if (isNaN(num)) {
                        return false;
                    }
                    map.exists = num;
                },
                VANISHED: async (untagged)=>{
                    await connection.untaggedVanished(untagged, // mailbox is not yet open, so use a dummy mailbox object
                    {
                        path,
                        uidNext: false,
                        uidValidity: false
                    });
                },
                // we should only get an untagged FETCH for a SELECT/EXAMINE if QRESYNC was asked for
                FETCH: async (untagged)=>{
                    await connection.untaggedFetch(untagged, // mailbox is not yet open, so use a dummy mailbox object
                    {
                        path,
                        uidNext: false,
                        uidValidity: false
                    });
                }
            }
        });
        let section = !response.response.attributes[0].value && response.response.attributes[0].section;
        if (section && section.length && section[0].type === 'ATOM' && typeof section[0].value === 'string') {
            switch(section[0].value.toUpperCase()){
                case 'READ-ONLY':
                    map.readOnly = true;
                    break;
                case 'READ-WRITE':
                default:
                    map.readOnly = false;
                    break;
            }
        }
        if (map.qresync && // UIDVALIDITY must be the same
        (options.uidValidity !== map.uidValidity || // HIGHESTMODSEQ response must be present
        !map.highestModseq || // NOMODSEQ is not allowed
        map.noModseq)) {
            // QRESYNC does not apply here, so unset it
            map.qresync = false;
        }
        let currentMailbox = connection.mailbox;
        connection.mailbox = false;
        if (currentMailbox && currentMailbox.path !== path) {
            connection.emit('mailboxClose', currentMailbox);
        }
        connection.mailbox = map;
        connection.currentSelectCommand = selectCommand;
        connection.state = connection.states.SELECTED;
        if (!currentMailbox || currentMailbox.path !== path) {
            connection.emit('mailboxOpen', connection.mailbox);
        }
        response.next();
        return map;
    } catch (err) {
        await enhanceCommandError(err);
        if (connection.state === connection.states.SELECTED) {
            // reset selected state
            let currentMailbox = connection.mailbox;
            connection.mailbox = false;
            connection.currentSelectCommand = false;
            connection.state = connection.states.AUTHENTICATED;
            if (currentMailbox) {
                connection.emit('mailboxClose', currentMailbox);
            }
        }
        connection.log.warn({
            err,
            cid: connection.id
        });
        throw err;
    }
};
}),
"[project]/Autonomous-Claims-Orchestrator/node_modules/imapflow/lib/commands/fetch.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const { formatMessageResponse } = __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/imapflow/lib/tools.js [app-route] (ecmascript)");
// Fetches emails from server
module.exports = async (connection, range, query, options)=>{
    if (connection.state !== connection.states.SELECTED || !range) {
        // nothing to do here
        return;
    }
    options = options || {};
    let mailbox = connection.mailbox;
    const commandKey = connection.capabilities.has('BINARY') && options.binary && !connection.disableBinary ? 'BINARY' : 'BODY';
    let retryCount = 0;
    const maxRetries = 4;
    const baseDelay = 1000; // Start with 1 second delay
    while(retryCount < maxRetries){
        let messages = {
            count: 0,
            list: []
        };
        let response;
        try {
            let attributes = [
                {
                    type: 'SEQUENCE',
                    value: (range || '*').toString()
                }
            ];
            let queryStructure = [];
            let setBodyPeek = (attributes, partial)=>{
                let bodyPeek = {
                    type: 'ATOM',
                    value: `${commandKey}.PEEK`,
                    section: [],
                    partial
                };
                if (Array.isArray(attributes)) {
                    attributes.forEach((attribute)=>{
                        bodyPeek.section.push(attribute);
                    });
                } else if (attributes) {
                    bodyPeek.section.push(attributes);
                }
                queryStructure.push(bodyPeek);
            };
            [
                'all',
                'fast',
                'full',
                'uid',
                'flags',
                'bodyStructure',
                'envelope',
                'internalDate'
            ].forEach((key)=>{
                if (query[key]) {
                    queryStructure.push({
                        type: 'ATOM',
                        value: key.toUpperCase()
                    });
                }
            });
            if (query.size) {
                queryStructure.push({
                    type: 'ATOM',
                    value: 'RFC822.SIZE'
                });
            }
            if (query.source) {
                let partial;
                if (typeof query.source === 'object' && (query.source.start || query.source.maxLength)) {
                    partial = [
                        Number(query.source.start) || 0
                    ];
                    if (query.source.maxLength && !isNaN(query.source.maxLength)) {
                        partial.push(Number(query.source.maxLength));
                    }
                }
                queryStructure.push({
                    type: 'ATOM',
                    value: `${commandKey}.PEEK`,
                    section: [],
                    partial
                });
            }
            // if possible, always request for unique email id
            if (connection.capabilities.has('OBJECTID')) {
                queryStructure.push({
                    type: 'ATOM',
                    value: 'EMAILID'
                });
            } else if (connection.capabilities.has('X-GM-EXT-1')) {
                queryStructure.push({
                    type: 'ATOM',
                    value: 'X-GM-MSGID'
                });
            }
            if (query.threadId) {
                if (connection.capabilities.has('OBJECTID')) {
                    queryStructure.push({
                        type: 'ATOM',
                        value: 'THREADID'
                    });
                } else if (connection.capabilities.has('X-GM-EXT-1')) {
                    queryStructure.push({
                        type: 'ATOM',
                        value: 'X-GM-THRID'
                    });
                }
            }
            if (query.labels) {
                if (connection.capabilities.has('X-GM-EXT-1')) {
                    queryStructure.push({
                        type: 'ATOM',
                        value: 'X-GM-LABELS'
                    });
                }
            }
            // always ask for modseq if possible
            if (connection.enabled.has('CONDSTORE') && !mailbox.noModseq) {
                queryStructure.push({
                    type: 'ATOM',
                    value: 'MODSEQ'
                });
            }
            // always make sure to include UID in the request as well even though server might auto-add it itself
            if (!query.uid) {
                queryStructure.push({
                    type: 'ATOM',
                    value: 'UID'
                });
            }
            if (query.headers) {
                if (Array.isArray(query.headers)) {
                    setBodyPeek([
                        {
                            type: 'ATOM',
                            value: 'HEADER.FIELDS'
                        },
                        query.headers.map((header)=>({
                                type: 'ATOM',
                                value: header
                            }))
                    ]);
                } else {
                    setBodyPeek({
                        type: 'ATOM',
                        value: 'HEADER'
                    });
                }
            }
            if (query.bodyParts && query.bodyParts.length) {
                query.bodyParts.forEach((part)=>{
                    if (!part) {
                        return;
                    }
                    let key;
                    let partial;
                    if (typeof part === 'object') {
                        if (!part.key || typeof part.key !== 'string') {
                            return;
                        }
                        key = part.key.toUpperCase();
                        if (part.start || part.maxLength) {
                            partial = [
                                Number(part.start) || 0
                            ];
                            if (part.maxLength && !isNaN(part.maxLength)) {
                                partial.push(Number(part.maxLength));
                            }
                        }
                    } else if (typeof part === 'string') {
                        key = part.toUpperCase();
                    } else {
                        return;
                    }
                    setBodyPeek({
                        type: 'ATOM',
                        value: key
                    }, partial);
                });
            }
            if (queryStructure.length === 1) {
                queryStructure = queryStructure.pop();
            }
            attributes.push(queryStructure);
            if (options.changedSince && connection.enabled.has('CONDSTORE') && !mailbox.noModseq) {
                let changedSinceArgs = [
                    {
                        type: 'ATOM',
                        value: 'CHANGEDSINCE'
                    },
                    {
                        type: 'ATOM',
                        value: options.changedSince.toString()
                    }
                ];
                if (options.uid && connection.enabled.has('QRESYNC')) {
                    changedSinceArgs.push({
                        type: 'ATOM',
                        value: 'VANISHED'
                    });
                }
                attributes.push(changedSinceArgs);
            }
            response = await connection.exec(options.uid ? 'UID FETCH' : 'FETCH', attributes, {
                untagged: {
                    FETCH: async (untagged)=>{
                        messages.count++;
                        let formatted = await formatMessageResponse(untagged, mailbox);
                        if (typeof options.onUntaggedFetch === 'function') {
                            await new Promise((resolve, reject)=>{
                                options.onUntaggedFetch(formatted, (err)=>{
                                    if (err) {
                                        reject(err);
                                    } else {
                                        resolve();
                                    }
                                });
                            });
                        } else {
                            messages.list.push(formatted);
                        }
                    }
                }
            });
            response.next();
            return messages;
        } catch (err) {
            if (err.code === 'ETHROTTLE') {
                // Calculate exponential backoff delay
                const backoffDelay = Math.min(baseDelay * Math.pow(2, retryCount), 30000); // Cap at 30 seconds
                // Use throttle reset time if provided and longer than backoff
                const delay = err.throttleReset && err.throttleReset > backoffDelay ? err.throttleReset : backoffDelay;
                connection.log.warn({
                    msg: 'Retrying throttled request with exponential backoff',
                    cid: connection.id,
                    code: err.code,
                    response: err.responseText,
                    throttleReset: err.throttleReset,
                    retryCount,
                    delayMs: delay
                });
                // Wait before retrying
                await new Promise((resolve)=>setTimeout(resolve, delay));
                retryCount++;
                continue;
            }
            connection.log.warn({
                err,
                cid: connection.id
            });
            throw err;
        }
    }
};
}),
"[project]/Autonomous-Claims-Orchestrator/node_modules/imapflow/lib/commands/create.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const { encodePath, normalizePath, getStatusCode, enhanceCommandError } = __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/imapflow/lib/tools.js [app-route] (ecmascript)");
// Creates a new mailbox
module.exports = async (connection, path)=>{
    if (![
        connection.states.AUTHENTICATED,
        connection.states.SELECTED
    ].includes(connection.state)) {
        // nothing to do here
        return;
    }
    path = normalizePath(connection, path);
    let response;
    try {
        let map = {
            path
        };
        response = await connection.exec('CREATE', [
            {
                type: 'ATOM',
                value: encodePath(connection, path)
            }
        ]);
        let section = response.response.attributes && response.response.attributes[0] && response.response.attributes[0].section && response.response.attributes[0].section.length ? response.response.attributes[0].section : false;
        if (section) {
            let key;
            section.forEach((attribute, i)=>{
                if (i % 2 === 0) {
                    key = attribute && typeof attribute.value === 'string' ? attribute.value : false;
                    return;
                }
                if (!key) {
                    return;
                }
                let value;
                switch(key.toLowerCase()){
                    case 'mailboxid':
                        key = 'mailboxId';
                        value = Array.isArray(attribute) && attribute[0] && typeof attribute[0].value === 'string' ? attribute[0].value : false;
                        break;
                }
                if (key && value) {
                    map[key] = value;
                }
            });
        }
        map.created = true;
        response.next();
        //make sure we are subscribed to the new folder as well
        await connection.run('SUBSCRIBE', path);
        return map;
    } catch (err) {
        let errorCode = getStatusCode(err.response);
        if (errorCode === 'ALREADYEXISTS') {
            // no need to do anything, mailbox already exists
            return {
                path,
                created: false
            };
        }
        await enhanceCommandError(err);
        connection.log.warn({
            err,
            cid: connection.id
        });
        throw err;
    }
};
}),
"[project]/Autonomous-Claims-Orchestrator/node_modules/imapflow/lib/commands/delete.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const { encodePath, normalizePath, enhanceCommandError } = __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/imapflow/lib/tools.js [app-route] (ecmascript)");
// Deletes an existing mailbox
module.exports = async (connection, path)=>{
    if (![
        connection.states.AUTHENTICATED,
        connection.states.SELECTED
    ].includes(connection.state)) {
        // nothing to do here
        return;
    }
    path = normalizePath(connection, path);
    if (connection.state === connection.states.SELECTED && connection.mailbox.path === path) {
        await connection.run('CLOSE');
    }
    let response;
    try {
        let map = {
            path
        };
        response = await connection.exec('DELETE', [
            {
                type: 'ATOM',
                value: encodePath(connection, path)
            }
        ]);
        response.next();
        return map;
    } catch (err) {
        await enhanceCommandError(err);
        connection.log.warn({
            err,
            cid: connection.id
        });
        throw err;
    }
};
}),
"[project]/Autonomous-Claims-Orchestrator/node_modules/imapflow/lib/commands/rename.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const { encodePath, normalizePath, enhanceCommandError } = __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/imapflow/lib/tools.js [app-route] (ecmascript)");
// Renames existing mailbox
module.exports = async (connection, path, newPath)=>{
    if (![
        connection.states.AUTHENTICATED,
        connection.states.SELECTED
    ].includes(connection.state)) {
        // nothing to do here
        return;
    }
    path = normalizePath(connection, path);
    newPath = normalizePath(connection, newPath);
    if (connection.state === connection.states.SELECTED && connection.mailbox.path === path) {
        await connection.run('CLOSE');
    }
    let response;
    try {
        let map = {
            path,
            newPath
        };
        response = await connection.exec('RENAME', [
            {
                type: 'ATOM',
                value: encodePath(connection, path)
            },
            {
                type: 'ATOM',
                value: encodePath(connection, newPath)
            }
        ]);
        response.next();
        return map;
    } catch (err) {
        await enhanceCommandError(err);
        connection.log.warn({
            err,
            cid: connection.id
        });
        throw err;
    }
};
}),
"[project]/Autonomous-Claims-Orchestrator/node_modules/imapflow/lib/commands/close.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

// Closes a mailbox
module.exports = async (connection)=>{
    if (connection.state !== connection.states.SELECTED) {
        // nothing to do here
        return;
    }
    let response;
    try {
        response = await connection.exec('CLOSE');
        response.next();
        let currentMailbox = connection.mailbox;
        connection.mailbox = false;
        connection.currentSelectCommand = false;
        connection.state = connection.states.AUTHENTICATED;
        if (currentMailbox) {
            connection.emit('mailboxClose', currentMailbox);
        }
        return true;
    } catch (err) {
        connection.log.warn({
            err,
            cid: connection.id
        });
        return false;
    }
};
}),
"[project]/Autonomous-Claims-Orchestrator/node_modules/imapflow/lib/commands/subscribe.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const { encodePath, normalizePath, enhanceCommandError } = __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/imapflow/lib/tools.js [app-route] (ecmascript)");
// Subscribes to a mailbox
module.exports = async (connection, path)=>{
    if (![
        connection.states.AUTHENTICATED,
        connection.states.SELECTED
    ].includes(connection.state)) {
        // nothing to do here
        return;
    }
    path = normalizePath(connection, path);
    let response;
    try {
        response = await connection.exec('SUBSCRIBE', [
            {
                type: 'ATOM',
                value: encodePath(connection, path)
            }
        ]);
        response.next();
        return true;
    } catch (err) {
        await enhanceCommandError(err);
        connection.log.warn({
            err,
            cid: connection.id
        });
        return false;
    }
};
}),
"[project]/Autonomous-Claims-Orchestrator/node_modules/imapflow/lib/commands/unsubscribe.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const { encodePath, normalizePath, enhanceCommandError } = __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/imapflow/lib/tools.js [app-route] (ecmascript)");
// Unsubscribes from a mailbox
module.exports = async (connection, path)=>{
    if (![
        connection.states.AUTHENTICATED,
        connection.states.SELECTED
    ].includes(connection.state)) {
        // nothing to do here
        return;
    }
    path = normalizePath(connection, path);
    let response;
    try {
        response = await connection.exec('UNSUBSCRIBE', [
            {
                type: 'ATOM',
                value: encodePath(connection, path)
            }
        ]);
        response.next();
        return true;
    } catch (err) {
        await enhanceCommandError(err);
        connection.log.warn({
            err,
            cid: connection.id
        });
        return false;
    }
};
}),
"[project]/Autonomous-Claims-Orchestrator/node_modules/imapflow/lib/commands/store.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const { formatFlag, canUseFlag, enhanceCommandError } = __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/imapflow/lib/tools.js [app-route] (ecmascript)");
// Updates flags for a message
module.exports = async (connection, range, flags, options)=>{
    if (connection.state !== connection.states.SELECTED || !range || options.useLabels && !connection.capabilities.has('X-GM-EXT-1')) {
        // nothing to do here
        return false;
    }
    options = options || {};
    let operation;
    operation = 'FLAGS';
    if (options.useLabels) {
        operation = 'X-GM-LABELS';
    } else if (options.silent) {
        operation = `${operation}.SILENT`;
    }
    switch((options.operation || '').toLowerCase()){
        case 'set':
            break;
        case 'remove':
            operation = `-${operation}`;
            break;
        case 'add':
        default:
            operation = `+${operation}`;
            break;
    }
    flags = (Array.isArray(flags) ? flags : [].concat(flags || [])).map((flag)=>{
        flag = formatFlag(flag);
        if (!canUseFlag(connection.mailbox, flag) && operation !== 'remove') {
            // it does not seem that we can set this flag
            return false;
        }
        return flag;
    }).filter((flag)=>flag);
    if (!flags.length && options.operation !== 'set') {
        // nothing to do here
        return false;
    }
    let attributes = [
        {
            type: 'SEQUENCE',
            value: range
        },
        {
            type: 'ATOM',
            value: operation
        },
        flags.map((flag)=>({
                type: 'ATOM',
                value: flag
            }))
    ];
    if (options.unchangedSince && connection.enabled.has('CONDSTORE') && !connection.mailbox.noModseq) {
        attributes.push([
            {
                type: 'ATOM',
                value: 'UNCHANGEDSINCE'
            },
            {
                type: 'ATOM',
                value: options.unchangedSince.toString()
            }
        ]);
    }
    let response;
    try {
        response = await connection.exec(options.uid ? 'UID STORE' : 'STORE', attributes);
        response.next();
        return true;
    } catch (err) {
        await enhanceCommandError(err);
        connection.log.warn({
            err,
            cid: connection.id
        });
        return false;
    }
};
}),
"[project]/Autonomous-Claims-Orchestrator/node_modules/imapflow/lib/search-compiler.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/* eslint no-control-regex:0 */ const { formatDate, formatFlag, canUseFlag, isDate } = __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/imapflow/lib/tools.js [app-route] (ecmascript)");
/**
 * Sets a boolean flag in the IMAP search attributes.
 * Automatically handles UN- prefixing for falsy values.
 *
 * @param {Array} attributes - Array to append the attribute to
 * @param {string} term - The flag name (e.g., 'SEEN', 'DELETED')
 * @param {boolean} value - Whether to set or unset the flag
 * @example
 * setBoolOpt(attributes, 'SEEN', false) // Adds 'UNSEEN'
 * setBoolOpt(attributes, 'UNSEEN', false) // Adds 'SEEN' (removes UN prefix)
 */ let setBoolOpt = (attributes, term, value)=>{
    if (!value) {
        // For falsy values, toggle the UN- prefix
        if (/^un/i.test(term)) {
            // Remove existing UN prefix
            term = term.slice(2);
        } else {
            // Add UN prefix
            term = 'UN' + term;
        }
    }
    attributes.push({
        type: 'ATOM',
        value: term.toUpperCase()
    });
};
/**
 * Adds a search option with its value(s) to the attributes array.
 * Handles NOT operations and array values.
 *
 * @param {Array} attributes - Array to append the attribute to
 * @param {string} term - The search term (e.g., 'FROM', 'SUBJECT')
 * @param {*} value - The value for the search term (string, array, or falsy for NOT)
 * @param {string} [type='ATOM'] - The attribute type
 */ let setOpt = (attributes, term, value, type)=>{
    type = type || 'ATOM';
    // Handle NOT operations for false or null values
    if (value === false || value === null) {
        attributes.push({
            type,
            value: 'NOT'
        });
    }
    attributes.push({
        type,
        value: term.toUpperCase()
    });
    // Handle array values (e.g., multiple UIDs)
    if (Array.isArray(value)) {
        value.forEach((entry)=>attributes.push({
                type,
                value: (entry || '').toString()
            }));
    } else {
        attributes.push({
            type,
            value: value.toString()
        });
    }
};
/**
 * Processes date fields for IMAP search.
 * Converts JavaScript dates to IMAP date format.
 *
 * @param {Array} attributes - Array to append the attribute to
 * @param {string} term - The date search term (e.g., 'BEFORE', 'SINCE')
 * @param {*} value - Date value to format
 */ let processDateField = (attributes, term, value)=>{
    if ([
        'BEFORE',
        'SENTBEFORE'
    ].includes(term.toUpperCase()) && isDate(value) && value.toISOString().substring(11) !== '00:00:00.000Z') {
        // Set to next day to include current day as well, othwerise BEFORE+AFTER
        // searches for the same day but different time values do not match anything
        value = new Date(value.getTime() + 24 * 3600 * 1000);
    }
    let date = formatDate(value);
    if (!date) {
        return;
    }
    setOpt(attributes, term, date);
};
// Pre-compiled regex for better performance
const UNICODE_PATTERN = /[^\x00-\x7F]/;
/**
 * Checks if a string contains Unicode characters.
 * Used to determine if CHARSET UTF-8 needs to be specified.
 *
 * @param {*} str - String to check
 * @returns {boolean} True if string contains non-ASCII characters
 */ let isUnicodeString = (str)=>{
    if (!str || typeof str !== 'string') {
        return false;
    }
    // Regex test is ~3-5x faster than Buffer.byteLength
    // Matches any character outside ASCII range (0x00-0x7F)
    return UNICODE_PATTERN.test(str);
};
/**
 * Compiles a JavaScript object query into IMAP search command attributes.
 * Supports standard IMAP search criteria and extensions like OBJECTID and Gmail extensions.
 *
 * @param {Object} connection - IMAP connection object
 * @param {Object} connection.capabilities - Set of server capabilities
 * @param {Object} connection.enabled - Set of enabled extensions
 * @param {Object} connection.mailbox - Current mailbox information
 * @param {Set} connection.mailbox.flags - Available flags in the mailbox
 * @param {Object} query - Search query object
 * @returns {Array} Array of IMAP search attributes
 * @throws {Error} When required server extensions are not available
 *
 * @example
 * // Simple search for unseen messages from a sender
 * searchCompiler(connection, {
 *   unseen: true,
 *   from: 'sender@example.com'
 * });
 *
 * @example
 * // Complex OR search with date range
 * searchCompiler(connection, {
 *   or: [
 *     { from: 'alice@example.com' },
 *     { from: 'bob@example.com' }
 *   ],
 *   since: new Date('2024-01-01')
 * });
 */ module.exports.searchCompiler = (connection, query)=>{
    const attributes = [];
    // Track if we need to specify UTF-8 charset
    let hasUnicode = false;
    const mailbox = connection.mailbox;
    /**
     * Recursively walks through the query object and builds IMAP attributes.
     * @param {Object} params - Query parameters to process
     */ const walk = (params)=>{
        Object.keys(params || {}).forEach((term)=>{
            switch(term.toUpperCase()){
                // Custom sequence range support (non-standard)
                case 'SEQ':
                    {
                        let value = params[term];
                        if (typeof value === 'number') {
                            value = value.toString();
                        }
                        // Only accept valid sequence strings (no whitespace)
                        if (typeof value === 'string' && /^\S+$/.test(value)) {
                            attributes.push({
                                type: 'SEQUENCE',
                                value
                            });
                        }
                    }
                    break;
                // Boolean flags that support UN- prefixing
                case 'ANSWERED':
                case 'DELETED':
                case 'DRAFT':
                case 'FLAGGED':
                case 'SEEN':
                case 'UNANSWERED':
                case 'UNDELETED':
                case 'UNDRAFT':
                case 'UNFLAGGED':
                case 'UNSEEN':
                    // toggles UN-prefix for falsy values
                    setBoolOpt(attributes, term, !!params[term]);
                    break;
                // Simple boolean flags without UN- support
                case 'ALL':
                case 'NEW':
                case 'OLD':
                case 'RECENT':
                    if (params[term]) {
                        setBoolOpt(attributes, term, true);
                    }
                    break;
                // Numeric comparisons
                case 'LARGER':
                case 'SMALLER':
                case 'MODSEQ':
                    if (params[term]) {
                        setOpt(attributes, term, params[term]);
                    }
                    break;
                // Text search fields - check for Unicode
                case 'BCC':
                case 'BODY':
                case 'CC':
                case 'FROM':
                case 'SUBJECT':
                case 'TEXT':
                case 'TO':
                    if (isUnicodeString(params[term])) {
                        hasUnicode = true;
                    }
                    if (params[term]) {
                        setOpt(attributes, term, params[term]);
                    }
                    break;
                // UID sequences
                case 'UID':
                    if (params[term]) {
                        setOpt(attributes, term, params[term], 'SEQUENCE');
                    }
                    break;
                // Email ID support (OBJECTID or Gmail extension)
                case 'EMAILID':
                    if (connection.capabilities.has('OBJECTID')) {
                        setOpt(attributes, 'EMAILID', params[term]);
                    } else if (connection.capabilities.has('X-GM-EXT-1')) {
                        // Fallback to Gmail message ID
                        setOpt(attributes, 'X-GM-MSGID', params[term]);
                    }
                    break;
                // Thread ID support (OBJECTID or Gmail extension)
                case 'THREADID':
                    if (connection.capabilities.has('OBJECTID')) {
                        setOpt(attributes, 'THREADID', params[term]);
                    } else if (connection.capabilities.has('X-GM-EXT-1')) {
                        // Fallback to Gmail thread ID
                        setOpt(attributes, 'X-GM-THRID', params[term]);
                    }
                    break;
                // Gmail raw search
                case 'GMRAW':
                case 'GMAILRAW':
                    if (connection.capabilities.has('X-GM-EXT-1')) {
                        if (isUnicodeString(params[term])) {
                            hasUnicode = true;
                        }
                        setOpt(attributes, 'X-GM-RAW', params[term]);
                    } else {
                        let error = new Error('Server does not support X-GM-EXT-1 extension required for X-GM-RAW');
                        error.code = 'MissingServerExtension';
                        throw error;
                    }
                    break;
                // Date searches with WITHIN extension support
                case 'BEFORE':
                case 'SINCE':
                    {
                        // Use WITHIN extension for better timezone handling if available
                        if (connection.capabilities.has('WITHIN') && isDate(params[term])) {
                            // Convert to seconds ago from now
                            const now = Date.now();
                            const withinSeconds = Math.round(Math.max(0, now - params[term].getTime()) / 1000);
                            let withinKeyword;
                            switch(term.toUpperCase()){
                                case 'BEFORE':
                                    withinKeyword = 'OLDER';
                                    break;
                                case 'SINCE':
                                    withinKeyword = 'YOUNGER';
                                    break;
                            }
                            setOpt(attributes, withinKeyword, withinSeconds.toString());
                            break;
                        }
                        // Fallback to standard date search
                        processDateField(attributes, term, params[term]);
                    }
                    break;
                // Standard date searches
                case 'ON':
                case 'SENTBEFORE':
                case 'SENTON':
                case 'SENTSINCE':
                    processDateField(attributes, term, params[term]);
                    break;
                // Keyword/flag searches
                case 'KEYWORD':
                case 'UNKEYWORD':
                    {
                        let flag = formatFlag(params[term]);
                        // Only add if flag is supported or already exists in mailbox
                        if (canUseFlag(mailbox, flag) || mailbox.flags.has(flag)) {
                            setOpt(attributes, term, flag);
                        }
                    }
                    break;
                // Header field searches
                case 'HEADER':
                    if (params[term] && typeof params[term] === 'object') {
                        Object.keys(params[term]).forEach((header)=>{
                            let value = params[term][header];
                            // Allow boolean true to search for header existence
                            if (value === true) {
                                value = '';
                            }
                            // Skip non-string values (after true->'' conversion)
                            if (typeof value !== 'string') {
                                return;
                            }
                            if (isUnicodeString(value)) {
                                hasUnicode = true;
                            }
                            setOpt(attributes, term, [
                                header.toUpperCase().trim(),
                                value
                            ]);
                        });
                    }
                    break;
                // NOT operator
                case 'NOT':
                    {
                        if (!params[term]) {
                            break;
                        }
                        if (typeof params[term] === 'object') {
                            attributes.push({
                                type: 'ATOM',
                                value: 'NOT'
                            });
                            // Recursively process NOT conditions
                            walk(params[term]);
                        }
                    }
                    break;
                // OR operator - complex logic for building OR trees
                case 'OR':
                    {
                        if (!params[term] || !Array.isArray(params[term]) || !params[term].length) {
                            break;
                        }
                        // Single element - just process it directly
                        if (params[term].length === 1) {
                            if (typeof params[term][0] === 'object' && params[term][0]) {
                                walk(params[term][0]);
                            }
                            break;
                        }
                        /**
                         * Generates a binary tree structure for OR operations.
                         * IMAP OR takes exactly 2 operands, so we need to nest them.
                         *
                         * @param {Array} list - List of conditions to OR together
                         * @returns {Array} Binary tree structure
                         */ let genOrTree = (list)=>{
                            let group = false;
                            let groups = [];
                            // Group items in pairs
                            list.forEach((entry, i)=>{
                                if (i % 2 === 0) {
                                    group = [
                                        entry
                                    ];
                                } else {
                                    group.push(entry);
                                    groups.push(group);
                                    group = false;
                                }
                            });
                            // Handle odd number of items
                            if (group && group.length) {
                                while(group.length === 1 && Array.isArray(group[0])){
                                    group = group[0];
                                }
                                groups.push(group);
                            }
                            // Recursively group until we have a binary tree
                            while(groups.length > 2){
                                groups = genOrTree(groups);
                            }
                            // Flatten single-element arrays
                            while(groups.length === 1 && Array.isArray(groups[0])){
                                groups = groups[0];
                            }
                            return groups;
                        };
                        /**
                         * Walks the OR tree and generates IMAP commands.
                         * @param {Array|Object} entry - Tree node to process
                         */ let walkOrTree = (entry)=>{
                            if (Array.isArray(entry)) {
                                // Only add OR for multiple items
                                if (entry.length > 1) {
                                    attributes.push({
                                        type: 'ATOM',
                                        value: 'OR'
                                    });
                                }
                                entry.forEach(walkOrTree);
                                return;
                            }
                            if (entry && typeof entry === 'object') {
                                walk(entry);
                            }
                        };
                        walkOrTree(genOrTree(params[term]));
                    }
                    break;
            }
        });
    };
    // Process the query
    walk(query);
    // If we encountered Unicode strings and UTF-8 is not already accepted,
    // prepend CHARSET UTF-8 to the search command
    if (hasUnicode && !connection.enabled.has('UTF8=ACCEPT')) {
        attributes.unshift({
            type: 'ATOM',
            value: 'UTF-8'
        });
        attributes.unshift({
            type: 'ATOM',
            value: 'CHARSET'
        });
    }
    return attributes;
};
}),
"[project]/Autonomous-Claims-Orchestrator/node_modules/imapflow/lib/commands/search.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const { enhanceCommandError } = __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/imapflow/lib/tools.js [app-route] (ecmascript)");
const { searchCompiler } = __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/imapflow/lib/search-compiler.js [app-route] (ecmascript)");
// Updates flags for a message
module.exports = async (connection, query, options)=>{
    if (connection.state !== connection.states.SELECTED) {
        // nothing to do here
        return false;
    }
    options = options || {};
    let attributes;
    if (!query || query === true || typeof query === 'object' && (!Object.keys(query).length || Object.keys(query).length === 1 && query.all)) {
        // search for all messages
        attributes = [
            {
                type: 'ATOM',
                value: 'ALL'
            }
        ];
    } else if (query && typeof query === 'object') {
        // normal query
        attributes = searchCompiler(connection, query);
    } else {
        return false;
    }
    let results = new Set();
    let response;
    try {
        response = await connection.exec(options.uid ? 'UID SEARCH' : 'SEARCH', attributes, {
            untagged: {
                SEARCH: async (untagged)=>{
                    if (untagged && untagged.attributes && untagged.attributes.length) {
                        untagged.attributes.forEach((attribute)=>{
                            if (attribute && attribute.value && typeof attribute.value === 'string' && !isNaN(attribute.value)) {
                                results.add(Number(attribute.value));
                            }
                        });
                    }
                }
            }
        });
        response.next();
        return Array.from(results).sort((a, b)=>a - b);
    } catch (err) {
        await enhanceCommandError(err);
        connection.log.warn({
            err,
            cid: connection.id
        });
        return false;
    }
};
}),
"[project]/Autonomous-Claims-Orchestrator/node_modules/imapflow/lib/commands/noop.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

// Sends a NO-OP command
module.exports = async (connection)=>{
    try {
        let response = await connection.exec('NOOP', false, {
            comment: 'Requested by command'
        });
        response.next();
        return true;
    } catch (err) {
        connection.log.warn({
            err,
            cid: connection.id
        });
        return false;
    }
};
}),
"[project]/Autonomous-Claims-Orchestrator/node_modules/imapflow/lib/commands/expunge.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const { enhanceCommandError } = __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/imapflow/lib/tools.js [app-route] (ecmascript)");
// Deletes specified messages
module.exports = async (connection, range, options)=>{
    if (connection.state !== connection.states.SELECTED || !range) {
        // nothing to do here
        return;
    }
    options = options || {};
    await connection.messageFlagsAdd(range, [
        '\\Deleted'
    ], options);
    let byUid = options.uid && connection.capabilities.has('UIDPLUS');
    let command = byUid ? 'UID EXPUNGE' : 'EXPUNGE';
    let attributes = byUid ? [
        {
            type: 'SEQUENCE',
            value: range
        }
    ] : false;
    let response;
    try {
        response = await connection.exec(command, attributes);
        // A OK [HIGHESTMODSEQ 9122] Expunge completed (0.010 + 0.000 + 0.012 secs).
        let section = response.response.attributes && response.response.attributes[0] && response.response.attributes[0].section;
        let responseCode = section && section.length && section[0] && typeof section[0].value === 'string' ? section[0].value : '';
        if (responseCode.toUpperCase() === 'HIGHESTMODSEQ') {
            let highestModseq = section[1] && typeof section[1].value === 'string' && !isNaN(section[1].value) ? BigInt(section[1].value) : false;
            if (highestModseq && (!connection.mailbox.highestModseq || highestModseq > connection.mailbox.highestModseq)) {
                connection.mailbox.highestModseq = highestModseq;
            }
        }
        response.next();
        return true;
    } catch (err) {
        await enhanceCommandError(err);
        connection.log.warn({
            err,
            cid: connection.id
        });
        return false;
    }
};
}),
"[project]/Autonomous-Claims-Orchestrator/node_modules/imapflow/lib/commands/append.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const { formatFlag, canUseFlag, formatDateTime, normalizePath, encodePath, comparePaths, enhanceCommandError } = __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/imapflow/lib/tools.js [app-route] (ecmascript)");
// Appends a message to a mailbox
module.exports = async (connection, destination, content, flags, idate)=>{
    if (![
        connection.states.AUTHENTICATED,
        connection.states.SELECTED
    ].includes(connection.state) || !destination) {
        // nothing to do here
        return;
    }
    if (typeof content === 'string') {
        content = Buffer.from(content);
    }
    if (connection.capabilities.has('APPENDLIMIT')) {
        let appendLimit = connection.capabilities.get('APPENDLIMIT');
        if (typeof appendLimit === 'number' && appendLimit < content.length) {
            let err = new Error('Message content too big for APPENDLIMIT=' + appendLimit);
            err.serverResponseCode = 'APPENDLIMIT';
            throw err;
        }
    }
    destination = normalizePath(connection, destination);
    let expectExists = comparePaths(connection, connection.mailbox.path, destination);
    flags = (Array.isArray(flags) ? flags : [].concat(flags || [])).map((flag)=>flag && formatFlag(flag.toString())).filter((flag)=>flag && canUseFlag(connection.mailbox, flag));
    let attributes = [
        {
            type: 'ATOM',
            value: encodePath(connection, destination)
        }
    ];
    idate = idate ? formatDateTime(idate) : false;
    if (flags.length || idate) {
        attributes.push(flags.map((flag)=>({
                type: 'ATOM',
                value: flag
            })));
    }
    if (idate) {
        attributes.push({
            type: 'STRING',
            value: idate
        }); // force quotes as required by date-time
    }
    let isLiteral8 = false;
    if (connection.capabilities.has('BINARY') && !connection.disableBinary) {
        // Value is literal8 if it contains NULL bytes. The server must support the BINARY extension
        // and if it does not then send the value as a regular literal and hope for the best
        isLiteral8 = content.indexOf(Buffer.from([
            0
        ])) >= 0;
    }
    attributes.push({
        type: 'LITERAL',
        value: content,
        isLiteral8
    });
    let map = {
        destination
    };
    if (connection.mailbox && connection.mailbox.path) {
        map.path = connection.mailbox.path;
    }
    let response;
    try {
        response = await connection.exec('APPEND', attributes, {
            untagged: expectExists ? {
                EXISTS: async (untagged)=>{
                    map.seq = Number(untagged.command);
                    if (expectExists) {
                        let prevCount = connection.mailbox.exists;
                        if (map.seq !== prevCount) {
                            connection.mailbox.exists = map.seq;
                            connection.emit('exists', {
                                path: connection.mailbox.path,
                                count: map.seq,
                                prevCount
                            });
                        }
                    }
                }
            } : false
        });
        let section = response.response.attributes && response.response.attributes[0] && response.response.attributes[0].section;
        if (section && section.length) {
            let responseCode = section[0] && typeof section[0].value === 'string' ? section[0].value : '';
            switch(responseCode.toUpperCase()){
                case 'APPENDUID':
                    {
                        let uidValidity = section[1] && typeof section[1].value === 'string' && !isNaN(section[1].value) ? BigInt(section[1].value) : false;
                        let uid = section[2] && typeof section[2].value === 'string' && !isNaN(section[2].value) ? Number(section[2].value) : false;
                        if (uidValidity) {
                            map.uidValidity = uidValidity;
                        }
                        if (uid) {
                            map.uid = uid;
                        }
                    }
                    break;
            }
        }
        response.next();
        if (expectExists && !map.seq) {
            // try to use NOOP to get the new sequence number
            try {
                response = await connection.exec('NOOP', false, {
                    untagged: {
                        EXISTS: async (untagged)=>{
                            map.seq = Number(untagged.command);
                            if (expectExists) {
                                let prevCount = connection.mailbox.exists;
                                if (map.seq !== prevCount) {
                                    connection.mailbox.exists = map.seq;
                                    connection.emit('exists', {
                                        path: connection.mailbox.path,
                                        count: map.seq,
                                        prevCount
                                    });
                                }
                            }
                        }
                    },
                    comment: 'Sequence not found from APPEND output'
                });
                response.next();
            } catch (err) {
                connection.log.warn({
                    err,
                    cid: connection.id
                });
            }
        }
        if (map.seq && !map.uid) {
            let list = await connection.search({
                seq: map.seq
            }, {
                uid: true
            });
            if (list && list.length) {
                map.uid = list[0];
            }
        }
        return map;
    } catch (err) {
        await enhanceCommandError(err);
        connection.log.warn({
            err,
            cid: connection.id
        });
        throw err;
    }
};
}),
"[project]/Autonomous-Claims-Orchestrator/node_modules/imapflow/lib/commands/status.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const { encodePath, normalizePath } = __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/imapflow/lib/tools.js [app-route] (ecmascript)");
// Requests info about a mailbox
module.exports = async (connection, path, query)=>{
    if (![
        connection.states.AUTHENTICATED,
        connection.states.SELECTED
    ].includes(connection.state) || !path) {
        // nothing to do here
        return false;
    }
    path = normalizePath(connection, path);
    let encodedPath = encodePath(connection, path);
    let attributes = [
        {
            type: encodedPath.indexOf('&') >= 0 ? 'STRING' : 'ATOM',
            value: encodedPath
        }
    ];
    let queryAttributes = [];
    Object.keys(query || {}).forEach((key)=>{
        if (!query[key]) {
            return;
        }
        switch(key.toUpperCase()){
            case 'MESSAGES':
            case 'RECENT':
            case 'UIDNEXT':
            case 'UIDVALIDITY':
            case 'UNSEEN':
                queryAttributes.push({
                    type: 'ATOM',
                    value: key.toUpperCase()
                });
                break;
            case 'HIGHESTMODSEQ':
                if (connection.capabilities.has('CONDSTORE')) {
                    queryAttributes.push({
                        type: 'ATOM',
                        value: key.toUpperCase()
                    });
                }
                break;
        }
    });
    if (!queryAttributes.length) {
        return false;
    }
    attributes.push(queryAttributes);
    let response;
    try {
        let map = {
            path
        };
        response = await connection.exec('STATUS', attributes, {
            untagged: {
                STATUS: async (untagged)=>{
                    // If STATUS is for current mailbox then update mailbox values
                    let updateCurrent = connection.state === connection.states.SELECTED && path === connection.mailbox.path;
                    let list = untagged.attributes && Array.isArray(untagged.attributes[1]) ? untagged.attributes[1] : false;
                    if (!list) {
                        return;
                    }
                    let key;
                    list.forEach((entry, i)=>{
                        if (i % 2 === 0) {
                            key = entry && typeof entry.value === 'string' ? entry.value : false;
                            return;
                        }
                        if (!key || !entry || typeof entry.value !== 'string') {
                            return;
                        }
                        let value = false;
                        switch(key.toUpperCase()){
                            case 'MESSAGES':
                                key = 'messages';
                                value = !isNaN(entry.value) ? Number(entry.value) : false;
                                if (updateCurrent) {
                                    let prevCount = connection.mailbox.exists;
                                    if (prevCount !== value) {
                                        // somehow message count in current folder has changed?
                                        connection.mailbox.exists = value;
                                        connection.emit('exists', {
                                            path,
                                            count: value,
                                            prevCount
                                        });
                                    }
                                }
                                break;
                            case 'RECENT':
                                key = 'recent';
                                value = !isNaN(entry.value) ? Number(entry.value) : false;
                                break;
                            case 'UIDNEXT':
                                key = 'uidNext';
                                value = !isNaN(entry.value) ? Number(entry.value) : false;
                                if (updateCurrent) {
                                    connection.mailbox.uidNext = value;
                                }
                                break;
                            case 'UIDVALIDITY':
                                key = 'uidValidity';
                                value = !isNaN(entry.value) ? BigInt(entry.value) : false;
                                break;
                            case 'UNSEEN':
                                key = 'unseen';
                                value = !isNaN(entry.value) ? Number(entry.value) : false;
                                break;
                            case 'HIGHESTMODSEQ':
                                key = 'highestModseq';
                                value = !isNaN(entry.value) ? BigInt(entry.value) : false;
                                if (updateCurrent) {
                                    connection.mailbox.highestModseq = value;
                                }
                                break;
                        }
                        if (value === false) {
                            return;
                        }
                        map[key] = value;
                    });
                }
            }
        });
        response.next();
        return map;
    } catch (err) {
        if (err.responseStatus === 'NO') {
            let folders = await connection.run('LIST', '', path, {
                listOnly: true
            });
            if (folders && !folders.length) {
                let error = new Error(`Mailbox doesn't exist: ${path}`);
                error.code = 'NotFound';
                error.response = err;
                throw error;
            }
        }
        connection.log.warn({
            err,
            cid: connection.id
        });
        return false;
    }
};
}),
"[project]/Autonomous-Claims-Orchestrator/node_modules/imapflow/lib/commands/copy.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const { normalizePath, encodePath, expandRange, enhanceCommandError } = __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/imapflow/lib/tools.js [app-route] (ecmascript)");
// Copies messages from current mailbox to some other mailbox
module.exports = async (connection, range, destination, options)=>{
    if (connection.state !== connection.states.SELECTED || !range || !destination) {
        // nothing to do here
        return;
    }
    options = options || {};
    destination = normalizePath(connection, destination);
    let attributes = [
        {
            type: 'SEQUENCE',
            value: range
        },
        {
            type: 'ATOM',
            value: encodePath(connection, destination)
        }
    ];
    let response;
    try {
        response = await connection.exec(options.uid ? 'UID COPY' : 'COPY', attributes);
        response.next();
        let map = {
            path: connection.mailbox.path,
            destination
        };
        let section = response.response.attributes && response.response.attributes[0] && response.response.attributes[0].section;
        let responseCode = section && section.length && section[0] && typeof section[0].value === 'string' ? section[0].value : '';
        switch(responseCode){
            case 'COPYUID':
                {
                    let uidValidity = section[1] && typeof section[1].value === 'string' && !isNaN(section[1].value) ? BigInt(section[1].value) : false;
                    if (uidValidity) {
                        map.uidValidity = uidValidity;
                    }
                    let sourceUids = section[2] && typeof section[2].value === 'string' ? expandRange(section[2].value) : false;
                    let destinationUids = section[3] && typeof section[3].value === 'string' ? expandRange(section[3].value) : false;
                    if (sourceUids && destinationUids && sourceUids.length === destinationUids.length) {
                        map.uidMap = new Map(sourceUids.map((uid, i)=>[
                                uid,
                                destinationUids[i]
                            ]));
                    }
                }
                break;
        }
        return map;
    } catch (err) {
        await enhanceCommandError(err);
        connection.log.warn({
            err,
            cid: connection.id
        });
        return false;
    }
};
}),
"[project]/Autonomous-Claims-Orchestrator/node_modules/imapflow/lib/commands/move.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const { normalizePath, encodePath, expandRange, enhanceCommandError } = __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/imapflow/lib/tools.js [app-route] (ecmascript)");
// Moves messages from current mailbox to some other mailbox
module.exports = async (connection, range, destination, options)=>{
    if (connection.state !== connection.states.SELECTED || !range || !destination) {
        // nothing to do here
        return;
    }
    options = options || {};
    destination = normalizePath(connection, destination);
    let attributes = [
        {
            type: 'SEQUENCE',
            value: range
        },
        {
            type: 'ATOM',
            value: encodePath(connection, destination)
        }
    ];
    let map = {
        path: connection.mailbox.path,
        destination
    };
    if (!connection.capabilities.has('MOVE')) {
        let result = await connection.messageCopy(range, destination, options);
        await connection.messageDelete(range, Object.assign({
            silent: true
        }, options));
        return result;
    }
    let checkMoveInfo = (response)=>{
        let section = response.attributes && response.attributes[0] && response.attributes[0].section;
        let responseCode = section && section.length && section[0] && typeof section[0].value === 'string' ? section[0].value : '';
        switch(responseCode){
            case 'COPYUID':
                {
                    let uidValidity = section[1] && typeof section[1].value === 'string' && !isNaN(section[1].value) ? BigInt(section[1].value) : false;
                    if (uidValidity) {
                        map.uidValidity = uidValidity;
                    }
                    let sourceUids = section[2] && typeof section[2].value === 'string' ? expandRange(section[2].value) : false;
                    let destinationUids = section[3] && typeof section[3].value === 'string' ? expandRange(section[3].value) : false;
                    if (sourceUids && destinationUids && sourceUids.length === destinationUids.length) {
                        map.uidMap = new Map(sourceUids.map((uid, i)=>[
                                uid,
                                destinationUids[i]
                            ]));
                    }
                }
                break;
        }
    };
    let response;
    try {
        response = await connection.exec(options.uid ? 'UID MOVE' : 'MOVE', attributes, {
            untagged: {
                OK: async (untagged)=>{
                    checkMoveInfo(untagged);
                }
            }
        });
        response.next();
        checkMoveInfo(response.response);
        return map;
    } catch (err) {
        await enhanceCommandError(err);
        connection.log.warn({
            err,
            cid: connection.id
        });
        return false;
    }
};
}),
"[project]/Autonomous-Claims-Orchestrator/node_modules/imapflow/lib/commands/compress.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

// Requests compression from server
module.exports = async (connection)=>{
    if (!connection.capabilities.has('COMPRESS=DEFLATE') || connection._inflate) {
        // nothing to do here
        return false;
    }
    let response;
    try {
        response = await connection.exec('COMPRESS', [
            {
                type: 'ATOM',
                value: 'DEFLATE'
            }
        ]);
        response.next();
        return true;
    } catch (err) {
        connection.log.warn({
            err,
            cid: connection.id
        });
        return false;
    }
};
}),
"[project]/Autonomous-Claims-Orchestrator/node_modules/imapflow/lib/commands/quota.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const { encodePath, normalizePath, enhanceCommandError } = __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/imapflow/lib/tools.js [app-route] (ecmascript)");
// Requests quota information for a mailbox
module.exports = async (connection, path)=>{
    if (![
        connection.states.AUTHENTICATED,
        connection.states.SELECTED
    ].includes(connection.state) || !path) {
        // nothing to do here
        return;
    }
    if (!connection.capabilities.has('QUOTA')) {
        return false;
    }
    path = normalizePath(connection, path);
    let map = {
        path
    };
    let processQuotaResponse = (untagged)=>{
        let attributes = untagged.attributes && untagged.attributes[1];
        if (!attributes || !attributes.length) {
            return false;
        }
        let key = false;
        attributes.forEach((attribute, i)=>{
            if (i % 3 === 0) {
                key = attribute && typeof attribute.value === 'string' ? attribute.value.toLowerCase() : false;
                return;
            }
            if (!key) {
                return;
            }
            let value = attribute && typeof attribute.value === 'string' && !isNaN(attribute.value) ? Number(attribute.value) : false;
            if (value === false) {
                return;
            }
            if (i % 3 === 1) {
                // usage
                if (!map[key]) {
                    map[key] = {};
                }
                map[key].usage = value * (key === 'storage' ? 1024 : 1);
            }
            if (i % 3 === 2) {
                // limit
                if (!map[key]) {
                    map[key] = {};
                }
                map[key].limit = value * (key === 'storage' ? 1024 : 1);
                if (map[key].limit) {
                    map[key].status = Math.round((map[key].usage || 0) / map[key].limit * 100) + '%';
                }
            }
        });
    };
    let quotaFound = false;
    let response;
    try {
        response = await connection.exec('GETQUOTAROOT', [
            {
                type: 'ATOM',
                value: encodePath(connection, path)
            }
        ], {
            untagged: {
                QUOTAROOT: async (untagged)=>{
                    let quotaRoot = untagged.attributes && untagged.attributes[1] && typeof untagged.attributes[1].value === 'string' ? untagged.attributes[1].value : false;
                    if (quotaRoot) {
                        map.quotaRoot = quotaRoot;
                    }
                },
                QUOTA: async (untagged)=>{
                    quotaFound = true;
                    processQuotaResponse(untagged);
                }
            }
        });
        response.next();
        if (map.quotaRoot && !quotaFound) {
            response = await connection.exec('GETQUOTA', [
                {
                    type: 'ATOM',
                    value: map.quotaRoot
                }
            ], {
                untagged: {
                    QUOTA: async (untagged)=>{
                        processQuotaResponse(untagged);
                    }
                }
            });
        }
        return map;
    } catch (err) {
        await enhanceCommandError(err);
        connection.log.warn({
            err,
            cid: connection.id
        });
        return false;
    }
};
}),
"[project]/Autonomous-Claims-Orchestrator/node_modules/imapflow/lib/commands/idle.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const NOOP_INTERVAL = 2 * 60 * 1000;
async function runIdle(connection) {
    let response;
    let preCheckWaitQueue = [];
    try {
        connection.idling = true;
        //let idleSent = false;
        let doneRequested = false;
        let doneSent = false;
        let canEnd = false;
        let preCheck = async ()=>{
            doneRequested = true;
            if (canEnd && !doneSent) {
                connection.log.debug({
                    src: 'c',
                    msg: `DONE`,
                    comment: `breaking IDLE`,
                    lockId: connection.currentLock?.lockId,
                    path: connection.mailbox && connection.mailbox.path
                });
                connection.write('DONE');
                doneSent = true;
                connection.idling = false;
                connection.preCheck = false; // unset itself
                while(preCheckWaitQueue.length){
                    let { resolve } = preCheckWaitQueue.shift();
                    resolve();
                }
            }
        };
        let connectionPreCheck = ()=>{
            let handler = new Promise((resolve, reject)=>{
                preCheckWaitQueue.push({
                    resolve,
                    reject
                });
            });
            connection.log.trace({
                msg: 'Requesting IDLE break',
                lockId: connection.currentLock?.lockId,
                path: connection.mailbox && connection.mailbox.path,
                queued: preCheckWaitQueue.length,
                doneRequested,
                canEnd,
                doneSent
            });
            preCheck().catch((err)=>connection.log.warn({
                    err,
                    cid: connection.id
                }));
            return handler;
        };
        connection.preCheck = connectionPreCheck;
        response = await connection.exec('IDLE', false, {
            onPlusTag: async ()=>{
                connection.log.debug({
                    msg: `Initiated IDLE, waiting for server input`,
                    lockId: connection.currentLock?.lockId,
                    doneRequested
                });
                canEnd = true;
                if (doneRequested) {
                    try {
                        await preCheck();
                    } catch (err) {
                        connection.log.warn({
                            err,
                            cid: connection.id
                        });
                    }
                }
            },
            onSend: ()=>{
            //idleSent = true;
            }
        });
        // unset before response.next() if preCheck function is not already cleared (usually is)
        if (typeof connection.preCheck === 'function' && connection.preCheck === connectionPreCheck) {
            connection.log.trace({
                msg: 'Clearing pre-check function',
                lockId: connection.currentLock?.lockId,
                path: connection.mailbox && connection.mailbox.path,
                queued: preCheckWaitQueue.length,
                doneRequested,
                canEnd,
                doneSent
            });
            connection.preCheck = false;
            while(preCheckWaitQueue.length){
                let { resolve } = preCheckWaitQueue.shift();
                resolve();
            }
        }
        response.next();
        return;
    } catch (err) {
        connection.preCheck = false;
        connection.idling = false;
        connection.log.warn({
            err,
            cid: connection.id
        });
        while(preCheckWaitQueue.length){
            let { reject } = preCheckWaitQueue.shift();
            reject(err);
        }
        return false;
    }
}
// Listens for changes in mailbox
module.exports = async (connection, maxIdleTime)=>{
    if (connection.state !== connection.states.SELECTED) {
        // nothing to do here
        return;
    }
    if (connection.capabilities.has('IDLE')) {
        let idleTimer;
        let stillIdling = false;
        let runIdleLoop = async ()=>{
            if (maxIdleTime) {
                idleTimer = setTimeout(()=>{
                    if (connection.idling) {
                        if (typeof connection.preCheck === 'function') {
                            stillIdling = true;
                            // request IDLE break if IDLE has been running for allowed time
                            connection.log.trace({
                                msg: 'Max allowed IDLE time reached',
                                cid: connection.id
                            });
                            connection.preCheck().catch((err)=>connection.log.warn({
                                    err,
                                    cid: connection.id
                                }));
                        }
                    }
                }, maxIdleTime);
            }
            let resp = await runIdle(connection);
            clearTimeout(idleTimer);
            if (stillIdling) {
                stillIdling = false;
                return runIdleLoop();
            }
            return resp;
        };
        return runIdleLoop();
    }
    let idleTimer;
    return new Promise((resolve)=>{
        if (!connection.currentSelectCommand) {
            return resolve();
        }
        // no IDLE support, fallback to NOOP'ing
        connection.preCheck = async ()=>{
            connection.preCheck = false; // unset itself
            clearTimeout(idleTimer);
            connection.log.debug({
                src: 'c',
                msg: `breaking NOOP loop`
            });
            connection.idling = false;
            resolve();
        };
        let selectCommand = connection.currentSelectCommand;
        let idleCheck = async ()=>{
            let response;
            switch(connection.missingIdleCommand){
                case 'SELECT':
                    // FIXME: somehow a loop occurs after some time of idling with SELECT
                    connection.log.debug({
                        src: 'c',
                        msg: `Running SELECT to detect changes in folder`
                    });
                    response = await connection.exec(selectCommand.command, selectCommand.arguments);
                    break;
                case 'STATUS':
                    {
                        let statusArgs = [
                            selectCommand.arguments[0],
                            []
                        ]; // path
                        for (let key of [
                            'MESSAGES',
                            'UIDNEXT',
                            'UIDVALIDITY',
                            'UNSEEN'
                        ]){
                            statusArgs[1].push({
                                type: 'ATOM',
                                value: key.toUpperCase()
                            });
                        }
                        connection.log.debug({
                            src: 'c',
                            msg: `Running STATUS to detect changes in folder`
                        });
                        response = await connection.exec('STATUS', statusArgs);
                    }
                    break;
                case 'NOOP':
                default:
                    response = await connection.exec('NOOP', false, {
                        comment: 'IDLE not supported'
                    });
                    break;
            }
            response.next();
        };
        let noopInterval = maxIdleTime ? Math.min(NOOP_INTERVAL, maxIdleTime) : NOOP_INTERVAL;
        let runLoop = ()=>{
            idleCheck().then(()=>{
                clearTimeout(idleTimer);
                idleTimer = setTimeout(runLoop, noopInterval);
            }).catch((err)=>{
                clearTimeout(idleTimer);
                connection.preCheck = false;
                connection.log.warn({
                    err,
                    cid: connection.id
                });
                resolve();
            });
        };
        connection.log.debug({
            src: 'c',
            msg: `initiated NOOP loop`
        });
        connection.idling = true;
        runLoop();
    });
};
}),
"[project]/Autonomous-Claims-Orchestrator/node_modules/imapflow/lib/commands/authenticate.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const { getStatusCode, getErrorText } = __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/imapflow/lib/tools.js [app-route] (ecmascript)");
async function authOauth(connection, username, accessToken) {
    let oauthbearer;
    let command;
    let breaker;
    if (connection.capabilities.has('AUTH=OAUTHBEARER')) {
        oauthbearer = [
            `n,a=${username},`,
            `host=${connection.servername}`,
            `port=993`,
            `auth=Bearer ${accessToken}`,
            '',
            ''
        ].join('\x01');
        command = 'OAUTHBEARER';
        breaker = 'AQ==';
    } else if (connection.capabilities.has('AUTH=XOAUTH') || connection.capabilities.has('AUTH=XOAUTH2')) {
        oauthbearer = [
            `user=${username}`,
            `auth=Bearer ${accessToken}`,
            '',
            ''
        ].join('\x01');
        command = 'XOAUTH2';
        breaker = '';
    }
    let errorResponse = false;
    try {
        let response = await connection.exec('AUTHENTICATE', [
            {
                type: 'ATOM',
                value: command
            },
            {
                type: 'ATOM',
                value: Buffer.from(oauthbearer).toString('base64'),
                sensitive: true
            }
        ], {
            onPlusTag: async (resp)=>{
                if (resp.attributes && resp.attributes[0] && resp.attributes[0].type === 'TEXT') {
                    try {
                        errorResponse = JSON.parse(Buffer.from(resp.attributes[0].value, 'base64').toString());
                    } catch (err) {
                        connection.log.debug({
                            errorResponse: resp.attributes[0].value,
                            err
                        });
                    }
                }
                connection.log.debug({
                    src: 'c',
                    msg: breaker,
                    comment: `Error response for ${command}`
                });
                connection.write(breaker);
            }
        });
        response.next();
        connection.authCapabilities.set(`AUTH=${command}`, true);
        return username;
    } catch (err) {
        let errorCode = getStatusCode(err.response);
        if (errorCode) {
            err.serverResponseCode = errorCode;
        }
        err.authenticationFailed = true;
        err.response = await getErrorText(err.response);
        if (errorResponse) {
            err.oauthError = errorResponse;
        }
        throw err;
    }
}
async function authLogin(connection, username, password) {
    let errorResponse = false;
    try {
        let response = await connection.exec('AUTHENTICATE', [
            {
                type: 'ATOM',
                value: 'LOGIN'
            }
        ], {
            onPlusTag: async (resp)=>{
                if (resp.attributes && resp.attributes[0] && resp.attributes[0].type === 'TEXT') {
                    let question = Buffer.from(resp.attributes[0].value, 'base64').toString();
                    switch(question.toLowerCase().replace(/[:\x00]*$/, '') // eslint-disable-line no-control-regex
                    ){
                        case 'username':
                        case 'user name':
                            {
                                let encodedUsername = Buffer.from(username).toString('base64');
                                connection.log.debug({
                                    src: 'c',
                                    msg: encodedUsername,
                                    comment: `Encoded username for AUTH=LOGIN`
                                });
                                connection.write(encodedUsername);
                                break;
                            }
                        case 'password':
                            connection.log.debug({
                                src: 'c',
                                msg: '(* value hidden *)',
                                comment: `Encoded password for AUTH=LOGIN`
                            });
                            connection.write(Buffer.from(password).toString('base64'));
                            break;
                        default:
                            {
                                let error = new Error(`Unknown LOGIN question "${question}"`);
                                throw error;
                            }
                    }
                }
            }
        });
        response.next();
        connection.authCapabilities.set(`AUTH=LOGIN`, true);
        return username;
    } catch (err) {
        let errorCode = getStatusCode(err.response);
        if (errorCode) {
            err.serverResponseCode = errorCode;
        }
        err.authenticationFailed = true;
        err.response = await getErrorText(err.response);
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        throw err;
    }
}
async function authPlain(connection, username, password, authzid) {
    let errorResponse = false;
    try {
        let response = await connection.exec('AUTHENTICATE', [
            {
                type: 'ATOM',
                value: 'PLAIN'
            }
        ], {
            onPlusTag: async ()=>{
                // SASL PLAIN format: [authzid]\x00authcid\x00password
                // authzid: authorization identity (who to impersonate)
                // authcid: authentication identity (who is authenticating)
                let authzidValue = authzid || '';
                let encodedResponse = Buffer.from([
                    authzidValue,
                    username,
                    password
                ].join('\x00')).toString('base64');
                let loggedResponse = Buffer.from([
                    authzidValue,
                    username,
                    '(* value hidden *)'
                ].join('\x00')).toString('base64');
                connection.log.debug({
                    src: 'c',
                    msg: loggedResponse,
                    comment: `Encoded response for AUTH=PLAIN${authzid ? ' with authzid' : ''}`
                });
                connection.write(encodedResponse);
            }
        });
        response.next();
        connection.authCapabilities.set(`AUTH=PLAIN`, true);
        // Return the identity we're authorized as (authzid if provided, otherwise username)
        return authzid || username;
    } catch (err) {
        let errorCode = getStatusCode(err.response);
        if (errorCode) {
            err.serverResponseCode = errorCode;
        }
        err.authenticationFailed = true;
        err.response = await getErrorText(err.response);
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        throw err;
    }
}
// Authenticates user using LOGIN
module.exports = async (connection, username, { accessToken, password, loginMethod, authzid })=>{
    if (connection.state !== connection.states.NOT_AUTHENTICATED) {
        // nothing to do here
        return;
    }
    if (accessToken) {
        // AUTH=OAUTHBEARER and AUTH=XOAUTH in the context of OAuth2 or very similar so we can handle these together
        if (connection.capabilities.has('AUTH=OAUTHBEARER') || connection.capabilities.has('AUTH=XOAUTH') || connection.capabilities.has('AUTH=XOAUTH2')) {
            return await authOauth(connection, username, accessToken);
        }
    }
    if (password) {
        if (!loginMethod && connection.capabilities.has('AUTH=PLAIN') || loginMethod === 'AUTH=PLAIN') {
            return await authPlain(connection, username, password, authzid);
        }
        if (!loginMethod && connection.capabilities.has('AUTH=LOGIN') || loginMethod === 'AUTH=LOGIN') {
            return await authLogin(connection, username, password);
        }
    }
    throw new Error('Unsupported authentication mechanism');
};
}),
"[project]/Autonomous-Claims-Orchestrator/node_modules/imapflow/lib/imap-commands.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/* eslint global-require:0 */ module.exports = new Map([
    [
        'ID',
        __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/imapflow/lib/commands/id.js [app-route] (ecmascript)")
    ],
    [
        'CAPABILITY',
        __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/imapflow/lib/commands/capability.js [app-route] (ecmascript)")
    ],
    [
        'NAMESPACE',
        __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/imapflow/lib/commands/namespace.js [app-route] (ecmascript)")
    ],
    [
        'LOGIN',
        __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/imapflow/lib/commands/login.js [app-route] (ecmascript)")
    ],
    [
        'LOGOUT',
        __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/imapflow/lib/commands/logout.js [app-route] (ecmascript)")
    ],
    [
        'STARTTLS',
        __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/imapflow/lib/commands/starttls.js [app-route] (ecmascript)")
    ],
    [
        'LIST',
        __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/imapflow/lib/commands/list.js [app-route] (ecmascript)")
    ],
    [
        'ENABLE',
        __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/imapflow/lib/commands/enable.js [app-route] (ecmascript)")
    ],
    [
        'SELECT',
        __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/imapflow/lib/commands/select.js [app-route] (ecmascript)")
    ],
    [
        'FETCH',
        __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/imapflow/lib/commands/fetch.js [app-route] (ecmascript)")
    ],
    [
        'CREATE',
        __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/imapflow/lib/commands/create.js [app-route] (ecmascript)")
    ],
    [
        'DELETE',
        __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/imapflow/lib/commands/delete.js [app-route] (ecmascript)")
    ],
    [
        'RENAME',
        __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/imapflow/lib/commands/rename.js [app-route] (ecmascript)")
    ],
    [
        'CLOSE',
        __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/imapflow/lib/commands/close.js [app-route] (ecmascript)")
    ],
    [
        'SUBSCRIBE',
        __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/imapflow/lib/commands/subscribe.js [app-route] (ecmascript)")
    ],
    [
        'UNSUBSCRIBE',
        __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/imapflow/lib/commands/unsubscribe.js [app-route] (ecmascript)")
    ],
    [
        'STORE',
        __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/imapflow/lib/commands/store.js [app-route] (ecmascript)")
    ],
    [
        'SEARCH',
        __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/imapflow/lib/commands/search.js [app-route] (ecmascript)")
    ],
    [
        'NOOP',
        __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/imapflow/lib/commands/noop.js [app-route] (ecmascript)")
    ],
    [
        'EXPUNGE',
        __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/imapflow/lib/commands/expunge.js [app-route] (ecmascript)")
    ],
    [
        'APPEND',
        __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/imapflow/lib/commands/append.js [app-route] (ecmascript)")
    ],
    [
        'STATUS',
        __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/imapflow/lib/commands/status.js [app-route] (ecmascript)")
    ],
    [
        'COPY',
        __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/imapflow/lib/commands/copy.js [app-route] (ecmascript)")
    ],
    [
        'MOVE',
        __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/imapflow/lib/commands/move.js [app-route] (ecmascript)")
    ],
    [
        'COMPRESS',
        __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/imapflow/lib/commands/compress.js [app-route] (ecmascript)")
    ],
    [
        'QUOTA',
        __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/imapflow/lib/commands/quota.js [app-route] (ecmascript)")
    ],
    [
        'IDLE',
        __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/imapflow/lib/commands/idle.js [app-route] (ecmascript)")
    ],
    [
        'AUTHENTICATE',
        __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/imapflow/lib/commands/authenticate.js [app-route] (ecmascript)")
    ]
]);
}),
"[project]/Autonomous-Claims-Orchestrator/node_modules/imapflow/lib/imap-flow.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/**
 * @module imapflow
 */ const tls = __turbopack_context__.r("[externals]/tls [external] (tls, cjs)");
const net = __turbopack_context__.r("[externals]/net [external] (net, cjs)");
const crypto = __turbopack_context__.r("[externals]/crypto [external] (crypto, cjs)");
const { EventEmitter } = __turbopack_context__.r("[externals]/events [external] (events, cjs)");
const logger = __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/imapflow/lib/logger.js [app-route] (ecmascript)");
const libmime = __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/libmime/lib/libmime.js [app-route] (ecmascript)");
const zlib = __turbopack_context__.r("[externals]/zlib [external] (zlib, cjs)");
const { Headers } = __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/@zone-eu/mailsplit/index.js [app-route] (ecmascript)");
const { LimitedPassthrough } = __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/imapflow/lib/limited-passthrough.js [app-route] (ecmascript)");
const { ImapStream } = __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/imapflow/lib/handler/imap-stream.js [app-route] (ecmascript)");
const { parser, compiler } = __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/imapflow/lib/handler/imap-handler.js [app-route] (ecmascript)");
const packageInfo = __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/imapflow/package.json (json)");
const libqp = __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/libqp/lib/libqp.js [app-route] (ecmascript)");
const libbase64 = __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/libbase64/lib/libbase64.js [app-route] (ecmascript)");
const FlowedDecoder = __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/@zone-eu/mailsplit/lib/flowed-decoder.js [app-route] (ecmascript)");
const { PassThrough } = __turbopack_context__.r("[externals]/stream [external] (stream, cjs)");
const { proxyConnection } = __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/imapflow/lib/proxy-connection.js [app-route] (ecmascript)");
const { comparePaths, updateCapabilities, getFolderTree, formatMessageResponse, getDecoder, packMessageRange, normalizePath, expandRange, AuthenticationFailure, getColorFlags } = __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/imapflow/lib/tools.js [app-route] (ecmascript)");
const imapCommands = __turbopack_context__.r("[project]/Autonomous-Claims-Orchestrator/node_modules/imapflow/lib/imap-commands.js [app-route] (ecmascript)");
const CONNECT_TIMEOUT = 90 * 1000;
const GREETING_TIMEOUT = 16 * 1000;
const UPGRADE_TIMEOUT = 10 * 1000;
const SOCKET_TIMEOUT = 5 * 60 * 1000;
const states = {
    NOT_AUTHENTICATED: 0x01,
    AUTHENTICATED: 0x02,
    SELECTED: 0x03,
    LOGOUT: 0x04
};
/**
 * @typedef {Object} MailboxObject
 * @global
 * @property {String} path mailbox path
 * @property {String} delimiter mailbox path delimiter, usually "." or "/"
 * @property {Set<string>} flags list of flags for this mailbox
 * @property {String} [specialUse] one of special-use flags (if applicable): "\All", "\Archive", "\Drafts", "\Flagged", "\Junk", "\Sent", "\Trash". Additionally INBOX has non-standard "\Inbox" flag set
 * @property {Boolean} listed `true` if mailbox was found from the output of LIST command
 * @property {Boolean} subscribed `true` if mailbox was found from the output of LSUB command
 * @property {Set<string>} permanentFlags A Set of flags available to use in this mailbox. If it is not set or includes special flag "\\\*" then any flag can be used.
 * @property {String} [mailboxId] unique mailbox ID if server has `OBJECTID` extension enabled
 * @property {BigInt} [highestModseq] latest known modseq value if server has CONDSTORE or XYMHIGHESTMODSEQ enabled
 * @property {String} [noModseq] if true then the server doesn't support the persistent storage of mod-sequences for the mailbox
 * @property {BigInt} uidValidity Mailbox `UIDVALIDITY` value
 * @property {Number} uidNext Next predicted UID
 * @property {Number} exists Messages in this folder
 */ /**
 * @typedef {Object} MailboxLockObject
 * @global
 * @property {String} path mailbox path
 * @property {Function} release Release current lock
 * @example
 * let lock = await client.getMailboxLock('INBOX');
 * try {
 *   // do something in the mailbox
 * } finally {
 *   // use finally{} to make sure lock is released even if exception occurs
 *   lock.release();
 * }
 */ /**
 * Client and server identification object, where key is one of RFC2971 defined [data fields](https://tools.ietf.org/html/rfc2971#section-3.3) (but not limited to).
 * @typedef {Object} IdInfoObject
 * @global
 * @property {String} [name] Name of the program
 * @property {String} [version] Version number of the program
 * @property {String} [os] Name of the operating system
 * @property {String} [vendor] Vendor of the client/server
 * @property {String} ['support-url'] URL to contact for support
 * @property {Date} [date] Date program was released
 */ /**
 * IMAP client class for accessing IMAP mailboxes
 *
 * @class
 * @extends EventEmitter
 */ class ImapFlow extends EventEmitter {
    /**
     * Current module version as a static class property
     * @property {String} version Module version
     * @static
     */ static version = packageInfo.version;
    /**
     * IMAP connection options
     *
     * @property {String} host
     *     Hostname of the IMAP server.
     *
     * @property {Number} port
     *     Port number for the IMAP server.
     *
     * @property {Boolean} [secure=false]
     *     If `true`, establishes the connection directly over TLS (commonly on port 993).
     *     If `false`, a plain (unencrypted) connection is used first and, if possible, the connection is upgraded to STARTTLS.
     *
     * @property {Boolean} [doSTARTTLS=undefined]
     *     Determines whether to upgrade the connection to TLS via STARTTLS:
     *       - **true**: Start unencrypted and upgrade to TLS using STARTTLS before authentication.
     *         The connection fails if the server does not support STARTTLS or the upgrade fails.
     *         Note that `secure=true` combined with `doSTARTTLS=true` is invalid.
     *       - **false**: Never use STARTTLS, even if the server advertises support.
     *         This is useful if the server has a broken TLS setup.
     *         Combined with `secure=false`, this results in a fully unencrypted connection.
     *         Make sure you warn users about the security risks.
     *       - **undefined** (default): If `secure=false` (default), attempt to upgrade to TLS via STARTTLS before authentication if the server supports it. If not supported, continue unencrypted. This may expose the connection to a downgrade attack.
     *
     * @property {String} [servername]
     *     Server name for SNI or when using an IP address as `host`.
     *
     * @property {Boolean} [disableCompression=false]
     *     If `true`, the client does not attempt to use the COMPRESS=DEFLATE extension.
     *
     * @property {Object} auth
     *     Authentication options. Authentication occurs automatically during {@link connect}.
     *
     * @property {String} auth.user
     *     Username for authentication.
     *
     * @property {String} [auth.pass]
     *     Password for regular authentication.
     *
     * @property {String} [auth.accessToken]
     *     OAuth2 access token, if using OAuth2 authentication.
     *
     * @property {String} [auth.loginMethod]
     *     Optional login method for password-based authentication (e.g., "LOGIN", "AUTH=LOGIN", or "AUTH=PLAIN").
     *     If not set, ImapFlow chooses based on available mechanisms.
     *
     * @property {String} [auth.authzid]
     *     Authorization identity for SASL PLAIN authentication (used for admin impersonation/delegation).
     *     When set, authenticates as `auth.user` but authorizes as `auth.authzid`.
     *     This is typically used in mail systems like Zimbra for admin users to access other users' mailboxes.
     *     Only works with AUTH=PLAIN mechanism.
     *
     * @property {IdInfoObject} [clientInfo]
     *     Client identification info sent to the server (via the ID command).
     *
     * @property {Boolean} [disableAutoIdle=false]
     *     If `true`, do not start IDLE automatically. Useful when only specific operations are needed.
     *
     * @property {Object} [tls]
     *     Additional TLS options. For details, see [Node.js TLS connect](https://nodejs.org/api/tls.html#tls_tls_connect_options_callback).
     *
     * @property {Boolean} [tls.rejectUnauthorized=true]
     *     If `false`, allows self-signed or expired certificates.
     *
     * @property {String} [tls.minVersion='TLSv1.2']
     *     Minimum accepted TLS version (e.g., `'TLSv1.2'`).
     *
     * @property {Number} [tls.minDHSize=1024]
     *     Minimum size (in bits) of the DH parameter for TLS connections.
     *
     * @property {Object|Boolean} [logger]
     *     Custom logger instance with `debug(obj)`, `info(obj)`, `warn(obj)`, and `error(obj)` methods.
     *     If `false`, logging is disabled. If not provided, ImapFlow logs to console in [pino format](https://getpino.io/).
     *
     * @property {Boolean} [logRaw=false]
     *     If `true`, logs all raw data (read and written) in base64 encoding. You can pipe such logs to [eerawlog](https://github.com/postalsys/eerawlog) command for readable output.
     *
     * @property {Boolean} [emitLogs=false]
     *     If `true`, emits `'log'` events with the same data passed to the logger.
     *
     * @property {Boolean} [verifyOnly=false]
     *     If `true`, disconnects after successful authentication without performing other actions.
     *
     * @property {String} [proxy]
     *     Proxy URL. Supports HTTP CONNECT (`http://`, `https://`) and SOCKS (`socks://`, `socks4://`, `socks5://`).
     *
     * @property {Boolean} [qresync=false]
     *     If `true`, enables QRESYNC support so that EXPUNGE notifications include `uid` instead of `seq`.
     *
     * @property {Number} [maxIdleTime]
     *     If set, breaks and restarts IDLE every `maxIdleTime` milliseconds.
     *
     * @property {String} [missingIdleCommand="NOOP"]
     *     Command to use if the server does not support IDLE.
     *
     * @property {Boolean} [disableBinary=false]
     *     If `true`, ignores the BINARY extension for FETCH and APPEND operations.
     *
     * @property {Boolean} [disableAutoEnable=false]
     *     If `true`, do not automatically enable supported IMAP extensions.
     *
     * @property {Number} [connectionTimeout=90000]
     *     Maximum time (in milliseconds) to wait for the connection to establish. Defaults to 90 seconds.
     *
     * @property {Number} [greetingTimeout=16000]
     *     Maximum time (in milliseconds) to wait for the server greeting after a connection is established. Defaults to 16 seconds.
     *
     * @property {Number} [socketTimeout=300000]
     *     Maximum period of inactivity (in milliseconds) before terminating the connection. Defaults to 5 minutes.
     */ constructor(options){
        super({
            captureRejections: true
        });
        this.options = options || {};
        /**
         * Instance ID for logs
         * @type {String}
         */ this.id = this.options.id || this.getRandomId();
        this.clientInfo = Object.assign({
            name: packageInfo.name,
            version: packageInfo.version,
            vendor: 'Postal Systems',
            'support-url': 'https://github.com/postalsys/imapflow/issues'
        }, this.options.clientInfo || {});
        // remove diacritics
        for (let key of Object.keys(this.clientInfo)){
            if (typeof this.clientInfo[key] === 'string') {
                this.clientInfo[key] = this.clientInfo[key].normalize('NFD').replace(/\p{Diacritic}/gu, '');
            }
        }
        /**
         * Server identification info. Available after successful `connect()`.
         * If server does not provide identification info then this value is `null`.
         * @example
         * await client.connect();
         * console.log(client.serverInfo.vendor);
         * @type {IdInfoObject|null}
         */ this.serverInfo = null; //updated by ID
        this.log = this.getLogger();
        /**
         * Is the connection currently encrypted or not
         * @type {Boolean}
         */ this.secureConnection = !!this.options.secure;
        this.port = Number(this.options.port) || (this.secureConnection ? 993 : 110);
        this.host = this.options.host || 'localhost';
        this.servername = this.options.servername ? this.options.servername : !net.isIP(this.host) ? this.host : false;
        if (typeof this.options.secure === 'undefined' && this.port === 993) {
            // if secure option is not set but port is 465, then default to secure
            this.secureConnection = true;
        }
        this.logRaw = this.options.logRaw;
        this.streamer = new ImapStream({
            logger: this.log,
            cid: this.id,
            logRaw: this.logRaw,
            secureConnection: this.secureConnection
        });
        this.reading = false;
        this.socket = false;
        this.writeSocket = false;
        this.isClosed = false;
        this.states = states;
        this.state = this.states.NOT_AUTHENTICATED;
        this.lockCounter = 0;
        this.currentLock = false;
        this.tagCounter = 0;
        this.requestTagMap = new Map();
        this.requestQueue = [];
        this.currentRequest = false;
        this.writeBytesCounter = 0;
        this.commandParts = [];
        /**
         * Active IMAP capabilities. Value is either `true` for togglabe capabilities (eg. `UIDPLUS`)
         * or a number for capabilities with a value (eg. `APPENDLIMIT`)
         * @type {Map<string, boolean|number>}
         */ this.capabilities = new Map();
        this.authCapabilities = new Map();
        this.rawCapabilities = null;
        this.expectCapabilityUpdate = false; // force CAPABILITY after LOGIN
        /**
         * Enabled capabilities. Usually `CONDSTORE` and `UTF8=ACCEPT` if server supports these.
         * @type {Set<string>}
         */ this.enabled = new Set();
        /**
         * Is the connection currently usable or not
         * @type {Boolean}
         */ this.usable = false;
        /**
         * Currently authenticated user or `false` if mailbox is not open
         * or `true` if connection was authenticated by PREAUTH
         * @type {String|Boolean}
         */ this.authenticated = false;
        /**
         * Currently selected mailbox or `false` if mailbox is not open
         * @type {MailboxObject|Boolean}
         */ this.mailbox = false;
        this.currentSelectCommand = false;
        /**
         * Is current mailbox idling (`true`) or not (`false`)
         * @type {Boolean}
         */ this.idling = false;
        this.emitLogs = !!this.options.emitLogs;
        // ordering number for emitted logs
        this.lo = 0;
        this.untaggedHandlers = {};
        this.sectionHandlers = {};
        this.commands = imapCommands;
        this.folders = new Map();
        this.currentLock = false;
        this.locks = [];
        this.idRequested = false;
        this.maxIdleTime = this.options.maxIdleTime || false;
        this.missingIdleCommand = (this.options.missingIdleCommand || '').toString().toUpperCase().trim() || 'NOOP';
        this.disableBinary = !!this.options.disableBinary;
        // Named error handler for proper cleanup
        this._streamerErrorHandler = (err)=>{
            if ([
                'Z_BUF_ERROR',
                'ECONNRESET',
                'EPIPE',
                'ETIMEDOUT',
                'EHOSTUNREACH'
            ].includes(err.code)) {
                // just close the connection, usually nothing but noise
                this.closeAfter();
                return;
            }
            this.log.error({
                err,
                cid: this.id
            });
            this.emitError(err);
        };
        this.streamer.on('error', this._streamerErrorHandler);
        // Has the `connect` method already been called
        this._connectCalled = false;
    }
    emitError(err) {
        if (!err) {
            return;
        }
        err._connId = err._connId || this.id;
        this.closeAfter();
        this.emit('error', err);
    }
    getRandomId() {
        let rid = BigInt('0x' + crypto.randomBytes(13).toString('hex')).toString(36);
        if (rid.length < 20) {
            rid = '0'.repeat(20 - rid.length) + rid;
        } else if (rid.length > 20) {
            rid = rid.substr(0, 20);
        }
        return rid;
    }
    write(chunk) {
        if (!this.socket || this.socket.destroyed) {
            // do not write after connection end or logout
            const error = new Error('Socket is already closed');
            error.code = 'NoConnection';
            throw error;
        }
        if (this.state === this.states.LOGOUT) {
            // should not happen
            const error = new Error('Can not send data after logged out');
            error.code = 'StateLogout';
            throw error;
        }
        if (this.writeSocket.destroyed) {
            this.log.error({
                msg: 'Write socket destroyed',
                cid: this.id
            });
            this.close();
            return;
        }
        let addLineBreak = !this.commandParts.length;
        if (typeof chunk === 'string') {
            if (addLineBreak) {
                chunk += '\r\n';
            }
            chunk = Buffer.from(chunk, 'binary');
        } else if (Buffer.isBuffer(chunk)) {
            if (addLineBreak) {
                chunk = Buffer.concat([
                    chunk,
                    Buffer.from('\r\n')
                ]);
            }
        } else {
            return false;
        }
        if (this.logRaw) {
            this.log.trace({
                src: 'c',
                msg: 'write to socket',
                data: chunk.toString('base64'),
                compress: !!this._deflate,
                secure: !!this.secureConnection,
                cid: this.id
            });
        }
        this.writeBytesCounter += chunk.length;
        this.writeSocket.write(chunk);
    }
    stats(reset) {
        let result = {
            sent: this.writeBytesCounter || 0,
            received: this.streamer && this.streamer.readBytesCounter || 0
        };
        if (reset) {
            this.writeBytesCounter = 0;
            if (this.streamer) {
                this.streamer.readBytesCounter = 0;
            }
        }
        return result;
    }
    async send(data) {
        if (this.state === this.states.LOGOUT) {
            // already logged out
            if (data.tag) {
                let request = this.requestTagMap.get(data.tag);
                if (request) {
                    this.requestTagMap.delete(request.tag);
                    const error = new Error('Connection not available');
                    error.code = 'NoConnection';
                    request.reject(error);
                }
            }
            return;
        }
        let compiled = await compiler(data, {
            asArray: true,
            literalMinus: this.capabilities.has('LITERAL-') || this.capabilities.has('LITERAL+')
        });
        this.commandParts = compiled;
        let logCompiled = await compiler(data, {
            isLogging: true
        });
        let options = data.options || {};
        this.log.debug({
            src: 'c',
            msg: logCompiled.toString(),
            cid: this.id,
            comment: options.comment
        });
        this.write(this.commandParts.shift());
        if (typeof options.onSend === 'function') {
            options.onSend();
        }
    }
    async trySend() {
        if (this.currentRequest || !this.requestQueue.length) {
            return;
        }
        this.currentRequest = this.requestQueue.shift();
        await this.send({
            tag: this.currentRequest.tag,
            command: this.currentRequest.command,
            attributes: this.currentRequest.attributes,
            options: this.currentRequest.options
        });
    }
    async exec(command, attributes, options) {
        if (this.state === this.states.LOGOUT || this.isClosed) {
            const error = new Error('Connection not available');
            error.code = 'NoConnection';
            throw error;
        }
        if (!this.socket || this.socket.destroyed) {
            let error = new Error('Connection closed');
            error.code = 'EConnectionClosed';
            throw error;
        }
        let tag = (++this.tagCounter).toString(16).toUpperCase();
        options = options || {};
        return new Promise((resolve, reject)=>{
            this.requestTagMap.set(tag, {
                command,
                attributes,
                options,
                resolve,
                reject
            });
            this.requestQueue.push({
                tag,
                command,
                attributes,
                options
            });
            this.trySend().catch((err)=>{
                this.requestTagMap.delete(tag);
                reject(err);
            });
        });
    }
    getUntaggedHandler(command, attributes) {
        if (/^[0-9]+$/.test(command)) {
            let type = attributes && attributes.length && typeof attributes[0].value === 'string' ? attributes[0].value.toUpperCase() : false;
            if (type) {
                // EXISTS, EXPUNGE, RECENT, FETCH etc
                command = type;
            }
        }
        command = command.toUpperCase().trim();
        if (this.currentRequest && this.currentRequest.options && this.currentRequest.options.untagged && this.currentRequest.options.untagged[command]) {
            return this.currentRequest.options.untagged[command];
        }
        if (this.untaggedHandlers[command]) {
            return this.untaggedHandlers[command];
        }
    }
    getSectionHandler(key) {
        if (this.sectionHandlers[key]) {
            return this.sectionHandlers[key];
        }
    }
    async reader() {
        let data;
        let processedCount = 0;
        while((data = this.streamer.read()) !== null){
            let parsed;
            try {
                parsed = await parser(data.payload, {
                    literals: data.literals
                });
                if (parsed.tag && ![
                    '*',
                    '+'
                ].includes(parsed.tag) && parsed.command) {
                    let payload = {
                        response: parsed.command
                    };
                    if (parsed.attributes && parsed.attributes[0] && parsed.attributes[0].section && parsed.attributes[0].section[0] && parsed.attributes[0].section[0].type === 'ATOM') {
                        payload.code = parsed.attributes[0].section[0].value;
                    }
                    this.emit('response', payload);
                }
            } catch (err) {
                // can not make sense of this
                this.log.error({
                    src: 's',
                    msg: data.payload.toString(),
                    err,
                    cid: this.id
                });
                data.next();
                continue;
            }
            let logCompiled = await compiler(parsed, {
                isLogging: true
            });
            if (/^\d+$/.test(parsed.command) && parsed.attributes && parsed.attributes[0] && parsed.attributes[0].value === 'FETCH') {
                // too many FETCH responses, might want to filter these out
                this.log.trace({
                    src: 's',
                    msg: logCompiled.toString(),
                    cid: this.id,
                    nullBytesRemoved: parsed.nullBytesRemoved
                });
            } else {
                this.log.debug({
                    src: 's',
                    msg: logCompiled.toString(),
                    cid: this.id,
                    nullBytesRemoved: parsed.nullBytesRemoved
                });
            }
            if (parsed.tag === '+' && this.currentRequest && this.currentRequest.options && typeof this.currentRequest.options.onPlusTag === 'function') {
                await this.currentRequest.options.onPlusTag(parsed);
                data.next();
                continue;
            }
            if (parsed.tag === '+' && this.commandParts.length) {
                let content = this.commandParts.shift();
                this.write(content);
                this.log.debug({
                    src: 'c',
                    msg: `(* ${content.length}B continuation *)`,
                    cid: this.id
                });
                data.next();
                continue;
            }
            let section = parsed.attributes && parsed.attributes.length && parsed.attributes[0] && !parsed.attributes[0].value && parsed.attributes[0].section;
            if (section && section.length && section[0].type === 'ATOM' && typeof section[0].value === 'string') {
                let sectionHandler = this.getSectionHandler(section[0].value.toUpperCase().trim());
                if (sectionHandler) {
                    await sectionHandler(section.slice(1));
                }
            }
            if (parsed.tag === '*' && parsed.command) {
                let untaggedHandler = this.getUntaggedHandler(parsed.command, parsed.attributes);
                if (untaggedHandler) {
                    try {
                        await untaggedHandler(parsed);
                    } catch (err) {
                        this.log.warn({
                            err,
                            cid: this.id
                        });
                        data.next();
                        continue;
                    }
                }
            }
            if (this.requestTagMap.has(parsed.tag)) {
                let request = this.requestTagMap.get(parsed.tag);
                this.requestTagMap.delete(parsed.tag);
                if (this.currentRequest && this.currentRequest.tag === parsed.tag) {
                    // send next pending command
                    this.currentRequest = false;
                    await this.trySend();
                }
                switch(parsed.command.toUpperCase()){
                    case 'OK':
                    case 'BYE':
                        await new Promise((resolve)=>request.resolve({
                                response: parsed,
                                next: resolve
                            }));
                        break;
                    case 'NO':
                    case 'BAD':
                        {
                            let txt = parsed.attributes && parsed.attributes.filter((val)=>val.type === 'TEXT').map((val)=>val.value.trim()).join(' ');
                            let err = new Error('Command failed');
                            err.response = parsed;
                            err.responseStatus = parsed.command.toUpperCase();
                            try {
                                err.executedCommand = parsed.tag + (await compiler(request, {
                                    isLogging: true
                                })).toString();
                            } catch  {
                            // ignore
                            }
                            if (txt) {
                                err.responseText = txt;
                                if (err.responseStatus === 'NO' && txt.includes('Some of the requested messages no longer exist')) {
                                    // Treat as successful response
                                    this.log.warn({
                                        msg: 'Partial FETCH response',
                                        cid: this.id,
                                        err
                                    });
                                    await new Promise((resolve)=>request.resolve({
                                            response: parsed,
                                            next: resolve
                                        }));
                                    break;
                                }
                                let throttleDelay = false;
                                // MS365 throttling
                                // tag BAD Request is throttled. Suggested Backoff Time: 92415 milliseconds
                                if (/Request is throttled/i.test(txt) && /Backoff Time/i.test(txt)) {
                                    let throttlingMatch = txt.match(/Backoff Time[:=\s]+(\d+)/i);
                                    if (throttlingMatch && throttlingMatch[1] && !isNaN(throttlingMatch[1])) {
                                        throttleDelay = Number(throttlingMatch[1]);
                                    }
                                }
                                // Wait and return a throttling error
                                if (throttleDelay) {
                                    err.code = 'ETHROTTLE';
                                    err.throttleReset = throttleDelay;
                                    let delayResponse = throttleDelay;
                                    if (delayResponse > 5 * 60 * 1000) {
                                        // max delay cap
                                        delayResponse = 5 * 60 * 1000;
                                    }
                                    this.log.warn({
                                        msg: 'Throttling detected',
                                        cid: this.id,
                                        throttleDelay,
                                        delayResponse,
                                        err
                                    });
                                    await new Promise((r)=>setTimeout(r, delayResponse));
                                }
                            }
                            request.reject(err);
                            break;
                        }
                    default:
                        {
                            let err = new Error('Invalid server response');
                            err.code = 'InvalidResponse';
                            err.response = parsed;
                            request.reject(err);
                            break;
                        }
                }
            }
            data.next();
            // Yield to event loop every 10 processed messages to prevent CPU blocking
            processedCount++;
            if (processedCount % 10 === 0) {
                await new Promise((resolve)=>setImmediate(resolve));
            }
        }
    }
    setEventHandlers() {
        this.socketReadable = ()=>{
            if (!this.reading) {
                this.reading = true;
                this.reader().catch((err)=>this.log.error({
                        err,
                        cid: this.id
                    })).finally(()=>{
                    this.reading = false;
                });
            }
        };
        this.streamer.on('readable', this.socketReadable);
    }
    setSocketHandlers() {
        // Clear any existing handlers first to prevent duplicates
        this.clearSocketHandlers();
        // Remove temporary connection error handler if present
        if (this._connectErrorHandler && this.socket) {
            this.socket.removeListener('error', this._connectErrorHandler);
            this._connectErrorHandler = null;
        }
        this._socketError = this._socketError || ((err)=>{
            this.log.error({
                err,
                cid: this.id
            });
            this.emitError(err);
        });
        this._socketClose = this._socketClose || (()=>this.close());
        this._socketEnd = this._socketEnd || (()=>this.close());
        /**
         * Socket timeout event handler.
         *
         * When a socket timeout occurs during IDLE, the handler attempts to recover the connection
         * by sending a NOOP command and then returning to IDLE state.
         *
         * @fires ImapFlow#error Emits error event unless the current command is IDLE
         */ this._socketTimeout = this._socketTimeout || (()=>{
            const err = new Error('Socket timeout');
            err.code = 'ETIMEOUT';
            if (this.idling) {
                if (!this.usable || !this.socket || this.socket.destroyed) {
                    this.emitError(err);
                    return;
                }
                // Attempt to recover IDLE connections
                this.run('NOOP').then(()=>this.idle()).catch(this._socketError); // Natural circuit breaker
            } else {
                // Close immediately for non-IDLE operations
                this.log.debug({
                    msg: 'Socket timeout',
                    cid: this.id
                });
                this.emitError(err);
            }
        });
        this.socket.once('error', this._socketError);
        this.socket.once('close', this._socketClose);
        this.socket.once('end', this._socketEnd);
        this.socket.on('tlsClientError', this._socketError);
        this.socket.on('timeout', this._socketTimeout);
        if (this.writeSocket && this.writeSocket !== this.socket) {
            this.writeSocket.on('error', this._socketError);
        }
    }
    clearSocketHandlers() {
        if (!this.socket) {
            return;
        }
        // Remove temporary connection error handler if still present
        if (this._connectErrorHandler) {
            this.socket.removeListener('error', this._connectErrorHandler);
            this._connectErrorHandler = null;
        }
        if (this._socketError) {
            this.socket.removeListener('error', this._socketError);
            this.socket.removeListener('tlsClientError', this._socketError);
            if (this.writeSocket && this.writeSocket !== this.socket) {
                this.writeSocket.removeListener('error', this._socketError);
            }
        }
        if (this._socketTimeout) {
            this.socket.removeListener('timeout', this._socketTimeout);
        }
        if (this._socketClose) {
            this.socket.removeListener('close', this._socketClose);
        }
        if (this._socketEnd) {
            this.socket.removeListener('end', this._socketEnd);
        }
    }
    async startSession() {
        await this.run('CAPABILITY');
        if (this.capabilities.has('ID')) {
            this.idRequested = await this.run('ID', this.clientInfo);
        }
        await this.upgradeToSTARTTLS();
        await this.authenticate();
        if ((!this.idRequested || Object.keys(this.idRequested).length < 2) && this.capabilities.has('ID')) {
            // re-request ID after LOGIN
            this.idRequested = await this.run('ID', this.clientInfo);
        }
        // Make sure we have namespace set. This should also throw if Exchange actually failed authentication
        let nsResponse = await this.run('NAMESPACE');
        if (nsResponse && nsResponse.error && nsResponse.status === 'BAD' && /User is authenticated but not connected/i.test(nsResponse.text)) {
            // Not a NAMESPACE failure but authentication failure, so report as
            this.authenticated = false;
            let err = new AuthenticationFailure('Authentication failed');
            err.response = nsResponse.text;
            throw err;
        }
        if (this.options.verifyOnly) {
            // List all folders and logout
            if (this.options.includeMailboxes) {
                this._mailboxList = await this.list();
            }
            return await this.logout();
        }
        // try to use compression (if supported)
        if (!this.options.disableCompression) {
            await this.compress();
        }
        if (!this.options.disableAutoEnable) {
            // enable extensions if possible
            await this.run('ENABLE', [
                'CONDSTORE',
                'UTF8=ACCEPT'
            ].concat(this.options.qresync ? 'QRESYNC' : []));
        }
        this.usable = true;
    }
    async compress() {
        if (!await this.run('COMPRESS')) {
            return; // was not able to negotiate compression
        }
        // create deflate/inflate streams with rate limiting options
        this._deflate = zlib.createDeflateRaw({
            windowBits: 15,
            level: zlib.constants.Z_DEFAULT_COMPRESSION,
            memLevel: 8,
            strategy: zlib.constants.Z_DEFAULT_STRATEGY,
            chunkSize: 16 * 1024 // Process in 16KB chunks to prevent CPU blocking
        });
        this._inflate = zlib.createInflateRaw({
            chunkSize: 16 * 1024 // Process in 16KB chunks to prevent CPU blocking
        });
        // route incoming socket via inflate stream
        this.socket.unpipe(this.streamer);
        this.streamer.compress = true;
        this.socket.pipe(this._inflate).pipe(this.streamer);
        this._inflate.on('error', (err)=>{
            this.streamer.emit('error', err);
        });
        // route outgoing socket via deflate stream with rate limiting
        this.writeSocket = new PassThrough({
            highWaterMark: 64 * 1024 // 64KB buffer limit to prevent excessive memory usage
        });
        this.writeSocket.destroySoon = ()=>{
            try {
                if (this.socket) {
                    this.socket.destroy();
                }
                this.writeSocket.end();
            } catch (err) {
                this.log.error({
                    err,
                    info: 'Failed to destroy PassThrough socket',
                    cid: this.id
                });
                throw err;
            }
        };
        Object.defineProperty(this.writeSocket, 'destroyed', {
            get: ()=>!this.socket || this.socket.destroyed
        });
        // we need to force flush deflated data to socket so we can't
        // use normal pipes for this.writeSocket -> this._deflate -> this.socket
        let reading = false;
        let processedChunks = 0;
        let readNext = async ()=>{
            try {
                reading = true;
                processedChunks = 0;
                let chunk;
                while((chunk = this.writeSocket.read()) !== null){
                    if (this._deflate && this._deflate.write(chunk) === false) {
                        return this._deflate.once('drain', readNext);
                    }
                    // Yield to event loop every 100 chunks to prevent CPU blocking
                    processedChunks++;
                    if (processedChunks % 100 === 0) {
                        await new Promise((resolve)=>setImmediate(resolve));
                    }
                }
                // flush data to socket
                if (this._deflate) {
                    this._deflate.flush();
                }
                reading = false;
            } catch (ex) {
                this.emitError(ex);
            }
        };
        this.writeSocket.on('readable', ()=>{
            if (!reading) {
                readNext();
            }
        });
        this.writeSocket.on('error', (err)=>{
            this.socket.emit('error', err);
        });
        this._deflate.pipe(this.socket);
        this._deflate.on('error', (err)=>{
            this.socket.emit('error', err);
        });
    }
    _failSTARTTLS() {
        if (this.options.doSTARTTLS === true) {
            // STARTTLS configured as requirement
            let err = new Error('Server does not support STARTTLS');
            err.tlsFailed = true;
            throw err;
        } else {
            // Opportunistic STARTTLS. But it's not possible right now.
            // Attention: Could be a downgrade attack.
            return false;
        }
    }
    /**
     * Tries to upgrade the connection to TLS using STARTTLS.
     * @throws if STARTTLS is required, but not possible.
     * @returns {boolean} true, if the connection is now protected by TLS, either direct TLS or STARTTLS.
     */ async upgradeToSTARTTLS() {
        if (this.options.doSTARTTLS === true && this.options.secure === true) {
            throw new Error('Misconfiguration: Cannot set both secure=true for TLS and doSTARTTLS=true for STARTTLS.');
        }
        if (this.secureConnection) {
            // Already using direct TLS. No need for STARTTLS.
            return true;
        }
        if (this.options.doSTARTTLS === false) {
            // STARTTLS explictly disabled by config
            return false;
        }
        if (!this.capabilities.has('STARTTLS')) {
            return this._failSTARTTLS();
        }
        this.expectCapabilityUpdate = true;
        let canUpgrade = await this.run('STARTTLS');
        if (!canUpgrade) {
            return this._failSTARTTLS();
        }
        this.socket.unpipe(this.streamer);
        let upgraded = await new Promise((resolve, reject)=>{
            let socketPlain = this.socket;
            let opts = Object.assign({
                socket: this.socket,
                servername: this.servername,
                port: this.port
            }, this.options.tls || {});
            this.clearSocketHandlers();
            // Store error handler for cleanup after successful upgrade
            const socketPlainErrorHandler = (err)=>{
                clearTimeout(this.connectTimeout);
                clearTimeout(this.upgradeTimeout);
                if (!this.upgrading) {
                    // don't care anymore
                    return;
                }
                this.closeAfter();
                this.upgrading = false;
                err.tlsFailed = true;
                reject(err);
            };
            socketPlain.once('error', socketPlainErrorHandler);
            this.upgradeTimeout = setTimeout(()=>{
                if (!this.upgrading) {
                    return;
                }
                this.closeAfter();
                let err = new Error('Failed to upgrade connection in required time');
                err.tlsFailed = true;
                err.code = 'UPGRADE_TIMEOUT';
                reject(err);
            }, UPGRADE_TIMEOUT);
            this.upgrading = true;
            this.socket = tls.connect(opts, ()=>{
                try {
                    clearTimeout(this.upgradeTimeout);
                    if (this.isClosed) {
                        // not sure if this is possible?
                        return this.close();
                    }
                    this.secureConnection = true;
                    this.upgrading = false;
                    this.streamer.secureConnection = true;
                    this.socket.pipe(this.streamer);
                    this.tls = typeof this.socket.getCipher === 'function' ? this.socket.getCipher() : false;
                    if (this.tls) {
                        this.tls.authorized = this.socket.authorized;
                        this.log.info({
                            src: 'tls',
                            msg: 'Established TLS session',
                            cid: this.id,
                            authorized: this.tls.authorized,
                            algo: this.tls.standardName || this.tls.name,
                            version: this.tls.version
                        });
                    }
                    // Clean up the plain socket error handler after successful upgrade
                    socketPlain.removeListener('error', socketPlainErrorHandler);
                    return resolve(true);
                } catch (ex) {
                    this.emitError(ex);
                }
            });
            this.writeSocket = this.socket;
            this.setSocketHandlers();
        });
        if (upgraded && this.expectCapabilityUpdate) {
            await this.run('CAPABILITY');
        }
        return upgraded;
    }
    async setAuthenticationState() {
        this.state = this.states.AUTHENTICATED;
        this.authenticated = true;
        if (this.expectCapabilityUpdate) {
            // update capabilities
            await this.run('CAPABILITY');
        }
    }
    async authenticate() {
        if (this.state === this.states.LOGOUT) {
            throw new AuthenticationFailure('Already logged out');
        }
        if (this.state !== this.states.NOT_AUTHENTICATED) {
            // nothing to do here, usually happens with PREAUTH greeting
            return true;
        }
        if (!this.options.auth) {
            throw new AuthenticationFailure('Please configure the login');
        }
        this.expectCapabilityUpdate = true;
        let loginMethod = (this.options.auth.loginMethod || '').toString().trim().toUpperCase();
        if (!loginMethod && /\\|\//.test(this.options.auth.user)) {
            // Special override for MS Exchange when authenticating as some other user or non-email account
            loginMethod = 'LOGIN';
        }
        if (this.options.auth.accessToken) {
            this.authenticated = await this.run('AUTHENTICATE', this.options.auth.user, {
                accessToken: this.options.auth.accessToken
            });
        } else if (this.options.auth.pass) {
            if ((this.capabilities.has('AUTH=LOGIN') || this.capabilities.has('AUTH=PLAIN')) && loginMethod !== 'LOGIN') {
                this.authenticated = await this.run('AUTHENTICATE', this.options.auth.user, {
                    password: this.options.auth.pass,
                    loginMethod,
                    authzid: this.options.auth.authzid
                });
            } else {
                if (this.capabilities.has('LOGINDISABLED')) {
                    throw new AuthenticationFailure('Login is disabled');
                }
                this.authenticated = await this.run('LOGIN', this.options.auth.user, this.options.auth.pass);
            }
        } else {
            throw new AuthenticationFailure('No password configured');
        }
        if (this.authenticated) {
            this.log.info({
                src: 'auth',
                msg: 'User authenticated',
                cid: this.id,
                user: this.options.auth.user
            });
            await this.setAuthenticationState();
            return true;
        }
        throw new AuthenticationFailure('No matching authentication method');
    }
    beginSession(onUnhandledError) {
        clearTimeout(this.greetingTimeout);
        this.untaggedHandlers.OK = null;
        this.untaggedHandlers.PREAUTH = null;
        if (this.isClosed) {
            return;
        }
        // get out of current parsing "thread", so do not await for startSession
        this.startSession().then(()=>{
            if (typeof this.initialResolve === 'function') {
                let resolve = this.initialResolve;
                this.initialResolve = false;
                this.initialReject = false;
                return resolve();
            }
        }).catch((err)=>{
            this.log.error({
                err,
                cid: this.id
            });
            if (typeof this.initialReject === 'function') {
                clearTimeout(this.greetingTimeout);
                let reject = this.initialReject;
                this.initialResolve = false;
                this.initialReject = false;
                return reject(err);
            }
            onUnhandledError(err);
        });
    }
    async initialOK(message) {
        this.greeting = (message.attributes || []).filter((entry)=>entry.type === 'TEXT').map((entry)=>entry.value).filter((entry)=>entry).join('');
        // ALWAYS emit the error so users can handle it
        this.beginSession((err)=>this.emitError(err));
    }
    async initialPREAUTH() {
        if (this.isClosed) {
            return;
        }
        this.state = this.states.AUTHENTICATED;
        this.beginSession((err)=>{
            this.log.error({
                err,
                cid: this.id
            });
            this.closeAfter();
        });
    }
    async serverBye(parsed) {
        // Extract BYE reason from response for better error messages
        let reason = parsed && parsed.attributes && parsed.attributes.filter((val)=>val.type === 'TEXT').map((val)=>val.value.trim()).join(' ');
        this.byeReason = reason || 'Server closed connection';
        this.untaggedHandlers.BYE = null;
        this.state = this.states.LOGOUT;
    }
    updateCapabilitiesFromRaw(rawCapabilities) {
        this.rawCapabilities = rawCapabilities;
        this.capabilities = updateCapabilities(rawCapabilities);
        if (this.capabilities) {
            for (let [capa] of this.capabilities){
                if (/^AUTH=/i.test(capa) && !this.authCapabilities.has(capa.toUpperCase())) {
                    this.authCapabilities.set(capa.toUpperCase(), false);
                }
            }
        }
        if (this.expectCapabilityUpdate) {
            this.expectCapabilityUpdate = false;
        }
    }
    async sectionCapability(section) {
        this.updateCapabilitiesFromRaw(section);
    }
    async untaggedCapability(untagged) {
        this.updateCapabilitiesFromRaw(untagged.attributes);
    }
    async untaggedExists(untagged) {
        if (!this.mailbox) {
            // mailbox closed, ignore
            return;
        }
        if (!untagged || !untagged.command || isNaN(untagged.command)) {
            return;
        }
        let count = Number(untagged.command);
        if (count === this.mailbox.exists) {
            // nothing changed?
            return;
        }
        // keep exists up to date
        let prevCount = this.mailbox.exists;
        this.mailbox.exists = count;
        this.emit('exists', {
            path: this.mailbox.path,
            count,
            prevCount
        });
    }
    async untaggedExpunge(untagged) {
        if (!this.mailbox) {
            // mailbox closed, ignore
            return;
        }
        if (!untagged || !untagged.command || isNaN(untagged.command)) {
            return;
        }
        let seq = Number(untagged.command);
        if (seq && seq <= this.mailbox.exists) {
            this.mailbox.exists--;
            let payload = {
                path: this.mailbox.path,
                seq,
                vanished: false
            };
            if (typeof this.options.expungeHandler === 'function') {
                try {
                    await this.options.expungeHandler(payload);
                } catch (err) {
                    this.log.error({
                        msg: 'Failed to notify expunge event',
                        payload,
                        error: err,
                        cid: this.id
                    });
                }
            } else {
                this.emit('expunge', payload);
            }
        }
    }
    async untaggedVanished(untagged, mailbox) {
        mailbox = mailbox || this.mailbox;
        if (!mailbox) {
            // mailbox closed, ignore
            return;
        }
        let tags = [];
        let uids = false;
        if (untagged.attributes.length > 1 && Array.isArray(untagged.attributes[0])) {
            tags = untagged.attributes[0].map((entry)=>typeof entry.value === 'string' ? entry.value.toUpperCase() : false).filter((value)=>value);
            untagged.attributes.shift();
        }
        if (untagged.attributes[0] && typeof untagged.attributes[0].value === 'string') {
            uids = untagged.attributes[0].value;
        }
        let uidList = expandRange(uids);
        for (let uid of uidList){
            let payload = {
                path: mailbox.path,
                uid,
                vanished: true,
                earlier: tags.includes('EARLIER')
            };
            if (typeof this.options.expungeHandler === 'function') {
                try {
                    await this.options.expungeHandler(payload);
                } catch (err) {
                    this.log.error({
                        msg: 'Failed to notify expunge event',
                        payload,
                        error: err,
                        cid: this.id
                    });
                }
            } else {
                this.emit('expunge', payload);
            }
        }
    }
    async untaggedFetch(untagged, mailbox) {
        mailbox = mailbox || this.mailbox;
        if (!mailbox) {
            // mailbox closed, ignore
            return;
        }
        let message = await formatMessageResponse(untagged, mailbox);
        if (message.flags) {
            let updateEvent = {
                path: mailbox.path,
                seq: message.seq
            };
            if (message.uid) {
                updateEvent.uid = message.uid;
            }
            if (message.modseq) {
                updateEvent.modseq = message.modseq;
            }
            updateEvent.flags = message.flags;
            if (message.flagColor) {
                updateEvent.flagColor = message.flagColor;
            }
            this.emit('flags', updateEvent);
        }
    }
    async ensureSelectedMailbox(path) {
        if (!path) {
            return false;
        }
        if (!this.mailbox && path || this.mailbox && path && !comparePaths(this, this.mailbox.path, path)) {
            return await this.mailboxOpen(path);
        }
        return true;
    }
    async resolveRange(range, options) {
        if (typeof range === 'number' || typeof range === 'bigint') {
            range = range.toString();
        }
        // special case, some servers allow this, some do not, so replace it with the last known EXISTS value
        if (range === '*') {
            if (!this.mailbox.exists) {
                return false;
            }
            range = this.mailbox.exists.toString();
            options.uid = false; // sequence query
        }
        if (range && typeof range === 'object' && !Array.isArray(range)) {
            if (range.all && Object.keys(range).length === 1) {
                range = '1:*';
            } else if (range.uid && Object.keys(range).length === 1) {
                range = range.uid;
                options.uid = true;
            } else {
                // resolve range by searching
                options.uid = true; // force UIDs instead of sequence numbers
                range = await this.run('SEARCH', range, options);
                if (range && range.length) {
                    range = packMessageRange(range);
                }
            }
        }
        if (Array.isArray(range)) {
            range = range.join(',');
        }
        if (!range) {
            return false;
        }
        return range;
    }
    autoidle() {
        clearTimeout(this.idleStartTimer);
        if (this.options.disableAutoIdle || this.state !== this.states.SELECTED) {
            return;
        }
        this.idleStartTimer = setTimeout(()=>{
            this.idle().catch((err)=>this.log.warn({
                    err,
                    cid: this.id
                }));
        }, 15 * 1000);
    }
    // PUBLIC API METHODS
    /**
     * Initiates a connection against IMAP server. Throws if anything goes wrong. This is something you have to call before you can run any IMAP commands
     *
     * @returns {Promise<void>}
     * @throws Will throw an error if connection or authentication fails
     * @example
     * let client = new ImapFlow({...});
     * await client.connect();
     */ async connect() {
        if (this._connectCalled) {
            // Prevent re-using ImapFlow instances by allowing to call connect just once.
            throw new Error('Can not re-use ImapFlow instance');
        }
        this._connectCalled = true;
        let connector = this.secureConnection ? tls : net;
        let opts = Object.assign({
            host: this.host,
            servername: this.servername,
            port: this.port
        }, this.options.tls || {});
        this.untaggedHandlers.OK = (...args)=>this.initialOK(...args);
        this.untaggedHandlers.BYE = (...args)=>this.serverBye(...args);
        this.untaggedHandlers.PREAUTH = (...args)=>this.initialPREAUTH(...args);
        this.untaggedHandlers.CAPABILITY = (...args)=>this.untaggedCapability(...args);
        this.sectionHandlers.CAPABILITY = (...args)=>this.sectionCapability(...args);
        this.untaggedHandlers.EXISTS = (...args)=>this.untaggedExists(...args);
        this.untaggedHandlers.EXPUNGE = (...args)=>this.untaggedExpunge(...args);
        // these methods take an optional second argument, so make sure that some random IMAP tag is not used as the second argument
        this.untaggedHandlers.FETCH = (untagged)=>this.untaggedFetch(untagged);
        this.untaggedHandlers.VANISHED = (untagged)=>this.untaggedVanished(untagged);
        let socket = false;
        if (this.options.proxy) {
            try {
                socket = await proxyConnection(this.log, this.options.proxy, this.host, this.port);
                if (!socket) {
                    throw new Error('Failed to setup proxy connection');
                }
            } catch (err) {
                let error = new Error('Failed to setup proxy connection');
                error.code = err.code || 'ProxyError';
                error._err = err;
                this.log.error({
                    error,
                    cid: this.id
                });
                throw error;
            }
        }
        await new Promise((resolve, reject)=>{
            this.connectTimeout = setTimeout(()=>{
                let err = new Error('Failed to establish connection in required time');
                err.code = 'CONNECT_TIMEOUT';
                err.details = {
                    connectionTimeout: this.options.connectionTimeout || CONNECT_TIMEOUT
                };
                this.log.error({
                    err,
                    cid: this.id
                });
                this.closeAfter();
                reject(err);
            }, this.options.connectionTimeout || CONNECT_TIMEOUT);
            let onConnect = ()=>{
                try {
                    clearTimeout(this.connectTimeout);
                    this.socket.setKeepAlive(true, 5 * 1000);
                    this.socket.setTimeout(this.options.socketTimeout || SOCKET_TIMEOUT);
                    this.greetingTimeout = setTimeout(()=>{
                        let err = new Error(`Failed to receive greeting from server in required time${!this.secureConnection ? '. Maybe should use TLS?' : ''}`);
                        err.code = 'GREETING_TIMEOUT';
                        err.details = {
                            greetingTimeout: this.options.greetingTimeout || GREETING_TIMEOUT
                        };
                        this.log.error({
                            err,
                            cid: this.id
                        });
                        this.closeAfter();
                        reject(err);
                    }, this.options.greetingTimeout || GREETING_TIMEOUT);
                    this.tls = typeof this.socket.getCipher === 'function' ? this.socket.getCipher() : false;
                    let logInfo = {
                        src: 'connection',
                        msg: `Established ${this.tls ? 'secure ' : ''}TCP connection`,
                        cid: this.id,
                        secure: !!this.tls,
                        host: this.host,
                        servername: this.servername,
                        port: this.socket.remotePort,
                        address: this.socket.remoteAddress,
                        localAddress: this.socket.localAddress,
                        localPort: this.socket.localPort
                    };
                    if (this.tls) {
                        logInfo.authorized = this.tls.authorized = this.socket.authorized;
                        logInfo.algo = this.tls.standardName || this.tls.name;
                        logInfo.version = this.tls.version;
                    }
                    this.log.info(logInfo);
                    this.setSocketHandlers();
                    this.setEventHandlers();
                    this.socket.pipe(this.streamer);
                    // executed by initial "* OK"
                    this.initialResolve = resolve;
                    this.initialReject = reject;
                } catch (ex) {
                    // connect failed
                    reject(ex);
                }
            };
            if (socket) {
                // socket is already established via proxy
                if (this.secureConnection) {
                    // TLS socket requires a handshake
                    opts.socket = socket;
                    this.socket = connector.connect(opts, onConnect);
                } else {
                    // cleartext socket is already usable
                    this.socket = socket;
                    setImmediate(onConnect);
                }
            } else {
                this.socket = connector.connect(opts, onConnect);
            }
            this.writeSocket = this.socket;
            // Store connection error handler for cleanup
            this._connectErrorHandler = (err)=>{
                clearTimeout(this.connectTimeout);
                clearTimeout(this.greetingTimeout);
                this.closeAfter();
                this.log.error({
                    err,
                    cid: this.id
                });
                reject(err);
            };
            this.socket.on('error', this._connectErrorHandler);
        });
    }
    /**
     * Graceful connection close by sending logout command to server. TCP connection is closed once command is finished.
     *
     * @return {Promise<void>}
     * @example
     * let client = new ImapFlow({...});
     * await client.connect();
     * ...
     * await client.logout();
     */ async logout() {
        return await this.run('LOGOUT');
    }
    /**
     * Close the TCP connection.
     * Unlike `close()`, return immediately from this function, allowing the
     * caller function to proceed, and run `close()` function afterwards.
     */ closeAfter() {
        setImmediate(()=>this.close());
    }
    /**
     * Closes TCP connection without notifying the server.
     *
     * @example
     * let client = new ImapFlow({...});
     * await client.connect();
     * ...
     * client.close();
     */ close() {
        try {
            // clear pending timers
            clearTimeout(this.idleStartTimer);
            clearTimeout(this.upgradeTimeout);
            clearTimeout(this.connectTimeout);
            clearTimeout(this.greetingTimeout);
            this.usable = false;
            this.idling = false;
            if (typeof this.initialReject === 'function' && !this.options.verifyOnly) {
                clearTimeout(this.greetingTimeout);
                let reject = this.initialReject;
                this.initialResolve = false;
                this.initialReject = false;
                let err = new Error('Unexpected close');
                err.code = `ClosedAfterConnect${this.secureConnection ? 'TLS' : 'Text'}`;
                // still has to go through the logic below
                setImmediate(()=>reject(err));
            }
            if (typeof this.preCheck === 'function') {
                this.preCheck().catch((err)=>this.log.warn({
                        err,
                        cid: this.id
                    }));
            }
            // Collect all pending requests to reject
            let pendingRequests = [];
            // reject command that is currently processed
            if (this.currentRequest && this.requestTagMap.has(this.currentRequest.tag)) {
                let request = this.requestTagMap.get(this.currentRequest.tag);
                if (request) {
                    this.requestTagMap.delete(request.tag);
                    pendingRequests.push(request);
                }
                this.currentRequest = false;
            }
            // reject all other pending commands
            while(this.requestQueue.length){
                let req = this.requestQueue.shift();
                if (req && this.requestTagMap.has(req.tag)) {
                    let request = this.requestTagMap.get(req.tag);
                    if (request) {
                        this.requestTagMap.delete(request.tag);
                        pendingRequests.push(request);
                    }
                }
            }
            // Helper to create connection error
            const createNoConnectionError = (byeReason)=>{
                const error = new Error('Connection not available');
                error.code = 'NoConnection';
                if (byeReason) {
                    error.reason = byeReason;
                }
                return error;
            };
            // Reject pending requests via setImmediate to ensure caller's promise chain
            // is fully set up before rejection (prevents unhandled promise rejections)
            if (pendingRequests.length) {
                let byeReason = this.byeReason;
                setImmediate(()=>{
                    for (let request of pendingRequests){
                        request.reject(createNoConnectionError(byeReason));
                    }
                });
            }
            // Clear current lock - holder will see errors when they try operations
            this.currentLock = false;
            // Reject pending mailbox locks via setImmediate for consistency
            if (this.locks && this.locks.length) {
                let byeReason = this.byeReason;
                let pendingLocks = this.locks.splice(0); // Take all locks and clear the array
                setImmediate(()=>{
                    for (let lock of pendingLocks){
                        if (typeof lock.reject === 'function') {
                            lock.reject(createNoConnectionError(byeReason));
                        }
                    }
                });
            }
            // cleanup compression streams if they exist
            if (this._inflate) {
                try {
                    this._inflate.unpipe();
                    this._inflate.destroy();
                    this._inflate = null;
                } catch (err) {
                    this.log.error({
                        err,
                        info: 'Failed to destroy inflate stream',
                        cid: this.id
                    });
                }
            }
            if (this._deflate) {
                try {
                    this._deflate.unpipe();
                    this._deflate.destroy();
                    this._deflate = null;
                } catch (err) {
                    this.log.error({
                        err,
                        info: 'Failed to destroy deflate stream',
                        cid: this.id
                    });
                }
            }
            // cleanup streamer
            if (this.streamer) {
                try {
                    // remove our listeners explicitly by reference
                    if (this.socketReadable) {
                        this.streamer.removeListener('readable', this.socketReadable);
                    }
                    if (this._streamerErrorHandler) {
                        this.streamer.removeListener('error', this._streamerErrorHandler);
                    }
                    if (!this.streamer.destroyed) {
                        this.streamer.destroy();
                    }
                } catch (err) {
                    this.log.error({
                        err,
                        info: 'Failed to cleanup streamer',
                        cid: this.id
                    });
                }
            }
            // clear socket handlers
            this.clearSocketHandlers();
            // clear cached data
            this.folders.clear();
            this.requestTagMap.clear();
            this.state = this.states.LOGOUT;
            if (this.isClosed) {
                return;
            }
            if (this.socket && !this.socket.destroyed && this.writeSocket !== this.socket) {
                try {
                    this.socket.destroy();
                } catch (err) {
                    this.log.error({
                        err,
                        cid: this.id
                    });
                }
            }
            this.isClosed = true;
            if (this.writeSocket && !this.writeSocket.destroyed) {
                try {
                    this.writeSocket.destroy();
                } catch (err) {
                    this.log.error({
                        err,
                        cid: this.id
                    });
                }
            }
            if (this.socket && !this.socket.destroyed && this.writeSocket !== this.socket) {
                try {
                    this.socket.destroy();
                } catch (err) {
                    this.log.error({
                        err,
                        cid: this.id
                    });
                }
            }
            // Explicit nullification to help garbage collection
            this.socket = null;
            this.writeSocket = null;
            this._inflate = null;
            this._deflate = null;
            this._streamerErrorHandler = null;
            this._connectErrorHandler = null;
            this._socketError = null;
            this._socketClose = null;
            this._socketEnd = null;
            this._socketTimeout = null;
            this.log.trace({
                msg: 'Connection closed',
                cid: this.id
            });
            this.emit('close');
        } catch (ex) {
            // close failed
            this.log.error(ex);
        }
    }
    /**
     * @typedef {Object} QuotaResponse
     * @global
     * @property {String} path=INBOX mailbox path this quota applies to
     * @property {Object} [storage] Storage quota if provided by server
     * @property {Number} [storage.used] used storage in bytes
     * @property {Number} [storage.limit] total storage available
     * @property {Object} [messages] Message count quota if provided by server
     * @property {Number} [messages.used] stored messages
     * @property {Number} [messages.limit] maximum messages allowed
     */ /**
     * Returns current quota
     *
     * @param {String} [path] Optional mailbox path if you want to check quota for specific folder
     * @returns {Promise<QuotaResponse|Boolean>} Quota information or `false` if QUTOA extension is not supported or requested path does not exist
     *
     * @example
     * let quota = await client.getQuota();
     * console.log(quota.storage.used, quota.storage.available)
     */ async getQuota(path) {
        path = path || 'INBOX';
        return await this.run('QUOTA', path);
    }
    /**
     * @typedef {Object} ListResponse
     * @global
     * @property {String} path mailbox path (unicode string)
     * @property {String} pathAsListed mailbox path as listed in the LIST/LSUB response
     * @property {String} name mailbox name (last part of path after delimiter)
     * @property {String} delimiter mailbox path delimiter, usually "." or "/"
     * @property {String[]} parent An array of parent folder names. All names are in unicode
     * @property {String} parentPath Same as `parent`, but as a complete string path (unicode string)
     * @property {Set<string>} flags a set of flags for this mailbox
     * @property {String} specialUse one of special-use flags (if applicable): "\All", "\Archive", "\Drafts", "\Flagged", "\Junk", "\Sent", "\Trash". Additionally INBOX has non-standard "\Inbox" flag set
     * @property {Boolean} listed `true` if mailbox was found from the output of LIST command
     * @property {Boolean} subscribed `true` if mailbox was found from the output of LSUB command
     * @property {StatusObject} [status] If `statusQuery` was used, then this value includes the status response
     */ /**
     * @typedef {Object} ListOptions
     * @global
     * @property {Object} [statusQuery] request status items for every listed entry
     * @property {Boolean} [statusQuery.messages] if `true` request count of messages
     * @property {Boolean} [statusQuery.recent] if `true` request count of messages with \\Recent tag
     * @property {Boolean} [statusQuery.uidNext] if `true` request predicted next UID
     * @property {Boolean} [statusQuery.uidValidity] if `true` request mailbox `UIDVALIDITY` value
     * @property {Boolean} [statusQuery.unseen] if `true` request count of unseen messages
     * @property {Boolean} [statusQuery.highestModseq] if `true` request last known modseq value
     * @property {Object} [specialUseHints] set specific paths as special use folders, this would override special use flags provided from the server
     * @property {String} [specialUseHints.sent] Path to "Sent Mail" folder
     * @property {String} [specialUseHints.trash] Path to "Trash" folder
     * @property {String} [specialUseHints.junk] Path to "Junk Mail" folder
     * @property {String} [specialUseHints.drafts] Path to "Drafts" folder
     */ /**
     * Lists available mailboxes as an Array
     *
     * @param {ListOptions} [options] defines additional listing options
     * @returns {Promise<ListResponse[]>} An array of ListResponse objects
     *
     * @example
     * let list = await client.list();
     * list.forEach(mailbox=>console.log(mailbox.path));
     */ async list(options) {
        options = options || {};
        let folders = await this.run('LIST', '', '*', options);
        this.folders = new Map(folders.map((folder)=>[
                folder.path,
                folder
            ]));
        return folders;
    }
    /**
     * @typedef {Object} ListTreeResponse
     * @global
     * @property {Boolean} root If `true` then this is root node without any additional properties besides *folders*
     * @property {String} path mailbox path
     * @property {String} name mailbox name (last part of path after delimiter)
     * @property {String} delimiter mailbox path delimiter, usually "." or "/"
     * @property {String[]} flags list of flags for this mailbox
     * @property {String} specialUse one of special-use flags (if applicable): "\All", "\Archive", "\Drafts", "\Flagged", "\Junk", "\Sent", "\Trash". Additionally INBOX has non-standard "\Inbox" flag set
     * @property {Boolean} listed `true` if mailbox was found from the output of LIST command
     * @property {Boolean} subscribed `true` if mailbox was found from the output of LSUB command
     * @property {Boolean} disabled If `true` then this mailbox can not be selected in the UI
     * @property {ListTreeResponse[]} folders An array of subfolders
     */ /**
     * Lists available mailboxes as a tree structured object
     *
     * @param {ListOptions} [options] defines additional listing options
     * @returns {Promise<ListTreeResponse>} Tree structured object
     *
     * @example
     * let tree = await client.listTree();
     * tree.folders.forEach(mailbox=>console.log(mailbox.path));
     */ async listTree(options) {
        options = options || {};
        let folders = await this.run('LIST', '', '*', options);
        this.folders = new Map(folders.map((folder)=>[
                folder.path,
                folder
            ]));
        return getFolderTree(folders);
    }
    /**
     * Performs a no-op call against server
     * @returns {Promise<void>}
     */ async noop() {
        await this.run('NOOP');
    }
    /**
     * @typedef {Object} MailboxCreateResponse
     * @global
     * @property {String} path full mailbox path
     * @property {String} [mailboxId] unique mailbox ID if server supports `OBJECTID` extension (currently Yahoo and some others)
     * @property {Boolean} created If `true` then mailbox was created otherwise it already existed
     */ /**
     * Creates a new mailbox folder and sets up subscription for the created mailbox. Throws on error.
     *
     * @param {string|array} path Full mailbox path. Unicode is allowed. If value is an array then it is joined using current delimiter symbols. Namespace prefix is added automatically if required.
     * @returns {Promise<MailboxCreateResponse>} Mailbox info
     * @throws Will throw an error if mailbox can not be created
     *
     * @example
     * let info = await client.mailboxCreate(['parent', 'child']);
     * console.log(info.path);
     * // "INBOX.parent.child" // assumes "INBOX." as namespace prefix and "." as delimiter
     */ async mailboxCreate(path) {
        return await this.run('CREATE', path);
    }
    /**
     * @typedef {Object} MailboxRenameResponse
     * @global
     * @property {String} path full mailbox path that was renamed
     * @property {String} newPath new full mailbox path
     */ /**
     * Renames a mailbox. Throws on error.
     *
     * @param {string|array} path  Path for the mailbox to rename. Unicode is allowed. If value is an array then it is joined using current delimiter symbols. Namespace prefix is added automatically if required.
     * @param {string|array} newPath New path for the mailbox
     * @returns {Promise<MailboxRenameResponse>} Mailbox info
     * @throws Will throw an error if mailbox does not exist or can not be renamed
     *
     * @example
     * let info = await client.mailboxRename('parent.child', 'Important stuff ❗️');
     * console.log(info.newPath);
     * // "INBOX.Important stuff ❗️" // assumes "INBOX." as namespace prefix
     */ async mailboxRename(path, newPath) {
        return await this.run('RENAME', path, newPath);
    }
    /**
     * @typedef {Object} MailboxDeleteResponse
     * @global
     * @property {String} path full mailbox path that was deleted
     */ /**
     * Deletes a mailbox. Throws on error.
     *
     * @param {string|array} path Path for the mailbox to delete. Unicode is allowed. If value is an array then it is joined using current delimiter symbols. Namespace prefix is added automatically if required.
     * @returns {Promise<MailboxDeleteResponse>} Mailbox info
     * @throws Will throw an error if mailbox does not exist or can not be deleted
     *
     * @example
     * let info = await client.mailboxDelete('Important stuff ❗️');
     * console.log(info.path);
     * // "INBOX.Important stuff ❗️" // assumes "INBOX." as namespace prefix
     */ async mailboxDelete(path) {
        return await this.run('DELETE', path);
    }
    /**
     * Subscribes to a mailbox
     *
     * @param {string|array} path Path for the mailbox to subscribe to. Unicode is allowed. If value is an array then it is joined using current delimiter symbols. Namespace prefix is added automatically if required.
     * @returns {Promise<Boolean>} `true` if subscription operation succeeded, `false` otherwise
     *
     * @example
     * await client.mailboxSubscribe('Important stuff ❗️');
     */ async mailboxSubscribe(path) {
        return await this.run('SUBSCRIBE', path);
    }
    /**
     * Unsubscribes from a mailbox
     *
     * @param {string|array} path **Path for the mailbox** to unsubscribe from. Unicode is allowed. If value is an array then it is joined using current delimiter symbols. Namespace prefix is added automatically if required.
     * @returns {Promise<Boolean>} `true` if unsubscription operation succeeded, `false` otherwise
     *
     * @example
     * await client.mailboxUnsubscribe('Important stuff ❗️');
     */ async mailboxUnsubscribe(path) {
        return await this.run('UNSUBSCRIBE', path);
    }
    /**
     * Opens a mailbox to access messages. You can perform message operations only against an opened mailbox.
     * Using {@link module:imapflow~ImapFlow#getMailboxLock|getMailboxLock()} instead of `mailboxOpen()` is preferred. Both do the same thing
     * but next `getMailboxLock()` call is not executed until previous one is released.
     *
     * @param {string|array} path **Path for the mailbox** to open
     * @param {Object} [options] optional options
     * @param {Boolean} [options.readOnly=false] If `true` then opens mailbox in read-only mode. You can still try to perform write operations but these would probably fail.
     * @returns {Promise<MailboxObject>} Mailbox info
     * @throws Will throw an error if mailbox does not exist or can not be opened
     *
     * @example
     * let mailbox = await client.mailboxOpen('Important stuff ❗️');
     * console.log(mailbox.exists);
     * // 125
     */ async mailboxOpen(path, options) {
        return await this.run('SELECT', path, options);
    }
    /**
     * Closes a previously opened mailbox
     *
     * @returns {Promise<Boolean>} Did the operation succeed or not
     *
     * @example
     * let mailbox = await client.mailboxOpen('INBOX');
     * await client.mailboxClose();
     */ async mailboxClose() {
        return await this.run('CLOSE');
    }
    /**
     * @typedef {Object} StatusObject
     * @global
     * @property {String} path full mailbox path that was checked
     * @property {Number} [messages] Count of messages
     * @property {Number} [recent] Count of messages with \\Recent tag
     * @property {Number} [uidNext] Predicted next UID
     * @property {BigInt} [uidValidity] Mailbox `UIDVALIDITY` value
     * @property {Number} [unseen] Count of unseen messages
     * @property {BigInt} [highestModseq] Last known modseq value (if CONDSTORE extension is enabled)
     */ /**
     * Requests the status of the indicated mailbox. Only requested status values will be returned.
     *
     * @param {String} path mailbox path to check for (unicode string)
     * @param {Object} query defines requested status items
     * @param {Boolean} query.messages if `true` request count of messages
     * @param {Boolean} query.recent if `true` request count of messages with \\Recent tag
     * @param {Boolean} query.uidNext if `true` request predicted next UID
     * @param {Boolean} query.uidValidity if `true` request mailbox `UIDVALIDITY` value
     * @param {Boolean} query.unseen if `true` request count of unseen messages
     * @param {Boolean} query.highestModseq if `true` request last known modseq value
     * @returns {Promise<StatusObject>} status of the indicated mailbox
     *
     * @example
     * let status = await client.status('INBOX', {unseen: true});
     * console.log(status.unseen);
     * // 123
     */ async status(path, query) {
        return await this.run('STATUS', path, query);
    }
    /**
     * Starts listening for new or deleted messages from the currently opened mailbox. Only required if {@link ImapFlow#disableAutoIdle} is set to `true`
     * otherwise IDLE is started by default on connection inactivity. NB! If `idle()` is called manually then it does not
     * return until IDLE is finished which means you would have to call some other command out of scope.
     *
     * @returns {Promise<Boolean>} Did the operation succeed or not
     *
     * @example
     * let mailbox = await client.mailboxOpen('INBOX');
     *
     * await client.idle();
     */ async idle() {
        if (!this.idling) {
            return await this.run('IDLE', this.maxIdleTime);
        }
    }
    /**
     * Sequence range string. Separate different values with commas, number ranges with colons and use \\* as the placeholder for the newest message in mailbox
     * @typedef {String} SequenceString
     * @global
     * @example
     * "1:*" // for all messages
     * "1,2,3" // for messages 1, 2 and 3
     * "1,2,4:6" // for messages 1,2,4,5,6
     * "*" // for the newest message
     */ /**
     * IMAP search query options. By default all conditions must match. In case of `or` query term at least one condition must match.
     * @typedef {Object} SearchObject
     * @global
     * @property {SequenceString} [seq] message ordering sequence range
     * @property {Boolean} [answered] Messages with (value is `true`) or without (value is `false`) \\Answered flag
     * @property {Boolean} [deleted] Messages with (value is `true`) or without (value is `false`) \\Deleted flag
     * @property {Boolean} [draft] Messages with (value is `true`) or without (value is `false`) \\Draft flag
     * @property {Boolean} [flagged] Messages with (value is `true`) or without (value is `false`) \\Flagged flag
     * @property {Boolean} [seen] Messages with (value is `true`) or without (value is `false`) \\Seen flag
     * @property {Boolean} [all] If `true` matches all messages
     * @property {Boolean} [new] If `true` matches messages that have the \\Recent flag set but not the \\Seen flag
     * @property {Boolean} [old] If `true` matches messages that do not have the \\Recent flag set
     * @property {Boolean} [recent] If `true` matches messages that have the \\Recent flag set
     * @property {String} [from] Matches From: address field
     * @property {String} [to] Matches To: address field
     * @property {String} [cc] Matches Cc: address field
     * @property {String} [bcc] Matches Bcc: address field
     * @property {String} [body] Matches message body
     * @property {String} [subject] Matches message subject
     * @property {Number} [larger] Matches messages larger than value
     * @property {Number} [smaller] Matches messages smaller than value
     * @property {SequenceString} [uid] UID sequence range
     * @property {BigInt} [modseq] Matches messages with modseq higher than value
     * @property {String} [emailId] unique email ID. Only used if server supports `OBJECTID` or `X-GM-EXT-1` extensions
     * @property {String} [threadId] unique thread ID. Only used if server supports `OBJECTID` or `X-GM-EXT-1` extensions
     * @property {Date|string} [before] Matches messages received before date
     * @property {Date|string} [on] Matches messages received on date (ignores time)
     * @property {Date|string} [since] Matches messages received after date
     * @property {Date|string} [sentBefore] Matches messages sent before date
     * @property {Date|string} [sentOn] Matches messages sent on date (ignores time)
     * @property {Date|string} [sentSince] Matches messages sent after date
     * @property {String} [keyword] Matches messages that have the custom flag set
     * @property {String} [unKeyword] Matches messages that do not have the custom flag set
     * @property {Object.<string, Boolean|String>} [header] Matches messages with header key set if value is `true` (**NB!** not supported by all servers) or messages where header partially matches a string value
     * @property {SearchObject} [not] A {@link SearchObject} object. It must not match.
     * @property {SearchObject[]} [or] An array of 2 or more {@link SearchObject} objects. At least one of these must match
     */ /**
     * Sets flags for a message or message range
     *
     * @param {SequenceString | Number[] | SearchObject} range Range to filter the messages
     * @param {string[]} Array of flags to set. Only flags that are permitted to set are used, other flags are ignored
     * @param {Object} [options]
     * @param {Boolean} [options.uid] If `true` then uses UID {@link SequenceString} instead of sequence numbers
     * @param {BigInt} [options.unchangedSince] If set then only messages with a lower or equal `modseq` value are updated. Ignored if server does not support `CONDSTORE` extension.
     * @param {Boolean} [options.useLabels=false] If true then update Gmail labels instead of message flags
     * @returns {Promise<Boolean>} Did the operation succeed or not
     *
     * @example
     * let mailbox = await client.mailboxOpen('INBOX');
     * // mark all unseen messages as seen (and remove other flags)
     * await client.messageFlagsSet({seen: false}, ['\Seen]);
     */ async messageFlagsSet(range, flags, options) {
        options = options || {};
        range = await this.resolveRange(range, options);
        if (!range) {
            return false;
        }
        let queryOpts = Object.assign({
            operation: 'set'
        }, options);
        return await this.run('STORE', range, flags, queryOpts);
    }
    /**
     * Adds flags for a message or message range
     *
     * @param {SequenceString | Number[] | SearchObject} range Range to filter the messages
     * @param {string[]} Array of flags to set. Only flags that are permitted to set are used, other flags are ignored
     * @param {Object} [options]
     * @param {Boolean} [options.uid] If `true` then uses UID {@link SequenceString} instead of sequence numbers
     * @param {BigInt} [options.unchangedSince] If set then only messages with a lower or equal `modseq` value are updated. Ignored if server does not support `CONDSTORE` extension.
     * @param {Boolean} [options.useLabels=false] If true then update Gmail labels instead of message flags
     * @returns {Promise<Boolean>} Did the operation succeed or not
     *
     * @example
     * let mailbox = await client.mailboxOpen('INBOX');
     * // mark all unseen messages as seen (and keep other flags as is)
     * await client.messageFlagsAdd({seen: false}, ['\Seen]);
     */ async messageFlagsAdd(range, flags, options) {
        options = options || {};
        range = await this.resolveRange(range, options);
        if (!range) {
            return false;
        }
        let queryOpts = Object.assign({
            operation: 'add'
        }, options);
        return await this.run('STORE', range, flags, queryOpts);
    }
    /**
     * Remove specific flags from a message or message range
     *
     * @param {SequenceString | Number[] | SearchObject} range Range to filter the messages
     * @param {string[]} Array of flags to remove. Only flags that are permitted to set are used, other flags are ignored
     * @param {Object} [options]
     * @param {Boolean} [options.uid] If `true` then uses UID {@link SequenceString} instead of sequence numbers
     * @param {BigInt} [options.unchangedSince] If set then only messages with a lower or equal `modseq` value are updated. Ignored if server does not support `CONDSTORE` extension.
     * @param {Boolean} [options.useLabels=false] If true then update Gmail labels instead of message flags
     * @returns {Promise<Boolean>} Did the operation succeed or not
     *
     * @example
     * let mailbox = await client.mailboxOpen('INBOX');
     * // mark all seen messages as unseen by removing \\Seen flag
     * await client.messageFlagsRemove({seen: true}, ['\Seen]);
     */ async messageFlagsRemove(range, flags, options) {
        options = options || {};
        range = await this.resolveRange(range, options);
        if (!range) {
            return false;
        }
        let queryOpts = Object.assign({
            operation: 'remove'
        }, options);
        return await this.run('STORE', range, flags, queryOpts);
    }
    /**
     * Sets a colored flag for an email. Only supported by mail clients like Apple Mail
     *
     * @param {SequenceString | Number[] | SearchObject} range Range to filter the messages
     * @param {string} The color to set. One of 'red', 'orange', 'yellow', 'green', 'blue', 'purple', and 'grey'
     * @param {Object} [options]
     * @param {Boolean} [options.uid] If `true` then uses UID {@link SequenceString} instead of sequence numbers
     * @param {BigInt} [options.unchangedSince] If set then only messages with a lower or equal `modseq` value are updated. Ignored if server does not support `CONDSTORE` extension.
     * @returns {Promise<Boolean>} Did the operation succeed or not
     *
     * @example
     * let mailbox = await client.mailboxOpen('INBOX');
     * // add a purple flag for all emails
     * await client.setFlagColor('1:*', 'Purple');
     */ async setFlagColor(range, color, options) {
        options = options || {};
        range = await this.resolveRange(range, options);
        if (!range) {
            return false;
        }
        let flagChanges = getColorFlags(color);
        if (!flagChanges) {
            return false;
        }
        let addResults;
        let removeResults;
        if (flagChanges.add && flagChanges.add.length) {
            let queryOpts = Object.assign({
                operation: 'add'
            }, options, {
                useLabels: false,
                // prevent triggering a premature Flags change notification
                silent: flagChanges.remove && flagChanges.remove.length
            });
            addResults = await this.run('STORE', range, flagChanges.add, queryOpts);
        }
        if (flagChanges.remove && flagChanges.remove.length) {
            let queryOpts = Object.assign({
                operation: 'remove'
            }, options, {
                useLabels: false
            } // override if set
            );
            removeResults = await this.run('STORE', range, flagChanges.remove, queryOpts);
        }
        return addResults || removeResults || false;
    }
    /**
     * Delete messages from the currently opened mailbox. Method does not indicate info about deleted messages,
     * instead you should be using {@link ImapFlow#expunge} event for this
     *
     * @param {SequenceString | Number[] | SearchObject} range Range to filter the messages
     * @param {Object} [options]
     * @param {Boolean} [options.uid] If `true` then uses UID {@link SequenceString} instead of sequence numbers
     * @returns {Promise<Boolean>} Did the operation succeed or not
     *
     * @example
     * let mailbox = await client.mailboxOpen('INBOX');
     * // delete all seen messages
     * await client.messageDelete({seen: true});
     */ async messageDelete(range, options) {
        options = options || {};
        range = await this.resolveRange(range, options);
        if (!range) {
            return false;
        }
        return await this.run('EXPUNGE', range, options);
    }
    /**
     * @typedef {Object} AppendResponseObject
     * @global
     * @property {String} destination full mailbox path where the message was uploaded to
     * @property {BigInt} [uidValidity] mailbox `UIDVALIDITY` if server has `UIDPLUS` extension enabled
     * @property {Number} [uid] UID of the uploaded message if server has `UIDPLUS` extension enabled
     * @property {Number} [seq] sequence number of the uploaded message if path is currently selected mailbox
     */ /**
     * Appends a new message to a mailbox
     *
     * @param {String} path Mailbox path to upload the message to (unicode string)
     * @param {string|Buffer} content RFC822 formatted email message
     * @param {string[]} [flags] an array of flags to be set for the uploaded message
     * @param {Date|string} [idate=now] internal date to be set for the message
     * @returns {Promise<AppendResponseObject>} info about uploaded message
     *
     * @example
     * await client.append('INBOX', rawMessageBuffer, ['\\Seen'], new Date(2000, 1, 1));
     */ async append(path, content, flags, idate) {
        let response = await this.run('APPEND', path, content, flags, idate);
        if (!response) {
            return false;
        }
        return response;
    }
    /**
     * @typedef {Object} CopyResponseObject
     * @global
     * @property {String} path path of source mailbox
     * @property {String} destination path of destination mailbox
     * @property {BigInt} [uidValidity] destination mailbox `UIDVALIDITY` if server has `UIDPLUS` extension enabled
     * @property {Map<number, number>} [uidMap] Map of UID values (if server has `UIDPLUS` extension enabled) where key is UID in source mailbox and value is the UID for the same message in destination mailbox
     */ /**
     * Copies messages from current mailbox to destination mailbox
     *
     * @param {SequenceString | Number[] | SearchObject} range Range of messages to copy
     * @param {String} destination Mailbox path to copy the messages to
     * @param {Object} [options]
     * @param {Boolean} [options.uid] If `true` then uses UID {@link SequenceString} instead of sequence numbers
     * @returns {Promise<CopyResponseObject>} info about copies messages
     *
     * @example
     * await client.mailboxOpen('INBOX');
     * // copy all messages to a mailbox called "Backup" (must exist)
     * let result = await client.messageCopy('1:*', 'Backup');
     * console.log('Copied %s messages', result.uidMap.size);
     */ async messageCopy(range, destination, options) {
        options = options || {};
        range = await this.resolveRange(range, options);
        if (!range) {
            return false;
        }
        return await this.run('COPY', range, destination, options);
    }
    /**
     * Moves messages from current mailbox to destination mailbox
     *
     * @param {SequenceString | Number[] | SearchObject} range Range of messages to move
     * @param {String} destination Mailbox path to move the messages to
     * @param {Object} [options]
     * @param {Boolean} [options.uid] If `true` then uses UID {@link SequenceString} instead of sequence numbers
     * @returns {Promise<CopyResponseObject>} info about moved messages
     *
     * @example
     * await client.mailboxOpen('INBOX');
     * // move all messages to a mailbox called "Trash" (must exist)
     * let result = await client.messageMove('1:*', 'Trash');
     * console.log('Moved %s messages', result.uidMap.size);
     */ async messageMove(range, destination, options) {
        options = options || {};
        range = await this.resolveRange(range, options);
        if (!range) {
            return false;
        }
        return await this.run('MOVE', range, destination, options);
    }
    /**
     * Search messages from the currently opened mailbox
     *
     * @param {SearchObject} query Query to filter the messages
     * @param {Object} [options]
     * @param {Boolean} [options.uid] If `true` then returns UID numbers instead of sequence numbers
     * @returns {Promise<Number[]>} An array of sequence or UID numbers
     *
     * @example
     * let mailbox = await client.mailboxOpen('INBOX');
     * // find all unseen messages
     * let list = await client.search({seen: false});
     * // use OR modifier (array of 2 or more search queries)
     * let list = await client.search({
     *   seen: false,
     *   or: [
     *     {flagged: true},
     *     {from: 'andris'},
     *     {subject: 'test'}
     *   ]});
     */ async search(query, options) {
        if (!this.mailbox) {
            // no mailbox selected, nothing to do
            return;
        }
        let response = await this.run('SEARCH', query, options);
        if (!response) {
            return false;
        }
        return response;
    }
    /**
     * @typedef {Object} FetchQueryObject
     * @global
     * @property {Boolean} [uid] if `true` then include UID in the response
     * @property {Boolean} [flags] if `true` then include flags Set in the response. Also adds `flagColor` to the response if the message is flagged.
     * @property {Boolean} [bodyStructure] if `true` then include parsed BODYSTRUCTURE object in the response
     * @property {Boolean} [envelope] if `true` then include parsed ENVELOPE object in the response
     * @property {Boolean} [internalDate] if `true` then include internal date value in the response
     * @property {Boolean} [size] if `true` then include message size in the response
     * @property {boolean | Object} [source] if `true` then include full message in the response
     * @property {Number} [source.start] include full message in the response starting from *start* byte
     * @property {Number} [source.maxLength] include full message in the response, up to *maxLength* bytes
     * @property {String} [threadId] if `true` then include thread ID in the response (only if server supports either `OBJECTID` or `X-GM-EXT-1` extensions)
     * @property {Boolean} [labels] if `true` then include GMail labels in the response (only if server supports `X-GM-EXT-1` extension)
     * @property {boolean | string[]} [headers] if `true` then includes full headers of the message in the response. If the value is an array of header keys then includes only headers listed in the array
     * @property {string[]} [bodyParts] An array of BODYPART identifiers to include in the response
     */ /**
     * Parsed email address entry
     *
     * @typedef {Object} MessageAddressObject
     * @global
     * @property {String} [name] name of the address object (unicode)
     * @property {String} [address] email address
     */ /**
     * Parsed IMAP ENVELOPE object
     *
     * @typedef {Object} MessageEnvelopeObject
     * @global
     * @property {Date} [date] header date
     * @property {String} [subject] message subject (unicode)
     * @property {String} [messageId] Message ID of the message
     * @property {String} [inReplyTo] Message ID from In-Reply-To header
     * @property {MessageAddressObject[]} [from] Array of addresses from the From: header
     * @property {MessageAddressObject[]} [sender] Array of addresses from the Sender: header
     * @property {MessageAddressObject[]} [replyTo] Array of addresses from the Reply-To: header
     * @property {MessageAddressObject[]} [to] Array of addresses from the To: header
     * @property {MessageAddressObject[]} [cc] Array of addresses from the Cc: header
     * @property {MessageAddressObject[]} [bcc] Array of addresses from the Bcc: header
     */ /**
     * Parsed IMAP BODYSTRUCTURE object
     *
     * @typedef {Object} MessageStructureObject
     * @global
     * @property {String} part Body part number. This value can be used to later fetch the contents of this part of the message
     * @property {String} type Content-Type of this node
     * @property {Object} [parameters] Additional parameters for Content-Type, eg "charset"
     * @property {String} [id] Content-ID
     * @property {String} [encoding] Transfer encoding
     * @property {Number} [size] Expected size of the node
     * @property {MessageEnvelopeObject} [envelope] message envelope of embedded RFC822 message
     * @property {String} [disposition] Content disposition
     * @property {Object} [dispositionParameters] Additional parameters for Content-Disposition
     * @property {MessageStructureObject[]} childNodes An array of child nodes if this is a multipart node. Not present for normal nodes
     */ /**
     * Fetched message data
     *
     * @typedef {Object} FetchMessageObject
     * @global
     * @property {Number} seq message sequence number. Always included in the response
     * @property {Number} uid message UID number. Always included in the response
     * @property {Buffer} [source] message source for the requested byte range
     * @property {BigInt} [modseq] message Modseq number. Always included if the server supports CONDSTORE extension
     * @property {String} [emailId] unique email ID. Always included if server supports `OBJECTID` or `X-GM-EXT-1` extensions
     * @property {String} [threadid] unique thread ID. Only present if server supports `OBJECTID` or `X-GM-EXT-1` extension
     * @property {Set<string>} [labels] a Set of labels. Only present if server supports `X-GM-EXT-1` extension
     * @property {Number} [size] message size
     * @property {Set<string>} [flags] a set of message flags
     * @property {String} [flagColor] flag color like "red", or "yellow". This value is derived from the `flags` Set and it uses the same color rules as Apple Mail
     * @property {MessageEnvelopeObject} [envelope] message envelope
     * @property {MessageStructureObject} [bodyStructure] message body structure
     * @property {Date} [internalDate] message internal date
     * @property {Map<string, Buffer>} [bodyParts] a Map of message body parts where key is requested part identifier and value is a Buffer
     * @property {Buffer} [headers] Requested header lines as Buffer
     */ /**
     * Fetch messages from the currently opened mailbox
     *
     * @param {SequenceString | Number[] | SearchObject} range Range of messages to fetch
     * @param {FetchQueryObject} query Fetch query
     * @param {Object} [options]
     * @param {Boolean} [options.uid] If `true` then uses UID numbers instead of sequence numbers for `range`
     * @param {BigInt} [options.changedSince] If set then only messages with a higher modseq value are returned. Ignored if server does not support `CONDSTORE` extension.
     * @param {Boolean} [options.binary=false] If `true` then requests a binary response if the server supports this
     * @yields {Promise<FetchMessageObject>} Message data object
     *
     * @example
     * let mailbox = await client.mailboxOpen('INBOX');
     * // fetch UID for all messages in a mailbox
     * for await (let msg of client.fetch('1:*', {uid: true})){
     *     console.log(msg.uid);
     *     // NB! You can not run any IMAP commands in this loop
     *     // otherwise you will end up in a deadloop
     * }
     */ async *fetch(range, query, options) {
        options = options || {};
        if (!this.mailbox) {
            // no mailbox selected, nothing to do
            return;
        }
        range = await this.resolveRange(range, options);
        if (!range) {
            return false;
        }
        let finished = false;
        let push = false;
        let rowQueue = [];
        let getNext = ()=>new Promise((resolve, reject)=>{
                let check = ()=>{
                    if (rowQueue.length) {
                        let entry = rowQueue.shift();
                        if (entry.err) {
                            return reject(entry.err);
                        } else {
                            return resolve(entry.value);
                        }
                    }
                    if (finished) {
                        return resolve(null);
                    }
                    // wait until data is pushed to queue and try again
                    push = ()=>{
                        push = false;
                        check();
                    };
                };
                check();
            });
        this.run('FETCH', range, query, {
            uid: !!options.uid,
            binary: options.binary,
            changedSince: options.changedSince,
            onUntaggedFetch: (untagged, next)=>{
                rowQueue.push({
                    value: {
                        response: untagged,
                        next
                    }
                });
                if (typeof push === 'function') {
                    push();
                }
            }
        }).then(()=>{
            finished = true;
            if (typeof push === 'function') {
                push();
            }
        }).catch((err)=>{
            rowQueue.push({
                err
            });
            if (typeof push === 'function') {
                push();
            }
        });
        let res;
        while(res = await getNext()){
            if (this.isClosed || !this.socket || this.socket.destroyed) {
                let error = new Error('Connection closed');
                error.code = 'EConnectionClosed';
                throw error;
            }
            if (res !== null) {
                yield res.response;
                res.next();
            }
        }
        if (!finished) {
            // FETCH never finished!
            let error = new Error('FETCH did not finish');
            error.code = 'ENotFinished';
            throw error;
        }
    }
    /**
     * Fetch messages from the currently opened mailbox.
     *
     * This method will fetch all messages before resolving the promise, unlike .fetch(), which
     * is an async generator. Do not use large ranges like 1:*, as this might exhaust all available
     * memory if the mailbox contains a large number of emails.
     * @param {SequenceString | Number[] | SearchObject} range Range of messages to fetch
     * @param {FetchQueryObject} query Fetch query
     * @param {Object} [options]
     * @param {Boolean} [options.uid] If `true` then uses UID numbers instead of sequence numbers for `range`
     * @param {BigInt} [options.changedSince] If set then only messages with a higher modseq value are returned. Ignored if server does not support `CONDSTORE` extension.
     * @param {Boolean} [options.binary=false] If `true` then requests a binary response if the server supports this
     * @returns {Promise<FetchMessageObject[]>} Array of Message data object
     *
     * @example
     * let mailbox = await client.mailboxOpen('INBOX');
     * // fetch UID for all messages in a mailbox
     * const messages = await client.fetchAll('1:*', {uid: true});
     * for (let msg of messages){
     *     console.log(msg.uid);
     * }
     */ async fetchAll(range, query, options) {
        const results = [];
        const generator = this.fetch(range, query, options);
        for await (const message of generator){
            results.push(message);
        }
        return results;
    }
    /**
     * Fetch a single message from the currently opened mailbox
     *
     * @param {SequenceString} seq Single UID or sequence number of the message to fetch for
     * @param {FetchQueryObject} query Fetch query
     * @param {Object} [options]
     * @param {Boolean} [options.uid] If `true` then uses UID number instead of sequence number for `seq`
     * @param {Boolean} [options.binary=false] If `true` then requests a binary response if the server supports this
     * @returns {Promise<FetchMessageObject>} Message data object
     *
     * @example
     * let mailbox = await client.mailboxOpen('INBOX');
     * // fetch UID for the last email in the selected mailbox
     * let lastMsg = await client.fetchOne('*', {uid: true})
     * console.log(lastMsg.uid);
     */ async fetchOne(seq, query, options) {
        if (!this.mailbox) {
            // no mailbox selected, nothing to do
            return;
        }
        if (seq === '*') {
            if (!this.mailbox.exists) {
                return false;
            }
            seq = this.mailbox.exists.toString();
            options = Object.assign({}, options || {}, {
                uid: false
            }); // force into a sequence query
        }
        let response = await this.run('FETCH', (seq || '').toString(), query, options);
        if (!response || !response.list || !response.list.length) {
            return false;
        }
        return response.list[0];
    }
    /**
     * @typedef {Object} DownloadObject
     * @global
     * @property {Object} meta content metadata
     * @property {number} meta.expectedSize The fetch response size
     * @property {String} meta.contentType Content-Type of the streamed file. If part was not set then this value is "message/rfc822"
     * @property {String} [meta.charset] Charset of the body part. Text parts are automatically converted to UTF-8, attachments are kept as is
     * @property {String} [meta.disposition] Content-Disposition of the streamed file
     * @property {String} [meta.filename] Filename of the streamed body part
     * @property {ReadableStream} content Streamed content
     */ /**
     * Download either full rfc822 formatted message or a specific bodystructure part as a Stream.
     * Bodystructure parts are decoded so the resulting stream is a binary file. Text content
     * is automatically converted to UTF-8 charset.
     *
     * @param {SequenceString} range UID or sequence number for the message to fetch
     * @param {String} [part] If not set then downloads entire rfc822 formatted message, otherwise downloads specific bodystructure part
     * @param {Object} [options]
     * @param {Boolean} [options.uid] If `true` then uses UID number instead of sequence number for `range`
     * @param {number} [options.maxBytes] If set then limits download size to specified bytes
     * @param {number} [options.chunkSize=65536] How large content parts to ask from the server
     * @returns {Promise<DownloadObject>} Download data object
     *
     * @example
     * let mailbox = await client.mailboxOpen('INBOX');
     * // download body part nr '1.2' from latest message
     * let {meta, content} = await client.download('*', '1.2');
     * content.pipe(fs.createWriteStream(meta.filename));
     */ async download(range, part, options) {
        if (!this.mailbox) {
            // no mailbox selected, nothing to do
            return {};
        }
        options = Object.assign({
            chunkSize: 64 * 1024,
            maxBytes: Infinity
        }, options || {});
        let hasMore = true;
        let processed = 0;
        let chunkSize = Number(options.chunkSize) || 64 * 1024;
        let maxBytes = Number(options.maxBytes) || Infinity;
        let uid = false;
        if (part === '1') {
            // First part has special conditions for single node emails as
            // the mime parts for root node are not 1 and 1.MIME but TEXT and HEADERS
            let response = await this.fetchOne(range, {
                uid: true,
                bodyStructure: true
            }, options);
            if (!response) {
                return {
                    response: false,
                    chunk: false
                };
            }
            if (!uid && response.uid) {
                uid = response.uid;
                // force UID from now on even if first range was a sequence number
                range = uid;
                options.uid = true;
            }
            if (!response.bodyStructure.childNodes) {
                // single text message
                part = 'TEXT';
            }
        }
        let getNextPart = async (query)=>{
            query = query || {};
            let mimeKey;
            if (!part) {
                query.source = {
                    start: processed,
                    maxLength: chunkSize
                };
            } else {
                part = part.toString().toLowerCase().trim();
                if (!query.bodyParts) {
                    query.bodyParts = [];
                }
                if (query.size) {
                    if (/^[\d.]+$/.test(part)) {
                        // fetch meta as well
                        mimeKey = part + '.mime';
                        query.bodyParts.push(mimeKey);
                    } else if (part === 'text') {
                        mimeKey = 'header';
                        query.bodyParts.push(mimeKey);
                    }
                }
                query.bodyParts.push({
                    key: part,
                    start: processed,
                    maxLength: chunkSize
                });
            }
            let response = await this.fetchOne(range, query, options);
            if (!response) {
                return {
                    response: false,
                    chunk: false
                };
            }
            if (!uid && response.uid) {
                uid = response.uid;
                // force UID from now on even if first range was a sequence number
                range = uid;
                options.uid = true;
            }
            let chunk = !part ? response.source : response.bodyParts && response.bodyParts.get(part);
            if (!chunk) {
                return {};
            }
            processed += chunk.length;
            hasMore = chunk.length >= chunkSize;
            let result = {
                chunk
            };
            if (query.size) {
                result.response = response;
            }
            if (query.bodyParts) {
                if (mimeKey === 'header') {
                    result.mime = response.headers;
                } else {
                    result.mime = response.bodyParts.get(mimeKey);
                }
            }
            return result;
        };
        let { response, chunk, mime } = await getNextPart({
            size: true,
            uid: true
        });
        if (!response || !chunk) {
            // ???
            return {};
        }
        let meta = {
            expectedSize: response.size
        };
        if (!part) {
            meta.contentType = 'message/rfc822';
        } else if (mime) {
            let headers = new Headers(mime);
            let contentType = libmime.parseHeaderValue(headers.getFirst('Content-Type'));
            let transferEncoding = libmime.parseHeaderValue(headers.getFirst('Content-Transfer-Encoding'));
            let disposition = libmime.parseHeaderValue(headers.getFirst('Content-Disposition'));
            if (contentType.value.toLowerCase().trim()) {
                meta.contentType = contentType.value.toLowerCase().trim();
            }
            if (contentType.params.charset) {
                meta.charset = contentType.params.charset.toLowerCase().trim();
            }
            if (transferEncoding.value) {
                meta.encoding = transferEncoding.value.replace(/\(.*\)/g, '').toLowerCase().trim();
            }
            if (disposition.value) {
                meta.disposition = disposition.value.toLowerCase().trim() || false;
                try {
                    meta.disposition = libmime.decodeWords(meta.disposition);
                } catch  {
                // failed to parse disposition, keep as is (most probably an unknown charset is used)
                }
            }
            if (contentType.params.format && contentType.params.format.toLowerCase().trim() === 'flowed') {
                meta.flowed = true;
                if (contentType.params.delsp && contentType.params.delsp.toLowerCase().trim() === 'yes') {
                    meta.delSp = true;
                }
            }
            let filename = disposition.params.filename || contentType.params.name || false;
            if (filename) {
                try {
                    filename = libmime.decodeWords(filename);
                } catch  {
                // failed to parse filename, keep as is (most probably an unknown charset is used)
                }
                meta.filename = filename;
            }
        }
        let stream;
        let output;
        let fetchAborted = false;
        switch(meta.encoding){
            case 'base64':
                output = stream = new libbase64.Decoder();
                break;
            case 'quoted-printable':
                output = stream = new libqp.Decoder();
                break;
            default:
                output = stream = new PassThrough();
        }
        let isTextNode = [
            'text/html',
            'text/plain',
            'text/x-amp-html'
        ].includes(meta.contentType) || part === '1' && !meta.contentType;
        if ((!meta.disposition || meta.disposition === 'inline') && isTextNode) {
            // flowed text
            if (meta.flowed) {
                let flowDecoder = new FlowedDecoder({
                    delSp: meta.delSp
                });
                output.on('error', (err)=>{
                    flowDecoder.emit('error', err);
                });
                output = output.pipe(flowDecoder);
            }
            // not utf-8 text
            if (meta.charset && ![
                'ascii',
                'usascii',
                'utf8'
            ].includes(meta.charset.toLowerCase().replace(/[^a-z0-9]+/g, ''))) {
                try {
                    let decoder = getDecoder(meta.charset);
                    output.on('error', (err)=>{
                        decoder.emit('error', err);
                    });
                    output = output.pipe(decoder);
                    // force to utf-8 for output
                    meta.charset = 'utf-8';
                } catch  {
                // do not decode charset
                }
            }
        }
        let limiter = new LimitedPassthrough({
            maxBytes
        });
        output.on('error', (err)=>{
            limiter.emit('error', err);
        });
        output = output.pipe(limiter);
        // Cleanup function
        const cleanup = ()=>{
            fetchAborted = true;
            if (stream && !stream.destroyed) {
                stream.destroy();
            }
        };
        // Listen for stream destruction
        output.once('error', cleanup);
        output.once('close', cleanup);
        let writeChunk = (chunk)=>{
            if (limiter.limited || fetchAborted || stream.destroyed) {
                return true;
            }
            return stream.write(chunk);
        };
        let fetchAllParts = async ()=>{
            while(hasMore && !limiter.limited && !fetchAborted){
                let { chunk } = await getNextPart();
                if (!chunk || fetchAborted) {
                    break;
                }
                // Handle backpressure
                if (writeChunk(chunk) === false) {
                    // Wait for drain event before continuing
                    try {
                        await new Promise((resolve, reject)=>{
                            let resolved = false;
                            const finish = (err)=>{
                                if (resolved) return;
                                resolved = true;
                                // Remove all listeners
                                stream.removeAllListeners('drain');
                                stream.removeAllListeners('error');
                                stream.removeAllListeners('close');
                                if (err) {
                                    reject(err);
                                } else {
                                    resolve();
                                }
                            };
                            stream.once('drain', ()=>finish());
                            stream.once('error', (err)=>finish(err));
                            stream.once('close', ()=>finish());
                        });
                    } catch (err) {
                        // Re-throw only if not aborted
                        if (!fetchAborted) {
                            throw err;
                        }
                    }
                    // Check if we should abort after waiting
                    if (fetchAborted) {
                        break;
                    }
                }
            }
        };
        setImmediate(()=>{
            let writeResult;
            try {
                writeResult = writeChunk(chunk);
            } catch (err) {
                stream.emit('error', err);
                if (!fetchAborted && stream && !stream.destroyed) {
                    stream.end();
                }
                return;
            }
            if (!writeResult) {
                // Initial chunk filled the buffer, wait for drain
                stream.once('drain', ()=>{
                    if (!fetchAborted) {
                        fetchAllParts().catch((err)=>{
                            if (!fetchAborted && stream && !stream.destroyed) {
                                stream.emit('error', err);
                            } else {
                                // Log when error cannot be emitted to stream
                                this.log.warn({
                                    msg: 'Download error after stream closed',
                                    err,
                                    fetchAborted,
                                    streamDestroyed: stream?.destroyed,
                                    cid: this.id
                                });
                            }
                        }).finally(()=>{
                            if (!fetchAborted && stream && !stream.destroyed) {
                                stream.end();
                            }
                        });
                    }
                });
            } else {
                fetchAllParts().catch((err)=>{
                    if (!fetchAborted && stream && !stream.destroyed) {
                        stream.emit('error', err);
                    } else {
                        // Log when error cannot be emitted to stream
                        this.log.warn({
                            msg: 'Download error after stream closed',
                            err,
                            fetchAborted,
                            streamDestroyed: stream?.destroyed,
                            cid: this.id
                        });
                    }
                }).finally(()=>{
                    if (!fetchAborted && stream && !stream.destroyed) {
                        stream.end();
                    }
                });
            }
        });
        return {
            meta,
            content: output
        };
    }
    /**
     * Fetch multiple attachments as Buffer values
     *
     * @param {SequenceString} range UID or sequence number for the message to fetch
     * @param {String} parts A list of bodystructure parts
     * @param {Object} [options]
     * @param {Boolean} [options.uid] If `true` then uses UID number instead of sequence number for `range`
     * @returns {Promise<Object>} Download data object
     *
     * @example
     * let mailbox = await client.mailboxOpen('INBOX');
     * // download body parts '2', and '3' from all messages in the selected mailbox
     * let response = await client.downloadMany('*', ['2', '3']);
     * process.stdout.write(response[2].content)
     * process.stdout.write(response[3].content)
     */ async downloadMany(range, parts, options) {
        if (!this.mailbox) {
            // no mailbox selected, nothing to do
            return {};
        }
        options = Object.assign({
            chunkSize: 64 * 1024,
            maxBytes: Infinity
        }, options || {});
        let query = {
            bodyParts: []
        };
        for (let part of parts){
            query.bodyParts.push(part + '.mime');
            query.bodyParts.push(part);
        }
        let response = await this.fetchOne(range, query, options);
        if (!response || !response.bodyParts) {
            return {
                response: false
            };
        }
        let data = {};
        for (let [part, content] of response.bodyParts){
            let keyParts = part.split('.mime');
            if (keyParts.length === 1) {
                // content
                let key = keyParts[0];
                if (!data[key]) {
                    data[key] = {
                        content
                    };
                } else {
                    data[key].content = content;
                }
            } else if (keyParts.length === 2) {
                // header
                let key = keyParts[0];
                if (!data[key]) {
                    data[key] = {};
                }
                if (!data[key].meta) {
                    data[key].meta = {};
                }
                let headers = new Headers(content);
                let contentType = libmime.parseHeaderValue(headers.getFirst('Content-Type'));
                let transferEncoding = libmime.parseHeaderValue(headers.getFirst('Content-Transfer-Encoding'));
                let disposition = libmime.parseHeaderValue(headers.getFirst('Content-Disposition'));
                if (contentType.value.toLowerCase().trim()) {
                    data[key].meta.contentType = contentType.value.toLowerCase().trim();
                }
                if (contentType.params.charset) {
                    data[key].meta.charset = contentType.params.charset.toLowerCase().trim();
                }
                if (transferEncoding.value) {
                    data[key].meta.encoding = transferEncoding.value.replace(/\(.*\)/g, '').toLowerCase().trim();
                }
                if (disposition.value) {
                    data[key].meta.disposition = disposition.value.toLowerCase().trim() || false;
                    try {
                        data[key].meta.disposition = libmime.decodeWords(data[key].meta.disposition);
                    } catch  {
                    // failed to parse disposition, keep as is (most probably an unknown charset is used)
                    }
                }
                if (contentType.params.format && contentType.params.format.toLowerCase().trim() === 'flowed') {
                    data[key].meta.flowed = true;
                    if (contentType.params.delsp && contentType.params.delsp.toLowerCase().trim() === 'yes') {
                        data[key].meta.delSp = true;
                    }
                }
                let filename = disposition.params.filename || contentType.params.name || false;
                if (filename) {
                    try {
                        filename = libmime.decodeWords(filename);
                    } catch  {
                    // failed to parse filename, keep as is (most probably an unknown charset is used)
                    }
                    data[key].meta.filename = filename;
                }
            }
        }
        for (let part of Object.keys(data)){
            let meta = data[part].meta;
            switch(meta.encoding){
                case 'base64':
                    data[part].content = data[part].content ? libbase64.decode(data[part].content.toString()) : null;
                    break;
                case 'quoted-printable':
                    data[part].content = data[part].content ? libqp.decode(data[part].content.toString()) : null;
                    break;
                default:
            }
        }
        return data;
    }
    async run(command, ...args) {
        command = command.toUpperCase();
        if (!this.commands.has(command)) {
            return false;
        }
        if (!this.socket || this.socket.destroyed) {
            const error = new Error('Connection not available');
            error.code = 'NoConnection';
            throw error;
        }
        clearTimeout(this.idleStartTimer);
        if (typeof this.preCheck === 'function') {
            await this.preCheck();
        }
        let handler = this.commands.get(command);
        let result = await handler(this, ...args);
        if (command !== 'IDLE') {
            // do not autostart IDLE, if IDLE itself was stopped
            this.autoidle();
        }
        return result;
    }
    async processLocks() {
        // Atomic test-and-set to prevent race condition
        const wasProcessing = this.processingLock;
        if (wasProcessing) {
            // Another processor is already running, just exit
            this.log.trace({
                msg: 'Mailbox locking queued',
                path: this.mailbox && this.mailbox.path,
                pending: this.locks.length,
                idling: this.idling,
                activeLock: this.currentLock ? {
                    lockId: this.currentLock.lockId,
                    ...this.currentLock.options?.description && {
                        description: this.currentLock.options?.description
                    }
                } : null
            });
            return;
        }
        this.processingLock = true;
        try {
            // Process all locks in queue until empty
            let processedCount = 0;
            while(this.locks.length > 0){
                if (!this.locks.length) {
                    this.log.trace({
                        msg: 'Mailbox locking queue processed',
                        idling: this.idling
                    });
                    return;
                }
                // Yield to event loop periodically to prevent CPU blocking
                processedCount++;
                if (processedCount % 5 === 0) {
                    await new Promise((resolve)=>setImmediate(resolve));
                }
                const release = ()=>{
                    if (this.currentLock) {
                        this.log.trace({
                            msg: 'Mailbox lock released',
                            lockId: this.currentLock.lockId,
                            path: this.mailbox && this.mailbox.path,
                            pending: this.locks.length,
                            idling: this.idling
                        });
                        this.currentLock = false;
                    }
                    // Use setImmediate to avoid stack overflow
                    setImmediate(()=>{
                        this.processLocks().catch((err)=>this.log.error({
                                err,
                                cid: this.id
                            }));
                    });
                };
                const lock = this.locks.shift();
                const { resolve, reject, path, options, lockId } = lock;
                if (!this.usable || !this.socket || this.socket.destroyed) {
                    this.log.trace({
                        msg: 'Failed to acquire mailbox lock',
                        path,
                        lockId,
                        idling: this.idling
                    });
                    let error = new Error('Connection not available');
                    error.code = 'NoConnection';
                    reject(error);
                    continue; // Process next lock in queue
                }
                if (this.mailbox && this.mailbox.path === path && !!this.mailbox.readOnly === !!options.readOnly) {
                    // nothing to do here, already selected
                    this.log.trace({
                        msg: 'Mailbox lock acquired [existing]',
                        path,
                        lockId,
                        idling: this.idling,
                        ...options.description && {
                            description: options.description
                        }
                    });
                    this.currentLock = lock;
                    resolve({
                        path,
                        release
                    });
                    break; // Wait for this lock to be released
                } else {
                    try {
                        // Try to open. Throws if mailbox does not exists or can't open
                        await this.mailboxOpen(path, options);
                        this.log.trace({
                            msg: 'Mailbox lock acquired [selected]',
                            path,
                            lockId,
                            idling: this.idling,
                            ...options.description && {
                                description: options.description
                            }
                        });
                        this.currentLock = lock;
                        resolve({
                            path,
                            release
                        });
                        break; // Wait for this lock to be released
                    } catch (err) {
                        if (err.responseStatus === 'NO') {
                            try {
                                let folders = await this.run('LIST', '', path, {
                                    listOnly: true
                                });
                                if (!folders || !folders.length) {
                                    err.mailboxMissing = true;
                                }
                            } catch (E) {
                                this.log.trace({
                                    msg: 'Failed to verify failed mailbox',
                                    path,
                                    err: E
                                });
                            }
                        }
                        this.log.trace({
                            msg: 'Failed to acquire mailbox lock',
                            path,
                            lockId,
                            idling: this.idling,
                            ...options.description && {
                                description: options.description
                            },
                            err
                        });
                        reject(err);
                    // Continue to next lock in queue
                    }
                }
            }
        } finally{
            this.processingLock = false;
            // Check if new locks were added while we were processing
            if (this.locks.length && !this.currentLock) {
                // Process any remaining locks
                setImmediate(()=>{
                    this.processLocks().catch((err)=>this.log.error({
                            err,
                            cid: this.id
                        }));
                });
            }
        }
    }
    /**
     * Opens a mailbox if not already open and returns a lock. Next call to `getMailboxLock()` is queued
     * until previous lock is released. This is suggested over {@link module:imapflow~ImapFlow#mailboxOpen|mailboxOpen()} as
     * `getMailboxLock()` gives you a weak transaction while `mailboxOpen()` has no guarantees whatsoever that another
     * mailbox is opened while you try to call multiple fetch or store commands.
     *
     * @param {string|array} path **Path for the mailbox** to open
     * @param {Object} [options] optional options
     * @param {Boolean} [options.readOnly=false] If `true` then opens mailbox in read-only mode. You can still try to perform write operations but these would probably fail.
     * @returns {Promise<MailboxLockObject>} Mailbox lock
     * @throws Will throw an error if mailbox does not exist or can not be opened
     *
     * @example
     * let lock = await client.getMailboxLock('INBOX');
     * try {
     *   // do something in the mailbox
     * } finally {
     *   // use finally{} to make sure lock is released even if exception occurs
     *   lock.release();
     * }
     */ async getMailboxLock(path, options) {
        options = options || {};
        path = normalizePath(this, path);
        let lockId = ++this.lockCounter;
        this.log.trace({
            msg: 'Requesting lock',
            path,
            lockId,
            ...options.description && {
                description: options.description
            },
            activeLock: this.currentLock ? {
                lockId: this.currentLock.lockId,
                ...this.currentLock.options?.description && {
                    description: this.currentLock.options?.description
                }
            } : null
        });
        return await new Promise((resolve, reject)=>{
            this.locks.push({
                resolve,
                reject,
                path,
                options,
                lockId
            });
            this.processLocks().catch((err)=>reject(err));
        });
    }
    getLogger() {
        let mainLogger = this.options.logger && typeof this.options.logger === 'object' ? this.options.logger : logger.child({
            component: 'imap-connection',
            cid: this.id
        });
        let synteticLogger = {};
        let levels = [
            'trace',
            'debug',
            'info',
            'warn',
            'error',
            'fatal'
        ];
        for (let level of levels){
            synteticLogger[level] = (...args)=>{
                // using {logger:false} disables logging
                if (this.options.logger !== false) {
                    if (logger) if (typeof mainLogger[level] !== 'function') {
                        // we are checking to make sure the level is supported.
                        // if it isn't supported but the level is error or fatal, log to console anyway.
                        if (level === 'fatal' || level === 'error') {
                            console.log(JSON.stringify(...args));
                        }
                    } else {
                        mainLogger[level](...args);
                    }
                }
                if (this.emitLogs && args && args[0] && typeof args[0] === 'object') {
                    let logEntry = Object.assign({
                        level,
                        t: Date.now(),
                        cid: this.id,
                        lo: ++this.lo
                    }, args[0]);
                    if (logEntry.err && typeof logEntry.err === 'object') {
                        let err = logEntry.err;
                        logEntry.err = {
                            stack: err.stack
                        };
                        // enumerable error fields
                        Object.keys(err).forEach((key)=>{
                            logEntry.err[key] = err[key];
                        });
                    }
                    this.emit('log', logEntry);
                }
            };
        }
        return synteticLogger;
    }
    unbind() {
        this.socket.unpipe(this.streamer);
        if (this._inflate) {
            this._inflate.unpipe(this.streamer);
        }
        this.socket.removeListener('error', this._socketError);
        this.socket.removeListener('close', this._socketClose);
        this.socket.removeListener('end', this._socketEnd);
        this.socket.removeListener('tlsClientError', this._socketError);
        this.socket.removeListener('timeout', this._socketTimeout);
        return {
            readSocket: this._inflate || this.socket,
            writeSocket: this.writeSocket || this.socket
        };
    }
}
/**
 * Connection close event. **NB!** ImapFlow does not handle reconnects automatically.
 * So whenever a 'close' event occurs you must create a new connection yourself.
 *
 * @event module:imapflow~ImapFlow#close
 */ /**
 * Error event. In most cases getting an error event also means that connection is closed
 * and pending operations should return with a failure.
 *
 * @event module:imapflow~ImapFlow#error
 * @type {Error}
 * @example
 * client.on('error', err=>{
 *     console.log(`Error occurred: ${err.message}`);
 * });
 */ /**
 * Message count in currently opened mailbox changed
 *
 * @event module:imapflow~ImapFlow#exists
 * @type {Object}
 * @property {String} path mailbox path this event applies to
 * @property {Number} count updated count of messages
 * @property {Number} prevCount message count before this update
 * @example
 * client.on('exists', data=>{
 *     console.log(`Message count in "${data.path}" is ${data.count}`);
 * });
 */ /**
 * Deleted message sequence number in currently opened mailbox. One event is fired for every deleted email.
 *
 * @event module:imapflow~ImapFlow#expunge
 * @type {Object}
 * @property {String} path mailbox path this event applies to
 * @property {Number} seq sequence number of deleted message
 * @example
 * client.on('expunge', data=>{
 *     console.log(`Message #${data.seq} was deleted from "${data.path}"`);
 * });
 */ /**
 * Flags were updated for a message. Not all servers fire this event.
 *
 * @event module:imapflow~ImapFlow#flags
 * @type {Object}
 * @property {String} path mailbox path this event applies to
 * @property {Number} seq sequence number of updated message
 * @property {Number} [uid] UID number of updated message (if server provided this value)
 * @property {BigInt} [modseq] Updated modseq number for the mailbox (if server provided this value)
 * @property {Set<string>} flags A set of all flags for the updated message
 * @example
 * client.on('flags', data=>{
 *     console.log(`Flag set for #${data.seq} is now "${Array.from(data.flags).join(', ')}"`);
 * });
 */ /**
 * Mailbox was opened
 *
 * @event module:imapflow~ImapFlow#mailboxOpen
 * @type {MailboxObject}
 * @example
 * client.on('mailboxOpen', mailbox => {
 *     console.log(`Mailbox ${mailbox.path} was opened`);
 * });
 */ /**
 * Mailbox was closed
 *
 * @event module:imapflow~ImapFlow#mailboxClose
 * @type {MailboxObject}
 * @example
 * client.on('mailboxClose', mailbox => {
 *     console.log(`Mailbox ${mailbox.path} was closed`);
 * });
 */ /**
 * Log event if `emitLogs=true`
 *
 * @event module:imapflow~ImapFlow#log
 * @type {Object}
 * @example
 * client.on('log', entry => {
 *     console.log(`${log.cid} ${log.msg}`);
 * });
 */ module.exports.ImapFlow = ImapFlow;
}),
];

//# sourceMappingURL=db418_imapflow_2c2aea04._.js.map