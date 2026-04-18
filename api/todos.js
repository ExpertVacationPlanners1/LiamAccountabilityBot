// api/todos.js — Upstash Redis REST API (correct command format)

// Supports multiple env var naming conventions
const BASE_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || process.env.KV_URL || process.env.REDIS_URL;
const TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_READ_ONLY_TOKEN;
const KEY = 'liam_todos';

// Upstash REST API uses command array format: ["COMMAND", "key", "value"]
async function redisGet(key) {
  if (!BASE_URL || !TOKEN) {
    console.log('No Redis URL/Token found');
    return null;
  }
  try {
    const res = await fetch(`${BASE_URL}/get/${key}`, {
      headers: { Authorization: `Bearer ${TOKEN}` }
    });
    const data = await res.json();
    if (data.result === null || data.result === undefined) return null;
    return JSON.parse(data.result);
  } catch (e) {
    console.error('Redis GET error:', e);
    return null;
  }
}

async function redisSet(key, value) {
  if (!BASE_URL || !TOKEN) return false;
  try {
    const encoded = encodeURIComponent(JSON.stringify(value));
    const res = await fetch(`${BASE_URL}/set/${key}/${encoded}`, {
      method: 'GET', // Upstash supports GET-style commands
      headers: { Authorization: `Bearer ${TOKEN}` }
    });
    const data = await res.json();
    return data.result === 'OK';
  } catch (e) {
    console.error('Redis SET error:', e);
    // Try alternate format
    try {
      const res = await fetch(`${BASE_URL}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(['SET', key, JSON.stringify(value)])
      });
      const data = await res.json();
      return data.result === 'OK';
    } catch (e2) {
      console.error('Redis SET fallback error:', e2);
      return false;
    }
  }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  // Debug endpoint
  if (req.method === 'GET' && req.url?.includes('debug')) {
    return res.status(200).json({
      has_url: !!BASE_URL,
      has_token: !!TOKEN,
      url_prefix: BASE_URL ? BASE_URL.slice(0, 30) + '...' : null
    });
  }

  if (req.method === 'GET') {
    const todos = (await redisGet(KEY)) || [];
    return res.status(200).json({ todos });
  }

  if (req.method === 'POST') {
    const { text, category, priority, source } = req.body;
    if (!text) return res.status(400).json({ error: 'text required' });
    const todos = (await redisGet(KEY)) || [];
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
    const updated = [newTodo, ...todos].slice(0, 100);
    const ok = await redisSet(KEY, updated);
    if (!ok) {
      console.error('Failed to save todo - Redis not configured?');
      return res.status(500).json({ error: 'Save failed — check Redis env vars' });
    }
    return res.status(200).json({ todo: newTodo, todos: updated });
  }

  if (req.method === 'PATCH') {
    const { id, done, text } = req.body;
    const todos = (await redisGet(KEY)) || [];
    const updated = todos.map(t =>
      t.id === Number(id)
        ? { ...t, ...(done !== undefined ? { done } : {}), ...(text ? { text } : {}) }
        : t
    );
    await redisSet(KEY, updated);
    return res.status(200).json({ todos: updated });
  }

  if (req.method === 'DELETE') {
    const { id } = req.body;
    const todos = (await redisGet(KEY)) || [];
    const updated = todos.filter(t => t.id !== Number(id));
    await redisSet(KEY, updated);
    return res.status(200).json({ todos: updated });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
