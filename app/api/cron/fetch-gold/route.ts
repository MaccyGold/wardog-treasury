import { NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'
import { supabase } from '../../../../lib/supabase'

const apiKey = process.env.GEMINI_API_KEY
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const price = body.price || 272761 // Default test price

    let aiAnalysis = 'Gold prices remain volatile across the WARDOGS economy.'

    if (ai) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: \`You are a virtual financial analyst for Bulkhead's game WARDOGS. Today's Gold Bar exchange rate is \${price} cash per bar. Context: Earlier spikes were driven by cash exploits before Bulkhead's ban waves and progression wipes. Write a concise 3-sentence market analysis explaining the trend, cosmetic impact, and whether players should convert cash to gold today.\`,
        })
        if (response.text) aiAnalysis = response.text.trim()
      } catch (e) { console.error(e) }
    }

    const { data, error } = await supabase.from('gold_rates').insert([
      { price_in_cash: price, ai_analysis: aiAnalysis }
    ]).select()

    if (error) throw error
    return NextResponse.json({ success: true, data })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
