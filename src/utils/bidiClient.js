/**
 * Bidirectional HTTP/2 Client for Cursor Agent Mode
 * 
 * Port of cursor_bidi_client.py to Node.js.
 * Uses Node's http2 module for true bidirectional streaming.
 * 
 * Related analysis documents:
 * - TASK-26-tool-schemas.md: ClientSideToolV2Call/Result protobuf schemas
 * - TASK-43-sse-poll-fallback.md: HTTP/2, SSE, and polling mechanisms  
 * - TASK-110-tool-enum-mapping.md: Tool enum definitions and mappings
 * - TASK-7-protobuf-schemas.md: Request schema (isAgentic, supportedTools)
 */

const http2 = require('http2');
const zlib = require('zlib');
const { v4: uuidv4, v5: uuidv5 } = require('uuid');
const { EventEmitter } = require('events');
const $root = require('../proto/message.js');
let _config = null;
function getConfig() { if (!_config) _config = require('../config/config'); return _config; }
const {
  generateCursorChecksum,
  generateHashed64Hex,
  ClientSideToolV2,
  DEFAULT_AGENT_TOOLS,
} = require('./utils.js');
const { ToolExecutor } = require('./toolExecutor.js');

/**
 * Protobuf wire format decoder - ported from cursor_chat_proto.py
 * See TASK-7-protobuf-schemas.md for schema documentation.
 */
class ProtobufDecoder {
  static decodeVarint(data, pos) {
    let result = 0;
    let shift = 0;
    while (pos < data.length) {
      const b = data[pos];
      result |= (b & 0x7F) << shift;
      pos++;
      if (!(b & 0x80)) break;
      shift += 7;
    }
    return [result, pos];
  }

  static decodeField(data, pos) {
    if (pos >= data.length) return [null, null, null, pos];
    
    const [tag, newPos] = this.decodeVarint(data, pos);
    pos = newPos;
    const fieldNum = tag >> 3;
    const wireType = tag & 0x07;
    
    let value;
    if (wireType === 0) { // Varint
      [value, pos] = this.decodeVarint(data, pos);
    } else if (wireType === 1) { // Fixed64
      value = data.readBigUInt64LE(pos);
      pos += 8;
    } else if (wireType === 2) { // Length-delimited
      const [length, newPos2] = this.decodeVarint(data, pos);
      pos = newPos2;
      value = data.slice(pos, pos + length);
      pos += length;
    } else if (wireType === 5) { // Fixed32
      value = data.readUInt32LE(pos);
      pos += 4;
    } else {
      value = null;
    }
    
    return [fieldNum, wireType, value, pos];
  }

  static decodeMessage(data) {
    const fields = {};
    let pos = 0;
    while (pos < data.length) {
      const [fieldNum, wireType, value, newPos] = this.decodeField(data, pos);
      if (fieldNum === null) break;
      pos = newPos;
      if (!fields[fieldNum]) fields[fieldNum] = [];
      fields[fieldNum].push([wireType, value]);
    }
    return fields;
  }

  static getString(fields, fieldNum) {
    if (fields[fieldNum]) {
      for (const [wireType, value] of fields[fieldNum]) {
        if (wireType === 2 && Buffer.isBuffer(value)) {
          try {
            return value.toString('utf-8');
          } catch (e) {}
        }
      }
    }
    return null;
  }

  static getInt(fields, fieldNum) {
    if (fields[fieldNum]) {
      for (const [wireType, value] of fields[fieldNum]) {
        if (wireType === 0) return value;
      }
    }
    return null;
  }

  static getBytes(fields, fieldNum) {
    if (fields[fieldNum]) {
      for (const [wireType, value] of fields[fieldNum]) {
        if (wireType === 2) return value;
      }
    }
    return null;
  }
}

/**
 * Tool call decoder - ported from cursor_chat_proto.py
 * Based on TASK-26-tool-schemas.md ClientSideToolV2Call
 */
class ToolCallDecoder {
  static FIELD_TOOL = 1;
  static FIELD_TOOL_CALL_ID = 3;
  static FIELD_NAME = 9;
  static FIELD_RAW_ARGS = 10;

  static findToolCalls(data) {
    const toolCalls = [];
    
    try {
      const fields = ProtobufDecoder.decodeMessage(data);
      
      // Look for nested messages that might contain tool calls
      for (const [fieldNum, values] of Object.entries(fields)) {
        for (const [wireType, value] of values) {
          if (wireType === 2 && Buffer.isBuffer(value) && value.length > 10) {
            try {
              const nested = ProtobufDecoder.decodeMessage(value);
              const toolCall = this._extractToolCall(nested);
              if (toolCall) toolCalls.push(toolCall);
              
              // Also check nested messages within
              for (const [nf, nv] of Object.entries(nested)) {
                for (const [nwt, nval] of nv) {
                  if (nwt === 2 && Buffer.isBuffer(nval) && nval.length > 10) {
                    try {
                      const deep = ProtobufDecoder.decodeMessage(nval);
                      const tc = this._extractToolCall(deep);
                      if (tc) toolCalls.push(tc);
                    } catch (e) {}
                  }
                }
              }
            } catch (e) {}
          }
        }
      }
    } catch (e) {}
    
    return toolCalls;
  }

