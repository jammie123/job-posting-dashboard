"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { SalaryInput } from "../new-position/components/salary-input"
import { LanguageSelector, SelectedLanguage } from "../new-position/components/language-selector"
import { MultiSelect } from "@/components/ui/multi-select"
import { RichTextEditor } from "../new-position/components/rich-text-editor"
import { Switch } from "@/components/ui/switch"
import { useState, useEffect, useRef } from "react"
import { Loader2, Info, Pencil, Plus, Edit, Save } from "lucide-react"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AutomaticResponse } from "../new-position/components/automatic-response"
import { ApplicationForm } from "../new-position/components/application-form"
import { Checkbox } from "@/components/ui/checkbox"

// Importujeme konstanty z původní verze
import { 
  localities, 
  fields, 
  professions, 
  educationLevels, 
  benefits, 
  levels 
} from "../new-position/first-step"

const FormSchema = z.object({
  title: z.string().min(1, "Název pozice je povinný"),
  locality: z.array(z.string()).min(1, "Vyberte alespoň jednu lokalitu"),
  field: z.string().min(1, "Vyberte obor"),
  profession: z.array(z.string()).min(1, "Vyberte alespoň jednu profesi"),
  description: z.string().min(1, "Popis pozice je povinný"),
  type: z.enum(["full", "part"], {
    required_error: "Vyberte typ úvazku",
  }),
  salary: z.object({
    from: z.number().min(0),
    to: z.number().min(0),
  }).optional(),
  education: z.string().optional(),
  benefits: z.array(z.string()).default([]),
  languages: z.array(z.object({
    code: z.string(),
    name: z.string(),
    level: z.string()
  })).default([]),
})

// Funkce pro volání OpenAI API
async function suggestFieldAndProfession(position: string) {
  try {
    const response = await fetch('/api/suggest-fields', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ position }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    return await response.json();
  } catch (error) {
    console.error('Error suggesting fields:', error);
    throw error;
  }
}

// Upravit rozhraní props
export interface FirstStepProps {
  onNextStep: () => void
  onShowSidebar?: () => void
  initialData?: any
  onDataChange?: (data: any) => void
}

// Oprava typů pro lepší typovou kontrolu
interface AutoFilledInfo {
  field: string;
  professions: string[];
  description?: string;
  salary?: { from: number; to: number };
  education?: string;
  benefits?: string[];
}

// Pomocný hook pro určení, zda komponenta běží na klientovi
function useIsMounted() {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  return isMounted;
}

// Komponenta pro bezpečné vykreslení HTML popisu pozice
interface PositionDescriptionProps {
  html: string;
  className?: string;
}

