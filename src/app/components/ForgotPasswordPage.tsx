import { useState, type FormEvent } from "react";
import { Link } from "react-router";
import { Code2, Mail, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";
import { sendPasswordReset } from "../../lib/auth";

export function ForgotPasswordPage() {
  const [email, setEmail]       = useState("");
  const [isLoading, setLoading] = useState(false);
  const [sent, setSent]         = useState(false);
  const [error, setError]       = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email.trim()) { setError("Email is required"); return; }

    setLoading(true);
    try {
      await sendPasswordReset(email.trim());
      setSent(true);
    } catch (err: any) {
      // Don't reveal whether email exists — always show success for security
      // but log the real error for debugging
      console.error("Password reset error:", err);
      setSent(true); // show success regardless to prevent email enumeration
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

          {!sent ? (
            <>
              {/* Header */}
              <div className="mb-6">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <h1 className="text-2xl text-foreground mb-2" style={{ fontWeight: 700 }}>
                  Forgot your password?
                </h1>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  No worries. Enter your email and we'll send you a link to reset your password.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm text-foreground mb-1.5 block">Email address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-input-background border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    placeholder="you@example.com"
                    autoFocus
                    autoComplete="email"
                  />
                </div>

                {error && (
                  <div className="bg-destructive/10 border border-destructive/30 text-destructive rounded-xl px-4 py-3 text-sm">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary text-primary-foreground py-3 rounded-xl hover:bg-primary/90 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                  style={{ fontWeight: 600 }}
                >
                  {isLoading
                    ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</>
                    : "Send Reset Link"
                  }
                </button>
              </form>
            </>
          ) : (
            /* Success State */
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-green-500/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <CheckCircle2 className="w-8 h-8 text-green-500" />
              </div>
              <h2 className="text-xl text-foreground mb-3" style={{ fontWeight: 700 }}>
                Check your inbox
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                If an account exists for <span className="text-foreground font-medium">{email}</span>,
                you'll receive a password reset link shortly. Check your spam folder if you don't see it.
              </p>
              <button
                onClick={() => { setSent(false); setEmail(""); }}
                className="text-primary text-sm hover:underline cursor-pointer"
                style={{ fontWeight: 500 }}
              >
                Try a different email
              </button>
            </div>
          )}

          {/* Back to login */}
          <div className="mt-6 pt-6 border-t border-border text-center">
            <Link
              to="/login"
              className="text-muted-foreground text-sm hover:text-foreground transition-colors inline-flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}