  // Tool-specific param field numbers (from cursor_tool_manifest_v3_0_9.json)
  static TOOL_PARAM_FIELDS = {
    38: 12,  // EDIT_FILE_V2 -> editToolCall at field 12
    40: 8,   // READ_FILE_V2 -> readToolCall at field 8
    39: 14,  // LIST_DIR_V2 -> listDirToolCall at field 14
  };

  static _extractToolCall(fields) {
    const tool = ProtobufDecoder.getInt(fields, this.FIELD_TOOL);
    const toolCallId = ProtobufDecoder.getString(fields, this.FIELD_TOOL_CALL_ID);
    const name = ProtobufDecoder.getString(fields, this.FIELD_NAME);
    let rawArgs = ProtobufDecoder.getString(fields, this.FIELD_RAW_ARGS);

    // For V2 tools, the args may be in a tool-specific field, not field 10
    if (tool !== null && this.TOOL_PARAM_FIELDS[tool]) {
      const paramField = this.TOOL_PARAM_FIELDS[tool];
      const paramBytes = ProtobufDecoder.getBytes(fields, paramField);
      if (paramBytes) {
        // Try to extract string content from nested message
        try {
          const paramFields = ProtobufDecoder.decodeMessage(paramBytes);
          // Field 1 is typically the main content (patch text, file path, etc.)
          const content = ProtobufDecoder.getString(paramFields, 1);
          if (content && content.length > (rawArgs || '').length) {
            rawArgs = content;
          }
        } catch (e) {
          // Fall back to raw string extraction
          const str = paramBytes.toString('utf-8');
          if (str && str.length > (rawArgs || '').length) {
            rawArgs = str;
          }
        }
      }
    }

    if (tool !== null && tool > 0 && toolCallId) {
      return { tool, toolCallId, name: name || '', rawArgs: rawArgs || '' };
    }
    return null;
  }
}

/**
 * Response decoder for StreamUnifiedChatResponse
 * 
 * Actual wire format observed:
 * - Field 2: nested Message containing:
 *   - Field 1: content (string)
 *   - Field 25: thinking (nested message with content at field 1)
 *   - Field 22, 27: UUIDs
 */
class ResponseDecoder {
  static FIELD_MESSAGE = 2;
  static FIELD_CONTENT = 1;
  static FIELD_THINKING = 25;

  static decode(data) {
    try {
      const fields = ProtobufDecoder.decodeMessage(data);
      
      // Try direct text at field 1 first (TASK-7 schema)
      let text = ProtobufDecoder.getString(fields, this.FIELD_CONTENT);
      let thinking = null;
      
      // If no direct text, check nested message at field 2
      if (!text) {
        const messageBytes = ProtobufDecoder.getBytes(fields, this.FIELD_MESSAGE);
        if (messageBytes) {
          try {
            const messageFields = ProtobufDecoder.decodeMessage(messageBytes);
            text = ProtobufDecoder.getString(messageFields, this.FIELD_CONTENT);
            
            // Get thinking from nested message
            const thinkingBytes = ProtobufDecoder.getBytes(messageFields, this.FIELD_THINKING);
            if (thinkingBytes) {
              const thinkingFields = ProtobufDecoder.decodeMessage(thinkingBytes);
              thinking = ProtobufDecoder.getString(thinkingFields, 1);
            }
          } catch (e) {}
        }
      }
      
      return { text, thinking };
    } catch (e) {
      return { text: null, thinking: null };
    }
  }
}

// Protobuf encoder helper
class ProtobufEncoder {
  static encodeVarint(value) {
    const bytes = [];
    value = value >>> 0; // Convert to unsigned
    while (value > 0x7f) {
      bytes.push((value & 0x7f) | 0x80);
      value >>>= 7;
    }
    bytes.push(value & 0x7f);
    return Buffer.from(bytes.length ? bytes : [0]);
  }

  static encodeField(fieldNumber, wireType, value) {
    const tag = (fieldNumber << 3) | wireType;
    const tagBuf = this.encodeVarint(tag);
    
    if (wireType === 0) {
      // Varint
      return Buffer.concat([tagBuf, this.encodeVarint(value)]);
    } else if (wireType === 2) {
      // Length-delimited
      const data = typeof value === 'string' ? Buffer.from(value, 'utf-8') : value;
      return Buffer.concat([tagBuf, this.encodeVarint(data.length), data]);
    }
    return tagBuf;
  }
}

