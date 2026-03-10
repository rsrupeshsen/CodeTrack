import { useState, useEffect, useRef } from "react";
import {
  Plus, Search, X, Lightbulb, RefreshCw,
  ChevronDown, BookOpen, User,
  Clock, CheckCircle2, Circle, AlertCircle, ExternalLink,
} from "lucide-react";
import { getAIHint } from "../../lib/aiHint";

import blind75Data      from "../../data/blind75.json";
import neetcode150Extra from "../../data/neetcode150extra.json";
import striverSDEData   from "../../data/striverSDE.json";
import companyData      from "../../data/company.json";

// ── Types ──────────────────────────────────────────────────────────────────────

interface SheetProblem {
  id: number; name: string; url: string;
  difficulty: string; topic: string; company: string;
}
interface Problem {
  id: number; name: string; url: string; platform: string;
  difficulty: string; topic: string; company: string;
  status: "Solved" | "Attempted" | "Todo";
  notes: string; solvedAt: string | null; lastReviewed: string | null;
}

// ── Sheets ─────────────────────────────────────────────────────────────────────

const neetcode150 = [...(blind75Data as SheetProblem[]), ...(neetcode150Extra as SheetProblem[])];
const SHEETS: Record<string, { label: string; desc: string; problems: SheetProblem[] }> = {
  blind75:     { label: "Blind 75",          desc: "75 must-do LeetCode problems",      problems: blind75Data as SheetProblem[] },
  neetcode150: { label: "NeetCode 150",       desc: "150 curated by NeetCode",           problems: neetcode150 },
  striverSDE:  { label: "Striver SDE Sheet",  desc: "191 problems for SDE interviews",   problems: striverSDEData as SheetProblem[] },
  amazon:      { label: "Amazon",             desc: "Top Amazon interview questions",    problems: (companyData as SheetProblem[]).filter(p => p.company === "Amazon") },
  google:      { label: "Google",             desc: "Top Google interview questions",    problems: (companyData as SheetProblem[]).filter(p => p.company === "Google") },
  meta:        { label: "Meta",               desc: "Top Meta interview questions",      problems: (companyData as SheetProblem[]).filter(p => p.company === "Meta") },
  microsoft:   { label: "Microsoft",          desc: "Top Microsoft interview questions", problems: (companyData as SheetProblem[]).filter(p => p.company === "Microsoft") },
  apple:       { label: "Apple",              desc: "Top Apple interview questions",     problems: (companyData as SheetProblem[]).filter(p => p.company === "Apple") },
};

// ── Constants ──────────────────────────────────────────────────────────────────

const TOPICS    = ["All","Arrays","Trees","Graphs","DP","Linked Lists","Strings","Stacks","Binary Search","Greedy","Math","Backtracking","Heap","Tries","Bit Manipulation"];
const DIFFS     = ["All","Easy","Medium","Hard"];
const PLATFORMS = ["All","LeetCode","GFG","CodeChef","Codeforces","HackerRank"];
const COMPANIES = ["All","Amazon","Google","Meta","Microsoft","Apple","Netflix"];

const diffColor: Record<string,string> = { Easy:"#10b981", Medium:"#f59e0b", Hard:"#ef4444" };
const statColor: Record<string,string> = { Solved:"#10b981", Attempted:"#f59e0b", Todo:"#94a3b8" };

const STORAGE_KEY      = "codefolio_problems_v3";
const SHEET_STATUS_KEY = "codefolio_sheet_status_v2";

// ── Helpers ────────────────────────────────────────────────────────────────────

function daysUntilReview(solvedAt: string|null, lastReviewed: string|null): number {
  const base = lastReviewed || solvedAt;
  if (!base) return 99;
  return Math.max(0, 7 - Math.floor((Date.now() - new Date(base).getTime()) / 86400000));
}

