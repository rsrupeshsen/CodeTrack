import { getContestInfo } from "../../lib/leetcodeContest";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { getGitHubContributions } from "../../lib/githubHeatmap";
import Heatmap from "./Heatmap";
import BadgeCard from "./BadgeCard";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line,
} from "recharts";
import { Code, Award, FolderGit2, TrendingUp, Github, X } from "lucide-react";
import {
  StatsCardSkeleton,
  ChartSkeletonStyled,
  HeatmapSkeleton,
} from "./Skeleton";
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

// ── Platform Detail Modal ─────────────────────────────────────────────────────
function PlatformModal({
  platform, lcStats, gfgData, ghData, onClose,
}: {
  platform: "leetcode" | "gfg" | "github";
  lcStats: any; gfgData: any; ghData: any;
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

        {/* LeetCode */}
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
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={[
                    { name: "Easy",   value: lcStats.easySolved   },
                    { name: "Medium", value: lcStats.mediumSolved },
                    { name: "Hard",   value: lcStats.hardSolved   },
                  ]}
                  cx="50%" cy="50%" innerRadius={55} outerRadius={80}
                  dataKey="value" strokeWidth={0}
                >
                  <Cell fill="#10b981" />
                  <Cell fill="#f59e0b" />
                  <Cell fill="#ef4444" />
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid rgba(148,163,184,0.15)", borderRadius: "10px", color: "#e5e7eb" }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-2">
              {[
                { label: "Easy",   val: lcStats.easySolved,   cls: "bg-emerald-500" },
                { label: "Medium", val: lcStats.mediumSolved, cls: "bg-yellow-500"  },
                { label: "Hard",   val: lcStats.hardSolved,   cls: "bg-red-500"     },
              ].map((d) => (
                <div key={d.label} className="flex items-center gap-1 text-xs text-muted-foreground">
                  <div className={`w-3 h-3 rounded-full ${d.cls}`} />
                  {d.label} ({d.val})
                </div>
              ))}
            </div>
          </>
        )}

        {/* GFG */}
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
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={[
                    { name: "School", value: gfgData.school },
                    { name: "Easy",   value: gfgData.easy   },
                    { name: "Medium", value: gfgData.medium },
                    { name: "Hard",   value: gfgData.hard   },
                  ]}
                  cx="50%" cy="50%" innerRadius={55} outerRadius={80}
                  dataKey="value" strokeWidth={0}
                >
                  <Cell fill="#94a3b8" />
                  <Cell fill="#10b981" />
                  <Cell fill="#f59e0b" />
                  <Cell fill="#ef4444" />
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid rgba(148,163,184,0.15)", borderRadius: "10px", color: "#e5e7eb" }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-3 mt-2 flex-wrap">
              {[
                { label: "School", val: gfgData.school, cls: "bg-slate-400"   },
                { label: "Easy",   val: gfgData.easy,   cls: "bg-emerald-500" },
                { label: "Medium", val: gfgData.medium, cls: "bg-yellow-500"  },
                { label: "Hard",   val: gfgData.hard,   cls: "bg-red-500"     },
              ].map((d) => (
                <div key={d.label} className="flex items-center gap-1 text-xs text-muted-foreground">
                  <div className={`w-3 h-3 rounded-full ${d.cls}`} />
                  {d.label} ({d.val})
                </div>
              ))}
            </div>
            <div className="mt-3 bg-background rounded-xl p-3 flex items-center justify-between">
              <span className="text-muted-foreground text-sm">Current Streak</span>
              <span className="text-foreground text-sm" style={{ fontWeight: 600 }}>🔥 {gfgData.streak} days</span>
            </div>
          </>
        )}

        {/* GitHub */}
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
            <div className="space-y-2 max-h-52 overflow-y-auto">
              {(ghData.repos || []).map((repo: any) => (
                <a
                  key={repo.name}
                  href={repo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between bg-background rounded-xl px-3 py-2 hover:border-primary/30 border border-transparent transition-all"
                >
                  <div>
                    <p className="text-foreground text-sm" style={{ fontWeight: 500 }}>{repo.name}</p>
                    <p className="text-muted-foreground text-xs">{repo.language}</p>
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
  const currentYear = new Date().getFullYear();
  const availableYears = [currentYear - 2, currentYear - 1, currentYear];

  const [loading, setLoading]         = useState(true);
  const [lcStats, setLcStats]         = useState<any>(null);
  const [gfgData, setGfgData]         = useState<any>(null);
  const [ghData, setGhData]           = useState<any>(null);
  const [contestData, setContestData] = useState<any>(null);
  const [lcActivity, setLcActivity]   = useState<any[]>([]);
  const [ghActivity, setGhActivity]   = useState<any[]>([]);
  const [lcYear, setLcYear]           = useState(currentYear);
  const [ghYear, setGhYear]           = useState(currentYear);
  const [modal, setModal]             = useState<"leetcode" | "gfg" | "github" | null>(null);
  const { user } = useUser();

  const firstName = user.name.split(" ")[0];

  const difficultyData = [
    { name: "Easy",   value: (lcStats?.easySolved   || 0) + (gfgData?.easy   || 0), color: "#10b981" },
    { name: "Medium", value: (lcStats?.mediumSolved || 0) + (gfgData?.medium || 0), color: "#f59e0b" },
    { name: "Hard",   value: (lcStats?.hardSolved   || 0) + (gfgData?.hard   || 0), color: "#ef4444" },
  ];

  const totalSolved = (lcStats?.totalSolved || 0) + (gfgData?.totalSolved || 0);

  // ── Badges ────────────────────────────────────────────────────────────────
  const badges: { title: string; icon: string; color: string; description: string }[] = [];

  if (lcStats?.contestRating >= 2400)
    badges.push({ title: "LeetCode Guardian",   icon: "🏆", color: "#f59e0b", description: `Rating: ${lcStats.contestRating}` });
  else if (lcStats?.contestRating >= 2000)
    badges.push({ title: "LeetCode Knight",     icon: "🛡️", color: "#a855f7", description: `Rating: ${lcStats.contestRating}` });
  else if (lcStats?.contestRating >= 1600)
    badges.push({ title: "LC Competitor",       icon: "⚔️", color: "#3b82f6", description: `Rating: ${lcStats.contestRating}` });
  else if (lcStats?.contestRating > 0)
    badges.push({ title: "Contest Participant", icon: "🎯", color: "#6366f1", description: `Rating: ${lcStats.contestRating}` });

  if (lcStats?.totalSolved >= 500)
    badges.push({ title: "Problem Master",      icon: "🧠", color: "#10b981", description: `${lcStats.totalSolved} solved` });
  else if (lcStats?.totalSolved >= 100)
    badges.push({ title: "Century Solver",      icon: "💯", color: "#06b6d4", description: `${lcStats.totalSolved} solved` });
  else if (lcStats?.totalSolved >= 50)
    badges.push({ title: "Getting Started",     icon: "🌱", color: "#84cc16", description: `${lcStats.totalSolved} solved` });
  else if (lcStats?.totalSolved > 0)
    badges.push({ title: "First Steps",         icon: "👣", color: "#94a3b8", description: `${lcStats.totalSolved} solved` });

  if (lcStats?.hardSolved >= 50)
    badges.push({ title: "Hard Crusher",        icon: "🔥", color: "#ef4444", description: `${lcStats.hardSolved} hard solved` });

  if (gfgData?.totalScore >= 500)
    badges.push({ title: "GFG Expert",          icon: "🌿", color: "#2f8d46", description: `Score: ${gfgData.totalScore}` });
  else if (gfgData?.totalScore >= 100)
    badges.push({ title: "GFG Learner",         icon: "📚", color: "#2f8d46", description: `Score: ${gfgData.totalScore}` });
  else if (gfgData?.totalSolved > 0)
    badges.push({ title: "GFG Starter",         icon: "🌱", color: "#2f8d46", description: `${gfgData.totalSolved} solved` });

  if (ghData?.public_repos >= 20)
    badges.push({ title: "Open Source Dev",     icon: "🚀", color: "#8b5cf6", description: `${ghData.public_repos} repos` });
  else if (ghData?.public_repos >= 5)
    badges.push({ title: "GitHub Contributor",  icon: "🐙", color: "#6366f1", description: `${ghData.public_repos} repos` });

  if (ghData?.followers >= 50)
    badges.push({ title: "Community Builder",   icon: "👥", color: "#ec4899", description: `${ghData.followers} followers` });

  if (totalSolved >= 1000)
    badges.push({ title: "Coding Legend",       icon: "👑", color: "#f59e0b", description: `${totalSolved} total solved` });

  // ── fetchLCCalendar ───────────────────────────────────────────────────────
  async function fetchLCCalendar(username: string, year: number) {
    const BASE = import.meta.env.VITE_LEETCODE_API_URL;
    try {
      const res  = await fetch(`${BASE}/${username}/calendar?year=${year}`);
      const json = await res.json();
      if (json?.submissionCalendar) {
        const calendar =
          typeof json.submissionCalendar === "string"
            ? JSON.parse(json.submissionCalendar)
            : json.submissionCalendar;
        return Object.entries(calendar).map(([ts, count]: any) => ({
          date:  new Date(Number(ts) * 1000).toISOString().split("T")[0],
          count: Number(count),
        }));
      }
    } catch {}
    return [];
  }

  // ── MAIN load useEffect ───────────────────────────────────────────────────
  useEffect(() => {
    async function load() {
      const promises: Promise<any>[] = [];

      if (user.leetcode) {
        promises.push(getLeetCodeStats(user.leetcode).then((d) => { if (d) setLcStats(d); }));
        promises.push(getContestInfo(user.leetcode).then((d)  => { if (d) setContestData(d); }));
      }

      if (user.gfg)
        promises.push(getGFGStats(user.gfg).then((d) => { if (d) setGfgData(d); }));

      if (user.github)
        promises.push(getGitHubData(user.github).then((d) => { if (d) setGhData(d); }));

      await Promise.allSettled(promises);
      setLoading(false);
    }
    load();
  }, [user.leetcode, user.gfg, user.github]);

  // ── LeetCode calendar — re-fetches when year changes ─────────────────────
  useEffect(() => {
    if (!user.leetcode) return;
    fetchLCCalendar(user.leetcode, lcYear).then((data) => {
      if (data.length > 0) setLcActivity(data);
    });
  }, [lcYear, user.leetcode]);

  // ── GitHub contributions — re-fetches when year changes ──────────────────
  useEffect(() => {
    if (!user.github) return;
    getGitHubContributions(user.github, ghYear).then((data) => {
      if (data.length > 0) setGhActivity(data);
    });
  }, [ghYear, user.github]);

  // ── Stats Cards ───────────────────────────────────────────────────────────
  const statsCards = [
    {
      label: "Total Solved", value: String(totalSolved),
      change: [lcStats && `LC: ${lcStats.totalSolved}`, gfgData && `GFG: ${gfgData.totalSolved}`].filter(Boolean).join(" · "),
      icon: Code, color: "#10b981", platform: null as null, onClick: null as null,
    },
    {
      label: "LeetCode", value: lcStats ? String(lcStats.totalSolved) : "0",
      change: lcStats ? `${lcStats.easySolved}E · ${lcStats.mediumSolved}M · ${lcStats.hardSolved}H` : "",
      icon: TrendingUp, color: "#3b82f6", platform: "leetcode" as const, onClick: () => setModal("leetcode"),
    },
    {
      label: "GeeksForGeeks", value: gfgData ? String(gfgData.totalSolved) : "0",
      change: gfgData ? `Score: ${gfgData.totalScore}` : "",
      icon: Award, color: "#2f8d46", platform: "gfg" as const, onClick: () => setModal("gfg"),
    },
    {
      label: "Contest Rating", value: contestData ? String(contestData.rating) : "N/A",
      change: contestData ? `Top ${contestData.topPercent}%` : "",
      icon: Award, color: "#f59e0b", platform: null as null, onClick: null as null,
    },
    {
      label: "GitHub Repos", value: ghData ? String(ghData.public_repos) : "0",
      change: ghData ? `${ghData.followers} followers` : "",
      icon: FolderGit2, color: "#8b5cf6", platform: "github" as const, onClick: () => setModal("github"),
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {loading
          ? Array.from({ length: 5 }, (_, i) => <StatsCardSkeleton key={i} />)
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
                      <span className="text-xs text-muted-foreground">details →</span>
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

      {/* Achievements */}
      <div className="bg-card border border-border rounded-2xl p-5">
        <h3 className="text-foreground mb-4" style={{ fontWeight: 600 }}>Achievements</h3>
        {badges.length === 0 ? (
          <p className="text-muted-foreground text-sm">Solve more problems to unlock badges</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {badges.map((badge, i) => (
              <BadgeCard
                key={i}
                title={badge.title}
                icon={badge.icon}
                color={badge.color}
                description={badge.description}
              />
            ))}
          </div>
        )}
      </div>

      {/* Charts */}
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
            <div className="bg-card border border-border rounded-2xl p-5">
              <h3 className="text-foreground mb-4" style={{ fontWeight: 600 }}>
                Difficulty Distribution
              </h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={difficultyData}
                    cx="50%" cy="50%"
                    innerRadius={55} outerRadius={80}
                    dataKey="value" strokeWidth={0}
                  >
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

      {/* Contest Rating History */}
      {contestData?.history?.length > 0 && (
        <div className="bg-card border border-border rounded-2xl p-5">
          <h3 className="text-foreground mb-4" style={{ fontWeight: 600 }}>
            Contest Rating History
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={contestData.history}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
              <XAxis dataKey="name" hide />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid rgba(148,163,184,0.15)", borderRadius: "12px", color: "#e5e7eb" }} />
              <Line type="monotone" dataKey="rating" stroke="#f59e0b" strokeWidth={3} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Heatmaps side by side */}
      {loading ? (
        <HeatmapSkeleton />
      ) : (
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-card border border-border rounded-2xl p-5">
            <h3 className="text-foreground mb-4" style={{ fontWeight: 600 }}>
              🧩 LeetCode Activity
            </h3>
            <Heatmap
              data={lcActivity}
              title=""
              color="green"
              year={lcYear}
              onYearChange={setLcYear}
              availableYears={availableYears}
            />
          </div>
          <div className="bg-card border border-border rounded-2xl p-5">
            <h3 className="text-foreground mb-4" style={{ fontWeight: 600 }}>
              🐙 GitHub Activity
            </h3>
            <Heatmap
              data={ghActivity}
              title=""
              color="blue"
              year={ghYear}
              onYearChange={setGhYear}
              availableYears={availableYears}
            />
          </div>
        </div>
      )}
    </div>
  );
}