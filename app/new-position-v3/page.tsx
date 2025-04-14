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
import AdvertiseStep from "@/app/new-position/components/advertise-step"
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

// Definuji rozhraní pro data inzerce
interface AdvertisingData {
  platforms?: string[];
  settings?: any;
}

// Definuji rozhraní pro kompletní data pozice
interface JobPostingData {
  position: PositionData;
  advertising: AdvertisingData;
}

export default function NewPositionV3() {
  const [currentStep, setCurrentStep] = useState(1)
  const [showNameInput, setShowNameInput] = useState(true)
  const [isViewMode, setIsViewMode] = useState(false)
  const [isDefaultView, setIsDefaultView] = useState(true)
  const [activeEditingComponent, setActiveEditingComponent] = useState<string | null>(null)
  const [formData, setFormData] = useState<JobPostingData>({
    position: {},
    advertising: {}
  })
  const [showClearDialog, setShowClearDialog] = useState(false)
  const router = useRouter()

  const handleJobNameSubmit = (name: string) => {
    setFormData(prev => ({
      ...prev,
      position: {
        ...prev.position,
        title: name
      }
    }))
    setShowNameInput(false)
    // Při ručním zadání ponecháme isViewMode false
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

    setShowNameInput(false)
    // Po předvyplnění dat nastavíme isViewMode na true
    setIsViewMode(true)
    // Už nejsme v defaultním zobrazení
    setIsDefaultView(false)
  }

  const handleRegularForm = () => {
    // Přesměrování na běžný formulář
    router.push('/new-position')
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
      advertising: {}
    })
    // Zobrazíme vstupní pole pro název pozice
    setShowNameInput(true)
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
        <div className="w-[270px] shrink-0 mr-1">
          <Tabs value={String(currentStep)} onValueChange={(value) => setCurrentStep(Number(value))} orientation="vertical" className="fixed">
            <div className="my-4 mx-1">
              <Button variant="ghost" asChild className="gap-2">
                <Link href="/">
                  <ArrowLeft size={16} />
                  Zpět na výpis
                </Link>
              </Button>
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
                disabled={showNameInput}
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
                  <span className="text-sm font-medium">Inzerce a místa vystavení</span>
                </div>
              </TabsTrigger>
            </TabsList>

            {/* Debug přepínač pro isViewMode */}
            {!showNameInput && (
              <div className="mt-8 p-4 bg-muted rounded-md">
                <div className="flex items-center justify-between space-x-2 mb-4">
                  <div className="flex flex-col gap-1">
                    <Label htmlFor="view-mode-toggle" className="text-sm">Režim zobrazení</Label>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Edit size={14} />
                      <span>Úpravy</span>
                      <span>/</span>
                      <Eye size={14} />
                      <span>Náhled</span>
                    </div>
                  </div>
                  <Switch
                    id="view-mode-toggle"
                    checked={isViewMode}
                    onCheckedChange={toggleViewMode}
                  />
                </div>
                
                {/* Nový přepínač pro vyčištění formuláře */}
                <div className="flex items-center justify-between space-x-2 mt-6 pt-4 border-t border-muted-foreground/20">
                  <div className="flex flex-col gap-1">
                    <Label htmlFor="clear-form-toggle" className="text-sm">Nová pozice</Label>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <FilePlus size={14} />
                      <span>Vyčistit a začít znovu</span>
                    </div>
                  </div>
                  
                  <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="gap-1"
                      >
                        <RefreshCw size={14} className="mr-1" />
                        Nová
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2">
                          <AlertTriangle className="h-5 w-5 text-amber-500" />
                          Vyčistit formulář?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Chystáte se vyčistit všechna data ve formuláři a začít znovu. Tato akce je nevratná.
                          Všechna rozpracovaná data budou ztracena.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Zrušit</AlertDialogCancel>
                        <AlertDialogAction onClick={handleClearForm} className="bg-red-500 hover:bg-red-600">
                          Vyčistit
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            )}
          </Tabs>
        </div>

        {/* Right column - Form content */}
        <div className="flex-1 flex">
          <Card className={`shadow-lg mb-8 ${currentStep === 2 ? "w-full" : "w-[850px]"}`}>
            {currentStep === 1 && showNameInput && (
              <CardContent className="p-6">
                <JobName 
                  initialValue={formData.position.title}
                  onSubmit={handleJobNameSubmit}
                  onPrefilData={handlePrefilData}
                  onRegularForm={handleRegularForm}
                  isDefaultView={isDefaultView}
                  userName="uživateli"
                />
              </CardContent>
            )}

            {currentStep === 1 && !showNameInput && (
              <CardContent className="p-6">
                <div className="space-y-8">
                  {/* Odstraním debugovací panel */}
                
                  <JobName
                    initialValue={formData.position.title}
                    onChange={(value) => handlePositionDataChange({ title: value })}
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
                  
                  <div className="flex flex-col gap-1">
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
                    
                    <div className="flex justify-end mt-6">
                      <Button onClick={() => setCurrentStep(2)}>
                        Pokračovat k inzerci
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            )}

            {currentStep === 2 && (
              <AdvertiseStep
                initialData={formData.advertising}
                onDataChange={handleAdvertisingDataChange}
              />
            )}
          </Card>

          {/* Summary Order component - only shown for advertising step */}
          {currentStep === 2 && (
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
    </div>
  )
} 