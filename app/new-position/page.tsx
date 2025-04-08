"use client"

import { useState, useMemo, useEffect, useRef, useCallback } from "react"
import { Card } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FirstStep } from "./first-step"
import { ApplicationForm } from "./components/application-form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CollaborationStep } from "./components/collaboration-step"
import AdvertiseStep from "./components/advertise-step"
import { SummaryOrder } from "@/components/summary-order"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

// Definuji rozhraní pro data z jednotlivých kroků
interface PositionData {
  title?: string;
  locality?: string[];
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
  languages?: Array<{
    code: string;
    name: string;
    level: string;
  }>;
}

interface QuestionnaireData {
  questions?: Array<{
    id: string;
    question: string;
    type: string;
    required: boolean;
    options?: string[];
  }>;
}

interface CollaborationData {
  collaborators?: string[];
  notes?: string;
}

interface AdvertisingData {
  platforms?: string[];
  settings?: any;
}

// Definuji rozhraní pro kompletní data pozice
interface JobPostingData {
  position: PositionData;
  questionnaire: QuestionnaireData;
  collaboration: CollaborationData;
  advertising: AdvertisingData;
}

const steps = [
  {
    value: "position",
    label: "Údaje o pozici",
    component: FirstStep,
  },

  // {
  //   value: "collaboration",
  //   label: "Kolaborace s kolegy",
  //   component: CollaborationStep,
  // },
  {
    value: "advertising",
    label: "Inzerce a místa vystavení",
    component: AdvertiseStep,
  },
]

// Komponenta pro podmíněné renderování pouze na klientovi
const ClientOnly = ({ children }: { children: React.ReactNode }) => {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  if (!isMounted) {
    return null; // nebo nějaký fallback/skeleton
  }
  
  return <>{children}</>;
};

// Funkce pro bezpečné získání dat z localStorage
const getSavedData = (): JobPostingData | null => {
  if (typeof window === 'undefined') {
    return null;
  }
  
  try {
    const savedData = localStorage.getItem('jobPostingData');
    if (savedData) {
      return JSON.parse(savedData);
    }
  } catch (error) {
    console.error("Chyba při načítání dat z localStorage:", error);
    localStorage.removeItem('jobPostingData');
  }
  
  return null;
};

// Funkce pro bezpečné uložení dat do localStorage
const saveDataToLocalStorage = (data: JobPostingData) => {
  if (typeof window === 'undefined') {
    return;
  }
  
  try {
    localStorage.setItem('jobPostingData', JSON.stringify(data));
  } catch (error) {
    console.error("Chyba při ukládání dat do localStorage:", error);
  }
};

// Pomocný hook pro načtení dat z localStorage - mimo hlavní komponentu
function useLoadSavedData(setFormData: React.Dispatch<React.SetStateAction<JobPostingData>>) {
  // Použijeme useRef pro sledování, zda už data byla načtena
  const dataLoaded = useRef(false);
  
  useEffect(() => {
    // Pokud už data byla načtena, neprovádíme další načítání
    if (dataLoaded.current) return;
    
    const savedData = getSavedData();
    if (savedData) {
      console.log("Načtena uložená data z localStorage:", savedData);
      setFormData(savedData);
      // Označíme, že data již byla načtena
      dataLoaded.current = true;
    }
  }, [setFormData]);
}

