"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { useHydronova } from "@/store/hydronova";
import { t } from "@/lib/i18n/translations";
import { PageShell } from "@/components/NavShell";
import FloodMap from "@/components/map/FloodMap";

interface DistrictRisk {
  district: string;
  score: number;
  level: "safe" | "moderate" | "high" | "severe";
  confidence: number;
  trend: "rising" | "falling" | "stable";
  explanation: { en: string; bn: string };
  factors: { rainfall: number; soil: number; river: number; upstream: number };
}

const LEVEL_COLOR: Record<string, string> = {
  safe: "#22c55e",
  moderate: "#f59e0b",
  high: "#ef4444",
  severe: "#dc2626",
};

function RiskGaugeSmall({ score }: { score: number }) {
  const color = score < 35 ? "#22c55e" : score < 60 ? "#f59e0b" : score < 80 ? "#ef4444" : "#dc2626";
  const circumference = 2 * Math.PI * 42;
  const offset = circumference - (score / 100) * circumference;
  return (
    <svg width="100" height="100" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="9" />
      <circle
        cx="50" cy="50" r="42" fill="none" stroke={color} strokeWidth="9" strokeLinecap="round"
        strokeDasharray={circumference} strokeDashoffset={offset} transform="rotate(-90 50 50)"
        style={{ transition: "stroke-dashoffset 1s ease, stroke 0.5s", filter: `drop-shadow(0 0 6px ${color}80)` }}
      />
      <text x="50" y="55" textAnchor="middle" fontSize="22" fontWeight="800" fill="#fff">{score}</text>
    </svg>
  );
}

function FactorBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.72rem", marginBottom: 4 }}>
        <span style={{ color: "rgba(230,244,251,0.6)" }}>{label}</span>
        <span style={{ color: "#fff", fontWeight: 600 }}>{Math.round(value)}%</span>
      </div>
      <div style={{ height: 5, background: "rgba(255,255,255,0.06)", borderRadius: 3, overflow: "hidden" }}>
        <div style={{ width: `${value}%`, height: "100%", background: color, borderRadius: 3, transition: "width 0.8s ease" }} />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { language } = useHydronova();
  const [districts, setDistricts] = useState<DistrictRisk[]>([]);
  const [selectedTime, setSelectedTime] = useState("1hr");
  const [loading, setLoading] = useState(true);
  const [liveScore, setLiveScore] = useState(68);

  useEffect(() => {
    fetch("/api/flood")
      .then((r) => r.json())
      .then((data) => {
        setDistricts(data.districts || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Live drift every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveScore((prev) => Math.max(20, Math.min(95, Math.round(prev + (Math.random() - 0.5) * 5))));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const chartData = districts.map((d) => ({ name: d.district, risk: d.score, fill: LEVEL_COLOR[d.level] }));
  const mainDistrict = districts[0];

  const PRED_WINDOWS = [
    { key: "30min", value: "+4%" },
    { key: "1hr", value: "+9%" },
    { key: "6hr", value: "+22%" },
    { key: "24hr", value: "+38%" },
  ];

  return (
    <PageShell>
      <main style={{ padding: "1.5rem 1.25rem 2rem", maxWidth: 1280, margin: "0 auto" }}>
        <h1 style={{ fontSize: "1.6rem", fontWeight: 800, marginBottom: "0.3rem" }}>
          {t("nav.dashboard", language) === "ড্যাশবোর্ড"
            ? "লাইভ বাংলাদেশ ড্যাশবোর্ড"
            : "Live Bangladesh Dashboard"}
        </h1>
        <p style={{ fontSize: "0.82rem", color: "rgba(230,244,251,0.5)", marginBottom: "1.5rem" }}>
          {language === "bn" ? "রিয়েল-টাইম বন্যা ঝুঁকি পর্যবেক্ষণ" : "Real-time flood risk monitoring"}
        </p>

        <div className="grid-main">
          {/* Bar chart card — spans wider */}
          <div className="card" style={{ gridColumn: "1 / -1" }}>
            <h3 style={{ fontSize: "0.95rem", fontWeight: 700, marginBottom: 14 }}>
              {language === "bn" ? "জেলা অনুযায়ী ঝুঁকি" : "Risk by District"}
            </h3>
            {loading ? (
              <div className="skeleton" style={{ height: 220, borderRadius: 12 }} />
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={chartData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                  <XAxis dataKey="name" stroke="rgba(230,244,251,0.4)" fontSize={11} />
                  <YAxis stroke="rgba(230,244,251,0.4)" fontSize={11} domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{ background: "#0a2540", border: "1px solid rgba(14,165,233,0.3)", borderRadius: 10, fontSize: 12 }}
                    labelStyle={{ color: "#fff" }}
                    formatter={(value: number) => [`${value}%`, language === "bn" ? "ঝুঁকি" : "Risk"]}
                  />
                  <Bar dataKey="risk" radius={[6, 6, 0, 0]}>
                    {chartData.map((entry, i) => (
                      <Bar key={i} dataKey="risk" fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* District grid */}
          <div className="card" style={{ gridColumn: "1 / -1" }}>
            <h3 style={{ fontSize: "0.95rem", fontWeight: 700, marginBottom: 14 }}>
              {language === "bn" ? "জেলার অবস্থা" : "District Status"}
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 10 }}>
              {districts.map((d) => (
                <div
                  key={d.district}
                  style={{
                    padding: "12px 14px", borderRadius: 12,
                    background: `${LEVEL_COLOR[d.level]}10`, border: `1px solid ${LEVEL_COLOR[d.level]}30`,
                  }}
                >
                  <p style={{ fontSize: "0.8rem", fontWeight: 600, color: "#fff", marginBottom: 4 }}>{d.district}</p>
                  <p style={{ fontSize: "1.3rem", fontWeight: 800, color: LEVEL_COLOR[d.level] }}>{d.score}%</p>
                  <p style={{ fontSize: "0.65rem", color: "rgba(230,244,251,0.5)" }}>{t(`risk.${d.level}`, language)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* AI Risk Engine */}
          <div className="card ai-box glow-card">
            <h3 style={{ fontSize: "0.95rem", fontWeight: 700, marginBottom: 14, marginTop: 4 }}>
              {language === "bn" ? "AI ঝুঁকি ইঞ্জিন" : "AI Risk Engine"}
            </h3>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 14 }}>
              <RiskGaugeSmall score={liveScore} />
              <div>
                <p style={{ fontSize: "0.72rem", color: "rgba(230,244,251,0.5)" }}>{t("risk.confidence", language)}</p>
                <p style={{ fontSize: "1.1rem", fontWeight: 700, color: "#fff" }}>{mainDistrict?.confidence ?? 87}%</p>
                <p style={{ fontSize: "0.72rem", color: "rgba(230,244,251,0.5)", marginTop: 6 }}>{t("risk.trend", language)}</p>
                <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "#f59e0b" }}>
                  ↗ {t(`risk.${mainDistrict?.trend ?? "rising"}`, language)}
                </p>
              </div>
            </div>
            <FactorBar label={t("risk.rainfall", language)} value={mainDistrict?.factors.rainfall ?? 78} color="#0ea5e9" />
            <FactorBar label={t("risk.soil", language)} value={mainDistrict?.factors.soil ?? 65} color="#38bdf8" />
            <FactorBar label={t("risk.river", language)} value={mainDistrict?.factors.river ?? 72} color="#7dd3fc" />
            <FactorBar label={t("risk.upstream", language)} value={mainDistrict?.factors.upstream ?? 80} color="#b388ff" />
          </div>

          {/* Flood Prediction */}
          <div className="card">
            <h3 style={{ fontSize: "0.95rem", fontWeight: 700, marginBottom: 14 }}>{t("pred.title", language)}</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
              {PRED_WINDOWS.map((w) => (
                <button
                  key={w.key}
                  onClick={() => setSelectedTime(w.key)}
                  style={{
                    padding: "10px 8px", borderRadius: 10, border: selectedTime === w.key ? "1px solid #0ea5e9" : "1px solid var(--border)",
                    background: selectedTime === w.key ? "rgba(14,165,233,0.12)" : "rgba(255,255,255,0.02)",
                    color: selectedTime === w.key ? "#38bdf8" : "rgba(230,244,251,0.6)",
                    cursor: "pointer", fontSize: "0.78rem", fontWeight: 600,
                  }}
                >
                  {t(`pred.${w.key}`, language)}
                </button>
              ))}
            </div>
            <div style={{ textAlign: "center", padding: "12px 0" }}>
              <p style={{ fontSize: "0.72rem", color: "rgba(230,244,251,0.5)" }}>{language === "bn" ? "প্রত্যাশিত পরিবর্তন" : "Expected change"}</p>
              <p style={{ fontSize: "1.8rem", fontWeight: 800, color: "#f59e0b" }}>
                {PRED_WINDOWS.find((w) => w.key === selectedTime)?.value}
              </p>
            </div>
          </div>

          {/* Digital Twin */}
          <div className="card">
            <h3 style={{ fontSize: "0.95rem", fontWeight: 700, marginBottom: 14 }}>{t("twin.title", language)}</h3>
            {[
              { label: t("twin.waterLevel", language), value: "4.2m", pct: 70 },
              { label: t("twin.flowRate", language), value: "2,840 m³/s", pct: 62 },
              { label: t("twin.rainfall", language), value: "18mm/hr", pct: 45 },
            ].map((m) => (
              <div key={m.label} style={{ marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem", marginBottom: 4 }}>
                  <span style={{ color: "rgba(230,244,251,0.6)" }}>{m.label}</span>
                  <span style={{ color: "#fff", fontWeight: 600 }}>{m.value}</span>
                </div>
                <div style={{ height: 5, background: "rgba(255,255,255,0.06)", borderRadius: 3 }}>
                  <div style={{ width: `${m.pct}%`, height: "100%", background: "#0ea5e9", borderRadius: 3 }} />
                </div>
              </div>
            ))}
            <p style={{ fontSize: "0.7rem", color: "rgba(230,244,251,0.4)", marginTop: 10 }}>{t("twin.sensorHealth", language)}: 96%</p>
          </div>

          {/* Map preview */}
          <div className="card" style={{ padding: 0, overflow: "hidden" }}>
            <div style={{ padding: "14px 16px 0" }}>
              <h3 style={{ fontSize: "0.95rem", fontWeight: 700 }}>{t("map.title", language)}</h3>
            </div>
            <div style={{ height: 240, marginTop: 10 }}>
              <FloodMap />
            </div>
            <Link href="/map" style={{ display: "block", textAlign: "center", padding: "10px", fontSize: "0.78rem", color: "#38bdf8", textDecoration: "none", borderTop: "1px solid var(--border)" }}>
              {language === "bn" ? "সম্পূর্ণ মানচিত্র দেখুন →" : "View Full Map →"}
            </Link>
          </div>

          {/* Community Reports */}
          <div className="card">
            <h3 style={{ fontSize: "0.95rem", fontWeight: 700, marginBottom: 14 }}>{t("community.title", language)}</h3>
            {[
              { icon: "💧", loc: "Sylhet — Zindabazar", status: "verified" },
              { icon: "🌉", loc: "Sunamganj — Dowarabazar", status: "verified" },
              { icon: "🆘", loc: "Mymensingh — Trishal", status: "pending" },
            ].map((r) => (
              <div key={r.loc} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: "1px solid var(--border)" }}>
                <span style={{ fontSize: "1.1rem" }}>{r.icon}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: "0.78rem", color: "#fff" }}>{r.loc}</p>
                </div>
                <span className={r.status === "verified" ? "badge-live" : "badge-warn"} style={{ fontSize: "0.6rem" }}>
                  {t(`community.${r.status}`, language)}
                </span>
              </div>
            ))}
            <Link href="/community" style={{ display: "block", textAlign: "center", marginTop: 12, fontSize: "0.78rem", color: "#38bdf8", textDecoration: "none" }}>
              {language === "bn" ? "সব দেখুন →" : "View all →"}
            </Link>
          </div>

          {/* Family Circles preview */}
          <div className="card">
            <h3 style={{ fontSize: "0.95rem", fontWeight: 700, marginBottom: 14 }}>{t("family.title", language)}</h3>
            <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
              {[
                { initial: "আ", color: "#22c55e" },
                { initial: "ম", color: "#22c55e" },
                { initial: "র", color: "#f59e0b" },
                { initial: "স", color: "#22c55e" },
              ].map((m, i) => (
                <div
                  key={i}
                  style={{
                    width: 44, height: 44, borderRadius: "50%",
                    background: "#0a2540", border: `2px solid ${m.color}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#fff", fontWeight: 700, fontSize: "0.85rem",
                    boxShadow: `0 0 10px ${m.color}50`,
                  }}
                >
                  {m.initial}
                </div>
              ))}
            </div>
            <Link href="/family" style={{ display: "block", textAlign: "center", fontSize: "0.78rem", color: "#38bdf8", textDecoration: "none" }}>
              {language === "bn" ? "পরিবার দেখুন →" : "View family →"}
            </Link>
          </div>

          {/* Emergency quick actions */}
          <div className="card">
            <h3 style={{ fontSize: "0.95rem", fontWeight: 700, marginBottom: 14 }}>{t("emergency.title", language)}</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {[
                { icon: "🆘", label: "SOS", href: "/emergency" },
                { icon: "🛣️", label: language === "bn" ? "রুট" : "Route", href: "/map" },
                { icon: "🏠", label: t("emergency.shelters", language), href: "/emergency" },
                { icon: "📞", label: t("emergency.contacts", language), href: "/emergency" },
              ].map((a) => (
                <Link
                  key={a.label}
                  href={a.href}
                  style={{
                    display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
                    padding: "12px 8px", borderRadius: 10, background: "rgba(239,68,68,0.06)",
                    border: "1px solid rgba(239,68,68,0.18)", textDecoration: "none",
                  }}
                >
                  <span style={{ fontSize: "1.2rem" }}>{a.icon}</span>
                  <span style={{ fontSize: "0.7rem", color: "rgba(230,244,251,0.7)" }}>{a.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* FloodGPT quick card */}
          <div className="card ai-box">
            <h3 style={{ fontSize: "0.95rem", fontWeight: 700, marginBottom: 10, marginTop: 4 }}>{t("gpt.title", language)}</h3>
            <p style={{ fontSize: "0.78rem", color: "rgba(230,244,251,0.55)", lineHeight: 1.6, marginBottom: 14 }}>
              {t("gpt.welcome", language).slice(0, 90)}...
            </p>
            <Link href="/floodgpt" className="btn-primary" style={{ width: "100%", justifyContent: "center" }}>
              {language === "bn" ? "চ্যাট শুরু করুন" : "Start Chatting"}
            </Link>
          </div>
        </div>
      </main>
    </PageShell>
  );
}
