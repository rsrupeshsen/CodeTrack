```
 ██████╗ ██████╗ ██████╗ ███████╗███████╗ ██████╗ ██╗     ██╗ ██████╗
██╔════╝██╔═══██╗██╔══██╗██╔════╝██╔════╝██╔═══██╗██║     ██║██╔═══██╗
██║     ██║   ██║██║  ██║█████╗  █████╗  ██║   ██║██║     ██║██║   ██║
██║     ██║   ██║██║  ██║██╔══╝  ██╔══╝  ██║   ██║██║     ██║██║   ██║
╚██████╗╚██████╔╝██████╔╝███████╗██║     ╚██████╔╝███████╗██║╚██████╔╝
 ╚═════╝ ╚═════╝ ╚═════╝ ╚══════╝╚═╝      ╚═════╝ ╚══════╝╚═╝ ╚═════╝
```

<div align="center">

### ─────────── _Your Entire Coding Journey. One Dashboard._ ───────────

<br/>

[![⚡ Live](https://img.shields.io/badge/⚡_LIVE_DEMO-codefolio--v1.vercel.app-000000?style=for-the-badge&labelColor=6366f1)](https://codefolio-v1.vercel.app)&nbsp;&nbsp;
[![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev)&nbsp;&nbsp;
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)&nbsp;&nbsp;
[![License](https://img.shields.io/badge/MIT-License-22c55e?style=for-the-badge)](./LICENSE)

<br/>

```
  LeetCode  ──┐
              ├──▶  CodeFolio  ──▶  Unified Analytics
  GFG       ──┤                     Contest Tracker
              └──▶  AI Engine  ──▶  Smart Study Plans
  GitHub    ──┘                     Public Portfolio
```

</div>

<br/>

---

## `> whoami`

**CodeFolio** is the coding tracker you always wished existed.

Stop tab-switching between LeetCode, GeeksForGeeks, and GitHub to piece together your progress. CodeFolio pulls everything into one sleek dashboard — your stats, your streaks, your contests, your portfolio — and layers on an AI assistant that actually knows your strengths and gaps.

> 🔗 **[https://codefolio-v1.vercel.app](https://codefolio-v1.vercel.app)**

<br/>

---

## `> ls features/`

<br/>

<table>
<tr>
<td width="50%" valign="top">

### `📊` &nbsp;Unified Dashboard

Real-time stats from LeetCode, GFG, and GitHub on a single screen. Problems solved, contest ratings, contribution heatmaps, and monthly activity — no more tab-switching.

</td>
<td width="50%" valign="top">

### `📈` &nbsp;Deep Analytics

Difficulty breakdowns, platform comparisons, and trend charts built on Recharts. See where you're strong and where you're bleeding rating points.

</td>
</tr>
<tr>
<td width="50%" valign="top">

### `🏆` &nbsp;Contest Tracker

Full calendar view for upcoming contests on LeetCode, CodeChef, Codeforces and more. Never lose track of a round again.

</td>
<td width="50%" valign="top">

### `🤖` &nbsp;AI Coding Assistant

An AI chat assistant (powered by Claude) that reads your actual stats. Ask it for a study plan, topic recs, or hard problems to crack — it answers with _your_ data in context.

</td>
</tr>
<tr>
<td width="50%" valign="top">

### `📋` &nbsp;Question Tracker

Track progress across 8 curated sheets. Add custom problems, set status, write notes, and request AI-generated hints for any problem you're stuck on.

```
Blind 75  •  NeetCode 150  •  Striver SDE
Amazon  •  Google  •  Meta  •  Microsoft  •  Apple
```

</td>
<td width="50%" valign="top">

### `🌐` &nbsp;Public Portfolio

Every user gets a shareable dev portfolio at `/user/<username>` — live GitHub repos, achievements, problem stats, and social links. Share it with recruiters or pin it on your resume.

</td>
</tr>
<tr>
<td width="50%" valign="top">

### `🔥` &nbsp;GitHub Heatmap

Your contribution graph rendered directly in the dashboard. Build the streak. Keep it green.

</td>
<td width="50%" valign="top">

### `🎖️` &nbsp;Badges & Achievements

Unlock milestone badges — 1000 problems, 90-day streak, contest rating tiers. Display them on your portfolio.

</td>
</tr>
</table>

<br/>

---

## `> cat stack.json`

```json
{
  "frontend": "React 19 + TypeScript 5.9",
  "build": "Vite 6",
  "styling": "Tailwind CSS v4",
  "ui": "shadcn/ui + Radix UI primitives",
  "charts": "Recharts 2",
  "animation": "Motion (Framer Motion v12)",
  "routing": "React Router v7",
  "auth": "Appwrite",
  "database": "Appwrite Databases",
  "deployment": "Vercel"
}
```

<br/>

---

## `> ./setup.sh`

### Prerequisites

- Node.js `18+`
- An [Appwrite](https://appwrite.io) project (cloud or self-hosted)

<br/>

**Step 1 — Clone**

```bash
git clone https://github.com/rsrupeshsen/CodeTrack.git
cd CodeTrack
```

**Step 2 — Install**

```bash
npm install
```

**Step 3 — Configure**

Create a `.env` in the project root:

```env
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your_project_id
VITE_APPWRITE_DB_ID=your_database_id
```

> Set up your Appwrite database with three collections: `profiles`, `questions`, and `cached_stats`. See `src/lib/appwrite.ts` for the full schema reference.

**Step 4 — Run**

```bash
npm run dev
# → http://localhost:5173
```

**Step 5 — Build**

```bash
npm run build
```

<br/>

---

## `> tree src/`

```
src/
├── app/
│   ├── components/
│   │   ├── ui/                    ← shadcn/ui base components
│   │   ├── DashboardHome.tsx      ← stats overview + platform modals
│   │   ├── AnalyticsPage.tsx      ← charts & deep performance data
│   │   ├── ContestTracker.tsx     ← contest list + calendar view
│   │   ├── QuestionTracker.tsx    ← problem sheets, notes, hints
│   │   ├── AICodingAssistant.tsx  ← Claude-powered AI chat
│   │   ├── PortfolioPage.tsx      ← public shareable profile
│   │   ├── SettingsPage.tsx       ← handle & social link config
│   │   ├── LandingPage.tsx        ← marketing landing page
│   │   └── ...                    ← auth flows, layouts, onboarding
│   └── routes.ts
│
├── data/
│   ├── blind75.json               ← 75 must-do problems
│   ├── neetcode150extra.json      ← NeetCode 150 extras
│   ├── striverSDE.json            ← 191 SDE interview problems
│   └── company.json               ← FAANG company problems
│
├── lib/
│   ├── leetcode.ts                ← LeetCode API
│   ├── gfg.ts                     ← GFG API
│   ├── github.ts                  ← GitHub API
│   ├── githubHeatmap.ts           ← contribution heatmap
│   ├── contests.ts                ← contest aggregation
│   ├── aiHint.ts                  ← per-problem AI hints
│   ├── aiInsights.ts              ← personalised AI insights
│   ├── auth.ts                    ← Appwrite auth helpers
│   ├── database.ts                ← Appwrite DB helpers
│   └── appwrite.ts                ← Appwrite client
│
└── styles/
    └── theme.css / fonts.css / ...
```

<br/>

---

## `> configure --profiles`

After signing up, head to **Settings** and connect your handles:

| Platform                       | What it unlocks                                         |
| ------------------------------ | ------------------------------------------------------- |
| `leetcode: "<handle>"`         | Problems solved · Contest rating · Difficulty breakdown |
| `gfg: "<handle>"`              | GFG problem stats · Score                               |
| `github: "<handle>"`           | Repos · Contribution heatmap · Stars                    |
| `linkedin / twitter / website` | Shown on your public portfolio                          |

Your live public profile:

```
https://codefolio-v1.vercel.app/user/<your-username>
```

<br/>

---

## `> git contribute`

Pull requests are welcome. Here's the flow:

```bash
# 1. Fork → clone your fork
git clone https://github.com/<you>/CodeTrack.git

# 2. Branch
git checkout -b feat/your-feature-name

# 3. Commit with intention
git commit -m "feat: add streak freeze badge logic"

# 4. Push & open a PR
git push origin feat/your-feature-name
```

Please read [Guidelines.md](./guidelines/Guidelines.md) before submitting.

<br/>

---

## `> cat NOTICE`

```
shadcn/ui components  —  MIT License   (https://ui.shadcn.com)
Unsplash photos       —  Unsplash License (https://unsplash.com/license)
```

Full credits in [ATTRIBUTIONS.md](./ATTRIBUTIONS.md)

<br/>

---

## `> cat LICENSE`

MIT — free to use, modify, and distribute. See [LICENSE](./LICENSE).

<br/>

---

<div align="center">

```
built for coders  ·  by a coder
```

**[🌐 Live Demo](https://codefolio-v1.vercel.app)** &nbsp;·&nbsp; **[🐛 Issues](https://github.com/rsrupeshsen/CodeTrack/issues)** &nbsp;·&nbsp; **[⭐ Star this repo](https://github.com/rsrupeshsen/CodeTrack)**

</div>
