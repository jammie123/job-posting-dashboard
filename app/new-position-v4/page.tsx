"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Eye, Edit, RefreshCw, FilePlus, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { JobName } from "./components/JobName"
import { Description } from "./components/Description"
import { Locality } from "./components/Locality"
import { Salary } from "./components/Salary"
import { Profession } from "./components/Profession"
import { Field } from "./components/Field"
import { Type } from "./components/Type"
import { LanguageLevel } from "./components/LanguageLevel"
import { Education } from "./components/Education"
import { Benefits } from "./components/Benefits"
import { RecruiterCard } from "./components/RecruiterCard"
import { ActionFooter } from "./components/ActionFooter"
import AdvertiseStep from "@/app/new-position/components/advertise-step"
import { ApplicationForm } from "@/app/new-position/components/application-form"
import { AutomaticResponse } from "@/app/new-position/components/automatic-response"
import { SummaryOrder } from "@/components/summary-order"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SelectedLanguage } from "@/app/new-position/components/language-selector"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

// Definuji rozhraní pro data pozice
interface PositionData {
  title?: string;
  locality?: string[];
  isRemote?: boolean;
  field?: string;
  profession?: string[];
  description?: string;
  type?: 'full' | 'part';
  salary?: {
    from: number;
    to: number;
  };
  education?: string;
  benefits?: string[];
  languages?: SelectedLanguage[];
}

// Definuji rozhraní pro data otázek pro uchazeče
interface QuestionsData {
  questions?: any[];
  automaticResponse?: {
    template?: string;
    subject?: string;
    content?: string;
  }
}

// Definuji rozhraní pro data inzerce
interface AdvertisingData {
  platforms?: string[];
  settings?: any;
}

// Definuji rozhraní pro kompletní data pozice
interface JobPostingData {
  position: PositionData;
  questions: QuestionsData;
  advertising: AdvertisingData;
}

