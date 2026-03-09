import React, { useState, useEffect } from "react";
import { Clock, Bell, ExternalLink, Calendar } from "lucide-react";
import { ContestCardSkeleton } from "./Skeleton";
import { getAllContests } from "../../lib/contests";
import ContestCalendar from "./ContestCalendar";

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

function ContestCard({ contest }: { contest: any }) {
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
        <span>
  Duration: {Math.round(contest.duration / 3600)}h
</span>
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

const platformTabs = [
  "All",
  "LeetCode",
  "CodeChef",
  "Codeforces",
  "AtCoder",
  "HackerEarth",
  "GeeksforGeeks"
]

const platformColors = {
  LeetCode: "#f59e0b",
  CodeChef: "#8b5cf6",
  Codeforces: "#3b82f6",
  AtCoder: "#ef4444",
  HackerEarth: "#22c55e",
  GeeksforGeeks: "#16a34a",
}
export function ContestTracker() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("All");
  const [contests, setContests] = useState<any[]>([]);
  useEffect(() => {
    async function load() {
      const data = await getAllContests();
  
      const formatted = data.map((c: any, i: number) => ({
        id: i,
        name: c.title,
        platform: c.platform,
        url: c.url,
        date: new Date(c.start * 1000).toISOString(),
        duration: c.duration,
        color:
          c.platform === "LeetCode"
            ? "#f59e0b"
            : c.platform === "CodeChef"
            ? "#8b5cf6"
            : "#3b82f6",
        registered: false,
      }));
  
      setContests(formatted);
      setLoading(false);
    }
  
    load();
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
          
          <div className="space-y-6">
          
            {/* Contest Cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {loading
                ? Array.from({ length: 6 }, (_, i) => (
                    <ContestCardSkeleton key={i} />
                  ))
                : filtered.map((c) => (
                    <ContestCard key={c.id} contest={c} />
                  ))}
            </div>
          
            {/* Contest Calendar */}
            {!loading && (
  <div className="mt-14 pt-10 border-t border-border">
    <h2 className="text-3xl text-White font-semibold mb-6 text-center">
      Contest Calendar
    </h2>

    <ContestCalendar contests={filtered} />
  </div>
)}
          
          </div>
          </div>
          );
          }