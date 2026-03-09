import { useEffect } from "react";
import { useNavigate } from "react-router";
import { Loader2 } from "lucide-react";
import { getUser } from "../../lib/auth";

export function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    getUser().then(user => {
      if (user) navigate("/dashboard");
      else navigate("/login");
    });
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
      <Loader2 className="w-8 h-8 text-primary animate-spin" />
      <p className="text-muted-foreground text-sm">Signing you in...</p>
    </div>
  );
}