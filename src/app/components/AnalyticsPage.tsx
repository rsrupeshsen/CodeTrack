import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { BarChart3, Flame, Target, TrendingDown, Zap } from "lucide-react";
import {
  AnalyticsStatSkeleton,
  ChartSkeletonStyled,
  WeakTopicsSkeleton,
} from "./Skeleton";
import { useUser } from "./UserContext";

const skillData = [
  { subject: "Arrays", A: 90 },
  { subject: "Graphs", A: 45 },
  { subject: "DP", A: 65 },
  { subject: "Trees", A: 75 },
  { subject: "Strings", A: 85 },
  { subject: "Math", A: 70 },
  { subject: "Greedy", A: 60 },
  { subject: "Binary Search", A: 80 },
];

const monthlyData = [
  { month: "Jul", problems: 42 },
  { month: "Aug", problems: 58 },
  { month: "Sep", problems: 51 },
  { month: "Oct", problems: 73 },
  { month: "Nov", problems: 65 },
  { month: "Dec", problems: 89 },
  { month: "Jan", problems: 76 },
  { month: "Feb", problems: 92 },
  { month: "Mar", problems: 85 },
];

const difficultyPie = [
  { name: "Easy", value: 425, color: "#10b981" },
  { name: "Medium", value: 520, color: "#f59e0b" },
  { name: "Hard", value: 302, color: "#ef4444" },
];

const weakTopics = [
  { topic: "Graphs", solved: 23, total: 80, pct: 29 },
  { topic: "Dynamic Programming", solved: 45, total: 120, pct: 38 },
  { topic: "Segment Trees", solved: 5, total: 25, pct: 20 },
  { topic: "Tries", solved: 8, total: 30, pct: 27 },
];

export function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const { user } = useUser();
  const navigate = useNavigate();

  const hasData = !!(user.leetcode || user.codechef || user.github);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Empty state when no platforms connected
  if (!loading && !hasData) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl text-foreground mb-1" style={{ fontWeight: 700 }}>
            Analytics
          </h1>
          <p className="text-muted-foreground">Deep dive into your coding performance</p>
        </div>
        <div className="bg-card border border-border border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center">
          <BarChart3 className="w-12 h-12 text-muted-foreground opacity-40 mb-4" />
          <h2 className="text-foreground mb-2" style={{ fontWeight: 600 }}>
            No analytics yet
          </h2>
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl text-foreground mb-1" style={{ fontWeight: 700 }}>
          Analytics
        </h1>
        <p className="text-muted-foreground">Deep dive into your coding performance</p>
      </div>

      {/* Top Row */}
      <div className="grid sm:grid-cols-3 gap-4">
        {loading ? (
          <>
            <AnalyticsStatSkeleton />
            <AnalyticsStatSkeleton />
            <AnalyticsStatSkeleton />
          </>
        ) : (
          <>
            <div className="bg-card border border-border rounded-2xl p-5 flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <Flame className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl text-foreground" style={{ fontWeight: 700 }}>47 days</p>
                <p className="text-muted-foreground text-sm">Current Streak</p>
              </div>
            </div>
            <div className="bg-card border border-border rounded-2xl p-5 flex items-center gap-4">
              <div className="w-12 h-12 bg-chart-2/10 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-chart-2" />
              </div>
              <div>
                <p className="text-2xl text-foreground" style={{ fontWeight: 700 }}>92 days</p>
                <p className="text-muted-foreground text-sm">Longest Streak</p>
              </div>
            </div>
            <div className="bg-card border border-border rounded-2xl p-5 flex items-center gap-4">
              <div className="w-12 h-12 bg-chart-3/10 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-chart-3" />
              </div>
              <div>
                <p className="text-2xl text-foreground" style={{ fontWeight: 700 }}>3.2/day</p>
                <p className="text-muted-foreground text-sm">Avg Problems</p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {loading ? (
          <>
            <ChartSkeletonStyled height={300} />
            <ChartSkeletonStyled height={300} />
            <ChartSkeletonStyled height={250} />
            <WeakTopicsSkeleton />
          </>
        ) : (
          <>
            {/* Radar */}
            <div className="bg-card border border-border rounded-2xl p-5">
              <h3 className="text-foreground mb-4" style={{ fontWeight: 600 }}>
                Topic Skills Radar
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={skillData}>
                  <PolarGrid stroke="rgba(148,163,184,0.15)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: "#94a3b8", fontSize: 12 }} />
                  <PolarRadiusAxis
                    angle={30}
                    domain={[0, 100]}
                    tick={{ fill: "#94a3b8", fontSize: 10 }}
                  />
                  <Radar
                    name="Skill"
                    dataKey="A"
                    stroke="#10b981"
                    fill="#10b981"
                    fillOpacity={0.2}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid rgba(148,163,184,0.15)",
                      borderRadius: "12px",
                      color: "#e5e7eb",
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Monthly Solving */}
            <div className="bg-card border border-border rounded-2xl p-5">
              <h3 className="text-foreground mb-4" style={{ fontWeight: 600 }}>
                Monthly Progress
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={monthlyData}>
                  <defs>
                    <linearGradient id="colorProblems" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid rgba(148,163,184,0.15)",
                      borderRadius: "12px",
                      color: "#e5e7eb",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="problems"
                    stroke="#10b981"
                    fill="url(#colorProblems)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Pie */}
            <div className="bg-card border border-border rounded-2xl p-5">
              <h3 className="text-foreground mb-4" style={{ fontWeight: 600 }}>
                Difficulty Distribution
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={difficultyPie}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    dataKey="value"
                    strokeWidth={0}
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {difficultyPie.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid rgba(148,163,184,0.15)",
                      borderRadius: "12px",
                      color: "#e5e7eb",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Weak Topics */}
            <div className="bg-card border border-border rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <TrendingDown className="w-5 h-5 text-destructive" />
                <h3 className="text-foreground" style={{ fontWeight: 600 }}>
                  Weak Topics
                </h3>
              </div>
              <div className="space-y-4">
                {weakTopics.map((t) => (
                  <div key={t.topic}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-foreground text-sm" style={{ fontWeight: 500 }}>
                        {t.topic}
                      </span>
                      <span className="text-muted-foreground text-xs">
                        {t.solved}/{t.total} solved
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-destructive"
                        style={{ width: `${t.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-muted-foreground text-xs mt-4">
                Focus on these topics to improve your overall performance.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}