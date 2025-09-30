"use client"

import { useState, useEffect } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { InfoIcon, Loader2, FileJson, BrainCircuit } from "lucide-react"
import { systemAttributes } from "@/types/channel-mapping"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

interface XmlField {
  name: string;
  path: string;
  sample: string;
}

interface FileStructure {
  rootElement: string;
  itemElement: string;
  fields: XmlField[];
}

interface XmlViewerProps {
  xmlFile?: File;
  onMappingsSuggested?: (mappings: Array<{sfxField: string, importField: string}>) => void;
}

export function XmlViewer({ xmlFile, onMappingsSuggested }: XmlViewerProps) {
  const [expandedField, setExpandedField] = useState<string | null>(null)
  const [fileContent, setFileContent] = useState<string | null>(null)
  const [fileStructure, setFileStructure] = useState<FileStructure | null>(null)
  const [analyzingFile, setAnalyzingFile] = useState(false)
  const [suggestedMappings, setSuggestedMappings] = useState<Array<{sfxField: string, importField: string}>>([])
  const [fileType, setFileType] = useState<'xml' | 'json' | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [useAI, setUseAI] = useState(false)
  const [analyzingWithAI, setAnalyzingWithAI] = useState(false)
  
  // Zjištění typu souboru
  useEffect(() => {
    if (xmlFile) {
      if (xmlFile.name.endsWith('.xml')) {
        setFileType('xml');
      } else if (xmlFile.name.endsWith('.json')) {
        setFileType('json');
      } else {
        setFileType(null);
        setError("Nepodporovaný typ souboru. Podporovány jsou pouze .xml a .json soubory.");
      }
    }
  }, [xmlFile]);
  
  // Načtení obsahu souboru
  useEffect(() => {
    if (xmlFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setFileContent(e.target.result as string);
        }
      };
      reader.onerror = () => {
        setError("Chyba při čtení souboru.");
      };
      reader.readAsText(xmlFile);
    }
  }, [xmlFile]);

  // Parsování XML souboru
  const parseXml = (xmlContent: string) => {
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlContent, "text/xml");
      
      // Kontrola chyb při parsování
      const parserError = xmlDoc.querySelector("parsererror");
      if (parserError) {
        throw new Error("Neplatný XML formát");
      }
      
      // Zjištění kořenového elementu
      const rootElement = xmlDoc.documentElement.nodeName;
      
      // Hledání elementů, které vypadají jako položky (např. job, item, product)
      const potentialItemElements = ['job', 'item', 'position', 'product', 'entry'];
      let itemElement = '';
      let itemNodes: Element[] = [];
      
      for (const elemName of potentialItemElements) {
        const elements = xmlDoc.getElementsByTagName(elemName);
        if (elements.length > 0) {
          itemElement = elemName;
          itemNodes = Array.from(elements);
          break;
        }
      }
      
      // Pokud se nepodařilo najít známý typ elementu, zkusíme vzít první element s více výskyty
      if (!itemElement && xmlDoc.documentElement.children.length > 0) {
        const firstChildName = xmlDoc.documentElement.children[0].nodeName;
        const elements = xmlDoc.getElementsByTagName(firstChildName);
        
        if (elements.length > 0) {
          itemElement = firstChildName;
          itemNodes = Array.from(elements);
        }
      }
      
      // Extrahujeme pole z prvního itemu
      const fields: XmlField[] = [];
      
      if (itemNodes.length > 0) {
        const firstItem = itemNodes[0];
        
        // Rekurzivní funkce pro extrakci polí
        const extractFields = (node: Element, basePath: string) => {
          Array.from(node.children).forEach(child => {
            const childName = child.nodeName;
            const path = `${basePath}/${childName}`;
            
            if (child.children.length === 0 || child.children.length === 1 && child.children[0].nodeType === 3) {
              // Koncový element s textem
              fields.push({
                name: childName,
                path: path,
                sample: child.textContent || ""
              });
            } else {
              // Rekurzivně procházíme dále
              extractFields(child, path);
            }
          });
        };
        
        extractFields(firstItem, `/${itemElement}`);
      }
      
      return {
        rootElement,
        itemElement,
        fields
      };
    } catch (error) {
      console.error("Chyba při parsování XML:", error);
      setError("Chyba při parsování XML: " + (error instanceof Error ? error.message : "Neznámá chyba"));
      return null;
    }
  };
  
  // Parsování JSON souboru
  const parseJson = (jsonContent: string) => {
    try {
      const data = JSON.parse(jsonContent);
      const fields: XmlField[] = [];
      
      // Zjištění, zda jde o pole nebo objekt
      const rootElement = "root";
      let itemElement = Array.isArray(data) ? "item" : "object";
      
      // Zpracování dat
      if (Array.isArray(data) && data.length > 0) {
        // Pokud je to pole, vezmeme první položku a extrahujeme z ní pole
        const firstItem = data[0];
        
        const extractFields = (obj: any, basePath: string, prefix: string = "") => {
          for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
              const value = obj[key];
              const path = basePath ? `${basePath}.${key}` : key;
              const fieldName = prefix ? `${prefix}${key}` : key;
              
              if (typeof value !== 'object' || value === null) {
                fields.push({
                  name: fieldName,
                  path: path,
                  sample: String(value).substring(0, 100)
                });
              } else if (!Array.isArray(value)) {
                // Pro objekt s klíčem "attributes" extrahujeme jeho obsah přímo do kořene
                if (key === "attributes") {
                  extractFields(value, `${path}`, "");
                } else {
                  // Rekurzivně procházíme vnořené objekty
                  extractFields(value, path, `${fieldName}.`);
                }
              } else if (Array.isArray(value) && value.length > 0 && typeof value[0] !== 'object') {
                // Jednoduché pole primitivních hodnot
                fields.push({
                  name: fieldName,
                  path: path,
                  sample: value.slice(0, 3).join(', ')
                });
              }
            }
          }
        };
        
        extractFields(firstItem, itemElement);
      } else {
        // Zpracování objektu
        const extractFields = (obj: any, basePath: string, prefix: string = "") => {
          for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
              const value = obj[key];
              const path = basePath ? `${basePath}.${key}` : key;
              const fieldName = prefix ? `${prefix}${key}` : key;
              
              if (typeof value !== 'object' || value === null) {
                fields.push({
                  name: fieldName,
                  path: path,
                  sample: String(value).substring(0, 100)
                });
              } else if (!Array.isArray(value)) {
                // Pro objekt s klíčem "attributes" extrahujeme jeho obsah přímo do kořene
                if (key === "attributes") {
                  extractFields(value, `${path}`, "");
                } else {
                  // Rekurzivně procházíme vnořené objekty
                  extractFields(value, path, `${fieldName}.`);
                }
              } else if (Array.isArray(value) && value.length > 0) {
                if (typeof value[0] !== 'object') {
                  // Jednoduché pole primitivních hodnot
                  fields.push({
                    name: fieldName,
                    path: path,
                    sample: value.slice(0, 3).join(', ')
                  });
                } else {
                  // Nalezli jsme pole objektů, toto by mohl být itemElement
                  itemElement = key;
                  
                  // Extrahujeme pole z prvního prvku pole
                  extractFields(value[0], `${path}[0]`, "");
                }
              }
            }
          }
        };
        
        extractFields(data, "");
      }
      
      return {
        rootElement,
        itemElement,
        fields
      };
    } catch (error) {
      console.error("Chyba při parsování JSON:", error);
      setError("Chyba při parsování JSON: " + (error instanceof Error ? error.message : "Neznámá chyba"));
      return null;
    }
  };

  // Funkce pro mapování atributů
  const suggestMappings = (fields: XmlField[]) => {
    // Mapování podle názvů polí
    const fieldNameMap: Record<string, string[]> = {
      "title": ["Title"],
      "name": ["Title"],
      "position": ["Title"],
      "job_title": ["Title"],
      "jobtitle": ["Title"],
      
      "description": ["Text"],
      "job_description": ["Text"],
      "text": ["Text"],
      "content": ["Text"],
      
      "location": ["Work location"],
      "city": ["Work location"],
      "place": ["Work location"],
      "workplace": ["Work location"],
      
      "salary": ["Compensation - Salary"],
      "wage": ["Compensation - Salary"],
      "compensation": ["Compensation - Salary"],
      
      "benefits": ["Compensation - Benefits"],
      "perks": ["Compensation - Benefits"],
      
      "industry": ["Industry"],
      "sector": ["Industry"],
      
      "profession": ["Profession"],
      "occupation": ["Profession"],
      "job_category": ["Profession"],
      
      "skills": ["Skills"],
      "requirements": ["Skills"],
      "qualifications": ["Skills"],
      "required_skills": ["Skills"],
      
      "education": ["Educationn degree"],
      "degree": ["Educationn degree"],
      "qualification": ["Educationn degree"],
      
      "languages": ["Language skills"],
      "language_skills": ["Language skills"],
      "language_requirements": ["Language skills"],
      
      "experience": ["Years of experience"],
      "years_of_experience": ["Years of experience"],
      "work_experience": ["Years of experience"],
      
      "contract_type": ["Type of contract"],
      "employment_type": ["Type of contract"],
      "employment": ["Type of contract"],
      
      "job_type": ["Type of job"],
      "work_type": ["Type of job"],
      "workload": ["Type of job"],
      
      "relation": ["Type of job relation"],
      "job_relation": ["Type of job relation"],
      
      "suitable_for": ["Job is suitable for"],
      "target_group": ["Job is suitable for"],
      
      "accessibility": ["Physically challenged options"],
      "physically_challenged": ["Physically challenged options"],
      "handicapped": ["Physically challenged options"],
      
      "company": ["Information about company"],
      "company_info": ["Information about company"],
      "employer": ["Information about company"],
      
      "contact": ["Information about recruiter/contact person"],
      "recruiter": ["Information about recruiter/contact person"],
      "contact_person": ["Information about recruiter/contact person"],
      
      "tags": ["Tags"],
      "keywords": ["Tags"],
      "labels": ["Tags"]
    };
    
    const mappings: Array<{sfxField: string, importField: string}> = [];
    
    // Pro každé pole hledáme odpovídající systémový atribut
    fields.forEach(field => {
      const fieldNameLower = field.name.toLowerCase().replace(/[_-]/g, '');
      
      // Hledáme v mapě podle názvu pole
      for (const [externalField, systemFields] of Object.entries(fieldNameMap)) {
        if (fieldNameLower.includes(externalField) || externalField.includes(fieldNameLower)) {
          // Našli jsme odpovídající systémový atribut
          systemFields.forEach(systemField => {
            // Ověření, že tento systémový atribut existuje
            if (systemAttributes.includes(systemField)) {
              mappings.push({
                sfxField: systemField,
                importField: field.name
              });
            }
          });
          break;
        }
      }
    });
    
    return mappings;
  };

  // Analýza pomocí OpenAI API
  const analyzeWithOpenAI = async (fields: XmlField[]) => {
    try {
      setAnalyzingWithAI(true);
      
      // Příprava dat pro OpenAI API
      const fieldsWithSamples = fields.map(field => ({
        name: field.name,
        path: field.path,
        sample: field.sample.substring(0, 100) // Omezíme délku vzorku
      }));
      
      // Vytvoření seznamu systémových atributů pro API
      const systemAttributesList = systemAttributes.map(attr => {
        // Odstraníme hvězdičku z povinných polí pro lepší porovnání
        return attr.replace('*', '').trim();
      });
      
      // Sestavení dotazu pro OpenAI
      const prompt = {
        model: "gpt-4-turbo",
        messages: [
          {
            role: "system",
            content: "Jsi expert na mapování datových struktur. Tvým úkolem je analyzovat pole z XML/JSON souboru s pracovními pozicemi a navrhnout mapování na systémové atributy."
          },
          {
            role: "user",
            content: `Analyzuj následující pole z ${fileType === 'xml' ? 'XML' : 'JSON'} souboru a navrhni mapování na systémové atributy.
            
Pole z ${fileType === 'xml' ? 'XML' : 'JSON'} souboru:
${JSON.stringify(fieldsWithSamples, null, 2)}

Dostupné systémové atributy:
${JSON.stringify(systemAttributesList, null, 2)}

Pro každé pole z XML/JSON souboru navrhni nejlepší odpovídající systémový atribut. 
Pokud pole neodpovídá žádnému systémovému atributu, ignoruj ho.
Vráť odpověď jako JSON pole objektů ve formátu [{sfxField: "název systémového atributu", importField: "název pole z XML/JSON"}].`
          }
        ],
        temperature: 0.2,
        max_tokens: 1500
      };
      
      // Volání OpenAI API
      console.log("Sending request to OpenAI API...");
      const response = await fetch("/api/openai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(prompt)
      });
      
      if (!response.ok) {
        throw new Error(`API odpověděla s kódem: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("OpenAI API response:", data);
      
      // Zpracování odpovědi
      let aiMappings: Array<{sfxField: string, importField: string}> = [];
      
      try {
        // Extrahujeme JSON z textové odpovědi
        const content = data.choices[0].message.content;
        
        // Hledáme JSON v odpovědi
        const jsonMatch = content.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          aiMappings = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error("Nepodařilo se najít JSON v odpovědi API");
        }
      } catch (parseError) {
        console.error("Chyba při zpracování odpovědi API:", parseError);
        throw new Error("Nepodařilo se zpracovat odpověď API");
      }
      
      // Zkontrolujeme, že máme správný formát dat
      if (!Array.isArray(aiMappings)) {
        throw new Error("API nevrátila pole mapování");
      }
      
      // Filtrujeme a validujeme mapování
      const validMappings = aiMappings.filter(mapping => {
        return (
          mapping && 
          typeof mapping === 'object' && 
          'sfxField' in mapping && 
          'importField' in mapping &&
          systemAttributes.includes(mapping.sfxField) &&
          fields.some(field => field.name === mapping.importField)
        );
      });
      
      return validMappings;
    } catch (error) {
      console.error("Chyba při analýze pomocí OpenAI:", error);
      setError("Chyba při AI analýze: " + (error instanceof Error ? error.message : "Neznámá chyba"));
      return [];
    } finally {
      setAnalyzingWithAI(false);
    }
  };

  // Analýza souboru
  const analyzeFile = async () => {
    if (!fileContent || !fileType) return;
    
    setAnalyzingFile(true);
    setError(null);
    
    try {
      let structure: FileStructure | null = null;
      
      if (fileType === 'xml') {
        structure = parseXml(fileContent);
      } else if (fileType === 'json') {
        structure = parseJson(fileContent);
      }
      
      if (structure) {
        setFileStructure(structure);
        
        // Základní mapování
        let mappings = suggestMappings(structure.fields);
        
        // Pokud je povoleno AI a máme API endpoint
        if (useAI) {
          const aiMappings = await analyzeWithOpenAI(structure.fields);
          
          if (aiMappings.length > 0) {
            // Sloučíme základní mapování s AI mapováním, přičemž AI má přednost
            const existingFields = new Set(aiMappings.map(m => m.sfxField));
            
            // Přidáme základní mapování pro pole, která AI nezmapovala
            const additionalMappings = mappings.filter(m => !existingFields.has(m.sfxField));
            
            mappings = [...aiMappings, ...additionalMappings];
          }
        }
        
        setSuggestedMappings(mappings);
        
        // Předání mapování rodiči
        if (onMappingsSuggested && mappings.length > 0) {
          onMappingsSuggested(mappings);
        }
      }
    } catch (error) {
      console.error(`Error analyzing ${fileType}:`, error);
      setError(`Chyba při analýze souboru: ${error instanceof Error ? error.message : "Neznámá chyba"}`);
    } finally {
      setAnalyzingFile(false);
    }
  };

  // Automatická analýza při nahrání souboru
  useEffect(() => {
    if (fileContent && fileType) {
      analyzeFile();
    }
  }, [fileContent, fileType]);

  const handleUseField = (fieldName: string) => {
    // Najít odpovídající pole v systémových atributech
    const field = fileStructure?.fields.find(f => f.name === fieldName);
    
    if (!field) return;
    
    // Najít potenciální systémový atribut podle názvu pole
    const fieldNameLower = field.name.toLowerCase().replace(/[_-]/g, '');
    const potentialSystemAttributes: string[] = [];
    
    for (const systemAttr of systemAttributes) {
      const attrLower = systemAttr.toLowerCase().replace(/\s+/g, '');
      if (fieldNameLower.includes(attrLower) || attrLower.includes(fieldNameLower)) {
        potentialSystemAttributes.push(systemAttr);
      }
    }
    
    // Vybereme první odpovídající systémový atribut nebo první ze seznamu
    const targetSystemAttribute = potentialSystemAttributes.length > 0 
      ? potentialSystemAttributes[0] 
      : systemAttributes[0];
    
    // Vytvoříme mapování pro tento atribut
    const mapping = {
      sfxField: targetSystemAttribute,
      importField: field.name
    };
    
    // Informujeme rodiče o mapování
    if (onMappingsSuggested) {
      onMappingsSuggested([mapping]);
    }
  };

  if (error) {
    return (
      <div className="border rounded-md p-4 bg-red-50">
        <Alert variant="destructive">
          <AlertTitle>Chyba při zpracování souboru</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!fileStructure && !analyzingFile) {
    return (
      <div className="border rounded-md p-4 bg-gray-50">
        <div className="flex items-start gap-2">
          <InfoIcon className="h-5 w-5 text-blue-500 mt-0.5" />
          <div>
            <h3 className="font-medium">Čekám na nahrání souboru</h3>
            <p className="text-sm text-gray-500">
              Nahrajte XML nebo JSON soubor pro analýzu a automatické mapování atributů.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="border rounded-md p-4 bg-gray-50">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-2">
          {fileType === 'json' ? (
            <FileJson className="h-5 w-5 text-blue-500 mt-0.5" />
          ) : (
            <InfoIcon className="h-5 w-5 text-blue-500 mt-0.5" />
          )}
          <div>
            <h3 className="font-medium">
              {fileType === 'json' ? 'JSON Struktura' : 'XML Struktura'}
            </h3>
            <p className="text-sm text-gray-500">
              {xmlFile 
                ? `Analyzovaný soubor: ${xmlFile.name}` 
                : `Ukázková struktura ${fileType === 'json' ? 'JSON' : 'XML'} souboru`}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch
            id="use-ai"
            checked={useAI}
            onCheckedChange={(checked) => {
              setUseAI(checked);
              if (checked && fileStructure) {
                // Pokud zapneme AI a máme strukturu, provedeme novou analýzu
                analyzeFile();
              }
            }}
          />
          <Label htmlFor="use-ai" className="flex items-center">
            <BrainCircuit className="h-4 w-4 mr-1 text-blue-600" />
            <span className="text-sm">Použít AI</span>
          </Label>
        </div>
      </div>

      {(analyzingFile || analyzingWithAI) && (
        <div className="flex items-center justify-center p-4 mb-4 bg-blue-50 rounded">
          <Loader2 className="h-5 w-5 animate-spin mr-2 text-blue-500" />
          <p className="text-sm text-blue-600">
            {analyzingWithAI 
              ? "Analyzuji obsah souboru pomocí AI..." 
              : "Analyzuji obsah souboru a navrhuji mapování..."}
          </p>
        </div>
      )}
      
      {suggestedMappings.length > 0 && (
        <Alert className="mb-4 bg-green-50 border-green-200">
          <div className="flex items-center justify-between">
            <AlertTitle className="text-green-700">
              {useAI ? "AI navržená mapování" : "Navržená mapování"}
            </AlertTitle>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                setSuggestedMappings([]);
                if (onMappingsSuggested) {
                  onMappingsSuggested([]);
                }
              }}
            >
              Smazat mapování
            </Button>
          </div>
          <AlertDescription>
            <ul className="text-sm text-green-600 mt-2">
              {suggestedMappings.map((mapping, idx) => (
                <li key={idx} className="mb-1 flex items-center justify-between">
                  <div>
                    <span className="font-semibold">{mapping.sfxField}</span> → {mapping.importField}
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      const newMappings = suggestedMappings.filter((_, i) => i !== idx);
                      setSuggestedMappings(newMappings);
                      if (onMappingsSuggested) {
                        onMappingsSuggested(newMappings);
                      }
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 6L6 18"></path>
                      <path d="M6 6l12 12"></path>
                    </svg>
                  </Button>
                </li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {fileStructure && (
        <>
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline">Root Element</Badge>
              <span className="font-mono text-sm">{fileStructure.rootElement}</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">Item Element</Badge>
              <span className="font-mono text-sm">{fileStructure.itemElement}</span>
            </div>
          </div>

          <Accordion type="single" collapsible className="w-full">
            {fileStructure.fields.map((field, index) => (
              <AccordionItem key={index} value={field.name}>
                <AccordionTrigger className="hover:bg-gray-100 p-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{field.name}</span>
                    <span className="text-xs text-gray-500 font-mono">{field.path}</span>
                    {suggestedMappings.some(m => m.importField === field.name) && (
                      <Badge variant="secondary" className="ml-2">Navržené mapování</Badge>
                    )}
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="p-2 bg-white rounded border mb-2">
                    <div className="text-xs text-gray-500 mb-1">Ukázková hodnota:</div>
                    <div className="font-mono text-sm">{field.sample}</div>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button 
                      size="sm" 
                      variant="secondary"
                      onClick={() => handleUseField(field.name)}
                    >
                      Použít
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </>
      )}

      <div className="mt-4 text-xs text-gray-500">
        Tip: Klikněte na pole pro zobrazení detailů a mapování
      </div>
    </div>
  )
} 