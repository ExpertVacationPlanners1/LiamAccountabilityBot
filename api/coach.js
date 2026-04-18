// api/coach.js — Claude AI coaching endpoint for the dashboard chat

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const { messages, system } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'messages required' });
  }

  const DEFAULT_SYSTEM = `You are Liam's personal AI life coach. About Liam: lives in Florida, 5am gym habit, work stress is his main trigger, financial pressure for his family is his biggest fear. Stress pattern: stress → overanalysis → hesitation → guilt → lower confidence → more stress. Rules: keep responses to 3-5 sentences max. Be warm but direct. End every response with one specific next move. Never say "I understand" or "that must be hard" — just help him move forward.`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 400,
        system: system || DEFAULT_SYSTEM,
        messages: messages.slice(-10) // Keep last 10 messages for context
      })
    });

    const data = await response.json();
    const reply = data.content?.[0]?.text || "Keep moving. What's your next step?";

    return res.status(200).json({ reply });
  } catch (error) {
    console.error('Coach API error:', error);
    return res.status(500).json({ error: 'Coach unavailable', reply: "Having trouble connecting right now. Try again in a moment." });
  }
}
