"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Lang } from "@/lib/i18n/translations";

export type Mode = "citizen" | "expert";

interface HydronovaStore {
  language: Lang;
  mode: Mode;
  riskScore: number;
  setLanguage: (lang: Lang) => void;
  toggleLanguage: () => void;
  setMode: (mode: Mode) => void;
  setRiskScore: (score: number) => void;
}

export const useHydronova = create<HydronovaStore>()(
  persist(
    (set, get) => ({
      language: "bn",
      mode: "citizen",
      riskScore: 68,
      setLanguage: (lang) => set({ language: lang }),
      toggleLanguage: () => set({ language: get().language === "en" ? "bn" : "en" }),
      setMode: (mode) => set({ mode }),
      setRiskScore: (score) => set({ riskScore: score }),
    }),
    {
      name: "hydronova-store",
      partialize: (state) => ({ language: state.language, mode: state.mode }),
    }
  )
);
