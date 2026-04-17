// api/cron/gym.js — fires at 5:00am ET (9:00 UTC during EDT)
// Gym activation touchpoint

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
  // Verify cron secret
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const now = new Date();
    const day = now.toLocaleDateString('en-US', { weekday: 'long', timeZone: 'America/New_York' });

    await sendTelegram(
      `🏋️ *Gym Time — 5:00 AM*\n\nHappy ${day}, Liam.\n\nThis is your non-negotiable. The gym doesn't care about your mood, your stress, or what happened yesterday. It only cares whether you show up.\n\nEvery day you hit this, you're proving to yourself you're the kind of person who keeps commitments. That proof builds confidence.\n\nDid you make it?`,
      [
        [
          { text: '✅ Done — I showed up', callback_data: 'done_gym' },
          { text: '❌ Skipped today', callback_data: 'skipped_gym' }
        ]
      ]
    );

    return res.status(200).json({ ok: true, sent: 'gym' });
  } catch (error) {
    console.error('Gym cron error:', error);
    return res.status(500).json({ error: error.message });
  }
}
