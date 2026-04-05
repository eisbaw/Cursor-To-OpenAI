const os = require('os');

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
};
