import React from "react";
import {
  Github,
  Linkedin,
  Twitter,
  Globe,
  MapPin,
  Calendar,
  Star,
  GitFork,
  ExternalLink,
  Award,
  Code2,
} from "lucide-react";
import { useUser } from "./UserContext";

const projects = [
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

const achievements = [
  { icon: "🏆", title: "Knight", desc: "LeetCode Top 5%" },
  { icon: "⭐", title: "5-Star", desc: "CodeChef Rating" },
  { icon: "🔥", title: "92-Day Streak", desc: "Longest Coding Streak" },
  { icon: "💎", title: "1000+ Problems", desc: "Total Solved" },
  { icon: "🥇", title: "Top 100", desc: "Weekly Contest" },
  { icon: "🚀", title: "Open Source", desc: "500+ Stars on GitHub" },
];

const heatmapColors = ["#1e293b", "#064e3b", "#059669", "#10b981", "#34d399"];

const activityData = Array.from({ length: 52 }, () =>
  Array.from({ length: 7 }, () => Math.floor(Math.random() * 5))
);

export function PortfolioPage() {
  const { user } = useUser();
  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl text-foreground mb-1" style={{ fontWeight: 700 }}>
            Public Portfolio
          </h1>
          <p className="text-muted-foreground">Preview of your shareable developer portfolio</p>
        </div>
        <button className="bg-primary text-primary-foreground px-4 py-2 rounded-xl hover:bg-primary/90 transition-all flex items-center gap-2 cursor-pointer text-sm" style={{ fontWeight: 600 }}>
          <ExternalLink className="w-4 h-4" /> Share
        </button>
      </div>

      {/* Profile Card */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-primary/30 to-teal-500/20" />
        <div className="px-6 pb-6 -mt-12">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4">
            <div className="w-24 h-24 bg-primary/20 rounded-2xl border-4 border-card flex items-center justify-center">
              <span className="text-primary text-2xl" style={{ fontWeight: 700 }}>{initials}</span>
            </div>
            <div className="flex-1">
              <h2 className="text-xl text-foreground" style={{ fontWeight: 700 }}>
                {user.name}
              </h2>
              <p className="text-muted-foreground text-sm">
                {user.bio}
              </p>
              <div className="flex flex-wrap items-center gap-3 mt-2 text-muted-foreground text-sm">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" /> San Francisco, CA
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> Joined Jan 2024
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <a className="w-9 h-9 bg-muted rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                <Github className="w-4 h-4" />
              </a>
              <a className="w-9 h-9 bg-muted rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                <Linkedin className="w-4 h-4" />
              </a>
              <a className="w-9 h-9 bg-muted rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                <Twitter className="w-4 h-4" />
              </a>
              <a className="w-9 h-9 bg-muted rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                <Globe className="w-4 h-4" />
              </a>
            </div>
          </div>

          <p className="text-foreground text-sm mt-4">
            Passionate developer with 3+ years of competitive programming experience. I love building
            tools for developers and contributing to open source. Knight on LeetCode, 5-star on CodeChef.
          </p>

          <div className="flex flex-wrap gap-2 mt-4">
            {user.techStack.split(",").map((tech) => tech.trim()).filter(Boolean).map(
              (tech) => (
                <span
                  key={tech}
                  className="bg-primary/10 border border-primary/20 text-primary px-2.5 py-0.5 rounded-full text-xs"
                  style={{ fontWeight: 500 }}
                >
                  {tech}
                </span>
              )
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Problems Solved", value: "1,247", color: "#10b981" },
          { label: "LeetCode Rating", value: "1,856", color: "#3b82f6" },
          { label: "CodeChef Stars", value: "5★", color: "#f59e0b" },
          { label: "GitHub Stars", value: "891", color: "#8b5cf6" },
        ].map((s) => (
          <div key={s.label} className="bg-card border border-border rounded-2xl p-4 text-center">
            <p className="text-2xl" style={{ color: s.color, fontWeight: 700 }}>
              {s.value}
            </p>
            <p className="text-muted-foreground text-xs mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Activity Heatmap */}
      <div className="bg-card border border-border rounded-2xl p-5">
        <h3 className="text-foreground mb-4" style={{ fontWeight: 600 }}>
          Coding Activity
        </h3>
        <div className="overflow-x-auto">
          <div className="flex gap-[3px] min-w-[700px]">
            {activityData.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-[3px]">
                {week.map((count, di) => (
                  <div
                    key={di}
                    className="w-3 h-3 rounded-sm"
                    style={{ backgroundColor: heatmapColors[count] }}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Projects */}
      <div>
        <h3 className="text-foreground mb-4" style={{ fontWeight: 600 }}>
          GitHub Projects
        </h3>
        <div className="grid sm:grid-cols-2 gap-4">
          {projects.map((p) => (
            <div
              key={p.name}
              className="bg-card border border-border rounded-2xl p-5 hover:border-primary/20 transition-all cursor-pointer"
            >
              <h4 className="text-primary text-sm mb-1" style={{ fontWeight: 600 }}>
                {p.name}
              </h4>
              <p className="text-muted-foreground text-sm mb-3">{p.desc}</p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: p.color }} />
                  {p.language}
                </span>
                <span className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5" /> {p.stars}
                </span>
                <span className="flex items-center gap-1">
                  <GitFork className="w-3.5 h-3.5" /> {p.forks}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Achievements */}
      <div>
        <h3 className="text-foreground mb-4" style={{ fontWeight: 600 }}>
          Achievements
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {achievements.map((a) => (
            <div
              key={a.title}
              className="bg-card border border-border rounded-2xl p-4 text-center hover:border-primary/20 transition-all"
            >
              <span className="text-2xl">{a.icon}</span>
              <p className="text-foreground text-sm mt-2" style={{ fontWeight: 600 }}>
                {a.title}
              </p>
              <p className="text-muted-foreground text-xs">{a.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}