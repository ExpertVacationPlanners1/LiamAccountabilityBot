// api/cron/morning.js — fires at 8:00am ET (12:00 UTC during EDT)
// Morning intention touchpoint

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
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', timeZone: 'America/New_York' });

    await sendTelegram(
      `☀️ *Morning Intention — 8:00 AM*\n*${dateStr}*\n\nGym's done. Now you get to choose what today means.\n\nMost people walk into work reacting to whatever hits them first. You don't do that.\n\nBefore the day takes over — answer these three:\n\n1️⃣ *What is your single most important task today?*\n2️⃣ *What financial action are you taking this week?*\n3️⃣ *What's one thing you'll do for your family today?*\n\nReply with your answers. I'll hold you to them tonight.`
    );

    return res.status(200).json({ ok: true, sent: 'morning' });
  } catch (error) {
    console.error('Morning cron error:', error);
    return res.status(500).json({ error: error.message });
  }
}
