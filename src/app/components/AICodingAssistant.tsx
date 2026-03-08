import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, Code, Target, Flame, Zap } from "lucide-react";
import { useUser } from "./UserContext";

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
  problems?: { name: string; difficulty: string; topic: string }[];
}

const statsSummary = [
  { label: "Problems Solved", value: "1,247", icon: Code },
  { label: "Current Streak", value: "47 days", icon: Flame },
  { label: "Weakest Topic", value: "Graphs", icon: Target },
  { label: "Avg. Daily", value: "3.2", icon: Zap },
];

const initialMessages: Message[] = [
  {
    id: 1,
    role: "assistant",
    content:
      "Hi! I've analyzed your coding profile. Your weakest topic is **Graphs** with only 29% completion. I recommend focusing on graph traversal problems today. Here are some suggested problems:",
    problems: [
      { name: "Number of Islands", difficulty: "Medium", topic: "Graphs" },
      { name: "Clone Graph", difficulty: "Medium", topic: "Graphs" },
      { name: "Course Schedule", difficulty: "Medium", topic: "Graphs" },
      { name: "Pacific Atlantic Water Flow", difficulty: "Medium", topic: "Graphs" },
    ],
  },
];

const aiResponses: Record<string, Message> = {
  plan: {
    id: 0,
    role: "assistant",
    content:
      "Here's your personalized coding plan for today based on your performance analytics:",
    problems: [
      { name: "Binary Tree Right Side View", difficulty: "Medium", topic: "Trees" },
      { name: "Graph Valid Tree", difficulty: "Medium", topic: "Graphs" },
      { name: "Coin Change", difficulty: "Medium", topic: "DP" },
      { name: "Kth Largest Element", difficulty: "Medium", topic: "Sorting" },
      { name: "Word Search II", difficulty: "Hard", topic: "Tries" },
    ],
  },
  default: {
    id: 0,
    role: "assistant",
    content:
      "Based on your coding profile, I'd suggest working on problems that target your weaker areas. Here are some recommendations:",
    problems: [
      { name: "Shortest Path in Grid", difficulty: "Medium", topic: "Graphs" },
      { name: "Edit Distance", difficulty: "Hard", topic: "DP" },
      { name: "Implement Trie", difficulty: "Medium", topic: "Tries" },
    ],
  },
};

const difficultyColor: Record<string, string> = {
  Easy: "#10b981",
  Medium: "#f59e0b",
  Hard: "#ef4444",
};

export function AICodingAssistant() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const { user } = useUser();
  const firstName = user.name.split(" ")[0];

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (text?: string) => {
    const msg = text || input.trim();
    if (!msg) return;

    const userMsg: Message = { id: Date.now(), role: "user", content: msg };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const res = await fetch("/api/ai-suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg, stats: statsSummary }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "assistant",
          content: data.reply,
          problems: data.problems || [],
        },
      ]);
    } catch {
      // Fallback to mock responses when API is unavailable
      const isPlan = msg.toLowerCase().includes("plan");
      const response = isPlan ? aiResponses.plan : aiResponses.default;
      await new Promise((r) => setTimeout(r, 1200));
      setMessages((prev) => [...prev, { ...response, id: Date.now() + 1 }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="h-full flex flex-col lg:flex-row gap-6 min-h-0">
      {/* Left Panel - Stats */}
      <div className="lg:w-72 shrink-0 space-y-4">
        <div className="bg-card border border-border rounded-2xl p-5">
          <h3 className="text-foreground mb-4" style={{ fontWeight: 600 }}>
            Your Stats Summary
          </h3>
          <div className="space-y-3">
            {statsSummary.map((s) => (
              <div key={s.label} className="flex items-center gap-3">
                <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center">
                  <s.icon className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-foreground text-sm" style={{ fontWeight: 600 }}>
                    {s.value}
                  </p>
                  <p className="text-muted-foreground text-xs">{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => handleSend("Generate Today's Coding Plan")}
          className="w-full bg-gradient-to-r from-primary to-teal-400 text-primary-foreground py-3 rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2 cursor-pointer"
          style={{ fontWeight: 600 }}
        >
          <Sparkles className="w-4 h-4" />
          Generate Today's Plan
        </button>
      </div>

      {/* Chat Panel */}
      <div className="flex-1 bg-card border border-border rounded-2xl flex flex-col min-h-[500px] lg:min-h-0 overflow-hidden">
        <div className="border-b border-border px-5 py-4 flex items-center gap-2">
          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h3 className="text-foreground text-sm" style={{ fontWeight: 600 }}>
              AI Coding Assistant
            </h3>
            <p className="text-muted-foreground text-xs">Powered by your coding analytics</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-4 ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted/50 text-foreground"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                {msg.problems && (
                  <div className="mt-3 space-y-2">
                    {msg.problems.map((p, i) => (
                      <div
                        key={i}
                        className="bg-background/50 rounded-xl px-3 py-2 flex items-center justify-between"
                      >
                        <div>
                          <p className="text-sm" style={{ fontWeight: 500 }}>
                            {p.name}
                          </p>
                          <p className="text-xs text-muted-foreground">{p.topic}</p>
                        </div>
                        <span
                          className="px-2 py-0.5 rounded-full text-xs shrink-0 ml-2"
                          style={{
                            backgroundColor: `${difficultyColor[p.difficulty]}15`,
                            color: difficultyColor[p.difficulty],
                            fontWeight: 600,
                          }}
                        >
                          {p.difficulty}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-muted/50 rounded-2xl px-4 py-3">
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
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
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className="flex-1 bg-input-background border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
              placeholder="Ask for coding recommendations..."
            />
            <button
              onClick={() => handleSend()}
              className="bg-primary text-primary-foreground p-3 rounded-xl hover:bg-primary/90 transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}