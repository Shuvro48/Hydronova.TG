"use client";
import { useState } from "react";
import { useHydronova } from "@/store/hydronova";
import { t } from "@/lib/i18n/translations";
import { TopNav, BottomNav, Sidebar } from "@/components/NavShell";
import FloodMap from "@/components/map/FloodMap";

type SOSState = "idle" | "sending" | "sent";

const CONTACTS = [
  { name: { en: "Disaster Helpline", bn: "দুর্যোগ হেল্পলাইন" }, number: "1090", icon: "🆘" },
  { name: { en: "Fire Service", bn: "ফায়ার সার্ভিস" }, number: "199", icon: "🚒" },
  { name: { en: "Police", bn: "পুলিশ" }, number: "999", icon: "👮" },
  { name: { en: "Ambulance", bn: "অ্যাম্বুলেন্স" }, number: "199", icon: "🚑" },
  { name: { en: "Coast Guard", bn: "কোস্ট গার্ড" }, number: "16115", icon: "⚓" },
  { name: { en: "Army Helpline", bn: "সেনাবাহিনী হেল্পলাইন" }, number: "999", icon: "🪖" },
];

const SHELTERS = [
  { name: { en: "Sylhet Govt. Primary School", bn: "সিলেট সরকারি প্রাইমারি স্কুল" }, distance: "1.2km", capacity: 450, open: true },
  { name: { en: "Sunamganj Community Center", bn: "সুনামগঞ্জ কমিউনিটি সেন্টার" }, distance: "3.8km", capacity: 300, open: true },
  { name: { en: "Mymensingh Cyclone Shelter", bn: "মাইমনসিংহ ঘূর্ণিঝড় আশ্রয়কেন্দ্র" }, distance: "7.1km", capacity: 600, open: false },
];

const CHECKLIST = [
  { en: "Waterproof bag with documents & cash", bn: "ডকুমেন্ট ও নগদ টাকা সহ জলরোধী ব্যাগ" },
  { en: "3 days of dry food and water", bn: "৩ দিনের শুকনো খাবার ও পানি" },
  { en: "Charged phone + power bank", bn: "চার্জড ফোন + পাওয়ার ব্যাংক" },
  { en: "First aid kit and essential medicines", bn: "ফার্স্ট এইড কিট ও প্রয়োজনীয় ওষুধ" },
  { en: "Know your nearest shelter location", bn: "নিকটস্থ আশ্রয়কেন্দ্রের অবস্থান জানুন" },
  { en: "Family meeting point if separated", bn: "বিচ্ছিন্ন হলে পরিবারের সাক্ষাতের স্থান" },
];

