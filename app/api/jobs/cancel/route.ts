import { NextResponse } from 'next/server';
import { loadJobData, saveJobData } from '@/utils/job-data-utils';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { jobId, jobIds, selectedPortals, cancelDate } = body;

    // Validace vstupních dat
    if (!selectedPortals || !selectedPortals.length) {
      return NextResponse.json(
        { error: 'No portals selected' },
        { status: 400 }
      );
    }

    if (!cancelDate) {
      return NextResponse.json(
        { error: 'Missing cancel date' },
        { status: 400 }
      );
    }

    let success = false;

    // Načtení dat
    const jobs = await loadJobData();

    // Aktualizace jednoho jobu nebo více jobů
    if (jobId) {
      // Aktualizace jednoho jobu
      const jobIndex = jobs.findIndex(job => job.id === jobId);
      
      if (jobIndex === -1) {
        return NextResponse.json(
          { error: `Job with ID ${jobId} not found` },
          { status: 404 }
        );
      }
      
      const job = jobs[jobIndex];
      
      // Aktualizace vybraných portálů
      job.advertisement.portals = job.advertisement.portals.map(portal => {
        if (portal.url && selectedPortals.includes(portal.url)) {
          return {
            ...portal,
            expiresAt: cancelDate
          };
        }
        return portal;
      });
      
      // Nastavení statusu inzerátu na neaktivní
      job.advertisement.active = false;
      job.advertisement.status = "Ukončený";
      
      // Uložení aktualizovaných dat
      jobs[jobIndex] = job;
      success = true;
    } else if (jobIds && jobIds.length) {
      // Hromadná aktualizace více jobů
      for (const id of jobIds) {
        const jobIndex = jobs.findIndex(job => job.id === id);
        
        if (jobIndex === -1) {
          console.error(`Job with ID ${id} not found`);
          continue;
        }
        
        const job = jobs[jobIndex];
        
        // Aktualizace vybraných portálů
        job.advertisement.portals = job.advertisement.portals.map(portal => {
          if (portal.url && selectedPortals.includes(portal.url)) {
            return {
              ...portal,
              expiresAt: cancelDate
            };
          }
          return portal;
        });
        
        // Nastavení statusu inzerátu na neaktivní
        job.advertisement.active = false;
        job.advertisement.status = "Ukončený";
        
        // Uložení aktualizovaných dat
        jobs[jobIndex] = job;
        success = true;
      }
    } else {
      return NextResponse.json(
        { error: 'Missing jobId or jobIds' },
        { status: 400 }
      );
    }

    if (success) {
      // Uložení všech změn
      await saveJobData(jobs);
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: 'Failed to update job data' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error processing cancel request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 