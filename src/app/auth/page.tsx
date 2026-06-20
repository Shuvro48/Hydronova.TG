"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useHydronova } from "@/store/hydronova";
import { t } from "@/lib/i18n/translations";
import { getSupabase } from "@/lib/auth/supabase";

type AuthMode = "signin" | "signup" | "reset";

// ─── Starry Night animated canvas background ────────────────────────────────
function StarryNightBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = (canvas.width = window.innerWidth);
    let H = (canvas.height = window.innerHeight);

    const stars = Array.from({ length: 90 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H * 0.65,
      r: Math.random() * 2 + 0.5,
      phase: Math.random() * Math.PI * 2,
      speed: 0.02 + Math.random() * 0.03,
    }));

    const swirls = Array.from({ length: 4 }, (_, i) => ({
      cx: W * (0.2 + i * 0.22),
      cy: H * (0.18 + (i % 2) * 0.12),
      r: 50 + i * 18,
      rot: Math.random() * Math.PI * 2,
      speed: 0.0008 + i * 0.0003,
    }));

    let raf: number;
    let t = 0;

    function drawSwirl(cx: number, cy: number, r: number, rot: number) {
      ctx!.save();
      ctx!.translate(cx, cy);
      ctx!.rotate(rot);
      for (let i = 0; i < 3; i++) {
        ctx!.beginPath();
        const spiralR = r - i * 12;
        for (let a = 0; a < Math.PI * 4; a += 0.1) {
          const rr = spiralR * (1 - a / (Math.PI * 4)) * 0.7;
          const x = Math.cos(a * 2) * rr;
          const y = Math.sin(a * 2) * rr;
          if (a === 0) ctx!.moveTo(x, y);
          else ctx!.lineTo(x, y);
        }
        ctx!.strokeStyle = `rgba(79, 195, 247, ${0.12 - i * 0.03})`;
        ctx!.lineWidth = 2;
        ctx!.stroke();
      }
      ctx!.restore();
    }

    function loop() {
      t += 1;
      ctx!.clearRect(0, 0, W, H);

      // Sky gradient
      const skyGrad = ctx!.createLinearGradient(0, 0, 0, H);
      skyGrad.addColorStop(0, "#0a0f2e");
      skyGrad.addColorStop(0.5, "#0d1b4b");
      skyGrad.addColorStop(0.75, "#162354");
      skyGrad.addColorStop(1, "#0a1a0a");
      ctx!.fillStyle = skyGrad;
      ctx!.fillRect(0, 0, W, H);

      // Swirls
      swirls.forEach((s) => {
        s.rot += s.speed;
        drawSwirl(s.cx, s.cy, s.r, s.rot);
      });

      // Stars
      stars.forEach((s) => {
        const twinkle = 0.5 + 0.5 * Math.sin(t * s.speed + s.phase);
        ctx!.beginPath();
        ctx!.arc(s.x, s.y, s.r * (0.7 + twinkle * 0.5), 0, Math.PI * 2);
        const glowGrad = ctx!.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 4);
        glowGrad.addColorStop(0, `rgba(251, 191, 36, ${0.6 + twinkle * 0.4})`);
        glowGrad.addColorStop(1, "rgba(251, 191, 36, 0)");
        ctx!.fillStyle = glowGrad;
        ctx!.fillRect(s.x - s.r * 4, s.y - s.r * 4, s.r * 8, s.r * 8);
        ctx!.fillStyle = `rgba(255, 245, 200, ${0.7 + twinkle * 0.3})`;
        ctx!.fill();
      });

      // Moon
      const moonX = W * 0.82, moonY = H * 0.15;
      const moonGlow = ctx!.createRadialGradient(moonX, moonY, 0, moonX, moonY, 60);
      moonGlow.addColorStop(0, "rgba(255, 244, 180, 0.5)");
      moonGlow.addColorStop(1, "rgba(255, 244, 180, 0)");
      ctx!.fillStyle = moonGlow;
      ctx!.fillRect(moonX - 60, moonY - 60, 120, 120);
      ctx!.beginPath();
      ctx!.arc(moonX, moonY, 22, 0, Math.PI * 2);
      ctx!.fillStyle = "#fff4b8";
      ctx!.fill();

      // Hills silhouette
      ctx!.beginPath();
      ctx!.moveTo(0, H * 0.78);
      ctx!.bezierCurveTo(W * 0.2, H * 0.7, W * 0.4, H * 0.82, W * 0.6, H * 0.74);
      ctx!.bezierCurveTo(W * 0.8, H * 0.68, W * 0.9, H * 0.8, W, H * 0.75);
      ctx!.lineTo(W, H);
      ctx!.lineTo(0, H);
      ctx!.closePath();
      ctx!.fillStyle = "#0a1a0a";
      ctx!.fill();

      // Village silhouette (right side)
      const baseX = W * 0.75, baseY = H * 0.82;
      ctx!.fillStyle = "#0d2b0d";
      for (let i = 0; i < 5; i++) {
        const bx = baseX + i * 14;
        const bh = 20 + (i % 3) * 12;
        ctx!.fillRect(bx, baseY - bh, 10, bh);
      }
      // Church spire
      ctx!.beginPath();
      ctx!.moveTo(baseX + 30, baseY - 50);
      ctx!.lineTo(baseX + 38, baseY - 80);
      ctx!.lineTo(baseX + 46, baseY - 50);
      ctx!.closePath();
      ctx!.fill();
      ctx!.fillRect(baseX + 28, baseY - 52, 20, 30);

      raf = requestAnimationFrame(loop);
    }
    loop();

    function onResize() {
      W = canvas!.width = window.innerWidth;
      H = canvas!.height = window.innerHeight;
    }
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <>
      <canvas ref={canvasRef} style={{ position: "fixed", inset: 0, zIndex: 0 }} />
      <div style={{ position: "fixed", inset: 0, zIndex: 1, background: "rgba(2,6,20,0.45)" }} />
    </>
  );
}

