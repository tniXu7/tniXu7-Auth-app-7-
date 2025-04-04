const fs = require('fs');
const path = require('path');

const CACHE_FILE = path.join(__dirname, 'cache.json');
const TTL = 60 * 1000; // 1 минута

function getCachedData() {
    if (fs.existsSync(CACHE_FILE)) {
        const raw = fs.readFileSync(CACHE_FILE);
        const cached = JSON.parse(raw);
        if (Date.now() - cached.timestamp < TTL) {
            return cached.data;
        }
    }

    const data = `Generated at ${new Date().toLocaleString()}`;
    fs.writeFileSync(CACHE_FILE, JSON.stringify({
        data,
        timestamp: Date.now()
    }));
    return data;
}

module.exports = { getCachedData };
