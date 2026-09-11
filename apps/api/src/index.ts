import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { bpmRoutes } from './features/get-bpm/api/routes.js';
import { chordRoutes } from './features/get-chord/api/routes.js';
import { searchRoutes } from './features/search-chords/api/routes.js';
import { env } from './shared/config/env.js';

const app = new Hono();

app.use(
  '*',
  cors({
    origin: env.CORS_ORIGIN,
  }),
);

app.route('/api', chordRoutes);
app.route('/api', searchRoutes);
app.route('/api', bpmRoutes);

serve(
  {
    fetch: app.fetch,
    port: env.PORT,
  },
  () => {
    console.log(`API running on http://localhost:${env.PORT}`);
  },
);