/**
 * Stream state tracker
 */
class StreamState {
  constructor(streamId) {
    this.streamId = streamId;
    this.headersSent = false;
    this.headersReceived = false;
    this.bodyBuffer = Buffer.alloc(0);
    this.responseHeaders = {};
    this.ended = false;
  }
}

/**
 * Bidirectional HTTP/2 Client for Cursor Agent Mode
 */
class BidiCursorClient extends EventEmitter {
  static BASE_URL = 'api2.cursor.sh';
  static PORT = 443;

  constructor(workspaceRoot = process.cwd()) {
    super();
    this.workspaceRoot = workspaceRoot;
    this.toolExecutor = new ToolExecutor(workspaceRoot);
    this.session = null;
    this.streams = new Map();
  }

  /**
   * Connect to Cursor API
   */
  connect() {
    return new Promise((resolve, reject) => {
      this.session = http2.connect(`https://${BidiCursorClient.BASE_URL}:${BidiCursorClient.PORT}`, {
        // Settings
      });

      this.session.on('error', (err) => {
        console.error('HTTP/2 session error:', err.message);
        reject(err);
      });

      this.session.on('connect', () => {
        resolve(true);
      });

      this.session.on('goaway', () => {
        console.log('Server sent GOAWAY');
      });

      // Connection timeout
      const timeout = setTimeout(() => {
        if (!this.session || this.session.destroyed) {
          reject(new Error('Connection timeout'));
        }
      }, 10000);

      this.session.once('connect', () => clearTimeout(timeout));
    });
  }

  /**
   * Close the session
   */
  close() {
    if (this.session && !this.session.destroyed) {
      this.session.close();
    }
    this.session = null;
    this.streams.clear();
  }

  /**
   * Generate HTTP/2 headers for request
   */
  getHeaders(authToken) {
    const sessionId = uuidv5(authToken, uuidv5.DNS);
    const clientKey = generateHashed64Hex(authToken);
    const checksum = generateCursorChecksum(authToken);

    const requestId = uuidv4();
    return {
      ':method': 'POST',
      ':path': '/aiserver.v1.ChatService/StreamUnifiedChatWithTools',
      ':authority': BidiCursorClient.BASE_URL,
      ':scheme': 'https',
      'authorization': `Bearer ${authToken}`,
      'connect-accept-encoding': 'gzip',
      'connect-protocol-version': '1',
      'content-type': 'application/connect+proto',
      'user-agent': 'connect-es/1.6.1',
      'x-amzn-trace-id': `Root=${requestId}`,
      'x-client-key': clientKey,
      'x-cursor-checksum': checksum,
      'x-cursor-client-version': getConfig().cursorVersion,
      'x-cursor-client-type': 'ide',
      'x-cursor-client-os': getConfig().clientOs,
      'x-cursor-client-arch': getConfig().clientArch,
      'x-cursor-client-os-version': getConfig().clientOsVersion,
      'x-cursor-client-device-type': 'desktop',
      'x-cursor-config-version': uuidv4(),
      'x-cursor-timezone': Intl.DateTimeFormat().resolvedOptions().timeZone,
      'x-ghost-mode': getConfig().ghostMode ? 'true' : 'false',
      'x-new-onboarding-completed': 'false',
      'x-request-id': requestId,
      'x-session-id': sessionId,
    };
  }

  /**
   * Frame a message with ConnectRPC envelope (1 byte flags + 4 bytes length)
   */
  frameMessage(data, compress = false) {
    const flags = compress ? 0x01 : 0x00;
    const frame = Buffer.alloc(5 + data.length);
    frame[0] = flags;
    frame.writeUInt32BE(data.length, 1);
    data.copy(frame, 5);
    return frame;
  }

  /**
   * Parse ConnectRPC frames from data
   */
  parseFrames(data) {
    const frames = [];
    let offset = 0;
    
    while (offset + 5 <= data.length) {
      const flags = data[offset];
      const length = data.readUInt32BE(offset + 1);
      
      if (offset + 5 + length > data.length) break;
      
      const payload = data.slice(offset + 5, offset + 5 + length);
      const compressed = !!(flags & 0x01);
      frames.push({ compressed, payload });
      offset += 5 + length;
    }
    
    return { frames, remaining: data.slice(offset) };
  }

