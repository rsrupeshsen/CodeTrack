import { useState, useEffect, type FormEvent } from "react";
import { useNavigate, useSearchParams, Link } from "react-router";
import { Code2, Lock, Eye, EyeOff, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { confirmPasswordReset } from "../../lib/auth";

function getPasswordStrength(pw: string): { label: string; color: string; width: string } {
  if (pw.length === 0)  return { label: "",       color: "",         width: "0%"   };
  if (pw.length < 6)   return { label: "Weak",   color: "#ef4444",  width: "33%"  };
  if (pw.length < 10)  return { label: "Medium", color: "#f59e0b",  width: "66%"  };
  return                      { label: "Strong", color: "#10b981",  width: "100%" };
}

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const userId = searchParams.get("userId") || "";
  const secret = searchParams.get("secret") || "";

  const [password, setPassword]         = useState("");
  const [confirm, setConfirm]           = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setLoading]         = useState(false);
  const [done, setDone]                 = useState(false);
  const [error, setError]               = useState("");
  const [invalidLink, setInvalidLink]   = useState(false);

  const strength = getPasswordStrength(password);

  useEffect(() => {
    // If URL is missing required params, show invalid state immediately
    if (!userId || !secret) {
      setInvalidLink(true);
    }
  }, [userId, secret]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 8)         { setError("Password must be at least 8 characters"); return; }
    if (password !== confirm)         { setError("Passwords do not match"); return; }

    setLoading(true);
    try {
      await confirmPasswordReset(userId, secret, password);
      setDone(true);
      // Auto-redirect to login after 3 seconds
      setTimeout(() => navigate("/login"), 3000);
    } catch (err: any) {
      console.error("Reset error:", err);
      if (err?.code === 401 || err?.message?.toLowerCase().includes("invalid")) {
        setInvalidLink(true);
      } else {
        setError(err?.message || "Failed to reset password. The link may have expired.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="flex items-center gap-2 justify-center mb-10">
          <Code2 className="w-7 h-7 text-primary" />
          <span className="text-xl text-foreground" style={{ fontWeight: 700 }}>
            Code<span className="text-primary">Folio</span>
          </span>
        </div>

        <div className="bg-card border border-border rounded-2xl p-8">

          {/* Invalid / Expired Link */}
          {invalidLink ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-destructive/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <XCircle className="w-8 h-8 text-destructive" />
              </div>
              <h2 className="text-xl text-foreground mb-3" style={{ fontWeight: 700 }}>
                Link expired or invalid
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                This password reset link has expired or is invalid. Reset links are valid for 1 hour.
              </p>
              <Link
                to="/forgot-password"
                className="bg-primary text-primary-foreground px-6 py-2.5 rounded-xl hover:bg-primary/90 transition-all text-sm inline-block"
                style={{ fontWeight: 600 }}
              >
                Request a new link
              </Link>
            </div>

          /* Success State */
          ) : done ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-green-500/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <CheckCircle2 className="w-8 h-8 text-green-500" />
              </div>
              <h2 className="text-xl text-foreground mb-3" style={{ fontWeight: 700 }}>
                Password updated!
              </h2>
              <p className="text-muted-foreground text-sm mb-4">
                Your password has been reset successfully. Redirecting you to login...
              </p>
              <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
            </div>

          /* Reset Form */
          ) : (
            <>
              <div className="mb-6">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <Lock className="w-6 h-6 text-primary" />
                </div>
                <h1 className="text-2xl text-foreground mb-2" style={{ fontWeight: 700 }}>
                  Set new password
                </h1>
                <p className="text-muted-foreground text-sm">
                  Choose a strong password you haven't used before.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm text-foreground mb-1.5 block">New Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-input-background border border-border rounded-xl px-4 py-3 pr-12 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                      placeholder="Min. 8 characters"
                      autoFocus
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {password.length > 0 && (
                    <div className="mt-2">
                      <div className="w-full bg-muted rounded-full h-1.5">
                        <div
                          className="h-1.5 rounded-full transition-all duration-300"
                          style={{ width: strength.width, backgroundColor: strength.color }}
                        />
                      </div>
                      <p className="text-xs mt-1" style={{ color: strength.color, fontWeight: 500 }}>
                        {strength.label}
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-sm text-foreground mb-1.5 block">Confirm Password</label>
                  <input
                    type="password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    className="w-full bg-input-background border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    placeholder="Repeat your password"
                    autoComplete="new-password"
                  />
                  {confirm.length > 0 && password !== confirm && (
                    <p className="text-xs text-destructive mt-1">Passwords don't match</p>
                  )}
                </div>

                {error && (
                  <div className="bg-destructive/10 border border-destructive/30 text-destructive rounded-xl px-4 py-3 text-sm">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading || password.length < 8 || password !== confirm}
                  className="w-full bg-primary text-primary-foreground py-3 rounded-xl hover:bg-primary/90 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                  style={{ fontWeight: 600 }}
                >
                  {isLoading
                    ? <><Loader2 className="w-4 h-4 animate-spin" /> Updating...</>
                    : "Reset Password"
                  }
                </button>
              </form>
            </>
          )}

          <div className="mt-6 pt-6 border-t border-border text-center">
            <Link
              to="/login"
              className="text-muted-foreground text-sm hover:text-foreground transition-colors"
            >
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}