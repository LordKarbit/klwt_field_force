import fs from 'node:fs';
import cors from 'cors';
import express from 'express';
import { toNodeHandler } from 'better-auth/node';
import { auth } from './auth';
import { migrate } from './db/migrate';
import { seedDatabase } from './seed';
import { registerApiRoutes } from './routes';

fs.mkdirSync('data', { recursive: true });

migrate();
if (process.env.SEED_DEMO_DATA === 'true' || process.env.NODE_ENV !== 'production') {
  await seedDatabase();
}

const app = express();
const api = express.Router();
const port = Number(process.env.API_PORT ?? 3005);
const allowedOrigins = new Set(
  (process.env.CORS_ORIGINS ?? 'http://127.0.0.1:3010,http://localhost:3010,http://127.0.0.1:5173,http://localhost:5173')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.has(origin)) return callback(null, true);
      return callback(new Error('Origin is not allowed by CORS'));
    },
    credentials: true,
  }),
);

app.all('/api/auth/*', toNodeHandler(auth));
app.use(express.json({ limit: '12mb' }));

registerApiRoutes(api);
app.use('/api', api);

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

app.listen(port, '127.0.0.1', () => {
  console.log(`KLWT backend API running on http://127.0.0.1:${port}`);
});
