import { useState } from "react";
import { Save, Github, Linkedin, Twitter, Globe, Copy, Check, ExternalLink } from "lucide-react";
import { toast, Toaster } from "sonner";
import { useUser } from "./UserContext";

export function SettingsPage() {
  const { user, setUser } = useUser();
  const [form, setForm] = useState({
    name: user.name,
    username: user.username,
    bio: user.bio,
    techStack: user.techStack,
    leetcode: user.leetcode,
    codechef: user.codechef,
    github: user.github,
    website: user.website,
    linkedin: user.linkedin,
    twitter: user.twitter,
  });
  const [copied, setCopied] = useState(false);

  const initials = form.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const publicUrl = form.username
    ? `codefolio.vercel.app/user/${form.username}`
    : "codefolio.vercel.app/user/your-username";

  const handleCopy = () => {
    navigator.clipboard.writeText(`https://${publicUrl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    setUser({ ...user, ...form });
    toast.success("Settings saved successfully!");
  };

  const update = (key: string, val: string) => setForm({ ...form, [key]: val });

  return (
    <div className="space-y-6 max-w-3xl">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#1e293b",
            border: "1px solid rgba(148,163,184,0.15)",
            color: "#e5e7eb",
          },
        }}
      />

      <div>
        <h1 className="text-2xl text-foreground mb-1" style={{ fontWeight: 700 }}>
          Profile Settings
        </h1>
        <p className="text-muted-foreground">Manage your account and coding profiles</p>
      </div>

      {/* Profile Info */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <h3 className="text-foreground mb-5" style={{ fontWeight: 600 }}>
          Personal Information
        </h3>
        <div className="space-y-4">
          <div className="flex items-center gap-5 mb-2">
            <div className="w-20 h-20 bg-primary/20 rounded-2xl flex items-center justify-center">
              <span className="text-primary text-xl" style={{ fontWeight: 700 }}>{initials}</span>
            </div>
            <button className="text-sm text-primary hover:underline cursor-pointer" style={{ fontWeight: 500 }}>
              Change avatar
            </button>
          </div>

          <div>
            <label className="text-sm text-foreground mb-1.5 block">Full Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              className="w-full bg-input-background border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <div>
            <label className="text-sm text-foreground mb-1.5 block">Your Username</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">@</span>
              <input
                type="text"
                value={form.username}
                onChange={(e) => update("username", e.target.value.replace(/[^a-zA-Z0-9_]/g, ""))}
                className="w-full bg-input-background border border-border rounded-xl pl-8 pr-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="your_username"
              />
            </div>
            <p className="text-muted-foreground text-xs mt-1">Only letters, numbers, and underscores</p>
          </div>

          <div>
            <label className="text-sm text-foreground mb-1.5 block">Bio</label>
            <textarea
              value={form.bio}
              onChange={(e) => update("bio", e.target.value)}
              rows={3}
              className="w-full bg-input-background border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
            />
          </div>

          <div>
            <label className="text-sm text-foreground mb-1.5 block">Tech Stack</label>
            <input
              type="text"
              value={form.techStack}
              onChange={(e) => update("techStack", e.target.value)}
              className="w-full bg-input-background border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="Comma separated technologies"
            />
          </div>
        </div>
      </div>

      {/* Coding Profiles */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <h3 className="text-foreground mb-5" style={{ fontWeight: 600 }}>
          Coding Profiles
        </h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-foreground mb-1.5 flex items-center gap-2">
              <span>🧩</span> LeetCode Username
            </label>
            <input
              type="text"
              value={form.leetcode}
              onChange={(e) => update("leetcode", e.target.value)}
              className="w-full bg-input-background border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <div>
            <label className="text-sm text-foreground mb-1.5 flex items-center gap-2">
              <span>👨‍🍳</span> CodeChef Username
            </label>
            <input
              type="text"
              value={form.codechef}
              onChange={(e) => update("codechef", e.target.value)}
              className="w-full bg-input-background border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <div>
            <label className="text-sm text-foreground mb-1.5 flex items-center gap-2">
              <Github className="w-4 h-4" /> GitHub Username
            </label>
            <input
              type="text"
              value={form.github}
              onChange={(e) => update("github", e.target.value)}
              className="w-full bg-input-background border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        </div>
      </div>

      {/* Social Links */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <h3 className="text-foreground mb-5" style={{ fontWeight: 600 }}>
          Social Links
        </h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-foreground mb-1.5 flex items-center gap-2">
              <Globe className="w-4 h-4" /> Website
            </label>
            <input
              type="url"
              value={form.website}
              onChange={(e) => update("website", e.target.value)}
              className="w-full bg-input-background border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <div>
            <label className="text-sm text-foreground mb-1.5 flex items-center gap-2">
              <Linkedin className="w-4 h-4" /> LinkedIn
            </label>
            <input
              type="url"
              value={form.linkedin}
              onChange={(e) => update("linkedin", e.target.value)}
              className="w-full bg-input-background border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <div>
            <label className="text-sm text-foreground mb-1.5 flex items-center gap-2">
              <Twitter className="w-4 h-4" /> Twitter
            </label>
            <input
              type="url"
              value={form.twitter}
              onChange={(e) => update("twitter", e.target.value)}
              className="w-full bg-input-background border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        </div>
      </div>

      {/* Public Profile URL */}
      <div className="bg-card border border-primary/30 rounded-2xl p-6">
        <h3 className="text-foreground mb-4" style={{ fontWeight: 600 }}>
          Your Public Profile URL
        </h3>
        <div className="flex items-center gap-3">
          <div className="flex-1 bg-input-background border border-border rounded-xl px-4 py-3 text-sm text-muted-foreground truncate">
            {publicUrl}
          </div>
          <button
            onClick={handleCopy}
            className="bg-card border border-border rounded-xl p-3 text-muted-foreground hover:text-foreground transition-colors cursor-pointer relative"
          >
            {copied ? (
              <Check className="w-4 h-4 text-primary" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
        </div>
        {copied && (
          <p className="text-primary text-xs mt-2" style={{ fontWeight: 500 }}>Copied!</p>
        )}
      </div>

      {/* View Public Profile + Save */}
      {form.username && (
        <a
          href={`/user/${form.username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary text-sm hover:underline inline-flex items-center gap-1 cursor-pointer"
          style={{ fontWeight: 500 }}
        >
          View public profile <ExternalLink className="w-3.5 h-3.5" />
        </a>
      )}

      <button
        onClick={handleSave}
        className="bg-primary text-primary-foreground px-6 py-3 rounded-xl hover:bg-primary/90 transition-all flex items-center gap-2 cursor-pointer"
        style={{ fontWeight: 600 }}
      >
        <Save className="w-4 h-4" /> Save Changes
      </button>
    </div>
  );
}
