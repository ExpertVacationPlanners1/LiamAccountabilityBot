// api/setup.js — registers the Telegram webhook with one call
// Visit /api/setup?secret=YOUR_CRON_SECRET to activate

export default async function handler(req, res) {
  const { secret } = req.query;

  if (secret !== process.env.CRON_SECRET) {
    return res.status(401).json({ error: 'Invalid secret' });
  }

  const webhookUrl = `${process.env.DASHBOARD_URL}/api/telegram`;

  try {
    // Set the webhook
    const response = await fetch(
      `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/setWebhook`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: webhookUrl,
          allowed_updates: ['message', 'callback_query'],
          drop_pending_updates: true
        })
      }
    );

    const data = await response.json();

    if (data.ok) {
      // Get bot info
      const botRes = await fetch(
        `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/getMe`
      );
      const botData = await botRes.json();

      return res.status(200).json({
        success: true,
        message: 'Telegram webhook registered successfully',
        webhook_url: webhookUrl,
        bot_username: botData.result?.username,
        bot_name: botData.result?.first_name,
        instructions: `Now go to Telegram, search for @${botData.result?.username}, and send /start`
      });
    } else {
      return res.status(400).json({ error: 'Webhook registration failed', details: data });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
