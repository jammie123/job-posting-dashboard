import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Kontrola API klíče
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'OpenAI API klíč není nastaven' },
        { status: 500 }
      );
    }
    
    // Validace dat
    if (!data.model || !data.messages || !Array.isArray(data.messages)) {
      return NextResponse.json(
        { error: 'Neplatný formát požadavku' },
        { status: 400 }
      );
    }
    
    // Přesměrování požadavku na OpenAI API
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(data)
    });
    
    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.json();
      console.error('OpenAI API error:', errorData);
      return NextResponse.json(
        { error: `Chyba OpenAI API: ${errorData.error?.message || 'Neznámá chyba'}` },
        { status: openaiResponse.status }
      );
    }
    
    const result = await openaiResponse.json();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in OpenAI API route:', error);
    return NextResponse.json(
      { error: 'Interní chyba serveru' },
      { status: 500 }
    );
  }
} 