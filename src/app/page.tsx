"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useHydronova } from "@/store/hydronova";
import { t } from "@/lib/i18n/translations";
import { PageShell } from "@/components/NavShell";

// ─── Animated water particle canvas ──────────────────────────────────────────
function WaterParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = (canvas.width = window.innerWidth);
    let H = (canvas.height = window.innerHeight);

    const particles = Array.from({ length: 70 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.8 + 0.4,
      vy: -(Math.random() * 0.3 + 0.08),
      vx: (Math.random() - 0.5) * 0.15,
      alpha: Math.random() * 0.5 + 0.15,
    }));

    let raf: number;
    function loop() {
      ctx!.clearRect(0, 0, W, H);
      particles.forEach((p) => {
        p.y += p.vy;
        p.x += p.vx;
        if (p.y < -10) { p.y = H + 10; p.x = Math.random() * W; }
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(125, 211, 252, ${p.alpha})`;
        ctx!.fill();
      });
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
    <canvas
      ref={canvasRef}
      style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}
    />
  );
}

// ─── Animated river network SVG background ──────────────────────────────────
function RiverNetwork() {
  return (
    <svg
      style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", opacity: 0.18 }}
      width="100%" height="100%" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id="riverGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0ea5e9" />
          <stop offset="100%" stopColor="#7dd3fc" />
        </linearGradient>
      </defs>
      {[
        "M50,100 Q300,150 350,300 T600,400 T900,500",
        "M1150,80 Q900,200 800,350 T550,450 T200,600",
        "M0,650 Q250,600 400,700 T750,650 T1100,750",
      ].map((d, i) => (
        <motion.path
          key={i}
          d={d}
          stroke="url(#riverGrad)"
          strokeWidth="2"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 3, delay: i * 0.4, ease: "easeInOut" }}
        />
      ))}
    </svg>
  );
}

// ─── Risk gauge — auto-updates every 4 seconds ───────────────────────────────
function RiskGauge() {
  const { language } = useHydronova();
  const [score, setScore] = useState(68);

  useEffect(() => {
    const interval = setInterval(() => {
      setScore((prev) => {
        const drift = (Math.random() - 0.5) * 6;
        return Math.max(15, Math.min(95, Math.round(prev + drift)));
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const color = score < 35 ? "#22c55e" : score < 60 ? "#f59e0b" : score < 80 ? "#ef4444" : "#dc2626";
  const circumference = 2 * Math.PI * 70;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div style={{ position: "relative", width: 180, height: 180 }}>
      <svg width="180" height="180" viewBox="0 0 180 180">
        <circle cx="90" cy="90" r="70" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="12" />
        <motion.circle
          cx="90" cy="90" r="70" fill="none"
          stroke={color} strokeWidth="12" strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 90 90)"
          animate={{ strokeDashoffset: offset, stroke: color }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          style={{ filter: `drop-shadow(0 0 8px ${color}80)` }}
        />
      </svg>
      <div style={{
        position: "absolute", inset: 0, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
      }}>
        <motion.span
          key={score}
          initial={{ scale: 1.15 }}
          animate={{ scale: 1 }}
          style={{ fontSize: "2.2rem", fontWeight: 800, color: "#fff" }}
        >
          {score}
        </motion.span>
        <span style={{ fontSize: "0.65rem", color: "rgba(230,244,251,0.5)", letterSpacing: "0.08em" }}>
          {t("risk.score", language).toUpperCase()}
        </span>
      </div>
    </div>
  );
}

const FEATURE_LIST = [
  { href: "/dashboard", icon: "📊", titleKey: "home.feat1Title", descKey: "home.feat1Desc" },
  { href: "/map", icon: "🗺️", titleKey: "home.feat2Title", descKey: "home.feat2Desc" },
  { href: "/floodgpt", icon: "🤖", titleKey: "home.feat3Title", descKey: "home.feat3Desc" },
  { href: "/community", icon: "👥", titleKey: "home.feat4Title", descKey: "home.feat4Desc" },
  { href: "/family", icon: "👨‍👩‍👧", titleKey: "home.feat5Title", descKey: "home.feat5Desc" },
  { href: "/emergency", icon: "🆘", titleKey: "home.feat6Title", descKey: "home.feat6Desc" },
];

export default function HomePage() {
  const { language } = useHydronova();

  return (
    <PageShell>
      <WaterParticles />
      <RiverNetwork />

      <main style={{ position: "relative", zIndex: 10 }}>
        {/* Alert banner */}
        <div style={{
          background: "linear-gradient(90deg, rgba(245,158,11,0.15), rgba(245,158,11,0.05))",
          borderBottom: "1px solid rgba(245,158,11,0.25)",
          padding: "10px 1.25rem", textAlign: "center",
        }}>
          <span style={{ color: "#f59e0b", fontSize: "0.82rem", fontWeight: 600 }}>
            ⚠️ {t("alerts.moderateWatch", language)}
          </span>
        </div>

        {/* Hero */}
        <section style={{ padding: "3rem 1.25rem 2rem", maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="badge-live"
            style={{ margin: "0 auto 1.5rem", width: "fit-content" }}
          >
            <span className="pulse" style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", display: "inline-block" }} />
            {t("alerts.liveSatellite", language)}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{ fontSize: "clamp(1.8rem, 5vw, 3rem)", fontWeight: 800, lineHeight: 1.15, marginBottom: "1rem" }}
          >
            {t("tagline", language)}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            style={{ display: "flex", justifyContent: "center", margin: "2rem 0" }}
          >
            <RiskGauge />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: "2.5rem" }}
          >
            <Link href="/dashboard" className="btn-primary">{t("home.exploreDashboard", language)}</Link>
            <Link href="/floodgpt" className="btn-outline">{t("home.talkToGpt", language)}</Link>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, maxWidth: 560, margin: "0 auto" }}
          >
            {[
              { value: "64", label: t("stats.districts", language) },
              { value: "2.4K", label: t("stats.sensors", language) },
              { value: "93%", label: t("stats.accuracy", language) },
              { value: "1.2M", label: t("stats.citizens", language) },
            ].map((s) => (
              <div key={s.label} style={{ textAlign: "center" }}>
                <div style={{ fontSize: "1.3rem", fontWeight: 800, color: "#38bdf8" }}>{s.value}</div>
                <div style={{ fontSize: "0.62rem", color: "rgba(230,244,251,0.45)" }}>{s.label}</div>
              </div>
            ))}
          </motion.div>
        </section>

        {/* Feature cards */}
        <section style={{ padding: "1rem 1.25rem 3rem", maxWidth: 1100, margin: "0 auto" }}>
          <div className="grid-main">
            {FEATURE_LIST.map((f, i) => (
              <motion.div
                key={f.href}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
              >
                <Link href={f.href} style={{ textDecoration: "none" }}>
                  <div className="card" style={{ height: "100%", cursor: "pointer" }}>
                    <div style={{ fontSize: "1.8rem", marginBottom: 10 }}>{f.icon}</div>
                    <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: 6, color: "#fff" }}>
                      {t(f.titleKey, language)}
                    </h3>
                    <p style={{ fontSize: "0.82rem", color: "rgba(230,244,251,0.55)", lineHeight: 1.6 }}>
                      {t(f.descKey, language)}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Impact section */}
        <section style={{ padding: "3rem 1.25rem", background: "rgba(10,37,64,0.3)", borderTop: "1px solid var(--border)" }}>
          <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "2rem" }}>
              {language === "bn" ? "প্রভাব" : "Impact"}
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 24, maxWidth: 600, margin: "0 auto" }}>
              {[
                { value: "15+", label: t("impact.peopleHelped", language) },
                { value: "16hr", label: t("impact.avgWarning", language) },
                { value: "3", label: t("impact.accuracy", language) },
                { value: "100%", label: t("impact.damagePrevented", language) },
              ].map((s) => (
                <div key={s.label}>
                  <div style={{ fontSize: "2rem", fontWeight: 800, color: "#38bdf8" }}>{s.value}</div>
                  <div style={{ fontSize: "0.75rem", color: "rgba(230,244,251,0.5)" }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer style={{ padding: "2rem 1.25rem", textAlign: "center", borderTop: "1px solid var(--border)" }}>
          <p style={{ fontWeight: 700, marginBottom: 4 }}>{t("appName", language)}</p>
          <p style={{ fontSize: "0.78rem", color: "rgba(230,244,251,0.4)" }}>{t("founder", language)}</p>
          <p style={{ fontSize: "0.72rem", color: "rgba(230,244,251,0.3)", marginTop: 8 }}>
            © 2025 Hydronova. {t("footer.rights", language)} · {t("footer.builtFor", language)}
          </p>
        </footer>
      </main>
    </PageShell>
  );
}
