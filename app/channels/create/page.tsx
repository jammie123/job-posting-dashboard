"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { LeftMenu } from "@/components/left-menu"
import { TopHeader } from "@/components/top-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, ArrowLeft } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AttributeMapping } from "@/types/channel-mapping"
import { systemAttributes } from "@/types/channel-mapping"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface FileField {
  name: string;
  path: string;
  sample: string;
}

export default function CreateChannelPage() {
  const router = useRouter()
  const [channelName, setChannelName] = useState("")
  const [channelType, setChannelType] = useState("jobboard")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [mappings, setMappings] = useState<AttributeMapping[]>(
    systemAttributes.map(attr => ({
      sfxField: attr,
      importField: "Don't map this field",
      mapped: false
    }))
  )
  const [fileFields, setFileFields] = useState<FileField[]>([])
  const [analyzingFile, setAnalyzingFile] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Funkce pro nahrání XML nebo JSON souboru
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setError(null);
      setFileFields([]);
      analyzeFile(e.target.files[0]);
    }
  }

  // Funkce pro změnu mapování atributu
  const handleMappingChange = (index: number, newValue: string) => {
    const newMappings = [...mappings]
    newMappings[index] = {
      ...newMappings[index],
      importField: newValue,
      mapped: newValue !== "Don't map this field"
    }
    setMappings(newMappings)
  }

  // Analyzuje XML nebo JSON soubor a extrahuje pole
  const analyzeFile = async (file: File) => {
    setAnalyzingFile(true);
    
    try {
      const content = await readFileContent(file);
      let fields: FileField[] = [];
      
      if (file.name.endsWith('.xml')) {
        fields = parseXml(content);
      } else if (file.name.endsWith('.json')) {
        fields = parseJson(content);
      } else {
        throw new Error("Nepodporovaný typ souboru. Podporovány jsou pouze .xml a .json soubory.");
      }
      
      setFileFields(fields);
      
      // Automatické mapování polí
      autoMapFields(fields);
    } catch (error) {
      console.error("Chyba při analýze souboru:", error);
      setError(`Chyba při analýze souboru: ${error instanceof Error ? error.message : "Neznámá chyba"}`);
    } finally {
      setAnalyzingFile(false);
    }
  };
  
  // Přečte obsah souboru jako text
  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          resolve(e.target.result as string);
        } else {
          reject(new Error("Nepodařilo se přečíst soubor"));
        }
      };
      reader.onerror = () => reject(new Error("Chyba při čtení souboru"));
      reader.readAsText(file);
    });
  };
  
  // Parsuje XML soubor
  const parseXml = (xmlContent: string): FileField[] => {
    try {
      const fields: FileField[] = [];
      const processedPaths = new Set<string>(); // Pro sledování již zpracovaných cest
      
      // Použijeme DOMParser pro zpracování XML
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlContent, "text/xml");
      
      // Kontrola chyb při parsování
      const parserError = xmlDoc.querySelector("parsererror");
      if (parserError) {
        throw new Error("Neplatný XML formát");
      }
      
      // Funkce pro získání úplné XPath cesty k elementu
      const getXPath = (element: Element): string => {
        if (!element.parentElement || element === xmlDoc.documentElement) {
          return element.tagName;
        }
        return `${getXPath(element.parentElement)}/${element.tagName}`;
      };
      
      // Funkce pro extrakci všech jednoduchých elementů (s textovým obsahem)
      const extractTextElement = (element: Element, path = ""): void => {
        // Zpracuj atributy
        if (element.attributes && element.attributes.length > 0) {
          for (let i = 0; i < element.attributes.length; i++) {
            const attr = element.attributes[i];
            const attrPath = path ? `${path}/@${attr.name}` : `@${attr.name}`;
            
            if (!processedPaths.has(attrPath)) {
              fields.push({
                name: attr.name,
                path: attrPath,
                sample: attr.value.substring(0, 100)
              });
              processedPaths.add(attrPath);
            }
          }
        }
        
        // Pokud uzel obsahuje jen textový obsah
        const hasOnlyTextContent = element.childNodes.length === 1 && 
                                   element.firstChild && 
                                   element.firstChild.nodeType === 3 && 
                                   element.textContent && 
                                   element.textContent.trim() !== "";
        
        if (hasOnlyTextContent) {
          const elementPath = path ? `${path}/${element.tagName}` : element.tagName;
          
          if (!processedPaths.has(elementPath)) {
            fields.push({
              name: element.tagName,
              path: elementPath,
              sample: element.textContent!.trim().substring(0, 100)
            });
            processedPaths.add(elementPath);
          }
        }
        
        // Rekurzivně procházíme potomky
        Array.from(element.children).forEach(child => {
          const childPath = path ? `${path}/${element.tagName}` : element.tagName;
          extractTextElement(child, childPath);
        });
      };
      
      // Najdeme opakující se struktury (item elementy)
      const findRepeatingItems = (): Element[] => {
        // Seznam běžných názvů pro opakující se položky
        const commonItemNames = ["item", "job", "position", "offer", "record", "entry", "product"];
        
        // Nejdříve hledáme podle běžných názvů
        for (const name of commonItemNames) {
          const items = xmlDoc.getElementsByTagName(name);
          if (items.length > 0) {
            return Array.from(items);
          }
        }
        
        // Pokud neúspěšně, zkusíme najít opakující se elementy na stejné úrovni
        const countByParentAndTag: Record<string, Record<string, Element[]>> = {};
        
        const allElements = xmlDoc.getElementsByTagName("*");
        for (let i = 0; i < allElements.length; i++) {
          const element = allElements[i];
          if (!element.parentElement) continue;
          
          const parentPath = getXPath(element.parentElement);
          const tagName = element.tagName;
          
          if (!countByParentAndTag[parentPath]) {
            countByParentAndTag[parentPath] = {};
          }
          
          if (!countByParentAndTag[parentPath][tagName]) {
            countByParentAndTag[parentPath][tagName] = [];
          }
          
          countByParentAndTag[parentPath][tagName].push(element);
        }
        
        // Najdeme nejčastější opakující se elementy
        let mostCommon: Element[] = [];
        
        for (const parentPath in countByParentAndTag) {
          for (const tag in countByParentAndTag[parentPath]) {
            const elements = countByParentAndTag[parentPath][tag];
            if (elements.length > 1 && elements.length > mostCommon.length) {
              // Ujistíme se, že elementy mají podobnou strukturu (jsou to opravdu stejné typy položek)
              const firstChildTags = elements[0].children.length > 0 
                ? Array.from(elements[0].children).map(c => c.tagName).join(",")
                : "";
              
              let allSimilar = true;
              for (let i = 1; i < elements.length; i++) {
                const childTags = elements[i].children.length > 0
                  ? Array.from(elements[i].children).map(c => c.tagName).join(",")
                  : "";
                
                if (childTags !== firstChildTags) {
                  allSimilar = false;
                  break;
                }
              }
              
              if (allSimilar) {
                mostCommon = elements;
              }
            }
          }
        }
        
        return mostCommon.length > 0 ? mostCommon : [xmlDoc.documentElement];
      };
      
      // Najdeme opakující se položky
      const repeatingItems = findRepeatingItems();
      
      if (repeatingItems.length > 0) {
        // Vezmeme první položku jako vzor a extrahujeme všechny její atributy
        const firstItem = repeatingItems[0];
        console.log("Nalezená opakující se položka:", firstItem.tagName);
        
        // Zpracujeme vnořené elementy
        processNestedElements(firstItem);
        
        // Pokud jsme nenašli žádná pole, zkusíme přímo zpracovat kořenový element
        if (fields.length === 0) {
          extractTextElement(xmlDoc.documentElement);
        }
      } else {
        // Záložní řešení: projít celý dokument
        extractTextElement(xmlDoc.documentElement);
      }
      
      // Funkce pro zpracování vnořených elementů s podporou pro opakující se seznamy
      function processNestedElements(element: Element, basePath: string = "") {
        // Nejprve zpracujeme všechny přímé textové potomky
        const path = basePath ? `${basePath}/${element.tagName}` : element.tagName;
        
        // Zpracuj atributy elementu
        if (element.attributes && element.attributes.length > 0) {
          for (let i = 0; i < element.attributes.length; i++) {
            const attr = element.attributes[i];
            const attrPath = `${path}/@${attr.name}`;
            
            if (!processedPaths.has(attrPath)) {
              fields.push({
                name: attr.name,
                path: attrPath,
                sample: attr.value.substring(0, 100)
              });
              processedPaths.add(attrPath);
            }
          }
        }
        
        // Zpracujeme textový obsah, pokud existuje
        if (element.childNodes.length === 1 && element.firstChild && element.firstChild.nodeType === 3 && element.textContent) {
          const textValue = element.textContent.trim();
          if (textValue) {
            if (!processedPaths.has(path)) {
              fields.push({
                name: element.tagName,
                path: path,
                sample: textValue.substring(0, 100)
              });
              processedPaths.add(path);
            }
          }
        }
        
        // Vytvoříme mapu pro potomky podle názvu tagu
        const childrenByTag: Record<string, Element[]> = {};
        
        Array.from(element.children).forEach(child => {
          if (!childrenByTag[child.tagName]) {
            childrenByTag[child.tagName] = [];
          }
          childrenByTag[child.tagName].push(child);
        });
        
        // Zpracujeme každý typ potomka
        for (const tagName in childrenByTag) {
          const children = childrenByTag[tagName];
          
          if (children.length > 1) {
            // Toto je opakující se element - zpracujeme jen první jako vzor, ale označíme jako seznam
            const childPath = `${path}/${tagName}[]`;
            
            // Pokud má dítě vnořené elementy, rekurzivně ho zpracujeme
            if (children[0].children.length > 0) {
              processNestedElements(children[0], path);
            } 
            // Jinak ho přidáme jako jednoduchý element
            else if (children[0].textContent) {
              const samples = children.slice(0, 3).map(c => c.textContent?.trim()).filter(Boolean).join(", ");
              
              if (!processedPaths.has(childPath)) {
                fields.push({
                  name: tagName,
                  path: childPath,
                  sample: samples.substring(0, 100)
                });
                processedPaths.add(childPath);
              }
            }
          } else {
            // Jeden element - normálně ho zpracujeme rekurzivně
            processNestedElements(children[0], path);
          }
        }
      }
      
      return fields;
    } catch (error) {
      console.error("Chyba při parsování XML:", error);
      throw new Error(`Chyba při parsování XML: ${error instanceof Error ? error.message : "Neznámá chyba"}`);
    }
  };
  
  // Parsuje JSON soubor
  const parseJson = (jsonContent: string): FileField[] => {
    try {
      const data = JSON.parse(jsonContent);
      const fields: FileField[] = [];
      
      // Zpracování dat
      if (Array.isArray(data) && data.length > 0) {
        // Pokud je to pole, vezmeme první položku a extrahujeme z ní pole
        const firstItem = data[0];
        extractFields(firstItem, "", fields);
      } else {
        // Zpracování objektu
        extractFields(data, "", fields);
      }
      
      return fields;
    } catch (error) {
      console.error("Chyba při parsování JSON:", error);
      throw new Error("Chyba při parsování JSON: " + (error instanceof Error ? error.message : "Neznámá chyba"));
    }
  };
  
  // Extrahuje pole z objektu
  const extractFields = (obj: any, basePath: string, fields: FileField[], prefix: string = "") => {
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
            extractFields(value, `${path}`, fields, "");
          } else {
            // Rekurzivně procházíme vnořené objekty
            extractFields(value, path, fields, `${fieldName}.`);
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
            // Nalezli jsme pole objektů
            extractFields(value[0], `${path}[0]`, fields, "");
          }
        }
      }
    }
  };
  
  // Automatické mapování polí na základě názvů
  const autoMapFields = (fields: FileField[]) => {
    const newMappings = [...mappings];
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
      "body": ["Text"],
      
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
      
      "education": ["Education degree"],
      "degree": ["Education degree"],
      "qualification": ["Education degree"],
      
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
    
    // Pro každé pole z importovaného souboru hledáme odpovídající systémový atribut
    fields.forEach(field => {
      const fieldNameLower = field.name.toLowerCase().replace(/[-_\.]/g, '');
      
      // Hledáme v mapě podle názvu pole
      for (const [externalField, systemFields] of Object.entries(fieldNameMap)) {
        if (fieldNameLower.includes(externalField) || externalField.includes(fieldNameLower)) {
          // Našli jsme odpovídající systémový atribut
          systemFields.forEach(systemField => {
            // Najdeme index v našem seznamu mappings
            const mappingIndex = newMappings.findIndex(m => m.sfxField === systemField);
            
            if (mappingIndex !== -1) {
              newMappings[mappingIndex] = {
                ...newMappings[mappingIndex],
                importField: field.name,
                mapped: true
              };
            }
          });
          break;
        }
      }
    });
    
    setMappings(newMappings);
  };

  // Funkce pro vytvoření kanálu
  const handleCreateChannel = () => {
    if (!channelName.trim()) {
      setError("Zadejte název kanálu");
      return;
    }

    // Zde by se odeslala data na backend
    console.log("Vytvářím kanál:", {
      name: channelName,
      type: channelType,
      mappings: mappings
    });

    // Přesměrujeme zpět na seznam kanálů
    router.push("/channels");
  }

  // Funkce pro reset formuláře
  const resetForm = () => {
    setChannelName("");
    setChannelType("jobboard");
    setSelectedFile(null);
    setFileFields([]);
    setError(null);
    setMappings(
      systemAttributes.map(attr => ({
        sfxField: attr,
        importField: "Don't map this field",
        mapped: false
      }))
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="left-menu">
        <LeftMenu />
      </div>
      <div className="main-content pl-[60px] xl:pl-[140px]">
        <div className="top-header">
          <TopHeader userName="Anna K." companyName="Acme Corporation s.r.o." />
        </div>
        
        <main className="container mx-auto px-6 py-8">
          <div className="flex items-center mb-8">
            <Button 
              variant="outline" 
              className="mr-4"
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Zpět
            </Button>
            <h1 className="text-2xl font-bold">Vytvořit nový kanál</h1>
          </div>
          
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertTitle>Chyba</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="grid gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Základní informace</h2>
              
              <div className="grid gap-4 mb-6">
                <div className="grid gap-2">
                  <Label htmlFor="channel-name">Název kanálu *</Label>
                  <Input
                    id="channel-name"
                    placeholder="Zadejte název kanálu"
                    value={channelName}
                    onChange={(e) => setChannelName(e.target.value)}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="channel-type">Typ kanálu</Label>
                  <Select
                    value={channelType}
                    onValueChange={setChannelType}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Vyberte typ kanálu" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="jobboard">Pracovní portál (Jobboard)</SelectItem>
                      <SelectItem value="ats">ATS Systém</SelectItem>
                      <SelectItem value="xml-feed">XML Feed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button 
                  variant="outline" 
                  className="ml-2"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Nahrát XML/JSON
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept=".xml,.json"
                  onChange={handleFileUpload}
                />
              </div>
            </div>
            
            {selectedFile && (
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Informace o souboru</h2>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{selectedFile.name}</Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedFile(null)}
                    >
                      Zrušit
                    </Button>
                  </div>
                </div>
                
                {analyzingFile ? (
                  <div className="text-center p-4">
                    <div className="inline-block animate-spin h-6 w-6 border-2 border-current border-t-transparent text-blue-600 rounded-full mr-2"></div>
                    <p>Analyzuji soubor...</p>
                  </div>
                ) : (
                  <div className="text-sm text-gray-500 mb-4">
                    <p>Nalezeno {fileFields.length} polí v souboru.</p>
                    <p>Automaticky jsem namapoval {mappings.filter(m => m.mapped).length} atributů.</p>
                  </div>
                )}
                
                {fileFields.length > 0 && (
                  <div className="border rounded-lg overflow-hidden mb-4">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-100">
                          <TableHead className="font-medium">Pole v souboru</TableHead>
                          <TableHead className="font-medium">Ukázková hodnota</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {fileFields.slice(0, 10).map((field, index) => (
                          <TableRow key={index} className="hover:bg-gray-50">
                            <TableCell className="font-medium">{field.name}</TableCell>
                            <TableCell className="text-sm text-gray-600">{field.sample}</TableCell>
                          </TableRow>
                        ))}
                        {fileFields.length > 10 && (
                          <TableRow>
                            <TableCell colSpan={2} className="text-center text-sm text-gray-500">
                              a dalších {fileFields.length - 10} polí...
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            )}
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Mapování atributů</h2>
              
              {!selectedFile && (
                <div className="mb-6 text-sm text-gray-500">
                  Pro automatické mapování atributů nahrajte XML nebo JSON soubor pomocí tlačítka "Nahrát XML/JSON" výše,
                  nebo můžete ručně mapovat atributy níže.
                </div>
              )}
              
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-100">
                      <TableHead className="w-1/3 py-3 font-medium">Atributy v systému</TableHead>
                      <TableHead className="w-2/3 py-3 font-medium">Atributy v kanálu</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mappings.map((mapping, index) => (
                      <TableRow key={index} className={mapping.mapped ? "bg-green-50 hover:bg-green-100" : "hover:bg-gray-50"}>
                        <TableCell className="py-3">
                          <div className="flex items-center">
                            <span>{mapping.sfxField}</span>
                            {mapping.sfxField.includes('*') && (
                              <span className="ml-2 text-xs text-red-500">Povinné</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="py-3">
                          <Select
                            value={mapping.importField}
                            onValueChange={(value) => handleMappingChange(index, value)}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Vybrat atribut" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Don't map this field">Nemapovat</SelectItem>
                              {fileFields.map((field, fieldIndex) => (
                                <SelectItem key={fieldIndex} value={field.name}>
                                  {field.name} {field.sample && `(${field.sample.substring(0, 30)}${field.sample.length > 30 ? '...' : ''})`}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
            
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={resetForm}>Zrušit</Button>
              <Button onClick={handleCreateChannel}>Vytvořit kanál</Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
} 