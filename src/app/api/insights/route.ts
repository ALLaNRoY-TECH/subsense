import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const userId = cookieStore.get("subsense_session")?.value;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { prompt, action, subscriptions } = body;

    const apiKey = process.env.GEMINI_API_KEY;

    // Retrieve active subscriptions from database if not passed
    let activeSubs = subscriptions;
    if (!activeSubs) {
      const { data } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", userId);
      activeSubs = data || [];
    }

    const totalSpend = activeSubs.reduce((sum: number, s: any) => sum + s.price, 0);
    const wasteSubs = activeSubs.filter((s: any) => s.status !== "active");
    const wasteSpend = wasteSubs.reduce((sum: number, s: any) => sum + s.price, 0);

    // ---------------- FALLBACK AI RESPONSE ----------------
    if (!apiKey) {
      console.warn("GEMINI_API_KEY is missing. Generating rules-based local AI response.");
      
      let text = "";
      
      if (action === "roast") {
        if (activeSubs.length === 0) {
          text = "I can't roast you because your subscription board is empty. Go connect Gmail so I can find something to criticize.";
        } else {
          const wasteNames = wasteSubs.map((s: any) => s.name).join(", ");
          text = `Allan, you are spending ₹${totalSpend.toLocaleString("en-IN")} monthly on subscriptions. You haven't opened ${wasteSubs[0]?.name || "your unused apps"} in over a month, yet you are still happily auto-billing. Jeff Bezos personally thanks you for your charity.`;
        }
      } else if (action === "cancel") {
        const subName = prompt || "the service";
        text = `Sure, I've drafted a cancellation email for your ${subName} subscription. Tapping the Transmit button will send this out immediately, scrubbing ₹${prompt ? activeSubs.find((s: any) => s.name === prompt)?.price || 299 : 299} from your billing cycle.`;
      } else {
        // General analysis
        text = `Auditing completed. Discovered ${activeSubs.length} active platforms. You are wasting ₹${wasteSpend} monthly on ${wasteSubs.length} unused or duplicate memberships. Recommended action: Cancel Netflix Premium and Canva Pro duplicates immediately.`;
      }

      return NextResponse.json({ text, localFallback: true });
    }

    // ---------------- REAL GEMINI COMPLETION ----------------
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    let systemPrompt = `You are SubSense, a brilliant, witty, and direct AI financial intelligence assistant.
Your goal is to help users understand their subscription waste, mock their idle spending habits with humorous/brutal roasts, and provide actionable tips to cancel and optimize.
Here is the user's current subscription profile:
- Total Subscriptions: ${activeSubs.length}
- Total Monthly Outlay: ₹${totalSpend}
- Flagged Waste Outlay: ₹${wasteSpend}
- Flagged Waste Items: ${JSON.stringify(wasteSubs)}
- Full Listing: ${JSON.stringify(activeSubs)}

Generate a direct response matching the user request. Keep your answers brief (under 3-4 sentences max), punchy, and highly analytical. Avoid using generic emojis.`;

    const userPrompt = prompt || "Analyze my subscriptions and give me a summary of waste.";

    const result = await model.generateContent([systemPrompt, userPrompt]);
    const response = await result.response;
    const text = response.text().trim();

    return NextResponse.json({ text });

  } catch (error) {
    console.error("Gemini AI API Error:", error);
    return NextResponse.json({ error: "AI completions failed" }, { status: 500 });
  }
}
