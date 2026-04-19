import { useState, useEffect, useRef, useCallback } from "react";

// ─── Google Fonts ─────────────────────────────────────────────────────────────
const FONT_LINK = document.createElement("link");
FONT_LINK.rel = "stylesheet";
FONT_LINK.href = "https://fonts.googleapis.com/css2?family=Fraunces:wght@400;600;700;900&family=Nunito+Sans:wght@400;500;600;700&display=swap";
document.head.appendChild(FONT_LINK);

// ─── CSS ──────────────────────────────────────────────────────────────────────
const CSS = `
  *{box-sizing:border-box;margin:0;padding:0}
  body{background:#f7f4ef;font-family:'Nunito Sans',sans-serif;min-height:100vh}
  ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:#d0c9be;border-radius:2px}
  .app{max-width:1200px;margin:0 auto;padding:16px;display:grid;grid-template-columns:1fr 340px;gap:16px}
  @media(max-width:768px){.app{grid-template-columns:1fr;padding:12px}}
  .card{background:#fff;border-radius:16px;border:1px solid #ede8e0;overflow:hidden}
  .tabs{display:flex;gap:4px;padding:4px;background:#f7f4ef;border-radius:10px}
  .tab{flex:1;padding:8px 12px;border:none;border-radius:8px;font-family:'Nunito Sans',sans-serif;font-size:12px;font-weight:700;cursor:pointer;background:transparent;color:#71717a;letter-spacing:.5px;transition:all .15s}
  .tab.active{background:#fff;color:#18181b;box-shadow:0 1px 4px rgba(0,0,0,.08)}
  .btn{padding:10px 18px;border-radius:10px;border:none;font-family:'Nunito Sans',sans-serif;font-size:13px;font-weight:700;cursor:pointer;transition:all .15s}
  .btn-primary{background:#1c3d2e;color:#fff}.btn-primary:hover{background:#163325}
  .btn-ghost{background:transparent;border:1.5px solid #d0c9be;color:#52525b}.btn-ghost:hover{border-color:#1c3d2e;color:#1c3d2e}
  input,textarea{font-family:'Nunito Sans',sans-serif;font-size:14px;width:100%;border:1.5px solid #ede8e0;border-radius:10px;padding:10px 14px;outline:none;background:#fff;color:#18181b;transition:border .15s}
  input:focus,textarea:focus{border-color:#1c3d2e}
  .chat-bubble-user{background:#1c3d2e;color:#fff;padding:12px 16px;border-radius:18px 18px 4px 18px;max-width:80%;align-self:flex-end;font-size:14px;line-height:1.5}
  .chat-bubble-ai{background:#f7f4ef;color:#18181b;padding:12px 16px;border-radius:18px 18px 18px 4px;max-width:88%;align-self:flex-start;font-size:14px;line-height:1.6;border:1px solid #ede8e0}
  .habit-ring{width:48px;height:48px;border-radius:50%;border:3px solid #ede8e0;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:20px;transition:all .2s;background:#fff}
  .habit-ring.done{border-color:#1c3d2e;background:#f0fdf4}
  .progress-bar{height:6px;background:#f0ebe3;border-radius:3px;overflow:hidden}
  .progress-fill{height:100%;border-radius:3px;transition:width .4s}
  .priority-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0;margin-top:5px}
  .task-row{display:flex;align-items:flex-start;gap:10px;padding:10px 0;border-bottom:1px solid #fafaf9;cursor:pointer}
  .task-row:last-child{border-bottom:none}
  .check-circle{width:22px;height:22px;border-radius:50%;border:2px solid #d0c9be;flex-shrink:0;margin-top:1px;display:flex;align-items:center;justify-content:center;transition:all .2s;background:#fff}
  .check-circle.done{background:#1c3d2e;border-color:#1c3d2e;color:#fff}
  .label{font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase}
  .heading{font-family:'Fraunces',Georgia,serif;font-weight:700}
  .chip{display:inline-flex;align-items:center;gap:4px;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:700;border:1.5px solid}
  .toast{position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:#1c3d2e;color:#fff;padding:12px 24px;border-radius:12px;font-size:14px;font-weight:600;z-index:9999;animation:fadeup .3s ease}
  @keyframes fadeup{from{opacity:0;transform:translateX(-50%) translateY(8px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}
  .spinner{width:18px;height:18px;border:2px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;animation:spin .6s linear infinite;display:inline-block}
  @keyframes spin{to{transform:rotate(360deg)}}
  .sidebar{display:flex;flex-direction:column;gap:14px}
  .tg-todo-item{display:flex;align-items:flex-start;gap:10px;padding:10px 0;border-bottom:1px solid #f5f0ea}
  .tg-todo-item:last-child{border-bottom:none}
`;
const styleEl = document.createElement("style");
styleEl.textContent = CSS;
document.head.appendChild(styleEl);

// ─── Constants ────────────────────────────────────────────────────────────────
const WORK_TASKS = [
  { id: 1, text: "Write down your #1 work task and start it within 30 minutes", priority: "high" },
  { id: 2, text: "Send one message that moves a stuck situation forward", priority: "high" },
  { id: 3, text: "Block 90 minutes tomorrow morning for deep focused work", priority: "high" },
  { id: 4, text: "Structure your morning routine — write it down and follow it once", priority: "medium" },
  { id: 5, text: "Identify the one thing at work causing the most stress and write it plainly", priority: "medium" },
  { id: 6, text: "Deliver one visible, measurable result your leadership will notice this month", priority: "high" },
  { id: 7, text: "Evaluate honestly: grow here or start building an exit path — decide, don't float", priority: "high" },
];

const PERSONAL_TASKS = [
  { id: 11, text: "4:45am — Wake up, drink water immediately, no phone for 10 minutes", priority: "high" },
  { id: 12, text: "5:00am — Gym (already locked in — protect this every day)", priority: "high" },
  { id: 13, text: "6:00am — Shower in 10 minutes, transition into leader mode", priority: "high" },
  { id: 14, text: "6:25am — Open dashboard, set Today's #1 Non-Negotiable (5 min only)", priority: "high" },
  { id: 15, text: "6:35am — Family time, present and calm, not rushed (15 min)", priority: "high" },
  { id: 16, text: "Before bed, write down 3 things you did right today", priority: "medium" },
  { id: 17, text: "Have one honest check-in conversation with your partner this month", priority: "high" },
];

const FINANCIAL_TASKS = [
  { id: 21, text: "Write your exact monthly number for family stability — income needed vs current", priority: "high" },
  { id: 22, text: "Open your bank account and write down your actual balance — no avoiding it", priority: "high" },
  { id: 23, text: "List every recurring expense and circle one to cut or reduce", priority: "high" },
  { id: 24, text: "Build a simple one-page monthly budget: income, fixed costs, variable costs, gap", priority: "high" },
  { id: 25, text: "Identify one concrete income growth action this month", priority: "high" },
  { id: 26, text: "Start a 3-month emergency fund plan — even if it starts at $25/week", priority: "medium" },
];

const ALL_TASKS = { work: WORK_TASKS, personal: PERSONAL_TASKS, financial: FINANCIAL_TASKS };


const HABITS_DEFAULT = [
  { id: 1, name: "Gym", icon: "🏋️", streak: 0, done: false },
  { id: 2, name: "Sleep on time", icon: "😴", streak: 0, done: false },
  { id: 3, name: "No phone 10min AM", icon: "📵", streak: 0, done: false },
  { id: 4, name: "Read / Learn", icon: "📚", streak: 0, done: false },
];


