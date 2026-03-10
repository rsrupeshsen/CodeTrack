import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { getAIInsights } from "../../lib/aiInsights";
import { getContestInfo } from "../../lib/leetcodeContest";
import { Sparkles, RefreshCw } from "lucide-react";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip,
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
} from "recharts";
import { BarChart3, Flame, Target, TrendingDown, Zap } from "lucide-react";
import {
  AnalyticsStatSkeleton, ChartSkeletonStyled, WeakTopicsSkeleton,
} from "./Skeleton";
import { useUser } from "./UserContext";
import { getLeetCodeStats } from "../../lib/leetcode";
import { getGFGStats } from "../../lib/gfg";

// ── Helpers ───────────────────────────────────────────────────────────────────

async function fetchLCCalendarRaw(username: string): Promise<Record<string, number>> {
  const BASE = import.meta.env.VITE_LEETCODE_API_URL;
  try {
    const res  = await fetch(`${BASE}/${username}/calendar`);
    const json = await res.json();
    if (json?.submissionCalendar) {
      return typeof json.submissionCalendar === "string"
        ? JSON.parse(json.submissionCalendar)
        : json.submissionCalendar;
    }
  } catch {}
  return {};
}

function calcStreak(calendar: Record<string, number>): { current: number; longest: number } {
  if (!Object.keys(calendar).length) return { current: 0, longest: 0 };

  const days = Object.keys(calendar)
    .map((ts) => new Date(Number(ts) * 1000).toISOString().split("T")[0])
    .sort();

  const today   = new Date().toISOString().split("T")[0];
  const todayMs = new Date(today).getTime();

  let current = 0;
  let longest = 0;
  let streak  = 1;

  for (let i = days.length - 1; i >= 0; i--) {
    const dayMs    = new Date(days[i]).getTime();
    const diffDays = Math.round((todayMs - dayMs) / 86400000);
    if (i === days.length - 1) {
      current = diffDays <= 1 ? 1 : 0;
    } else {
      const prevMs = new Date(days[i + 1]).getTime();
      const gap    = Math.round((prevMs - dayMs) / 86400000);
      if (gap === 1) { if (current > 0) current++; }
      else           { current = 0; }
    }
  }

  for (let i = 1; i < days.length; i++) {
    const prevMs = new Date(days[i - 1]).getTime();
    const curMs  = new Date(days[i]).getTime();
    const gap    = Math.round((curMs - prevMs) / 86400000);
    if (gap === 1) { streak++; longest = Math.max(longest, streak); }
    else           { streak = 1; }
  }
  longest = Math.max(longest, streak);

  return { current, longest };
}

function calcMonthlyFromCalendar(calendar: Record<string, number>) {
  const monthMap: Record<string, number> = {};
  Object.entries(calendar).forEach(([ts, count]) => {
    const d     = new Date(Number(ts) * 1000);
    const label = d.toLocaleString("default", { month: "short", year: "2-digit" });
    monthMap[label] = (monthMap[label] || 0) + Number(count);
  });
  return Object.entries(monthMap)
    .map(([month, problems]) => ({ month, problems }))
    .slice(-9);
}

const staticSkillData = [
  { subject: "Arrays",        A: 85 },
  { subject: "Graphs",        A: 45 },
  { subject: "DP",            A: 65 },
  { subject: "Trees",         A: 75 },
  { subject: "Strings",       A: 80 },
  { subject: "Math",          A: 70 },
  { subject: "Greedy",        A: 60 },
  { subject: "Binary Search", A: 78 },
];

const fallbackMonthly = [
  { month: "Jul", problems: 42 }, { month: "Aug", problems: 58 },
  { month: "Sep", problems: 51 }, { month: "Oct", problems: 73 },
  { month: "Nov", problems: 65 }, { month: "Dec", problems: 89 },
  { month: "Jan", problems: 76 }, { month: "Feb", problems: 92 },
  { month: "Mar", problems: 85 },
];

// ── Component ─────────────────────────────────────────────────────────────────

