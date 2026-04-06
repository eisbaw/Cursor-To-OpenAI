# Cursor-To-OpenAI

Use your Cursor subscription from any OpenAI-compatible tool. Agent mode with full tool calling.

> **Compatible with Cursor 2.6.22** | Protocol reverse-engineered from decompiled source (2.6.22 + 3.0.9)
>
> **Implementing natively?** See [CURSOR-PROTOCOL-GUIDE.md](CURSOR-PROTOCOL-GUIDE.md) for the full wire protocol spec.

## What This Does

A local proxy that translates between the OpenAI API format and Cursor's proprietary ConnectRPC/protobuf protocol. Your tools talk OpenAI; the proxy talks Cursor.

```
opencode / any OpenAI client
    |  HTTP/1.1 (OpenAI format)
    v
localhost:3010  (this proxy)
    |  HTTP/2 bidirectional streaming (ConnectRPC + protobuf)
    v
api2.cursor.sh  ->  Claude, GPT, Gemini, Grok, etc.
```

The proxy does NOT execute tools. It translates tool calls from Cursor's format to OpenAI function calls, lets your client execute them, and passes results back.

## Quick Start

```bash
npm install
npm start
# Proxy runs on http://localhost:3010
```

Authentication is automatic -- the proxy reads your Cursor token from the local SQLite storage (same token the Cursor IDE uses). No API keys to configure.

If you don't have Cursor installed or need to log in fresh:
```bash
npm run login   # Opens browser for Cursor OAuth
```

## Usage with OpenCode

[OpenCode](https://opencode.ai) is a terminal-based AI coding agent. It works well with this proxy.

**1. Install opencode** (see [opencode.ai](https://opencode.ai) for options)

**2. Add `opencode.json`** to your project root:
```json
{
  "provider": {
    "cursor-bridge": {
      "name": "Cursor via Bridge",
      "npm": "@ai-sdk/openai-compatible",
      "models": {
        "default": { "name": "Default" },
        "claude-4.6-opus-high": { "name": "Claude 4.6 Opus" },
        "claude-4.6-sonnet-medium": { "name": "Claude 4.6 Sonnet" },
        "gpt-5.4-medium": { "name": "GPT-5.4" },
        "gemini-3-flash": { "name": "Gemini 3 Flash" }
      },
      "options": {
        "baseURL": "http://localhost:3010/v1"
      }
    }
  },
  "$schema": "https://opencode.ai/config.json"
}
```

**3. Start the proxy** and then opencode:
```bash
npm start &          # proxy in background
opencode             # in your project directory
```

Use Tab to switch to Build (agent) mode. OpenCode will read files, run commands, edit code -- all executed locally, with the model running through your Cursor subscription.

### Choosing Models

OpenCode doesn't auto-discover models, so you must list them in `opencode.json`. To see all available models:

```bash
curl -s http://localhost:3010/v1/models | jq '.data[].id'
```

There are 80+ models available including Claude 4.6 Opus/Sonnet, GPT-5.x, Gemini 3, Grok 4, and more. Add any model ID to the `models` object in your config.

Some useful ones:

| Model ID | Description |
|----------|-------------|
| `default` | Cursor's default (varies by subscription) |
| `claude-4.6-opus-high` | Claude 4.6 Opus |
| `claude-4.6-opus-high-thinking` | Claude 4.6 Opus with extended thinking |
| `claude-4.6-sonnet-medium` | Claude 4.6 Sonnet |
| `claude-4.5-haiku` | Claude 4.5 Haiku (fast, cheap) |
| `gpt-5.4-medium` | GPT-5.4 |
| `gpt-5.4-mini-medium` | GPT-5.4 Mini |
| `gemini-3-flash` | Gemini 3 Flash |
| `cursor-small` | Cursor's small model |

## Usage with curl

```bash
curl http://localhost:3010/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{"model": "claude-4.6-sonnet-medium", "stream": true,
       "messages": [{"role": "user", "content": "Hello"}]}'
```

No Authorization header needed -- the proxy uses the stored Cursor token.

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/v1/models` | GET | List available models (80+) |
| `/v1/chat/completions` | POST | Chat Completions API with tool passthrough |
| `/v1/responses` | POST | Responses API with tool passthrough |

## Agent Mode (Tool Passthrough)

When the client sends a `tools` array, the proxy opens a bidirectional HTTP/2 stream to Cursor and passes tool calls through. The client executes tools locally.

Cursor's tools are translated to standard OpenAI function calls:

| Cursor Tool | Function Name | What It Does |
|-------------|--------------|--------------|
| `read_file` (5) | `read` | Read file contents |
| `list_dir` (6) | `bash` | List directory |
| `edit_file_v2` (38) | `edit` | Edit file (patch-based) |
| `run_terminal_cmd` (15) | `bash` | Run shell command |
| `grep_search` (3) | `grep` | Search file contents |
| `file_search` (8) | `glob` | Find files by name |
| `glob_search` (42) | `glob` | Find files by pattern |
| `delete_file` (11) | `bash` | Delete file |

The proxy auto-detects the client's tool naming convention (camelCase for opencode, snake_case for others) and adapts parameter names accordingly.

## Known Limitations

- **Model selection in opencode:** Models must be listed explicitly in `opencode.json`. OpenCode does not auto-discover from `/v1/models`.
- **EDIT_FILE_V2 whitespace:** Single-line edits without context may have a 1-space indentation offset due to ambiguity in Cursor's patch format. Multi-line edits with context are correct.
- **Latency:** 5-10s per model response is normal -- that's Cursor's API, not the proxy. The proxy adds ~500ms per tool call round-trip for batching.

## Compatibility

Tested with Cursor 2.6.22 (also verified against 3.0.9 decompiled source).

For the full protocol specification (authentication, HTTP/2 framing, protobuf structures, all 46+ tool enums, EDIT_FILE_V2 two-phase flow, 25 documented pitfalls), see [CURSOR-PROTOCOL-GUIDE.md](CURSOR-PROTOCOL-GUIDE.md).

## Credits

- Fork of [JiuZ-Chn/Cursor-To-OpenAI](https://github.com/JiuZ-Chn/Cursor-To-OpenAI)
- Based on [zhx47/cursor-api](https://github.com/zhx47/cursor-api)
- Protocol analysis: [eisbaw/cursor_api_demo](https://github.com/eisbaw/cursor_api_demo)

## License

MIT
