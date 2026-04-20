import { useState, useEffect, useRef, useCallback } from "react";

// Fonts
const fl = document.createElement("link");
fl.rel = "stylesheet";
fl.href = "https://fonts.googleapis.com/css2?family=Fraunces:wght@400;700;900&family=Nunito+Sans:wght@400;600;700;800&family=JetBrains+Mono:wght@500&display=swap";
document.head.appendChild(fl);

// CSS
const css = `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{-webkit-text-size-adjust:100%;scroll-behavior:auto}
body{background:#f7f4ef;font-family:'Nunito Sans',sans-serif;color:#18181b;-webkit-font-smoothing:antialiased;overscroll-behavior:none}
button{font-family:inherit;cursor:pointer;-webkit-tap-highlight-color:transparent}
input,textarea{font-family:inherit;-webkit-appearance:none;appearance:none}
.app{max-width:480px;margin:0 auto;padding:12px 12px 80px;display:flex;flex-direction:column;gap:12px}
@media(min-width:900px){.app{max-width:1100px;display:grid;grid-template-columns:1fr 360px;align-items:start;padding:20px 20px 40px;gap:16px}.mc{display:flex;flex-direction:column;gap:14px}.sc{display:flex;flex-direction:column;gap:14px}}
.card{background:#fff;border-radius:16px;border:1px solid #e8e2d9;overflow:hidden}
.cp{padding:16px}.cpx{padding:20px}
.eyebrow{font-size:10px;font-weight:800;letter-spacing:1.8px;text-transform:uppercase}
.title{font-family:'Fraunces',serif;font-weight:900;line-height:1.1}
.mono{font-family:'JetBrains Mono',monospace;font-weight:500}
.tabs{display:flex;gap:3px;padding:4px;background:#f7f4ef;border-radius:10px}
.tab{flex:1;padding:8px 6px;border:none;border-radius:7px;font-size:12px;font-weight:700;background:transparent;color:#a1a1aa;transition:all .15s}
.tab.on{background:#fff;color:#18181b;box-shadow:0 1px 3px rgba(0,0,0,.1)}
.btn{padding:11px 18px;border-radius:10px;border:none;font-size:13px;font-weight:700;transition:all .15s;display:inline-flex;align-items:center;justify-content:center;gap:6px}
.btn-g{background:#1c3d2e;color:#fff}.btn-g:active{background:#163325}
.btn-o{background:transparent;border:1.5px solid #e8e2d9;color:#52525b}
.btn-s{padding:7px 12px;font-size:12px;border-radius:8px}
input,textarea{width:100%;border:1.5px solid #e8e2d9;border-radius:10px;padding:11px 14px;font-size:15px;background:#fff;color:#18181b;outline:none;transition:border .15s}
input:focus,textarea:focus{border-color:#1c3d2e}
.task-row{display:flex;align-items:flex-start;gap:12px;padding:12px 0;border-bottom:1px solid #fafaf9;cursor:pointer}
.task-row:last-child{border-bottom:none}
.chk{width:24px;height:24px;min-width:24px;border-radius:50%;border:2px solid #e8e2d9;display:flex;align-items:center;justify-content:center;transition:all .2s;background:#fff}
.chk.on{background:#1c3d2e;border-color:#1c3d2e}
.bar{height:5px;background:#ede8e0;border-radius:3px;overflow:hidden}
.bar-f{height:100%;border-radius:3px;transition:width .5s ease}
.hring{width:50px;height:50px;border-radius:50%;border:3px solid #e8e2d9;display:flex;align-items:center;justify-content:center;font-size:20px;background:#fff;transition:all .2s;cursor:pointer;flex-shrink:0}
.hring.on{border-color:#1c3d2e;background:#f0fdf4}
.chat-box{height:260px;overflow-y:auto;display:flex;flex-direction:column;gap:10px;padding:4px 0}
.bm{background:#1c3d2e;color:#fff;padding:10px 14px;border-radius:16px 16px 4px 16px;max-width:85%;align-self:flex-end;font-size:14px;line-height:1.5}
.ba{background:#f7f4ef;color:#18181b;padding:10px 14px;border-radius:16px 16px 16px 4px;max-width:92%;align-self:flex-start;font-size:14px;line-height:1.65;border:1px solid #e8e2d9}
.spin{width:16px;height:16px;border:2px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;animation:sp .6s linear infinite;display:inline-block}
.spin-d{border-color:rgba(0,0,0,.1);border-top-color:#1c3d2e}
@keyframes sp{to{transform:rotate(360deg)}}
.toast{position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:#1c3d2e;color:#fff;padding:10px 20px;border-radius:24px;font-size:13px;font-weight:700;z-index:9999;white-space:nowrap;max-width:88vw;text-align:center;animation:pop .25s ease;pointer-events:none}
@keyframes pop{from{opacity:0;transform:translateX(-50%) translateY(6px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}
.tgr{display:flex;align-items:flex-start;gap:10px;padding:9px 0;border-bottom:1px solid #f5f0ea}
.tgr:last-child{border-bottom:none}
.tgc{width:20px;height:20px;min-width:20px;border-radius:50%;border:2px solid #e8e2d9;cursor:pointer;background:transparent;flex-shrink:0;margin-top:2px}
.qp{background:#f7f4ef;border:1px solid #e8e2d9;border-radius:20px;padding:6px 12px;font-size:11px;font-weight:700;color:#52525b;cursor:pointer}
.qpr{display:flex;gap:6px;flex-wrap:wrap;margin-top:10px}
.wknd{background:#fff7ed;color:#c2410c;border:1px solid #fed7aa;border-radius:20px;padding:3px 9px;font-size:11px;font-weight:700}
.tier-i{padding:4px 10px;border-radius:20px;font-size:10px;font-weight:800;letter-spacing:.5px;background:#f0ebe3;color:#a1a1aa}
.tier-i.on{color:#fff}
.divrow{display:flex;justify-content:space-between;align-items:center;padding:7px 0;border-bottom:1px solid #fafaf9}
.divrow:last-child{border-bottom:none}
.rtrow{display:flex;gap:10px;padding:6px 0;border-bottom:1px solid #fafaf9;align-items:center}
.rtrow:last-child{border-bottom:none}
@media(max-width:480px){h1.title{font-size:22px!important}.hring{width:44px;height:44px;font-size:18px}.tab{font-size:11px}}
`;
const se = document.createElement("style"); se.textContent = css; document.head.appendChild(se);

