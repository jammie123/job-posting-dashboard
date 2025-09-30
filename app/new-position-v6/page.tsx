"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
import AdvertiseStep from "./components/advertise-step"
import { ApplicationForm } from "./components/application-form"
import { AutomaticResponse } from "./components/automatic-response"
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

// Interfaces for form data
interface RecruitmentData {
  internalName: string
  template: string
  recruiter: any
  lineManager: any
  language: string
}

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

interface QuestionsData {
  questions?: any[];
  automaticResponse?: {
    template?: string;
    subject?: string;
    content?: string;
  }
}

interface AdvertisingData {
  platforms?: string[];
  settings?: any;
}

interface SettingsData {
  duration: string;
  autoUpdate: string;
}

interface JobPostingData {
  recruitment: RecruitmentData;
  position: PositionData;
  questions: QuestionsData;
  advertising: AdvertisingData;
  settings: SettingsData;
}

export default function NewPositionV6() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isViewMode, setIsViewMode] = useState(false)
  const [isDefaultView, setIsDefaultView] = useState(true)
  const [activeEditingComponent, setActiveEditingComponent] = useState<string | null>(null)
  const [formData, setFormData] = useState<JobPostingData>({
    recruitment: {
      internalName: '',
      template: '',
      recruiter: {},
      lineManager: {},
      language: ''
    },
    position: {},
    questions: {},
    advertising: {},
    settings: {
      duration: '30',
      autoUpdate: '7'
    }
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
    setIsViewMode(false)
    setIsDefaultView(false)
  }

  const handlePrefilData = (name: string, aiData?: any) => {
    console.log("handlePrefilData byl zavolán s názvem:", name);
    console.log("handlePrefilData obdržel aiData:", aiData);
    
    if (aiData) {
      const validatedData = {
        title: name,
        type: 'full' as 'full' | 'part',
        field: typeof aiData.field === 'string' ? aiData.field : undefined,
        profession: Array.isArray(aiData.professions) ? aiData.professions : undefined,
        salary: aiData.salary && typeof aiData.salary === 'object' && 
                'from' in aiData.salary && 'to' in aiData.salary ? 
                aiData.salary : undefined,
        description: typeof aiData.description === 'string' ? aiData.description : undefined,
        education: typeof aiData.education === 'string' ? aiData.education : undefined,
        benefits: Array.isArray(aiData.benefits) ? aiData.benefits : undefined,
      }

      const newFormData = {
        ...formData,
        position: {
          ...formData.position,
          ...validatedData
        }
      };
      
      setFormData(newFormData);
    } else {
      setFormData(prev => ({
        ...prev,
        position: {
          ...prev.position,
          title: name
        }
      }))
    }

    setIsViewMode(false)
    setIsDefaultView(false)
  }

  const handleRegularForm = () => {
    setIsViewMode(false)
    setIsDefaultView(false)
    setActiveEditingComponent(null)
    
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

  const handleRecruitmentDataChange = (data: Partial<RecruitmentData>) => {
    setFormData(prev => ({
      ...prev,
      recruitment: {
        ...prev.recruitment,
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

  const handleSettingsDataChange = (data: Partial<SettingsData>) => {
    setFormData(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
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

  const toggleViewMode = () => {
    setIsViewMode(prev => !prev)
    setActiveEditingComponent(null)
  }

  const handleComponentEdit = (componentName: string | null) => {
    setActiveEditingComponent(componentName)
  }

  const handleClearForm = () => {
    setFormData({
      recruitment: {
        internalName: '',
        template: '',
        recruiter: {},
        lineManager: {},
        language: ''
      },
      position: {},
      questions: {},
      advertising: {},
      settings: {
        duration: '30',
        autoUpdate: '7'
      }
    })
    setIsViewMode(false)
    setCurrentStep(1)
    setShowClearDialog(false)
    setIsDefaultView(true)
    toast.success("Formulář byl vyčištěn. Můžete zadat novou pozici.")
  }

  const handleContinue = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1)
    } else {
      handleSubmit()
    }
  }

  const handleSaveAsDraft = () => {
    toast.success("Pozice byla uložena jako koncept")
  }

  // Sample data for selects
  const templates = [
    { value: 'standard', label: 'Standardní nábor' },
    { value: 'urgent', label: 'Urgentní nábor' },
    { value: 'senior', label: 'Senior pozice' },
    { value: 'junior', label: 'Junior pozice' }
  ]

  const languages = [
    { value: 'cs', label: 'Čeština' },
    { value: 'en', label: 'Angličtina' },
    { value: 'sk', label: 'Slovenština' }
  ]

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
        <div className="w-[320px] shrink-0">
          <div className="my-4">
            <Button variant="ghost" asChild className="gap-2">
              <Link href="/">
                <ArrowLeft size={16} />
                Zpět na výpis
              </Link>
            </Button>
          </div>
          
          <Tabs value={String(currentStep)} onValueChange={(value) => setCurrentStep(Number(value))} orientation="vertical" className="w-full">
            <TabsList className="flex flex-col h-auto w-full bg-transparent gap-2">
              <TabsTrigger
                value="1"
                className="w-full justify-start data-[state=active]:bg-white data-[state=active]:shadow-sm border-none px-4 py-4"
              >
                <div className="flex items-center gap-3">
                  <div className={`flex h-6 w-6 items-center justify-center rounded-full border-2 ${
                    currentStep === 1 ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground"
                  }`}>
                    1
                  </div>
                  <span className="text-sm font-medium">Údaje o náboru</span>
                </div>
              </TabsTrigger>
              
              <TabsTrigger
                value="2"
                className="w-full justify-start data-[state=active]:bg-white data-[state=active]:shadow-sm border-none px-4 py-4"
              >
                <div className="flex items-center gap-3">
                  <div className={`flex h-6 w-6 items-center justify-center rounded-full border-2 ${
                    currentStep === 2 ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground"
                  }`}>
                    2
                  </div>
                  <span className="text-sm font-medium">Místa vystavení</span>
                </div>
              </TabsTrigger>
              
              <TabsTrigger
                value="3"
                className="w-full justify-start data-[state=active]:bg-white data-[state=active]:shadow-sm border-none px-4 py-4"
              >
                <div className="flex items-center gap-3">
                  <div className={`flex h-6 w-6 items-center justify-center rounded-full border-2 ${
                    currentStep === 3 ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground"
                  }`}>
                    3
                  </div>
                  <span className="text-sm font-medium">Údaje k inzerci</span>
                </div>
              </TabsTrigger>
              
              <TabsTrigger
                value="4"
                className="w-full justify-start data-[state=active]:bg-white data-[state=active]:shadow-sm border-none px-4 py-4"
              >
                <div className="flex items-center gap-3">
                  <div className={`flex h-6 w-6 items-center justify-center rounded-full border-2 ${
                    currentStep === 4 ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground"
                  }`}>
                    4
                  </div>
                  <span className="text-sm font-medium">Nastavení inzerce</span>
                </div>
              </TabsTrigger>
              
              <TabsTrigger
                value="5"
                className="w-full justify-start data-[state=active]:bg-white data-[state=active]:shadow-sm border-none px-4 py-4"
              >
                <div className="flex items-center gap-3">
                  <div className={`flex h-6 w-6 items-center justify-center rounded-full border-2 ${
                    currentStep === 5 ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground"
                  }`}>
                    5
                  </div>
                  <span className="text-sm font-medium">Kontrola a náhled</span>
                </div>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Right column - Form content */}
        <div className="flex-1 flex">
          <Card className={`shadow-lg mb-8 ${currentStep === 2 || currentStep === 5 ? "w-full" : "w-[850px]"}`}>
            {currentStep === 1 && (
              <CardContent className="p-6">
                <CardTitle className="text-xl mb-6">Údaje o náboru</CardTitle>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="internalName">Interní název pozice</Label>
                    <Input
                      id="internalName"
                      placeholder="Např. Senior React Developer Q1 2024"
                      value={formData.recruitment.internalName}
                      onChange={(e) => handleRecruitmentDataChange({ internalName: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="template">Šablona náborového procesu</Label>
                    <Select value={formData.recruitment.template} onValueChange={(value) => handleRecruitmentDataChange({ template: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Vyberte šablonu" />
                      </SelectTrigger>
                      <SelectContent>
                        {templates.map(template => (
                          <SelectItem key={template.value} value={template.value}>
                            {template.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="language">Jazyk</Label>
                    <Select value={formData.recruitment.language} onValueChange={(value) => handleRecruitmentDataChange({ language: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Vyberte jazyk" />
                      </SelectTrigger>
                      <SelectContent>
                        {languages.map(language => (
                          <SelectItem key={language.value} value={language.value}>
                            {language.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            )}

            {currentStep === 2 && (
              <div>

                    <div className="space-y-2 p-6 pb-2">
                    <h2 className="text-xl font-semibold">Místa vystavení</h2>
                    <p className="text-muted-foreground">
                      Vyberte kam budete inzerovat. Díky tomu dokážeme lépe připravit formulář
                    </p>
                  </div>
              <AdvertiseStep
                initialData={formData.advertising}
                onDataChange={handleAdvertisingDataChange}
                step={currentStep}
              />
                </div>
            )}

            {currentStep === 3 && (
              <CardContent className="p-6">
                <CardTitle className="text-xl mb-6">Údaje k inzerci</CardTitle>
                
                <div className="space-y-6">
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
                  
                  <Locality
                    initialValue={formData.position.locality}
                    isRemoteInitial={formData.position.isRemote}
                    onChange={handleLocalityChange}
                    isViewMode={isViewMode}
                    isBlur={isViewMode && activeEditingComponent !== null && activeEditingComponent !== 'Locality'}
                    onEdit={() => handleComponentEdit('Locality')}
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
                  
                  <Education
                    initialValue={formData.position.education || ""}
                    onChange={(value) => handlePositionDataChange({ education: value })}
                    isViewMode={isViewMode}
                    isBlur={isViewMode && activeEditingComponent !== null && activeEditingComponent !== 'Education'}
                    onEdit={() => handleComponentEdit('Education')}
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
              </CardContent>
            )}

            {currentStep === 4 && (
              <CardContent className="p-6">
                <CardTitle className="text-xl mb-6">Nastavení inzerce</CardTitle>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="duration">Doba inzerce</Label>
                    <Select value={formData.settings.duration} onValueChange={(value) => handleSettingsDataChange({ duration: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7">7 dní</SelectItem>
                        <SelectItem value="14">14 dní</SelectItem>
                        <SelectItem value="30">30 dní</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="autoUpdate">Automatická aktualizace</Label>
                    <Select value={formData.settings.autoUpdate} onValueChange={(value) => handleSettingsDataChange({ autoUpdate: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7">7 dní</SelectItem>
                        <SelectItem value="14">14 dní</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            )}

            {currentStep === 5 && (
              <CardContent className="p-6">
                <CardTitle className="text-xl mb-6">Kontrola a náhled inzerátu</CardTitle>
                
                <div className="space-y-8">
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
                    
                    <LanguageLevel
                      initialValue={formData.position.languages || []}
                      onChange={(value) => handlePositionDataChange({ languages: value })}
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
                    
                    <Benefits
                      initialValue={formData.position.benefits || []}
                      onChange={(value) => handlePositionDataChange({ benefits: value })}
                      isViewMode={true}
                      isBlur={false}
                      onEdit={() => {}}
                      onSave={() => {}}
                    />
                  </div>
                  
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

          {/* Right side panel for Step 1 - Recruiter and Line Manager */}
          {currentStep === 1 && (
            <div className="w-[300px] ml-6 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Náborář</CardTitle>
                </CardHeader>
                <CardContent>
                  <RecruiterCard 
                    fullname="Jan Novák" 
                    role="Náborář"
                    onChange={(members) => handleRecruitmentDataChange({ recruiter: members })}
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Liniový manažer</CardTitle>
                </CardHeader>
                <CardContent>
                  <RecruiterCard 
                    fullname="Petr Svoboda" 
                    role="Liniový manažer"
                    onChange={(members) => handleRecruitmentDataChange({ lineManager: members })}
                  />
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
      
      <ActionFooter
        onContinue={handleContinue}
        onSaveAsDraft={handleSaveAsDraft}
        positionTitle={formData.position.title || "Nová pozice"}
        jobStatus="draft"
        isLastStep={currentStep === 5}
      />
    </div>
  )
}
