import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import {
  Github, Linkedin, Twitter, Globe, Star, GitFork,
  Code2, ArrowRight, Copy, Check, ExternalLink,
  Trophy, Flame, Target, Zap,
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
import { getProfileByUsername } from "../../lib/database";

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

// ── Skeleton ──────────────────────────────────────────────────────────────────

function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`bg-muted animate-pulse rounded-lg ${className}`} />;
}

// ── Main Component ─────────────────────────────────────────────────────────────

export function PublicProfilePage() {
  const { username } = useParams(); // Username from URL: /user/:username
  const navigate = useNavigate();
  const { user: ctxUser, userId: currentUserId } = useUser();

  // State for profile data
  const [profileUser, setProfileUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for stats
  const [lcStats,      setLcStats]      = useState<any>(null);
  const [gfgData,      setGfgData]      = useState<any>(null);
  const [ghData,       setGhData]       = useState<any>(null);
  const [contestData,  setContestData]  = useState<any>(null);
  const [heatmap,      setHeatmap]      = useState<{date:string;count:number}[]>([]);
  const [copied,       setCopied]       = useState(false);

  // Load profile data based on URL or logged-in user
  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      setError(null);
      
      if (username) {
        // Public profile view - fetch from database by username
        try {
          const dbProfile = await getProfileByUsername(username);
          
          if (!dbProfile) {
            setError("Profile not found");
            setLoading(false);
            return;
          }
          
          setProfileUser(dbProfile);
        } catch (err) {
          console.error("Failed to load profile:", err);
          setError("Failed to load profile");
          setLoading(false);
          return;
        }
      } else {
        // Own profile view - use context user
        if (!ctxUser.username) {
          setError("Please complete your profile first");
          setLoading(false);
          return;
        }
        setProfileUser(ctxUser);
      }
      
      setLoading(false);
    };

    loadProfile();
  }, [username, ctxUser]);

  // Get usernames from the loaded profile
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

  const initials = name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);

  // Public URL - use the loaded profile's username or current user's username
  const publicUrl = `${window.location.origin}/user/${profileUser?.username || ctxUser.username || "your-username"}`;

  // Fetch stats when usernames are available
  useEffect(() => {
    // Only fetch if we have a profile loaded
    if (!profileUser) return;

    // Reset stats when profile changes
    setLcStats(null);
    setGfgData(null);
    setGhData(null);
    setContestData(null);
    setHeatmap([]);

    // Fetch LeetCode stats
    if (lcUser) {
      getLeetCodeStats(lcUser).then(d => { if (d) setLcStats(d); }).catch(console.error);
      getContestInfo(lcUser).then(d => { if (d) setContestData(d); }).catch(console.error);
    }
    
    // Fetch GFG stats
    if (gfgUser) {
      getGFGStats(gfgUser).then(d => { if (d) setGfgData(d); }).catch(console.error);
    }
    
    // Fetch GitHub stats
    if (ghUser) {
      getGitHubData(ghUser).then(d => { if (d) setGhData(d); }).catch(console.error);
      getGitHubContributions(ghUser).then(d => { if (d?.length) setHeatmap(d); }).catch(console.error);
    }
  }, [profileUser, lcUser, gfgUser, ghUser]);

  const handleCopy = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Show error if there was a problem or no profile loaded
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
            {error || "The user you're looking for doesn't exist."}
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

  // ── Derived stats ────────────────────────────────────────────────────────────

  const totalSolved = (lcStats?.totalSolved || 0) + (gfgData?.totalSolved || 0);

  const diffPie = [
    { name: "Easy",   value: (lcStats?.easySolved||0)+(gfgData?.easy||0),   color: "#10b981" },
    { name: "Medium", value: (lcStats?.mediumSolved||0)+(gfgData?.medium||0),color: "#f59e0b" },
    { name: "Hard",   value: (lcStats?.hardSolved||0)+(gfgData?.hard||0),   color: "#ef4444" },
  ];

  const platformPie = [
    { name: "LeetCode", value: lcStats?.totalSolved || 0,  color: "#ffa116" },
    { name: "GFG",      value: gfgData?.totalSolved || 0,  color: "#2f8d46" },
  ];

  const contributions = heatmap.reduce((sum, d) => sum + d.count, 0);
  const activeStreakData = heatmap.slice(-90);
  const contributionTrend = [
    { month: "M-3", count: heatmap.slice(-120, -90).reduce((s, d) => s + d.count, 0) },
    { month: "M-2", count: heatmap.slice(-90, -60).reduce((s, d) => s + d.count, 0) },
    { month: "M-1", count: heatmap.slice(-60, -30).reduce((s, d) => s + d.count, 0) },
    { month: "Now", count: heatmap.slice(-30).reduce((s, d) => s + d.count, 0) },
  ];

  const topLanguages = ghData?.languages?.slice(0, 5) || [];

  const stats = [
    { icon: Code2, label: "Problems Solved", value: totalSolved, color: "#10b981" },
    { icon: Trophy, label: "Contest Rating", value: lcStats?.contestRating || "N/A", color: "#f59e0b" },
    { icon: Flame, label: "Contributions", value: contributions, color: "#ef4444" },
    { icon: Target, label: "Repos", value: ghData?.repos || 0, color: "#3b82f6" },
  ];

  // ── Render ────────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="bg-gradient-to-br from-primary/5 via-background to-background border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground text-3xl font-bold shrink-0">
              {initials}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-foreground mb-2">{name}</h1>
              {bio && <p className="text-foreground/80 text-sm mb-3 max-w-xl mx-auto mb-4 leading-relaxed">{bio}</p>}
              {techTags.length > 0 && (
                <div className="flex flex-wrap justify-center gap-2 mb-5">
                  {techTags.map((t: string) => (
                    <span key={t} className="bg-primary/10 border border-primary/20 text-primary px-2.5 py-0.5 rounded-full text-sm">
                      {t}
                    </span>
                  ))}
                </div>
              )}
              <div className="flex flex-wrap gap-3">
                {website && (
                  <a href={website} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors">
                    <Globe className="w-4 h-4" /> Website
                  </a>
                )}
                {ghUser && (
                  <a href={`https://github.com/${ghUser}`} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors">
                    <Github className="w-4 h-4" /> GitHub
                  </a>
                )}
                {linkedin && (
                  <a href={linkedin} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors">
                    <Linkedin className="w-4 h-4" /> LinkedIn
                  </a>
                )}
                {twitter && (
                  <a href={twitter} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors">
                    <Twitter className="w-4 h-4" /> Twitter
                  </a>
                )}
              </div>
            </div>
            <button
              onClick={handleCopy}
              className="px-4 py-2 bg-card border border-border rounded-lg hover:bg-accent transition-colors flex items-center gap-2"
            >
              {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              <span className="text-sm">{copied ? "Copied!" : "Share"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((s, i) => (
            <div key={i} className="bg-card border border-border rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${s.color}20` }}>
                  <s.icon className="w-5 h-5" style={{ color: s.color }} />
                </div>
              </div>
              <p className="text-2xl font-bold text-foreground mb-1">
                {typeof s.value === 'number' ? s.value.toLocaleString() : s.value}
              </p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Difficulty Breakdown */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <h3 className="text-foreground font-semibold mb-5">Difficulty Breakdown</h3>
            {totalSolved > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={diffPie} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value" strokeWidth={0}>
                    {diffPie.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid rgba(148,163,184,0.15)", borderRadius: "10px", color: "#e5e7eb" }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <Skeleton className="h-48" />
            )}
            <div className="flex justify-center gap-4 mt-4">
              {diffPie.map((d) => (
                <div key={d.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
                  <span>{d.name}: {d.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Platform Distribution */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <h3 className="text-foreground font-semibold mb-5">Platform Distribution</h3>
            {totalSolved > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={platformPie} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value" strokeWidth={0}>
                    {platformPie.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid rgba(148,163,184,0.15)", borderRadius: "10px", color: "#e5e7eb" }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <Skeleton className="h-48" />
            )}
            <div className="flex justify-center gap-4 mt-4">
              {platformPie.map((p) => (
                <div key={p.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: p.color }} />
                  <span>{p.name}: {p.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* GitHub Heatmap */}
        {ghUser && (
          <div className="bg-card border border-border rounded-2xl p-6 mb-8">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-foreground font-semibold">GitHub Activity</h3>
              <a href={`https://github.com/${ghUser}`} target="_blank" rel="noopener noreferrer"
                className="text-primary text-sm hover:underline flex items-center gap-1">
                View on GitHub <ArrowRight className="w-3 h-3" />
              </a>
            </div>
            {heatmap.length > 0 ? (
              <div className="overflow-x-auto">
                <div className="inline-grid grid-flow-col auto-cols-max gap-1">
                  {heatmap.slice(-365).map((d, i) => (
                    <HeatmapCell key={i} count={d.count} />
                  ))}
                </div>
              </div>
            ) : (
              <Skeleton className="h-24" />
            )}
          </div>
        )}

        {/* Languages */}
        {topLanguages.length > 0 && (
          <div className="bg-card border border-border rounded-2xl p-6">
            <h3 className="text-foreground font-semibold mb-5">Top Languages</h3>
            <div className="space-y-3">
              {topLanguages.map((lang: any) => (
                <div key={lang.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-foreground flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: langColors[lang.name] || "#94a3b8" }} />
                      {lang.name}
                    </span>
                    <span className="text-muted-foreground">{lang.percent}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="h-2 rounded-full transition-all duration-500"
                      style={{ width: `${lang.percent}%`, backgroundColor: langColors[lang.name] || "#94a3b8" }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}