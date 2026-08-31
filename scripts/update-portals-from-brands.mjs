import fs from 'fs';
import path from 'path';

const repoRoot = '/Users/jan.fuxa/Downloads/luky dashboard/prototype/job-posting-table_new';
const bigPath = path.join(repoRoot, 'data/mock-jobs_bigcompany.json');
const mapPath = path.join(repoRoot, 'data/myMockBigcompany.json');

function readJsonSafe(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  try {
    return JSON.parse(raw);
  } catch (e) {
    // Attempt to recover if file is a sequence of objects separated by '}, {' without outer []
    const trimmed = raw.trim();
    if (!trimmed.startsWith('[') && trimmed.endsWith(']')) {
      const fixed = '[' + trimmed;
      return JSON.parse(fixed);
    }
    if (!trimmed.startsWith('[') && !trimmed.endsWith(']')) {
      const fixed = '[' + trimmed + ']';
      return JSON.parse(fixed);
    }
    throw e;
  }
}

const iconByBrand = {
  'Jobs.cz': 'JobsIcon',
  'Kariérní stránky': 'WebpagesIcon',
  'Kariérní sekce': 'WebpagesIcon',
  'Prace.cz': 'PraceIcon',
  'Práce za rohem': 'PraceZaRohemIcon',
  'Jobote': 'IntranetIcon',
  'Intranet': 'IntranetIcon',
  'Teamio': 'WebpagesIcon',
  'Zákaznický export pozice': 'ExportIcon',
  'Export pozic': 'ExportIcon',
  'Atmoskop.cz': 'AtmoskopIcon',
  'Profesia': 'ProfesiaIcon',
  'startupjobs.cz': 'JobsIcon',
};

const suffixByBrand = {
  'Jobs.cz': 'jobs',
  'Kariérní stránky': 'career',
  'Kariérní sekce': 'careers-section',
  'Prace.cz': 'prace',
  'Práce za rohem': 'pzr',
  'Jobote': 'jobote',
  'Intranet': 'intranet',
  'Teamio': 'teamio',
  'Zákaznický export pozice': 'export',
  'Export pozic': 'export',
  'Atmoskop.cz': 'atmoskop',
  'Profesia': 'profesia',
  'startupjobs.cz': 'startupjobs',
};

const normName = (b) => (b === 'Zákaznický export pozice' ? 'Export pozic' : b);
const toBrands = (s) => (!s ? [] : s.split(',').map((x) => x.trim()).filter(Boolean));

const jobs = readJsonSafe(bigPath);
const rows = readJsonSafe(mapPath);

const limit = Math.min(jobs.length, rows.length);
for (let i = 0; i < limit; i++) {
  const job = jobs[i];
  const brands = toBrands(rows[i].brand_names);
  if (!job.advertisement) job.advertisement = { active: false, status: 'Nevystavený', portals: [] };
  if (!Array.isArray(job.advertisement.portals)) job.advertisement.portals = [];
  const existing = job.advertisement.portals;
  const nameSet = new Set(existing.map((p) => p.name));
  const basePub = existing[0]?.publishedAt || '2025-09-18';
  const baseExp = existing[0]?.expiresAt || '2025-10-18';

  for (const brand of brands) {
    const name = normName(brand);
    if (nameSet.has(name)) continue;
    const icon = iconByBrand[brand] || 'JobsIcon';
    const suffix = suffixByBrand[brand] || brand.toLowerCase().replace(/\s+/g, '-');
    existing.push({
      name,
      url: `https://example.com/${job.id}/${suffix}`,
      icon,
      publishedAt: basePub,
      expiresAt: baseExp,
      performance: { views: 0, clicks: 0, applications: 0 },
    });
    nameSet.add(name);
  }
}

fs.writeFileSync(bigPath, JSON.stringify(jobs, null, 2));
console.log(`Updated ${limit} jobs with portals from brand_names.`);


