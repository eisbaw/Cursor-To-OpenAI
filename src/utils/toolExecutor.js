/**
 * Tool Executor for Cursor Agent Mode
 * 
 * Executes ClientSideToolV2 tools locally and returns results.
 * Based on TASK-26-tool-schemas.md and TASK-110-tool-enum-mapping.md
 */

const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');
const { ClientSideToolV2 } = require('./utils');

class ToolExecutor {
  constructor(workspaceRoot = process.cwd()) {
    this.workspaceRoot = path.resolve(workspaceRoot);
  }

  /**
   * Execute a tool call and return the result
   * @param {Object} toolCall - { tool, toolCallId, name, rawArgs }
   * @returns {Object} - { success, data, error }
   */
  execute(toolCall) {
    const { tool, rawArgs } = toolCall;
    
    let params = {};
    try {
      params = rawArgs ? JSON.parse(rawArgs) : {};
    } catch (e) {
      return { success: false, data: {}, error: 'Failed to parse tool arguments' };
    }

    try {
      switch (tool) {
        case ClientSideToolV2.READ_FILE:
          return this.readFile(params);
        case ClientSideToolV2.LIST_DIR:
          return this.listDir(params);
        case ClientSideToolV2.RIPGREP_SEARCH:
          return this.grepSearch(params);
        case ClientSideToolV2.RUN_TERMINAL_COMMAND_V2:
          return this.runTerminalCommand(params);
        case ClientSideToolV2.EDIT_FILE:
          return this.editFile(params);
        case ClientSideToolV2.FILE_SEARCH:
          return this.fileSearch(params);
        case ClientSideToolV2.GLOB_FILE_SEARCH:
          return this.globFileSearch(params);
        case ClientSideToolV2.DELETE_FILE:
          return this.deleteFile(params);
        default:
          return { success: false, data: {}, error: `Unsupported tool: ${tool}` };
      }
    } catch (e) {
      return { success: false, data: {}, error: e.message };
    }
  }

  /**
   * Read file contents
   * See TASK-26-tool-schemas.md ReadFileParams/Result
   */
  readFile(params) {
    const relativePath = params.relative_workspace_path || params.relativeworkspacepath || '';
    const fullPath = path.join(this.workspaceRoot, relativePath);
    
    if (!fs.existsSync(fullPath)) {
      return { success: false, data: {}, error: `File not found: ${relativePath}` };
    }

    const contents = fs.readFileSync(fullPath, 'utf-8');
    const lines = contents.split('\n');
    
    return {
      success: true,
      data: {
        contents,
        relative_workspace_path: relativePath,
        total_lines: lines.length,
      }
    };
  }

  /**
   * List directory contents
   * See TASK-26-tool-schemas.md ListDirParams/Result
   */
  listDir(params) {
    const dirPath = params.relative_workspace_path || params.directory_path || '.';
    const fullPath = path.join(this.workspaceRoot, dirPath);
    
    if (!fs.existsSync(fullPath)) {
      return { success: false, data: {}, error: `Directory not found: ${dirPath}` };
    }

    const entries = fs.readdirSync(fullPath, { withFileTypes: true });
    const files = entries
      .filter(e => !e.name.startsWith('.'))
      .map(entry => {
        const entryPath = path.join(fullPath, entry.name);
        const stats = fs.statSync(entryPath);
        return {
          name: entry.name,
          is_directory: entry.isDirectory(),
          size: stats.size,
        };
      });

    return {
      success: true,
      data: {
        entries: files,
        directory_path: dirPath,
      }
    };
  }

  /**
   * Search with ripgrep
   * See TASK-26-tool-schemas.md RipgrepSearchParams
   */
  grepSearch(params) {
    const pattern = params.pattern || params.pattern_info?.pattern || '';
    if (!pattern) {
      return { success: false, data: {}, error: 'No search pattern provided' };
    }

    try {
      const result = execSync(
        `rg --json -m 50 "${pattern.replace(/"/g, '\\"')}" "${this.workspaceRoot}"`,
        { encoding: 'utf-8', timeout: 30000, maxBuffer: 10 * 1024 * 1024 }
      );

      const matches = [];
      for (const line of result.split('\n')) {
        if (!line) continue;
        try {
          const data = JSON.parse(line);
          if (data.type === 'match') {
            matches.push({
              path: data.data?.path?.text || '',
              line_number: data.data?.line_number || 0,
              line_content: data.data?.lines?.text?.trim() || '',
            });
          }
        } catch (e) {}
      }

      return {
        success: true,
        data: { matches, pattern, total_matches: matches.length }
      };
    } catch (e) {
      // rg returns non-zero if no matches
      return { success: true, data: { matches: [], pattern, total_matches: 0 } };
    }
  }

