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
} = require('../utils/utils.js');
const { ToolExecutor } = require('../utils/toolExecutor.js');
const { BidiCursorClient } = require('../utils/bidiClient.js');

router.get("/models", async (req, res) => {
  try{
    let bearerToken = req.headers.authorization?.replace('Bearer ', '');
    if (!bearerToken) {
      return res.status(401).json({ error: "Missing Authorization header" });
    }
    let authToken = bearerToken.split(',').map((key) => key.trim())[0];
    if (authToken && authToken.includes('%3A%3A')) {
      authToken = authToken.split('%3A%3A')[1];
    }
    else if (authToken && authToken.includes('::')) {
      authToken = authToken.split('::')[1];
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
    const { model, messages, stream = false, tools = null } = req.body;
    
    // Agent mode is enabled when tools are provided
    // See TASK-110-tool-enum-mapping.md for mode values
    const agentMode = tools && Array.isArray(tools) && tools.length > 0;
    
    let bearerToken = req.headers.authorization?.replace('Bearer ', '');
    if (!bearerToken) {
      return res.status(401).json({ error: 'Missing Authorization header' });
    }
    
    const keys = bearerToken.split(',').map((key) => key.trim());
    // Randomly select one key to use
    let authToken = keys[Math.floor(Math.random() * keys.length)]

    if (!messages || !Array.isArray(messages) || messages.length === 0 || !authToken) {
      return res.status(400).json({
        error: 'Invalid request. Messages should be a non-empty array and authorization is required',
      });
    }

    if (authToken && authToken.includes('%3A%3A')) {
      authToken = authToken.split('%3A%3A')[1];
    }
    else if (authToken && authToken.includes('::')) {
      authToken = authToken.split('::')[1];
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
 * OpenAI Responses API adapter (/v1/responses)
 * Translates Responses API requests to Chat Completions format,
 * proxies through the existing Cursor flow, and translates back.
 * Required for newer OpenAI clients (e.g. crush devel) that use this endpoint.
 */
router.post('/responses', async (req, res) => {
  try {
    const { model, input, stream = false, instructions } = req.body;

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
        } else if (item.role && item.content) {
          messages.push({ role: item.role, content: typeof item.content === 'string' ? item.content : JSON.stringify(item.content) });
        }
      }
    }

    // Forward as internal request to chat/completions handler
    const bearerToken = req.headers.authorization?.replace('Bearer ', '');
    if (!bearerToken) {
      return res.status(401).json({ error: 'Missing Authorization header' });
    }

    let authToken = bearerToken.split(',').map(k => k.trim())[0];
    if (authToken && authToken.includes('%3A%3A')) authToken = authToken.split('%3A%3A')[1];
    else if (authToken && authToken.includes('::')) authToken = authToken.split('::')[1];

    const chatHeaders = buildCommonHeaders(authToken.trim());
    chatHeaders['connect-accept-encoding'] = 'gzip';
    chatHeaders['content-type'] = 'application/connect+proto';

    const cursorBody = generateCursorBody(messages, model || 'default', {
      agentMode: false,
      tools: [],
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

    const responseId = `resp-${uuidv4()}`;

    if (stream) {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      // Send response.created event
      res.write(`event: response.created\ndata: ${JSON.stringify({
        id: responseId, object: 'response', status: 'in_progress',
        model: model || 'default', output: [],
      })}\n\n`);

      const outputItemId = `msg_${uuidv4()}`;
      res.write(`event: response.output_item.added\ndata: ${JSON.stringify({
        output_index: 0,
        item: { id: outputItemId, type: 'message', role: 'assistant', content: [] },
      })}\n\n`);

      const contentPartId = `cp_${uuidv4()}`;
      res.write(`event: response.content_part.added\ndata: ${JSON.stringify({
        output_index: 0, content_index: 0,
        part: { type: 'output_text', text: '' },
      })}\n\n`);

      try {
        for await (const chunk of response.body) {
          const { text } = chunkToUtf8String(chunk);
          if (text) {
            res.write(`event: response.output_text.delta\ndata: ${JSON.stringify({
              output_index: 0, content_index: 0, delta: text,
            })}\n\n`);
          }
        }
      } catch (e) {
        console.error('Responses stream error:', e.message);
      }

      res.write(`event: response.output_text.done\ndata: ${JSON.stringify({
        output_index: 0, content_index: 0, text: '',
      })}\n\n`);
      res.write(`event: response.completed\ndata: ${JSON.stringify({
        id: responseId, object: 'response', status: 'completed',
      })}\n\n`);
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