  /**
   * Encode agent request body using protobufjs
   */
  encodeAgentRequest(messages, modelName, supportedTools = DEFAULT_AGENT_TOOLS) {
    const formattedMessages = messages.map(msg => ({
      content: msg.content,
      role: msg.role === 'user' ? 1 : 2,
      messageId: uuidv4(),
    }));

    const messageIds = formattedMessages.map(msg => ({
      role: msg.role,
      messageId: msg.messageId,
    }));

    const body = {
      request: {
        messages: formattedMessages,
        unknown2: 1,
        instruction: { instruction: '' },
        unknown4: 1,
        model: { name: modelName, empty: '' },
        webTool: '',
        unknown13: 1,
        cursorSetting: {
          name: 'cursor\\aisettings',
          unknown3: '',
          unknown6: { unknwon1: '', unknown2: '' },
          unknown8: 1,
          unknown9: 1,
        },
        unknown19: 1,
        conversationId: uuidv4(),
        metadata: {
          os: getConfig().clientOs,
          arch: getConfig().clientArch,
          version: getConfig().clientOsVersion,
          path: process.execPath,
          timestamp: new Date().toISOString(),
        },
        isAgentic: true,
        supportedTools: supportedTools,
        messageIds: messageIds,
        largeContext: 0,
        unknown38: 0,
        // 2.6.22 request-level fields
        chatModeEnum: 3, // Agent
        unknown47: "",
        unknown48: 0,
        unknown49: 0,
        unknown51: 0,
        unknown53: 1,
        chatMode: "Agent",
      }
    };

    const errMsg = $root.StreamUnifiedChatWithToolsRequest.verify(body);
    if (errMsg) throw new Error(errMsg);

    const instance = $root.StreamUnifiedChatWithToolsRequest.create(body);
    const buffer = $root.StreamUnifiedChatWithToolsRequest.encode(instance).finish();
    
    return this.frameMessage(Buffer.from(buffer));
  }

  /**
   * Encode tool result for sending back
   * Based on TASK-26-tool-schemas.md ClientSideToolV2Result
   */
  encodeToolResult(tool, toolCallId, result) {
    // Build ClientSideToolV2Result message
    let resultMsg = Buffer.alloc(0);
    
    // Field 1: tool (varint)
    resultMsg = Buffer.concat([resultMsg, ProtobufEncoder.encodeField(1, 0, tool)]);
    
    // Field 35: tool_call_id (string)
    resultMsg = Buffer.concat([resultMsg, ProtobufEncoder.encodeField(35, 2, toolCallId)]);
    
    // Tool-specific result field
    const resultFieldNum = this.getResultFieldNumber(tool);
    const resultData = this.encodeToolSpecificResult(tool, result);
    resultMsg = Buffer.concat([resultMsg, ProtobufEncoder.encodeField(resultFieldNum, 2, resultData)]);
    
    return resultMsg;
  }

  /**
   * Get result field number for tool type
   * Based on TASK-26-tool-schemas.md result oneof
   */
  getResultFieldNumber(tool) {
    const map = {
      [ClientSideToolV2.READ_SEMSEARCH_FILES]: 2,
      [ClientSideToolV2.RIPGREP_SEARCH]: 4,
      [ClientSideToolV2.READ_FILE]: 6,
      [ClientSideToolV2.LIST_DIR]: 9,
      [ClientSideToolV2.EDIT_FILE]: 10,
      [ClientSideToolV2.FILE_SEARCH]: 11,
      [ClientSideToolV2.SEMANTIC_SEARCH_FULL]: 18,
      [ClientSideToolV2.DELETE_FILE]: 20,
      [ClientSideToolV2.REAPPLY]: 21,
      [ClientSideToolV2.RUN_TERMINAL_COMMAND_V2]: 24,
      [ClientSideToolV2.FETCH_RULES]: 25,
      [ClientSideToolV2.WEB_SEARCH]: 27,
      [ClientSideToolV2.MCP]: 28,
      [ClientSideToolV2.SEARCH_SYMBOLS]: 32,
      [ClientSideToolV2.GO_TO_DEFINITION]: 40,
      [ClientSideToolV2.GLOB_FILE_SEARCH]: 51,
    };
    return map[tool] || 6; // Default to read_file_result
  }