function PasswordStrength({ password }: { password: string }) {
  let strength = 0;
  if (password.length >= 8) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^A-Za-z0-9]/.test(password)) strength++;

  const colors = ["#ef4444", "#ef4444", "#f59e0b", "#22c55e", "#22c55e"];

  return (
    <div style={{ display: "flex", gap: 4, marginTop: 8 }}>
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          style={{
            flex: 1, height: 3, borderRadius: 2,
            background: i < strength ? colors[strength] : "rgba(255,255,255,0.1)",
            transition: "background 0.3s",
          }}
        />
      ))}
    </div>
  );
}

export default function AuthPage() {
  const router = useRouter();
  const { language, toggleLanguage } = useHydronova();
  const [mode, setMode] = useState<AuthMode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  function reset() {
    setError("");
    setSuccess(false);
  }

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    reset();
    setLoading(true);
    try {
      const supabase = await getSupabase();
      const { error: err } = await supabase.auth.signInWithPassword({ email, password });
      if (err) {
        setError(err.message || (language === "bn" ? "প্রবেশ ব্যর্থ হয়েছে।" : "Sign in failed."));
      } else {
        router.push("/dashboard");
      }
    } catch {
      setError(language === "bn" ? "একটি ত্রুটি ঘটেছে।" : "An error occurred.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    reset();
    if (!agreeTerms) {
      setError(language === "bn" ? "শর্তাবলীতে সম্মত হতে হবে।" : "You must agree to the terms.");
      return;
    }
    setLoading(true);
    try {
      const supabase = await getSupabase();
      const { error: err } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name: fullName, phone } },
      });
      if (err) {
        setError(err.message || (language === "bn" ? "নিবন্ধন ব্যর্থ হয়েছে।" : "Sign up failed."));
      } else {
        setSuccess(true);
        setTimeout(() => router.push("/dashboard"), 1500);
      }
    } catch {
      setError(language === "bn" ? "একটি ত্রুটি ঘটেছে।" : "An error occurred.");
    } finally {
      setLoading(false);
    }
  }

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    reset();
    setLoading(true);
    try {
      const supabase = await getSupabase();
      const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || ""}/auth`,
      });
      if (err) {
        setError(err.message || (language === "bn" ? "ব্যর্থ হয়েছে।" : "Failed to send reset link."));
      } else {
        setSuccess(true);
      }
    } catch {
      setError(language === "bn" ? "একটি ত্রুটি ঘটেছে।" : "An error occurred.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: "100dvh", position: "relative", display: "flex", flexDirection: "column" }}>
      <StarryNightBackground />

      {/* Top bar */}
      <div style={{
        position: "relative", zIndex: 10, display: "flex", justifyContent: "space-between",
        alignItems: "center", padding: "1.25rem 1.5rem",
      }}>
        <Link href="/" style={{ color: "#fff", textDecoration: "none", fontWeight: 700, fontSize: "0.95rem" }}>
          ← Hydronova
        </Link>
        <button
          onClick={toggleLanguage}
          style={{
            padding: "6px 12px", borderRadius: 8, fontSize: "0.75rem", fontWeight: 700,
            background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)",
            color: "#fbbf24", cursor: "pointer",
          }}
        >
          {language === "en" ? "বাং" : "EN"}
        </button>
      </div>

      {/* Auth card */}
      <div style={{
        position: "relative", zIndex: 10, flex: 1, display: "flex",
        alignItems: "center", justifyContent: "center", padding: "1rem 1.25rem 3rem",
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            width: "100%", maxWidth: 360,
            background: "rgba(5, 10, 25, 0.72)",
            border: "1px solid rgba(251,191,36,0.2)",
            borderRadius: 20,
            padding: "2rem 1.75rem",
            backdropFilter: "blur(16px)",
            boxShadow: "0 30px 80px rgba(0,0,0,0.5)",
          }}
        >
          {/* Logo */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "1.5rem" }}>
            <div style={{
              width: 44, height: 44, borderRadius: "50%",
              background: "rgba(14,165,233,0.15)", border: "1px solid rgba(14,165,233,0.3)",
              display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10,
            }}>
              <svg width="22" height="22" viewBox="0 0 28 28" fill="none">
                <path d="M5 15c2-2 4-2 6 0s4 2 6 0 4-2 6 0" stroke="#38bdf8" strokeWidth="2" fill="none" strokeLinecap="round" />
                <path d="M5 19c2-2 4-2 6 0s4 2 6 0 4-2 6 0" stroke="#7dd3fc" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.6" />
              </svg>
            </div>
            <h1 style={{ color: "#fff", fontWeight: 800, fontSize: "1.1rem" }}>{t("appName", language)}</h1>
          </div>

          {/* Tabs */}
          {mode !== "reset" && (
            <div style={{
              display: "flex", background: "rgba(255,255,255,0.05)", borderRadius: 12,
              padding: 4, marginBottom: "1.5rem",
            }}>
              {(["signin", "signup"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => { setMode(m); reset(); }}
                  style={{
                    flex: 1, padding: "9px 0", borderRadius: 9, border: "none", cursor: "pointer",
                    background: mode === m ? "linear-gradient(135deg,#0ea5e9,#38bdf8)" : "transparent",
                    color: mode === m ? "#02101f" : "rgba(255,255,255,0.5)",
                    fontWeight: 700, fontSize: "0.82rem", transition: "all 0.2s",
                  }}
                >
                  {t(`auth.${m}`, language)}
                </button>
              ))}
            </div>
          )}

          <AnimatePresence mode="wait">
            {/* ─── SIGN IN ─── */}
            {mode === "signin" && (
              <motion.form
                key="signin"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSignIn}
              >
                <h2 style={{ color: "#fff", fontSize: "1.3rem", fontWeight: 700, marginBottom: "1.25rem" }}>
                  {t("auth.welcomeBack", language)}
                </h2>

                <label style={{ fontSize: "0.68rem", color: "#7dd3fc", letterSpacing: "0.08em", display: "block", marginBottom: 6 }}>
                  {t("auth.email", language)}
                </label>
                <input
                  className="input" type="email" required value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ marginBottom: 16 }}
                  placeholder="you@example.com"
                />

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
                  <label style={{ fontSize: "0.68rem", color: "#7dd3fc", letterSpacing: "0.08em" }}>
                    {t("auth.password", language)}
                  </label>
                  <button
                    type="button"
                    onClick={() => { setMode("reset"); reset(); }}
                    style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", fontSize: "0.72rem", cursor: "pointer", padding: 0 }}
                  >
                    {t("auth.forgotPassword", language)}
                  </button>
                </div>
                <div style={{ position: "relative", marginBottom: 16 }}>
                  <input
                    className="input" type={showPassword ? "text" : "password"} required
                    value={password} onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    style={{ paddingRight: 44 }}
                  />
                  <button
                    type="button" onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
                      background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: "0.95rem",
                    }}
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>

                {error && <p style={{ color: "#ef4444", fontSize: "0.78rem", marginBottom: 12 }}>{error}</p>}

                <button type="submit" className="btn-primary" disabled={loading} style={{ width: "100%", marginBottom: 14 }}>
                  {loading ? <span className="spin" style={{ width: 16, height: 16, border: "2px solid #02101f", borderTopColor: "transparent", borderRadius: "50%", display: "inline-block" }} /> : t("auth.signin", language)}
                </button>

                <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "14px 0" }}>
                  <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.1)" }} />
                  <span style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.3)" }}>{t("auth.or", language)}</span>
                  <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.1)" }} />
                </div>

                <button
                  type="button" onClick={() => router.push("/")}
                  style={{
                    width: "100%", padding: "11px 0", background: "transparent",
                    border: "1px solid rgba(255,255,255,0.15)", borderRadius: 12,
                    color: "rgba(255,255,255,0.6)", fontSize: "0.85rem", cursor: "pointer", marginBottom: 16,
                  }}
                >
                  {t("auth.continueAsGuest", language)}
                </button>

                <p style={{ textAlign: "center", fontSize: "0.8rem", color: "rgba(255,255,255,0.45)" }}>
                  {t("auth.noAccount", language)}{" "}
                  <button type="button" onClick={() => { setMode("signup"); reset(); }} style={{ background: "none", border: "none", color: "#38bdf8", cursor: "pointer", fontWeight: 600, padding: 0 }}>
                    {t("auth.signup", language)}
                  </button>
                </p>
              </motion.form>
            )}

            {/* ─── SIGN UP ─── */}
            {mode === "signup" && (
              <motion.form
                key="signup"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSignUp}
              >
                <h2 style={{ color: "#fff", fontSize: "1.3rem", fontWeight: 700, marginBottom: "1.25rem" }}>
                  {t("auth.createAccount", language)}
                </h2>

                <label style={{ fontSize: "0.68rem", color: "#7dd3fc", letterSpacing: "0.08em", display: "block", marginBottom: 6 }}>
                  {t("auth.fullName", language)}
                </label>
                <input className="input" required value={fullName} onChange={(e) => setFullName(e.target.value)} style={{ marginBottom: 14 }} />

                <label style={{ fontSize: "0.68rem", color: "#7dd3fc", letterSpacing: "0.08em", display: "block", marginBottom: 6 }}>
                  {t("auth.email", language)}
                </label>
                <input className="input" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} style={{ marginBottom: 14 }} />

                <label style={{ fontSize: "0.68rem", color: "#7dd3fc", letterSpacing: "0.08em", display: "block", marginBottom: 6 }}>
                  {t("auth.password", language)}
                </label>
                <input className="input" type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} style={{ marginBottom: 4 }} />
                <PasswordStrength password={password} />

                <label style={{ fontSize: "0.68rem", color: "#7dd3fc", letterSpacing: "0.08em", display: "block", margin: "14px 0 6px" }}>
                  {t("auth.phone", language)}
                </label>
                <input className="input" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+880" style={{ marginBottom: 16 }} />

                <label style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 16, cursor: "pointer" }}>
                  <input type="checkbox" checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)} style={{ marginTop: 3, accentColor: "#0ea5e9" }} />
                  <span style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.55)" }}>{t("auth.agreeTerms", language)}</span>
                </label>

                {error && <p style={{ color: "#ef4444", fontSize: "0.78rem", marginBottom: 12 }}>{error}</p>}
                {success && <p style={{ color: "#22c55e", fontSize: "0.78rem", marginBottom: 12 }}>✓ {language === "bn" ? "অ্যাকাউন্ট তৈরি হয়েছে!" : "Account created!"}</p>}

                <button type="submit" className="btn-primary" disabled={loading} style={{ width: "100%", marginBottom: 16 }}>
                  {loading ? <span className="spin" style={{ width: 16, height: 16, border: "2px solid #02101f", borderTopColor: "transparent", borderRadius: "50%", display: "inline-block" }} /> : t("auth.createAccount", language)}
                </button>

                <p style={{ textAlign: "center", fontSize: "0.8rem", color: "rgba(255,255,255,0.45)" }}>
                  {t("auth.haveAccount", language)}{" "}
                  <button type="button" onClick={() => { setMode("signin"); reset(); }} style={{ background: "none", border: "none", color: "#38bdf8", cursor: "pointer", fontWeight: 600, padding: 0 }}>
                    {t("auth.signin", language)}
                  </button>
                </p>
              </motion.form>
            )}

            {/* ─── RESET PASSWORD ─── */}
            {mode === "reset" && (
              <motion.form
                key="reset"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleReset}
              >
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "1.25rem" }}>
                  <div style={{
                    width: 56, height: 56, borderRadius: "50%",
                    background: "rgba(14,165,233,0.12)", border: "1px solid rgba(14,165,233,0.3)",
                    display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12,
                    boxShadow: "0 0 24px rgba(14,165,233,0.25)",
                  }}>
                    <span style={{ fontSize: "1.5rem" }}>🔒</span>
                  </div>
                  <h2 style={{ color: "#fff", fontSize: "1.2rem", fontWeight: 700, textAlign: "center" }}>
                    {t("auth.resetPassword", language)}
                  </h2>
                  <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.82rem", textAlign: "center", marginTop: 6 }}>
                    {t("auth.resetHint", language)}
                  </p>
                </div>

                <label style={{ fontSize: "0.68rem", color: "#7dd3fc", letterSpacing: "0.08em", display: "block", marginBottom: 6 }}>
                  {t("auth.email", language)}
                </label>
                <input className="input" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} style={{ marginBottom: 16 }} />

                {error && <p style={{ color: "#ef4444", fontSize: "0.78rem", marginBottom: 12 }}>{error}</p>}
                {success && <p style={{ color: "#22c55e", fontSize: "0.78rem", marginBottom: 12 }}>✓ {t("auth.resetSent", language)}</p>}

                <button type="submit" className="btn-primary" disabled={loading} style={{ width: "100%", marginBottom: 14 }}>
                  {loading ? <span className="spin" style={{ width: 16, height: 16, border: "2px solid #02101f", borderTopColor: "transparent", borderRadius: "50%", display: "inline-block" }} /> : t("auth.sendResetLink", language)}
                </button>

                <button
                  type="button" onClick={() => { setMode("signin"); reset(); }}
                  style={{ width: "100%", background: "none", border: "none", color: "rgba(255,255,255,0.5)", fontSize: "0.82rem", cursor: "pointer", marginBottom: 14 }}
                >
                  {t("auth.backToSignin", language)}
                </button>

                <div style={{ padding: "10px 12px", background: "rgba(255,255,255,0.04)", borderRadius: 10, border: "1px solid rgba(255,255,255,0.08)" }}>
                  <p style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.4)", lineHeight: 1.5 }}>
                    {t("auth.spamHint", language)}
                  </p>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
