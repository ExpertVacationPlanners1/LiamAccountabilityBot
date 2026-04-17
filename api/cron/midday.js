// api/cron/midday.js — fires at 1:00pm ET (17:00 UTC during EDT)
// Midday pulse touchpoint

async function sendTelegram(text, keyboard = null) {
  const chatId = process.env.TELEGRAM_CHAT_ID;
  const body = { chat_id: chatId, text, parse_mode: 'Markdown' };
  if (keyboard) body.reply_markup = { inline_keyboard: keyboard };

  await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
}

export default async function handler(req, res) {
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    await sendTelegram(
      `⚡ *Midday Pulse — 1:00 PM*\n\nHalfway through. Time to stop and actually look at where you are.\n\nNo excuses here — just honest data.\n\n*Rate your focus this morning (1-10):*`,
      [
        [
          { text: '🔥 8-10 — Locked in', callback_data: 'focus_high' },
          { text: '⚠️ 5-7 — Distracted', callback_data: 'focus_low' }
        ],
        [
          { text: '❌ 1-4 — Off the rails', callback_data: 'focus_low' }
        ]
      ]
    );

    return res.status(200).json({ ok: true, sent: 'midday' });
  } catch (error) {
    console.error('Midday cron error:', error);
    return res.status(500).json({ error: error.message });
  }
}
