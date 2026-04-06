const os = require('os');
const path = require('path');
const zlib = require('zlib');
const crypto = require('crypto');
const { v4: uuidv4, v5: uuidv5 } = require('uuid');
const $root = require('../proto/message.js');
// Lazy-load config to avoid circular dependency (config -> utils -> config)
let _config = null;
function getConfig() {
  if (!_config) _config = require('../config/config');
  return _config;
}

// Get Cursor storage path based on platform
function getCursorStoragePath() {
  const homeDir = os.homedir();
  switch (process.platform) {
    case 'win32':
      return path.join(process.env.APPDATA || path.join(homeDir, 'AppData', 'Roaming'), 'Cursor', 'User', 'globalStorage', 'state.vscdb');
    case 'darwin':
      return path.join(homeDir, 'Library', 'Application Support', 'Cursor', 'User', 'globalStorage', 'state.vscdb');
    default: // linux
      return path.join(homeDir, '.config', 'Cursor', 'User', 'globalStorage', 'state.vscdb');
  }
}

// Read machine ID from Cursor's SQLite storage
let cachedMachineId = null;
function getMachineIdFromStorage() {
  if (cachedMachineId) return cachedMachineId;
  
  try {
    const Database = require('better-sqlite3');
    const dbPath = getCursorStoragePath();
    const db = new Database(dbPath, { readonly: true });
    const row = db.prepare("SELECT value FROM ItemTable WHERE key = 'storage.serviceMachineId'").get();
    db.close();
    if (row && row.value) {
      cachedMachineId = row.value.toString();
      return cachedMachineId;
    }
  } catch (err) {
    console.error('Could not read machine ID from Cursor storage:', err.message);
  }
  return null;
}

// ClientSideToolV2 enum values - from cursor_agent_client.py (2.6.22)
const ClientSideToolV2 = {
  UNSPECIFIED: 0,
  READ_SEMSEARCH_FILES: 1,
  RIPGREP_SEARCH: 3,
  READ_FILE: 5,
  LIST_DIR: 6,
  EDIT_FILE: 7,
  FILE_SEARCH: 8,
  SEMANTIC_SEARCH_FULL: 9,
  DELETE_FILE: 11,
  REAPPLY: 12,
  RUN_TERMINAL_COMMAND_V2: 15,
  FETCH_RULES: 16,
  WEB_SEARCH: 18,
  MCP: 19,
  SEARCH_SYMBOLS: 23,
  BACKGROUND_COMPOSER_FOLLOWUP: 24,
  KNOWLEDGE_BASE: 25,
  FETCH_PULL_REQUEST: 26,
  DEEP_SEARCH: 27,
  CREATE_DIAGRAM: 28,
  FIX_LINTS: 29,
  READ_LINTS: 30,
  GO_TO_DEFINITION: 31,
  TASK: 32,
  AWAIT_TASK: 33,
  TODO_READ: 34,
  TODO_WRITE: 35,
  EDIT_FILE_V2: 38,
  LIST_DIR_V2: 39,
  READ_FILE_V2: 40,
  RIPGREP_RAW_SEARCH: 41,
  GLOB_FILE_SEARCH: 42,
  CREATE_PLAN: 43,
  LIST_MCP_RESOURCES: 44,
  READ_MCP_RESOURCE: 45,
  READ_PROJECT: 46,
  UPDATE_PROJECT: 47,
  TASK_V2: 48,
  CALL_MCP_TOOL: 49,
  APPLY_AGENT_DIFF: 50,
  ASK_QUESTION: 51,
  SWITCH_MODE: 52,
  GENERATE_IMAGE: 53,
  COMPUTER_USE: 54,
  WRITE_SHELL_STDIN: 55,
  GET_MCP_TOOLS: 63,
};

