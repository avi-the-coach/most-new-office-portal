const PortalData = {
  user: {
    name: "ישראל ישראלי",
    firstName: "ישראל",
    role: "מנהל מדיניות",
    unit: "מדיניות וייעוץ",
    employeeId: "12345",
    email: "israel@most.gov.il",
    phone: "03-5100200",
    joinDate: "2020-03-15"
  },

  announcements: [
    { id: 1, title: "עדכון נהלי עבודה מרחוק", excerpt: "החל מה-1 באפריל, יעודכנו נהלי העבודה מרחוק. נא לעיין במסמך המצורף.", date: "2026-03-10", category: "נהלים", priority: "high", author: "מחלקת הון אנושי" },
    { id: 2, title: "הדרכה: כלי Google AI בעבודה", excerpt: "ביום שלישי הקרוב תתקיים הדרכה לשימוש בכלי Gemini ו-NotebookLM.", date: "2026-03-08", category: "הדרכות", priority: "medium", author: "מערכות מידע" },
    { id: 3, title: "עדכון: ימי חופשה 2026", excerpt: "לוח ימי החופשה לשנת 2026 פורסם. ניתן לצפות בו בפורטל מרכב\"ה.", date: "2026-03-05", category: "כללי", priority: "low", author: "אגף כוח אדם" },
    { id: 4, title: "שינוי בתהליך הזמנת ציוד משרדי", excerpt: "תהליך הזמנת ציוד משרדי עובר למערכת Action Base החל מחודש אפריל.", date: "2026-03-01", category: "נהלים", priority: "medium", author: "רכש ולוגיסטיקה" },
    { id: 5, title: "עדכון מדיניות אבטחת מידע", excerpt: "בעקבות הנחיות מטה הסייבר הלאומי, עודכנה מדיניות אבטחת המידע.", date: "2026-02-25", category: "בטחון מידע", priority: "high", author: "מחלקת בטחון" }
  ],

  contacts: [
    { id: 1, name: "רונית כהן", role: "מנהלת אגף הון אנושי", unit: "הון אנושי", phone: "03-5100210", email: "ronit.cohen@most.gov.il", ext: "210", avatar: "ר" },
    { id: 2, name: "דוד לוי", role: "מנהל מערכות מידע", unit: "מערכות מידע", phone: "03-5100220", email: "david.levi@most.gov.il", ext: "220", avatar: "ד" },
    { id: 3, name: "מירי גולדברג", role: "יועצת משפטית ראשית", unit: "ייעוץ משפטי", phone: "03-5100230", email: "miri.goldberg@most.gov.il", ext: "230", avatar: "מ" },
    { id: 4, name: "אבי שפירא", role: "מנהל רכש ולוגיסטיקה", unit: "רכש ולוגיסטיקה", phone: "03-5100240", email: "avi.shapira@most.gov.il", ext: "240", avatar: "א" },
    { id: 5, name: "נועה כץ", role: "מנהלת חשבות ושכר", unit: "חשבות ושכר", phone: "03-5100250", email: "noa.katz@most.gov.il", ext: "250", avatar: "נ" },
    { id: 6, name: "יוסי בן-דוד", role: "מנהל ביקורת פנים", unit: "ביקורת פנים", phone: "03-5100260", email: "yossi.bendavid@most.gov.il", ext: "260", avatar: "י" },
    { id: 7, name: "שרה מזרחי", role: "אחראית רשומות", unit: "הרשאות ורשומות", phone: "03-5100270", email: "sara.mizrahi@most.gov.il", ext: "270", avatar: "ש" },
    { id: 8, name: "תומר אלון", role: "מנהל תקציבים", unit: "תקציבים", phone: "03-5100280", email: "tomer.alon@most.gov.il", ext: "280", avatar: "ת" },
    { id: 9, name: "לילך פרידמן", role: "קצינת בטחון ראשית", unit: "בטחון", phone: "03-5100290", email: "lilach.friedman@most.gov.il", ext: "290", avatar: "ל" },
    { id: 10, name: "עמית רוזנברג", role: "מנהל מדיניות בכיר", unit: "מדיניות וייעוץ", phone: "03-5100300", email: "amit.rosenberg@most.gov.il", ext: "300", avatar: "ע" },
    { id: 11, name: "יעל שחר", role: "מנהלת מכרזים", unit: "מכרזים והתקשרויות", phone: "03-5100310", email: "yael.shahar@most.gov.il", ext: "310", avatar: "י" },
    { id: 12, name: "גיל מנחם", role: "יו\"ר ועד עובדים", unit: "ועד עובדים", phone: "03-5100320", email: "gil.menachem@most.gov.il", ext: "320", avatar: "ג" }
  ],

  units: [
    { id: "hr", name: "הון אנושי", icon: "👥", color: "#7c3aed", head: "רונית כהן", members: 12 },
    { id: "it", name: "מערכות מידע", icon: "💻", color: "#0ea5e9", head: "דוד לוי", members: 18 },
    { id: "legal", name: "ייעוץ משפטי", icon: "⚖️", color: "#f59e0b", head: "מירי גולדברג", members: 8 },
    { id: "logistics", name: "רכש ולוגיסטיקה", icon: "📦", color: "#10b981", head: "אבי שפירא", members: 15 },
    { id: "finance", name: "חשבות ושכר", icon: "💰", color: "#f43f5e", head: "נועה כץ", members: 10 },
    { id: "budget", name: "תקציבים", icon: "📊", color: "#8b5cf6", head: "תומר אלון", members: 7 },
    { id: "audit", name: "ביקורת פנים", icon: "🔍", color: "#64748b", head: "יוסי בן-דוד", members: 5 },
    { id: "security", name: "בטחון", icon: "🛡️", color: "#dc2626", head: "לילך פרידמן", members: 14 },
    { id: "tenders", name: "מכרזים", icon: "📋", color: "#0d9488", head: "יעל שחר", members: 9 },
    { id: "committee", name: "ועד עובדים", icon: "🤝", color: "#ea580c", head: "גיל מנחם", members: 6 }
  ],

  quickLinks: [
    { name: "מרכב\"ה", desc: "דיווח שעות וחשבוניות", icon: "⏱️", url: "#", color: "#0ea5e9" },
    { name: "TopDesk", desc: "פניות IT ותמיכה", icon: "🎫", url: "#", color: "#7c3aed" },
    { name: "Action Base", desc: "ניהול משימות", icon: "✅", url: "#", color: "#10b981" },
    { name: "תלוש שכר", desc: "צפייה בתלושי שכר", icon: "💰", url: "#", color: "#f59e0b" },
    { name: "Google Drive", desc: "מסמכים ושיתוף", icon: "📁", url: "#", color: "#ea4335" },
    { name: "Zoom", desc: "פגישות ושיחות", icon: "📹", url: "#", color: "#2D8CFF" }
  ],

  birthdays: [
    { name: "רונית כהן", date: "18/03", daysLeft: 2 },
    { name: "אבי שפירא", date: "21/03", daysLeft: 5 },
    { name: "תומר אלון", date: "25/03", daysLeft: 9 }
  ],

  events: [
    { id: 1, title: "ישיבת הנהלה", date: "2026-03-18", time: "10:00", type: "meeting", location: "חדר ישיבות א'" },
    { id: 2, title: "הדרכת Google AI", date: "2026-03-19", time: "14:00", type: "training", location: "חדר הדרכה 2" },
    { id: 3, title: "פגישת ועד עובדים", date: "2026-03-22", time: "13:00", type: "meeting", location: "חדר ועד" },
    { id: 4, title: "יום עיון: בינה מלאכותית", date: "2026-03-25", time: "09:00", type: "event", location: "אולם כנסים" },
    { id: 5, title: "הגשת דוחות רבעון 1", date: "2026-03-31", time: "17:00", type: "deadline", location: "" },
    { id: 6, title: "חג הפסח", date: "2026-04-01", time: "", type: "holiday", location: "" },
    { id: 7, title: "הדרכת אבטחת מידע", date: "2026-04-07", time: "11:00", type: "training", location: "חדר הדרכה 1" },
    { id: 8, title: "ישיבת תקציב שנתי", date: "2026-04-14", time: "09:30", type: "meeting", location: "חדר ישיבות ב'" }
  ],

  knowledgeBase: [
    { id: 1, title: "נוהל עבודה מרחוק", category: "נהלים", updated: "2026-03-10", icon: "🏠", reads: 342 },
    { id: 2, title: "מדריך לשימוש בכלי AI", category: "הדרכות", updated: "2026-01-21", icon: "🤖", reads: 891 },
    { id: 3, title: "נוהל רכש ציוד משרדי", category: "נהלים", updated: "2026-03-01", icon: "📦", reads: 156 },
    { id: 4, title: "מדריך WinMerge", category: "הדרכות", updated: "2020-01-12", icon: "🔀", reads: 203 },
    { id: 5, title: "נוהל אבטחת מידע", category: "בטחון מידע", updated: "2025-11-15", icon: "🔒", reads: 512 },
    { id: 6, title: "לוח חופשות 2026", category: "כללי", updated: "2025-12-30", icon: "📅", reads: 1204 },
    { id: 7, title: "מדריך TopDesk לעובד", category: "הדרכות", updated: "2025-09-01", icon: "🎫", reads: 677 },
    { id: 8, title: "נוהל קליטת עובד חדש", category: "נהלים", updated: "2025-06-15", icon: "👤", reads: 289 }
  ],

  knowledgeCategories: [
    { name: "נהלים", icon: "📜", count: 24, color: "#0ea5e9" },
    { name: "הדרכות", icon: "🎓", count: 18, color: "#10b981" },
    { name: "בטחון מידע", icon: "🔒", count: 12, color: "#ef4444" },
    { name: "כלים ומערכות", icon: "🛠️", count: 31, color: "#f59e0b" },
    { name: "כוח אדם", icon: "👥", count: 15, color: "#7c3aed" },
    { name: "רכש", icon: "📦", count: 9, color: "#0d9488" }
  ],

  reportTypes: [
    { id: "it", label: "תקלה טכנית", icon: "💻", desc: "בעיה במחשב, רשת, תוכנה" },
    { id: "maintenance", label: "תחזוקה ותשתיות", icon: "🔧", desc: "תיקון, החלפה, סביבת עבודה" },
    { id: "security", label: "אירוע אבטחה", icon: "🛡️", desc: "חשד לפרצה, אובדן ציוד" },
    { id: "request", label: "בקשת ציוד", icon: "📦", desc: "הזמנת ציוד משרדי חדש" },
    { id: "complaint", label: "תלונה / פנייה", icon: "💬", desc: "פנייה לוועד, משאבי אנוש" },
    { id: "other", label: "אחר", icon: "📝", desc: "כל דיווח אחר" }
  ],

  stats: {
    openTickets: 3,
    pendingRequests: 1,
    unreadMessages: 7,
    daysUntilVacation: 18
  }
};
