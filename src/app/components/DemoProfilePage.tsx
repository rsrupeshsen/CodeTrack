import { useNavigate } from "react-router";
import {
  Github,
  Linkedin,
  Twitter,
  Globe,
  Star,
  GitFork,
  Code2,
  ArrowRight,
  Trophy,
  Flame,
  Target,
  Zap,
  ExternalLink,
  Calendar,
  Clock,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// Demo data - static showcase data
const demoUser = {
  name: "Demo User",
  username: "demo",
  bio: "Full-stack developer passionate about competitive programming and open source",
  techStack: "React, TypeScript, Node.js, Python, Go",
  leetcode: "demo_user",
  gfg: "demo_user",
  github: "demo_user",
  website: "https://example.com",
  linkedin: "https://linkedin.com/in/demo",
  twitter: "https://twitter.com/demo",
};

const demoStats = {
  leetcode: {
    totalSolved: 847,
    easySolved: 312,
    mediumSolved: 423,
    hardSolved: 112,
    contestRating: 1876,
    ranking: 24567,
  },
  gfg: {
    totalSolved: 234,
    easy: 89,
    medium: 108,
    hard: 37,
    codingScore: 2156,
    streak: 45,
  },
  github: {
    public_repos: 42,
    followers: 156,
    totalStars: 234,
    contributions: 1247,
  },
  contests: {
    attended: 38,
    rating: 1876,
    topPercent: 12.5,
  },
};

const heatmapData = Array.from({ length: 365 }, (_, i) => ({
  date: new Date(Date.now() - (365 - i) * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0],
  count: Math.floor(Math.random() * 10),
}));

const langColors: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  Go: "#00ADD8",
  React: "#61DAFB",
};

const topLanguages = [
  { name: "TypeScript", percent: 35 },
  { name: "JavaScript", percent: 28 },
  { name: "Python", percent: 20 },
  { name: "Go", percent: 12 },
  { name: "React", percent: 5 },
];

function HeatmapCell({ count }: { count: number }) {
  const getColor = (c: number) => {
    if (c === 0) return "bg-muted";
    if (c <= 2) return "bg-primary/20";
    if (c <= 5) return "bg-primary/40";
    if (c <= 9) return "bg-primary/70";
    return "bg-primary";
  };
  return (
    <div
      className={`w-3 h-3 rounded-sm ${getColor(count)}`}
      title={`${count} contributions`}
    />
  );
}

