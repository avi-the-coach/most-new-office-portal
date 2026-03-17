// Portal Agent — Floating chat assistant with cross-page persistence
// Auto-detects option from URL, applies matching personality + theme

(function() {

  // ── Theme definitions per option ────────────────────────────────────
  const THEMES = {
    'option-1': {
      agentName: 'CTRL',
      agentSubtitle: 'סייען פיקוד',
      agentIcon: '⚡',
      btnBg: 'linear-gradient(135deg, #00c2e0 0%, #7c3aed 100%)',
      bg: '#0d1629',
      border: '#1e3358',
      textPrimary: '#e2eaf8',
      textSecondary: '#8fa3c8',
      accent: '#00c2e0',
      accentAlpha: 'rgba(0,194,224,0.12)',
      bubbleAgent: '#111d35',
      bubbleUser: 'linear-gradient(135deg, #00c2e0, #0090a8)',
      headerBg: '#0a1020',
      inputBg: '#111d35',
    },
    'option-2': {
      agentName: 'עוזר הפורטל',
      agentSubtitle: 'שירות עובדים',
      agentIcon: '🏛️',
      btnBg: '#0e4d9b',
      bg: '#ffffff',
      border: '#dde1e7',
      textPrimary: '#1a2b4a',
      textSecondary: '#5a6474',
      accent: '#0e4d9b',
      accentAlpha: 'rgba(14,77,155,0.08)',
      bubbleAgent: '#f0f4ff',
      bubbleUser: '#0e4d9b',
      headerBg: '#f7f9fc',
      inputBg: '#f0f2f5',
    },
    'option-3': {
      agentName: 'Sparks',
      agentSubtitle: 'הסייע החכם',
      agentIcon: '✨',
      btnBg: 'linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)',
      bg: 'rgba(12,9,36,0.97)',
      border: 'rgba(167,139,250,0.22)',
      textPrimary: '#f0f0ff',
      textSecondary: 'rgba(240,240,255,0.55)',
      accent: '#a78bfa',
      accentAlpha: 'rgba(167,139,250,0.1)',
      bubbleAgent: 'rgba(255,255,255,0.06)',
      bubbleUser: 'linear-gradient(135deg, #7c3aed, #a78bfa)',
      headerBg: 'rgba(255,255,255,0.04)',
      inputBg: 'rgba(255,255,255,0.05)',
      glass: true,
    },
  };

  function detectOption() {
    const p = window.location.pathname + window.location.href;
    if (p.includes('option-3')) return 'option-3';
    if (p.includes('option-2')) return 'option-2';
    return 'option-1';
  }

  const opt = detectOption();
  const T = THEMES[opt];

  // ── CSS ─────────────────────────────────────────────────────────────
  const css = `
    .pa-fab {
      position:fixed; bottom:24px; right:24px; z-index:8500;
      width:58px; height:58px; border-radius:50%; border:none; cursor:pointer;
      background:${T.btnBg}; color:#fff; font-size:24px;
      display:flex; align-items:center; justify-content:center;
      box-shadow:0 4px 20px rgba(0,0,0,0.35);
      transition:transform 0.2s, box-shadow 0.2s;
      animation:pa-pulse 3s ease-in-out infinite;
    }
    .pa-fab:hover { transform:scale(1.1); box-shadow:0 6px 28px rgba(0,0,0,0.45); animation:none; }
    .pa-fab.open  { transform:scale(0.9); animation:none; }
    @keyframes pa-pulse {
      0%,100% { box-shadow:0 4px 20px rgba(0,0,0,0.35); }
      50%      { box-shadow:0 4px 20px rgba(0,0,0,0.35), 0 0 0 8px ${T.accentAlpha}; }
    }

    .pa-win {
      position:fixed; bottom:94px; right:24px; z-index:8500;
      width:380px; height:560px; border-radius:20px;
      display:flex; flex-direction:column; overflow:hidden;
      background:${T.bg}; border:1.5px solid ${T.border};
      box-shadow:0 24px 60px rgba(0,0,0,0.5);
      direction:rtl; font-family:'Heebo',sans-serif;
      opacity:0; transform:scale(0.88) translateY(12px); pointer-events:none;
      transition:opacity 0.22s ease, transform 0.22s ease;
      ${T.glass ? 'backdrop-filter:blur(16px);' : ''}
    }
    .pa-win.show { opacity:1; transform:scale(1) translateY(0); pointer-events:all; }

    .pa-hdr {
      padding:13px 14px 11px; flex-shrink:0;
      display:flex; align-items:center; gap:10px;
      background:${T.headerBg}; border-bottom:1px solid ${T.border};
    }
    .pa-av {
      width:34px; height:34px; border-radius:50%; flex-shrink:0;
      background:${T.btnBg}; display:flex; align-items:center;
      justify-content:center; font-size:17px;
    }
    .pa-hdr-info { flex:1; }
    .pa-nm  { font-size:14px; font-weight:700; color:${T.textPrimary}; line-height:1.2; }
    .pa-sub { font-size:11px; color:${T.textSecondary}; }
    .pa-dot { width:7px; height:7px; background:#22c55e; border-radius:50%; flex-shrink:0; }
    .pa-x   {
      background:none; border:none; color:${T.textSecondary};
      cursor:pointer; font-size:17px; line-height:1; padding:2px 4px;
      transition:color 0.15s;
    }
    .pa-x:hover { color:${T.textPrimary}; }

    .pa-msgs {
      flex:1; overflow-y:auto; padding:14px 12px; display:flex;
      flex-direction:column; gap:9px; scroll-behavior:smooth;
    }
    .pa-msgs::-webkit-scrollbar { width:3px; }
    .pa-msgs::-webkit-scrollbar-thumb { background:${T.border}; border-radius:2px; }

    .pa-starters { display:flex; flex-direction:column; gap:7px; }
    .pa-sl { font-size:11px; color:${T.textSecondary}; margin-bottom:1px; }
    .pa-s {
      background:transparent; border:1px solid ${T.border};
      border-radius:11px; padding:9px 13px; color:${T.textPrimary};
      font-size:13px; text-align:right; cursor:pointer; font-family:inherit;
      transition:all 0.16s; line-height:1.4;
    }
    .pa-s:hover { border-color:${T.accent}; color:${T.accent}; background:${T.accentAlpha}; }

    .pa-divider {
      font-size:11px; color:${T.textSecondary}; text-align:center;
      padding:4px 0; opacity:0.6;
    }

    .pa-m {
      max-width:83%; padding:9px 13px; border-radius:14px;
      font-size:13.5px; line-height:1.6; word-break:break-word;
    }
    .pa-m.u { align-self:flex-start; background:${T.bubbleUser}; color:#fff; border-radius:14px 14px 4px 14px; }
    .pa-m.a {
      align-self:flex-end; background:${T.bubbleAgent}; color:${T.textPrimary};
      border:1px solid ${T.border}; border-radius:14px 14px 14px 4px;
    }
    .pa-m.t {
      align-self:flex-end; background:${T.bubbleAgent}; border:1px solid ${T.border};
      border-radius:14px 14px 14px 4px; padding:12px 15px;
    }
    .pa-dots { display:flex; gap:4px; align-items:center; }
    .pa-dots span {
      width:6px; height:6px; background:${T.textSecondary}; border-radius:50%;
      animation:pa-d 1.2s ease-in-out infinite;
    }
    .pa-dots span:nth-child(2) { animation-delay:0.2s; }
    .pa-dots span:nth-child(3) { animation-delay:0.4s; }
    @keyframes pa-d {
      0%,60%,100% { transform:translateY(0); opacity:0.4; }
      30%          { transform:translateY(-5px); opacity:1; }
    }

    .pa-inp-row {
      padding:9px 11px; border-top:1px solid ${T.border};
      display:flex; gap:7px; align-items:center; flex-shrink:0;
    }
    .pa-inp {
      flex:1; background:${T.inputBg}; border:1px solid ${T.border};
      border-radius:10px; padding:8px 11px; color:${T.textPrimary};
      font-size:13px; font-family:inherit; direction:rtl; outline:none;
      transition:border-color 0.18s;
    }
    .pa-inp::placeholder { color:${T.textSecondary}; }
    .pa-inp:focus { border-color:${T.accent}; }
    .pa-send {
      width:34px; height:34px; border-radius:9px; border:none;
      background:${T.btnBg}; color:#fff; cursor:pointer;
      display:flex; align-items:center; justify-content:center;
      font-size:15px; transition:opacity 0.18s, transform 0.12s; flex-shrink:0;
    }
    .pa-send:hover { opacity:0.85; transform:scale(1.06); }
  `;

  if (!document.getElementById('pa-css')) {
    const s = document.createElement('style');
    s.id = 'pa-css';
    s.textContent = css;
    document.head.appendChild(s);
  }

  // ── State ────────────────────────────────────────────────────────────
  const LS_KEY = 'portal-agent';
  function loadState() { try { return JSON.parse(localStorage.getItem(LS_KEY) || '{}'); } catch { return {}; } }
  function saveState(st) { try { localStorage.setItem(LS_KEY, JSON.stringify(st)); } catch {} }

  let state = loadState();
  let convState = 'idle';

  // ── DOM ──────────────────────────────────────────────────────────────
  const fab = document.createElement('button');
  fab.className = 'pa-fab';
  fab.title = T.agentName;
  fab.textContent = T.agentIcon;

  const win = document.createElement('div');
  win.className = 'pa-win';
  win.innerHTML = `
    <div class="pa-hdr">
      <div class="pa-av">${T.agentIcon}</div>
      <div class="pa-hdr-info">
        <div class="pa-nm">${T.agentName}</div>
        <div class="pa-sub">${T.agentSubtitle}</div>
      </div>
      <div class="pa-dot"></div>
      <button class="pa-x" id="pa-x">✕</button>
    </div>
    <div class="pa-msgs" id="pa-msgs"></div>
    <div class="pa-inp-row">
      <input class="pa-inp" id="pa-inp" placeholder="כתבו הודעה..." autocomplete="off">
      <button class="pa-send" id="pa-send">➤</button>
    </div>
  `;

  document.body.append(fab, win);
  const msgsEl  = document.getElementById('pa-msgs');
  const inputEl = document.getElementById('pa-inp');

  fab.addEventListener('click', toggleWin);
  document.getElementById('pa-x').addEventListener('click', closeWin);
  document.getElementById('pa-send').addEventListener('click', submit);
  inputEl.addEventListener('keydown', e => { if (e.key === 'Enter') submit(); });

  // ── Open / Close ─────────────────────────────────────────────────────
  function toggleWin() { win.classList.contains('show') ? closeWin() : openWin(); }

  function openWin() {
    win.classList.add('show');
    fab.classList.add('open');
    state.open = true;
    saveState(state);
    renderMessages();
  }
  function closeWin() {
    win.classList.remove('show');
    fab.classList.remove('open');
    state.open = false;
    saveState(state);
  }

  if (state.open) openWin();

  // ── Render ───────────────────────────────────────────────────────────
  function renderMessages() {
    const msgs = state.messages || [];
    if (msgs.length === 0) { showStarters(); return; }
    msgsEl.innerHTML = '';
    msgs.forEach(m => appendMsgEl(m.role, m.html));
    scrollBottom();
  }

  // Initial empty-state starters (full greeting)
  function showStarters() {
    msgsEl.innerHTML = `
      <div class="pa-m a">שלום! אני ${T.agentName} — כאן לעזור. מה נעשה?</div>
      ${buildStartersHTML('בחרו נושא או כתבו בחופשיות:')}`;
    bindStarters(false);
  }

  // Starters appended after a completed flow
  function appendStarters() {
    setTimeout(() => {
      // Remove existing starters block if any
      const old = msgsEl.querySelector('.pa-starters-block');
      if (old) old.remove();

      const wrapper = document.createElement('div');
      wrapper.className = 'pa-starters-block';
      wrapper.innerHTML = `
        <div class="pa-divider">— מה עוד? —</div>
        ${buildStartersHTML('בחרו פעולה:')}`;
      wrapper.querySelectorAll('.pa-s').forEach(b =>
        b.addEventListener('click', () => {
          wrapper.remove();
          handleStarterContinue(b.dataset.id, b.textContent.trim());
        })
      );
      msgsEl.appendChild(wrapper);
      scrollBottom();
    }, 900);
  }

  function buildStartersHTML(label) {
    const starters = [
      { id: 'req',     text: '📋 פתיחת בקשה או קריאה' },
      { id: 'doc',     text: '📄 חיפוש מסמך' },
      { id: 'brief',   text: '☀️ מה יש לי היום?' },
      { id: 'contact', text: '👤 מי מטפל ב...?' },
      { id: 'bday',    text: '🎂 ברכה לעמית' },
    ];
    return `<div class="pa-starters">
      <div class="pa-sl">${label}</div>
      ${starters.map(s => `<button class="pa-s" data-id="${s.id}">${s.text}</button>`).join('')}
    </div>`;
  }

  function bindStarters(continueMode) {
    msgsEl.querySelectorAll('.pa-s').forEach(b =>
      b.addEventListener('click', () => {
        if (continueMode) {
          const block = b.closest('.pa-starters-block');
          if (block) block.remove();
          handleStarterContinue(b.dataset.id, b.textContent.trim());
        } else {
          handleStarterFresh(b.dataset.id, b.textContent.trim());
        }
      })
    );
  }

  // ── Message helpers ──────────────────────────────────────────────────
  function appendMsgEl(role, html) {
    const d = document.createElement('div');
    d.className = 'pa-m ' + role;
    d.innerHTML = html;
    msgsEl.appendChild(d);
    return d;
  }

  function addMsg(role, html) {
    if (!state.messages) state.messages = [];
    state.messages.push({ role, html, ts: Date.now() });
    saveState(state);
    appendMsgEl(role, html);
    scrollBottom();
  }

  function scrollBottom() { msgsEl.scrollTop = msgsEl.scrollHeight; }

  // ── Typing + respond ─────────────────────────────────────────────────
  function showTyping() {
    const d = document.createElement('div');
    d.className = 'pa-m t'; d.id = 'pa-typing';
    d.innerHTML = '<div class="pa-dots"><span></span><span></span><span></span></div>';
    msgsEl.appendChild(d); scrollBottom();
  }
  function hideTyping() { const e = document.getElementById('pa-typing'); if (e) e.remove(); }

  // respond(html, speech, delay)
  // speech = what TTS reads (short, clean, no emojis) — if omitted, skips TTS
  async function respond(html, speech, delay) {
    if (typeof speech === 'number') { delay = speech; speech = null; }
    delay = delay || 850;
    showTyping();
    await new Promise(r => setTimeout(r, delay + Math.random() * 200));
    hideTyping();
    addMsg('a', html);
    if (speech) speakText(speech);
  }

  // ── Submit ───────────────────────────────────────────────────────────
  function submit() {
    const text = inputEl.value.trim(); if (!text) return;
    inputEl.value = '';
    // Clear initial starters if still showing
    if (msgsEl.querySelector('.pa-starters') && !state.messages?.length) {
      msgsEl.innerHTML = '';
      addMsg('a', `שלום! אני ${T.agentName} — כאן לעזור. מה נעשה?`);
    }
    // Remove appended starters block
    const block = msgsEl.querySelector('.pa-starters-block');
    if (block) block.remove();

    addMsg('u', text);
    processInput(text);
  }

  // Fresh start (clears history)
  function handleStarterFresh(id, display) {
    msgsEl.innerHTML = '';
    state.messages = [];
    addMsg('u', display);
    runFlow(id);
  }

  // Continue in existing conversation
  function handleStarterContinue(id, display) {
    addMsg('u', display);
    runFlow(id);
  }

  function runFlow(id) {
    const flows = { req: flowReq, doc: flowDoc, brief: flowBrief, contact: flowContact, bday: flowBday };
    if (flows[id]) flows[id]();
  }

  // ── Intent detection ─────────────────────────────────────────────────
  function processInput(text) {
    const t = text;
    if (convState === 'req-q1')     { convState = 'idle'; doReq(t); return; }
    if (convState === 'doc-q1')     { convState = 'idle'; doDoc(t); return; }
    if (convState === 'contact-q1') { convState = 'idle'; doContact(t); return; }
    if (convState === 'bday-q1')    { convState = 'idle'; doBday(t); return; }

    if      (t.match(/בקשה|קריאה|תקלה|תחזוקה|ציוד|פנייה/)) flowReq();
    else if (t.match(/מסמך|נוהל|הדרכה|לחפש|חפש/))          flowDoc();
    else if (t.match(/היום|briefing|סיכום|מה יש|לוח/))      flowBrief();
    else if (t.match(/מי|קשר|יחידה|מטפל|אחראי/))            flowContact();
    else if (t.match(/ברכה|יום הולדת|אחל/))                 flowBday();
    else {
      respond('לא הבנתי. נסחו שוב, או בחרו אחת מהאפשרויות למטה.', 'לא הבנתי, בחרו מהאפשרויות', 600);
      appendStarters();
    }
  }

  // ── Flows ────────────────────────────────────────────────────────────
  async function flowReq() {
    convState = 'req-q1';
    await respond(
      'בטח! ספרו לי בקצרה — במה מדובר?<br><em style="font-size:12px;opacity:0.65">למשל: "מקלדת שבורה", "בקשת ציוד", "תקלה ברשת"</em>',
      'ספרו לי מה קרה'
    );
  }

  async function doReq(desc) {
    await respond(
      'מעולה. מעביר אתכם לדף הבקשות ומכין את הטופס...',
      'מעביר לדף הבקשות'
    );
    state.pendingAction = { type: 'fill-req', data: { desc } };
    saveState(state);
    setTimeout(() => { window.location.href = 'report.html'; }, 1300);
  }

  async function flowDoc() {
    convState = 'doc-q1';
    await respond(
      'כמובן! מה המסמך שאתם מחפשים? (שם, נושא, קטגוריה)',
      'מה אתם מחפשים'
    );
  }

  async function doDoc(query) {
    await respond(
      `מחפש <strong>"${query}"</strong>... מעביר למאגר המידע.`,
      'מעביר למאגר המידע'
    );
    state.pendingAction = { type: 'search-doc', data: { query } };
    saveState(state);
    setTimeout(() => { window.location.href = 'info.html'; }, 1200);
  }

  async function flowBrief() {
    const d = window.PortalData || {};
    let html = '<strong>הסיכום שלך להיום:</strong><br><br>';
    let speechParts = [];

    const urgent = (d.announcements || []).filter(a => a.priority === 'high');
    if (urgent.length) {
      html += `<strong>${urgent.length} עדכון${urgent.length > 1 ? 'ים' : ''} דחוק${urgent.length > 1 ? 'ים' : ''}:</strong><br>`;
      urgent.slice(0, 2).forEach(a => { html += `&bull; ${a.title}<br>`; });
      html += '<br>';
      speechParts.push(`${urgent.length} עדכונים דחופים`);
    }

    const evts = (d.events || []).slice(0, 3);
    if (evts.length) {
      html += `<strong>אירועים קרובים:</strong><br>`;
      evts.forEach(e => { html += `&bull; ${e.title} — ${e.date}<br>`; });
      html += '<br>';
      speechParts.push(`${evts.length} אירועים קרובים`);
    }

    const bdays = (d.birthdays || []).filter(b => b.daysLeft <= 7);
    if (bdays.length) {
      html += `<strong>ימי הולדת בקרוב:</strong> ${bdays.map(b => b.name).join(', ')}`;
      speechParts.push(`${bdays.map(b => b.name).join(' ו')} חוגג${bdays.length > 1 ? 'ים' : ''} יום הולדת`);
    }

    if (speechParts.length === 0) {
      html = 'הכל שקט! אין עדכונים דחופים. יום עבודה רגוע לפניכם.';
      speechParts = ['הכל שקט, אין עדכונים דחופים'];
    }

    const speech = speechParts.join('. ');
    convState = 'idle';
    await respond(html, speech, 500);
    appendStarters();
  }

  async function flowContact() {
    convState = 'contact-q1';
    await respond(
      'לאיזה נושא צריך איש קשר?<br><em style="font-size:12px;opacity:0.65">יחידה, תפקיד, או נושא כמו "IT", "רכש", "הון אנושי"</em>',
      'לאיזה נושא צריך איש קשר'
    );
  }

  async function doContact(query) {
    const d = window.PortalData || {};
    const q = query.toLowerCase();
    const results = (d.contacts || []).filter(c =>
      (c.unit && c.unit.toLowerCase().includes(q)) ||
      (c.role && c.role.toLowerCase().includes(q)) ||
      (c.name && c.name.toLowerCase().includes(q))
    ).slice(0, 3);

    if (!results.length) {
      await respond(
        `לא מצאתי תוצאות עבור "<strong>${query}</strong>". עוברים לספר הטלפונים.`,
        'לא נמצא, עוברים לספר הטלפונים'
      );
      setTimeout(() => { window.location.href = 'contacts.html'; }, 1400);
      return;
    }
    let html = `נמצאו ${results.length} אנשי קשר:<br><br>`;
    results.forEach(c => {
      html += `<strong>${c.name}</strong> — ${c.role}<br>`;
      html += `שלוחה ${c.ext}<br><br>`;
    });
    const speech = results.map(c => `${c.name}, ${c.role}, שלוחה ${c.ext}`).join('. ');
    await respond(html, speech);
    appendStarters();
  }

  async function flowBday() {
    convState = 'bday-q1';
    await respond(
      'למי תרצו לשלוח ברכה? (שם העמית/ה)',
      'למי לשלוח ברכה'
    );
  }

  async function doBday(name) {
    const wishes = [
      `"${name} יקר/ה, יום הולדת שמח! שהשנה תביא לך בריאות, הצלחות ושמחה."`,
      `"יום הולדת שמח ${name}! כל הצוות שמח לעבוד איתך."`,
      `"${name}, שנה טובה! כך להמשיך קדימה."`,
    ];
    let html = `הנה שלוש ברכות עבור ${name}:<br><br>`;
    wishes.forEach((w, i) => { html += `<strong>${i+1}.</strong> ${w}<br><br>`; });
    html += `<em style="font-size:12px;opacity:0.65">לשליחה — לחצו על המייל של ${name} בספר הטלפונים.</em>`;
    await respond(html, `הנה שלוש ברכות עבור ${name}. בחרו אחת ושלחו במייל`);
    appendStarters();
  }

  // ── Pending action (cross-page) ──────────────────────────────────────
  function executePending() {
    const action = state.pendingAction;
    if (!action) return;
    delete state.pendingAction;
    saveState(state);
    setTimeout(() => {
      if (!win.classList.contains('show')) openWin();
      if (action.type === 'fill-req')    doFillReq(action.data.desc);
      else if (action.type === 'search-doc') doFillSearch(action.data.query);
    }, 700);
  }

  async function doFillReq(desc) {
    const lower = desc.toLowerCase();
    let typeId = 'it';
    if (lower.match(/ציוד|עט|נייר|כיסא|שולחן|הזמנה/))    typeId = 'request';
    else if (lower.match(/תחזוקה|מזגן|חשמל|נזילה|תיקון/)) typeId = 'maintenance';
    else if (lower.match(/אבטחה|סייבר|פרצה|גנוב/))        typeId = 'security';
    else if (lower.match(/רכש|רישיון|תוכנה/))              typeId = 'purchase';
    else if (lower.match(/כוח אדם|חופשה|תנאים|שכר/))      typeId = 'hr';

    if (opt === 'option-3') {
      // option-3: uses .type-tile, auto-advances to step 2 after 400ms, fields: #fTitle / #fDesc
      setTimeout(() => {
        const tile = document.querySelector(`.type-tile[data-id="${typeId}"]`);
        if (tile) tile.click();
      }, 300);
      // tile click triggers step 2 after its own 400ms — wait 300+400+200 buffer = 900ms total
      setTimeout(() => {
        const t = document.querySelector('#fTitle');
        if (t) { t.value = desc; t.dispatchEvent(new Event('input')); }
        const d2 = document.querySelector('#fDesc');
        if (d2) { d2.value = desc; d2.dispatchEvent(new Event('input')); }
      }, 950);
    } else {
      // option-1/2: .type-card + explicit goStep(2), fields: #f-title / #f-desc
      setTimeout(() => {
        const card = document.querySelector(`.type-card[data-id="${typeId}"]`);
        if (card) card.click();
      }, 300);
      setTimeout(() => {
        // Advance to step 2 (type card click only selects, doesn't advance)
        if (typeof window.goStep === 'function') window.goStep(2);
      }, 550);
      setTimeout(() => {
        const t = document.querySelector('#f-title');
        if (t) { t.value = desc; t.dispatchEvent(new Event('input')); }
        const d2 = document.querySelector('#f-desc');
        if (d2) { d2.value = desc; d2.dispatchEvent(new Event('input')); }
      }, 750);
    }

    await respond(
      'פתחתי לך את הטופס ומילאתי את הפרטים.<br>עברו לשלב הבא ואשרו את הבקשה.',
      'פתחתי את הטופס. אפשר לאשר ולשלוח',
      1200
    );
    appendStarters();
  }

  async function doFillSearch(query) {
    setTimeout(() => {
      const el = document.querySelector('#doc-search, .hero-search input, .search-hero input');
      if (el) { el.value = query; el.dispatchEvent(new Event('input')); }
    }, 400);
    await respond(
      `חיפשתי <strong>"${query}"</strong> במאגר המידע. הנה התוצאות.`,
      'הנה תוצאות החיפוש',
      500
    );
    appendStarters();
  }

  // ── TTS ──────────────────────────────────────────────────────────────
  function speakText(text) {
    if (!window.speechSynthesis) return;
    // Strip any residual HTML/entities, clean whitespace
    const clean = text.replace(/<[^>]+>/g, '').replace(/&[^;]+;/g, ' ').replace(/\s+/g, ' ').trim();
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(clean);
    u.lang = 'he-IL'; u.rate = 1.05;
    speechSynthesis.speak(u);
  }

  // ── Boot ─────────────────────────────────────────────────────────────
  executePending();

})();
