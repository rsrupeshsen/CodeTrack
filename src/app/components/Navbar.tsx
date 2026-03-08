import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Menu, X, Code2 } from "lucide-react";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <Code2 className="w-7 h-7 text-primary" />
            <span className="text-xl text-foreground" style={{ fontWeight: 700 }}>
              Code<span className="text-primary">Folio</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
              Features
            </a>
            <a href="#trusted" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
              Community
            </a>
            <button
              onClick={() => navigate("/login")}
              className="text-muted-foreground hover:text-foreground transition-colors text-sm cursor-pointer"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors text-sm cursor-pointer"
            >
              Sign Up
            </button>
          </div>

          <button
            className="md:hidden text-foreground cursor-pointer"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-background border-t border-border">
          <div className="px-4 py-4 space-y-3">
            <a href="#features" className="block text-muted-foreground hover:text-foreground text-sm">
              Features
            </a>
            <a href="#trusted" className="block text-muted-foreground hover:text-foreground text-sm">
              Community
            </a>
            <button
              onClick={() => { navigate("/login"); setMobileOpen(false); }}
              className="block text-muted-foreground hover:text-foreground text-sm cursor-pointer"
            >
              Login
            </button>
            <button
              onClick={() => { navigate("/signup"); setMobileOpen(false); }}
              className="block bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm cursor-pointer"
            >
              Sign Up
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