  /**
   * Encode tool-specific result
   * Note: toolExecutor returns { success, data, error }, extract data for encoding
   */
  encodeToolSpecificResult(tool, result) {
    // Extract actual data from result object
    const data = result.data || result;
    
    switch (tool) {
      case ClientSideToolV2.LIST_DIR: {
        // ListDirResult: repeated File files = 1
        let msg = Buffer.alloc(0);
        const files = data.files || data.entries || [];
        for (const file of files) {
          // File message: string name = 1, bool is_dir = 2
          let fileMsg = Buffer.alloc(0);
          fileMsg = Buffer.concat([fileMsg, ProtobufEncoder.encodeField(1, 2, file.name || file)]);
          const isDir = file.is_dir !== undefined ? file.is_dir : file.is_directory;
          if (isDir !== undefined) {
            fileMsg = Buffer.concat([fileMsg, ProtobufEncoder.encodeField(2, 0, isDir ? 1 : 0)]);
          }
          msg = Buffer.concat([msg, ProtobufEncoder.encodeField(1, 2, fileMsg)]);
        }
        return msg;
      }
      
      case ClientSideToolV2.READ_FILE: {
        // ReadFileResult: string content = 1
        return ProtobufEncoder.encodeField(1, 2, data.content || data.contents || '');
      }
      
      case ClientSideToolV2.RUN_TERMINAL_COMMAND_V2: {
        // RunTerminalCommandV2Result: string output = 1, int32 exit_code = 2
        let msg = Buffer.alloc(0);
        // toolExecutor returns { output, exit_code } or { stdout, stderr, exit_code }
        const output = data.output || ((data.stdout || '') + (data.stderr || ''));
        msg = Buffer.concat([msg, ProtobufEncoder.encodeField(1, 2, output)]);
        msg = Buffer.concat([msg, ProtobufEncoder.encodeField(2, 0, data.exit_code || 0)]);
        return msg;
      }
      
      case ClientSideToolV2.EDIT_FILE: {
        // EditFileResult: bool success = 1, string message = 2
        let msg = Buffer.alloc(0);
        msg = Buffer.concat([msg, ProtobufEncoder.encodeField(1, 0, result.success ? 1 : 0)]);
        if (data.message) {
          msg = Buffer.concat([msg, ProtobufEncoder.encodeField(2, 2, data.message)]);
        }
        return msg;
      }
      
      case ClientSideToolV2.RIPGREP_SEARCH: {
        // RipgrepSearchResult with nested structure
        let msg = Buffer.alloc(0);
        const matches = data.matches || [];
        msg = Buffer.concat([msg, ProtobufEncoder.encodeField(1, 2, JSON.stringify({ results: matches }))]);
        return msg;
      }
      
      case ClientSideToolV2.FILE_SEARCH:
      case ClientSideToolV2.GLOB_FILE_SEARCH: {
        // ToolCallFileSearchResult: repeated FileSearchMatch results = 1
        let msg = Buffer.alloc(0);
        const files = data.files || data.results || [];
        for (const file of files) {
          // FileSearchMatch: string uri = 1
          const matchMsg = ProtobufEncoder.encodeField(1, 2, file.uri || file);
          msg = Buffer.concat([msg, ProtobufEncoder.encodeField(1, 2, matchMsg)]);
        }
        return msg;
      }
      
      case ClientSideToolV2.DELETE_FILE: {
        // DeleteFileResult: bool success = 1
        return ProtobufEncoder.encodeField(1, 0, result.success ? 1 : 0);
      }
      
      default:
        // Generic: encode as JSON string
        return ProtobufEncoder.encodeField(1, 2, JSON.stringify(data));
    }
  }

  /**
   * Encode tool result message wrapped for sending
   */
  encodeToolResultMessage(tool, toolCallId, result) {
    // StreamUnifiedChatRequestWithTools field 2: client_side_tool_v2_result
    const resultBytes = this.encodeToolResult(tool, toolCallId, result);
    return ProtobufEncoder.encodeField(2, 2, resultBytes);
  }

  /**
   * Parse tool call from response data
   * Based on TASK-26-tool-schemas.md ClientSideToolV2Call
   */
  parseToolCall(data) {
    const text = data.toString('utf-8');
    
    // Look for tool call ID pattern
    const idMatch = text.match(/toolu_bdrk_[a-zA-Z0-9]{20,30}/);
    if (!idMatch) return null;
    
    const toolCallId = idMatch[0];
    
    // Tool name to enum mapping (from TASK-110-tool-enum-mapping.md)
    const nameToEnum = {
      'list_dir': ClientSideToolV2.LIST_DIR,
      'read_file': ClientSideToolV2.READ_FILE,
      'edit_file': ClientSideToolV2.EDIT_FILE,
      'grep_search': ClientSideToolV2.RIPGREP_SEARCH,
      'ripgrep_search': ClientSideToolV2.RIPGREP_SEARCH,
      'run_terminal_cmd': ClientSideToolV2.RUN_TERMINAL_COMMAND_V2,
      'run_terminal_command': ClientSideToolV2.RUN_TERMINAL_COMMAND_V2,
      'file_search': ClientSideToolV2.FILE_SEARCH,
      'glob_file_search': ClientSideToolV2.GLOB_FILE_SEARCH,
      'delete_file': ClientSideToolV2.DELETE_FILE,
      'web_search': ClientSideToolV2.WEB_SEARCH,
      'codebase_search': ClientSideToolV2.SEMANTIC_SEARCH_FULL,
    };
    
    // Find tool name in text
    let toolName = null;
    let toolEnum = 0;
    for (const [name, enumVal] of Object.entries(nameToEnum)) {
      if (text.includes(name)) {
        toolName = name;
        toolEnum = enumVal;
        break;
      }
    }
    
    if (!toolName) return null;
    
    // Look for JSON params
    const paramKeys = [
      'command', 'relative_workspace_path', 'query', 'pattern',
      'search_term', 'directory_path', 'path', 'content',
    ];
    
    const jsonRegex = new RegExp(
      `\\{[^{}]*"(${paramKeys.join('|')})"[^{}]*\\}`,
      'i'
    );
    
    const jsonMatch = text.match(jsonRegex);
    if (!jsonMatch) return null;
    
    let params = {};
    try {
      params = JSON.parse(jsonMatch[0]);
    } catch (e) {
      return null;
    }
    
    return {
      tool: toolEnum,
      toolCallId,
      name: toolName,
      rawArgs: jsonMatch[0],
      params,
    };
  }

