// api/telegram.js — Telegram webhook handler
// Receives messages from Liam, processes with Claude, responds with coaching

const COACH_SYSTEM = `You are Liam's personal AI life coach and accountability partner, delivered via Telegram.

About Liam:
- Lives in Florida (Eastern time)
- 5am gym habit — already strong, protect it
- Work stress is his main trigger right now
- Financial pressure for his family is his biggest fear
- Stress pattern: stress → overanalysis → hesitation → guilt → lower confidence → more stress
- He needs direct, practical coaching — not fluff, not endless reflection

Your rules:
- Keep responses to 2-4 sentences MAX (this is Telegram, not a novel)
- Be warm but direct — call out excuses, reframe fear, push toward one clear action
- End every substantive response with one specific next move
- If he shares a win, acknowledge it briefly and build on it
- If he shares a struggle, name what's actually happening, then redirect
- Never say "I understand" or "that must be hard" — just help him move
- Use occasional emojis naturally, not excessively

You have memory of this conversation. Build on what he shares.`;

async function sendTelegram(chatId, text, replyMarkup = null) {
  const body = {
    chat_id: chatId,
    text,
    parse_mode: 'Markdown'
  };
  if (replyMarkup) body.reply_markup = replyMarkup;

  await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
}

async function getCoachingResponse(userMessage, conversationHistory = []) {
  const messages = [
    ...conversationHistory,
    { role: 'user', content: userMessage }
  ];

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 300,
      system: COACH_SYSTEM,
      messages
    })
  });

  const data = await response.json();
  return data.content?.[0]?.text || "Keep moving. What's your next step?";
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, callback_query } = req.body;

    // Handle callback query (button taps)
    if (callback_query) {
      const chatId = callback_query.message.chat.id;
      const data = callback_query.data;

      // Answer the callback
      await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/answerCallbackQuery`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ callback_query_id: callback_query.id })
      });

      const quickResponses = {
        'done_gym': "💪 That's your foundation locked in. Now set your #1 work task for today.",
        'skipped_gym': "Noted. What got in the way? And what's your move to fix it tomorrow?",
        'focus_high': "🔥 Strong focus day. Make the next 2 hours count before the afternoon drop.",
        'focus_low': "What's stealing your attention? Name the one thing you need to cut or postpone.",
        'day_good': "Good day. Write down the one thing that made it good — so you can repeat it.",
        'day_tough': "Tough days build resilience. What's one thing you'll do differently tomorrow?"
      };

      const reply = quickResponses[data] || await getCoachingResponse(data);
      await sendTelegram(chatId, reply);
      return res.status(200).json({ ok: true });
    }

    if (!message?.text) {
      return res.status(200).json({ ok: true });
    }

    const chatId = message.chat.id;
    const text = message.text;
    const firstName = message.from?.first_name || 'Liam';

    // Handle /start command
    if (text === '/start') {
      await sendTelegram(chatId,
        `Hey ${firstName} 👋\n\nI'm your personal accountability coach. I'll check in with you 5 times a day, push you toward your goals, and be here whenever you need to think something through.\n\n*Your daily touchpoints (ET):*\n🏋️ 5:00am — Gym activation\n☀️ 8:00am — Morning intention\n⚡ 1:00pm — Midday pulse\n🌙 8:00pm — Evening review\n😴 10:00pm — Pre-sleep wind down\n\nReply to any of my messages or just talk to me anytime. What's on your mind right now?`
      );
      return res.status(200).json({ ok: true });
    }

    // Handle /dashboard command
    if (text === '/dashboard') {
      const url = process.env.DASHBOARD_URL || 'https://liam-accountability.vercel.app';
      await sendTelegram(chatId,
        `📊 *Your Dashboard*\n\n[Open Accountability System](${url})\n\nAll your goals, history, budget tracker, and progress are there. Add it to your iPhone home screen for instant access.`
      );
      return res.status(200).json({ ok: true });
    }

    // Handle /wins command
    if (text === '/wins') {
      await sendTelegram(chatId,
        `🏆 *Log a Win*\n\nTell me what you accomplished — big or small. Every win gets logged to your history.\n\nJust reply with what you did.`
      );
      return res.status(200).json({ ok: true });
    }

    // Handle /status command
    if (text === '/status') {
      const now = new Date();
      const etHour = (now.getUTCHours() - 4 + 24) % 24; // EDT
      const nextTouchpoints = [
        { hour: 5, label: '🏋️ Gym activation' },
        { hour: 8, label: '☀️ Morning intention' },
        { hour: 13, label: '⚡ Midday pulse' },
        { hour: 20, label: '🌙 Evening review' },
        { hour: 22, label: '😴 Pre-sleep wind down' }
      ];
      const next = nextTouchpoints.find(t => t.hour > etHour) || nextTouchpoints[0];
      await sendTelegram(chatId,
        `📍 *Status*\n\nCurrent time: ${etHour}:${String(now.getUTCMinutes()).padStart(2,'0')} ET\nNext check-in: *${next.label}*\n\nWhat do you need right now?`
      );
      return res.status(200).json({ ok: true });
    }

    // Standard message — get coaching response
    const reply = await getCoachingResponse(text);
    await sendTelegram(chatId, reply);

    return res.status(200).json({ ok: true });

  } catch (error) {
    console.error('Telegram webhook error:', error);
    return res.status(200).json({ ok: true }); // Always return 200 to Telegram
  }
}
