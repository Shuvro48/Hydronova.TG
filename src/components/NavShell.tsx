"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useHydronova } from "@/store/hydronova";
import { t } from "@/lib/i18n/translations";
import { useState } from "react";

const NAV_ITEMS = [
  { href: "/", key: "nav.home", icon: "🏠" },
  { href: "/dashboard", key: "nav.dashboard", icon: "📊" },
  { href: "/map", key: "nav.map", icon: "🗺️" },
  { href: "/floodgpt", key: "nav.floodgpt", icon: "🤖" },
  { href: "/community", key: "nav.community", icon: "👥" },
  { href: "/family", key: "nav.family", icon: "👨‍👩‍👧" },
  { href: "/emergency", key: "nav.emergency", icon: "🆘" },
];

const BOTTOM_ITEMS = [
  { href: "/", key: "nav.home", icon: "🏠" },
  { href: "/dashboard", key: "nav.dashboard", icon: "📊" },
  { href: "/map", key: "nav.map", icon: "🗺️" },
  { href: "/floodgpt", key: "nav.floodgpt", icon: "🤖" },
  { href: "/emergency", key: "nav.emergency", icon: "🆘" },
];

function WaveLogo() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <circle cx="14" cy="14" r="13" fill="#0a2540" stroke="#0ea5e9" strokeWidth="1.5" />
      <path d="M5 15c2-2 4-2 6 0s4 2 6 0 4-2 6 0" stroke="#38bdf8" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <path d="M5 19c2-2 4-2 6 0s4 2 6 0 4-2 6 0" stroke="#7dd3fc" strokeWidth="1.8" fill="none" strokeLinecap="round" opacity="0.6" />
    </svg>
  );
}

export function TopNav({ showHamburger = true }: { showHamburger?: boolean }) {
  const { language, toggleLanguage } = useHydronova();
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <nav className="nav">
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
          <WaveLogo />
          <span style={{ fontWeight: 800, fontSize: "1rem", color: "#fff" }}>{t("appName", language)}</span>
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button
            onClick={toggleLanguage}
            style={{
              padding: "6px 12px", borderRadius: 8, fontSize: "0.75rem", fontWeight: 700,
              background: "rgba(14,165,233,0.1)", border: "1px solid var(--border2)",
              color: "#38bdf8", cursor: "pointer",
            }}
          >
            {language === "en" ? "বাং" : "EN"}
          </button>
          {showHamburger && (
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
              style={{
                display: "flex", flexDirection: "column", gap: 4, padding: 8,
                background: "transparent", border: "none", cursor: "pointer",
              }}
              className="lg:hidden"
            >
              <span style={{ width: 22, height: 2, background: "#38bdf8", display: "block" }} />
              <span style={{ width: 22, height: 2, background: "#38bdf8", display: "block" }} />
              <span style={{ width: 22, height: 2, background: "#38bdf8", display: "block" }} />
            </button>
          )}
        </div>
      </nav>

      {menuOpen && (
        <div
          style={{
            position: "fixed", top: 56, left: 0, right: 0, zIndex: 999,
            background: "rgba(2,13,26,0.98)", backdropFilter: "blur(20px)",
            borderBottom: "1px solid var(--border)",
            padding: "1rem 1.25rem 1.5rem",
            display: "flex", flexDirection: "column", gap: 6,
          }}
        >
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "12px 14px", borderRadius: 10, textDecoration: "none",
                color: pathname === item.href ? "#38bdf8" : "rgba(230,244,251,0.7)",
                background: pathname === item.href ? "rgba(14,165,233,0.1)" : "transparent",
              }}
            >
              <span>{item.icon}</span>
              <span style={{ fontSize: "0.9rem" }}>{t(item.key, language)}</span>
            </Link>
          ))}
          <Link
            href="/auth"
            onClick={() => setMenuOpen(false)}
            className="btn-primary"
            style={{ marginTop: 8, justifyContent: "center" }}
          >
            {t("nav.signin", language)}
          </Link>
        </div>
      )}
    </>
  );
}

export function Sidebar() {
  const { language } = useHydronova();
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      {NAV_ITEMS.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`sidebar-item ${pathname === item.href ? "active" : ""}`}
        >
          <span>{item.icon}</span>
          <span>{t(item.key, language)}</span>
        </Link>
      ))}
      <div style={{ flex: 1 }} />
      <Link href="/auth" className="btn-primary" style={{ justifyContent: "center" }}>
        {t("nav.signin", language)}
      </Link>
    </aside>
  );
}

export function BottomNav() {
  const { language } = useHydronova();
  const pathname = usePathname();

  return (
    <nav className="bottom-nav">
      {BOTTOM_ITEMS.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`bottom-nav-item ${pathname === item.href ? "active" : ""}`}
        >
          <span style={{ fontSize: "1.1rem" }}>{item.icon}</span>
          <span>{t(item.key, language)}</span>
        </Link>
      ))}
    </nav>
  );
}

export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TopNav />
      <Sidebar />
      <div className="main-with-sidebar has-bottom-nav">{children}</div>
      <BottomNav />
    </>
  );
}
