"use client";

// Dynamic, graceful-fallback Supabase client.
// If env vars aren't set, every method resolves to a safe "not configured" error
// instead of crashing the app. This lets Hydronova run perfectly with
// `npm install && npm run dev` even before Supabase is set up.

type SupabaseLike = {
  auth: {
    signInWithPassword: (args: { email: string; password: string }) => Promise<any>;
    signUp: (args: { email: string; password: string; options?: any }) => Promise<any>;
    signOut: () => Promise<any>;
    resetPasswordForEmail: (email: string, options?: any) => Promise<any>;
    getSession: () => Promise<any>;
    getUser: () => Promise<any>;
    onAuthStateChange: (cb: (event: string, session: any) => void) => { data: { subscription: { unsubscribe: () => void } } };
  };
  from: (table: string) => any;
};

let cachedClient: SupabaseLike | null = null;
let triedLoad = false;

const NOT_CONFIGURED = {
  data: null,
  error: { message: "Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local." },
};

function fallbackClient(): SupabaseLike {
  return {
    auth: {
      signInWithPassword: async () => NOT_CONFIGURED,
      signUp: async () => NOT_CONFIGURED,
      signOut: async () => ({ error: null }),
      resetPasswordForEmail: async () => NOT_CONFIGURED,
      getSession: async () => ({ data: { session: null }, error: null }),
      getUser: async () => ({ data: { user: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    },
    from: () => ({
      select: async () => ({ data: [], error: null }),
      insert: async () => NOT_CONFIGURED,
      update: async () => NOT_CONFIGURED,
      delete: async () => NOT_CONFIGURED,
      eq: function () { return this; },
      order: function () { return this; },
      limit: function () { return this; },
      single: async () => ({ data: null, error: null }),
    }),
  };
}

export async function getSupabase(): Promise<SupabaseLike> {
  if (cachedClient) return cachedClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key || triedLoad) {
    if (!cachedClient) cachedClient = fallbackClient();
    return cachedClient;
  }

  triedLoad = true;

  try {
    const { createClient } = await import("@supabase/supabase-js");
    cachedClient = createClient(url, key) as unknown as SupabaseLike;
    return cachedClient;
  } catch {
    cachedClient = fallbackClient();
    return cachedClient;
  }
}

export function isSupabaseConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}
