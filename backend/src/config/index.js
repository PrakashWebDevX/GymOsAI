import dotenv from 'dotenv';

dotenv.config();

const requiredEnvVars = ['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY', 'JWT_SECRET', 'GEMINI_API_KEY'];

requiredEnvVars.forEach((key) => {
  if (!process.env[key]) {
    console.warn(`Warning: ${key} is not set in environment variables`);
  }
});

export const config = {
  port: parseInt(process.env.PORT, 10) || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  supabase: {
    url: process.env.SUPABASE_URL,
    anonKey: process.env.SUPABASE_ANON_KEY,
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  gemini: {
    apiKey: process.env.GEMINI_API_KEY,
  },
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  },
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000,
    max: parseInt(process.env.RATE_LIMIT_MAX, 10) || 100,
  },
};

export default config;
