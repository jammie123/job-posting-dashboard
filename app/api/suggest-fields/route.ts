import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Inicializace OpenAI klienta
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Seznam dostupných oborů a profesí pro validaci
const availableFields = [
  "IT a telekomunikace",
  "Finance a účetnictví",
  "Marketing a PR",
  "Administrativa",
  "Výroba a průmysl",
  "Obchod a prodej",
  "Logistika a doprava",
  "Stavebnictví",
];

const availableProfessions = [
  "Programátor",
  "Tester",
  "Projektový manažer",
  "Obchodní zástupce",
  "Účetní",
  "Marketingový specialista",
  "HR specialista",
  "Skladník",
];

export async function POST(request: Request) {
  try {
    // Parsovat požadavek
    const { position } = await request.json();

    if (!position || typeof position !== 'string') {
      return NextResponse.json(
        { error: 'Název pozice musí být poskytnut' },
        { status: 400 }
      );
    }

    // Připravit prompt pro OpenAI
    const prompt = `
    Na základě názvu pracovní pozice navrhněte nejlepší odpovídající obor a profese z dostupného seznamu.
    
    Název pozice: "${position}"
    
    Dostupné obory: ${availableFields.join(', ')}
    Dostupné profese: ${availableProfessions.join(', ')}
    
    Odpověď formátujte jako JSON objekt s klíči "field" (jeden obor ze seznamu) a "professions" (pole profesí ze seznamu, max. 3).
    Odpověď v JSON formátu:
    `;

    // Volání OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "Jsi asistent, který pomáhá s klasifikací pracovních pozic." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" }
    });

    // Zpracování odpovědi
    const responseContent = completion.choices[0]?.message?.content;
    if (!responseContent) {
      throw new Error('Prázdná odpověď od OpenAI API');
    }

    // Parsování JSON odpovědi
    let jsonResponse;
    try {
      jsonResponse = JSON.parse(responseContent);
    } catch (error) {
      console.error('Chyba při parsování JSON odpovědi:', error);
      throw new Error('Nepodařilo se zpracovat odpověď od API');
    }

    // Validace odpovědi
    const field = jsonResponse.field;
    const professions = jsonResponse.professions || [];

    if (!field || !availableFields.includes(field)) {
      return NextResponse.json(
        { field: null, professions: [] },
        { status: 200 }
      );
    }

    // Filtrujeme profese podle dostupného seznamu
    const validProfessions = Array.isArray(professions)
      ? professions.filter(p => availableProfessions.includes(p))
      : [];

    // Vrácení validní odpovědi
    return NextResponse.json(
      { field, professions: validProfessions },
      { status: 200 }
    );
  } catch (error) {
    console.error('Chyba při zpracování požadavku:', error);
    return NextResponse.json(
      { error: 'Interní chyba serveru' },
      { status: 500 }
    );
  }
} 