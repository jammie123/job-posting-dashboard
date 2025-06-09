import { ChannelConfig, AttributeMapping } from "@/types/channel-mapping";

// Základní mapování, které používá každý kanál
const baseMapping: AttributeMapping[] = [
  { sfxField: "First Name *", importField: "First Name", mapped: true },
  { sfxField: "Last Name *", importField: "Last Name", mapped: true },
  { sfxField: "Email *", importField: "Email", mapped: true },
  { sfxField: "Title", importField: "Designation", mapped: true },
  { sfxField: "Address 1", importField: "Don't map this field", mapped: false },
  { sfxField: "Address 2", importField: "Don't map this field", mapped: false },
  { sfxField: "Zip Code", importField: "Zip Code", mapped: true },
  { sfxField: "City", importField: "Don't map this field", mapped: false },
  { sfxField: "State", importField: "Don't map this field", mapped: false },
  { sfxField: "Country", importField: "Don't map this field", mapped: false },
  { sfxField: "Phone", importField: "Don't map this field", mapped: false },
  { sfxField: "Job Title", importField: "Position Name", mapped: true },
  { sfxField: "Job Description", importField: "Description", mapped: true },
  { sfxField: "Requirements", importField: "Requirements", mapped: true },
  { sfxField: "Location", importField: "Location", mapped: true },
  { sfxField: "Salary", importField: "Salary Range", mapped: true },
  { sfxField: "Contract Type", importField: "Employment Type", mapped: true },
  { sfxField: "Work Type", importField: "Work Type", mapped: true },
  { sfxField: "Department", importField: "Don't map this field", mapped: false },
  { sfxField: "Company", importField: "Company Name", mapped: true },
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
      if (mapping.sfxField === "Salary") {
        return { ...mapping, importField: "Salary", mapped: true };
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
        return { ...mapping, importField: "Job Title", mapped: true };
      }
      if (mapping.sfxField === "Contract Type") {
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
      if (mapping.sfxField === "Department") {
        return { ...mapping, importField: "Department", mapped: true };
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
  }
]; 