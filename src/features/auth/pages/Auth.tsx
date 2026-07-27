import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Compass, Mail, Lock, Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/features/auth/context/AuthContext";

export function AuthPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnTo = searchParams.get("returnTo") || "/tours";
  const { signIn, signUp, isAuthenticated } = useAuth();

  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (isAuthenticated) {
    navigate(returnTo, { replace: true });
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (mode === "register") {
        await signUp(name || "Traveler", email, password);
      } else {
        await signIn(email, password);
      }
      navigate(returnTo, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20">
      <div className="absolute inset-0 bg-gradient-to-br from-surface via-surface-light to-surface" />
      <div className="absolute top-1/4 left-1/3 w-64 h-64 bg-primary/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-accent/10 rounded-full blur-[80px]" />

      <div className="relative z-10 w-full max-w-md mx-4">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-2">
            <Compass className="w-8 h-8 text-accent" />
            <span className="text-2xl font-bold">Travel<span className="text-accent">Log</span></span>
          </div>
          <p className="text-text-secondary text-sm">
            {mode === "login"
              ? "Welcome back! Sign in to continue your journey."
              : "Create an account and start exploring."}
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-surface-light/40 backdrop-blur-xl rounded-2xl border border-border-light p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            <AnimatePresence mode="wait">
              {mode === "register" && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="space-y-2">
                  <label className="text-sm font-medium text-text-secondary">Full Name</label>
                  <Input placeholder="Enter your name" value={name} onChange={(e) => setName(e.target.value)} />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <label className="text-sm font-medium text-text-secondary">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <Input type="email" placeholder="Enter your email" className="pl-10" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-text-secondary">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <Input type={showPassword ? "text" : "password"} placeholder="Enter your password" className="pl-10 pr-10"
                  value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                className="text-sm text-error bg-error/10 rounded-lg px-4 py-2">{error}</motion.p>
            )}

            <Button type="submit" size="lg" className="w-full gap-2" disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
              {mode === "login" ? "Sign In" : "Create Account"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-text-muted">
              {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
              <button onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }}
                className="text-accent hover:text-accent-light font-medium transition-colors">
                {mode === "login" ? "Sign Up" : "Sign In"}
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
