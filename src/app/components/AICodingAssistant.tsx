import { useState, useRef, useEffect } from "react";
import {
  Send, Sparkles, Code, Target, Flame, Zap,
  RotateCcw, Bot, User, ExternalLink,
} from "lucide-react";
import { useUser } from "./UserContext";
import { getLeetCodeStats } from "../../lib/leetcode";
import { getGFGStats } from "../../lib/gfg";

// ── Types ──────────────────────────────────────────────────────────────────────

interface Problem {
  name: string;
  difficulty: "Easy" | "Medium" | "Hard";
  topic: string;
  url?: string;
}

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
  problems?: Problem[];
  isError?: boolean;
}

// ── Constants ──────────────────────────────────────────────────────────────────

const diffColor: Record<string, string> = {
  Easy: "#10b981", Medium: "#f59e0b", Hard: "#ef4444",
};

const QUICK_PROMPTS = [
  "Generate today's study plan",
  "What topic should I focus on?",
  "Give me 5 hard problems to try",
  "How can I improve my contest rating?",
  "Best resources for Dynamic Programming",
];

// ── Simple markdown renderer (bold + newlines) ────────────────────────────────

function RenderMarkdown({ text }: { text: string }) {
  const lines = text.split("\n");
  return (
    <div className="space-y-1">
      {lines.map((line, i) => {
        // Bold **text**
        const parts = line.split(/(\*\*[^*]+\*\*)/g);
        return (
          <p key={i} className={`text-sm leading-relaxed ${line === "" ? "mt-1" : ""}`}>
            {parts.map((part, j) =>
              part.startsWith("**") && part.endsWith("**")
                ? <strong key={j} className="text-foreground" style={{ fontWeight: 600 }}>{part.slice(2, -2)}</strong>
                : <span key={j}>{part}</span>
            )}
          </p>
        );
      })}
    </div>
  );
}

// ── Groq Chat Call ────────────────────────────────────────────────────────────

async function callGroq(
  messages: { role: string; content: string }[],
  apiKey: string
): Promise<string> {
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "llama-3.1-8b-instant",
      max_tokens: 800,
      temperature: 0.7,
      messages,
    }),
  });
  const data = await res.json();
  if (!res.ok) {
    if (res.status === 429) throw new Error("Rate limit hit. Wait a moment and try again.");
    if (res.status === 401) throw new Error("Invalid Groq API key. Check VITE_GROQ_API_KEY in .env.");
    throw new Error(data?.error?.message || `API error (${res.status})`);
  }
  return data.choices?.[0]?.message?.content || "I couldn't generate a response.";
}

// ── Main Component ─────────────────────────────────────────────────────────────