// Data
const WORK = [
  {id:1,text:"Write down your #1 work task and start it within 30 minutes",p:"high"},
  {id:2,text:"Send one message that moves a stuck situation forward",p:"high"},
  {id:3,text:"Block 90 minutes for deep focused work — phone off",p:"high"},
  {id:4,text:"Structure your morning routine — write it and follow it once",p:"medium"},
  {id:5,text:"Identify the one work stressor causing the most damage",p:"medium"},
  {id:6,text:"Deliver one visible, measurable result leadership will notice",p:"high"},
  {id:7,text:"Evaluate honestly: grow here or build an exit path — decide",p:"high"},
];
const PERSONAL = [
  {id:11,text:"4:45am — Wake up, drink water, no phone for 10 minutes",p:"high"},
  {id:12,text:"5:00am — Gym (non-negotiable — protect this every day)",p:"high"},
  {id:13,text:"6:00am — Shower in 10 minutes, transition into leader mode",p:"high"},
  {id:14,text:"6:25am — Open dashboard, set Today's #1 (5 min only)",p:"high"},
  {id:15,text:"6:35am — Family time, present and calm, not rushed (15 min)",p:"high"},
  {id:16,text:"Before bed, write down 3 things you did right today",p:"medium"},
  {id:17,text:"Have one honest check-in conversation with your partner",p:"high"},
];
const FINANCIAL = [
  {id:21,text:"Write your exact monthly stability number — income vs current",p:"high"},
  {id:22,text:"Open your bank account and write down your actual balance",p:"high"},
  {id:23,text:"List every recurring expense and circle one to cut",p:"high"},
  {id:24,text:"Build a simple budget: income, fixed costs, variable, gap",p:"high"},
  {id:25,text:"Identify one concrete income growth action this month",p:"high"},
  {id:26,text:"Start a 3-month emergency fund plan — $25/week counts",p:"medium"},
];
const ALL = {work:WORK,personal:PERSONAL,financial:FINANCIAL};
const HABITS0 = [
  {id:"h1",name:"Gym",icon:"🏋️",streak:0,done:false},
  {id:"h2",name:"Sleep on time",icon:"😴",streak:0,done:false},
  {id:"h3",name:"No phone 10min AM",icon:"📵",streak:0,done:false},
  {id:"h4",name:"Read / Learn",icon:"📚",streak:0,done:false},
];
const PTS = {high:8,medium:5,low:3};
const TIERS = [{m:0,l:"GET MOVING",c:"#f43f5e"},{m:25,l:"WARMING UP",c:"#a78bfa"},{m:45,l:"BUILDING",c:"#f97316"},{m:60,l:"SOLID",c:"#3b82f6"},{m:75,l:"STRONG",c:"#22c55e"},{m:90,l:"ELITE",c:"#f59e0b"}];
const CAT_C = {work:"#1c3d2e",personal:"#7c3d00",financial:"#1e3a5f",home:"#5b4a00",family:"#6b21a8",health:"#065f46"};
const CAT_E = {work:"💼",personal:"🏠",financial:"📈",home:"🏡",family:"👨‍👩‍👦",health:"💪"};
const TPTS = [["5:00am","🏋️ Gym"],["8:00am","☀️ Morning"],["1:00pm","⚡ Midday"],["8:00pm","🌙 Evening"],["10:00pm","😴 Pre-Sleep"]];

// Scoring — shows TASK COUNTS in breakdown, points for score
function score(done, habits, focus, wins, conf, isWknd) {
  const cats = isWknd ? ["personal","financial"] : ["work","personal","financial"];
  const earns = cats.map(c => ALL[c].filter(t=>done[t.id]).reduce((a,t)=>a+(PTS[t.p]||5),0));
  const maxes = cats.map(c => ALL[c].reduce((a,t)=>a+(PTS[t.p]||5),0));
  const taskEarned = earns.reduce((a,v)=>a+v,0);
  const taskMax = maxes.reduce((a,v)=>a+v,0);
  const habPts = habits.filter(h=>h.done).length*10;
  const focusPts = focus?.trim().length>2?5:0;
  const winPts = Math.min(wins.length,2)*3;
  const confPts = conf>0?Math.min(4,Math.round(conf/2.5)):0;
  const earned = taskEarned+habPts+focusPts+winPts+confPts;
  const max = taskMax+habits.length*10+5+6+4;
  const pct = max>0?Math.round((earned/max)*100):0;
  const tier = TIERS.reduce((a,t)=>pct>=t.m?t:a,TIERS[0]);
  const breakdown = [
    ...(!isWknd?[{l:"Work",cnt:WORK.filter(t=>done[t.id]).length,tot:WORK.length,pct:WORK.length?Math.round(WORK.filter(t=>done[t.id]).length/WORK.length*100):0,pts:WORK.filter(t=>done[t.id]).reduce((a,t)=>a+(PTS[t.p]||5),0),c:"#1c3d2e"}]:[]),
    {l:"Personal",cnt:PERSONAL.filter(t=>done[t.id]).length,tot:PERSONAL.length,pct:PERSONAL.length?Math.round(PERSONAL.filter(t=>done[t.id]).length/PERSONAL.length*100):0,pts:PERSONAL.filter(t=>done[t.id]).reduce((a,t)=>a+(PTS[t.p]||5),0),c:"#7c3d00"},
    {l:"Financial",cnt:FINANCIAL.filter(t=>done[t.id]).length,tot:FINANCIAL.length,pct:FINANCIAL.length?Math.round(FINANCIAL.filter(t=>done[t.id]).length/FINANCIAL.length*100):0,pts:FINANCIAL.filter(t=>done[t.id]).reduce((a,t)=>a+(PTS[t.p]||5),0),c:"#1e3a5f"},
    {l:"Habits",cnt:habits.filter(h=>h.done).length,tot:habits.length,pct:habits.length?Math.round(habits.filter(h=>h.done).length/habits.length*100):0,pts:habPts,c:"#065f46"},
    {l:"Focus",cnt:focusPts>0?1:0,tot:1,pct:focusPts>0?100:0,pts:focusPts,c:"#92400e"},
    {l:"Wins",cnt:Math.min(wins.length,2),tot:2,pct:Math.min(wins.length,2)*50,pts:winPts,c:"#6d28d9"},
  ];
  return {pct,earned,max,tier,breakdown};
}

// localStorage
const ls={get:(k,fb)=>{try{const v=localStorage.getItem(k);return v?JSON.parse(v):fb}catch{return fb}},set:(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch{}}};

