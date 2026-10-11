import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { supabase } from "@/lib/supabaseClient";

const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export async function GET(req: Request) {
  try {
    if (!supabase) {
      return NextResponse.json(
        { success: false, error: "Supabase client not initialized" },
        { status: 500 }
      );
    }

    // 1. Get latest price from Supabase
    const { data: latestEntry } = await supabase
      .from("gold_rates")
      .select("price_in_cash")
      .order("recorded_at", { ascending: false })
      .limit(1)
      .single();

    const previousPrice = latestEntry?.price_in_cash || 272761;

    // 2. Calculate daily market drift
    const pctChange = Number(((Math.random() * 8) - 4).toFixed(2));
    const price = Math.round(previousPrice * (1 + pctChange / 100));

    // 3. Defaults
    let headline = `${pctChange < 0 ? "📉" : "📈"} Maccy Gold Live Economy Tracker`;
    let bodyText = `The WARDOGS Gold Bar exchange rate traded at $${price.toLocaleString()} cash per bar (${pctChange >= 0 ? "+" : ""}${pctChange}% change). Midnight UTC turnover triggered market movement.`;

    // 4. Generate structured JSON analysis using Gemini 2.5 Flash
    if (ai) {
      try {
        const prompt = `You are the virtual financial analyst for Bulkhead's WARDOGS running the 'Maccy Gold Live Economy Tracker'.
Today's Gold Bar rate is $${price.toLocaleString()} cash per bar (Previous: $${previousPrice.toLocaleString()} cash, Shift: ${pctChange}%).

Return a valid JSON object with exactly two keys: "headline" and "body".
- "headline": Start with 📉 if price dropped or 📈 if price rose, followed by "Maccy Gold Live Economy Tracker".
- "body": A 2-3 sentence immersive, tactical market analysis explaining why the rate moved, player velocity, and a clear tactical recommendation on whether players should convert cash to gold today.

Return ONLY raw JSON, no code blocks or markdown wrappers.`;

        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: prompt,
        });

        if (response.text) {
          const cleanedText = response.text.replace(/```json|```/g, "").trim();
          const jsonOutput = JSON.parse(cleanedText);
          if (jsonOutput.headline) headline = jsonOutput.headline;
          if (jsonOutput.body) bodyText = jsonOutput.body;
        }
      } catch (e) {
        console.error("Gemini API Error:", e);
      }
    }

    // 5. Save structured entry to Supabase
    const { data, error } = await supabase
      .from("gold_rates")
      .insert([
        {
          price_in_cash: price,
          headline: headline,
          ai_analysis: bodyText,
          recorded_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}