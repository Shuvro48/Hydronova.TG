"use client";
import { useState, useEffect } from "react";
import { useHydronova } from "@/store/hydronova";
import { t } from "@/lib/i18n/translations";
import { PageShell } from "@/components/NavShell";

interface Report {
  id: string;
  type: "flooding" | "bridge" | "help" | "other";
  district: string;
  description_en: string;
  description_bn: string;
  status: "pending" | "verified" | "rejected";
  satellite_confirmed: boolean;
  upvotes: number;
  created_at: string;
}

const TYPE_ICON: Record<string, string> = { flooding: "💧", bridge: "🌉", help: "🆘", other: "📍" };

function timeAgo(iso: string, lang: "en" | "bn"): string {
  const diffMin = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (diffMin < 2) return t("community.justNow", lang);
  if (diffMin < 60) return lang === "bn" ? `${diffMin} মিনিট আগে` : `${diffMin}m ago`;
  const diffHr = Math.round(diffMin / 60);
  return lang === "bn" ? `${diffHr} ঘণ্টা আগে` : `${diffHr}h ago`;
}

export default function CommunityPage() {
  const { language } = useHydronova();
  const [reports, setReports] = useState<Report[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formType, setFormType] = useState<Report["type"]>("flooding");
  const [formLocation, setFormLocation] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/community")
      .then((r) => r.json())
      .then((data) => setReports(data.reports || []))
      .catch(() => {});
  }, []);

  function handlePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPhotoPreview(reader.result as string);
    reader.readAsDataURL(file);
  }

  async function submitReport() {
    if (!formLocation.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/community", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: formType,
          district: formLocation,
          description_en: formDesc,
          description_bn: formDesc,
        }),
      });
      const data = await res.json();
      if (data.report) {
        setReports((prev) => [data.report, ...prev]);
        setModalOpen(false);
        setFormLocation("");
        setFormDesc("");
        setPhotoPreview(null);
        setFormType("flooding");
      }
    } finally {
      setSubmitting(false);
    }
  }

  const verifiedCount = reports.filter((r) => r.status === "verified").length;
  const pendingCount = reports.filter((r) => r.status === "pending").length;
  const satelliteCount = reports.filter((r) => r.satellite_confirmed).length;

  return (
    <PageShell>
      <main style={{ padding: "1.5rem 1.25rem 2rem", maxWidth: 760, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem", flexWrap: "wrap", gap: 10 }}>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 800 }}>{t("community.title", language)}</h1>
          <button onClick={() => setModalOpen(true)} className="btn-primary">
            {t("community.report", language)}
          </button>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: "1.5rem" }}>
          {[
            { value: verifiedCount, label: t("community.verified", language), color: "#22c55e" },
            { value: pendingCount, label: t("community.pending", language), color: "#f59e0b" },
            { value: satelliteCount, label: t("community.satellite", language), color: "#0ea5e9" },
          ].map((s) => (
            <div key={s.label} className="card" style={{ textAlign: "center" }}>
              <p style={{ fontSize: "1.6rem", fontWeight: 800, color: s.color }}>{s.value}</p>
              <p style={{ fontSize: "0.65rem", color: "rgba(230,244,251,0.5)" }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Feed */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {reports.map((r) => (
            <div key={r.id} className="card">
              <div style={{ display: "flex", gap: 12 }}>
                <span style={{ fontSize: "1.5rem" }}>{TYPE_ICON[r.type]}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
                    <p style={{ fontWeight: 700, fontSize: "0.88rem", color: "#fff" }}>{r.district}</p>
                    <span style={{ fontSize: "0.68rem", color: "rgba(230,244,251,0.4)" }}>{timeAgo(r.created_at, language)}</span>
                  </div>
                  <p style={{ fontSize: "0.82rem", color: "rgba(230,244,251,0.65)", lineHeight: 1.6, marginBottom: 8 }}>
                    {language === "bn" ? r.description_bn : r.description_en}
                  </p>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <span className={r.status === "verified" ? "badge-live" : r.status === "pending" ? "badge-warn" : "badge-danger"}>
                      {t(`community.${r.status}`, language)}
                    </span>
                    {r.satellite_confirmed && <span className="badge-ai">🛰️ {t("community.satellite", language)}</span>}
                    <span style={{ fontSize: "0.7rem", color: "rgba(230,244,251,0.4)", alignSelf: "center" }}>▲ {r.upvotes}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Bottom sheet modal */}
      {modalOpen && (
        <div
          onClick={() => setModalOpen(false)}
          style={{ position: "fixed", inset: 0, zIndex: 2000, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "flex-end" }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%", maxWidth: 480, margin: "0 auto",
              background: "#03152e", borderRadius: "20px 20px 0 0",
              padding: "1.5rem 1.25rem calc(1.5rem + var(--safe-bottom))",
              border: "1px solid var(--border)", borderBottom: "none",
              maxHeight: "85vh", overflowY: "auto",
            }}
          >
            <div style={{ width: 40, height: 4, background: "rgba(255,255,255,0.2)", borderRadius: 2, margin: "0 auto 1.25rem" }} />
            <h2 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "1.25rem" }}>{t("community.report", language)}</h2>

            <label style={{ fontSize: "0.72rem", color: "#7dd3fc", display: "block", marginBottom: 8 }}>{t("community.type", language)}</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
              {(["flooding", "bridge", "help", "other"] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setFormType(type)}
                  style={{
                    padding: "10px", borderRadius: 10, fontSize: "0.8rem",
                    background: formType === type ? "rgba(14,165,233,0.12)" : "rgba(255,255,255,0.03)",
                    border: formType === type ? "1px solid #0ea5e9" : "1px solid var(--border)",
                    color: formType === type ? "#38bdf8" : "rgba(230,244,251,0.6)", cursor: "pointer",
                  }}
                >
                  {TYPE_ICON[type]} {t(`community.${type}`, language)}
                </button>
              ))}
            </div>

            <label style={{ fontSize: "0.72rem", color: "#7dd3fc", display: "block", marginBottom: 8 }}>{t("community.location", language)}</label>
            <input className="input" value={formLocation} onChange={(e) => setFormLocation(e.target.value)} placeholder="e.g. Sylhet — Zindabazar" style={{ marginBottom: 16 }} />

            <label style={{ fontSize: "0.72rem", color: "#7dd3fc", display: "block", marginBottom: 8 }}>{t("community.description", language)}</label>
            <textarea
              className="input" value={formDesc} onChange={(e) => setFormDesc(e.target.value)}
              rows={3} style={{ marginBottom: 16, paddingTop: 12, resize: "vertical" }}
            />

            <label style={{ fontSize: "0.72rem", color: "#7dd3fc", display: "block", marginBottom: 8 }}>{t("community.photo", language)}</label>
            <input type="file" accept="image/*" onChange={handlePhoto} style={{ marginBottom: 8, fontSize: "0.8rem", color: "rgba(230,244,251,0.6)" }} />
            {photoPreview && (
              <img src={photoPreview} alt="preview" style={{ width: "100%", maxHeight: 160, objectFit: "cover", borderRadius: 10, marginBottom: 16 }} />
            )}

            <button onClick={submitReport} disabled={submitting || !formLocation.trim()} className="btn-primary" style={{ width: "100%" }}>
              {submitting ? "..." : t("community.submit", language)}
            </button>
          </div>
        </div>
      )}
    </PageShell>
  );
}
