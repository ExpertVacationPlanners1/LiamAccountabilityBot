// api/telegram.js — Telegram webhook handler with todo support
const COACH_SYSTEM = `You are Liam's personal AI life coach and accountability partner, delivered via Telegram.
About Liam: Lives in Florida, 5am gym habit, work stress is his main trigger, financial pressure for his family is his biggest fear.
Stress pattern: stress → overanalysis → hesitation → guilt → lower confidence → more stress.
Rules: Keep responses to 2-4 sentences MAX. Be warm but direct. End every response with one specific next move.
Never say "I understand" or "that must be hard" — just help him move. Use occasional emojis naturally.`;

const TODO_PARSE_SYSTEM = `Extract a todo task from natural language. Return ONLY valid JSON, no markdown.
Output: {"task":"clean imperative task text","category":"work|personal|financial|home|family|health","priority":"high|medium|low"}
Examples:
"add pressure wash the driveway to my weekend list" → {"task":"Pressure wash the driveway","category":"home","priority":"medium"}
"remind me to call insurance tomorrow" → {"task":"Call insurance company","category":"financial","priority":"high"}
"need to review budget this week" → {"task":"Review monthly budget","category":"financial","priority":"high"}
"add take kids to soccer to family" → {"task":"Take kids to soccer","category":"family","priority":"medium"}`;

const CAT_EMOJI = { work:'💼', personal:'🏠', financial:'📈', home:'🏡', family:'👨‍👩‍👦', health:'💪' };
const PRIORITY_LABEL = { high:'🔴 HIGH', medium:'🟡 MED', low:'🟢 LOW' };

function isTodoCommand(text) {
  return /^(add |remind me to |todo:?|task:?|note:?|don'?t forget to |schedule )|add .+ to (my |the )|(i need to .+)/i.test(text.trim());
}

async function parseTodo(text) {
  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type':'application/json', 'x-api-key':process.env.ANTHROPIC_API_KEY, 'anthropic-version':'2023-06-01' },
      body: JSON.stringify({ model:'claude-sonnet-4-20250514', max_tokens:150, system:TODO_PARSE_SYSTEM, messages:[{role:'user',content:text}] })
    });
    const data = await res.json();
    return JSON.parse(data.content?.[0]?.text?.trim().replace(/```json|```/g,'').trim());
  } catch { return { task: text, category:'personal', priority:'medium' }; }
}

async function addTodo(task, category, priority) {
  const base = process.env.DASHBOARD_URL || 'https://liam-accountability-bot.vercel.app';
  try {
    const res = await fetch(`${base}/api/todos`, {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ text:task, category, priority, source:'telegram' })
    });
    return await res.json();
  } catch(e) { console.error('addTodo error',e); return null; }
}

async function sendTelegram(chatId, text, replyMarkup = null) {
  const body = { chat_id:chatId, text, parse_mode:'Markdown' };
  if (replyMarkup) body.reply_markup = replyMarkup;
  await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(body)
  });
}

