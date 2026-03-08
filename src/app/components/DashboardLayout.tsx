import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router";
import {
  LayoutDashboard,
  BarChart3,
  Trophy,
  ListChecks,
  Bot,
  User,
  Settings,
  Search,
  Bell,
  Code2,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { useUser } from "./UserContext";

const navItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard", end: true },
  { to: "/dashboard/analytics", icon: BarChart3, label: "Analytics" },
  { to: "/dashboard/contests", icon: Trophy, label: "Contest Tracker" },
  { to: "/dashboard/questions", icon: ListChecks, label: "Question Tracker" },
  { to: "/dashboard/ai", icon: Bot, label: "AI Assistant" },
  { to: "/dashboard/profile", icon: User, label: "Profile" },
  { to: "/dashboard/settings", icon: Settings, label: "Settings" },
];

export function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { user } = useUser();

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const SidebarContent = () => (
    <>
      <div className="flex items-center gap-2 px-5 py-5">
        <Code2 className="w-7 h-7 text-primary" />
        <span className="text-lg text-foreground" style={{ fontWeight: 700 }}>
          Code<span className="text-primary">Folio</span>
        </span>
      </div>

      <nav className="flex-1 px-3 py-2 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-card"
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span style={{ fontWeight: 500 }}>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-3">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-card transition-all w-full cursor-pointer"
        >
          <LogOut className="w-5 h-5" />
          <span style={{ fontWeight: 500 }}>Log Out</span>
        </button>
      </div>
    </>
  );

  return (
    <div className="h-screen flex bg-background overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-border bg-sidebar shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <aside className="relative w-64 h-full bg-sidebar border-r border-border flex flex-col">
            <button
              className="absolute right-3 top-5 text-muted-foreground cursor-pointer"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Bar */}
        <header className="h-16 border-b border-border flex items-center justify-between px-4 lg:px-6 bg-background shrink-0">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden text-foreground cursor-pointer"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="hidden sm:flex items-center bg-card border border-border rounded-xl px-3 py-2 w-64">
              <Search className="w-4 h-4 text-muted-foreground mr-2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none text-sm w-full"
                placeholder="Search..."
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full" />
            </button>
            <div className="flex items-center gap-2 cursor-pointer">
              <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                <span className="text-primary text-sm" style={{ fontWeight: 600 }}>{initials}</span>
              </div>
              <span className="hidden sm:block text-sm text-foreground" style={{ fontWeight: 500 }}>
                {user.name}
              </span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
