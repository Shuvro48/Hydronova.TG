import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

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

const MOCK_REPORTS: Report[] = [
  {
    id: "r1",
    type: "flooding",
    district: "Sylhet — Zindabazar",
    description_en: "Water has entered the main road near Zindabazar market. About knee-deep, rising slowly.",
    description_bn: "জিন্দাবাজার বাজারের কাছে মূল রাস্তায় পানি ঢুকেছে। হাঁটু সমান, ধীরে ধীরে বাড়ছে।",
    status: "verified",
    satellite_confirmed: true,
    upvotes: 34,
    created_at: new Date(Date.now() - 1000 * 60 * 40).toISOString(),
  },
  {
    id: "r2",
    type: "bridge",
    district: "Sunamganj — Dowarabazar",
    description_en: "Small bridge connecting Dowarabazar to the highway has partially collapsed. Avoid this route.",
    description_bn: "দোয়ারাবাজারকে হাইওয়ের সাথে সংযুক্ত করা ছোট সেতুটি আংশিকভাবে ভেঙে পড়েছে। এই রুট এড়িয়ে চলুন।",
    status: "verified",
    satellite_confirmed: false,
    upvotes: 51,
    created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
  },
  {
    id: "r3",
    type: "help",
    district: "Mymensingh — Trishal",
    description_en: "Elderly family stranded on rooftop, water rising. Need boat assistance.",
    description_bn: "বয়স্ক পরিবার ছাদে আটকা, পানি বাড়ছে। নৌকার সাহায্য প্রয়োজন।",
    status: "pending",
    satellite_confirmed: false,
    upvotes: 12,
    created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
  },
];

const reportStore: Report[] = [...MOCK_REPORTS];

export async function GET() {
  return NextResponse.json({ reports: reportStore });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, district, description_en, description_bn } = body;

    if (!type || !district) {
      return NextResponse.json({ error: "type and district are required" }, { status: 400 });
    }

    const newReport: Report = {
      id: `r${Date.now()}`,
      type,
      district,
      description_en: description_en || "",
      description_bn: description_bn || "",
      status: "pending",
      satellite_confirmed: false,
      upvotes: 0,
      created_at: new Date().toISOString(),
    };

    reportStore.unshift(newReport);

    return NextResponse.json({ report: newReport }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
