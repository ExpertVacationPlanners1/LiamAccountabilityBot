// api/cron/evening.js — 8pm ET evening review against today's challenges

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
  if (!res.ok) return null;
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
    const dateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'America/New_York' });

    if (briefing && briefing.challengesCompleted) {
      const completed = briefing.challengesCompleted;
      const doneCount = Object.values(completed).filter(Boolean).length;
      const totalChallenges = 3;

      const workStatus = completed.work ? '✅' : '⬜';
      const personalStatus = completed.personal ? '✅' : '⬜';
      const financialStatus = completed.financial ? '✅' : '⬜';

      const challengePts = (completed.work ? briefing.work.points : 0) +
                           (completed.personal ? briefing.personal.points : 0) +
                           (completed.financial ? briefing.financial.points : 0);

      const coachResponse =
        doneCount === 3 ? "All 3 challenges done. That's a complete day. You showed up in every area that matters — work, personal, financial. That's the discipline that builds confidence over time." :
        doneCount === 2 ? `2 out of 3 challenges done. Strong effort. The one you missed — don't ignore it. Reply back with what got in the way and what you'll do differently tomorrow.` :
        doneCount === 1 ? `1 out of 3 challenges completed. Be honest with yourself — what happened today? Reply back. No judgment, just data. Tomorrow's briefing starts fresh.` :
        `None of today's challenges marked complete. This is important data. Not a reason to spiral — a reason to understand. What specifically got in the way today? Reply back honestly.`;

      await sendTelegram(chatId,
        `🌙 *Evening Review — ${dateStr}*\n\n*Today's Challenge Results:*\n${workStatus} Work: ${briefing.work.challenge.slice(0, 60)}...\n${personalStatus} Personal: ${briefing.personal.challenge.slice(0, 60)}...\n${financialStatus} Financial: ${briefing.financial.challenge.slice(0, 60)}...\n\n*Challenge points: ${challengePts} earned*\n\n${coachResponse}\n\n*Before you close out the day, log your evening note:*`,
        [
          [
            { text: '💼 Work done ✓', callback_data: 'challenge_work' },
            { text: '🏠 Personal done ✓', callback_data: 'challenge_personal' },
          ],
          [
            { text: '📈 Financial done ✓', callback_data: 'challenge_financial' },
            { text: '✨ Strong day', callback_data: 'day_good' }
          ],
          [
            { text: '😤 Tough day', callback_data: 'day_tough' }
          ]
        ]
      );
    } else {
      // Fallback if no briefing stored
      await sendTelegram(chatId,
        `🌙 *Evening Review — ${dateStr}*\n\nTime to close the day.\n\n*Answer these 3:*\n✅ What did you accomplish today?\n💪 What's one thing you did right?\n🎯 What's tomorrow's #1 non-negotiable?\n\nReply with your answers.`,
        [
          [
            { text: '✨ Strong day', callback_data: 'day_good' },
            { text: '😤 Tough day', callback_data: 'day_tough' }
          ]
        ]
      );
    }

    return res.status(200).json({ ok: true, sent: 'evening_review' });
  } catch (error) {
    console.error('Evening cron error:', error);
    return res.status(500).json({ error: error.message });
  }
}