// ─── Scoring Engine ───────────────────────────────────────────────────────────
// Points per task based on priority
const TASK_POINTS = { high: 8, medium: 5, low: 3 };
// Max possible from tasks
const MAX_TASK_SCORE = (() => {
  let total = 0;
  Object.values(ALL_TASKS).forEach(tasks => tasks.forEach(t => { total += TASK_POINTS[t.priority] || 5; }));
  return total;
})();
const MAX_HABIT_SCORE = HABITS_DEFAULT.length * 10; // 10pts per habit
const MAX_FOCUS_SCORE = 10;   // 5 for setting it, 5 bonus for mentioning it in a win
const MAX_WIN_SCORE = 6;      // 3 pts per win, up to 2 wins
const MAX_CONFIDENCE_SCORE = 4; // up to 4 pts based on logging it
const MAX_TOTAL = MAX_TASK_SCORE + MAX_HABIT_SCORE + MAX_FOCUS_SCORE + MAX_WIN_SCORE + MAX_CONFIDENCE_SCORE;

function calcDailyScore(done, habits, focus, wins, confidence) {
  // Task score
  let taskScore = 0;
  Object.values(ALL_TASKS).forEach(tasks =>
    tasks.forEach(t => { if (done[t.id]) taskScore += TASK_POINTS[t.priority] || 5; })
  );

  // Habit score
  const habitScore = habits.filter(h => h.done).length * 10;

  // Focus score
  const focusScore = focus && focus.trim().length > 3 ? 5 : 0;

  // Win score (up to 2 wins = 6 pts)
  const winScore = Math.min(wins.length, 2) * 3;

  // Confidence score (reward for logging it)
  const confScore = confidence > 0 ? Math.min(4, Math.round(confidence / 2.5)) : 0;

  const raw = taskScore + habitScore + focusScore + winScore + confScore;
  const pct = Math.round((raw / MAX_TOTAL) * 100);

  // Breakdown for display
  const breakdown = [
    { label: "Work Tasks", earned: Object.values(WORK_TASKS).filter(t => done[t.id]).reduce((a,t) => a + (TASK_POINTS[t.priority]||5), 0), max: WORK_TASKS.reduce((a,t) => a + (TASK_POINTS[t.priority]||5), 0), color: "#1c3d2e" },
    { label: "Personal Tasks", earned: Object.values(PERSONAL_TASKS).filter(t => done[t.id]).reduce((a,t) => a + (TASK_POINTS[t.priority]||5), 0), max: PERSONAL_TASKS.reduce((a,t) => a + (TASK_POINTS[t.priority]||5), 0), color: "#7c3d00" },
    { label: "Financial Tasks", earned: Object.values(FINANCIAL_TASKS).filter(t => done[t.id]).reduce((a,t) => a + (TASK_POINTS[t.priority]||5), 0), max: FINANCIAL_TASKS.reduce((a,t) => a + (TASK_POINTS[t.priority]||5), 0), color: "#1e3a5f" },
    { label: "Habits", earned: habitScore, max: MAX_HABIT_SCORE, color: "#065f46" },
    { label: "Focus Set", earned: focusScore, max: MAX_FOCUS_SCORE, color: "#c9a96e" },
    { label: "Wins Logged", earned: winScore, max: MAX_WIN_SCORE, color: "#7c3d00" },
  ];

  // Performance tier
  const tier =
    pct >= 90 ? { label: "ELITE", color: "#fbbf24", bg: "#1c1400" } :
    pct >= 75 ? { label: "STRONG", color: "#22c55e", bg: "#052e16" } :
    pct >= 60 ? { label: "SOLID", color: "#3b82f6", bg: "#0f172a" } :
    pct >= 45 ? { label: "BUILDING", color: "#f97316", bg: "#1c0a00" } :
    pct >= 25 ? { label: "WARMING UP", color: "#a78bfa", bg: "#1e0050" } :
                { label: "GET MOVING", color: "#f43f5e", bg: "#1c000a" };

  return { pct, raw, max: MAX_TOTAL, breakdown, tier, taskScore, habitScore };
}
const CAT_COLOR = { work: "#1c3d2e", personal: "#7c3d00", financial: "#1e3a5f", home: "#5b4a00", family: "#6b21a8", health: "#065f46" };
const CAT_EMOJI = { work: "💼", personal: "🏠", financial: "📈", home: "🏡", family: "👨‍👩‍👦", health: "💪" };
const PRI_COLOR = { high: "#dc2626", medium: "#d97706", low: "#16a34a" };
const TOUCHPOINTS = [
  { time: "5:00am", label: "🏋️ Gym Activation" },
  { time: "8:00am", label: "☀️ Morning Intention" },
  { time: "1:00pm", label: "⚡ Midday Pulse" },
  { time: "8:00pm", label: "🌙 Evening Review" },
  { time: "10:00pm", label: "😴 Pre-Sleep Wind Down" },
];

// ─── Safe localStorage helpers ────────────────────────────────────────────────
function lsGet(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const val = JSON.parse(raw);
    // Type-safe: if fallback is array, ensure result is array
    if (Array.isArray(fallback) && !Array.isArray(val)) return fallback;
    return val;
  } catch { return fallback; }
}
function lsSet(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
}