export default function NewPositionV4() {
  const [currentStep, setCurrentStep] = useState(1)

  // MAIN CHANGE: Set isViewMode to false by default for edit mode
  const [isViewMode, setIsViewMode] = useState(false)
  const [isDefaultView, setIsDefaultView] = useState(true)
  const [activeEditingComponent, setActiveEditingComponent] = useState<string | null>(null)
  const [formData, setFormData] = useState<JobPostingData>({
    position: {},
    questions: {},
    advertising: {}
  })
  const [showClearDialog, setShowClearDialog] = useState(false)
  const [cachedData, setCachedData] = useState<Record<string, any>>({})
  const router = useRouter()

  const handleJobNameSubmit = (name: string) => {
    setFormData(prev => ({
      ...prev,
      position: {
        ...prev.position,
        title: name
      }
    }))

    // Při ručním zadání ponecháme isViewMode false (edit mode)
    setIsViewMode(false)
    // Už nejsme v defaultním zobrazení
    setIsDefaultView(false)
  }

  const handlePrefilData = (name: string, aiData?: any) => {
    console.log("handlePrefilData byl zavolán s názvem:", name);
    console.log("handlePrefilData obdržel aiData:", aiData);
    
    // Pokud máme data z AI, použijeme je
    if (aiData) {
      // Ověříme strukturu dat a zajistíme správný formát
      const validatedData = {
        title: name,
        type: 'full' as 'full' | 'part', // Explicitní typové přetypování
        field: typeof aiData.field === 'string' ? aiData.field : undefined,
        profession: Array.isArray(aiData.professions) ? aiData.professions : undefined,
        salary: aiData.salary && typeof aiData.salary === 'object' && 
                'from' in aiData.salary && 'to' in aiData.salary ? 
                aiData.salary : undefined,
        description: typeof aiData.description === 'string' ? aiData.description : undefined,
        education: typeof aiData.education === 'string' ? aiData.education : undefined,
        benefits: Array.isArray(aiData.benefits) ? aiData.benefits : undefined,
      }

      console.log("Validovaná data pro formulář:", validatedData);

      // Použijeme nový objekt pro state update, abychom měli jistotu, že se vyvolá re-render
      const newFormData = {
        position: {
          ...formData.position,
          ...validatedData
        },
        questions: { ...formData.questions },  // Zachováme stávající otázky
        advertising: { ...formData.advertising }
      };
      
      console.log("Kompletní nová data pro formulář:", newFormData);
      setFormData(newFormData);
      
      console.log("Data předvyplněna z API:", validatedData);

      // Pro debugging - zkontrolujeme, že se data správně nastavila
      // setTimeout neukáže aktualizovaný stav, protože formData bude stále staré
      // React state aktualizuje až po re-renderu
      // Místo toho vypisujeme přímo hodnotu, která se má nastavit
      console.log("Data, která budou nastavena do stavu:", newFormData);
    } else {
      console.log("Nebyla poskytnuta žádná AI data, používám pouze název pozice");
      // Pokud nemáme AI data, použijeme pouze název a necháme zbytek prázdný
      setFormData(prev => ({
        ...prev,
        position: {
          ...prev.position,
          title: name
        }
      }))
      
      console.log("Data předvyplněna pouze s názvem pozice:", name);
    }


    // MAIN CHANGE: After prefilling data, keep isViewMode as false (edit mode)
    setIsViewMode(false)
    // Už nejsme v defaultním zobrazení
    setIsDefaultView(false)
  }

  const handleRegularForm = () => {
    // Místo přesměrování nastavíme režim úprav pro všechny komponenty
    setIsViewMode(false)
    setIsDefaultView(false)

    setActiveEditingComponent(null)
    // Zajistíme, že máme alespoň prázdný titulek, pokud není zadán
    if (!formData.position.title) {
      setFormData(prev => ({
        ...prev,
        position: {
          ...prev.position,
          title: "Nová pozice"
        }
      }))
    }
    toast.success("Formulář je připraven k úpravám")
  }

  const handlePositionDataChange = (data: Partial<PositionData>) => {
    setFormData(prev => ({
      ...prev,
      position: {
        ...prev.position,
        ...data
      }
    }))
  }

  const handleLocalityChange = (values: string[], isRemote: boolean) => {
    handlePositionDataChange({
      locality: values,
      isRemote
    })
  }

  const handleQuestionsDataChange = (data: Partial<QuestionsData>) => {
    setFormData(prev => ({
      ...prev,
      questions: {
        ...prev.questions,
        ...data
      }
    }))
  }

  const handleAdvertisingDataChange = (data: Partial<AdvertisingData>) => {
    setFormData(prev => ({
      ...prev,
      advertising: {
        ...prev.advertising,
        ...data
      }
    }))
  }
  
  const handleSubmit = () => {
    console.log("Submitting complete form data:", formData)
    toast.success("Pozice byla úspěšně vytvořena")
    setTimeout(() => {
      router.push('/')
    }, 2000)
  }

  // Přepínač pro změnu isViewMode
  const toggleViewMode = () => {
    setIsViewMode(prev => !prev)
    // Při změně režimu zobrazení resetujeme aktivní komponentu
    setActiveEditingComponent(null)
  }

  // Funkce pro nastavení aktivní editované komponenty
  const handleComponentEdit = (componentName: string | null) => {
    setActiveEditingComponent(componentName)
  }

  // Funkce pro vyčištění formuláře a návrat k zadání nové pozice
  const handleClearForm = () => {
    // Resetujeme data formuláře
    setFormData({
      position: {},
      questions: {},
      advertising: {}
    })
    // Zobrazíme vstupní pole pro název pozice

    // Vypneme režim zobrazení
    setIsViewMode(false)
    // Vrátíme se na první krok
    setCurrentStep(1)
    // Zavřeme dialog
    setShowClearDialog(false)
    // Nastavíme defaultní zobrazení
    setIsDefaultView(true)
    
    toast.success("Formulář byl vyčištěn. Můžete zadat novou pozici.")
  }

  // Calculate summary data based on formData
  const summaryData = (() => {
    const data = []
    let totalCredits = 0
    const selectedPlatforms = formData.advertising?.platforms || []
    const platformSettings = formData.advertising?.settings || {
      jobsSettings: {
        presentationDuration: "30 dní",
        autoUpdate: "každý 7.den",
        jobsTip: false,
        medallion: true,
      },
      careerSettings: {
        presentationDuration: "30 dní",
      },
    }

    if (selectedPlatforms.includes("Jobs.cz")) {
      const jobsCredits = 3
      const updateCredits = platformSettings.jobsSettings?.autoUpdate ? 9 : 0
      data.push({
        name: "Jobs.cz",
        presentationDuration: platformSettings.jobsSettings?.presentationDuration || "30 dní",
        autoUpdate: platformSettings.jobsSettings?.autoUpdate || "každý 7.den",
        price: `${jobsCredits} kreditů`,
      })
      totalCredits += jobsCredits + updateCredits
    }

    if (selectedPlatforms.includes("Prace.cz")) {
      data.push({
        name: "Prace.cz",
        presentationDuration: "30 dní",
        price: "1 kredit",
      })
      totalCredits += 1
    }

    if (selectedPlatforms.includes("Kariérní sekce")) {
      data.push({
        name: "Kariérní sekce",
        presentationDuration: platformSettings.careerSettings?.presentationDuration || "30 dní",
        price: "Objednáno",
      })
    }

    if (selectedPlatforms.includes("Intranet")) {
      data.push({
        name: "Intranet",
        presentationDuration: "30 dní",
        price: "Zdarma",
      })
    }

    return { data, totalCredits }
  })()

  const handleCacheData = (key: string, value: string) => {
    if (key === "name") {
      setFormData({
        position: {
          title: value,
          type: "full",
          field: cachedData["field"] || null,
          profession: cachedData["profession"] || null,
          salary: cachedData["salary"] || null,
          description: cachedData["description"] || null,
          education: cachedData["education"] || null,
          benefits: cachedData["benefits"] || null,
        },
        questions: {
          questions: [],
          automaticResponse: {
            template: "",
            subject: "",
            content: ""
          }
        },
        advertising: {}
      })

    } else {
      setCachedData((prevData) => ({
        ...prevData,
        [key]: value,
      }))
    }
  }

  // Funkce pro navigaci na další krok
  const handleContinue = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    } else {
      // Poslední krok - odeslání formuláře
      handleSubmit()
    }
  }

  // Funkce pro uložení jako koncept
  const handleSaveAsDraft = () => {
    // Implementace uložení jako koncept
    toast.success("Pozice byla uložena jako koncept")
  }

  return (
    <div className="container mt-8">
      <style jsx global>{`
        .description-content h3 {
          font-size: 1rem;
          font-weight: 600;
          margin-top: 1rem;
          margin-bottom: 0.5rem;
        }
        
        .description-content ul {
          list-style-type: disc;
          padding-left: 1.5rem;
          margin-top: 0.5rem;
          margin-bottom: 0.5rem;
        }
        
        .description-content ol {
          list-style-type: decimal;
          padding-left: 1.5rem;
          margin-top: 0.5rem;
          margin-bottom: 0.5rem;
        }
        
        .description-content li {
          margin-bottom: 0.25rem;
        }
        
        .description-content p {
          margin-bottom: 0.5rem;
        }
        
        .description-content strong {
          font-weight: 600;
        }
        
        .description-content em {
          font-style: italic;
        }
      `}</style>
      <div className="flex gap-6">
        {/* Left column - Vertical stepper */}
        <div className="w-[320px] shrink-0 mr-1">
          <Tabs value={String(currentStep)} onValueChange={(value) => setCurrentStep(Number(value))} orientation="vertical" className="fixed w-[320px]">
            <div className="my-4 mx-1">
              <Button variant="ghost" asChild className="gap-2">
                <Link href="/">
                  <ArrowLeft size={16} />
                  Zpět na výpis
                </Link>
              </Button>
            </div>
                      
              <div className="my-8 bg-muted rounded-md">
                <RecruiterCard 
                  fullname="Jan Novák" 
                  role="Náborář"
                  onChange={(members) => console.log("Tým byl aktualizován:", members)}
                />
                
              </div>
            
            <TabsList className="flex flex-col h-auto w-full bg-transparent gap-2">
              <TabsTrigger
                value="1"
                className="w-full justify-start data-[state=active]:bg-white data-[state=active]:shadow-sm border-none px-4 py-4"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-6 w-6 items-center justify-center rounded-full border-2 ${
                      currentStep === 1
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-muted-foreground"
                    }`}
                  >
                    1
                  </div>
                  <span className="text-sm font-medium">Informace o pozici</span>
                </div>
              </TabsTrigger>
              <TabsTrigger
                value="2"
                className="w-full justify-start data-[state=active]:bg-white data-[state=active]:shadow-sm border-none px-4 py-4"
 
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-6 w-6 items-center justify-center rounded-full border-2 ${
                      currentStep === 2
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-muted-foreground"
                    }`}
                  >
                    2
                  </div>
                  <span className="text-sm font-medium">Otázky na uchazeče</span>
                </div>
              </TabsTrigger>
              <TabsTrigger
                value="3"
                className="w-full justify-start data-[state=active]:bg-white data-[state=active]:shadow-sm border-none px-4 py-4"
            
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-6 w-6 items-center justify-center rounded-full border-2 ${
                      currentStep === 3
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-muted-foreground"
                    }`}
                  >
                    3
                  </div>
                  <span className="text-sm font-medium">Místa vystavení</span>
                </div>
              </TabsTrigger>
              <TabsTrigger
                value="4"
                className="w-full justify-start data-[state=active]:bg-white data-[state=active]:shadow-sm border-none px-4 py-4"
            
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-6 w-6 items-center justify-center rounded-full border-2 ${
                      currentStep === 4
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-muted-foreground"
                    }`}
                  >
                    4
                  </div>
                  <span className="text-sm font-medium">Kontrola a náhled</span>
                </div>
              </TabsTrigger>
            </TabsList>


          </Tabs>
        </div>

        {/* Right column - Form content */}
        <div className="flex-1 flex">
          <Card className={`shadow-lg mb-8 ${currentStep === 3 || currentStep === 4 ? "w-full" : "w-[850px]"}`}>


            {currentStep === 1 &&  (
              <CardContent className="p-6 gap-10">
                <div className="space-y-8 relative">
                  {/* Odstraním debugovací panel */}
                
                  <JobName
                    initialValue={formData.position.title}
                    onChange={(value) => handlePositionDataChange({ title: value })}
                    onPrefilData={handlePrefilData}
                    isViewMode={isViewMode}
                    isBlur={isViewMode && activeEditingComponent !== null && activeEditingComponent !== 'JobName'}
                    onEdit={() => handleComponentEdit('JobName')}
                    onSave={() => handleComponentEdit(null)}
                  />
                  
                  <Description
                    initialValue={formData.position.description || ""}
                    onChange={(value) => handlePositionDataChange({ description: value })}
                    isViewMode={isViewMode}
                    isBlur={isViewMode && activeEditingComponent !== null && activeEditingComponent !== 'Description'}
                    onEdit={() => handleComponentEdit('Description')}
                    onSave={() => handleComponentEdit(null)}
                  />
                  
                  <div className="flex flex-col gap-10">
                    <Locality
                      initialValue={formData.position.locality}
                      isRemoteInitial={formData.position.isRemote}
                      onChange={handleLocalityChange}
                      isViewMode={isViewMode}
                      isBlur={isViewMode && activeEditingComponent !== null && activeEditingComponent !== 'Locality'}
                      onEdit={() => handleComponentEdit('Locality')}
                      onSave={() => handleComponentEdit(null)}
                    />
                    
                    <Salary
                      initialValue={formData.position.salary || { from: 0, to: 0 }}
                      onChange={(value) => handlePositionDataChange({ salary: value })}
                      isViewMode={isViewMode}
                      isBlur={isViewMode && activeEditingComponent !== null && activeEditingComponent !== 'Salary'}
                      onEdit={() => handleComponentEdit('Salary')}
                      onSave={() => handleComponentEdit(null)}
                    />
                    
                    <Field
                      initialValue={formData.position.field || ""}
                      onChange={(value) => handlePositionDataChange({ field: value })}
                      isViewMode={isViewMode}
                      isBlur={isViewMode && activeEditingComponent !== null && activeEditingComponent !== 'Field'}
                      onEdit={() => handleComponentEdit('Field')}
                      onSave={() => handleComponentEdit(null)}
                    />
                    
                    <Profession
                      initialValue={formData.position.profession || []}
                      onChange={(value) => handlePositionDataChange({ profession: value })}
                      isViewMode={isViewMode}
                      isBlur={isViewMode && activeEditingComponent !== null && activeEditingComponent !== 'Profession'}
                      onEdit={() => handleComponentEdit('Profession')}
                      onSave={() => handleComponentEdit(null)}
                    />
                    
                    <Type
                      initialValue={formData.position.type || 'full'}
                      onChange={(value) => handlePositionDataChange({ type: value })}
                      isViewMode={isViewMode}
                      isBlur={isViewMode && activeEditingComponent !== null && activeEditingComponent !== 'Type'}
                      onEdit={() => handleComponentEdit('Type')}
                      onSave={() => handleComponentEdit(null)}
                    />
                    
                    <Education
                      initialValue={formData.position.education || ""}
                      onChange={(value) => handlePositionDataChange({ education: value })}
                      isViewMode={isViewMode}
                      isBlur={isViewMode && activeEditingComponent !== null && activeEditingComponent !== 'Education'}
                      onEdit={() => handleComponentEdit('Education')}
                      onSave={() => handleComponentEdit(null)}
                    />
                  
                    <LanguageLevel
                      initialValue={formData.position.languages || []}
                      onChange={(value) => handlePositionDataChange({ languages: value })}
                      isViewMode={isViewMode}
                      isBlur={isViewMode && activeEditingComponent !== null && activeEditingComponent !== 'LanguageLevel'}
                      onEdit={() => handleComponentEdit('LanguageLevel')}
                      onSave={() => handleComponentEdit(null)}
                    />
                    
                    <Benefits
                      initialValue={formData.position.benefits || []}
                      onChange={(value) => handlePositionDataChange({ benefits: value })}
                      isViewMode={isViewMode}
                      isBlur={isViewMode && activeEditingComponent !== null && activeEditingComponent !== 'Benefits'}
                      onEdit={() => handleComponentEdit('Benefits')}
                      onSave={() => handleComponentEdit(null)}
                    />
                  </div>
                </div>
              </CardContent>
            )}

            {currentStep === 2 && (
              <CardContent className="p-6">
                <div className="space-y-6">
                  <CardTitle className="text-xl mb-6">Otázky pro uchazeče</CardTitle>
                  
                  <ApplicationForm 
                    initialData={formData.questions}
                    onDataChange={(data) => handleQuestionsDataChange({ questions: data?.questions })}
                  />
                  
                  <AutomaticResponse 
                    initialData={formData.questions.automaticResponse}
                    onChange={(data) => handleQuestionsDataChange({ automaticResponse: data })}
                  />
                </div>
              </CardContent>
            )}

            {currentStep === 3 && (
              <AdvertiseStep
                initialData={formData.advertising}
                onDataChange={handleAdvertisingDataChange}
              />
            )}

            {currentStep === 4 && (
              <CardContent className="p-6">
                <div className="space-y-13">
                  <CardTitle className="text-xl mb-6">Kontrola a náhled</CardTitle>
                  
                  {/* Position Information Section */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold border-b pb-2">Informace o pozici</h3>
                    
                    <JobName
                      initialValue={formData.position.title}
                      onChange={(value) => handlePositionDataChange({ title: value })}
                      onPrefilData={handlePrefilData}
                      isViewMode={true}
                      isBlur={false}
                      onEdit={() => {}}
                      onSave={() => {}}
                    />
                    
                    <Description
                      initialValue={formData.position.description || ""}
                      onChange={(value) => handlePositionDataChange({ description: value })}
                      isViewMode={true}
                      isBlur={false}
                      onEdit={() => {}}
                      onSave={() => {}}
                    />
                    
                    <Locality
                      initialValue={formData.position.locality}
                      isRemoteInitial={formData.position.isRemote}
                      onChange={handleLocalityChange}
                      isViewMode={true}
                      isBlur={false}
                      onEdit={() => {}}
                      onSave={() => {}}
                    />
                    
                    <Salary
                      initialValue={formData.position.salary || { from: 0, to: 0 }}
                      onChange={(value) => handlePositionDataChange({ salary: value })}
                      isViewMode={true}
                      isBlur={false}
                      onEdit={() => {}}
                      onSave={() => {}}
                    />
                    
                    <Field
                      initialValue={formData.position.field || ""}
                      onChange={(value) => handlePositionDataChange({ field: value })}
                      isViewMode={true}
                      isBlur={false}
                      onEdit={() => {}}
                      onSave={() => {}}
                    />
                    
                    <Profession
                      initialValue={formData.position.profession || []}
                      onChange={(value) => handlePositionDataChange({ profession: value })}
                      isViewMode={true}
                      isBlur={false}
                      onEdit={() => {}}
                      onSave={() => {}}
                    />
                    
                    <Type
                      initialValue={formData.position.type || 'full'}
                      onChange={(value) => handlePositionDataChange({ type: value })}
                      isViewMode={true}
                      isBlur={false}
                      onEdit={() => {}}
                      onSave={() => {}}
                    />
                    
                    <Education
                      initialValue={formData.position.education || ""}
                      onChange={(value) => handlePositionDataChange({ education: value })}
                      isViewMode={true}
                      isBlur={false}
                      onEdit={() => {}}
                      onSave={() => {}}
                    />
                  
                    <LanguageLevel
                      initialValue={formData.position.languages || []}
                      onChange={(value) => handlePositionDataChange({ languages: value })}
                      isViewMode={true}
                      isBlur={false}
                      onEdit={() => {}}
                      onSave={() => {}}
                    />
                    
                    <Benefits
                      initialValue={formData.position.benefits || []}
                      onChange={(value) => handlePositionDataChange({ benefits: value })}
                      isViewMode={true}
                      isBlur={false}
                      onEdit={() => {}}
                      onSave={() => {}}
                    />
                  </div>
                  
                  {/* Questions Section */}
                  {formData.questions.questions && formData.questions.questions.length > 0 && (
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold border-b pb-2">Otázky pro uchazeče</h3>
                      <div className="space-y-4">
                        {formData.questions.questions.map((question: any, index: number) => (
                          <div key={index} className="p-4 border rounded-lg">
                            <p className="font-medium">{question.text}</p>
                            {question.type && <p className="text-sm text-gray-600">Typ: {question.type}</p>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Automatic Response Section */}
                  {formData.questions.automaticResponse && (
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold border-b pb-2">Automatická odpověď</h3>
                      <div className="p-4 border rounded-lg">
                        <p><strong>Šablona:</strong> {formData.questions.automaticResponse.template || 'Není nastavena'}</p>
                        {formData.questions.automaticResponse.subject && (
                          <p><strong>Předmět:</strong> {formData.questions.automaticResponse.subject}</p>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Advertising Section */}
                  {formData.advertising.platforms && formData.advertising.platforms.length > 0 && (
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold border-b pb-2">Místa vystavení</h3>
                      <div className="space-y-4">
                        {formData.advertising.platforms.map((platform: string, index: number) => (
                          <div key={index} className="p-4 border rounded-lg">
                            <p className="font-medium">{platform}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            )}
          </Card>

          {/* Summary Order component - only shown for advertising step */}
          {currentStep === 3 && (
            <div className="sticky top-6 self-start w-[300px] ml-6">
              <SummaryOrder
                selectedPlatforms={summaryData.data}
                totalCredits={summaryData.totalCredits}
                onSubmit={handleSubmit}
              />
            </div>
          )}
        </div>
      </div>
      
      {/* Přidání ActionFooter komponenty, pokud není v režimu zadávání názvu pozice */}
  
        <ActionFooter
          onContinue={handleContinue}
          onSaveAsDraft={handleSaveAsDraft}
          positionTitle={formData.position.title || "Nová pozice"}
          jobStatus="draft"
          isLastStep={currentStep === 4}
        />
      
    </div>
  )
} 