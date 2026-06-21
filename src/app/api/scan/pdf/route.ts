import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { PDFParse } from "pdf-parse";
import { getSubscriptionLogo } from "@/lib/subscription-logos";
import { supabase } from "@/lib/supabase";

// Match priority vendors
interface VendorRule {
  brand: string;
  keywords: string[];
  category: string;
  icon: string;
  defaultPrice: number;
}

const VENDOR_RULES: VendorRule[] = [
  { brand: "Netflix", keywords: ["netflix", "netflix.com"], category: "Entertainment", icon: "🎬", defaultPrice: 649 },
  { brand: "Spotify", keywords: ["spotify", "spotify music"], category: "Music", icon: "🎵", defaultPrice: 119 },
  { brand: "Amazon Prime", keywords: ["amazon prime", "amazon ip", "prime membership"], category: "Entertainment", icon: "📦", defaultPrice: 299 },
  { brand: "Prime Video", keywords: ["prime video", "primevideo"], category: "Entertainment", icon: "📺", defaultPrice: 299 },
  { brand: "ChatGPT Plus", keywords: ["openai", "chatgpt"], category: "AI & Tech", icon: "🤖", defaultPrice: 1999 },
  { brand: "Canva Pro", keywords: ["canva", "canva pro"], category: "Design", icon: "🎨", defaultPrice: 499 },
  { brand: "Adobe Creative Cloud", keywords: ["adobe", "creative cloud", "photoshop"], category: "Design", icon: "🖌️", defaultPrice: 4230 },
  { brand: "YouTube Premium", keywords: ["youtube", "google play", "youtube premium"], category: "Entertainment", icon: "📹", defaultPrice: 129 },
  { brand: "Google One", keywords: ["google one", "google storage"], category: "Cloud", icon: "☁️", defaultPrice: 130 },
  { brand: "Disney+ Hotstar", keywords: ["hotstar", "disney+"], category: "Entertainment", icon: "🎥", defaultPrice: 299 },
  { brand: "Microsoft 365", keywords: ["microsoft 365", "office 365"], category: "Productivity", icon: "💼", defaultPrice: 489 },
  { brand: "Apple Music", keywords: ["apple music", "itunes"], category: "Music", icon: "🍎", defaultPrice: 99 }
];