// Default tools for agent mode (includes bash)
const DEFAULT_AGENT_TOOLS = [
  ClientSideToolV2.READ_FILE,
  ClientSideToolV2.LIST_DIR,
  ClientSideToolV2.RIPGREP_SEARCH,
  ClientSideToolV2.RUN_TERMINAL_COMMAND_V2,
  ClientSideToolV2.EDIT_FILE,
  ClientSideToolV2.FILE_SEARCH,
  ClientSideToolV2.GLOB_FILE_SEARCH,
];

// Structured tools only - no bash/terminal, forces model to use
// edit_file, read_file, grep_search etc. instead of shell commands.
// Used in passthrough mode to prevent unbounded shell execution.
// Structured tools + bash. The model needs bash for grep and other
// operations that don't have structured equivalents. The structured
// tools (edit_file, read_file, list_dir) are listed first to encourage
// the model to prefer them, with bash as fallback.
const STRUCTURED_AGENT_TOOLS = [
  ClientSideToolV2.READ_FILE,
  ClientSideToolV2.LIST_DIR,
  ClientSideToolV2.EDIT_FILE,
  ClientSideToolV2.RIPGREP_SEARCH,
  ClientSideToolV2.FILE_SEARCH,
  ClientSideToolV2.GLOB_FILE_SEARCH,
  ClientSideToolV2.DELETE_FILE,
  ClientSideToolV2.RUN_TERMINAL_COMMAND_V2,
];

function generateCursorBody(messages, modelName, options = {}) {
  const { agentMode = false, tools = DEFAULT_AGENT_TOOLS } = options;

  const instruction = messages
    .filter(msg => msg.role === 'system')
    .map(msg => msg.content)
    .join('\n')

  // chatModeEnum: 1 = Ask, 3 = Agent (see TASK-110-tool-enum-mapping.md)
  const chatModeEnum = agentMode ? 3 : 1;
  const chatMode = agentMode ? "Agent" : "Ask";

  const formattedMessages = messages
    .filter(msg => msg.role !== 'system')
    .map(msg => ({
      content: msg.content,
      role: msg.role === 'user' ? 1 : 2,
      messageId: uuidv4(),
      ...(msg.role === 'user' ? { chatModeEnum: chatModeEnum } : {})
    }));

  const messageIds = formattedMessages.map(msg => {
    const { role, messageId, summaryId } = msg;
    return summaryId ? { role, messageId, summaryId } : { role, messageId };
  });

  // Build supported tools array for agent mode - TASK-7 says field 29 is repeated ClientSideToolV2
  const supportedTools = agentMode ? tools : [];

  const body = {
    request:{
      messages: formattedMessages,
      unknown2: 1,
      instruction: {
        instruction: instruction
      },
      unknown4: 1,
      model: {
        name: modelName,
        empty: '',
      },
      webTool: "",
      unknown13: 1,
      cursorSetting: {
        name: "cursor\\aisettings",
        unknown3: "",
        unknown6: {
          unknwon1: "",
          unknown2: ""
        },
        unknown8: 1,
        unknown9: 1
      },
      unknown19: 1,
      //unknown22: 1,
      conversationId: uuidv4(),
      metadata: {
        os: getConfig().clientOs,
        arch: getConfig().clientArch,
        version: getConfig().clientOsVersion,
        path: process.execPath,
        timestamp: new Date().toISOString(),
      },
      // Agent mode fields
      ...(agentMode ? { isAgentic: true, supportedTools } : {}),
      messageIds: messageIds,
      largeContext: 0,
      unknown38: 0,
      // 2.6.22 request-level fields
      chatModeEnum: chatModeEnum,
      unknown47: "",
      unknown48: 0,
      unknown49: 0,
      unknown51: 0,
      unknown53: 1,
      chatMode: chatMode,
    }
  };

  if (agentMode) {
    console.log('Agent mode: isAgentic=', body.request.isAgentic, 'supportedTools=', body.request.supportedTools);
  }
  
  const errMsg = $root.StreamUnifiedChatWithToolsRequest.verify(body);
  if (errMsg) throw Error(errMsg);
  const instance = $root.StreamUnifiedChatWithToolsRequest.create(body);
  let buffer = $root.StreamUnifiedChatWithToolsRequest.encode(instance).finish();
  buffer = zlib.gzipSync(buffer);
  const magicNumber = 0x01;

  const finalBody = Buffer.concat([
    Buffer.from([magicNumber]),
    Buffer.from(buffer.length.toString(16).padStart(8, '0'), 'hex'),
    buffer
  ])

  return finalBody
}

