// api/todos.js — uses KV_REST_API_URL + KV_REST_API_TOKEN (Vercel/Upstash)
const KV_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || process.env.KV_URL;
const KV_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
const TODOS_KEY = 'liam_todos';

async function kvGet() {
  if (!KV_URL || !KV_TOKEN) {
    console.error('KV not configured. URL:', !!KV_URL, 'TOKEN:', !!KV_TOKEN);
    return [];
  }
  try {
    const res = await fetch(`${KV_URL}/get/${TODOS_KEY}`, {
      headers: { Authorization: `Bearer ${KV_TOKEN}` }
    });
    const data = await res.json();
    return data.result ? JSON.parse(data.result) : [];
  } catch (e) {
    console.error('kvGet error:', e);
    return [];
  }
}

async function kvSet(todos) {
  if (!KV_URL || !KV_TOKEN) return;
  try {
    await fetch(`${KV_URL}/set/${TODOS_KEY}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${KV_TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(JSON.stringify(todos))
    });
  } catch (e) {
    console.error('kvSet error:', e);
  }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') {
    const todos = await kvGet();
    return res.status(200).json({ todos });
  }

  if (req.method === 'POST') {
    const { text, category, priority, source } = req.body;
    if (!text) return res.status(400).json({ error: 'text required' });
    const todos = await kvGet();
    const newTodo = {
      id: Date.now(),
      text: text.trim(),
      category: category || 'personal',
      priority: priority || 'medium',
      done: false,
      source: source || 'dashboard',
      createdAt: new Date().toISOString(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    };
    todos.unshift(newTodo);
    await kvSet(todos.slice(0, 100));
    return res.status(200).json({ todo: newTodo, todos: todos.slice(0, 100) });
  }

  if (req.method === 'PATCH') {
    const { id, done, text } = req.body;
    const todos = await kvGet();
    const updated = todos.map(t =>
      t.id === Number(id)
        ? { ...t, ...(done !== undefined ? { done } : {}), ...(text ? { text } : {}) }
        : t
    );
    await kvSet(updated);
    return res.status(200).json({ todos: updated });
  }

  if (req.method === 'DELETE') {
    const { id } = req.body;
    const todos = await kvGet();
    await kvSet(todos.filter(t => t.id !== Number(id)));
    return res.status(200).json({ ok: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
