import { useState, useEffect, useRef } from "react";

const INITIAL_GOALS = {
  work: {
    label: "Work", icon: "💼", color: "#1c3d2e", accent: "#2d6a4f",
    week: [
      { id: 1, text: "⚡ QUICK WIN: Write down your #1 work task right now and start it within 30 minutes", done: false, priority: "high" },
      { id: 2, text: "⚡ QUICK WIN: Send one message today that moves a stuck situation forward", done: false, priority: "high" },
      { id: 3, text: "⚡ QUICK WIN: Block 90 minutes tomorrow morning for deep focused work — phone off", done: false, priority: "high" },
      { id: 4, text: "Structure my morning routine — write it down and follow it once this week", done: false, priority: "medium" },
      { id: 5, text: "Identify the one thing at work causing the most stress and write it down plainly", done: false, priority: "medium" },
    ],
    month: [
      { id: 6, text: "Deliver one visible, measurable result your leadership will notice", done: false, priority: "high" },
      { id: 7, text: "Evaluate honestly: grow here or start building an exit path — decide, don't float", done: false, priority: "high" },
      { id: 8, text: "Build one compounding work habit and track it for 30 days", done: false, priority: "medium" },
    ],
    quarter: [
      { id: 9, text: "Determine your promotion path or transition plan — have a decision made", done: false, priority: "high" },
      { id: 10, text: "Identify one skill that raises your market value and start learning it", done: false, priority: "medium" },
      { id: 11, text: "Complete one major project that proves your capability at the next level", done: false, priority: "high" },
    ],
  },
  personal: {
    label: "Personal", icon: "🏠", color: "#7c3d00", accent: "#c2700f",
    week: [
      { id: 12, text: "⚡ MORNING ROUTINE: 4:45am — Wake up, drink water immediately, no phone for 10 minutes", done: false, priority: "high" },
      { id: 13, text: "⚡ MORNING ROUTINE: 5:00am — Gym (already locked in — protect this every day)", done: false, priority: "high" },
      { id: 14, text: "⚡ MORNING ROUTINE: 6:00am — Shower in 10 minutes, transition into leader mode", done: false, priority: "high" },
      { id: 15, text: "⚡ MORNING ROUTINE: 6:15am — Protein-first breakfast, sit down, zero scrolling", done: false, priority: "high" },
      { id: 16, text: "⚡ MORNING ROUTINE: 6:25am — Open dashboard, set Today's #1 Non-Negotiable (5 min only)", done: false, priority: "high" },
      { id: 161, text: "⚡ MORNING ROUTINE: 6:35am — Family time, present and calm, not rushed (15 min)", done: false, priority: "high" },
      { id: 162, text: "⚡ MORNING ROUTINE: 6:50am — Pack bag, mentally run top 3 priorities for the day", done: false, priority: "medium" },
      { id: 163, text: "⚡ MORNING ROUTINE: 7:00am — Out the door with a plan, not a panic", done: false, priority: "medium" },
      { id: 164, text: "⚡ QUICK WIN: Before bed, write down 3 things you did right today — do this every night", done: false, priority: "medium" },
    ],
    month: [
      { id: 17, text: "Have one honest, calm check-in conversation with your partner about where things stand", done: false, priority: "high" },
      { id: 18, text: "Reduce one major daily stress source — identify it and take one action against it", done: false, priority: "high" },
      { id: 19, text: "📚 PERSONAL DEV: Read or listen to 10 minutes of growth content every morning (books, podcasts, audiobooks)", done: false, priority: "medium" },
      { id: 191, text: "📚 PERSONAL DEV: Identify one skill gap holding you back at work — commit to closing it this month", done: false, priority: "medium" },
      { id: 192, text: "📚 PERSONAL DEV: Schedule 30 minutes of personal development time every week — block it on your calendar", done: false, priority: "medium" },
    ],
    quarter: [
      { id: 20, text: "Build a 90-day physical health baseline — gym, sleep, nutrition all tracked", done: false, priority: "high" },
      { id: 21, text: "Establish a weekly family planning ritual — 30 minutes every Sunday", done: false, priority: "medium" },
      { id: 22, text: "📚 PERSONAL DEV: Complete one full book, course, or certification that moves your career or confidence forward", done: false, priority: "high" },
      { id: 221, text: "📚 PERSONAL DEV: Build a personal development log — track what you learn and how you apply it", done: false, priority: "medium" },
      { id: 222, text: "📚 PERSONAL DEV: Identify your top 3 strengths and actively use each one at work this quarter", done: false, priority: "medium" },
    ],
  },
  financial: {
    label: "Financial", icon: "📈", color: "#1e3a5f", accent: "#2563eb",
    week: [
      { id: 23, text: "⚡ QUICK WIN: Write your exact monthly number for family stability — income needed vs current", done: false, priority: "high" },
      { id: 24, text: "⚡ QUICK WIN: Open your bank account right now and write down your actual balance — no avoiding it", done: false, priority: "high" },
      { id: 25, text: "⚡ QUICK WIN: List every recurring expense in 20 minutes and circle one to cut or reduce", done: false, priority: "high" },
      { id: 26, text: "Identify one income leak — subscription, habit, or cost — and eliminate it this week", done: false, priority: "medium" },
    ],
    month: [
      { id: 27, text: "Build a simple one-page monthly budget: income, fixed costs, variable costs, gap", done: false, priority: "high" },
      { id: 28, text: "Identify one concrete income growth action — ask for raise, start side income, or apply elsewhere", done: false, priority: "high" },
      { id: 29, text: "Have one honest, numbers-based financial conversation with your partner", done: false, priority: "medium" },
    ],
    quarter: [
      { id: 30, text: "Define in writing what financial stability looks like for your family — specific number", done: false, priority: "high" },
      { id: 31, text: "Build a 3-month emergency fund plan — even if it starts at $25/week", done: false, priority: "high" },
      { id: 32, text: "Start one income growth track, set a 90-day target, and measure it monthly", done: false, priority: "medium" },
    ],
  },
};

const DEFAULT_ALERTS = [
  { id: 1, time: "08:00", label: "Morning Check-In", enabled: true },
  { id: 2, time: "13:00", label: "Midday Pulse", enabled: true },
  { id: 3, time: "20:00", label: "Evening Review", enabled: true },
].sort((a, b) => a.time.localeCompare(b.time));

const TIMEFRAMES = ["week", "month", "quarter"];
const CATEGORIES = ["work", "personal", "financial"];
const ALL_TABS = ["work", "personal", "financial", "history"];
const pColor = { high: "#dc2626", medium: "#d97706", low: "#16a34a" };
const pLabel = { high: "HIGH", medium: "MED", low: "LOW" };

const SMART_PROMPT = `You are a personal life coach and strategic advisor. Analyze this user's goal completion data and respond ONLY with valid JSON (no markdown, no backticks, no extra text).

User context: Struggles with work stress, discipline, low confidence, financial pressure, family stability. Stress pattern: stress to overanalysis to hesitation to guilt to lower confidence to more stress.

Return this exact JSON structure with no deviation:
{"trendSummary":"2-3 sentence plain English summary of their progress pattern","coachingInsight":"2-3 sentence direct honest coaching message with no fluff","smartGoals":[{"category":"work","goal":"specific SMART goal text","timeframe":"week","why":"one sentence reason"},{"category":"financial","goal":"specific SMART goal text","timeframe":"month","why":"one sentence reason"},{"category":"personal","goal":"specific SMART goal text","timeframe":"week","why":"one sentence reason"}],"next24Hours":"One very specific action for today with no vagueness","confidenceScore":55,"confidenceNote":"One sentence on their confidence trajectory based on completion data"}`;

// ── helpers ──────────────────────────────────────────────────────────────────
function getNextAlert(alerts, completedToday) {
  const now = new Date();
  const today = now.toDateString();
  const nowMins = now.getHours() * 60 + now.getMinutes();
  const enabled = (Array.isArray(alerts) ? alerts : []).filter(a => a.enabled && completedToday[a.id + "_" + today] !== true);
  if (!enabled.length) return null;
  const withMins = enabled.map(a => {
    const [h, m] = a.time.split(":").map(Number);
    return { ...a, mins: h * 60 + m };
  });
  const upcoming = withMins.filter(a => a.mins > nowMins).sort((a, b) => a.mins - b.mins);
  const next = upcoming.length ? upcoming[0] : withMins.sort((a, b) => a.mins - b.mins)[0];
  let diffMins = next.mins - nowMins;
  if (diffMins <= 0) diffMins += 1440;
  return { ...next, diffMins };
}

function fmtCountdown(mins) {
  if (mins >= 60) {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
  }
  return `${mins}m`;
}

// ── financial education content ───────────────────────────────────────────────
const FIN_ED = [
  { tag: "Budgeting", title: "The 50/30/20 Rule", body: "Put 50% of take-home pay toward needs (housing, food, transport), 30% toward wants, and 20% toward savings and debt payoff. If your needs exceed 50%, that is your first problem to solve — not your wants.", action: "Calculate your actual split this month." },
  { tag: "Emergency Fund", title: "Why 3 Months Changes Everything", body: "An emergency fund is not savings — it is armor. Without it, every car repair or medical bill becomes a financial crisis. Start with a $500 target, then $1,000, then build to 3 months of expenses. It removes the panic from unexpected events.", action: "Set a $500 emergency fund goal in your savings tracker today." },
  { tag: "Debt", title: "Avalanche vs Snowball", body: "Avalanche: pay minimums on all debts, throw extra money at the highest interest rate first. Saves the most money. Snowball: pay smallest balance first for quick wins. Choose avalanche if you are disciplined, snowball if you need motivation.", action: "List your debts by interest rate in your debt tracker." },
  { tag: "Mindset", title: "Your Income Is Not the Problem", body: "Most financial stress is not an income problem — it is a visibility problem. People who know exactly where every dollar goes make the same income and feel 10x more in control. Clarity removes anxiety. Track before you cut.", action: "Fill in your complete monthly budget numbers this week." },
  { tag: "Income", title: "The 3 Income Sources Rule", body: "Single income families are one job loss away from crisis. Even a $300-500/month side income changes the math dramatically — it covers one bill, builds savings, or pays down debt. The goal is not to replace income. It is to reduce dependency.", action: "Identify one skill or asset you could monetize on the side." },
  { tag: "Savings", title: "Pay Yourself First", body: "Most people save what is left over after spending. That is why most people never save. Set an automatic transfer on payday — even $50 — before you see the money. What you do not see, you do not spend. Start small. Build the habit.", action: "Set up a $50 auto-transfer on your next payday." },
  { tag: "Investing", title: "Compound Interest: The 8th Wonder", body: "A dollar invested today is worth more than a dollar invested tomorrow. $200/month at 8% average return over 30 years = $298,000. The secret is time, not the amount. Start small, start now, never stop.", action: "Research your company 401k match — that is a 50-100% instant return." },
  { tag: "Debt", title: "The True Cost of Minimum Payments", body: "A $3,000 credit card balance at 24% APR, paying only minimums, takes 14+ years to pay off and costs over $5,000 in interest. Paying $100 extra per month cuts that to 2.5 years. The math heavily punishes minimums.", action: "Calculate your credit card payoff date using any online calculator." },
  { tag: "Mindset", title: "Stop Managing Money by Memory", body: "Looking at your bank balance to decide if you can spend is not budgeting — it is hope. Real financial control means knowing before you check. When you have a written budget, money goes further because you are making decisions, not reactions.", action: "Write out your next 30 days of expected expenses today." },
  { tag: "Income", title: "The Raise You Are Not Asking For", body: "The average raise from staying at a company is 3%. The average raise from switching jobs is 10-20%. If you are underpaid, the fastest path to a raise is often external leverage — a competing offer, or a new role. Know your market value.", action: "Search your job title on LinkedIn and check current market salary ranges." },
  { tag: "Savings", title: "Sinking Funds: End Financial Surprises", body: "Car registration, Christmas, school supplies — these are not emergencies, they are predictable. A sinking fund means dividing annual expenses by 12 and saving monthly. When December comes, the money is already there.", action: "List 3 predictable annual expenses and calculate monthly savings needed." },
  { tag: "Budgeting", title: "Zero-Based Budgeting", body: "Give every dollar a job before the month starts. Income minus all expenses and savings should equal zero. This does not mean spending everything — it means every dollar is assigned on purpose, including savings and fun money.", action: "Try zero-based budgeting for the next 30 days." },
];

// ── storage helpers (localStorage — persists across sessions) ─────────────────
function persist(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}
function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch { return fallback; }
}

