import { useState } from "react";
import { useNavigate } from "react-router";
import { Code2, Github, ArrowRight, SkipForward, CheckCircle2 } from "lucide-react";

const platforms = [
  {
    id: "leetcode",
    name: "LeetCode",
    icon: "🧩",
    color: "#f59e0b",
    placeholder: "your_leetcode_username",
  },
  {
    id: "codechef",
    name: "CodeChef",
    icon: "👨‍🍳",
    color: "#8b5cf6",
    placeholder: "your_codechef_username",
  },
  {
    id: "github",
    name: "GitHub",
    icon: null,
    color: "#e5e7eb",
    placeholder: "your_github_username",
  },
];

export function OnboardingPage() {
  const navigate = useNavigate();
  const [usernames, setUsernames] = useState({ leetcode: "", codechef: "", github: "" });
  const [connected, setConnected] = useState<string[]>([]);

  const handleConnect = () => {
    const newConnected = Object.entries(usernames)
      .filter(([, v]) => v.trim())
      .map(([k]) => k);
    setConnected(newConnected);
    setTimeout(() => navigate("/dashboard"), 1000);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-10">
          <div className="flex items-center gap-2 justify-center mb-6">
            <Code2 className="w-8 h-8 text-primary" />
            <span className="text-2xl text-foreground" style={{ fontWeight: 700 }}>
              Code<span className="text-primary">Folio</span>
            </span>
          </div>
          <h1 className="text-2xl text-foreground mb-2" style={{ fontWeight: 700 }}>
            Connect Your Coding Profiles
          </h1>
          <p className="text-muted-foreground">
            Link your accounts to aggregate your coding statistics
          </p>
        </div>

        <div className="space-y-4">
          {platforms.map((p) => (
            <div
              key={p.id}
              className="bg-card border border-border rounded-2xl p-5 transition-all hover:border-primary/30"
            >
              <div className="flex items-center gap-3 mb-3">
                {p.icon ? (
                  <span className="text-2xl">{p.icon}</span>
                ) : (
                  <Github className="w-6 h-6 text-foreground" />
                )}
                <span className="text-foreground" style={{ fontWeight: 600 }}>
                  {p.name}
                </span>
                {connected.includes(p.id) && (
                  <CheckCircle2 className="w-5 h-5 text-primary ml-auto" />
                )}
              </div>
              <input
                type="text"
                value={usernames[p.id as keyof typeof usernames]}
                onChange={(e) =>
                  setUsernames({ ...usernames, [p.id]: e.target.value })
                }
                className="w-full bg-input-background border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder={p.placeholder}
              />
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-8">
          <button
            onClick={handleConnect}
            className="flex-1 bg-primary text-primary-foreground py-3 rounded-xl hover:bg-primary/90 transition-all inline-flex items-center justify-center gap-2 cursor-pointer"
            style={{ fontWeight: 600 }}
          >
            Connect Accounts <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigate("/dashboard")}
            className="flex-1 border border-border text-muted-foreground py-3 rounded-xl hover:bg-card hover:text-foreground transition-all inline-flex items-center justify-center gap-2 cursor-pointer"
          >
            <SkipForward className="w-4 h-4" /> Skip for now
          </button>
        </div>

        <div className="flex justify-center gap-2 mt-8">
          <div className="w-8 h-1.5 rounded-full bg-primary" />
          <div className="w-8 h-1.5 rounded-full bg-primary" />
          <div className="w-8 h-1.5 rounded-full bg-muted" />
        </div>
      </div>
    </div>
  );
}