export default function EmergencyPage() {
  const { language } = useHydronova();
  const [sosState, setSosState] = useState<SOSState>("idle");
  const [checked, setChecked] = useState<boolean[]>(Array(CHECKLIST.length).fill(false));

  function triggerSOS() {
    if (sosState !== "idle") return;
    setSosState("sending");
    setTimeout(() => setSosState("sent"), 1800);
  }

  function toggleCheck(i: number) {
    setChecked((prev) => prev.map((v, idx) => (idx === i ? !v : v)));
  }

  return (
    <>
      <TopNav />
      <Sidebar />
      <div className="main-with-sidebar has-bottom-nav">
        <main style={{ padding: "1.5rem 1.25rem 2rem", maxWidth: 700, margin: "0 auto" }}>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "1.5rem", color: "#ef4444" }}>
            🆘 {t("emergency.title", language)}
          </h1>

          {/* SOS Button */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "2.5rem" }}>
            <button
              onClick={triggerSOS}
              disabled={sosState !== "idle"}
              style={{
                width: 140, height: 140, borderRadius: "50%",
                background: sosState === "sent"
                  ? "linear-gradient(135deg, #22c55e, #16a34a)"
                  : "linear-gradient(135deg, #ef4444, #dc2626)",
                border: "none", color: "#fff", fontWeight: 800, fontSize: "1.3rem",
                cursor: sosState === "idle" ? "pointer" : "default",
                boxShadow: sosState === "idle" ? "0 0 0 0 rgba(239,68,68,0.6)" : "none",
                animation: sosState === "idle" ? "sos-pulse 2s infinite" : "none",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "background 0.4s",
              }}
            >
              {sosState === "idle" && t("emergency.sosButton", language)}
              {sosState === "sending" && <span className="spin" style={{ width: 36, height: 36, border: "4px solid #fff", borderTopColor: "transparent", borderRadius: "50%" }} />}
              {sosState === "sent" && "✓"}
            </button>
            <p style={{ marginTop: 14, fontSize: "0.82rem", color: "rgba(230,244,251,0.5)", textAlign: "center" }}>
              {sosState === "idle" && t("emergency.sosHint", language)}
              {sosState === "sending" && t("emergency.sending", language)}
            </p>
            {sosState === "sent" && (
              <div style={{ marginTop: 16, textAlign: "center" }}>
                <p style={{ color: "#22c55e", fontWeight: 700, marginBottom: 6 }}>✅ {t("emergency.sent", language)}</p>
                <p style={{ fontSize: "0.8rem", color: "rgba(230,244,251,0.6)" }}>{t("emergency.helpline", language)}</p>
              </div>
            )}
          </div>

          {/* Emergency contacts */}
          <h2 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: 12 }}>{t("emergency.contacts", language)}</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: "2rem" }}>
            {CONTACTS.map((c) => (
              <a
                key={c.number}
                href={`tel:${c.number}`}
                style={{
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
                  padding: "14px 8px", borderRadius: 12, background: "rgba(239,68,68,0.06)",
                  border: "1px solid rgba(239,68,68,0.2)", textDecoration: "none",
                }}
              >
                <span style={{ fontSize: "1.4rem" }}>{c.icon}</span>
                <span style={{ fontSize: "0.68rem", color: "rgba(230,244,251,0.7)", textAlign: "center" }}>{c.name[language]}</span>
                <span style={{ fontSize: "0.85rem", fontWeight: 800, color: "#ef4444" }}>{c.number}</span>
              </a>
            ))}
          </div>

          {/* Nearby shelters */}
          <h2 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: 12 }}>{t("emergency.shelters", language)}</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: "2rem" }}>
            {SHELTERS.map((s) => (
              <div key={s.name.en} className="card" style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: "1.3rem" }}>🏠</span>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "#fff" }}>{s.name[language]}</p>
                  <p style={{ fontSize: "0.72rem", color: "rgba(230,244,251,0.5)" }}>
                    {s.distance} {t("emergency.distance", language)} · {s.capacity} {t("emergency.capacity", language)}
                  </p>
                </div>
                <span className={s.open ? "badge-live" : "badge-danger"} style={{ flexShrink: 0 }}>
                  {s.open ? t("emergency.open", language) : t("emergency.closed", language)}
                </span>
              </div>
            ))}
          </div>

          {/* Mini map */}
          <div className="card" style={{ padding: 0, overflow: "hidden", marginBottom: "2rem" }}>
            <div style={{ height: 180 }}>
              <FloodMap layers={{ rivers: false, zones: true, shelters: true, sensors: false }} />
            </div>
          </div>

          {/* Checklist */}
          <h2 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: 12 }}>{t("emergency.checklist", language)}</h2>
          <div className="card">
            {CHECKLIST.map((item, i) => (
              <button
                key={i}
                onClick={() => toggleCheck(i)}
                style={{
                  width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "10px 0",
                  borderBottom: i < CHECKLIST.length - 1 ? "1px solid var(--border)" : "none",
                  background: "none", border: "none", cursor: "pointer", textAlign: "left",
                }}
              >
                <span style={{
                  width: 20, height: 20, borderRadius: 6, flexShrink: 0,
                  border: `2px solid ${checked[i] ? "#22c55e" : "rgba(255,255,255,0.2)"}`,
                  background: checked[i] ? "#22c55e" : "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center", color: "#02101f", fontSize: "0.7rem",
                }}>
                  {checked[i] && "✓"}
                </span>
                <span style={{ fontSize: "0.84rem", color: checked[i] ? "rgba(230,244,251,0.4)" : "rgba(230,244,251,0.8)", textDecoration: checked[i] ? "line-through" : "none" }}>
                  {item[language]}
                </span>
              </button>
            ))}
          </div>
        </main>
      </div>
      <BottomNav />

      <style>{`
        @keyframes sos-pulse {
          0% { box-shadow: 0 0 0 0 rgba(239,68,68,0.6); }
          70% { box-shadow: 0 0 0 24px rgba(239,68,68,0); }
          100% { box-shadow: 0 0 0 0 rgba(239,68,68,0); }
        }
      `}</style>
    </>
  );
}
