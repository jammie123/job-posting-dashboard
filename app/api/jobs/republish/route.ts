import { NextResponse } from 'next/server';
import { updateJobPortals, bulkUpdateJobPortals } from '@/utils/job-data-utils';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { jobId, jobIds, selectedPortals, publishedAt, expiresAt } = body;

    // Validace vstupních dat
    if (!selectedPortals || !selectedPortals.length) {
      return NextResponse.json(
        { error: 'No portals selected' },
        { status: 400 }
      );
    }

    if (!publishedAt || !expiresAt) {
      return NextResponse.json(
        { error: 'Missing date information' },
        { status: 400 }
      );
    }

    const updates = { publishedAt, expiresAt };

    let success = false;

    // Aktualizace jednoho jobu nebo více jobů
    if (jobId) {
      // Aktualizace jednoho jobu
      success = await updateJobPortals(jobId, selectedPortals, updates);
    } else if (jobIds && jobIds.length) {
      // Hromadná aktualizace více jobů
      success = await bulkUpdateJobPortals(jobIds, selectedPortals, updates);
    } else {
      return NextResponse.json(
        { error: 'Missing jobId or jobIds' },
        { status: 400 }
      );
    }

    if (success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: 'Failed to update job data' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error processing republish request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 