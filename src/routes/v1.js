const express = require('express');
const router = express.Router();
const { fetch, ProxyAgent, Agent } = require('undici');

const { v4: uuidv4 } = require('uuid');
const config = require('../config/config');
const $root = require('../proto/message.js');
const {
  generateCursorBody,
  chunkToUtf8String,
  parseToolCallsFromText,
  generateHashed64Hex,
  generateCursorChecksum,
  buildCommonHeaders,
  refreshAccessToken,
  ClientSideToolV2,
  DEFAULT_AGENT_TOOLS,
  STRUCTURED_AGENT_TOOLS,
} = require('../utils/utils.js');
const { ToolExecutor } = require('../utils/toolExecutor.js');
const { BidiCursorClient } = require('../utils/bidiClient.js');
const sessionManager = require('../utils/sessionManager.js');
const toolMapping = require('../utils/toolMapping.js');

// Map OpenAI model names to Cursor model IDs
// Models not in this map are passed through as-is
const MODEL_MAP = {
  'gpt-4o': 'gpt-4o',
  'gpt-4o-mini': 'default',
  'gpt-5.4': 'default',
  'gpt-5.4-pro': 'default',
  'gpt-5.4-mini': 'cursor-small',
  'gpt-5.4-nano': 'cursor-small',
};
function mapModelName(model) {
  if (!model) return 'default';
  return MODEL_MAP[model] || model;
}

// Extract Cursor auth token: prefer stored token, fall back to Bearer header
function getAuthToken(req) {
  // Use stored Cursor token if available (like Python client does)
  if (config.cursorToken) return config.cursorToken;
  // Fall back to Bearer header
  let bearer = req.headers.authorization?.replace('Bearer ', '');
  if (!bearer) return null;
  let token = bearer.split(',').map(k => k.trim())[0];
  if (token && token.includes('%3A%3A')) token = token.split('%3A%3A')[1];
  else if (token && token.includes('::')) token = token.split('::')[1];
  return token;
}

router.get("/models", async (req, res) => {
  try{
    const authToken = getAuthToken(req);
    if (!authToken) {
      return res.status(401).json({ error: "No Cursor token available" });
    }

    const headers = buildCommonHeaders(authToken.trim());
    headers['accept-encoding'] = 'gzip';
    headers['content-type'] = 'application/proto';
    if (req.headers['x-cursor-checksum']) {
      headers['x-cursor-checksum'] = req.headers['x-cursor-checksum'];
    }

    const availableModelsResponse = await fetch("https://api2.cursor.sh/aiserver.v1.AiService/AvailableModels", {
      method: 'POST',
      headers,
    })
    const data = await availableModelsResponse.arrayBuffer();
    const buffer = Buffer.from(data);
    try{
      const models = $root.AvailableModelsResponse.decode(buffer).models;

      return res.json({
        object: "list",
        data: models.map(model => ({
          id: model.name,
          created: Date.now(),
          object: 'model',
          owned_by: 'cursor'
        }))
      })
    } catch (error) {
      const text = buffer.toString('utf-8');
      throw new Error(text);      
    }
  }
  catch (error) {
    console.error(error);
    return res.status(500).json({
      error: 'Internal server error',
    });
  }
})

