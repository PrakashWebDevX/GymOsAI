import app from './app.js';
import config from './config/index.js';

const server = app.listen(config.port, () => {
  console.log(`🚀 GYMOS AI Server running on port ${config.port} [${config.nodeEnv}]`);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => process.exit(0));
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  server.close(() => process.exit(1));
});

export default server;
