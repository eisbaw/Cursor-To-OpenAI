#!/usr/bin/env bash
# Start proxy + opencode fresh from scratch
set -e
cd "$(dirname "$0")/.."

echo "Cleaning up..."
# Kill any existing node proxy
ss -tlnp 2>/dev/null | grep ':3010' | grep -oP 'pid=\K[0-9]+' | xargs -r kill -9 2>/dev/null || true
sleep 1

# Kill old tmux session
tmux kill-session -t opencode 2>/dev/null || true

# Clean logs
rm -f /tmp/proxy.log

echo "Starting proxy..."
node src/app.js > /tmp/proxy.log 2>&1 &
PROXY_PID=$!
echo "$PROXY_PID" > /tmp/cursor-proxy.pid
sleep 2

# Verify proxy started
if ! grep -q "listens port" /tmp/proxy.log; then
    echo "FAIL: proxy didn't start"
    cat /tmp/proxy.log
    exit 1
fi
echo "Proxy running (PID $PROXY_PID)"

# Verify it responds
if curl -sf --max-time 5 http://localhost:3010/v1/models > /dev/null 2>&1; then
    echo "Proxy healthy (/v1/models OK)"
else
    echo "WARN: /v1/models check failed"
fi

echo "Starting opencode in xterm+tmux..."
xterm -e "tmux new-session -s opencode" &
sleep 2

tmux send-keys -t opencode "opencode" Enter
echo "Done. OpenCode is running in tmux session 'opencode'"
echo ""
echo "  tmux capture-pane -t opencode -p          # see screen"
echo "  cat /tmp/proxy.log                        # see proxy logs"
echo "  tmux send-keys -t opencode 'text' Enter   # send input"
