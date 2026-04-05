#!/bin/bash
# Start proxy + crush fresh from scratch
set -e
cd "$(dirname "$0")"

echo "Cleaning up..."
# Kill any existing node proxy
ss -tlnp 2>/dev/null | grep ':3010' | grep -oP 'pid=\K[0-9]+' | xargs -r kill -9 2>/dev/null || true
killall -9 node 2>/dev/null || true
sleep 1

# Kill old tmux session
tmux kill-session -t crush 2>/dev/null || true

# Clean logs
rm -f /tmp/proxy.log

# Remove crush project db for fresh session
rm -f .crush/crush.db 2>/dev/null || true

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
if curl -sf --max-time 5 http://localhost:3010/v1/models -H "Authorization: Bearer dummy" > /dev/null 2>&1; then
    echo "Proxy healthy (/v1/models OK)"
else
    echo "WARN: /v1/models check failed (may be auth)"
fi

echo "Starting crush in xterm+tmux..."
xterm -e "tmux new-session -s crush" &
sleep 1

tmux send-keys -t crush "OPENAI_API_KEY=dummy OPENAI_API_ENDPOINT='http://localhost:3010/v1' crush" Enter
echo "Done. Crush is running in tmux session 'crush'"
echo ""
echo "  tmux capture-pane -t crush -p    # see screen"
echo "  cat /tmp/proxy.log               # see proxy logs"
echo "  tmux send-keys -t crush 'text' Enter  # send input"
