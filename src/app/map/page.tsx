"use client";
import { useState } from "react";
import { useHydronova } from "@/store/hydronova";
import { t } from "@/lib/i18n/translations";
import { TopNav, BottomNav, Sidebar } from "@/components/NavShell";
import FloodMap from "@/components/map/FloodMap";

export default function MapPage() {
  const { language } = useHydronova();
  const [search, setSearch] = useState("");
  const [layers, setLayers] = useState({ rivers: true, zones: true, shelters: true, sensors: true });

  function toggleLayer(key: keyof typeof layers) {
    setLayers((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  const LAYER_ITEMS: { key: keyof typeof layers; label: string; color: string }[] = [
    { key: "rivers", label: t("map.rivers", language), color: "#38bdf8" },
    { key: "zones", label: t("map.zones", language), color: "#ef4444" },
    { key: "shelters", label: t("map.shelters", language), color: "#0ea5e9" },
    { key: "sensors", label: t("map.sensors", language), color: "#7dd3fc" },
  ];

  return (
    <>
      <TopNav />
      <Sidebar />
      <div className="main-with-sidebar" style={{ position: "relative" }}>
        {/* Search + layer bar */}
        <div style={{
          position: "absolute", top: 12, left: 12, right: 12, zIndex: 500,
          display: "flex", flexDirection: "column", gap: 8, maxWidth: 420,
        }}>
          <input
            className="input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("map.search", language)}
            style={{ background: "rgba(2,13,26,0.92)", boxShadow: "0 8px 24px rgba(0,0,0,0.4)" }}
          />
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {LAYER_ITEMS.map((item) => (
              <button
                key={item.key}
                onClick={() => toggleLayer(item.key)}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "6px 12px", borderRadius: 9999, fontSize: "0.72rem", fontWeight: 600,
                  background: layers[item.key] ? "rgba(2,13,26,0.92)" : "rgba(2,13,26,0.5)",
                  border: `1px solid ${layers[item.key] ? item.color : "rgba(255,255,255,0.1)"}`,
                  color: layers[item.key] ? item.color : "rgba(255,255,255,0.35)",
                  cursor: "pointer", boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                }}
              >
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: layers[item.key] ? item.color : "rgba(255,255,255,0.2)" }} />
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div style={{
          position: "absolute", bottom: 80, right: 12, zIndex: 500,
          background: "rgba(2,13,26,0.92)", border: "1px solid var(--border)",
          borderRadius: 12, padding: "10px 14px", boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
        }}>
          <p style={{ fontSize: "0.68rem", color: "rgba(230,244,251,0.5)", marginBottom: 6, fontWeight: 700 }}>
            {t("map.legend", language)}
          </p>
          {[
            { color: "#22c55e", label: t("risk.safe", language) },
            { color: "#f59e0b", label: t("risk.moderate", language) },
            { color: "#ef4444", label: t("risk.high", language) },
            { color: "#dc2626", label: t("risk.severe", language) },
          ].map((l) => (
            <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
              <span style={{ width: 9, height: 9, borderRadius: "50%", background: l.color }} />
              <span style={{ fontSize: "0.7rem", color: "rgba(230,244,251,0.7)" }}>{l.label}</span>
            </div>
          ))}
        </div>

        <FloodMap fullscreen layers={layers} />
      </div>
      <BottomNav />
    </>
  );
}
