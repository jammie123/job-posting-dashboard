import fs from 'fs';
import path from 'path';
import type { JobPosting, JobPortal } from '@/types/job-posting';

// Cesta k souboru s mock daty
const MOCK_DATA_PATH = path.join(process.cwd(), 'data', 'mock-jobs.json');

/**
 * Načte data z mock-jobs.json
 */
export async function loadJobData(): Promise<JobPosting[]> {
  try {
    const data = await fs.promises.readFile(MOCK_DATA_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading job data:', error);
    return [];
  }
}

/**
 * Uloží data do mock-jobs.json
 */
export async function saveJobData(jobs: JobPosting[]): Promise<boolean> {
  try {
    await fs.promises.writeFile(MOCK_DATA_PATH, JSON.stringify(jobs, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error saving job data:', error);
    return false;
  }
}

/**
 * Aktualizuje portály pro konkrétní job
 */
export async function updateJobPortals(
  jobId: string, 
  selectedPortalUrls: string[], 
  updates: { publishedAt: string; expiresAt: string }
): Promise<boolean> {
  try {
    const jobs = await loadJobData();
    const jobIndex = jobs.findIndex(job => job.id === jobId);
    
    if (jobIndex === -1) {
      console.error(`Job with ID ${jobId} not found`);
      return false;
    }
    
    // Aktualizace portálů
    const job = jobs[jobIndex];
    
    if (!job.advertisement.portals) {
      console.error(`Job ${jobId} has no portals array`);
      return false;
    }
    
    // Aktualizace vybraných portálů
    job.advertisement.portals = job.advertisement.portals.map(portal => {
      if (portal.url && selectedPortalUrls.includes(portal.url)) {
        const updatedPortal = {
          ...portal,
          publishedAt: updates.publishedAt,
          expiresAt: updates.expiresAt
        };
        
        // Odstranění cancelAt property při znovuvystavení inzerátu
        if ('cancelAt' in updatedPortal) {
          delete updatedPortal.cancelAt;
        }
        
        return updatedPortal;
      }
      return portal;
    });
    
    // Nastavení statusu inzerátu na aktivní
    job.advertisement.active = true;
    job.advertisement.status = "Vystavený";
    
    // Uložení aktualizovaných dat
    jobs[jobIndex] = job;
    await saveJobData(jobs);
    
    return true;
  } catch (error) {
    console.error('Error updating job portals:', error);
    return false;
  }
}

/**
 * Aktualizuje portály pro více jobů najednou
 */
export async function bulkUpdateJobPortals(
  jobIds: string[],
  selectedPortalUrls: string[],
  updates: { publishedAt: string; expiresAt: string }
): Promise<boolean> {
  try {
    const jobs = await loadJobData();
    let updated = false;
    
    for (const jobId of jobIds) {
      const jobIndex = jobs.findIndex(job => job.id === jobId);
      
      if (jobIndex === -1) {
        console.error(`Job with ID ${jobId} not found`);
        continue;
      }
      
      const job = jobs[jobIndex];
      
      if (!job.advertisement.portals) {
        console.error(`Job ${jobId} has no portals array`);
        continue;
      }
      
      // Aktualizace vybraných portálů
      job.advertisement.portals = job.advertisement.portals.map(portal => {
        if (portal.url && selectedPortalUrls.includes(portal.url)) {
          const updatedPortal = {
            ...portal,
            publishedAt: updates.publishedAt,
            expiresAt: updates.expiresAt
          };
          
          // Odstranění cancelAt property při znovuvystavení inzerátu
          if ('cancelAt' in updatedPortal) {
            delete updatedPortal.cancelAt;
          }
          
          return updatedPortal;
        }
        return portal;
      });
      
      // Nastavení statusu inzerátu na aktivní
      job.advertisement.active = true;
      job.advertisement.status = "Vystavený";
      
      // Uložení aktualizovaných dat
      jobs[jobIndex] = job;
      updated = true;
    }
    
    if (updated) {
      await saveJobData(jobs);
    }
    
    return updated;
  } catch (error) {
    console.error('Error bulk updating job portals:', error);
    return false;
  }
} 