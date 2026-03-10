import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router";
import { Eye, EyeOff, Code2, Github, ArrowRight } from "lucide-react";
import { signIn, signInWithGoogle, getUser } from "../../lib/auth";
import { useUser } from "./UserContext";

export function LoginPage() {
  const navigate = useNavigate();
  const { reloadUser } = useUser();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) { setError("Email is required"); return; }
    if (!password.trim()) { setError("Password is required"); return; }

    setIsLoading(true);
    try {
      // If session already active, reload user data and go to dashboard
      const existing = await getUser();
      if (existing) {
        await reloadUser();
        navigate("/dashboard");
        return;
      }

      await signIn(email, password);

      // ✅ FIX: Call reloadUser() after signIn so UserContext fetches the
      // profile from Appwrite immediately. Without this, the useEffect in
      // UserProvider only ran once on mount (before login), so userId stayed
      // null and the dashboard showed blank data until a hard refresh.
      await reloadUser();

      navigate("/dashboard");
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err?.message || "Invalid email or password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (err: any) {
      console.error("Google login error:", err);
      setError(err?.message || "Google login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex pt-16">
      {/* Left Side */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary/20 to-teal-600/10 items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background to-card" />
        <div className="relative z-10 max-w-md text-center">
          <Code2 className="w-16 h-16 text-primary mx-auto mb-8" />
          <h2 className="text-3xl text-foreground mb-4" style={{ fontWeight: 700 }}>
            Welcome back to CodeFolio
          </h2>
          <p className="text-muted-foreground text-lg mb-8">
            Track your coding progress across platforms and showcase your developer journey.
          </p>
          <div className="grid grid-cols-3 gap-4">
            {[
              { val: "1,247", label: "Problems" },
              { val: "1,856", label: "Rating" },
              { val: "42",    label: "Repos" },
            ].map((s) => (
              <div key={s.label} className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-3">
                <p className="text-primary text-xl" style={{ fontWeight: 700 }}>{s.val}</p>
                <p className="text-muted-foreground text-xs">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side — Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <Code2 className="w-7 h-7 text-primary" />
            <span className="text-xl text-foreground" style={{ fontWeight: 700 }}>
              Code<span className="text-primary">Folio</span>
            </span>
          </div>

          <h1 className="text-2xl text-foreground mb-2" style={{ fontWeight: 700 }}>Sign in</h1>
          <p className="text-muted-foreground mb-8">
            Don't have an account?{" "}
            <Link to="/signup" className="text-primary hover:underline" style={{ fontWeight: 500 }}>
              Sign up free
            </Link>
          </p>

          {/* Google Login */}
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 border border-border rounded-xl py-3 text-foreground hover:bg-card transition-all mb-6 cursor-pointer"
            style={{ fontWeight: 500 }}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-border" />
            <span className="text-muted-foreground text-sm">or</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="bg-destructive/10 border border-destructive/30 text-destructive text-sm rounded-xl px-4 py-3">
                {error}
              </div>
            )}

            <div>
              <label className="text-sm text-foreground mb-1.5 block">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-input-background border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="you@example.com"
                autoComplete="email"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm text-foreground">Password</label>
                <a href="#" className="text-xs text-primary hover:underline">Forgot password?</a>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-input-background border border-border rounded-xl px-4 py-3 pr-12 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="Your password"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-primary-foreground py-3 rounded-xl hover:bg-primary/90 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
              style={{ fontWeight: 600 }}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              ) : (
                <> Sign In <ArrowRight className="w-4 h-4" /> </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}