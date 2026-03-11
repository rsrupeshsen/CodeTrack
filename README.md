<div align="center">

<img src="https://raw.githubusercontent.com/your-username/CodeTrack/main/codefolio.png" alt="CodeFolio Logo" width="80" />

# CodeFolio

**Track your entire coding journey in one place.**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-codefolio--v1.vercel.app-6366f1?style=for-the-badge&logo=vercel)](https://codefolio-v1.vercel.app)
[![React](https://img.shields.io/badge/React-19-61dafb?style=flat-square&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-6-646cff?style=flat-square&logo=vite)](https://vitejs.dev)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-4-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](./LICENSE)

</div>

---

## What is CodeFolio?

CodeFolio is a unified developer dashboard that aggregates your coding activity from **LeetCode**, **GeeksForGeeks**, and **GitHub** into a single, beautiful interface. It provides in-depth analytics, contest tracking, an AI-powered coding assistant, a question tracker with curated problem sheets, and a shareable public portfolio — all in one place.

> **Live Demo →** [https://codefolio-v1.vercel.app](https://codefolio-v1.vercel.app)

---

## ✨ Features

### 📊 Unified Dashboard
Aggregate your stats from LeetCode, GFG, and GitHub at a glance. View problems solved, contest ratings, GitHub contributions, and monthly activity charts — all from a single home screen.

### 📈 Deep Analytics
Explore detailed breakdowns of your coding performance including difficulty distribution (Easy / Medium / Hard), platform comparisons, and trend charts over time powered by Recharts.

### 🏆 Contest Tracker
Never miss an upcoming coding contest. Browse and filter contests from LeetCode, CodeChef, Codeforces, and more through a full calendar view and an interactive contest list.

### 📋 Question Tracker
Track your progress on curated problem sheets including:
- **Blind 75** — 75 must-do LeetCode problems
- **NeetCode 150** — 150 curated problems
- **Striver SDE Sheet** — 191 SDE interview problems
- **Company-specific sheets** — Amazon, Google, Meta, Microsoft, Apple

Add your own custom problems, set status (Solved / Attempted / Todo), write notes, and get AI-powered hints for any problem.

### 🤖 AI Coding Assistant
Chat with a built-in AI assistant (powered by Claude) that knows your stats. Generate a personalised daily study plan, get topic recommendations, find hard problems to try, or ask for advice on improving your contest rating.

### 🌐 Public Portfolio
Every user gets a shareable public profile at `/user/<username>` showcasing their coding journey, GitHub projects, achievements, and stats — perfect for recruiters and peers.

### 🔥 GitHub Heatmap
Visualise your GitHub contribution heatmap directly in the dashboard, showing consistency and coding streaks.

### 🎖️ Badges & Achievements
Unlock and display badges based on milestones like solving 1000 problems, maintaining streaks, and reaching contest rating thresholds.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | React 19 + TypeScript |
| Build Tool | Vite 6 |
| Styling | Tailwind CSS v4 |
| UI Components | shadcn/ui + Radix UI |
| Charts | Recharts |
| Animations | Motion (Framer Motion v12) |
| Routing | React Router v7 |
| Backend / Auth | Appwrite |
| Database | Appwrite Databases |
| Deployment | Vercel |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and **npm** installed
- An [Appwrite](https://appwrite.io) project (cloud or self-hosted)

### 1. Clone the repository

```bash
git clone https://github.com/your-username/CodeTrack.git
cd CodeTrack
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your_project_id
VITE_APPWRITE_DB_ID=your_database_id
```

> **Note:** You will also need to set up the Appwrite database with the `profiles`, `questions`, and `cached_stats` collections. Refer to `src/lib/appwrite.ts` for collection IDs.

### 4. Start the development server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 5. Build for production

```bash
npm run build
```

---

## 📁 Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── ui/                  # shadcn/ui base components
│   │   ├── DashboardHome.tsx    # Main dashboard overview
│   │   ├── AnalyticsPage.tsx    # Deep analytics & charts
│   │   ├── ContestTracker.tsx   # Contest list & calendar
│   │   ├── QuestionTracker.tsx  # Problem sheets & tracker
│   │   ├── AICodingAssistant.tsx# AI chat assistant
│   │   ├── PortfolioPage.tsx    # Public portfolio view
│   │   ├── SettingsPage.tsx     # Profile & platform settings
│   │   ├── LandingPage.tsx      # Marketing landing page
│   │   └── ...                  # Auth, layout, onboarding
│   ├── App.tsx
│   └── routes.ts
├── data/
│   ├── blind75.json             # Blind 75 problems
│   ├── neetcode150extra.json    # NeetCode 150 extras
│   ├── striverSDE.json          # Striver SDE sheet
│   └── company.json             # Company-specific problems
├── lib/
│   ├── leetcode.ts              # LeetCode API integration
│   ├── gfg.ts                   # GeeksForGeeks integration
│   ├── github.ts                # GitHub API integration
│   ├── githubHeatmap.ts         # GitHub contribution heatmap
│   ├── contests.ts              # Contest aggregation
│   ├── aiHint.ts                # AI hint generation
│   ├── aiInsights.ts            # AI insights engine
│   ├── auth.ts                  # Appwrite auth helpers
│   ├── database.ts              # Appwrite DB helpers
│   └── appwrite.ts              # Appwrite client config
└── styles/
    └── ...                      # Global styles & theming
```

---

## ⚙️ Configuration

### Connecting your coding profiles

After signing up, go to **Settings** to connect your handles:

- **LeetCode username** — fetches problem stats and contest rating
- **GeeksForGeeks username** — fetches GFG problem stats
- **GitHub username** — fetches repositories and contribution heatmap
- **Social links** — LinkedIn, Twitter, personal website

Your public profile will be live at:
```
https://codefolio-v1.vercel.app/user/<your-username>
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/my-feature`)
3. Commit your changes (`git commit -m 'Add my feature'`)
4. Push to the branch (`git push origin feature/my-feature`)
5. Open a Pull Request

Please read the [Guidelines](./guidelines/Guidelines.md) before contributing.

---

## 📜 Attributions

- UI components from [shadcn/ui](https://ui.shadcn.com/) — MIT License
- Photos from [Unsplash](https://unsplash.com) — Unsplash License

See [ATTRIBUTIONS.md](./ATTRIBUTIONS.md) for full details.

---

## 📄 License

This project is licensed under the [MIT License](./LICENSE).

---

<div align="center">

Made with ❤️ for competitive programmers and developers

[🌐 Live Demo](https://codefolio-v1.vercel.app) · [🐛 Report Bug](https://github.com/rsrupeshsen/CodeTrack/issues) · [✨ Request Feature](https://github.com/rsrupeshsen/CodeTrack/issues)

</div>
