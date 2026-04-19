// api/telegram.js — Telegram webhook with bulk todo support

const COACH_SYSTEM = `You are Liam's personal AI life coach. About Liam: lives in Florida, 5am gym habit, work stress is his main trigger, financial pressure for his family is his biggest fear. Stress pattern: stress → overanalysis → hesitation → guilt → lower confidence → more stress. Rules: keep responses to 2-4 sentences MAX. Be warm but direct. End every response with one specific next move. Never say "I understand" or "that must be hard" — just help him move forward.`;

const TODO_PARSE_SYSTEM = `Extract todo tasks from a message. Return ONLY valid JSON, no markdown fences.
If there are multiple tasks (bullet points, numbered list, or line breaks), extract ALL of them.
Output format: {"tasks":[{"task":"clean task text","category":"work|personal|financial|home|family|health","priority":"high|medium|low"}]}
Categories: work=job/career, personal=self/habits, financial=money/budget, home=house tasks, family=kids/partner, health=gym/fitness
Examples:
"add pressure wash driveway to weekend list" → {"tasks":[{"task":"Pressure wash driveway","category":"home","priority":"medium"}]}
"need for house: front flowerbed, mulch beds, clean windows" → {"tasks":[{"task":"Front flowerbed","category":"home","priority":"medium"},{"task":"Mulch backyard beds","category":"home","priority":"medium"},{"task":"Clean outside windows","category":"home","priority":"medium"}]}`;

const CAT_EMOJI = { work:'💼', personal:'🏠', financial:'📈', home:'🏡', family:'👨‍👩‍👦', health:'💪' };
const PRI_LABEL = { high:'🔴 HIGH', medium:'🟡 MED', low:'🟢 LOW' };

function isTodoCommand(text) {
  const lower = text.toLowerCase();
  return (
    /^(add |remind me to |todo:?|task:?|note:?|don'?t forget|schedule )/i.test(text.trim()) ||
    /add .+ to (my |the )/i.test(text) ||
    /need for (house|work|home|family|weekend|personal)/i.test(text) ||
    lower.includes('to do list') ||
    lower.includes('to my list') ||
    lower.includes('to my personal') ||
    lower.includes('to my work') ||
    lower.includes('to my home') ||
    lower.includes('to my family') ||
    lower.includes('to my financial') ||
    lower.includes('to my weekend')
  );
}

async function parseTodos(text) {
  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type':'application/json', 'x-api-key':process.env.ANTHROPIC_API_KEY, 'anthropic-version':'2023-06-01' },
      body: JSON.stringify({ model:'claude-sonnet-4-20250514', max_tokens:400, system:TODO_PARSE_SYSTEM, messages:[{role:'user',content:text}] })
    });
    const data = await res.json();
    const raw = data.content?.[0]?.text?.trim().replace(/```json|```/g,'').trim();
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed.tasks) ? parsed.tasks : [{ task: text, category:'personal', priority:'medium' }];
  } catch {
    return [{ task: text.slice(0,100), category:'personal', priority:'medium' }];
  }
}

