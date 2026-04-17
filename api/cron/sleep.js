// api/cron/sleep.js — fires at 10:00pm ET (02:00 UTC next day during EDT)
// Pre-sleep wind down touchpoint

async function sendTelegram(text) {
  const chatId = process.env.TELEGRAM_CHAT_ID;
  await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'Markdown' })
  });
}

const WIND_DOWN_MESSAGES = [
  `😴 *Pre-Sleep — 10:00 PM*\n\nStop. Put the phone down after this.\n\nYour brain needs to process today before it can prepare for tomorrow.\n\nWrite 3 things you did right today. Not perfect. *Right.*\n\nThen sleep. 5am doesn't care about your excuses.`,

  `😴 *Wind Down — 10:00 PM*\n\nThe day is done. You can't control what happened. You can control what you do with it.\n\nOne question before you sleep:\n\n*What would tomorrow's version of you thank today's version of you for?*\n\nAct accordingly. Rest well.`,

  `😴 *Pre-Sleep Check-In — 10:00 PM*\n\nYou showed up today. That matters more than whether everything went perfectly.\n\nYour family needs a present, healthy, growing version of you more than they need a perfect one.\n\nProtect your sleep. Protect the 5am alarm. Tomorrow is another shot.\n\nGood night.`,

  `😴 *10:00 PM — Wind Down*\n\nQuick self-assessment before sleep:\n\n🏋️ Gym today?\n💼 Made progress on your #1?\n📈 One financial move this week?\n❤️ Present with family?\n\nReply honestly. Not for me — for you.`,

  `😴 *Pre-Sleep — 10:00 PM*\n\nConfidence isn't built on good days.\n\nIt's built on showing up on the hard days, the tired days, the days when you didn't feel like it — and doing it anyway.\n\nWhatever today was, you're still here. 5am tomorrow is the next proof.\n\nRest up.`
];

export default async function handler(req, res) {
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // Rotate through messages to keep it fresh
    const dayOfYear = Math.floor(Date.now() / 86400000);
    const message = WIND_DOWN_MESSAGES[dayOfYear % WIND_DOWN_MESSAGES.length];

    await sendTelegram(message);
    return res.status(200).json({ ok: true, sent: 'sleep' });
  } catch (error) {
    console.error('Sleep cron error:', error);
    return res.status(500).json({ error: error.message });
  }
}