// ── component ─────────────────────────────────────────────────────────────────
export default function LifeDashboard() {
  const [goals, setGoals] = useState(INITIAL_GOALS);
  const [activeCategory, setActiveCategory] = useState("work");
  const [activeTf, setActiveTf] = useState("week");
  const [focusTask, setFocusTask] = useState("");
  const [adding, setAdding] = useState(false);
  const [newText, setNewText] = useState("");
  const [newPri, setNewPri] = useState("high");
  const [alerts, setAlerts] = useState(DEFAULT_ALERTS);
  const [showAlerts, setShowAlerts] = useState(false);
  const [newAlertTime, setNewAlertTime] = useState("09:00");
  const [newAlertLabel, setNewAlertLabel] = useState("");
  const [aiOpen, setAiOpen] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [aiError, setAiError] = useState("");
  const [checkIn, setCheckIn] = useState(null);
  const [checkInNote, setCheckInNote] = useState("");
  const [checkInLog, setCheckInLog] = useState([]);
  const [savedToast, setSavedToast] = useState(false);
  const [completedToday, setCompletedToday] = useState({});
  const [nextAlert, setNextAlert] = useState(null);
  const [tick, setTick] = useState(0);
  const [activeTask, setActiveTask] = useState(null);
  const [taskNote, setTaskNote] = useState("");
  const [storageReady, setStorageReady] = useState(false);
  const [telegramTodos, setTelegramTodos] = useState([]);
  const [telegramLoading, setTelegramLoading] = useState(false);
  const [showTelegramTodos, setShowTelegramTodos] = useState(true);
  const [voiceOpen, setVoiceOpen] = useState(false);
  const [voiceListening, setVoiceListening] = useState(false);
  const [voiceProcessing, setVoiceProcessing] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState("");
  const [voiceResponse, setVoiceResponse] = useState("");
  const [voiceLog, setVoiceLog] = useState([]);
  const [calEvents, setCalEvents] = useState([]);
  const [calLoading, setCalLoading] = useState(false);
  const [calError, setCalError] = useState("");
  const [historyLog, setHistoryLog] = useState([]);
  const [historyFilter, setHistoryFilter] = useState("all");
  const recognitionRef = useRef(null);
  const firedRef = useRef({});

  // ── work panel state ────────────────────────────────────────────────────
  const [wins, setWins] = useState([]);
  const [newWin, setNewWin] = useState("");
  const [outputRating, setOutputRating] = useState(0);
  const [projects, setProjects] = useState([
    { id: 1, name: "Key work project", status: "in-progress", priority: "high" },
  ]);
  const [newProject, setNewProject] = useState("");
  const [showAddProject, setShowAddProject] = useState(false);

  // ── personal panel state ────────────────────────────────────────────────
  const [habits, setHabits] = useState([
    { id: 1, name: "Gym", icon: "🏋️", streak: 0, todayDone: false },
    { id: 2, name: "Sleep on time", icon: "😴", streak: 0, todayDone: false },
    { id: 3, name: "No phone 10min AM", icon: "📵", streak: 0, todayDone: false },
    { id: 4, name: "Read / Learn 10min", icon: "📚", streak: 0, todayDone: false },
  ]);
  const [confidenceLog, setConfidenceLog] = useState([]);
  const [todayConfidence, setTodayConfidence] = useState(0);

  // ── financial panel state ───────────────────────────────────────────────
  const [budget, setBudget] = useState({ income: "", fixedCosts: "", variableCosts: "", stabilityTarget: "" });
  const [savingsGoals, setSavingsGoals] = useState([
    { id: 1, name: "Emergency Fund (3mo)", target: 5000, current: 0, color: "#1e3a5f" },
    { id: 2, name: "Family Stability Buffer", target: 2000, current: 0, color: "#1c3d2e" },
  ]);
  const [newSaving, setNewSaving] = useState({ name: "", target: "", current: "" });
  const [debts, setDebts] = useState([]);
  const [newDebt, setNewDebt] = useState({ name: "", balance: "", minPayment: "", rate: "" });
  const [eduIndex, setEduIndex] = useState(0);
  const [showAddSaving, setShowAddSaving] = useState(false);
  const [showAddDebt, setShowAddDebt] = useState(false);

  // ── load persisted data on mount ─────────────────────────────────────────
  useEffect(() => {
    const savedGoals = load("lcd_goals", null);
    if (savedGoals && typeof savedGoals === 'object') {
      // Merge saved goals with INITIAL_GOALS, preserving metadata, guarding arrays
      const safeGoals = {};
      ["work","personal","financial"].forEach(c => {
        safeGoals[c] = { ...INITIAL_GOALS[c] }; // keep label, icon, color, accent
        ["week","month","quarter"].forEach(tf => {
          const val = savedGoals[c]?.[tf];
          safeGoals[c][tf] = Array.isArray(val) ? val : INITIAL_GOALS[c][tf];
        });
      });
      setGoals(safeGoals);
    }
    const savedLog = load("lcd_checkin_log", []);
    setCheckInLog(Array.isArray(savedLog) ? savedLog : []);
    const savedCompleted = load("lcd_completed_today", {});
    const today = new Date().toDateString();
    const hasToday = Object.keys(savedCompleted).some(k => k.endsWith(today));
    setCompletedToday(hasToday ? savedCompleted : {});
    const savedFocus = load("lcd_focus", "");
    setFocusTask(savedFocus);
    const savedAlerts = load("lcd_alerts", null);
    if (Array.isArray(savedAlerts) && savedAlerts.length > 0) setAlerts(savedAlerts);
    const savedWins = load("lcd_wins", []);
    setWins(Array.isArray(savedWins) ? savedWins : []);
    const savedHabits = load("lcd_habits", null);
    if (Array.isArray(savedHabits) && savedHabits.length > 0) setHabits(savedHabits);
    const savedConfidence = load("lcd_confidence", []);
    setConfidenceLog(savedConfidence);
    const savedBudget = load("lcd_budget", { income: "", fixedCosts: "", variableCosts: "", stabilityTarget: "" });
    setBudget(savedBudget);
    const savedSavings = load("lcd_savings", null);
    if (Array.isArray(savedSavings) && savedSavings.length > 0) setSavingsGoals(savedSavings);
    const savedDebts = load("lcd_debts", []);
    setDebts(savedDebts);
    const savedOutput = load("lcd_output_rating", 0);
    setOutputRating(savedOutput);
    const savedProjects = load("lcd_projects", [{ id: 1, name: "Key work project", status: "in-progress", priority: "high" }]);
    setProjects(savedProjects);
    const savedHistory = load("lcd_history", []);
    setHistoryLog(Array.isArray(savedHistory) ? savedHistory : []);
    setStorageReady(true);
  }, []);

  // ── persist goals whenever they change ───────────────────────────────────
  useEffect(() => {
    if (storageReady) persist("lcd_goals", goals);
  }, [goals, storageReady]);

  // ── persist check-in log ─────────────────────────────────────────────────
  useEffect(() => {
    if (storageReady) persist("lcd_checkin_log", checkInLog);
  }, [checkInLog, storageReady]);

  // ── persist completedToday ───────────────────────────────────────────────
  useEffect(() => {
    if (storageReady) persist("lcd_completed_today", completedToday);
  }, [completedToday, storageReady]);

  // ── persist focus task ───────────────────────────────────────────────────
  useEffect(() => {
    if (storageReady) persist("lcd_focus", focusTask);
  }, [focusTask, storageReady]);

  // ── persist alerts ───────────────────────────────────────────────────────
  useEffect(() => {
    if (storageReady) persist("lcd_alerts", alerts);
  }, [alerts, storageReady]);

  // ── persist work/personal/financial panel data ────────────────────────
  useEffect(() => { if (storageReady) persist("lcd_wins", wins); }, [wins, storageReady]);
  useEffect(() => { if (storageReady) persist("lcd_habits", habits); }, [habits, storageReady]);
  useEffect(() => { if (storageReady) persist("lcd_confidence", confidenceLog); }, [confidenceLog, storageReady]);
  useEffect(() => { if (storageReady) persist("lcd_budget", budget); }, [budget, storageReady]);
  useEffect(() => { if (storageReady) persist("lcd_savings", savingsGoals); }, [savingsGoals, storageReady]);
  useEffect(() => { if (storageReady) persist("lcd_debts", debts); }, [debts, storageReady]);
  useEffect(() => { if (storageReady) persist("lcd_output_rating", outputRating); }, [outputRating, storageReady]);
  useEffect(() => { if (storageReady) persist("lcd_projects", projects); }, [projects, storageReady]);
  useEffect(() => { if (storageReady) persist("lcd_history", historyLog); }, [historyLog, storageReady]);

  // ── fetch telegram todos from API ─────────────────────────────────────────
  const fetchTelegramTodos = async () => {
    setTelegramLoading(true);
    try {
      const res = await fetch('/api/todos');
      if (res.ok) {
        const data = await res.json();
        setTelegramTodos(data.todos || []);
      }
    } catch {}
    setTelegramLoading(false);
  };

  const markTelegramTodoDone = async (id) => {
    try {
      await fetch('/api/todos', { method:'PATCH', headers:{'Content-Type':'application/json'}, body:JSON.stringify({id, done:true}) });
      setTelegramTodos(prev => prev.map(t => t.id === id ? {...t, done:true} : t));
    } catch {}
  };

  const deleteTelegramTodo = async (id) => {
    try {
      await fetch('/api/todos', { method:'DELETE', headers:{'Content-Type':'application/json'}, body:JSON.stringify({id}) });
      setTelegramTodos(prev => prev.filter(t => t.id !== id));
    } catch {}
  };

  useEffect(() => { fetchTelegramTodos(); }, []);
  useEffect(() => { if (storageReady) persist("lcd_history", historyLog); }, [historyLog, storageReady]);

  // ── live clock tick every 30s ────────────────────────────────────────────
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 30000);
    return () => clearInterval(id);
  }, []);

  // ── update next alert countdown + trigger check-in modal ────────────────
  useEffect(() => {
    setNextAlert(getNextAlert(alerts, completedToday));
    const now = new Date();
    const hhmm = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    (Array.isArray(alerts) ? alerts : []).forEach(a => {
      const key = `${a.id}_${hhmm}`;
      if (a.enabled && a.time === hhmm && !firedRef.current[key]) {
        firedRef.current[key] = true;
        setCheckIn({ label: a.label, time: a.time, alertId: a.id });
      }
    });
  }, [tick, alerts, completedToday]);

  // ── history helper ────────────────────────────────────────────────────
  const addHistory = (type, title, detail = "", category = "") => {
    const entry = {
      id: Date.now() + Math.random(),
      timestamp: new Date().toISOString(),
      date: new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" }),
      time: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
      type, title, detail, category
    };
    setHistoryLog(prev => {
      const updated = [entry, ...prev].slice(0, 500);
      persist("lcd_history", updated);
      return updated;
    });
  };

  // ── task helpers ─────────────────────────────────────────────────────────
  const toggleTask = (c, tf, id) => {
    setGoals(p => {
      const updated = { ...p, [c]: { ...p[c], [tf]: p[c][tf].map(t => t.id === id ? { ...t, done: !t.done } : t) } };
      const task = p[c][tf].find(t => t.id === id);
      if (task) addHistory(task.done ? "task_uncomplete" : "task_complete", task.done ? "Task unchecked" : "Task completed", task.text.replace(/^⚡ (QUICK WIN|MORNING ROUTINE|PERSONAL DEV): /, ""), c);
      return updated;
    });
  };
  const deleteTask = (c, tf, id) =>
    setGoals(p => ({ ...p, [c]: { ...p[c], [tf]: p[c][tf].filter(t => t.id !== id) } }));
  const addTask = () => {
    if (!newText.trim()) return;
    if (activeCategory === "history") return;
    setGoals(p => ({
      ...p, [activeCategory]: {
        ...p[activeCategory],
        [activeTf]: [...p[activeCategory][activeTf], { id: Date.now(), text: newText.trim(), done: false, priority: newPri }]
      }
    }));
    setNewText(""); setAdding(false);
  };

  // ── progress helpers ─────────────────────────────────────────────────────
  const saveTaskNote = () => {
    if (!activeTask) return;
    setGoals(p => ({
      ...p,
      [activeTask.cat]: {
        ...p[activeTask.cat],
        [activeTask.tf]: p[activeTask.cat][activeTask.tf].map(t =>
          t.id === activeTask.task.id
            ? { ...t, done: true, note: taskNote.trim() }
            : t
        )
      }
    }));
    addHistory("task_complete", "Task completed with note", activeTask.task.text.replace(/^⚡ (QUICK WIN|MORNING ROUTINE|PERSONAL DEV): /, "") + (taskNote.trim() ? " — " + taskNote.trim() : ""), activeTask.cat);
    addHistory("task_note", "Task completed with note", (activeTask.task.text.replace(/⚡ (QUICK WIN|MORNING ROUTINE|PERSONAL DEV): /g, "")) + (taskNote.trim() ? " — " + taskNote.trim() : ""), activeTask.cat);
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3000);
    setActiveTask(null);
    setTaskNote("");
  };

  // ── voice bot ──────────────────────────────────────────────────────────
  const startListening = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { setVoiceResponse("Voice input not supported on this device."); return; }
    const rec = new SR();
    rec.continuous = false;
    rec.interimResults = false;
    rec.lang = "en-US";
    recognitionRef.current = rec;
    rec.onstart = () => setVoiceListening(true);
    rec.onresult = (e) => {
      const t = e.results[0][0].transcript;
      setVoiceTranscript(t);
      setVoiceListening(false);
      processVoice(t);
    };
    rec.onerror = () => { setVoiceListening(false); setVoiceResponse("Couldn't hear you. Tap mic and try again."); };
    rec.onend = () => setVoiceListening(false);
    rec.start();
  };

  const speak = (text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 1.05; u.pitch = 1; u.volume = 1;
    window.speechSynthesis.speak(u);
  };

  const processVoice = async (transcript) => {
    setVoiceProcessing(true);
    setVoiceResponse("");
    const summary = {};
    CATEGORIES.forEach(c => { summary[c] = {}; TIMEFRAMES.forEach(tf => { const l = goals[c][tf]; summary[c][tf] = { done: l.filter(t=>t.done).length, total: l.length }; }); });
    const prompt = `You are a concise voice coach assistant for a personal accountability dashboard. The user is under work and financial stress, building confidence, has a 5am gym habit, and is a family provider.
RESPOND IN 1-2 SHORT SENTENCES ONLY — they may be driving.
Dashboard state: ${JSON.stringify(summary)}
Today's focus: "${focusTask || "not set"}"
Recent check-ins: ${checkInLog.slice(0,2).map(c=>c.note).join(" | ") || "none"}
User said: "${transcript}"
Return ONLY valid JSON: {"speech":"1-2 sentence response","action":"none|add_checkin|set_focus","data":{"note":"","focus":""}}`;
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 200, messages: [{ role: "user", content: prompt }] })
      });
      const json = await res.json();
      const raw = json.content?.map(b => b.text||"").join("").trim().replace(/```json|```/g,"").trim();
      const parsed = JSON.parse(raw);
      setVoiceResponse(parsed.speech);
      speak(parsed.speech);
      if (parsed.action === "add_checkin" && parsed.data?.note) {
        const entry = { id: Date.now(), label: "Voice Check-In", note: parsed.data.note, timestamp: new Date().toLocaleString("en-US",{month:"short",day:"numeric",hour:"numeric",minute:"2-digit"}) };
        const newLog = [entry, ...checkInLog].slice(0,20);
        setCheckInLog(newLog); persist("lcd_checkin_log", newLog);
      }
      if (parsed.action === "set_focus" && parsed.data?.focus) {
        setFocusTask(parsed.data.focus); persist("lcd_focus", parsed.data.focus);
      }
      setVoiceLog(prev => [{ id: Date.now(), said: transcript, response: parsed.speech }, ...prev].slice(0,10));
    } catch { setVoiceResponse("Something went wrong. Try again."); speak("Something went wrong. Try again."); }
    setVoiceProcessing(false);
  };

  // ── calendar ────────────────────────────────────────────────────────────
  const loadCalendar = () => {
    // Show today's scheduled touchpoints as calendar entries
    const today = new Date();
    const dateStr = today.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    setCalEvents([
      { title: "🏋️ Gym", start: "05:00", end: "06:00", color: "#1c3d2e" },
      { title: "☀️ Morning Intention", start: "08:00", end: "08:15", color: "#c9a96e" },
      { title: "⚡ Midday Pulse", start: "13:00", end: "13:10", color: "#1e3a5f" },
      { title: "🌙 Evening Review", start: "20:00", end: "20:15", color: "#7c3d00" },
      { title: "😴 Pre-Sleep Wind Down", start: "22:00", end: "22:10", color: "#4a1d96" },
    ]);
    setCalError("");
  };

  const addRoutineToCalendar = () => {
    // Generate ICS file that opens in Apple Calendar / Google Calendar
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const pad = n => String(n).padStart(2, "0");
    const dateBase = `${tomorrow.getFullYear()}${pad(tomorrow.getMonth()+1)}${pad(tomorrow.getDate())}`;

    const events = [
      { summary: "🏋️ Gym", start: `${dateBase}T050000`, end: `${dateBase}T060000`, rrule: "RRULE:FREQ=DAILY;BYDAY=MO,TU,WE,TH,FR" },
      { summary: "☀️ Morning Intention (Accountability)", start: `${dateBase}T080000`, end: `${dateBase}T081500`, rrule: "RRULE:FREQ=DAILY" },
      { summary: "📊 Dashboard Check-In", start: `${dateBase}T062500`, end: `${dateBase}T063000`, rrule: "RRULE:FREQ=DAILY;BYDAY=MO,TU,WE,TH,FR" },
      { summary: "⚡ Midday Accountability Pulse", start: `${dateBase}T130000`, end: `${dateBase}T131000`, rrule: "RRULE:FREQ=DAILY" },
      { summary: "🌙 Evening Review", start: `${dateBase}T200000`, end: `${dateBase}T201500`, rrule: "RRULE:FREQ=DAILY" },
      { summary: "😴 Pre-Sleep Wind Down", start: `${dateBase}T220000`, end: `${dateBase}T221000`, rrule: "RRULE:FREQ=DAILY" },
    ];

    const icsLines = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Liam Accountability//EN",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
    ];

    events.forEach(ev => {
      icsLines.push(
        "BEGIN:VEVENT",
        `UID:${ev.summary.replace(/\s/g,"")}-${Date.now()}@liam`,
        `DTSTART:${ev.start}`,
        `DTEND:${ev.end}`,
        `SUMMARY:${ev.summary}`,
        ev.rrule,
        "END:VEVENT"
      );
    });
    icsLines.push("END:VCALENDAR");

    const blob = new Blob([icsLines.join("\r\n")], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "liam-accountability-routine.ics";
    a.click();
    URL.revokeObjectURL(url);

    setCalEvents([
      { title: "🏋️ Gym", start: "05:00", end: "06:00", color: "#1c3d2e" },
      { title: "☀️ Morning Intention", start: "08:00", end: "08:15", color: "#c9a96e" },
      { title: "⚡ Midday Pulse", start: "13:00", end: "13:10", color: "#1e3a5f" },
      { title: "🌙 Evening Review", start: "20:00", end: "20:15", color: "#7c3d00" },
      { title: "😴 Pre-Sleep Wind Down", start: "22:00", end: "22:10", color: "#4a1d96" },
    ]);
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3000);
  };

  const getPct = (c, tf) => {
    const l = goals[c][tf];
    return l.length ? Math.round(l.filter(t => t.done).length / l.length * 100) : 0;
  };
  const getOverall = () => {
    let tot = 0, dn = 0;
    CATEGORIES.forEach(c => TIMEFRAMES.forEach(tf => goals[c][tf].forEach(t => { tot++; if (t.done) dn++; })));
    return tot ? Math.round(dn / tot * 100) : 0;
  };

  // ── AI analysis ──────────────────────────────────────────────────────────
  const runAI = async () => {
    setAiLoading(true); setAiError(""); setAiOpen(true); setAiResult(null);
    const data = {};
    CATEGORIES.forEach(c => {
      data[c] = {};
      TIMEFRAMES.forEach(tf => {
        const l = goals[c][tf];
        data[c][tf] = { total: l.length, done: l.filter(t => t.done).length, pct: getPct(c, tf), highDone: l.filter(t => t.priority === "high" && t.done).length, highTotal: l.filter(t => t.priority === "high").length };
      });
    });
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514", max_tokens: 1000,
          messages: [{ role: "user", content: SMART_PROMPT + "\n\nCompletion data:\n" + JSON.stringify(data) }]
        })
      });
      const json = await res.json();
      const raw = json.content?.map(b => b.text || "").join("").trim().replace(/```json|```/g, "").trim();
      setAiResult(JSON.parse(raw));
    } catch (e) {
      setAiError("AI analysis failed. Please try again.");
    }
    setAiLoading(false);
  };

  const overall = getOverall();
  const cat = activeCategory !== "history" ? goals[activeCategory] : goals["work"];
  const list = cat[activeTf];
  const listPct = activeCategory !== "history" ? getPct(activeCategory, activeTf) : 0;
  const catBorderColors = { work: "#1c3d2e", personal: "#7c3d00", financial: "#1e3a5f" };
  const catLightBg = { work: "#f0f7f3", personal: "#fdf4ec", financial: "#eff4fc" };

  if (!storageReady) return (
    <div style={{ minHeight:"100vh", background:"#f5f2ed", display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:16 }}>
      <div style={{ fontFamily:"'Nunito Sans',sans-serif", fontSize:13, fontWeight:700, letterSpacing:2, color:"#b8945a", textTransform:"uppercase" }}>Loading your dashboard...</div>
      <div style={{ width:40, height:40, border:"3px solid #f0ebe3", borderTopColor:"#1c3d2e", borderRadius:"50%", animation:"spin 0.8s linear infinite" }}></div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#f7f4ef", fontFamily: "'Nunito Sans', sans-serif", color: "#1a1a1a" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;0,9..144,700;0,9..144,900;1,9..144,400;1,9..144,600&family=Nunito+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

        :root {
          --bg: #f7f4ef;
          --surface: #ffffff;
          --surface-2: #faf8f4;
          --border: #e8e0d4;
          --border-light: #f0ebe3;
          --text-primary: #18181b;
          --text-secondary: #52525b;
          --text-muted: #a1a1aa;
          --accent-gold: #b8945a;
          --accent-work: #1c3d2e;
          --accent-personal: #7c3d00;
          --accent-financial: #1e3a5f;
          --radius: 14px;
          --radius-sm: 8px;
          --shadow: 0 1px 3px rgba(0,0,0,.05), 0 8px 24px rgba(0,0,0,.06);
          --shadow-lg: 0 4px 6px rgba(0,0,0,.04), 0 20px 40px rgba(0,0,0,.1);
          --font-display: 'Fraunces', Georgia, serif;
          --font-body: 'Nunito Sans', system-ui, sans-serif;
          --font-mono: 'JetBrains Mono', monospace;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: var(--font-body); -webkit-font-smoothing: antialiased; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-thumb { background: var(--accent-gold); border-radius: 3px; }

        .card {
          background: var(--surface);
          border-radius: var(--radius);
          box-shadow: var(--shadow);
          border: 1px solid var(--border-light);
        }

        .tab-cat {
          border: none; background: transparent;
          padding: 10px 18px; cursor: pointer;
          font-family: var(--font-body); font-size: 13px; font-weight: 600;
          letter-spacing: 0.3px; border-radius: var(--radius-sm);
          transition: all .2s; color: var(--text-muted);
        }
        .tab-cat:hover { background: var(--border-light); color: var(--text-secondary); }
        .tab-cat.on { color: #fff; font-weight: 700; }

        .tf-pill {
          border: 1.5px solid var(--border);
          background: transparent; padding: 7px 18px; cursor: pointer;
          font-family: var(--font-body); font-size: 12px; font-weight: 600;
          letter-spacing: 0.5px; text-transform: uppercase;
          border-radius: 24px; transition: all .2s; color: var(--text-muted);
        }
        .tf-pill:hover { border-color: var(--accent-gold); color: var(--accent-gold); }
        .tf-pill.on { background: var(--accent-gold); border-color: var(--accent-gold); color: #fff; }

        .task-row {
          display: flex; align-items: flex-start; gap: 14px;
          padding: 16px 0; border-bottom: 1px solid var(--border-light);
          transition: all .15s; cursor: pointer;
        }
        .task-row:last-child { border-bottom: none; }
        .task-row:hover { background: var(--surface-2); margin: 0 -18px; padding: 16px 18px; border-radius: var(--radius-sm); }

        .cb {
          width: 22px; height: 22px; border-radius: 50%;
          border: 2px solid var(--border);
          flex-shrink: 0; margin-top: 1px;
          display: flex; align-items: center; justify-content: center;
          transition: all .2s;
        }
        .cb.on { border-color: #16a34a; background: #16a34a; }

        .pbar { height: 7px; background: var(--border-light); border-radius: 4px; overflow: hidden; }
        .pfill { height: 100%; border-radius: 4px; transition: width .6s ease; }

        .ghost {
          width: 100%; background: transparent;
          border: 2px dashed var(--border); color: var(--text-muted);
          padding: 14px; border-radius: var(--radius-sm); cursor: pointer;
          font-family: var(--font-body); font-size: 13px; font-weight: 600;
          transition: all .2s; margin-top: 12px;
        }
        .ghost:hover { border-color: var(--accent-gold); color: var(--accent-gold); background: #fdf9f3; }

        .inp {
          width: 100%; border: 1.5px solid var(--border);
          background: var(--surface-2); padding: 12px 16px;
          border-radius: var(--radius-sm);
          font-family: var(--font-body); font-size: 15px; font-weight: 400;
          outline: none; color: var(--text-primary); transition: border-color .2s;
          line-height: 1.5;
        }
        .inp:focus { border-color: var(--accent-gold); background: #fff; }
        .inp::placeholder { color: var(--text-muted); }

        .btn {
          border: none; padding: 12px 24px;
          border-radius: var(--radius-sm); cursor: pointer;
          font-family: var(--font-body); font-size: 13px; font-weight: 700;
          letter-spacing: 0.3px; transition: all .2s;
        }
        .btn:hover { opacity: .88; transform: translateY(-1px); }
        .btn:active { transform: translateY(0); }

        .del {
          background: transparent; border: none; color: var(--border);
          cursor: pointer; font-size: 20px; padding: 0 6px;
          transition: color .2s; line-height: 1; flex-shrink: 0; margin-top: 0;
        }
        .del:hover { color: #ef4444; }

        .chip {
          border: 1.5px solid; padding: 6px 12px;
          border-radius: 6px; cursor: pointer;
          font-family: var(--font-body); font-size: 11px; font-weight: 700;
          letter-spacing: 0.5px; text-transform: uppercase;
          transition: all .2s; background: transparent;
        }

        .toggle {
          width: 40px; height: 22px; background: #ddd;
          border-radius: 11px; position: relative;
          cursor: pointer; transition: background .2s; border: none; flex-shrink: 0;
        }
        .toggle.on { background: #16a34a; }
        .toggle::after {
          content: ''; position: absolute; top: 3px; left: 3px;
          width: 16px; height: 16px; background: #fff; border-radius: 50%;
          transition: transform .2s;
        }
        .toggle.on::after { transform: translateX(18px); }

        .overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,.45);
          z-index: 999; display: flex; align-items: center;
          justify-content: center; padding: 20px;
          backdrop-filter: blur(4px);
        }
        .modal {
          background: var(--surface); border-radius: 20px; padding: clamp(20px,4vw,32px);
          max-width: 480px; width: 100%; box-shadow: var(--shadow-lg);
          max-height: 88vh; overflow-y: auto;
          border: 1px solid var(--border-light);
        }

        .label-tag {
          font-family: var(--font-body); font-size: 11px; font-weight: 700;
          letter-spacing: 1px; text-transform: uppercase;
          padding: 3px 8px; border-radius: 5px;
        }

        .section-label {
          font-family: var(--font-body); font-size: 11px; font-weight: 700;
          letter-spacing: 2px; text-transform: uppercase; color: var(--text-muted);
        }

        .conf-bar { height: 8px; background: var(--border-light); border-radius: 4px; overflow: hidden; margin: 8px 0 4px; }
        .conf-fill { height: 100%; border-radius: 4px; transition: width .8s ease; background: linear-gradient(90deg, #f97316, #16a34a); }

        @keyframes slideUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        .up { animation: slideUp .3s ease forwards; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: .4; } }
        .pulse { animation: pulse 1.4s ease infinite; }
        @keyframes alertPing { 0% { transform: scale(1); } 50% { transform: scale(1.03); } 100% { transform: scale(1); } }
        .alert-ping { animation: alertPing 2.5s ease infinite; }
        @keyframes toast { 0% { opacity:0; transform:translate(-50%,10px); } 15% { opacity:1; transform:translate(-50%,0); } 80% { opacity:1; } 100% { opacity:0; } }
        .toast { animation: toast 3s ease forwards; position:fixed; bottom:36px; left:50%; transform:translateX(-50%); background:var(--accent-work); color:#fff; padding:14px 28px; border-radius:32px; font-family:var(--font-body); font-size:13px; font-weight:600; z-index:9999; white-space:nowrap; box-shadow:0 4px 24px rgba(0,0,0,.18); }
        @keyframes ripple { 0% { transform:scale(1); opacity:1; } 100% { transform:scale(2.5); opacity:0; } }
        .mic-ripple { animation: ripple 1s ease infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* ── RESPONSIVE ───────────────────────────────────────────────── */
        @media (max-width: 768px) {
          .mobile-stack { flex-direction: column !important; }
          .mobile-hide { display: none !important; }
          .mobile-full { grid-template-columns: 1fr !important; }
          .mobile-pad { padding: 16px !important; }
          .tab-cat { padding: 10px 14px; font-size: 12px; }
          .tf-pill { padding: 8px 14px; font-size: 11px; }
          .btn { padding: 13px 18px; font-size: 13px; }
          .task-row { padding: 14px 0; gap: 10px; }
          .task-row:hover { margin: 0; padding: 14px 0; background: transparent; }
          .card { border-radius: 12px; }
          .modal { padding: 22px 18px; border-radius: 16px; }
          .inp { font-size: 16px; padding: 13px 14px; }
          .ghost { padding: 14px; font-size: 13px; }
        }

        @media (max-width: 480px) {
          .tab-cat { padding: 9px 12px; font-size: 11px; letter-spacing: 0.5px; }
          .tf-pill { padding: 7px 12px; font-size: 10px; }
        }
      `}</style>

      {/* ── HEADER ── */}
      <div style={{ background: "#fff", borderBottom: "1px solid #ede8e0" }}>
        <div style={{ maxWidth: 1020, margin: "0 auto", padding: "clamp(16px,3vw,22px) clamp(14px,4vw,20px)" }}>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
            <div>
              <div style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: 11, letterSpacing: 3, fontWeight: 700, color: "#b8945a", textTransform: "uppercase", marginBottom: 6 }}>Life Command Center</div>
              <h1 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: "clamp(22px,5vw,38px)", fontWeight: 900, letterSpacing: "-.5px", lineHeight: 1.05, color: "#18181b" }}>
                Accountability System
              </h1>
              <div style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: 13, color: "#a1a1aa", fontWeight: 500, letterSpacing: 0, marginTop: 6 }}>
                {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              {/* Ring */}
              <div style={{ textAlign: "center" }}>
                <svg width={68} height={68} style={{ transform: "rotate(-90deg)" }}>
                  <circle cx={34} cy={34} r={27} fill="none" stroke="#f0ebe3" strokeWidth={5} />
                  <circle cx={34} cy={34} r={27} fill="none" strokeWidth={5} strokeLinecap="round"
                    stroke={overall >= 70 ? "#16a34a" : overall >= 40 ? "#d97706" : "#dc2626"}
                    strokeDasharray={`${(overall / 100) * 169.6} 169.6`}
                    style={{ transition: "stroke-dasharray .6s ease" }} />
                  <text x={34} y={39} textAnchor="middle" fill="#1a1a1a"
                    style={{ fontSize: 12, fontFamily: "'Nunito Sans', sans-serif", fontWeight: 700, transform: "rotate(90deg)", transformOrigin: "34px 34px" }}>
                    {overall}%
                  </text>
                </svg>
                <div style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: 11, letterSpacing: 1, fontWeight: 700, color: "#a1a1aa", textTransform: "uppercase", marginTop: -2 }}>overall</div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <button className="btn" onClick={runAI} style={{ background: "#1c3d2e", color: "#fff" }}>✦ AI Analysis</button>
                <button className="btn" onClick={() => setShowAlerts(true)} style={{ background: "#f5f2ed", color: "#666", border: "1.5px solid #e0d9ce" }}>
                  ⏱ Alerts ({(Array.isArray(alerts) ? alerts : []).filter(a => a.enabled).length} active)
                </button>
              </div>
            </div>
          </div>

          {/* ── IN-APP COUNTDOWN BANNER ── */}
          {nextAlert && (
            <div className="alert-ping" style={{ marginTop: 14, borderRadius: 14, overflow: "hidden", border: "2px solid " + (nextAlert.diffMins <= 10 ? "#fecaca" : "#bbf7d0") }}>
              <div style={{ background: nextAlert.diffMins <= 10 ? "#dc2626" : "#1c3d2e", padding: "10px 18px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 20, lineHeight: 1 }}>⏰</span>
                  <span style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: 12, fontWeight: 800, color: "#fff", letterSpacing: 2, textTransform: "uppercase" }}>
                    {nextAlert.diffMins <= 10 ? "Check-In Due Soon" : "Next Check-In"}
                  </span>
                </div>
                <div style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.85)" }}>
                  in {fmtCountdown(nextAlert.diffMins)}
                </div>
              </div>
              <div style={{ background: nextAlert.diffMins <= 10 ? "#fff5f5" : "#f0fdf4", padding: "14px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
                <div>
                  <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 18, fontWeight: 700, color: "#18181b", marginBottom: 2 }}>
                    {nextAlert.label}
                  </div>
                  <div style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: 13, fontWeight: 500, color: "#71717a" }}>
                    Scheduled {nextAlert.time} · 5-minute update
                  </div>
                </div>
                <button className="btn" onClick={() => setCheckIn({ label: nextAlert.label, time: nextAlert.time, alertId: nextAlert.id })}
                  style={{ background: nextAlert.diffMins <= 10 ? "#dc2626" : "#1c3d2e", color: "#fff", minWidth: 130, fontSize: 14 }}>
                  Check In Now
                </button>
              </div>
            </div>
          )}

          {/* ── TODAY'S FOCUS ── */}
          <div style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 12, background: "#fdf9f3", border: "1.5px solid #e8dfc9", borderRadius: 12, padding: "14px 16px" }}>
            <span style={{ fontSize: 18 }}>⚡</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: 11, letterSpacing: 2, fontWeight: 700, color: "#b8945a", textTransform: "uppercase", marginBottom: 5 }}>Today's #1 Non-Negotiable</div>
              <input className="inp" style={{ border: "none", background: "transparent", padding: 0, fontWeight: 600, fontSize: 16 }}
                placeholder="What MUST get done today? Be specific." value={focusTask} onChange={e => setFocusTask(e.target.value)} />
            </div>
          </div>

          {/* ── CATEGORY TABS ── */}
          <div style={{ display: "flex", gap: 6, marginTop: 18, overflowX: "auto", paddingBottom: 4, WebkitOverflowScrolling: "touch" }}>
            {CATEGORIES.map(c => (
              <button key={c} className={"tab-cat" + (activeCategory === c ? " on" : "")}
                onClick={() => setActiveCategory(c)}
                style={activeCategory === c ? { background: goals[c].color } : {}}>
                {goals[c].icon} {goals[c].label}
              </button>
            ))}
            <button className={"tab-cat" + (activeCategory === "history" ? " on" : "")}
              onClick={() => setActiveCategory("history")}
              style={activeCategory === "history" ? { background: "#3f3f46" } : {}}>
              📋 History
            </button>
          </div>
        </div>
      </div>

      {/* ── BODY ── */}
      <div style={{ maxWidth: 1020, margin: "0 auto", padding: "clamp(12px,3vw,20px)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 280px", gap: 18, alignItems: "start" }} className="mobile-full">

          {/* ── TASK PANEL + AI ── */}
          <div>
            {activeCategory !== "history" && <div className="card" style={{ padding: "clamp(16px,3vw,22px) clamp(16px,3vw,22px) 4px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, marginBottom: 14 }}>
                <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 2, WebkitOverflowScrolling: "touch" }}>
                  {TIMEFRAMES.map(tf => (
                    <button key={tf} className={"tf-pill" + (activeTf === tf ? " on" : "")} onClick={() => setActiveTf(tf)}>
                      This {tf}
                    </button>
                  ))}
                </div>
                <span style={{ fontFamily: "'Nunito Sans', sans-serif", fontWeight: 700, fontSize: 13, color: listPct === 100 ? "#16a34a" : cat.accent }}>
                  {list.filter(t => t.done).length}/{list.length} done · {listPct}%
                </span>
              </div>

              <div className="pbar" style={{ marginBottom: 16 }}>
                <div className="pfill" style={{ width: listPct + "%", background: cat.color }} />
              </div>

              <div style={{ padding: "0 4px" }}>
                {list.length === 0
                  ? <div style={{ padding: "24px 0", textAlign: "center", fontFamily: "'Nunito Sans', sans-serif", fontSize: 12, color: "#ccc" }}>No tasks. Add one below.</div>
                  : list.map(task => (
                    <div key={task.id} className="task-row" onClick={() => { setActiveTask({ task, cat: activeCategory, tf: activeTf }); setTaskNote(task.note || ""); }}>
                      <div className={"cb" + (task.done ? " on" : "")} onClick={e => { e.stopPropagation(); toggleTask(activeCategory, activeTf, task.id); }}>
                        {task.done && <span style={{ color: "#fff", fontSize: 11, fontWeight: "bold" }}>✓</span>}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 16, lineHeight: 1.6, fontFamily: "'Nunito Sans', sans-serif", fontWeight: 500, color: task.done ? "#a1a1aa" : "#18181b", wordBreak: "break-word", textDecoration: task.done ? "line-through" : "none", textDecorationColor: "#ccc", transition: "all .2s" }}>
                          {task.text.replace("⚡ QUICK WIN: ", "")}
                        </div>
                        {task.note && (
                          <div style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: 12, fontWeight: 600, color: "#16a34a", marginTop: 5, display: "flex", alignItems: "center", gap: 4 }}>
                            <span>✓</span>
                            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 240 }}>{task.note}</span>
                          </div>
                        )}
                        {!task.note && !task.done && (
                          <div style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: 12, color: "#c4bdb4", marginTop: 4, fontWeight: 500 }}>tap to fill in →</div>
                        )}
                      </div>
                      <span style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: 0.5, color: task.done ? "#c4bdb4" : pColor[task.priority], border: "1.5px solid " + (task.done ? "#eee" : pColor[task.priority]), padding: "3px 8px", borderRadius: 5, flexShrink: 0, marginTop: 2 }}>
                        {task.done ? "DONE" : (task.text.startsWith("⚡") ? "⚡" : pLabel[task.priority])}
                      </span>
                      <button className="del" onClick={e => { e.stopPropagation(); deleteTask(activeCategory, activeTf, task.id); }}>×</button>
                    </div>
                  ))
                }
              </div>

              <div style={{ padding: "0 4px 16px" }}>
                {adding
                  ? <div className="up" style={{ marginTop: 10, padding: 14, background: "#fdfaf6", borderRadius: 10, border: "1px solid #f0ebe3" }}>
                    <input className="inp" autoFocus placeholder="Describe this task clearly..."
                      value={newText} onChange={e => setNewText(e.target.value)} onKeyDown={e => e.key === "Enter" && addTask()} />
                    <div style={{ display: "flex", gap: 6, marginTop: 10, alignItems: "center", flexWrap: "wrap" }}>
                      <span style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: 12, color: "#a1a1aa", fontWeight: 500, letterSpacing: 2 }}>PRIORITY:</span>
                      {["high", "medium", "low"].map(p => (
                        <button key={p} className="chip" onClick={() => setNewPri(p)}
                          style={{ color: newPri === p ? "#fff" : pColor[p], borderColor: pColor[p], background: newPri === p ? pColor[p] : "transparent" }}>
                          {p.toUpperCase()}
                        </button>
                      ))}
                      <div style={{ flex: 1 }} />
                      <button className="btn" onClick={addTask} style={{ background: cat.color, color: "#fff" }}>Add</button>
                      <button className="btn" onClick={() => { setAdding(false); setNewText(""); }} style={{ background: "#f5f2ed", color: "#999", border: "1px solid #e0d9ce" }}>Cancel</button>
                    </div>
                  </div>
                  : <button className="ghost" onClick={() => setAdding(true)}>+ Add Task · {activeTf}</button>
                }
              </div>
            </div>}

            {/* ── AI PANEL ── */}
            {aiOpen && activeCategory !== "history" && (
              <div className="up" style={{ marginTop: 18 }}>
                {aiLoading
                  ? <div className="card" style={{ padding: 32, textAlign: "center" }}>
                    <div className="pulse" style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: 14, fontWeight: 700, color: "#1c3d2e", letterSpacing: 1 }}>✦ Analyzing your trends...</div>
                    <div style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: 13, fontWeight: 500, color: "#a1a1aa", marginTop: 8 }}>Generating SMART goals and coaching insights</div>
                  </div>
                  : aiError
                    ? <div className="card" style={{ padding: 20 }}>
                      <p style={{ color: "#dc2626", fontFamily: "'Nunito Sans', sans-serif", fontSize: 12 }}>{aiError}</p>
                      <button className="btn" onClick={runAI} style={{ marginTop: 12, background: "#1c3d2e", color: "#fff" }}>Retry</button>
                    </div>
                    : aiResult && (
                      <div>
                        <div style={{ background: "linear-gradient(135deg,#1c3d2e 0%,#1e3a5f 100%)", borderRadius: 14, padding: 22, color: "#fff" }}>
                          <div style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: 11, letterSpacing: 2, fontWeight: 700, color: "#86efac", textTransform: "uppercase", marginBottom: 12 }}>✦ AI Trend Analysis</div>
                          <p style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: 15, fontWeight: 400, lineHeight: 1.75, color: "#e2f4ec", marginBottom: 18 }}>{aiResult.trendSummary}</p>
                          <div style={{ background: "rgba(255,255,255,.1)", borderRadius: 9, padding: 14, marginBottom: 16 }}>
                            <div style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: 11, letterSpacing: 1.5, fontWeight: 700, color: "#fcd34d", marginBottom: 8 }}>COACHING INSIGHT</div>
                            <p style={{ fontFamily: "'Fraunces', Georgia, serif", fontStyle: "italic", fontSize: 15, lineHeight: 1.8, color: "#fef9c3" }}>{aiResult.coachingInsight}</p>
                          </div>
                          {aiResult.confidenceScore !== undefined && (
                            <div>
                              <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <span style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: 11, letterSpacing: 1.5, fontWeight: 700, color: "#86efac" }}>CONFIDENCE TRAJECTORY</span>
                                <span style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: 11, color: "#fff" }}>{aiResult.confidenceScore}/100</span>
                              </div>
                              <div className="conf-bar"><div className="conf-fill" style={{ width: aiResult.confidenceScore + "%" }} /></div>
                              <div style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: 12, fontWeight: 500, color: "#a7f3d0" }}>{aiResult.confidenceNote}</div>
                            </div>
                          )}
                        </div>

                        {aiResult.smartGoals?.length > 0 && (
                          <div className="card" style={{ padding: 20, marginTop: 14 }}>
                            <div style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: 2, color: "#1c3d2e", textTransform: "uppercase", marginBottom: 16 }}>✦ AI-Generated SMART Goals</div>
                            {aiResult.smartGoals.map((g, i) => (
                              <div key={i} style={{ background: catLightBg[g.category] || "#faf8f4", borderRadius: 10, padding: "14px 16px", marginBottom: 10, borderLeft: "4px solid " + (catBorderColors[g.category] || "#ccc") }}>
                                <div style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: catBorderColors[g.category], textTransform: "uppercase", marginBottom: 7 }}>
                                  {goals[g.category]?.icon} {g.category} · {g.timeframe}
                                </div>
                                <div style={{ fontSize: 15, fontFamily: "'Nunito Sans', sans-serif", fontWeight: 700, color: "#18181b", marginBottom: 5 }}>{g.goal}</div>
                                <div style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: 13, fontWeight: 500, color: "#71717a" }}>{g.why}</div>
                              </div>
                            ))}
                          </div>
                        )}

                        {aiResult.next24Hours && (
                          <div style={{ background: "#fef9ec", border: "1.5px solid #fcd34d", borderRadius: 10, padding: "14px 16px", marginTop: 14 }}>
                            <div style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: 2, color: "#92400e", textTransform: "uppercase", marginBottom: 8 }}>⚡ Next 24-Hour Action</div>
                            <div style={{ fontSize: 16, fontFamily: "'Nunito Sans', sans-serif", fontWeight: 700, color: "#78350f" }}>{aiResult.next24Hours}</div>
                          </div>
                        )}
                      </div>
                    )
                }
              </div>
            )}

          {/* ── CATEGORY PANELS ── */}
          {activeCategory === "work" && (
            <div className="up" style={{ marginTop: 0 }}>

              {/* Win Log */}
              <div className="card" style={{ padding: 24, marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
                  <div>
                    <div style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: 2, color: "#2d6a4f", textTransform: "uppercase", marginBottom: 4 }}>🏆 Win Log</div>
                    <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 20, fontWeight: 700, color: "#18181b" }}>Record Every Win</div>
                    <div style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: 13, color: "#71717a", marginTop: 2 }}>Confidence is built on evidence. Log what you did right.</div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                  <input className="inp" placeholder="What did you accomplish today? Be specific." value={newWin} onChange={e => setNewWin(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter" && newWin.trim()) { const w = { id: Date.now(), text: newWin.trim(), date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }) }; setWins(p => [w, ...p].slice(0, 30)); setNewWin(""); } }} />
                  <button className="btn" onClick={() => { if (!newWin.trim()) return; const w = { id: Date.now(), text: newWin.trim(), date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }) }; setWins(p => [w, ...p].slice(0, 30)); addHistory("win", "Win logged", newWin.trim(), "work"); setNewWin(""); }} style={{ background: "#1c3d2e", color: "#fff", whiteSpace: "nowrap" }}>Log It</button>
                </div>
                {wins.length === 0
                  ? <div style={{ padding: "16px 0", fontFamily: "'Nunito Sans', sans-serif", fontSize: 13, color: "#a1a1aa", textAlign: "center" }}>No wins logged yet. Start today — even small ones count.</div>
                  : <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 10 }}>
                      {(Array.isArray(wins) ? wins : []).slice(0, 9).map(w => (
                        <div key={w.id} style={{ background: "#f0f7f3", borderRadius: 10, padding: "12px 14px", borderLeft: "3px solid #2d6a4f" }}>
                          <div style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: 11, fontWeight: 700, color: "#2d6a4f", marginBottom: 4 }}>{w.date}</div>
                          <div style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: 14, fontWeight: 500, color: "#18181b", lineHeight: 1.5 }}>{w.text}</div>
                        </div>
                      ))}
                    </div>
                }
              </div>

              {/* Projects + Output Rating */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>

                {/* Project Tracker */}
                <div className="card" style={{ padding: 22 }}>
                  <div style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: 2, color: "#2d6a4f", textTransform: "uppercase", marginBottom: 4 }}>📋 Projects</div>
                  <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 18, fontWeight: 700, color: "#18181b", marginBottom: 14 }}>Active Work</div>
                  {(Array.isArray(projects) ? projects : []).map(p => (
                    <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: "1px solid #f0ebe3" }}>
                      <select value={p.status} onChange={e => setProjects(prev => prev.map(x => x.id === p.id ? { ...x, status: e.target.value } : x))}
                        style={{ border: "none", background: p.status === "done" ? "#f0fdf4" : p.status === "blocked" ? "#fef2f2" : "#fdf9ec", color: p.status === "done" ? "#16a34a" : p.status === "blocked" ? "#dc2626" : "#d97706", fontFamily: "'Nunito Sans', sans-serif", fontSize: 11, fontWeight: 700, borderRadius: 6, padding: "4px 8px", cursor: "pointer", outline: "none" }}>
                        <option value="in-progress">In Progress</option>
                        <option value="blocked">Blocked</option>
                        <option value="done">Done</option>
                        <option value="not-started">Not Started</option>
                      </select>
                      <span style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: 14, fontWeight: 500, color: "#3f3f46", flex: 1 }}>{p.name}</span>
                      <button className="del" onClick={() => setProjects(prev => prev.filter(x => x.id !== p.id))}>×</button>
                    </div>
                  ))}
                  {showAddProject
                    ? <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
                        <input className="inp" placeholder="Project name" value={newProject} onChange={e => setNewProject(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && newProject.trim()) { setProjects(p => [...p, { id: Date.now(), name: newProject.trim(), status: "not-started", priority: "medium" }]); setNewProject(""); setShowAddProject(false); }}} />
                        <button className="btn" onClick={() => { if (!newProject.trim()) return; setProjects(p => [...p, { id: Date.now(), name: newProject.trim(), status: "not-started", priority: "medium" }]); setNewProject(""); setShowAddProject(false); }} style={{ background: "#1c3d2e", color: "#fff" }}>Add</button>
                      </div>
                    : <button className="ghost" onClick={() => setShowAddProject(true)} style={{ marginTop: 10 }}>+ Add Project</button>
                  }
                </div>

                {/* Weekly Output Rating */}
                <div className="card" style={{ padding: 22 }}>
                  <div style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: 2, color: "#2d6a4f", textTransform: "uppercase", marginBottom: 4 }}>📊 Self-Rating</div>
                  <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 18, fontWeight: 700, color: "#18181b", marginBottom: 6 }}>This Week's Output</div>
                  <div style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: 13, color: "#71717a", marginBottom: 16 }}>How would you rate your focus and output? Be honest.</div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    {[1,2,3,4,5,6,7,8,9,10].map(n => (
                      <button key={n} onClick={() => setOutputRating(n)}
                        style={{ width: "clamp(28px,8vw,34px)", height: "clamp(28px,8vw,34px)", borderRadius: "50%", border: "2px solid " + (outputRating >= n ? "#1c3d2e" : "#e8e0d4"), background: outputRating >= n ? "#1c3d2e" : "transparent", color: outputRating >= n ? "#fff" : "#a1a1aa", fontFamily: "'Nunito Sans', sans-serif", fontSize: 12, fontWeight: 700, cursor: "pointer", transition: "all .15s" }}>
                        {n}
                      </button>
                    ))}
                  </div>
                  <div style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: 13, color: outputRating >= 7 ? "#16a34a" : outputRating >= 4 ? "#d97706" : outputRating > 0 ? "#dc2626" : "#a1a1aa", fontWeight: 600, textAlign: "center", marginTop: 8 }}>
                    {outputRating === 0 ? "Tap to rate" : outputRating >= 8 ? "Strong week. Build on this." : outputRating >= 6 ? "Solid. Identify one thing to sharpen." : outputRating >= 4 ? "Room to grow. What held you back?" : "Tough week. What one thing would have changed it?"}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeCategory === "personal" && (
            <div className="up" style={{ marginTop: 0 }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>

                {/* Habit Streaks */}
                <div className="card" style={{ padding: 22 }}>
                  <div style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: 2, color: "#c2700f", textTransform: "uppercase", marginBottom: 4 }}>🔥 Habit Streaks</div>
                  <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 20, fontWeight: 700, color: "#18181b", marginBottom: 4 }}>Daily Non-Negotiables</div>
                  <div style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: 13, color: "#71717a", marginBottom: 18 }}>Tap to mark done. Streaks reset at midnight.</div>
                  {(Array.isArray(habits) ? habits : []).map(h => (
                    <div key={h.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: "1px solid #f0ebe3" }}>
                      <button onClick={() => { const going = !h.todayDone; setHabits(prev => prev.map(x => x.id === h.id ? { ...x, todayDone: going, streak: going ? x.streak + 1 : Math.max(0, x.streak - 1) } : x)); if (going) addHistory("habit", h.name + " completed", "Streak: " + (h.streak + 1) + " days", "personal"); }}
                        style={{ width: 36, height: 36, borderRadius: "50%", border: "2px solid " + (h.todayDone ? "#16a34a" : "#e8e0d4"), background: h.todayDone ? "#16a34a" : "transparent", fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all .2s", flexShrink: 0 }}>
                        {h.todayDone ? "✓" : h.icon}
                      </button>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: 15, fontWeight: 600, color: h.todayDone ? "#16a34a" : "#18181b" }}>{h.name}</div>
                        <div style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: 12, color: "#a1a1aa", marginTop: 1 }}>{h.streak} day streak</div>
                      </div>
                      <div style={{ display: "flex", gap: 3 }}>
                        {[...Array(7)].map((_, i) => (
                          <div key={i} style={{ width: 8, height: 24, borderRadius: 3, background: i < (h.streak % 7 || (h.streak > 0 ? 7 : 0)) ? "#c2700f" : "#f0ebe3" }} />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Confidence Log */}
                <div className="card" style={{ padding: 22 }}>
                  <div style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: 2, color: "#c2700f", textTransform: "uppercase", marginBottom: 4 }}>💪 Confidence Tracker</div>
                  <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 20, fontWeight: 700, color: "#18181b", marginBottom: 4 }}>How Do You Feel Today?</div>
                  <div style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: 13, color: "#71717a", marginBottom: 16 }}>Rate your confidence daily. Watch the pattern build.</div>
                  <div style={{ display: "flex", gap: 6, justifyContent: "space-between", marginBottom: 16 }}>
                    {[1,2,3,4,5,6,7,8,9,10].map(n => (
                      <button key={n} onClick={() => setTodayConfidence(n)}
                        style={{ flex: 1, paddingTop: "100%", position: "relative", borderRadius: 6, border: "2px solid " + (todayConfidence === n ? "#c2700f" : "#e8e0d4"), background: todayConfidence === n ? "#c2700f" : todayConfidence > 0 && n <= todayConfidence ? "#fdf4ec" : "transparent", cursor: "pointer", transition: "all .15s" }}>
                        <span style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Nunito Sans', sans-serif", fontSize: 12, fontWeight: 700, color: todayConfidence === n ? "#fff" : "#a1a1aa" }}>{n}</span>
                      </button>
                    ))}
                  </div>
                  <button className="btn" disabled={todayConfidence === 0} onClick={() => { if (todayConfidence === 0) return; const entry = { id: Date.now(), score: todayConfidence, date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }) }; setConfidenceLog(p => [entry, ...p].slice(0, 30)); addHistory("confidence", "Confidence score: " + todayConfidence + "/10", todayConfidence >= 7 ? "Feeling strong" : todayConfidence >= 5 ? "Getting there" : "Tough day — noted", "personal"); setTodayConfidence(0); setSavedToast(true); setTimeout(() => setSavedToast(false), 3000); }} style={{ width: "100%", background: "#7c3d00", color: "#fff", opacity: todayConfidence === 0 ? 0.4 : 1 }}>
                    Save Today's Score
                  </button>
                  {confidenceLog.length > 0 && (
                    <div style={{ marginTop: 16 }}>
                      <div style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: 11, fontWeight: 700, color: "#a1a1aa", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 10 }}>Last 7 Days</div>
                      <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 50 }}>
                        {confidenceLog.slice(0, 7).reverse().map(e => (
                          <div key={e.id} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                            <div style={{ width: "100%", borderRadius: 4, background: e.score >= 7 ? "#16a34a" : e.score >= 5 ? "#c2700f" : "#dc2626", height: (e.score / 10) * 44 + "px", transition: "height .4s ease" }} />
                            <div style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: 9, color: "#a1a1aa" }}>{e.score}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeCategory === "financial" && (
            <div className="up" style={{ marginTop: 0 }}>

              {/* Budget Builder */}
              <div className="card" style={{ padding: 24, marginBottom: 16 }}>
                <div style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: 2, color: "#2563eb", textTransform: "uppercase", marginBottom: 4 }}>💰 Budget Builder</div>
                <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 22, fontWeight: 700, color: "#18181b", marginBottom: 4 }}>Your Monthly Numbers</div>
                <div style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: 13, color: "#71717a", marginBottom: 20 }}>Know your numbers exactly. No guessing. No avoiding.</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12, marginBottom: 20 }}>
                  {[
                    { key: "income", label: "Monthly Take-Home Income", placeholder: "e.g. 4800", color: "#16a34a", prefix: "+" },
                    { key: "fixedCosts", label: "Fixed Costs (rent, car, bills)", placeholder: "e.g. 2400", color: "#dc2626", prefix: "-" },
                    { key: "variableCosts", label: "Variable Costs (food, gas, misc)", placeholder: "e.g. 800", color: "#d97706", prefix: "-" },
                    { key: "stabilityTarget", label: "Monthly Stability Target Needed", placeholder: "e.g. 5500", color: "#2563eb", prefix: "🎯" },
                  ].map(field => (
                    <div key={field.key} style={{ background: "#faf8f4", borderRadius: 10, padding: "14px 16px", border: "1.5px solid #f0ebe3" }}>
                      <div style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: 11, fontWeight: 700, color: "#71717a", marginBottom: 8 }}>{field.prefix} {field.label}</div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: 18, fontWeight: 700, color: field.color }}>$</span>
                        <input className="inp" type="number" placeholder={field.placeholder} value={budget[field.key]} onChange={e => setBudget(p => ({ ...p, [field.key]: e.target.value }))} onBlur={e => { if (e.target.value) addHistory("budget", "Budget updated: " + field.label, "$" + e.target.value, "financial"); }}
                          style={{ border: "none", background: "transparent", padding: 0, fontSize: 22, fontWeight: 700, color: field.color, width: "100%" }} />
                      </div>
                    </div>
                  ))}
                </div>
                {budget.income && budget.fixedCosts && budget.variableCosts && (() => {
                  const inc = parseFloat(budget.income) || 0;
                  const fix = parseFloat(budget.fixedCosts) || 0;
                  const vari = parseFloat(budget.variableCosts) || 0;
                  const target = parseFloat(budget.stabilityTarget) || 0;
                  const gap = inc - fix - vari;
                  const deficit = target - inc;
                  return (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12 }}>
                      <div style={{ background: gap >= 0 ? "#f0fdf4" : "#fef2f2", borderRadius: 10, padding: "16px", border: "1.5px solid " + (gap >= 0 ? "#bbf7d0" : "#fecaca") }}>
                        <div style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: 11, fontWeight: 700, color: gap >= 0 ? "#16a34a" : "#dc2626", marginBottom: 4 }}>MONTHLY GAP</div>
                        <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 26, fontWeight: 900, color: gap >= 0 ? "#16a34a" : "#dc2626" }}>${Math.abs(gap).toLocaleString()}</div>
                        <div style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: 12, color: gap >= 0 ? "#16a34a" : "#dc2626", fontWeight: 600 }}>{gap >= 0 ? "left over each month" : "shortfall each month"}</div>
                      </div>
                      {target > 0 && (
                        <div style={{ background: deficit <= 0 ? "#f0fdf4" : "#fef9ec", borderRadius: 10, padding: "16px", border: "1.5px solid " + (deficit <= 0 ? "#bbf7d0" : "#fcd34d") }}>
                          <div style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: 11, fontWeight: 700, color: deficit <= 0 ? "#16a34a" : "#d97706", marginBottom: 4 }}>STABILITY GAP</div>
                          <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 26, fontWeight: 900, color: deficit <= 0 ? "#16a34a" : "#d97706" }}>{deficit <= 0 ? "✓" : "$" + deficit.toLocaleString()}</div>
                          <div style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: 12, color: deficit <= 0 ? "#16a34a" : "#d97706", fontWeight: 600 }}>{deficit <= 0 ? "You have reached your target" : "needed to reach your target"}</div>
                        </div>
                      )}
                      <div style={{ background: "#f0f4ff", borderRadius: 10, padding: "16px", border: "1.5px solid #bfdbfe" }}>
                        <div style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: 11, fontWeight: 700, color: "#2563eb", marginBottom: 4 }}>NEEDS RATIO</div>
                        <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 26, fontWeight: 900, color: "#2563eb" }}>{inc > 0 ? Math.round(((fix + vari) / inc) * 100) : 0}%</div>
                        <div style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: 12, color: "#2563eb", fontWeight: 600 }}>of income on needs (target &lt;80%)</div>
                      </div>
                    </div>
                  );
                })()}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16, marginBottom: 16 }}>

                {/* Savings Goals */}
                <div className="card" style={{ padding: 22 }}>
                  <div style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: 2, color: "#2563eb", textTransform: "uppercase", marginBottom: 4 }}>🎯 Savings Goals</div>
                  <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 20, fontWeight: 700, color: "#18181b", marginBottom: 18 }}>Building Your Floor</div>
                  {(Array.isArray(savingsGoals) ? savingsGoals : []).map(g => {
                    const pct = g.target > 0 ? Math.min(100, Math.round((g.current / g.target) * 100)) : 0;
                    return (
                      <div key={g.id} style={{ marginBottom: 16 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                          <span style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: 14, fontWeight: 600, color: "#18181b" }}>{g.name}</span>
                          <span style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: 13, fontWeight: 700, color: g.color }}>{pct}%</span>
                        </div>
                        <div className="pbar" style={{ height: 10, marginBottom: 4 }}>
                          <div className="pfill" style={{ width: pct + "%", background: g.color }} />
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                            <span style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: 12, color: "#71717a" }}>${(g.current || 0).toLocaleString()} of ${(g.target || 0).toLocaleString()}</span>
                          </div>
                          <div style={{ display: "flex", gap: 4 }}>
                            <input type="number" placeholder="Update $" onChange={e => { const v = parseFloat(e.target.value); if (!isNaN(v)) setSavingsGoals(p => p.map(x => x.id === g.id ? { ...x, current: v } : x)); }} style={{ width: 80, border: "1px solid #e8e0d4", borderRadius: 6, padding: "3px 8px", fontFamily: "'Nunito Sans', sans-serif", fontSize: 12, outline: "none" }} />
                            <button className="del" onClick={() => setSavingsGoals(p => p.filter(x => x.id !== g.id))}>×</button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {showAddSaving
                    ? <div style={{ background: "#faf8f4", borderRadius: 10, padding: 14, marginTop: 10 }}>
                        <input className="inp" placeholder="Goal name (e.g. Vacation fund)" value={newSaving.name} onChange={e => setNewSaving(p => ({ ...p, name: e.target.value }))} style={{ marginBottom: 8 }} />
                        <div style={{ display: "flex", gap: 8 }}>
                          <input className="inp" type="number" placeholder="Target $" value={newSaving.target} onChange={e => setNewSaving(p => ({ ...p, target: e.target.value }))} />
                          <input className="inp" type="number" placeholder="Current $" value={newSaving.current} onChange={e => setNewSaving(p => ({ ...p, current: e.target.value }))} />
                        </div>
                        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                          <button className="btn" onClick={() => { if (!newSaving.name || !newSaving.target) return; const sg = { id: Date.now(), name: newSaving.name, target: parseFloat(newSaving.target) || 0, current: parseFloat(newSaving.current) || 0, color: "#1e3a5f" }; setSavingsGoals(p => [...p, sg]); addHistory("savings", "Savings goal created: " + newSaving.name, "Target: $" + newSaving.target, "financial"); setNewSaving({ name: "", target: "", current: "" }); setShowAddSaving(false); }} style={{ background: "#1e3a5f", color: "#fff" }}>Add Goal</button>
                          <button className="btn" onClick={() => setShowAddSaving(false)} style={{ background: "#f5f2ed", color: "#888", border: "1px solid #e0d9ce" }}>Cancel</button>
                        </div>
                      </div>
                    : <button className="ghost" onClick={() => setShowAddSaving(true)}>+ Add Savings Goal</button>
                  }
                </div>

                {/* Debt Tracker */}
                <div className="card" style={{ padding: 22 }}>
                  <div style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: 2, color: "#dc2626", textTransform: "uppercase", marginBottom: 4 }}>⚔️ Debt Tracker</div>
                  <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 20, fontWeight: 700, color: "#18181b", marginBottom: 4 }}>Know What You Owe</div>
                  <div style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: 13, color: "#71717a", marginBottom: 18 }}>List every debt. Visibility removes the anxiety.</div>
                  {debts.length > 0 && (
                    <div style={{ marginBottom: 14 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                        <span style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: 11, fontWeight: 700, color: "#71717a" }}>Total Debt:</span>
                        <span style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 18, fontWeight: 700, color: "#dc2626" }}>${debts.reduce((s, d) => s + (parseFloat(d.balance) || 0), 0).toLocaleString()}</span>
                      </div>
                    </div>
                  )}
                  {(Array.isArray(debts) ? debts : []).map(d => (
                    <div key={d.id} style={{ background: "#fef2f2", borderRadius: 10, padding: "12px 14px", marginBottom: 10, border: "1px solid #fecaca" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                        <span style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: 14, fontWeight: 700, color: "#18181b" }}>{d.name}</span>
                        <button className="del" onClick={() => setDebts(p => p.filter(x => x.id !== d.id))}>×</button>
                      </div>
                      <div style={{ display: "flex", gap: 12 }}>
                        <div><div style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: 10, fontWeight: 700, color: "#dc2626", marginBottom: 2 }}>BALANCE</div><div style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: 15, fontWeight: 700, color: "#dc2626" }}>${parseFloat(d.balance || 0).toLocaleString()}</div></div>
                        {d.minPayment && <div><div style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: 10, fontWeight: 700, color: "#71717a", marginBottom: 2 }}>MIN/MO</div><div style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: 15, fontWeight: 600, color: "#3f3f46" }}>${d.minPayment}</div></div>}
                        {d.rate && <div><div style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: 10, fontWeight: 700, color: "#71717a", marginBottom: 2 }}>APR</div><div style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: 15, fontWeight: 600, color: "#3f3f46" }}>{d.rate}%</div></div>}
                      </div>
                    </div>
                  ))}
                  {showAddDebt
                    ? <div style={{ background: "#faf8f4", borderRadius: 10, padding: 14, marginTop: 10 }}>
                        <input className="inp" placeholder="Debt name (e.g. Credit Card)" value={newDebt.name} onChange={e => setNewDebt(p => ({ ...p, name: e.target.value }))} style={{ marginBottom: 8 }} />
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 8 }}>
                          <input className="inp" type="number" placeholder="Balance $" value={newDebt.balance} onChange={e => setNewDebt(p => ({ ...p, balance: e.target.value }))} />
                          <input className="inp" type="number" placeholder="Min/mo $" value={newDebt.minPayment} onChange={e => setNewDebt(p => ({ ...p, minPayment: e.target.value }))} />
                          <input className="inp" type="number" placeholder="Rate %" value={newDebt.rate} onChange={e => setNewDebt(p => ({ ...p, rate: e.target.value }))} />
                        </div>
                        <div style={{ display: "flex", gap: 8 }}>
                          <button className="btn" onClick={() => { if (!newDebt.name) return; setDebts(p => [...p, { id: Date.now(), ...newDebt }]); addHistory("debt", "Debt added: " + newDebt.name, "Balance: $" + (newDebt.balance || "0") + (newDebt.rate ? " @ " + newDebt.rate + "%" : ""), "financial"); setNewDebt({ name: "", balance: "", minPayment: "", rate: "" }); setShowAddDebt(false); }} style={{ background: "#dc2626", color: "#fff" }}>Add Debt</button>
                          <button className="btn" onClick={() => setShowAddDebt(false)} style={{ background: "#f5f2ed", color: "#888", border: "1px solid #e0d9ce" }}>Cancel</button>
                        </div>
                      </div>
                    : <button className="ghost" onClick={() => setShowAddDebt(true)}>+ Add Debt</button>
                  }
                </div>
              </div>

              {/* Financial Education */}
              <div className="card" style={{ padding: 24 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                  <div>
                    <div style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: 2, color: "#2563eb", textTransform: "uppercase", marginBottom: 4 }}>📖 Financial Education</div>
                    <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 22, fontWeight: 700, color: "#18181b" }}>Learn Something Today</div>
                    <div style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: 13, color: "#71717a", marginTop: 2 }}>12 lessons covering budgeting, debt, savings, income, and investing.</div>
                  </div>
                  <div style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: 12, fontWeight: 700, color: "#a1a1aa" }}>{eduIndex + 1} / {FIN_ED.length}</div>
                </div>
                <div style={{ background: "linear-gradient(135deg, #1e3a5f 0%, #1c3d2e 100%)", borderRadius: 14, padding: "24px 26px", marginBottom: 16 }}>
                  <div style={{ display: "inline-block", background: "rgba(255,255,255,.15)", borderRadius: 20, padding: "4px 14px", fontFamily: "'Nunito Sans', sans-serif", fontSize: 11, fontWeight: 700, color: "#93c5fd", letterSpacing: 1, textTransform: "uppercase", marginBottom: 14 }}>
                    {FIN_ED[eduIndex].tag}
                  </div>
                  <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 20, fontWeight: 700, color: "#fff", marginBottom: 12, lineHeight: 1.3 }}>{FIN_ED[eduIndex].title}</div>
                  <p style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: 15, lineHeight: 1.75, color: "#bfdbfe", marginBottom: 16 }}>{FIN_ED[eduIndex].body}</p>
                  <div style={{ borderTop: "1px solid rgba(255,255,255,.15)", paddingTop: 14 }}>
                    <div style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: 11, fontWeight: 700, color: "#fcd34d", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 6 }}>⚡ Action Step</div>
                    <div style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: 14, fontWeight: 600, color: "#fef9c3", lineHeight: 1.5 }}>{FIN_ED[eduIndex].action}</div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <button className="btn" onClick={() => setEduIndex(p => p > 0 ? p - 1 : FIN_ED.length - 1)} style={{ background: "#f5f2ed", color: "#3f3f46", border: "1.5px solid #e8e0d4" }}>← Previous</button>
                  <button className="btn" onClick={() => setEduIndex(p => (p + 1) % FIN_ED.length)} style={{ flex: 1, background: "#1e3a5f", color: "#fff" }}>Next Lesson →</button>
                </div>
              </div>

            </div>
          )}

          </div>

          {/* ── HISTORY PANEL ── */}
          {activeCategory === "history" && (
            <div className="up" style={{ marginTop: 0 }}>

              {/* Stats row */}
              {(() => {
                const typeColors = { task_complete: "#16a34a", task_note: "#16a34a", task_uncomplete: "#a1a1aa", checkin: "#2563eb", win: "#b8945a", confidence: "#c2700f", habit: "#7c3d00", budget: "#1e3a5f", savings: "#1c3d2e", debt: "#dc2626" };
                const typeCounts = historyLog.reduce((acc, e) => { acc[e.type] = (acc[e.type] || 0) + 1; return acc; }, {});
                const completed = historyLog.filter(e => e.type === "task_complete" || e.type === "task_note").length;
                const checkins = historyLog.filter(e => e.type === "checkin").length;
                const winsCount = historyLog.filter(e => e.type === "win").length;
                const habits = historyLog.filter(e => e.type === "habit").length;
                return (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: 10, marginBottom: 18 }}>
                    {[
                      { label: "Tasks Completed", value: completed, icon: "✅", color: "#16a34a", bg: "#f0fdf4" },
                      { label: "Check-Ins Done", value: checkins, icon: "📋", color: "#2563eb", bg: "#eff4fc" },
                      { label: "Wins Logged", value: winsCount, icon: "🏆", color: "#b8945a", bg: "#fdf9f3" },
                      { label: "Habits Completed", value: habits, icon: "🔥", color: "#c2700f", bg: "#fdf4ec" },
                      { label: "Total Entries", value: historyLog.length, icon: "📊", color: "#3f3f46", bg: "#f7f4ef" },
                    ].map((stat, i) => (
                      <div key={i} className="card" style={{ padding: "14px 16px", background: stat.bg, border: "1.5px solid " + stat.color + "30" }}>
                        <div style={{ fontSize: 22, marginBottom: 6 }}>{stat.icon}</div>
                        <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 22, fontWeight: 900, color: stat.color }}>{stat.value}</div>
                        <div style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: 11, fontWeight: 700, color: "#71717a", marginTop: 2 }}>{stat.label}</div>
                      </div>
                    ))}
                  </div>
                );
              })()}

              {/* Filter + Timeline */}
              <div className="card" style={{ padding: "clamp(16px,3vw,22px)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, marginBottom: 18 }}>
                  <div>
                    <div style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: 2, color: "#a1a1aa", textTransform: "uppercase", marginBottom: 4 }}>📋 Full History</div>
                    <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 20, fontWeight: 700, color: "#18181b" }}>Your Activity Timeline</div>
                  </div>
                  {historyLog.length > 0 && (
                    <button className="btn" onClick={() => { if (window.confirm("Clear all history? This cannot be undone.")) { setHistoryLog([]); persist("lcd_history", []); } }} style={{ background: "#fef2f2", color: "#dc2626", border: "1.5px solid #fecaca", fontSize: 12 }}>
                      Clear History
                    </button>
                  )}
                </div>

                {/* Filter chips */}
                <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 8, marginBottom: 16, WebkitOverflowScrolling: "touch" }}>
                  {[
                    { key: "all", label: "All", color: "#3f3f46" },
                    { key: "task_complete", label: "✅ Tasks", color: "#16a34a" },
                    { key: "checkin", label: "📋 Check-Ins", color: "#2563eb" },
                    { key: "win", label: "🏆 Wins", color: "#b8945a" },
                    { key: "confidence", label: "💪 Confidence", color: "#c2700f" },
                    { key: "habit", label: "🔥 Habits", color: "#7c3d00" },
                    { key: "financial", label: "📈 Financial", color: "#1e3a5f" },
                  ].map(f => (
                    <button key={f.key} onClick={() => setHistoryFilter(f.key)}
                      style={{ border: "1.5px solid " + (historyFilter === f.key ? f.color : "#e8e0d4"), background: historyFilter === f.key ? f.color : "transparent", color: historyFilter === f.key ? "#fff" : "#71717a", fontFamily: "'Nunito Sans', sans-serif", fontSize: 12, fontWeight: 700, padding: "6px 14px", borderRadius: 20, cursor: "pointer", whiteSpace: "nowrap", transition: "all .15s" }}>
                      {f.label}
                    </button>
                  ))}
                </div>

                {/* Timeline entries */}
                {(() => {
                  const typeColors = { task_complete: "#16a34a", task_note: "#16a34a", task_uncomplete: "#a1a1aa", checkin: "#2563eb", win: "#b8945a", confidence: "#c2700f", habit: "#7c3d00", budget: "#1e3a5f", savings: "#1c3d2e", debt: "#dc2626" };
                  const typeLabels = { task_complete: "Task Done", task_note: "Task + Note", task_uncomplete: "Unchecked", checkin: "Check-In", win: "Win", confidence: "Confidence", habit: "Habit", budget: "Budget", savings: "Savings", debt: "Debt" };
                  const catColors = { work: "#1c3d2e", personal: "#7c3d00", financial: "#1e3a5f", all: "#3f3f46" };
                  const filtered = historyFilter === "all" ? historyLog
                    : historyFilter === "financial" ? historyLog.filter(e => ["budget","savings","debt"].includes(e.type))
                    : historyLog.filter(e => e.type === historyFilter || e.type === historyFilter.replace("task_complete", "task_note"));

                  if (filtered.length === 0) return (
                    <div style={{ padding: "40px 0", textAlign: "center" }}>
                      <div style={{ fontSize: 32, marginBottom: 12 }}>📭</div>
                      <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 18, fontWeight: 700, color: "#3f3f46", marginBottom: 6 }}>No history yet</div>
                      <div style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: 14, color: "#a1a1aa" }}>Complete tasks, log check-ins, and record wins — they all show up here.</div>
                    </div>
                  );

                  // Group by date
                  const grouped = filtered.reduce((acc, e) => {
                    const key = e.date || "Unknown";
                    if (!acc[key]) acc[key] = [];
                    acc[key].push(e);
                    return acc;
                  }, {});

                  return Object.entries(grouped).map(([date, entries]) => (
                    <div key={date} style={{ marginBottom: 20 }}>
                      <div style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: 12, fontWeight: 800, color: "#a1a1aa", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 10, paddingBottom: 6, borderBottom: "1px solid #f0ebe3" }}>
                        {date}
                      </div>
                      {entries.map(entry => (
                        <div key={entry.id} style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "10px 0", borderBottom: "1px solid #faf8f4" }}>
                          <div style={{ width: 3, borderRadius: 2, background: typeColors[entry.type] || "#a1a1aa", alignSelf: "stretch", flexShrink: 0, minHeight: 40 }} />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 3 }}>
                              <span style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: 11, fontWeight: 800, color: typeColors[entry.type] || "#a1a1aa", background: (typeColors[entry.type] || "#a1a1aa") + "15", padding: "2px 8px", borderRadius: 10 }}>
                                {typeLabels[entry.type] || entry.type}
                              </span>
                              {entry.category && entry.category !== "all" && (
                                <span style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: 10, fontWeight: 700, color: catColors[entry.category] || "#71717a", border: "1px solid " + (catColors[entry.category] || "#71717a") + "40", padding: "2px 7px", borderRadius: 8, textTransform: "uppercase" }}>
                                  {entry.category}
                                </span>
                              )}
                              <span style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: 11, color: "#a1a1aa", marginLeft: "auto" }}>{entry.time}</span>
                            </div>
                            <div style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: 14, fontWeight: 600, color: "#18181b", lineHeight: 1.4, marginBottom: entry.detail ? 3 : 0 }}>{entry.title}</div>
                            {entry.detail && <div style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: 13, color: "#71717a", lineHeight: 1.5, wordBreak: "break-word" }}>{entry.detail}</div>}
                          </div>
                        </div>
                      ))}
                    </div>
                  ));
                })()}
              </div>
            </div>
          )}

          {/* ── SIDEBAR ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14, minWidth: 0 }}>

            {/* Progress overview */}
            <div className="card" style={{ padding: "18px 16px" }}>
              <div style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: 2, color: "#a1a1aa", textTransform: "uppercase", marginBottom: 16 }}>Progress Overview</div>
              {CATEGORIES.map(c => (
                <div key={c} style={{ marginBottom: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                    <span style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: 13, fontWeight: 600, color: "#3f3f46" }}>{goals[c].icon} {goals[c].label}</span>
                    <div style={{ display: "flex", gap: 8 }}>
                      {TIMEFRAMES.map(tf => (
                        <span key={tf} style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: 11, fontWeight: 700, color: getPct(c, tf) === 100 ? "#16a34a" : "#a1a1aa" }}>{getPct(c, tf)}%</span>
                      ))}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 3 }}>
                    {TIMEFRAMES.map((tf, i) => (
                      <div key={tf} className="pbar" style={{ flex: 1 }}>
                        <div className="pfill" style={{ width: getPct(c, tf) + "%", background: goals[c].color, opacity: 1 - i * 0.25 }} />
                      </div>
                    ))}
                  </div>
                  <div style={{ display: "flex", gap: 3, marginTop: 2 }}>
                    {TIMEFRAMES.map(tf => (
                      <div key={tf} style={{ flex: 1, textAlign: "center", fontFamily: "'Nunito Sans', sans-serif", fontSize: 10, fontWeight: 700, color: "#c4bdb4", letterSpacing: 1 }}>{tf[0].toUpperCase()}</div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Alert schedule */}
            <div className="card" style={{ padding: 18 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <div style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: 2, color: "#a1a1aa", textTransform: "uppercase" }}>Daily Schedule</div>
                <button onClick={() => setShowAlerts(true)} style={{ background: "none", border: "none", fontFamily: "'Nunito Sans', sans-serif", fontSize: 9, color: "#c9a96e", cursor: "pointer", letterSpacing: 1 }}>EDIT →</button>
              </div>
              {alerts.map(a => {
                const today = new Date().toDateString();
                const isDone = completedToday[a.id + "_" + today] === true;
                const isNext = nextAlert && nextAlert.id === a.id;
                return (
                  <div key={a.id} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, padding: "6px 8px", background: isDone ? "#f0fdf4" : isNext ? "#f0f7f3" : "transparent", borderRadius: 7, border: isDone ? "1px solid #bbf7d0" : isNext ? "1px solid #bbf7d0" : "1px solid transparent" }}>
                    <div style={{ width: 7, height: 7, borderRadius: "50%", background: isDone ? "#16a34a" : a.enabled ? (isNext ? "#c9a96e" : "#c9a96e") : "#e0d9ce", flexShrink: 0 }} />
                    <span style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: 10, color: isDone ? "#888" : a.enabled ? "#444" : "#bbb", flex: 1, textDecoration: isDone ? "line-through" : "none" }}>{a.time} · {a.label}</span>
                    {isDone && <span style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: 10, fontWeight: 700, color: "#16a34a", letterSpacing: 0.5 }}>✓ DONE</span>}
                    {!isDone && isNext && <span style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: 10, fontWeight: 700, color: "#b8945a", letterSpacing: 0.5 }}>NEXT</span>}
                  </div>
                );
              })}
            </div>

            {/* Check-in log */}
            {checkInLog.length > 0 && (
              <div className="card" style={{ padding: 18 }}>
                <div style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: 2, color: "#a1a1aa", textTransform: "uppercase", marginBottom: 16 }}>Check-In Log</div>
                {checkInLog.slice(0, 4).map(entry => (
                  <div key={entry.id} style={{ marginBottom: 12, paddingBottom: 12, borderBottom: "1px solid #f0ebe3" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: 12, fontWeight: 700, color: "#b8945a" }}>{entry.label}</span>
                      <span style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: 12, color: "#a1a1aa", fontWeight: 500 }}>{entry.timestamp}</span>
                    </div>
                    <p style={{ fontSize: 14, lineHeight: 1.65, color: "#3f3f46", fontFamily: "'Nunito Sans', sans-serif", fontWeight: 400 }}>{entry.note}</p>
                  </div>
                ))}
                {checkInLog.length > 4 && (
                  <div style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: 12, color: "#a1a1aa", fontWeight: 500, letterSpacing: 1, textAlign: "center" }}>+{checkInLog.length - 4} more entries</div>
                )}
              </div>
            )}

            {/* Calendar card */}
            <div className="card" style={{ padding: 18 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <div style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: 2, color: "#a1a1aa", textTransform: "uppercase" }}>📅 Today</div>
                <button onClick={loadCalendar} style={{ background: "none", border: "none", fontFamily: "'Nunito Sans', sans-serif", fontSize: 12, fontWeight: 700, color: "#1e3a5f", cursor: "pointer", letterSpacing: 1 }}>{calLoading ? "..." : "SYNC →"}</button>
              </div>
              {calError && <div style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: 12, fontWeight: 600, color: "#dc2626", marginBottom: 8 }}>{calError}</div>}
              {calEvents.length === 0 && !calLoading && (
                <div>
                  <div style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: 13, color: "#a1a1aa", fontWeight: 500, marginBottom: 10 }}>Tap SYNC to load your calendar</div>
                  <button className="btn" onClick={addRoutineToCalendar} style={{ width: "100%", background: "#1c3d2e", color: "#fff", fontSize: 9, padding: "8px" }}>+ Add Routine to Calendar</button>
                </div>
              )}
              {calEvents.map((ev, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <div style={{ width: 3, height: 32, borderRadius: 2, background: ev.color || "#c9a96e", flexShrink: 0 }} />
                  <div>
                    <div style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: 13, fontWeight: 600, color: "#18181b" }}>{ev.title}</div>
                    <div style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: 12, color: "#a1a1aa", fontWeight: 500 }}>{ev.start}{ev.end ? " – " + ev.end : ""}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Telegram live coaching card */}
            <div style={{ background: "linear-gradient(135deg,#0088cc,#005fa3)", borderRadius: 12, padding: 18, marginBottom: 0 }}>
              <div style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: 2, color: "#a8d8f0", textTransform: "uppercase", marginBottom: 8 }}>📱 Live Coaching</div>
              <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 17, fontWeight: 700, color: "#fff", marginBottom: 6 }}>Telegram Bot Active</div>
              <p style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: 13, lineHeight: 1.65, color: "#cce8f7", marginBottom: 14 }}>
                Your AI coach sends you 5 touchpoints daily. Gym at 5am, Morning at 8am, Midday at 1pm, Evening at 8pm, Pre-sleep at 10pm.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {[
                  { time: "5:00am", label: "🏋️ Gym Activation" },
                  { time: "8:00am", label: "☀️ Morning Intention" },
                  { time: "1:00pm", label: "⚡ Midday Pulse" },
                  { time: "8:00pm", label: "🌙 Evening Review" },
                  { time: "10:00pm", label: "😴 Pre-Sleep Wind Down" },
                ].map((t, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: 13, color: "#cce8f7" }}>{t.label}</span>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#fff", fontWeight: 600 }}>{t.time}</span>
                  </div>
                ))}
              </div>
              <a href="https://t.me/YourBotUsername" target="_blank" rel="noopener noreferrer"
                style={{ display: "block", marginTop: 14, background: "rgba(255,255,255,0.15)", borderRadius: 8, padding: "10px", textAlign: "center", color: "#fff", fontFamily: "'Nunito Sans', sans-serif", fontSize: 13, fontWeight: 700, textDecoration: "none" }}>
                Open Telegram Bot →
              </a>
            </div>

            {/* Telegram Tasks */}
            <div className="card" style={{ padding: 18 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom: 14 }}>
                <div>
                  <div style={{ fontFamily:"'Nunito Sans',sans-serif", fontSize:11, fontWeight:700, letterSpacing:2, color:"#0088cc", textTransform:"uppercase", marginBottom:3 }}>📱 Telegram Tasks</div>
                  <div style={{ fontFamily:"'Fraunces',Georgia,serif", fontSize:17, fontWeight:700, color:"#18181b" }}>From Your Bot</div>
                </div>
                <button onClick={fetchTelegramTodos} style={{ background:"none", border:"none", fontFamily:"'Nunito Sans',sans-serif", fontSize:10, fontWeight:700, color:"#0088cc", cursor:"pointer", letterSpacing:1 }}>
                  {telegramLoading ? "..." : "REFRESH →"}
                </button>
              </div>
              {telegramTodos.filter(t => !t.done).length === 0 ? (
                <div style={{ fontFamily:"'Nunito Sans',sans-serif", fontSize:13, color:"#a1a1aa", textAlign:"center", padding:"12px 0" }}>
                  No tasks yet. Tell your bot:<br/>
                  <em style={{ fontSize:12 }}>"add [task] to my [category] list"</em>
                </div>
              ) : (
                telegramTodos.filter(t => !t.done).slice(0, 8).map(todo => {
                  const catColors = { work:"#1c3d2e", personal:"#7c3d00", financial:"#1e3a5f", home:"#5b4a00", family:"#6b21a8", health:"#065f46" };
                  const catEmoji = { work:"💼", personal:"🏠", financial:"📈", home:"🏡", family:"👨‍👩‍👦", health:"💪" };
                  const color = catColors[todo.category] || "#3f3f46";
                  return (
                    <div key={todo.id} style={{ display:"flex", alignItems:"flex-start", gap:10, padding:"10px 0", borderBottom:"1px solid #f0ebe3" }}>
                      <button onClick={() => markTelegramTodoDone(todo.id)} style={{ width:20, height:20, borderRadius:"50%", border:"2px solid #d0c9be", background:"transparent", cursor:"pointer", flexShrink:0, marginTop:2, transition:"all .2s" }} />
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontFamily:"'Nunito Sans',sans-serif", fontSize:14, fontWeight:500, color:"#18181b", lineHeight:1.4, wordBreak:"break-word" }}>{todo.text}</div>
                        <div style={{ display:"flex", alignItems:"center", gap:6, marginTop:4 }}>
                          <span style={{ fontFamily:"'Nunito Sans',sans-serif", fontSize:10, fontWeight:700, color:color, border:`1px solid ${color}`, padding:"1px 6px", borderRadius:4 }}>
                            {catEmoji[todo.category]||"📌"} {todo.category}
                          </span>
                          <span style={{ fontFamily:"'Nunito Sans',sans-serif", fontSize:10, color:"#a1a1aa" }}>{todo.date}</span>
                        </div>
                      </div>
                      <button onClick={() => deleteTelegramTodo(todo.id)} style={{ background:"none", border:"none", color:"#ddd", cursor:"pointer", fontSize:16, padding:"0 2px", flexShrink:0 }}>×</button>
                    </div>
                  );
                })
              )}
              {telegramTodos.filter(t => t.done).length > 0 && (
                <div style={{ marginTop:10, paddingTop:10, borderTop:"1px solid #f0ebe3" }}>
                  <div style={{ fontFamily:"'Nunito Sans',sans-serif", fontSize:10, fontWeight:700, color:"#a1a1aa", letterSpacing:1.5, textTransform:"uppercase", marginBottom:6 }}>Completed</div>
                  {telegramTodos.filter(t => t.done).slice(0,3).map(todo => (
                    <div key={todo.id} style={{ fontFamily:"'Nunito Sans',sans-serif", fontSize:13, color:"#a1a1aa", textDecoration:"line-through", padding:"3px 0" }}>
                      {todo.text}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Coach card */}
            <div style={{ background: "linear-gradient(135deg,#1c3d2e,#1a2f4a)", borderRadius: 12, padding: 18 }}>
              <div style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: 2, color: "#86efac", textTransform: "uppercase", marginBottom: 10 }}>Coach's Reminder</div>
              <p style={{ fontFamily: "'Fraunces', Georgia, serif", fontStyle: "italic", fontSize: 15, lineHeight: 1.8, color: "#e2f4ec" }}>
                "You don't need certainty before action. You need the next move. Waiting is also a decision."
              </p>
              <div style={{ borderTop: "1px solid rgba(255,255,255,.1)", marginTop: 12, paddingTop: 12, fontFamily: "'Nunito Sans', sans-serif", fontSize: 11, fontWeight: 700, color: "#86efac", letterSpacing: 1.5, textTransform: "uppercase" }}>
                What are you going to do next?
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── TASK DETAIL MODAL ── */}
      {activeTask && (
        <div className="overlay" onClick={() => { setActiveTask(null); setTaskNote(""); }}>
          <div className="modal up" onClick={e => e.stopPropagation()} style={{ maxWidth: 500 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16, gap: 12 }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <span style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: 1, color: goals[activeTask.cat].color, border: "1.5px solid " + goals[activeTask.cat].color, padding: "4px 10px", borderRadius: 6, textTransform: "uppercase" }}>
                    {goals[activeTask.cat].icon} {activeTask.cat} · {activeTask.tf}
                  </span>
                  <span style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: 11, fontWeight: 700, color: activeTask.task.done ? "#16a34a" : pColor[activeTask.task.priority], border: "1.5px solid " + (activeTask.task.done ? "#16a34a" : pColor[activeTask.task.priority]), padding: "4px 10px", borderRadius: 6 }}>
                    {activeTask.task.done ? "DONE" : pLabel[activeTask.task.priority]}
                  </span>
                </div>
                <h2 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 20, fontWeight: 700, lineHeight: 1.4, color: "#18181b" }}>
                  {activeTask.task.text.replace("⚡ QUICK WIN: ", "")}
                </h2>
              </div>
            </div>

            <div style={{ background: "#faf8f4", borderRadius: 10, padding: 16, marginBottom: 16 }}>
              <div style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: 2, color: "#b8945a", textTransform: "uppercase", marginBottom: 10 }}>
                {activeTask.task.done ? "Your Answer / What You Did" : "Fill This In — Be Specific"}
              </div>
              <textarea
                className="inp"
                autoFocus
                style={{ minHeight: 100, resize: "vertical", fontFamily: "'Nunito Sans', sans-serif", fontSize: 14, lineHeight: 1.6, background: "#fff" }}
                placeholder={
                  activeTask.task.text.includes("monthly number") ? "e.g. We need $5,200/month. Currently bringing in $4,800. Gap = $400." :
                  activeTask.task.text.includes("bank") ? "e.g. Current balance: $1,240. Main concerns: car payment + rent due Friday." :
                  activeTask.task.text.includes("message") ? "e.g. Sent email to manager about project timeline. Waiting on reply." :
                  activeTask.task.text.includes("90 minutes") ? "e.g. Blocked 7–8:30am tomorrow. Calendar blocked. Phone going in the other room." :
                  activeTask.task.text.includes("gym") ? "e.g. Mon/Wed/Fri this week. Already hit Monday." :
                  activeTask.task.text.includes("appreciate") ? "e.g. Told my wife I appreciate how she keeps everything together when I'm stressed." :
                  activeTask.task.text.includes("3 things") ? "e.g. 1. Finished the report 2. Hit the gym 3. Stayed calm in a tough meeting" :
                  "Write your specific answer, action taken, or result here..."
                }
                value={taskNote}
                onChange={e => setTaskNote(e.target.value)}
              />
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button className="btn" onClick={saveTaskNote} style={{ flex: 1, background: goals[activeTask.cat].color, color: "#fff" }}>
                {activeTask.task.done ? "Update & Save" : "Mark Complete & Save"}
              </button>
              {!activeTask.task.done && (
                <button className="btn" onClick={() => { setTaskNote(""); setActiveTask(null); toggleTask(activeTask.cat, activeTask.tf, activeTask.task.id); }} style={{ background: "#f0f7f3", color: "#1c3d2e", border: "1.5px solid #bbf7d0" }}>
                  Just Check Off
                </button>
              )}
              <button className="btn" onClick={() => { setActiveTask(null); setTaskNote(""); }} style={{ background: "#f5f2ed", color: "#999", border: "1.5px solid #e0d9ce" }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── SAVED TOAST ── */}
      {savedToast && <div className="toast">✓ Check-in saved</div>}

      {/* ── ALERTS MODAL ── */}
      {showAlerts && (
        <div className="overlay" onClick={() => setShowAlerts(false)}>
          <div className="modal up" onClick={e => e.stopPropagation()}>
            <h2 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 24, fontWeight: 700, marginBottom: 6 }}>Accountability Schedule</h2>
            <p style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: 14, color: "#a1a1aa", fontWeight: 500, marginBottom: 20 }}>In-app check-in prompts — no browser permissions needed</p>
            {(Array.isArray(alerts) ? alerts : []).map(a => (
              <div key={a.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 9, border: "1.5px solid #f0ebe3", marginBottom: 8, background: "#fdfaf6" }}>
                <button className={"toggle" + (a.enabled ? " on" : "")} onClick={() => setAlerts(p => p.map(x => x.id === a.id ? { ...x, enabled: !x.enabled } : x))} />
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 500, color: "#18181b", minWidth: 52 }}>{a.time}</span>
                <span style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: 14, fontWeight: 500, color: "#3f3f46", flex: 1 }}>{a.label}</span>
                <button className="del" onClick={() => setAlerts(p => p.filter(x => x.id !== a.id))}>×</button>
              </div>
            ))}
            <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid #f0ebe3" }}>
              <div style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: "#a1a1aa", textTransform: "uppercase", marginBottom: 10 }}>Add Check-In</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <input type="time" className="inp" value={newAlertTime} onChange={e => setNewAlertTime(e.target.value)} style={{ width: 120 }} />
                <input className="inp" placeholder="Label (e.g. Gym check-in)" value={newAlertLabel} onChange={e => setNewAlertLabel(e.target.value)} style={{ flex: 1, minWidth: 140 }} />
                <button className="btn" onClick={() => {
                  if (!newAlertTime) return;
                  setAlerts(p => [...p, { id: Date.now(), time: newAlertTime, label: newAlertLabel || "Check-In", enabled: true }].sort((a, b) => a.time.localeCompare(b.time)));
                  setNewAlertLabel(""); setNewAlertTime("09:00");
                }} style={{ background: "#1c3d2e", color: "#fff" }}>Add</button>
              </div>
            </div>
            <button className="btn" onClick={() => setShowAlerts(false)} style={{ marginTop: 20, width: "100%", background: "#f5f2ed", color: "#888", border: "1.5px solid #e0d9ce" }}>Done</button>
          </div>
        </div>
      )}

      {/* ── CHECK-IN MODAL ── */}
      {checkIn && (
        <div className="overlay">
          <div className="modal up">
            <div style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: 11, letterSpacing: 2, fontWeight: 700, color: "#b8945a", textTransform: "uppercase", marginBottom: 8 }}>⏱ 5-Minute Check-In</div>
            <h2 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 24, fontWeight: 700, marginBottom: 6 }}>{checkIn.label}</h2>
            <p style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: 14, color: "#a1a1aa", fontWeight: 500, marginBottom: 20 }}>Stop. Update your tasks. Stay accountable. 5 minutes.</p>
            <div style={{ background: "#faf8f4", borderRadius: 10, padding: 14, marginBottom: 16 }}>
              <div style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: 11, fontWeight: 700, color: "#a1a1aa", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 8 }}>QUICK NOTE — What did you actually accomplish?</div>
              <textarea className="inp" style={{ minHeight: 80, resize: "vertical", fontFamily: "'Nunito Sans', sans-serif" }}
                placeholder="Be honest. What got done?" value={checkInNote} onChange={e => setCheckInNote(e.target.value)} />
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button className="btn" onClick={() => {
                if (checkInNote.trim()) {
                  const newEntry = { id: Date.now(), label: checkIn.label, note: checkInNote.trim(), timestamp: new Date().toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }) };
                  const newLog = [newEntry, ...checkInLog].slice(0, 20);
                  setCheckInLog(newLog);
                  persist("lcd_checkin_log", newLog);
                  addHistory("checkin", checkIn.label, checkInNote.trim(), "all");
                  if (checkIn.alertId) {
                    const today = new Date().toDateString();
                    const newCompleted = { ...completedToday, [checkIn.alertId + "_" + today]: true };
                    setCompletedToday(newCompleted);
                    persist("lcd_completed_today", newCompleted);
                  }
                  setSavedToast(true);
                  setTimeout(() => setSavedToast(false), 3000);
                }
                setCheckIn(null); setCheckInNote("");
              }} style={{ flex: 1, background: "#1c3d2e", color: "#fff", minHeight: 48 }}>Save & Close</button>
              <button className="btn" onClick={() => { setCheckIn(null); setCheckInNote(""); }} style={{ background: "#f5f2ed", color: "#888", border: "1.5px solid #e0d9ce" }}>Snooze</button>
            </div>
          </div>
        </div>
      )}

      {/* ── VOICE BOT ── */}
      <div style={{ position: "fixed", bottom: 28, right: 24, zIndex: 998, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 12 }}>
        {voiceOpen && (
          <div className="up" style={{ background: "#fff", borderRadius: 16, padding: 20, width: "min(300px, calc(100vw - 48px))", boxShadow: "0 8px 40px rgba(0,0,0,.15)", border: "1px solid #f0ebe3" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div>
                <div style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: 2, color: "#b8945a", textTransform: "uppercase", marginBottom: 3 }}>Voice Assistant</div>
                <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 17, fontWeight: 700 }}>Speak to your coach</div>
              </div>
              <button onClick={() => { setVoiceOpen(false); window.speechSynthesis?.cancel(); }} style={{ background: "none", border: "none", fontSize: 20, color: "#ccc", cursor: "pointer" }}>×</button>
            </div>
            <div style={{ background: "#faf8f4", borderRadius: 10, padding: 12, minHeight: 60, marginBottom: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {voiceListening && <div style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: 13, fontWeight: 700, color: "#dc2626", letterSpacing: 1, animation: "pulse 1s ease infinite" }}>● LISTENING...</div>}
              {voiceProcessing && <div style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: 13, fontWeight: 700, color: "#1c3d2e", letterSpacing: 1, animation: "pulse 1s ease infinite" }}>✦ THINKING...</div>}
              {!voiceListening && !voiceProcessing && voiceResponse && <p style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: 15, lineHeight: 1.7, color: "#18181b", textAlign: "center" }}>{voiceResponse}</p>}
              {!voiceListening && !voiceProcessing && !voiceResponse && <div style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: 13, fontWeight: 500, color: "#a1a1aa", textAlign: "center" }}>Tap mic and speak. Try: "What's my focus today?" or "I just finished my workout"</div>}
            </div>
            {voiceTranscript && !voiceListening && (
              <div style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: 12, fontWeight: 500, color: "#71717a", marginBottom: 10, padding: "6px 10px", background: "#f5f2ed", borderRadius: 6 }}>
                You: "{voiceTranscript}"
              </div>
            )}
            <button onClick={startListening} disabled={voiceListening || voiceProcessing}
              style={{ width: "100%", padding: 14, borderRadius: 10, border: "none", background: voiceListening ? "#dc2626" : "#1c3d2e", color: "#fff", fontSize: 22, cursor: "pointer", transition: "all .2s", opacity: voiceProcessing ? 0.5 : 1 }}>
              {voiceListening ? "🔴" : "🎤"}
            </button>
            {voiceLog.length > 0 && (
              <div style={{ marginTop: 12, borderTop: "1px solid #f0ebe3", paddingTop: 10 }}>
                <div style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: 8, color: "#bbb", letterSpacing: 2, marginBottom: 6 }}>RECENT</div>
                {voiceLog.slice(0,2).map(v => (
                  <div key={v.id} style={{ marginBottom: 6 }}>
                    <div style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: 12, fontWeight: 500, color: "#71717a" }}>"{v.said}"</div>
                    <div style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: 13, fontWeight: 500, color: "#52525b", marginTop: 2 }}>{v.response}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        <button onClick={() => setVoiceOpen(v => !v)}
          style={{ width: 62, height: 62, borderRadius: "50%", background: voiceOpen ? "#dc2626" : "#1c3d2e", border: "none", color: "#fff", fontSize: 24, cursor: "pointer", boxShadow: "0 4px 20px rgba(0,0,0,.2)", display: "flex", alignItems: "center", justifyContent: "center", transition: "all .2s" }}>
          {voiceOpen ? "×" : "🎤"}
        </button>
      </div>

      <div style={{ textAlign: "center", padding: "24px 20px 100px", fontFamily: "'Nunito Sans', sans-serif", fontSize: 12, fontWeight: 600, color: "#c4bdb4", letterSpacing: 1.5, textTransform: "uppercase" }}>
        The goal is not to solve your whole life — stabilize the next step
      </div>
    </div>
  );
}
