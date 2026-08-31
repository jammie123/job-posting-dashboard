// Definice typů pro mapování atributů
export interface AttributeMapping {
  sfxField: string;      // Název pole v našem systému
  importField: string;   // Název pole v importním souboru
  mapped: boolean;       // Je pole namapované?
}

export interface ChannelConfig {
  id: string;
  name: string;          // Název kanálu (např. "Jobs.cz")
  type: "jobboard" | "ats" | "xml-feed";  // Typ kanálu
  mappings: AttributeMapping[];
  active: boolean;
}

// Definice typů pro XML import
export interface XmlField {
  name: string;
  path: string;
  required: boolean;
}

export interface XmlFileStructure {
  rootElement: string;
  itemElement: string;
  fields: XmlField[];
}

// Atributy našeho systému, které lze mapovat
export const systemAttributes = [
  "Title",
  "Text",
  "Work location",
  "Compensation - Salary",
  "Compensation - Benefits",
  "Industry",
  "Profession",
  "Skills",
  "Educationn degree",
  "Language skills",
  "Years of experience",
  "Type of contract",
  "Type of job",
  "Type of job relation",
  "Job is suitable for",
  "Physically challenged options",
  "Information about company",
  "Information about recruiter/contact person",
  "Tags"
]; 