// Helper to extract numeric amount from a transaction line
function extractAmount(line: string): number {
  const priceRegex = /(?:rs\.?|inr|₹|\$|usd|€|eur)?\s*(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)/i;
  const match = line.match(priceRegex);
  if (match) {
    return parseFloat(match[1].replace(/,/g, ""));
  }
  return 299;
}

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const userId = cookieStore.get("subsense_session")?.value;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Identify bank from text/filename
    const filenameLower = file.name.toLowerCase();
    let bankName = "Unknown Indian Bank";
    if (filenameLower.includes("sbi") || filenameLower.includes("state")) bankName = "SBI";
    else if (filenameLower.includes("hdfc")) bankName = "HDFC";
    else if (filenameLower.includes("icici")) bankName = "ICICI";
    else if (filenameLower.includes("axis")) bankName = "Axis";
    else if (filenameLower.includes("kotak")) bankName = "Kotak";

    // Mock response for quick Sandbox validation
    if (file.name === "mock-statement.pdf" || file.size === 0) {
      await new Promise(resolve => setTimeout(resolve, 1500));
      const mockResult = {
        success: true,
        merchant: "Netflix",
        price: 649,
        currency: "₹",
        category: "Entertainment",
        icon: "🎬",
        date: "15th of month",
        monthly_amount: 649,
        estimated_frequency: "monthly",
        confidence_score: 0.95,
        flag: "duplicate"
      };
      
      return NextResponse.json(mockResult);
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Parse PDF
    const pdfParser = new PDFParse({ data: buffer });
    const textResult = await pdfParser.getText();
    const text = textResult.text;

    // Detect Bank from text contents if not matched by filename
    const textLower = text.toLowerCase();
    if (textLower.includes("state bank of india") || textLower.includes("sbi")) bankName = "SBI";
    else if (textLower.includes("hdfc bank") || textLower.includes("hdfc")) bankName = "HDFC";
    else if (textLower.includes("icici bank") || textLower.includes("icici")) bankName = "ICICI";
    else if (textLower.includes("axis bank") || textLower.includes("axis")) bankName = "Axis";
    else if (textLower.includes("kotak mahindra") || textLower.includes("kotak")) bankName = "Kotak";

    console.log(`Auditing bank statement. Identified bank: ${bankName}`);

    // Parse lines
    const lines = text.split("\n");
    const detectedGroups: Record<string, { brand: string; amounts: number[]; lines: string[]; category: string; icon: string }> = {};

    for (const line of lines) {
      const lowerLine = line.toLowerCase();
      const match = VENDOR_RULES.find(rule => rule.keywords.some(keyword => lowerLine.includes(keyword)));
      
      if (match) {
        const amount = extractAmount(line) || match.defaultPrice;
        if (!detectedGroups[match.brand]) {
          detectedGroups[match.brand] = {
            brand: match.brand,
            amounts: [],
            lines: [],
            category: match.category,
            icon: match.icon
          };
        }
        detectedGroups[match.brand].amounts.push(amount);
        detectedGroups[match.brand].lines.push(line);
      }
    }

    // Clean up parser
    await pdfParser.destroy();

    const detectedSubs = Object.values(detectedGroups);

    if (detectedSubs.length === 0) {
      return NextResponse.json({
        success: false,
        message: "No recurring subscription transactions detected in the statement."
      });
    }

    // Fetch existing user subscriptions to determine flags (duplicate, missed, hidden)
    const { data: existingSubs } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", userId);
    
    const existingMap = new Map<string, any>();
    if (existingSubs) {
      existingSubs.forEach((sub: any) => existingMap.set(sub.name.toLowerCase(), sub));
    }

    const mergedResults: any[] = [];

    for (const item of detectedSubs) {
      const brandName = item.brand;
      const count = item.amounts.length;
      const avgAmount = item.amounts.reduce((a, b) => a + b, 0) / count;
      
      const estimatedFrequency = count > 1 ? "monthly" : "monthly"; // default monthly
      const confidenceScore = count > 1 ? 0.95 : 0.80;

      // Classify Flag
      const existingSub = existingMap.get(brandName.toLowerCase());
      let flag: "duplicate" | "missed" | "hidden" = "hidden";

      if (existingSub) {
        flag = "duplicate";
      } else {
        // If not duplicate, flag as missed from Gmail if Gmail scan runs or general hidden subscription
        flag = "missed";
      }

      // Upsert into Supabase to automatically merge
      const subItem = {
        user_id: userId,
        name: brandName,
        price: avgAmount,
        currency: "₹",
        category: item.category,
        status: flag === "duplicate" ? "duplicate" : "active",
        last_used: "Detected from Bank Statement",
        billing_date: "15th of month",
        billing_frequency: estimatedFrequency,
        logo_url: getSubscriptionLogo(brandName).svg
      };

      const { data: insertData, error: insertError } = await supabase
        .from("subscriptions")
        .upsert(subItem, { onConflict: "user_id,name" }) // Upserting based on user_id + name if unique, or standard insert
        .select();

      if (insertError) {
        console.error("Error inserting PDF detected subscription:", insertError);
      }

      mergedResults.push({
        merchant: brandName,
        price: avgAmount,
        currency: "₹",
        category: item.category,
        icon: item.icon,
        date: "15th of month",
        monthly_amount: avgAmount,
        estimated_frequency: estimatedFrequency,
        confidence_score: confidenceScore,
        flag
      });
    }

    // Return the first detected item to maintain compatibility with the UI uploader state,
    // plus the full list of detected subscriptions
    const primarySub = mergedResults[0];

    return NextResponse.json({
      success: true,
      ...primarySub,
      detected: mergedResults,
      bank: bankName
    });

  } catch (error) {
    console.error("PDF Parsing error:", error);
    return NextResponse.json({ error: "Failed to parse statement PDF" }, { status: 500 });
  }
}

