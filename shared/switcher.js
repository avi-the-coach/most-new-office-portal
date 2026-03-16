/**
 * Option Switcher — navigate between portal design options
 * Shows current option + buttons for the other two
 * Works with file:// protocol (reads from pathname)
 */
(function () {
  const OPTIONS = [
    { id: 'option-1', label: 'Command Center', icon: '🌙' },
    { id: 'option-2', label: 'GOV.IL',          icon: '🏛️' },
    { id: 'option-3', label: 'Bento Glass',      icon: '✨' }
  ];

  function getCurrentOption() {
    const path = window.location.pathname.replace(/\\/g, '/');
    for (const opt of OPTIONS) {
      if (path.includes('/' + opt.id + '/')) return opt.id;
    }
    return 'option-1';
  }

  function getCurrentPage() {
    const path = window.location.pathname.replace(/\\/g, '/');
    return path.split('/').pop() || 'index.html';
  }

  function injectStyles() {
    if (document.getElementById('switcher-styles')) return;
    const s = document.createElement('style');
    s.id = 'switcher-styles';
    s.textContent = `
      /* Mount point — centered in topbar flex layout */
      #option-switcher-mount {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .option-switcher {
        display: flex; gap: 4px; align-items: center;
        background: var(--bg3, #111d35);
        border: 1px solid var(--border, #1e3358);
        border-radius: 20px; padding: 3px;
      }
      .option-switch-btn {
        display: inline-flex; align-items: center; gap: 5px;
        padding: 5px 14px; border-radius: 18px;
        font-size: 12px; font-weight: 600; line-height: 1;
        cursor: pointer; text-decoration: none;
        transition: all 0.2s; white-space: nowrap;
        border: none; font-family: inherit;
        color: var(--text2, #8fa3c8);
        background: transparent;
      }
      .option-switch-btn:hover:not(.current):not(.soon) {
        background: var(--accent, #00c2e0);
        color: #fff;
      }
      .option-switch-btn.current {
        background: var(--accent, #00c2e0);
        color: #fff;
        cursor: default;
        font-weight: 700;
        box-shadow: 0 1px 4px rgba(0,0,0,0.15);
      }
      .option-switch-btn.soon {
        opacity: 0.35; cursor: not-allowed;
        font-size: 11px;
      }
    `;
    document.head.appendChild(s);
  }

  function init() {
    const mount = document.getElementById('option-switcher-mount');
    if (!mount) return;
    injectStyles();

    const current = getCurrentOption();
    const page    = getCurrentPage();

    const container = document.createElement('div');
    container.className = 'option-switcher';

    OPTIONS.forEach(opt => {
      const isCurrent = opt.id === current;
      const el = document.createElement(isCurrent || opt.soon ? 'span' : 'a');
      el.className = 'option-switch-btn'
        + (isCurrent ? ' current' : '')
        + (opt.soon   ? ' soon'    : '');
      el.innerHTML = opt.icon + ' ' + opt.label;
      if (!isCurrent && !opt.soon) {
        el.href = '../' + opt.id + '/' + page;
      }
      container.appendChild(el);
    });

    mount.appendChild(container);
  }

  document.addEventListener('DOMContentLoaded', init);
  window.OptionSwitcher = { init };
})();
