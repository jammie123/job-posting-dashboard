import { NextResponse } from 'next/server';

// Jednoduchý testovací endpoint pro ověření funkčnosti API
export async function POST(request: Request) {
  try {
    console.log("Test API: Přijat POST požadavek");
    const { position } = await request.json();
    console.log("Test API: Přijat název pozice:", position);

    // Základní odvození oboru a profesí z názvu pozice
    let field = "IT";
    let professions = ["Developer", "UI/UX Designer"];
    let education = "Vysokoškolské bakalářské";
    let salaryFrom = 40000;
    let salaryTo = 60000;
    
    // Jednoduchá logika pro odvození oboru podle klíčových slov v názvu
    if (position.toLowerCase().includes("vývojář") || 
        position.toLowerCase().includes("developer") || 
        position.toLowerCase().includes("programátor")) {
      field = "IT";
      professions = ["Developer", "Programátor"];
      salaryFrom = 50000;
      salaryTo = 80000;
    } else if (position.toLowerCase().includes("manažer") || 
               position.toLowerCase().includes("manager") || 
               position.toLowerCase().includes("vedoucí")) {
      field = "Management";
      professions = ["Project Manager", "Operations Manager"];
      salaryFrom = 60000;
      salaryTo = 100000;
    } else if (position.toLowerCase().includes("prodej") || 
               position.toLowerCase().includes("obchod") || 
               position.toLowerCase().includes("sales")) {
      field = "Sales";
      professions = ["Sales Representative", "Business Development"];
      salaryFrom = 35000;
      salaryTo = 60000;
    } else if (position.toLowerCase().includes("design") || 
               position.toLowerCase().includes("grafik")) {
      field = "Design";
      professions = ["Graphic Designer", "UI/UX Designer"];
      salaryFrom = 35000;
      salaryTo = 55000;
    }

    // Vrátit testovací data s některými hodnotami odvozenými z názvu pozice
    const testData = {
      field: field,
      professions: professions,
      description: `<h3>O pozici</h3><p>Toto je testovací popis pozice pro ${position}.</p><h3>Očekáváme</h3><ul><li>Zkušenosti s prací na obdobné pozici</li><li>Týmovou spolupráci</li><li>Samostatnost a proaktivní přístup</li></ul><h3>Nabízíme</h3><ul><li>Flexibilní pracovní dobu</li><li>Možnost home office</li><li>Přátelský kolektiv</li><li>Moderní kanceláře v centru Prahy</li></ul>`,
      salary: { from: salaryFrom, to: salaryTo },
      education: education,
      benefits: ["Stravenky", "MultiSport karta", "Flexibilní pracovní doba", "Home office", "5 týdnů dovolené"]
    };

    console.log("Test API: Vracím testovací data:", testData);
    return NextResponse.json(testData);
  } catch (error) {
    console.error("Test API: Chyba při zpracování požadavku:", error);
    return NextResponse.json(
      { error: "Failed to process request", details: String(error) },
      { status: 500 }
    );
  }
} 