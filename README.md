# ⚙ ServiceDesk — Offline Business Manager

A mobile-first PWA for managing clients, jobs, invoices, expenses, and your team. Works fully offline and syncs to Supabase when online.

---

## 🗂 Repository Files

| File | Purpose |
|---|---|
| `index.html` | Entire app — all UI, logic, and styles in one file |
| `sw.js` | Service worker — enables offline use and caching |
| `manifest.json` | PWA manifest — install on home screen |
| `icon-192.png` | App icon (192×192) |
| `icon-512.png` | App icon (512×512) |
| `supabase-setup.sql` | Run this once in Supabase to create all tables |

---

## 🚀 Setup

### 1. Supabase (one-time)
1. Go to [supabase.com](https://supabase.com) and open your project
2. Navigate to **SQL Editor**
3. Paste the contents of `supabase-setup.sql` and click **Run**
4. That's it — all 6 tables and RLS policies are created

### 2. Deploy
Push all files to GitHub and enable **GitHub Pages** (Settings → Pages → Deploy from branch `main`, root `/`).

Your app will be live at:
```
https://<your-username>.github.io/<your-repo-name>/
```

### 3. First Launch
- Open the app URL in your browser
- Tap **⚙ Set Up Team** to create the first admin account with a 4-digit PIN
- Go to **Settings** to enter your business name and details

---

## 📱 Install as App (PWA)

**Android (Chrome):** Tap the three-dot menu → *Add to Home screen*  
**iOS (Safari):** Tap Share → *Add to Home Screen*  
**Desktop (Chrome/Edge):** Click the install icon in the address bar

---

## ✨ Features

- **Clients** — contact book with archive support
- **Jobs** — schedule, track status, recurring jobs
- **Invoices** — line items, partial payments, PDF export
- **Expenses** — log and categorise outgoings
- **Reports** — revenue, expenses, and top clients by month
- **Team** — multi-user PIN login, admin/member roles
- **Settings** — business profile, WhatsApp number, currency
- **Offline-first** — all data cached locally; syncs when back online
- **WhatsApp integration** — pre-filled messages for jobs and invoices

---

## 🔧 Supabase Config

The project URL and anon key are set at the top of `index.html`:

```js
const SUPA_URL = 'https://qtoniyyopfbydzvzcdtz.supabase.co';
const SUPA_KEY = 'your-anon-key-here';
```

The anon key is safe to expose — access is controlled by Row Level Security (RLS) policies in Supabase, not by keeping the key secret.

---

## 🛡 Security Notes

- PINs are hashed with SHA-256 before storing (never stored in plain text)
- All HTML output is XSS-sanitised via the `esc()` function
- RLS policies allow full access via the anon key — the PIN system is your auth layer
- If you need stricter access control, replace the RLS policies in `supabase-setup.sql`

---

## 📦 Tech Stack

- Vanilla HTML/CSS/JS — zero build step, no frameworks
- [Supabase](https://supabase.com) — Postgres database with REST API
- [Syne](https://fonts.google.com/specimen/Syne) + [DM Sans](https://fonts.google.com/specimen/DM+Sans) — Google Fonts
- Service Worker — offline caching and PWA install
