class WalkMe {
  constructor(steps, theme = {}) {
    this.steps = steps;
    this.currentStep = 0;
    this.active = false;
    this.theme = {
      accent: theme.accent || '#00b4d8',
      bg: theme.bg || '#1a2540',
      border: theme.border || '#1e3a5f',
      textPrimary: theme.textPrimary || '#e2e8f0',
      textSecondary: theme.textSecondary || '#94a3b8',
      ...theme
    };
    this.overlay = null;
    this.tooltip = null;
    this._injectStyles();
    this._buildDOM();
    window._walkme = this;
  }

  // ── TTS ───────────────────────────────────────────────────────
  _speak(text) {
    if (!window.speechSynthesis) return;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'he-IL';
    u.rate = 1.0;
    u.pitch = 1.0;
    speechSynthesis.speak(u);
  }

  _speakCurrent() {
    const step = this.steps[this.currentStep];
    if (!step) return;
    const clean = step.text.replace(/<[^>]+>/g, '');
    this._speak(step.title + '. ' + clean);
  }

  _stopSpeech() {
    if (window.speechSynthesis) speechSynthesis.cancel();
  }

  // ── Styles ────────────────────────────────────────────────────
  _injectStyles() {
    if (document.getElementById('walkme-styles')) return;
    const s = document.createElement('style');
    s.id = 'walkme-styles';
    s.textContent = `
      .walkme-overlay {
        display: none; position: fixed; inset: 0; z-index: 9000;
        background: rgba(0,0,0,0.42); pointer-events: none;
        transition: opacity 0.25s;
      }
      .walkme-overlay.active { display: block; }

      .walkme-highlight-box {
        position: fixed; z-index: 9009; pointer-events: none;
        border-radius: 10px;
        box-shadow: 0 0 0 3px var(--wm-accent), 0 0 0 6px rgba(0,194,224,0.18), 0 0 30px rgba(0,194,224,0.12);
        transition: all 0.3s ease;
      }

      .walkme-tooltip {
        display: none; position: fixed; z-index: 9100;
        background: var(--wm-bg);
        border: 1.5px solid var(--wm-accent);
        border-radius: 14px;
        padding: 20px 22px 18px;
        max-width: 310px; min-width: 260px;
        box-shadow: 0 20px 60px rgba(0,0,0,0.45), 0 0 30px rgba(0,180,216,0.1);
        direction: rtl; font-family: inherit;
        animation: wmFadeIn 0.28s ease;
      }
      .walkme-tooltip.visible { display: block; }
      @keyframes wmFadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to   { opacity: 1; transform: translateY(0); }
      }

      .wm-header {
        display: flex; align-items: center; gap: 10px; margin-bottom: 12px;
      }
      .wm-badge {
        background: var(--wm-accent); color: #fff;
        border-radius: 20px; padding: 3px 10px;
        font-size: 11px; font-weight: 700; white-space: nowrap;
        letter-spacing: 0.3px;
      }
      .wm-title {
        font-size: 15px; font-weight: 700;
        color: var(--wm-text-primary); flex: 1;
      }
      .wm-text {
        font-size: 13.5px; color: var(--wm-text-secondary);
        line-height: 1.65; margin-bottom: 18px;
      }
      .wm-actions {
        display: flex; gap: 8px; align-items: center;
      }
      .wm-btn-next {
        background: var(--wm-accent); color: #fff;
        border: none; padding: 8px 22px; border-radius: 7px;
        cursor: pointer; font-size: 14px; font-weight: 600;
        transition: opacity 0.2s, transform 0.1s;
        font-family: inherit;
      }
      .wm-btn-next:hover { opacity: 0.85; transform: translateY(-1px); }
      .wm-btn-skip {
        background: transparent; color: var(--wm-text-secondary);
        border: 1px solid var(--wm-border); padding: 8px 14px;
        border-radius: 7px; cursor: pointer; font-size: 13px;
        transition: all 0.2s; font-family: inherit;
      }
      .wm-btn-skip:hover { color: var(--wm-text-primary); }
      .wm-btn-speak {
        background: transparent; border: 1px solid var(--wm-border);
        color: var(--wm-text-secondary); width: 34px; height: 34px;
        border-radius: 7px; cursor: pointer; font-size: 16px;
        display: grid; place-items: center;
        transition: all 0.2s; margin-right: auto;
        flex-shrink: 0;
      }
      .wm-btn-speak:hover { border-color: var(--wm-accent); color: var(--wm-accent); }
      .wm-btn-speak.speaking {
        border-color: var(--wm-accent); color: var(--wm-accent);
        animation: wmPulse 1s ease-in-out infinite;
      }
      @keyframes wmPulse {
        0%,100% { opacity: 1; }
        50%      { opacity: 0.5; }
      }
      .wm-progress {
        display: flex; gap: 5px; margin-top: 14px; justify-content: flex-end;
      }
      .wm-dot {
        width: 6px; height: 6px; border-radius: 50%;
        background: var(--wm-border); transition: all 0.2s;
      }
      .wm-dot.active {
        background: var(--wm-accent); width: 18px; border-radius: 3px;
      }

      .walkme-trigger-btn {
        display: inline-flex; align-items: center; gap: 6px;
        padding: 8px 16px; border-radius: 8px;
        background: transparent; border: 1.5px solid var(--wm-accent);
        color: var(--wm-accent); cursor: pointer; font-size: 13px;
        font-weight: 600; transition: all 0.2s; font-family: inherit;
      }
      .walkme-trigger-btn:hover {
        background: var(--wm-accent); color: #fff;
      }
    `;
    document.head.appendChild(s);
  }

