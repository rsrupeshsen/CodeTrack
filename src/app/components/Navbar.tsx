import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import { Menu, X, Code2 } from "lucide-react";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const navRef = useRef<HTMLElement>(null);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setMobileOpen(false);
      }
    };

    if (mobileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      // Prevent body scroll when menu is open
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [mobileOpen]);

  // Close mobile menu when pressing Escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
      }
    };

    if (mobileOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [mobileOpen]);

  const handleLinkClick = (path: string) => {
    setMobileOpen(false);
    navigate(path);
  };

  const scrollToSection = (sectionId: string) => {
    setMobileOpen(false);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <>
      <nav
        ref={navRef}
        className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              onClick={() => setMobileOpen(false)}
            >
              <Code2 className="w-7 h-7 text-primary" />
              <span
                className="text-xl text-foreground"
                style={{ fontWeight: 700 }}
              >
                Code<span className="text-primary">Folio</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <button
                onClick={() => scrollToSection("features")}
                className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
              >
                Features
              </button>
              <button
                onClick={() => handleLinkClick("/demo")}
                className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
              >
                Demo
              </button>
              <button
                onClick={() => handleLinkClick("/login")}
                className="text-muted-foreground hover:text-foreground transition-colors text-sm cursor-pointer font-medium"
              >
                Login
              </button>
              <button
                onClick={() => handleLinkClick("/signup")}
                className="bg-primary text-primary-foreground px-5 py-2.5 rounded-lg hover:bg-primary/90 transition-all text-sm cursor-pointer font-semibold shadow-sm hover:shadow-md"
              >
                Sign Up
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-foreground cursor-pointer p-2 hover:bg-accent rounded-lg transition-colors active:scale-95"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`md:hidden bg-background border-t border-border transition-all duration-200 ease-in-out ${
            mobileOpen
              ? "max-h-screen opacity-100"
              : "max-h-0 opacity-0 overflow-hidden"
          }`}
        >
          <div className="px-4 py-4 space-y-2">
            <button
              onClick={() => scrollToSection("features")}
              className="block w-full text-left text-muted-foreground hover:text-foreground hover:bg-accent px-4 py-3 rounded-lg text-sm transition-colors font-medium"
            >
              Features
            </button>
            <button
              onClick={() => handleLinkClick("/demo")}
              className="block w-full text-left text-muted-foreground hover:text-foreground hover:bg-accent px-4 py-3 rounded-lg text-sm transition-colors font-medium"
            >
              Demo
            </button>
            <button
              onClick={() => handleLinkClick("/login")}
              className="block w-full text-left text-muted-foreground hover:text-foreground hover:bg-accent px-4 py-3 rounded-lg text-sm cursor-pointer transition-colors font-medium"
            >
              Login
            </button>
            <button
              onClick={() => handleLinkClick("/signup")}
              className="block w-full bg-primary text-primary-foreground px-4 py-3 rounded-lg text-sm cursor-pointer font-semibold hover:bg-primary/90 transition-all shadow-sm"
            >
              Sign Up
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/20 z-40 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
}