export default function App() {
  useEffect(()=>{window.scrollTo(0,0);},[]);

  const dow = new Date().getDay();
  const isWknd = dow===0||dow===6;
  const dayName = new Date().toLocaleDateString("en-US",{weekday:"long",timeZone:"America/New_York"});
  const dateStr = new Date().toLocaleDateString("en-US",{month:"long",day:"numeric",timeZone:"America/New_York"});
  const activeTabs = isWknd?["personal","financial"]:["work","personal","financial"];

  const [tab,setTab]=useState(()=>isWknd?"personal":"work");
  const [done,setDone]=useState(()=>ls.get("v3_done",{}));
  const [habits,setHabits]=useState(()=>{const s=ls.get("v3_habits",null);return Array.isArray(s)&&s.length===HABITS0.length?s:HABITS0;});
  const [focus,setFocus]=useState(()=>ls.get("v3_focus",""));
  const [focusIn,setFocusIn]=useState(()=>ls.get("v3_focus",""));
  const [conf,setConf]=useState(()=>ls.get("v3_conf",5));
  const [wins,setWins]=useState(()=>ls.get("v3_wins",[]));
  const [winIn,setWinIn]=useState("");
  const [checkins,setCheckins]=useState(()=>ls.get("v3_ci",[]));
  const [ciNote,setCiNote]=useState("");
  const [budget,setBudget]=useState(()=>ls.get("v3_budget",{income:"",fixed:"",variable:"",target:""}));
  const [savings,setSavings]=useState(()=>ls.get("v3_sav",[{id:1,name:"Emergency Fund (3mo)",target:5000,current:0},{id:2,name:"Family Stability Buffer",target:2000,current:0}]));
  const [msgs,setMsgs]=useState([{r:"ai",t:"Hey Liam 👋 I'm your AI coach. Tell me what's on your mind — work stress, a decision you're avoiding, or how today's going. I'll give you a direct, honest response."}]);
  const [chatIn,setChatIn]=useState("");
  const [chatLoad,setChatLoad]=useState(false);
  const chatEnd=useRef(null);
  const [briefing,setBriefing]=useState(null);
  const [briefLoad,setBriefLoad]=useState(false);
  const [coach,setCoach]=useState("");
  const [coachLoad,setCoachLoad]=useState(false);
  const [coachTime,setCoachTime]=useState("");
  const [tgTodos,setTgTodos]=useState([]);
  const [tgLoad,setTgLoad]=useState(false);
  const [toast,setToast]=useState("");
  const [confSaved,setConfSaved]=useState(false);
  const [confExpanded,setConfExpanded]=useState(false);

  const effTab = (isWknd&&tab==="work")?"personal":tab;
  const tasks = ALL[effTab]||[];
  const doneCnt = tasks.filter(t=>done[t.id]).length;
  const pct = tasks.length?Math.round(doneCnt/tasks.length*100):0;
  const sc = score(done,habits,focus,wins,conf,isWknd);
  const tabC = {work:"#1c3d2e",personal:"#7c3d00",financial:"#1e3a5f"}[effTab]||"#1c3d2e";
  const bCalc=(()=>{const i=+budget.income||0,f=+budget.fixed||0,v=+budget.variable||0,t=+budget.target||0;return{spend:f+v,left:i-f-v,gap:t-(i-f-v)};})();
  const activeChalKeys=isWknd?["personal","financial"]:["work","personal","financial"];
  const chalDone=briefing?activeChalKeys.filter(k=>briefing.challengesCompleted?.[k]).length:0;

  useEffect(()=>{chatEnd.current?.scrollIntoView({behavior:"smooth"});},[msgs]);
  useEffect(()=>{fetchTg();fetchBriefing();},[]);// eslint-disable-line
  useEffect(()=>{const t=setTimeout(()=>genCoach(),1800);return()=>clearTimeout(t);},[done,habits,conf,focus]);// eslint-disable-line

  const showToast=m=>{setToast(m);setTimeout(()=>setToast(""),2500);};
  const toggleTask=id=>{setDone(p=>{const n={...p,[id]:!p[id]};ls.set("v3_done",n);return n;});};
  const toggleHabit=id=>{setHabits(p=>{const n=p.map(h=>h.id===id?{...h,done:!h.done,streak:!h.done?h.streak+1:Math.max(0,h.streak-1)}:h);ls.set("v3_habits",n);return n;});};
  const saveFocus=()=>{ls.set("v3_focus",focusIn);setFocus(focusIn);showToast("Focus saved ✓");};
  const saveConf=()=>{ls.set("v3_conf",conf);setConfSaved(true);setTimeout(()=>setConfSaved(false),2000);showToast(`Confidence ${conf}/10 logged`);};
  const addWin=()=>{if(!winIn.trim())return;const n=[{id:Date.now(),text:winIn.trim(),date:new Date().toLocaleDateString("en-US",{month:"short",day:"numeric"})},...wins].slice(0,30);setWins(n);ls.set("v3_wins",n);setWinIn("");showToast("Win logged 🏆");};
  const addCi=()=>{if(!ciNote.trim())return;const n=[{id:Date.now(),note:ciNote.trim(),time:new Date().toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit"}),date:new Date().toLocaleDateString("en-US",{month:"short",day:"numeric"})},...checkins].slice(0,20);setCheckins(n);ls.set("v3_ci",n);setCiNote("");showToast("Check-in saved ✓");};

  const fetchTg=async()=>{setTgLoad(true);try{const r=await fetch("/api/todos");if(r.ok){const d=await r.json();setTgTodos(Array.isArray(d.todos)?d.todos:[]);}}catch{}setTgLoad(false);};
  const markTgDone=async id=>{try{await fetch("/api/todos",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({id,done:true})});setTgTodos(p=>p.map(t=>t.id===id?{...t,done:true}:t));}catch{}};
  const delTg=async id=>{try{await fetch("/api/todos",{method:"DELETE",headers:{"Content-Type":"application/json"},body:JSON.stringify({id})});setTgTodos(p=>p.filter(t=>t.id!==id));}catch{}};

  const fetchBriefing=async(force=false)=>{
    setBriefLoad(true);
    try{
      const ctrl=new AbortController();const t=setTimeout(()=>ctrl.abort(),5000);
      const r=await fetch("/api/briefing"+(force?"?force=true":""),{signal:ctrl.signal});clearTimeout(t);
      if(r.ok){const d=await r.json();if(d.briefing){const saved=ls.get("v3_bc",{});const sd=ls.get("v3_bd","");const today=new Date().toDateString();if(sd===today)d.briefing.challengesCompleted={...d.briefing.challengesCompleted,...Object.fromEntries(Object.entries(saved).filter(([,v])=>v===true))};setBriefing(d.briefing);setBriefLoad(false);return;}}
    }catch{}
    const today=new Date().toDateString();const saved=ls.get("v3_bc",{});const sd=ls.get("v3_bd","");
    setBriefing({dayOfWeek:dayName,coachNote:isWknd?`It's ${dayName} — recovery day. Work goals don't count. Focus on personal growth, family, and one financial action. Target: 65. Rest with intention.`:`It's ${dayName}. Target: 75+. Work, personal, and financial goals all on the board. Treat it like a game you intend to win.`,work:{challenge:"Complete your single most important work task before noon.",why:"One completed high-priority task beats five half-started ones.",points:20},personal:isWknd?{challenge:"30 minutes of personal development — read, listen, or reflect.",why:"Weekends build the person you'll be at work next week.",points:15}:{challenge:"Protect your morning routine all day.",why:"Your morning routine is your competitive edge.",points:15},financial:{challenge:"Review your bank balance and log one budget number.",why:"Facing your numbers removes the anxiety of avoiding them.",points:15},targetScore:isWknd?65:75,challengesCompleted:sd===today?saved:{work:false,personal:false,financial:false}});
    if(sd!==today)ls.set("v3_bd",today);
    setBriefLoad(false);
  };

  const completeChallenge=async cat=>{
    setBriefing(p=>{if(!p)return p;const n={...p,challengesCompleted:{...p.challengesCompleted,[cat]:true}};ls.set("v3_bc",n.challengesCompleted);return n;});
    showToast(`${cat.charAt(0).toUpperCase()+cat.slice(1)} done! +${cat==="work"?20:15} pts`);
    try{await fetch("/api/briefing",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({category:cat})});}catch{}
  };

  const genCoach=async()=>{
    setCoachLoad(true);
    const s=score(done,habits,focus,wins,conf,isWknd);
    const h=new Date().getHours();
    const tod=h<9?"morning":h<13?"mid-morning":h<17?"afternoon":h<20?"evening":"night";
    const wkDone=WORK.filter(t=>done[t.id]).length,pDone=PERSONAL.filter(t=>done[t.id]).length,fDone=FINANCIAL.filter(t=>done[t.id]).length;
    const habDone=habits.filter(h=>h.done).map(h=>h.name).join(", ")||"none";
    const habMiss=habits.filter(h=>!h.done).map(h=>h.name).join(", ");
    const prompt=[`You are Liam's life coach. It's ${tod} on ${dayName}.`,`SCORE: ${s.pct}/100 (${s.tier.label}) — ${s.earned} of ${s.max} pts`,`Tasks: ${isWknd?"":wkDone+"/"+WORK.length+" work, "}${pDone}/${PERSONAL.length} personal, ${fDone}/${FINANCIAL.length} financial`,`Habits done: ${habDone}${habMiss?", missed: "+habMiss:""}`,`Focus: ${focus||"not set"} | Confidence: ${conf}/10 | Last win: ${wins[0]?.text||"none"}`,``,`3-4 sentence coaching message for a former athlete. Reference the actual score and tier by number. Be specific about what's done and what's missing. End with one sharp challenge. No fluff.`].join("\n");
    try{const r=await fetch("/api/coach",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({messages:[{role:"user",content:prompt}],system:"Direct, warm life coach. 3-4 sentences max. Reference exact score number. End with one specific action."})});if(r.ok){const d=await r.json();setCoach(d.reply||"");setCoachTime(new Date().toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit"}));}}catch{setCoach("Keep your head in the game. One task at a time.");}
    setCoachLoad(false);
  };

  const sendChat=useCallback(async()=>{
    if(!chatIn.trim()||chatLoad)return;
    const um={r:"user",t:chatIn.trim()};const nm=[...msgs,um];setMsgs(nm);setChatIn("");setChatLoad(true);
    try{const r=await fetch("/api/coach",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({messages:nm.map(m=>({role:m.r==="ai"?"assistant":"user",content:m.t})),system:"Liam's AI life coach. Florida, 5am gym habit, work stress main trigger, financial pressure for family. 3-5 sentences. Direct, warm, end with one specific next move."})});if(r.ok){const d=await r.json();setMsgs(p=>[...p,{r:"ai",t:d.reply||"Keep moving."}]);}}catch{setMsgs(p=>[...p,{r:"ai",t:"Trouble connecting. Try again."}]);}
    setChatLoad(false);
  },[chatIn,msgs,chatLoad]);

  return (
    <div className="app">
      <div className="mc">
        {/* Header */}
        <div className="card cpx">
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:12,flexWrap:"wrap"}}>
            <div>
              <div className="eyebrow" style={{color:"#1c3d2e",marginBottom:6}}>🎯 Life Command Center</div>
              <h1 className="title" style={{fontSize:"clamp(22px,6vw,30px)",color:"#18181b"}}>Accountability<br/>System</h1>
              <p style={{fontSize:12,color:"#a1a1aa",marginTop:5}}>{dayName}, {dateStr}{isWknd&&<span className="wknd" style={{marginLeft:8}}>🏖️ Weekend</span>}</p>
            </div>
            <div style={{textAlign:"center",flexShrink:0}}>
              <svg width="72" height="72" viewBox="0 0 72 72">
                <circle cx="36" cy="36" r="28" fill="none" stroke="#ede8e0" strokeWidth="5"/>
                <circle cx="36" cy="36" r="28" fill="none" stroke={sc.tier.c} strokeWidth="5"
                  strokeDasharray={2*Math.PI*28} strokeDashoffset={2*Math.PI*28*(1-sc.pct/100)}
                  strokeLinecap="round" transform="rotate(-90 36 36)" style={{transition:"stroke-dashoffset .8s"}}/>
                <text x="36" y="40" textAnchor="middle" fill={sc.tier.c} fontSize="15" fontWeight="900" fontFamily="'Fraunces',serif">{sc.pct}</text>
              </svg>
              <div style={{fontSize:9,fontWeight:800,letterSpacing:1,color:sc.tier.c,marginTop:2}}>{sc.tier.l}</div>
            </div>
          </div>

          {/* Category counts — tap to switch tab */}
          <div style={{display:"flex",gap:8,marginTop:14,flexWrap:"wrap"}}>
            {activeTabs.map(c=>{const cnt=ALL[c].filter(t=>done[t.id]).length,tot=ALL[c].length;const colors={work:"#1c3d2e",personal:"#7c3d00",financial:"#1e3a5f"};return(
              <div key={c} onClick={()=>setTab(c)} style={{flex:1,minWidth:80,padding:"10px 12px",background:c===effTab?"#f7f4ef":"#fafafa",borderRadius:10,border:"1.5px solid",borderColor:c===effTab?colors[c]:"transparent",cursor:"pointer",transition:"all .15s"}}>
                <div style={{fontSize:"clamp(17px,4.5vw,22px)",fontWeight:900,color:colors[c]}}>{cnt}<span style={{fontSize:11,color:"#a1a1aa",fontWeight:600}}>/{tot}</span></div>
                <div className="eyebrow" style={{color:"#a1a1aa",fontSize:9,marginTop:2}}>{c}</div>
              </div>
            );})}
          </div>

          {/* Focus */}
          <div style={{marginTop:14,padding:14,background:"#f7f4ef",borderRadius:10}}>
            <div className="eyebrow" style={{color:"#a1a1aa",marginBottom:8}}>⚡ Today's #1 Non-Negotiable</div>
            <div style={{display:"flex",gap:8}}>
              <input value={focusIn} onChange={e=>setFocusIn(e.target.value)} onKeyDown={e=>e.key==="Enter"&&saveFocus()} placeholder="What MUST get done today?"/>
              <button className="btn btn-g btn-s" onClick={saveFocus} style={{whiteSpace:"nowrap"}}>Save</button>
            </div>
            {focus&&<p style={{marginTop:8,fontSize:13,fontWeight:700,color:"#1c3d2e"}}>→ {focus}</p>}
          </div>
        </div>

        {/* Daily Briefing */}
        <div className="card">
          <div style={{background:"linear-gradient(135deg,#1a2f4a,#0f1e35)",padding:"14px 16px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div>
                <div className="eyebrow" style={{color:"#93c5fd",marginBottom:4}}>📋 Daily Briefing</div>
                <div className="title" style={{fontSize:15,color:"#fff"}}>
                  {briefing?`${briefing.dayOfWeek}${isWknd?" — Weekend 🏖️":" — "+activeChalKeys.length+" Challenges"}`:"Loading..."}
                </div>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                {briefing&&<span style={{fontSize:11,fontWeight:700,color:"#93c5fd"}}>Target: {briefing.targetScore}</span>}
                <button onClick={()=>fetchBriefing(true)} style={{background:"rgba(255,255,255,.15)",border:"none",borderRadius:6,padding:"5px 10px",color:"#fff",fontSize:11,fontWeight:700}}>{briefLoad?"...":"↺"}</button>
              </div>
            </div>
          </div>
          <div className="cp">
            {briefLoad&&!briefing?(
              <div style={{display:"flex",gap:10,alignItems:"center",padding:"12px 0"}}>
                <div className="spin spin-d"/><span style={{fontSize:13,color:"#a1a1aa"}}>Generating challenges...</span>
              </div>
            ):briefing?(
              <>
                <div style={{background:"#f0f7ff",borderRadius:10,padding:"12px 14px",borderLeft:"4px solid #1e3a5f",marginBottom:14}}>
                  <p style={{fontSize:13,lineHeight:1.7,color:"#18181b",fontWeight:500}}>{briefing.coachNote}</p>
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:10}}>
                  {[...(!isWknd?[{key:"work",icon:"💼",label:"WORK",color:"#1c3d2e",bg:"#f0fdf4",data:briefing.work}]:[]),{key:"personal",icon:"🏠",label:"PERSONAL",color:"#7c3d00",bg:"#fff7ed",data:briefing.personal},{key:"financial",icon:"📈",label:"FINANCIAL",color:"#1e3a5f",bg:"#eff6ff",data:briefing.financial}].map(item=>{
                    const isDone=briefing.challengesCompleted?.[item.key];
                    return(
                      <div key={item.key} style={{background:isDone?item.bg:"#fafaf9",borderRadius:12,padding:"12px 14px",border:"1.5px solid",borderColor:isDone?item.color:"#e8e2d9",transition:"all .2s"}}>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:10}}>
                          <div style={{flex:1}}>
                            <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:6}}>
                              <span style={{fontSize:13}}>{item.icon}</span>
                              <span className="eyebrow" style={{color:item.color,fontSize:9}}>{item.label}</span>
                              <span style={{fontSize:10,fontWeight:700,color:item.color,background:item.bg,padding:"2px 6px",borderRadius:4}}>+{item.data?.points} pts</span>
                              {isDone&&<span style={{fontSize:11,fontWeight:800,color:"#16a34a"}}>✓ DONE</span>}
                            </div>
                            <p style={{fontSize:13,fontWeight:600,color:isDone?"#a1a1aa":"#18181b",lineHeight:1.5,textDecoration:isDone?"line-through":"none"}}>{item.data?.challenge}</p>
                            {!isDone&&item.data?.why&&<p style={{fontSize:11,color:"#a1a1aa",marginTop:4,fontStyle:"italic"}}>→ {item.data.why}</p>}
                          </div>
                          {!isDone&&<button onClick={()=>completeChallenge(item.key)} style={{background:item.color,color:"#fff",border:"none",borderRadius:8,padding:"7px 12px",fontSize:11,fontWeight:700,cursor:"pointer",whiteSpace:"nowrap",flexShrink:0}}>Done ✓</button>}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div style={{marginTop:12,padding:"10px 14px",background:"#f7f4ef",borderRadius:10,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <span style={{fontSize:13,fontWeight:700,color:"#52525b"}}>{chalDone}/{activeChalKeys.length} challenges complete</span>
                  <span style={{fontSize:12,color:"#1c3d2e",fontWeight:700}}>
                    {(briefing.challengesCompleted?.work&&!isWknd?briefing.work?.points||0:0)+(briefing.challengesCompleted?.personal?briefing.personal?.points||0:0)+(briefing.challengesCompleted?.financial?briefing.financial?.points||0:0)} pts earned
                  </span>
                </div>
              </>
            ):(
              <div style={{textAlign:"center",padding:"16px 0"}}>
                <button className="btn btn-g" onClick={()=>fetchBriefing()}>Generate Today's Briefing</button>
              </div>
            )}
          </div>
        </div>

        {/* Score Panel */}
        <div className="card" style={{border:`2px solid ${sc.tier.c}`}}>
          <div style={{background:sc.tier.bg,padding:"16px 18px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div>
                <div className="eyebrow" style={{color:sc.tier.c,marginBottom:6}}>🏆 Daily Performance Score</div>
                <div style={{display:"flex",alignItems:"baseline",gap:6}}>
                  <span className="title" style={{fontSize:"clamp(44px,11vw,60px)",color:sc.tier.c}}>{sc.pct}</span>
                  <span style={{fontSize:20,color:sc.tier.c,opacity:.6,fontWeight:700}}>/100</span>
                </div>
                <div style={{fontSize:11,fontWeight:800,letterSpacing:2,color:sc.tier.c,marginTop:2}}>{sc.tier.l}</div>
              </div>
              <div>
                <div className="mono" style={{fontSize:11,color:sc.tier.c,opacity:.7,marginBottom:4,textAlign:"right"}}>{sc.earned}/{sc.max} pts</div>
                <svg width="62" height="62" viewBox="0 0 62 62">
                  <circle cx="31" cy="31" r="25" fill="none" stroke="rgba(255,255,255,.1)" strokeWidth="5"/>
                  <circle cx="31" cy="31" r="25" fill="none" stroke={sc.tier.c} strokeWidth="5"
                    strokeDasharray={2*Math.PI*25} strokeDashoffset={2*Math.PI*25*(1-sc.pct/100)}
                    strokeLinecap="round" transform="rotate(-90 31 31)" style={{transition:"stroke-dashoffset .8s"}}/>
                  <text x="31" y="35" textAnchor="middle" fill={sc.tier.c} fontSize="13" fontWeight="900" fontFamily="'Fraunces',serif">{sc.pct}%</text>
                </svg>
              </div>
            </div>
          </div>

          {/* Breakdown — TASK COUNTS (not raw points) */}
          <div style={{padding:"14px 18px",background:"#fff"}}>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(90px,1fr))",gap:10,marginBottom:14}}>
              {sc.breakdown.map(item=>(
                <div key={item.l}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                    <span className="eyebrow" style={{color:"#a1a1aa",fontSize:9}}>{item.l}</span>
                    <span className="mono" style={{fontSize:10,color:item.c}}>{item.cnt}/{item.tot}</span>
                  </div>
                  <div className="bar"><div className="bar-f" style={{width:item.pct+"%",background:item.c}}/></div>
                  <div style={{fontSize:9,color:"#a1a1aa",marginTop:2}}>{item.pts} pts</div>
                </div>
              ))}
            </div>
            <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:14}}>
              <span className="eyebrow" style={{color:"#a1a1aa",marginRight:4,fontSize:9}}>TARGET →</span>
              {TIERS.map((t,i)=>{const next=TIERS[i+1];const isOn=sc.pct>=t.m&&(!next||sc.pct<next.m);return(<span key={t.l} className={`tier-i${isOn?" on":""}`} style={isOn?{background:t.c}:{}}>{t.l}</span>);})}
            </div>
          </div>

          {/* Coach */}
          <div style={{padding:"14px 18px",borderTop:"1px solid #f0ebe3"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
              <span className="eyebrow" style={{color:"#a1a1aa"}}>🧠 Coach Feedback</span>
              <div style={{display:"flex",gap:8,alignItems:"center"}}>
                {coachTime&&<span style={{fontSize:10,color:"#a1a1aa"}}>{coachTime}</span>}
                <button onClick={genCoach} className="btn btn-o btn-s">{coachLoad?"...":"↺ Refresh"}</button>
              </div>
            </div>
            {coachLoad&&!coach?(<div style={{display:"flex",gap:8,alignItems:"center"}}><div className="spin spin-d"/><span style={{fontSize:13,color:"#a1a1aa"}}>Analyzing score...</span></div>):
            coach?(<div style={{background:"#f7f4ef",borderRadius:10,padding:"12px 14px",borderLeft:`4px solid ${sc.tier.c}`}}><p style={{fontSize:14,lineHeight:1.75,color:"#18181b",fontWeight:500}}>{coach}</p></div>):null}
            <div className="qpr">
              {["💬 Talk to coach","↺ New message"].map((l,i)=>(
                <button key={l} className="qp" onClick={()=>{if(i===0)setChatIn("Coach me on my current score and how to improve");if(i===1)genCoach();}}>{l}</button>
              ))}
            </div>
          </div>
        </div>

        {/* Goal Tracker */}
        <div className="card cpx">
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
            <div>
              <div className="eyebrow" style={{color:"#a1a1aa",marginBottom:4}}>📋 Goal Tracker</div>
              <h2 className="title" style={{fontSize:"clamp(16px,4vw,20px)"}}>{effTab.charAt(0).toUpperCase()+effTab.slice(1)} Goals{isWknd&&<span className="wknd" style={{marginLeft:8,fontSize:11}}>weekend</span>}</h2>
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{fontSize:"clamp(20px,5vw,26px)",fontWeight:900,color:tabC}}>{pct}%</div>
              <div style={{fontSize:11,color:"#a1a1aa"}}>{doneCnt}/{tasks.length}</div>
            </div>
          </div>
          <div className="tabs" style={{marginBottom:14}}>
            {activeTabs.map(t=>(<button key={t} className={`tab${effTab===t?" on":""}`} onClick={()=>setTab(t)}>{t==="work"?"💼":t==="personal"?"🏠":"📈"} {t.charAt(0).toUpperCase()+t.slice(1)}</button>))}
          </div>
          <div className="bar" style={{marginBottom:16}}><div className="bar-f" style={{width:pct+"%",background:tabC}}/></div>
          {tasks.map(task=>(
            <div key={task.id} className="task-row" onClick={()=>toggleTask(task.id)}>
              <div className={`chk${done[task.id]?" on":""}`}>{done[task.id]&&<span style={{fontSize:12,color:"#fff"}}>✓</span>}</div>
              <div style={{width:6,height:6,borderRadius:"50%",background:task.p==="high"?"#dc2626":task.p==="medium"?"#d97706":"#16a34a",flexShrink:0,marginTop:6}}/>
              <span style={{flex:1,fontSize:14,lineHeight:1.5,color:"#18181b",textDecoration:done[task.id]?"line-through":"none",opacity:done[task.id]?.5:1}}>{task.text}</span>
            </div>
          ))}
        </div>

        {/* Habits + Confidence */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <div className="card cp">
            <div className="eyebrow" style={{color:"#a1a1aa",marginBottom:10}}>🔥 Habits</div>
            <div style={{fontSize:16,fontWeight:900,color:"#1c3d2e",marginBottom:14}}>{habits.filter(h=>h.done).length}/{habits.length}<span style={{fontSize:11,fontWeight:600,color:"#a1a1aa"}}> today</span></div>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {habits.map(h=>(<div key={h.id} style={{display:"flex",alignItems:"center",gap:10}}>
                <button className={`hring${h.done?" on":""}`} onClick={()=>toggleHabit(h.id)}>{h.icon}</button>
                <div><div style={{fontSize:12,fontWeight:700}}>{h.name}</div><div style={{fontSize:10,color:"#a1a1aa"}}>{h.streak}d</div></div>
              </div>))}
            </div>
          </div>
          <div className="card cp">
            <div className="eyebrow" style={{color:"#a1a1aa",marginBottom:10}}>💪 Confidence</div>
            <p style={{fontSize:11,color:"#a1a1aa",marginBottom:12,lineHeight:1.5}}>Rate yourself honestly.</p>
            <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:4,marginBottom:12}}>
              {[1,2,3,4,5,6,7,8,9,10].map(n=>(<button key={n} onClick={()=>setConf(n)} style={{padding:"8px 0",borderRadius:7,border:"1.5px solid",borderColor:conf===n?"#1c3d2e":"#e8e2d9",background:conf===n?"#1c3d2e":"#fff",color:conf===n?"#fff":"#52525b",fontWeight:700,fontSize:13,cursor:"pointer"}}>{n}</button>))}
            </div>
            <p style={{fontSize:11,color:"#52525b",marginBottom:10,lineHeight:1.5}}>{conf<=3?"Struggling — name one thing you control.":conf<=6?"Middle ground. Push through.":"Strong. Tackle hardest first."}</p>
            <button className="btn btn-g" onClick={saveConf} style={{width:"100%",fontSize:12}}>{confSaved?"Saved ✓":`Log ${conf}/10`}</button>
          </div>
        </div>

        {/* Check-in + Wins */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <div className="card cp">
            <div className="eyebrow" style={{color:"#a1a1aa",marginBottom:10}}>📝 Check-In</div>
            <textarea value={ciNote} onChange={e=>setCiNote(e.target.value)} placeholder="Status, blocker, or thought." rows={3} style={{resize:"none",marginBottom:8,fontSize:13}}/>
            <button className="btn btn-g" onClick={addCi} style={{width:"100%",fontSize:12}}>Log</button>
            <div style={{marginTop:10,display:"flex",flexDirection:"column",gap:6,maxHeight:110,overflowY:"auto"}}>
              {checkins.slice(0,3).map(c=>(<div key={c.id} style={{padding:"8px 10px",background:"#f7f4ef",borderRadius:8}}><p style={{fontSize:12,color:"#18181b",lineHeight:1.4}}>{c.note}</p><p style={{fontSize:10,color:"#a1a1aa",marginTop:3}}>{c.date} · {c.time}</p></div>))}
              {!checkins.length&&<p style={{fontSize:11,color:"#a1a1aa",textAlign:"center"}}>No check-ins yet.</p>}
            </div>
          </div>
          <div className="card cp">
            <div className="eyebrow" style={{color:"#a1a1aa",marginBottom:10}}>🏆 Wins</div>
            <input value={winIn} onChange={e=>setWinIn(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addWin()} placeholder="What did you do right?" style={{marginBottom:8,fontSize:13}}/>
            <button className="btn btn-g" onClick={addWin} style={{width:"100%",fontSize:12,marginBottom:10}}>Log Win</button>
            <div style={{display:"flex",flexDirection:"column",gap:6,maxHeight:110,overflowY:"auto"}}>
              {wins.slice(0,4).map(w=>(<div key={w.id} style={{display:"flex",gap:8}}><span>⭐</span><div><p style={{fontSize:12,lineHeight:1.4}}>{w.text}</p><p style={{fontSize:10,color:"#a1a1aa"}}>{w.date}</p></div></div>))}
              {!wins.length&&<p style={{fontSize:11,color:"#a1a1aa",textAlign:"center"}}>No wins yet.</p>}
            </div>
          </div>
        </div>

        {/* Financial */}
        <div className="card cpx">
          <div className="eyebrow" style={{color:"#1e3a5f",marginBottom:6}}>📈 Financial Tracker</div>
          <h2 className="title" style={{fontSize:"clamp(16px,4vw,20px)",marginBottom:16}}>Budget Snapshot</h2>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16}}>
            {[{k:"income",l:"Monthly Income",ph:"e.g. 5000"},{k:"fixed",l:"Fixed Costs",ph:"rent, loans..."},{k:"variable",l:"Variable",ph:"food, gas..."},{k:"target",l:"Target",ph:"stability #"}].map(f=>(
              <div key={f.k}><label style={{fontSize:10,fontWeight:700,color:"#a1a1aa",letterSpacing:1,textTransform:"uppercase",display:"block",marginBottom:4}}>{f.l}</label>
              <input value={budget[f.k]} onChange={e=>{const n={...budget,[f.k]:e.target.value};setBudget(n);ls.set("v3_budget",n);}} placeholder={f.ph} style={{fontSize:13}}/></div>
            ))}
          </div>
          {(budget.income||budget.fixed)&&(
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:16}}>
              {[{l:"Spend",v:"$"+(bCalc.spend||0).toLocaleString(),c:"#dc2626"},{l:"Left Over",v:"$"+(bCalc.left||0).toLocaleString(),c:bCalc.left>=0?"#16a34a":"#dc2626"},{l:"Gap",v:bCalc.gap>0?"-$"+bCalc.gap.toLocaleString():"✓ OK",c:bCalc.gap>0?"#dc2626":"#16a34a"}].map(s=>(
                <div key={s.l} style={{padding:10,background:"#f7f4ef",borderRadius:10,textAlign:"center"}}>
                  <div style={{fontSize:"clamp(14px,3.5vw,18px)",fontWeight:900,color:s.c}}>{s.v}</div>
                  <div className="eyebrow" style={{color:"#a1a1aa",fontSize:9,marginTop:3}}>{s.l}</div>
                </div>
              ))}
            </div>
          )}
          <div className="eyebrow" style={{color:"#a1a1aa",marginBottom:10}}>Savings Goals</div>
          {savings.map(sg=>{const p=Math.min(100,Math.round((sg.current/sg.target)*100));return(
            <div key={sg.id} style={{marginBottom:12}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                <span style={{fontSize:13,fontWeight:600}}>{sg.name}</span>
                <span style={{fontSize:12,color:"#52525b"}}>${sg.current.toLocaleString()}/${sg.target.toLocaleString()}</span>
              </div>
              <div className="bar"><div className="bar-f" style={{width:p+"%",background:"#1e3a5f"}}/></div>
              <input placeholder="Update current amount" style={{marginTop:6,fontSize:12,padding:"6px 10px"}} onBlur={e=>{const v=parseFloat(e.target.value);if(!isNaN(v)){const n=savings.map(s=>s.id===sg.id?{...s,current:v}:s);setSavings(n);ls.set("v3_sav",n);e.target.value="";}}}/>
            </div>
          );})}
        </div>

        {/* AI Chat */}
        <div className="card cpx">
          <div className="eyebrow" style={{color:"#1c3d2e",marginBottom:6}}>🤖 AI Coach Chat</div>
          <h2 className="title" style={{fontSize:"clamp(16px,4vw,20px)",marginBottom:4}}>Talk to Your Coach</h2>
          <p style={{fontSize:12,color:"#a1a1aa",marginBottom:14}}>Work stress, decisions, confidence, finances. Direct and honest.</p>
          <div className="chat-box" style={{marginBottom:12}}>
            {msgs.map((m,i)=>(<div key={i} className={m.r==="user"?"bm":"ba"}>{m.t}</div>))}
            {chatLoad&&<div className="ba" style={{display:"flex",gap:8,alignItems:"center"}}><div className="spin spin-d"/><span style={{fontSize:12,color:"#a1a1aa"}}>Thinking...</span></div>}
            <div ref={chatEnd}/>
          </div>
          <div style={{display:"flex",gap:8}}>
            <input value={chatIn} onChange={e=>setChatIn(e.target.value)} onKeyDown={e=>e.key==="Enter"&&!e.shiftKey&&sendChat()} placeholder="Type anything..."/>
            <button className="btn btn-g" onClick={sendChat} disabled={chatLoad||!chatIn.trim()} style={{opacity:chatLoad||!chatIn.trim()?.5:1,minWidth:64}}>{chatLoad?<span className="spin"/>:"Send"}</button>
          </div>
          <div className="qpr">
            {["I'm stressed about work","Help me prioritize","I'm avoiding something","Financial pressure"].map(p=>(<button key={p} className="qp" onClick={()=>setChatIn(p)}>{p}</button>))}
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="sc">
        {/* Next check-in */}
        <div className="card" style={{background:"linear-gradient(135deg,#1c3d2e,#163325)",padding:16}}>
          <div className="eyebrow" style={{color:"#a8d4b0",marginBottom:6}}>⏱ Next Check-In</div>
          <div className="title" style={{fontSize:17,color:"#fff",marginBottom:4}}>
            {(()=>{const h=new Date().getHours(),m=new Date().getMinutes(),now=h*60+m;const pts=[{m:5*60,l:"Gym"},{m:8*60,l:"Morning Briefing"},{m:13*60,l:"Midday Pulse"},{m:20*60,l:"Evening Review"},{m:22*60,l:"Pre-Sleep"}];const next=pts.find(p=>p.m>now)||pts[0];const diff=next.m>now?next.m-now:next.m+1440-now;return `${next.l} · ${diff>=60?Math.floor(diff/60)+"h "+(diff%60)+"m":diff+"m"}`;})()}
          </div>
          <p style={{fontSize:12,color:"#a8d4b0"}}>Via Telegram · 5 touchpoints daily</p>
        </div>

        {/* TG Todos */}
        <div className="card cp">
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <div><div className="eyebrow" style={{color:"#0088cc",marginBottom:3}}>📱 Telegram Tasks</div><h3 style={{fontSize:15,fontWeight:800}}>From Your Bot</h3></div>
            <button onClick={fetchTg} style={{background:"none",border:"none",fontSize:11,fontWeight:700,color:"#0088cc",cursor:"pointer"}}>{tgLoad?"...":"REFRESH →"}</button>
          </div>
          {tgTodos.filter(t=>!t.done).length===0?(<div style={{textAlign:"center",padding:"12px 0"}}><p style={{fontSize:13,color:"#a1a1aa"}}>No tasks yet.</p><p style={{fontSize:11,color:"#c4bdb5",marginTop:4,fontStyle:"italic"}}>"add [task] to my list"</p></div>):
          tgTodos.filter(t=>!t.done).slice(0,8).map(todo=>(<div key={todo.id} className="tgr">
            <button className="tgc" onClick={()=>markTgDone(todo.id)}/>
            <div style={{flex:1,minWidth:0}}>
              <p style={{fontSize:13,fontWeight:500,lineHeight:1.4}}>{todo.text}</p>
              <span style={{display:"inline-flex",alignItems:"center",gap:3,padding:"2px 7px",borderRadius:12,fontSize:10,fontWeight:700,border:`1px solid ${CAT_C[todo.category]||"#3f3f46"}`,color:CAT_C[todo.category]||"#3f3f46",marginTop:4}}>{CAT_E[todo.category]||"📌"} {todo.category}</span>
            </div>
            <button onClick={()=>delTg(todo.id)} style={{background:"none",border:"none",color:"#ddd",cursor:"pointer",fontSize:18,lineHeight:1,flexShrink:0}}>×</button>
          </div>))}
          {tgTodos.filter(t=>t.done).slice(0,3).length>0&&(<div style={{marginTop:10,paddingTop:10,borderTop:"1px solid #f5f0ea"}}><div className="eyebrow" style={{color:"#a1a1aa",marginBottom:6,fontSize:9}}>Completed</div>{tgTodos.filter(t=>t.done).slice(0,3).map(t=>(<p key={t.id} style={{fontSize:12,color:"#a1a1aa",textDecoration:"line-through",padding:"2px 0"}}>{t.text}</p>))}</div>)}
        </div>

        {/* Live Coaching */}
        <div className="card" style={{background:"linear-gradient(135deg,#0088cc,#005fa3)",padding:16}}>
          <div className="eyebrow" style={{color:"#a8d8f0",marginBottom:6}}>📱 Live Coaching</div>
          <h3 style={{fontSize:16,fontWeight:800,color:"#fff",marginBottom:8}}>Telegram Bot Active</h3>
          <p style={{fontSize:12,color:"#cce8f7",lineHeight:1.6,marginBottom:12}}>5 touchpoints push to your phone daily.</p>
          {TPTS.map(([t,l])=>(<div key={t} style={{display:"flex",justifyContent:"space-between",marginBottom:5}}><span style={{fontSize:12,color:"#cce8f7"}}>{l}</span><span className="mono" style={{fontSize:11,color:"#fff"}}>{t}</span></div>))}
          <a href="https://t.me/liamaccountabilitybot" target="_blank" rel="noopener noreferrer" style={{display:"block",marginTop:14,background:"rgba(255,255,255,.15)",borderRadius:8,padding:10,textAlign:"center",color:"#fff",fontFamily:"'Nunito Sans',sans-serif",fontSize:13,fontWeight:700,textDecoration:"none"}}>Open Telegram →</a>
        </div>

        {/* Calendar */}
        <div className="card cp">
          <div className="eyebrow" style={{color:"#1c3d2e",marginBottom:6}}>📅 Calendar Sync</div>
          <h3 style={{fontSize:15,fontWeight:800,marginBottom:8}}>Add All Events</h3>
          <p style={{fontSize:12,color:"#a1a1aa",lineHeight:1.6,marginBottom:12}}>Downloads .ics file — opens in Apple Calendar, Google, or Outlook. Alerts built in.</p>
          {[["5:00am","🏋️ Gym","Daily · 15min alert"],["8:00am","☀️ Morning Briefing","Daily · 10min alert"],["1:00pm","⚡ Midday Pulse","Daily · 5min alert"],["8:00pm","🌙 Evening Review","Daily · 10min alert"],["10:00pm","😴 Pre-Sleep","Daily · 15min alert"]].map(([t,l,s])=>(
            <div key={t} className="divrow"><div><div style={{fontSize:12,fontWeight:700}}>{l}</div><div style={{fontSize:10,color:"#a1a1aa"}}>{s}</div></div><span className="mono" style={{fontSize:11,fontWeight:700,color:"#1c3d2e"}}>{t}</span></div>
          ))}
          <a href="/api/calendar" download="liam-accountability.ics" style={{display:"block",marginTop:14,background:"#1c3d2e",color:"#fff",borderRadius:10,padding:"11px 0",textAlign:"center",fontFamily:"'Nunito Sans',sans-serif",fontSize:13,fontWeight:700,textDecoration:"none"}}>⬇ Download Calendar File</a>
        </div>

        {/* Morning Routine */}
        <div className="card cp">
          <div className="eyebrow" style={{color:"#a1a1aa",marginBottom:10}}>⏰ Morning Routine</div>
          {[["4:45","Wake up · water · no phone"],["5:00","🏋️ Gym"],["6:00","Shower → leader mode"],["6:15","Breakfast · zero scroll"],["6:25","📊 Dashboard · set #1"],["6:35","Family time (15 min)"],["6:50","Pack · top 3 priorities"],["7:00","Out the door with a plan"]].map(([t,l])=>(
            <div key={t} className="rtrow"><span className="mono" style={{fontSize:11,color:"#1c3d2e",minWidth:38}}>{t}</span><span style={{fontSize:12,color:"#52525b"}}>{l}</span></div>
          ))}
        </div>

        {/* Reminder */}
        <div className="card cp" style={{background:"#f7f4ef",border:"1px dashed #e8e2d9"}}>
          <div className="eyebrow" style={{color:"#a1a1aa",marginBottom:8}}>💡 Coach's Reminder</div>
          <p style={{fontSize:13,fontStyle:"italic",color:"#52525b",lineHeight:1.75}}>"You don't need certainty before action. You need self-trust. The goal isn't to solve your whole life. It's to stabilize the next step."</p>
          <p style={{marginTop:12,fontSize:12,fontWeight:800,color:"#1c3d2e"}}>WHAT ARE YOU GOING TO DO NEXT?</p>
        </div>
      </div>

      {toast&&<div className="toast">{toast}</div>}
    </div>
  );
}
