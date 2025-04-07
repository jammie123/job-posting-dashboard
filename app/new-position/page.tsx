"use client"

import { useState, useMemo } from "react"
import { Card } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FirstStep } from "./first-step"
import { ApplicationForm } from "./components/application-form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CollaborationStep } from "./components/collaboration-step"
import { AdvertiseStep } from "./components/advertise-step"
import { SummaryOrder } from "@/components/summary-order"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { AdditionalInfoStep } from "./components/additional-info-step"

const steps = [
  {
    value: "position",
    label: "Údaje o pozici",
    component: FirstStep,
  },
  {
    value: "additional-info",
    label: "Doplňující informace",
    component: AdditionalInfoStep,
  },
  {
    value: "questionnaire",
    label: "Dotazník pro uchazeče",
    component: ApplicationForm,
  },
  {
    value: "collaboration",
    label: "Kolaborace s kolegy",
    component: CollaborationStep,
  },
  {
    value: "advertising",
    label: "Inzerce a místa vystavení",
    component: AdvertiseStep,
  },
]

export default function NewPosition() {
  const [currentStep, setCurrentStep] = useState("position")

  // State for selected platforms and settings
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])
  const [platformSettings, setPlatformSettings] = useState({
    jobsSettings: {
      presentationDuration: "30 dní",
      autoUpdate: "každý 7.den",
      jobsTip: false,
      medallion: true,
    },
    careerSettings: {
      presentationDuration: "30 dní",
    },
  })

  // Calculate summary data based on selections
  const summaryData = useMemo(() => {
    const data = []
    let totalCredits = 0

    if (selectedPlatforms.includes("Jobs.cz")) {
      const jobsCredits = 3
      const updateCredits = platformSettings.jobsSettings.autoUpdate ? 9 : 0
      data.push({
        name: "Jobs.cz",
        presentationDuration: platformSettings.jobsSettings.presentationDuration,
        autoUpdate: platformSettings.jobsSettings.autoUpdate,
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
        presentationDuration: platformSettings.careerSettings.presentationDuration,
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

    if (selectedPlatforms.includes("Profesia.sk")) {
      data.push({
        name: "Profesia.sk",
        presentationDuration: "30 dní",
        price: "21 kreditů",
      })
      totalCredits += 21
    }

    if (selectedPlatforms.includes("Bestjobs.eu")) {
      data.push({
        name: "Bestjobs.eu",
        presentationDuration: "30 dní",
        price: "21 kreditů",
      })
      totalCredits += 21
    }

    if (selectedPlatforms.includes("Robota.ua")) {
      data.push({
        name: "Robota.ua",
        presentationDuration: "30 dní",
        price: "21 kreditů",
      })
      totalCredits += 21
    }

    return { data, totalCredits }
  }, [selectedPlatforms, platformSettings])

  // Handle submit for the summary order
  const handleSubmit = () => {
    console.log("Submitting selected platforms:", selectedPlatforms)
    console.log("With settings:", platformSettings)
    // Move to next step or complete the process
    // For example, you could save the data and move to a confirmation page
  }

  // Render the appropriate component based on the current step
  const renderCurrentComponent = () => {
    if (currentStep === "advertising") {
      return (
        <AdvertiseStep
          onSelectPlatforms={setSelectedPlatforms}
          onUpdateSettings={setPlatformSettings}
          selectedPlatforms={selectedPlatforms}
        />
      )
    }

    // Funkce pro přechod na další krok
    const goToNextStep = () => {
      const currentIndex = steps.findIndex(step => step.value === currentStep);
      if (currentIndex >= 0 && currentIndex < steps.length - 1) {
        // Nastavit další krok
        setCurrentStep(steps[currentIndex + 1].value);
      }
    };

    // Funkce pro přechod na předchozí krok
    const goToPrevStep = () => {
      const currentIndex = steps.findIndex(step => step.value === currentStep);
      if (currentIndex > 0) {
        // Nastavit předchozí krok
        setCurrentStep(steps[currentIndex - 1].value);
      }
    };

    // Předat správné props pro každý krok
    switch(currentStep) {
      case "position":
        return <FirstStep onNextStep={goToNextStep} />;
      case "additional-info":
        return <AdditionalInfoStep onNextStep={goToNextStep} onPrevStep={goToPrevStep} />;
      case "questionnaire":
        return <ApplicationForm />;
      case "collaboration":
        return <CollaborationStep />;
      default:
        // Fallback k první komponentě, pokud nenajdeme odpovídající hodnotu
        const CurrentStepComponent = steps.find((step) => step.value === currentStep)?.component || FirstStep;
        return <CurrentStepComponent />;
    }
  }

  return (
    <div className="container mt-8">

      <div className="flex gap-6">
        {/* Left column - Vertical stepper */}
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

        {/* Right column - Form content */}
        <div className="flex-1 flex">
          <Card className={`p-6 ${currentStep === "advertising" ? "w-full" : "w-[850px]"}`}>
            <div className="flex justify-between items-center mb-6 relative">
              <h2 className="text-xl font-semibold">{steps.find((step) => step.value === currentStep)?.label}</h2>
              {currentStep === "questionnaire" && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Šablona dotazníku:</span>
                  <Select defaultValue="default">
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Vyberte šablonu" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Výchozí šablona</SelectItem>
                      <SelectItem value="it">IT pozice</SelectItem>
                      <SelectItem value="sales">Obchodní pozice</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="hr">HR pozice</SelectItem>
                      <SelectItem value="custom">Vlastní šablona</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
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
  )
}

