const os = require('os');

// Read Cursor auth token from local storage at startup
function loadCursorToken() {
    try {
        const path = require('path');
        const Database = require('better-sqlite3');
        // Inline storage path (avoid circular require with utils.js)
        const homeDir = os.homedir();
        let dbPath;
        switch (process.platform) {
            case 'win32':
                dbPath = path.join(process.env.APPDATA || path.join(homeDir, 'AppData', 'Roaming'), 'Cursor', 'User', 'globalStorage', 'state.vscdb');
                break;
            case 'darwin':
                dbPath = path.join(homeDir, 'Library', 'Application Support', 'Cursor', 'User', 'globalStorage', 'state.vscdb');
                break;
            default:
                dbPath = path.join(homeDir, '.config', 'Cursor', 'User', 'globalStorage', 'state.vscdb');
        }
        const db = new Database(dbPath, { readonly: true });
        const row = db.prepare("SELECT value FROM ItemTable WHERE key = 'cursorAuth/accessToken'").get();
        db.close();
        if (row && row.value) {
            const token = row.value.toString();
            console.log(`Loaded Cursor token from storage (${token.length} chars)`);
            return token;
        }
    } catch (e) {
        console.error('Could not load Cursor token:', e.message);
    }
    return null;
}

const cursorToken = loadCursorToken();

module.exports = {
    port: process.env.PORT || 3010,
    proxy:{
        enabled: false,
        url: 'http://127.0.0.1:7890',
    },
    cursorVersion: process.env.CURSOR_CLIENT_VERSION || '2.6.22',
    oauthClientId: 'KbZUR41cY7W6zRSdpSUJ7I7mLYBKOCmB',
    clientOs: process.platform,
    clientArch: process.arch,
    clientOsVersion: os.release(),
    ghostMode: process.env.CURSOR_GHOST_MODE === 'true',
    cursorToken,
};
