import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { PDFParse } from "pdf-parse";
import { getSubscriptionLogo } from "@/lib/subscription-logos";

// Regexes to extract prices from transaction lines
function extractAmount(line: string): number {
  // Matches rupee or decimal digits, e.g. "4,230.00", "299", etc.
  const priceRegex = /(?:rs\.?|inr|₹)?\s*(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)/i;
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

    // Mock response helper for quick local validation
    if (file.name === "mock-statement.pdf" || file.size === 0) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      return NextResponse.json({
        success: true,
        merchant: "Duolingo Super",
        price: 600,
        currency: "₹",
        category: "Learning",
        icon: "🦉",
        date: "20th of month"
      });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Parse PDF using modern PDFParse named class export
    const pdfParser = new PDFParse({ data: buffer });
    const textResult = await pdfParser.getText();
    const text = textResult.text;

    // Scan lines for subscription merchant signatures
    const lines = text.split("\n");
    let foundMerchant = "";
    let foundPrice = 0;
    let foundCategory = "Entertainment";
    let foundIcon = "🏷️";

    const rules = [
      { name: "Duolingo Super", keywords: ["duolingo", "owl"], price: 600, category: "Learning", icon: "🦉" },
      { name: "SonyLIV", keywords: ["sonyliv", "sony liv", "sony pictures"], price: 299, category: "Entertainment", icon: "📺" },
      { name: "GitHub Copilot", keywords: ["github", "copilot", "github inc"], price: 850, category: "AI & Tech", icon: "💻" },
      { name: "Netflix Premium", keywords: ["netflix", "netflix.com"], price: 649, category: "Entertainment", icon: "🎬" },
      { name: "Adobe CC", keywords: ["adobe", "creative cloud"], price: 4230, category: "Design", icon: "🖌️" }
    ];

    for (const line of lines) {
      const lowerLine = line.toLowerCase();
      const match = rules.find(r => r.keywords.some(k => lowerLine.includes(k)));
      
      if (match) {
        foundMerchant = match.name;
        foundPrice = extractAmount(line) || match.price;
        foundCategory = match.category;
        foundIcon = match.icon;
        break;
      }
    }

    // Clean up parser references
    await pdfParser.destroy();

    // If no matching subscription found in text
    if (!foundMerchant) {
      return NextResponse.json({
        success: false,
        message: "No recurring subscription transactions detected in the statement."
      });
    }

    return NextResponse.json({
      success: true,
      merchant: foundMerchant,
      price: foundPrice,
      currency: "₹",
      category: foundCategory,
      icon: foundIcon,
      date: "15th of month"
    });

  } catch (error) {
    console.error("PDF Parsing error:", error);
    return NextResponse.json({ error: "Failed to parse statement PDF" }, { status: 500 });
  }
}
