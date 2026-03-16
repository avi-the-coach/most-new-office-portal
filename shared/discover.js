/**
 * Discover Mode — highlights all interactive elements in the demo
 * Shared across all portal demos
 */
(function () {

  // Elements that actually DO something in this demo
  const AUTO_SELECTORS = [
    // Navigation between pages
    'a.sidebar-link[href$=".html"]',
    'a[href$=".html"]:not(.sidebar-link)',

    // Topbar controls
    '#theme-toggle-mount .theme-toggle-btn',
    '.walkme-trigger-btn',

    // Announcements / Info / Contacts filters
    '.filter-chip',
    '.view-btn',
    '.cat-card',

    // Report form
    '.type-card',
    '.priority-pill',
    'button[onclick*="goStep"]',
    'button[onclick*="submitForm"]',
    'button[onclick*="resetForm"]',

    // Events calendar
    '.cal-nav-btn',
    '.cal-cell:not(.other-month)',

    // Generic action buttons
    '.btn-primary',
    '.btn-success',
    'a.btn-primary',

    // Back button in report
    '.btn-ghost:not([onclick])',

    // Contact buttons
    '.contact-btn',

    // Search inputs
    'input[type="text"][id]',
    'textarea[id]',
    'select[id]',
  ];

  let active = false;
  let highlighted = [];

  // ── CSS injected once ──────────────────────────────────────────
  function injectStyles() {
    if (document.getElementById('discover-styles')) return;
    const s = document.createElement('style');
    s.id = 'discover-styles';
    s.textContent = `
      /* Discover button */
      .discover-btn {
        display: inline-flex; align-items: center; gap: 6px;
        padding: 5px 12px; border-radius: 20px;
        background: var(--bg3, #111d35); border: 1px solid var(--border, #1e3358);
        color: var(--text2, #b0c8e8); cursor: pointer;
        font-size: 12px; font-weight: 700;
        transition: all 0.2s; font-family: inherit; white-space: nowrap;
        letter-spacing: 0.3px;
      }
      .discover-btn:hover { border-color: #f59e0b; color: #f59e0b; }
      .discover-btn.on { background: rgba(245,158,11,0.1); border-color: #f59e0b; color: #f59e0b; }

      /* Banner shown when discover mode is on */
      .discover-banner {
        display: none; position: fixed; bottom: 16px; left: 50%; transform: translateX(-50%);
        background: #f59e0b; color: #000; padding: 8px 20px;
        border-radius: 20px; font-size: 13px; font-weight: 700;
        z-index: 8000; box-shadow: 0 4px 20px rgba(245,158,11,0.4);
        pointer-events: none; white-space: nowrap; direction: rtl;
        animation: discoverBannerIn 0.3s ease;
      }
      .discover-banner.show { display: block; }
      @keyframes discoverBannerIn {
        from { opacity: 0; transform: translateX(-50%) translateY(10px); }
        to   { opacity: 1; transform: translateX(-50%) translateY(0); }
      }

      /* Highlighted interactive elements */
      .demo-live {
        outline: 2px solid rgba(245,158,11,0.85) !important;
        outline-offset: 3px !important;
        animation: discoverGlow 1.8s ease-in-out infinite !important;
      }

      /* Navigation links get a distinct colour */
      a.sidebar-link.demo-live {
        outline-color: rgba(0,194,224,0.9) !important;
        animation: discoverGlowNav 1.8s ease-in-out infinite !important;
      }

      @keyframes discoverGlow {
        0%,100% { box-shadow: 0 0 0 0   rgba(245,158,11,0.5); }
        50%      { box-shadow: 0 0 0 7px rgba(245,158,11,0); }
      }
      @keyframes discoverGlowNav {
        0%,100% { box-shadow: 0 0 0 0   rgba(0,194,224,0.5); }
        50%      { box-shadow: 0 0 0 7px rgba(0,194,224,0); }
      }
    `;
    document.head.appendChild(s);
  }

  // ── Activate / deactivate ──────────────────────────────────────
  function activate() {
    active = true;
    highlighted = [];

    AUTO_SELECTORS.forEach(sel => {
      try {
        document.querySelectorAll(sel).forEach(el => {
          if (!el.classList.contains('demo-live')) {
            el.classList.add('demo-live');
            highlighted.push(el);
          }
        });
      } catch(e) {}
    });

    document.querySelector('.discover-btn')?.classList.add('on');
    document.getElementById('discover-banner')?.classList.add('show');
  }

  function deactivate() {
    active = false;
    highlighted.forEach(el => el.classList.remove('demo-live'));
    highlighted = [];
    document.querySelector('.discover-btn')?.classList.remove('on');
    document.getElementById('discover-banner')?.classList.remove('show');
  }

  function toggle() {
    active ? deactivate() : activate();
  }

  // ── Build DOM ──────────────────────────────────────────────────
  function init() {
    injectStyles();

    const mount = document.getElementById('discover-mount');
    if (mount) {
      const btn = document.createElement('button');
      btn.className = 'discover-btn';
      btn.innerHTML = '🔍 גלה';
      btn.title = 'הדגש אלמנטים פעילים בדמו';
      btn.onclick = toggle;
      mount.appendChild(btn);
    }

    // Floating banner
    const banner = document.createElement('div');
    banner.className = 'discover-banner';
    banner.id = 'discover-banner';
    banner.textContent = '🔍 מצב גילוי פעיל — האלמנטים הצבעוניים ניתנים ללחיצה';
    document.body.appendChild(banner);

    // ESC closes
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && active) deactivate();
    });
  }

  document.addEventListener('DOMContentLoaded', init);
  window.DiscoverMode = { toggle, activate, deactivate };
})();