function PositionDescription({ html, className = "" }: PositionDescriptionProps) {
  const isMounted = useIsMounted();
  
  if (!isMounted) {
    return <div className={`position-description ${className}`}></div>;
  }
  
  return (
    <div 
      className={`position-description ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

type QuestionType = "text" | "multiple" | "single" | "date"
type QuestionVisibility = "required" | "optional" | "hidden"

interface Question {
  id: string
  name: string
  type: QuestionType
  visibility: QuestionVisibility
}

const questionTypes = [
  { value: "text", label: "Jednoduchý text" },
  { value: "multiple", label: "Výběr z více možností" },
  { value: "single", label: "Výběr z jedné možnosti" },
  { value: "date", label: "Datum" },
]

export function FirstStepV2({ onNextStep, onShowSidebar, initialData, onDataChange }: FirstStepProps) {
  const [isRemote, setIsRemote] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [autoFilledInfo, setAutoFilledInfo] = useState<AutoFilledInfo | null>(null)
  const [showFieldsForm, setShowFieldsForm] = useState(false)
  const [showValidationErrors, setShowValidationErrors] = useState(false)
  const [isFormLoaded, setIsFormLoaded] = useState(false)
  const [editAllFields, setEditAllFields] = useState(false)
  
  const isMounted = useIsMounted();
  
  const [editingFields, setEditingFields] = useState<Record<string, boolean>>({
    title: true,
    locality: false,
    field: false,
    profession: false,
    description: false,
    salary: false,
    type: false,
    education: false,
    languages: false,
    benefits: false
  })

  const [loadingFields, setLoadingFields] = useState<Record<string, boolean>>({
    title: false,
    field: false,
    profession: false,
    description: false,
    type: false,
    locality: false,
    salary: false,
    education: false,
    benefits: false,
    languages: false
  })

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      locality: [],
      profession: [],
      benefits: [],
      languages: [],
    },
    mode: "onSubmit"
  })

  const [questions, setQuestions] = useState<Question[]>([
    { id: "1", name: "Jméno a Příjmení", type: "text", visibility: "required" },
    { id: "2", name: "Email", type: "text", visibility: "required" },
    { id: "3", name: "Telefon", type: "text", visibility: "required" },
  ]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newQuestion, setNewQuestion] = useState<Partial<Question>>({
    type: "text",
  });
  const [positionDescription, setPositionDescription] = useState<string>("");
  const descriptionFetchedRef = useRef<{[key: string]: boolean}>({});

  // Efekt pro načtení popisu pozice z API při zadání názvu pozice
  useEffect(() => {
    const fetchPositionDescription = async (positionName: string) => {
      if (descriptionFetchedRef.current[positionName]) {
        console.log(`Popis pozice pro '${positionName}' již byl načten dříve.`);
        return;
      }

      try {
        console.log(`Načítám popis pozice pro '${positionName}'...`);
        const response = await fetch('/api/suggest-fields', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ position: positionName }),
        });
        
        if (!response.ok) {
          throw new Error('Nelze načíst popis pozice');
        }
        
        const data = await response.json();
        if (data.description) {
          setPositionDescription(data.description);
          descriptionFetchedRef.current[positionName] = true;
        }
      } catch (error) {
        console.error('Chyba při načítání popisu pozice:', error);
      }
    };

    const positionName = form.watch("title");
    if (positionName && positionName.trim() !== '') {
      fetchPositionDescription(positionName);
    }
  }, [form.watch("title")]);

  const handleAddQuestion = () => {
    if (newQuestion.name && newQuestion.type) {
      setQuestions([
        ...questions,
        {
          id: Math.random().toString(36).substr(2, 9),
          name: newQuestion.name,
          type: newQuestion.type as QuestionType,
          visibility: "optional",
        },
      ]);
      setNewQuestion({ type: "text" });
      setIsDialogOpen(false);
    }
  };

  const handleVisibilityChange = (questionId: string, visibility: QuestionVisibility) => {
    setQuestions(questions.map((q) => (q.id === questionId ? { ...q, visibility } : q)));
  };

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log("Form data:", data)
    
    if (onDataChange) {
      onDataChange(data);
    }
    
    console.log("Volání onNextStep callbacku z FirstStep komponenty");
    
    if (onShowSidebar) {
      console.log("Zobrazení sidebaru");
      onShowSidebar();
    }
    
    if (onNextStep) {
      onNextStep();
    }
  }

  const resetAutoFilledInfo = () => {
    setAutoFilledInfo(null);
    setShowFieldsForm(true);
    setShowValidationErrors(false);
    form.clearErrors(["field", "profession"]);
  };
  
  const showFieldsFormHandler = () => {
    setShowFieldsForm(true);
    setShowValidationErrors(false);
    form.clearErrors(["field", "profession"]);
  };

  const toggleFieldEdit = (fieldName: string) => {
    setEditingFields(prev => ({
      ...prev,
      [fieldName]: !prev[fieldName]
    }));
  };

  const handlePositionBlur = async () => {
    const newTitle = form.getValues('title');

    if (isMounted) {
      setEditingFields(prev => ({
        ...prev,
        title: false
      }));
    }

    if (!newTitle || newTitle.trim() === '') {
      return;
    }

    if (isMounted) {
      setLoadingFields(prev => ({
        ...prev,
        field: true,
        profession: true,
      }));
    }

    try {
      const result = await suggestFieldAndProfession(newTitle);

      if (result) {
        if (isMounted) {
          setAutoFilledInfo({
            field: result.field,
            professions: result.professions,
            description: result.description,
            salary: result.salary,
            education: result.education,
            benefits: result.benefits
          });
        }
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      if (isMounted) {
        toast.error("Nepodařilo se načíst doporučení");
      }
    } finally {
      if (isMounted) {
        setLoadingFields(prev => ({
          ...prev,
          field: false,
          profession: false,
        }));
      }
    }
  };

  function convertTextToHtml(text: string): string {
    if (!text) return '';
    return text.split('\n\n')
      .map(paragraph => `<p>${paragraph}</p>`)
      .join('');
  }

  const handleInputBlur = async <T,>(fieldId: string, value: T, processFn?: (value: T) => Promise<any>) => {
    console.log(`Handling blur for field ${fieldId} with value:`, value);
    
    setLoadingFields(prev => ({
      ...prev,
      [fieldId]: true
    }));
    
    try {
      if (processFn) {
        await processFn(value);
      }
    } catch (error) {
      console.error(`Error processing field ${fieldId}:`, error);
      toast.error(`Nepodařilo se zpracovat hodnotu pole ${fieldId}`);
    } finally {
      setLoadingFields(prev => ({
        ...prev,
        [fieldId]: false
      }));
    }
  };

  useEffect(() => {
    if (initialData) {
      console.log("Načítání počátečních dat:", initialData);
      
      if (initialData.title) {
        form.setValue("title", initialData.title);
      }
      
      if (initialData.locality && initialData.locality.length > 0) {
        form.setValue("locality", initialData.locality);
      }
      
      if (initialData.field) {
        form.setValue("field", initialData.field);
      }
      
      if (initialData.profession && initialData.profession.length > 0) {
        form.setValue("profession", initialData.profession);
      }
      
      if (initialData.description) {
        form.setValue("description", initialData.description);
      }
      
      if (initialData.type) {
        form.setValue("type", initialData.type);
      }
      
      if (initialData.salary) {
        form.setValue("salary", initialData.salary);
      }
      
      if (initialData.education) {
        form.setValue("education", initialData.education);
      }
      
      if (initialData.benefits && initialData.benefits.length > 0) {
        form.setValue("benefits", initialData.benefits);
      }
      
      if (initialData.languages && initialData.languages.length > 0) {
        form.setValue("languages", initialData.languages);
      }
      
      if (Object.keys(initialData).length > 0) {
        setIsFormLoaded(true);
      }
    }
  }, [initialData]);
  
  const watchedFields = form.watch();
  const lastSentDataRef = useRef<string>('{}');

  useEffect(() => {
    if (isFormLoaded && onDataChange && !isLoading) {
      const timer = setTimeout(() => {
        const currentValues = form.getValues();
        const currentValuesJson = JSON.stringify(currentValues);
        
        if (currentValuesJson !== lastSentDataRef.current) {
          console.log("Aktualizace dat formuláře:", currentValues);
          onDataChange(currentValues);
          lastSentDataRef.current = currentValuesJson;
        } else {
          console.log("Přeskakuji aktualizaci - data se nezměnila");
        }
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [watchedFields, isFormLoaded, onDataChange, isLoading]);

  useEffect(() => {
    if (editAllFields) {
      setEditingFields({
        title: true,
        locality: true,
        field: true,
        profession: true,
        description: true,
        salary: true,
        type: true,
        education: true,
        languages: true,
        benefits: true
      });
    } else {
      setEditingFields({
        title: false,
        locality: false,
        field: false,
        profession: false,
        description: false,
        salary: false,
        type: false,
        education: false,
        languages: false,
        benefits: false
      });
    }
  }, [editAllFields]);

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 relative">
      {/* Plovoucí přepínač pro hromadnou editaci - viditelný vždy když je zobrazen formulář */}
      {showFieldsForm && (
        <div className="fixed right-8 top-1/3 z-10 bg-white shadow-xl rounded-lg border border-gray-200 p-4 flex flex-col items-center gap-3 transition-all hover:shadow-2xl">
          <div className="flex items-center gap-2">
            <Edit className="h-4 w-4 text-blue-600" />
            <Label htmlFor="edit-mode-switch" className="text-sm font-semibold text-center cursor-pointer">
              Hromadná editace
            </Label>
          </div>
          <Switch
            id="edit-mode-switch"
            checked={editAllFields}
            onCheckedChange={setEditAllFields}
            className="data-[state=checked]:bg-blue-600"
          />
          {editAllFields && (
            <Button 
              type="button"
              size="sm"
              variant="outline"
              className="mt-2 text-xs flex items-center gap-1"
              onClick={() => setEditAllFields(false)}
            >
              <Save className="h-3 w-3" />
              Uložit vše
            </Button>
          )}
        </div>
      )}

      <div className="p-6 grid gap-6">
        {showFieldsForm && (
          <div>
            <h3 className="text-lg font-medium">Detaily pozice</h3>
          </div>
        )}

        {/* Název pozice - vždy viditelný */}
        <div className="mb-4">
          <Label htmlFor="title">Název pozice*</Label>
          <Input
            id="title"
            placeholder="Např. Java Developer, Projektový manažer, Účetní..."
            className={`w-full ${showValidationErrors && Boolean(form.formState.errors.title) ? 'border-red-500' : ''}`}
            {...form.register("title")}
            autoFocus={editingFields.title}
            onBlur={editAllFields ? undefined : handlePositionBlur}
          />
          {showValidationErrors && form.formState.errors.title && (
            <p className="text-red-500 text-sm mt-1">{form.formState.errors.title.message}</p>
          )}
        </div>

        {/* Tlačítko pro zobrazení celého formuláře */}
        {!showFieldsForm && (
          <Button 
            type="button" 
            variant="ghost" 
            onClick={showFieldsFormHandler}
            className="w-fit"
          >
            Zadat pozici běžným způsobem
          </Button>
        )}

        {/* Zbytek formuláře se zobrazí až po kliknutí na tlačítko nebo po načtení dat z API */}
        {showFieldsForm && (
          <div className="space-y-2">
            {/* Popis pozice */}
            <div className={`rounded-md relative group hover:bg-accent/5 transition-colors pb-5 ${editingFields.description ? "p-4 border flex-col w-full" : ""}`}>
              <div className="flex items-baseline justify-between mr-2">
                <p className="font-medium text-sm w-[200px]">Popis pozice</p>
                {!editingFields.description && !editAllFields && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="absolute right-0 top-0 hidden group-hover:block transition-opacity h-7"
                    onClick={() => toggleFieldEdit('description')}
                  >
                    Upravit
                  </Button>
                )}
              </div>
              
              {editingFields.description || editAllFields ? (
                <div className="mt-2 w-full">
                  <div className="relative">
                    <RichTextEditor
                      value={form.watch("description") || ""}
                      onChange={(value) => {
                        form.setValue("description", value)
                        handleInputBlur("description", value)
                      }}
                      className="min-h-[200px]"
                    />
                    {loadingFields.description && (
                      <div className="absolute right-3 top-3 flex items-center gap-1.5 bg-white/90 px-2 py-1 rounded-md z-10">
                        <span className="text-xs text-muted-foreground">načítám...</span>
                        <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  
                  {showValidationErrors && form.formState.errors.description && (
                    <p className="text-sm text-destructive mt-1">{form.formState.errors.description.message}</p>
                  )}
                  
                  {!editAllFields && (
                    <div className="flex justify-end mt-4">
                      <Button 
                        variant="default"
                        size="sm" 
                        onClick={() => toggleFieldEdit('description')}
                      >
                        Uložit
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="mt-1 prose prose-sm max-w-none min-h-[50px]" dangerouslySetInnerHTML={{ __html: form.watch("description") || '<p>Nespecifikováno</p>' }} />
              )}
            </div>

            {/* Místo výkonu práce */}
            <div className={`flex rounded-md relative group hover:bg-accent/5 transition-colors ${editingFields.locality ? "p-4 border flex-col w-full" : ""}`}>
              <div className="flex justify-between items-center mr-2">
                <p className="font-medium text-sm w-[200px]">Místo výkonu práce</p>
                {!editingFields.locality && !editAllFields && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="absolute right-0 top-0 hidden group-hover:block transition-opacity h-7"
                    onClick={() => toggleFieldEdit('locality')}
                  >
                    Upravit
                  </Button>
                )}
              </div>
              
              {editingFields.locality || editAllFields ? (
                <div className="mt-2 flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Switch
                      id="remote-switch"
                      checked={isRemote}
                      onCheckedChange={(checked) => {
                        setIsRemote(checked)
                        if (checked) {
                          form.setValue("locality", [])
                        }
                      }}
                    />
                    <Label htmlFor="remote-switch" className="text-sm font-normal">
                      Vzdálená práce
                    </Label>
                  </div>
                  
                  <div className="relative">
                    <MultiSelect
                      options={[...localities.headquarters, ...localities.branches, ...localities.others]}
                      selected={form.watch("locality")}
                      onChange={(value) => {
                        form.setValue("locality", value)
                        handleInputBlur("locality", value)
                      }}
                      placeholder="Vyberte lokality"
                      isRemote={isRemote}
                      headquartersAddress={localities.headquarters[0]}
                    />
                    {loadingFields.locality && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1.5">
                        <span className="text-xs text-muted-foreground">načítám...</span>
                        <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  
                  {showValidationErrors && form.formState.errors.locality && (
                    <p className="text-sm text-destructive mt-1">{form.formState.errors.locality.message}</p>
                  )}
                  
                  {isRemote && (
                    <p className="text-xs text-muted-foreground mt-1">
                      U remote pozice bude použita adresa vaší firmy {localities.headquarters[0]}
                    </p>
                  )}
                  
                  {!editAllFields && (
                    <div className="flex justify-end mt-4">
                      <Button 
                        variant="default"
                        size="sm" 
                        onClick={() => toggleFieldEdit('locality')}
                      >
                        Uložit
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="mt-1">
                  {isRemote ? (
                    <p className="text-base">Vzdálená práce ({localities.headquarters[0]})</p>
                  ) : (
                    form.watch("locality").length > 0 ? (
                      <p className="text-base">{form.watch("locality").join(", ")}</p>
                    ) : (
                      <p className="text-muted-foreground">Nespecifikováno</p>
                    )
                  )}
                </div>
              )}
            </div>

            {/* Obor */}
            <div className={`flex flex-c rounded-md relative group hover:bg-accent/5 transition-colors ${editingFields.field ? "p-4 border flex-col w-full" : ""}`}>
              <div className="flex justify-between items-center mr-2">
                <p className="font-medium text-sm w-[200px]">Obor</p>
                {!editingFields.field && !editAllFields && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="absolute right-0 top-0 hidden group-hover:block transition-opacity h-7"
                    onClick={() => toggleFieldEdit('field')}
                  >
                    Upravit
                  </Button>
                )}
              </div>
              
              {editingFields.field || editAllFields ? (
                <div className="mt-2 flex-1">
                  <div className="relative">
                    <Select 
                      onValueChange={(value) => {
                        form.setValue("field", value)
                        handleInputBlur("field", value)
                      }}
                      value={form.watch("field")}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Vyberte obor" />
                      </SelectTrigger>
                      <SelectContent>
                        {fields.map((field) => (
                          <SelectItem key={field} value={field}>
                            {field}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {loadingFields.field && (
                      <div className="absolute right-10 top-1/2 transform -translate-y-1/2 flex items-center gap-1.5">
                        <span className="text-xs text-muted-foreground">načítám...</span>
                        <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  
                  {showValidationErrors && form.formState.errors.field && (
                    <p className="text-sm text-destructive mt-1">{form.formState.errors.field.message}</p>
                  )}
                  
                  {!editAllFields && (
                    <div className="flex justify-end mt-4">
                      <Button 
                        variant="default"
                        size="sm" 
                        onClick={() => toggleFieldEdit('field')}
                      >
                        Uložit
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="mt-1">
                  <p className="text-base">{form.watch("field") || "Nespecifikováno"}</p>
                </div>
              )}
            </div>

            {/* Všechna další pole z původní verze */}
            {/* ... */}

            {/* Komponenty pro formulář uchazeče a automatickou odpověď */}
            <div className="space-y-12 pt-12">
              <ApplicationForm />
              <AutomaticResponse />
            </div>
          </div>
        )}

        <div className="flex justify-end mt-8">
          <Button 
            type="submit"
            onClick={() => {
              console.log("Kliknutí na tlačítko Pokračovat");
              setShowValidationErrors(true);
            }}
          >
            Pokračovat
          </Button>
        </div>
      </div>
    </form>
  )
} 