import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router";
import { Code2, Loader2, CheckCircle2, XCircle, Mail } from "lucide-react";
import { confirmVerification, sendVerificationEmail, getUser } from "../../lib/auth";

export function VerifyEmailPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const userId = searchParams.get("userId") || "";
  const secret = searchParams.get("secret") || "";

  const [status, setStatus] = useState<"loading" | "success" | "error" | "resend">("loading");
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSent, setResendSent]       = useState(false);
  const [errorMsg, setErrorMsg]           = useState("");

  useEffect(() => {
    const verify = async () => {
      // No params = user landed here without clicking a link (e.g. direct nav)
      if (!userId || !secret) {
        setStatus("resend");
        return;
      }

      try {
        await confirmVerification(userId, secret);
        setStatus("success");
        // Redirect to dashboard after 3 seconds
        setTimeout(() => navigate("/dashboard"), 3000);
      } catch (err: any) {
        console.error("Verification error:", err);
        setErrorMsg(err?.message || "Verification failed. The link may have expired.");
        setStatus("error");
      }
    };

    verify();
  }, [userId, secret]);

  const handleResend = async () => {
    setResendLoading(true);
    try {
      const user = await getUser();
      if (!user) {
        navigate("/login");
        return;
      }
      await sendVerificationEmail();
      setResendSent(true);
    } catch (err: any) {
      console.error("Resend error:", err);
      setErrorMsg("Couldn't resend email. Please try again.");
    } finally {
      setResendLoading(false);
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

        <div className="bg-card border border-border rounded-2xl p-8 text-center">

          {/* Loading */}
          {status === "loading" && (
            <>
              <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-5" />
              <h2 className="text-xl text-foreground mb-2" style={{ fontWeight: 700 }}>
                Verifying your email...
              </h2>
              <p className="text-muted-foreground text-sm">Just a moment.</p>
            </>
          )}

          {/* Success */}
          {status === "success" && (
            <>
              <div className="w-16 h-16 bg-green-500/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <CheckCircle2 className="w-8 h-8 text-green-500" />
              </div>
              <h2 className="text-xl text-foreground mb-3" style={{ fontWeight: 700 }}>
                Email verified!
              </h2>
              <p className="text-muted-foreground text-sm mb-4">
                Your email has been confirmed. Taking you to your dashboard...
              </p>
              <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
            </>
          )}

          {/* Error */}
          {status === "error" && (
            <>
              <div className="w-16 h-16 bg-destructive/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <XCircle className="w-8 h-8 text-destructive" />
              </div>
              <h2 className="text-xl text-foreground mb-3" style={{ fontWeight: 700 }}>
                Verification failed
              </h2>
              <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                {errorMsg || "This link has expired or is invalid. Verification links expire after 1 hour."}
              </p>
              {!resendSent ? (
                <button
                  onClick={handleResend}
                  disabled={resendLoading}
                  className="bg-primary text-primary-foreground px-6 py-2.5 rounded-xl hover:bg-primary/90 transition-all text-sm flex items-center gap-2 mx-auto cursor-pointer disabled:opacity-70"
                  style={{ fontWeight: 600 }}
                >
                  {resendLoading
                    ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</>
                    : <><Mail className="w-4 h-4" /> Resend verification email</>
                  }
                </button>
              ) : (
                <p className="text-green-500 text-sm" style={{ fontWeight: 500 }}>
                  ✓ New verification email sent — check your inbox
                </p>
              )}
            </>
          )}

          {/* No params — prompt user to check email or resend */}
          {status === "resend" && (
            <>
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <Mail className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-xl text-foreground mb-3" style={{ fontWeight: 700 }}>
                Verify your email
              </h2>
              <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                We sent a verification link to your email when you signed up.
                Click the link in that email to activate your account.
              </p>
              {!resendSent ? (
                <button
                  onClick={handleResend}
                  disabled={resendLoading}
                  className="bg-primary text-primary-foreground px-6 py-2.5 rounded-xl hover:bg-primary/90 transition-all text-sm flex items-center gap-2 mx-auto cursor-pointer disabled:opacity-70"
                  style={{ fontWeight: 600 }}
                >
                  {resendLoading
                    ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</>
                    : <><Mail className="w-4 h-4" /> Resend verification email</>
                  }
                </button>
              ) : (
                <p className="text-green-500 text-sm" style={{ fontWeight: 500 }}>
                  ✓ Sent! Check your inbox (and spam folder)
                </p>
              )}
            </>
          )}

          <div className="mt-8 pt-6 border-t border-border">
            <Link
              to="/dashboard"
              className="text-muted-foreground text-sm hover:text-foreground transition-colors"
            >
              Skip for now → Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}