function ProgressBar({ solved, total, color="#10b981" }: { solved:number; total:number; color?:string }) {
  const pct = total > 0 ? Math.round((solved/total)*100) : 0;
  return (
    <div>
      <div className="flex justify-between text-xs text-muted-foreground mb-1"><span>{solved}/{total}</span><span>{pct}%</span></div>
      <div className="w-full bg-muted rounded-full h-2">
        <div className="h-2 rounded-full transition-all duration-500" style={{ width:`${pct}%`, backgroundColor:color }} />
      </div>
    </div>
  );
}

// ── Sheet Dropdown ─────────────────────────────────────────────────────────────

function SheetDropdown({ active, onChange }: { active:string; onChange:(k:string)=>void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const groups = [
    { label: "📋 Curated Lists", keys: ["blind75","neetcode150","striverSDE"] },
    { label: "🏢 Company Wise",  keys: ["amazon","google","meta","microsoft","apple"] },
  ];

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(!open)}
        className="flex items-center gap-2 bg-card border border-border rounded-xl px-4 py-2.5 text-sm text-foreground hover:border-primary/50 transition-all cursor-pointer min-w-[220px]"
        style={{ fontWeight:500 }}>
        <BookOpen className="w-4 h-4 text-primary" />
        <span className="flex-1 text-left">{SHEETS[active].label}</span>
        <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">{SHEETS[active].problems.length}</span>
        <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${open?"rotate-180":""}`} />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 w-72 bg-card border border-border rounded-2xl shadow-2xl z-50 overflow-hidden">
          {groups.map(group => (
            <div key={group.label}>
              <div className="px-3 py-2 text-xs text-muted-foreground uppercase tracking-wider bg-muted/30" style={{ fontWeight:600 }}>
                {group.label}
              </div>
              {group.keys.map(key => (
                <button key={key} onClick={() => { onChange(key); setOpen(false); }}
                  className={`w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-muted/50 transition-all cursor-pointer ${active===key?"bg-primary/10 text-primary":"text-foreground"}`}>
                  <div className="text-left">
                    <p style={{ fontWeight: active===key ? 600 : 400 }}>{SHEETS[key].label}</p>
                    <p className="text-xs text-muted-foreground">{SHEETS[key].desc}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ml-2 ${active===key?"bg-primary/20 text-primary":"bg-muted text-muted-foreground"}`}>
                    {SHEETS[key].problems.length}
                  </span>
                </button>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────

