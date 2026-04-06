/**
 * Bidirectional tool name and parameter mapping between
 * Cursor (ClientSideToolV2) and crush (OpenAI function format).
 */

const { ClientSideToolV2 } = require('./utils');

// Cursor tool enum -> crush function name + param transform
// Crush param schemas from crush/internal/agent/tools/*.go
const CURSOR_TO_CRUSH = {
  // Tool names use a common subset that works for both crush and opencode:
  // bash, read/view, glob, grep, edit, write
  // Crush uses: ls, view, bash, grep, glob, edit
  // Opencode uses: bash, read, glob, grep, edit, write
  // We use names that match the client's tool list (detected at runtime).
  [ClientSideToolV2.LIST_DIR]: {
    name: 'bash',
    mapParams(p) {
      const dir = p.relative_workspace_path || p.directory_path || '.';
      return { command: `ls -la ${dir}`, description: `List directory ${dir}` };
    },
  },
  [ClientSideToolV2.READ_FILE]: {
    name: 'read',
    mapParams(p) {
      const out = { filePath: p.target_file || p.relative_workspace_path || '' };
      if (p.start_line_one_indexed) out.offset = p.start_line_one_indexed - 1;
      if (p.end_line_one_indexed_inclusive) out.limit = p.end_line_one_indexed_inclusive - (p.start_line_one_indexed || 1) + 1;
      // Also include crush-compatible field names
      out.file_path = out.filePath;
      return out;
    },
  },
  [ClientSideToolV2.EDIT_FILE]: {
    name: 'edit',
    mapParams(p) {
      return {
        filePath: p.target_file || p.relative_workspace_path || '',
        file_path: p.target_file || p.relative_workspace_path || '',
        old_string: p.old_string || '',
        new_string: p.new_string || '',
      };
    },
  },
  [ClientSideToolV2.RIPGREP_SEARCH]: {
    name: 'grep',
    mapParams(p) {
      return { pattern: p.pattern || p.search_term || '', path: '.' };
    },
  },
  [ClientSideToolV2.RUN_TERMINAL_COMMAND_V2]: {
    name: 'bash',
    mapParams(p) {
      return {
        command: p.command || '',
        description: p.explanation || 'Execute command',
      };
    },
  },
  [ClientSideToolV2.FILE_SEARCH]: {
    name: 'glob',
    mapParams(p) {
      return { pattern: '*' + (p.query || p.pattern || '') + '*' };
    },
  },
  [ClientSideToolV2.GLOB_FILE_SEARCH]: {
    name: 'glob',
    mapParams(p) {
      return { pattern: p.pattern || p.glob_pattern || '' };
    },
  },
  [ClientSideToolV2.DELETE_FILE]: {
    name: 'bash',
    mapParams(p) {
      const filePath = p.target_file || p.relative_workspace_path || '';
      return { command: `rm ${filePath}`, description: 'Delete file' };
    },
  },
  [ClientSideToolV2.EDIT_FILE_V2]: {
    // EDIT_FILE_V2 is a "semantic edit" — the server sends a patch header
    // with just the file path but no diff hunks. The actual edit is inferred
    // from conversation context. We pass the raw patch to crush's write tool
    // so crush can apply it or show it to the user.
    name: 'bash',
    mapParams(p, rawArgs) {
      const patch = rawArgs || '';
      const fileMatch = patch.match(/\*\*\* Update File:\s*(.+)/);
      const filePath = fileMatch ? fileMatch[1].trim() : (p.target_file || '');

      // Extract -/+ lines if present (rare — usually not in ChatService path)
      const lines = patch.split('\n');
      const oldLines = [];
      const newLines = [];
      let inHunk = false;
      for (const line of lines) {
        if (line.startsWith('@@')) { inHunk = true; continue; }
        if (line.startsWith('*** End')) break;
        if (!inHunk) continue;
        if (line.startsWith('-')) oldLines.push(line.substring(1));
        else if (line.startsWith('+')) newLines.push(line.substring(1));
      }

      if (oldLines.length > 0 && newLines.length > 0) {
        // We got actual diff data — use sed to apply it
        const oldText = oldLines.join('\\n').replace(/'/g, "'\\''");
        const newText = newLines.join('\\n').replace(/'/g, "'\\''");
        return {
          command: `sed -i 's/${oldText}/${newText}/' '${filePath}'`,
          description: `Apply patch to ${filePath}`,
        };
      }

      // No hunk content (normal for ChatService path).
      // Emit the raw patch as a description so the model/user sees what
      // was intended, and let the model retry with explicit bash or edit.
      return {
        command: `echo 'Patch intent for ${filePath}:' && echo '${patch.replace(/'/g, "'\\''")}'`,
        description: `Show intended patch for ${filePath} (hunk data not available via ChatService)`,
      };
    },
  },
};

// Crush function name -> Cursor tool enum (for result routing)
const CRUSH_TO_CURSOR = {};
for (const [enumVal, mapping] of Object.entries(CURSOR_TO_CRUSH)) {
  // First mapping wins for each crush name (e.g. glob maps to FILE_SEARCH)
  if (!CRUSH_TO_CURSOR[mapping.name]) {
    CRUSH_TO_CURSOR[mapping.name] = parseInt(enumVal, 10);
  }
}
// Explicit overrides for both crush and opencode tool names
CRUSH_TO_CURSOR['view'] = ClientSideToolV2.READ_FILE;
CRUSH_TO_CURSOR['read'] = ClientSideToolV2.READ_FILE;
CRUSH_TO_CURSOR['ls'] = ClientSideToolV2.LIST_DIR;
CRUSH_TO_CURSOR['bash'] = ClientSideToolV2.RUN_TERMINAL_COMMAND_V2;
CRUSH_TO_CURSOR['edit'] = ClientSideToolV2.EDIT_FILE;
CRUSH_TO_CURSOR['grep'] = ClientSideToolV2.RIPGREP_SEARCH;
CRUSH_TO_CURSOR['glob'] = ClientSideToolV2.GLOB_FILE_SEARCH;
CRUSH_TO_CURSOR['write'] = ClientSideToolV2.EDIT_FILE;

/**
 * Translate a Cursor tool call to crush function call format.
 * @param {number} toolEnum - ClientSideToolV2 enum value
 * @param {string} rawArgs - JSON string of Cursor params
 * @returns {{ name: string, arguments: string }} OpenAI function format
 */
function cursorToCrush(toolEnum, rawArgs) {
  const mapping = CURSOR_TO_CRUSH[toolEnum];
  if (!mapping) {
    // Fallback: pass raw args under a generic name
    return { name: `cursor_tool_${toolEnum}`, arguments: rawArgs || '{}' };
  }

  let params = {};
  try { params = JSON.parse(rawArgs || '{}'); } catch (e) {
    // rawArgs might not be JSON (e.g. EDIT_FILE_V2 sends a patch string)
  }
  const crushParams = mapping.mapParams(params, rawArgs || '');
  return { name: mapping.name, arguments: JSON.stringify(crushParams) };
}

/**
 * Map a crush function name back to a Cursor tool enum.
 * @param {string} crushName - e.g. 'bash', 'view', 'ls'
 * @returns {number} ClientSideToolV2 enum value
 */
function crushToCursorEnum(crushName) {
  return CRUSH_TO_CURSOR[crushName] || ClientSideToolV2.RUN_TERMINAL_COMMAND_V2;
}

module.exports = { cursorToCrush, crushToCursorEnum, CURSOR_TO_CRUSH, CRUSH_TO_CURSOR };
