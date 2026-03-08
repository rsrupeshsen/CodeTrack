import React from "react";

import { useState } from "react";
import { Plus, Search, Filter, X, StickyNote, Check } from "lucide-react";

interface Problem {
  id: number;
  name: string;
  platform: string;
  difficulty: string;
  topic: string;
  status: "Solved" | "Attempted" | "Todo";
  notes: string;
}

const initialProblems: Problem[] = [
  { id: 1, name: "Two Sum", platform: "LeetCode", difficulty: "Easy", topic: "Arrays", status: "Solved", notes: "Hash map approach O(n)" },
  { id: 2, name: "Binary Tree Level Order Traversal", platform: "LeetCode", difficulty: "Medium", topic: "Trees", status: "Solved", notes: "BFS with queue" },
  { id: 3, name: "Course Schedule", platform: "LeetCode", difficulty: "Medium", topic: "Graphs", status: "Attempted", notes: "Topological sort - need to review" },
  { id: 4, name: "Merge K Sorted Lists", platform: "LeetCode", difficulty: "Hard", topic: "Linked Lists", status: "Solved", notes: "Priority queue approach" },
  { id: 5, name: "Chef and Digits", platform: "CodeChef", difficulty: "Easy", topic: "Math", status: "Solved", notes: "" },
  { id: 6, name: "Longest Increasing Subsequence", platform: "LeetCode", difficulty: "Medium", topic: "DP", status: "Todo", notes: "" },
  { id: 7, name: "Word Ladder", platform: "LeetCode", difficulty: "Hard", topic: "Graphs", status: "Attempted", notes: "BFS - TLE on large inputs" },
  { id: 8, name: "Maximum Subarray", platform: "LeetCode", difficulty: "Medium", topic: "DP", status: "Solved", notes: "Kadane's algorithm" },
  { id: 9, name: "Valid Parentheses", platform: "LeetCode", difficulty: "Easy", topic: "Stacks", status: "Solved", notes: "Stack approach" },
  { id: 10, name: "Median of Two Sorted Arrays", platform: "LeetCode", difficulty: "Hard", topic: "Binary Search", status: "Todo", notes: "" },
];

const topics = ["All", "Arrays", "Trees", "Graphs", "DP", "Linked Lists", "Math", "Stacks", "Binary Search"];
const difficulties = ["All", "Easy", "Medium", "Hard"];
const platforms = ["All", "LeetCode", "CodeChef"];

const difficultyColor: Record<string, string> = {
  Easy: "#10b981",
  Medium: "#f59e0b",
  Hard: "#ef4444",
};

const statusColor: Record<string, string> = {
  Solved: "#10b981",
  Attempted: "#f59e0b",
  Todo: "#94a3b8",
};

