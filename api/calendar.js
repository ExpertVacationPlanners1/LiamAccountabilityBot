// api/calendar.js
// Generates a downloadable .ics calendar file with all accountability events
// Includes 5-minute alerts on every event

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();

  // Build start date: tomorrow, formatted as YYYYMMDD
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const pad = n => String(n).padStart(2, '0');
  const fmt = (d) => `${d.getFullYear()}${pad(d.getMonth()+1)}${pad(d.getDate())}`;
  const fmtDt = (d, h, m = 0) => {
    const dt = new Date(d);
    dt.setHours(h, m, 0, 0);
    return `${fmt(dt)}T${pad(dt.getHours())}${pad(dt.getMinutes())}00`;
  };

  const base = fmt(tomorrow);
  const uid = () => `liam-${Date.now()}-${Math.random().toString(36).slice(2)}@accountability`;
  const ts = new Date().toISOString().replace(/[-:]/g,'').replace('.000','');

  // All events definition
  const events = [
    // ── MORNING ROUTINE BLOCKS ───────────────────────────────────────────────
    {
      uid: uid(), summary: '🏋️ GYM — Non-Negotiable',
      start: fmtDt(tomorrow, 5, 0), end: fmtDt(tomorrow, 6, 0),
      description: 'Daily gym session. This is your foundation — protect it every single day.',
      rrule: 'RRULE:FREQ=DAILY',
      alarms: [{ trigger: '-PT15M', description: 'Gym in 15 minutes — get up now' }],
      color: 'GREEN'
    },
    {
      uid: uid(), summary: '🚿 Shower → Leader Mode',
      start: fmtDt(tomorrow, 6, 0), end: fmtDt(tomorrow, 6, 10),
      description: 'Shower in 10 minutes, transition into leader mode.',
      rrule: 'RRULE:FREQ=DAILY',
      alarms: [{ trigger: '-PT2M', description: 'Shower time — transition into your day' }],
      color: 'CYAN'
    },
    {
      uid: uid(), summary: '🥗 Protein Breakfast — Zero Scrolling',
      start: fmtDt(tomorrow, 6, 15), end: fmtDt(tomorrow, 6, 25),
      description: 'Protein-first breakfast. Sit down. Zero scrolling. You earned this.',
      rrule: 'RRULE:FREQ=DAILY',
      alarms: [{ trigger: '-PT2M', description: 'Breakfast time — no phone, no scrolling' }],
      color: 'CYAN'
    },
    {
      uid: uid(), summary: '📊 Dashboard Check-In — Set #1 Task',
      start: fmtDt(tomorrow, 6, 25), end: fmtDt(tomorrow, 6, 30),
      description: "Open dashboard, read today's briefing, set your #1 non-negotiable task. 5 minutes only.",
      rrule: 'RRULE:FREQ=DAILY',
      alarms: [
        { trigger: '-PT3M', description: "Dashboard check-in in 3 min — set today's #1 task" },
        { trigger: 'PT0M', description: "Open your dashboard NOW — set today's #1 non-negotiable" }
      ],
      color: 'BLUE'
    },
    {
      uid: uid(), summary: '👨‍👩‍👦 Family Time — Present & Calm',
      start: fmtDt(tomorrow, 6, 35), end: fmtDt(tomorrow, 6, 50),
      description: 'Family time. Present and calm, not rushed. 15 minutes — put the phone down.',
      rrule: 'RRULE:FREQ=DAILY;BYDAY=MO,TU,WE,TH,FR',
      alarms: [{ trigger: '-PT2M', description: 'Family time — be present, not rushed' }],
      color: 'PURPLE'
    },
    {
      uid: uid(), summary: '🎯 Pack Bag — Mental Run of Top 3',
      start: fmtDt(tomorrow, 6, 50), end: fmtDt(tomorrow, 7, 0),
      description: 'Pack your bag. Mentally run through your top 3 priorities for the day.',
      rrule: 'RRULE:FREQ=DAILY;BYDAY=MO,TU,WE,TH,FR',
      alarms: [{ trigger: '-PT2M', description: 'Pack up — mentally run top 3 for the day' }],
      color: 'CYAN'
    },

    // ── DAILY COACHING TOUCHPOINTS ───────────────────────────────────────────
    {
      uid: uid(), summary: '☀️ Morning Briefing — Daily Challenges',
      start: fmtDt(tomorrow, 8, 0), end: fmtDt(tomorrow, 8, 15),
      description: "Check Telegram for today's 3 category challenges (Work, Personal, Financial) and your daily target score. Set your intentions now.",
      rrule: 'RRULE:FREQ=DAILY',
      alarms: [
        { trigger: '-PT10M', description: 'Morning briefing in 10 min — check Telegram for your daily challenges' },
        { trigger: 'PT0M', description: 'Check your daily briefing on Telegram NOW — 3 challenges waiting' }
      ],
      color: 'YELLOW'
    },
    {
      uid: uid(), summary: '⚡ Midday Accountability Pulse',
      start: fmtDt(tomorrow, 13, 0), end: fmtDt(tomorrow, 13, 10),
      description: 'Stop. Check your score. Rate your focus. Adjust for the second half of the day.',
      rrule: 'RRULE:FREQ=DAILY',
      alarms: [
        { trigger: '-PT5M', description: 'Midday check-in in 5 min — check your daily score' },
        { trigger: 'PT0M', description: 'Midday pulse — rate your focus and adjust course for the afternoon' }
      ],
      color: 'ORANGE'
    },
    {
      uid: uid(), summary: '🌙 Evening Review — Log Your Day',
      start: fmtDt(tomorrow, 20, 0), end: fmtDt(tomorrow, 20, 15),
      description: 'Review your daily score. Log wins. Check challenge completions. Close the day with intention.',
      rrule: 'RRULE:FREQ=DAILY',
      alarms: [
        { trigger: '-PT10M', description: 'Evening review in 10 min — prep to close out the day' },
        { trigger: 'PT0M', description: 'Evening review — log your wins, check your score, close the day strong' }
      ],
      color: 'BLUE'
    },
    {
      uid: uid(), summary: '😴 Pre-Sleep Wind Down',
      start: fmtDt(tomorrow, 22, 0), end: fmtDt(tomorrow, 22, 10),
      description: "Write 3 things you did right today. Set tomorrow's intention. Put the phone down.",
      rrule: 'RRULE:FREQ=DAILY',
      alarms: [
        { trigger: '-PT15M', description: 'Wind down in 15 min — start wrapping up for sleep' },
        { trigger: 'PT0M', description: 'Pre-sleep — write 3 things you did right today, then put the phone down' }
      ],
      color: 'PURPLE'
    },

    // ── WEEKLY ───────────────────────────────────────────────────────────────
    {
      uid: uid(), summary: '📚 Personal Development Block',
      start: fmtDt(tomorrow, 8, 0), end: fmtDt(tomorrow, 8, 30),
      description: 'Weekly personal development time. Read, listen, or learn something that moves your career or confidence forward.',
      rrule: 'RRULE:FREQ=WEEKLY;BYDAY=SA',
      alarms: [{ trigger: '-PT10M', description: 'Personal development block in 10 min' }],
      color: 'GREEN'
    },
    {
      uid: uid(), summary: '💰 Weekly Financial Review',
      start: fmtDt(tomorrow, 9, 0), end: fmtDt(tomorrow, 9, 20),
      description: 'Review your budget, check savings progress, identify one financial action for the week.',
      rrule: 'RRULE:FREQ=WEEKLY;BYDAY=SU',
      alarms: [
        { trigger: '-PT10M', description: 'Weekly financial review in 10 min' },
        { trigger: 'PT0M', description: 'Weekly financial review — face your numbers, make one move' }
      ],
      color: 'BLUE'
    },
    {
      uid: uid(), summary: '👨‍👩‍👦 Family Planning — Sunday Check-In',
      start: fmtDt(tomorrow, 18, 0), end: fmtDt(tomorrow, 18, 30),
      description: 'Weekly family planning. 30 minutes every Sunday. Set the tone for the week ahead.',
      rrule: 'RRULE:FREQ=WEEKLY;BYDAY=SU',
      alarms: [{ trigger: '-PT15M', description: 'Family planning in 15 min' }],
      color: 'PURPLE'
    },
  ];

  // Build ICS content
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Liam Accountability System//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:Liam Accountability',
    'X-WR-TIMEZONE:America/New_York',
    'X-WR-CALDESC:Daily accountability events - morning routine, coaching touchpoints, challenges',
  ];

  for (const event of events) {
    lines.push('BEGIN:VEVENT');
    lines.push(`UID:${event.uid}`);
    lines.push(`DTSTAMP:${ts}Z`);
    lines.push(`DTSTART;TZID=America/New_York:${event.start}`);
    lines.push(`DTEND;TZID=America/New_York:${event.end}`);
    lines.push(`SUMMARY:${event.summary}`);
    lines.push(`DESCRIPTION:${event.description.replace(/,/g, '\\,')}`);
    lines.push(event.rrule);
    lines.push('STATUS:CONFIRMED');
    lines.push('TRANSP:TRANSPARENT');

    // Alarms
    for (const alarm of (event.alarms || [])) {
      lines.push('BEGIN:VALARM');
      lines.push('ACTION:DISPLAY');
      lines.push(`DESCRIPTION:${alarm.description}`);
      lines.push(`TRIGGER:${alarm.trigger}`);
      lines.push('END:VALARM');
    }

    lines.push('END:VEVENT');
  }

  lines.push('END:VCALENDAR');

  const icsContent = lines.join('\r\n');

  res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="liam-accountability.ics"');
  res.setHeader('Cache-Control', 'no-cache');
  return res.status(200).send(icsContent);
}