// ─── Claude AI helper ─────────────────────────────────────────────────────────
async function askClaude(messages, system) {
  const res = await fetch("/api/coach", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages, system })
  });
  if (!res.ok) throw new Error("API error");
  const data = await res.json();
  return data.reply || "Keep moving. What's your next step?";
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  // ── Tab state ──
  const [tab, setTab] = useState("work");

  // ── Task state (in-memory, safe) ──
  const [done, setDone] = useState(() => lsGet("v3_done", {}));

  // ── Focus ──
  const [focus, setFocus] = useState(() => lsGet("v3_focus", ""));
  const [focusInput, setFocusInput] = useState(() => lsGet("v3_focus", ""));

  // ── Habits (in-memory) ──
  const [habits, setHabits] = useState(() => { const saved = lsGet("v3_habits", null); return Array.isArray(saved) && saved.length === HABITS_DEFAULT.length ? saved : HABITS_DEFAULT; });

  // ── Confidence ──
  const [confidence, setConfidence] = useState(() => lsGet("v3_confidence", 5));
  const [confSaved, setConfSaved] = useState(false);

  // ── Wins ──
  const [wins, setWins] = useState(() => lsGet("v3_wins", []));
  const [winInput, setWinInput] = useState("");

  // ── Check-ins ──
  const [checkins, setCheckins] = useState(() => lsGet("v3_checkins", []));
  const [checkinNote, setCheckinNote] = useState("");

  // ── AI Chat ──
  // ── Daily Coach state ──
  const [coachMessage, setCoachMessage] = useState("");
  const [coachLoading, setCoachLoading] = useState(false);
  const [coachLastUpdated, setCoachLastUpdated] = useState(null);
  const [coachExpanded, setCoachExpanded] = useState(true);

  // ── Daily Briefing state ──
  const [briefing, setBriefing] = useState(null);
  const [briefingLoading, setBriefingLoading] = useState(false);
  const [briefingExpanded, setBriefingExpanded] = useState(true);

  const [chatMessages, setChatMessages] = useState([
    { role: "assistant", content: "Hey Liam 👋 I'm your AI coach. Tell me what's on your mind — work stress, a decision you're avoiding, or just what you need to focus on today. I'll give you a direct, honest response." }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef(null);

  // ── Telegram todos ──
  const [tgTodos, setTgTodos] = useState([]);
  const [tgLoading, setTgLoading] = useState(false);

  // ── Budget (in-memory) ──
  const [budget, setBudget] = useState(() => lsGet("v3_budget", { income: "", fixed: "", variable: "", target: "" }));

  // ── Toast ──
  const [toast, setToast] = useState("");

  // ── Savings goals ──
  const [savings, setSavings] = useState(() => lsGet("v3_savings", [
    { id: 1, name: "Emergency Fund (3mo)", target: 5000, current: 0 },
    { id: 2, name: "Family Stability Buffer", target: 2000, current: 0 },
  ]));

  // ─── Effects ───────────────────────────────────────────────────────────────
  useEffect(() => {
    fetchTgTodos();
    fetchBriefing();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  // Auto-generate coaching when done/habits/confidence changes (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      generateCoachMessage();
    }, 1500); // Wait 1.5s after last change
    return () => clearTimeout(timer);
  }, [done, habits, confidence, focus]); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Helpers ───────────────────────────────────────────────────────────────
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  const fetchTgTodos = async () => {
    setTgLoading(true);
    try {
      const r = await fetch("/api/todos");
      if (r.ok) {
        const d = await r.json();
        setTgTodos(Array.isArray(d.todos) ? d.todos : []);
      }
    } catch {}
    setTgLoading(false);
  };

  const markTgDone = async (id) => {
    try {
      await fetch("/api/todos", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, done: true })
      });
      setTgTodos(prev => prev.map(t => t.id === id ? { ...t, done: true } : t));
    } catch {}
  };

  const deleteTg = async (id) => {
    try {
      await fetch("/api/todos", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });
      setTgTodos(prev => prev.filter(t => t.id !== id));
    } catch {}
  };

  const toggleTask = (id) => { const next = (prev => ({ ...prev, [id]: !prev[id] }))(done); setDone(next); lsSet("v3_done", next); };

  const saveFocus = () => {
    lsSet("v3_focus", focusInput);
    setFocus(focusInput);
    showToast("Focus saved ✓");
  };

  const toggleHabit = (id) => {
    setHabits(prev => {
      const next = prev.map(h =>
        h.id === id ? { ...h, done: !h.done, streak: !h.done ? h.streak + 1 : Math.max(0, h.streak - 1) } : h
      );
      lsSet("v3_habits", next);
      return next;
    });
  };

  const addWin = () => {
    if (!winInput.trim()) return;
    const newWins = [{ id: Date.now(), text: winInput.trim(), date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }) }, ...wins].slice(0, 30);
    setWins(newWins);
    lsSet("v3_wins", newWins);
    setWinInput("");
    showToast("Win logged 🏆");
  };

  const addCheckin = () => {
    if (!checkinNote.trim()) return;
    const newCheckins = [{ id: Date.now(), note: checkinNote.trim(), time: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }), date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }) }, ...checkins].slice(0, 20);
    setCheckins(newCheckins);
    lsSet("v3_checkins", newCheckins);
    setCheckinNote("");
    showToast("Check-in saved ✓");
  };

  const saveConfidence = () => {
    lsSet("v3_confidence", confidence);
    setConfSaved(true);
    setTimeout(() => setConfSaved(false), 2000);
    showToast(`Confidence: ${confidence}/10 logged`);
  };

  const fetchBriefing = async (force = false) => {
    setBriefingLoading(true);
    try {
      const r = await fetch('/api/briefing' + (force ? '?force=true' : ''));
      if (r.ok) {
        const d = await r.json();
        setBriefing(d.briefing);
      }
    } catch {}
    setBriefingLoading(false);
  };

  const completeBriefingChallenge = async (category) => {
    try {
      await fetch('/api/briefing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category })
      });
      setBriefing(prev => prev ? {
        ...prev,
        challengesCompleted: { ...(prev.challengesCompleted || {}), [category]: true }
      } : prev);
      showToast(category.charAt(0).toUpperCase() + category.slice(1) + " challenge complete! +" + (category === 'work' ? 20 : 15) + " pts");
    } catch {}
  };

  const generateCoachMessage = async () => {
    setCoachLoading(true);
    const hour = new Date().getHours();
    const timeOfDay = hour < 9 ? "morning" : hour < 13 ? "mid-morning" : hour < 17 ? "afternoon" : hour < 20 ? "evening" : "night";

    // Build honest progress snapshot
    const totalWork = WORK_TASKS.length;
    const totalPersonal = PERSONAL_TASKS.length;
    const totalFinancial = FINANCIAL_TASKS.length;
    const doneWork = WORK_TASKS.filter(t => done[t.id]).length;
    const donePersonal = PERSONAL_TASKS.filter(t => done[t.id]).length;
    const doneFinancial = FINANCIAL_TASKS.filter(t => done[t.id]).length;
    const totalDone = doneWork + donePersonal + doneFinancial;
    const totalTasks = totalWork + totalPersonal + totalFinancial;
    const habitsDoneCount = habits.filter(h => h.done).length;
    const completedHabitNames = habits.filter(h => h.done).map(h => h.name).join(", ");
    const missedHabitNames = habits.filter(h => !h.done).map(h => h.name).join(", ");
    const todayFocus = focus || "not set";
    const recentWin = wins[0]?.text || "none logged today";
    const confScore = confidence;

    const currentScore = calcDailyScore(done, habits, focus, wins, confidence);
    const progress = [
      "You are Liam's personal life coach. It's " + timeOfDay + " on " + new Date().toLocaleDateString("en-US",{weekday:"long"}) + ".",
      "",
      "LIAM'S DAILY SCORE: " + currentScore.pct + "/100 (" + currentScore.tier.label + ")",
      "Points earned: " + currentScore.raw + " of " + currentScore.max + " possible",
      "",
      "Breakdown:",
      "- Tasks completed: " + totalDone + "/" + totalTasks + " (" + doneWork + "/" + totalWork + " work, " + donePersonal + "/" + totalPersonal + " personal, " + doneFinancial + "/" + totalFinancial + " financial)",
      "- Habits done today: " + habitsDoneCount + "/" + habits.length + (completedHabitNames ? " (" + completedHabitNames + ")" : ""),
      missedHabitNames ? "- Habits not done: " + missedHabitNames : "",
      "- Today's focus task: " + todayFocus,
      "- Confidence today: " + confScore + "/10",
      "- Most recent win: " + recentWin,
      "",
      "Write a 3-4 sentence coaching message for a former athlete who needs direct feedback on his score and performance. Reference the actual score number and tier. If score is rising, acknowledge the momentum and push for more. If score is low or stalled, be direct — tell him exactly which category will move the score most right now and what action to take. End with a challenge or specific target. No fluff. He responds to athletic performance framing."
    ].filter(Boolean).join("\n");
    const prompt = progress;

    try {
      const res = await fetch("/api/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: prompt }],
          system: "You are a direct, honest, warm life coach. Respond in 3-4 sentences maximum. No generic motivation — speak to this person's specific situation."
        })
      });
      const data = await res.json();
      setCoachMessage(data.reply || "");
      setCoachLastUpdated(new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }));
    } catch {
      setCoachMessage("Complete one task right now. Don't think about the list — just pick the first incomplete item and start it.");
    }
    setCoachLoading(false);
  };

  const sendChat = useCallback(async () => {
    if (!chatInput.trim() || chatLoading) return;
    const userMsg = { role: "user", content: chatInput.trim() };
    const newMessages = [...chatMessages, userMsg];
    setChatMessages(newMessages);
    setChatInput("");
    setChatLoading(true);

    const COACH_SYSTEM = `You are Liam's personal AI life coach. About Liam: lives in Florida, 5am gym habit, work stress is his main trigger, financial pressure for his family is his biggest fear. Stress pattern: stress → overanalysis → hesitation → guilt → lower confidence → more stress. Rules: keep responses to 3-5 sentences. Be warm but direct. End with one specific next move. Never say "I understand" or "that must be hard" — just help him move forward.`;

    try {
      const reply = await askClaude(
        newMessages.map(m => ({ role: m.role, content: m.content })),
        COACH_SYSTEM
      );
      setChatMessages(prev => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setChatMessages(prev => [...prev, { role: "assistant", content: "Having trouble connecting. Check your API key in Vercel env vars, then try again." }]);
    }
    setChatLoading(false);
  }, [chatInput, chatMessages, chatLoading]);

  // ─── Computed ──────────────────────────────────────────────────────────────
  const tasks = ALL_TASKS[tab] || [];
  const score = calcDailyScore(done, habits, focus, wins, confidence);
  const doneCount = tasks.filter(t => done[t.id]).length;
  const pct = tasks.length ? Math.round(doneCount / tasks.length * 100) : 0;
  const habitsDone = habits.filter(h => h.done).length;
  const pendingTg = tgTodos.filter(t => !t.done);
  const completedTg = tgTodos.filter(t => t.done).slice(0, 3);

  const budgetGap = (() => {
    const i = parseFloat(budget.income) || 0;
    const f = parseFloat(budget.fixed) || 0;
    const v = parseFloat(budget.variable) || 0;
    const t = parseFloat(budget.target) || 0;
    return { spend: f + v, left: i - f - v, gap: t - (i - f - v) };
  })();

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="app">
      {/* ── MAIN COLUMN ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

        {/* Header */}
        <div className="card" style={{ padding: "18px 22px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
            <div>
              <div className="label" style={{ color: "#1c3d2e", marginBottom: 4 }}>🎯 Life Command Center</div>
              <h1 className="heading" style={{ fontSize: 26, color: "#18181b", lineHeight: 1.2 }}>Accountability System</h1>
              <p style={{ fontSize: 12, color: "#71717a", marginTop: 4 }}>{new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</p>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {["work", "personal", "financial"].map(c => {
                const t = ALL_TASKS[c];
                const d = t.filter(task => done[task.id]).length;
                const colors = { work: "#1c3d2e", personal: "#7c3d00", financial: "#1e3a5f" };
                return (
                  <div key={c} style={{ textAlign: "center", background: "#f7f4ef", padding: "8px 14px", borderRadius: 10 }}>
                    <div style={{ fontSize: 18, fontWeight: 900, color: colors[c] }}>{d}/{t.length}</div>
                    <div className="label" style={{ color: "#a1a1aa", fontSize: 9 }}>{c}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Focus Task */}
          <div style={{ marginTop: 16, padding: 14, background: "#f7f4ef", borderRadius: 12 }}>
            <div className="label" style={{ color: "#71717a", marginBottom: 8 }}>⚡ TODAY'S #1 NON-NEGOTIABLE</div>
            <div style={{ display: "flex", gap: 8 }}>
              <input
                value={focusInput}
                onChange={e => setFocusInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && saveFocus()}
                placeholder="What MUST get done today? Be specific."
                style={{ flex: 1 }}
              />
              <button className="btn btn-primary" onClick={saveFocus} style={{ whiteSpace: "nowrap" }}>Save</button>
            </div>
            {focus && <p style={{ marginTop: 8, fontSize: 14, fontWeight: 600, color: "#1c3d2e" }}>→ {focus}</p>}
          </div>
        </div>

        {/* Daily Briefing Panel */}
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <div
            style={{ background: "linear-gradient(135deg,#1a2f4a,#0f1e35)", padding: "14px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}
            onClick={() => setBriefingExpanded(p => !p)}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 20 }}>📋</span>
              <div>
                <div style={{ fontFamily: "'Nunito Sans',sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: 2, color: "#93c5fd", textTransform: "uppercase" }}>Daily Briefing</div>
                <div style={{ fontFamily: "'Fraunces',Georgia,serif", fontSize: 16, fontWeight: 700, color: "#fff" }}>
                  {briefing ? briefing.dayOfWeek + " — 3 Challenges" : "Loading today's briefing..."}
                </div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {briefing && (
                <span style={{ fontSize: 12, fontWeight: 700, color: "#93c5fd", fontFamily: "'Nunito Sans',sans-serif" }}>
                  Target: {briefing.targetScore}/100
                </span>
              )}
              <button
                onClick={e => { e.stopPropagation(); fetchBriefing(true); }}
                style={{ background: "rgba(255,255,255,0.15)", border: "none", borderRadius: 6, padding: "5px 10px", color: "#fff", fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "'Nunito Sans',sans-serif" }}
              >
                {briefingLoading ? "..." : "↺"}
              </button>
              <span style={{ color: "#93c5fd", fontSize: 14 }}>{briefingExpanded ? "▲" : "▼"}</span>
            </div>
          </div>

          {briefingExpanded && (
            <div style={{ padding: "18px 20px" }}>
              {briefingLoading && !briefing ? (
                <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 0" }}>
                  <div className="spinner" style={{ borderTopColor: "#1e3a5f", borderColor: "#ede8e0" }} />
                  <span style={{ fontSize: 13, color: "#a1a1aa", fontFamily: "'Nunito Sans',sans-serif" }}>Generating today's challenges...</span>
                </div>
              ) : briefing ? (
                <>
                  {/* Coach note */}
                  <div style={{ background: "#f0f7ff", borderRadius: 10, padding: "12px 16px", borderLeft: "4px solid #1e3a5f", marginBottom: 16 }}>
                    <p style={{ fontSize: 13, lineHeight: 1.7, color: "#18181b", fontFamily: "'Nunito Sans',sans-serif", fontWeight: 500 }}>
                      {briefing.coachNote}
                    </p>
                  </div>

                  {/* Three challenges */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {[
                      { key: "work", icon: "💼", label: "WORK", color: "#1c3d2e", bg: "#f0fdf4", pts: briefing.work?.points, challenge: briefing.work?.challenge, why: briefing.work?.why },
                      { key: "personal", icon: "🏠", label: "PERSONAL", color: "#7c3d00", bg: "#fff7ed", pts: briefing.personal?.points, challenge: briefing.personal?.challenge, why: briefing.personal?.why },
                      { key: "financial", icon: "📈", label: "FINANCIAL", color: "#1e3a5f", bg: "#eff6ff", pts: briefing.financial?.points, challenge: briefing.financial?.challenge, why: briefing.financial?.why },
                    ].map(item => {
                      const isDone = briefing.challengesCompleted?.[item.key];
                      return (
                        <div key={item.key} style={{ background: isDone ? item.bg : "#fafaf9", borderRadius: 12, padding: "14px 16px", border: "1.5px solid " + (isDone ? item.color : "#ede8e0"), opacity: isDone ? 1 : 0.95, transition: "all .2s" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
                            <div style={{ flex: 1 }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                                <span style={{ fontSize: 14 }}>{item.icon}</span>
                                <span style={{ fontFamily: "'Nunito Sans',sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: 1.5, color: item.color, textTransform: "uppercase" }}>{item.label}</span>
                                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, fontWeight: 700, color: item.color, background: item.bg, padding: "2px 6px", borderRadius: 4 }}>+{item.pts} pts</span>
                                {isDone && <span style={{ fontSize: 11, fontWeight: 700, color: "#16a34a" }}>✓ DONE</span>}
                              </div>
                              <p style={{ fontFamily: "'Nunito Sans',sans-serif", fontSize: 14, fontWeight: 600, color: isDone ? "#6b7280" : "#18181b", lineHeight: 1.5, textDecoration: isDone ? "line-through" : "none" }}>
                                {item.challenge}
                              </p>
                              {item.why && !isDone && (
                                <p style={{ fontFamily: "'Nunito Sans',sans-serif", fontSize: 12, color: "#71717a", marginTop: 4, fontStyle: "italic" }}>
                                  → {item.why}
                                </p>
                              )}
                            </div>
                            {!isDone && (
                              <button
                                onClick={() => completeBriefingChallenge(item.key)}
                                style={{ background: item.color, color: "#fff", border: "none", borderRadius: 8, padding: "8px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "'Nunito Sans',sans-serif", whiteSpace: "nowrap", flexShrink: 0 }}
                              >
                                Mark Done
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Progress on challenges */}
                  {briefing.challengesCompleted && (
                    <div style={{ marginTop: 14, padding: "10px 14px", background: "#f7f4ef", borderRadius: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontFamily: "'Nunito Sans',sans-serif", fontSize: 13, fontWeight: 600, color: "#52525b" }}>
                        {Object.values(briefing.challengesCompleted).filter(Boolean).length}/3 challenges complete
                      </span>
                      <span style={{ fontFamily: "'Nunito Sans',sans-serif", fontSize: 12, color: "#1c3d2e", fontWeight: 700 }}>
                        {(briefing.challengesCompleted.work ? briefing.work.points : 0) +
                         (briefing.challengesCompleted.personal ? briefing.personal.points : 0) +
                         (briefing.challengesCompleted.financial ? briefing.financial.points : 0)} challenge pts earned
                      </span>
                    </div>
                  )}
                </>
              ) : (
                <div style={{ textAlign: "center", padding: "16px 0" }}>
                  <p style={{ fontSize: 13, color: "#a1a1aa", fontFamily: "'Nunito Sans',sans-serif", marginBottom: 12 }}>No briefing loaded yet.</p>
                  <button className="btn btn-primary" onClick={() => fetchBriefing()} style={{ fontSize: 13 }}>Generate Today's Briefing</button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Daily Score + Coach Panel */}
        <div className="card" style={{ padding: 0, overflow: "hidden", border: "2px solid " + score.tier.color }}>

          {/* Score Header */}
          <div style={{ background: score.tier.bg, padding: "18px 22px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
            <div>
              <div style={{ fontFamily: "'Nunito Sans',sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: 2, color: score.tier.color, textTransform: "uppercase", marginBottom: 4 }}>🏆 Daily Performance Score</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <span style={{ fontFamily: "'Fraunces',Georgia,serif", fontSize: 52, fontWeight: 900, color: score.tier.color, lineHeight: 1 }}>{score.pct}</span>
                <span style={{ fontFamily: "'Nunito Sans',sans-serif", fontSize: 20, fontWeight: 700, color: score.tier.color, opacity: 0.6 }}>/100</span>
              </div>
              <div style={{ fontFamily: "'Nunito Sans',sans-serif", fontSize: 13, fontWeight: 700, color: score.tier.color, marginTop: 2, letterSpacing: 2 }}>{score.tier.label}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontFamily: "'Nunito Sans',sans-serif", fontSize: 11, color: score.tier.color, opacity: 0.7, marginBottom: 6 }}>{score.raw} of {score.max} pts earned</div>
              {/* Circular progress */}
              <svg width="72" height="72" viewBox="0 0 72 72">
                <circle cx="36" cy="36" r="30" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="6"/>
                <circle cx="36" cy="36" r="30" fill="none" stroke={score.tier.color} strokeWidth="6"
                  strokeDasharray={2 * Math.PI * 30}
                  strokeDashoffset={2 * Math.PI * 30 * (1 - score.pct / 100)}
                  strokeLinecap="round"
                  transform="rotate(-90 36 36)"
                  style={{ transition: "stroke-dashoffset 0.8s ease" }}
                />
                <text x="36" y="40" textAnchor="middle" fill={score.tier.color} fontSize="14" fontWeight="900" fontFamily="sans-serif">{score.pct}%</text>
              </svg>
            </div>
          </div>

          {/* Score Breakdown */}
          <div style={{ padding: "14px 22px", background: "#fff", borderBottom: "1px solid #f0ebe3" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 10 }}>
              {score.breakdown.map(item => {
                const itemPct = item.max > 0 ? Math.round((item.earned / item.max) * 100) : 0;
                return (
                  <div key={item.label}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                      <span style={{ fontSize: 10, fontWeight: 700, color: "#71717a", fontFamily: "'Nunito Sans',sans-serif", textTransform: "uppercase", letterSpacing: 0.8 }}>{item.label}</span>
                      <span style={{ fontSize: 10, fontWeight: 700, color: item.color, fontFamily: "'JetBrains Mono',monospace" }}>{item.earned}/{item.max}</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: itemPct + "%", background: item.color, transition: "width 0.5s ease" }} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Tier ladder */}
            <div style={{ display: "flex", gap: 4, marginTop: 14, alignItems: "center" }}>
              <span style={{ fontSize: 10, color: "#a1a1aa", fontFamily: "'Nunito Sans',sans-serif", marginRight: 4, fontWeight: 700 }}>TARGET:</span>
              {[
                { min: 0, label: "GET MOVING", color: "#f43f5e" },
                { min: 25, label: "WARMING UP", color: "#a78bfa" },
                { min: 45, label: "BUILDING", color: "#f97316" },
                { min: 60, label: "SOLID", color: "#3b82f6" },
                { min: 75, label: "STRONG", color: "#22c55e" },
                { min: 90, label: "ELITE", color: "#fbbf24" },
              ].map(tier => (
                <div key={tier.label} style={{
                  padding: "3px 8px", borderRadius: 20, fontSize: 9, fontWeight: 700,
                  fontFamily: "'Nunito Sans',sans-serif", letterSpacing: 0.8,
                  background: score.pct >= tier.min && (
                    (tier.min === 0 && score.pct < 25) ||
                    (tier.min === 25 && score.pct < 45) ||
                    (tier.min === 45 && score.pct < 60) ||
                    (tier.min === 60 && score.pct < 75) ||
                    (tier.min === 75 && score.pct < 90) ||
                    tier.min === 90
                  ) ? tier.color : "#f0ebe3",
                  color: score.pct >= tier.min && (
                    (tier.min === 0 && score.pct < 25) ||
                    (tier.min === 25 && score.pct < 45) ||
                    (tier.min === 45 && score.pct < 60) ||
                    (tier.min === 60 && score.pct < 75) ||
                    (tier.min === 75 && score.pct < 90) ||
                    tier.min === 90
                  ) ? "#fff" : "#a1a1aa",
                }}>{tier.label}</div>
              ))}
            </div>
          </div>

          {/* Coach Message */}
          <div style={{ padding: "16px 22px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div style={{ fontFamily: "'Nunito Sans',sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: "#71717a", textTransform: "uppercase" }}>🧠 Coach Feedback</div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                {coachLastUpdated && <span style={{ fontSize: 10, color: "#a1a1aa", fontFamily: "'Nunito Sans',sans-serif" }}>{coachLastUpdated}</span>}
                <button
                  onClick={generateCoachMessage}
                  style={{ background: "#f7f4ef", border: "1px solid #ede8e0", borderRadius: 6, padding: "4px 10px", color: "#52525b", fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "'Nunito Sans',sans-serif" }}
                >
                  {coachLoading ? "..." : "↺ Refresh"}
                </button>
              </div>
            </div>

            {coachLoading ? (
              <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0" }}>
                <div className="spinner" style={{ borderTopColor: "#1c3d2e", borderColor: "#ede8e0" }} />
                <span style={{ fontSize: 13, color: "#a1a1aa", fontFamily: "'Nunito Sans',sans-serif" }}>Analyzing your score...</span>
              </div>
            ) : coachMessage ? (
              <div style={{ background: "#f7f4ef", borderRadius: 10, padding: "14px 16px", borderLeft: "4px solid " + score.tier.color }}>
                <p style={{ fontSize: 14, lineHeight: 1.75, color: "#18181b", fontFamily: "'Nunito Sans',sans-serif", fontWeight: 500 }}>
                  {coachMessage}
                </p>
              </div>
            ) : (
              <p style={{ fontSize: 13, color: "#a1a1aa", fontFamily: "'Nunito Sans',sans-serif", padding: "8px 0" }}>Complete a task to get your first coaching message.</p>
            )}

            <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
              {[
                { label: "💬 Talk to coach", action: () => { setChatInput("Give me specific coaching on my score and how to improve it today"); setTimeout(() => document.querySelector("input[placeholder*='Type anything']")?.focus(), 100); } },
                { label: "🏆 Log a win", action: () => setTimeout(() => document.querySelector("input[placeholder*='did you do right']")?.focus(), 100) },
                { label: "↺ New message", action: generateCoachMessage },
              ].map(btn => (
                <button key={btn.label} onClick={btn.action} style={{
                  background: "#fff", border: "1.5px solid #ede8e0", borderRadius: 20,
                  padding: "6px 14px", fontSize: 12, fontWeight: 600, color: "#52525b",
                  cursor: "pointer", fontFamily: "'Nunito Sans',sans-serif"
                }}>{btn.label}</button>
              ))}
            </div>
          </div>
        </div>

        {/* Goals Tabs */}
        <div className="card" style={{ padding: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div>
              <div className="label" style={{ color: "#71717a", marginBottom: 3 }}>📋 GOAL TRACKER</div>
              <h2 className="heading" style={{ fontSize: 19, color: "#18181b" }}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)} Goals
              </h2>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 22, fontWeight: 900, color: "#1c3d2e" }}>{pct}%</div>
              <div className="label" style={{ color: "#a1a1aa", fontSize: 9 }}>complete</div>
            </div>
          </div>

          <div className="tabs" style={{ marginBottom: 16 }}>
            {["work", "personal", "financial"].map(t => (
              <button key={t} className={`tab${tab === t ? " active" : ""}`} onClick={() => setTab(t)}>
                {t === "work" ? "💼" : t === "personal" ? "🏠" : "📈"} {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          <div className="progress-bar" style={{ marginBottom: 16 }}>
            <div className="progress-fill" style={{ width: pct + "%", background: tab === "work" ? "#1c3d2e" : tab === "personal" ? "#7c3d00" : "#1e3a5f" }} />
          </div>

          {tasks.map(task => (
            <div key={task.id} className="task-row" onClick={() => toggleTask(task.id)}>
              <div className={`check-circle${done[task.id] ? " done" : ""}`}>
                {done[task.id] && <span style={{ fontSize: 12 }}>✓</span>}
              </div>
              <div className="priority-dot" style={{ background: PRI_COLOR[task.priority] }} />
              <span style={{
                flex: 1, fontSize: 14, lineHeight: 1.5, color: "#18181b",
                textDecoration: done[task.id] ? "line-through" : "none",
                opacity: done[task.id] ? 0.5 : 1
              }}>
                {task.text}
              </span>
            </div>
          ))}
        </div>

        {/* Habits + Confidence */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          {/* Habits */}
          <div className="card" style={{ padding: 18 }}>
            <div className="label" style={{ color: "#71717a", marginBottom: 8 }}>🔥 DAILY HABITS</div>
            <h2 className="heading" style={{ fontSize: 17, color: "#18181b", marginBottom: 14 }}>
              {habitsDone}/{habits.length} done today
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {habits.map(h => (
                <div key={h.id} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div className={`habit-ring${h.done ? " done" : ""}`} onClick={() => toggleHabit(h.id)}>
                    {h.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#18181b" }}>{h.name}</div>
                    <div style={{ fontSize: 11, color: "#a1a1aa" }}>{h.streak} day streak</div>
                  </div>
                  {h.done && <span style={{ fontSize: 11, color: "#16a34a", fontWeight: 700 }}>✓</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Confidence */}
          <div className="card" style={{ padding: 18 }}>
            <div className="label" style={{ color: "#71717a", marginBottom: 8 }}>💪 CONFIDENCE</div>
            <h2 className="heading" style={{ fontSize: 17, color: "#18181b", marginBottom: 6 }}>How do you feel?</h2>
            <p style={{ fontSize: 12, color: "#a1a1aa", marginBottom: 14 }}>Rate yourself honestly, not perfectly.</p>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                <button key={n} onClick={() => setConfidence(n)} style={{
                  width: 36, height: 36, borderRadius: 8, border: "1.5px solid",
                  borderColor: confidence === n ? "#1c3d2e" : "#ede8e0",
                  background: confidence === n ? "#1c3d2e" : "#fff",
                  color: confidence === n ? "#fff" : "#52525b",
                  fontWeight: 700, fontSize: 13, cursor: "pointer"
                }}>{n}</button>
              ))}
            </div>
            <div style={{ fontSize: 13, color: "#52525b", marginBottom: 12 }}>
              {confidence <= 3 ? "Struggling today — that's real. Name one thing you can control." :
               confidence <= 6 ? "Middle ground. Push through — momentum builds." :
               "Strong. Use this energy to tackle the hardest thing first."}
            </div>
            <button className="btn btn-primary" onClick={saveConfidence} style={{ width: "100%", fontSize: 13 }}>
              {confSaved ? "Saved ✓" : `Log ${confidence}/10`}
            </button>
          </div>
        </div>

        {/* Check-in + Win Log */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          {/* Check-in */}
          <div className="card" style={{ padding: 18 }}>
            <div className="label" style={{ color: "#71717a", marginBottom: 8 }}>📝 CHECK-IN LOG</div>
            <h2 className="heading" style={{ fontSize: 17, color: "#18181b", marginBottom: 12 }}>Quick Note</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 12 }}>
              <textarea
                value={checkinNote}
                onChange={e => setCheckinNote(e.target.value)}
                placeholder="What's happening right now? Status, blocker, or thought."
                rows={3}
                style={{ resize: "none" }}
              />
              <button className="btn btn-primary" onClick={addCheckin} style={{ fontSize: 13 }}>Log Check-in</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 160, overflowY: "auto" }}>
              {checkins.slice(0, 5).map(c => (
                <div key={c.id} style={{ padding: "8px 10px", background: "#f7f4ef", borderRadius: 8 }}>
                  <p style={{ fontSize: 13, color: "#18181b", lineHeight: 1.4 }}>{c.note}</p>
                  <p style={{ fontSize: 10, color: "#a1a1aa", marginTop: 4 }}>{c.date} · {c.time}</p>
                </div>
              ))}
              {checkins.length === 0 && <p style={{ fontSize: 12, color: "#a1a1aa", textAlign: "center", padding: "12px 0" }}>No check-ins yet today.</p>}
            </div>
          </div>

          {/* Win Log */}
          <div className="card" style={{ padding: 18 }}>
            <div className="label" style={{ color: "#71717a", marginBottom: 8 }}>🏆 WIN LOG</div>
            <h2 className="heading" style={{ fontSize: 17, color: "#18181b", marginBottom: 12 }}>Log a Win</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 12 }}>
              <input
                value={winInput}
                onChange={e => setWinInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && addWin()}
                placeholder="What did you do right? Small or big."
              />
              <button className="btn btn-primary" onClick={addWin} style={{ fontSize: 13 }}>Log Win</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 160, overflowY: "auto" }}>
              {wins.slice(0, 6).map(w => (
                <div key={w.id} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                  <span style={{ fontSize: 14, marginTop: 1 }}>⭐</span>
                  <div>
                    <p style={{ fontSize: 13, color: "#18181b", lineHeight: 1.4 }}>{w.text}</p>
                    <p style={{ fontSize: 10, color: "#a1a1aa" }}>{w.date}</p>
                  </div>
                </div>
              ))}
              {wins.length === 0 && <p style={{ fontSize: 12, color: "#a1a1aa", textAlign: "center", padding: "12px 0" }}>No wins logged yet — add one.</p>}
            </div>
          </div>
        </div>

        {/* Financial Panel */}
        <div className="card" style={{ padding: 18 }}>
          <div className="label" style={{ color: "#1e3a5f", marginBottom: 6 }}>📈 FINANCIAL TRACKER</div>
          <h2 className="heading" style={{ fontSize: 19, color: "#18181b", marginBottom: 16 }}>Budget Snapshot</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, marginBottom: 16 }}>
            {[
              { key: "income", label: "Monthly Income", placeholder: "e.g. 5000" },
              { key: "fixed", label: "Fixed Costs", placeholder: "rent, car, loans..." },
              { key: "variable", label: "Variable Costs", placeholder: "food, gas, misc..." },
              { key: "target", label: "Stability Target", placeholder: "what you need to feel safe" },
            ].map(f => (
              <div key={f.key}>
                <label style={{ fontSize: 11, fontWeight: 700, color: "#71717a", letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 4 }}>{f.label}</label>
                <input
                  value={budget[f.key]}
                  onChange={e => { const next = { ...budget, [f.key]: e.target.value }; setBudget(next); lsSet('v3_budget', next); }}
                  placeholder={f.placeholder}
                />
              </div>
            ))}
          </div>
          {(budget.income || budget.fixed) && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
              {[
                { label: "Monthly Spend", value: "$" + (budgetGap.spend || 0).toLocaleString(), color: "#dc2626" },
                { label: "Left Over", value: "$" + (budgetGap.left || 0).toLocaleString(), color: budgetGap.left >= 0 ? "#16a34a" : "#dc2626" },
                { label: "Gap to Target", value: budgetGap.gap > 0 ? "-$" + budgetGap.gap.toLocaleString() : "✓ On track", color: budgetGap.gap > 0 ? "#dc2626" : "#16a34a" },
              ].map(s => (
                <div key={s.label} style={{ padding: 12, background: "#f7f4ef", borderRadius: 10, textAlign: "center" }}>
                  <div style={{ fontSize: 18, fontWeight: 900, color: s.color }}>{s.value}</div>
                  <div className="label" style={{ color: "#a1a1aa", fontSize: 9 }}>{s.label}</div>
                </div>
              ))}
            </div>
          )}

          {/* Savings Goals */}
          <div style={{ marginTop: 16 }}>
            <div className="label" style={{ color: "#71717a", marginBottom: 10 }}>SAVINGS GOALS</div>
            {savings.map(sg => {
              const pct = Math.min(100, Math.round((sg.current / sg.target) * 100));
              return (
                <div key={sg.id} style={{ marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#18181b" }}>{sg.name}</span>
                    <span style={{ fontSize: 12, color: "#52525b" }}>${sg.current.toLocaleString()} / ${sg.target.toLocaleString()}</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: pct + "%", background: "#1e3a5f" }} />
                  </div>
                  <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
                    <input
                      placeholder="Update current amount"
                      style={{ fontSize: 12, padding: "6px 10px" }}
                      onBlur={e => {
                        const v = parseFloat(e.target.value);
                        if (!isNaN(v)) setSavings(prev => prev.map(s => s.id === sg.id ? { ...s, current: v } : s));
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* AI Coach Chat */}
        <div className="card" style={{ padding: 18 }}>
          <div className="label" style={{ color: "#1c3d2e", marginBottom: 6 }}>🤖 AI LIFE COACH</div>
          <h2 className="heading" style={{ fontSize: 19, color: "#18181b", marginBottom: 4 }}>Talk to Your Coach</h2>
          <p style={{ fontSize: 12, color: "#a1a1aa", marginBottom: 14 }}>Ask anything. Work stress, decisions, confidence, finances. Direct, honest coaching.</p>

          <div style={{ height: 320, overflowY: "auto", display: "flex", flexDirection: "column", gap: 10, marginBottom: 14, padding: "4px 0" }}>
            {chatMessages.map((m, i) => (
              <div key={i} className={m.role === "user" ? "chat-bubble-user" : "chat-bubble-ai"}>
                {m.content}
              </div>
            ))}
            {chatLoading && (
              <div className="chat-bubble-ai" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div className="spinner" style={{ borderTopColor: "#1c3d2e", borderColor: "#ede8e0" }} />
                <span style={{ fontSize: 12, color: "#a1a1aa" }}>Thinking...</span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <input
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendChat()}
              placeholder="Type anything — stress, goals, decisions, or just how today went..."
              style={{ flex: 1 }}
            />
            <button
              className="btn btn-primary"
              onClick={sendChat}
              disabled={chatLoading || !chatInput.trim()}
              style={{ opacity: chatLoading || !chatInput.trim() ? 0.6 : 1, minWidth: 70 }}
            >
              {chatLoading ? <span className="spinner" /> : "Send"}
            </button>
          </div>

          {/* Quick prompts */}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 10 }}>
            {[
              "I'm feeling stressed about work",
              "Help me prioritize today",
              "I'm avoiding something important",
              "Financial pressure is overwhelming me"
            ].map(prompt => (
              <button
                key={prompt}
                onClick={() => { setChatInput(prompt); }}
                style={{
                  background: "#f7f4ef", border: "1px solid #ede8e0", borderRadius: 20,
                  padding: "5px 12px", fontSize: 11, fontWeight: 600, color: "#52525b",
                  cursor: "pointer", fontFamily: "'Nunito Sans', sans-serif"
                }}
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── SIDEBAR ── */}
      <div className="sidebar">

        {/* Next Check-in */}
        <div className="card" style={{ padding: 16, background: "linear-gradient(135deg,#1c3d2e,#16332a)" }}>
          <div className="label" style={{ color: "#a8d4b0", marginBottom: 6 }}>⏱ NEXT CHECK-IN</div>
          <h3 className="heading" style={{ fontSize: 18, color: "#fff", marginBottom: 4 }}>
            {(() => {
              const now = new Date();
              const h = now.getHours(), m = now.getMinutes();
              const nowMins = h * 60 + m;
              const pts = [{ mins: 5 * 60, label: "Gym Activation" }, { mins: 8 * 60, label: "Morning Intention" }, { mins: 13 * 60, label: "Midday Pulse" }, { mins: 20 * 60, label: "Evening Review" }, { mins: 22 * 60, label: "Pre-Sleep" }];
              const next = pts.find(p => p.mins > nowMins) || pts[0];
              const diff = next.mins > nowMins ? next.mins - nowMins : next.mins + 1440 - nowMins;
              return `${next.label} · ${diff >= 60 ? Math.floor(diff / 60) + "h " + (diff % 60) + "m" : diff + "m"}`;
            })()}
          </h3>
          <p style={{ fontSize: 12, color: "#a8d4b0" }}>Via Telegram bot · 5 touchpoints daily</p>
        </div>

        {/* Telegram Tasks */}
        <div className="card" style={{ padding: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div>
              <div className="label" style={{ color: "#0088cc", marginBottom: 3 }}>📱 TELEGRAM TASKS</div>
              <h3 className="heading" style={{ fontSize: 16, color: "#18181b" }}>From Your Bot</h3>
            </div>
            <button
              onClick={fetchTgTodos}
              style={{ background: "none", border: "none", fontSize: 11, fontWeight: 700, color: "#0088cc", cursor: "pointer", fontFamily: "'Nunito Sans', sans-serif", letterSpacing: 1 }}
            >
              {tgLoading ? "..." : "REFRESH →"}
            </button>
          </div>

          {pendingTg.length === 0 ? (
            <div style={{ textAlign: "center", padding: "14px 0" }}>
              <p style={{ fontSize: 13, color: "#a1a1aa" }}>No tasks yet.</p>
              <p style={{ fontSize: 11, color: "#c4bdb5", marginTop: 4, fontStyle: "italic" }}>"add [task] to my [category] list"</p>
            </div>
          ) : (
            pendingTg.slice(0, 8).map(todo => (
              <div key={todo.id} className="tg-todo-item">
                <button
                  onClick={() => markTgDone(todo.id)}
                  style={{ width: 20, height: 20, borderRadius: "50%", border: "2px solid #d0c9be", background: "transparent", cursor: "pointer", flexShrink: 0, marginTop: 2 }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 500, color: "#18181b", lineHeight: 1.4, wordBreak: "break-word" }}>{todo.text}</p>
                  <span className="chip" style={{ marginTop: 4, fontSize: 10, color: CAT_COLOR[todo.category] || "#3f3f46", borderColor: CAT_COLOR[todo.category] || "#3f3f46" }}>
                    {CAT_EMOJI[todo.category] || "📌"} {todo.category}
                  </span>
                </div>
                <button
                  onClick={() => deleteTg(todo.id)}
                  style={{ background: "none", border: "none", color: "#d0c9be", cursor: "pointer", fontSize: 18, padding: "0 2px", flexShrink: 0, lineHeight: 1 }}
                >×</button>
              </div>
            ))
          )}

          {completedTg.length > 0 && (
            <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px solid #f5f0ea" }}>
              <div className="label" style={{ color: "#a1a1aa", marginBottom: 6, fontSize: 9 }}>COMPLETED</div>
              {completedTg.map(t => (
                <p key={t.id} style={{ fontSize: 12, color: "#a1a1aa", textDecoration: "line-through", padding: "2px 0" }}>{t.text}</p>
              ))}
            </div>
          )}
        </div>

        {/* Live Coaching Panel */}
        <div className="card" style={{ padding: 16, background: "linear-gradient(135deg,#0088cc,#005fa3)" }}>
          <div className="label" style={{ color: "#a8d8f0", marginBottom: 6 }}>📱 LIVE COACHING</div>
          <h3 className="heading" style={{ fontSize: 17, color: "#fff", marginBottom: 8 }}>Telegram Bot Active</h3>
          <p style={{ fontSize: 12, color: "#cce8f7", lineHeight: 1.6, marginBottom: 12 }}>
            5 daily touchpoints push directly to your phone.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 14 }}>
            {TOUCHPOINTS.map((tp, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 12, color: "#cce8f7" }}>{tp.label}</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#fff", fontFamily: "monospace" }}>{tp.time}</span>
              </div>
            ))}
          </div>
          <a
            href="https://t.me/liamaccountabilitybot"
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: "block", background: "rgba(255,255,255,0.15)", borderRadius: 8, padding: 10, textAlign: "center", color: "#fff", fontFamily: "'Nunito Sans',sans-serif", fontSize: 13, fontWeight: 700, textDecoration: "none" }}
          >
            Open Telegram →
          </a>
        </div>

        {/* Calendar Integration */}
        <div className="card" style={{ padding: 16 }}>
          <div className="label" style={{ color: "#1c3d2e", marginBottom: 6 }}>📅 CALENDAR SYNC</div>
          <h3 className="heading" style={{ fontSize: 16, color: "#18181b", marginBottom: 8 }}>Add All Events to Calendar</h3>
          <p style={{ fontSize: 12, color: "#71717a", lineHeight: 1.6, marginBottom: 14 }}>
            Downloads a .ics file with every recurring event — morning routine, daily touchpoints, and weekly reviews. Alerts built in.
          </p>

          {/* What's included */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 14 }}>
            {[
              { time: "5:00am", label: "🏋️ Gym", sub: "Daily · 15min alert", color: "#1c3d2e" },
              { time: "6:25am", label: "📊 Dashboard Check-In", sub: "Daily · fires at 6:25", color: "#1e3a5f" },
              { time: "8:00am", label: "☀️ Morning Briefing", sub: "Daily · 10min alert", color: "#c9a96e" },
              { time: "1:00pm", label: "⚡ Midday Pulse", sub: "Daily · 5min alert", color: "#d97706" },
              { time: "8:00pm", label: "🌙 Evening Review", sub: "Daily · 10min alert", color: "#7c3d00" },
              { time: "10:00pm", label: "😴 Pre-Sleep", sub: "Daily · 15min alert", color: "#4a1d96" },
            ].map(item => (
              <div key={item.time} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: "1px solid #fafaf9" }}>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <span style={{ fontFamily: "monospace", fontSize: 11, fontWeight: 700, color: item.color, minWidth: 46 }}>{item.time}</span>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "#18181b" }}>{item.label}</div>
                    <div style={{ fontSize: 10, color: "#a1a1aa" }}>{item.sub}</div>
                  </div>
                </div>
              </div>
            ))}
            <div style={{ fontSize: 11, color: "#a1a1aa", marginTop: 4, fontStyle: "italic" }}>+ Weekly financial review, family planning, personal dev</div>
          </div>

          <a
            href="/api/calendar"
            download="liam-accountability.ics"
            style={{
              display: "block", background: "#1c3d2e", color: "#fff", borderRadius: 10,
              padding: "11px 0", textAlign: "center", fontFamily: "'Nunito Sans',sans-serif",
              fontSize: 13, fontWeight: 700, textDecoration: "none", marginBottom: 10
            }}
          >
            ⬇ Download Calendar File (.ics)
          </a>
          <p style={{ fontSize: 11, color: "#a1a1aa", textAlign: "center", lineHeight: 1.5 }}>
            Opens in Apple Calendar, Google Calendar, or Outlook. Tap once — all events sync permanently.
          </p>
        </div>

        {/* Morning Routine */}
        <div className="card" style={{ padding: 16 }}>
          <div className="label" style={{ color: "#71717a", marginBottom: 8 }}>⏰ MORNING ROUTINE</div>
          {[
            ["4:45am", "Wake up · water · no phone"],
            ["5:00am", "🏋️ Gym"],
            ["6:00am", "Shower → leader mode"],
            ["6:15am", "Protein breakfast · zero scroll"],
            ["6:25am", "📊 Dashboard · set #1 task"],
            ["6:35am", "Family time (15 min)"],
            ["6:50am", "Pack · mental run top 3"],
            ["7:00am", "Out the door with a plan"],
          ].map(([time, label]) => (
            <div key={time} style={{ display: "flex", gap: 10, padding: "6px 0", borderBottom: "1px solid #fafaf9" }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#1c3d2e", fontFamily: "monospace", whiteSpace: "nowrap", minWidth: 44 }}>{time}</span>
              <span style={{ fontSize: 12, color: "#52525b" }}>{label}</span>
            </div>
          ))}
        </div>

        {/* Coach reminder */}
        <div className="card" style={{ padding: 16, background: "#f7f4ef", border: "1px dashed #d0c9be" }}>
          <div className="label" style={{ color: "#a1a1aa", marginBottom: 6 }}>💡 COACH'S REMINDER</div>
          <p style={{ fontSize: 13, fontStyle: "italic", color: "#52525b", lineHeight: 1.7 }}>
            "You don't need certainty before action. You need self-trust. The goal isn't to solve your whole life. It's to stabilize the next step."
          </p>
          <p style={{ marginTop: 10, fontSize: 12, fontWeight: 700, color: "#1c3d2e" }}>WHAT ARE YOU GOING TO DO NEXT?</p>
        </div>
      </div>

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
