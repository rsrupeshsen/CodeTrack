import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { getProfileByUsername } from "../../lib/database";
import {
  Github, Linkedin, Twitter, Globe, Star,
  Code2, ArrowRight, Copy, Check, ExternalLink,
  Trophy, Target,
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import { useUser } from "./UserContext";
import { getLeetCodeStats } from "../../lib/leetcode";
import { getGFGStats } from "../../lib/gfg";
import { getGitHubData } from "../../lib/github";
import { getContestInfo } from "../../lib/leetcodeContest";
import { getGitHubContributions } from "../../lib/githubHeatmap";

// ── Helpers ────────────────────────────────────────────────────────────────────

const langColors: Record<string, string> = {
  TypeScript: "#3178c6", JavaScript: "#f1e05a", Python: "#3572A5",
  "C++": "#f34b7d", Java: "#b07219", Go: "#00ADD8", Rust: "#dea584",
  C: "#555555", HTML: "#e34c26", CSS: "#563d7c", Shell: "#89e051",
  Code: "#94a3b8",
};

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

function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`bg-muted animate-pulse rounded-lg ${className}`} />;
}

// ── Main Component ─────────────────────────────────────────────────────────────

export function PublicProfilePage() {
  const { username } = useParams();
  const navigate = useNavigate();
  const { user: ctxUser } = useUser();

  // ✅ FIX: Always fetch from DB when :username param is present.
  // Old code set profileUser = null for the username case and never fetched,
  // so public URLs always showed an error or the wrong user's data.
  const [profileUser, setProfileUser] = useState<any>(null);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState<string | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      setError(null);

      if (username) {
        // Public URL: /user/:username — fetch from Appwrite by username
        try {
          const dbProfile = await getProfileByUsername(username);
          if (!dbProfile) {
            setError("Profile not found");
          } else {
            setProfileUser(dbProfile);
          }
        } catch (err) {
          console.error("Failed to load public profile:", err);
          setError("Failed to load profile");
        }
      } else {
        // Dashboard route: /dashboard/profile — use logged-in user's context
        if (!ctxUser.username) {
          setError("Please complete your profile first");
        } else {
          setProfileUser(ctxUser);
        }
      }

      setLoading(false);
    };

    loadProfile();
  // ✅ FIX: Re-run when username param changes OR when context user updates
  }, [username, ctxUser.username]);

  // ── Stats state ──────────────────────────────────────────────────────────────
  const [lcStats,     setLcStats]     = useState<any>(null);
  const [gfgData,     setGfgData]     = useState<any>(null);
  const [ghData,      setGhData]      = useState<any>(null);
  const [contestData, setContestData] = useState<any>(null);
  const [heatmap,     setHeatmap]     = useState<{ date: string; count: number }[]>([]);
  const [copied,      setCopied]      = useState(false);

  // ✅ FIX: Only derive values from the resolved profileUser — never fall back
  // to ctxUser for a public page (that was leaking logged-in user's data into
  // other people's public profiles).
  const lcUser    = profileUser?.leetcode  || "";
  const gfgUser   = profileUser?.gfg       || "";
  const ghUser    = profileUser?.github    || "";
  const name      = profileUser?.name      || "Developer";
  const bio       = profileUser?.bio       || "";
  const website   = profileUser?.website   || "";
  const linkedin  = profileUser?.linkedin  || "";
  const twitter   = profileUser?.twitter   || "";
  const techStack = profileUser?.techStack || "";
  const techTags  = techStack ? techStack.split(",").map((t: string) => t.trim()).filter(Boolean) : [];
  const displayUsername = profileUser?.username || "";

  const initials = name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);

  // Public URL always uses the loaded profile's username
  const publicUrl = `${window.location.origin}/user/${displayUsername || "your-username"}`;

  // ── Fetch stats once profile is resolved ─────────────────────────────────────
  useEffect(() => {
    if (!profileUser) return;

    // Reset stats when profile changes
    setLcStats(null);
    setGfgData(null);
    setGhData(null);
    setContestData(null);
    setHeatmap([]);

    if (lcUser) {
      getLeetCodeStats(lcUser).then(d => { if (d) setLcStats(d); }).catch(console.error);
      getContestInfo(lcUser).then(d => { if (d) setContestData(d); }).catch(console.error);
    }
    if (gfgUser) {
      getGFGStats(gfgUser).then(d => { if (d) setGfgData(d); }).catch(console.error);
    }
    if (ghUser) {
      getGitHubData(ghUser).then(d => { if (d) setGhData(d); }).catch(console.error);
      getGitHubContributions(ghUser).then(d => { if (d?.length) setHeatmap(d); }).catch(console.error);
    }
  }, [profileUser]);

  const handleCopy = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ── Loading state ─────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground text-sm">Loading profile...</p>
        </div>
      </div>
    );
  }

  // ── Error / not found state ───────────────────────────────────────────────────
  if (error || !profileUser) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="bg-destructive/10 text-destructive rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <ExternalLink className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            {error === "Profile not found" ? "Profile Not Found" : "Oops!"}
          </h1>
          <p className="text-muted-foreground mb-6">
            {error || "Something went wrong loading this profile."}
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => navigate("/")}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Go Home
            </button>
            {error === "Please complete your profile first" && (
              <button
                onClick={() => navigate("/dashboard/settings")}
                className="px-6 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors"
              >
                Complete Profile
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── Derived stats ─────────────────────────────────────────────────────────────
  const totalSolved = (lcStats?.totalSolved || 0) + (gfgData?.totalSolved || 0);

  const diffPie = [
    { name: "Easy",   value: (lcStats?.easySolved || 0) + (gfgData?.easy || 0),    color: "#10b981" },
    { name: "Medium", value: (lcStats?.mediumSolved || 0) + (gfgData?.medium || 0), color: "#f59e0b" },
    { name: "Hard",   value: (lcStats?.hardSolved || 0) + (gfgData?.hard || 0),    color: "#ef4444" },
  ].filter(d => d.value > 0);

  // Build 53-week heatmap grid
  const heatmapMap: Record<string, number> = {};
  heatmap.forEach(d => { heatmapMap[d.date] = d.count; });
  const today = new Date();
  const weeks: { date: string; count: number }[][] = [];
  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - 364);
  startDate.setDate(startDate.getDate() - startDate.getDay()); // align to Sunday
  for (let w = 0; w < 53; w++) {
    const week: { date: string; count: number }[] = [];
    for (let d = 0; d < 7; d++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + w * 7 + d);
      const key = date.toISOString().split("T")[0];
      week.push({ date: key, count: heatmapMap[key] || 0 });
    }
    weeks.push(week);
  }

  const tooltipStyle = {
    backgroundColor: "#1e293b",
    border: "1px solid rgba(148,163,184,0.15)",
    borderRadius: "12px",
    color: "#e5e7eb",
  };

  const achievements = [
    lcStats?.totalSolved >= 500    && { icon: "🏆", label: "Problem Master",  desc: `${lcStats.totalSolved} solved` },
    lcStats?.contestRating >= 1600 && { icon: "⚔️", label: "LC Knight",       desc: `Rating ${lcStats.contestRating}` },
    lcStats?.contestRating >= 1800 && { icon: "👑", label: "LC Guardian",     desc: `Rating ${lcStats.contestRating}` },
    lcStats?.hardSolved >= 50      && { icon: "🔥", label: "Hard Crusher",    desc: `${lcStats.hardSolved} hard solved` },
    ghData?.public_repos >= 10     && { icon: "💻", label: "GitHub Dev",      desc: `${ghData.public_repos} repos` },
    gfgData?.totalSolved >= 100    && { icon: "📚", label: "GFG Scholar",     desc: `${gfgData.totalSolved} on GFG` },
    contestData?.attended >= 10    && { icon: "🥊", label: "Contest Fighter", desc: `${contestData.attended} contests` },
  ].filter(Boolean) as { icon: string; label: string; desc: string }[];

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">

        {/* ── Hero ── */}
        <section className="bg-card border border-border rounded-3xl p-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />

          <div className="w-20 h-20 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-primary/30">
            <span className="text-primary text-2xl" style={{ fontWeight: 700 }}>{initials}</span>
          </div>

          <h1 className="text-2xl text-foreground mb-1" style={{ fontWeight: 700 }}>{name}</h1>
          {displayUsername && (
            <p className="text-muted-foreground text-sm mb-3">@{displayUsername}</p>
          )}
          {bio && <p className="text-foreground/80 text-sm max-w-xl mx-auto mb-4 leading-relaxed">{bio}</p>}

          {techTags.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 mb-5">
              {techTags.map((t: string) => (
                <span key={t} className="bg-primary/10 border border-primary/20 text-primary px-2.5 py-0.5 rounded-full text-xs" style={{ fontWeight: 500 }}>
                  {t}
                </span>
              ))}
            </div>
          )}

          <div className="flex justify-center gap-3 mb-5">
            {ghUser   && <a href={`https://github.com/${ghUser}`} target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-muted rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"><Github className="w-4 h-4" /></a>}
            {linkedin && <a href={linkedin} target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-muted rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"><Linkedin className="w-4 h-4" /></a>}
            {twitter  && <a href={twitter}  target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-muted rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"><Twitter className="w-4 h-4" /></a>}
            {website  && <a href={website}  target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-muted rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"><Globe className="w-4 h-4" /></a>}
          </div>

          <div className="flex items-center gap-2 max-w-sm mx-auto">
            <div className="flex-1 bg-background border border-border rounded-xl px-3 py-2 text-xs text-muted-foreground truncate text-left">
              {publicUrl}
            </div>
            <button onClick={handleCopy} className="bg-primary/10 hover:bg-primary/20 border border-primary/20 rounded-xl p-2 text-primary transition-all cursor-pointer" title="Copy link">
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
            <a href={publicUrl} target="_blank" rel="noopener noreferrer" className="bg-muted hover:bg-muted/80 border border-border rounded-xl p-2 text-muted-foreground transition-all">
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
          {copied && <p className="text-primary text-xs mt-1" style={{ fontWeight: 500 }}>Copied!</p>}
        </section>

        {/* ── Summary Stats ── */}
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Total Solved", value: totalSolved || "—",           color: "#10b981", icon: Code2 },
            { label: "LC Rating",    value: lcStats?.contestRating || "—", color: "#3b82f6", icon: Trophy },
            { label: "GitHub Repos", value: ghData?.public_repos ?? "—",  color: "#8b5cf6", icon: Github },
            { label: "Contests",     value: contestData?.attended ?? "—", color: "#f59e0b", icon: Target },
          ].map(s => (
            <div key={s.label} className="bg-card border border-border rounded-2xl p-4 text-center">
              <p className="text-2xl" style={{ color: s.color, fontWeight: 700 }}>{s.value}</p>
              <p className="text-muted-foreground text-xs mt-1">{s.label}</p>
            </div>
          ))}
        </section>

        {/* ── Platform Cards ── */}
        <section className="grid sm:grid-cols-3 gap-4">
          {/* LeetCode */}
          <div className="bg-card border border-border rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">🧩</span>
              <span className="text-foreground" style={{ fontWeight: 600 }}>LeetCode</span>
              {lcUser && <a href={`https://leetcode.com/${lcUser}`} target="_blank" rel="noopener noreferrer" className="ml-auto text-muted-foreground hover:text-primary"><ExternalLink className="w-3.5 h-3.5" /></a>}
            </div>
            {lcStats ? (
              <div className="space-y-2">
                {[
                  { label: "Total Solved",    value: lcStats.totalSolved },
                  { label: "Easy",            value: lcStats.easySolved,    color: "#10b981" },
                  { label: "Medium",          value: lcStats.mediumSolved,  color: "#f59e0b" },
                  { label: "Hard",            value: lcStats.hardSolved,    color: "#ef4444" },
                  { label: "Contest Rating",  value: lcStats.contestRating },
                ].map(r => (
                  <div key={r.label} className="flex items-center justify-between">
                    <span className="text-muted-foreground text-sm">{r.label}</span>
                    <span className="text-sm" style={{ fontWeight: 600, color: (r as any).color || "inherit" }}>{r.value}</span>
                  </div>
                ))}
              </div>
            ) : lcUser ? (
              <div className="space-y-2">{[1,2,3,4,5].map(i => <Skeleton key={i} className="h-4 w-full" />)}</div>
            ) : (
              <p className="text-muted-foreground text-sm">Not connected</p>
            )}
          </div>

          {/* GFG */}
          <div className="bg-card border border-border rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">📗</span>
              <span className="text-foreground" style={{ fontWeight: 600 }}>GeeksForGeeks</span>
              {gfgUser && <a href={`https://www.geeksforgeeks.org/user/${gfgUser}`} target="_blank" rel="noopener noreferrer" className="ml-auto text-muted-foreground hover:text-primary"><ExternalLink className="w-3.5 h-3.5" /></a>}
            </div>
            {gfgData ? (
              <div className="space-y-2">
                {[
                  { label: "Total Solved",  value: gfgData.totalSolved },
                  { label: "Coding Score",  value: gfgData.totalScore },
                  { label: "Streak",        value: `${gfgData.streak} days` },
                  { label: "Monthly Score", value: gfgData.monthlyScore },
                ].map(r => (
                  <div key={r.label} className="flex items-center justify-between">
                    <span className="text-muted-foreground text-sm">{r.label}</span>
                    <span className="text-sm" style={{ fontWeight: 600 }}>{r.value}</span>
                  </div>
                ))}
              </div>
            ) : gfgUser ? (
              <div className="space-y-2">{[1,2,3,4].map(i => <Skeleton key={i} className="h-4 w-full" />)}</div>
            ) : (
              <p className="text-muted-foreground text-sm">Not connected</p>
            )}
          </div>

          {/* GitHub */}
          <div className="bg-card border border-border rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Github className="w-5 h-5 text-foreground" />
              <span className="text-foreground" style={{ fontWeight: 600 }}>GitHub</span>
              {ghUser && <a href={`https://github.com/${ghUser}`} target="_blank" rel="noopener noreferrer" className="ml-auto text-muted-foreground hover:text-primary"><ExternalLink className="w-3.5 h-3.5" /></a>}
            </div>
            {ghData ? (
              <div className="space-y-2">
                {[
                  { label: "Public Repos", value: ghData.public_repos },
                  { label: "Followers",    value: ghData.followers },
                  { label: "Total Stars",  value: ghData.repos?.reduce((s: number, r: any) => s + (r.stars || 0), 0) ?? 0 },
                ].map(r => (
                  <div key={r.label} className="flex items-center justify-between">
                    <span className="text-muted-foreground text-sm">{r.label}</span>
                    <span className="text-sm" style={{ fontWeight: 600 }}>{r.value}</span>
                  </div>
                ))}
              </div>
            ) : ghUser ? (
              <div className="space-y-2">{[1,2,3].map(i => <Skeleton key={i} className="h-4 w-full" />)}</div>
            ) : (
              <p className="text-muted-foreground text-sm">Not connected</p>
            )}
          </div>
        </section>

        {/* ── Difficulty Pie + Contest Chart ── */}
        {(lcStats || gfgData) && (
          <section className="grid sm:grid-cols-2 gap-4">
            <div className="bg-card border border-border rounded-2xl p-5">
              <h3 className="text-foreground mb-4" style={{ fontWeight: 600 }}>Difficulty Breakdown</h3>
              {diffPie.length > 0 ? (
                <>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie data={diffPie} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" strokeWidth={0}>
                        {diffPie.map(entry => <Cell key={entry.name} fill={entry.color} />)}
                      </Pie>
                      <Tooltip contentStyle={tooltipStyle} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex justify-center gap-4 mt-2">
                    {diffPie.map(d => (
                      <div key={d.name} className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                        <span className="text-xs text-muted-foreground">{d.name} ({d.value})</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : <Skeleton className="h-48" />}
            </div>

            <div className="bg-card border border-border rounded-2xl p-5">
              <h3 className="text-foreground mb-4" style={{ fontWeight: 600 }}>Contest Rating History</h3>
              {contestData?.history?.length > 0 ? (
                <>
                  <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={contestData.history}>
                      <defs>
                        <linearGradient id="cGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%"  stopColor="#f59e0b" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
                      <XAxis dataKey="name" hide />
                      <YAxis stroke="#94a3b8" fontSize={11} />
                      <Tooltip contentStyle={tooltipStyle} />
                      <Area type="monotone" dataKey="rating" stroke="#f59e0b" fill="url(#cGrad)" strokeWidth={2} dot={{ r: 2, fill: "#f59e0b" }} />
                    </AreaChart>
                  </ResponsiveContainer>
                  <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                    <span>Peak: <b className="text-foreground">{Math.max(...contestData.history.map((h: any) => h.rating))}</b></span>
                    <span>Current: <b className="text-foreground">{contestData.rating}</b></span>
                    <span>Top <b className="text-foreground">{contestData.topPercent}%</b></span>
                  </div>
                </>
              ) : lcUser ? <Skeleton className="h-48" /> : <p className="text-muted-foreground text-sm">No contest data</p>}
            </div>
          </section>
        )}

        {/* ── GitHub Heatmap ── */}
        {ghUser && (
          <section className="bg-card border border-border rounded-2xl p-5">
            <h3 className="text-foreground mb-4" style={{ fontWeight: 600 }}>GitHub Contributions</h3>
            {heatmap.length > 0 ? (
              <div className="overflow-x-auto">
                <div className="flex gap-0.5 min-w-max">
                  {weeks.map((week, wi) => (
                    <div key={wi} className="flex flex-col gap-0.5">
                      {week.map((day, di) => (
                        <HeatmapCell key={di} count={day.count} />
                      ))}
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-1 mt-3 text-xs text-muted-foreground">
                  <span>Less</span>
                  {[0,1,3,6,10].map(v => <HeatmapCell key={v} count={v} />)}
                  <span>More</span>
                  <span className="ml-auto">{heatmap.reduce((s, d) => s + d.count, 0).toLocaleString()} contributions in the last year</span>
                </div>
              </div>
            ) : (
              <Skeleton className="h-24 w-full" />
            )}
          </section>
        )}

        {/* ── Achievements ── */}
        {achievements.length > 0 && (
          <section>
            <h3 className="text-foreground mb-4" style={{ fontWeight: 600 }}>Achievements</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {achievements.map(a => (
                <div key={a.label} className="bg-card border border-border rounded-2xl p-4 flex flex-col items-center text-center gap-2">
                  <span className="text-2xl">{a.icon}</span>
                  <p className="text-foreground text-sm" style={{ fontWeight: 600 }}>{a.label}</p>
                  <p className="text-muted-foreground text-xs">{a.desc}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── GitHub Repos ── */}
        {ghData?.repos?.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-foreground" style={{ fontWeight: 600 }}>GitHub Repositories</h3>
              {ghUser && (
                <a href={`https://github.com/${ghUser}?tab=repositories`} target="_blank" rel="noopener noreferrer"
                  className="text-primary text-xs hover:underline flex items-center gap-1">
                  View all <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {ghData.repos.map((r: any) => (
                <a key={r.name} href={r.url} target="_blank" rel="noopener noreferrer"
                  className="bg-card border border-border rounded-2xl p-5 hover:border-primary/30 transition-all group block">
                  <h4 className="text-primary text-sm mb-1 group-hover:underline" style={{ fontWeight: 600 }}>{r.name}</h4>
                  {r.desc && <p className="text-muted-foreground text-xs mb-3 line-clamp-2">{r.desc}</p>}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: langColors[r.language] || "#94a3b8" }} />
                      {r.language}
                    </span>
                    <span className="flex items-center gap-1"><Star className="w-3 h-3" />{r.stars}</span>
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* ── Footer CTA ── */}
        <section className="text-center">
          <div className="bg-gradient-to-br from-primary/10 to-teal-500/5 border border-primary/20 rounded-3xl p-10">
            <Code2 className="w-10 h-10 text-primary mx-auto mb-4" />
            <h2 className="text-2xl text-foreground mb-2" style={{ fontWeight: 700 }}>Create your own CodeFolio</h2>
            <p className="text-muted-foreground mb-6">Free — track your coding journey and share your portfolio.</p>
            <button
              onClick={() => navigate("/signup")}
              className="bg-primary text-primary-foreground px-8 py-3 rounded-xl hover:bg-primary/90 transition-all inline-flex items-center gap-2 cursor-pointer"
              style={{ fontWeight: 600 }}>
              Sign Up <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>

      </div>
    </div>
  );
}