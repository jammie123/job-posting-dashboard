import { ChannelConfig, AttributeMapping } from "@/types/channel-mapping";

// Základní mapování, které používá každý kanál
const baseMapping: AttributeMapping[] = [
  { sfxField: "Title *", importField: "Job Title", mapped: true },
  { sfxField: "Text *", importField: "Description", mapped: true },
  { sfxField: "Work location *", importField: "Location", mapped: true },
  { sfxField: "Compensation - Salary", importField: "Salary", mapped: true },
  { sfxField: "Compensation - Benefits", importField: "Benefits", mapped: true },
  { sfxField: "Industry", importField: "Don't map this field", mapped: false },
  { sfxField: "Profession", importField: "Position Category", mapped: true },
  { sfxField: "Skills", importField: "Required Skills", mapped: true },
  { sfxField: "Educationn degree", importField: "Education", mapped: true },
  { sfxField: "Language skills", importField: "Languages", mapped: true },
  { sfxField: "Years of experience", importField: "Experience", mapped: true },
  { sfxField: "Type of contract", importField: "Contract Type", mapped: true },
  { sfxField: "Type of job", importField: "Employment Type", mapped: true },
  { sfxField: "Type of job relation", importField: "Don't map this field", mapped: false },
  { sfxField: "Job is suitable for", importField: "Suitable For", mapped: true },
  { sfxField: "Physically challenged options", importField: "Accessibility", mapped: true },
  { sfxField: "Information about company", importField: "Company Info", mapped: true },
  { sfxField: "Information about recruiter/contact person", importField: "Contact Person", mapped: true },
  { sfxField: "Tags", importField: "Keywords", mapped: true },
];

// Mock kanály s jejich konfiguracemi
export const mockChannels: ChannelConfig[] = [
  {
    id: "jobs-cz",
    name: "Jobs.cz",
    type: "jobboard",
    mappings: [...baseMapping],
    active: true
  },
  {
    id: "prace-cz",
    name: "Prace.cz",
    type: "jobboard",
    mappings: [...baseMapping].map(mapping => {
      if (mapping.sfxField === "Compensation - Salary") {
        return { ...mapping, importField: "Mzda", mapped: true };
      }
      return mapping;
    }),
    active: true
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    type: "jobboard",
    mappings: [...baseMapping].map(mapping => {
      if (mapping.sfxField === "Title") {
        return { ...mapping, importField: "Position Title", mapped: true };
      }
      if (mapping.sfxField === "Type of contract") {
        return { ...mapping, importField: "Employment Type", mapped: true };
      }
      return mapping;
    }),
    active: true
  },
  {
    id: "profesia-sk",
    name: "Profesia.sk",
    type: "jobboard",
    mappings: [...baseMapping],
    active: false
  },
  {
    id: "workday",
    name: "Workday ATS",
    type: "ats",
    mappings: [...baseMapping].map(mapping => {
      if (mapping.sfxField === "Profession") {
        return { ...mapping, importField: "Job Family", mapped: true };
      }
      return mapping;
    }),
    active: false
  },
  {
    id: "generic-xml",
    name: "Generic XML Feed",
    type: "xml-feed",
    mappings: [...baseMapping],
    active: false
  },
  {
    id: "jobs",
    name: "Jobs",
    type: "jobboard",
    mappings: [...baseMapping].map(mapping => {
      if (mapping.sfxField === "Title *") {
        return { ...mapping, importField: "JobTitle", mapped: true };
      }
      if (mapping.sfxField === "Work location *") {
        return { ...mapping, importField: "JobLocation", mapped: true };
      }
      return mapping;
    }),
    active: true
  },
  {
    id: "profesia",
    name: "Profesia",
    type: "jobboard",
    mappings: [...baseMapping].map(mapping => {
      if (mapping.sfxField === "Compensation - Salary") {
        return { ...mapping, importField: "SalaryRange", mapped: true };
      }
      if (mapping.sfxField === "Language skills") {
        return { ...mapping, importField: "RequiredLanguages", mapped: true };
      }
      return mapping;
    }),
    active: true
  },
  {
    id: "jenprace",
    name: "JenPrace",
    type: "jobboard",
    mappings: [...baseMapping].map(mapping => {
      if (mapping.sfxField === "Text *") {
        return { ...mapping, importField: "JobDescription", mapped: true };
      }
      if (mapping.sfxField === "Skills") {
        return { ...mapping, importField: "RequiredSkills", mapped: true };
      }
      return mapping;
    }),
    active: true
  }
]; 