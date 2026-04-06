# Cursor API Protocol Porting Guide

A comprehensive reference for implementing Cursor as a backend in your own tool harness, without translating through the OpenAI protocol first. Based on reverse engineering of Cursor 2.6.22 / 3.0.9 and a working proxy implementation.

**Audience:** Developers building native Cursor API integrations (e.g., in Go, Rust, Python) who want to talk directly to Cursor's `api2.cursor.sh` without an intermediate proxy.

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Authentication](#2-authentication)
3. [HTTP/2 Connection & Headers](#3-http2-connection--headers)
4. [ConnectRPC Framing](#4-connectrpc-framing)
5. [Protobuf Message Structures](#5-protobuf-message-structures)
6. [Request Encoding](#6-request-encoding)
7. [Response Parsing](#7-response-parsing)
8. [Tool System (ClientSideToolV2)](#8-tool-system-clientsidetoolv2)
9. [Tool Call & Result Protocol](#9-tool-call--result-protocol)
10. [EDIT_FILE_V2 Deep Dive](#10-edit_file_v2-deep-dive)
11. [Session & Stream Lifecycle](#11-session--stream-lifecycle)
12. [Pitfalls, Gotchas & Subtle Points](#12-pitfalls-gotchas--subtle-points)
13. [Field Number Reference](#13-field-number-reference)

---

## 1. Architecture Overview

Cursor's agent mode uses **bidirectional HTTP/2 streaming** over ConnectRPC. A single HTTP/2 stream stays open for the entire agent conversation:

```
Client                          api2.cursor.sh
  |                                   |
  |-- HTTP/2 POST (initial request) ->|
  |                                   |-- model thinks
  |<---- text chunks (streaming) -----|
  |<---- tool call (protobuf) --------|
  |                                   |
  |-- tool result (protobuf) -------->|
  |                                   |-- model continues
  |<---- more text / tool calls ------|
  |<---- stream end ------------------|
```

The RPC is `aiserver.v1.ChatService/StreamUnifiedChatWithTools`. Both request and response are protobuf-encoded, framed with ConnectRPC envelopes.

Key properties:
- The stream is **bidirectional**: client sends the initial request AND tool results on the same stream.
- Tool results MUST be sent on the same stream that produced the tool call. You cannot open a new connection.
- Multiple tool calls can arrive in a single response batch.
- Text content and tool calls can be interleaved across frames.

---

## 2. Authentication

### Token Storage

Cursor stores its OAuth access token in a SQLite database:

| Platform | Path |
|----------|------|
| Linux | `~/.config/Cursor/User/globalStorage/state.vscdb` |
| macOS | `~/Library/Application Support/Cursor/User/globalStorage/state.vscdb` |
| Windows | `%APPDATA%\Cursor\User\globalStorage\state.vscdb` |

```sql
SELECT value FROM ItemTable WHERE key = 'cursorAuth/accessToken';
```

The token is a JWT (typically ~400 chars). It expires and can be refreshed.

### Token Refresh

```
POST https://api2.cursor.sh/oauth/token
Content-Type: application/json

{
  "grant_type": "refresh_token",
  "client_id": "KbZUR41cY7W6zRSdpSUJ7I7mLYBKOCmB",
  "refresh_token": "<refresh_token>"
}
```

The refresh token is stored at key `cursorAuth/refreshToken` in the same SQLite database.

### Checksum Generation (x-cursor-checksum)

Cursor uses a timestamp-based obfuscation ("Jyh cipher") for the `x-cursor-checksum` header. This is required on every request.

```python
import base64, time, hashlib

def generate_checksum(token):
    # 1. Machine ID (64-char hex, derived from token or stored)
    machine_id = hashlib.sha256(
        (token + "machineId").encode()
    ).hexdigest()

    # 2. Timestamp (microsecond precision, 6 bytes)
    ts = int(time.time() * 1000) // 1000000
    byte_array = [
        (ts >> 40) & 0xFF, (ts >> 32) & 0xFF,
        (ts >> 24) & 0xFF, (ts >> 16) & 0xFF,
        (ts >> 8) & 0xFF,  ts & 0xFF
    ]

    # 3. XOR-based obfuscation
    t = 165
    for i in range(len(byte_array)):
        byte_array[i] = ((byte_array[i] ^ t) + (i % 256)) & 0xFF
        t = byte_array[i]

    # 4. URL-safe base64 (no padding)
    encoded = base64.urlsafe_b64encode(bytes(byte_array)).rstrip(b'=').decode()

    return encoded + machine_id
```

### Client Key

```python
def generate_client_key(token):
    return hashlib.sha256(token.encode()).hexdigest()
```

---

## 3. HTTP/2 Connection & Headers

Connect to `api2.cursor.sh:443` via HTTP/2 with TLS.

### Required Headers

```
:method: POST
:path: /aiserver.v1.ChatService/StreamUnifiedChatWithTools
:authority: api2.cursor.sh
:scheme: https
authorization: Bearer <access_token>
connect-accept-encoding: gzip
connect-content-encoding: gzip          (only when request body is gzip-compressed)
connect-protocol-version: 1
content-type: application/connect+proto
user-agent: connect-es/1.6.1
x-amzn-trace-id: Root=<uuid4>
x-client-key: <sha256_hex(token)>
x-cursor-checksum: <jyh_cipher_output>
x-cursor-client-version: 2.6.22
x-cursor-client-type: ide
x-cursor-client-os: linux|darwin|win32
x-cursor-client-arch: x64|arm64
x-cursor-client-os-version: <os.release()>
x-cursor-client-device-type: desktop
x-cursor-config-version: <uuid4>
x-cursor-timezone: <IANA timezone>
x-ghost-mode: true|false
x-new-onboarding-completed: false
x-request-id: <uuid4>
x-session-id: <uuid5(token, DNS_NAMESPACE)>
```

**Gotcha:** The `x-cursor-client-version` must match a real Cursor release version. Using an invalid version may cause auth failures or different model behavior.

**Gotcha:** The `connect-accept-encoding: gzip` header tells the server it can send gzip-compressed response frames. If you omit it, responses arrive uncompressed.

---

## 4. ConnectRPC Framing

Every message on the wire is wrapped in a ConnectRPC envelope:

```
+--------+------------------+------------------+
| 1 byte |    4 bytes BE    |    N bytes       |
| flags  |     length       |    payload       |
+--------+------------------+------------------+
```

**Flags byte:**
- `0x00` = uncompressed payload
- `0x01` = gzip-compressed payload

**Writing a frame:**
```python
def frame_message(data, compress=False):
    flags = 0x01 if compress else 0x00
    length = len(data)
    return bytes([flags]) + length.to_bytes(4, 'big') + data
```

**Reading frames:** A single TCP chunk may contain multiple frames, or a frame may span multiple chunks. Buffer data and parse greedily:

```python
def parse_frames(buffer):
    frames = []
    offset = 0
    while offset + 5 <= len(buffer):
        flags = buffer[offset]
        length = int.from_bytes(buffer[offset+1:offset+5], 'big')
        if offset + 5 + length > len(buffer):
            break  # incomplete frame, wait for more data
        payload = buffer[offset+5 : offset+5+length]
        if flags & 0x01:
            payload = gzip.decompress(payload)
        frames.append(payload)
        offset += 5 + length
    return frames, buffer[offset:]  # remaining buffer
```

**Note:** The request body can be sent either gzip-compressed (flag `0x01`) or uncompressed (flag `0x00`). The non-bidi path (unary requests) typically uses gzip with `connect-content-encoding: gzip` header. The bidi streaming path sends uncompressed frames and works fine. The server accepts both.

---

## 5. Protobuf Message Structures

### StreamUnifiedChatWithToolsRequest

The top-level request wraps everything in a `request` field:

```
Field 1 (message): request
  Field 1 (repeated message): messages
    Field 1 (string): content
    Field 2 (varint): role         // 1=user, 2=assistant
    Field 13 (string): messageId   // uuid
  Field 2 (varint): unknown2       // always 1
  Field 3 (message): instruction
    Field 1 (string): instruction  // system prompt
  Field 4 (varint): unknown4       // always 1
  Field 5 (message): model
    Field 1 (string): name         // "gpt-4o", "default", "claude-4-sonnet"
    Field 4 (bytes): empty         // empty bytes
  Field 8 (string): webTool        // ""
  Field 13 (varint): unknown13     // 1
  Field 15 (message): cursorSetting
    Field 1 (string): name         // "cursor\\aisettings"
    Field 3 (string): unknown3     // ""
    Field 8 (varint): unknown8     // 1
    Field 9 (varint): unknown9     // 1
  Field 19 (varint): unknown19     // 1
  Field 23 (string): conversationId // uuid
  Field 26 (message): metadata
    Field 1 (string): os           // "linux"
    Field 2 (string): arch         // "x64"
    Field 3 (string): version      // os.release()
    Field 4 (string): path         // process.execPath
    Field 5 (string): timestamp    // ISO 8601
  Field 27 (bool): isAgentic       // true for agent mode
  Field 29 (repeated varint): supportedTools  // ClientSideToolV2 enum values
  Field 30 (repeated message): messageIds
    Field 1 (varint): role
    Field 2 (string): messageId
  Field 35 (varint): largeContext   // 0
  Field 38 (varint): unknown38     // 0
  Field 46 (varint): chatModeEnum  // 1=Ask, 3=Agent
  Field 47 (string): unknown47     // ""
  Field 48 (varint): unknown48     // 0
  Field 49 (varint): unknown49     // 0
  Field 51 (varint): unknown51     // 0
  Field 53 (varint): unknown53     // 1
  Field 54 (string): chatMode      // "Ask" or "Agent"
```

### StreamUnifiedChatWithToolsResponse

```
Field 1 (message): client_side_tool_v2_call  // tool call from model
Field 2 (message): stream_unified_chat_response  // text content
```

### StreamUnifiedChatResponse (nested in field 2)

```
Field 1 (string): text        // streamed text content
Field 22 (string): server_bubble_id
Field 25 (message): thinking
  Field 1 (string): content   // thinking/reasoning text
Field 27 (string): usage_uuid
```

---

## 6. Request Encoding

### Non-Agent (Chat) Mode

```python
request = {
    "request": {
        "messages": [{"content": "Hello", "role": 1, "messageId": uuid4()}],
        "unknown2": 1,
        "instruction": {"instruction": ""},
        "unknown4": 1,
        "model": {"name": "default", "empty": b""},
        "webTool": "",
        "unknown13": 1,
        "cursorSetting": {"name": "cursor\\aisettings", ...},
        "unknown19": 1,
        "conversationId": uuid4(),
        "metadata": {"os": "linux", "arch": "x64", ...},
        "messageIds": [{"role": 1, "messageId": msg_id}],
        "largeContext": 0,
        "unknown38": 0,
        "chatModeEnum": 1,
        "chatMode": "Ask",
    }
}
```

### Agent Mode (with Tools)

Add these fields to the request:

```python
request["request"]["isAgentic"] = True
request["request"]["supportedTools"] = [5, 6, 7, 8, 3, 15, 42]  # tool enums
request["request"]["chatModeEnum"] = 3
request["request"]["chatMode"] = "Agent"
```

### Encoding Pipeline

```
1. Construct the protobuf message
2. Encode to binary wire format
3. Gzip compress
4. Wrap in ConnectRPC frame (flag=0x01 + 4-byte length + data)
5. Write to HTTP/2 stream (do NOT end the stream — keep it open for tool results)
```

**Gotcha:** Do NOT call `stream.end()` after sending the initial request. The stream must stay open to send tool results later. Only close when the conversation is complete.

---

## 7. Response Parsing

### Frame-by-Frame Processing

```python
buffer = b""

def on_data(chunk):
    buffer += chunk
    frames, buffer = parse_frames(buffer)

    for frame in frames:
        # Decode the outer wrapper
        fields = decode_protobuf(frame)

        # Check for tool call (field 1)
        tool_call_bytes = get_bytes(fields, 1)
        if tool_call_bytes:
            tool_call = parse_tool_call(tool_call_bytes)
            handle_tool_call(tool_call)

        # Check for text content (field 2 -> field 1)
        response_bytes = get_bytes(fields, 2)
        if response_bytes:
            response_fields = decode_protobuf(response_bytes)
            text = get_string(response_fields, 1)
            if text:
                handle_text(text)

            # Check for thinking (field 2 -> field 25 -> field 1)
            thinking_bytes = get_bytes(response_fields, 25)
            if thinking_bytes:
                thinking_fields = decode_protobuf(thinking_bytes)
                thinking = get_string(thinking_fields, 1)
```

### Tool Call Extraction

Tool calls arrive in field 1 of the response. The structure may be nested — search recursively through length-delimited fields:

```
ClientSideToolV2Call:
  Field 1 (varint): tool          // enum value (e.g., 5, 15, 38)
  Field 3 (string): tool_call_id  // "call_xxx\nfc_xxx" or "toolu_bdrk_xxx"
  Field 9 (string): name          // "read_file", "run_terminal_cmd", etc.
  Field 10 (string): raw_args     // JSON params or patch text
```

For V2 tools (38=EDIT_FILE_V2, 40=READ_FILE_V2, 39=LIST_DIR_V2), the params may be in a tool-specific field instead of field 10:

| Tool Enum | Param Field |
|-----------|-------------|
| 38 (EDIT_FILE_V2) | Field 12 |
| 40 (READ_FILE_V2) | Field 8 |
| 39 (LIST_DIR_V2) | Field 14 |

**Gotcha:** The `tool_call_id` often contains newlines: `"call_xxx\nfc_xxx"`. You must preserve the full ID (including the newline and the `fc_` part) when sending results back. If you clean the ID for display, maintain a mapping from cleaned to original.

**Gotcha:** Tool calls may arrive across multiple frames. Text content can appear in earlier frames before the tool call frame. Buffer and batch: wait ~500ms after the last tool call before processing, in case more arrive in the same batch.

---

## 8. Tool System (ClientSideToolV2)

### Complete Enum (as of Cursor 3.0.9)

```
 1 = READ_SEMSEARCH_FILES      23 = SEARCH_SYMBOLS
 3 = RIPGREP_SEARCH             24 = BG_COMPOSER_FOLLOWUP
 5 = READ_FILE                  25 = KNOWLEDGE_BASE
 6 = LIST_DIR                   26 = FETCH_PULL_REQUEST
 7 = EDIT_FILE                  27 = DEEP_SEARCH
 8 = FILE_SEARCH                28 = CREATE_DIAGRAM
 9 = SEMANTIC_SEARCH_FULL       29 = FIX_LINTS
11 = DELETE_FILE                30 = READ_LINTS
12 = REAPPLY                    31 = GO_TO_DEFINITION
15 = RUN_TERMINAL_COMMAND_V2    32 = TASK
16 = FETCH_RULES                33 = AWAIT_TASK
18 = WEB_SEARCH                 34 = TODO_READ
19 = MCP                        35 = TODO_WRITE
                                38 = EDIT_FILE_V2
                                39 = LIST_DIR_V2
                                40 = READ_FILE_V2
                                41 = RIPGREP_RAW_SEARCH
                                42 = GLOB_FILE_SEARCH
                                43 = CREATE_PLAN
                                44 = LIST_MCP_RESOURCES
                                45 = READ_MCP_RESOURCE
                                46 = READ_PROJECT
                                47 = UPDATE_PROJECT
                                48 = TASK_V2
                                49 = CALL_MCP_TOOL
                                50 = APPLY_AGENT_DIFF
                                51 = ASK_QUESTION
                                52 = SWITCH_MODE
                                53 = GENERATE_IMAGE
                                54 = COMPUTER_USE
                                55 = WRITE_SHELL_STDIN
                                63 = GET_MCP_TOOLS
```

**Gaps (unassigned):** 2, 4, 10, 13, 14, 17, 20, 21, 22, 36, 37

### Minimum Viable Tool Set for Agent Mode

For basic agent functionality, support these tools:

| Enum | Name | Purpose |
|------|------|---------|
| 5 | READ_FILE | Read file contents |
| 6 | LIST_DIR | List directory entries |
| 7 | EDIT_FILE | Simple find-and-replace edit |
| 8 | FILE_SEARCH | Fuzzy filename search |
| 3 | RIPGREP_SEARCH | Grep/regex search |
| 15 | RUN_TERMINAL_COMMAND_V2 | Execute shell commands |
| 42 | GLOB_FILE_SEARCH | Glob pattern file search |

Optional but common:
| 38 | EDIT_FILE_V2 | Streaming/patch-based editing |
| 11 | DELETE_FILE | Delete a file |
| 18 | WEB_SEARCH | Web search |

### Tool Parameter Formats

**READ_FILE (5):**
```json
{
  "target_file": "/path/to/file",
  "should_read_entire_file": true,
  "start_line_one_indexed": 1,
  "end_line_one_indexed_inclusive": 50
}
```

**LIST_DIR (6):**
```json
{
  "relative_workspace_path": "src/",
  "directory_path": "/absolute/path"
}
```

**EDIT_FILE (7):**
```json
{
  "target_file": "/path/to/file",
  "old_string": "text to find",
  "new_string": "replacement text"
}
```

**RUN_TERMINAL_COMMAND_V2 (15):**
```json
{
  "command": "ls -la",
  "explanation": "List files"
}
```

**RIPGREP_SEARCH (3):**
```json
{
  "pattern": "search_term",
  "search_term": "alternative_field"
}
```

**FILE_SEARCH (8):**
```json
{
  "query": "filename"
}
```

**GLOB_FILE_SEARCH (42):**
```json
{
  "pattern": "**/*.js",
  "glob_pattern": "alternative_field"
}
```

**EDIT_FILE_V2 (38):** See [Section 10](#10-edit_file_v2-deep-dive).

---

## 9. Tool Call & Result Protocol

### Receiving a Tool Call

1. Parse the `ClientSideToolV2Call` from the response frame
2. Extract: `tool` (enum), `tool_call_id`, `name`, `raw_args`
3. For V2 tools, also check tool-specific param fields (12, 8, 14)
4. Parse `raw_args` as JSON to get parameters
5. Execute the tool locally
6. Encode the result and send it back on the SAME stream

### Sending a Tool Result

Build a `ClientSideToolV2Result` protobuf and send it as a ConnectRPC frame:

```
StreamUnifiedChatWithToolsRequest:
  Field 2 (message): client_side_tool_v2_result
    Field 1 (varint): tool           // must match the call's enum
    Field 35 (string): tool_call_id  // must match the call's ID (including newlines!)
    Field N (message): result        // tool-specific result (see table below)
```

### Result Field Numbers

| Tool | Result Field | Result Type |
|------|-------------|-------------|
| 1 (READ_SEMSEARCH_FILES) | 2 | ReadSemsearchFilesResult |
| 3 (RIPGREP_SEARCH) | 4 | RipgrepSearchResult |
| 5 (READ_FILE) | 6 | ReadFileResult |
| 6 (LIST_DIR) | 9 | ListDirResult |
| 7 (EDIT_FILE) | 10 | EditFileResult |
| 8 (FILE_SEARCH) | 11 | FileSearchResult |
| 9 (SEMANTIC_SEARCH_FULL) | 18 | SemanticSearchFullResult |
| 11 (DELETE_FILE) | 20 | DeleteFileResult |
| 12 (REAPPLY) | 21 | ReapplyResult |
| 15 (RUN_TERMINAL_COMMAND_V2) | 24 | RunTerminalCommandV2Result |
| 16 (FETCH_RULES) | 25 | FetchRulesResult |
| 18 (WEB_SEARCH) | 27 | WebSearchResult |
| 19 (MCP) | 28 | McpResult |
| 23 (SEARCH_SYMBOLS) | 32 | SearchSymbolsResult |
| 31 (GO_TO_DEFINITION) | 40 | GoToDefinitionResult |
| 38 (EDIT_FILE_V2) | 10 | EditFileV2Result |
| 42 (GLOB_FILE_SEARCH) | 51 | GlobFileSearchResult |

### Common Result Structures

**ReadFileResult (field 6):**
```
Field 1 (string): content    // file text
```

**ListDirResult (field 9):**
```
Field 1 (repeated message): files
  Field 1 (string): name     // filename
  Field 2 (bool): is_dir     // true if directory
```

**RunTerminalCommandV2Result (field 24):**
```
Field 1 (string): output     // stdout + stderr
Field 2 (varint): exit_code  // 0 = success
```

**EditFileResult (field 10) — legacy EDIT_FILE (enum 7) and EDIT_FILE_V2 ACK:**
```
Field 2 (bool): is_applied   // true if edit succeeded
```

**Note:** EDIT_FILE (7) and EDIT_FILE_V2 (38) both use field 10 in the result `oneof`, but with different inner message schemas. The ACK for EDIT_FILE_V2 uses this legacy format (field 2 = is_applied). The final result for EDIT_FILE_V2 uses `EditFileV2Result` (field 10 = result_for_model). Don't confuse them.

**EditFileV2Result (field 10) — EDIT_FILE_V2 (enum 38):**
```
Field 1 (string): contents_before_edit
Field 2 (bool): file_was_created
Field 4 (bool): rejected              // true = user rejected
Field 10 (string): result_for_model   // TEXT THE MODEL SEES
Field 12 (string): contents_after_edit
Field 14 (string): after_content_id
```

### Encoding Example (pseudocode)

```python
def send_tool_result(stream, tool_enum, tool_call_id, result_data):
    # 1. Encode tool-specific result
    result_field = get_result_field_number(tool_enum)
    result_bytes = encode_specific_result(tool_enum, result_data)

    # 2. Wrap in ClientSideToolV2Result
    msg = b""
    msg += encode_field(1, VARINT, tool_enum)        # tool
    msg += encode_field(35, LEN_DELIM, tool_call_id) # tool_call_id
    msg += encode_field(result_field, LEN_DELIM, result_bytes)

    # 3. Wrap in StreamUnifiedChatWithToolsRequest field 2
    wrapped = encode_field(2, LEN_DELIM, msg)

    # 4. Frame and send
    stream.write(frame_message(wrapped))
```

---

## 10. EDIT_FILE_V2 Deep Dive

EDIT_FILE_V2 (enum 38) is the most complex tool. It uses a two-phase protocol.

### Phase 1: Header-Only Call

Cursor sends a tool call where `raw_args` contains only the patch header:

```
*** Begin Patch
*** Update File: /path/to/file
```

No `@@` hunks, no `-`/`+` lines. This is a signal that Cursor wants you to ACK before sending the complete patch.

### ACK Response

Send back a `ClientSideToolV2Result` with an EditFileResult containing `is_applied = true`:

```
ClientSideToolV2Result:
  Field 1 (varint): 38                    // EDIT_FILE_V2
  Field 35 (string): <tool_call_id>       // from the call
  Field 10 (message): edit_file_result
    Field 2 (varint): 1                   // is_applied = true
```

**Critical:** The ACK MUST use `is_applied = true` at field 2 of the inner result. This is NOT the `EditFileV2Result` format. Cursor's ACK handler specifically checks this field to trigger sending the complete patch. Using `result_for_model` (EditFileV2Result field 10) for the ACK does NOT work — Cursor won't send the complete patch.

### Phase 2: Complete Patch

After receiving the ACK, Cursor sends the complete patch. This can arrive in two ways:

1. **As a second tool call frame** (same `tool_call_id`, same tool enum 38) with the full patch in `raw_args`
2. **As streamed text content** appended to the pending patch — text frames arrive with the `@@` hunks and `*** End Patch` marker

Your parser must handle both. Buffer incoming data and check for `*** End Patch` to know when the patch is complete.

The complete patch in `raw_args`:

```
*** Begin Patch
*** Update File: /path/to/file
@@ -1,5 +1,5 @@
 context line
-old line
+new line
 context line
*** End Patch
```

This second call may arrive in a subsequent frame, possibly after text chunks.

### Patch Line Format

Each line within a `@@` hunk has a 1-character prefix:

| Prefix | Meaning |
|--------|---------|
| `-` | Line removed (old content) |
| `+` | Line added (new content) |
| ` ` (space) | Context line (unchanged) |

Strip the prefix character to get the line content: `line.substring(1)`.

**Gotcha — Separator Space:** The model inconsistently adds a space after the `-`/`+` prefix. You may see `"- content"` (dash + space + content) or `"-content"` (dash + content). If you always strip 1 character, `"- Hello"` becomes `" Hello"` (with a leading space that may or may not be real indentation). See the heuristic below.

**Heuristic for space detection:** After stripping 1-char prefixes from all lines:
- If there are context lines, they provide ground truth for indentation. Don't strip further.
- If there are NO context lines, AND all old/new lines start with a space, strip that space (it's likely a separator).
- This is imperfect. For a robust solution, use the `@@ -N,M +N,M @@` line numbers to identify which file lines are affected, and read the actual file content for comparison.

### Final Result (after applying the edit)

After Phase 2, send back an `EditFileV2Result`:

```
ClientSideToolV2Result:
  Field 1 (varint): 38
  Field 35 (string): <tool_call_id>
  Field 10 (message): edit_file_v2_result
    Field 10 (string): "Edit applied successfully."  // result_for_model
    Field 4 (varint): 0                              // rejected = false
```

The `result_for_model` field (field 10 of EditFileV2Result) is what the LLM sees as the tool output. If you leave it empty, the model thinks the edit failed and retries.

For failed edits:
```
  Field 10 (string): "Error: old string not found in file"
  Field 4 (varint): 1   // rejected = true
```

---

## 11. Session & Stream Lifecycle

### Opening a Session

1. Create an HTTP/2 connection to `api2.cursor.sh:443`
2. Open a request stream with the required headers
3. Send the initial request (gzipped, framed)
4. Keep the stream open — do NOT end it

### Tool Call Loop

```
while stream is open:
    frames = read_frames(stream)
    for frame in frames:
        if has_tool_call(frame):
            tool_call = parse_tool_call(frame)
            result = execute_tool(tool_call)
            send_tool_result(stream, result)
        if has_text(frame):
            emit_text(frame)
    if stream_ended:
        break
```

### Closing

The server closes the stream when the model finishes (no more tool calls or text). You'll receive an `end` event on the HTTP/2 stream. Clean up resources at that point.

### Timeouts

- **Model response:** Cursor typically responds within 5-10 seconds per tool call round. This is model inference time, not network latency.
- **Tool call settle:** After a tool call arrives, wait ~500ms for more tool calls in the same batch before processing. Most tool calls are single, but Cursor occasionally sends 2+ concurrently.
- **Text idle:** If only text has arrived and then 5 seconds of silence, the model is likely done. Resolve. (In practice, `stream_end` fires before this timer.)
- **Total timeout:** 120 seconds. If nothing has resolved by then, the stream has stalled.
- **After sending tool result:** The model takes 5-10 seconds to process the result. Do not time out too early.
- **HTTP/2 PING:** Automatic keep-alive. Your HTTP/2 library should handle this.

---

## 12. Pitfalls, Gotchas & Subtle Points

### Authentication

1. **Token expiry:** The access token expires. Implement refresh logic or re-read from SQLite on failure.
2. **Checksum staleness:** The `x-cursor-checksum` is timestamp-based. Generate a fresh one for each request.
3. **Version string:** `x-cursor-client-version` must match a real Cursor release. Invalid versions may cause silent failures or model selection issues.

### Protobuf Encoding

4. **Varint overflow:** Standard protobuf varints are 64-bit, but many implementations use 32-bit. Ensure your encoder handles values up to 2^32 for field tags and lengths.
5. **Unknown fields:** Cursor adds new protobuf fields with each release. Your decoder must skip unknown fields gracefully (standard protobuf behavior, but custom decoders may not implement this).
6. **Nested messages:** Tool calls are often nested 2-3 levels deep in the response. Your decoder must recursively search through length-delimited fields.

### Tool Calls

7. **Multi-line tool_call_id:** Cursor sends IDs like `"call_xxx\nfc_xxx"` with literal newlines. You MUST send the exact same ID back (including the newline). If you strip it for display, maintain a mapping.
8. **Batched tool calls:** Multiple tool calls can arrive in rapid succession. Wait ~500ms after the last one before processing, to avoid partial batches.
9. **Text before tool calls:** The model often emits "thinking" text (e.g., "I'll read the file now...") before the tool call. This text arrives in separate frames before the tool call frame.
10. **Tool calls after text:** After the model finishes text output, it may produce a tool call in a subsequent frame. Don't close the response just because text stopped arriving. Wait for the stream to actually end.

### EDIT_FILE_V2 Specifics

11. **Two-phase protocol:** The header-only call MUST be ACKed with `is_applied = true` before Cursor sends the complete patch. Without the ACK, you'll never receive the actual diff.
12. **ACK format:** The ACK must use the legacy `EditFileResult` format (field 2 = is_applied), NOT the `EditFileV2Result` format (field 10 = result_for_model). Cursor checks the specific field.
13. **result_for_model:** The final edit result MUST include `result_for_model` (field 10 of EditFileV2Result) with descriptive text. An empty string makes the model think the edit failed.
14. **Patch line prefix ambiguity:** The model adds a space separator after `-`/`+` inconsistently. Your parser must handle both `"-content"` and `"- content"` formats.
15. **Complete patch timing:** The complete patch (Phase 2) may arrive immediately after the ACK, or after additional text frames. Buffer and check for `*** End Patch` before parsing.

### Response Parsing

16. **Gzip decompression:** Response frames may be gzip-compressed (flag 0x01). Always check the flag byte and decompress if needed.
17. **Partial frames:** A single `data` event may contain partial frames. Always buffer and parse from the buffer, not from individual chunks.
18. **Empty frames:** Some frames contain only metadata (UUIDs, usage tracking) with no text or tool calls. Skip gracefully.
19. **Reasoning/thinking content:** The model's reasoning appears at field 25 of the chat response, nested one level deeper. It's separate from the main text at field 1.

### Session Management

20. **Stream reuse:** Tool results MUST go back on the same HTTP/2 stream that produced the tool call. You cannot open a new connection or stream for results.
21. **Conversation history:** Cursor maintains conversation context on the server side. Each bidi stream IS the conversation. You don't need to re-send previous messages.
22. **Concurrent sessions:** Multiple agent sessions can be active simultaneously. Each session has its own HTTP/2 stream. Don't mix up tool results between sessions.

### Model Behavior

23. **Model name mapping:** Cursor maps model names internally. `"default"` typically maps to a Claude model. `"gpt-4o"`, `"gpt-4o-mini"` work as-is.
24. **Tool selection:** The model chooses which tools to use based on the `supportedTools` list. If you include EDIT_FILE_V2 (38), the model may prefer it over EDIT_FILE (7) for multi-line edits. If you only include EDIT_FILE (7), the model uses simpler find-and-replace edits.
25. **Agent mode vs Ask mode:** Setting `chatModeEnum = 3` and `chatMode = "Agent"` changes model behavior significantly. In agent mode, the model proactively uses tools. In ask mode (1/"Ask"), it only answers questions.

---

## 13. Field Number Reference

### Quick Reference Table

**Request (StreamUnifiedChatWithToolsRequest.request):**

| Field | Type | Name | Value/Notes |
|-------|------|------|-------------|
| 1 | repeated msg | messages | User/assistant messages |
| 2 | varint | unknown2 | 1 |
| 3 | message | instruction | System prompt |
| 4 | varint | unknown4 | 1 |
| 5 | message | model | Model name + empty bytes |
| 8 | string | webTool | "" |
| 13 | varint | unknown13 | 1 |
| 15 | message | cursorSetting | IDE settings |
| 19 | varint | unknown19 | 1 |
| 23 | string | conversationId | UUID |
| 26 | message | metadata | OS/arch/version |
| 27 | bool | isAgentic | true for agent mode |
| 29 | repeated varint | supportedTools | Tool enum values |
| 30 | repeated msg | messageIds | Message role + ID pairs |
| 35 | varint | largeContext | 0 |
| 38 | varint | unknown38 | 0 |
| 46 | varint | chatModeEnum | 1=Ask, 3=Agent |
| 54 | string | chatMode | "Ask" or "Agent" |

**Response wrapper:**

| Field | Type | Name |
|-------|------|------|
| 1 | message | client_side_tool_v2_call |
| 2 | message | stream_unified_chat_response |

**Tool call (ClientSideToolV2Call):**

| Field | Type | Name |
|-------|------|------|
| 1 | varint | tool (enum) |
| 3 | string | tool_call_id |
| 9 | string | name |
| 10 | string | raw_args |
| 12 | message | edit_tool_call (for enum 38) |
| 8 | message | read_file_params (for enum 40) |
| 14 | message | list_dir_params (for enum 39) |

**Tool result (ClientSideToolV2Result):**

| Field | Type | Name |
|-------|------|------|
| 1 | varint | tool (enum) |
| 35 | string | tool_call_id |
| 6 | message | read_file_result |
| 9 | message | list_dir_result |
| 10 | message | edit_file_result / edit_file_v2_result |
| 24 | message | run_terminal_command_v2_result |

**Protobuf wire types:**

| Wire Type | Encoding | Used For |
|-----------|----------|----------|
| 0 | Varint | int32, bool, enum |
| 2 | Length-delimited | string, bytes, nested message |

---

## Source References

- Proxy implementation: `Cursor-To-OpenAI/src/` (Node.js)
- Python reference client: `cursor_decompiled_2.6/cursor_bidi_client.py`
- Decompiled Cursor 3.0.9: `cursor_decompiled_2.6/reveng_3.0/beautified/`
- Tool enum definitions: `cursor_decompiled_2.6/cursor_agent_client.py` lines 52-99
- Checksum cipher: `cursor_decompiled_2.6/cursor_agent_client.py` lines 949-986
- Protobuf analysis: `cursor_decompiled_2.6/reveng_2.3.41/analysis/TASK-7-protobuf-schemas.md`
- Tool schemas: `cursor_decompiled_2.6/reveng_2.3.41/analysis/TASK-26-tool-schemas.md`
