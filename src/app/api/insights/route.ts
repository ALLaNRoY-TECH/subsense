import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { supabase } from "@/lib/supabase";

const MODEL_NAME = "gemini-2.5-flash";
console.log("Using Gemini model:", MODEL_NAME);

// Helper function to clean markdown formatting from text
function cleanMarkdown(text: string): string {
  if (!text) return "";
  
  let cleaned = text;

  // 1. Strip code fences (e.g. ```json ... ``` or just ```)
  cleaned = cleaned.replace(/```[a-zA-Z]*\n?/g, "");
  cleaned = cleaned.replace(/```/g, "");

  // 2. Strip markdown headers starting with # at the beginning of a line
  cleaned = cleaned.replace(/^#+\s+/gm, "");

  // 3. Strip bold/italic symbols (**bold**, *italic*, _italic_, __bold__)
  cleaned = cleaned.replace(/\*\*([^*]+)\*\*/g, "$1");
  cleaned = cleaned.replace(/\*([^*]+)\*/g, "$1");
  cleaned = cleaned.replace(/__([^_]+)__/g, "$1");
  cleaned = cleaned.replace(/_([^_]+)_/g, "$1");

  // 4. Strip inline code backticks (`code`)
  cleaned = cleaned.replace(/`([^`]+)`/g, "$1");

  // 5. Strip markdown bullet points at the beginning of a line (- item, * item, + item)
  cleaned = cleaned.replace(/^[-*+]\s+/gm, "");

  // 6. Strip numbered lists at the start of a line (e.g. "1. ")
  cleaned = cleaned.replace(/^\d+\.\s+/gm, "");

  // 7. Strip blockquote characters (e.g. "> text") at the start of a line
  cleaned = cleaned.replace(/^>\s+/gm, "");

  // 8. Remove horizontal rules (e.g., --- or ***)
  cleaned = cleaned.replace(/^[-*_]{3,}\s*$/gm, "");

  // 9. Replace remaining stray asterisks, hashes or underscores
  cleaned = cleaned.replace(/\*/g, "");
  cleaned = cleaned.replace(/_/g, "");
  cleaned = cleaned.replace(/#/g, "");

  // 10. Trim whitespace
  cleaned = cleaned.trim();

  return cleaned;
}

// GET: Fetch structured AI insights dashboard
export async function GET() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("subsense_session")?.value;

  if (!userId) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;

    // Fetch user's subscriptions
    const { data: activeSubs } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", userId);

    const subs = activeSubs || [];
    const totalSpend = subs.reduce((sum: number, s: { price: number }) => sum + s.price, 0);
    const wasteSubs = subs.filter((s: { status: string }) => s.status !== "active");
    const wasteSpend = wasteSubs.reduce((sum: number, s: { price: number }) => sum + s.price, 0);
    const annualSpend = subs.reduce((sum: number, s: { price: number; billing_frequency: string }) => {
      return sum + (s.billing_frequency === "yearly" ? s.price : s.price * 12);
    }, 0);

    const categoryMap = subs.reduce((acc: Record<string, number>, s: { category: string; price: number }) => {
      acc[s.category] = (acc[s.category] || 0) + s.price;
      return acc;
    }, {});

    // If no subscriptions exist:
    if (subs.length === 0) {
      return NextResponse.json({
        success: true,
        data: {
          summary: "No active subscriptions were detected in your account.",
          savings: "No immediate monthly and annual savings options are available because your subscription list is empty.",
          healthScore: 100,
          roast: "No subscriptions found. Your wallet is clean, or you haven't uploaded a bank statement or Gmail audit yet.",
          recommendations: ["No active subscriptions were detected in your account."]
        }
      });
    }

    // Fallback if API key is missing
    if (!apiKey) {
      const fallbackScore = Math.max(30, Math.min(100, Math.round(100 - (wasteSpend / totalSpend) * 80)));
      return NextResponse.json({
        success: true,
        data: {
          summary: `You are spending ₹${totalSpend.toLocaleString("en-IN")} monthly on subscriptions. You have ${subs.length} active platforms.`,
          savings: `You can save up to ₹${wasteSpend.toLocaleString("en-IN")} monthly by optimizing ${wasteSubs.length} idle subscriptions.`,
          healthScore: fallbackScore,
          roast: subs.length > 0
            ? `You have a health score of ${fallbackScore}/100. You are auto-billing subscriptions you haven't opened in a month.`
            : "Your board is empty. Plug in a bank statement or Gmail so I can find something to roast.",
          recommendations: wasteSubs.length > 0 
            ? [`Cancel ${wasteSubs[0].name} to save ${wasteSubs[0].currency}${wasteSubs[0].price} immediately.`]
            : ["You are clean! Keep auditing to maintain this budget."]
        }
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const systemPrompt = `You are SubSense AI, a direct, intelligent, data-driven financial auditor.
Analyze this JSON subscription data:
- Monthly Outlay: ₹${totalSpend}
- Annual Outlay: ₹${annualSpend}
- Flagged Waste: ₹${wasteSpend}
- Categories: ${JSON.stringify(categoryMap)}
- Listing: ${JSON.stringify(subs)}

Generate a structured JSON output with the exact keys:
{
  "summary": "Short 1-2 sentence description of user spending metrics",
  "savings": "Analysis of immediate monthly and annual savings options",
  "healthScore": 0-100 score based on active vs waste outlay ratio,
  "roast": "Brutal, funny, witty roast of the user's spending habits",
  "recommendations": ["Array of 2-3 specific, actionable recommendations"]
}
Return ONLY valid JSON. Do not write any markdown code block wrappers (like \`\`\`json).

CRITICAL: Do not use any markdown formatting (no bold **, no italic *, no headings #, no list bullets - or *, no backticks) in any of the string fields.`;

    let modelName = "gemini-2.5-flash";
    let model;
    console.log("Gemini API Key Present:", !!process.env.GEMINI_API_KEY);
    console.log("Using Gemini Model:", modelName);

    try {
      model = genAI.getGenerativeModel({ 
        model: modelName,
        systemInstruction: systemPrompt
      });
    } catch (err) {
      console.warn("gemini-2.5-flash not supported by SDK, trying gemini-2.0-flash. Error:", err);
      modelName = "gemini-2.0-flash";
      console.log("Gemini API Key Present:", !!process.env.GEMINI_API_KEY);
      console.log("Using Gemini Model:", modelName);
      try {
        model = genAI.getGenerativeModel({ 
          model: modelName,
          systemInstruction: systemPrompt
        });
      } catch (innerErr) {
        console.error("Gemini Error:", innerErr);
        return NextResponse.json(
          { success: false, error: String(innerErr) },
          { status: 500 }
        );
      }
    }

    console.log("=== GEMINI GET INSIGHTS DEBUG INFO ===");
    console.log("User ID:", userId);
    console.log("GEMINI_API_KEY Configured:", !!apiKey);
    console.log("Subscriptions Count:", subs.length);
    console.log("System Prompt / Instructions:", systemPrompt);

    let text = "";
    try {
      console.log("[GET] Initiating Gemini generateContent request...");
      text = await Promise.race([
        (async () => {
          const result = await model.generateContent("Provide the subscription audit analysis.");
          const response = await result.response;
          return response.text().trim();
        })(),
        new Promise<string>((_, reject) => 
          setTimeout(() => reject(new Error("Gemini API GET call timed out after 8 seconds")), 8000)
        )
      ]);
      console.log("[GET] Gemini response received successfully.");
    } catch (geminiError) {
      // Check if we can fallback to gemini-2.0-flash
      if (modelName === "gemini-2.5-flash") {
        console.warn("gemini-2.5-flash call failed, trying fallback to gemini-2.0-flash. Error:", geminiError);
        modelName = "gemini-2.0-flash";
        console.log("Gemini API Key Present:", !!process.env.GEMINI_API_KEY);
        console.log("Using Gemini Model:", modelName);
        try {
          model = genAI.getGenerativeModel({ 
            model: modelName,
            systemInstruction: systemPrompt
          });
          console.log("[GET] Initiating Gemini generateContent request with fallback model...");
          text = await Promise.race([
            (async () => {
              const result = await model.generateContent("Provide the subscription audit analysis.");
              const response = await result.response;
              return response.text().trim();
            })(),
            new Promise<string>((_, reject) => 
              setTimeout(() => reject(new Error("Gemini API GET call timed out after 8 seconds")), 8000)
            )
          ]);
          console.log("[GET] Gemini response received successfully with fallback.");
        } catch (fallbackError) {
          console.error("Gemini Error:", fallbackError);
          return NextResponse.json(
            { success: false, error: String(fallbackError) },
            { status: 500 }
          );
        }
      } else {
        console.error("Gemini Error:", geminiError);
        return NextResponse.json(
          { success: false, error: String(geminiError) },
          { status: 500 }
        );
      }
    }

    console.log("Gemini Raw Response:", text);
    console.log("=====================================");

    // Clean JSON wrappers if generated by model
    const jsonStr = text.replace(/```json/gi, "").replace(/```/g, "").trim();
    const parsed = JSON.parse(jsonStr);

    // Add validation before sending to frontend: strip markdown symbols
    if (parsed.summary) parsed.summary = cleanMarkdown(parsed.summary);
    if (parsed.savings) parsed.savings = cleanMarkdown(parsed.savings);
    if (parsed.roast) parsed.roast = cleanMarkdown(parsed.roast);
    if (parsed.recommendations && Array.isArray(parsed.recommendations)) {
      parsed.recommendations = parsed.recommendations.map((rec: string) => cleanMarkdown(rec));
    }

    return NextResponse.json({ success: true, data: parsed });

  } catch (error) {
    console.error("Gemini AI API GET Error:", error);
    return NextResponse.json({ success: false, error: "AI completions failed: " + (error instanceof Error ? error.message : String(error)) }, { status: 500 });
  }
}

