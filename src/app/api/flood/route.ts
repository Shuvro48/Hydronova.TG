import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

interface DistrictRisk {
  district: string;
  lat: number;
  lng: number;
  score: number;
  level: "safe" | "moderate" | "high" | "severe";
  confidence: number;
  trend: "rising" | "falling" | "stable";
  explanation: { en: string; bn: string };
  factors: { rainfall: number; soil: number; river: number; upstream: number };
}

const FALLBACK_DATA: DistrictRisk[] = [
  {
    district: "Sylhet", lat: 24.8949, lng: 91.8687, score: 68, level: "high", confidence: 87, trend: "rising",
    explanation: {
      en: "River levels rising due to upstream rainfall in Meghalaya hills.",
      bn: "মেঘালয় পাহাড়ে উজানে বৃষ্টিপাতের কারণে নদীর পানি বৃদ্ধি পাচ্ছে।",
    },
    factors: { rainfall: 78, soil: 65, river: 72, upstream: 80 },
  },
  {
    district: "Sunamganj", lat: 25.0658, lng: 91.395, score: 74, level: "high", confidence: 84, trend: "rising",
    explanation: { en: "Haor areas experiencing rapid water accumulation.", bn: "হাওর এলাকায় দ্রুত পানি জমা হচ্ছে।" },
    factors: { rainfall: 82, soil: 70, river: 75, upstream: 77 },
  },
  {
    district: "Mymensingh", lat: 24.7471, lng: 90.4203, score: 45, level: "moderate", confidence: 76, trend: "stable",
    explanation: { en: "Brahmaputra levels stable but elevated for the season.", bn: "ব্রহ্মপুত্রের পানি স্থিতিশীল কিন্তু মৌসুমের জন্য উচ্চ।" },
    factors: { rainfall: 50, soil: 48, river: 44, upstream: 42 },
  },
  {
    district: "Dhaka", lat: 23.8103, lng: 90.4125, score: 28, level: "safe", confidence: 85, trend: "falling",
    explanation: { en: "Buriganga and surrounding rivers within normal range.", bn: "বুড়িগঙ্গা ও আশেপাশের নদী স্বাভাবিক পরিসরে আছে।" },
    factors: { rainfall: 30, soil: 25, river: 26, upstream: 22 },
  },
  {
    district: "Jamalpur", lat: 25.209, lng: 89.945, score: 58, level: "moderate", confidence: 80, trend: "rising",
    explanation: { en: "Jamuna char areas seeing gradual water rise.", bn: "যমুনা চর এলাকায় ধীরে ধীরে পানি বৃদ্ধি পাচ্ছে।" },
    factors: { rainfall: 60, soil: 58, river: 55, upstream: 62 },
  },
];

const LEVEL_THRESHOLDS = { safe: 35, moderate: 60, high: 80 };

function scoreToLevel(score: number): DistrictRisk["level"] {
  if (score < LEVEL_THRESHOLDS.safe) return "safe";
  if (score < LEVEL_THRESHOLDS.moderate) return "moderate";
  if (score < LEVEL_THRESHOLDS.high) return "high";
  return "severe";
}

async function fetchOpenMeteo(lat: number, lng: number) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&hourly=precipitation,rain,relative_humidity_2m,wind_speed_10m&daily=rain_sum&forecast_days=3&timezone=Asia/Dhaka`;
  const res = await fetch(url, { next: { revalidate: 600 } });
  if (!res.ok) throw new Error("Open-Meteo request failed");
  return res.json();
}

function computeRiskScore(weather: any, geoBaseRisk: number): number {
  try {
    const hourlyRain: number[] = weather?.hourly?.rain ?? [];
    const next6h = hourlyRain.slice(0, 6);
    const rain6h = next6h.reduce((sum: number, v: number) => sum + (v || 0), 0);
    const humidity: number[] = weather?.hourly?.relative_humidity_2m ?? [];
    const avgHumidity = humidity.length ? humidity.slice(0, 6).reduce((s, v) => s + v, 0) / Math.min(6, humidity.length) : 60;

    const rainScore = Math.min(100, rain6h * 8); // 8 points per mm, capped
    const humidityScore = Math.min(100, avgHumidity);

    const score = rainScore * 0.6 + humidityScore * 0.2 + geoBaseRisk * 0.2;
    return Math.round(Math.max(0, Math.min(100, score)));
  } catch {
    return geoBaseRisk;
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");
  const district = searchParams.get("district");

  // Single district lookup with live weather
  if (lat && lng) {
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);
    const baseline = FALLBACK_DATA.find(
      (d) => Math.abs(d.lat - latitude) < 0.5 && Math.abs(d.lng - longitude) < 0.5
    );
    const geoBaseRisk = baseline?.score ?? 40;

    try {
      const weather = await fetchOpenMeteo(latitude, longitude);
      const score = computeRiskScore(weather, geoBaseRisk);
      const level = scoreToLevel(score);

      return NextResponse.json({
        district: district || baseline?.district || "Unknown",
        lat: latitude,
        lng: longitude,
        score,
        level,
        confidence: 88,
        trend: score > geoBaseRisk ? "rising" : score < geoBaseRisk ? "falling" : "stable",
        explanation: baseline?.explanation ?? {
          en: "Risk computed from live rainfall and humidity data.",
          bn: "লাইভ বৃষ্টিপাত ও আর্দ্রতার তথ্য থেকে ঝুঁকি গণনা করা হয়েছে।",
        },
        factors: baseline?.factors ?? { rainfall: score, soil: score * 0.8, river: score * 0.9, upstream: score * 0.85 },
        weather: {
          rain_next_6h_mm: weather?.hourly?.rain?.slice(0, 6).reduce((s: number, v: number) => s + (v || 0), 0) ?? 0,
          humidity_pct: weather?.hourly?.relative_humidity_2m?.[0] ?? null,
        },
        source: "live",
      });
    } catch {
      return NextResponse.json({
        ...(baseline ?? FALLBACK_DATA[0]),
        source: "fallback",
      });
    }
  }

  // All districts overview
  return NextResponse.json({ districts: FALLBACK_DATA, source: "fallback" });
}
