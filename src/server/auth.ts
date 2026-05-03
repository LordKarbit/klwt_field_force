import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import bcrypt from 'bcryptjs';
import { db, schema } from './db';

const isProduction = process.env.NODE_ENV === 'production';
const authSecret = process.env.BETTER_AUTH_SECRET;

if (isProduction && !authSecret) {
  throw new Error('BETTER_AUTH_SECRET is required in production.');
}

const trustedOrigins = (process.env.AUTH_TRUSTED_ORIGINS ?? 'http://127.0.0.1:3010,http://localhost:3010,http://127.0.0.1:5173,http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

export const auth = betterAuth({
  appName: 'Polibeli KLWT Surveyor',
  baseURL: process.env.AUTH_BASE_URL ?? 'http://127.0.0.1:3005',
  basePath: '/api/auth',
  secret: authSecret ?? 'polibeli-klwt-dev-secret-change-me',
  trustedOrigins,
  database: drizzleAdapter(db, {
    provider: 'sqlite',
    schema,
    camelCase: true,
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    minPasswordLength: 4,
    password: {
      hash: async (password) => bcrypt.hash(password, 12),
      verify: async ({ hash, password }) => bcrypt.compare(password, hash),
    },
  },
  advanced: {
    useSecureCookies: isProduction,
  },
});
