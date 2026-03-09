import React from "react";

import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Code2, Eye, EyeOff, Loader2 } from "lucide-react";
import { signUp, signInWithGoogle } from "../../lib/auth";

function getPasswordStrength(pw: string): { label: string; color: string; width: string } {
  if (pw.length === 0) return { label: "", color: "", width: "0%" };
  if (pw.length < 6) return { label: "Weak", color: "#ef4444", width: "33%" };
  if (pw.length < 10) return { label: "Medium", color: "#f59e0b", width: "66%" };
  return { label: "Strong", color: "#10b981", width: "100%" };
}

export function SignupPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const strength = getPasswordStrength(form.password);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.name.trim()) { setError("Full name is required"); return; }
    if (!form.email.trim()) { setError("Email is required"); return; }
    if (!form.password.trim()) { setError("Password is required"); return; }
    if (form.password.length < 8) { setError("Password must be at least 8 characters"); return; }
    if (form.password !== form.confirm) { setError("Passwords do not match"); return; }
    if (!termsAccepted) { setError("You must accept the terms and conditions"); return; }

    setIsLoading(true);
    try {
      await signUp(form.email, form.password, form.name);
      navigate("/onboarding");
    } catch (err: any) {
      console.error("Signup error:", err);
      if (err?.code === 409 || err?.message?.includes("already exists")) {
        setError("An account with this email already exists. Try logging in.");
      } else {
        setError(err?.message || "Failed to create account. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      await signInWithGoogle();
    } catch (err: any) {
      console.error("Google signup error:", err);
      setError(err?.message || "Google sign up failed. Please try again.");
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
            Join CodeFolio
          </h2>
          <p className="text-muted-foreground text-lg mb-8">
            Create your developer portfolio in minutes. Connect your coding profiles and start
            tracking your progress.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {["LeetCode", "CodeChef", "GitHub", "Analytics", "AI Assistant"].map((tag) => (
              <span
                key={tag}
                className="bg-primary/10 border border-primary/20 text-primary px-3 py-1 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <Code2 className="w-7 h-7 text-primary" />
            <span className="text-xl text-foreground" style={{ fontWeight: 700 }}>
              Code<span className="text-primary">Folio</span>
            </span>
          </div>

          <h1 className="text-2xl text-foreground mb-2" style={{ fontWeight: 700 }}>
            Create your account
          </h1>
          <p className="text-muted-foreground mb-8">
            Get started with your free CodeFolio account
          </p>

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="text-sm text-foreground mb-1.5 block">Full Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-input-background border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="text-sm text-foreground mb-1.5 block">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-input-background border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="text-sm text-foreground mb-1.5 block">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full bg-input-background border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 pr-12"
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {/* Password Strength Indicator */}
              {form.password.length > 0 && (
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
                value={form.confirm}
                onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                className="w-full bg-input-background border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Confirm your password"
              />
            </div>

            {/* Terms Checkbox */}
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-border accent-primary cursor-pointer"
              />
              <span className="text-sm text-muted-foreground">
                I agree to the{" "}
                <span className="text-primary hover:underline cursor-pointer">Terms of Service</span>{" "}
                and{" "}
                <span className="text-primary hover:underline cursor-pointer">Privacy Policy</span>
              </span>
            </label>

            {error && (
              <div className="bg-destructive/10 border border-destructive/30 text-destructive rounded-xl px-4 py-3 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !termsAccepted}
              className="w-full bg-primary text-primary-foreground py-3 rounded-xl hover:bg-primary/90 transition-all cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
              style={{ fontWeight: 600 }}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-border" />
            <span className="text-muted-foreground text-sm">or</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <button
            onClick={handleGoogleSignup}
            className="w-full border border-border text-foreground py-3 rounded-xl hover:bg-card transition-all flex items-center justify-center gap-3 cursor-pointer"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Sign up with Google
          </button>

          <p className="text-center text-muted-foreground text-sm mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline" style={{ fontWeight: 500 }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}