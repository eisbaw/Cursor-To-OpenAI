# Cursor-To-OpenAI

OpenAI-compatible API proxy for Cursor Editor with **full agent mode and tool calling support**.

> **Compatible with Cursor 2.6.22** - Protocol implementation based on reverse-engineered protobuf schemas.
>
> **Porting to native?** See [CURSOR-PROTOCOL-GUIDE.md](CURSOR-PROTOCOL-GUIDE.md) for the full protocol specification — authentication, HTTP/2 framing, protobuf structures, all 46+ tool enums, EDIT_FILE_V2 two-phase flow, and 25 documented pitfalls.

## Features

- **OpenAI API compatibility** - Works with any OpenAI client (Python, Node.js, curl, etc.)
- **Agent mode with tool calling** - Execute local tools via bidirectional HTTP/2 streaming
- **Supported tools**: `list_dir`, `read_file`, `edit_file`, `run_terminal_cmd`, `grep_search`, `file_search`, `glob_search`, `delete_file`
- **Streaming responses** - SSE streaming for real-time output
- **Multiple models** - Access Claude, GPT-4, and other models available in Cursor

## Quick Start

```bash
# Install
npm install

# Get auth token (opens browser for Cursor login)
npm run login

# Start server
npm start
# Server runs on http://localhost:3010
```

## Usage

### With OpenAI Python client

```python
from openai import OpenAI

client = OpenAI(
    api_key="YOUR_CURSOR_TOKEN",  # From `npm run login`
    base_url="http://localhost:3010/v1"
)

# Simple chat
response = client.chat.completions.create(
    model="claude-3.5-sonnet",
    messages=[{"role": "user", "content": "Hello!"}]
)

# Agent mode with tools
response = client.chat.completions.create(
    model="claude-3.5-sonnet",
    messages=[{"role": "user", "content": "List files in /tmp"}],
    tools=[{"type": "function", "function": {"name": "run_terminal_cmd"}}]
)
```

### With curl

```bash
# Chat completion
curl http://localhost:3010/v1/chat/completions \
  -H "Authorization: Bearer YOUR_CURSOR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"model": "claude-3.5-sonnet", "messages": [{"role": "user", "content": "Hello"}]}'

# With streaming
curl http://localhost:3010/v1/chat/completions \
  -H "Authorization: Bearer YOUR_CURSOR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"model": "claude-3.5-sonnet", "messages": [{"role": "user", "content": "Hello"}], "stream": true}'
```

### With Crush CLI

