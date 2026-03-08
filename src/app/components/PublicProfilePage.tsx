import { useParams, useNavigate } from "react-router";
import {
  Github,
  Linkedin,
  Twitter,
  Globe,
  Star,
  GitFork,
  Code2,
  ArrowRight,
} from "lucide-react";

const mockProfile = {
  name: "Rupesh Kumar",
  username: "rupeshkumar",
  bio: "Full Stack Developer | Competitive Programmer. Passionate about building tools for developers and contributing to open source. Knight on LeetCode, 5-star on CodeChef.",
  techStack: ["React", "TypeScript", "Python", "C++", "Node.js", "PostgreSQL", "Docker", "AWS"],
  leetcode: "rupesh_lc",
  codechef: "rupesh_cc",
  github: "rupeshkumar",
  website: "https://rupeshkumar.dev",
  linkedin: "https://linkedin.com/in/rupeshkumar",
  twitter: "https://twitter.com/rupeshkumar",
};

const stats = [
  { label: "Total Solved", value: "1,247", color: "#10b981" },
  { label: "LeetCode Rating", value: "1,856", color: "#3b82f6" },
  { label: "CodeChef Stars", value: "5★", color: "#f59e0b" },
  { label: "GitHub Repos", value: "42", color: "#8b5cf6" },
];

const repos = [
  {
    name: "algo-visualizer",
    desc: "Interactive algorithm visualization tool built with React and D3.js",
    language: "TypeScript",
    stars: 234,
    forks: 45,
    color: "#3178c6",
  },
  {
    name: "competitive-solutions",
    desc: "Collection of competitive programming solutions in C++ and Python",
    language: "C++",
    stars: 189,
    forks: 67,
    color: "#f34b7d",
  },
  {
    name: "dev-portfolio-builder",
    desc: "Open-source portfolio generator for developers",
    language: "JavaScript",
    stars: 156,
    forks: 34,
    color: "#f1e05a",
  },
  {
    name: "leetcode-patterns",
    desc: "Curated list of LeetCode problems grouped by patterns",
    language: "Python",
    stars: 312,
    forks: 89,
    color: "#3572A5",
  },
];

const platformCards = [
  {
    platform: "LeetCode",
    icon: "🧩",
    stats: [
      { label: "Problems Solved", value: "847" },
      { label: "Rating", value: "1,856" },
      { label: "Contest Rank", value: "Top 5%" },
    ],
  },
  {
    platform: "CodeChef",
    icon: "👨‍🍳",
    stats: [
      { label: "Problems Solved", value: "312" },
      { label: "Rating", value: "2,145" },
      { label: "Stars", value: "5★" },
    ],
  },
  {
    platform: "GitHub",
    icon: null,
    stats: [
      { label: "Repositories", value: "42" },
      { label: "Total Stars", value: "891" },
      { label: "Contributions", value: "1,423" },
    ],
  },
];

export function PublicProfilePage() {
  const { username } = useParams();
  const navigate = useNavigate();
  const profile = mockProfile;
  const initials = profile.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Hero Header */}
        <section className="text-center mb-10">
          <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-primary text-2xl" style={{ fontWeight: 700 }}>
              {initials}
            </span>
          </div>
          <h1 className="text-2xl text-foreground mb-1" style={{ fontWeight: 700 }}>
            {profile.name}
          </h1>
          <p className="text-muted-foreground text-sm mb-3">@{username || profile.username}</p>
          <p className="text-foreground text-sm max-w-xl mx-auto mb-4">{profile.bio}</p>
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            {profile.techStack.map((tech) => (
              <span
                key={tech}
                className="bg-primary/10 border border-primary/20 text-primary px-2.5 py-0.5 rounded-full text-xs"
                style={{ fontWeight: 500 }}
              >
                {tech}
              </span>
            ))}
          </div>
          <div className="flex justify-center gap-3">
            {profile.github && (
              <a
                href={`https://github.com/${profile.github}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-muted rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              >
                <Github className="w-4 h-4" />
              </a>
            )}
            {profile.linkedin && (
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-muted rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            )}
            {profile.twitter && (
              <a
                href={profile.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-muted rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </a>
            )}
            {profile.website && (
              <a
                href={profile.website}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-muted rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              >
                <Globe className="w-4 h-4" />
              </a>
            )}
          </div>
        </section>

        {/* Stats Bar */}
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {stats.map((s) => (
            <div key={s.label} className="bg-card border border-border rounded-2xl p-4 text-center">
              <p className="text-2xl" style={{ color: s.color, fontWeight: 700 }}>
                {s.value}
              </p>
              <p className="text-muted-foreground text-xs mt-1">{s.label}</p>
            </div>
          ))}
        </section>

        {/* Platform Stat Cards */}
        <section className="grid sm:grid-cols-3 gap-4 mb-8">
          {platformCards.map((p) => (
            <div key={p.platform} className="bg-card border border-border rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                {p.icon ? (
                  <span className="text-xl">{p.icon}</span>
                ) : (
                  <Github className="w-5 h-5 text-foreground" />
                )}
                <span className="text-foreground" style={{ fontWeight: 600 }}>
                  {p.platform}
                </span>
              </div>
              <div className="space-y-2">
                {p.stats.map((s) => (
                  <div key={s.label} className="flex items-center justify-between">
                    <span className="text-muted-foreground text-sm">{s.label}</span>
                    <span className="text-foreground text-sm" style={{ fontWeight: 600 }}>
                      {s.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* GitHub Repos */}
        <section className="mb-8">
          <h2 className="text-foreground mb-4" style={{ fontWeight: 600 }}>
            GitHub Repositories
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {repos.map((r) => (
              <div
                key={r.name}
                className="bg-card border border-border rounded-2xl p-5 hover:border-primary/20 transition-all"
              >
                <h3 className="text-primary text-sm mb-1" style={{ fontWeight: 600 }}>
                  {r.name}
                </h3>
                <p className="text-muted-foreground text-sm mb-3">{r.desc}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: r.color }}
                    />
                    {r.language}
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5" /> {r.stars}
                  </span>
                  <span className="flex items-center gap-1">
                    <GitFork className="w-3.5 h-3.5" /> {r.forks}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Footer CTA */}
        <section className="text-center">
          <div className="bg-gradient-to-br from-primary/10 to-teal-500/5 border border-primary/20 rounded-3xl p-10">
            <Code2 className="w-10 h-10 text-primary mx-auto mb-4" />
            <h2 className="text-2xl text-foreground mb-2" style={{ fontWeight: 700 }}>
              Create your own CodeFolio
            </h2>
            <p className="text-muted-foreground mb-6">
              It's free — track your coding journey and build your portfolio.
            </p>
            <button
              onClick={() => navigate("/signup")}
              className="bg-primary text-primary-foreground px-8 py-3 rounded-xl hover:bg-primary/90 transition-all inline-flex items-center gap-2 cursor-pointer"
              style={{ fontWeight: 600 }}
            >
              Sign Up <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
