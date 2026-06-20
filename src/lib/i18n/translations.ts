export type Lang = "en" | "bn";

export const translations = {
  appName: { en: "Hydronova", bn: "হাইড্রোনোভা" },
  tagline: {
    en: "Bangladesh's National Flood Intelligence OS",
    bn: "বাংলাদেশের জাতীয় বন্যা বুদ্ধিমত্তা প্ল্যাটফর্ম",
  },
  founder: { en: "Founded by Abuhena Shuvro", bn: "প্রতিষ্ঠাতা: আবুহেনা শুভ্র" },

  nav: {
    home: { en: "Home", bn: "হোম" },
    dashboard: { en: "Dashboard", bn: "ড্যাশবোর্ড" },
    map: { en: "Map", bn: "মানচিত্র" },
    floodgpt: { en: "FloodGPT", bn: "ফ্লাডজিপিটি" },
    community: { en: "Community", bn: "কমিউনিটি" },
    family: { en: "Family", bn: "পরিবার" },
    emergency: { en: "SOS", bn: "এসওএস" },
    signin: { en: "Sign in", bn: "প্রবেশ করুন" },
  },

  mode: {
    citizen: { en: "Citizen", bn: "নাগরিক" },
    expert: { en: "Expert", bn: "বিশেষজ্ঞ" },
  },

  risk: {
    score: { en: "Risk Score", bn: "ঝুঁকি স্কোর" },
    confidence: { en: "Confidence", bn: "নিশ্চয়তা" },
    trend: { en: "Trend", bn: "প্রবণতা" },
    safe: { en: "Safe", bn: "নিরাপদ" },
    moderate: { en: "Moderate", bn: "মধ্যম" },
    high: { en: "High", bn: "উচ্চ" },
    severe: { en: "Severe", bn: "তীব্র" },
    rising: { en: "Rising", bn: "বৃদ্ধিশীল" },
    falling: { en: "Falling", bn: "কমছে" },
    stable: { en: "Stable", bn: "স্থিতিশীল" },
    rainfall: { en: "Rainfall", bn: "বৃষ্টিপাত" },
    soil: { en: "Soil Saturation", bn: "মাটির স্যাচুরেশন" },
    river: { en: "River Level", bn: "নদীর স্তর" },
    upstream: { en: "Upstream Flow", bn: "উজান প্রবাহ" },
  },

  pred: {
    title: { en: "Flood Prediction", bn: "বন্যার পূর্বাভাস" },
    "30min": { en: "30 min", bn: "৩০ মিনিট" },
    "1hr": { en: "1 hour", bn: "১ ঘণ্টা" },
    "6hr": { en: "6 hours", bn: "৬ ঘণ্টা" },
    "24hr": { en: "24 hours", bn: "২৪ ঘণ্টা" },
  },

  twin: {
    title: { en: "Digital Twin", bn: "ডিজিটাল টুইন" },
    waterLevel: { en: "Water Level", bn: "পানির স্তর" },
    flowRate: { en: "Flow Rate", bn: "প্রবাহের হার" },
    rainfall: { en: "Rainfall", bn: "বৃষ্টিপাত" },
    sensorHealth: { en: "Sensor Network Health", bn: "সেন্সর নেটওয়ার্ক স্বাস্থ্য" },
  },

  map: {
    title: { en: "Hyperlocal Flood Map", bn: "হাইপারলোকাল বন্যা মানচিত্র" },
    search: { en: "Search village, school, hospital...", bn: "গ্রাম, স্কুল, হাসপাতাল খুঁজুন..." },
    rivers: { en: "Rivers", bn: "নদী" },
    zones: { en: "Flood Zones", bn: "বন্যা অঞ্চল" },
    shelters: { en: "Shelters", bn: "আশ্রয়কেন্দ্র" },
    sensors: { en: "Sensors", bn: "সেন্সর" },
    legend: { en: "Legend", bn: "সূচক" },
  },

  gpt: {
    title: { en: "FloodGPT", bn: "ফ্লাডজিপিটি" },
    subtitle: { en: "Your AI flood safety assistant", bn: "আপনার AI বন্যা নিরাপত্তা সহায়ক" },
    placeholder: { en: "Ask about flood risk, shelters, routes...", bn: "বন্যার ঝুঁকি, আশ্রয়কেন্দ্র, রুট সম্পর্কে জিজ্ঞাসা করুন..." },
    welcome: {
      en: "Hello! I'm FloodGPT, your AI flood safety assistant for Bangladesh. Ask me about flood risk in your area, nearby shelters, safe evacuation routes, or how to prepare your family.",
      bn: "হ্যালো! আমি ফ্লাডজিপিটি, বাংলাদেশের জন্য আপনার AI বন্যা নিরাপত্তা সহায়ক। আপনার এলাকার বন্যার ঝুঁকি, নিকটস্থ আশ্রয়কেন্দ্র, নিরাপদ উচ্ছেদ পথ সম্পর্কে আমাকে জিজ্ঞাসা করুন।",
    },
    quick1: { en: "Is my area at risk?", bn: "আমার এলাকা কি ঝুঁকিতে আছে?" },
    quick2: { en: "Nearest shelter?", bn: "নিকটস্থ আশ্রয়কেন্দ্র কোথায়?" },
    quick3: { en: "How to prepare?", bn: "কীভাবে প্রস্তুতি নেব?" },
    quick4: { en: "Safe evacuation route?", bn: "নিরাপদ উচ্ছেদ পথ?" },
  },

  community: {
    title: { en: "Community Reports", bn: "কমিউনিটি রিপোর্ট" },
    verified: { en: "Verified", bn: "যাচাইকৃত" },
    pending: { en: "Pending", bn: "অপেক্ষমান" },
    satellite: { en: "Satellite Confirmed", bn: "স্যাটেলাইট নিশ্চিত" },
    report: { en: "+ Report Flood", bn: "+ বন্যার রিপোর্ট করুন" },
    type: { en: "Report Type", bn: "রিপোর্টের ধরন" },
    flooding: { en: "Flooding", bn: "জলাবদ্ধতা" },
    bridge: { en: "Bridge/Road Damage", bn: "সেতু/রাস্তা ক্ষতি" },
    help: { en: "Need Help", bn: "সাহায্য প্রয়োজন" },
    other: { en: "Other", bn: "অন্যান্য" },
    location: { en: "Location", bn: "অবস্থান" },
    description: { en: "Description", bn: "বিবরণ" },
    photo: { en: "Add Photo", bn: "ছবি যুক্ত করুন" },
    submit: { en: "Submit Report", bn: "রিপোর্ট জমা দিন" },
    justNow: { en: "Just now", bn: "এইমাত্র" },
  },

  family: {
    title: { en: "Family Safety Circles", bn: "পারিবারিক নিরাপত্তা চক্র" },
    total: { en: "Total Members", bn: "মোট সদস্য" },
    safe: { en: "Safe", bn: "নিরাপদ" },
    danger: { en: "In Danger", bn: "বিপদে আছে" },
    dangerBanner: { en: "Family member in danger zone!", bn: "পরিবারের সদস্য বিপদ অঞ্চলে!" },
    sendAlert: { en: "Send Alert", bn: "সতর্কতা পাঠান" },
    call: { en: "Call", bn: "কল করুন" },
    addMember: { en: "+ Add Member", bn: "+ সদস্য যুক্ত করুন" },
    name: { en: "Name", bn: "নাম" },
    phone: { en: "Phone", bn: "ফোন" },
    location: { en: "Location", bn: "অবস্থান" },
    alertSent: { en: "Alert sent!", bn: "সতর্কতা পাঠানো হয়েছে!" },
  },

  emergency: {
    title: { en: "Emergency SOS", bn: "জরুরি এসওএস" },
    sosButton: { en: "SOS", bn: "এসওএস" },
    sosHint: { en: "Press and hold for emergency", bn: "জরুরি অবস্থার জন্য চেপে ধরুন" },
    sending: { en: "Sending your location...", bn: "আপনার অবস্থান পাঠানো হচ্ছে..." },
    sent: { en: "SOS Sent! Help is on the way.", bn: "এসওএস পাঠানো হয়েছে! সাহায্য আসছে।" },
    helpline: { en: "National Helpline: 1090", bn: "জাতীয় হেল্পলাইন: ১০৯০" },
    contacts: { en: "Emergency Contacts", bn: "জরুরি যোগাযোগ" },
    shelters: { en: "Nearby Shelters", bn: "নিকটস্থ আশ্রয়কেন্দ্র" },
    checklist: { en: "Preparation Checklist", bn: "প্রস্তুতি তালিকা" },
    distance: { en: "away", bn: "দূরে" },
    capacity: { en: "capacity", bn: "ধারণক্ষমতা" },
    open: { en: "Open", bn: "খোলা" },
    closed: { en: "Closed", bn: "বন্ধ" },
  },

  auth: {
    welcomeBack: { en: "Welcome back", bn: "স্বাগতম ফিরে এসেছেন" },
    createAccount: { en: "Create account", bn: "অ্যাকাউন্ট তৈরি করুন" },
    signin: { en: "Sign in", bn: "প্রবেশ করুন" },
    signup: { en: "Sign up", bn: "নিবন্ধন করুন" },
    email: { en: "EMAIL", bn: "ইমেইল ঠিকানা" },
    password: { en: "PASSWORD", bn: "পাসওয়ার্ড" },
    fullName: { en: "FULL NAME", bn: "আপনার নাম" },
    phone: { en: "PHONE (OPTIONAL)", bn: "ফোন (ঐচ্ছিক)" },
    forgotPassword: { en: "Forgot password?", bn: "পাসওয়ার্ড ভুলে গেছেন?" },
    resetPassword: { en: "Reset Password", bn: "পাসওয়ার্ড রিসেট করুন" },
    resetHint: { en: "Enter your email and we'll send a reset link", bn: "আপনার ইমেইল লিখুন, আমরা একটি রিসেট লিংক পাঠাব" },
    sendResetLink: { en: "Send reset link", bn: "রিসেট লিংক পাঠান" },
    backToSignin: { en: "← Back to sign in", bn: "← প্রবেশ পৃষ্ঠায় ফিরে যান" },
    spamHint: { en: "Check your spam folder if you don't see the email within a few minutes.", bn: "কয়েক মিনিটের মধ্যে ইমেইল না পেলে স্প্যাম ফোল্ডার চেক করুন।" },
    continueAsGuest: { en: "Continue as guest", bn: "অতিথি হিসেবে চালিয়ে যান" },
    noAccount: { en: "Don't have an account?", bn: "অ্যাকাউন্ট নেই?" },
    haveAccount: { en: "Already have an account?", bn: "ইতিমধ্যে অ্যাকাউন্ট আছে?" },
    agreeTerms: { en: "I agree to the Terms of Service", bn: "আমি পরিষেবার শর্তাবলীতে সম্মত" },
    or: { en: "OR", bn: "অথবা" },
    sending: { en: "Please wait...", bn: "অনুগ্রহ করে অপেক্ষা করুন..." },
    resetSent: { en: "Reset link sent! Check your email.", bn: "রিসেট লিংক পাঠানো হয়েছে! আপনার ইমেইল চেক করুন।" },
  },

  stats: {
    districts: { en: "Districts", bn: "জেলা" },
    sensors: { en: "Sensors", bn: "সেন্সর" },
    accuracy: { en: "Accuracy", bn: "নির্ভুলতা" },
    citizens: { en: "Citizens Protected", bn: "সুরক্ষিত নাগরিক" },
  },

  impact: {
    peopleHelped: { en: "People Helped", bn: "সাহায্যপ্রাপ্ত মানুষ" },
    avgWarning: { en: "Avg Warning Time", bn: "গড় সতর্কতা সময়" },
    accuracy: { en: "Prediction Accuracy", bn: "পূর্বাভাস নির্ভুলতা" },
    damagePrevented: { en: "Damage Prevented", bn: "ক্ষতি প্রতিরোধ" },
  },

  footer: {
    rights: { en: "All rights reserved.", bn: "সর্বস্বত্ব সংরক্ষিত।" },
    builtFor: { en: "Built for Bangladesh", bn: "বাংলাদেশের জন্য তৈরি" },
  },

  alerts: {
    moderateWatch: { en: "Moderate Flood Watch — Sylhet Division", bn: "মধ্যম বন্যা সতর্কতা — সিলেট বিভাগ" },
    liveSatellite: { en: "Live Satellite Monitoring Active", bn: "লাইভ স্যাটেলাইট পর্যবেক্ষণ সক্রিয়" },
  },

  home: {
    exploreDashboard: { en: "Explore Live Dashboard →", bn: "লাইভ ড্যাশবোর্ড দেখুন →" },
    talkToGpt: { en: "Talk to FloodGPT", bn: "ফ্লাডজিপিটির সাথে কথা বলুন" },
    feat1Title: { en: "Live Dashboard", bn: "লাইভ ড্যাশবোর্ড" },
    feat1Desc: { en: "Real-time risk scores for all 64 districts", bn: "৬৪টি জেলার জন্য রিয়েল-টাইম ঝুঁকি স্কোর" },
    feat2Title: { en: "Hyperlocal Map", bn: "হাইপারলোকাল মানচিত্র" },
    feat2Desc: { en: "Village-level flood zones and shelters", bn: "গ্রাম-স্তরের বন্যা অঞ্চল এবং আশ্রয়কেন্দ্র" },
    feat3Title: { en: "FloodGPT", bn: "ফ্লাডজিপিটি" },
    feat3Desc: { en: "AI assistant for flood safety questions", bn: "বন্যা নিরাপত্তা প্রশ্নের জন্য AI সহায়ক" },
    feat4Title: { en: "Community Reports", bn: "কমিউনিটি রিপোর্ট" },
    feat4Desc: { en: "Citizen-verified ground truth data", bn: "নাগরিক-যাচাইকৃত সত্য তথ্য" },
    feat5Title: { en: "Family Circles", bn: "পারিবারিক চক্র" },
    feat5Desc: { en: "Track loved ones' safety status", bn: "প্রিয়জনদের নিরাপত্তা অবস্থা ট্র্যাক করুন" },
    feat6Title: { en: "Emergency SOS", bn: "জরুরি এসওএস" },
    feat6Desc: { en: "One-tap help with location sharing", bn: "অবস্থান শেয়ারিং সহ এক-ট্যাপ সাহায্য" },
  },
};

export function t(key: string, lang: Lang): string {
  const parts = key.split(".");
  let result: any = translations;
  for (const part of parts) {
    result = result?.[part];
    if (result === undefined) return key;
  }
  return result?.[lang] ?? result?.en ?? key;
}
