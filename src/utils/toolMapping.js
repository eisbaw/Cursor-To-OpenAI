/**
 * Bidirectional tool name and parameter mapping between
 * Cursor (ClientSideToolV2) and crush (OpenAI function format).
 */

const { ClientSideToolV2 } = require('./utils');

// Cursor tool enum -> crush function name + param transform
const CURSOR_TO_CRUSH = {
  [ClientSideToolV2.LIST_DIR]: {
    name: 'ls',
    mapParams(p) {
      return { path: p.relative_workspace_path || p.directory_path || '.' };
    },
  },
  [ClientSideToolV2.READ_FILE]: {
    name: 'view',
    mapParams(p) {
      const out = { file_path: p.target_file || p.relative_workspace_path || '' };
      if (p.start_line_one_indexed) out.offset = p.start_line_one_indexed;
      if (p.end_line_one_indexed_inclusive) out.limit = p.end_line_one_indexed_inclusive - (p.start_line_one_indexed || 1) + 1;
      return out;
    },
  },
  [ClientSideToolV2.EDIT_FILE]: {
    name: 'edit',
    mapParams(p) {
      return {
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
      return { command: p.command || '' };
    },
  },
  [ClientSideToolV2.FILE_SEARCH]: {
    name: 'glob',
    mapParams(p) {
      return { pattern: p.query || p.pattern || '' };
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
      return { command: `rm ${filePath}` };
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
// Explicit overrides for ambiguous names
CRUSH_TO_CURSOR['view'] = ClientSideToolV2.READ_FILE;
CRUSH_TO_CURSOR['ls'] = ClientSideToolV2.LIST_DIR;
CRUSH_TO_CURSOR['bash'] = ClientSideToolV2.RUN_TERMINAL_COMMAND_V2;
CRUSH_TO_CURSOR['edit'] = ClientSideToolV2.EDIT_FILE;
CRUSH_TO_CURSOR['grep'] = ClientSideToolV2.RIPGREP_SEARCH;
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
  try { params = JSON.parse(rawArgs || '{}'); } catch (e) {}
  const crushParams = mapping.mapParams(params);
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