  /**
   * Open an agent bidi stream without starting the tool execution loop.
   * Returns { stream } for the caller to manage.
   */
  async openAgentStream(authToken, messages, model, supportedTools = DEFAULT_AGENT_TOOLS) {
    await this.connect();
    const headers = this.getHeaders(authToken);
    const stream = this.session.request(headers);
    const requestBody = this.encodeAgentRequest(messages, model, supportedTools);
    stream.write(requestBody);
    return { stream };
  }

  /**
   * Encode and write a tool result frame onto an open bidi stream.
   */
  sendToolResultOnStream(stream, toolEnum, toolCallId, resultData) {
    const resultBytes = this.encodeToolResultMessage(toolEnum, toolCallId, resultData);
    const framed = this.frameMessage(resultBytes);
    stream.write(framed);
  }

  /**
   * Pull the next batch of parsed frames from a bidi stream.
   * Resolves with { toolCalls: [], textChunks: [], ended: bool }.
   * Waits up to batchDelayMs after last data for more tool calls in the same batch.
   */
  readNextFrames(stream, existingBuffer = Buffer.alloc(0), { batchDelayMs = 800, timeoutMs = 120000 } = {}) {
    return new Promise((resolve) => {
      let buffer = existingBuffer;
      const toolCalls = [];
      const textChunks = [];
      const toolCallsSeen = new Set();
      let ended = false;
      let finished = false;
      let settleTimer = null;  // short timer to batch tool calls arriving together
      let totalTimer = null;
      let textIdleTimer = null;
      let pendingPatchCall = null;

      const startTime = Date.now();

      const finish = (reason) => {
        if (finished) return;
        finished = true;
        const elapsed = Date.now() - startTime;
        console.log(`[readNextFrames] resolved in ${elapsed}ms reason=${reason} tools=${toolCalls.length} text=${textChunks.length} ended=${ended}`);
        clearTimeout(settleTimer);
        clearTimeout(textIdleTimer);
        clearTimeout(totalTimer);
        stream.removeListener('data', onData);
        stream.removeListener('end', onEnd);
        stream.removeListener('close', onEnd);
        // Flush any buffered patch before finishing
        if (pendingPatchCall) {
          console.log('[EDIT_FILE_V2 flush on finish]:', pendingPatchCall.rawArgs.substring(0, 300));
          let params = {};
          try { params = JSON.parse(pendingPatchCall.rawArgs); } catch (e) {}
          toolCalls.push({ ...pendingPatchCall, params });
          pendingPatchCall = null;
        }
        resolve({ toolCalls, textChunks, ended, buffer });
      };

      // Resolve strategy:
      // 1. Tool calls found -> settle for batchDelayMs then finish (to batch concurrent calls)
      // 2. Stream end/close -> finish immediately
      // 3. Text idle: 15s of silence after receiving text (model done talking, no tool call coming)
      // 4. Total timeout -> finish
      // Key: do NOT resolve after just 2s of silence - model needs time to produce tool calls.
      const TEXT_IDLE_MS = 5000; // safety net; stream_end resolves faster in practice

      const scheduleSettleIfToolCalls = () => {
        if (toolCalls.length > 0) {
          clearTimeout(settleTimer);
          clearTimeout(textIdleTimer);
          settleTimer = setTimeout(() => finish('tool_settle'), batchDelayMs);
        }
      };

      const resetTextIdle = () => {
        if (toolCalls.length > 0) return; // already settling on tool calls
        clearTimeout(textIdleTimer);
        if (textChunks.length > 0 && !pendingPatchCall) {
          textIdleTimer = setTimeout(() => finish('text_idle_15s'), TEXT_IDLE_MS);
        }
      };

      totalTimer = setTimeout(() => {
        ended = true;
        finish('total_timeout');
      }, timeoutMs);

      // EDIT_FILE_V2 streams the patch: rawArgs has the header,
      // subsequent text frames have the hunk lines (@@, -, +, *** End Patch).
      const flushPendingPatch = () => {
        if (!pendingPatchCall) return;
        console.log('[EDIT_FILE_V2 flush]:', pendingPatchCall.rawArgs.substring(0, 300));
        let params = {};
        try { params = JSON.parse(pendingPatchCall.rawArgs); } catch (e) {}
        toolCalls.push({ ...pendingPatchCall, params });
        pendingPatchCall = null;
      };

      const onData = (chunk) => {
        buffer = Buffer.concat([buffer, chunk]);
        const { frames, remaining } = this.parseFrames(buffer);
        buffer = remaining;

        for (const { compressed, payload } of frames) {
          let data = payload;
          if (compressed) {
            try { data = zlib.gunzipSync(payload); } catch (e) { data = payload; }
          }

          // Check for tool calls
          const tcs = ToolCallDecoder.findToolCalls(data);

          if (tcs.length > 0 && pendingPatchCall) {
            // Check if follow-up has complete patch
            for (const tc of tcs) {
              if (tc.tool === 38 && tc.rawArgs && tc.rawArgs.includes('*** End Patch')) {
                // Complete patch arrived! Use this one instead
                console.log('[EDIT_FILE_V2 complete patch received]:', tc.rawArgs.substring(0, 200));
                pendingPatchCall.rawArgs = tc.rawArgs;
                flushPendingPatch();
              }
            }
            if (pendingPatchCall) flushPendingPatch(); // flush if still pending
          }

          for (const tc of tcs) {
            if (!toolCallsSeen.has(tc.toolCallId)) {
              toolCallsSeen.add(tc.toolCallId);
              if (!tc.name && !tc.rawArgs) continue;

              if (tc.tool === 38 && tc.rawArgs && tc.rawArgs.includes('*** Begin Patch') && !tc.rawArgs.includes('*** End Patch')) {
                // EDIT_FILE_V2 header only - ACK to Cursor and wait for complete patch
                console.log('[EDIT_FILE_V2 header, ACKing and waiting for complete patch]');
                pendingPatchCall = tc;
                // Send ACK with is_applied=true so Cursor sends the complete patch
                // Note: this uses the old EditFileResult format (field 2 = is_applied)
                // because Cursor's ACK handler checks this specific field to trigger
                // sending the complete patch with @@ hunks.
                let er = ProtobufEncoder.encodeField(2, 0, 1); // is_applied = true
                let rm = Buffer.concat([
                  ProtobufEncoder.encodeField(1, 0, 38),
                  ProtobufEncoder.encodeField(35, 2, tc.toolCallId),
                  ProtobufEncoder.encodeField(10, 2, er),
                ]);
                const wrapped = ProtobufEncoder.encodeField(2, 2, rm);
                stream.write(this.frameMessage(wrapped));
                continue;
              }
              let params = {};
              try { if (tc.rawArgs) params = JSON.parse(tc.rawArgs); } catch (e) {}
              toolCalls.push({ ...tc, params });
            }
          }

          // Extract text content from non-tool-call frames
          if (tcs.length === 0) {
            const resp = ResponseDecoder.decode(data);
            if (resp.text) {
              if (pendingPatchCall) {
                // Append streamed text to patch rawArgs
                pendingPatchCall.rawArgs += resp.text;
                if (pendingPatchCall.rawArgs.includes('*** End Patch')) {
                  flushPendingPatch();
                }
              } else {
                textChunks.push(resp.text);
              }
            }
          }
        }

        scheduleSettleIfToolCalls();
        resetTextIdle();
      };

      const onEnd = () => {
        ended = true;
        finish('stream_end');
      };

      stream.on('data', onData);
      stream.on('end', onEnd);
      stream.on('close', onEnd);
    });
  }

