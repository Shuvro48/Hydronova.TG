import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

const SYSTEM_PROMPT = `You are FloodGPT, an AI flood safety assistant for Bangladesh, built into the Hydronova platform.

Rules:
- Respond in the SAME language the user wrote in (English or Bangla/Bengali). Detect this from their message.
- You know Bangladesh's major rivers (Padma, Jamuna, Meghna, Surma, Kushiyara, Brahmaputra, Teesta) and flood-prone districts (Sylhet, Sunamganj, Jamalpur, Kurigram, Mymensingh, Bogura, Gaibandha).
- Give specific, practical advice: which shelter to head to, what route to take, what to pack, when to leave.
- Understand regional Bangla phrasing and respond naturally — not overly formal.
- If asked about current risk in an area, give a realistic estimate and recommend checking the live Dashboard for exact numbers.
- Always prioritize life safety. If someone describes an active emergency, tell them to call 1090 (national disaster helpline) or 999 immediately, in addition to your advice.
- Keep responses focused and actionable — this is a safety tool, not a casual chatbot.`;

const FALLBACKS = {
  en: {
    risk: "Based on current monitoring, river levels in northeastern districts (Sylhet, Sunamganj) are elevated due to upstream rainfall. Check the Dashboard for live risk scores in your specific district. If you're in a flood-prone area, keep your emergency bag ready and monitor official alerts.",
    shelter: "The nearest shelters are typically schools, community centers, or cyclone shelters. Open the Map page and tap the shelter icons (blue dots) to see capacity and open/closed status near your location. In an emergency, the national helpline 1090 can also direct you to the closest open shelter.",
    prepare: "To prepare for flooding: 1) Keep a waterproof bag with documents, cash, and medicines. 2) Store dry food and water for 3 days. 3) Charge your phone and have a power bank. 4) Know your nearest shelter location. 5) Save the family's contact numbers and a meeting point if separated. Check our Emergency page for a full checklist.",
    route: "Safe evacuation routes depend on your exact location. Generally: move to higher ground away from riverbanks, avoid crossing flowing water on foot or by vehicle, and follow official evacuation routes announced by local authorities. Open the Map page to see real-time flood zones and plan a route avoiding them.",
    default: "I'm FloodGPT, here to help with flood safety in Bangladesh. You can ask me about flood risk in your area, the nearest shelters, evacuation routes, or how to prepare your family. For real-time numbers, check the Dashboard page.",
  },
  bn: {
    risk: "বর্তমান পর্যবেক্ষণ অনুযায়ী, উজানের বৃষ্টিপাতের কারণে উত্তরপূর্ব জেলাগুলোতে (সিলেট, সুনামগঞ্জ) নদীর পানি বৃদ্ধি পেয়েছে। আপনার নির্দিষ্ট জেলার লাইভ ঝুঁকি স্কোরের জন্য ড্যাশবোর্ড চেক করুন। আপনি যদি বন্যাপ্রবণ এলাকায় থাকেন, আপনার জরুরি ব্যাগ প্রস্তুত রাখুন এবং সরকারি সতর্কতা পর্যবেক্ষণ করুন।",
    shelter: "নিকটস্থ আশ্রয়কেন্দ্রগুলো সাধারণত স্কুল, কমিউনিটি সেন্টার বা ঘূর্ণিঝড় আশ্রয়কেন্দ্র। মানচিত্র পেজ খুলুন এবং আপনার অবস্থানের কাছে আশ্রয়কেন্দ্রের আইকনে (নীল বিন্দু) ট্যাপ করে ধারণক্ষমতা ও খোলা/বন্ধ অবস্থা দেখুন। জরুরি অবস্থায় জাতীয় হেল্পলাইন ১০৯০ আপনাকে নিকটস্থ খোলা আশ্রয়কেন্দ্রে দিকনির্দেশ দিতে পারে।",
    prepare: "বন্যার জন্য প্রস্তুতি: ১) ডকুমেন্ট, নগদ টাকা ও ওষুধ সহ একটি জলরোধী ব্যাগ রাখুন। ২) ৩ দিনের জন্য শুকনো খাবার ও পানি সংরক্ষণ করুন। ৩) ফোন চার্জ রাখুন এবং পাওয়ার ব্যাংক রাখুন। ৪) নিকটস্থ আশ্রয়কেন্দ্রের অবস্থান জানুন। ৫) পরিবারের যোগাযোগ নম্বর সংরক্ষণ করুন। সম্পূর্ণ তালিকার জন্য আমাদের জরুরি পেজ দেখুন।",
    route: "নিরাপদ উচ্ছেদ পথ আপনার সঠিক অবস্থানের উপর নির্ভর করে। সাধারণভাবে: নদীর তীর থেকে দূরে উঁচু স্থানে যান, পায়ে বা গাড়িতে প্রবাহিত পানি অতিক্রম করা এড়িয়ে চলুন এবং স্থানীয় কর্তৃপক্ষের ঘোষিত উচ্ছেদ পথ অনুসরণ করুন। বাস্তব-সময়ের বন্যা অঞ্চল দেখতে মানচিত্র পেজ খুলুন।",
    default: "আমি ফ্লাডজিপিটি, বাংলাদেশে বন্যা নিরাপত্তায় সাহায্য করার জন্য এখানে আছি। আপনি আমাকে আপনার এলাকার বন্যার ঝুঁকি, নিকটস্থ আশ্রয়কেন্দ্র, উচ্ছেদ পথ বা পরিবারের প্রস্তুতি সম্পর্কে জিজ্ঞাসা করতে পারেন। রিয়েল-টাইম পরিসংখ্যানের জন্য ড্যাশবোর্ড পেজ চেক করুন।",
  },
};

function detectLanguage(message: string): "en" | "bn" {
  const bengaliPattern = /[\u0980-\u09FF]/;
  return bengaliPattern.test(message) ? "bn" : "en";
}

function getFallbackResponse(message: string, lang: "en" | "bn"): string {
  const lower = message.toLowerCase();
  const set = FALLBACKS[lang];

  if (/risk|danger|ঝুঁকি|বিপদ|safe|নিরাপদ/.test(lower)) return set.risk;
  if (/shelter|আশ্রয়|center|কেন্দ্র/.test(lower)) return set.shelter;
  if (/prepare|ready|প্রস্তুত|checklist|তালিকা/.test(lower)) return set.prepare;
  if (/route|evacuat|পথ|উচ্ছেদ|escape/.test(lower)) return set.route;
  return set.default;
}

export async function POST(req: NextRequest) {
  try {
    const { message, language, history } = await req.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const detectedLang = language === "en" || language === "bn" ? language : detectLanguage(message);
    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (apiKey) {
      try {
        const messages = [
          ...(Array.isArray(history) ? history.slice(-8) : []),
          { role: "user", content: message },
        ];

        const response = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "x-api-key": apiKey,
            "anthropic-version": "2023-06-01",
            "content-type": "application/json",
          },
          body: JSON.stringify({
            model: "claude-sonnet-4-20250514",
            max_tokens: 600,
            system: SYSTEM_PROMPT,
            messages,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const reply = data.content?.[0]?.text;
          if (reply) {
            return NextResponse.json({ reply, source: "ai" });
          }
        }
      } catch {
        // fall through to fallback response below
      }
    }

    const reply = getFallbackResponse(message, detectedLang);
    return NextResponse.json({ reply, source: "fallback" });
  } catch {
    return NextResponse.json(
      { reply: "Something went wrong. Please try again, or call 1090 for urgent help.", source: "error" },
      { status: 200 }
    );
  }
}
