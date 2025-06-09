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
  "First Name",
  "Last Name",
  "Email",
  "Title",
  "Address 1",
  "Address 2",
  "Zip Code",
  "City",
  "State",
  "Country",
  "Phone",
  "Job Title",
  "Job Description",
  "Requirements",
  "Location",
  "Salary",
  "Contract Type",
  "Work Type",
  "Department",
  "Company"
]; 