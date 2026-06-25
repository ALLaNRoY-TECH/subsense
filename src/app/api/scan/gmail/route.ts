import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { google } from "googleapis";
import { supabase } from "@/lib/supabase";
import { getSubscriptionLogo } from "@/lib/subscription-logos";

// Match patterns for common platforms
interface ParserRule {
  brand: string;
  keywords: string[];
  defaultPrice: number;
  category: string;
}

const PARSING_RULES: ParserRule[] = [
  { brand: "Netflix", keywords: ["netflix"], defaultPrice: 649, category: "Entertainment" },
  { brand: "Spotify", keywords: ["spotify"], defaultPrice: 119, category: "Music" },
  { brand: "Amazon Prime", keywords: ["amazon prime", "amazonprime"], defaultPrice: 299, category: "Entertainment" },
  { brand: "Prime Video", keywords: ["prime video", "primevideo"], defaultPrice: 299, category: "Entertainment" },
  { brand: "ChatGPT Plus", keywords: ["openai", "chatgpt"], defaultPrice: 1999, category: "AI & Tech" },
  { brand: "Canva Pro", keywords: ["canva"], defaultPrice: 499, category: "Design" },
  { brand: "Adobe Creative Cloud", keywords: ["adobe", "creative cloud"], defaultPrice: 4230, category: "Design" },
  { brand: "YouTube Premium", keywords: ["youtube premium", "youtube membership"], defaultPrice: 129, category: "Entertainment" },
  { brand: "Google One", keywords: ["google one", "google storage"], defaultPrice: 130, category: "Cloud" },
  { brand: "Disney+ Hotstar", keywords: ["hotstar", "disney+"], defaultPrice: 299, category: "Entertainment" },
  { brand: "Microsoft 365", keywords: ["microsoft 365", "office 365"], defaultPrice: 489, category: "Productivity" },
  { brand: "Apple Music", keywords: ["apple music", "itunes"], defaultPrice: 99, category: "Music" },
  { brand: "Notion AI", keywords: ["notion ai", "notion"], defaultPrice: 820, category: "Productivity" },
  { brand: "GitHub Copilot", keywords: ["github copilot", "github"], defaultPrice: 820, category: "AI & Tech" },
  { brand: "Claude", keywords: ["claude", "anthropic"], defaultPrice: 1650, category: "AI & Tech" },
  { brand: "Figma", keywords: ["figma"], defaultPrice: 1240, category: "Design" },
  { brand: "Cursor", keywords: ["cursor"], defaultPrice: 1650, category: "AI & Tech" },
  { brand: "Dropbox", keywords: ["dropbox"], defaultPrice: 990, category: "Cloud" },
  { brand: "Airtel", keywords: ["airtel payment", "airtel mobility"], defaultPrice: 299, category: "Utilities" },
  { brand: "Jio", keywords: ["jio recharge", "reliance jio"], defaultPrice: 299, category: "Utilities" }
];

// Parser helper to extract prices using regex (support ₹, $, €, Rs., INR, USD, EUR)
function parsePrice(text: string, defaultVal: number): { price: number; currency: string } {
  const rupeeRegex = /(?:₹|Rs\.?|INR)\s*(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)/i;
  const dollarRegex = /(?:\$|USD)\s*(\d+(?:\.\d{2})?)/i;
  const euroRegex = /(?:€|EUR)\s*(\d+(?:\.\d{2})?)/i;
  
  const rupeeMatch = text.match(rupeeRegex);
  if (rupeeMatch) {
    const rawVal = rupeeMatch[1].replace(/,/g, "");
    return { price: parseFloat(rawVal), currency: "₹" };
  }
  
  const dollarMatch = text.match(dollarRegex);
  if (dollarMatch) {
    return { price: parseFloat(dollarMatch[1]), currency: "$" };
  }

  const euroMatch = text.match(euroRegex);
  if (euroMatch) {
    return { price: parseFloat(euroMatch[1]), currency: "€" };
  }
  
  return { price: defaultVal, currency: "₹" };
}

function parseFrequency(subject: string, snippet: string): "monthly" | "yearly" | "trial" {
  const fullText = (subject + " " + snippet).toLowerCase();
  if (fullText.includes("year") || fullText.includes("annual") || fullText.includes("12-month") || fullText.includes("12 month") || fullText.includes("/yr") || fullText.includes("per year")) {
    return "yearly";
  }
  if (fullText.includes("trial") || fullText.includes("free for") || fullText.includes("free trial") || fullText.includes("try free")) {
    return "trial";
  }
  return "monthly";
}

