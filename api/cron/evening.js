// api/cron/evening.js — fires at 8:00pm ET (00:00 UTC next day during EDT)
// Evening review touchpoint

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
    const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'America/New_York' });

    await sendTelegram(
      `🌙 *Evening Review — 8:00 PM*\n*${dateStr}*\n\nBefore the day closes, let's lock it in.\n\nReply with your evening log:\n\n✅ *Accomplished:* What actually got done?\n💪 *Did right:* One thing you're proud of (not perfect — right)\n⚠️ *Unfinished:* What carries to tomorrow?\n🎯 *Tomorrow's #1:* What's the one non-negotiable?\n\nI'll use this to coach you tomorrow morning. Be honest.`,
      [
        [
          { text: '✨ Strong day', callback_data: 'day_good' },
          { text: '😤 Tough day', callback_data: 'day_tough' }
        ]
      ]
    );

    return res.status(200).json({ ok: true, sent: 'evening' });
  } catch (error) {
    console.error('Evening cron error:', error);
    return res.status(500).json({ error: error.message });
  }
}
