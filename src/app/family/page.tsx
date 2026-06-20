"use client";
import { useState } from "react";
import { useHydronova } from "@/store/hydronova";
import { t } from "@/lib/i18n/translations";
import { PageShell } from "@/components/NavShell";

interface Member {
  id: string;
  name: string;
  phone: string;
  location: string;
  status: "safe" | "warning" | "danger";
}

const INITIAL_MEMBERS: Member[] = [
  { id: "1", name: "আব্বু", phone: "+8801712345678", location: "Sylhet Sadar", status: "safe" },
  { id: "2", name: "আম্মু", phone: "+8801812345678", location: "Sylhet Sadar", status: "safe" },
  { id: "3", name: "রাহাত (ভাই)", phone: "+8801912345678", location: "Sunamganj", status: "danger" },
  { id: "4", name: "সাদিয়া (বোন)", phone: "+8801612345678", location: "Dhaka", status: "safe" },
];

const STATUS_COLOR: Record<string, string> = { safe: "#22c55e", warning: "#f59e0b", danger: "#ef4444" };

export default function FamilyPage() {
  const { language } = useHydronova();
  const [members, setMembers] = useState<Member[]>(INITIAL_MEMBERS);
  const [toast, setToast] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newLocation, setNewLocation] = useState("");

  const safeCount = members.filter((m) => m.status === "safe").length;
  const dangerCount = members.filter((m) => m.status === "danger").length;

  function sendAlert(name: string) {
    setToast(`${t("family.alertSent", language)} → ${name}`);
    setTimeout(() => setToast(null), 2500);
  }

  function addMember() {
    if (!newName.trim()) return;
    setMembers((prev) => [
      ...prev,
      { id: `m${Date.now()}`, name: newName, phone: newPhone, location: newLocation, status: "safe" },
    ]);
    setNewName("");
    setNewPhone("");
    setNewLocation("");
    setModalOpen(false);
  }

  return (
    <PageShell>
      <main style={{ padding: "1.5rem 1.25rem 2rem", maxWidth: 700, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem", flexWrap: "wrap", gap: 10 }}>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 800 }}>{t("family.title", language)}</h1>
          <button onClick={() => setModalOpen(true)} className="btn-primary">
            {t("family.addMember", language)}
          </button>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: "1.5rem" }}>
          <div className="card" style={{ textAlign: "center" }}>
            <p style={{ fontSize: "1.6rem", fontWeight: 800 }}>{members.length}</p>
            <p style={{ fontSize: "0.65rem", color: "rgba(230,244,251,0.5)" }}>{t("family.total", language)}</p>
          </div>
          <div className="card" style={{ textAlign: "center" }}>
            <p style={{ fontSize: "1.6rem", fontWeight: 800, color: "#22c55e" }}>{safeCount}</p>
            <p style={{ fontSize: "0.65rem", color: "rgba(230,244,251,0.5)" }}>{t("family.safe", language)}</p>
          </div>
          <div className="card" style={{ textAlign: "center" }}>
            <p style={{ fontSize: "1.6rem", fontWeight: 800, color: "#ef4444" }}>{dangerCount}</p>
            <p style={{ fontSize: "0.65rem", color: "rgba(230,244,251,0.5)" }}>{t("family.danger", language)}</p>
          </div>
        </div>

        {/* Danger banner */}
        {dangerCount > 0 && (
          <div style={{
            display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", marginBottom: "1.5rem",
            background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 12,
          }}>
            <span style={{ fontSize: "1.2rem" }}>⚠️</span>
            <p style={{ fontSize: "0.85rem", color: "#ef4444", fontWeight: 600 }}>{t("family.dangerBanner", language)}</p>
          </div>
        )}

        {/* Member list */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {members.map((m) => (
            <div key={m.id} className="card" style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ position: "relative" }}>
                <div style={{
                  width: 50, height: 50, borderRadius: "50%",
                  background: "#0a2540", border: `2.5px solid ${STATUS_COLOR[m.status]}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#fff", fontWeight: 700, fontSize: "1rem",
                  boxShadow: `0 0 12px ${STATUS_COLOR[m.status]}50`,
                }}>
                  {m.name.charAt(0)}
                </div>
                <span
                  className="pulse"
                  style={{
                    position: "absolute", bottom: -2, right: -2, width: 12, height: 12, borderRadius: "50%",
                    background: STATUS_COLOR[m.status], border: "2px solid #03152e",
                  }}
                />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontWeight: 700, color: "#fff", fontSize: "0.92rem" }}>{m.name}</p>
                <p style={{ fontSize: "0.76rem", color: "rgba(230,244,251,0.5)" }}>{m.location}</p>
                <span
                  style={{ fontSize: "0.65rem", fontWeight: 700, color: STATUS_COLOR[m.status] }}
                >
                  {t(`emergency.${m.status === "safe" ? "open" : "closed"}`, language) === t("emergency.open", language) && m.status === "safe"
                    ? t("family.safe", language)
                    : m.status === "danger" ? t("family.danger", language) : t("risk.moderate", language)}
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <button
                  onClick={() => sendAlert(m.name)}
                  style={{
                    padding: "6px 10px", borderRadius: 8, fontSize: "0.68rem", fontWeight: 600,
                    background: "rgba(14,165,233,0.1)", border: "1px solid var(--border2)", color: "#38bdf8", cursor: "pointer",
                  }}
                >
                  {t("family.sendAlert", language)}
                </button>
                <a
                  href={`tel:${m.phone}`}
                  style={{
                    padding: "6px 10px", borderRadius: 8, fontSize: "0.68rem", fontWeight: 600, textAlign: "center",
                    background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)", color: "#22c55e", textDecoration: "none",
                  }}
                >
                  {t("family.call", language)}
                </a>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed", bottom: 90, left: "50%", transform: "translateX(-50%)", zIndex: 3000,
          background: "rgba(34,197,94,0.95)", color: "#02101f", padding: "10px 20px", borderRadius: 9999,
          fontWeight: 700, fontSize: "0.85rem", boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
        }}>
          ✓ {toast}
        </div>
      )}

      {/* Add member modal */}
      {modalOpen && (
        <div onClick={() => setModalOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 2000, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "flex-end" }}>
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%", maxWidth: 480, margin: "0 auto", background: "#03152e",
              borderRadius: "20px 20px 0 0", padding: "1.5rem 1.25rem calc(1.5rem + var(--safe-bottom))",
              border: "1px solid var(--border)", borderBottom: "none",
            }}
          >
            <div style={{ width: 40, height: 4, background: "rgba(255,255,255,0.2)", borderRadius: 2, margin: "0 auto 1.25rem" }} />
            <h2 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "1.25rem" }}>{t("family.addMember", language)}</h2>

            <label style={{ fontSize: "0.72rem", color: "#7dd3fc", display: "block", marginBottom: 8 }}>{t("family.name", language)}</label>
            <input className="input" value={newName} onChange={(e) => setNewName(e.target.value)} style={{ marginBottom: 14 }} />

            <label style={{ fontSize: "0.72rem", color: "#7dd3fc", display: "block", marginBottom: 8 }}>{t("family.phone", language)}</label>
            <input className="input" value={newPhone} onChange={(e) => setNewPhone(e.target.value)} placeholder="+880" style={{ marginBottom: 14 }} />

            <label style={{ fontSize: "0.72rem", color: "#7dd3fc", display: "block", marginBottom: 8 }}>{t("family.location", language)}</label>
            <input className="input" value={newLocation} onChange={(e) => setNewLocation(e.target.value)} style={{ marginBottom: 18 }} />

            <button onClick={addMember} disabled={!newName.trim()} className="btn-primary" style={{ width: "100%" }}>
              {t("family.addMember", language)}
            </button>
          </div>
        </div>
      )}
    </PageShell>
  );
}