export function QuestionTracker() {
  const [problems, setProblems] = useState<Problem[]>(initialProblems);
  const [search, setSearch] = useState("");
  const [filterTopic, setFilterTopic] = useState("All");
  const [filterDiff, setFilterDiff] = useState("All");
  const [filterPlatform, setFilterPlatform] = useState("All");
  const [showAdd, setShowAdd] = useState(false);
  const [newProblem, setNewProblem] = useState({
    name: "",
    platform: "LeetCode",
    difficulty: "Easy",
    topic: "Arrays",
    notes: "",
  });

  const filtered = problems.filter((p) => {
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterTopic !== "All" && p.topic !== filterTopic) return false;
    if (filterDiff !== "All" && p.difficulty !== filterDiff) return false;
    if (filterPlatform !== "All" && p.platform !== filterPlatform) return false;
    return true;
  });

  const handleAdd = () => {
    if (!newProblem.name.trim()) return;
    setProblems([
      ...problems,
      {
        id: Date.now(),
        ...newProblem,
        status: "Todo",
      },
    ]);
    setNewProblem({ name: "", platform: "LeetCode", difficulty: "Easy", topic: "Arrays", notes: "" });
    setShowAdd(false);
  };

  const toggleStatus = (id: number) => {
    setProblems(
      problems.map((p) => {
        if (p.id !== id) return p;
        const next: Record<string, "Solved" | "Attempted" | "Todo"> = {
          Todo: "Attempted",
          Attempted: "Solved",
          Solved: "Todo",
        };
        return { ...p, status: next[p.status] };
      })
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl text-foreground mb-1" style={{ fontWeight: 700 }}>
            Question Tracker
          </h1>
          <p className="text-muted-foreground">Track your solved problems across platforms</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-xl hover:bg-primary/90 transition-all flex items-center gap-2 cursor-pointer self-start"
          style={{ fontWeight: 600 }}
        >
          <Plus className="w-4 h-4" /> Add Problem
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center bg-card border border-border rounded-xl px-3 py-2 flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-muted-foreground mr-2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none text-sm w-full"
            placeholder="Search problems..."
          />
        </div>
        <select
          value={filterTopic}
          onChange={(e) => setFilterTopic(e.target.value)}
          className="bg-card border border-border rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer"
        >
          {topics.map((t) => (
            <option key={t} value={t}>{t === "All" ? "All Topics" : t}</option>
          ))}
        </select>
        <select
          value={filterDiff}
          onChange={(e) => setFilterDiff(e.target.value)}
          className="bg-card border border-border rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer"
        >
          {difficulties.map((d) => (
            <option key={d} value={d}>{d === "All" ? "All Difficulties" : d}</option>
          ))}
        </select>
        <select
          value={filterPlatform}
          onChange={(e) => setFilterPlatform(e.target.value)}
          className="bg-card border border-border rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer"
        >
          {platforms.map((p) => (
            <option key={p} value={p}>{p === "All" ? "All Platforms" : p}</option>
          ))}
        </select>
      </div>

      {/* Add Problem Modal */}
      {showAdd && (
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-foreground" style={{ fontWeight: 600 }}>Add New Problem</h3>
            <button onClick={() => setShowAdd(false)} className="text-muted-foreground hover:text-foreground cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <input
              type="text"
              value={newProblem.name}
              onChange={(e) => setNewProblem({ ...newProblem, name: e.target.value })}
              className="bg-input-background border border-border rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="Problem name"
            />
            <select
              value={newProblem.platform}
              onChange={(e) => setNewProblem({ ...newProblem, platform: e.target.value })}
              className="bg-input-background border border-border rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none cursor-pointer"
            >
              <option>LeetCode</option>
              <option>CodeChef</option>
            </select>
            <select
              value={newProblem.difficulty}
              onChange={(e) => setNewProblem({ ...newProblem, difficulty: e.target.value })}
              className="bg-input-background border border-border rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none cursor-pointer"
            >
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </select>
            <select
              value={newProblem.topic}
              onChange={(e) => setNewProblem({ ...newProblem, topic: e.target.value })}
              className="bg-input-background border border-border rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none cursor-pointer"
            >
              {topics.filter((t) => t !== "All").map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
            <input
              type="text"
              value={newProblem.notes}
              onChange={(e) => setNewProblem({ ...newProblem, notes: e.target.value })}
              className="bg-input-background border border-border rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 sm:col-span-2"
              placeholder="Notes (optional)"
            />
          </div>
          <button
            onClick={handleAdd}
            className="mt-3 bg-primary text-primary-foreground px-4 py-2 rounded-xl hover:bg-primary/90 transition-all text-sm cursor-pointer"
            style={{ fontWeight: 600 }}
          >
            Add Problem
          </button>
        </div>
      )}

      {/* Table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-muted-foreground text-xs px-5 py-3 uppercase tracking-wider" style={{ fontWeight: 600 }}>Problem</th>
                <th className="text-left text-muted-foreground text-xs px-5 py-3 uppercase tracking-wider hidden sm:table-cell" style={{ fontWeight: 600 }}>Platform</th>
                <th className="text-left text-muted-foreground text-xs px-5 py-3 uppercase tracking-wider" style={{ fontWeight: 600 }}>Difficulty</th>
                <th className="text-left text-muted-foreground text-xs px-5 py-3 uppercase tracking-wider hidden md:table-cell" style={{ fontWeight: 600 }}>Topic</th>
                <th className="text-left text-muted-foreground text-xs px-5 py-3 uppercase tracking-wider" style={{ fontWeight: 600 }}>Status</th>
                <th className="text-left text-muted-foreground text-xs px-5 py-3 uppercase tracking-wider hidden lg:table-cell" style={{ fontWeight: 600 }}>Notes</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-3">
                    <span className="text-foreground text-sm" style={{ fontWeight: 500 }}>{p.name}</span>
                  </td>
                  <td className="px-5 py-3 hidden sm:table-cell">
                    <span className="text-muted-foreground text-sm">{p.platform}</span>
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className="px-2 py-0.5 rounded-full text-xs"
                      style={{
                        backgroundColor: `${difficultyColor[p.difficulty]}15`,
                        color: difficultyColor[p.difficulty],
                        fontWeight: 600,
                      }}
                    >
                      {p.difficulty}
                    </span>
                  </td>
                  <td className="px-5 py-3 hidden md:table-cell">
                    <span className="text-muted-foreground text-sm">{p.topic}</span>
                  </td>
                  <td className="px-5 py-3">
                    <button
                      onClick={() => toggleStatus(p.id)}
                      className="px-2 py-0.5 rounded-full text-xs cursor-pointer"
                      style={{
                        backgroundColor: `${statusColor[p.status]}15`,
                        color: statusColor[p.status],
                        fontWeight: 600,
                      }}
                    >
                      {p.status}
                    </button>
                  </td>
                  <td className="px-5 py-3 hidden lg:table-cell">
                    <span className="text-muted-foreground text-xs">{p.notes || "—"}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No problems found matching your filters.
          </div>
        )}
      </div>
    </div>
  );
}
