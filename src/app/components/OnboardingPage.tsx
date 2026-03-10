import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { Code2, Github, ArrowRight, SkipForward, CheckCircle2, Loader2 } from "lucide-react";
import { useUser } from "./UserContext";
import { upsertProfile } from "../../lib/database";
import { getUser } from "../../lib/auth";

// ✅ Fixed: codechef → gfg to match UserContext schema
const platforms = [
  { id: "leetcode", name: "LeetCode",      icon: "🧩", placeholder: "your_leetcode_username" },
  { id: "gfg",      name: "GeeksForGeeks", icon: "📗", placeholder: "your_gfg_username" },
  { id: "github",   name: "GitHub",        icon: null,  placeholder: "your_github_username" },
];

export function OnboardingPage() {
  const navigate = useNavigate();
  const { user, setUser } = useUser();
  const [usernames, setUsernames] = useState({ leetcode: "", gfg: "", github: "" });
  const [connected, setConnected] = useState<string[]>([]);
  // ✅ FIX: Track saving state so we can show a spinner and prevent double-clicks
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConnect = async () => {
    setIsSaving(true);
    setError(null);

    const newConnected = Object.entries(usernames)
      .filter(([, v]) => v.trim())
      .map(([k]) => k);
    setConnected(newConnected);

    const updatedUser = {
      ...user,
      leetcode: usernames.leetcode.trim(),
      gfg:      usernames.gfg.trim(),
      github:   usernames.github.trim(),
    };

    // ✅ FIX: Save to Appwrite DB so data persists across logouts.
    // Previously only setUser() was called — that only writes to React state
    // + localStorage. On logout, localStorage is cleared, so all onboarding
    // data was permanently lost. Now we save to Appwrite first.
    try {
      const appwriteUser = await getUser();
      if (appwriteUser) {
        await upsertProfile(appwriteUser.$id, {
          leetcode: updatedUser.leetcode,
          gfg:      updatedUser.gfg,
          github:   updatedUser.github,
          // Preserve existing profile fields if already set
          name:     user.name,
          username: user.username,
          bio:      user.bio,
          techStack:user.techStack,
          website:  user.website  || null,
          linkedin: user.linkedin || null,
          twitter:  user.twitter  || null,
        });
      }
    } catch (err: any) {
      console.error("Onboarding save error:", err);
      // Don't block the user — still update local state and navigate
      // They can update again from Settings
      setError("Couldn't save to cloud, but you can update in Settings.");
    }

    // Always update local state regardless of DB result
    setUser(updatedUser);

    setTimeout(() => navigate("/dashboard"), 800);
    setIsSaving(false);
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
            Link your accounts to start tracking your progress
          </p>
        </div>

        <div className="space-y-4">
          {platforms.map((p) => (
            <div
              key={p.id}
              className="bg-card border border-border rounded-2xl p-5 transition-all hover:border-primary/30"
            >
              <div className="flex items-center gap-3 mb-3">
                {p.icon
                  ? <span className="text-2xl">{p.icon}</span>
                  : <Github className="w-6 h-6 text-foreground" />
                }
                <span className="text-foreground" style={{ fontWeight: 600 }}>{p.name}</span>
                {connected.includes(p.id) && (
                  <CheckCircle2 className="w-5 h-5 text-primary ml-auto" />
                )}
              </div>
              <input
                type="text"
                value={usernames[p.id as keyof typeof usernames]}
                onChange={(e) => setUsernames({ ...usernames, [p.id]: e.target.value })}
                className="w-full bg-input-background border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder={p.placeholder}
              />
            </div>
          ))}
        </div>

        {error && (
          <p className="text-yellow-500 text-sm text-center mt-4">{error}</p>
        )}

        <div className="flex flex-col sm:flex-row gap-3 mt-8">
          <button
            onClick={handleConnect}
            disabled={isSaving}
            className="flex-1 bg-primary text-primary-foreground py-3 rounded-xl hover:bg-primary/90 transition-all inline-flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
            style={{ fontWeight: 600 }}
          >
            {isSaving
              ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
              : <> Connect Accounts <ArrowRight className="w-4 h-4" /></>
            }
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