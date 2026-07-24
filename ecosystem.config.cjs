// Template PM2. `cwd`/port/URL sengaja gak dihardcode ke satu deployment -
// isi lewat env var pas jalanin PM2, contoh:
//   APP_CWD=/var/www/situsklien APP_PORT=3003 APP_URL=https://situsklien.com pm2 start ecosystem.config.cjs
const cwd = process.env.APP_CWD || __dirname;
const port = process.env.APP_PORT || 3000;
const appUrl = process.env.APP_URL || `http://localhost:${port}`;

module.exports = {
  apps: [
    {
      name: process.env.APP_NAME || "cms-bapikir",
      script: "npm",
      args: "start",
      cwd,
      env: {
        NODE_ENV: "production",
        PORT: port,
        NEXT_PUBLIC_APP_URL: appUrl,
      },
      instances: 1,
      exec_mode: "fork",
      max_restarts: 5,
      min_uptime: "10s",
      restart_delay: 5000,
      log_date_format: "YYYY-MM-DD HH:mm:ss",
      error_file: `${cwd}/logs/pm2-error.log`,
      out_file: `${cwd}/logs/pm2-out.log`,
      merge_logs: true,
    },
  ],
};
