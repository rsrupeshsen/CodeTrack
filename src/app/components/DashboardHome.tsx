
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import { Code, Award, FolderGit2, TrendingUp, Github, X } from "lucide-react";
import { StatsCardSkeleton, ChartSkeletonStyled, HeatmapSkeleton } from "./Skeleton";
import { useUser } from "./UserContext";
import { getLeetCodeStats } from "../../lib/leetcode";
import { getGitHubData } from "../../lib/github";
import { getGFGStats } from "../../lib/gfg";

const platformData = [
  { name: "Jan", LeetCode: 45, GFG: 20, GitHub: 12 },
  { name: "Feb", LeetCode: 52, GFG: 28, GitHub: 15 },
  { name: "Mar", LeetCode: 61, GFG: 35, GitHub: 18 },
  { name: "Apr", LeetCode: 55, GFG: 30, GitHub: 22 },
  { name: "May", LeetCode: 70, GFG: 42, GitHub: 25 },
  { name: "Jun", LeetCode: 68, GFG: 38, GitHub: 20 },
];

const activityData = Array.from({ length: 52 }, (_, weekIdx) =>
  Array.from({ length: 7 }, (_, dayIdx) => ({
    week: weekIdx,
    day: dayIdx,
    count: Math.floor(Math.random() * 5),
  }))
).flat();

const heatmapColors = ["#1e293b", "#064e3b", "#059669", "#10b981", "#34d399"];

