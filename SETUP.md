# Liam Accountability — Setup Guide

## What You're Deploying
- Live React dashboard on Vercel
- Telegram AI coaching bot
- 5 daily automated touchpoints (5am, 8am, 1pm, 8pm, 10pm ET)
- Full Claude AI coaching responses

---

## Step 1 — Get Your Telegram Bot Token (2 min)

1. Open Telegram and search for **@BotFather**
2. Send `/newbot`
3. Name it: `Liam Accountability`
4. Username: `liam_accountability_bot` (or anything ending in `bot`)
5. BotFather will give you a **token** like: `7123456789:AAFxxx...`
6. Save this — it's your `TELEGRAM_BOT_TOKEN`

**Get your Chat ID:**
1. Search for **@userinfobot** in Telegram
2. Send `/start`
3. It will show your **Id** — save this as `TELEGRAM_CHAT_ID`

---

## Step 2 — Deploy to GitHub + Vercel (5 min)

### Create GitHub repo
1. Go to github.com/new
2. Name: `liam-accountability`
3. Set to **Private**
4. Do NOT add README or gitignore
5. Click Create

### Push code
```bash
# Unzip the downloaded file
unzip liam-accountability-deploy.zip -d ~/Desktop/
cd ~/Desktop/liam-accountability

# Initialize and push
git init && git branch -m main
git add -A
git commit -m "Initial commit — Liam Accountability v2"
git remote add origin https://github.com/YOUR_USERNAME/liam-accountability.git
git push -u origin main
```

### Deploy on Vercel
1. Go to vercel.com/new
2. Import `liam-accountability` from GitHub
3. Select **ExpertVacationPlanners1** (personal account, NOT axiomhealthops)
4. Click **Deploy** — wait 60 seconds

---

## Step 3 — Set Environment Variables in Vercel

In Vercel → Your Project → Settings → Environment Variables, add:

| Variable | Value |
|----------|-------|
| `TELEGRAM_BOT_TOKEN` | Your token from BotFather |
| `TELEGRAM_CHAT_ID` | Your Telegram user ID |
| `ANTHROPIC_API_KEY` | Your Anthropic API key (from console.anthropic.com) |
| `CRON_SECRET` | Make up a random password, e.g. `liam2025secure` |
| `DASHBOARD_URL` | Your Vercel URL e.g. `https://liam-accountability.vercel.app` |

After adding all variables → **Redeploy** (Deployments tab → 3 dots → Redeploy)

---

## Step 4 — Activate the Telegram Bot (1 min)

Visit this URL in your browser (replace with your values):
```
https://liam-accountability.vercel.app/api/setup?secret=YOUR_CRON_SECRET
```

You'll see: `"success": true` and your bot username.

Then go to Telegram, search for your bot, and send `/start`.

---

## Step 5 — Add to iPhone Home Screen
1. Open Safari on your iPhone
2. Go to your Vercel URL
3. Tap **Share** → **Add to Home Screen**
4. Name it **Liam**
5. Tap Add

It works as a full PWA (progressive web app) — looks and feels native.

---

## Daily Touchpoints Schedule (Eastern Time)
| Time | Message |
|------|---------|
| 5:00am | 🏋️ Gym activation |
| 8:00am | ☀️ Morning intention (reply with your 3 answers) |
| 1:00pm | ⚡ Midday pulse |
| 8:00pm | 🌙 Evening review |
| 10:00pm | 😴 Pre-sleep wind down |

---

## Telegram Commands
- `/start` — introduction and schedule
- `/dashboard` — link to your dashboard
- `/wins` — log a win
- `/status` — current time and next touchpoint

---

## Troubleshooting

**Bot not sending messages?**
- Check `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` are correct in Vercel
- Re-run the setup URL: `/api/setup?secret=YOUR_CRON_SECRET`

**Crons not firing?**
- Vercel crons require a Pro plan OR you can use Vercel's free hobby crons (limited)
- Alternative: Use cron-job.org (free) to hit your cron endpoints with the Authorization header

**Dashboard not loading?**
- Check browser console for errors
- Make sure you redeployed after adding environment variables
