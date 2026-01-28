const os = require('os');
const path = require('path');
const zlib = require('zlib');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');
const $root = require('../proto/message.js');

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

// ClientSideToolV2 enum values - see TASK-110-tool-enum-mapping.md
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
  GO_TO_DEFINITION: 31,
  GLOB_FILE_SEARCH: 42,
};

// Default tools for agent mode
const DEFAULT_AGENT_TOOLS = [
  ClientSideToolV2.READ_FILE,
  ClientSideToolV2.LIST_DIR,
  ClientSideToolV2.RIPGREP_SEARCH,
  ClientSideToolV2.RUN_TERMINAL_COMMAND_V2,
  ClientSideToolV2.EDIT_FILE,
  ClientSideToolV2.FILE_SEARCH,
  ClientSideToolV2.GLOB_FILE_SEARCH,
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

  // Build supported tools array for agent mode
  const supportedTools = agentMode 
    ? tools.map(tool => ({ tool }))
    : [];

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
        os: process.platform,
        arch: process.arch,
        version: "10.0.22631",
        path: process.execPath,
        timestamp: new Date().toISOString(),
      },
      unknown27: 0,
      //unknown29: "",
      messageIds: messageIds,
      largeContext: 0,
      unknown38: 0,
      ...(agentMode ? { supportedTools } : {}),
      chatModeEnum: chatModeEnum,
      unknown47: "",
      unknown48: 0,
      unknown49: 0,
      unknown51: 0,
      unknown53: 1,
      chatMode: chatMode
    }
  };

  const errMsg = $root.StreamUnifiedChatWithToolsRequest.verify(body);
  if (errMsg) throw Error(errMsg);
  const instance = $root.StreamUnifiedChatWithToolsRequest.create(body);
  let buffer = $root.StreamUnifiedChatWithToolsRequest.encode(instance).finish();
  let magicNumber = 0x00
  if (formattedMessages.length >= 3){
    buffer = zlib.gzipSync(buffer)
    magicNumber = 0x01
  }

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

        const thinking = response?.message?.thinking?.content
        if (thinking !== undefined){
          thinkingOutput.push(thinking)
        }

        const content = response?.message?.content
        if (content !== undefined){
          textOutput.push(content)
        }

        // Check for tool calls (agent mode)
        const toolCall = response?.toolCall
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

module.exports = {
  generateCursorBody,
  chunkToUtf8String,
  parseToolCallsFromText,
  generateHashed64Hex,
  generateCursorChecksum,
  getMachineIdFromStorage,
  getCursorStoragePath,
  ClientSideToolV2,
  DEFAULT_AGENT_TOOLS,
};