async function getCoachingResponse(msg) {
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

    // ── Callback buttons ──────────────────────────────────────────────────────
    if (callback_query) {
      const chatId = callback_query.message.chat.id;
      const data = callback_query.data;
      await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/answerCallbackQuery`, {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ callback_query_id: callback_query.id })
      });

      if (data.startsWith('todo_done_')) {
        const base = process.env.DASHBOARD_URL || 'https://liam-accountability-bot.vercel.app';
        await fetch(`${base}/api/todos`, { method:'PATCH', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ id:data.replace('todo_done_',''), done:true }) });
        await sendTelegram(chatId, "✅ Marked done in your dashboard.");
        return res.status(200).json({ ok:true });
      }

      const replies = {
        done_gym:"💪 Foundation locked in. Now set your #1 work task for today.",
        skipped_gym:"Noted. What got in the way? What's your move to fix it tomorrow?",
        focus_high:"🔥 Strong focus. Make the next 2 hours count before the afternoon drop.",
        focus_low:"What's stealing your attention? Name the one thing to cut or postpone.",
        day_good:"Good day. Write down what made it good so you can repeat it.",
        day_tough:"Tough days build resilience. One thing you'll do differently tomorrow?"
      };
      await sendTelegram(chatId, replies[data] || await getCoachingResponse(data));
      return res.status(200).json({ ok:true });
    }

    if (!message?.text) return res.status(200).json({ ok:true });
    const chatId = message.chat.id;
    const text = message.text;
    const firstName = message.from?.first_name || 'Liam';

    // ── /start ────────────────────────────────────────────────────────────────
    if (text === '/start') {
      await sendTelegram(chatId,
        `Hey ${firstName} 👋 I'm your personal accountability coach.\n\n*Daily check-ins (ET):*\n🏋️ 5am · ☀️ 8am · ⚡ 1pm · 🌙 8pm · 😴 10pm\n\n*Commands:* /todos · /dashboard · /status\n\n💡 *Add tasks instantly:*\n_"add pressure wash the driveway to my weekend list"_\n_"remind me to call the bank tomorrow"_\n_"todo: review budget this week"_\n\nWhat's on your mind?`
      );
      return res.status(200).json({ ok:true });
    }

    // ── /todos ────────────────────────────────────────────────────────────────
    if (text === '/todos') {
      const base = process.env.DASHBOARD_URL || 'https://liam-accountability-bot.vercel.app';
      try {
        const r = await fetch(`${base}/api/todos`);
        const { todos } = await r.json();
        const pending = (todos || []).filter(t => !t.done).slice(0, 15);
        if (!pending.length) {
          await sendTelegram(chatId, `📋 *Task List*\n\nNo pending tasks! Add one:\n_"add [task] to my [category] list"_`);
          return res.status(200).json({ ok:true });
        }
        const byCategory = {};
        pending.forEach(t => { if (!byCategory[t.category]) byCategory[t.category] = []; byCategory[t.category].push(t); });
        let msg = `📋 *Tasks* (${pending.length} pending)\n\n`;
        Object.entries(byCategory).forEach(([cat, items]) => {
          msg += `${CAT_EMOJI[cat]||'📌'} *${cat.charAt(0).toUpperCase()+cat.slice(1)}*\n`;
          items.forEach(t => { msg += `  • ${t.text} _(${PRIORITY_LABEL[t.priority]})_\n`; });
          msg += '\n';
        });
        msg += `[Open Dashboard](${base})`;
        await sendTelegram(chatId, msg);
      } catch { await sendTelegram(chatId, "Couldn't load tasks right now. Try again in a moment."); }
      return res.status(200).json({ ok:true });
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

    // ── TODO natural language ─────────────────────────────────────────────────
    if (isTodoCommand(text)) {
      const parsed = await parseTodo(text);
      const result = await addTodo(parsed.task, parsed.category, parsed.priority);
      if (result?.todo) {
        const e = CAT_EMOJI[parsed.category] || '📌';
        await sendTelegram(chatId,
          `${e} *Added to your dashboard!*\n\n✅ ${parsed.task}\n📂 ${parsed.category.charAt(0).toUpperCase()+parsed.category.slice(1)} · ${PRIORITY_LABEL[parsed.priority]}\n\n_/todos to see all tasks_`,
          { inline_keyboard:[[{text:'✅ Mark done',callback_data:`todo_done_${result.todo.id}`},{text:'📋 View all',callback_data:'view_todos'}]] }
        );
      } else {
        await sendTelegram(chatId, "Had trouble saving that. Try again or check /todos.");
      }
      return res.status(200).json({ ok:true });
    }

    // ── Coaching ──────────────────────────────────────────────────────────────
    const reply = await getCoachingResponse(text);
    await sendTelegram(chatId, reply);
    return res.status(200).json({ ok:true });

  } catch (error) {
    console.error('Webhook error:', error);
    return res.status(200).json({ ok:true });
  }
}