[Crush](https://github.com/charmbracelet/crush) is a terminal-based AI assistant. Configure it to use this proxy:

**1. Install Crush**
```bash
# macOS/Linux
brew install charmbracelet/tap/crush

# Or download from GitHub releases
```

**2. Configure provider** in `~/.local/share/crush/crush.json`:
```json
{
  "default_provider": "cursor-bridge",
  "default_model": "claude-4.5-opus-high-thinking",
  "providers": {
    "cursor-bridge": {
      "kind": "openai",
      "api_key": "YOUR_CURSOR_TOKEN",
      "url": "http://localhost:3010/v1"
    }
  }
}
```

**3. Start the proxy** (in a separate terminal):
```bash
cd cursor-to-openai
npm start
```

**4. Run Crush**:
```bash
# Interactive TUI
crush

# One-shot query
crush run "list files in current directory"

# With specific model
crush --model claude-3.5-sonnet run "explain this code"
```

Crush will automatically use agent mode with tool calling when appropriate, allowing the AI to execute commands, read files, and perform other tasks locally.

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/v1/models` | GET | List available models |
| `/v1/chat/completions` | POST | Chat completions with tool passthrough (opencode) |
| `/v1/responses` | POST | Responses API with tool passthrough (crush) |
| `/cursor/loginDeepControl` | GET | Get auth token via browser login |

## Agent Mode (Tool Passthrough)

When `tools` array is provided in the request, the proxy opens a **bidirectional HTTP/2 stream** to Cursor and passes tool calls through to the client. The proxy does NOT execute tools locally — it translates between Cursor's protobuf tool format and the OpenAI function calling format, letting the client (opencode, crush, etc.) execute tools.

**Tested clients:**
- **[opencode](https://opencode.ai)** — via `/v1/chat/completions` (camelCase params: `filePath`, `oldString`, `newString`)
- **[Crush](https://github.com/charmbracelet/crush)** — via `/v1/responses` (snake_case params: `file_path`, `old_string`, `new_string`)

Tool mapping (Cursor `ClientSideToolV2` to client function names):

| Cursor Tool | Crush | Opencode |
|-------------|-------|----------|
| `read_file` (5) | `view` | `read` |
| `list_dir` (6) | `ls` | `bash` |
| `edit_file` (7) | `edit` | `edit` |
| `edit_file_v2` (38) | `edit` | `edit` |
| `run_terminal_cmd` (15) | `bash` | `bash` |
| `grep_search` (3) | `grep` | `grep` |
| `file_search` (8) | `glob` | `glob` |
| `glob_search` (42) | `glob` | `glob` |
| `delete_file` (11) | `bash` | `bash` |

## Authentication

Get your Cursor token using one of these methods:

### Method 1: CLI login
```bash
npm run login
# Opens browser, returns token after login
```

### Method 2: From Cursor IDE
Extract token from Cursor's IndexedDB or use the auth reader script.

### Method 3: API endpoint
```bash
curl http://localhost:3010/cursor/loginDeepControl \
  -H "Authorization: Bearer YOUR_WORKOS_SESSION_TOKEN"
```

## Architecture

```
Client (opencode/crush/SDK)
    ↓ HTTP/1.1 (OpenAI format)
cursor-to-openai proxy (localhost:3010)
    ↓ HTTP/2 bidirectional streaming (ConnectRPC + protobuf)
Cursor API (api2.cursor.sh)
    ↓
Claude/GPT models
```

For agent mode, the proxy:
1. Encodes request with `isAgentic=true` and `supportedTools` (protobuf)
2. Opens bidirectional HTTP/2 stream to Cursor API
3. Translates Cursor tool calls to OpenAI function_call format, returns to client
4. Client executes tool locally, sends result back to proxy
5. Proxy translates result to Cursor protobuf, sends on the same bidi stream
6. Repeats until model finishes (no more tool calls)

## Development

```bash
# Run with auto-reload
npm run dev

# Regenerate protobuf JS
npm run proto
```

## Compatibility

**Tested with Cursor 2.6.22** (also analysed against 3.0.9 decompiled source)

The protobuf schemas and protocol details were derived from reverse engineering Cursor's `workbench.desktop.main.js` and `extensionHostProcess.js`. Key discoveries:
- `StreamUnifiedChatWithTools` RPC for bidirectional streaming
- `ClientSideToolV2` enum with 46+ tool types
- `isAgentic` (field 27) and `supportedTools` (field 29) for agent mode
- EDIT_FILE_V2 two-phase ACK protocol with `EditFileV2Result.result_for_model`
- Tool call/result message formats with per-tool field numbers

For the full protocol specification, see [CURSOR-PROTOCOL-GUIDE.md](CURSOR-PROTOCOL-GUIDE.md).

## Reverse Engineering

The protocol analysis and standalone proof-of-concept implementations are available at:

**[eisbaw/cursor_api_demo](https://github.com/eisbaw/cursor_api_demo)** - Python PoC with:
- Protobuf wire format encoder/decoder
- HTTP/2 bidirectional streaming client (h2 library)
- Tool call detection and result encoding
- Analysis documents (TASK-7, TASK-26, TASK-110)

## Credits

- Fork of [JiuZ-Chn/Cursor-To-OpenAI](https://github.com/JiuZ-Chn/Cursor-To-OpenAI)
- Based on [zhx47/cursor-api](https://github.com/zhx47/cursor-api)
- Protocol analysis from [eisbaw/cursor_api_demo](https://github.com/eisbaw/cursor_api_demo)

## License

MIT