// ── Platform Detail Modal ─────────────────────────────────────────────────────
function PlatformModal({
  platform,
  lcStats,
  gfgData,
  ghData,
  onClose,
}: {
  platform: "leetcode" | "gfg" | "github";
  lcStats: any;
  gfgData: any;
  ghData: any;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-card border border-border rounded-2xl p-6 w-full max-w-md mx-4 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
        >
          <X className="w-5 h-5" />
        </button>

        {/* LeetCode Detail */}
        {platform === "leetcode" && lcStats && (
          <>
            <div className="flex items-center gap-3 mb-5">
              <span className="text-3xl">🧩</span>
              <div>
                <h2 className="text-lg text-foreground" style={{ fontWeight: 700 }}>LeetCode Stats</h2>
                <p className="text-muted-foreground text-sm">Your problem solving breakdown</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-background rounded-xl p-4 text-center">
                <p className="text-2xl text-foreground" style={{ fontWeight: 700 }}>{lcStats.totalSolved}</p>
                <p className="text-muted-foreground text-xs mt-1">Total Solved</p>
              </div>
              <div className="bg-background rounded-xl p-4 text-center">
                <p className="text-2xl text-primary" style={{ fontWeight: 700 }}>{lcStats.contestRating || "N/A"}</p>
                <p className="text-muted-foreground text-xs mt-1">Contest Rating</p>
              </div>
            </div>
            {/* Difficulty Chart */}
<ResponsiveContainer width="100%" height={220}>
  <PieChart>
    <Pie
      data={[
        { name: "Easy", value: lcStats.easySolved, color: "#10b981" },
        { name: "Medium", value: lcStats.mediumSolved, color: "#f59e0b" },
        { name: "Hard", value: lcStats.hardSolved, color: "#ef4444" },
      ]}
      cx="50%"
      cy="50%"
      innerRadius={60}
      outerRadius={90}
      dataKey="value"
      strokeWidth={0}
    >
      <Cell fill="#10b981" />
      <Cell fill="#f59e0b" />
      <Cell fill="#ef4444" />
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

{/* Legend */}
<div className="flex justify-center gap-4 mt-3">
  <div className="flex items-center gap-1 text-xs">
    <div className="w-3 h-3 rounded-full bg-emerald-500" />
    Easy ({lcStats.easySolved})
  </div>

  <div className="flex items-center gap-1 text-xs">
    <div className="w-3 h-3 rounded-full bg-yellow-500" />
    Medium ({lcStats.mediumSolved})
  </div>

  <div className="flex items-center gap-1 text-xs">
    <div className="w-3 h-3 rounded-full bg-red-500" />
    Hard ({lcStats.hardSolved})
  </div>
</div>
          </>
        )}

        {/* GFG Detail */}
        {platform === "gfg" && gfgData && (
          <>
            <div className="flex items-center gap-3 mb-5">
              <span className="text-3xl">🌿</span>
              <div>
                <h2 className="text-lg text-foreground" style={{ fontWeight: 700 }}>GeeksForGeeks Stats</h2>
                <p className="text-muted-foreground text-sm">Your GFG problem solving breakdown</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-background rounded-xl p-4 text-center">
                <p className="text-2xl text-foreground" style={{ fontWeight: 700 }}>{gfgData.totalSolved}</p>
                <p className="text-muted-foreground text-xs mt-1">Total Solved</p>
              </div>
              <div className="bg-background rounded-xl p-4 text-center">
                <p className="text-2xl" style={{ fontWeight: 700, color: "#2f8d46" }}>{gfgData.totalScore}</p>
                <p className="text-muted-foreground text-xs mt-1">Coding Score</p>
              </div>
            </div>
            {/* GFG Difficulty Chart */}
<ResponsiveContainer width="100%" height={220}>
  <PieChart>
    <Pie
      data={[
        { name: "School", value: gfgData.school, color: "#94a3b8" },
        { name: "Easy", value: gfgData.easy, color: "#10b981" },
        { name: "Medium", value: gfgData.medium, color: "#f59e0b" },
        { name: "Hard", value: gfgData.hard, color: "#ef4444" },
      ]}
      cx="50%"
      cy="50%"
      innerRadius={60}
      outerRadius={90}
      dataKey="value"
      strokeWidth={0}
    >
      <Cell fill="#94a3b8" />
      <Cell fill="#10b981" />
      <Cell fill="#f59e0b" />
      <Cell fill="#ef4444" />
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

{/* Legend */}
<div className="flex justify-center gap-4 mt-3 flex-wrap">
  <div className="flex items-center gap-1 text-xs">
    <div className="w-3 h-3 rounded-full bg-slate-400" />
    School ({gfgData.school})
  </div>

  <div className="flex items-center gap-1 text-xs">
    <div className="w-3 h-3 rounded-full bg-emerald-500" />
    Easy ({gfgData.easy})
  </div>

  <div className="flex items-center gap-1 text-xs">
    <div className="w-3 h-3 rounded-full bg-yellow-500" />
    Medium ({gfgData.medium})
  </div>

  <div className="flex items-center gap-1 text-xs">
    <div className="w-3 h-3 rounded-full bg-red-500" />
    Hard ({gfgData.hard})
  </div>
</div>
            <div className="mt-3 bg-background rounded-xl p-3 flex items-center justify-between">
              <span className="text-muted-foreground text-sm">Current Streak</span>
              <span className="text-foreground text-sm" style={{ fontWeight: 600 }}>🔥 {gfgData.streak} days</span>
            </div>
          </>
        )}

        {/* GitHub Detail */}
        {platform === "github" && ghData && (
          <>
            <div className="flex items-center gap-3 mb-5">
              <Github className="w-8 h-8 text-foreground" />
              <div>
                <h2 className="text-lg text-foreground" style={{ fontWeight: 700 }}>GitHub Stats</h2>
                <p className="text-muted-foreground text-sm">Your repositories overview</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-background rounded-xl p-4 text-center">
                <p className="text-2xl text-foreground" style={{ fontWeight: 700 }}>{ghData.public_repos}</p>
                <p className="text-muted-foreground text-xs mt-1">Repositories</p>
              </div>
              <div className="bg-background rounded-xl p-4 text-center">
                <p className="text-2xl text-primary" style={{ fontWeight: 700 }}>{ghData.followers}</p>
                <p className="text-muted-foreground text-xs mt-1">Followers</p>
              </div>
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto">
            {(ghData.repos || []).map((repo: any) => (
  <a
    key={repo.name}
    href={repo.url}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center justify-between bg-background rounded-xl px-3 py-2 hover:border-primary/30 border border-transparent transition-all"
  >
    <div>
      <p className="text-foreground text-sm" style={{ fontWeight: 500 }}>
        {repo.name}
      </p>
      <p className="text-muted-foreground text-xs">
        {repo.language}
      </p>
    </div>

    <div className="flex items-center gap-1 text-muted-foreground text-xs">
      <span>⭐</span>
      <span>{repo.stars}</span>
    </div>
  </a>
))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── Empty Platform Card ───────────────────────────────────────────────────────
function EmptyPlatformCard({ platform, icon }: { platform: string; icon: React.ReactNode }) {
  const navigate = useNavigate();
  return (
    <div className="bg-card border border-border border-dashed rounded-2xl p-5 flex flex-col items-center justify-center text-center min-h-[140px]">
      <div className="opacity-40 mb-2">{icon}</div>
      <p className="text-muted-foreground text-xs mb-3">Connect {platform} to see your stats</p>
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

// ── Main Dashboard ────────────────────────────────────────────────────────────
export function DashboardHome() {
  const [loading, setLoading]   = useState(true);
  const [lcStats, setLcStats]   = useState<any>(null);
  const [gfgData, setGfgData]   = useState<any>(null);
  const [ghData, setGhData]     = useState<any>(null);
  const [modal, setModal]       = useState<"leetcode" | "gfg" | "github" | null>(null);
  const { user } = useUser();

  const firstName = user.name.split(" ")[0];

  const difficultyData = [
    { name: "Easy",   value: (lcStats?.easySolved || 0)   + (gfgData?.easy   || 0), color: "#10b981" },
    { name: "Medium", value: (lcStats?.mediumSolved || 0) + (gfgData?.medium || 0), color: "#f59e0b" },
    { name: "Hard",   value: (lcStats?.hardSolved || 0)   + (gfgData?.hard   || 0), color: "#ef4444" },
  ];

  const totalSolved = (lcStats?.totalSolved || 0) + (gfgData?.totalSolved || 0);

  useEffect(() => {
    async function load() {
      const promises = [];
      if (user.leetcode) promises.push(getLeetCodeStats(user.leetcode).then(d => { if (d) setLcStats(d) }));
      if (user.gfg)      promises.push(getGFGStats(user.gfg).then(d => { if (d) setGfgData(d) }));
      if (user.github)   promises.push(getGitHubData(user.github).then(d => { if (d) setGhData(d) }));
      await Promise.allSettled(promises);
      setLoading(false);
    }
    load();
  }, [user.leetcode, user.gfg, user.github]);

  const statsCards = [
    {
      label:    "Total Problems Solved",
      value:    String(totalSolved),
      change:   [lcStats && `LC: ${lcStats.totalSolved}`, gfgData && `GFG: ${gfgData.totalSolved}`].filter(Boolean).join("  ·  "),
      icon:     Code,
      color:    "#10b981",
      platform: null as null,
      onClick:  null as null,
    },
    {
      label:    "LeetCode",
      value:    lcStats ? String(lcStats.totalSolved) : "0",
      change:   lcStats ? `${lcStats.easySolved}E · ${lcStats.mediumSolved}M · ${lcStats.hardSolved}H` : "",
      icon:     TrendingUp,
      color:    "#3b82f6",
      platform: "leetcode" as const,
      onClick:  () => setModal("leetcode"),
    },
    {
      label:    "GeeksForGeeks",
      value:    gfgData ? String(gfgData.totalSolved) : "0",
      change:   gfgData ? `Score: ${gfgData.totalScore}` : "",
      icon:     Award,
      color:    "#2f8d46",
      platform: "gfg" as const,
      onClick:  () => setModal("gfg"),
    },
    {
      label:    "GitHub Repositories",
      value:    ghData ? String(ghData.public_repos) : "0",
      change:   ghData ? `${ghData.followers} followers` : "",
      icon:     FolderGit2,
      color:    "#8b5cf6",
      platform: "github" as const,
      onClick:  () => setModal("github"),
    },
  ];

  const platformIcons: Record<string, React.ReactNode> = {
    leetcode: <span className="text-2xl">🧩</span>,
    gfg:      <span className="text-2xl">🌿</span>,
    github:   <Github className="w-6 h-6 text-muted-foreground" />,
  };

  const platformLabels: Record<string, string> = {
    leetcode: "LeetCode",
    gfg:      "GeeksForGeeks",
    github:   "GitHub",
  };

  return (
    <div className="space-y-6">
      {modal && (
        <PlatformModal
          platform={modal}
          lcStats={lcStats}
          gfgData={gfgData}
          ghData={ghData}
          onClose={() => setModal(null)}
        />
      )}

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
                  onClick={card.onClick || undefined}
                  className={`bg-card border border-border rounded-2xl p-5 transition-all ${card.onClick ? "cursor-pointer hover:border-primary/40 hover:scale-[1.02]" : ""}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${card.color}15` }}
                    >
                      <card.icon className="w-5 h-5" style={{ color: card.color }} />
                    </div>
                    {card.onClick && (
                      <span className="text-xs text-muted-foreground">tap for details →</span>
                    )}
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

      {/* Charts */}
      <div className="grid lg:grid-cols-3 gap-6">
        {loading ? (
          <>
            <ChartSkeletonStyled height={200} />
            <div className="lg:col-span-2"><ChartSkeletonStyled height={230} /></div>
          </>
        ) : (
          <>
            <div className="bg-card border border-border rounded-2xl p-5">
              <h3 className="text-foreground mb-4" style={{ fontWeight: 600 }}>
                Difficulty Distribution
              </h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={difficultyData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value" strokeWidth={0}>
                    {difficultyData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid rgba(148,163,184,0.15)", borderRadius: "12px", color: "#e5e7eb" }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-4 mt-2">
                {difficultyData.map((d) => (
                  <div key={d.name} className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                    <span className="text-xs text-muted-foreground">{d.name} ({d.value})</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-5">
              <h3 className="text-foreground mb-4" style={{ fontWeight: 600 }}>Platform Comparison</h3>
              <ResponsiveContainer width="100%" height={230}>
                <BarChart data={platformData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} />
                  <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid rgba(148,163,184,0.15)", borderRadius: "12px", color: "#e5e7eb" }} />
                  <Bar dataKey="LeetCode" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="GFG"      fill="#2f8d46" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="GitHub"   fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </div>

      {/* Heatmap */}
      {loading ? <HeatmapSkeleton /> : (
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-foreground" style={{ fontWeight: 600 }}>Coding Activity</h3>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <span>Less</span>
              {heatmapColors.map((c, i) => (
                <div key={i} className="w-3 h-3 rounded-sm" style={{ backgroundColor: c }} />
              ))}
              <span>More</span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <div className="flex gap-[3px] min-w-[700px]">
              {Array.from({ length: 52 }, (_, weekIdx) => (
                <div key={weekIdx} className="flex flex-col gap-[3px]">
                  {Array.from({ length: 7 }, (_, dayIdx) => {
                    const item = activityData.find((a) => a.week === weekIdx && a.day === dayIdx);
                    return (
                      <div key={dayIdx} className="w-3 h-3 rounded-sm"
                        style={{ backgroundColor: heatmapColors[item?.count || 0] }} />
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