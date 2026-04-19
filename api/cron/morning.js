// api/cron/morning.js — 8am ET daily briefing with category challenges

async function sendTelegram(chatId, text, keyboard = null) {
  const body = { chat_id: chatId, text, parse_mode: 'Markdown' };
  if (keyboard) body.reply_markup = { inline_keyboard: keyboard };
  await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
}

async function getBriefing() {
  const base = process.env.DASHBOARD_URL || 'https://liam-accountability-bot.vercel.app';
  const res = await fetch(`${base}/api/briefing`);
  if (!res.ok) throw new Error('Briefing API error');
  const data = await res.json();
  return data.briefing;
}

export default async function handler(req, res) {
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const chatId = process.env.TELEGRAM_CHAT_ID;
    const briefing = await getBriefing();

    // Message 1: Opening + target
    await sendTelegram(chatId,
      `☀️ *Good Morning — Daily Briefing*\n*${briefing.dayOfWeek}*\n\n${briefing.coachNote}\n\n🎯 *Today's target score: ${briefing.targetScore}/100*`
    );

    await new Promise(r => setTimeout(r, 1500));

    // Message 2: Three challenges with tap-to-complete buttons
    await sendTelegram(chatId,
      `📋 *Today's 3 Challenges*\n\n💼 *WORK — ${briefing.work.points} pts*\n${briefing.work.challenge}\n_${briefing.work.why}_\n\n🏠 *PERSONAL — ${briefing.personal.points} pts*\n${briefing.personal.challenge}\n_${briefing.personal.why}_\n\n📈 *FINANCIAL — ${briefing.financial.points} pts*\n${briefing.financial.challenge}\n_${briefing.financial.why}_\n\n✅ Tap when done to log your points:`,
      [
        [
          { text: '💼 Work ✓', callback_data: 'challenge_work' },
          { text: '🏠 Personal ✓', callback_data: 'challenge_personal' },
          { text: '📈 Financial ✓', callback_data: 'challenge_financial' }
        ],
        [
          { text: '📊 Open Dashboard', url: process.env.DASHBOARD_URL || 'https://liam-accountability-bot.vercel.app' }
        ]
      ]
    );

    return res.status(200).json({ ok: true, sent: 'morning_briefing' });
  } catch (error) {
    console.error('Morning briefing error:', error);
    try {
      const chatId = process.env.TELEGRAM_CHAT_ID;
      const day = new Date().toLocaleDateString('en-US', { weekday: 'long', timeZone: 'America/New_York' });
      await sendTelegram(chatId,
        `☀️ *Morning — ${day}*\n\n3 jobs today:\n💼 Work: Do your most important task first\n🏠 Personal: Protect your morning routine\n📈 Financial: Face one number you've been avoiding\n\nTarget: 75+. Let's go.`
      );
    } catch {}
    return res.status(200).json({ ok: true, sent: 'fallback' });
  }
}