/**
 * Parse chunk from Cursor API response
 * Returns { thinking, text, toolCalls }
 * 
 * Tool call detection based on TASK-26-tool-schemas.md
 */
function chunkToUtf8String(chunk) {
  const thinkingOutput = []
  const textOutput = []
  const toolCalls = []
  const buffer = Buffer.from(chunk, 'hex');

  try {
    for(let i = 0; i < buffer.length; i++){
      const magicNumber = parseInt(buffer.subarray(i, i + 1).toString('hex'), 16)
      const dataLength = parseInt(buffer.subarray(i + 1, i + 5).toString('hex'), 16)
      const data = buffer.subarray(i + 5, i + 5 + dataLength)

      if (magicNumber == 0 || magicNumber == 1) {
        const gunzipData = magicNumber == 0 ? data : zlib.gunzipSync(data)
        const response = $root.StreamUnifiedChatWithToolsResponse.decode(gunzipData);

        // Nested response at field 2: stream_unified_chat_response
        const chatResp = response?.streamUnifiedChatResponse;
        if (chatResp) {
          const thinking = chatResp?.thinking?.content;
          if (thinking !== undefined) {
            thinkingOutput.push(thinking);
          }

          const content = chatResp?.text;
          if (content !== undefined) {
            textOutput.push(content);
          }
        }

        // Tool call at field 1: client_side_tool_v2_call
        const toolCall = response?.clientSideToolV2Call;
        if (toolCall && toolCall.toolCallId) {
          toolCalls.push({
            tool: toolCall.tool,
            toolCallId: toolCall.toolCallId,
            name: toolCall.name,
            rawArgs: toolCall.rawArgs,
          });
        }
      }
      else if (magicNumber == 2 || magicNumber == 3) { 
        // Json message
        const gunzipData = magicNumber == 2 ? data : zlib.gunzipSync(data)
        const utf8 = gunzipData.toString('utf-8')
        const message = JSON.parse(utf8)

        if (message != null && (typeof message !== 'object' || 
          (Array.isArray(message) ? message.length > 0 : Object.keys(message).length > 0))){
            console.error(utf8)
        }

      }

      i += 5 + dataLength - 1
    }
  } catch (err) {
    console.log('Error parsing chunk response:', err)
  }

  return {
    thinking: thinkingOutput.join(''), 
    text: textOutput.join(''),
    toolCalls: toolCalls
  }
}

/**
 * Parse tool calls from raw response data using regex fallback
 * Used when protobuf decoding doesn't catch tool calls
 * 
 * Based on TASK-26-tool-schemas.md tool call patterns
 */
function parseToolCallsFromText(text) {
  const toolCalls = [];
  
  // Look for tool call ID pattern: toolu_bdrk_XXXXXXXXXXXXXXXXXXXXXXXX
  const toolIdRegex = /toolu_bdrk_[a-zA-Z0-9]{24,28}/g;
  const ids = text.match(toolIdRegex) || [];
  
  // Map of tool names to enum values
  const nameToTool = {
    'list_dir': ClientSideToolV2.LIST_DIR,
    'read_file': ClientSideToolV2.READ_FILE,
    'edit_file': ClientSideToolV2.EDIT_FILE,
    'grep_search': ClientSideToolV2.RIPGREP_SEARCH,
    'run_terminal_cmd': ClientSideToolV2.RUN_TERMINAL_COMMAND_V2,
    'run_terminal_command': ClientSideToolV2.RUN_TERMINAL_COMMAND_V2,
    'file_search': ClientSideToolV2.FILE_SEARCH,
    'delete_file': ClientSideToolV2.DELETE_FILE,
    'web_search': ClientSideToolV2.WEB_SEARCH,
  };
  
  for (const toolCallId of [...new Set(ids)]) {
    // Find the tool name near this ID
    const idPos = text.indexOf(toolCallId);
    const context = text.substring(idPos, idPos + 500);
    
    let toolName = null;
    let tool = ClientSideToolV2.UNSPECIFIED;
    
    for (const [name, toolEnum] of Object.entries(nameToTool)) {
      if (context.toLowerCase().includes(name)) {
        toolName = name;
        tool = toolEnum;
        break;
      }
    }
    
    // Extract JSON params
    let rawArgs = '';
    const jsonMatch = context.match(/\{[^{}]*"[a-z_]+":\s*[^{}]+\}/i);
    if (jsonMatch) {
      rawArgs = jsonMatch[0];
    }
    
    if (toolName && rawArgs) {
      toolCalls.push({
        tool,
        toolCallId,
        name: toolName,
        rawArgs,
      });
    }
  }
  
  return toolCalls;
}

