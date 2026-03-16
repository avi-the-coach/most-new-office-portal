/**
 * DemoStore — single localStorage entry for the entire demo
 * Key: "portal-demo"
 * Works with file:// protocol — Chrome shares localStorage across all file:// pages
 *
 * To clear: DemoStore.clear()  OR  localStorage.removeItem('portal-demo')
 */
const DemoStore = (function () {
  const KEY = 'portal-demo';

  function _empty() {
    return { reports: [], favorites: [], readDocs: [] };
  }

  function _load() {
    try {
      const v = localStorage.getItem(KEY);
      if (v) return JSON.parse(v) || _empty();
    } catch(e) {}
    return _empty();
  }

  function _save(data) {
    try { localStorage.setItem(KEY, JSON.stringify(data)); } catch(e) {}
  }

  return {
    getReports() {
      return _load().reports;
    },

    addReport(fields) {
      const data = _load();
      const report = Object.assign({}, fields, {
        id:     'REQ-' + new Date().getFullYear() + '-' + String(Math.floor(Math.random() * 9000) + 1000),
        at:     new Date().toLocaleString('he-IL'),
        status: 'פתוח'
      });
      data.reports.unshift(report);
      _save(data);
      return report;
    },

    getFavorites() {
      return _load().favorites;
    },

    toggleFavorite(id) {
      const data = _load();
      const idx = data.favorites.indexOf(id);
      if (idx >= 0) data.favorites.splice(idx, 1);
      else data.favorites.push(id);
      _save(data);
      return data.favorites.includes(id);
    },

    isFavorite(id) {
      return _load().favorites.includes(id);
    },

    markRead(docId) {
      const data = _load();
      if (!data.readDocs.includes(docId)) {
        data.readDocs.push(docId);
        _save(data);
      }
    },

    isRead(docId) {
      return _load().readDocs.includes(docId);
    },

    clear() {
      try { localStorage.removeItem(KEY); } catch(e) {}
    }
  };
})();