  /**
   * Run terminal command
   * See TASK-26-tool-schemas.md RunTerminalCommandV2Params/Result
   */
  runTerminalCommand(params) {
    const command = params.command || '';
    if (!command) {
      return { success: false, data: {}, error: 'No command provided' };
    }

    try {
      const output = execSync(command, {
        encoding: 'utf-8',
        cwd: this.workspaceRoot,
        timeout: 60000,
        maxBuffer: 10 * 1024 * 1024,
      });

      return {
        success: true,
        data: {
          output: output,
          exit_code: 0,
        }
      };
    } catch (e) {
      return {
        success: true,
        data: {
          output: e.stdout || e.stderr || e.message,
          exit_code: e.status || 1,
        }
      };
    }
  }

  /**
   * Edit file with search/replace
   * See TASK-26-tool-schemas.md EditFileParams/Result
   */
  editFile(params) {
    const relativePath = params.relative_workspace_path || '';
    const oldString = params.old_string || '';
    const newString = params.new_string;
    
    const fullPath = path.join(this.workspaceRoot, relativePath);

    if (newString === undefined) {
      return { success: false, data: {}, error: 'new_string is required' };
    }

    if (fs.existsSync(fullPath)) {
      if (!oldString) {
        return { success: false, data: {}, error: 'old_string required for existing file' };
      }
      
      let content = fs.readFileSync(fullPath, 'utf-8');
      if (!content.includes(oldString)) {
        return { success: false, data: {}, error: 'old_string not found in file' };
      }
      
      content = content.replace(oldString, newString);
      fs.writeFileSync(fullPath, content);
    } else {
      // Create new file
      const dir = path.dirname(fullPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(fullPath, newString);
    }

    return {
      success: true,
      data: {
        is_applied: true,
        relative_workspace_path: relativePath,
      }
    };
  }

  /**
   * Search for files by name
   * See TASK-26-tool-schemas.md FileSearchParams/Result
   */
  fileSearch(params) {
    const query = params.query || '';
    if (!query) {
      return { success: false, data: {}, error: 'No query provided' };
    }

    const files = [];
    const searchDir = (dir) => {
      try {
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
          if (entry.name.startsWith('.')) continue;
          const fullPath = path.join(dir, entry.name);
          const relativePath = path.relative(this.workspaceRoot, fullPath);
          
          if (entry.isDirectory()) {
            searchDir(fullPath);
          } else if (entry.name.toLowerCase().includes(query.toLowerCase())) {
            files.push({ uri: relativePath });
            if (files.length >= 50) return;
          }
        }
      } catch (e) {}
    };

    searchDir(this.workspaceRoot);

    return {
      success: true,
      data: {
        files,
        num_results: files.length,
        limit_hit: files.length >= 50,
      }
    };
  }

  /**
   * Search for files by glob pattern
   * See TASK-26-tool-schemas.md GlobFileSearchParams/Result
   */
  globFileSearch(params) {
    const pattern = params.pattern || params.glob_pattern || '';
    if (!pattern) {
      return { success: false, data: {}, error: 'No pattern provided' };
    }

    // Simple glob implementation using find
    try {
      const result = execSync(
        `find "${this.workspaceRoot}" -name "${pattern}" -type f 2>/dev/null | head -100`,
        { encoding: 'utf-8', timeout: 30000 }
      );

      const files = result.split('\n')
        .filter(f => f)
        .map(f => ({ uri: path.relative(this.workspaceRoot, f) }));

      return {
        success: true,
        data: {
          files,
          num_results: files.length,
          limit_hit: files.length >= 100,
        }
      };
    } catch (e) {
      return { success: true, data: { files: [], num_results: 0 } };
    }
  }

  /**
   * Delete file
   * See TASK-26-tool-schemas.md DeleteFileParams/Result
   */
  deleteFile(params) {
    const relativePath = params.relative_workspace_path || '';
    const fullPath = path.join(this.workspaceRoot, relativePath);

    if (!fs.existsSync(fullPath)) {
      return { success: true, data: { file_non_existent: true, file_deleted_successfully: false } };
    }

    fs.unlinkSync(fullPath);
    return { success: true, data: { file_deleted_successfully: true } };
  }
}

module.exports = { ToolExecutor };
