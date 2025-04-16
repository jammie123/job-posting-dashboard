"use client"

import { useState, useMemo, useEffect, useRef, useCallback } from "react"
import { Card } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FirstStepV2 } from "./first-step"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import AdvertiseStep from "../new-position/components/advertise-step"
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
    label: "Informace o pozici",
    component: FirstStepV2,
  },
  {
    value: "advertising",
    label: "Zadat inzerci",
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
    const savedData = localStorage.getItem('jobPostingDataV2');
    if (savedData) {
      return JSON.parse(savedData);
    }
  } catch (error) {
    console.error("Chyba při načítání dat z localStorage:", error);
    localStorage.removeItem('jobPostingDataV2');
  }
  
  return null;
};

// Funkce pro bezpečné uložení dat do localStorage
const saveDataToLocalStorage = (data: JobPostingData) => {
  if (typeof window === 'undefined') {
    return;
  }
  
  try {
    localStorage.setItem('jobPostingDataV2', JSON.stringify(data));
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

export default function NewPositionV2() {
  const [currentStep, setCurrentStep] = useState("position")
  const [showSidebar, setShowSidebar] = useState(false)
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
      
      saveDataToLocalStorage(updatedData);
      
      return updatedData;
    });
  }, []);

  // Aktualizace funkce updateAdvertisingData
  const updateAdvertisingData = useCallback((data: AdvertisingData) => {
    setFormData(prev => {
      const updatedData = {
        ...prev,
        advertising: {
          ...prev.advertising,
          ...data
        }
      };
      
      saveDataToLocalStorage(updatedData);
      
      return updatedData;
    });
  }, []);

  // Memoizovaný objekt s callback funkcemi pro aktualizaci dat
  const updateCallbacks = useMemo(() => ({
    position: updatePositionData,
    questionnaire: updateQuestionnaireData,
    collaboration: updateCollaborationData,
    advertising: updateAdvertisingData
  }), [updatePositionData, updateQuestionnaireData, updateCollaborationData, updateAdvertisingData]);

  // Funkce pro ukončení a finalizaci procesu
  const handleFinish = () => {
    // Zde by byla logika pro finalizaci a odeslání dat na server
    toast.success("Data byla úspěšně uložena!");
    // Přesměrování po dokončení
    setTimeout(() => {
      router.push("/job-postings");
    }, 1500);
  };

  const handleShowSidebar = () => {
    setShowSidebar(true);
  };

  const renderCurrentComponent = () => {
    // Funkce pro přejití na další krok
    const goToNextStep = () => {
      const currentIndex = steps.findIndex(step => step.value === currentStep);
      if (currentIndex < steps.length - 1) {
        const nextStep = steps[currentIndex + 1].value;
        setCurrentStep(nextStep);
      } else {
        // Jsme na posledním kroku - dokončení
        handleFinish();
      }
    };

    // Funkce pro návrat na předchozí krok
    const goToPrevStep = () => {
      const currentIndex = steps.findIndex(step => step.value === currentStep);
      if (currentIndex > 0) {
        const prevStep = steps[currentIndex - 1].value;
        setCurrentStep(prevStep);
      }
    };

    // Funkce pro přímou navigaci na konkrétní krok
    const navigateToStep = (stepValue: string) => {
      setCurrentStep(stepValue);
    };

    // Najdeme aktuální krok a jeho komponentu
    const currentStepInfo = steps.find(step => step.value === currentStep);
    
    if (!currentStepInfo) {
      return <div>Krok nenalezen</div>;
    }

    const ComponentToRender = currentStepInfo.component;
    
    // Vrátíme příslušnou komponentu s předáním potřebných props
    let callbackName = currentStep as keyof typeof updateCallbacks;
    switch(currentStep) {
      case "position":
        return (
          <ComponentToRender 
            onNextStep={goToNextStep}
            initialData={formData.position}
            onDataChange={updateCallbacks.position}
            onShowSidebar={handleShowSidebar}
          />
        );
      case "advertising":
        return (
          <ComponentToRender 
            onNextStep={goToNextStep}
            onPrevStep={goToPrevStep}
            initialData={formData.advertising}
            onDataChange={updateCallbacks.advertising}
          />
        );
      default:
        return <div>Nepodporovaný krok</div>;
    }
  };

  // Vytvoříme procentuální status dokončení kroků
  const completionPercentage = useMemo(() => {
    const totalSteps = steps.length;
    const currentIndex = steps.findIndex(step => step.value === currentStep);
    
    // Výpočet procent (například první krok = 0%, poslední krok = 100%)
    return Math.round((currentIndex / (totalSteps - 1)) * 100);
  }, [currentStep]);

  return (
    <ClientOnly>
      <div className="container mx-auto py-6 min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <Button asChild variant="ghost" className="flex items-center gap-2">
            <Link href="/job-postings">
              <ArrowLeft className="h-4 w-4" />
              Zpět na přehled náborů
            </Link>
          </Button>
          
          <div className="text-sm text-muted-foreground">
            <span className="font-medium">{steps.find(s => s.value === currentStep)?.label}</span>
            <span> • Krok {steps.findIndex(s => s.value === currentStep) + 1} z {steps.length}</span>
          </div>
        </div>

        <div className="flex space-x-8">
          {/* Hlavní obsah */}
          <div className="flex-1">
            <Card className="overflow-hidden">
              {/* TabsList pro navigaci mezi kroky */}
              <div className="border-b px-6 py-3">
                <Tabs value={currentStep} className="w-full">
                  <TabsList className="w-full justify-start">
                    {steps.map((step, index) => (
                      <TabsTrigger
                        key={step.value}
                        value={step.value}
                        onClick={() => setCurrentStep(step.value)}
                        disabled={!formData.position.title}
                        className="flex-1"
                      >
                        <span className="flex items-center gap-2">
                          <span className="flex items-center justify-center h-6 w-6 rounded-full bg-primary/10 text-primary text-xs">
                            {index + 1}
                          </span>
                          {step.label}
                        </span>
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              </div>

              {/* Obsah aktuálního kroku */}
              <div>
                {renderCurrentComponent()}
              </div>
            </Card>
          </div>

          {/* Pravý sidebar s přehledem */}
          {showSidebar && (
            <div className="w-1/4 min-w-[260px]">
              <SummaryOrder
                title={formData.position.title || "Název pozice"}
                data={formData}
                completion={completionPercentage}
              />
            </div>
          )}
        </div>
      </div>
    </ClientOnly>
  )
} 