export default function NewPosition() {
  const [currentStep, setCurrentStep] = useState("position")
  const [showSidebar, setShowSidebar] = useState(true)
  const router = useRouter()
  
  // Inicializujeme formData s prázdnými objekty - konzistentní počáteční stav pro server i klient
  const [formData, setFormData] = useState<JobPostingData>({
    position: {},
    questionnaire: {},
    collaboration: {},
    advertising: {}
  });

  // Použijeme náš nový hook pro načtení dat
  useLoadSavedData(setFormData);
  
  // Funkce pro aktualizaci dat z jednotlivých kroků
  const updatePositionData = useCallback((data: PositionData) => {
    setFormData(prev => {
      // Nejprve kontrolujeme, zda se data skutečně změnila, abychom zabránili zbytečným aktualizacím
      const currentPosition = JSON.stringify(prev.position);
      const newPosition = JSON.stringify({...prev.position, ...data});
      
      if (currentPosition === newPosition) {
        console.log("Position data se nezměnila, přeskakuji aktualizaci");
        return prev;
      }
      
      const updatedData = {
        ...prev,
        position: {
          ...prev.position,
          ...data
        }
      };
      
      // Uložíme aktualizovaná data pomocí samostatné funkce
      saveDataToLocalStorage(updatedData);
      
      return updatedData;
    });
  }, []);

  // Aktualizace funkce updateQuestionnaireData
  const updateQuestionnaireData = useCallback((data: QuestionnaireData) => {
    setFormData(prev => {
      const updatedQuestionnaire = {
        ...prev.questionnaire,
        ...data
      };
      
      const updatedData = {
        ...prev,
        questionnaire: updatedQuestionnaire
      };
      
      // Uložíme aktualizovaná data pomocí samostatné funkce
      saveDataToLocalStorage(updatedData);
      
      return updatedData;
    });
  }, []);

  // Aktualizace funkce updateCollaborationData
  const updateCollaborationData = useCallback((data: CollaborationData) => {
    setFormData(prev => {
      const updatedData = {
        ...prev,
        collaboration: {
          ...prev.collaboration,
          ...data
        }
      };
      
      // Uložíme aktualizovaná data pomocí samostatné funkce
      saveDataToLocalStorage(updatedData);
      
      return updatedData;
    });
  }, []);

  // Aktualizace funkce updateAdvertisingData s kontrolou změn
  const updateAdvertisingData = useCallback((data: AdvertisingData) => {
    setFormData(prev => {
      // Porovnáme aktuální a nová data
      const currentAdvertising = JSON.stringify(prev.advertising);
      const newAdvertising = JSON.stringify({
        ...prev.advertising,
        ...data
      });
      
      // Pokud jsou data stejná, vrátíme původní stav
      if (currentAdvertising === newAdvertising) {
        console.log("Advertising data se nezměnila, nezpracovávám aktualizaci");
        return prev;
      }
      
      console.log("Aktualizuji advertising data:", data);
      
      // Jinak aktualizujeme
      const updatedData = {
        ...prev,
        advertising: {
          ...prev.advertising,
          ...data
        }
      };
      
      // Uložíme aktualizovaná data pomocí samostatné funkce
      saveDataToLocalStorage(updatedData);
      
      return updatedData;
    });
  }, []);
  
  // Funkce pro vymazání dat (resetování formuláře)
  const resetFormData = useCallback(() => {
    setFormData({
      position: {},
      questionnaire: {},
      collaboration: {},
      advertising: {}
    });
    
    // Bezpečně odstraníme data z localStorage pomocí samostatné funkce
    if (typeof window !== 'undefined') {
      localStorage.removeItem('jobPostingData');
    }
  }, []);
  
  // Modifikace handleSubmit funkce
  const handleSubmit = useCallback(() => {
    console.log("Submitting complete form data:", formData);
    
    // Po úspěšném odeslání vyčistíme localStorage - pouze na klientovi
    if (typeof window !== 'undefined') {
      localStorage.removeItem('jobPostingData');
    }
    
    // Přesměrování na úvodní stránku
    toast.success("Pozice byla úspěšně vytvořena");
    setTimeout(() => {
      router.push('/');
    }, 2000);
  }, [formData, router]);

  // Calculate summary data based on formData
  const summaryData = useMemo(() => {
    const data = [];
    let totalCredits = 0;
    const selectedPlatforms = formData.advertising?.platforms || [];
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
    };

    if (selectedPlatforms.includes("Jobs.cz")) {
      const jobsCredits = 3;
      const updateCredits = platformSettings.jobsSettings?.autoUpdate ? 9 : 0;
      data.push({
        name: "Jobs.cz",
        presentationDuration: platformSettings.jobsSettings?.presentationDuration || "30 dní",
        autoUpdate: platformSettings.jobsSettings?.autoUpdate || "každý 7.den",
        price: `${jobsCredits} kreditů`,
      });
      totalCredits += jobsCredits + updateCredits;
    }

    if (selectedPlatforms.includes("Prace.cz")) {
      data.push({
        name: "Prace.cz",
        presentationDuration: "30 dní",
        price: "1 kredit",
      });
      totalCredits += 1;
    }

    if (selectedPlatforms.includes("Kariérní sekce")) {
      data.push({
        name: "Kariérní sekce",
        presentationDuration: platformSettings.careerSettings?.presentationDuration || "30 dní",
        price: "Objednáno",
      });
    }

    if (selectedPlatforms.includes("Intranet")) {
      data.push({
        name: "Intranet",
        presentationDuration: "30 dní",
        price: "Zdarma",
      });
    }

    if (selectedPlatforms.includes("Profesia.sk")) {
      data.push({
        name: "Profesia.sk",
        presentationDuration: "30 dní",
        price: "21 kreditů",
      });
      totalCredits += 21;
    }

    if (selectedPlatforms.includes("Bestjobs.eu")) {
      data.push({
        name: "Bestjobs.eu",
        presentationDuration: "30 dní",
        price: "21 kreditů",
      });
      totalCredits += 21;
    }

    if (selectedPlatforms.includes("Robota.ua")) {
      data.push({
        name: "Robota.ua",
        presentationDuration: "30 dní",
        price: "21 kreditů",
      });
      totalCredits += 21;
    }

    return { data, totalCredits };
  }, [formData.advertising]);

  // Přidáme funkci pro zobrazení sidebaru
  const handleShowSidebar = () => {
    setShowSidebar(true);
  };

  // Render the appropriate component based on the current step
  const renderCurrentComponent = () => {
    // Funkce pro přechod na další krok
    const goToNextStep = () => {
      const currentIndex = steps.findIndex(step => step.value === currentStep);
      console.log("Aktuální krok:", currentStep, "index:", currentIndex);
      if (currentIndex >= 0 && currentIndex < steps.length - 1) {
        // Nastavit další krok
        const nextStep = steps[currentIndex + 1].value;
        console.log("Přecházím na další krok:", nextStep);
        setCurrentStep(nextStep);
      } else {
        console.log("Nelze přejít na další krok - již jsme na posledním kroku nebo krok nebyl nalezen");
      }
    };

    // Funkce pro přechod na předchozí krok
    const goToPrevStep = () => {
      const currentIndex = steps.findIndex(step => step.value === currentStep);
      console.log("Aktuální krok:", currentStep, "index:", currentIndex);
      if (currentIndex > 0) {
        // Nastavit předchozí krok
        const prevStep = steps[currentIndex - 1].value;
        console.log("Přecházím na předchozí krok:", prevStep);
        setCurrentStep(prevStep);
      } else {
        console.log("Nelze přejít na předchozí krok - již jsme na prvním kroku");
      }
    };

    // Funkce pro přímou navigaci na konkrétní krok
    const navigateToStep = (stepValue: string) => {
      console.log("Přímá navigace na krok:", stepValue);
      if (steps.some(step => step.value === stepValue)) {
        setCurrentStep(stepValue);
      } else {
        console.error("Neplatný krok pro navigaci:", stepValue);
      }
    };

    // Pro testovací účely vytiskneme všechny dostupné kroky
    console.log("Dostupné kroky:", steps.map(step => step.value));

    // Předat správné props pro každý krok včetně dat a callback funkcí pro aktualizaci dat
    switch(currentStep) {
      case "position":
        console.log("Renderuji FirstStep komponentu s onNextStep callbackem");
        return (
          <FirstStep 
            onNextStep={goToNextStep} 
            onShowSidebar={handleShowSidebar}
            initialData={formData.position}
            onDataChange={updatePositionData}
          />
        );
      case "questionnaire":
        console.log("Renderuji ApplicationForm komponentu");
        return (
          <ApplicationForm 
            initialData={{
              questions: formData.questionnaire?.questions,
              positionName: formData.position?.title || ""
            }}
            onDataChange={updateQuestionnaireData}
            onNextStep={goToNextStep}
            onPrevStep={goToPrevStep}
          />
        );
      case "collaboration":
        console.log("Renderuji CollaborationStep komponentu");
        return (
          <CollaborationStep 
            initialData={formData.collaboration}
            onDataChange={updateCollaborationData}
            onNextStep={goToNextStep}
            onPrevStep={goToPrevStep}
          />
        );
      case "advertising":
        return (
          <AdvertiseStep
            initialData={formData.advertising}
            onDataChange={updateAdvertisingData}
          />
        );
      default:
        // Fallback k první komponentě pokud nenajdeme odpovídající hodnotu
        console.log("Použití fallbacku pro krok:", currentStep);
        // Poslední řešení pro typescript problém - použijeme dummy goToNextStep pro props
        return <FirstStep 
          onNextStep={goToNextStep} 
          onShowSidebar={handleShowSidebar}
          initialData={formData.position}
          onDataChange={updatePositionData}
        />;
    }
  }

  return (
    <ClientOnly>
      <div className="container mt-8">
        {/* Komponenta pro načtení dat je nyní implementována jako hook useLoadSavedData */}
        
        <div className="flex gap-6">
          {/* Left column - Vertical stepper - zobrazí se pouze když showSidebar je true */}
          {showSidebar && (
            <div className="w-64 shrink-0">
              <Tabs value={currentStep} onValueChange={setCurrentStep} orientation="vertical" className="fixed">
              <div className="my-4 mx-1">
            <Button variant="ghost" asChild className="gap-2">
              <Link href="/">
                <ArrowLeft size={16} />
                Zpět na výpis
              </Link>
            </Button>
              </div>
                <TabsList className="flex flex-col h-auto w-full bg-transparent gap-2">
                  {steps.map((step, index) => (
                    <TabsTrigger
                      key={step.value}
                      value={step.value}
                      className="w-full justify-start data-[state=active]:bg-white data-[state=active]:shadow-sm border-none px-4 py-4"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-6 w-6 items-center justify-center rounded-full border-2 ${
                            currentStep === step.value
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-muted-foreground"
                          }`}
                        >
                          {index + 1}
                        </div>
                        <span className="text-sm font-medium">{step.label}</span>
                      </div>
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
          )}

          {/* Right column - Form content */}
          <div className={`flex-1 flex ${!showSidebar ? 'ml-0' : ''}`}>
            <Card className={`shadow-lg mb-8 ${currentStep === "advertising" ? "w-full" : "w-[850px]"}`}>
              {renderCurrentComponent()}
            </Card>

            {/* Summary Order component - only shown for advertising step */}
            {currentStep === "advertising" && (
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
    </ClientOnly>
  )
}