export function DemoProfilePage() {
  const navigate = useNavigate();

  const techTags = demoUser.techStack.split(",").map((t) => t.trim());
  const initials = demoUser.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
  const totalSolved =
    demoStats.leetcode.totalSolved + demoStats.gfg.totalSolved;

  const diffPie = [
    {
      name: "Easy",
      value: demoStats.leetcode.easySolved + demoStats.gfg.easy,
      color: "#10b981",
    },
    {
      name: "Medium",
      value: demoStats.leetcode.mediumSolved + demoStats.gfg.medium,
      color: "#f59e0b",
    },
    {
      name: "Hard",
      value: demoStats.leetcode.hardSolved + demoStats.gfg.hard,
      color: "#ef4444",
    },
  ];

  const platformPie = [
    {
      name: "LeetCode",
      value: demoStats.leetcode.totalSolved,
      color: "#ffa116",
    },
    { name: "GFG", value: demoStats.gfg.totalSolved, color: "#2f8d46" },
  ];

  const stats = [
    {
      icon: Code2,
      label: "Problems Solved",
      value: totalSolved,
      color: "#10b981",
    },
    {
      icon: Trophy,
      label: "Contest Rating",
      value: demoStats.leetcode.contestRating,
      color: "#f59e0b",
    },
    {
      icon: Flame,
      label: "Contributions",
      value: demoStats.github.contributions,
      color: "#ef4444",
    },
    {
      icon: Target,
      label: "Repos",
      value: demoStats.github.public_repos,
      color: "#3b82f6",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Demo Banner */}
      <div className="bg-gradient-to-r from-primary/10 via-purple-500/10 to-pink-500/10 border-b border-primary/20">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <Zap className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Demo Mode</p>
              <p className="text-xs text-muted-foreground">
                Exploring CodeFolio features with sample data
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate("/signup")}
            className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors font-medium text-sm"
          >
            Create Your Portfolio
          </button>
        </div>
      </div>

      {/* Hero */}
      <div className="bg-gradient-to-br from-primary/5 via-background to-background border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground text-3xl font-bold shrink-0">
              {initials}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {demoUser.name}
              </h1>
              <p className="text-foreground/80 text-sm mb-4 max-w-xl leading-relaxed">
                {demoUser.bio}
              </p>
              {techTags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-5">
                  {techTags.map((t: string) => (
                    <span
                      key={t}
                      className="bg-primary/10 border border-primary/20 text-primary px-2.5 py-0.5 rounded-full text-sm"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}
              <div className="flex flex-wrap gap-3">
                <span className="flex items-center gap-1.5 text-muted-foreground text-sm">
                  <Globe className="w-4 h-4" /> Website
                </span>
                <span className="flex items-center gap-1.5 text-muted-foreground text-sm">
                  <Github className="w-4 h-4" /> GitHub
                </span>
                <span className="flex items-center gap-1.5 text-muted-foreground text-sm">
                  <Linkedin className="w-4 h-4" /> LinkedIn
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((s, i) => (
            <div
              key={i}
              className="bg-card border border-border rounded-2xl p-5"
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${s.color}20` }}
                >
                  <s.icon className="w-5 h-5" style={{ color: s.color }} />
                </div>
              </div>
              <p className="text-2xl font-bold text-foreground mb-1">
                {typeof s.value === "number"
                  ? s.value.toLocaleString()
                  : s.value}
              </p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Difficulty Breakdown */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <h3 className="text-foreground font-semibold mb-5">
              Difficulty Breakdown
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={diffPie}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {diffPie.map((e, i) => (
                    <Cell key={i} fill={e.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "1px solid rgba(148,163,184,0.15)",
                    borderRadius: "10px",
                    color: "#e5e7eb",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-4">
              {diffPie.map((d) => (
                <div
                  key={d.name}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground"
                >
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: d.color }}
                  />
                  <span>
                    {d.name}: {d.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Platform Distribution */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <h3 className="text-foreground font-semibold mb-5">
              Platform Distribution
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={platformPie}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {platformPie.map((e, i) => (
                    <Cell key={i} fill={e.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "1px solid rgba(148,163,184,0.15)",
                    borderRadius: "10px",
                    color: "#e5e7eb",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-4">
              {platformPie.map((p) => (
                <div
                  key={p.name}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground"
                >
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: p.color }}
                  />
                  <span>
                    {p.name}: {p.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* GitHub Heatmap */}
        <div className="bg-card border border-border rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-foreground font-semibold">GitHub Activity</h3>
            <span className="text-primary text-sm">View on GitHub →</span>
          </div>
          <div className="overflow-x-auto">
            <div className="inline-grid grid-flow-col auto-cols-max gap-1">
              {heatmapData.slice(-365).map((d, i) => (
                <HeatmapCell key={i} count={d.count} />
              ))}
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            {demoStats.github.contributions.toLocaleString()} contributions in
            the last year
          </p>
        </div>

        {/* Languages */}
        <div className="bg-card border border-border rounded-2xl p-6 mb-8">
          <h3 className="text-foreground font-semibold mb-5">Top Languages</h3>
          <div className="space-y-3">
            {topLanguages.map((lang) => (
              <div key={lang.name}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-foreground flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{
                        backgroundColor: langColors[lang.name] || "#94a3b8",
                      }}
                    />
                    {lang.name}
                  </span>
                  <span className="text-muted-foreground">{lang.percent}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${lang.percent}%`,
                      backgroundColor: langColors[lang.name] || "#94a3b8",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-br from-primary/10 via-purple-500/10 to-pink-500/10 border-2 border-primary/20 rounded-3xl p-12 text-center">
          <Code2 className="w-16 h-16 text-primary mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Create Your Own CodeFolio
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            Track your coding journey, showcase your achievements, and share
            your portfolio with the world.
          </p>
          <button
            onClick={() => navigate("/signup")}
            className="bg-gradient-to-r from-primary to-primary/90 text-primary-foreground px-8 py-4 rounded-xl hover:shadow-lg hover:shadow-primary/25 transition-all inline-flex items-center justify-center gap-2 font-semibold text-lg group"
          >
            Get Started Free
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <p className="text-sm text-muted-foreground mt-4">
            ✨ No credit card required • Setup in 2 minutes
          </p>
        </div>
      </div>
    </div>
  );
}
