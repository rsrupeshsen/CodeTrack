import { useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  Code2,
  Eye,
  EyeOff,
  Loader2,
  Mail,
  CheckCircle2,
  X,
} from "lucide-react";
import { signUp, signInWithGoogle } from "../../lib/auth";

function getPasswordStrength(pw: string): {
  label: string;
  color: string;
  width: string;
} {
  if (pw.length === 0) return { label: "", color: "", width: "0%" };
  if (pw.length < 6) return { label: "Weak", color: "#ef4444", width: "33%" };
  if (pw.length < 10)
    return { label: "Medium", color: "#f59e0b", width: "66%" };
  return { label: "Strong", color: "#10b981", width: "100%" };
}

// Terms & Privacy Modal Component
function TermsModal({
  isOpen,
  onClose,
  type,
}: {
  isOpen: boolean;
  onClose: () => void;
  type: "terms" | "privacy";
}) {
  if (!isOpen) return null;

  const content =
    type === "terms"
      ? {
          title: "Terms of Service",
          sections: [
            {
              heading: "1. Acceptance of Terms",
              text: "By accessing and using CodeFolio, you accept and agree to be bound by the terms and provision of this agreement.",
            },
            {
              heading: "2. Use License",
              text: "Permission is granted to temporarily use CodeFolio for personal, non-commercial use only. This is the grant of a license, not a transfer of title.",
            },
            {
              heading: "3. Account Responsibilities",
              text: "You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.",
            },
            {
              heading: "4. User Data",
              text: "You retain all rights to your coding statistics and profile data. We collect and display data from public platforms (LeetCode, GitHub, GeeksForGeeks) that you choose to connect.",
            },
            {
              heading: "5. Prohibited Uses",
              text: "You may not use CodeFolio for any illegal purpose, to violate any laws, or to infringe upon the rights of others.",
            },
            {
              heading: "6. Service Modifications",
              text: "We reserve the right to modify or discontinue the service at any time without notice. We shall not be liable to you or any third party for any modification, suspension, or discontinuance of the service.",
            },
            {
              heading: "7. Third-Party Services",
              text: "CodeFolio integrates with third-party platforms. We are not responsible for the content, privacy policies, or practices of any third-party sites or services.",
            },
          ],
        }
      : {
          title: "Privacy Policy",
          sections: [
            {
              heading: "1. Information We Collect",
              text: "We collect information you provide directly (email, name, profile data) and data from connected platforms (LeetCode, GitHub, GeeksForGeeks) with your permission.",
            },
            {
              heading: "2. How We Use Your Information",
              text: "We use your information to provide and improve our services, display your coding statistics, generate analytics, and communicate with you about your account.",
            },
            {
              heading: "3. Data Storage",
              text: "Your data is securely stored using Appwrite (Singapore servers). We implement industry-standard security measures to protect your information.",
            },
            {
              heading: "4. Third-Party API Access",
              text: "We fetch publicly available data from LeetCode, GitHub, and GeeksForGeeks APIs. We only access data that is already publicly visible on these platforms.",
            },
            {
              heading: "5. Cookies and Tracking",
              text: "We use cookies and similar technologies to maintain your session, remember your preferences, and analyze usage patterns.",
            },
            {
              heading: "6. Data Sharing",
              text: "We do not sell your personal data. We may share aggregated, anonymized data for analytics purposes. Your public profile is visible to others if you choose to share it.",
            },
            {
              heading: "7. Your Rights",
              text: "You have the right to access, update, or delete your personal data. You can disconnect platform integrations at any time from your settings.",
            },
            {
              heading: "8. Contact Us",
              text: "For privacy-related questions or requests, please contact us through the support section in your dashboard.",
            },
          ],
        };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-background border border-border rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-2xl font-bold text-foreground">
            {content.title}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-accent rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <p className="text-muted-foreground text-sm">
            Last updated: March 13, 2026
          </p>

          {content.sections.map((section, index) => (
            <div key={index}>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {section.heading}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {section.text}
              </p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border">
          <button
            onClick={onClose}
            className="w-full bg-primary text-primary-foreground py-3 rounded-xl hover:bg-primary/90 transition-all font-semibold"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
}

export function SignupPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [error, setError] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [signedUp, setSignedUp] = useState(false);

  // Modal states
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  const strength = getPasswordStrength(form.password);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!form.name.trim()) {
      setError("Full name is required");
      return;
    }
    if (!form.email.trim()) {
      setError("Email is required");
      return;
    }
    if (!form.password.trim()) {
      setError("Password is required");
      return;
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    if (form.password !== form.confirm) {
      setError("Passwords do not match");
      return;
    }
    if (!termsAccepted) {
      setError("You must accept the terms and conditions");
      return;
    }

    setIsLoading(true);
    try {
      // Enhanced debug logging
      console.log("🔍 Signup Debug Info:");
      console.log("📧 Email:", form.email);
      console.log("👤 Name:", form.name);
      console.log("🌐 Endpoint:", import.meta.env.VITE_APPWRITE_ENDPOINT);
      console.log("🆔 Project:", import.meta.env.VITE_APPWRITE_PROJECT_ID);
      console.log("🗄️ Database:", import.meta.env.VITE_APPWRITE_DB_ID);
      console.log("📅 Timestamp:", new Date().toISOString());
      console.log("🌍 User Agent:", navigator.userAgent);

      const result = await signUp(form.email, form.password, form.name);

      console.log("✅ Signup successful!");
      console.log("📄 Session:", result);
      setSignedUp(true);
    } catch (err: any) {
      console.error("❌ Signup Error - Full Details:");
      console.error("🔢 Error Code:", err?.code);
      console.error("🏷️ Error Type:", err?.type);
      console.error("📝 Error Message:", err?.message);
      console.error("📦 Error Response:", err?.response);
      console.error("🔍 Full Error Object:", JSON.stringify(err, null, 2));

      // Better error messages based on error type
      if (err?.code === 409 || err?.message?.includes("already exists")) {
        setError(
          "An account with this email already exists. Please try logging in instead.",
        );
      } else if (err?.code === 401) {
        setError(
          "Authentication failed. Please contact support if this persists.",
        );
      } else if (
        err?.type === "user_unauthorized" ||
        err?.message?.includes("unauthorized")
      ) {
        setError(
          "⚠️ Domain authorization error. The website domain may not be registered in Appwrite. Please contact support.",
        );
      } else if (
        err?.message?.includes("origin") ||
        err?.message?.includes("CORS")
      ) {
        setError(
          "⚠️ Cross-origin error. Please make sure you're accessing the site from the correct URL.",
        );
      } else if (err?.message?.includes("rate") || err?.code === 429) {
        setError(
          "Too many signup attempts. Please wait 15 minutes and try again.",
        );
      } else if (
        err?.message?.includes("network") ||
        err?.message?.includes("fetch")
      ) {
        setError(
          "Network error. Please check your internet connection and try again.",
        );
      } else if (err?.code === 500 || err?.code === 503) {
        setError(
          "Server error. Our backend service may be temporarily unavailable. Please try again in a few minutes.",
        );
      } else {
        setError(
          err?.message ||
            "Failed to create account. Please try again or contact support.",
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      console.log("🔍 Google OAuth initiated");
      await signInWithGoogle();
    } catch (err: any) {
      console.error("❌ Google signup error:", err);
      setError(err?.message || "Google sign up failed. Please try again.");
    }
  };

  // Post-signup screen
  if (signedUp) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="w-full max-w-md text-center">
          <div className="flex items-center gap-2 justify-center mb-10">
            <Code2 className="w-7 h-7 text-primary" />
            <span
              className="text-xl text-foreground"
              style={{ fontWeight: 700 }}
            >
              Code<span className="text-primary">Folio</span>
            </span>
          </div>
          <div className="bg-card border border-border rounded-2xl p-8">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <Mail className="w-8 h-8 text-primary" />
            </div>
            <h2
              className="text-2xl text-foreground mb-3"
              style={{ fontWeight: 700 }}
            >
              Check your email
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed mb-2">
              We sent a verification link to
            </p>
            <p className="text-foreground font-medium mb-5">{form.email}</p>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              Click the link in that email to verify your account, then you can
              start setting up your profile.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => navigate("/onboarding")}
                className="w-full bg-primary text-primary-foreground py-3 rounded-xl hover:bg-primary/90 transition-all flex items-center justify-center gap-2 cursor-pointer"
                style={{ fontWeight: 600 }}
              >
                <CheckCircle2 className="w-4 h-4" /> Continue to setup
              </button>
              <p className="text-muted-foreground text-xs">
                Didn't get the email?{" "}
                <Link
                  to="/verify-email"
                  className="text-primary hover:underline"
                >
                  Resend verification
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Signup form
  return (
    <>
      <div className="min-h-screen flex pt-16">
        <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary/20 to-teal-600/10 items-center justify-center p-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-background to-card" />
          <div className="relative z-10 max-w-md text-center">
            <Code2 className="w-16 h-16 text-primary mx-auto mb-8" />
            <h2
              className="text-3xl text-foreground mb-4"
              style={{ fontWeight: 700 }}
            >
              Join CodeFolio
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Create your developer portfolio in minutes. Connect your coding
              profiles and start tracking your progress.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {[
                "LeetCode",
                "GeeksForGeeks",
                "GitHub",
                "Analytics",
                "AI Assistant",
              ].map((tag) => (
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

        <div className="flex-1 flex items-center justify-center p-8 bg-background">
          <div className="w-full max-w-md">
            <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
              <Code2 className="w-7 h-7 text-primary" />
              <span
                className="text-xl text-foreground"
                style={{ fontWeight: 700 }}
              >
                Code<span className="text-primary">Folio</span>
              </span>
            </div>

            <h1
              className="text-2xl text-foreground mb-2"
              style={{ fontWeight: 700 }}
            >
              Create your account
            </h1>
            <p className="text-muted-foreground mb-8">
              Get started with your free CodeFolio account
            </p>

            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <label className="text-sm text-foreground mb-1.5 block">
                  Full Name
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-input-background border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="John Doe"
                  autoComplete="name"
                />
              </div>
              <div>
                <label className="text-sm text-foreground mb-1.5 block">
                  Email
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full bg-input-background border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </div>
              <div>
                <label className="text-sm text-foreground mb-1.5 block">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    className="w-full bg-input-background border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 pr-12"
                    placeholder="Create a password"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {form.password.length > 0 && (
                  <div className="mt-2">
                    <div className="w-full bg-muted rounded-full h-1.5">
                      <div
                        className="h-1.5 rounded-full transition-all duration-300"
                        style={{
                          width: strength.width,
                          backgroundColor: strength.color,
                        }}
                      />
                    </div>
                    <p
                      className="text-xs mt-1"
                      style={{ color: strength.color, fontWeight: 500 }}
                    >
                      {strength.label}
                    </p>
                  </div>
                )}
              </div>
              <div>
                <label className="text-sm text-foreground mb-1.5 block">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={form.confirm}
                  onChange={(e) =>
                    setForm({ ...form, confirm: e.target.value })
                  }
                  className="w-full bg-input-background border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="Confirm your password"
                  autoComplete="new-password"
                />
                {form.confirm.length > 0 && form.password !== form.confirm && (
                  <p className="text-xs text-destructive mt-1">
                    Passwords don't match
                  </p>
                )}
              </div>

              {/* Terms & Conditions - NOW WITH WORKING MODALS */}
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-border accent-primary cursor-pointer"
                />
                <span className="text-sm text-muted-foreground">
                  I agree to the{" "}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowTerms(true);
                    }}
                    className="text-primary hover:underline cursor-pointer font-medium"
                  >
                    Terms of Service
                  </button>{" "}
                  and{" "}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowPrivacy(true);
                    }}
                    className="text-primary hover:underline cursor-pointer font-medium"
                  >
                    Privacy Policy
                  </button>
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
                className="w-full bg-primary text-primary-foreground py-3 rounded-xl hover:bg-primary/90 transition-all cursor-pointer disabled:opacity-70 flex items-center justify-center gap-2 mt-2"
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
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Sign up with Google
            </button>

            <p className="text-center text-muted-foreground text-sm mt-6">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-primary hover:underline"
                style={{ fontWeight: 500 }}
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Modals */}
      <TermsModal
        isOpen={showTerms}
        onClose={() => setShowTerms(false)}
        type="terms"
      />
      <TermsModal
        isOpen={showPrivacy}
        onClose={() => setShowPrivacy(false)}
        type="privacy"
      />
    </>
  );
}
