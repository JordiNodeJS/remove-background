// ecosystem.config.js para monorepo Bun + Next.js + Express
// Ejecuta "bun start" en la raíz, que a su vez arranca ambos servicios

module.exports = {
  apps: [
    {
      name: "monorepo-bun-start",
      script: "bun",
      args: "start",
      cwd: __dirname, // raíz del monorepo
      interpreter: "none", // usa el shebang de bun
      env: {
        NODE_ENV: "production",
        // Puedes añadir aquí variables globales si lo necesitas
      },
      watch: false,
      autorestart: true,
      max_restarts: 5,
      error_file: "./logs/pm2-error.log",
      out_file: "./logs/pm2-out.log",
      merge_logs: true,
    },
  ],
};
