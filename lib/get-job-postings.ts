import type { JobPostingsData } from "@/types/job-posting"
import fs from 'fs'
import path from 'path'

export async function getJobPostings(): Promise<JobPostingsData> {
  // Načítání dat z JSON souboru
  const dataPath = path.join(process.cwd(), 'data', 'mock-jobs.json')
  const rawData = fs.readFileSync(dataPath, 'utf8')
  const jobPostings = JSON.parse(rawData)
  
  // Výpis všech pracovních pozic a jejich atributů do konzole
  console.log("=== Načtené pracovní pozice ===");
  jobPostings.forEach((job: any, index: number) => {
    console.log(`\nJob #${index + 1} (ID: ${job.id}):`);
    console.log(`- Název: ${job.title}`);
    console.log(`- Status: ${job.status}`);
    console.log(`- Lokalita: ${job.location}`);
    console.log(`- Recruiter: ${job.recruiter.name} (ID: ${job.recruiter.id})`);
    
    console.log(`- Přiřazení uživatelé (${job.assignedUsers.length}):`);
    job.assignedUsers.forEach((user: any) => {
      console.log(`  * ${user.name} (${user.role})`);
    });
    
    console.log(`- Kandidáti: nových: ${job.candidates.new}, v procesu: ${job.candidates.inProcess}, celkem: ${job.candidates.total}`);
    
    console.log(`- Inzerát: ${job.advertisement.active ? 'aktivní' : 'neaktivní'}, status: ${job.advertisement.status}`);
    console.log(`- Portály (${job.advertisement.portals.length}):`);
    job.advertisement.portals.forEach((portal: any) => {
      console.log(`  * ${portal.name}, URL: ${portal.url}, od: ${portal.publishedAt}, do: ${portal.expiresAt}`);
      console.log(`    Výkon: ${portal.performance.views} zobrazení, ${portal.performance.clicks} kliknutí, ${portal.performance.applications} žádostí`);
    });
    
    console.log(`- Celkový výkon: ${job.performance.views} zobrazení, ${job.performance.clicks} kliknutí, ${job.performance.applications} žádostí`);
    console.log("-------------------------------------------");
  });
  
  // Výpis kompletních dat v JSON formátu pro detailní analýzu
  console.log("\n=== Kompletní data pro ladění ===");
  console.log(JSON.stringify(jobPostings, null, 2));
  console.log("==================================");
  
  return { jobPostings }
}

