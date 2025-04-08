import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Inicializace OpenAI klienta
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Dostupné obory a profese pro validaci
const availableFields = [
  "IT",
  "Marketing",
  "Finance",
  "Sales",
  "HR",
  "Operations",
  "Design",
  "Legal",
  "R&D",
  "Customer Support",
];

const availableProfessions = [
  "Developer",
  "UI/UX Designer",
  "Project Manager",
  "Product Manager",
  "Data Analyst",
  "Data Scientist",
  "Marketing Specialist",
  "SEO Specialist",
  "Content Manager",
  "Social Media Manager",
  "Financial Analyst",
  "Accountant",
  "Tax Specialist",
  "Sales Representative",
  "Business Development",
  "Key Account Manager",
  "HR Manager",
  "Recruiter",
  "Operations Manager",
  "Office Manager",
  "Logistics Specialist",
  "Graphic Designer",
  "Web Designer",
  "Legal Counsel",
  "Paralegal",
  "Research Scientist",
  "Customer Support Specialist",
  "Technical Support",
  "Skladník",
];

// Seznam dostupných úrovní vzdělání
const availableEducation = [
  "Základní",
  "Středoškolské",
  "Středoškolské s maturitou",
  "Vyšší odborné",
  "Vysokoškolské bakalářské",
  "Vysokoškolské magisterské",
  "Vysokoškolské doktorské",
];

// Seznam dostupných benefitů
const availableBenefits = [
  "13. plat",
  "5 týdnů dovolené",
  "Stravenky",
  "MultiSport karta",
  "Flexibilní pracovní doba",
  "Home office",
  "Sick days",
  "Příspěvek na dopravu",
  "Příspěvek na penzijní připojištění",
  "Firemní notebook",
  "Firemní telefon",
];

export async function POST(request: Request) {
  try {
    const { position } = await request.json();

    if (!position) {
      return NextResponse.json(
        { error: "Position name is required" },
        { status: 400 }
      );
    }

    // Prompt musí obsahovat instrukce pro všechny požadované údaje
    const prompt = `Na základě názvu pracovní pozice "${position}" mi vrať JSON objekt, který bude obsahovat:
    1. Odpovídající obor z tohoto seznamu: ${availableFields.join(", ")}
    2. Seznam relevantních profesí z tohoto seznamu (maximálně 3): ${availableProfessions.join(", ")}
    3. Důkladný popis pozice (čeština) v HTML formátu. Struktura: 
       - Úvod začni nadpisem <h3>O pozici</h3> a pokračuj textem v <p> paragrafech
       - Očekávání začni nadpisem <h3>Očekáváme</h3> a vytvoř seznam <ul><li>položka</li>...</ul>
       - Výhody začni nadpisem <h3>Nabízíme</h3> a vytvoř seznam <ul><li>položka</li>...</ul>
    4. Mzdové rozmezí od-do jako čísla v Kč (realistické, běžné v ČR).
    5. Požadované vzdělání z tohoto seznamu: ${availableEducation.join(", ")}
    6. Seznam vhodných benefitů z tohoto seznamu (maximálně 5): ${availableBenefits.join(", ")}
    
    Vrať pouze JSON ve formátu:
    {
      "field": "název oboru",
      "professions": ["profese1", "profese2"],
      "description": "HTML formátovaný popis pozice",
      "salary": {"from": minimální plat v Kč, "to": maximální plat v Kč},
      "education": "požadované vzdělání",
      "benefits": ["benefit1", "benefit2", "benefit3"]
    }
    
    Při vytváření HTML popisu (description) používej přesné HTML značky, ne jen textové reprezentace. Celý popis musí být validní HTML, které lze bezpečně vložit do DIV elementu.
    Můžeš vybrat pouze z předem definovaných seznamů oborů, profesí, vzdělání a benefitů.`

    const completion = await openai.chat.completions.create({
      messages: [    { role: "system", content: "Jsi zkušený HR specialista se zaměřením na analýzu pracovních pozic." },
        { role: "user", content: prompt }],
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
    });


    const responseContent = completion.choices[0].message.content;
    if (!responseContent) {
      return NextResponse.json(
        { error: "Failed to generate suggestions" },
        { status: 500 }
      );
    }

    try {
      const parsedResponse = JSON.parse(responseContent);
      
      // Ověřit, zda odpověď obsahuje očekávané pole
      if (
        !parsedResponse.field ||
        !Array.isArray(parsedResponse.professions) ||
        !parsedResponse.description ||
        !parsedResponse.salary ||
        typeof parsedResponse.salary !== "object" ||
        !parsedResponse.education ||
        !Array.isArray(parsedResponse.benefits)
      ) {
        console.error("API response missing required fields:", parsedResponse);
        return NextResponse.json(
          { error: "Invalid response format from AI" },
          { status: 500 }
        );
      }

      // Validace, že poskytnutý obor je v seznamu dostupných oborů
      if (!availableFields.includes(parsedResponse.field)) {
        console.warn(`Field "${parsedResponse.field}" is not in the available list, using default`);
        parsedResponse.field = availableFields[0];  // Použít výchozí obor
      }

      // Validace, že poskytnuté profese jsou v seznamu dostupných profesí
      parsedResponse.professions = parsedResponse.professions.filter(
        (profession: string) => availableProfessions.includes(profession)
      );

      // Ověřit, že mzdové rozmezí obsahuje číselné hodnoty
      if (
        typeof parsedResponse.salary.from !== "number" ||
        typeof parsedResponse.salary.to !== "number"
      ) {
        console.warn("Salary values are not numbers, fixing");
        // Zkusíme převést na čísla, pokud to nejde, nastavíme výchozí hodnoty
        try {
          parsedResponse.salary.from = parseInt(parsedResponse.salary.from) || 0;
          parsedResponse.salary.to = parseInt(parsedResponse.salary.to) || 0;
        } catch (e) {
          parsedResponse.salary = { from: 0, to: 0 };
        }
      }

      // Validace, že poskytnuté vzdělání je v seznamu
      if (!availableEducation.includes(parsedResponse.education)) {
        console.warn(`Education "${parsedResponse.education}" is not in the available list, using default`);
        parsedResponse.education = availableEducation[2];  // Středoškolské s maturitou jako výchozí
      }

      // Validace, že poskytnuté benefity jsou v seznamu
      parsedResponse.benefits = parsedResponse.benefits.filter(
        (benefit: string) => availableBenefits.includes(benefit)
      );

      return NextResponse.json(parsedResponse);
    } catch (parseError) {
      console.error("Failed to parse API response:", parseError);
      console.log("Raw API response:", responseContent);
      return NextResponse.json(
        { error: "Invalid JSON response from AI", details: String(parseError) },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
} 