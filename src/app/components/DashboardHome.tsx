import React, { useState, useEffect } from "react";
import { getLeetCodeStats } from "../../lib/leetcode";
import { getGitHubData } from "../../lib/github";
import { useNavigate } from "react-router";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Code, Award, FolderGit2, TrendingUp, Github } from "lucide-react";
import {
  StatsCardSkeleton,
  ChartSkeletonStyled,
  HeatmapSkeleton,
} from "./Skeleton";
import { useUser } from "./UserContext";

const platformData = [
  { name: "Jan", LeetCode: 45, CodeChef: 20, GitHub: 12 },
  { name: "Feb", LeetCode: 52, CodeChef: 28, GitHub: 15 },
  { name: "Mar", LeetCode: 61, CodeChef: 35, GitHub: 18 },
  { name: "Apr", LeetCode: 55, CodeChef: 30, GitHub: 22 },
  { name: "May", LeetCode: 70, CodeChef: 42, GitHub: 25 },
  { name: "Jun", LeetCode: 68, CodeChef: 38, GitHub: 20 },
];

const activityData = Array.from({ length: 52 }, (_, weekIdx) =>
  Array.from({ length: 7 }, (_, dayIdx) => ({
    week: weekIdx,
    day: dayIdx,
    count: Math.floor(Math.random() * 5),
  }))
).flat();

const heatmapColors = ["#1e293b", "#064e3b", "#059669", "#10b981", "#34d399"];

interface StatsCardConfig {
  label: string;
  value: string;
  change: string;
  icon: typeof Code;
  color: string;
  platform: "leetcode" | "codechef" | "github" | null;
}

function EmptyPlatformCard({
  platform,
  icon,
}: {
  platform: string;
  icon: React.ReactNode;
}) {
  const navigate = useNavigate();
  return (
    <div className="bg-card border border-border border-dashed rounded-2xl p-5 flex flex-col items-center justify-center text-center min-h-[140px]">
      <div className="opacity-40 mb-2">{icon}</div>
      <p className="text-muted-foreground text-xs mb-3">
        Connect {platform} to see your stats
      </p>
      <button
        onClick={() => navigate("/dashboard/settings")}
        className="bg-primary text-primary-foreground px-4 py-1.5 rounded-lg text-xs cursor-pointer hover:bg-primary/90 transition-all"
        style={{ fontWeight: 600 }}
      >
        Connect
      </button>
    </div>
  );
}