  /**
   * Run agent with bidirectional streaming (legacy convenience method).
   * Returns a promise that resolves with the full response.
   */
  async runAgent(authToken, prompt, model = 'claude-4-sonnet', options = {}) {
    const { 
      maxToolCalls = 10, 
      verbose = false,
      supportedTools = DEFAULT_AGENT_TOOLS,
      timeout = 60000,
      onContent = null,  // Callback for streaming content
    } = options;

    // Connect
    await this.connect();

    return new Promise((resolve, reject) => {
      const headers = this.getHeaders(authToken);
      const stream = this.session.request(headers);
      
      // Track state
      let fullResponse = '';
      const toolCallsSeen = new Set();
      let toolCallsExecuted = 0;
      let buffer = Buffer.alloc(0);
      let lastActivity = Date.now();
      
      // Activity-based timeout (shorter for inactivity)
      const inactivityTimeout = 5000; // 5 seconds of no activity = done
      const timeoutInterval = setInterval(() => {
        const timeSinceActivity = Date.now() - lastActivity;
        if (timeSinceActivity > inactivityTimeout) {
          clearInterval(timeoutInterval);
          if (verbose) {
            console.log(`\n[Inactivity timeout after ${timeSinceActivity}ms]`);
          }
          stream.close();
          resolve(fullResponse);
        } else if (timeSinceActivity > timeout) {
          clearInterval(timeoutInterval);
          if (verbose) {
            console.log(`\n[Total timeout]`);
          }
          stream.close();
          resolve(fullResponse);
        }
      }, 500);

      // Send initial request
      const messages = [{ role: 'user', content: prompt }];
      const requestBody = this.encodeAgentRequest(messages, model, supportedTools);
      stream.write(requestBody);
      
      if (verbose) {
        console.log(`Agent mode (bidi) with model: ${model}`);
        console.log(`Sent initial request (${requestBody.length} bytes)`);
      }

      // Handle response data
      stream.on('data', async (chunk) => {
        lastActivity = Date.now();
        buffer = Buffer.concat([buffer, chunk]);
        if (verbose) console.log(`[Received ${chunk.length} bytes, buffer: ${buffer.length}]`);
        
        // Parse frames
        const { frames, remaining } = this.parseFrames(buffer);
        buffer = remaining;
        
        for (const { compressed, payload } of frames) {
          // Decompress if needed
          let data = payload;
          if (compressed) {
            try {
              data = zlib.gunzipSync(payload);
            } catch (e) {
              data = payload;
            }
          }
          
          // Use proper protobuf decoding - ported from cursor_chat_proto.py
          // See TASK-7-protobuf-schemas.md for schema
          
          // 1. Check for tool calls using ToolCallDecoder
          const toolCalls = ToolCallDecoder.findToolCalls(data);
          for (const tc of toolCalls) {
            if (!toolCallsSeen.has(tc.toolCallId)) {
              toolCallsSeen.add(tc.toolCallId);
              
              if (toolCallsExecuted < maxToolCalls) {
                toolCallsExecuted++;
                
                // Parse params from rawArgs
                let params = {};
                try {
                  if (tc.rawArgs) params = JSON.parse(tc.rawArgs);
                } catch (e) {}
                
                const toolCall = {
                  tool: tc.tool,
                  toolCallId: tc.toolCallId,
                  name: tc.name,
                  params,
                };
                
                if (verbose) {
                  console.log(`\n[Tool: ${tc.name} (enum=${tc.tool})]`);
                  console.log(`[Params: ${JSON.stringify(params)}]`);
                }
                
                // Execute tool
                const result = await this.toolExecutor.execute(toolCall);
                
                if (verbose) {
                  console.log(`[Result: ${result.success ? 'success' : result.error}]`);
                  if (result.data) {
                    console.log(`[Output: ${JSON.stringify(result.data).substring(0, 200)}]`);
                  }
                }
                
                // Send result back
                const resultData = this.encodeToolResultMessage(tc.tool, tc.toolCallId, result);
                const framedResult = this.frameMessage(resultData);
                await new Promise(r => setTimeout(r, 200));
                stream.write(framedResult);
                
                if (verbose) {
                  console.log(`[Sent tool result (${framedResult.length} bytes)]`);
                }
              }
            }
          }
          
          // 2. Extract text content using ResponseDecoder
          // Skip if this chunk contained tool calls (to avoid extracting garbage)
          if (toolCalls.length === 0) {
            const response = ResponseDecoder.decode(data);
            
            if (response.text) {
              fullResponse += response.text;
              if (verbose) process.stdout.write(response.text);
              if (onContent) onContent(response.text);
            }
            
            if (response.thinking && verbose) {
              console.log(`<thinking>${response.thinking}</thinking>`);
            }
            
            // Debug: show fields if no text found
            if (verbose && !response.text && data.length > 20) {
              try {
                const fields = ProtobufDecoder.decodeMessage(data);
                const fieldNums = Object.keys(fields).join(',');
                console.log(`[No text, fields: ${fieldNums}, size: ${data.length}]`);
              } catch (e) {}
            }
          }
        }
      });

      stream.on('end', () => {
        clearInterval(timeoutInterval);
        if (verbose) {
          console.log('\n[Stream ended]');
          if (toolCallsExecuted > 0) {
            console.log(`Executed ${toolCallsExecuted} tool call(s)`);
          }
        }
        this.close();
        resolve(fullResponse);
      });

      stream.on('close', () => {
        clearInterval(timeoutInterval);
        if (verbose) {
          console.log('\n[Stream closed]');
        }
        this.close();
        // Resolve if not already resolved
        resolve(fullResponse);
      });

      stream.on('error', (err) => {
        clearInterval(timeoutInterval);
        console.error('Stream error:', err.message);
        this.close();
        reject(err);
      });

      stream.on('response', (headers) => {
        if (verbose) {
          console.log('[Response headers received]');
          const status = headers[':status'];
          console.log(`  Status: ${status}`);
        }
      });
    });
  }
}

module.exports = { BidiCursorClient, ProtobufEncoder };