export function AnalyticsPage() {
  // ── Per-section loading states (progressive) ──────────────────────────────
  const [lcLoading, setLcLoading]           = useState(true);
  const [gfgLoading, setGfgLoading]         = useState(true);
  const [calLoading, setCalLoading]         = useState(true);
  const [contestLoading, setContestLoading] = useState(true);

  // ── Data states ───────────────────────────────────────────────────────────
  const [lcStats, setLcStats]               = useState<any>(null);
  const [gfgData, setGfgData]               = useState<any>(null);
  const [contestData, setContestData]       = useState<any>(null);
  const [currentStreak, setCurrentStreak]   = useState(0);
  const [longestStreak, setLongestStreak]   = useState(0);
  const [monthlyData, setMonthlyData]       = useState<{ month: string; problems: number }[]>([]);

  // ── AI states ─────────────────────────────────────────────────────────────
  const [aiInsights, setAiInsights]         = useState<string>("");
  const [aiLoading, setAiLoading]           = useState(false);
  const [aiGenerated, setAiGenerated]       = useState(false);

  const { user } = useUser();
  const navigate = useNavigate();
  const hasData  = !!(user.leetcode || user.gfg || user.github);

  // ── Fire each fetch independently so sections load as they finish ─────────
  useEffect(() => {
    if (!hasData) {
      setLcLoading(false);
      setGfgLoading(false);
      setCalLoading(false);
      setContestLoading(false);
      return;
    }

    if (user.leetcode) {
      // LC stats
      getLeetCodeStats(user.leetcode)
        .then((d) => { if (d) setLcStats(d); })
        .finally(() => setLcLoading(false));

      // Contest info
      getContestInfo(user.leetcode)
        .then((d) => { if (d) setContestData(d); })
        .finally(() => setContestLoading(false));

      // Calendar (streak + monthly)
      fetchLCCalendarRaw(user.leetcode)
        .then((cal) => {
          const { current, longest } = calcStreak(cal);
          setCurrentStreak(current);
          setLongestStreak(longest);
          const monthly = calcMonthlyFromCalendar(cal);
          if (monthly.length > 0) setMonthlyData(monthly);
        })
        .finally(() => setCalLoading(false));
    } else {
      setLcLoading(false);
      setCalLoading(false);
      setContestLoading(false);
    }

    if (user.gfg) {
      getGFGStats(user.gfg)
        .then((d) => { if (d) setGfgData(d); })
        .finally(() => setGfgLoading(false));
    } else {
      setGfgLoading(false);
    }
  }, [user.leetcode, user.gfg]);

  // ── Derived data ──────────────────────────────────────────────────────────
  const totalDays = monthlyData.reduce((s, m) => s + m.problems, 0);
  const avgPerDay = monthlyData.length
    ? (totalDays / (monthlyData.length * 30)).toFixed(1)
    : "0";

  const difficultyPie = [
    { name: "Easy",   value: (lcStats?.easySolved   || 0) + (gfgData?.easy   || 0), color: "#10b981" },
    { name: "Medium", value: (lcStats?.mediumSolved || 0) + (gfgData?.medium || 0), color: "#f59e0b" },
    { name: "Hard",   value: (lcStats?.hardSolved   || 0) + (gfgData?.hard   || 0), color: "#ef4444" },
  ];

  const totalEasy   = difficultyPie[0].value;
  const totalMedium = difficultyPie[1].value;
  const totalHard   = difficultyPie[2].value;
  const totalSolved = totalEasy + totalMedium + totalHard;

  const weakTopics = totalSolved > 0 ? [
    {
      topic: "Hard Problems",
      solved: totalHard,
      total: Math.round(totalSolved * 0.4),
      pct: Math.min(100, Math.round((totalHard / Math.max(1, totalSolved)) * 100)),
    },
    {
      topic: "Medium Problems",
      solved: totalMedium,
      total: Math.round(totalSolved * 0.6),
      pct: Math.min(100, Math.round((totalMedium / Math.max(1, totalSolved)) * 100)),
    },
    {
      topic: "GFG Problems",
      solved: gfgData?.totalSolved || 0,
      total: Math.max(100, (gfgData?.totalSolved || 0) + 40),
      pct: Math.min(100, Math.round(((gfgData?.totalSolved || 0) / Math.max(1, (gfgData?.totalSolved || 0) + 40)) * 100)),
    },
  ] : [
    { topic: "Graphs",              solved: 23, total: 80,  pct: 29 },
    { topic: "Dynamic Programming", solved: 45, total: 120, pct: 38 },
    { topic: "Segment Trees",       solved: 5,  total: 25,  pct: 20 },
    { topic: "Tries",               solved: 8,  total: 30,  pct: 27 },
  ];

  const displayMonthly = monthlyData.length > 0 ? monthlyData : fallbackMonthly;

  // ── AI Insights ───────────────────────────────────────────────────────────
  async function generateInsights() {
    setAiLoading(true);
    const text = await getAIInsights({ lcStats, gfgData, currentStreak, longestStreak, totalSolved, userName: user.name });
    setAiInsights(text);
    setAiGenerated(true);
    setAiLoading(false);
  }

  // ── Empty state ───────────────────────────────────────────────────────────
  if (!lcLoading && !gfgLoading && !hasData) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl text-foreground mb-1" style={{ fontWeight: 700 }}>Analytics</h1>
          <p className="text-muted-foreground">Deep dive into your coding performance</p>
        </div>
        <div className="bg-card border border-border border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center">
          <BarChart3 className="w-12 h-12 text-muted-foreground opacity-40 mb-4" />
          <h2 className="text-foreground mb-2" style={{ fontWeight: 600 }}>No analytics yet</h2>
          <p className="text-muted-foreground text-sm mb-6 max-w-sm">
            Connect your coding platforms in Settings to see insights
          </p>
          <button
            onClick={() => navigate("/dashboard/settings")}
            className="bg-primary text-primary-foreground px-6 py-2.5 rounded-xl cursor-pointer hover:bg-primary/90 transition-all"
            style={{ fontWeight: 600 }}
          >
            Go to Settings
          </button>
        </div>
      </div>
    );
  }

  const tooltipStyle = {
    backgroundColor: "#1e293b",
    border: "1px solid rgba(148,163,184,0.15)",
    borderRadius: "12px",
    color: "#e5e7eb",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl text-foreground mb-1" style={{ fontWeight: 700 }}>Analytics</h1>
        <p className="text-muted-foreground">Deep dive into your coding performance</p>
      </div>

      {/* ── Top Stats Row — each card independent ── */}
      <div className="grid sm:grid-cols-3 gap-4">

        {/* Current Streak */}
        <div className="bg-card border border-border rounded-2xl p-5 flex items-center gap-4 min-h-[88px]">
          {calLoading ? <AnalyticsStatSkeleton /> : (
            <>
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                <Flame className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl text-foreground" style={{ fontWeight: 700 }}>
                  {currentStreak > 0 ? `${currentStreak} days` : "—"}
                </p>
                <p className="text-muted-foreground text-sm">Current Streak</p>
              </div>
            </>
          )}
        </div>

        {/* Longest Streak */}
        <div className="bg-card border border-border rounded-2xl p-5 flex items-center gap-4 min-h-[88px]">
          {calLoading ? <AnalyticsStatSkeleton /> : (
            <>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: "rgba(59,130,246,0.1)" }}>
                <Target className="w-6 h-6" style={{ color: "#3b82f6" }} />
              </div>
              <div>
                <p className="text-2xl text-foreground" style={{ fontWeight: 700 }}>
                  {longestStreak > 0 ? `${longestStreak} days` : "—"}
                </p>
                <p className="text-muted-foreground text-sm">Longest Streak</p>
              </div>
            </>
          )}
        </div>

        {/* Avg Problems */}
        <div className="bg-card border border-border rounded-2xl p-5 flex items-center gap-4 min-h-[88px]">
          {calLoading ? <AnalyticsStatSkeleton /> : (
            <>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: "rgba(245,158,11,0.1)" }}>
                <Zap className="w-6 h-6" style={{ color: "#f59e0b" }} />
              </div>
              <div>
                <p className="text-2xl text-foreground" style={{ fontWeight: 700 }}>{avgPerDay}/day</p>
                <p className="text-muted-foreground text-sm">Avg Problems</p>
              </div>
            </>
          )}
        </div>

      </div>

      {/* ── Charts Grid ── */}
      <div className="grid lg:grid-cols-2 gap-6">

        {/* Topic Skills Radar — static data, renders immediately */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <h3 className="text-foreground mb-4" style={{ fontWeight: 600 }}>Topic Skills Radar</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={staticSkillData}>
              <PolarGrid stroke="rgba(148,163,184,0.15)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: "#94a3b8", fontSize: 12 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "#94a3b8", fontSize: 10 }} />
              <Radar name="Skill" dataKey="A" stroke="#10b981" fill="#10b981" fillOpacity={0.2} />
              <Tooltip contentStyle={tooltipStyle} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Progress */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <h3 className="text-foreground mb-4" style={{ fontWeight: 600 }}>Monthly Progress</h3>
          {calLoading ? <ChartSkeletonStyled height={300} /> : (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={displayMonthly}>
                <defs>
                  <linearGradient id="colorProblems" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}   />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="problems" stroke="#10b981" fill="url(#colorProblems)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Difficulty Distribution */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <h3 className="text-foreground mb-4" style={{ fontWeight: 600 }}>Difficulty Distribution</h3>
          {(lcLoading || gfgLoading) ? <ChartSkeletonStyled height={250} /> : (
            <>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={difficultyPie}
                    cx="50%" cy="50%"
                    innerRadius={60} outerRadius={90}
                    dataKey="value" strokeWidth={0}
                    label={({ name, value }) => value > 0 ? `${name}: ${value}` : ""}
                  >
                    {difficultyPie.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-4 mt-2">
                {difficultyPie.map((d) => (
                  <div key={d.name} className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                    <span className="text-xs text-muted-foreground">{d.name} ({d.value})</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Focus Areas */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingDown className="w-5 h-5 text-destructive" />
            <h3 className="text-foreground" style={{ fontWeight: 600 }}>Focus Areas</h3>
          </div>
          {(lcLoading || gfgLoading) ? <WeakTopicsSkeleton /> : (
            <>
              <div className="space-y-4">
                {weakTopics.map((t) => (
                  <div key={t.topic}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-foreground text-sm" style={{ fontWeight: 500 }}>{t.topic}</span>
                      <span className="text-muted-foreground text-xs">{t.solved}/{t.total} solved</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all"
                        style={{
                          width: `${t.pct}%`,
                          backgroundColor: t.pct < 35 ? "#ef4444" : t.pct < 60 ? "#f59e0b" : "#10b981",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-muted-foreground text-xs mt-4">
                Focus on these areas to improve your overall performance.
              </p>
            </>
          )}
        </div>

      </div>

      {/* ── Contest Rating History ── */}
      {contestLoading ? (
        <ChartSkeletonStyled height={220} />
      ) : contestData?.history?.length > 0 ? (
        <div className="bg-card border border-border rounded-2xl p-5">
          <h3 className="text-foreground mb-4" style={{ fontWeight: 600 }}>Contest Rating History</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={contestData.history}>
              <defs>
                <linearGradient id="contestGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#f59e0b" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}   />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
              <XAxis dataKey="name" hide />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area type="monotone" dataKey="rating" stroke="#f59e0b" fill="url(#contestGrad)" strokeWidth={2} dot={{ r: 3, fill: "#f59e0b" }} />
            </AreaChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-6 mt-3">
            <div className="text-center">
              <p className="text-lg" style={{ fontWeight: 700, color: "#f59e0b" }}>{contestData.rating}</p>
              <p className="text-muted-foreground text-xs">Current Rating</p>
            </div>
            <div className="text-center">
              <p className="text-lg text-foreground" style={{ fontWeight: 700 }}>Top {contestData.topPercent}%</p>
              <p className="text-muted-foreground text-xs">Global Rank</p>
            </div>
            <div className="text-center">
              <p className="text-lg text-foreground" style={{ fontWeight: 700 }}>{contestData.attended}</p>
              <p className="text-muted-foreground text-xs">Contests Attended</p>
            </div>
          </div>
        </div>
      ) : null}

      {/* ── GFG Stats row ── */}
      {!gfgLoading && gfgData && (
        <div className="grid sm:grid-cols-4 gap-4">
          {[
            { label: "GFG Total",     value: gfgData.totalSolved,  color: "#2f8d46" },
            { label: "Coding Score",  value: gfgData.totalScore,   color: "#2f8d46" },
            { label: "Streak",        value: `${gfgData.streak}d`, color: "#f59e0b" },
            { label: "Monthly Score", value: gfgData.monthlyScore, color: "#3b82f6" },
          ].map((s) => (
            <div key={s.label} className="bg-card border border-border rounded-2xl p-4 text-center">
              <p className="text-xl" style={{ fontWeight: 700, color: s.color }}>{s.value}</p>
              <p className="text-muted-foreground text-xs mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* ── AI Insights ── */}
      {hasData && (
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <h3 className="text-foreground" style={{ fontWeight: 600 }}>AI Insights</h3>
              <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full" style={{ fontWeight: 500 }}>
                Powered by Groq
              </span>
            </div>
            <button
              onClick={generateInsights}
              disabled={aiLoading}
              className="flex items-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary px-4 py-2 rounded-xl text-sm transition-all cursor-pointer disabled:opacity-50"
              style={{ fontWeight: 500 }}
            >
              <RefreshCw className={`w-4 h-4 ${aiLoading ? "animate-spin" : ""}`} />
              {aiGenerated ? "Regenerate" : "Analyze My Stats"}
            </button>
          </div>

          {aiLoading && (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-4 bg-muted rounded animate-pulse" style={{ width: `${60 + i * 12}%` }} />
              ))}
            </div>
          )}

          {aiInsights && !aiLoading && (
            <div className="text-muted-foreground text-sm leading-relaxed whitespace-pre-line">
              {aiInsights}
            </div>
          )}

          {!aiInsights && !aiLoading && (
            <p className="text-muted-foreground text-sm">
              Click "Analyze My Stats" to get personalized AI recommendations based on your coding data.
            </p>
          )}
        </div>
      )}

    </div>
  );
}