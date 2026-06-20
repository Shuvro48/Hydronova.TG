"use client";
import { useState, useRef, useEffect } from "react";
import { useHydronova } from "@/store/hydronova";
import { t } from "@/lib/i18n/translations";
import { PageShell } from "@/components/NavShell";

interface Message {
  role: "user" | "assistant";
  content: string;
}

function TypingDots() {
  return (
    <div style={{ display: "flex", gap: 4, padding: "10px 14px" }}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="pulse"
          style={{
            width: 6, height: 6, borderRadius: "50%", background: "#38bdf8",
            animationDelay: `${i * 0.2}s`,
          }}
        />
      ))}
    </div>
  );
}

export default function FloodGPTPage() {
  const { language } = useHydronova();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const QUICK_PROMPTS = [
    t("gpt.quick1", language),
    t("gpt.quick2", language),
    t("gpt.quick3", language),
    t("gpt.quick4", language),
  ];

  async function sendMessage(text?: string) {
    const messageText = (text ?? input).trim();
    if (!messageText || loading) return;

    const userMsg: Message = { role: "user", content: messageText };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/floodgpt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: messageText,
          language,
          history: messages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: language === "bn" ? "ত্রুটি ঘটেছে। আবার চেষ্টা করুন।" : "Something went wrong. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageShell>
      <main style={{ display: "flex", flexDirection: "column", height: "calc(100dvh - 56px)", maxWidth: 760, margin: "0 auto", padding: "0 1rem" }}>
        {/* Header */}
        <div style={{ padding: "1.25rem 0 0.75rem", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12,
            background: "linear-gradient(135deg, #7c3aed, #4fc3f7)",
            display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, color: "#fff",
          }}>
            H
          </div>
          <div>
            <h1 style={{ fontSize: "1.05rem", fontWeight: 700 }}>{t("gpt.title", language)}</h1>
            <p style={{ fontSize: "0.72rem", color: "rgba(230,244,251,0.45)" }}>{t("gpt.subtitle", language)}</p>
          </div>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: "auto", padding: "0.5rem 0 1rem" }}>
          {messages.length === 0 && (
            <div style={{ marginBottom: "1.5rem" }}>
              <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 10, flexShrink: 0,
                  background: "linear-gradient(135deg, #7c3aed, #4fc3f7)",
                  display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, color: "#fff", fontSize: "0.78rem",
                }}>
                  H
                </div>
                <div className="card" style={{ flex: 1 }}>
                  <p style={{ fontSize: "0.85rem", lineHeight: 1.7, color: "rgba(230,244,251,0.85)" }}>
                    {t("gpt.welcome", language)}
                  </p>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {QUICK_PROMPTS.map((p) => (
                  <button
                    key={p}
                    onClick={() => sendMessage(p)}
                    style={{
                      padding: "10px 12px", borderRadius: 10, fontSize: "0.78rem", textAlign: "left",
                      background: "rgba(14,165,233,0.06)", border: "1px solid var(--border)",
                      color: "rgba(230,244,251,0.75)", cursor: "pointer",
                    }}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} style={{ display: "flex", gap: 10, marginBottom: 16, flexDirection: msg.role === "user" ? "row-reverse" : "row" }}>
              <div style={{
                width: 32, height: 32, borderRadius: 10, flexShrink: 0,
                background: msg.role === "assistant" ? "linear-gradient(135deg, #7c3aed, #4fc3f7)" : "#0a2540",
                border: msg.role === "user" ? "1px solid var(--border2)" : "none",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontWeight: 800, color: "#fff", fontSize: "0.78rem",
              }}>
                {msg.role === "assistant" ? "H" : "U"}
              </div>
              <div
                className={msg.role === "assistant" ? "card" : ""}
                style={{
                  maxWidth: "78%", padding: msg.role === "user" ? "10px 14px" : undefined,
                  borderRadius: 14,
                  background: msg.role === "user" ? "rgba(14,165,233,0.1)" : undefined,
                  border: msg.role === "user" ? "1px solid var(--border2)" : undefined,
                }}
              >
                <p style={{ fontSize: "0.85rem", lineHeight: 1.7, color: "rgba(230,244,251,0.9)", whiteSpace: "pre-wrap" }}>
                  {msg.content}
                </p>
              </div>
            </div>
          ))}

          {loading && (
            <div style={{ display: "flex", gap: 10 }}>
              <div style={{
                width: 32, height: 32, borderRadius: 10, flexShrink: 0,
                background: "linear-gradient(135deg, #7c3aed, #4fc3f7)",
                display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, color: "#fff", fontSize: "0.78rem",
              }}>
                H
              </div>
              <div className="card" style={{ padding: 0 }}>
                <TypingDots />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div style={{ padding: "0.75rem 0 1rem", display: "flex", gap: 8 }}>
          <input
            className="input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder={t("gpt.placeholder", language)}
          />
          <button onClick={() => sendMessage()} disabled={loading || !input.trim()} className="btn-primary" style={{ paddingInline: 18 }}>
            ➤
          </button>
        </div>
      </main>
    </PageShell>
  );
}