export function QuestionTracker() {
  const [tab, setTab]             = useState<"personal"|"sheets">("personal");
  const [activeSheet, setActiveSheet] = useState("blind75");

  const [problems, setProblems] = useState<Problem[]>(() => {
    try {
      const s = localStorage.getItem(STORAGE_KEY);
      return s ? JSON.parse(s) : [
        { id:1, name:"Two Sum", url:"https://leetcode.com/problems/two-sum/", platform:"LeetCode", difficulty:"Easy", topic:"Arrays", company:"Amazon", status:"Solved", notes:"Hash map O(n)", solvedAt:new Date(Date.now()-8*86400000).toISOString(), lastReviewed:null },
        { id:2, name:"Binary Tree Level Order", url:"", platform:"LeetCode", difficulty:"Medium", topic:"Trees", company:"Google", status:"Solved", notes:"BFS with queue", solvedAt:new Date(Date.now()-3*86400000).toISOString(), lastReviewed:null },
        { id:3, name:"Course Schedule", url:"https://leetcode.com/problems/course-schedule/", platform:"LeetCode", difficulty:"Medium", topic:"Graphs", company:"Meta", status:"Attempted", notes:"Topological sort - need to review", solvedAt:null, lastReviewed:null },
        { id:4, name:"Merge K Sorted Lists", url:"", platform:"LeetCode", difficulty:"Hard", topic:"Linked Lists", company:"Amazon", status:"Solved", notes:"Priority queue approach", solvedAt:new Date(Date.now()-10*86400000).toISOString(), lastReviewed:null },
      ];
    } catch { return []; }
  });

  const [sheetStatus, setSheetStatus] = useState<Record<number,"Solved"|"Attempted"|"Todo">>(() => {
    try { return JSON.parse(localStorage.getItem(SHEET_STATUS_KEY)||"{}"); } catch { return {}; }
  });

  const [search, setSearch]                 = useState("");
  const [filterTopic, setFilterTopic]       = useState("All");
  const [filterDiff, setFilterDiff]         = useState("All");
  const [filterPlatform, setFilterPlatform] = useState("All");
  const [filterStatus, setFilterStatus]     = useState("All");
  const [showAdd, setShowAdd]               = useState(false);
  const [expandedId, setExpandedId]         = useState<number|null>(null);
  const [hints, setHints]                   = useState<Record<string,string>>({});
  const [hintLoading, setHintLoading]       = useState<Record<string,boolean>>({});
  const [newProblem, setNewProblem]         = useState({ name:"", url:"", platform:"LeetCode", difficulty:"Easy", topic:"Arrays", company:"Amazon", notes:"" });

  useEffect(() => { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(problems)); } catch {} }, [problems]);
  useEffect(() => { try { localStorage.setItem(SHEET_STATUS_KEY, JSON.stringify(sheetStatus)); } catch {} }, [sheetStatus]);
  useEffect(() => { setSearch(""); setFilterTopic("All"); setFilterDiff("All"); setFilterStatus("All"); }, [tab, activeSheet]);

  // ── Personal logic ────────────────────────────────────────────────────────

  const filtered = problems.filter(p => {
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterTopic !== "All" && p.topic !== filterTopic) return false;
    if (filterDiff !== "All" && p.difficulty !== filterDiff) return false;
    if (filterPlatform !== "All" && p.platform !== filterPlatform) return false;
    if (filterStatus !== "All" && p.status !== filterStatus) return false;
    return true;
  });

  const dueForReview = problems.filter(p => p.status === "Solved" && daysUntilReview(p.solvedAt, p.lastReviewed) === 0);

  const handleAdd = () => {
    if (!newProblem.name.trim()) return;
    setProblems([...problems, { id:Date.now(), ...newProblem, status:"Todo", solvedAt:null, lastReviewed:null }]);
    setNewProblem({ name:"", url:"", platform:"LeetCode", difficulty:"Easy", topic:"Arrays", company:"Amazon", notes:"" });
    setShowAdd(false);
  };

  const cycleStatus = (id:number) => setProblems(problems.map(p => {
    if (p.id!==id) return p;
    const next: Record<string,"Solved"|"Attempted"|"Todo"> = { Todo:"Attempted", Attempted:"Solved", Solved:"Todo" };
    const s = next[p.status];
    return { ...p, status:s, solvedAt: s==="Solved" ? new Date().toISOString() : p.solvedAt };
  }));

  const markReviewed  = (id:number) => setProblems(problems.map(p => p.id===id ? {...p, lastReviewed:new Date().toISOString()} : p));
  const deleteProblem = (id:number) => setProblems(problems.filter(p => p.id!==id));

  // ── Sheet logic ───────────────────────────────────────────────────────────

  const sheetProblems = SHEETS[activeSheet].problems.map(p => ({ ...p, status: sheetStatus[p.id]||"Todo" }));
  const sheetFiltered = sheetProblems.filter(p => {
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterTopic !== "All" && p.topic !== filterTopic) return false;
    if (filterDiff !== "All" && p.difficulty !== filterDiff) return false;
    if (filterStatus !== "All" && (sheetStatus[p.id]||"Todo") !== filterStatus) return false;
    return true;
  });

  const cycleSheetStatus = (id:number) => {
    const next: Record<string,"Solved"|"Attempted"|"Todo"> = { Todo:"Attempted", Attempted:"Solved", Solved:"Todo" };
    setSheetStatus({ ...sheetStatus, [id]: next[sheetStatus[id]||"Todo"] });
  };

  const sheetSolved    = sheetProblems.filter(p => (sheetStatus[p.id]||"Todo")==="Solved").length;
  const sheetAttempted = sheetProblems.filter(p => (sheetStatus[p.id]||"Todo")==="Attempted").length;
  const topicProgress  = TOPICS.filter(t => t!=="All").map(topic => {
    const total  = sheetProblems.filter(p => p.topic===topic).length;
    const solved = sheetProblems.filter(p => p.topic===topic && (sheetStatus[p.id]||"Todo")==="Solved").length;
    return { topic, solved, total };
  }).filter(t => t.total>0).sort((a,b) => b.total-a.total).slice(0,8);

  // ── AI Hint (Groq) ────────────────────────────────────────────────────────

  const fetchHint = async (p:{id:number;name:string;topic:string;difficulty:string}) => {
    const key = `${p.id}`;
    if (expandedId===p.id) { setExpandedId(null); return; }
    setExpandedId(p.id);
    if (hints[key]) return;
    setHintLoading(prev => ({...prev,[key]:true}));
    const hint = await getAIHint(p.name, p.topic, p.difficulty);
    setHints(prev => ({...prev,[key]:hint}));
    setHintLoading(prev => ({...prev,[key]:false}));
  };

  const regenHint = async (p:{id:number;name:string;topic:string;difficulty:string}) => {
    const key = `${p.id}`;
    setHintLoading(prev => ({...prev,[key]:true}));
    const hint = await getAIHint(p.name, p.topic, p.difficulty);
    setHints(prev => ({...prev,[key]:hint}));
    setHintLoading(prev => ({...prev,[key]:false}));
  };

  // ── Filter Bar ────────────────────────────────────────────────────────────

  const FilterBar = ({ showPlatform=false }: { showPlatform?:boolean }) => (
    <div className="flex flex-wrap gap-2">
      <div className="flex items-center bg-card border border-border rounded-xl px-3 py-2 flex-1 min-w-[180px]">
        <Search className="w-4 h-4 text-muted-foreground mr-2 shrink-0" />
        <input value={search} onChange={e=>setSearch(e.target.value)}
          className="bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none text-sm w-full"
          placeholder="Search problems..." />
        {search && <button onClick={()=>setSearch("")}><X className="w-3 h-3 text-muted-foreground" /></button>}
      </div>
      {[
        { val:filterTopic,    set:setFilterTopic,    opts:TOPICS,   label:"All Topics" },
        { val:filterDiff,     set:setFilterDiff,     opts:DIFFS,    label:"All Difficulties" },
        { val:filterStatus,   set:setFilterStatus,   opts:["All","Todo","Attempted","Solved"], label:"All Status" },
        ...(showPlatform ? [{ val:filterPlatform, set:setFilterPlatform, opts:PLATFORMS, label:"All Platforms" }] : []),
      ].map(({val,set,opts,label}) => (
        <select key={label} value={val} onChange={e=>set(e.target.value)}
          className="bg-card border border-border rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none cursor-pointer">
          {opts.map(o => <option key={o} value={o}>{o==="All"?label:o}</option>)}
        </select>
      ))}
    </div>
  );

  // ── Hint Panel ────────────────────────────────────────────────────────────

  const HintPanel = ({ p }: { p:{id:number;name:string;topic:string;difficulty:string} }) => {
    const key = `${p.id}`;
    if (hintLoading[key]) return (
      <div className="space-y-1.5">
        {[80,65,50].map(w => <div key={w} className="h-3 bg-muted rounded animate-pulse" style={{width:`${w}%`}} />)}
      </div>
    );
    if (hints[key]) return (
      <div className="bg-primary/5 border border-primary/20 rounded-xl p-3">
        <div className="flex items-center gap-2 mb-1.5">
          <Lightbulb className="w-3.5 h-3.5 text-primary" />
          <span className="text-primary text-xs" style={{fontWeight:600}}>AI Hint</span>
          <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded ml-1">Groq</span>
          <button onClick={()=>regenHint(p)} className="ml-auto p-1 text-muted-foreground hover:text-primary cursor-pointer" title="Regenerate">
            <RefreshCw className="w-3 h-3" />
          </button>
          <button onClick={()=>setExpandedId(null)} className="p-1 text-muted-foreground hover:text-foreground cursor-pointer">
            <X className="w-3 h-3" />
          </button>
        </div>
        <p className="text-muted-foreground text-xs leading-relaxed whitespace-pre-line">{hints[key]}</p>
      </div>
    );
    return (
      <button onClick={()=>fetchHint(p)} className="text-xs text-primary hover:underline cursor-pointer flex items-center gap-1">
        <Lightbulb className="w-3 h-3" /> Get AI Hint
      </button>
    );
  };

  // ── Problem Row ───────────────────────────────────────────────────────────

  const ProblemRow = ({ id,name,url,difficulty,topic,platform,company,status,notes,solvedAt,lastReviewed,isSheet=false }: any) => {
    const dtr      = !isSheet ? daysUntilReview(solvedAt, lastReviewed) : 99;
    const due      = !isSheet && status==="Solved" && dtr===0;
    const expanded = expandedId===id;
    const p        = { id, name, topic, difficulty };

    return (
      <>
        <tr className={`border-b border-border last:border-0 hover:bg-muted/20 transition-colors ${due?"bg-yellow-500/5":""}`}>
          {/* Problem name */}
          <td className="px-4 py-3">
            <div className="flex items-center gap-2">
              {url
                ? <a href={url} target="_blank" rel="noopener noreferrer"
                    className="text-foreground text-sm hover:text-primary transition-colors flex items-center gap-1 group" style={{fontWeight:500}}>
                    {name}<ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-60 transition-opacity" />
                  </a>
                : <span className="text-foreground text-sm" style={{fontWeight:500}}>{name}</span>
              }
              {due && <span className="text-xs bg-yellow-500/20 text-yellow-400 px-1.5 py-0.5 rounded-full">Review</span>}
            </div>
          </td>
          {/* Difficulty */}
          <td className="px-4 py-3">
            <span className="px-2 py-0.5 rounded-full text-xs" style={{backgroundColor:`${diffColor[difficulty]||"#94a3b8"}15`,color:diffColor[difficulty]||"#94a3b8",fontWeight:600}}>
              {difficulty}
            </span>
          </td>
          {/* Topic */}
          <td className="px-4 py-3 text-muted-foreground text-sm hidden md:table-cell">{topic}</td>
          {/* Platform (personal) / Companies (sheet) */}
          {!isSheet && <td className="px-4 py-3 text-muted-foreground text-sm hidden sm:table-cell">{platform}</td>}
          {isSheet && (
            <td className="px-4 py-3 hidden sm:table-cell">
              <div className="flex flex-wrap gap-1">
                {company.split(",").slice(0,2).map((c:string) => (
                  <span key={c} className="text-xs bg-muted text-muted-foreground px-1.5 py-0.5 rounded">{c.trim()}</span>
                ))}
              </div>
            </td>
          )}
          {/* Status */}
          <td className="px-4 py-3">
            <button onClick={()=>isSheet?cycleSheetStatus(id):cycleStatus(id)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs cursor-pointer hover:opacity-80 transition-all"
              style={{backgroundColor:`${statColor[status]}15`,color:statColor[status],fontWeight:600}}>
              {status==="Solved"?<CheckCircle2 className="w-3 h-3"/>:status==="Attempted"?<AlertCircle className="w-3 h-3"/>:<Circle className="w-3 h-3"/>}
              {status}
            </button>
          </td>
          {/* Actions */}
          <td className="px-4 py-3">
            <div className="flex items-center gap-1">
              <button onClick={()=>fetchHint(p)}
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${expanded?"bg-primary/10 text-primary":"hover:bg-primary/10 text-muted-foreground hover:text-primary"}`} title="AI Hint (Groq)">
                <Lightbulb className="w-4 h-4" />
              </button>
              {!isSheet && status==="Solved" && due && (
                <button onClick={()=>markReviewed(id)} className="p-1.5 rounded-lg hover:bg-yellow-500/10 text-yellow-500 cursor-pointer" title="Mark reviewed">
                  <Clock className="w-4 h-4" />
                </button>
              )}
              {!isSheet && (
                <button onClick={()=>deleteProblem(id)} className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive cursor-pointer" title="Delete">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </td>
        </tr>

        {/* Expanded row */}
        {expanded && (
          <tr className="border-b border-border bg-muted/5">
            <td colSpan={isSheet?6:7} className="px-4 py-3">
              <div className="space-y-2">
                <HintPanel p={p} />
                {notes && (
                  <div className="text-muted-foreground text-xs bg-muted/40 rounded-xl p-2.5 font-mono leading-relaxed">{notes}</div>
                )}
                {!isSheet && status==="Solved" && (
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {dtr===0 ? "⚡ Due for review today!" : `Next review in ${dtr} day${dtr!==1?"s":""}`}
                  </div>
                )}
              </div>
            </td>
          </tr>
        )}
      </>
    );
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl text-foreground mb-1" style={{fontWeight:700}}>Question Tracker</h1>
          <p className="text-muted-foreground">Track your solved problems across platforms</p>
        </div>
        {tab==="personal" && (
          <button onClick={()=>setShowAdd(true)}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-xl hover:bg-primary/90 transition-all flex items-center gap-2 cursor-pointer self-start"
            style={{fontWeight:600}}>
            <Plus className="w-4 h-4" /> Add Problem
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-card border border-border rounded-xl p-1 w-fit">
        {[{key:"personal",label:"My Problems",icon:User},{key:"sheets",label:"Curated Sheets",icon:BookOpen}].map(({key,label,icon:Icon}) => (
          <button key={key} onClick={()=>setTab(key as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all cursor-pointer ${tab===key?"bg-primary text-primary-foreground":"text-muted-foreground hover:text-foreground"}`}
            style={{fontWeight:500}}>
            <Icon className="w-4 h-4" />{label}
          </button>
        ))}
      </div>

      {/* ══ PERSONAL TAB ══ */}
      {tab==="personal" && (
        <>
          {/* Review banner */}
          {dueForReview.length>0 && (
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-4 flex items-start gap-3">
              <Clock className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-foreground text-sm" style={{fontWeight:600}}>
                  {dueForReview.length} problem{dueForReview.length>1?"s":""} due for review today
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {dueForReview.slice(0,5).map(p => (
                    <span key={p.id} onClick={()=>markReviewed(p.id)}
                      className="text-xs bg-yellow-500/10 text-yellow-400 px-2 py-1 rounded-lg cursor-pointer hover:bg-yellow-500/20 transition-all">
                      {p.name} ✓
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label:"Solved",    count:problems.filter(p=>p.status==="Solved").length,    color:"#10b981" },
              { label:"Attempted", count:problems.filter(p=>p.status==="Attempted").length, color:"#f59e0b" },
              { label:"Todo",      count:problems.filter(p=>p.status==="Todo").length,      color:"#94a3b8" },
            ].map(s => (
              <div key={s.label} className="bg-card border border-border rounded-2xl p-4 text-center">
                <p className="text-xl" style={{fontWeight:700,color:s.color}}>{s.count}</p>
                <p className="text-muted-foreground text-xs mt-1">{s.label}</p>
              </div>
            ))}
          </div>

          <FilterBar showPlatform />

          {/* Add form */}
          {showAdd && (
            <div className="bg-card border border-border rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-foreground" style={{fontWeight:600}}>Add New Problem</h3>
                <button onClick={()=>setShowAdd(false)} className="text-muted-foreground hover:text-foreground cursor-pointer"><X className="w-5 h-5" /></button>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <input type="text" value={newProblem.name} onChange={e=>setNewProblem({...newProblem,name:e.target.value})}
                  className="bg-background border border-border rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="Problem name *" />
                <input type="url" value={newProblem.url} onChange={e=>setNewProblem({...newProblem,url:e.target.value})}
                  className="bg-background border border-border rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="Problem URL (optional)" />
                {[
                  {val:newProblem.platform,  key:"platform",  opts:PLATFORMS.filter(p=>p!=="All")},
                  {val:newProblem.difficulty, key:"difficulty", opts:DIFFS.filter(d=>d!=="All")},
                  {val:newProblem.topic,      key:"topic",      opts:TOPICS.filter(t=>t!=="All")},
                  {val:newProblem.company,    key:"company",    opts:COMPANIES.filter(c=>c!=="All")},
                ].map(({val,key,opts}) => (
                  <select key={key} value={val} onChange={e=>setNewProblem({...newProblem,[key]:e.target.value})}
                    className="bg-background border border-border rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none cursor-pointer">
                    {opts.map(o=><option key={o}>{o}</option>)}
                  </select>
                ))}
                <textarea value={newProblem.notes} onChange={e=>setNewProblem({...newProblem,notes:e.target.value})}
                  rows={2} placeholder="Notes (approach, complexity, etc.)"
                  className="bg-background border border-border rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 sm:col-span-2 resize-none" />
              </div>
              <button onClick={handleAdd}
                className="mt-3 bg-primary text-primary-foreground px-4 py-2 rounded-xl hover:bg-primary/90 transition-all text-sm cursor-pointer" style={{fontWeight:600}}>
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
                    {["Problem","Difficulty","Topic","Platform","Status","Actions"].map(h => (
                      <th key={h} className={`text-left text-muted-foreground text-xs px-4 py-3 uppercase tracking-wider ${h==="Topic"?"hidden md:table-cell":h==="Platform"?"hidden sm:table-cell":""}`} style={{fontWeight:600}}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>{filtered.map(p => <ProblemRow key={p.id} {...p} isSheet={false} />)}</tbody>
              </table>
            </div>
            {filtered.length===0 && <div className="text-center py-12 text-muted-foreground text-sm">No problems match your filters.</div>}
          </div>
        </>
      )}

      {/* ══ SHEETS TAB ══ */}
      {tab==="sheets" && (
        <>
          {/* Sheet selector + counters */}
          <div className="flex flex-wrap items-center gap-3">
            <SheetDropdown active={activeSheet} onChange={setActiveSheet} />
            <div className="flex gap-3">
              {[
                { label:"Solved",    count:sheetSolved,                                    color:"#10b981" },
                { label:"Attempted", count:sheetAttempted,                                 color:"#f59e0b" },
                { label:"Todo",      count:sheetProblems.length-sheetSolved-sheetAttempted,color:"#94a3b8" },
              ].map(s => (
                <div key={s.label} className="bg-card border border-border rounded-xl px-4 py-2 text-center">
                  <p className="text-lg" style={{fontWeight:700,color:s.color}}>{s.count}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Progress */}
          <div className="bg-card border border-border rounded-2xl p-5">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-foreground text-sm" style={{fontWeight:600}}>{SHEETS[activeSheet].label} — Overall Progress</h3>
              <span className="text-primary text-sm" style={{fontWeight:600}}>{Math.round((sheetSolved/sheetProblems.length)*100)}%</span>
            </div>
            <ProgressBar solved={sheetSolved} total={sheetProblems.length} />
            <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {topicProgress.map(t => (
                <div key={t.topic}>
                  <p className="text-xs text-muted-foreground mb-1 truncate">{t.topic}</p>
                  <ProgressBar solved={t.solved} total={t.total} color={t.solved===t.total&&t.total>0?"#10b981":"#3b82f6"} />
                </div>
              ))}
            </div>
          </div>

          <FilterBar />

          {/* Sheet table */}
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    {["Problem","Difficulty","Topic","Companies","Status","Hint"].map(h => (
                      <th key={h} className={`text-left text-muted-foreground text-xs px-4 py-3 uppercase tracking-wider ${h==="Topic"?"hidden md:table-cell":h==="Companies"?"hidden sm:table-cell":""}`} style={{fontWeight:600}}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sheetFiltered.map(p => <ProblemRow key={p.id} {...p} status={sheetStatus[p.id]||"Todo"} isSheet={true} />)}
                </tbody>
              </table>
            </div>
            {sheetFiltered.length===0 && <div className="text-center py-12 text-muted-foreground text-sm">No problems match your filters.</div>}
          </div>
        </>
      )}
    </div>
  );
}