function generateHashed64Hex(input, salt = '') {
  const hash = crypto.createHash('sha256');
  hash.update(input + salt);
  return hash.digest('hex');
}

function obfuscateBytes(byteArray) {
  let t = 165;
  for (let r = 0; r < byteArray.length; r++) {
    byteArray[r] = (byteArray[r] ^ t) + (r % 256);
    t = byteArray[r];
  }
  return byteArray;
}

function generateCursorChecksum(token) {
  // Try to get real machine ID from Cursor's storage
  let machineId = getMachineIdFromStorage();
  if (!machineId) {
    // Fallback to derived ID if storage not accessible
    machineId = generateHashed64Hex(token, 'machineId');
  }

  const timestamp = Math.floor(Date.now() / 1e6);
  const byteArray = new Uint8Array([
    (timestamp >> 40) & 255,
    (timestamp >> 32) & 255,
    (timestamp >> 24) & 255,
    (timestamp >> 16) & 255,
    (timestamp >> 8) & 255,
    255 & timestamp,
  ]);

  const obfuscatedBytes = obfuscateBytes(byteArray);
  // Use URL-safe base64 encoding (replace + with -, / with _)
  const encodedChecksum = Buffer.from(obfuscatedBytes)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  return `${encodedChecksum}${machineId}`;
}

/**
 * Build common headers for Cursor API requests (2.6.22 profile)
 */
function buildCommonHeaders(authToken) {
  const sessionId = uuidv5(authToken, uuidv5.DNS);
  const clientKey = generateHashed64Hex(authToken);
  const cursorChecksum = generateCursorChecksum(authToken);
  const requestId = uuidv4();

  return {
    'authorization': `Bearer ${authToken}`,
    'connect-protocol-version': '1',
    'user-agent': 'connect-es/1.6.1',
    'x-amzn-trace-id': `Root=${requestId}`,
    'x-client-key': clientKey,
    'x-cursor-checksum': cursorChecksum,
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
    'host': 'api2.cursor.sh',
  };
}

/**
 * Refresh OAuth access token (2.6.22 flow)
 * POST https://api2.cursor.sh/oauth/token
 */
async function refreshAccessToken(refreshToken) {
  try {
    const { fetch } = require('undici');
    const response = await fetch('https://api2.cursor.sh/oauth/token', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        grant_type: 'refresh_token',
        client_id: getConfig().oauthClientId,
        refresh_token: refreshToken,
      }),
    });
    if (response.status !== 200) return null;
    const data = await response.json();
    return data.access_token || null;
  } catch (err) {
    console.error('Token refresh failed:', err.message);
    return null;
  }
}

module.exports = {
  generateCursorBody,
  chunkToUtf8String,
  parseToolCallsFromText,
  generateHashed64Hex,
  generateCursorChecksum,
  getMachineIdFromStorage,
  getCursorStoragePath,
  buildCommonHeaders,
  refreshAccessToken,
  ClientSideToolV2,
  DEFAULT_AGENT_TOOLS,
  STRUCTURED_AGENT_TOOLS,
};