export function DashboardHome() {
  const [lcStats, setLcStats] = useState<any>(null);
  const [ghData, setGhData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();
  const navigate = useNavigate();

  const firstName = user.name.split(" ")[0];

  // Inside component so it updates when lcStats loads
  const difficultyData = [
    { name: "Easy",   value: lcStats?.easySolved   ?? 0, color: "#10b981" },
    { name: "Medium", value: lcStats?.mediumSolved  ?? 0, color: "#f59e0b" },
    { name: "Hard",   value: lcStats?.hardSolved    ?? 0, color: "#ef4444" },
  ];

  useEffect(() => {
    async function loadStats() {
      try {
        // user.leetcode → maps to lc_username in Appwrite DB
        if (user.leetcode) {
          const lc = await getLeetCodeStats(user.leetcode);
          if (lc) setLcStats(lc);
        }

        // user.github → maps to gh_username in Appwrite DB
        if (user.github) {
          const gh = await getGitHubData(user.github);
          if (gh) setGhData(gh);
        }
      } catch (e) {
        console.error(e);
      }

      setLoading(false);
    }

    loadStats();
  }, [user.leetcode, user.github]);

  const statsCards: StatsCardConfig[] = [
    {
      label: "Total Problems Solved",
      value: lcStats ? String(lcStats.totalSolved) : "0",
      change: lcStats
        ? `${lcStats.easySolved}E · ${lcStats.mediumSolved}M · ${lcStats.hardSolved}H`
        : "",
      icon: Code,
      color: "#10b981",
      platform: null,
    },
    {
      label: "LeetCode Rating",
      value: lcStats?.contestRating ? String(lcStats.contestRating) : "0",
      change: "",
      icon: TrendingUp,
      color: "#3b82f6",
      platform: "leetcode",
    },
    {
      label: "CodeChef Stars",
      value: user.codechef ? "Connected" : "0",
      change: "",
      icon: Award,
      color: "#f59e0b",
      platform: "codechef",
    },
    {
      label: "GitHub Repositories",
      value: ghData ? String(ghData.public_repos) : "0",
      change: ghData ? `${ghData.followers} followers` : "",
      icon: FolderGit2,
      color: "#8b5cf6",
      platform: "github",
    },
  ];

  const platformIcons: Record<string, React.ReactNode> = {
    leetcode: <span className="text-2xl">🧩</span>,
    codechef: <span className="text-2xl">👨‍🍳</span>,
    github: <Github className="w-6 h-6 text-muted-foreground" />,
  };

  const platformLabels: Record<string, string> = {
    leetcode: "LeetCode",
    codechef: "CodeChef",
    github: "GitHub",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl text-foreground mb-1" style={{ fontWeight: 700 }}>
          Welcome back, {firstName} 👋
        </h1>
        <p className="text-muted-foreground">Here's your coding progress overview</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading
          ? Array.from({ length: 4 }, (_, i) => <StatsCardSkeleton key={i} />)
          : statsCards.map((card) => {
              if (card.platform && !user[card.platform as keyof typeof user]) {
                return (
                  <EmptyPlatformCard
                    key={card.label}
                    platform={platformLabels[card.platform]}
                    icon={platformIcons[card.platform]}
                  />
                );
              }
              return (
                <div
                  key={card.label}
                  className="bg-card border border-border rounded-2xl p-5 hover:border-primary/20 transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${card.color}15` }}
                    >
                      <card.icon className="w-5 h-5" style={{ color: card.color }} />
                    </div>
                  </div>
                  <p className="text-2xl text-foreground mb-0.5" style={{ fontWeight: 700 }}>
                    {card.value}
                  </p>
                  <p className="text-muted-foreground text-xs">{card.label}</p>
                  {card.change && (
                    <p className="text-primary text-xs mt-1" style={{ fontWeight: 500 }}>
                      {card.change}
                    </p>
                  )}
                </div>
              );
            })}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {loading ? (
          <>
            <ChartSkeletonStyled height={200} />
            <div className="lg:col-span-2">
              <ChartSkeletonStyled height={230} />
            </div>
          </>
        ) : (
          <>
            {/* Difficulty Distribution */}
            <div className="bg-card border border-border rounded-2xl p-5">
              <h3 className="text-foreground mb-4" style={{ fontWeight: 600 }}>
                Difficulty Distribution
              </h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={difficultyData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {difficultyData.map((entry) => (
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
              <div className="flex justify-center gap-4 mt-2">
                {difficultyData.map((d) => (
                  <div key={d.name} className="flex items-center gap-1.5">
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: d.color }}
                    />
                    <span className="text-xs text-muted-foreground">
                      {d.name} ({d.value})
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Platform Comparison */}
            <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-5">
              <h3 className="text-foreground mb-4" style={{ fontWeight: 600 }}>
                Platform Comparison
              </h3>
              <ResponsiveContainer width="100%" height={230}>
                <BarChart data={platformData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid rgba(148,163,184,0.15)",
                      borderRadius: "12px",
                      color: "#e5e7eb",
                    }}
                  />
                  <Bar dataKey="LeetCode" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="CodeChef" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="GitHub"   fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </div>

      {/* Activity Heatmap */}
      {loading ? (
        <HeatmapSkeleton />
      ) : (
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-foreground" style={{ fontWeight: 600 }}>
              Coding Activity
            </h3>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <span>Less</span>
              {heatmapColors.map((c, i) => (
                <div
                  key={i}
                  className="w-3 h-3 rounded-sm"
                  style={{ backgroundColor: c }}
                />
              ))}
              <span>More</span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <div className="flex gap-[3px] min-w-[700px]">
              {Array.from({ length: 52 }, (_, weekIdx) => (
                <div key={weekIdx} className="flex flex-col gap-[3px]">
                  {Array.from({ length: 7 }, (_, dayIdx) => {
                    const item = activityData.find(
                      (a) => a.week === weekIdx && a.day === dayIdx
                    );
                    return (
                      <div
                        key={dayIdx}
                        className="w-3 h-3 rounded-sm"
                        style={{
                          backgroundColor: heatmapColors[item?.count || 0],
                        }}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}