function parseStatus(subject: string, snippet: string, defaultStatus: "active" | "wasting" | "duplicate"): "active" | "wasting" | "duplicate" | "cancelled" | "expired" {
  const fullText = (subject + " " + snippet).toLowerCase();
  if (fullText.includes("cancel") || fullText.includes("cancellation")) return "cancelled";
  if (fullText.includes("expire") || fullText.includes("expired")) return "expired";
  if (fullText.includes("refund") || fullText.includes("refunded")) return "cancelled";
  return defaultStatus;
}

export async function POST() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("subsense_session")?.value;

  if (!userId) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  // Record scanner scan state as running
  await supabase.from("scans").insert({
    user_id: userId,
    status: "running",
    scanned_count: 0,
    found_count: 0
  });

  // Check user profile for Google token
  const { data: users, error: userError } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId);

  if (userError || !users || users.length === 0) {
    return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
  }

  const user = users[0];

  // ---------------- SANDBOX DEMO SCAN FALLBACK ----------------
  if (userId === "demo-user" || !user.google_access_token || user.google_access_token === "mock-demo-access-token") {
    // Wait 2 seconds to simulate scanning logic
    await new Promise(resolve => setTimeout(resolve, 2000));

    const sandboxSubs = [
      { user_id: userId, name: "Netflix Premium", price: 649, currency: "₹", category: "Entertainment", status: "wasting", last_used: "42 days ago", billing_date: "2nd of month", billing_frequency: "monthly", logo_url: getSubscriptionLogo("Netflix").svg, gmail_message_id: "msg-netflix-demo" },
      { user_id: userId, name: "Spotify Premium", price: 119, currency: "₹", category: "Music", status: "active", last_used: "Daily", billing_date: "14th of month", billing_frequency: "monthly", logo_url: getSubscriptionLogo("Spotify").svg, gmail_message_id: "msg-spotify-demo" },
      { user_id: userId, name: "ChatGPT Plus", price: 1999, currency: "₹", category: "AI & Tech", status: "active", last_used: "Yesterday", billing_date: "21st of month", billing_frequency: "monthly", logo_url: getSubscriptionLogo("ChatGPT Plus").svg, gmail_message_id: "msg-chatgpt-demo" },
      { user_id: userId, name: "Prime Video", price: 299, currency: "₹", category: "Entertainment", status: "wasting", last_used: "87 days ago", billing_date: "18th of month", billing_frequency: "monthly", logo_url: getSubscriptionLogo("Prime Video").svg, gmail_message_id: "msg-prime-demo" },
      { user_id: userId, name: "Canva Pro", price: 499, currency: "₹", category: "Design", status: "duplicate", last_used: "Last week", billing_date: "24th of month", billing_frequency: "monthly", logo_url: getSubscriptionLogo("Canva Pro").svg, gmail_message_id: "msg-canva-demo" },
      { user_id: userId, name: "Adobe Creative Cloud", price: 4230, currency: "₹", category: "Design", status: "active", last_used: "3 days ago", billing_date: "9th of month", billing_frequency: "monthly", logo_url: getSubscriptionLogo("Adobe").svg, gmail_message_id: "msg-adobe-demo" },
      { user_id: userId, name: "YouTube Premium", price: 129, currency: "₹", category: "Entertainment", status: "active", last_used: "Daily", billing_date: "17th of month", billing_frequency: "monthly", logo_url: getSubscriptionLogo("YouTube Premium").svg, gmail_message_id: "msg-youtube-demo" }
    ];

    // Bulk upsert into subscriptions database
    await supabase.from("subscriptions").upsert(sandboxSubs);

    // Update scan status
    await supabase.from("scans").insert({
      user_id: userId,
      status: "completed",
      scanned_count: 85,
      found_count: sandboxSubs.length
    });

    return NextResponse.json({
      success: true,
      data: {
        scannedCount: 85,
        foundCount: sandboxSubs.length,
        subscriptionsCount: sandboxSubs.length,
        duplicatesIgnored: 0,
        subscriptions: sandboxSubs
      }
    });
  }

  // ---------------- REAL GMAIL SCANNING PIPELINE ----------------
  try {
    const redirectUri =
      process.env.NODE_ENV === "development"
        ? "http://localhost:3000/api/auth/callback"
        : `${process.env.NEXTAUTH_URL}/api/auth/callback`;

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      redirectUri
    );

    oauth2Client.setCredentials({
      access_token: user.google_access_token,
      refresh_token: user.google_refresh_token,
      expiry_date: user.token_expiry ? new Date(user.token_expiry).getTime() : undefined
    });

    const gmail = google.gmail({ version: "v1", auth: oauth2Client });

    // 12 Months Ago search query calculation
    const dateLimit = new Date();
    dateLimit.setMonth(dateLimit.getMonth() - 12);
    const formattedDate = `${dateLimit.getFullYear()}/${String(dateLimit.getMonth() + 1).padStart(2, "0")}/${String(dateLimit.getDate()).padStart(2, "0")}`;

    const searchQuery = `subject:(receipt OR invoice OR billing OR renewal OR payment OR confirmed OR charged OR subscription OR order) after:${formattedDate}`;
    
    const listRes = await gmail.users.messages.list({
      userId: "me",
      q: searchQuery,
      maxResults: 150
    });

    const messages = listRes.data.messages || [];
    const scannedCount = messages.length;
    let foundCount = 0;
    let newSubscriptionsSaved = 0;
    let duplicatesIgnored = 0;
    const foundSubs: Record<string, unknown>[] = [];

    // Query existing subscriptions to identify duplicates
    const { data: existingSubs } = await supabase
      .from("subscriptions")
      .select("gmail_message_id")
      .eq("user_id", userId)
      .not("gmail_message_id", "is", null);
    const existingMessageIds = new Set(existingSubs?.map((s: { gmail_message_id: string }) => s.gmail_message_id) || []);

    for (const msg of messages) {
      if (!msg.id) continue;
      
      // If we already have this receipt parsed, track duplicate stats and skip
      if (existingMessageIds.has(msg.id)) {
        duplicatesIgnored++;
        continue;
      }

      const details = await gmail.users.messages.get({
        userId: "me",
        id: msg.id
      });

      const snippet = details.data.snippet || "";
      const headers = details.data.payload?.headers || [];
      const subject = (headers.find(h => h.name?.toLowerCase() === "subject")?.value || "").toLowerCase();
      const dateHeader = headers.find(h => h.name?.toLowerCase() === "date")?.value || "";
      const bodyText = subject + " " + snippet;

      // Find if message matches a brand parsing rule
      const matchingRule = PARSING_RULES.find(rule => 
        rule.keywords.some(keyword => bodyText.includes(keyword))
      );

      if (matchingRule) {
        foundCount++;
        const { price, currency } = parsePrice(bodyText, matchingRule.defaultPrice);
        const frequency = parseFrequency(subject, snippet);
        
        const billingDate = dateHeader ? new Date(dateHeader) : new Date();
        const nextRenewal = new Date(billingDate);
        if (frequency === "yearly") {
          nextRenewal.setFullYear(nextRenewal.getFullYear() + 1);
        } else if (frequency === "trial") {
          nextRenewal.setDate(nextRenewal.getDate() + 14); // estimate 14 days for trial
        } else {
          nextRenewal.setMonth(nextRenewal.getMonth() + 1);
        }

        let defaultStatus: "active" | "wasting" | "duplicate" = "active";
        if (matchingRule.brand === "Netflix" || matchingRule.brand === "Prime Video") {
          defaultStatus = "wasting";
        }
        const status = parseStatus(subject, snippet, defaultStatus);

        const subItem = {
          user_id: userId,
          name: matchingRule.brand,
          price,
          currency,
          category: matchingRule.category,
          status,
          last_used: status === "wasting" ? "30+ days ago" : "Yesterday",
          billing_date: `${billingDate.getDate()}th of month`,
          renewal_date: nextRenewal.toISOString(),
          billing_frequency: frequency,
          logo_url: getSubscriptionLogo(matchingRule.brand).svg,
          gmail_message_id: msg.id
        };

        const { error: upsertError } = await supabase.from("subscriptions").upsert(subItem);
        if (!upsertError) {
          newSubscriptionsSaved++;
          foundSubs.push(subItem);
        } else {
          console.error("Supabase upsert failed inside scanner:", upsertError);
        }
      }
    }

    // Save final scan report
    await supabase.from("scans").insert({
      user_id: userId,
      status: "completed",
      scanned_count: scannedCount,
      found_count: foundCount
    });

    return NextResponse.json({
      success: true,
      data: {
        scannedCount,
        foundCount,
        subscriptionsCount: newSubscriptionsSaved,
        duplicatesIgnored,
        subscriptions: foundSubs
      }
    });

  } catch (error) {
    console.error("Gmail API Scanner Error:", error);
    await supabase.from("scans").insert({
      user_id: userId,
      status: "failed",
      scanned_count: 0,
      found_count: 0
    });
    return NextResponse.json({ success: false, error: "Scanner failed" }, { status: 500 });
  }
}

