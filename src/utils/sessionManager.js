/**
 * Session Manager for bidi stream persistence across HTTP requests.
 *
 * When crush sends tools in /v1/responses, the proxy opens a bidi HTTP/2
 * stream to Cursor.  Cursor returns tool calls; the proxy translates them
 * to OpenAI function_call SSE events and ends the HTTP response.  Crush
 * executes the tool and sends a new /v1/responses with the result.  The
 * session manager keeps the bidi stream alive so the result can be
 * forwarded on the same Cursor stream.
 */

const CLEANUP_INTERVAL_MS = 30_000;
const SESSION_TIMEOUT_MS = 120_000;

// responseId -> session
const sessions = new Map();

// callId -> responseId  (reverse index for continuation lookup)
const callIndex = new Map();

function create(responseId, stream, client) {
  const session = {
    responseId,
    stream,
    client,
    buffer: Buffer.alloc(0),
    outputIndex: 0,
    seqNo: 0,
    state: 'streaming',
    lastActivity: Date.now(),
  };
  sessions.set(responseId, session);
  return session;
}

function get(responseId) {
  return sessions.get(responseId) || null;
}

function getByCallId(callId) {
  const responseId = callIndex.get(callId);
  if (!responseId) return null;
  return sessions.get(responseId) || null;
}

function registerCallId(callId, responseId) {
  callIndex.set(callId, responseId);
}

function touch(session) {
  session.lastActivity = Date.now();
}

function destroy(responseId) {
  const session = sessions.get(responseId);
  if (!session) return;

  // Close stream if still open
  try {
    if (session.stream && !session.stream.destroyed) {
      session.stream.close();
    }
  } catch (e) { /* ignore */ }

  try {
    if (session.client) session.client.close();
  } catch (e) { /* ignore */ }

  // Remove call index entries pointing to this session
  for (const [cid, rid] of callIndex) {
    if (rid === responseId) callIndex.delete(cid);
  }

  sessions.delete(responseId);
}

function count() {
  return sessions.size;
}

// Periodic cleanup of stale sessions
const _timer = setInterval(() => {
  const now = Date.now();
  for (const [rid, session] of sessions) {
    if (now - session.lastActivity > SESSION_TIMEOUT_MS) {
      console.log(`Session ${rid} timed out, cleaning up`);
      destroy(rid);
    }
  }
}, CLEANUP_INTERVAL_MS);
_timer.unref(); // don't prevent process exit

module.exports = { create, get, getByCallId, registerCallId, touch, destroy, count };
