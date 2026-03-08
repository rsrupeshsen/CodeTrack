import React from "react";

import { useNavigate } from "react-router";
import {
  BarChart3,
  User,
  Trophy,
  Bot,
  Github,
  Twitter,
  Linkedin,
  ArrowRight,
  Code2,
  Star,
  Zap,
  Shield,
} from "lucide-react";

const features = [
  {
    icon: BarChart3,
    title: "Coding Analytics",
    desc: "Track your progress across LeetCode, CodeChef, and GitHub with unified analytics and insights.",
  },
  {
    icon: User,
    title: "Developer Portfolio",
    desc: "Generate a stunning portfolio page showcasing your coding journey and achievements.",
  },
  {
    icon: Trophy,
    title: "Contest Tracker",
    desc: "Never miss a coding contest. Get reminders and track upcoming competitions across platforms.",
  },
  {
    icon: Bot,
    title: "AI Coding Assistant",
    desc: "Get personalized problem recommendations and daily coding plans powered by AI.",
  },
];

const stats = [
  { value: "50K+", label: "Developers" },
  { value: "2M+", label: "Problems Tracked" },
  { value: "500+", label: "Contests Monitored" },
  { value: "99.9%", label: "Uptime" },
];

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-8">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-primary text-sm">Now with AI-powered coding plans</span>
          </div>
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl text-foreground mb-6 tracking-tight"
            style={{ fontWeight: 800, lineHeight: 1.1 }}
          >
            Track Your Coding Journey{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-teal-400">
              in One Place
            </span>
          </h1>
          <p className="text-muted-foreground text-lg sm:text-xl max-w-2xl mx-auto mb-10">
            Aggregate your coding profiles from LeetCode, CodeChef, and GitHub. Get analytics,
            build your portfolio, and level up with AI-powered recommendations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/signup")}
              className="bg-primary text-primary-foreground px-8 py-3 rounded-xl hover:bg-primary/90 transition-all inline-flex items-center justify-center gap-2 cursor-pointer"
              style={{ fontWeight: 600 }}
            >
              Get Started <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate("/dashboard")}
              className="border border-border text-foreground px-8 py-3 rounded-xl hover:bg-card transition-all inline-flex items-center justify-center gap-2 cursor-pointer"
              style={{ fontWeight: 600 }}
            >
              View Demo
            </button>
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="pb-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="rounded-2xl border border-border bg-card/50 p-2 backdrop-blur-sm shadow-2xl shadow-primary/5">
            <div className="rounded-xl bg-gradient-to-br from-card to-background p-6 sm:p-8">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                {[
                  { label: "Problems Solved", value: "1,247", color: "text-primary" },
                  { label: "LeetCode Rating", value: "1,856", color: "text-chart-2" },
                  { label: "CodeChef Stars", value: "5★", color: "text-chart-3" },
                  { label: "GitHub Repos", value: "42", color: "text-chart-4" },
                ].map((s) => (
                  <div key={s.label} className="bg-background/50 rounded-xl p-4 border border-border">
                    <p className="text-muted-foreground text-xs mb-1">{s.label}</p>
                    <p className={`text-2xl ${s.color}`} style={{ fontWeight: 700 }}>
                      {s.value}
                    </p>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-4">
                {["Easy", "Medium", "Hard"].map((d, i) => (
                  <div key={d} className="bg-background/50 rounded-xl p-4 border border-border">
                    <p className="text-muted-foreground text-xs mb-2">{d}</p>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="h-2 rounded-full"
                        style={{
                          width: `${[85, 62, 35][i]}%`,
                          backgroundColor: ["#10b981", "#f59e0b", "#ef4444"][i],
                        }}
                      />
                    </div>
                    <p className="text-foreground text-sm mt-1" style={{ fontWeight: 600 }}>
                      {[425, 520, 302][i]} solved
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl text-foreground mb-4" style={{ fontWeight: 700 }}>
              Everything you need to{" "}
              <span className="text-primary">level up</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Powerful tools designed for competitive programmers and developers.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-6 hover:border-primary/30 transition-all group"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <f.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-foreground mb-2" style={{ fontWeight: 600 }}>
                  {f.title}
                </h3>
                <p className="text-muted-foreground text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trusted By */}
      <section id="trusted" className="py-20 px-4 border-t border-border">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-muted-foreground text-sm mb-10 uppercase tracking-wider" style={{ fontWeight: 600 }}>
            Trusted by developers worldwide
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
            {stats.map((s) => (
              <div key={s.label}>
                <p className="text-3xl text-foreground mb-1" style={{ fontWeight: 700 }}>
                  {s.value}
                </p>
                <p className="text-muted-foreground text-sm">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="bg-gradient-to-br from-primary/10 to-teal-500/5 border border-primary/20 rounded-3xl p-10 sm:p-16">
            <Star className="w-10 h-10 text-primary mx-auto mb-6" />
            <h2 className="text-3xl sm:text-4xl text-foreground mb-4" style={{ fontWeight: 700 }}>
              Ready to build your coding portfolio?
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Join thousands of developers tracking their progress with CodeFolio.
            </p>
            <button
              onClick={() => navigate("/signup")}
              className="bg-primary text-primary-foreground px-8 py-3 rounded-xl hover:bg-primary/90 transition-all inline-flex items-center gap-2 cursor-pointer"
              style={{ fontWeight: 600 }}
            >
              Start for Free <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid sm:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Code2 className="w-6 h-6 text-primary" />
                <span className="text-foreground" style={{ fontWeight: 700 }}>
                  Code<span className="text-primary">Folio</span>
                </span>
              </div>
              <p className="text-muted-foreground text-sm">
                Your coding journey, beautifully tracked.
              </p>
            </div>
            <div>
              <h4 className="text-foreground mb-3" style={{ fontWeight: 600 }}>Product</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p className="hover:text-foreground cursor-pointer transition-colors">Features</p>
                <p className="hover:text-foreground cursor-pointer transition-colors">Pricing</p>
                <p className="hover:text-foreground cursor-pointer transition-colors">Changelog</p>
              </div>
            </div>
            <div>
              <h4 className="text-foreground mb-3" style={{ fontWeight: 600 }}>Resources</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p className="hover:text-foreground cursor-pointer transition-colors">Documentation</p>
                <p className="hover:text-foreground cursor-pointer transition-colors">API</p>
                <p className="hover:text-foreground cursor-pointer transition-colors">Blog</p>
              </div>
            </div>
            <div>
              <h4 className="text-foreground mb-3" style={{ fontWeight: 600 }}>Connect</h4>
              <div className="flex gap-3">
                <Github className="w-5 h-5 text-muted-foreground hover:text-foreground cursor-pointer transition-colors" />
                <Twitter className="w-5 h-5 text-muted-foreground hover:text-foreground cursor-pointer transition-colors" />
                <Linkedin className="w-5 h-5 text-muted-foreground hover:text-foreground cursor-pointer transition-colors" />
              </div>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center text-muted-foreground text-sm">
            &copy; 2026 CodeFolio. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}