  // ── DOM ───────────────────────────────────────────────────────
  _buildDOM() {
    const t = this.theme;
    document.documentElement.style.setProperty('--wm-accent', t.accent);
    document.documentElement.style.setProperty('--wm-bg', t.bg);
    document.documentElement.style.setProperty('--wm-border', t.border);
    document.documentElement.style.setProperty('--wm-text-primary', t.textPrimary);
    document.documentElement.style.setProperty('--wm-text-secondary', t.textSecondary);

    this.overlay = document.createElement('div');
    this.overlay.className = 'walkme-overlay';

    this.highlightBox = document.createElement('div');
    this.highlightBox.className = 'walkme-highlight-box';
    this.highlightBox.style.display = 'none';

    this.tooltip = document.createElement('div');
    this.tooltip.className = 'walkme-tooltip';

    document.body.append(this.overlay, this.highlightBox, this.tooltip);
    this.overlay.addEventListener('click', () => this.end());
  }

  // ── Core ──────────────────────────────────────────────────────
  start() {
    this.active = true;
    this.currentStep = 0;
    this.overlay.classList.add('active');
    this._showStep();
  }

  _showStep() {
    const step = this.steps[this.currentStep];
    if (!step) { this.end(); return; }

    const target = step.target ? document.querySelector(step.target) : null;
    const isLast = this.currentStep === this.steps.length - 1;

    // Restore previously raised elements
    document.querySelectorAll('[data-wm-raised]').forEach(el => {
      el.style.position = el.dataset.wmOrigPos || '';
      el.style.zIndex   = el.dataset.wmOrigZ   || '';
      el.removeAttribute('data-wm-raised');
      el.removeAttribute('data-wm-orig-pos');
      el.removeAttribute('data-wm-orig-z');
    });

    if (target) {
      target.dataset.wmRaised  = '1';
      target.dataset.wmOrigPos = target.style.position || '';
      target.dataset.wmOrigZ   = target.style.zIndex   || '';
      target.style.position    = 'relative';
      target.style.zIndex      = '9010';
      target.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      setTimeout(() => {
        const r = target.getBoundingClientRect();
        const pad = 6;
        this.highlightBox.style.cssText = `
          display: block;
          top: ${r.top - pad}px; left: ${r.left - pad}px;
          width: ${r.width + pad * 2}px; height: ${r.height + pad * 2}px;
        `;
        this._positionTooltip(r);
      }, 120);
    } else {
      this.highlightBox.style.display = 'none';
    }

    // Build tooltip
    this.tooltip.className = 'walkme-tooltip visible';
    this.tooltip.innerHTML = `
      <div class="wm-header">
        <span class="wm-badge">${this.currentStep + 1} / ${this.steps.length}</span>
        <div class="wm-title">${step.title}</div>
      </div>
      <div class="wm-text">${step.text}</div>
      <div class="wm-actions">
        <button class="wm-btn-next" onclick="window._walkme.next()">${isLast ? '✓ סיום' : 'הבא ←'}</button>
        <button class="wm-btn-skip" onclick="window._walkme.end()">דלג</button>
        <button class="wm-btn-speak" id="wm-speak-btn" onclick="window._walkme._speakFromBtn(this)" title="האזן שוב">🔊</button>
      </div>
      <div class="wm-progress">
        ${this.steps.map((_, i) => `<div class="wm-dot ${i === this.currentStep ? 'active' : ''}"></div>`).join('')}
      </div>
    `;

    if (!target) {
      this.tooltip.style.top = '50%';
      this.tooltip.style.left = '50%';
      this.tooltip.style.transform = 'translate(-50%, -50%)';
    }

    // Auto-read after short delay (let tooltip appear first)
    setTimeout(() => this._speakCurrent(), 350);
  }

  _speakFromBtn(btn) {
    btn.classList.add('speaking');
    this._speakCurrent();
    // Remove animation when speech ends
    if (window.speechSynthesis) {
      const check = setInterval(() => {
        if (!speechSynthesis.speaking) {
          btn.classList.remove('speaking');
          clearInterval(check);
        }
      }, 200);
    }
  }

  _positionTooltip(targetRect) {
    this.tooltip.style.transform = '';
    const tw = 320, th = 200;
    const margin = 14;
    const vw = window.innerWidth, vh = window.innerHeight;
    let top, left;

    if (targetRect.bottom + th + margin < vh) {
      top = targetRect.bottom + margin;
    } else if (targetRect.top - th - margin > 0) {
      top = targetRect.top - th - margin;
    } else {
      top = margin;
    }

    left = targetRect.right - tw;
    left = Math.max(margin, Math.min(left, vw - tw - margin));

    this.tooltip.style.top = top + 'px';
    this.tooltip.style.left = left + 'px';
  }

  next() {
    this._stopSpeech();
    this.currentStep++;
    if (this.currentStep >= this.steps.length) {
      this.end();
    } else {
      this.tooltip.className = 'walkme-tooltip';
      setTimeout(() => this._showStep(), 50);
    }
  }

  end() {
    this._stopSpeech();
    this.active = false;
    this.overlay.classList.remove('active');
    this.tooltip.className = 'walkme-tooltip';
    this.highlightBox.style.display = 'none';
    document.querySelectorAll('[data-wm-raised]').forEach(el => {
      el.style.position = el.dataset.wmOrigPos || '';
      el.style.zIndex   = el.dataset.wmOrigZ   || '';
      el.removeAttribute('data-wm-raised');
      el.removeAttribute('data-wm-orig-pos');
      el.removeAttribute('data-wm-orig-z');
    });
  }

  static createTriggerButton(label = '🎯 סיור מודרך') {
    const btn = document.createElement('button');
    btn.className = 'walkme-trigger-btn';
    btn.innerHTML = label;
    btn.onclick = () => window._walkme && window._walkme.start();
    return btn;
  }
}
