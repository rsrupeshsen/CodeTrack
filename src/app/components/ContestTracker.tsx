import React, { useState, useEffect } from "react";
import { Clock, Bell, ExternalLink, Calendar } from "lucide-react";
import { ContestCardSkeleton } from "./Skeleton";

const contests = [
  {
    id: 1,
    name: "LeetCode Weekly Contest 437",
    platform: "LeetCode",
    url: "https://leetcode.com/contest/weekly-contest-437",
    date: "2026-03-08T14:30:00",
    duration: "1h 30m",
    color: "#f59e0b",
    registered: false,
  },
  {
    id: 2,
    name: "CodeChef Starters 182",
    platform: "CodeChef",
    url: "https://www.codechef.com/START182",
    date: "2026-03-10T20:00:00",
    duration: "2h",
    color: "#8b5cf6",
    registered: true,
  },
  {
    id: 3,
    name: "LeetCode Biweekly Contest 152",
    platform: "LeetCode",
    url: "https://leetcode.com/contest/biweekly-contest-152",
    date: "2026-03-15T14:30:00",
    duration: "1h 30m",
    color: "#f59e0b",
    registered: false,
  },
  {
    id: 4,
    name: "CodeChef Long Challenge March",
    platform: "CodeChef",
    url: "https://www.codechef.com/MARCH26",
    date: "2026-03-20T15:00:00",
    duration: "10 days",
    color: "#8b5cf6",
    registered: false,
  },
  {
    id: 5,
    name: "LeetCode Weekly Contest 438",
    platform: "LeetCode",
    url: "https://leetcode.com/contest/weekly-contest-438",
    date: "2026-03-22T14:30:00",
    duration: "1h 30m",
    color: "#f59e0b",
    registered: false,
  },
  {
    id: 6,
    name: "CodeChef Starters 183",
    platform: "CodeChef",
    url: "https://www.codechef.com/START183",
    date: "2026-03-25T20:00:00",
    duration: "2h",
    color: "#8b5cf6",
    registered: false,
  },
];

function useCountdown(targetDate: string) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const update = () => {
      const diff = new Date(targetDate).getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft("Started");
        return;
      }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      setTimeLeft(d > 0 ? `${d}d ${h}h ${m}m` : `${h}h ${m}m`);
    };
    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return timeLeft;
}

function ContestCard({ contest }: { contest: (typeof contests)[0] }) {
  const countdown = useCountdown(contest.date);
  const [registered, setRegistered] = useState(contest.registered);
  const [reminded, setReminded] = useState(false);

  const date = new Date(contest.date);
  const dateStr = date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
  const timeStr = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="bg-card border border-border rounded-2xl p-5 hover:border-primary/20 transition-all">
      <div className="flex items-start justify-between mb-3">
        <span
          className="px-2.5 py-0.5 rounded-full text-xs"
          style={{
            backgroundColor: `${contest.color}15`,
            color: contest.color,
            fontWeight: 600,
          }}
        >
          {contest.platform}
        </span>
        <div className="flex items-center gap-1 text-primary text-sm" style={{ fontWeight: 600 }}>
          <Clock className="w-3.5 h-3.5" />
          {countdown}
        </div>
      </div>

      <h3 className="text-foreground mb-3" style={{ fontWeight: 600 }}>
        {contest.name}
      </h3>

      <div className="flex items-center gap-4 text-muted-foreground text-sm mb-4">
        <div className="flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5" />
          {dateStr} at {timeStr}
        </div>
        <span>Duration: {contest.duration}</span>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setReminded(!reminded)}
          className={`flex-1 py-2 rounded-xl text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            reminded
              ? "bg-primary/10 text-primary border border-primary/30"
              : "border border-border text-muted-foreground hover:text-foreground hover:bg-card"
          }`}
        >
          <Bell className="w-3.5 h-3.5" />
          {reminded ? "Reminded" : "Add Reminder"}
        </button>
        <button
          onClick={() => window.open(contest.url, "_blank")}
          className="flex-1 py-2 rounded-xl text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer border border-border text-muted-foreground hover:text-foreground hover:bg-card"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          Register →
        </button>
      </div>
    </div>
  );
}

const platformTabs = ["All", "LeetCode", "CodeChef"] as const;

export function ContestTracker() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("All");

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const filtered = activeTab === "All"
    ? contests
    : contests.filter((c) => c.platform === activeTab);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl text-foreground mb-1" style={{ fontWeight: 700 }}>
            Contest Tracker
          </h1>
          <p className="text-muted-foreground">Upcoming coding contests across platforms</p>
        </div>
        <a
          href="https://kontests.net"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary text-sm hover:underline inline-flex items-center gap-1 cursor-pointer self-start"
          style={{ fontWeight: 500 }}
        >
          View All Contests <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Platform Filter Tabs */}
      <div className="flex gap-1 border-b border-border">
        {platformTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-sm transition-all cursor-pointer ${
              activeTab === tab
                ? "bg-primary/10 text-primary border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
            style={{ fontWeight: activeTab === tab ? 600 : 400 }}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading
          ? Array.from({ length: 6 }, (_, i) => <ContestCardSkeleton key={i} />)
          : filtered.map((c) => (
              <ContestCard key={c.id} contest={c} />
            ))}
      </div>
    </div>
  );
}