async function saveTodo(task, category, priority) {
  const base = process.env.DASHBOARD_URL || 'https://liam-accountability-bot.vercel.app';
  const res = await fetch(`${base}/api/todos`, {
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify({ text:task, category, priority, source:'telegram' })
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return await res.json();
}

async function getTodos() {
  const base = process.env.DASHBOARD_URL || 'https://liam-accountability-bot.vercel.app';
  const res = await fetch(`${base}/api/todos`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return await res.json();
}

async function sendTelegram(chatId, text, keyboard = null) {
  const body = { chat_id: chatId, text, parse_mode: 'Markdown' };
  if (keyboard) body.reply_markup = { inline_keyboard: keyboard };
  await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(body)
  });
}

async function getCoachReply(msg) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method:'POST',
    headers:{'Content-Type':'application/json','x-api-key':process.env.ANTHROPIC_API_KEY,'anthropic-version':'2023-06-01'},
    body: JSON.stringify({ model:'claude-sonnet-4-20250514', max_tokens:300, system:COACH_SYSTEM, messages:[{role:'user',content:msg}] })
  });
  const data = await res.json();
  return data.content?.[0]?.text || "Keep moving. What's your next step?";
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const { message, callback_query } = req.body;

    // ── Buttons ──────────────────────────────────────────────────────────────
    if (callback_query) {
      const chatId = callback_query.message.chat.id;
      const data = callback_query.data;
      await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/answerCallbackQuery`, {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ callback_query_id: callback_query.id })
      });

      if (data.startsWith('challenge_')) {
        const category = data.replace('challenge_', '');
        const base = process.env.DASHBOARD_URL || 'https://liam-accountability-bot.vercel.app';
        try {
          await fetch(`${base}/api/briefing`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ category })
          });
          const categoryMap = { work: { emoji: '💼', pts: 20 }, personal: { emoji: '🏠', pts: 15 }, financial: { emoji: '📈', pts: 15 } };
          const c = categoryMap[category] || { emoji: '✅', pts: 15 };
          await sendTelegram(chatId, c.emoji + ' *' + category.charAt(0).toUpperCase() + category.slice(1) + ' challenge complete!*\n\n+' + c.pts + ' points added to your daily score. Keep going — check your dashboard for your current score.');
        } catch {
          await sendTelegram(chatId, '✅ Logged! Check your dashboard for your updated score.');
        }
        return res.status(200).json({ ok: true });
      }

      if (data.startsWith('done_')) {
        const id = parseInt(data.replace('done_',''));
        const base = process.env.DASHBOARD_URL || 'https://liam-accountability-bot.vercel.app';
        await fetch(`${base}/api/todos`, { method:'PATCH', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ id, done:true }) });
        await sendTelegram(chatId, "✅ Marked done in your dashboard.");
        return res.status(200).json({ ok:true });
      }

      const replies = {
        done_gym:"💪 Foundation locked in. Set your #1 work task for today.",
        skipped_gym:"Noted. What got in the way? What's your move to fix it tomorrow?",
        focus_high:"🔥 Strong focus. Make the next 2 hours count.",
        focus_low:"What's stealing your attention? Name the one thing to cut.",
        day_good:"Good day. Write down what made it good so you can repeat it.",
        day_tough:"Tough days build resilience. One thing you'll do differently tomorrow?"
      };
      await sendTelegram(chatId, replies[data] || await getCoachReply(data));
      return res.status(200).json({ ok:true });
    }

    if (!message?.text) return res.status(200).json({ ok:true });
    const chatId = message.chat.id;
    const text = message.text;
    const firstName = message.from?.first_name || 'Liam';

    // ── /start ────────────────────────────────────────────────────────────────
    if (text === '/start') {
      await sendTelegram(chatId,
        `Hey ${firstName} 👋 I'm your personal accountability coach.\n\n*Daily check-ins (ET):*\n🏋️ 5am · ☀️ 8am · ⚡ 1pm · 🌙 8pm · 😴 10pm\n\n*Commands:* /todos · /dashboard · /calendar · /status\n\n💡 *Add tasks — any format works:*\n_"add pressure wash driveway to my home list"_\n_"need for house: front flowerbed, mulch beds, clean windows"_\n_"remind me to call the bank"_\n\nYou can send a whole list at once. What's on your mind?`
      );
      return res.status(200).json({ ok:true });
    }

    // ── /todos ────────────────────────────────────────────────────────────────
    if (text === '/todos') {
      try {
        const { todos } = await getTodos();
        const pending = (todos || []).filter(t => !t.done).slice(0, 15);
        if (!pending.length) {
          await sendTelegram(chatId, `📋 *Task List*\n\nNo pending tasks!\n\n_Add one: "add [task] to my [category] list"_`);
          return res.status(200).json({ ok:true });
        }
        const byCategory = {};
        pending.forEach(t => { if (!byCategory[t.category]) byCategory[t.category] = []; byCategory[t.category].push(t); });
        let msg = `📋 *Tasks* (${pending.length} pending)\n\n`;
        Object.entries(byCategory).forEach(([cat, items]) => {
          msg += `${CAT_EMOJI[cat]||'📌'} *${cat.charAt(0).toUpperCase()+cat.slice(1)}*\n`;
          items.forEach(t => { msg += `  • ${t.text}\n`; });
          msg += '\n';
        });
        const base = process.env.DASHBOARD_URL || 'https://liam-accountability-bot.vercel.app';
        msg += `[Open Dashboard](${base})`;
        await sendTelegram(chatId, msg);
      } catch (e) {
        console.error('todos error:', e);
        await sendTelegram(chatId, "Couldn't load tasks. Check your Upstash connection in Vercel env vars.");
      }
      return res.status(200).json({ ok:true });
    }

    // ── /calendar ────────────────────────────────────────────────────────────
    if (text === '/calendar') {
      const base = process.env.DASHBOARD_URL || 'https://liam-accountability-bot.vercel.app';
      await sendTelegram(chatId,
        `📅 *Sync Your Calendar*\n\nDownload your accountability calendar file:\n[⬇ Download liam-accountability.ics](${base}/api/calendar)\n\n*What's included:*\n🏋️ Gym — 5am daily (15min alert)\n☀️ Morning Briefing — 8am daily (10min alert)\n⚡ Midday Pulse — 1pm daily (5min alert)\n🌙 Evening Review — 8pm daily (10min alert)\n😴 Pre-Sleep — 10pm daily (15min alert)\n+ Morning routine blocks with individual alerts\n+ Weekly financial review, family planning, personal dev\n\nOpen the file on your phone — it adds everything to Apple Calendar or Google Calendar in one tap.`
      );
      return res.status(200).json({ ok: true });
    }

    // ── /dashboard ────────────────────────────────────────────────────────────
    if (text === '/dashboard') {
      const url = process.env.DASHBOARD_URL || 'https://liam-accountability-bot.vercel.app';
      await sendTelegram(chatId, `📊 [Open Your Dashboard](${url})`);
      return res.status(200).json({ ok:true });
    }

    // ── /status ───────────────────────────────────────────────────────────────
    if (text === '/status') {
      const now = new Date();
      const etHour = (now.getUTCHours() - 4 + 24) % 24;
      const pts = [{h:5,l:'🏋️ Gym'},{h:8,l:'☀️ Morning'},{h:13,l:'⚡ Midday'},{h:20,l:'🌙 Evening'},{h:22,l:'😴 Pre-sleep'}];
      const next = pts.find(t => t.h > etHour) || pts[0];
      await sendTelegram(chatId, `📍 ${etHour}:${String(now.getUTCMinutes()).padStart(2,'0')} ET\nNext: *${next.l}*`);
      return res.status(200).json({ ok:true });
    }

    // ── TODO — handles single tasks AND bulk lists ───────────────────────────
    if (isTodoCommand(text)) {
      let tasks;
      try {
        tasks = await parseTodos(text);
      } catch {
        tasks = [{ task: text.slice(0,100), category:'personal', priority:'medium' }];
      }

      const saved = [];
      const failed = [];

      for (const t of tasks) {
        try {
          await saveTodo(t.task, t.category, t.priority);
          saved.push(t);
        } catch (e) {
          console.error('Save todo error:', e);
          failed.push(t.task);
        }
      }

      if (saved.length > 0) {
        if (saved.length === 1) {
          const t = saved[0];
          const e = CAT_EMOJI[t.category] || '📌';
          await sendTelegram(chatId,
            `${e} *Added to your dashboard!*\n\n✅ ${t.task}\n📂 ${t.category.charAt(0).toUpperCase()+t.category.slice(1)} · ${PRI_LABEL[t.priority] || '🟡 MED'}\n\n_View all: /todos_`
          );
        } else {
          const lines = saved.map(t => `${CAT_EMOJI[t.category]||'📌'} ${t.task}`).join('\n');
          await sendTelegram(chatId,
            `✅ *${saved.length} tasks added to your dashboard!*\n\n${lines}\n\n_View all: /todos_`
          );
        }
        if (failed.length > 0) {
          await sendTelegram(chatId, `⚠️ ${failed.length} item(s) couldn't save: ${failed.join(', ')}`);
        }
      } else {
        await sendTelegram(chatId, "Had trouble saving. Check Upstash is connected in Vercel → Storage, then try again.");
      }
      return res.status(200).json({ ok:true });
    }

    // ── Coaching ──────────────────────────────────────────────────────────────
    const reply = await getCoachReply(text);
    await sendTelegram(chatId, reply);
    return res.status(200).json({ ok:true });

  } catch (error) {
    console.error('Webhook error:', error);
    return res.status(200).json({ ok:true });
  }
}
