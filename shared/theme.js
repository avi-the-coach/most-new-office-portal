/**
 * Theme Manager — Dark / Light mode
 * Persistence strategy (in priority order):
 *  1. URL param ?t=light/dark  ← most reliable with file:// protocol
 *  2. localStorage
 *  3. sessionStorage
 *  4. default: dark
 */
(function () {
  const KEY = 'portal-theme';

  function _fromUrl() {
    try { return new URLSearchParams(window.location.search).get('t'); } catch(e) { return null; }
  }

  function getTheme() {
    var u = _fromUrl();
    if (u === 'light' || u === 'dark') { _save(u); return u; }
    try { var v = localStorage.getItem(KEY);   if (v) return v; } catch(e) {}
    try { var v = sessionStorage.getItem(KEY); if (v) return v; } catch(e) {}
    return 'dark';
  }

  function _save(theme) {
    try { localStorage.setItem(KEY, theme);   } catch(e) {}
    try { sessionStorage.setItem(KEY, theme); } catch(e) {}
  }

  // Stamp all internal .html links with ?t=<theme>
  // so the NEXT page receives the theme before ANY JS runs
  function _stampLinks(theme) {
    document.querySelectorAll('a[href]').forEach(function(a) {
      var href = a.getAttribute('href') || '';
      if (!href || href.startsWith('http') || href.startsWith('#') || !href.includes('.html')) return;
      var base = href.split('?')[0];
      a.setAttribute('href', base + '?t=' + theme);
    });
  }

  function applyTheme(theme, animate) {
    if (animate) {
      document.documentElement.style.transition = 'background 0.3s, color 0.3s';
      setTimeout(function() { document.documentElement.style.transition = ''; }, 400);
    }
    if (theme === 'light') {
      document.documentElement.classList.add('light-mode');
    } else {
      document.documentElement.classList.remove('light-mode');
    }
    _save(theme);
    _stampLinks(theme);
    _syncUI(theme);

    // Update WalkMe CSS vars if loaded
    if (window._walkme) {
      var L = theme === 'light';
      document.documentElement.style.setProperty('--wm-bg',             L ? '#ffffff' : '#0d1629');
      document.documentElement.style.setProperty('--wm-border',         L ? '#cdd8e8' : '#1e3358');
      document.documentElement.style.setProperty('--wm-text-primary',   L ? '#0f172a' : '#f0f6ff');
      document.documentElement.style.setProperty('--wm-text-secondary', L ? '#475569' : '#b0c8e8');
    }
  }

  function toggle() {
    var isDark = !document.documentElement.classList.contains('light-mode');
    applyTheme(isDark ? 'light' : 'dark', true);
  }

  function _syncUI(theme) {
    document.querySelectorAll('.theme-toggle-icon').forEach(function(el) {
      el.textContent = theme === 'dark' ? '☀️' : '🌙';
    });
    document.querySelectorAll('.theme-toggle-label').forEach(function(el) {
      el.textContent = theme === 'dark' ? 'בהיר' : 'כהה';
    });
  }

  function _createButton() {
    var theme = getTheme();
    var btn = document.createElement('button');
    btn.className = 'theme-toggle-btn';
    btn.title = 'החלפת ערכת צבעים';
    btn.onclick = toggle;
    btn.innerHTML =
      '<span class="theme-toggle-icon">' + (theme === 'dark' ? '☀️' : '🌙') + '</span>' +
      '<div class="theme-switch-track"><div class="theme-switch-thumb"></div></div>' +
      '<span class="theme-toggle-label">' + (theme === 'dark' ? 'בהיר' : 'כהה') + '</span>';
    return btn;
  }

  // ─── Apply BEFORE paint (called by inline script in <head>) ───
  // The inline anti-flash script reads URL param and localStorage itself,
  // so this is a safety net for when theme.js loads late (bottom of body).
  var _early = getTheme();
  if (_early === 'light') document.documentElement.classList.add('light-mode');
  else document.documentElement.classList.remove('light-mode');

  // ─── Full init on DOM ready ────────────────────────────────────
  document.addEventListener('DOMContentLoaded', function () {
    var theme = getTheme();
    applyTheme(theme, false);   // also stamps links

    var mount = document.getElementById('theme-toggle-mount');
    if (mount) mount.appendChild(_createButton());
  });

  window.ThemeManager = { toggle: toggle, applyTheme: applyTheme, getTheme: getTheme };
})();
