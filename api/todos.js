// api/todos.js — Shared todo store between Telegram bot and dashboard
// Uses Vercel KV (Upstash Redis REST API) if configured, falls back to in-memory

const KV_URL = process.env.KV_REST_API_URL;
const KV_TOKEN = process.env.KV_REST_API_TOKEN;
const TODOS_KEY = 'liam_todos';

// ── KV helpers ──────────────────────────────────────────────────────────────
async function kvGet() {
  if (!KV_URL || !KV_TOKEN) return [];
  try {
    const res = await fetch(`${KV_URL}/get/${TODOS_KEY}`, {
      headers: { Authorization: `Bearer ${KV_TOKEN}` }
    });
    const data = await res.json();
    return data.result ? JSON.parse(data.result) : [];
  } catch { return []; }
}

async function kvSet(todos) {
  if (!KV_URL || !KV_TOKEN) return;
  try {
    await fetch(`${KV_URL}/set/${TODOS_KEY}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${KV_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(JSON.stringify(todos))
    });
  } catch (e) { console.error('KV set error:', e); }
}

// ── Main handler ─────────────────────────────────────────────────────────────
export default async function handler(req, res) {
  // CORS for dashboard
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  // GET — return all todos
  if (req.method === 'GET') {
    const todos = await kvGet();
    return res.status(200).json({ todos });
  }

  // POST — add a new todo
  if (req.method === 'POST') {
    const { text, category, priority, source } = req.body;
    if (!text) return res.status(400).json({ error: 'text is required' });

    const todos = await kvGet();
    const newTodo = {
      id: Date.now(),
      text: text.trim(),
      category: category || 'personal',
      priority: priority || 'medium',
      done: false,
      source: source || 'dashboard', // 'telegram' | 'dashboard'
      createdAt: new Date().toISOString(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    };

    todos.unshift(newTodo);
    // Keep last 100 todos
    const trimmed = todos.slice(0, 100);
    await kvSet(trimmed);

    return res.status(200).json({ todo: newTodo, todos: trimmed });
  }

  // PATCH — update a todo (mark done/undone, edit text)
  if (req.method === 'PATCH') {
    const { id, done, text } = req.body;
    const todos = await kvGet();
    const updated = todos.map(t => {
      if (t.id === Number(id)) {
        return {
          ...t,
          ...(done !== undefined ? { done } : {}),
          ...(text ? { text } : {})
        };
      }
      return t;
    });
    await kvSet(updated);
    return res.status(200).json({ todos: updated });
  }

  // DELETE — remove a todo
  if (req.method === 'DELETE') {
    const { id } = req.body;
    const todos = await kvGet();
    const filtered = todos.filter(t => t.id !== Number(id));
    await kvSet(filtered);
    return res.status(200).json({ todos: filtered });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