export function AICodingAssistant() {
  const { user } = useUser();
  const firstName = user.name?.split(" ")[0] || "there";

  const [lcStats,  setLcStats]  = useState<any>(null);
  const [gfgData,  setGfgData]  = useState<any>(null);
  const [statsLoaded, setStatsLoaded] = useState(false);

  const [messages, setMessages] = useState<Message[]>([]);
  const [input,    setInput]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // ── Load real stats on mount ────────────────────────────────────────────────
  useEffect(() => {
    async function loadStats() {
      const [lc, gfg] = await Promise.all([
        user.leetcode ? getLeetCodeStats(user.leetcode) : null,
        user.gfg      ? getGFGStats(user.gfg)           : null,
      ]);
      setLcStats(lc);
      setGfgData(gfg);
      setStatsLoaded(true);

      // Greeting message once stats are loaded
      const totalSolved = (lc?.totalSolved || 0) + (gfg?.totalSolved || 0);
      const greeting = totalSolved > 0
        ? `Hey ${firstName}! 👋 I can see you've solved **${totalSolved} problems** total (${lc?.totalSolved || 0} on LeetCode${gfg?.totalSolved ? `, ${gfg.totalSolved} on GFG` : ""}). Your contest rating is **${lc?.contestRating || "N/A"}**.\n\nI'm your personal coding assistant — ask me for a study plan, problem recommendations, topic advice, or anything DSA related!`
        : `Hey ${firstName}! 👋 I'm your AI coding assistant.\n\nI can help you with study plans, problem recommendations, topic deep-dives, and interview prep. What would you like to work on today?`;

      setMessages([{ id: 1, role: "assistant", content: greeting }]);
    }
    loadStats();
  }, [user.leetcode, user.gfg]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // ── Build system prompt with real stats ────────────────────────────────────

  const buildSystemPrompt = () => {
    const totalSolved = (lcStats?.totalSolved || 0) + (gfgData?.totalSolved || 0);
    return `You are an expert DSA and competitive programming coach for ${firstName}.

Their real stats:
- Name: ${firstName}
- LeetCode: ${lcStats?.totalSolved || 0} solved (${lcStats?.easySolved || 0}E / ${lcStats?.mediumSolved || 0}M / ${lcStats?.hardSolved || 0}H), rating: ${lcStats?.contestRating || "unrated"}
- GeeksForGeeks: ${gfgData?.totalSolved || 0} solved, score: ${gfgData?.totalScore || 0}
- Total solved: ${totalSolved}

Rules:
- Always address them as ${firstName}
- Give specific, actionable advice based on THEIR actual numbers
- When recommending problems, ALWAYS format each one on its own line as: "- Problem Name (Easy/Medium/Hard)" — nothing else on that line
- Never use problem recommendations for generic advice like "review past problems"
- For study plans, be concrete with time estimates
- Keep responses focused and under 300 words unless a detailed explanation is needed
- Be encouraging and personalized`;
  };

  // ── Send message ────────────────────────────────────────────────────────────

  const handleSend = async (text?: string) => {
    const msg = (text || input).trim();
    if (!msg || loading) return;

    const apiKey = import.meta.env.VITE_GROQ_API_KEY;
    if (!apiKey) {
      setMessages(prev => [...prev, {
        id: Date.now(), role: "assistant",
        content: "⚠️ Add VITE_GROQ_API_KEY to your .env file to use the AI assistant.",
        isError: true,
      }]);
      return;
    }

    const userMsg: Message = { id: Date.now(), role: "user", content: msg };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      // Build full conversation history for Groq (last 10 messages for context)
      const history = [...messages, userMsg]
        .slice(-10)
        .map(m => ({ role: m.role, content: m.content }));

      const groqMessages = [
        { role: "system", content: buildSystemPrompt() },
        ...history,
      ];

      const reply = await callGroq(groqMessages, apiKey);

      // Parse any problem suggestions from the response
      const problems = extractProblems(reply);

      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: "assistant",
        content: reply,
        problems: problems.length > 0 ? problems : undefined,
      }]);
    } catch (e: any) {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: "assistant",
        content: `⚠️ ${e.message}`,
        isError: true,
      }]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  // ── Extract problem recommendations from AI response ──────────────────────

  function extractProblems(text: string): Problem[] {
    const problems: Problem[] = [];

    // Only match lines that look like explicit problem recommendations with difficulty tags.
    // Must be a bullet/numbered item AND have a difficulty word right next to the name.
    // Pattern: "- Two Sum (Easy, Arrays)" or "1. Coin Change - Medium" or "**Merge Intervals** (Hard)"
    const linePattern = /^[\s-•*\d.]+\*?\*?([A-Z][A-Za-z0-9 \-'&]+?)\*?\*?\s*[(-]\s*(Easy|Medium|Hard)\b/gm;

    let m;
    while ((m = linePattern.exec(text)) !== null && problems.length < 6) {
      const name = m[1].trim().replace(/\*+/g, "").trim();
      const diff = m[2] as "Easy" | "Medium" | "Hard";

      // Reject if name is too long (likely narrative, not a problem title)
      if (name.length > 50) continue;
      // Reject common false positives
      const skip = ["review", "practice", "solve", "attempt", "session", "take", "remember"];
      if (skip.some(w => name.toLowerCase().startsWith(w))) continue;

      if (!problems.find(p => p.name === name)) {
        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
        problems.push({
          name,
          difficulty: diff,
          topic: guessTopic(name),
          url: `https://leetcode.com/problems/${slug}/`,
        });
      }
    }
    return problems;
  }

  function guessTopic(name: string): string {
    const n = name.toLowerCase();
    if (/tree|bst|node|binary/.test(n)) return "Trees";
    if (/graph|island|course|path|network/.test(n)) return "Graphs";
    if (/dp|coin|knapsack|subsequence|partition/.test(n)) return "DP";
    if (/linked|list|node/.test(n)) return "Linked Lists";
    if (/string|palindrome|anagram|substring/.test(n)) return "Strings";
    if (/stack|queue|parenthes/.test(n)) return "Stacks";
    if (/heap|priority|median|top k/.test(n)) return "Heap";
    if (/sort|search|binary|rotated/.test(n)) return "Arrays";
    return "Arrays";
  }

  // ── Derived real stats for sidebar ────────────────────────────────────────

  const totalSolved  = (lcStats?.totalSolved || 0) + (gfgData?.totalSolved || 0);
  const hardPct      = lcStats?.totalSolved ? Math.round((lcStats.hardSolved / lcStats.totalSolved) * 100) : 0;

  // Guess weakest topic from easy/medium/hard ratio
  const weakestTopic = !lcStats ? "—"
    : lcStats.hardSolved < 30  ? "Hard Problems"
    : lcStats.mediumSolved < lcStats.easySolved * 1.5 ? "Medium Problems"
    : "Contest Strategy";

  const sidebarStats = [
    { label: "Total Solved",    value: statsLoaded ? String(totalSolved)            : "…", icon: Code },
    { label: "LC Rating",       value: statsLoaded ? String(lcStats?.contestRating || "—") : "…", icon: Zap },
    { label: "Hard Solved",     value: statsLoaded ? `${lcStats?.hardSolved || 0} (${hardPct}%)` : "…", icon: Flame },
    { label: "Focus Area",      value: statsLoaded ? weakestTopic                   : "…", icon: Target },
  ];

  const clearChat = () => {
    const totalSolved = (lcStats?.totalSolved || 0) + (gfgData?.totalSolved || 0);
    setMessages([{
      id: Date.now(), role: "assistant",
      content: `Chat cleared! Ready to help, ${firstName}. You've solved **${totalSolved}** problems. What would you like to work on?`,
    }]);
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="h-full flex flex-col lg:flex-row gap-5 min-h-0">

      {/* ── Left Panel ── */}
      <div className="lg:w-68 shrink-0 space-y-4" style={{ minWidth: "260px", maxWidth: "280px" }}>

        {/* Stats card */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <h3 className="text-foreground mb-4 text-sm" style={{ fontWeight: 600 }}>Your Stats</h3>
          <div className="space-y-3">
            {sidebarStats.map(s => (
              <div key={s.label} className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                  <s.icon className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-foreground text-sm" style={{ fontWeight: 600 }}>
                    {s.value === "…"
                      ? <span className="inline-block w-12 h-3 bg-muted rounded animate-pulse" />
                      : s.value
                    }
                  </p>
                  <p className="text-muted-foreground text-xs">{s.label}</p>
                </div>
              </div>
            ))}
          </div>

          {lcStats && (
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground mb-2">Difficulty split</p>
              <div className="flex gap-1 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 rounded-l" style={{ width: `${Math.round((lcStats.easySolved/lcStats.totalSolved)*100)}%` }} title={`Easy: ${lcStats.easySolved}`} />
                <div className="bg-amber-500" style={{ width: `${Math.round((lcStats.mediumSolved/lcStats.totalSolved)*100)}%` }} title={`Medium: ${lcStats.mediumSolved}`} />
                <div className="bg-red-500 rounded-r flex-1" title={`Hard: ${lcStats.hardSolved}`} />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span className="text-emerald-500">{lcStats.easySolved}E</span>
                <span className="text-amber-500">{lcStats.mediumSolved}M</span>
                <span className="text-red-500">{lcStats.hardSolved}H</span>
              </div>
            </div>
          )}
        </div>

        {/* Generate plan button */}
        <button
          onClick={() => handleSend("Generate a personalized study plan for me for today based on my actual stats")}
          disabled={loading}
          className="w-full bg-gradient-to-r from-primary to-teal-400 text-primary-foreground py-3 rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          style={{ fontWeight: 600 }}>
          <Sparkles className="w-4 h-4" /> Generate Today's Plan
        </button>

        {/* Quick prompts */}
        <div className="bg-card border border-border rounded-2xl p-4">
          <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wider" style={{ fontWeight: 600 }}>Quick asks</p>
          <div className="space-y-1.5">
            {QUICK_PROMPTS.slice(1).map(p => (
              <button key={p} onClick={() => handleSend(p)} disabled={loading}
                className="w-full text-left text-xs text-muted-foreground hover:text-foreground hover:bg-muted/50 px-3 py-2 rounded-lg transition-all cursor-pointer disabled:opacity-50">
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Chat Panel ── */}
      <div className="flex-1 bg-card border border-border rounded-2xl flex flex-col min-h-[500px] lg:min-h-0 overflow-hidden">

        {/* Header */}
        <div className="border-b border-border px-5 py-3.5 flex items-center gap-3">
          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-foreground text-sm" style={{ fontWeight: 600 }}>AI Coding Assistant</h3>
            <p className="text-muted-foreground text-xs">
              Powered by Groq · {statsLoaded ? `${(lcStats?.totalSolved||0)+(gfgData?.totalSolved||0)} problems loaded` : "Loading your stats…"}
            </p>
          </div>
          <button onClick={clearChat} className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-all cursor-pointer" title="Clear chat">
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.map(msg => (
            <div key={msg.id} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>

              {/* Avatar */}
              <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${msg.role === "user" ? "bg-primary/20" : "bg-primary/10"}`}>
                {msg.role === "user"
                  ? <User className="w-3.5 h-3.5 text-primary" />
                  : <Bot className="w-3.5 h-3.5 text-primary" />
                }
              </div>

              {/* Bubble */}
              <div className={`max-w-[82%] rounded-2xl px-4 py-3 ${
                msg.role === "user"
                  ? "bg-primary text-primary-foreground rounded-tr-sm"
                  : msg.isError
                    ? "bg-destructive/10 border border-destructive/20 text-destructive rounded-tl-sm"
                    : "bg-muted/40 text-foreground rounded-tl-sm"
              }`}>
                {msg.role === "user"
                  ? <p className="text-sm">{msg.content}</p>
                  : <RenderMarkdown text={msg.content} />
                }

                {/* Problem cards */}
                {msg.problems && msg.problems.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {msg.problems.map((p, i) => (
                      <div key={i} className="bg-background/60 border border-border/50 rounded-xl px-3 py-2.5 flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-sm truncate" style={{ fontWeight: 500 }}>{p.name}</p>
                          <p className="text-xs text-muted-foreground">{p.topic}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="px-2 py-0.5 rounded-full text-xs"
                            style={{ backgroundColor: `${diffColor[p.difficulty]}15`, color: diffColor[p.difficulty], fontWeight: 600 }}>
                            {p.difficulty}
                          </span>
                          {p.url && (
                            <a href={p.url} target="_blank" rel="noopener noreferrer"
                              className="text-muted-foreground hover:text-primary transition-colors">
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {loading && (
            <div className="flex gap-3">
              <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Bot className="w-3.5 h-3.5 text-primary" />
              </div>
              <div className="bg-muted/40 rounded-2xl rounded-tl-sm px-4 py-3">
                <div className="flex gap-1.5 items-center h-4">
                  {[0, 0.15, 0.3].map((delay, i) => (
                    <div key={i} className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce"
                      style={{ animationDelay: `${delay}s` }} />
                  ))}
                </div>
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        {/* Input */}
        <div className="border-t border-border p-4">
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && !e.shiftKey && handleSend()}
              disabled={loading}
              className="flex-1 bg-background border border-border rounded-xl px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm disabled:opacity-60"
              placeholder={`Ask ${firstName}'s AI coach anything…`}
            />
            <button
              onClick={() => handleSend()}
              disabled={loading || !input.trim()}
              className="bg-primary text-primary-foreground p-2.5 rounded-xl hover:bg-primary/90 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
              <Send className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}