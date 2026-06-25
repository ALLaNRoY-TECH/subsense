import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

// Real client (if configured)
const realSupabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Helper to interact with Local Storage for Sandbox Demo Mode
const getLocalDB = (table: string): Record<string, unknown>[] => {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(`subsense_db_${table}`);
  return data ? JSON.parse(data) : [];
};

const saveLocalDB = (table: string, data: Record<string, unknown>[]) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(`subsense_db_${table}`, JSON.stringify(data));
};

// Seed default data for local storage if empty
const seedLocalData = () => {
  if (typeof window === "undefined") return;
  const subs = getLocalDB("subscriptions");
  if (subs.length === 0) {
    const defaultSubs = [
      { id: "sub-1", name: "Netflix Premium", price: 649, currency: "₹", category: "Entertainment", status: "wasting", last_used: "42 days ago", billing_date: "2nd of month", billing_frequency: "monthly", logo_url: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full p-1.5"><path d="M4 2v20h4.256V11.895L15.744 22H20V2h-4.256v10.105L8.256 2H4z" fill="#E50914"/></svg>`, user_id: "demo-user" },
      { id: "sub-2", name: "Spotify Premium", price: 119, currency: "₹", category: "Music", status: "active", last_used: "Daily", billing_date: "14th of month", billing_frequency: "monthly", logo_url: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full p-1"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424c-.18.295-.565.387-.86.207-2.377-1.454-5.37-1.783-8.894-.98-.336.075-.668-.135-.744-.47-.077-.337.135-.668.47-.745 3.856-.88 7.15-.506 9.82.13.296.18.388.563.208.858zm1.224-2.723c-.226.367-.707.487-1.074.26-2.72-1.672-6.87-2.157-10.077-1.182-.41.124-.842-.107-.967-.518-.125-.41.107-.842.518-.967 3.67-1.114 8.24-.567 11.34 1.34.367.227.487.708.26 1.075zm.106-2.833C14.384 8.797 8.544 8.6 5.16 9.626c-.54.164-1.107-.146-1.27-.687-.164-.54.146-1.107.687-1.27 3.885-1.18 10.339-.96 14.41 1.46.486.288.643.91.354 1.396-.288.487-.91.644-1.396.355z" fill="#1DB954"/></svg>`, user_id: "demo-user" },
      { id: "sub-3", name: "ChatGPT Plus", price: 1999, currency: "₹", category: "AI & Tech", status: "active", last_used: "Yesterday", billing_date: "21st of month", billing_frequency: "monthly", logo_url: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full p-1.5"><path d="M21.5 10.5c.3-1.2-.4-2.5-1.7-2.8l-1.3-.3.5-1.3c.4-1.2-.2-2.5-1.5-2.9-1.2-.4-2.5.2-2.9 1.5l-.3 1.3-1.3-.5c-1.2-.4-2.5.2-2.9 1.5-.4 1.2.2 2.5 1.5 2.9l1.3.3-.5 1.3c-.4 1.2.2 2.5 1.5 2.9h.4l1.3-.5 1.3.5h.4c1.2.4 2.5-.2 2.9-1.5l.3-1.3 1.3.5c.5.2.9.2 1.3 0zm-8.8-4.5c.6-.2 1.2.1 1.4.7l.6 1.8-.7 1.8-.7.3-1.8-.6c-.6-.2-.9-.8-.7-1.4.2-.6.8-.9 1.4-.7l.5.4zm3.9 6.2l-1.8.6-.6-.7.6-1.8 1.8-.6c.6-.2 1.2.1 1.4.7.2.6-.1 1.2-.7 1.4l-.7.4z" fill="#10A37F"/><circle cx="12" cy="12" r="10" stroke="#10A37F" stroke-width="1.5"/></svg>`, user_id: "demo-user" },
      { id: "sub-4", name: "Prime Video", price: 299, currency: "₹", category: "Entertainment", status: "wasting", last_used: "87 days ago", billing_date: "18th of month", billing_frequency: "monthly", logo_url: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full p-1"><path d="M12.5 13.5c-2.485 0-4.5 1.567-4.5 3.5s2.015 3.5 4.5 3.5 4.5-1.567 4.5-3.5-2.015-3.5-4.5-3.5z" fill="#00A8E1" fill-opacity="0.1"/><path d="M1 18.5s4-3.5 11-3.5 11 3.5 11 3.5c-3-1.5-7-2.5-11-2.5s-8 1-11 2.5z" stroke="#00A8E1" stroke-width="2" stroke-linecap="round"/><path d="M19 18.5l3.5.5-1.5-3.5-2 3z" fill="#FF9900"/></svg>`, user_id: "demo-user" },
      { id: "sub-5", name: "Canva Pro", price: 499, currency: "₹", category: "Design", status: "duplicate", last_used: "Last week", billing_date: "24th of month", billing_frequency: "monthly", logo_url: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full p-1.5"><circle cx="12" cy="12" r="10" fill="url(#canvaGrad)"/><path d="M8 12c1.5-1.5 3-2.5 4.5-2s2 1.5 3.5.5M8 14.5c2-1 4.5-1.5 6-1" stroke="#FFFFFF" stroke-width="1.5" stroke-linecap="round"/><defs><linearGradient id="canvaGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#00C4CC"/><stop offset="50%" stopColor="#7D2AE8"/><stop offset="100%" stopColor="#FF70A6"/></linearGradient></defs></svg>`, user_id: "demo-user" },
      { id: "sub-6", name: "Adobe Creative Cloud", price: 4230, currency: "₹", category: "Design", status: "active", last_used: "3 days ago", billing_date: "9th of month", billing_frequency: "monthly", logo_url: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full p-1.5"><path d="M14.5 3H22v18H14.5L22 7.5V21h-2.5L14.5 11 9.5 21H7V3h7.5L9.5 13.5 14.5 3z" fill="#FF0000"/></svg>`, user_id: "demo-user" },
      { id: "sub-7", name: "iCloud+ 2TB", price: 749, currency: "₹", category: "Cloud", status: "active", last_used: "Daily", billing_date: "28th of month", billing_frequency: "monthly", logo_url: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full p-1"><circle cx="12" cy="12" r="10" fill="url(#musicGrad)"/><path d="M9 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm0 0V8.5l8-1.5V14.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm0-5l8-1.5" stroke="#FFFFFF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><defs><linearGradient id="musicGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#FD2472"/><stop offset="100%" stopColor="#FE3A50"/></linearGradient></defs></svg>`, user_id: "demo-user" }
    ];
    saveLocalDB("subscriptions", defaultSubs);
  }
};

if (typeof window !== "undefined" && !isSupabaseConfigured) {
  seedLocalData();
}

// Chainable mock builder for select queries
const mockSelectChain = (table: string, currentData: Record<string, unknown>[]): unknown => {
  const builder: Record<string, unknown> = {
    eq: (col: string, val: unknown) => {
      const filtered = currentData.filter(item => item[col] === val);
      return mockSelectChain(table, filtered);
    },
    order: (col: string, { ascending = true } = {}) => {
      const sorted = [...currentData].sort((a, b) => {
        if ((a[col] as number) < (b[col] as number)) return ascending ? -1 : 1;
        if ((a[col] as number) > (b[col] as number)) return ascending ? 1 : -1;
        return 0;
      });
      return mockSelectChain(table, sorted);
    },
    // Make it Thenable (behaves like a Promise)
    then: (onfulfilled: (res: { data: unknown[], error: null }) => void) => {
      return Promise.resolve({ data: currentData, error: null }).then(onfulfilled);
    }
  };
  return builder;
};

// Chainable mock builder for delete queries
const mockDeleteChain = (table: string, currentFilters: { col: string; val: unknown }[] = []): unknown => {
  const builder: Record<string, unknown> = {
    eq: (col: string, val: unknown) => {
      return mockDeleteChain(table, [...currentFilters, { col, val }]);
    },
    // Make it Thenable (behaves like a Promise)
    then: (onfulfilled: (res: { data: null, error: null }) => void) => {
      const data = getLocalDB(table);
      const filtered = data.filter(item => {
        // Remove item if it matches ALL filters
        const matchesAll = currentFilters.length > 0 && currentFilters.every(f => item[f.col] === f.val);
        return !matchesAll;
      });
      saveLocalDB(table, filtered);
      return Promise.resolve({ data: null, error: null }).then(onfulfilled);
    }
  };
  return builder;
};

// Export active or mock client
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const supabase: any = realSupabase || {
  from: (table: string) => {
    return {
      select: () => {
        const data = getLocalDB(table);
        return mockSelectChain(table, data);
      },
      insert: (values: Record<string, unknown> | Record<string, unknown>[]) => {
        const data = getLocalDB(table);
        const toInsert = Array.isArray(values) ? values : [values];
        const inserted = toInsert.map(val => ({
          id: val.id || Math.random().toString(36).substr(2, 9),
          created_at: new Date().toISOString(),
          ...val
        }));
        saveLocalDB(table, [...data, ...inserted]);
        return Promise.resolve({ data: inserted, error: null });
      },
      upsert: (values: Record<string, unknown> | Record<string, unknown>[]) => {
        const data = getLocalDB(table);
        const toUpsert = Array.isArray(values) ? values : [values];
        const current = [...data];
        const processed: Record<string, unknown>[] = [];
        
        toUpsert.forEach(item => {
          const idx = current.findIndex(c => c.id === item.id || (item.gmail_message_id && c.gmail_message_id === item.gmail_message_id));
          if (idx > -1) {
            current[idx] = { ...current[idx], ...item };
            processed.push(current[idx]);
          } else {
            const newItem = {
              id: item.id || Math.random().toString(36).substr(2, 9),
              created_at: new Date().toISOString(),
              ...item
            };
            current.push(newItem);
            processed.push(newItem);
          }
        });
        
        saveLocalDB(table, current);
        return Promise.resolve({ data: processed, error: null });
      },
      delete: () => {
        return mockDeleteChain(table, []);
      }
    };
  },
  auth: {
    getUser: () => {
      if (typeof window !== "undefined") {
        const user = localStorage.getItem("subsense_user");
        if (user) return Promise.resolve({ data: { user: JSON.parse(user) }, error: null });
      }
      return Promise.resolve({ data: { user: null }, error: null });
    },
    signOut: () => {
      if (typeof window !== "undefined") {
        localStorage.removeItem("subsense_user");
        localStorage.removeItem("subsense_gmail_token");
      }
      return Promise.resolve({ error: null });
    }
  }
};