router.post('/chat/completions', async (req, res) => {

  try {
    const { model: rawModel, messages, stream = false, tools = null } = req.body;
    const model = mapModelName(rawModel);

    // Agent mode is enabled when tools are provided
    const agentMode = tools && Array.isArray(tools) && tools.length > 0;
    
    const authToken = getAuthToken(req);
    if (!authToken || !messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        error: 'Invalid request. Messages should be a non-empty array and Cursor token is required',
      });
    }

    // Use bidirectional client for agent mode (required for tool calling)
    if (agentMode) {
      console.log('Agent mode: using bidirectional HTTP/2 client, stream=' + stream);
      
      const bidiClient = new BidiCursorClient(process.cwd());
      const prompt = messages.map(m => `${m.role}: ${m.content}`).join('\n');
      const responseId = `chatcmpl-${uuidv4()}`;
      
      if (stream) {
        // Streaming response for agent mode
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        
        try {
          const response = await bidiClient.runAgent(authToken, prompt, model, {
            maxToolCalls: 10,
            verbose: true,
            timeout: 60000,
            // Callback to stream content as it arrives
            onContent: (content) => {
              res.write(`data: ${JSON.stringify({
                id: responseId,
                object: 'chat.completion.chunk',
                created: Math.floor(Date.now() / 1000),
                model: model,
                choices: [{
                  index: 0,
                  delta: { content },
                  finish_reason: null,
                }],
              })}\n\n`);
            },
          });
          
          // Send final chunk
          res.write(`data: ${JSON.stringify({
            id: responseId,
            object: 'chat.completion.chunk',
            created: Math.floor(Date.now() / 1000),
            model: model,
            choices: [{
              index: 0,
              delta: {},
              finish_reason: 'stop',
            }],
          })}\n\n`);
          res.write('data: [DONE]\n\n');
          res.end();
        } catch (err) {
          console.error('Bidi client error:', err);
          res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`);
          res.end();
        }
      } else {
        // Non-streaming response for agent mode
        try {
          const response = await bidiClient.runAgent(authToken, prompt, model, {
            maxToolCalls: 10,
            verbose: true,
            timeout: 60000,
          });
          
          console.log(`Agent response (${response?.length || 0} chars): "${response?.substring(0, 100)}..."`);
          
          return res.json({
            id: responseId,
            object: 'chat.completion',
            created: Math.floor(Date.now() / 1000),
            model: model,
            choices: [{
              index: 0,
              message: {
                role: 'assistant',
                content: response,
              },
              finish_reason: 'stop',
            }],
            usage: { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 },
          });
        } catch (err) {
          console.error('Bidi client error:', err);
          return res.status(500).json({ error: err.message });
        }
      }
      return;
    }

    // Non-agent mode: use regular unidirectional streaming
    const chatHeaders = buildCommonHeaders(authToken.trim());
    if (req.headers['x-cursor-checksum']) {
      chatHeaders['x-cursor-checksum'] = req.headers['x-cursor-checksum'];
    }

    // Request the AvailableModels before StreamChat.
    const modelsHeaders = { ...chatHeaders, 'accept-encoding': 'gzip', 'content-type': 'application/proto' };
    // Fire-and-forget session preflight (result not needed)
    fetch("https://api2.cursor.sh/aiserver.v1.AiService/AvailableModels", {
      method: 'POST',
      headers: modelsHeaders,
    }).catch(() => {})
    
    // Generate request body (non-agent mode)
    const cursorBody = generateCursorBody(messages, model, { 
      agentMode: false, 
      tools: [] 
    });
    
    const dispatcher = config.proxy.enabled
      ? new ProxyAgent(config.proxy.url, { allowH2: true })
      : new Agent({ allowH2: true });
    chatHeaders['connect-accept-encoding'] = 'gzip';
    chatHeaders['connect-content-encoding'] = 'gzip';
    chatHeaders['content-type'] = 'application/connect+proto';
    const response = await fetch('https://api2.cursor.sh/aiserver.v1.ChatService/StreamUnifiedChatWithTools', {
      method: 'POST',
      headers: chatHeaders,
      body: cursorBody,
      dispatcher: dispatcher,
      timeout: {
        connect: 5000,
        read: 30000
      }
    });

    if (response.status !== 200) {
      return res.status(response.status).json({ 
        error: response.statusText 
      });
    }

    if (stream) {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      const responseId = `chatcmpl-${uuidv4()}`;
      const seenToolCalls = new Set();
      let fullText = '';

      try {
        let thinkingStart = "<thinking>";
        let thinkingEnd = "</thinking>";
        for await (const chunk of response.body) {
          const { thinking, text, toolCalls } = chunkToUtf8String(chunk);
          fullText += text;
          let content = ""

          if (thinkingStart !== "" && thinking.length > 0 ){
            content += thinkingStart + "\n"
            thinkingStart = ""
          }
          content += thinking
          if (thinkingEnd !== "" && thinking.length === 0 && text.length !== 0 && thinkingStart === "") {
            content += "\n" + thinkingEnd + "\n"
            thinkingEnd = ""
          }

          content += text

          if (content.length > 0) {
            res.write(
              `data: ${JSON.stringify({
                id: responseId,
                object: 'chat.completion.chunk',
                created: Math.floor(Date.now() / 1000),
                model: model,
                choices: [{
                  index: 0,
                  delta: {
                    content: content,
                  },
                }],
              })}\n\n`
            );
          }

          // Handle tool calls in agent mode (OpenAI format)
          // See TASK-26-tool-schemas.md for tool call schema
          if (agentMode && toolCalls.length > 0) {
            for (const tc of toolCalls) {
              if (seenToolCalls.has(tc.toolCallId)) continue;
              seenToolCalls.add(tc.toolCallId);
              
              // Send tool call in OpenAI format
              res.write(
                `data: ${JSON.stringify({
                  id: responseId,
                  object: 'chat.completion.chunk',
                  created: Math.floor(Date.now() / 1000),
                  model: model,
                  choices: [{
                    index: 0,
                    delta: {
                      tool_calls: [{
                        index: 0,
                        id: tc.toolCallId,
                        type: 'function',
                        function: {
                          name: tc.name || `tool_${tc.tool}`,
                          arguments: tc.rawArgs || '{}',
                        },
                      }],
                    },
                    finish_reason: null,
                  }],
                })}\n\n`
              );
            }
          }
        }

        // Try to find tool calls in full text if none found via protobuf
        if (agentMode && seenToolCalls.size === 0) {
          const textToolCalls = parseToolCallsFromText(fullText);
          for (const tc of textToolCalls) {
            if (seenToolCalls.has(tc.toolCallId)) continue;
            seenToolCalls.add(tc.toolCallId);
            
            res.write(
              `data: ${JSON.stringify({
                id: responseId,
                object: 'chat.completion.chunk',
                created: Math.floor(Date.now() / 1000),
                model: model,
                choices: [{
                  index: 0,
                  delta: {
                    tool_calls: [{
                      index: 0,
                      id: tc.toolCallId,
                      type: 'function',
                      function: {
                        name: tc.name,
                        arguments: tc.rawArgs,
                      },
                    }],
                  },
                  finish_reason: null,
                }],
              })}\n\n`
            );
          }
        }
      } catch (streamError) {
        console.error('Stream error:', streamError);
        if (streamError.name === 'TimeoutError') {
          res.write(`data: ${JSON.stringify({ error: 'Server response timeout' })}\n\n`);
        } else {
          res.write(`data: ${JSON.stringify({ error: 'Stream processing error' })}\n\n`);
        }
      } finally {
        res.write('data: [DONE]\n\n');
        res.end();
      }
    } else {
      // Non-streaming response
      try {
        let thinkingStart = "<thinking>";
        let thinkingEnd = "</thinking>";
        let content = '';
        const allToolCalls = [];
        const seenToolCalls = new Set();
        
        for await (const chunk of response.body) {
          const { thinking, text, toolCalls } = chunkToUtf8String(chunk);
          
          if (thinkingStart !== "" && thinking.length > 0 ){
            content += thinkingStart + "\n"
            thinkingStart = ""
          }
          content += thinking
          if (thinkingEnd !== "" && thinking.length === 0 && text.length !== 0 && thinkingStart === "") {
            content += "\n" + thinkingEnd + "\n"
            thinkingEnd = ""
          }

          content += text

          // Collect tool calls for agent mode
          if (agentMode && toolCalls.length > 0) {
            for (const tc of toolCalls) {
              if (!seenToolCalls.has(tc.toolCallId)) {
                seenToolCalls.add(tc.toolCallId);
                allToolCalls.push(tc);
              }
            }
          }
        }

        // Try text-based tool call detection if none found
        if (agentMode && allToolCalls.length === 0) {
          const textToolCalls = parseToolCallsFromText(content);
          for (const tc of textToolCalls) {
            if (!seenToolCalls.has(tc.toolCallId)) {
              seenToolCalls.add(tc.toolCallId);
              allToolCalls.push(tc);
            }
          }
        }

        // Build response message
        const message = {
          role: 'assistant',
          content: content || null,
        };

        // Add tool calls in OpenAI format if any found
        // See TASK-26-tool-schemas.md for tool call schema
        if (allToolCalls.length > 0) {
          message.tool_calls = allToolCalls.map((tc, i) => ({
            id: tc.toolCallId,
            type: 'function',
            function: {
              name: tc.name || `tool_${tc.tool}`,
              arguments: tc.rawArgs || '{}',
            },
          }));
        }

        return res.json({
          id: `chatcmpl-${uuidv4()}`,
          object: 'chat.completion',
          created: Math.floor(Date.now() / 1000),
          model: model,
          choices: [
            {
              index: 0,
              message: message,
              finish_reason: allToolCalls.length > 0 ? 'tool_calls' : 'stop',
            },
          ],
          usage: {
            prompt_tokens: 0,
            completion_tokens: 0,
            total_tokens: 0,
          },
        });
      } catch (error) {
        console.error('Non-stream error:', error);
        if (error.name === 'TimeoutError') {
          return res.status(408).json({ error: 'Server response timeout' });
        }
        throw error;
      }
    }
  } catch (error) {
    console.error('Error:', error);
    if (!res.headersSent) {
      const errorMessage = {
        error: error.name === 'TimeoutError' ? 'Request timeout' : 'Internal server error'
      };

      if (req.body.stream) {
        res.write(`data: ${JSON.stringify(errorMessage)}\n\n`);
        return res.end();
      } else {
        return res.status(error.name === 'TimeoutError' ? 408 : 500).json(errorMessage);
      }
    }
  }
});

/**
 * Shared handler: read frames from Cursor bidi stream and emit SSE events.
 * If tool calls arrive, emit them and end with status "incomplete".
 * If text arrives and stream ends, emit text and end with status "completed".
 */
async function handleAgentStreamResponse(res, session, model) {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const sse = (event, data) => {
    data.type = event;
    data.sequence_number = session.seqNo++;
    res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
  };

  sse('response.created', {
    response: { id: session.responseId, object: 'response', status: 'in_progress',
      model: model || 'default', output: [] },
  });

  // Read next batch of frames from Cursor
  const { toolCalls, textChunks, ended, buffer } = await session.client.readNextFrames(
    session.stream, session.buffer, { batchDelayMs: 400, timeoutMs: 120000 }
  );
  session.buffer = buffer;
  sessionManager.touch(session);

  const outputItems = [];

  // Emit any text content first
  if (textChunks.length > 0) {
    const textItemId = `msg_${uuidv4()}`;
    const fullText = textChunks.join('');

    sse('response.output_item.added', {
      output_index: session.outputIndex,
      item: { id: textItemId, type: 'message', role: 'assistant', content: [] },
    });
    sse('response.content_part.added', {
      output_index: session.outputIndex, content_index: 0,
      part: { type: 'output_text', text: '' },
    });
    for (const chunk of textChunks) {
      sse('response.output_text.delta', {
        output_index: session.outputIndex, content_index: 0, delta: chunk,
      });
    }
    sse('response.output_text.done', {
      output_index: session.outputIndex, content_index: 0, text: fullText,
    });
    sse('response.content_part.done', {
      output_index: session.outputIndex, content_index: 0,
      part: { type: 'output_text', text: fullText },
    });
    sse('response.output_item.done', {
      output_index: session.outputIndex,
      item: { id: textItemId, type: 'message', role: 'assistant',
        content: [{ type: 'output_text', text: fullText }] },
    });

    outputItems.push({ id: textItemId, type: 'message', role: 'assistant',
      content: [{ type: 'output_text', text: fullText }] });
    session.outputIndex++;
  }

  // Emit tool calls
  if (toolCalls.length > 0) {
    // Separate complete tool calls from incomplete EDIT_FILE_V2 calls
    const passThroughCalls = [];
    const rejectCalls = [];
    for (const tc of toolCalls) {
      if (tc.tool === 38 && (!tc.rawArgs || !tc.rawArgs.includes('@@'))) {
        // EDIT_FILE_V2 without diff hunks - reject back to Cursor
        rejectCalls.push(tc);
      } else {
        passThroughCalls.push(tc);
      }
    }

    // Send rejections back to Cursor, asking for structured edit
    for (const tc of rejectCalls) {
      const errorResult = {
        success: false,
        data: { content: 'Tool not supported in this environment. Use edit_file with explicit old_string and new_string parameters, or use run_terminal_cmd with sed.' },
      };
      const toolEnum = tc.tool;
      console.log(`Rejecting EDIT_FILE_V2 ${tc.toolCallId} back to Cursor`);
      session.client.sendToolResultOnStream(session.stream, toolEnum, tc.toolCallId, errorResult);
      sessionManager.registerCallId(tc.toolCallId, session.responseId);
    }

    // If we only had rejections and no pass-through calls, read next frames
    // (the model should retry with a different tool)
    if (passThroughCalls.length === 0 && rejectCalls.length > 0) {
      console.log('All tool calls rejected, waiting for model retry...');
      const next = await session.client.readNextFrames(
        session.stream, session.buffer, { batchDelayMs: 800, timeoutMs: 120000 }
      );
      session.buffer = next.buffer;
      // Recursively handle the next batch
      // (could be more tool calls, text, or stream end)
      toolCalls.length = 0;
      toolCalls.push(...next.toolCalls);
      textChunks.push(...next.textChunks);
      if (next.ended) ended = true;

      // Re-check for pass-through calls
      for (const tc of next.toolCalls) {
        if (tc.tool === 38 && (!tc.rawArgs || !tc.rawArgs.includes('@@'))) {
          // Still EDIT_FILE_V2 - reject again
          const err = { success: false, data: { content: 'Use run_terminal_cmd with sed instead of apply_patch.' } };
          session.client.sendToolResultOnStream(session.stream, tc.tool, tc.toolCallId, err);
          sessionManager.registerCallId(tc.toolCallId, session.responseId);
        } else {
          passThroughCalls.push(tc);
        }
      }
    }

    console.log('Emitting', passThroughCalls.length, 'tool calls to crush');
    for (const tc of passThroughCalls) {
      const { name: crushName, arguments: crushArgs } = toolMapping.cursorToCrush(tc.tool, tc.rawArgs);
      const callId = tc.toolCallId;
      const fcId = `fc_${uuidv4()}`;

      sessionManager.registerCallId(callId, session.responseId);
      // Register fallback keys crush might use
      sessionManager.registerCallId(crushName, session.responseId);
      if (tc.name) sessionManager.registerCallId(tc.name, session.responseId);
      sessionManager.registerCallId(fcId, session.responseId);

      sse('response.output_item.added', {
        output_index: session.outputIndex,
        item: { id: fcId, type: 'function_call', name: crushName, call_id: callId, arguments: '' },
      });
      sse('response.function_call_arguments.done', {
        output_index: session.outputIndex, item_id: fcId, arguments: crushArgs,
      });
      sse('response.output_item.done', {
        output_index: session.outputIndex,
        item: { id: fcId, type: 'function_call', name: crushName, call_id: callId,
          arguments: crushArgs, status: 'completed' },
      });

      outputItems.push({ id: fcId, type: 'function_call', name: crushName,
        call_id: callId, arguments: crushArgs, status: 'completed' });

      console.log(`  Tool call: ${tc.name}(${tc.tool}) -> ${crushName}(${crushArgs.substring(0, 80)})`);
      if (tc.rawArgs) console.log(`    rawArgs: ${tc.rawArgs.substring(0, 200)}`);
      session.outputIndex++;
    }

    // End with incomplete — crush needs to execute tools and send results
    session.state = 'waiting_for_tool_result';
    sse('response.completed', {
      response: { id: session.responseId, object: 'response', status: 'incomplete',
        incomplete_details: { reason: 'tool_use' },
        model: model || 'default', output: outputItems },
    });
    res.end();
    return;
  }

  // No tool calls — final response
  sse('response.completed', {
    response: { id: session.responseId, object: 'response', status: 'completed',
      model: model || 'default', output: outputItems },
  });
  res.end();
  sessionManager.destroy(session.responseId);
}

/**
 * OpenAI Responses API adapter (/v1/responses)
 * Translates Responses API requests to Chat Completions format,
 * proxies through the existing Cursor flow, and translates back.
 * Required for newer OpenAI clients (e.g. crush devel) that use this endpoint.
 */
router.post('/responses', async (req, res) => {
  try {
    const { model, input, stream = false, instructions } = req.body;
    // Log input structure (not full content)
    const inputSummary = Array.isArray(input) ? input.map(i => ({
      role: i.role, type: i.type,
      contentType: typeof i.content,
      contentIsArray: Array.isArray(i.content),
      content: typeof i.content === 'string' ? i.content.substring(0, 40) : (Array.isArray(i.content) ? i.content.map(c => ({ type: c.type, text: c.text?.substring(0, 40) })) : i.content),
    })) : input;
    const hasTools = req.body.tools && req.body.tools.length > 0;
    console.log('Responses API:', JSON.stringify({ model, stream, tools: req.body.tools?.length, hasTools, input: inputSummary }));
    if (hasTools) {
      console.log('Tools:', JSON.stringify(req.body.tools.map(t => t.name || t.function?.name)).substring(0, 300));
    }

    // Convert Responses API input to Chat Completions messages
    const messages = [];
    if (instructions) {
      messages.push({ role: 'system', content: instructions });
    }

    if (typeof input === 'string') {
      messages.push({ role: 'user', content: input });
    } else if (Array.isArray(input)) {
      for (const item of input) {
        if (typeof item === 'string') {
          messages.push({ role: 'user', content: item });
        } else if (item.role) {
          // Extract text content from various formats
          let text = '';
          if (typeof item.content === 'string') {
            text = item.content;
          } else if (Array.isArray(item.content)) {
            // OpenAI multi-modal content parts
            text = item.content
              .filter(p => p.type === 'input_text' || p.type === 'text' || p.type === 'output_text')
              .map(p => p.text || '')
              .join('');
          }
          if (text) {
            messages.push({ role: item.role === 'developer' ? 'system' : item.role, content: text });
          }
        }
      }
    }

    const authToken = getAuthToken(req);
    if (!authToken) {
      return res.status(401).json({ error: 'No Cursor token available' });
    }

    const cursorModel = mapModelName(model);
    const responseId = `resp-${uuidv4()}`;

    // Agent mode: passthrough tool calls to crush
    if (hasTools) {
      // Check for continuation: function_call_output items that match an active session
      const toolOutputs = Array.isArray(input)
        ? input.filter(item => item.type === 'function_call_output')
        : [];
      // Only treat as continuation if we can find a live session for these call_ids
      let isContinuation = false;
      if (toolOutputs.length > 0) {
        for (const output of toolOutputs) {
          const cid = (output.call_id || '').split('\n')[0];
          if (sessionManager.getByCallId(cid) || sessionManager.getByCallId(output.call_id)) {
            isContinuation = true;
            break;
          }
        }
      }

      if (isContinuation) {
        // --- Path B: Continuation — send tool results to existing Cursor stream ---
        console.log('Tool outputs:', JSON.stringify(toolOutputs.map(o => ({ call_id: o.call_id, output: (o.output||'').substring(0, 60) }))));
        // Find session: try each call_id, fall back to most recent session
        let session = null;
        for (const output of toolOutputs) {
          session = sessionManager.getByCallId(output.call_id);
          if (session) break;
        }
        // Fallback: if crush mangled the call_id, find the most recent waiting session
        if (!session) {
          const allSessions = [];
          // Try to find any session in waiting state
          for (const output of toolOutputs) {
            // call_id might contain newlines or be concatenated - try partial match
            const cleanId = (output.call_id || '').split('\n')[0];
            session = sessionManager.getByCallId(cleanId);
            if (session) break;
          }
        }
        if (!session) {
          return res.status(400).json({ error: 'Session expired or not found for call_ids: ' + toolOutputs.map(o => o.call_id).join(', ') });
        }
        console.log('Continuation for session', session.responseId, '- sending', toolOutputs.length, 'tool results');
        sessionManager.touch(session);
        session.state = 'streaming';

        // Send each tool result to Cursor
        for (const output of toolOutputs) {
          // Find the matching function_call to get the tool name
          const matchingCall = Array.isArray(input)
            ? input.find(item => item.type === 'function_call' && item.call_id === output.call_id)
            : null;
          const crushName = matchingCall?.name || 'bash';
          const toolEnum = toolMapping.crushToCursorEnum(crushName);

          console.log('Sending tool result:', output.call_id, crushName, '->', toolEnum);

          // Encode result for Cursor
          const resultData = { success: true, data: { content: output.output || '', contents: output.output || '', output: output.output || '' } };
          session.client.sendToolResultOnStream(session.stream, toolEnum, output.call_id, resultData);
        }

        // Now listen for Cursor's next response (more tool calls or final text)
        return await handleAgentStreamResponse(res, session, model);
      }

      // --- Path A: Initial request — open new bidi stream ---
      console.log('Agent passthrough mode (structured tools), model:', cursorModel);
      const bidiClient = new BidiCursorClient(process.cwd());
      const { stream: bidiStream } = await bidiClient.openAgentStream(
        authToken,
        messages.map(m => ({ role: m.role, content: m.content })),
        cursorModel,
        STRUCTURED_AGENT_TOOLS,
      );
      console.log('Bidi stream opened for', responseId);

      const session = sessionManager.create(responseId, bidiStream, bidiClient);
      return await handleAgentStreamResponse(res, session, model);
    }

    // Non-agent mode: unidirectional streaming
    const chatHeaders = buildCommonHeaders(authToken.trim());
    chatHeaders['connect-accept-encoding'] = 'gzip';
    chatHeaders['connect-content-encoding'] = 'gzip';
    chatHeaders['content-type'] = 'application/connect+proto';

    const cursorBody = generateCursorBody(messages, cursorModel, {
      agentMode: false, tools: [],
    });

    const dispatcher = config.proxy.enabled
      ? new ProxyAgent(config.proxy.url, { allowH2: true })
      : new Agent({ allowH2: true });

    const response = await fetch('https://api2.cursor.sh/aiserver.v1.ChatService/StreamUnifiedChatWithTools', {
      method: 'POST',
      headers: chatHeaders,
      body: cursorBody,
      dispatcher,
      timeout: { connect: 5000, read: 30000 },
    });

    if (response.status !== 200) {
      return res.status(response.status).json({ error: response.statusText });
    }

    if (stream) {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      let seqNo = 0;
      const sse = (event, data) => {
        data.type = event;
        data.sequence_number = seqNo++;
        res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
      };

      sse('response.created', {
        response: { id: responseId, object: 'response', status: 'in_progress',
          model: model || 'default', output: [] },
      });

      const outputItemId = `msg_${uuidv4()}`;
      sse('response.output_item.added', {
        output_index: 0,
        item: { id: outputItemId, type: 'message', role: 'assistant', content: [] },
      });

      sse('response.content_part.added', {
        output_index: 0, content_index: 0,
        part: { type: 'output_text', text: '' },
      });

      let fullText = '';
      try {
        for await (const chunk of response.body) {
          const { text } = chunkToUtf8String(chunk);
          if (text) {
            fullText += text;
            sse('response.output_text.delta', {
              output_index: 0, content_index: 0, delta: text,
            });
          }
        }
      } catch (e) {
        console.error('Responses stream error:', e.message);
      }
      console.log('Responses fullText:', JSON.stringify(fullText.substring(0, 200)));

      sse('response.output_text.done', {
        output_index: 0, content_index: 0, text: fullText,
      });
      sse('response.content_part.done', {
        output_index: 0, content_index: 0,
        part: { type: 'output_text', text: fullText },
      });
      sse('response.output_item.done', {
        output_index: 0,
        item: { id: outputItemId, type: 'message', role: 'assistant',
          content: [{ type: 'output_text', text: fullText }] },
      });
      sse('response.completed', {
        response: { id: responseId, object: 'response', status: 'completed',
          model: model || 'default',
          output: [{ id: outputItemId, type: 'message', role: 'assistant',
            content: [{ type: 'output_text', text: fullText }] }] },
      });
      res.end();
    } else {
      // Non-streaming: collect full response
      let content = '';
      for await (const chunk of response.body) {
        const { text } = chunkToUtf8String(chunk);
        content += text;
      }

      return res.json({
        id: responseId,
        object: 'response',
        status: 'completed',
        model: model || 'default',
        output: [{
          type: 'message',
          role: 'assistant',
          content: [{ type: 'output_text', text: content }],
        }],
      });
    }
  } catch (error) {
    console.error('Responses API error:', error);
    if (!res.headersSent) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
});

module.exports = router;
