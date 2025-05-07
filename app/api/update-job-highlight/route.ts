import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    // Přečti data z požadavku
    const { jobId, portalName, highlightName } = await request.json();

    if (!jobId || !portalName || !highlightName) {
      return NextResponse.json(
        { success: false, message: 'Chybí povinné parametry: jobId, portalName, highlightName' },
        { status: 400 }
      );
    }

    // Cesta k souboru mock-jobs.json
    const filePath = path.join(process.cwd(), 'data', 'mock-jobs.json');

    // Přečti obsah souboru
    const fileContent = fs.readFileSync(filePath, 'utf8');
    let jobs = JSON.parse(fileContent);

    // Najdi job podle ID
    const jobIndex = jobs.findIndex((job: any) => job.id === jobId);
    
    if (jobIndex === -1) {
      return NextResponse.json(
        { success: false, message: `Job s ID ${jobId} nebyl nalezen` },
        { status: 404 }
      );
    }

    // Najdi portál podle jména
    const portals = jobs[jobIndex].advertisement.portals;
    const portalIndex = portals.findIndex(
      (portal: any) => portal.name.toLowerCase().includes(portalName.toLowerCase())
    );

    if (portalIndex === -1) {
      return NextResponse.json(
        { success: false, message: `Portál obsahující '${portalName}' nebyl nalezen` },
        { status: 404 }
      );
    }

    // Aktualizuj highlighted vlastnost portálu
    jobs[jobIndex].advertisement.portals[portalIndex].highlighted = {
      name: highlightName
    };

    // Ulož změny zpět do souboru
    fs.writeFileSync(filePath, JSON.stringify(jobs, null, 2), 'utf8');

    return NextResponse.json({ 
      success: true, 
      message: 'Zvýraznění bylo úspěšně aktualizováno',
      job: jobs[jobIndex]
    });
  } catch (error) {
    console.error('Chyba při aktualizaci zvýraznění:', error);
    return NextResponse.json(
      { success: false, message: 'Došlo k chybě při aktualizaci zvýraznění', error: String(error) },
      { status: 500 }
    );
  }
} 