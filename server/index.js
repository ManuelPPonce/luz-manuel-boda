import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import * as store from './store.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

function asyncRoute(handler) {
  return async (req, res) => {
    try {
      const data = await handler(req, res);
      if (!res.headersSent) res.json(data ?? { ok: true });
    } catch (error) {
      console.error('API error', error);
      res.status(500).json({ ok: false, error: 'No se pudo guardar la informacion' });
    }
  };
}

app.get('/api/health', (req, res) => {
  res.json({ ok: true, database: store.isSupabaseEnabled() ? 'supabase' : 'sqlite' });
});

// Guest endpoints
app.get('/api/guests', asyncRoute(() => store.getGuests()));
app.post('/api/guests', asyncRoute(async (req) => {
  await store.saveGuest(req.body);
}));
app.put('/api/guests/:id', asyncRoute(async (req) => {
  await store.updateGuest(req.params.id, req.body);
}));
app.delete('/api/guests/:id', asyncRoute(async (req) => {
  await store.deleteGuest(req.params.id);
}));
app.get('/api/guests/search', asyncRoute((req) => store.searchGuests(req.query.q || '')));

// Confirmed guests (RSVP)
app.get('/api/confirmed', asyncRoute(() => store.getConfirmed()));
app.post('/api/confirmed', asyncRoute(async (req) => {
  await store.saveConfirmed(req.body);
}));
app.put('/api/confirmed/:id', asyncRoute(async (req) => {
  await store.updateConfirmed(req.params.id, req.body);
}));
app.delete('/api/confirmed/:id', asyncRoute(async (req) => {
  await store.deleteConfirmed(req.params.id);
}));

// Tables
app.get('/api/tables', asyncRoute(() => store.getTables()));
app.post('/api/tables', asyncRoute(async (req) => {
  await store.saveTable(req.body);
}));
app.put('/api/tables/:id', asyncRoute(async (req) => {
  await store.updateTable(req.params.id, req.body);
}));
app.delete('/api/tables/:id', asyncRoute(async (req) => {
  await store.deleteTable(req.params.id);
}));

app.get('/api/combined', asyncRoute(() => store.getCombined()));

const distPath = join(__dirname, '..', 'dist');
app.use(express.static(distPath));
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api/')) {
    res.sendFile(join(distPath, 'index.html'));
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT} usando ${store.isSupabaseEnabled() ? 'Supabase' : 'SQLite local'}`);
});
