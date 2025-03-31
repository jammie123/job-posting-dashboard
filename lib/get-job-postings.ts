import type { JobPostingsData } from "@/types/job-posting"
import jobPostingsData from '@/data/mock-jobs.json'

export async function getJobPostings(): Promise<JobPostingsData> {
  // Nyní přímo používáme importovaná data
  const jobPostings = jobPostingsData;
  
  // Výpis všech pracovních pozic a jejich atributů do konzole (pouze při vývoji)
  if (process.env.NODE_ENV === 'development') {
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
  }
  
  return { jobPostings }
}

