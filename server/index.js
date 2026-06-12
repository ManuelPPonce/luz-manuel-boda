import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import db from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// ─── Guest endpoints ───

app.get('/api/guests', (req, res) => {
  const guests = db.prepare('SELECT * FROM guests ORDER BY name').all();
  res.json(guests.map(g => ({ ...g, companionNames: JSON.parse(g.companionNames || '[]'), confirmed: !!g.confirmed })));
});

app.post('/api/guests', (req, res) => {
  const { id, name, guests, companionNames, tableNumber, confirmed } = req.body;
  db.prepare('INSERT OR REPLACE INTO guests (id, name, guests, companionNames, tableNumber, confirmed) VALUES (?, ?, ?, ?, ?, ?)')
    .run(id, name, guests, JSON.stringify(companionNames || []), tableNumber, confirmed ? 1 : 0);
  res.json({ ok: true });
});

app.put('/api/guests/:id', (req, res) => {
  const fields = [];
  const values = [];
  for (const key of ['name', 'guests', 'tableNumber', 'confirmed']) {
    if (req.body[key] !== undefined) {
      fields.push(`${key} = ?`);
      values.push(key === 'confirmed' ? (req.body[key] ? 1 : 0) : req.body[key]);
    }
  }
  if (req.body.companionNames !== undefined) {
    fields.push('companionNames = ?');
    values.push(JSON.stringify(req.body.companionNames));
  }
  if (fields.length) {
    values.push(req.params.id);
    db.prepare(`UPDATE guests SET ${fields.join(', ')} WHERE id = ?`).run(...values);
  }
  res.json({ ok: true });
});

app.delete('/api/guests/:id', (req, res) => {
  db.prepare('DELETE FROM guests WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

app.get('/api/guests/search', (req, res) => {
  const q = req.query.q || '';
  const guests = db.prepare('SELECT * FROM guests WHERE LOWER(name) LIKE ? ORDER BY name').all(`%${q.toLowerCase()}%`);
  res.json(guests.map(g => ({ ...g, companionNames: JSON.parse(g.companionNames || '[]'), confirmed: !!g.confirmed })));
});

// ─── Confirmed guests (RSVP) ───

app.get('/api/confirmed', (req, res) => {
  const all = db.prepare('SELECT * FROM confirmed ORDER BY confirmedAt DESC').all();
  res.json(all.map(c => ({ ...c, checkedIn: !!c.checkedIn })));
});

app.post('/api/confirmed', (req, res) => {
  const { id, name, email, guests, dietary, message, songs, confirmedAt, tableNumber, checkedIn, checkedInAt } = req.body;
  db.prepare('INSERT OR REPLACE INTO confirmed (id, name, email, guests, dietary, message, songs, confirmedAt, tableNumber, checkedIn, checkedInAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
    .run(id, name, email || '', guests || 0, dietary || '', message || '', songs || '', confirmedAt || '', tableNumber || 0, checkedIn ? 1 : 0, checkedInAt || '');
  res.json({ ok: true });
});

app.put('/api/confirmed/:id', (req, res) => {
  const fields = [];
  const values = [];
  for (const key of ['checkedIn', 'checkedInAt', 'guests', 'songs']) {
    if (req.body[key] !== undefined) {
      fields.push(`${key} = ?`);
      values.push(key === 'checkedIn' ? (req.body[key] ? 1 : 0) : req.body[key]);
    }
  }
  if (fields.length) {
    values.push(req.params.id);
    db.prepare(`UPDATE confirmed SET ${fields.join(', ')} WHERE id = ?`).run(...values);
  }
  res.json({ ok: true });
});

app.delete('/api/confirmed/:id', (req, res) => {
  db.prepare('DELETE FROM confirmed WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

// ─── Tables ───

app.get('/api/tables', (req, res) => {
  res.json(db.prepare('SELECT * FROM tables_data ORDER BY number').all());
});

app.post('/api/tables', (req, res) => {
  const { id, number, capacity, x, y, w, h, rotation, shape, type } = req.body;
  db.prepare('INSERT OR REPLACE INTO tables_data (id, number, capacity, x, y, w, h, rotation, shape, type) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
    .run(id, number, capacity, x ?? 0, y ?? 0, w ?? 100, h ?? 100, rotation ?? 0, shape || 'circle', type || 'guest');
  res.json({ ok: true });
});

app.put('/api/tables/:id', (req, res) => {
  const fields = [];
  const values = [];
  for (const key of ['number', 'capacity', 'x', 'y', 'w', 'h', 'rotation', 'shape', 'type']) {
    if (req.body[key] !== undefined) {
      fields.push(`${key} = ?`);
      values.push(req.body[key]);
    }
  }
  if (fields.length) {
    values.push(req.params.id);
    db.prepare(`UPDATE tables_data SET ${fields.join(', ')} WHERE id = ?`).run(...values);
  }
  res.json({ ok: true });
});

app.delete('/api/tables/:id', (req, res) => {
  db.prepare('DELETE FROM tables_data WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

// ─── Combined endpoint for dashboard ───

app.get('/api/combined', (req, res) => {
  const preGuests = db.prepare('SELECT * FROM guests').all();
  const confirmed = db.prepare('SELECT * FROM confirmed').all();
  const confirmedMap = new Map(confirmed.map(c => [c.id, c]));

  const result = preGuests.map(g => {
    const c = confirmedMap.get(g.id);
    return {
      id: g.id, name: g.name, guests: g.guests,
      companionNames: JSON.parse(g.companionNames || '[]'),
      tableNumber: g.tableNumber, confirmed: !!g.confirmed,
      checkedIn: c ? !!c.checkedIn : false,
      checkedInAt: c?.checkedInAt || '',
      email: c?.email || '', dietary: c?.dietary || '',
      message: c?.message || '', songs: c?.songs || '',
      confirmedAt: c?.confirmedAt || '',
    };
  });

  for (const c of confirmed) {
    if (!preGuests.find(p => p.id === c.id)) {
      result.push({
        id: c.id, name: c.name, guests: c.guests,
        companionNames: [], tableNumber: c.tableNumber,
        confirmed: true, checkedIn: !!c.checkedIn,
        checkedInAt: c.checkedInAt || '',
        email: c.email, dietary: c.dietary,
        message: c.message, songs: c.songs,
        confirmedAt: c.confirmedAt,
      });
    }
  }

  res.json(result);
});

// ─── Serve static frontend ───

const distPath = join(__dirname, '..', 'dist');
app.use(express.static(distPath));
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api/')) {
    res.sendFile(join(distPath, 'index.html'));
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
