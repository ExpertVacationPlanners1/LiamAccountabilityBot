// api/briefing.js
// Generates a daily briefing with one challenge per category
// Stores it in Redis so it persists all day across dashboard + Telegram

const BASE_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

async function redisGet(key) {
  if (!BASE_URL || !TOKEN) return null;
  try {
    const res = await fetch(`${BASE_URL}/get/${key}`, {
      headers: { Authorization: `Bearer ${TOKEN}` }
    });
    const data = await res.json();
    return data.result ? JSON.parse(data.result) : null;
  } catch { return null; }
}

async function redisSet(key, value, exSeconds = 86400) {
  if (!BASE_URL || !TOKEN) return false;
  try {
    const res = await fetch(`${BASE_URL}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(['SET', key, JSON.stringify(value), 'EX', exSeconds])
    });
    const data = await res.json();
    return data.result === 'OK';
  } catch { return false; }
}

const BRIEFING_SYSTEM = `You are Liam's personal life coach. You generate a precise daily briefing.
About Liam: Florida, 5am gym habit, work stress is his main trigger, financial pressure for his family is his biggest fear, former athlete who responds to clear targets and direct challenges.
Stress pattern: stress → overanalysis → hesitation → guilt → lower confidence → more stress.
Your job: give him one sharp, specific challenge per category that he can actually complete today. Not vague. Not motivational fluff. Real actionable targets.`;

async function generateBriefing(date) {
  const dayOfWeek = new Date(date).toLocaleDateString('en-US', { weekday: 'long', timeZone: 'America/New_York' });
  const isWeekend = ['Saturday', 'Sunday'].includes(dayOfWeek);

  const prompt = `Today is ${dayOfWeek}, ${date}. Generate Liam's daily briefing.

Return ONLY valid JSON, no markdown:
{
  "date": "${date}",
  "dayOfWeek": "${dayOfWeek}",
  "greeting": "one punchy opening line referencing the day (max 12 words)",
  "work": {
    "challenge": "one specific work task or target for today (be direct, athletic framing)",
    "why": "one sentence on why this matters today specifically",
    "points": 20
  },
  "personal": {
    "challenge": "one specific personal/health/mindset action for today",
    "why": "one sentence on why this matters",
    "points": 15
  },
  "financial": {
    "challenge": "one specific financial action — review, call, calculate, move money, or track something",
    "why": "one sentence on why this matters",
    "points": 15
  },
  "coachNote": "2-3 sentence opening from coach that sets the tone for today. Reference it's ${dayOfWeek}${isWeekend ? ', acknowledge the weekend, tell him rest and family are valid but don\\'t let the day be wasted' : ''}, and frame the day like a game to win.",
  "targetScore": ${isWeekend ? 65 : 75}
}`;

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 600,
      system: BRIEFING_SYSTEM,
      messages: [{ role: 'user', content: prompt }]
    })
  });

  const data = await res.json();
  const raw = data.content?.[0]?.text?.trim().replace(/```json|```/g, '').trim();
  return JSON.parse(raw);
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const today = new Date().toLocaleDateString('en-US', {
    timeZone: 'America/New_York',
    year: 'numeric', month: '2-digit', day: '2-digit'
  }).replace(/\//g, '-');

  const redisKey = `liam_briefing_${today}`;

  // GET — return today's briefing (generate if not exists)
  if (req.method === 'GET') {
    const force = req.url?.includes('force=true');

    // Try to return cached briefing
    if (!force) {
      const cached = await redisGet(redisKey);
      if (cached) return res.status(200).json({ briefing: cached, cached: true });
    }

    // Generate new briefing
    try {
      const briefing = await generateBriefing(today);
      briefing.generatedAt = new Date().toISOString();
      briefing.challengesCompleted = { work: false, personal: false, financial: false };
      await redisSet(redisKey, briefing, 86400); // expires in 24hrs
      return res.status(200).json({ briefing, cached: false });
    } catch (error) {
      console.error('Briefing generation error:', error);
      // Return fallback briefing
      return res.status(200).json({
        briefing: {
          date: today,
          dayOfWeek: new Date().toLocaleDateString('en-US', { weekday: 'long', timeZone: 'America/New_York' }),
          greeting: "New day. New score. Let's go.",
          work: { challenge: "Identify and complete your single most important work task today.", why: "One completed high-priority task beats five half-started ones.", points: 20 },
          personal: { challenge: "Gym is non-negotiable. After that, set your focus task before opening email.", why: "Your morning routine sets the tone for everything that follows.", points: 15 },
          financial: { challenge: "Open your banking app and write down your exact balance. No avoiding it.", why: "You can't manage what you don't face.", points: 15 },
          coachNote: "Today is a new scorecard. Yesterday doesn't count. You have 24 hours to prove something to yourself — not anyone else. The target is 75+. Let's get it.",
          targetScore: 75,
          challengesCompleted: { work: false, personal: false, financial: false }
        },
        cached: false
      });
    }
  }

  // POST — mark a challenge as completed
  if (req.method === 'POST') {
    const { category } = req.body;
    if (!category) return res.status(400).json({ error: 'category required' });

    const briefing = await redisGet(redisKey);
    if (!briefing) return res.status(404).json({ error: 'No briefing for today' });

    briefing.challengesCompleted = briefing.challengesCompleted || {};
    briefing.challengesCompleted[category] = true;
    await redisSet(redisKey, briefing, 86400);

    return res.status(200).json({ briefing });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
