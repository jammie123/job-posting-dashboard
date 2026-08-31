/**
 * Služba pro správu zvýraznění inzerátů
 */

/**
 * Aktualizuje zvýraznění portálu pro konkrétní inzerát
 * @param jobId ID inzerátu
 * @param portalName Název portálu
 * @param highlightName Název zvýraznění
 * @returns Promise s výsledkem operace
 */
export async function updateJobHighlight(jobId: string, portalName: string, highlightName: string) {
  try {
    const response = await fetch('/api/update-job-highlight', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jobId,
        portalName,
        highlightName,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Neznámá chyba při aktualizaci zvýraznění');
    }

    return data;
  } catch (error) {
    console.error('Chyba při aktualizaci zvýraznění:', error);
    throw error;
  }
} 