// POST: Handles assistant chat
export async function POST(request: Request) {
  const cookieStore = await cookies();
  const userId = cookieStore.get("subsense_session")?.value;

  if (!userId) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { prompt, action, subscriptions } = body;

    const apiKey = process.env.GEMINI_API_KEY;

    // Retrieve active subscriptions from database if client array is empty or undefined
    let activeSubs = subscriptions;
    if (!activeSubs || !Array.isArray(activeSubs) || activeSubs.length === 0) {
      const { data } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", userId);
      activeSubs = data || [];
    }

    const totalSpend = activeSubs.reduce((sum: number, s: { price: number }) => sum + s.price, 0);
    const wasteSubs = activeSubs.filter((s: { status: string }) => s.status !== "active");
    const wasteSpend = wasteSubs.reduce((sum: number, s: { price: number }) => sum + s.price, 0);

    // If no subscriptions exist:
    if (activeSubs.length === 0) {
      return NextResponse.json({ success: true, data: { text: "No active subscriptions were detected in your account." } });
    }

    // Fallback if API key is missing
    if (!apiKey) {
      console.warn("GEMINI_API_KEY is missing. Generating rules-based local AI response.");
      
      let text = "";
      
      if (action === "roast") {
        const firstWaste = wasteSubs[0]?.name || (activeSubs.length > 0 ? activeSubs[0].name : "your apps");
        text = `You are spending ₹${totalSpend.toLocaleString("en-IN")} monthly on subscriptions. You haven't opened ${firstWaste} in a while, yet you are still happily auto-billing.`;
      } else if (action === "cancel") {
        const subName = prompt || "the service";
        const matchingSub = activeSubs.find((s: { name: string; currency: string; price: number }) => s.name.toLowerCase().includes(subName.toLowerCase()));
        const priceText = matchingSub ? `${matchingSub.currency}${matchingSub.price}` : "your monthly outlay";
        text = `Sure, I've drafted a cancellation email for your ${subName} subscription. Tapping the Transmit button will send this out immediately, scrubbing ${priceText} from your billing cycle.`;
      } else {
        const platformNames = activeSubs.map((s: { name: string }) => s.name).join(", ");
        text = `Auditing completed. Discovered ${activeSubs.length} active platforms (${platformNames || "none"}). You are wasting ₹${wasteSpend} monthly on ${wasteSubs.length} unused or duplicate memberships. Recommended action: Cancel unused subscriptions immediately.`;
      }

      return NextResponse.json({ success: true, data: { text: cleanMarkdown(text), localFallback: true } });
    }

    // Real Gemini Chat
    const genAI = new GoogleGenerativeAI(apiKey);
    const systemPrompt = `You are SubSense, a direct, intelligent, data-driven financial auditor.
Your goal is to help users understand their subscription waste, expose their idle spending habits with the humorous/brutal truth, and provide actionable tips to cancel and optimize.
Use ONLY the subscription data provided in this prompt. Never hallucinate or invent subscription names, prices, dates, or categories.

CRITICAL FORMATTING INSTRUCTIONS (VIOLATING THESE IS UNACCEPTABLE):
1. Do not use ANY markdown formatting (no bold **, no italic *, no headings #, no markdown bullet points like - or *, no code blocks, no backticks, no markdown tables, no markdown syntax of any kind).
2. Responses must be written as natural conversational text suitable for a chat application.
3. When listing subscriptions, format each subscription exactly like this (use plain text newlines, no bullet points, no bold, no markdown):
[Subscription Name]
Price: [Currency][Price]/month
Category: [Category]
Billing Date: [Billing Date]
Yearly Cost: [Currency][Yearly Price]

Leave a blank line between different subscriptions.

4. When calculations are requested:
- Show the math clearly.
- Example:
Monthly Spend: ₹248
Yearly Spend: ₹248 × 12 = ₹2976

5. When recommending cancellations:
- Explain why.
- Reference actual usage data when available.
- Never invent subscriptions that do not exist.

6. When generating cancellation emails:
- Return a complete ready-to-send email.
- Include subject line and email body.
- Do not use markdown syntax or markdown code blocks for the email.

Here is the user's current subscription profile:
- Total Subscriptions: ${activeSubs.length}
- Total Monthly Outlay: ₹${totalSpend}
- Flagged Waste Outlay: ₹${wasteSpend}
- Flagged Waste Items: ${JSON.stringify(wasteSubs)}
- Full Listing: ${JSON.stringify(activeSubs)}
`;

    let modelName = "gemini-2.5-flash";
    let model;
    console.log("Gemini API Key Present:", !!process.env.GEMINI_API_KEY);
    console.log("Using Gemini Model:", modelName);

    try {
      model = genAI.getGenerativeModel({ 
        model: modelName,
        systemInstruction: systemPrompt
      });
    } catch (err) {
      console.warn("gemini-2.5-flash not supported by SDK, trying gemini-2.0-flash. Error:", err);
      modelName = "gemini-2.0-flash";
      console.log("Gemini API Key Present:", !!process.env.GEMINI_API_KEY);
      console.log("Using Gemini Model:", modelName);
      try {
        model = genAI.getGenerativeModel({ 
          model: modelName,
          systemInstruction: systemPrompt
        });
      } catch (innerErr) {
        console.error("Gemini Error:", innerErr);
        return NextResponse.json(
          { success: false, error: String(innerErr) },
          { status: 500 }
        );
      }
    }

    const userPrompt = prompt || "Analyze my subscriptions and give me a summary of waste.";

    console.log("=== GEMINI CHAT DEBUG INFO ===");
    console.log("User ID:", userId);
    console.log("GEMINI_API_KEY Configured:", !!apiKey);
    console.log("Client subscriptions count:", subscriptions ? subscriptions.length : "undefined");
    console.log("Active subscriptions count used in prompt:", activeSubs.length);
    console.log("Active subscriptions list:", JSON.stringify(activeSubs));
    console.log("System Prompt / Instructions:", systemPrompt);
    console.log("User Prompt:", userPrompt);

    let text = "";
    try {
      console.log("[POST] Initiating Gemini generateContent request for prompt:", userPrompt);
      text = await Promise.race([
        (async () => {
          const result = await model.generateContent(userPrompt);
          const response = await result.response;
          return response.text().trim();
        })(),
        new Promise<string>((_, reject) => 
          setTimeout(() => reject(new Error("Gemini API POST call timed out after 8 seconds")), 8000)
        )
      ]);
      console.log("[POST] Gemini response received successfully.");
    } catch (geminiError) {
      // Check if we can fallback to gemini-2.0-flash
      if (modelName === "gemini-2.5-flash") {
        console.warn("gemini-2.5-flash call failed, trying fallback to gemini-2.0-flash. Error:", geminiError);
        modelName = "gemini-2.0-flash";
        console.log("Gemini API Key Present:", !!process.env.GEMINI_API_KEY);
        console.log("Using Gemini Model:", modelName);
        try {
          model = genAI.getGenerativeModel({ 
            model: modelName,
            systemInstruction: systemPrompt
          });
          console.log("[POST] Initiating Gemini generateContent request with fallback model...");
          text = await Promise.race([
            (async () => {
              const result = await model.generateContent(userPrompt);
              const response = await result.response;
              return response.text().trim();
            })(),
            new Promise<string>((_, reject) => 
              setTimeout(() => reject(new Error("Gemini API POST call timed out after 8 seconds")), 8000)
            )
          ]);
          console.log("[POST] Gemini response received successfully with fallback.");
        } catch (fallbackError) {
          console.error("Gemini Error:", fallbackError);
          return NextResponse.json(
            { success: false, error: String(fallbackError) },
            { status: 500 }
          );
        }
      } else {
        console.error("Gemini Error:", geminiError);
        return NextResponse.json(
          { success: false, error: String(geminiError) },
          { status: 500 }
        );
      }
    }

    console.log("Gemini Raw Response:", text);
    console.log("==============================");

    // Strip markdown symbols and formatting
    text = cleanMarkdown(text);

    return NextResponse.json({ success: true, data: { text } });

  } catch (error) {
    console.error("Gemini AI API POST Error:", error);
    return NextResponse.json({ success: false, error: "AI completions failed: " + (error instanceof Error ? error.message : String(error)) }, { status: 500 });
  }
}
